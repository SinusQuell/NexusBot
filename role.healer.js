var roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        //SET TARGET POSITION
        var rallyPos = squads.GetRallyPosition(creep.memory.homeRoom, creep.memory.squad);
        var healPos = squads.GetHealPosition(creep.memory.homeRoom, creep.memory.squad);
        
        if (Memory.colonies[creep.memory.homeRoom].squads[creep.memory.squad].rallyComplete == false) {
            creep.memory.target = rallyPos;
        } else {
            creep.memory.target = healPos;   
        }
        if (creep.room.name != creep.memory.target.roomName) {
            //IN HOME ROOM. MOVE TO TARGET ROOM.
            creep.moveTo(creep.memory.target);
        } else {
            //creep.moveTo(creep.memory.target);
            //IN TARGET ROOM. Heal.
            //find creep with lowest hits
            if(creep.pos.x*creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
                creep.travelTo(creep.room.controller);
            }

            var targets = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {return c.hits < c.hitsMax}
            });
            
            if (targets.length > 0) {
                var lowestHits = targets[0];
                for (i = 0; i < targets.length; i++) {
                    if (lowestHits.hits > targets[i].hits) {
                        lowestHits = targets[i];
                    }
                }
                //heal lowest creep
                if(lowestHits) { 
                    if (Memory.colonies[creep.memory.homeRoom].squads[creep.memory.squad].healOthers == true) { //heal others too!
                        if (!creep.pos.isNearTo(lowestHits)) {
                            creep.moveTo(lowestHits);
                        }
                        creep.heal(lowestHits);
                    } else {
                         if (creep.memory.homeRoom == lowestHits.memory.homeRoom && creep.memory.squad == lowestHits.memory.squad) { //only heal untits that belog to the drain squad!
                            if (!creep.pos.isNearTo(lowestHits)) {
                                creep.moveTo(lowestHits);
                            }
                            creep.heal(lowestHits);
                         }
                    }
                } else { 
                    //all creeps are healthy, move to heal flag or heal target if no flag.
                    var healFlag = creep.pos.findClosestByRange(FIND_FLAGS, {
                        filter: (f) => {
                            return (f.color == COLOR_RED && f.secondaryColor == COLOR_GREEN);
                        }
                    });
                    if (healFlag) {
                        creep.moveTo(healFlag);   
                    } else {
                        creep.moveTo(creep.memory.target);
                    }
                }
            } else {
                var healFlag = creep.pos.findClosestByRange(FIND_FLAGS, {
                    filter: (f) => {
                        return (f.color == COLOR_RED && f.secondaryColor == COLOR_GREEN);
                    }
                });
                if (healFlag) {
                    creep.moveTo(healFlag);   
                } else {
                    creep.moveTo(creep.memory.target);
                }
            }
            
        }
    }
}
module.exports = roleHealer;