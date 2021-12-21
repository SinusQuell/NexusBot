var spawningRemote = require('spawning.remote');

//Scouting Logic
var scouting = {
    GetConnectedRooms: function(colony) { // Clockwise Order: TOP(1), RIGHT(3), BOTTOM(5), LEFT(7)
        var rooms = Game.map.describeExits(colony); 
        var sorted = [rooms['1'], rooms['3'], rooms['5'], rooms['7']];
        return sorted;
    },
    // GetRoomNameInDirection: function(startRoom, direction) {
    //     var connectedRooms = this.GetConnectedRooms(startRoom);
    //     var targetRoom;
    //     switch (direction) {
    //         case 'top':
    //             targetRoom = connectedRooms[0];
    //             break;
    //         case 'right':
    //             targetRoom = connectedRooms[1];
    //             break;
    //         case 'bottom':
    //             targetRoom = connectedRooms[2];
    //             break;
    //         case 'left':
    //             targetRoom = connectedRooms[3];
    //             break;
                    
    //         default:
    //             break;
    //     }
    // },

    /**
     * @param {*} quality 0=best, n=worst
     */
    FindRemoteMine: function(colony, quality) {  
        if (this.DidScoutForRemotes(colony) === false) return false; //only if all have been scouted
        var sortedRooms = this.SortRemotesByScore(colony);
        console.log(sortedRooms.length);
        if (quality > sortedRooms.length-1) return false; //check if there are enough remotes (this should never happen)
        return sortedRooms[sortedRooms.length-1-quality];
    },
    DidScoutForRemotes: function(colony, early = false) {
        var connectedRooms = this.GetConnectedRooms(colony);
        var allScored = true;
        connectedRooms.forEach(rm => {
            if (rm == undefined) return;
            if (!Memory.rooms[rm]) {
                Memory.rooms[rm] = {};
                allScored = false;
            }
            
            if (!Memory.rooms[rm]['score']) {
                allScored = false;
            }

            if (Memory.rooms[rm]['score'] == null) {
                allScored = false;
            }
        });

        if (early === true && allScored === true) {
            Memory.colonies[colony].scouting['didEarlyScouting'] = true;
            return allScored;
        }

        if (allScored === true) {
            Memory.colonies[colony].scouting['didScoutForRemotes'] = true;
        }

        return allScored;
    },
    ScoutRemoteRooms: function(colony) {
        if (Memory.colonies[colony].scouting['didScoutForRemotes'] === false) {
            var connectedRooms = scouting.GetConnectedRooms(colony);
            if (!connectedRooms || connectedRooms.length == 0) return;

            connectedRooms.forEach(rm => {
                if (!rm) return;
                if (!Memory.rooms[rm]) {
                    Memory.rooms[rm] = {};
                }

                score = Memory.rooms[rm]['score'];
                if (!score) {
                    spawningRemote.SpawnScout(utilities.FindFreeSpawn(colony), rm);
                    return;
                }
            });
        }
    },
    EarlyScouting: function(colony) {
        if (Memory.colonies[colony].scouting['didEarlyScouting'] === false) {
            var connectedRooms = scouting.GetConnectedRooms(colony);
            if (!connectedRooms || connectedRooms.length == 0) return;

            connectedRooms.forEach(rm => {
                if (!rm) return;
                if (!Memory.rooms[rm]) {
                    Memory.rooms[rm] = {};
                }

                var score = Memory.rooms[rm]['score'];
                var sources = Memory.rooms[rm]['sources'];
                if (!score || !sources) {
                    spawningRemote.SpawnScout(utilities.FindFreeSpawn(colony), rm);
                    return;
                }
            });
        }
    },
    
    /**
     * From first=worst to last=best
     */
    SortRemotesByScore: function(colony) {
        var connectedRooms = this.GetConnectedRooms(colony);
        
        var rmObjects = [];
        connectedRooms.forEach(rm => {
            if (rm == undefined) return;
            if (Memory.rooms[rm]['isOccupied'] == true) return; //don't return occupied rooms!

            rmObj = {room: rm, score: Memory.rooms[rm]['score']};
            rmObjects.push(rmObj);
        });
       
        var sorted = _.sortBy(rmObjects, 'score');
        sortedArray = [];
        sorted.forEach(obj => {
            sortedArray.push(obj['room']);
        });

        return sortedArray;
    },

    // === GATHER DATA ===
    IsRoomOccupied: function(rm) {
        if (!Game.rooms[rm]) return; //check for vision
        if (!Memory.rooms[rm]) Memory.rooms[rm] = {}; //create Memory Object if it doesn't exist yet

        ctrl = Game.rooms[rm].controller;
        
        if (ctrl.level > 0 || (ctrl.reservation && ctrl.reservation.ticksToEnd > 0)) {
            //room is claimed or reserved!
            Memory.rooms[rm]['isOccupied'] = true;
            return true;
        }
        Memory.rooms[rm]['isOccupied'] = false;
    },
    CheckSourceAmount: function(rm) {
        //Set flag if there are 2 sources in the room and save source data in memory
        if (!Game.rooms[rm]) return; //check for vision
        if (!Memory.rooms[rm]) Memory.rooms[rm] = {}; //create Memory Object if it doesn't exist yet

        var sources = Game.rooms[rm].find(FIND_SOURCES);
        if (sources.length > 1) {
            var twoSourceFlag = Game.rooms[rm].find(FIND_FLAGS, {
                filter: (f) => {
                    return (f.color == COLOR_YELLOW);
                }
            });
            if (twoSourceFlag.length == 0) {
                Game.rooms[rm].createFlag(25, 25, '2S_' + rm, COLOR_YELLOW, COLOR_YELLOW);
            }
        } 
        if (!Memory.rooms[rm]) Memory.rooms[rm] = {};
        Memory.rooms[rm]['sourceAmount'] = sources.length;
        Memory.rooms[rm]['sources'] = sources; 
    },
    CalculateRemoteMineScore: function(colony, rm, saveToMemory = false) {
        if (!Game.rooms[colony] || !Game.rooms[rm]) return; //check for vision
        if (!Memory.rooms[rm]) Memory.rooms[rm] = {}; //create Memory Object if it doesn't exist yet
        if (Memory.rooms[rm]['score'] && Memory.rooms[rm]['score'] != null) return; //already checked
        if (this.IsRoomOccupied() === true) {
            return 0; // Room is claimed or reserved, score = 0
        }
        
        var score = 0;
        var sources = Game.rooms[rm].find(FIND_SOURCES);
        
        var originX = Memory.colonies[colony].autobuild['originX'];
        var originY = Memory.colonies[colony].autobuild['originY'];
        var startPos = new RoomPosition(originX, originY, colony);
        
        switch (sources.length) {
            default:
                score = 0;
                break;
            case 1:
                var cost = utilities.GetDistance(startPos, sources[0].pos, true);
                score += 50 - cost;
                break;
            case 2:
                var costOne = utilities.GetDistance(startPos, sources[0].pos, true);
                var costTwo = utilities.GetDistance(startPos, sources[1].pos, true);

                var avgCost = (costOne + costTwo) / 2;
                score += 100 - avgCost; //100 BONUS score for double source
                break;
            }
            
        //Don't expand to other players rooms for now. Maybe fight for remotes later?
        var hostiles = Game.rooms[rm].find(FIND_HOSTILE_CREEPS);
        if (hostiles.length && hostiles.length > 0) {
            score = 0;
        }        

        //TODO: check for remote mines of other rooms to make sure two colonies don't mine the same remote room
        if (saveToMemory === true) {
            if (!Memory.rooms[rm]) {
                Memory.rooms[rm] = {};
            }
            Memory.rooms[rm]['score'] = score;
        }
        return score;
    }
};
module.exports = scouting;