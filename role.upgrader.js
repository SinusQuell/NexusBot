var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //SET STATE
        if(creep.carry.energy == 0) {
            creep.memory.upgrading = true;
	    }
	    if(creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = false;
	    }
        //GET ENERGY
        if(creep.memory.upgrading) {
            //get dropped energy
            var dropenergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 3, {
                    filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}});
            if (dropenergy.length > 0) {
                if (creep.pickup(dropenergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(dropenergy[0]);
                }
            } else {
                //from link
                var controllerLink = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
                    filter: (s) => {return s.structureType == STRUCTURE_LINK}
                });
                if (controllerLink.length > 0 && controllerLink[0].energy > 0) {
                    if(creep.withdraw(controllerLink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(controllerLink[0]);
                    }
                } else {
                    //from container
                    var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity && structure.pos.roomName == creep.room.name;
                             
                        }
                    });
                    if (containers) {
                        if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(containers);
                        }
                    } else { 
                        //nowhere to get energy.
                    }
                }
            }
	    } else {
	        //TRANSFER(UPGRADE)
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.controller);    
            } else {
                var signature = "The eyes are useless when the mind is blind.";
                if (!creep.room.controller.sign || creep.room.controller.sign.text !== signature) {
                    if (creep.signController(creep.room.controller, signature) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.controller);
                    }
                }
            }
	    }
	}
};

module.exports = roleUpgrader;