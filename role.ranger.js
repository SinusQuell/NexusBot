var roleRanger = {
    /** @param {Creep} creep **/
    run: function(creep) {
        //ALWAYS HEAL SELF! WILL STILL DO RANGED ATTACK / MOVE
        creep.heal(creep);
        var rallyPos = squads.GetRallyPosition(creep.memory.homeRoom, creep.memory.squad);
        var attackPos = squads.GetAttackPosition(creep.memory.homeRoom, creep.memory.squad);
        
        if (Memory.colonies[creep.memory.homeRoom].squads[creep.memory.squad].rallyComplete == false) { //|| creep.hits < (creep.hitsMax - 300)
            //rally hasn't been completed yet, go to rally position
            creep.memory.target = rallyPos;
        } else {
            //rally has happened and has full health, go to attack position
            creep.memory.target = attackPos;   
        }
        if ((!creep.pos.inRangeTo(creep.memory.target, 2) && creep.memory.target == rallyPos) || (creep.memory.target == attackPos && creep.room.name != attackPos.roomName)) {
            //NOT IN TARGET ROOM. MOVE TO TARGET ROOM.
            creep.moveTo(creep.memory.target);
        } else {
            if(creep.pos.x*creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
                creep.travelTo(creep.room.controller);
            }
            //IN TARGET ROOM.
            //ATTACK THINGS THAT ARE IN RANGE
            //no military creeps in range. check for attack flags (red/red)
            var attackFlag = creep.pos.findClosestByRange(FIND_FLAGS, {
                filter: (f) => {
                    return (f.color == COLOR_RED && f.secondaryColor == COLOR_RED);
                }
            });
            if (attackFlag) {
                creep.rangedMassAttack();
                creep.moveTo(attackFlag);
            } else {
                var hostiles = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (c) => {
                        return ((c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(CLAIM) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) && utilities.CheckAlly(c.owner.username) == false);
                    }
                });
                if(hostiles) {
                    if (creep.pos.inRangeTo(hostiles,1)) {
                        creep.rangedMassAttack();
                    } else {
                        creep.rangedAttack(hostiles);
                        creep.moveTo(hostiles);
                    }
                } else {
                    //no attack flags and no hostile creeps, attack closest structure
                    var struct = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                        filter: (s) => {
                            return (s.strctureType != STRUCTURE_CONTROLLER);
                        }
                    });
                    if (struct) {
                        creep.rangedMassAttack();
                        creep.moveTo(struct);
                    } else {
                        //No Enemy Structures left, hunt down civilians
                        var civilians = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if(civilians) {
                            if (creep.pos.inRangeTo(civilians,1)) {
                                creep.rangedMassAttack();
                            } else {
                                creep.rangedAttack(civilians);
                                creep.moveTo(civilians);
                            }
                        }
                    }
                }
            }
        }
    }
}
module.exports = roleRanger;