var colonizer = require('colonizer');
var spawningHome = require('spawning.home');
var spawningRemote = require('spawning.remote');
var spawningCombat = require('spawning.combat');

let autospawn = {
    SpawnCreeps: function() {
        var groupedCreeps = _.groupBy(Game.creeps, function(c) {
            return c.memory.homeRoom;
        });
        for (let rm in Game.rooms) {
            let ctrl = Game.rooms[rm].controller;
            if (ctrl && ctrl.my) {
                utilities.UpdateColonyMemory(ctrl);
                utilities.CleanFlags(rm);
                if (ctrl.level < 3) { //For RCL1/2
                    var freeSpawn = utilities.FindFreeSpawn(ctrl.room.name);
                    if (freeSpawn) {
                        //CHECK PRESENT CREEP AMOUNTS
                        var realWorkersS0 = _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'worker' && c.memory.homeRoom == ctrl.room.name && c.memory.s == 0 );
                        var realWorkersS1 = _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'worker' && c.memory.homeRoom == ctrl.room.name && c.memory.s == 1 );
                        var realWorkersS2 = _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'worker' && c.memory.homeRoom == ctrl.room.name && c.memory.s == 2 );
                        //ADJUST DESIRED CREEP AMOUNTS
                        var sources = ctrl.room.find(FIND_SOURCES);

                        var accessibleFieldsS0 = utilities.GetSourceSpaces(sources[0]);
                        var accessibleFieldsS1 = utilities.GetSourceSpaces(sources[1]);
                        var accessibleFieldsS2 = utilities.GetSourceSpaces(sources[2]);

                        if (ctrl.level == 2) {
                            var wantedWorkersS0 = accessibleFieldsS0 + 2;
                            var wantedWorkersS1 = accessibleFieldsS1 + 2;
                            var wantedWorkersS2 = accessibleFieldsS2 + 3;
                        } else {
                            var wantedWorkersS0 = accessibleFieldsS0 + 3;
                            var wantedWorkersS1 = accessibleFieldsS1 + 3;
                            var wantedWorkersS2 = accessibleFieldsS2 + 4;
                        }

                        var thirdSource = utilities.FindNearestSource(ctrl.room.name, 30);
                        if (!thirdSource) {
                            realWorkersS2 = 0;
                            wantedWorkersS2 = 0;
                        }
                        
                        var workerSize = ctrl.level;
                        
                        var totalWorkers = realWorkersS0 + realWorkersS1 + realWorkersS2;
                        var totalWantedWorkers = wantedWorkersS0 + wantedWorkersS1;
                        console.log('<font color="#ffdd32" type="highlight">' + ctrl.room.name + '</font>' + ': Workers: ' + totalWorkers + '/' + totalWantedWorkers);
                        //CHECK FOR RECOVERY MODE
                        var creepsInRoom = ctrl.room.find(FIND_MY_CREEPS, {
                            filter: (c) => { 
                                return (c.memory.homeRoom == ctrl.room.name);
                            }
                        });
                        //ACTUAL SPAWNING
                        if (creepsInRoom.length == 0) {
                            //RECOVERY SPAWNING
                            spawningHome.SpawnWorker(freeSpawn, 0, 0, ctrl.room.name);
                        } else {
                            //REGULAR SPAWNING
                            if (realWorkersS0 < wantedWorkersS0) {
                                spawningHome.SpawnWorker(freeSpawn, 0, workerSize, ctrl.room.name);
                            } else if (realWorkersS1 < wantedWorkersS1) {
                                spawningHome.SpawnWorker(freeSpawn, 1, workerSize, ctrl.room.name);
                            } else if (realWorkersS2 < wantedWorkersS2) {
                                spawningHome.SpawnWorker(freeSpawn, 2, workerSize, ctrl.room.name);
                            } else {
                                //ALL REGULAR UNITS ARE SPAWNED
                                this.DoEarlyScouting(ctrl.room.name);
                            }
                        }
                    }
                } else { //For RCL 3+
                    squads.UpdateRallyStatus(ctrl.room.name);
            	    var freeSpawn = utilities.FindFreeSpawn(ctrl.room.name);
                    if (freeSpawn) {
                        //GET INFO NEEDED TO DECIDE ON CREEP AMOUNTS/SIZES
                        var droppedEnergy = utilities.GetRoomDroppedEnergy(ctrl.room.name);
                        if (!droppedEnergy) droppedEnergy = 0;
                        if (ctrl.room.storage) {
                            var storageLink = ctrl.room.storage.pos.findInRange(FIND_STRUCTURES, 2, {
                                filter: (s) => {return s.structureType == STRUCTURE_LINK}
                            });
                        } else {
                            var storageLink = false;
                        }
                        //DESIRED CREEP AMOUNTS AND SIZES
                        var wantedSuppliers = 0;
                        var supplierSize = 1;
                        if (ctrl.level >= 3 && (!storageLink || storageLink.length == 0)) {
                            wantedSuppliers = 1;
                            if (droppedEnergy > 3000) {
                                if (!ctrl.room.storage) {
                                    wantedSuppliers += 1;
                                } else {
                                    supplierSize += 1;
                                }
                                if (droppedEnergy > 5000) {
                                    wantedSuppliers += 1;
                                    supplierSize += 1
                                }
                            }
                        }
                        var wantedExtractors = 0;
                        var extractorSize = 0;
                        if (utilities.ShouldHarvestMineral(ctrl.room.name) == true) {
                            wantedSuppliers = 1;
                            wantedExtractors = 1;
                            var mineral = ctrl.pos.findClosestByRange(FIND_MINERALS);
                            if (mineral.density == DENSITY_ULTRA) {
                                extractorSize = 1;
                            }
                        }
                        var wantedUpgraders = 1;
                        var upgraderSize = ctrl.level;
                        if (((ctrl.room.storage && ctrl.room.storage.store[RESOURCE_ENERGY] > 310000) || droppedEnergy > 3000) && ctrl.level < 6) {
                            wantedUpgraders = 2;
                        }
                        if (ctrl.room.storage && ctrl.level >= 6 && ctrl.room.storage.store[RESOURCE_ENERGY] > 355000) {
                            wantedUpgraders = 2;
                            wantedSuppliers = 1;
                            supplierSize += 1;
                        }
                        var workerSize = ctrl.level - 1;
                        if (ctrl.room.storage && ctrl.room.storage.store[RESOURCE_ENERGY] < 150000 && ctrl.level >= 6) {
                            upgraderSize -= 3;
                            workerSize -= 3;
                        } else if (ctrl.room.storage && ctrl.room.storage.store[RESOURCE_ENERGY] < 150000 && ctrl.level < 6) {
                            wantedUpgraders = 0;
                            workerSize -= 2;
                        }
                        
                        var wantedWorkersS0 = 1;
                        var wantedWorkersS1 = 0;
                        if (ctrl.room.find(FIND_MY_CONSTRUCTION_SITES).length > 2) {
                            wantedWorkersS1 = 1;
                            if (wantedUpgraders > 1) {
                                wantedUpgraders -= 1;
                            }
                        }
                        if (wantedUpgraders < 0 || (ctrl.room.storage && ctrl.room.storage.store[RESOURCE_ENERGY] < 50000)) {
                            wantedUpgraders = 0;
                        }
                        if (ctrl.level == 8) {
                            upgraderSize = 4;
                            wantedUpgraders = 1;
                        }
                        
                        if (ctrl.room.storage && ctrl.room.storage.store[RESOURCE_ENERGY] > 290000) {
                            if (ctrl.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                                wantedWorkersS1 = 1;   
                            }
                            wantedWorkersS0 = 0;
                        }
                        
                        var wantedHarvestersS0 = 1;
                        var wantedHarvestersS1 = 1;
                        
                        var wantedFillers = 2;
                        var fillerSize = 0;
                        switch(ctrl.level) {
                            default: case 0: case 1: 
                                fillerSize = 0;
                                break;
                            case 2: case 3:
                                fillerSize = 1;
                                break;
                            case 4: case 5:
                                fillerSize = 2;
                                break;
                            case 6: case 7:
                                fillerSize = 3;
                                break;
                             case 8:
                                fillerSize = 4;
                                break;
                        }
                        var wantedGuards = 0
                        if (Memory.colonies[rm].remoteMines.length > 0) {
                            wantedGuards = 1;
                        }
                        var guardSize = ctrl.level - 2;
                        
                        var managerSize = 1;
                        var wantedManagers = 0
                        if ((storageLink && storageLink.length > 0) || ctrl.room.terminal) {
                            wantedManagers = 1;
                        }
                        
                        var wantedScientists = 0;
                        if (Memory.colonies[rm].mineralProcessing.length > 0) {
                            wantedScientists = 1;
                        }
                        //GET ACTUAL CREEP AMOUNTS
                        var realWorkersS0 =     _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'worker' && c.memory.homeRoom == ctrl.room.name && c.memory.s == 0 && c.memory.target == ctrl.room.name);
                        var realWorkersS1 =     _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'worker' && c.memory.homeRoom == ctrl.room.name && c.memory.s == 1 && c.memory.target == ctrl.room.name);
                        var realFillers =       _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'filler' && c.memory.homeRoom == ctrl.room.name);
                    	var realHarvestersS0 =  _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'harvester' && c.memory.homeRoom == ctrl.room.name && c.memory.s == 0 );
                    	var realHarvestersS1 =  _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'harvester' && c.memory.homeRoom == ctrl.room.name && c.memory.s == 1 );
                    	var realUpgraders =     _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'upgrader' && c.memory.homeRoom == ctrl.room.name);
                    	var realSuppliers =     _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'supplier' && c.memory.homeRoom == ctrl.room.name);
                    	var realManagers =      _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'manager' && c.memory.homeRoom == ctrl.room.name);
                    	var realScientists =    _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'scientist' && c.memory.homeRoom == ctrl.room.name);
                    	var realGuards =        _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'guard' && c.memory.homeRoom == ctrl.room.name);
                    	var realExtractors =    _.sum(groupedCreeps[ctrl.room.name], (c) => c.memory.role == 'extractor' && c.memory.homeRoom == ctrl.room.name);
                    	
                    	//roomCreeps = _.sum([realWorkersS0, realWorkersS1, realFillers, realHarvestersS0, realHarvestersS1, realUpgraders, realManagers]);
                    	//Memory.colonies[ctrl.room.name].creepAmounts['homeCreeps'] = roomCreeps;
                    	
                    	var totalWorkers = realWorkersS0 + realWorkersS1;
                        var totalWantedWorkers = wantedWorkersS0 + wantedWorkersS1;
                        var totalHarvesters = realHarvestersS0 + realHarvestersS1;
                        var totalWantedHarvesters = wantedHarvestersS0 + wantedHarvestersS1;
                        console.log('<font color="#32ffff" type="highlight">' + ctrl.room.name + '</font>'
                	    + ': Workers: ' + totalWorkers + '/' + totalWantedWorkers + ' | '
                	    + 'Harvesters: ' + totalHarvesters + '/' + totalWantedHarvesters + ' | ' 
                	    + 'Upgraders: ' + realUpgraders + '/' + wantedUpgraders + ' | ' 
                	    + 'Fillers: ' + realFillers + '/' + wantedFillers + ' | '
                	    + 'Guard: ' + realGuards + '/' + wantedGuards + ' | '
                	    + 'Supplier: ' + realSuppliers + '/' + wantedSuppliers + ' | '
                	    + 'Extractor: ' + realExtractors + '/' + wantedExtractors + ' | '
                	    + 'Manager: ' + realManagers + '/' + wantedManagers + ' | '
                	    + 'Scientist: ' + realScientists + '/' + wantedScientists);
                	    
                	    //CHECK FOR RECOVERY MODE
                        var creepsInRoom = ctrl.room.find(FIND_MY_CREEPS, {
                            filter: (c) => { 
                                return (c.memory.homeRoom == ctrl.room.name);
                            }
                        });
                	    //ACTUAL SPAWNING
                        if (realFillers == 0 && ctrl.room.storage && ctrl.room.storage.store[RESOURCE_ENERGY] >= 1000) {
                            //RECOVERY SPAWNING!
                            spawningHome.SpawnFiller(freeSpawn, 0);
                        } else if (totalWorkers == 0 && creepsInRoom.length < 4)  {
                            spawningHome.SpawnWorker(freeSpawn, 1, 0, ctrl.room.name);
                        } else {
                            //REGULAR SPAWNING
                            if (realWorkersS0 < wantedWorkersS0) {
                                spawningHome.SpawnWorker(freeSpawn, 0, workerSize, ctrl.room.name);
                            } else if (realHarvestersS0 < wantedHarvestersS0) {
                                spawningHome.SpawnHarvester(freeSpawn, 0);
                            } else if (realFillers < wantedFillers) {
                                spawningHome.SpawnFiller(freeSpawn, fillerSize);
                            } else if (realHarvestersS1 < wantedHarvestersS1) {
                                spawningHome.SpawnHarvester(freeSpawn, 1);
                            } else if (realWorkersS1 < wantedWorkersS1) {
                                spawningHome.SpawnWorker(freeSpawn, 1, workerSize, ctrl.room.name);
                            } else if (realSuppliers < wantedSuppliers) {
                                spawningHome.SpawnSupplier(freeSpawn, supplierSize);
                            } else if (realUpgraders < wantedUpgraders) {
                                spawningHome.SpawnUpgrader(freeSpawn, upgraderSize);
                            } else if (realManagers < wantedManagers) {
                                spawningHome.SpawnManager(freeSpawn, managerSize);
                            } else if (realGuards < wantedGuards) {
                                spawningCombat.SpawnGuard(freeSpawn, ctrl.room.name, guardSize);
                            } else if (realExtractors < wantedExtractors) {
                                spawningHome.SpawnExtractor(freeSpawn, ctrl.room.name, extractorSize);
                            } else if (realScientists < wantedScientists) {
                                spawningHome.SpawnScientist(freeSpawn);
                            } else {
                                //remote creep spawning
                                this.SpawnRemoteCreeps(ctrl.room.name, freeSpawn);
                                //squad spawning
                                squads.SpawnSquad(ctrl.room.name, freeSpawn);
                                //colonization and kickstarting
                                var c = Memory.colonies[ctrl.room.name].colonization;
                                var k = Memory.colonies[ctrl.room.name].kickstarting;
                                if (c['rm']) {
                                    colonizer.Colonize(ctrl.room.name, c['rm'], freeSpawn, c['spawnX'], c['spawnY']); 
                                } 
                                if (k['rm']) {
                                    this.KickStartColony(ctrl.room.name, k['rm'], freeSpawn, k['amount']);
                                }
                                this.LookForNewRemoteMines(ctrl.room.name);
                            }
                        }
                    }
                }
            }
        }
    },

    SpawnRemoteCreeps: function(colony, freeSpawn) {
        var remoteRooms = Memory.colonies[colony].remoteMines;
        var homeCtrl = Game.rooms[colony].controller;

        var groupedCreeps = _.groupBy(Game.creeps, function(c) {
            return c.memory.homeRoom;
        });
        
        for (i = 0; i < remoteRooms.length; i++) { 
            var rm = remoteRooms[i]['room'];
            //GET DESIRED CREEP AMOUNTS AND SIZES
            var wantedReservers = 1;
            if ((Game.rooms[rm] && Game.rooms[rm].controller.reservation && Game.rooms[rm].controller.reservation.ticksToEnd > 1500) || (Game.rooms[rm] && Game.rooms[rm].controller.owner)) {
                //don't spawn reservers if the reservertion lasts more than 1500 ticks
                wantedReservers = 0;
            }
            
            var reserverSize = 0;
            if (homeCtrl.level >= 7) {
                reserverSize = 3;   
            } else if (homeCtrl.level >= 6) {
                reserverSize = 2   
            } else if (homeCtrl.level >= 4) {
                reserverSize = 1;
            } else {
                reserverSize = 0;
            }
            
            var pioneerSize = 1;
            var wantedCarriers = 1;
            var carrierSize = 2;
            var wantedOffshoreS0 = 1;
            var wantedOffshoreS1 = 0;
            
            var twoSourceFlag = Game.flags['2S_' + rm];
            if (twoSourceFlag) {
                wantedOffshoreS1 = 1;
                pioneerSize += 1; //TODO: check the amount of roads and distance in the room, and adjust this size accordingly.
                wantedCarriers += 1;
                carrierSize += 1;
                if (homeCtrl.level == 4) {
                    wantedCarriers += 1;
                }
                
            }

            if (Game.map.getRoomLinearDistance(colony, rm) > 1) { // 1500 CAPACITY carriers for rooms that are 2 rooms away.
                carrierSize += 1;
                if (homeCtrl.level < 6 || !twoSourceFlag) {
                    wantedCarriers += 1;
                }
            }
            
            if (utilities.GetDeadRoomEnergy(rm) > 0) {
                wantedCarriers += 1;
            }
            
            //PIONEERS
            var wantedPioneers = 0;
            if (Game.rooms[rm]) {
                var mostDamagedRoad = utilities.FindMostDamagedRoad(rm);
                if (mostDamagedRoad && mostDamagedRoad.hits < 2000) {
                    wantedPioneers = 1;
                }
            }
            
            //GET ACTUAL CREEP AMOUNTS
            var realOffshoreS0 = _.sum(groupedCreeps[homeCtrl.room.name], (c) => c.memory.role == 'offshore' && c.memory.target == rm && c.memory.s == 0);
            var realOffshoreS1 = _.sum(groupedCreeps[homeCtrl.room.name], (c) => c.memory.role == 'offshore' && c.memory.target == rm && c.memory.s == 1);
            var realCarriers =   _.sum(groupedCreeps[homeCtrl.room.name], (c) => c.memory.role == 'carrier' && c.memory.target == rm);
            var realReservers =  _.sum(groupedCreeps[homeCtrl.room.name], (c) => c.memory.role == 'reserver' && c.memory.target == rm);
            var realPioneers =   _.sum(groupedCreeps[homeCtrl.room.name], (c) => c.memory.role == 'pioneer' && c.memory.target == rm);
            
            //SPAWN THE CREEPS
            if (realOffshoreS0 < wantedOffshoreS0) {
                spawningRemote.SpawnOffshore(freeSpawn, rm, 0);
            } else if (realOffshoreS1 < wantedOffshoreS1) {
                spawningRemote.SpawnOffshore(freeSpawn, rm, 1);
            } else if (realCarriers < wantedCarriers) {
                spawningRemote.SpawnCarrier(freeSpawn, rm, carrierSize);
            } else if (realReservers < wantedReservers) {
                spawningRemote.SpawnReserver(freeSpawn, rm, reserverSize);
            } else if (realPioneers < wantedPioneers) {
                spawningRemote.SpawnPioneer(freeSpawn, rm, pioneerSize, 0);
            } else {
                //creeps complete!
            }
            
            var totalRealOffshores = realOffshoreS0 + realOffshoreS1;
            var totalWantedOffshores = wantedOffshoreS0 + wantedOffshoreS1;
            console.log(colony + '->' + rm 
            + ': Reserver: '+ realReservers + '/' + wantedReservers + ' | '
            + 'Pioneer: '+ realPioneers + '/' + wantedPioneers + ' | '
            + 'Offshores: '+ totalRealOffshores + '/' + totalWantedOffshores + ' | '
            + 'Carriers: '+ realCarriers + '/' + wantedCarriers
            )
        }
    },
    KickStartColony: function(startColony, targetColony, freeSpawn, amnt) {
        if (Game.rooms[targetColony] && Game.rooms[targetColony].controller.level >= 2) {
            utilities.StopKickStarting(startColony);
        }

        var wantedWorkers = amnt;
        var workerSize = 3;
        
        var realWorkersS0 = _.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.memory.homeRoom == startColony && c.memory.s == 0 && c.memory.target == targetColony );
        var realWorkersS1 = _.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.memory.homeRoom == startColony && c.memory.s == 1 && c.memory.target == targetColony );
        
        if (realWorkersS0 < wantedWorkers) {
            spawningHome.SpawnWorker(freeSpawn, 0, workerSize, targetColony);
        } else if (realWorkersS1 < wantedWorkers) {
            spawningHome.SpawnWorker(freeSpawn, 1, workerSize, targetColony);
        }
        var totalWorkers = realWorkersS0 + realWorkersS1;
        console.log('<font color="#4ef711" type="highlight">' + 'Kickstarting: ' + startColony + '->' + targetColony + ': ' + 
                    'Workers: ' + totalWorkers + '/' + (wantedWorkers * 2) + '</font>');
    },
    LookForNewRemoteMines: function(colony) {
        var remoteRooms = Memory.colonies[colony].remoteMines;
        var homeCtrl = Game.rooms[colony].controller;

        if (homeCtrl.level < 3) return; //Minimum RCL for Remotes
        if (remoteRooms.length >= 2) return; //Only add 2 Remotes automatically
        if (!(Game.time % 100 == 0)) return; //Every 100 Ticks.
        console.log('<font color="#ffdd32" type="highlight">' + 'Looking for possible Remote Mines in <b>' + colony + '</b> ... </font>');

        try { //AUTOMATIC ADDING OF NEW REMOTE MINING ROOMS
            if (remoteRooms.length == 0) { //no remotes yet! Scout them and add the first one. 

                // Skip remotes for now if low energy
                var constr = Game.rooms[colony].find(FIND_MY_CONSTRUCTION_SITES);
                var energy = utilities.GetTotalRoomEnergy(colony);

                if (constr.length && constr.length > 0 && energy < 4000) {
                    return; 
                }

                var bestRemote = scouting.FindRemoteMine(colony, 0);
                if (bestRemote === false) { //not all connected rooms scouted yet! Scout Them.
                    scouting.ScoutRemoteRooms(colony);
                } else {
                    utilities.AddRemoteMine(colony, bestRemote); //add the best scored one to be mined
                }
            } else if (remoteRooms.length == 1 && homeCtrl.level >= 4) {
                var secondBestRemote = scouting.FindRemoteMine(colony, 1);
                if (secondBestRemote !== false) {
                    utilities.AddRemoteMine(colony, secondBestRemote);
                }
            }
            //TODO: Check how many sources are being mined in a colony and potentially connect a third remote.
        } catch (error) {
            console.log(error);
        }
    },
    DoEarlyScouting: function(colony) {
        var homeCtrl = Game.rooms[colony].controller;

        //if (homeCtrl.level < 2) return; //Minimum RCL is 2
        if (!(Game.time % 100 == 0)) return; //Every 100 Ticks.
        
        scouting.EarlyScouting(colony);
        console.log('<font color="#ffdd32" type="highlight">' + 'Scouting rooms around <b>' + colony + '</b> ... </font>');
    },
};
module.exports = autospawn;