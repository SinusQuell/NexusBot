//REQUIREMENTS
var roleTowers = require('towers');
var roleLinks = require('links');
var Traveler = require('traveler');
var autospawn = require('autospawn');
var stats = require('stats');
global.utilities = require('utilities');
global.squads = require('squads');
global.autobuild = require('autobuild');
global.spawningRemote = require('spawning.remote');
global.scouting = require('scouting');
//https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API
//travelTo(creep, goal (Object with a property pos: RoomPosition) , options? (see link))

module.exports.loop = function() {
  
    //CLEAR DEAD CREEP MEMORY
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    //MANAGE TOWERS
    for(var name in Game.structures) {
        var tower = Game.structures[name];
        if(tower.structureType == STRUCTURE_TOWER) {
            roleTowers.run(tower);
        }
    }
    //MANAGE LINKS
    for(var name in Game.structures) {
        var link = Game.structures[name];
        if(link.structureType == STRUCTURE_LINK) {
            roleLinks.run(link);
        }
    }
    
    //INCREASE DESIRED RAMPART HITS
    if (Game.time % 100 == 0) {
        for (let rm in Game.rooms) {
            let ctrl = Game.rooms[rm].controller;
            if (ctrl && ctrl.my) {
                utilities.UpdateRampartMaxHits(rm); 
            }
        }
    }
    
    //CREEP SPAWNING
    autospawn.SpawnCreeps();
    
    //AUTOBUILD
    autobuild.BuildColony();
    if (Game.time % 3 == 0) autobuild.BuildFromQueue(); //max once per tick!
    
    //LAB REACTIONS
    utilities.RunLabReactions();
    
    //ASSIGN CREEP ROLES
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        try {
            if(creep.memory.role == 'worker') { //HOME CREEPS
                var roleWorker = require('role.worker');
                roleWorker.run(creep);
            } else if(creep.memory.role == 'harvester') {
                var roleHarvester = require('role.harvester');
                roleHarvester.run(creep);
            } else if(creep.memory.role == 'upgrader') {
                var roleUpgrader = require('role.upgrader');
                roleUpgrader.run(creep);
            } else if(creep.memory.role == 'filler') {
                var roleFiller = require('role.filler');
                roleFiller.run(creep);
            } else if(creep.memory.role == 'manager') {
                var roleManager = require('role.manager');
                roleManager.run(creep);
            } else if(creep.memory.role == 'scientist') {
                var roleScientist = require('role.scientist');
                roleScientist.run(creep);
            } else if(creep.memory.role == 'supplier') {
                var roleSupplier = require('role.supplier');
                roleSupplier.run(creep);
            } else if(creep.memory.role == 'extractor') {
                var roleExtractor = require('role.extractor');
                roleExtractor.run(creep);
            } else if(creep.memory.role == 'offshore') { //REMOTE CREEPS
                var roleOffshore = require('role.offshore');
                roleOffshore.run(creep);
            } else if(creep.memory.role == 'reserver') {
                var roleReserver = require('role.reserver');
                roleReserver.run(creep);
            } else if(creep.memory.role == 'pioneer') {
                var rolePioneer = require('role.pioneer');
                rolePioneer.run(creep);
            } else if(creep.memory.role == 'claimer') {
                var roleClaimer = require('role.claimer');
                roleClaimer.run(creep);
            } else if(creep.memory.role == 'carrier') {
                var roleCarrier = require('role.carrier');
                roleCarrier.run(creep);
            } else if(creep.memory.role == 'guard') { //COMBAT CREEPS
                var roleGuard = require('role.guard');
                roleGuard.run(creep);
            } else if(creep.memory.role == 'dismantler') {
                var roleDismantler = require('role.dismantler');
                roleDismantler.run(creep);
            } else if(creep.memory.role == 'healer') {
                var roleHealer = require('role.healer');
                roleHealer.run(creep);
            } else if(creep.memory.role == 'ranger') {
                var roleRanger = require('role.ranger');
                roleRanger.run(creep);
            } else if(creep.memory.role == 'scout') {
                var roleScout = require('role.scout');
                roleScout.run(creep);
            }
        } catch (e) {
            console.log(e.stack);
        }
    }
    
    //Grafana Stats
    //stats.exportStats();
}






