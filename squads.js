//MAXIMUM SQUAD AMOUNT PER COLONY: 5!
var spawningCombat = require('spawning.combat');
let squads = {
    // SIZE 0 IS A TEST CREEP FOR ALL OF THEM!
    //creep sizes: Healer: 1=RCL6, 2=RCL7, 3=RCL8 || Ranger: 1=RCL6, 2=RCL7+ || Dismantler: 1=RCL5, 2=RCL6, 3=RCL7+
    SpawnSquad: function(colony, freeSpawn) {
        for(i = 0; i < 5; i++) {
            if (Memory.colonies[colony].squads[i] && Memory.colonies[colony].squads[i].squadType) { //check for squad requests
                if (Memory.colonies[colony].squads[i].squadType == 'drain') {
                    var wantedHealers = Memory.colonies[colony].squads[i].healers;
                    var healerSize = Memory.colonies[colony].squads[i].healerSize;
                    
                    var realHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer' && c.memory.homeRoom == colony && c.memory.squad == i);
                    
                    if (Memory.colonies[colony].squads[i].rallyComplete == false) {
                        //spawn squad only once. for now
                        if (realHealers < wantedHealers) {
                            spawningCombat.SpawnHealer(freeSpawn, this.GetRallyPosition(colony, i), healerSize, i);
                        }
                        console.log('<font color="#c8f442" type="highlight">' + colony + ': Spawning drain Squad (ID:' + i + ')...: Healers: ' + realHealers + '/' + wantedHealers + '</font>');
                    }
                } else if (Memory.colonies[colony].squads[i].squadType == 'attack') {
                    var wantedRangers = Memory.colonies[colony].squads[i].rangers;
                    var rangerSize = Memory.colonies[colony].squads[i].rangerSize;
                    
                    var realRangers = _.sum(Game.creeps, (c) => c.memory.role == 'ranger' && c.memory.homeRoom == colony && c.memory.squad == i);
                    
                    if (Memory.colonies[colony].squads[i].rallyComplete == false) {
                        //spawn squad only once. for now
                        if (realRangers < wantedRangers) {
                            spawningCombat.SpawnRanger(freeSpawn, this.GetRallyPosition(colony, i), rangerSize, i);
                        }
                        console.log('<font color="#4262f4" type="highlight">' + colony + ': Spawning attack Squad (ID:' + i + ')...: Rangers: ' + realRangers + '/' + wantedRangers + '</font>');
                    }
                } else if (Memory.colonies[colony].squads[i].squadType == 'dismantle') {
                    var wantedDismantlers = Memory.colonies[colony].squads[i].dismantlers;
                    var dismantlerSize = Memory.colonies[colony].squads[i].dismantlerSize;
                    
                    var realDismantlers = _.sum(Game.creeps, (c) => c.memory.role == 'dismantler' && c.memory.homeRoom == colony && c.memory.squad == i);
                    
                    if (Memory.colonies[colony].squads[i].rallyComplete == false) {
                        //spawn squad only once. for now
                        if (realDismantlers < wantedDismantlers) {
                            spawningCombat.SpawnDismantler(freeSpawn, this.GetRallyPosition(colony, i), dismantlerSize, i);
                        }
                        console.log('<font color="#f4a442" type="highlight">' + colony + ': Spawning dismantle Squad (ID:' + i + ')...: Dismantlers: ' + realDismantlers + '/' + wantedDismantlers + '</font>');
                    }
                }
            }
        }
    },
    UpdateRallyStatus: function(colony) {
        for(i = 0; i < 5; i++) {
            if (Memory.colonies[colony].squads[i] && Memory.colonies[colony].squads[i].squadType) { //check for squad requests
                var rallyRoom = Memory.colonies[colony].squads[i].rallyRoom;
                var rallyX = Memory.colonies[colony].squads[i].rallyX;
                var rallyY = Memory.colonies[colony].squads[i].rallyY;
                var rallyPos = new RoomPosition(rallyX,rallyY,rallyRoom);
                
                if (Game.rooms[rallyRoom]) { //check for vision first
                    var squadCreeps = rallyPos.findInRange(FIND_MY_CREEPS, 2, {
                        filter: (c) => { 
                            return (c.memory.squad == i);
                        }
                    });
                }
                if (Memory.colonies[colony].squads[i].squadType == 'drain') {
                    var totalSquadCreepsWanted = Memory.colonies[colony].squads[i].healers;
                } else if (Memory.colonies[colony].squads[i].squadType == 'attack') {
                    var totalSquadCreepsWanted = Memory.colonies[colony].squads[i].rangers;
                } else if (Memory.colonies[colony].squads[i].squadType == 'dismantle') {
                    var totalSquadCreepsWanted = Memory.colonies[colony].squads[i].dismantlers;
                }
                
                if (squadCreeps && squadCreeps.length == totalSquadCreepsWanted && Memory.colonies[colony].squads[i].rallyComplete == false) {
                    //squad is complete and at the rallyposition!
                    Memory.colonies[colony].squads[i].rallyComplete = true;
                    console.log("Squad " + i + ": Rally complete! Starting...")
                }
                
                //delete squad entry if the rally has already happened and there are no creeps left
                if (Memory.colonies[colony].squads[i].rallyComplete == true && this.CheckSquadMemberAmount(colony, i) == 0) {
                    Memory.colonies[colony].squads[i] = {}; 
                    console.log("Squad " + i + " order completed, delete request...");
                }
            }
        }
    },
    CheckSquadMemberAmount: function(colony, squadID) {
        var realHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer' && c.memory.homeRoom == colony && c.memory.squad == squadID);
        var realRangers = _.sum(Game.creeps, (c) => c.memory.role == 'ranger' && c.memory.homeRoom == colony && c.memory.squad == squadID);
        var realDismantlers = _.sum(Game.creeps, (c) => c.memory.role == 'dismantler' && c.memory.homeRoom == colony && c.memory.squad == squadID);
        var squadCreeps = realHealers + realRangers + realDismantlers;
        
        return squadCreeps;
    },
    GetRallyPosition: function(colony, squadID) {
        var rallyRoom = Memory.colonies[colony].squads[squadID].rallyRoom;
        var rallyX = Memory.colonies[colony].squads[squadID].rallyX;
        var rallyY = Memory.colonies[colony].squads[squadID].rallyY;
        var rallyPos = new RoomPosition(rallyX,rallyY,rallyRoom);
        
        return rallyPos;
    },
    GetHealPosition: function(colony, squadID) {
        var healRoom = Memory.colonies[colony].squads[squadID].healRoom;
        var healX = Memory.colonies[colony].squads[squadID].healX;
        var healY = Memory.colonies[colony].squads[squadID].healY;
        var healPos = new RoomPosition(healX,healY,healRoom);
        
        return healPos;
    },
    GetAttackPosition: function(colony, squadID) {
        var attackRoom = Memory.colonies[colony].squads[squadID].attackRoom;
        var attackPos = new RoomPosition(25,25, attackRoom);
        return attackPos;
    },
    CreateDrainSquad: function(colony, rallyRoom, rallyX, rallyY, drainRoom, drainX, drainY, healOthers, squadID) {
        Memory.colonies[colony].squads[squadID].rallyRoom = rallyRoom;
        Memory.colonies[colony].squads[squadID].rallyX = rallyX;
        Memory.colonies[colony].squads[squadID].rallyY = rallyY;
        Memory.colonies[colony].squads[squadID].healRoom = drainRoom;
        Memory.colonies[colony].squads[squadID].healX = drainX;
        Memory.colonies[colony].squads[squadID].healY = drainY;
        Memory.colonies[colony].squads[squadID].rallyComplete = false;
        Memory.colonies[colony].squads[squadID].squadType = 'drain';
        Memory.colonies[colony].squads[squadID].healOthers = healOthers;
        
        var rcl = Game.rooms[colony].controller.level;
        Memory.colonies[colony].squads[squadID].healers = 2;
        if (rcl < 6) {
            Memory.colonies[colony].squads[squadID] = {};
            return "not high enough RCL for this squad type. Aborting...";
        } else if (rcl == 6) {
            Memory.colonies[colony].squads[squadID].healerSize = 1;
        } else if (rcl == 7) {
            Memory.colonies[colony].squads[squadID].healerSize = 2;
        } else if (rcl == 8) {
            Memory.colonies[colony].squads[squadID].healerSize = 3;
        }
        console.log('<font color="#c8f442" type="highlight">' + 'Drain Squad request created. Units will gather at the Rallypoint. Spawning... ID:' + squadID + '</font>');
    },
    
    CreateAttackSquad: function(colony, rallyRoom, rallyX, rallyY, attackRoom, squadID) {
        Memory.colonies[colony].squads[squadID].rallyRoom = rallyRoom;
        Memory.colonies[colony].squads[squadID].rallyX = rallyX;
        Memory.colonies[colony].squads[squadID].rallyY = rallyY;
        Memory.colonies[colony].squads[squadID].attackRoom = attackRoom;
        Memory.colonies[colony].squads[squadID].rallyComplete = false;
        Memory.colonies[colony].squads[squadID].squadType = 'attack';
        
        var rcl = Game.rooms[colony].controller.level;
        Memory.colonies[colony].squads[squadID].rangers = 2;
        if (rcl < 6) {
            Memory.colonies[colony].squads[squadID] = {};
            return "not high enough RCL for this squad type. Aborting...";
        } else if (rcl == 6) {
            Memory.colonies[colony].squads[squadID].rangerSize = 1;
        } else if (rcl >= 7) {
            Memory.colonies[colony].squads[squadID].rangerSize = 2;
        }
        console.log('<font color="#4262f4" type="highlight">' + 'Attack Squad request created. Units will gather at the Rallypoint. Spawning... ID:' + squadID + '</font>');
    },
    CreateDismantleSquad: function(colony, rallyRoom, rallyX, rallyY, attackRoom, squadID, amount = 2) {
        Memory.colonies[colony].squads[squadID].rallyRoom = rallyRoom;
        Memory.colonies[colony].squads[squadID].rallyX = rallyX;
        Memory.colonies[colony].squads[squadID].rallyY = rallyY;
        Memory.colonies[colony].squads[squadID].attackRoom = attackRoom;
        Memory.colonies[colony].squads[squadID].rallyComplete = false;
        Memory.colonies[colony].squads[squadID].squadType = 'dismantle';
        
        var rcl = Game.rooms[colony].controller.level;
        Memory.colonies[colony].squads[squadID].dismantlers = amount;
        if (rcl < 5) {
            Memory.colonies[colony].squads[squadID] = {};
            return "not high enough RCL for this squad type. Aborting...";
        } else if (rcl == 5) {
            Memory.colonies[colony].squads[squadID].dismantlerSize = 1;
        } else if (rcl == 6) {
            Memory.colonies[colony].squads[squadID].dismantlerSize = 2;
        } else if (rcl >= 7) {
            Memory.colonies[colony].squads[squadID].dismantlerSize = 3;
        }
        console.log('<font color="#f4a442" type="highlight">' + 'Dismantler Squad request created. Units will gather at the Rallypoint. Spawning... ID:' + squadID + '</font>');
    },
    StopSquad: function(colony, squadID) {
        Memory.colonies[colony].squads[squadID] = {};  
        console.log("Squad with ID:" + squadID + " stopped.");
    },
    RallySquad: function(colony, rallyX, rallyY, rallyRoom, squadID) {
        //this will re-spawn any lost creeps and rally the WHOLE squad to the new rally Position.
        Memory.colonies[colony].squads[squadID].rallyRoom = rallyRoom;
        Memory.colonies[colony].squads[squadID].rallyX = rallyX;
        Memory.colonies[colony].squads[squadID].rallyY = rallyY;
        Memory.colonies[colony].squads[squadID].rallyComplete = false;
        console.log("Rally position updated for: " + colony + " -- Respawning lost creeps...");
    },
    SetDrainPosition: function(colony, drainX, drainY, drainRoom, squadID) {
        Memory.colonies[colony].squads[squadID].healRoom = drainRoom;
        Memory.colonies[colony].squads[squadID].healX = drainX;
        Memory.colonies[colony].squads[squadID].healY = drainY;
    },
    SetAttackRoom: function(colony, attackRoom, squadID) {
        Memory.colonies[colony].squads[squadID].attackRoom = attackRoom;
    },
}
module.exports = squads;