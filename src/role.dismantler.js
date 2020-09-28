var roleDismantler = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var rallyPos = squads.GetRallyPosition(creep.memory.homeRoom, creep.memory.squad);
        var attackPos = squads.GetAttackPosition(creep.memory.homeRoom, creep.memory.squad);
        
        if (Memory.colonies[creep.memory.homeRoom].squads[creep.memory.squad].rallyComplete == false) {
            //rally hasn't been completed yet, go to rally position
            creep.memory.target = rallyPos;
        } else {
            //rally has happened go to attack position
            creep.memory.target = attackPos;   
        }
        //creep.memory.target = attackPos;
        if ((!creep.pos.inRangeTo(creep.memory.target, 2) && creep.memory.target == rallyPos) || (creep.memory.target == attackPos && creep.room.name != attackPos.roomName)) {
            //NOT IN TARGET ROOM. MOVE TO TARGET ROOM.
            creep.moveTo(creep.memory.target);
        } else {
            //IN TARGET ROOM. Dismantle.
            var attackFlag = creep.pos.findClosestByRange(FIND_FLAGS, {
                filter: (f) => {
                    return (f.color == COLOR_RED && f.secondaryColor == COLOR_YELLOW);
                }
            });
            if (attackFlag) {
                var target = attackFlag.pos.findClosestByRange(FIND_STRUCTURES);
                if (target) {
                    if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            } else {
                //no attack flags, attack closest structure
                if(creep.memory.target == attackPos) {
                var struct = creep.pos.findClosestByRange(FIND_STRUCTURES);
                    if (struct) {
                        if(creep.dismantle(struct) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(struct);
                        }
                    }
                }
            }
        }
    }
}
module.exports = roleDismantler;