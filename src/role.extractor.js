var roleExtractor = {
    run: function(creep) {
        if((_.sum(creep.carry)) == 0) {
            creep.memory.harvesting = true;
	    }
	    if(creep.memory.harvesting && (_.sum(creep.carry)) == (creep.carryCapacity)) {
	        creep.memory.harvesting = false;
	    }
        if (creep.room.name != creep.memory.target) {
            //CREEP IS NOT IN TARGET ROOM, GET THERE!
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)});
        } else {
            //CREEP IS IN TARGET ROOM.
            //HARVEST
            var mineral = creep.pos.findClosestByRange(FIND_MINERALS);
    	    if(creep.memory.harvesting) {
                //NOT FULL YET. HARVEST MORE.
                var extr = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_EXTRACTOR);
                        
                    }
                });
                if (mineral.mineralAmount > 0 && !extr.cooldown) {
                    if(creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(mineral, {maxRooms: 1});
                    }
                }
            } else {
                //FULL! TRANSFER!
                var containers = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity);
                        
                    }
                });
                if (containers.length > 0) {
                    if(creep.transfer(containers[0], mineral.mineralType) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(containers[0]);
                    }
                } else { 
                    //no container at mineral, or it's full. idle
                }
            }
        }
    }
}
module.exports = roleExtractor;