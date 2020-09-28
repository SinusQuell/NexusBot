//TOWERS
var roleTowers = {
    /** @param {Tower} tower **/
    run: function(tower) {
        var desiredHits = Memory.colonies[tower.room.name].rampartMaxHits;
        //ATTACK
        //TODO: PRIORITIZE ATTACKERS BASED ON PARTS
        var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var toAttack;
            for (i = 0; i < hostiles.length; i++) {
                //don't attack targets on exit tiles
                if (!(hostiles[i].pos.x*hostiles[i].pos.y === 0 || hostiles[i].pos.x === 49 || hostiles[i].pos.y === 49)) {
                    toAttack = hostiles[i]; //target aquired
                    break;
                }
            }
            if (toAttack) {
                tower.attack(toAttack);
            }
        } else {
            //HEAL MY CREEPS
            var damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                filter: (c) => {return c.hits < c.hitsMax}
            });
            if (damagedCreeps.length > 0) {
                tower.heal(damagedCreeps[0]);
            } else {
                var towers = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER);
                    }
                });
                var doFortify = false;
                var doRepair = false;
                if (towers.length > 1) {
                    if (towers[0] == tower) {
                        doFortify = true;
                    } else if (towers[1] == tower) {
                        doRepair = true;
                    }
                } else {
                    doFortify = true;
                    doRepair = true;
                }
                if (doRepair && doFortify) {
                    //REPAIR AND FORTIFY
                    var damagedRoad = tower.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_ROAD || 
                                    structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
                        }
                    });
                    if(damagedRoad.length > 0) {
                        if(tower.energy > 500) {
                            tower.repair(damagedRoad[0]);
                        }
                    } else {
                        
                        var rampartsOneHit = tower.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < 300;
                            }
                        });
                        
                        if ((tower.energy > 700 && tower.room.storage && tower.room.storage.store[RESOURCE_ENERGY] > 300000) || rampartsOneHit.length > 0) {
                            //REPAIR LOWEST RAMPART
                            var ramparts = tower.room.find(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < desiredHits;
                                }
                            });
                            if (ramparts.length > 0) {
                                var lowestHits = ramparts[0];
                                for (var i = 0; i < ramparts.length; i++) {
                                    if (lowestHits.hits > ramparts[i].hits) {
                                        lowestHits = ramparts[i];
                                    }
                                }
                                if(lowestHits) {
                                    tower.repair(lowestHits);
                                }
                            } 
                        }
                    }
                } else if (doFortify && !doRepair) {
                    //ONLY FORTIFY
                    var rampartsOneHit = tower.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < 300;
                        }
                    });
                    if ((tower.energy > 500 && tower.room.storage && tower.room.storage.store[RESOURCE_ENERGY] > 300000) || rampartsOneHit.length > 0) {
                        //REPAIR LOWEST RAMPART
                        var ramparts = tower.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < desiredHits;
                            }
                        });
                        if (ramparts.length > 0) {
                            var lowestHits = ramparts[0];
                            for (var i = 0; i < ramparts.length; i++) {
                                if (lowestHits.hits > ramparts[i].hits) {
                                    lowestHits = ramparts[i];
                                }
                            }
                            if(lowestHits) {
                                tower.repair(lowestHits);
                            }
                        } 
                    }
                } else if (!doFortify && doRepair) {
                    //ONLY REPAIR
                    var damagedRoad = tower.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_ROAD || 
                                    structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
                        }
                    });
                    if(damagedRoad.length > 0) {
                        if(tower.energy > 500) {
                            tower.repair(damagedRoad[0]);
                        }
                    }
                }
            }
        }
    }
};
module.exports = roleTowers;