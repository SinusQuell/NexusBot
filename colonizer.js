//to colonize a room, set Memory.colonies.STARTCOLONY.colonization to the target room name
//One room can only do once colonization at a time, or this breaks.
var spawningRemote = require('spawning.remote');
let colonizer = {
    Colonize: function(startColony, targetRoom, freeSpawn, spawnX, spawnY) {
        var wantedClaimers = 0;
        var wantedPioneers = 1; // per source in new colony
        if (!Game.rooms[targetRoom] || !!Game.rooms[targetRoom].controller || !Game.rooms[targetRoom].controller.my) { //not claimed yet, we need a claimer!
            wantedClaimers = 1;
        } else { //got vision in the room
            if (Game.rooms[targetRoom].controller && Game.rooms[targetRoom].controller.my) {
                //room is claimed
                wantedClaimers = 0;
                //check if spawn is finished
                var s = _.filter(Game.spawns, sp => sp.room.name == targetRoom);
                if (s && s.length > 0) {
                    //spawn is finished! delete colonization entry.
                    console.log('<font color="#4ef711" type="highlight">' + 'Colonization completed in: ' + targetRoom + '!</font>');
                    wantedPioneers = 0;
                    Memory.colonies[startColony].colonization = {}; // clear colonization order in memory
                    autobuild.SetAutoBuild(targetRoom, true, spawnX, spawnY); //enable autobuild in the new colony
                }
            }
        }
        
        var pioneerSize = 4;
        
        var realClaimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer' && c.memory.target == targetRoom);
        var realPioneersS0 = _.sum(Game.creeps, (c) => c.memory.role == 'pioneer' && c.memory.target == targetRoom && c.memory.s == 0);
        var realPioneersS1 = _.sum(Game.creeps, (c) => c.memory.role == 'pioneer' && c.memory.target == targetRoom && c.memory.s == 1);
        
        if (freeSpawn) {
            if (realClaimers < wantedClaimers) {
                spawningRemote.SpawnClaimer(freeSpawn, targetRoom);
            } else if (realPioneersS0 < wantedPioneers) {
                spawningRemote.SpawnPioneer(freeSpawn, targetRoom, pioneerSize, 0);
            } else if (realPioneersS1 < wantedPioneers) {
                spawningRemote.SpawnPioneer(freeSpawn, targetRoom, pioneerSize, 1);
            }
        }
        var totalPioneers = realPioneersS0 + realPioneersS1;
        console.log('<font color="#4ef711" type="highlight">' + 'Colonization: ' + 
        startColony + '->' + targetRoom + ' in progress: Claimers: ' + realClaimers + '/' + wantedClaimers + ' | Pioneers: ' + totalPioneers + '/' + (wantedPioneers * 2) + '</font>');
        
   },
}
module.exports = colonizer;