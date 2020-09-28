var roleScout = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != creep.memory.target) {
            //IN HOME ROOM. MOVE TO TARGET ROOM.
            console.log(creep.memory.target);
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)}, {range: 10});
        } else {
            //IN TARGET ROOM!
            creep.travelTo({ pos: new RoomPosition(25,25,creep.memory.target)}, {range: 10});
            scouting.CheckSourceAmount(creep.room.name);
            scouting.CalculateRemoteMineScore(creep.memory.homeRoom, creep.room.name, true);
        }
    }
}
module.exports = roleScout;