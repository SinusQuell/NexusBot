//Get Energy: Drop -> Storage -> Containers -> Harvest
//Work: Emergency Upgrade -> Fill Spawn/Extensions -> Build -> Repair -> Upgrade only if there are no ramparts, otherwise it will always repair them before upgrading
//TODO: Set desired rampart health in memory, so it will repair if there are no ramparts below that threshhold 
var roleWorker = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (Memory.colonies[creep.room.name]) {
            var desiredHits = Memory.colonies[creep.room.name].rampartMaxHits;
        }
        //SET STATE
        if((_.sum(creep.carry)) == 0) {
            creep.memory.harvesting = true;
	    }
	    if(creep.memory.harvesting && (_.sum(creep.carry)) == (creep.carryCapacity)) {
	        creep.memory.harvesting = false;
        }
        scouting.CalculateRemoteMineScore(creep.memory.homeRoom, creep.room.name, true);
	    if (creep.memory.target != creep.room.homeRoom && creep.room.name != creep.memory.target) {
            //CREEP IS NOT IN TARGET ROOM, GET THERE!
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)});
        } else {
    	    //HARVEST
    	    if(creep.memory.harvesting) {
    	        //get dropped energy
                var dropenergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 3, {
                        filter: (d) => {return (d.resourceType == RESOURCE_ENERGY && d.amount > 50)}});
                if (dropenergy.length > 0) {
                    if (creep.pickup(dropenergy[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(dropenergy[0]);
                    }
                } else {
                    //from storage
                    if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                        if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.storage);
                        }
                    } else {
                        //from containers    
                        var containers = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => { 
                                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= 50 && structure.pos.roomName == creep.room.name;
                            }
                        });
                        if (containers.length > 0) {
                            if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(containers[0]);
                            }
                        } else {
                            //no containers/storage or they are empty, harvest
                            var sources = creep.room.find(FIND_SOURCES);
                            if (sources[creep.memory.s].energy > 0) {
                                if(creep.harvest(sources[creep.memory.s]) == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(sources[creep.memory.s]);
                                }
                            }
                        }
                    }
                }    
            } else {
            //TRANSFER/WORK
                //upgrade controller if downgrade is imminent
                if (creep.room.controller.ticksToDowngrade < 2000 || Memory.colonies[creep.room.name].emergencies['Downgrade Imminent'] == true) { 
                    Memory.colonies[creep.room.name].emergencies['Downgrade Imminent'] = true; 
                    if (creep.room.controller.ticksToDowngrade > 9000) {
                        Memory.colonies[creep.room.name].emergencies['Downgrade Imminent'] = false;
                    }
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.controller);    
                    }
                } else { //fill spawn/extensions (only if there are no fillers)
                    var realFillers = _.sum(Game.creeps, (c) => c.memory.role == 'filler' && c.memory.homeRoom == creep.room.name);
                    if (realFillers == 0) {
                        var transTargets = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_EXTENSION ||
                                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                                }
                        });
                    } else var transTargets = null;
                    if(transTargets) {
                        if(creep.transfer(transTargets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(transTargets);
                        }
                    } else {
                        //spawn/extensions full or fillers are present and no downgrade imminent. BUILD
                        var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                        if (targets.length > 0) {
                            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(targets[0]);
                            }
                        } else {
                            //nothing to build either. REPAIR
                            //Check for ramparts below 30000 Hits (10000 ticks)
                            var ramparts = creep.room.find(FIND_MY_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < 30000;
                                }
                            });
                            if (ramparts.length == 0) { //no ramparts below 30k
                                var towers = creep.room.find(FIND_MY_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_TOWER);
                                    }
                                });
                                //TODO: only repair below a certain percentage. that percentage should not be hit until the tower is up and can do it for them.
                                //REPAIR CONTAINERS 
                                var damagedContainer = creep.room.find(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
                                    }
                                });
                                if(damagedContainer.length > 0 && towers.length == 0) {
                                    if (creep.repair(damagedContainer[0]) == ERR_NOT_IN_RANGE) {
                                        creep.travelTo(damagedContainer[0]);
                                    }
                                } else {
                                    //REPAIR ROAD
                                    var damagedRoad = creep.room.find(FIND_STRUCTURES, {
                                        filter: (structure) => {
                                            return (structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax;
                                        }
                                    });
                                    if(damagedRoad.length > 0 && towers.length == 0) {
                                        if (creep.repair(damagedRoad[0]) == ERR_NOT_IN_RANGE) {
                                            creep.travelTo(damagedRoad[0]);
                                        }
                                    } else {
                                        //REPAIR LOWEST RAMPART
                                        var ramparts = creep.room.find(FIND_MY_STRUCTURES, {
                                            filter: (structure) => {
                                                return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < desiredHits;
                                            }
                                        });
                                        if (ramparts.length > 0) {
                                            var lowestHits = ramparts[0];
                                            for (var i = 0; i < ramparts.length; i++) {
                                                if (lowestHits.hits > ramparts[i].hits) {
                                                    lowestHits = ramparts[i];
                                                }
                                            }
                                            if(lowestHits) {
                                                //repair on the way to the lowest one, too.
                                                if (creep.repair(lowestHits) == ERR_NOT_IN_RANGE) {
                                                    creep.travelTo(lowestHits);
                                                }
                                            }
                                        } else {
                                            //nothing to repair either. Upgrade!
                                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                                creep.travelTo(creep.room.controller);    
                                            }
                                        }
                                    }
                                }
                            } else { //there are ramparts below 30k! repair them, before repairing anything else or upgrading(outside of emergency, which is below 2000 ticks to downgrade)
                                //REPAIR LOWEST RAMPART
                                var ramparts = creep.room.find(FIND_MY_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < 30000;
                                    }
                                });
                                if (ramparts.length > 0) {
                                    var lowestHits = ramparts[0];
                                    for (var i = 0; i < ramparts.length; i++) {
                                        if (lowestHits.hits > ramparts[i].hits) {
                                            lowestHits = ramparts[i];
                                        }
                                    }
                                    if(lowestHits) {
                                        //repair on the way to the lowest one, too.
                                        if (creep.repair(lowestHits) == ERR_NOT_IN_RANGE) {
                                            creep.travelTo(lowestHits);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }
	}
};

module.exports = roleWorker;