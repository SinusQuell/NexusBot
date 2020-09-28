let spawningCombat = {
    SpawnGuard: function(sp, t, sz) {
        var guardParts = [  [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK,HEAL],  //800
                            [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,HEAL], //1260
                            [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL], //1700
                            [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL], //2260
                            //4800, 10X RANGED_ATTACK, 10x ATTACK, 5x HEAL, 25x MOVE
                            [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL]
                         ];
        var guardCost = [800, 1260, 1700, 2260, 4800];
        if (sz > guardCost.length - 1) sz = guardCost.length - 1;
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= guardCost[sz]) {
            sp.spawnCreep(guardParts[sz], 'guar' + Game.time, { memory: {role: 'guard',  homeRoom: sp.room.name, target: t}});
        } else if (cap >= guardCost[sz-1]) {
            sp.spawnCreep(guardParts[sz-1], 'guar' + Game.time, { memory: {role: 'guard',  homeRoom: sp.room.name, target: t}});
        } else {
            sp.spawnCreep(guardParts[sz-2], 'guar' + Game.time, { memory: {role: 'guard',  homeRoom: sp.room.name, target: t}});
        }
    },
    SpawnHealer: function(sp, t, sz, squadID) {
        var healerParts =   [   [MOVE,HEAL], //TEST
                                [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], //7M 7H - COST: 2100
                                [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], //15M 15H - COST: 4500
                                //5T 25M 20H - COST: 6300
                                [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                 MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                                 HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL] 
                            ];
        var healerCost = [300, 2100, 4500, 6300];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= healerCost[sz]) {
            sp.spawnCreep(healerParts[sz], 'heal' + Game.time, { memory: {role: 'healer', homeRoom: sp.room.name, target: t, squad: squadID}}); 
        }
    },
    SpawnDismantler: function(sp, t, sz, squadID) {
        var dismantlerParts =   [   [MOVE,WORK], //TEST
                                    //2T 12M 10W - COST: 1720
                                    [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 
                                    //5T 18M 13W - COST: 2250
                                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                                     WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 
                                    //5T 25M 20W - COST: 3550
                                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                                     WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK] 
                                ];
        var dismantlerCost = [150, 1720, 2250, 3550];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= dismantlerCost[sz]) {
            sp.spawnCreep(dismantlerParts[sz], 'dism' + Game.time, { memory: {role: 'dismantler', homeRoom: sp.room.name, target: t, squad: squadID}}); 
        }
    },
    SpawnRanger: function(sp, t, sz, squadID) {
                                
        var rangerParts =   [   [MOVE,RANGED_ATTACK], //TEST
                                //5T 14M 7RA 2H - COST: 2300
                                [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL], 
                                //5T 25M 10RA 10H - COST: 5300
                                [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL] 
                            ];
        var rangerCost = [200, 2300, 5300];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= rangerCost[sz]) {
            sp.spawnCreep(rangerParts[sz], 'rang' + Game.time, { memory: {role: 'ranger', homeRoom: sp.room.name, target: t, squad: squadID}}); 
        }
    },
}
module.exports = spawningCombat;