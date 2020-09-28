//var bunkerLayout = require('bunker.layout');

let utilities = {
    CheckAlly: function(user) {
        if (!Memory.allies) Memory.allies = [];
        allies = Memory.allies;
        for (i = 0; i < allies.length; i++) { 
            if (user == allies[i]) {
                return true;
            }
        }
        return false;
    },
    UpdateColonyMemory: function(ctrl) {
        var rm = ctrl.room.name;
        if (!Memory.buildQueue) {
            Memory.buildQueue = [];
        }
        if (!Memory.colonies) {
            Memory.colonies = {};
        }
        if (!Memory.colonies[rm]) {
            Memory.colonies[rm] = {};
        }
        if (!Memory.colonies[rm].rampartMaxHits) {
            Memory.colonies[rm].rampartMaxHits = 500000;
        }
        if (!Memory.colonies[rm].remoteMines) {
            Memory.colonies[rm].remoteMines = [];
        }
        if (!Memory.colonies[rm].colonization) {
            Memory.colonies[rm].colonization = {};
        }
        if (!Memory.colonies[rm].emergencies) {
            Memory.colonies[rm].emergencies = {};
        }
        if (!Memory.colonies[rm].creepAmounts) {
            Memory.colonies[rm].creepAmounts = {};
        }
        if(!Memory.colonies[rm].kickstarting) {
            Memory.colonies[rm].kickstarting = {};
        }
        if (!Memory.colonies[rm].squads) {
            Memory.colonies[rm].squads = [{},{},{},{},{}];
        }
        if (!Memory.colonies[rm].mineralProcessing) {
            Memory.colonies[rm].mineralProcessing = [];
        }
        if (!Memory.colonies[rm].autobuild) {
            Memory.colonies[rm].autobuild = {};
            Memory.colonies[rm].autobuild['enable'] = false;
            Memory.colonies[rm].autobuild['RCL'] = 0;
            Memory.colonies[rm].autobuild['labStage'] = 0;
            Memory.colonies[rm].autobuild['rampartStage'] = 0;
        }

        if (!Memory.colonies[rm].scouting) {
            Memory.colonies[rm].scouting = {};
            Memory.colonies[rm].scouting['didScoutForRemotes'] = false;
        }
        //bunkerLayout.SaveInMemory_Circle();
    },
    FindFreeSpawn: function(rm) {
        var spwns = rm.find(FIND_MY_SPAWNS, {
            filter: (structure) => {
                return (structure.spawning == null);
            }
        });
        if (spwns.length > 0) {
            return spwns[0];
        } else {
            return false;
        }
    },
    GetSourceSpaces: function(source) {
        var fields = source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true);
        var accessibleFields = 9-_.countBy( fields , "terrain" ).wall;
        return accessibleFields;
    },
    GetRoomDroppedEnergy: function(rmName) {
        var dropenergy = Game.rooms[rmName].find(FIND_DROPPED_RESOURCES, {filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}});
        var totalDropEnergy = 0;
        for (i = 0; i < dropenergy.length; i++) {
            totalDropEnergy += dropenergy[i].amount;
        }
        return totalDropEnergy;
    },
    FindSourceNearController: function(rmName) {
        var sources = Game.rooms[rmName].find(FIND_SOURCES);
        var ct;
        for (i = 0; i < sources.length; i++) {
            controllerInRange = sources[i].pos.findInRange(FIND_STRUCTURES, 5, {filter: (s) => {return (s.structureType == STRUCTURE_CONTROLLER)}});
            if (controllerInRange.length > 0) {
                ct = controllerInRange[i];
            } 
        }
        return ct;
    },
    RequestGuard: function(rm) {
        //Set guard flag if there are hostile creeps!
        if (Game.rooms[rm]) { //check for vision
            var hostiles = Game.rooms[rm].find(FIND_HOSTILE_CREEPS, {
                filter: (c) => {
                    return ((c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) && this.CheckAlly(c.owner.username) == false);
                }
            });
            var guardFlag = Game.flags['Guard_' + rm];
            if (hostiles.length > 0) {
                if (!guardFlag) {
                    Game.rooms[rm].createFlag(hostiles[0].pos, 'Guard_' + rm, COLOR_BLUE, COLOR_BLUE);
                } else {
                   guardFlag.hostileAmount = hostiles.length;
                }
            } else {
                if (guardFlag) {
                    guardFlag.remove();
                }
            }
        } else {
            //no vison!
        }
    },
    GetGuardRequest: function(rm) {
        var remotes = Memory.colonies[rm].remoteMines;
        var target = rm;
        if (Memory.colonies[rm] && Memory.colonies[rm].remoteMines) {
            if (remotes.length > 0) {
                for (i = 0; i < remotes.length; i++) {
                    if (Game.rooms[remotes[i]['room']]) {
                        var guardFlag = Game.flags['Guard_' + remotes[i]['room']]; 
                        if (guardFlag) {
                            target = guardFlag.room.name;
                            break;
                        }
                    }
                }
            }
        }
        return target;
    },
    ShouldHarvestMineral: function(rm) {
        if (Game.rooms[rm].terminal) {
            if (_.sum(Game.rooms[rm].terminal.store) < 240000) {
                var mineral = Game.rooms[rm].controller.pos.findClosestByRange(FIND_MINERALS);
                if (mineral.mineralAmount > 0) {
                    return true; //has terminal and has space! harvest minerals.
                } else return false;
            } else return false; //terminal is almost full, don't harvest minerals.
        } else return false; //no terminal, don't harvest minerals.
    },
    GetDeadRoomEnergy: function(rm) {
        var eng = 0;
        if (Game.rooms[rm]) {
            if (Game.rooms[rm].storage && Game.rooms[rm].storage.store[RESOURCE_ENERGY] > 0) {
                eng += Game.rooms[rm].storage.store[RESOURCE_ENERGY];
            }
            if (Game.rooms[rm].terminal && Game.rooms[rm].terminal.store[RESOURCE_ENERGY] > 0) {
                eng += Game.rooms[rm].terminal.store[RESOURCE_ENERGY];
            }
        }
        return eng;
    },
    FindMostDamagedRoad: function(rm) {
        var roads = Game.rooms[rm].find(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.hits < s.hitsMax && s.hitsMax == ROAD_HITS && s.structureType == STRUCTURE_ROAD);
            }
        });
        var lowestHits = roads[0];
        var lowestHitsPercentageHits = 100;
        for (var i = 0; i < roads.length; i++) {
            var percentageHits = (roads[i].hits / roads[i].hitsMax) * 100;
            lowestHitsPercentageHits = (lowestHits.hits / lowestHits.hitsMax) * 100;
            if (lowestHitsPercentageHits > percentageHits) {
                lowestHits = roads[i];
                lowestHitsPercentageHits = percentageHits;
            }
        }
        return lowestHits; 
    },
    GetRoadPercentageBelowHits: function(rm, h = 4000) {
        var structsBelowHits = Game.rooms[rm].find(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_ROAD && s.hits < h);
            }
        });
        var structsTotal = Game.rooms[rm].find(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_ROAD);
            }
        });
        var p = structsBelowHits.length / structsTotal.length * 100;
        return p;
    },
    CleanFlags: function(rm) {
        var flags = Game.rooms[rm].find(FIND_FLAGS, {
            filter: (f) => {
                return (f.color == COLOR_CYAN && f.secondaryColor == COLOR_WHITE);
            }
        });
        flags.forEach(f => {
            f.remove();
        });
    },

    //TERRAIN METHODS
    CheckTerrainSquare: function(x1, y1, x2, y2, rm) {
        var terrain = new Room.Terrain(rm);
        var isClear = true;
        for(i = x1; i < x2; i++) {
            for (j = y1; j < y2; j++) {
                var t = terrain.get(i,j);
                if (t == 1) {
                    isClear = false;
                    break;
                }
            }
        }
        return isClear;
    },
    CheckTerrainBySpawnOrigin: function(spawnX, spawnY, rm) {
        return this.CheckTerrainSquare(spawnX-6, spawnY-2, spawnX+6, spawnY+11, rm);
    },
    CheckRoomForColonySpace: function(rm) {
        var terrain = new Room.Terrain(rm);
        var hasSpace = false;
        for(i = 7; i < 42; i++) {
            for (j = 3; j < 38; j++) {
                if (this.CheckTerrainBySpawnOrigin(i, j, rm) == true) {
                    hasSpace = true;
                    break;
                }
            }
        }
        return hasSpace
    },
    
    //LAB METHODS
    GetCenterLabs: function(rm) {
        var labFlag = Game.rooms[rm].find(FIND_FLAGS, {
            filter: (f) => {
                return (f.color == COLOR_GREY && f.secondaryColor == COLOR_WHITE);
            }
        });
        var labA = labFlag[0].pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {return s.structureType == STRUCTURE_LAB}
        });
        var labB = labFlag[1].pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {return s.structureType == STRUCTURE_LAB}
        });
        return [labA, labB];
    },
    RunLabReactions: function() {
        for (let rm in Game.rooms) {
            let ctrl = Game.rooms[rm].controller;
            if (ctrl && ctrl.my) {
                if (Memory.colonies[rm].mineralProcessing.length > 0) {
                    //Room should do lab reactions
                    var centerLabs = utilities.GetCenterLabs(rm);
                    var allLabs = Game.rooms[rm].find(FIND_STRUCTURES, {
                        filter: (s) => {return s.structureType == STRUCTURE_LAB}
                    });
                    for (i = 0; i < allLabs.length; i++) {
                        if (allLabs[i] != centerLabs[0] && allLabs[i] != centerLabs[1] && !allLabs[i].cooldown && allLabs[i].mineralAmount < allLabs[i].mineralCapacity - 100) {
                            if (centerLabs[0].mineralAmount > 50 && centerLabs[1].mineralAmount > 50) { //only do it if source labs have enough minerals
                                allLabs[i].runReaction(centerLabs[0], centerLabs[1]);
                            }
                        }
                    }
                }
            }
        }
    },
    TerminalReagentsAvailable: function(rm, amnt = 800) {
        var resA = Memory.colonies[rm].mineralProcessing[0];
        var resB = Memory.colonies[rm].mineralProcessing[1];
        var ter = Game.rooms[rm].terminal;
        if (ter.store[resA] > amnt && ter.store[resB] > amnt) {
            return true;
        }
        else return false;
    },
    GetLabsToEmpty: function(rm) {
        var centerLabs = utilities.GetCenterLabs(rm);
        var labsToEmpty = Game.rooms[rm].find(FIND_STRUCTURES, {
            filter: (s) => {return s.structureType == STRUCTURE_LAB && s != centerLabs[0] && s != centerLabs[1]}
        });
        return labsToEmpty;
    },
    GetDistance: function(startPos, endPos) {
        let ret = PathFinder.search(startPos, { pos: endPos, range: 1},
        {
            plainCost: 2,
            swampCost: 8,
            ignoreCreeps: true,
            
            roomCallback: function(roomName) {
            
                let room = Game.rooms[roomName];
                // Need vision in the rooms
                if (!room) return;
                let costs = new PathFinder.CostMatrix;
                
                room.find(FIND_STRUCTURES).forEach(function(struct) {
                if (struct.structureType === STRUCTURE_ROAD) {
                        // Favor roads over plain tiles
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my)) {
                        // Can't walk through non-walkable buildings
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });
                //treat roads that are still under construction as if they were finished
                room.find(FIND_MY_CONSTRUCTION_SITES).forEach(function(constr) {
                    if (constr.structureType == STRUCTURE_ROAD) {
                        costs.set(constr.pos.x, constr.pos.y, 1);
                    }
                });
                return costs;
            },
        });
        return ret.path.length;
    },
    CheckRouteForVision: function(startRoom, targetRoom) {
        var routeRooms = Game.map.findRoute(startRoom, targetRoom);
        for (i = 0; i < routeRooms.length; i++) {
            var hasVision = true; 
            if (!Game.rooms[routeRooms[i].room]) {
                hasVision = false;
            }
        }
        return hasVision;
    },
    UpdateRampartMaxHits: function(rm) {
        var ramps = Game.rooms[rm].find(FIND_STRUCTURES, {
            filter: (s) => {return s.structureType == STRUCTURE_RAMPART}
        });
        var leastHits = ramps[0];
        if (leastHits) {
            for (var i = 0; i < ramps.length; i++) {
                if (leastHits.hits > ramps[i].hits) {
                    leastHits = ramps[i];
                }
            }    
            var desiredHits = Memory.colonies[rm].rampartMaxHits;
            if (leastHits.hits > desiredHits - 1000 && Game.rooms[rm].storage && Game.rooms[rm].storage.store[RESOURCE_ENERGY] >= 450000) {
                Memory.colonies[rm].rampartMaxHits = desiredHits + 500000;
            }
        }
    },
    
    //CONSOLE COMMANDS
    StartColony: function(startRoom, targetRoom, spawnX, spawnY) {
        if (!Memory.colonies[startRoom].colonization['rm']) {
            Memory.colonies[startRoom].colonization['rm'] = targetRoom;
            Memory.colonies[startRoom].colonization['spawnX'] = spawnX;
            Memory.colonies[startRoom].colonization['spawnY'] = spawnY;
            Memory.colonies[targetRoom] = {};
            return '<font color="#4ef711" type="highlight">' + 'Starting Colonization in ' + targetRoom + '</font>';
        }
    },
    StopColonization: function(rm) {
        Memory.colonies[rm].colonization = {};  
    },
    KickstartColony: function(startRoom, targetRoom, amnt = 1) {
        Memory.colonies[startRoom].kickstarting['rm'] = targetRoom;
        Memory.colonies[startRoom].kickstarting['amount'] = amnt;    
        return '<font color="#4ef711" type="highlight">' + 'Kickstarting Colony ' + targetRoom + '...' + '</font>';
    },
    StopKickStarting: function(startColony) {
        Memory.colonies[startColony].kickstarting = {};
        return '<font color="#4ef711" type="highlight">' + 'Kickstart Request Removed for Colony ' + Memory.colonies[startColony].kickstarting['rm'] + '.' + '</font>';
    },
    SetLabReaction: function(rm, resTypeA, resTypeB) {
        Memory.colonies[rm].mineralProcessing[0] = resTypeA;
        Memory.colonies[rm].mineralProcessing[1] = resTypeB;
        return '<font color="#1143f7" type="highlight">' + 'Lab reaction in ' + rm + ' updated.' + '</font>';
    },
    ClearLabReaction: function(rm) {
        Memory.colonies[rm].mineralProcessing = [];  
        return '<font color="#1143f7" type="highlight">' + 'Lab reaction in ' + rm + ' cancelled.' + '</font>';
    },
    AddRemoteMine: function(colony, remote) {
        var length = Memory.colonies[colony].remoteMines.length;
        Memory.colonies[colony].remoteMines[length] = {};
        Memory.colonies[colony].remoteMines[length]['room'] = remote;
        Memory.colonies[colony].remoteMines[length]['built'] = false;
        return '<font color="#ffdd32" type="highlight">' + 'Remote mine added: </font>' + colony + '->' + remote;
    },
    RemoveRemoteMine: function(colony, remote) {
        //remove the room from the list of remotes
        var remotes = Memory.colonies[colony].remoteMines;
        _.remove(remotes, function(r) {
          return r['room'] == remote;
        });
        return '<font color="#ffdd32" type="highlight">' + 'Remote mine removed: </font>' + colony + '->' + remote;
    },
    UnclaimAndCleanseRoom: function(rm) {
        var roomCreeps = _.filter(Game.creeps, (c) => c.memory.homeRoom == rm);
        for (i = 0; i < roomCreeps.length; i++) {
            roomCreeps[i].suicide();
        }
        var structs = Game.rooms[rm].find(FIND_STRUCTURES);
        for (i = 0; i < structs.length; i++) {
            if (structs[i].structureType != STRUCTURE_STORAGE && structs[i].structureType != STRUCTURE_TERMINAL) {
                structs[i].destroy();
            }
        }
        var flgs = Game.rooms[rm].find(FIND_FLAGS);
        for (i = 0; i < flgs.length; i++) {
            flgs[i].remove();
        }
        Game.rooms[rm].controller.unclaim();
        delete Memory.colonies[rm];
    },
};
module.exports = utilities;