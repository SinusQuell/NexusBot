//All links (except the storage and controller ones) always fill the controller link first, then they fill the storage link.
var roleLinks = {
    /** @param {Link} link **/
    run: function(link) {
        //find closest link to controller
        var controllerLink = link.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
            filter: (s) => {return s.structureType == STRUCTURE_LINK}
        });
        var storageLink = link.room.storage.pos.findInRange(FIND_STRUCTURES, 2, {
            filter: (s) => {return s.structureType == STRUCTURE_LINK}
        });
        
        if (link.energy >= 600) { //only transfer if almost full
            if (controllerLink.length > 0 && controllerLink[0].energy < 300) {        //fill controller link first
                if (controllerLink != link) {
                    if (controllerLink[0] != link && controllerLink[0].energy < controllerLink[0].energy < 400) {
                        link.transferEnergy(controllerLink[0]);
                    }
                }
            } else if (storageLink.length > 0 && storageLink[0].energy < storageLink[0].energyCapacity) { //then storage link
                if (storageLink[0] != link && link != controllerLink[0]) {
                    link.transferEnergy(storageLink[0]);
                }
            }
        }
    }
};
module.exports = roleLinks;