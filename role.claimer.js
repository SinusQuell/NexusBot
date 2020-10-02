var roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.target) {
            var data = JSON.parse(InterShardMemory.getRemote('shard1') || "{}");
            creep.memory = data.message;
        }
        if (creep.room.name != creep.memory.target) {
            //NOT IN TARGET TOOM. MOVE TO TARGET ROOM.
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)}); 

            //Every 5 Ticks while traveling
            if (Game.time % 5 == 0) { 
                scouting.IsRoomOccupied(creep.room.name);
                scouting.CheckSourceAmount(creep.room.name);
                scouting.CalculateRemoteMineScore(creep.memory.homeRoom, creep.room.name, true);
            }
        } else {
            if(creep.pos.x*creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
                creep.travelTo(creep.room.controller);
            }
            //IN TARGET ROOM. CLAIM.
            if (creep.room.controller && creep.room.controller.my) {
                //already claimed! place construction site for spawn, then suicide.
                var site = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                });
                if (site.length == 0 || !site) {
                    creep.room.createConstructionSite(Memory.colonies[creep.memory.homeRoom].colonization['spawnX'], Memory.colonies[creep.memory.homeRoom].colonization['spawnY'], STRUCTURE_SPAWN, undefined);
                } else {
                    //room claimed and spawn placed. suicide.
                    creep.suicide();
                }
                
            } else { //no controller in target room, or not claimed yet.
                if (creep.room.controller) { //Target Room has a controller. claim it.
                    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.controller);
                    }
                } else { //Target room does not have a controller! check if it is a portal room.
                    if (Game.shard.name == creep.memory.homeShard) {
                        var portalFlag = Game.flags['Portal_' + creep.room.name];
                        if (portalFlag) { 
                            //save creep memory
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
}
module.exports = roleClaimer;