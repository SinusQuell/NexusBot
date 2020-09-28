var roleFiller = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.filling == false && creep.carry[RESOURCE_ENERGY] > 0 ) {
            creep.memory.filling = true;
        }
        if (creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.filling = false;
        }
        
        //GET ENERGY
        if(!creep.memory.filling) {
            //get dropped energy if it's close
            var dropenergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2, {
                    filter: (d) => {return (d.resourceType == RESOURCE_ENERGY && d.amount >= 50)}});
            if (dropenergy.length > 0) {

                if (creep.pickup(dropenergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(dropenergy[0])
                }
            } else {
                //from storage first
	            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.storage);
        	        }
	            } else {//from containers if no storage or it's empty
                    var containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= 50 && structure.pos.roomName == creep.room.name;
                        }
                    });
                    if (containers.length > 1) {
                        var highestEnergy = containers[0];
                        for (var i = 0; i < containers.length; i++) {
                            if (highestEnergy.store[RESOURCE_ENERGY] < containers[i].store[RESOURCE_ENERGY]) {
                                highestEnergy = containers[i];
                            }
                        }
                        if(creep.withdraw(highestEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(highestEnergy);
                        }
                    } else if (containers.length == 1) {
                        if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(containers[0]);
                        }
                    } else {
                        //nowhere to get energy. Move to spawn if no idle flag.
                        var idleFlag = creep.room.find(FIND_FLAGS, {
                            filter: (f) => {
                                return (f.color == COLOR_GREY && f.secondaryColor == COLOR_GREY);
                            }
                        });
                        if (idleFlag && idleFlag.length > 0) {
                            creep.travelTo(idleFlag[0], {range:1});
                        } else {
                            var sp = creep.room.find(FIND_MY_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_SPAWN);
                                }
                            });
                            creep.travelTo(sp[0]);
                        }
                    }
	            }
            }
        } else { //FULL, TRANSFER/FILL
            //FILL TOWERS BELOW 500 ENERGY FIRST (they only get below 500 if they are attacking or healing)
            var transTower = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < 501;
                }
            });
            if(transTower.length > 0) {
                if(creep.transfer(transTower[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(transTower[0]);
                }
            } else {
                //FILL SPAWN AND EXTENSIONS
                var transTargets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                        }
                });
                if(transTargets) {
                    if(creep.transfer(transTargets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(transTargets);
                    }
                } else {//NO SPAWN OR EXTENSION TO FILL
                    //FILL TOWERS
                    var transTower = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) && structure.energy < 801;
                        }
                    });
                    if(transTower.length > 0) {
                        if(creep.transfer(transTower[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(transTower[0]);
                        }
                    } else {
                        //SPAWN, EXTENSIONS and TOWERS are FULL. 
                        if (!creep.room.storage) {
                            //fill all containers, find the one with the least energy first.
                            var containers = creep.room.find(FIND_STRUCTURES, {
                                filter: (structure) => { 
                                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                                }
                            });
                            if (containers.length > 0) {
                                var leastEnergy = containers[0];
                                for (var i = 0; i < containers.length; i++) {
                                    if (leastEnergy.store[RESOURCE_ENERGY] > containers[i].store[RESOURCE_ENERGY]) {
                                        leastEnergy = containers[i];
                                    }
                                }
                                if(creep.transfer(leastEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(leastEnergy);
                                }
                            }
                        } else {
                            //Move to IDLE flag or spawn if there isn't one
                            var idleFlag = creep.room.find(FIND_FLAGS, {
                                filter: (f) => {
                                    return (f.color == COLOR_GREY && f.secondaryColor == COLOR_GREY);
                                }
                            });
                            if (idleFlag && idleFlag.length > 0) {
                                creep.travelTo(idleFlag[0], {range:1});
                            } else {
                                var sp = creep.room.find(FIND_MY_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_SPAWN);
                                    }
                                });
                                creep.travelTo(sp[0]);
                            }
                        }
                    }
                }
            }
        }
    }
};
module.exports = roleFiller;