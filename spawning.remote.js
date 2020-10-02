let spawningRemote = {
        ///------ REMOTE CREEP SPAWNING METHODS
    SpawnOffshore: function(sp, t, source) {
        var offshoreParts = [   [WORK,WORK,CARRY,MOVE], //300
                                [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], //550
                                [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY], //800
                                [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY] //950
                            ];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= 950) {
            sp.spawnCreep(offshoreParts[3], 'offs' + Game.time, { memory: {role: 'offshore', homeRoom: sp.room.name, target: t, s: source}});
        } else if (cap >= 800) {
            sp.spawnCreep(offshoreParts[2], 'offs' + Game.time, { memory: {role: 'offshore', homeRoom: sp.room.name, target: t, s: source}});
        } else if (cap >= 550) {
            sp.spawnCreep(offshoreParts[1], 'offs' + Game.time, { memory: {role: 'offshore', homeRoom: sp.room.name, target: t, s: source}}); 
        } else if (cap >= 300) {
            sp.spawnCreep(offshoreParts[0], 'offs' + Game.time, { memory: {role: 'offshore', homeRoom: sp.room.name, target: t, s: source}});
        }
    },
    SpawnPioneer: function(sp, t, sz, src, newShardTgt, tgtShard = Game.shard.name) {
        var pioneerParts = [    [WORK,WORK,CARRY,MOVE], //300
                                [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], //550
                                [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], //800
                                [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], //1200
                                [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] //2100
                           ];
        if (!newShardTgt) {
            newShardTgt = t;
        }
        var pioneerCost = [300, 550, 800, 1200, 1900];
        var cap = sp.room.energyCapacityAvailable
        if (cap >= pioneerCost[sz]) {
            sp.spawnCreep(pioneerParts[sz], 'pion' + Game.time, { memory: {role: 'pioneer',  homeRoom: sp.room.name, targetShard: Game.shard.name, newShardTarget: newShardTgt, target: t, s: src}});
        } else if (cap >= pioneerCost[sz-1]) {
            sp.spawnCreep(pioneerParts[sz-1], 'pion' + Game.time, { memory: {role: 'pioneer',  homeRoom: sp.room.name, targetShard: Game.shard.name, newShardTarget: newShardTgt, target: t, s: src}});
        } else {
            sp.spawnCreep(pioneerParts[sz-2], 'pion' + Game.time, { memory: {role: 'pioneer',  homeRoom: sp.room.name, targetShard: Game.shard.name, newShardTarget: newShardTgt, target: t, s: src}});
        }
    },
    SpawnCarrier: function(sp, t, sz) {
        var carrierParts = [[CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],  //750
                            [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],  //1200
                            [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],  //1650
                            [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE] //2250
                           ];  
        var carrierCost = [750, 1200, 1650, 2250];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= carrierCost[sz]) {
            sp.spawnCreep(carrierParts[sz], 'carr' + Game.time, { memory: {role: 'carrier',  homeRoom: sp.room.name, target: t}});
        } else if (cap >= carrierCost[sz-1]) {
            sp.spawnCreep(carrierParts[sz-1], 'carr' + Game.time, { memory: {role: 'carrier',  homeRoom: sp.room.name, target: t}});
        } else if (cap >= carrierCost[sz-2]) {
            sp.spawnCreep(carrierParts[sz-2], 'carr' + Game.time, { memory: {role: 'carrier',  homeRoom: sp.room.name, target: t}});
        } else {
            sp.spawnCreep(carrierParts[sz-3], 'carr' + Game.time, { memory: {role: 'carrier',  homeRoom: sp.room.name, target: t}});
        }
    },
    SpawnReserver: function(sp, t, sz) {
        var claimParts = [  [CLAIM,MOVE], //650 (RCL3)
                            [CLAIM,CLAIM,MOVE,MOVE], //1300 (RCL4)
                            [CLAIM,CLAIM,CLAIM,MOVE,MOVE,MOVE], //1950 (RCL6)
                            [CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] //5200 (RCL7+)
                         ]; 
        var claimCost = [650, 1300, 1950, 5200];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= claimCost[sz]) {
            sp.spawnCreep(claimParts[sz], 'rsrv' + Game.time, { memory: {role: 'reserver', homeRoom: sp.room.name, target: t}});
        } else if (cap >= claimCost[sz-1]) {
            sp.spawnCreep(claimParts[sz-1], 'rsrv' + Game.time, { memory: {role: 'reserver', homeRoom: sp.room.name, target: t}});
        } else {
            sp.spawnCreep(claimParts[sz-2], 'rsrv' + Game.time, { memory: {role: 'reserver', homeRoom: sp.room.name, target: t}});
        }
    },
    SpawnClaimer: function(sp, t, newShardTgt, tgtShard = Game.shard.name) {
        var claimParts = [CLAIM,MOVE]; //650
        if (!newShardTgt) {
            newShardTgt = t;
        }
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= 770) {
            sp.spawnCreep(claimParts, 'colo' + Game.time, { memory: {role: 'claimer', homeRoom: sp.room.name, homeShard: Game.shard.name, targetShard: tgtShard, target: t, newShardTarget: newShardTgt}});
        }
    },
    SpawnScout: function(sp, t) {
        var scouting = require('scouting');
        var scoutParts = [MOVE]; //50
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= 50) {
            sp.spawnCreep(scoutParts, 'scout' + Game.time, { memory: {role: 'scout', homeRoom: sp.room.name, target: t}});
        }
    },
}
module.exports = spawningRemote;