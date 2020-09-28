let spawningHome = {
///------ HOME CREEP SPAWNING METHODS
    SpawnWorker: function (sp, source, sz, targetRoom) {
        var workerParts = [ [WORK,WORK,CARRY,MOVE],     //300
                            [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],   //550
                            [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],   //800
                            [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],  //1050
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]  //1700
                          ]; 
        var workerCost = [300, 550, 800, 1050, 1700];
        var cap = sp.room.energyCapacityAvailable;
        
        if (cap >= workerCost[sz]) {
            sp.spawnCreep(workerParts[sz], 'work' + Game.time, { memory: {role:'worker', homeRoom:sp.room.name, s:source, target: targetRoom}});
        } else if (cap >= workerCost[sz-1]) {
            sp.spawnCreep(workerParts[sz-1], 'work' + Game.time, { memory: {role:'worker', homeRoom:sp.room.name, s:source, target: targetRoom}});
        } else if (cap >= workerCost[sz-2]) {
            sp.spawnCreep(workerParts[sz-2], 'work' + Game.time, { memory: {role:'worker', homeRoom:sp.room.name, s:source, target: targetRoom}});
        } else {
            sp.spawnCreep(workerParts[sz-3], 'work' + Game.time, { memory: {role:'worker', homeRoom:sp.room.name, s:source, target: targetRoom}});
        } 
    },
    SpawnFiller: function (sp, sz) {
        
        var fillerParts = [ [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE], //COST: 300 CARRY: 200
                            [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE], //COST: 450 CARRY: 300
                            [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE], //COST: 750 CARRY: 500
                            [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE], //COST: 1500 CARRY: 1000
                            [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE]  //COST: 2400 CARRY: 1600
                          ]; 
        var fillerCost = [300, 450, 750, 1500, 2400];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= fillerCost[sz]) { 
            sp.spawnCreep(fillerParts[sz], 'fill' + Game.time, { memory: {role: 'filler',  homeRoom: sp.room.name}});
        } else { 
            sp.spawnCreep(fillerParts[sz-1], 'fill' + Game.time, { memory: {role: 'filler',  homeRoom: sp.room.name}});
        }
    },
    SpawnManager: function (sp, sz) {
        var managerParts =  [   [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], //600 COST, 400 CAPACITY
                                [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE] //900 COST , 800 CAPACITY (1 hauls per link)
                            ];
        var managerCost = [600, 900];                    
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= managerCost[sz]) {
            sp.spawnCreep(managerParts[sz], 'mngr' + Game.time, { memory: {role: 'manager',  homeRoom: sp.room.name}});
        }
    },
    SpawnScientist: function (sp) {
        var scientistParts =  [   [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE], //750 COST, 500 CAPACITY
                              ];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= 750) {
            sp.spawnCreep(scientistParts[0], 'scts' + Game.time, { memory: {role: 'scientist',  homeRoom: sp.room.name}});
        }
    },
    SpawnHarvester: function(sp, source) {
        var harvesterParts = [ [WORK,WORK,CARRY,MOVE], //300
                               [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], //550
                               [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE] //800
                             ];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= 800) {
            sp.spawnCreep(harvesterParts[2], 'harv' + Game.time, { memory: {role: 'harvester', homeRoom: sp.room.name, s: source}}); 
        } else if (cap >= 550) {
            sp.spawnCreep(harvesterParts[1], 'harv' + Game.time, { memory: {role: 'harvester', homeRoom: sp.room.name, s: source}}); 
        } else if (cap >= 300) {
            sp.spawnCreep(harvesterParts[0], 'harv' + Game.time, { memory: {role: 'harvester', homeRoom: sp.room.name, s: source}}); 
        }
    },
    SpawnExtractor: function(sp, t, sz) {
        var extractorParts = [  [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], //1300
                                [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE] //2300
                             ];
        var extractorCost = [1300, 2300];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= extractorCost[sz]) {
            sp.spawnCreep(extractorParts[sz], 'extr' + Game.time, { memory: {role: 'extractor', homeRoom: sp.room.name, target: t}}); 
        } else {
            sp.spawnCreep(extractorParts[sz-1], 'extr' + Game.time, { memory: {role: 'extractor', homeRoom: sp.room.name, target: t}}); 
        }
    },
    SpawnUpgrader: function(sp, sz) {
        var upgraderParts = [  [WORK,WORK,CARRY,MOVE], //300
                               [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], //550
                               [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], //800
                               [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], //1250
                               [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], //1800
                               [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE] //2300
                            ];
        var upgraderCost = [300, 550, 800, 1250, 1800, 2300];
        var cap = sp.room.energyCapacityAvailable;
         if (cap >= upgraderCost[sz]) {
            sp.spawnCreep(upgraderParts[sz], 'upgr' + Game.time, { memory: {role: 'upgrader', homeRoom: sp.room.name}}); 
        } else if (cap >= upgraderCost[sz-1]) {
            sp.spawnCreep(upgraderParts[sz-1], 'upgr' + Game.time, { memory: {role: 'upgrader', homeRoom: sp.room.name}}); 
        } else if (cap >= upgraderCost[sz-2]) {
            sp.spawnCreep(upgraderParts[sz-2], 'upgr' + Game.time, { memory: {role: 'upgrader', homeRoom: sp.room.name}}); 
        } else {
            sp.spawnCreep(upgraderParts[sz-3], 'upgr' + Game.time, { memory: {role: 'upgrader', homeRoom: sp.room.name}}); 
        }
    },
    SpawnSupplier: function(sp, sz) {
        var supplierParts = [   [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,MOVE],  //550
                                [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],  //750
                                [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],  //1200
                                [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],  //1650
                                [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE] //2250
                            ];  
        var supplierCost = [550, 750, 1200, 1650, 2250];
        var cap = sp.room.energyCapacityAvailable;
        if (cap >= supplierCost[sz]) {
            sp.spawnCreep(supplierParts[sz], 'supl' + Game.time, { memory: {role: 'supplier',  homeRoom: sp.room.name}});
        } else if (cap >= supplierCost[sz-1]) {
            sp.spawnCreep(supplierParts[sz-1], 'supl' + Game.time, { memory: {role: 'supplier',  homeRoom: sp.room.name}});
        } else if (cap >= supplierCost[sz-2]) {
            sp.spawnCreep(supplierParts[sz-2], 'supl' + Game.time, { memory: {role: 'supplier',  homeRoom: sp.room.name}});
        } else {
            sp.spawnCreep(supplierParts[sz-3], 'supl' + Game.time, { memory: {role: 'supplier',  homeRoom: sp.room.name}});
        }
    },
}
module.exports = spawningHome;