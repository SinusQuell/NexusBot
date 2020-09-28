//spawnId set in the creeps memory when it is spawned. 
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //in home room. work.
        if((_.sum(creep.carry)) == 0) {
            creep.memory.harvesting = true;
	    }
	    if(creep.memory.harvesting && (_.sum(creep.carry)) == (creep.carryCapacity)) {
	        creep.memory.harvesting = false;
	    }
	    //HARVEST
	    if(creep.memory.harvesting) {
            var sources = creep.room.find(FIND_SOURCES);
            if (sources[creep.memory.s].energy > 0) {
                if(creep.harvest(sources[creep.memory.s]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(sources[creep.memory.s]);
                }
            }
        } else {
        //TRANSFER
            //fill source link first
            var sources = creep.room.find(FIND_SOURCES);
            var sourceLink = sources[creep.memory.s].pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_LINK) && structure.energy < structure.energyCapacity;
                    }
                });
            if (sourceLink.length > 0) {
                if(creep.transfer(sourceLink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(sourceLink[0]);
                }
            } else {
                //then fill the container
                var containers = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
                if (containers.length > 0) {
                    if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(containers[0]);
                    }
                } else { 
                    //no containers available either, drop the energy
                    creep.drop(RESOURCE_ENERGY, creep.carry[RESOURCE_ENERGY]);
                }
            }
        }
	}
};

module.exports = roleHarvester;