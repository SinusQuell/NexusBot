var roleGuard = {
    /** @param {Creep} creep **/
    run: function(creep) {
        //ALWAYS HEAL SELF! WILL STILL DO RANGED ATTACK / MOVE
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        if (creep.room.name != creep.memory.target) {
            //IN HOME ROOM. MOVE TO TARGET ROOM.
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)});
        } else {
            if(creep.pos.x*creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
                creep.moveTo(Game.rooms[creep.memory.target].controller);
            }
            //IN TARGET ROOM. Guard.
            //ATTACK NEAREST MILITARY CREEPS FIRST
            var hostiles = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (c) => {
                    return ((c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) && utilities.CheckAlly(c.owner.username) == false);
                }
            });
            if(hostiles) {
                if(creep.pos.inRangeTo(hostiles, 3)) {
                    if (creep.pos.inRangeTo(hostiles,1)) {
                        creep.rangedMassAttack();
                        creep.attack(hostiles);
                    } else {
                        creep.rangedAttack(hostiles);
                        creep.travelTo(hostiles, {maxRooms: 1});
                    }
                } else {
                    creep.travelTo(hostiles, {maxRooms: 1});
                    creep.rangedAttack(hostiles);
                }
            } else { //THEN ATTACK CIVILIAN CREEPS
                civilian = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (c) => {
                        return (utilities.CheckAlly(c.owner.username) == false);
                    }
                });
                if (civilian) {
                    if(creep.pos.inRangeTo(civilian, 3)) {
                        if (creep.pos.inRangeTo(civilian,1)) {
                            creep.rangedMassAttack();
                            creep.attack(civilian);
                        } else {
                            creep.travelTo(hostiles, {maxRooms: 1});
                            creep.rangedAttack(civilian);
                        }
                    } else {
                        creep.travelTo(civilian, {maxRooms: 1});
                        creep.rangedAttack(civilian);
                    }
                } else { //NO ENEMY CREEPS LEFT
                    creep.memory.target = utilities.GetGuardRequest(creep.memory.homeRoom);
                    if (Game.flags["G_" + creep.room.name]) {
                        //room has flag for guard to wait at
                        if (!creep.pos.inRangeTo(Game.flags["G_" + creep.room.name].pos), 2) {
                            creep.travelTo(Game.flags["G_" + creep.room.name]);
                        }
                    } else {
                        //no wait flag, wait at controller
                        if (!creep.pos.inRangeTo(creep.room.controller), 2) {
                            creep.travelTo(creep.room.controller);
                        }
                    }
                }
            }
        }
    }
}
module.exports = roleGuard;