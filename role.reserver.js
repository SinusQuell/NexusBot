var roleReserver = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != creep.memory.target) {
            //IN HOME ROOM. MOVE TO TARGET ROOM.
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)});
        } else {
            if(creep.pos.x*creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
                creep.travelTo(creep.room.controller);
            }
            //IN TARGET ROOM. RESERVE.
            if (!creep.room.controller.owner) {
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller);
                } else {
                    var signature = "The eyes are useless when the mind is blind.";
                    if (!creep.room.controller.sign || creep.room.controller.sign.text !== signature) {
                        if (creep.signController(creep.room.controller, signature) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.controller);
                        }
                    }
                }
            } else {
                //controller has an owner! attackController?
            }
        }
    }
}
module.exports = roleReserver;