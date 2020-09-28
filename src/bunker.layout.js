/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bunker.layout');
 * mod.thing == 'a thing'; // true
 */
let bunkerLayout = {
    SaveInMemory_Circle: function() {
        if (!Memory.bunkerLayouts) {
            Memory.bunkerLayouts = {};
        }
        if (!Memory.bunkerLayouts.circleLayout) {
            Memory.bunkerLayouts.circleLayout = {}
        }
        if (!Memory.bunkerLayouts.circleLayout.extensions) {
            Memory.bunkerLayouts.circleLayout.extensions = [
                {x: +1, y: -1, type: 'STRUCTURE_EXTENSION'},
                {x: +1, y: -2, type: 'STRUCTURE_EXTENSION'},
                {x: +2, y: -2, type: 'STRUCTURE_EXTENSION'},
                {x: +2, y: -3, type: 'STRUCTURE_EXTENSION'},
                {x: +3, y: -3, type: 'STRUCTURE_EXTENSION'},               
                {x: +1, y: +1, type: 'STRUCTURE_EXTENSION'},
                {x: +1, y: +2, type: 'STRUCTURE_EXTENSION'},
                {x: +2, y: +2, type: 'STRUCTURE_EXTENSION'},
                {x: +2, y: +3, type: 'STRUCTURE_EXTENSION'},
                {x: +3, y: +3, type: 'STRUCTURE_EXTENSION'},            
                {x: -1, y: +1, type: 'STRUCTURE_EXTENSION'},
                {x: -1, y: +2, type: 'STRUCTURE_EXTENSION'},
                {x: -1, y: +3, type: 'STRUCTURE_EXTENSION'},
                {x: -1, y: -1, type: 'STRUCTURE_EXTENSION'},
                {x: -1, y: -2, type: 'STRUCTURE_EXTENSION'},
                {x: -1, y: -3, type: 'STRUCTURE_EXTENSION'},
                {x: -2, y: +1, type: 'STRUCTURE_EXTENSION'},
                {x: -2, y: +2, type: 'STRUCTURE_EXTENSION'},
                {x: -2, y: -1, type: 'STRUCTURE_EXTENSION'},
                {x: -2, y: -2, type: 'STRUCTURE_EXTENSION'},             
                {x: -0, y: -3, type: 'STRUCTURE_EXTENSION'},
                {x: -0, y: -4, type: 'STRUCTURE_EXTENSION'},
                {x: -0, y: +3, type: 'STRUCTURE_EXTENSION'},
                {x: -0, y: +4, type: 'STRUCTURE_EXTENSION'},
                {x: +1, y: -4, type: 'STRUCTURE_EXTENSION'},
                {x: +1, y: -5, type: 'STRUCTURE_EXTENSION'},
                {x: +1, y: +4, type: 'STRUCTURE_EXTENSION'},
                {x: +1, y: +5, type: 'STRUCTURE_EXTENSION'},
                {x: +2, y: -5, type: 'STRUCTURE_EXTENSION'},
                {x: +2, y: +5, type: 'STRUCTURE_EXTENSION'},              
                {x: +2, y: -6, type: 'STRUCTURE_EXTENSION'},
                {x: +2, y: +6, type: 'STRUCTURE_EXTENSION'},
                {x: +3, y: -4, type: 'STRUCTURE_EXTENSION'},
                {x: +3, y: -6, type: 'STRUCTURE_EXTENSION'},
                {x: +3, y: +4, type: 'STRUCTURE_EXTENSION'},
                {x: +3, y: +6, type: 'STRUCTURE_EXTENSION'},
                {x: +4, y: -5, type: 'STRUCTURE_EXTENSION'},
                {x: +4, y: +5, type: 'STRUCTURE_EXTENSION'},
                {x: +5, y: -6, type: 'STRUCTURE_EXTENSION'},
                {x: +5, y: +6, type: 'STRUCTURE_EXTENSION'},              
                {x: +6, y: -5, type: 'STRUCTURE_EXTENSION'},
                {x: +6, y: -6, type: 'STRUCTURE_EXTENSION'},
                {x: +6, y: +2, type: 'STRUCTURE_EXTENSION'},
                {x: +6, y: +3, type: 'STRUCTURE_EXTENSION'},
                {x: +6, y: +5, type: 'STRUCTURE_EXTENSION'},
                {x: +6, y: +6, type: 'STRUCTURE_EXTENSION'},
                {x: +7, y: -5, type: 'STRUCTURE_EXTENSION'},
                {x: +7, y: +1, type: 'STRUCTURE_EXTENSION'},
                {x: +7, y: +2, type: 'STRUCTURE_EXTENSION'},
                {x: +7, y: +4, type: 'STRUCTURE_EXTENSION'},               
                {x: +7, y: +5, type: 'STRUCTURE_EXTENSION'},
                {x: +8, y: +1, type: 'STRUCTURE_EXTENSION'},
                {x: +8, y: +3, type: 'STRUCTURE_EXTENSION'},
                {x: +8, y: +4, type: 'STRUCTURE_EXTENSION'},
                {x: +9, y: +2, type: 'STRUCTURE_EXTENSION'},
                {x: +9, y: +3, type: 'STRUCTURE_EXTENSION'},
                {x: +10, y: -1, type: 'STRUCTURE_EXTENSION'},
                {x: +10, y: -2, type: 'STRUCTURE_EXTENSION'},
                {x: +10, y: +1, type: 'STRUCTURE_EXTENSION'},
                {x: +10, y: +2, type: 'STRUCTURE_EXTENSION'}
            ];
        }
    },
}
module.exports = bunkerLayout;