var rolePioneer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.target) {
            var data = JSON.parse(InterShardMemory.getRemote('shard1') || "{}");
            creep.memory = data.message;
        }
	    if(creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }
	    //MOVE TO TARGET ROOM
	    if (creep.room.name != creep.memory.target) {
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)});
	    } else {//ROOM REACHED, WORK
	        if (creep.room.controller) { //Target Room has a controller. do stuff.
        	    if(creep.memory.building) {
                //BUILD 
        	        var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                    if(targets.length > 0) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(targets[0], {maxRooms: 1});
                        }
                    } else {
                        //REPAIR
                        //REPAIR ROAD
                        var damagedRoad = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax;
                            }
                        });
                        if(damagedRoad) {
                            if (creep.repair(damagedRoad) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(damagedRoad, {maxRooms: 1});
                            }
                        } else {
                            var damagedContainer = creep.room.find(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
                                }
                            });
                            if(damagedContainer.length > 0) {
                                var lowestHits = damagedContainer[0];
                                for (var i = 0; i < damagedContainer.length; i++) {
                                    if (lowestHits.hits > damagedContainer[i].hits) {
                                        lowestHits = damagedContainer[i];
                                    }
                                }
                                if (creep.repair(lowestHits) == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(lowestHits, {maxRooms: 1});
                                }
                            }
                        }
                    }
        	    } else { //GET ENERGY
                    var dropenergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                            filter: (d) => {return (d.resourceType == RESOURCE_ENERGY && d.amount > creep.carryCapacity)}});
                    if (dropenergy.length > 0) {
                        if (creep.pickup(dropenergy[0]) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(dropenergy[0], {maxRooms: 1});
                        }
                    } else {
                        //from containers    
                        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => { 
                                return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0 && structure.pos.roomName == creep.room.name);
                            }
                        });
                        if (containers) {
                            if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(containers, {maxRooms: 1});
                            }
                        } else {
                            //no containers or they are empty, harvest
                            var sources = creep.room.find(FIND_SOURCES);
                            if (sources[creep.memory.s].energy > 0) {
                                if (creep.memory.s) {
                                    if(creep.harvest(sources[creep.memory.s]) == ERR_NOT_IN_RANGE) {
                                        creep.travelTo(sources[creep.memory.s], {maxRooms: 1});
                                    }
                                } else {
                                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                                        creep.travelTo(sources[0], {maxRooms: 1});
                                    }
                                }
                            }
                        }
                    }
        	    } 
	        } else { //Target room does not have a controller! check if it is a portal room.
                if (Game.shard.name == creep.memory.homeShard) {
                    var portalFlag = Game.flags['Portal_' + creep.room.name];
                    if (portalFlag) { 
                        var data = JSON.parse(InterShardMemory.getLocal() || "{}");
                        data.message = creep.memory;
                        InterShardMemory.setLocal(JSON.stringify(data));
                        creep.travelTo(portalFlag);
                    }
                } else { //creep is in another shard!
                    if (Game.shard.name == creep.memory.targetShard) { //it's the right one.
                        creep.memory.target = creep.memory.newShardTarget;
                    }
                }
            }
	    }
	}
}
module.exports = rolePioneer;