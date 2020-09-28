//MANAGER TASKS:
//keep towers, labs, terminal, nuker etc. stocked with energy (in that order)
//take minerals from terminal and manage lab reactions / fill labs with minerals
//take the energy from the storage
var roleManager = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.filling == false && _.sum(creep.carry) > 0 ) {
            creep.memory.filling = true;
        }
        if (_.sum(creep.carry) == 0) {
            creep.memory.filling = false;
        }
        
        //GET ENERGY
        if(!creep.memory.filling) {
            //EMPTY STORAGE LINK
            if (creep.room.storage) {
                var storageLink = creep.room.storage.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: (s) => {return s.structureType == STRUCTURE_LINK}
                });
            } else {
                var storageLink = false;
            }
            if (storageLink && storageLink.length > 0 && storageLink[0].energy > 0) {
                if(creep.withdraw(storageLink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(storageLink[0]);
                }
            } else {
                //FROM TERMINAL IF ABOVE 51k
                if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 51000) {
                    if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.terminal);
                    }
                } else {
                    //GET ENGERGY FROM STORAGE IF IT HAS MORE THAN 100k
                    if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                        if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.storage);
            	        }
    	            }
                }
            }
        } else { //FULL, TRANSFER/FILL
            //FILL TOWERS BELOW 500 (they only get below 500 if they have been attacking or healing)
            var towerFillThreshold = 0;
            if (creep.room.terminal) {
                towerFillThreshold = 501;
            } else {
                towerFillThreshold = 800;
            }
            var transTower = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < towerFillThreshold;
                }
            });
            if(transTower.length > 0) {
                if(creep.transfer(transTower[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(transTower[0]);
                }
            } else {
                //FILL TERMINAL IF BELOW 50k
                if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 50000) {
                    if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.terminal);
                    }
                } else {
                    //FILL LABS WITH ENERGY
                    var labs = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => {return s.structureType == STRUCTURE_LAB && s.energy < s.energyCapacity - creep.carryCapacity}
                    });
                    if (labs.length > 0) {
                        if (creep.transfer(labs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(labs[0]);
                        }
                    } else {
                        //nothing to fill, put in storage
                        if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.storeCapacity) {
                            if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(creep.room.storage);
                	        }
        	            }
                    }
                }
            }
        }

        //ALWAYS MOVE TO POSISTION FIRST
        let managerFlag = Game.flags['M_' + creep.room.name];
        if (managerFlag && managerFlag.pos != creep.pos) {
            creep.travelTo(managerFlag);
        }
    }
};
module.exports = roleManager;