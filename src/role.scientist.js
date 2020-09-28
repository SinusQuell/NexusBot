var roleScientist = {
    run: function(creep) {
        if (_.sum(creep.carry) == 0) { 
            //CREEP IS NOT CARRYING ANYTHING
            if (Memory.colonies[creep.room.name].mineralProcessing.length > 0) {
                if (utilities.TerminalReagentsAvailable(creep.room.name, creep.carryCapacity)) {
                    //TERMINAL HAS REQUIRED REAGENTS 
                    var resA = Memory.colonies[creep.room.name].mineralProcessing[0];
                    var resB = Memory.colonies[creep.room.name].mineralProcessing[1];
                    //Room should do lab reactions
                    var labs = utilities.GetCenterLabs(creep.room.name);
                    if (labs[0].mineralAmount < labs[0].mineralCapacity - creep.carryCapacity) { //if lab A needs mineral A
                        if (creep.withdraw(creep.room.terminal, resA) == ERR_NOT_IN_RANGE) { //load up on mineral A
                            creep.travelTo(creep.room.terminal);
                        }
                    } else if (labs[1].mineralAmount < labs[1].mineralCapacity - creep.carryCapacity) { //if lab B needs mineral B
                        if (creep.withdraw(creep.room.terminal, resB) == ERR_NOT_IN_RANGE) { //load up on mineral B
                            creep.travelTo(creep.room.terminal);
                        }
                    } else {
                        //LABS DON'T NEED MINERALS, BUT TERMINAL STILL HAS REAGENTS! EMPTY PRODUCING LABS
                        var labsToEmpty = utilities.GetLabsToEmpty(creep.room.name);
                        var filledLabs = _.filter(labsToEmpty, lab => lab.mineralAmount > 0);
                        if (filledLabs.length > 0) {
                            if (creep.withdraw(filledLabs[0], filledLabs[0].mineralType) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(filledLabs[0]);
                            }
                        }
                    }
                } else {
                    //TERMINAL DOES NOT HAVE REQUIRED REAGENTS //stop reaction?
                    //EMPTY PRODUCING LABS
                    var labsToEmpty = utilities.GetLabsToEmpty(creep.room.name);
                    var filledLabs = _.filter(labsToEmpty, lab => lab.mineralAmount > 0);
                    if (filledLabs.length > 0) {
                        if (creep.withdraw(filledLabs[0], filledLabs[0].mineralType) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(filledLabs[0]);
                        }
                    }
                }
            } else {
                //NO REACTION SET IN THIS ROOM, EMPTY OUT ALL LABS
                var labs = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => {return s.structureType == STRUCTURE_LAB && s.mineralAmount > 0}
                });
                if (labs.length > 0) {
                    if (creep.withdraw(labs[0], labs[0].mineralType) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(labs[0]);
                    }
                }
            }
        } else {
            //CREEP IS CARRYING SOMETHING!
            if (Memory.colonies[creep.room.name].mineralProcessing.length > 0) { //there is a reaction set for this room
                var resA = Memory.colonies[creep.room.name].mineralProcessing[0];
                var resB = Memory.colonies[creep.room.name].mineralProcessing[1];
                var labs = utilities.GetCenterLabs(creep.room.name);
                
                if (creep.carry[resA] > 0) {
                    //fill Lab A
                    if (creep.transfer(labs[0], resA) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(labs[0]);
                    }
                } else if (creep.carry[resB] > 0) {
                    //fill Lab B
                    if (creep.transfer(labs[1], resB) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(labs[1]);
                    }
                } else {
                    //carried mineral is not needed in Labs, store it in the terminal.
                    // transfer all resources to terminal
                    for (var resourceType in creep.carry) {
                        if (creep.transfer(creep.room.terminal, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.terminal);
                        }
                    }
                }
            } else { //no reaction set
                //transfer all resources to terminal
                for (var resourceType in creep.carry) {
                    if (creep.transfer(creep.room.terminal, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.terminal);
                    }
                }
            }
        }
    }
}
module.exports = roleScientist;