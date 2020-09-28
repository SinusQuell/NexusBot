//Offshore Miners: BUILD -> (REPAIR CONTAINERS) -> TRANSFER
var roleOffshore = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if((_.sum(creep.carry)) == 0) {
            creep.memory.harvesting = true;
	    }
	    if(creep.memory.harvesting && (_.sum(creep.carry)) == (creep.carryCapacity)) {
	        creep.memory.harvesting = false;
        }
        scouting.CalculateRemoteMineScore(creep.memory.homeRoom, creep.room.name, true);
        if (creep.room.name != creep.memory.target) {
            //CREEP IS NOT IN TARGET ROOM, GET THERE!
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)});
        } else {
            //CREEP IS IN TARGET ROOM. SET FLAGS
            scouting.CheckSourceAmount(creep.room.name);
            utilities.RequestGuard(creep.room.name);
            //HARVEST
    	    if(creep.memory.harvesting) {
                //NOT FULL YET. HARVEST MORE.
                var sources = creep.room.find(FIND_SOURCES);
                if (sources && sources[creep.memory.s] && sources[creep.memory.s].energy > 0) {
                    if(creep.harvest(sources[creep.memory.s]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(sources[creep.memory.s], {maxRooms: 1});
                    }
                }
            } else {
                //FULL! TRANSFER!
                //build first, then repair containers, then transfer
    	        var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(targets[0], {maxRooms: 1});
                    }
                } else {
                    var containers = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                        filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER);
                            
                        }
                    });
                    if (containers.length > 0) {
                        if (containers[0].hits < containers[0].hitsMax) {
                            if (creep.repair(containers[0]) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(containers[0]);
                            }
                        } else if (containers[0].store[RESOURCE_ENERGY] < containers[0].storeCapacity) {
                            if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(containers[0]);
                            }
                        } else { //container is full & repaired, drop energy
                            creep.drop(RESOURCE_ENERGY, creep.carry[RESOURCE_ENERGY]);
                        }
                    } else { 
                        //no containers in room, drop energy
                        creep.drop(RESOURCE_ENERGY, creep.carry[RESOURCE_ENERGY]);
                    }
                }
            }
        }
	}
};

module.exports = roleOffshore;