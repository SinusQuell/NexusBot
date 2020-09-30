var roleSupplier = {
    run: function(creep) {
        //RCL 3 - FILL ALL CONTAINERS WITH DROPPED ENERGY 
        //RCL 4/5 - FILL CONTROLLER CONTAINER, THEN FILL STORAGE (ALSO WITH CONTAINER ENERGY, EXCEPT CONTROLLER CONTAINER)
        if (creep.memory.filling == false && _.sum(creep.carry) > 0 ) {
            creep.memory.filling = true;
        }
        if (_.sum(creep.carry) == 0) {
            creep.memory.filling = false;
        }
        var mineral = creep.pos.findClosestByRange(FIND_MINERALS);
        //GET RESOURCES
        if(!creep.memory.filling) {
            if(!creep.room.storage) {
                //get dropped energy
                var dropenergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                        filter: (d) => {return (d.resourceType == RESOURCE_ENERGY && d.amount >= creep.carryCapacity)}});
                var highestDropEnergy = dropenergy[0];
                for (var i = 0; i < dropenergy.length; i++) {
                    if (highestDropEnergy.amount < dropenergy[i].amount) {
                        highestDropEnergy = dropenergy[i];
                    }
                }
                if (highestDropEnergy) {
                    if (creep.pickup(highestDropEnergy) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(highestDropEnergy);
                    }
                }
            } else {
                //get dropped energy
                var dropenergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                        filter: (d) => {return (d.resourceType == RESOURCE_ENERGY && d.amount >= creep.carryCapacity)}});
                var highestDropEnergy = dropenergy[0];
                for (var i = 0; i < dropenergy.length; i++) {
                    if (highestDropEnergy.amount < dropenergy[i].amount) {
                        highestDropEnergy = dropenergy[i];
                    }
                }
                
                if (highestDropEnergy) {
                    
                    if (creep.pickup(highestDropEnergy) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(highestDropEnergy);
                    }
                } else {
                    //then get container energy, except controller container
                    var containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= creep.carryCapacity && !structure.pos.inRangeTo(creep.room.controller, 3);
                        }
                    });
                    if (containers.length > 0) {
                        var highestEnergy = containers[0];
                        for (var i = 0; i < containers.length; i++) {
                            if (highestEnergy.store[RESOURCE_ENERGY] < containers[i].store[RESOURCE_ENERGY]) {
                                highestEnergy = containers[i];
                            }
                        }
                        if (highestEnergy) {
                            if(creep.withdraw(highestEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(highestEnergy);
                            } 
                        } 
                    } else {
                        //Get mineral from mineral container
                        var containers = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => { 
                                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[mineral.mineralType] > 0;
                            }
                        });
                        if (containers.length > 0) {
                            if (creep.withdraw(containers[0], mineral.mineralType) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(containers[0]);
                            }
                        } else {
                            //no valid containers! get energy from storage
                            if (creep.room.controller.level >= 5) {
                                if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.travelTo(creep.room.storage);
                        	        }
                	            }
                            }
                        }
                    }
                }
            }
        } else { //FULL, TRANSFER/FILL
            if (creep.room.terminal && creep.carry[mineral.mineralType] > 0) {
                //fill terminal with mineral
                if (creep.transfer(creep.room.terminal, mineral.mineralType) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.terminal);
                }
            } else {
                if (!creep.room.storage) { //no storage
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
                } else { //room has a storage!
                    var controllerContainer = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 3, {
                        filter: (structure) => {  
                            return (structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store)) < (structure.storeCapacity - creep.carryCapacity);
                        }
                    });
                    if (controllerContainer.length > 0) {
                        //fill controller container first
                        if(creep.transfer(controllerContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(controllerContainer[0]);
                        }
                    } else {
                        //then fill storage
                        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.storage);
                        }
                    }
                }
            }
        }
    }
}
module.exports = roleSupplier;