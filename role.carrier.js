var roleCarrier = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != creep.memory.target) {
            //NOT IN TARGET ROOM
            if(creep.carry[RESOURCE_ENERGY] == 0) {
                //NO ENERGY! GET TO TARGET ROOM
                creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)});
            } else {
                //HAS ENERGY!
                if (creep.room.name != creep.memory.homeRoom) {
                    //BUT NOT IN HOME ROOM! GET THERE.
                    creep.travelTo(Game.rooms[creep.memory.homeRoom].controller);
                } else {
                    //AND IN HOME ROOM! TRANSFER.
                    //first storage
                    if (creep.room.storage) {
                        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.storage);
                        } 
                    } else {
                        //then containers
                        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => { 
                                return (structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store)) < (structure.storeCapacity);
                            }
                        });
                        if (containers) {
                            if(creep.transfer(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(containers);
                            }
                        }
                    }
                }
            }
        } else {
            //IN TARGET ROOM! GET ENERGY.
            if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                //NOT FULL YET. GET MORE ENERGY
                //get dropped energy
                var dropenergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                        filter: (d) => {return (d.resourceType == RESOURCE_ENERGY && d.amount >= (creep.carryCapacity - _.sum(creep.carry)))}});
                var highestDropEnergy = dropenergy[0];
                for (var i = 0; i < dropenergy.length; i++) {
                    if (highestDropEnergy.amount < dropenergy[i].amount) {
                        highestDropEnergy = dropenergy[i];
                    }
                }
                if (highestDropEnergy) {
                    if (creep.pickup(highestDropEnergy) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(highestDropEnergy, {maxRooms: 1});
                    }
                } else {
                    //from storage (for dead rooms with stored energy)
                    if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                        if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.storage, {maxRooms: 1});
                        }
                    } else {
                        if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
                            if(creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(creep.room.terminal, {maxRooms: 1});
                            }
                        } else {
                            //from containers    
                            var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => { 
                                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= (creep.carryCapacity / 2);
                                }
                            });
                            if (containers) {
                                if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(containers, {maxRooms: 1});
                                }
                            } else {
                                creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)}, {range: 10});
                            }
                        }
                    }
                }
            } else {
                //FULL! GET TO HOME ROOM.
                creep.travelTo(Game.rooms[creep.memory.homeRoom].controller);
            }
        }
	}
};

module.exports = roleCarrier;