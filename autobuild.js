let autobuild = {
    BuildColony: function() {
        for (let rm in Game.rooms) {
            let ctrl = Game.rooms[rm].controller;
            if (ctrl && ctrl.my) {
                if (Memory.colonies[rm].autobuild['enable'] == true) { //autobuild is enabled for this colony
                    var originX = Memory.colonies[rm].autobuild['originX'];
                    var originY = Memory.colonies[rm].autobuild['originY'];
                    if (this.CheckRclLevelUp(rm)) { //controller has leveled up! Build new stuff
                        var newRcl = ctrl.level;
                        switch (newRcl) {
                            default: break;
                            case 2:
                                this.AddToBuildQueue(rm, originX + 1, originY - 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 1, originY - 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 2, originY - 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 2, originY - 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 3, originY - 3, STRUCTURE_EXTENSION);
                                
                                //CONTAINERS
                                this.AddToBuildQueue(rm, originX - 1, originY + 0, STRUCTURE_CONTAINER);
                                
                                var containerPosController = this.GetContainerPosition(rm, Game.rooms[rm].controller, 1);
                                this.AddToBuildQueue(rm, containerPosController.x, containerPosController.y, STRUCTURE_CONTAINER);
                                
                                var sources = Game.rooms[rm].find(FIND_SOURCES);
                                for (i = 0; i < sources.length; i++) {
                                    var sourceContainer = this.GetContainerPosition(rm, sources[i], 1);
                                    this.AddToBuildQueue(rm, sourceContainer.x, sourceContainer.y, STRUCTURE_CONTAINER);
                                }
                                
                                this.AddToBuildQueue(rm, originX + 0, originY - 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 0, originY - 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 0, originY + 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 0, originY + 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 1, originY - 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 2, originY - 0, STRUCTURE_ROAD);

                                break;
                            case 3:
                                this.AddToBuildQueue(rm, originX + 2, originY - 1, STRUCTURE_TOWER);
                                
                                this.AddToBuildQueue(rm, originX + 1, originY + 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 1, originY + 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 2, originY + 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 2, originY + 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 3, originY + 3, STRUCTURE_EXTENSION);
                                  
                                
                                //ROAD PLACEMENT TO SOURCE + CONTROLLER
                                this.AddToBuildQueue(rm, originX - 1, originY - 0, STRUCTURE_ROAD);
                                var sources = Game.rooms[rm].find(FIND_SOURCES);
                                this.BuildRoad(rm, sources[0].pos);
                                this.BuildRoad(rm, sources[1].pos);
                                this.BuildRoad(rm, Game.rooms[rm].controller.pos);
                                
                                Game.rooms[rm].createFlag(originX - 4, originY - 2, 'IDLE_' + rm, COLOR_GREY, COLOR_GREY); //Idle Flag
                                Game.rooms[rm].createFlag(originX - 5, originY - 1, 'G_' + rm, COLOR_CYAN, COLOR_CYAN); //Guard Idle Flag
                                break;
                            case 4:
                                this.AddToBuildQueue(rm, originX + 3, originY + 0, STRUCTURE_STORAGE);
                                
                                this.AddToBuildQueue(rm, originX - 1, originY + 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 1, originY + 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 1, originY + 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 1, originY - 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 1, originY - 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 1, originY - 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 2, originY + 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 2, originY + 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 2, originY - 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 2, originY - 2, STRUCTURE_EXTENSION);
                                
                                this.AddToBuildQueue(rm, originX - 3, originY - 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 3, originY - 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 3, originY - 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 3, originY + 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 3, originY + 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 2, originY - 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 2, originY + 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 1, originY - 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 1, originY + 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 2, originY - 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 2, originY - 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 2, originY + 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 1, originY - 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX - 1, originY + 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 0, originY - 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 0, originY + 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 1, originY - 6, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 1, originY + 6, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 2, originY - 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 2, originY + 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 3, originY - 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 3, originY + 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 3, originY + 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 3, originY - 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 3, originY + 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 3, originY - 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY - 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY - 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY + 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY - 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY + 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY - 6, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY + 6, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY - 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 4, originY + 7, STRUCTURE_ROAD);

                                break;
                            case 5:
                                this.AddToBuildQueue(rm, originX + 2, originY + 1, STRUCTURE_TOWER);
                                
                                this.AddToBuildQueue(rm, originX - 0, originY - 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 0, originY - 4, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 0, originY + 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX - 0, originY + 4, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 1, originY - 4, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 1, originY - 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 1, originY + 4, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 1, originY + 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 2, originY - 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 2, originY + 5, STRUCTURE_EXTENSION);
                                
                                
                                //LINK PLACEMENT FOR SOURCE 1 + CONTROLLER
                                var linkPosController = this.GetContainerPosition(rm, Game.rooms[rm].controller, 2);
                                this.AddToBuildQueue(rm, linkPosController.x, linkPosController.y, STRUCTURE_LINK);
                                
                                var sources = Game.rooms[rm].find(FIND_SOURCES);
                                var linkPosS0 = this.GetContainerPosition(rm, sources[0], 1);
                                this.AddToBuildQueue(rm, linkPosS0.x, linkPosS0.y, STRUCTURE_LINK);
                                
                                this.AddToBuildQueue(rm, originX + 5, originY - 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 5, originY + 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 6, originY - 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 6, originY + 7, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 5, originY + 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 5, originY + 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 5, originY + 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 5, originY - 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 5, originY - 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 5, originY - 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 6, originY - 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 6, originY - 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 6, originY - 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 6, originY + 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 6, originY + 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 7, originY - 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 7, originY - 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 7, originY - 6, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 7, originY + 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 7, originY + 6, STRUCTURE_ROAD);

                                //TODO: ADD RAMPART PLACEMENT (OUTER LAYER) (if enough energy)
                                break;
                            case 6: 
                                this.AddToBuildQueue(rm, originX + 2, originY - 6, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 2, originY + 6, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 3, originY - 4, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 3, originY - 6, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 3, originY + 4, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 3, originY + 6, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 4, originY - 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 4, originY + 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 5, originY - 6, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 5, originY + 6, STRUCTURE_EXTENSION);
                                
                                //LINK FOR SOURCE 2
                                var sources = Game.rooms[rm].find(FIND_SOURCES);
                                var linkPosS1 = this.GetContainerPosition(rm, sources[1], 1);
                                this.AddToBuildQueue(rm, linkPosS1.x, linkPosS1.y, STRUCTURE_LINK);
                                
                                //EXTRACTOR + ROAD TO MINERAL
                                var mineral = ctrl.pos.findClosestByRange(FIND_MINERALS);
                                this.AddToBuildQueue(rm, mineral.pos.x, mineral.pos.y, STRUCTURE_EXTRACTOR);
                                this.BuildRoad(rm, mineral.pos);

                                this.AddToBuildQueue(rm, originX + 8, originY + 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 8, originY + 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 8, originY + 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 8, originY - 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 8, originY - 5, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 9, originY + 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 9, originY + 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 9, originY + 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 9, originY - 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 9, originY - 4, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 10, originY + 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 10, originY + 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 10, originY - 3, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 11, originY + 0, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 11, originY + 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 11, originY + 2, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 11, originY - 1, STRUCTURE_ROAD);
                                this.AddToBuildQueue(rm, originX + 11, originY - 2, STRUCTURE_ROAD);
                                break;
                            case 7:
                                this.AddToBuildQueue(rm, originX + 3, originY - 2, STRUCTURE_TOWER);
                                this.AddToBuildQueue(rm, originX + 5, originY - 4, STRUCTURE_SPAWN);
                                
                                this.AddToBuildQueue(rm, originX + 6, originY - 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 6, originY - 6, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 6, originY + 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 6, originY + 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 6, originY + 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 6, originY + 6, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 7, originY - 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 7, originY + 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 7, originY + 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 7, originY + 4, STRUCTURE_EXTENSION);
                                
                                this.AddToBuildQueue(rm, originX + 4, originY + 1, STRUCTURE_LINK);
                                break;
                            case 8:
                                this.AddToBuildQueue(rm, originX + 3, originY + 2, STRUCTURE_TOWER);
                                this.AddToBuildQueue(rm, originX + 4, originY + 3, STRUCTURE_TOWER);
                                this.AddToBuildQueue(rm, originX + 4, originY - 3, STRUCTURE_TOWER);
                                this.AddToBuildQueue(rm, originX + 5, originY + 4, STRUCTURE_SPAWN);
                                
                                this.AddToBuildQueue(rm, originX + 7, originY + 5, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 8, originY + 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 8, originY + 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 8, originY + 4, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 9, originY + 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 9, originY + 3, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 10, originY - 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 10, originY - 2, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 10, originY + 1, STRUCTURE_EXTENSION);
                                this.AddToBuildQueue(rm, originX + 10, originY + 2, STRUCTURE_EXTENSION);
                                
                                this.AddToBuildQueue(rm, originX + 5, originY + 1, STRUCTURE_OBSERVER);
                                break;
                        }
                    }
                    //THINGS THAT ONLY BUILD WHEN ENERGY IS AVAILABLE (BUILD AFTER REGULAR STUFF)
                    if (Game.time % 1000 == 0) {
                        this.BuildRamparts(rm, originX, originY);
                        this.BuildLabSetup(rm, originX, originY);
                        this.BuildNukerAndPowerSpawn(rm, originX, originY);
                    }
                    
                    //REMOTE ROAD BUILDING
                    if (ctrl.level >= 3 && Game.time % 5 == 0) {
                        this.BuildRoadsForRemotes(rm);
                    }
                }
            }
        }
    },
    BuildRamparts: function(rm, originX, originY) {
        if (Game.rooms[rm].storage) {
    	    var eng = Game.rooms[rm].storage.store[RESOURCE_ENERGY];
    	    if (Memory.colonies[rm].autobuild['rampartStage'] == 0 && eng >= 310000) 
    	    {
    			this.BuildRampartsLayer(rm, originX, originY, 0);
    			Memory.colonies[rm].autobuild['rampartStage'] = 1;
        	} 
        	else if (Memory.colonies[rm].autobuild['rampartStage'] == 1 && eng >= 325000) 
        	{
        		this.BuildRampartsLayer(rm, originX, originY, 1);
        		Memory.colonies[rm].autobuild['rampartStage'] = 2;
        	} 
        	else if (Memory.colonies[rm].autobuild['rampartStage'] == 2 && eng >= 340000) 
        	{
        		this.BuildRampartsLayer(rm, originX, originY, 2);
        		Memory.colonies[rm].autobuild['rampartStage'] = 3;
        	}
        }
    },
    BuildRampartsLayer: function(rm, originX, originY, layer) {
    	switch (layer) {
    		case 0: //OUTER LAYER + TOWERS + SPAWNS + STORAGE
    			//LAYER 0
    			this.AddToBuildQueue(rm, originX - 3, originY + 0, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 3, originY + 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 3, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 3, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 3, originY - 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 2, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 2, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 0, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 0, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY + 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY - 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY + 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY - 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY + 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY - 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY + 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY - 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 5, originY + 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 5, originY - 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY + 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY - 7, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY + 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY - 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 10, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 10, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 11, originY + 0, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 11, originY + 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 11, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 11, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 11, originY - 2, STRUCTURE_RAMPART);

    			//SPAWNS
    			this.AddToBuildQueue(rm, originX + 0, originY - 0, STRUCTURE_RAMPART);	
    			this.AddToBuildQueue(rm, originX + 5, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 5, originY - 4, STRUCTURE_RAMPART);
    			//STORAGE
    			this.AddToBuildQueue(rm, originX + 3, originY - 0, STRUCTURE_RAMPART);
    			//TOWERS
    			this.AddToBuildQueue(rm, originX + 2, originY + 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY - 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY - 3, STRUCTURE_RAMPART);
    			break;
    		case 1: //MIDDLE LAYER + TERMINAL + LINK
    			//LAYER 1
    			this.AddToBuildQueue(rm, originX - 2, originY - 0, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 2, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 2, originY - 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 2, originY + 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 2, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 0, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 0, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY + 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY - 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY + 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY - 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY + 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY - 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 5, originY + 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 5, originY - 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY + 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY - 6, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 10, originY + 0, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 10, originY + 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 10, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 10, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 10, originY - 2, STRUCTURE_RAMPART);

    			//TERMINAL
    			this.AddToBuildQueue(rm, originX + 4, originY - 1, STRUCTURE_RAMPART);
    			//LINK
    			this.AddToBuildQueue(rm, originX + 4, originY + 1, STRUCTURE_RAMPART);
    			break;
    		case 2: //INNER LAYER + LABS + NUKER + OBSERVER + POWER SPAWN
    			//LAYER 2 
    			this.AddToBuildQueue(rm, originX - 1, originY - 0, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY - 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY + 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 1, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 0, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX - 0, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 3, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 4, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 5, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 5, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY - 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY + 5, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY - 0, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY + 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 9, originY - 2, STRUCTURE_RAMPART);
    			//LAYER 2 DIAGONAL ADDITIONS
    			this.AddToBuildQueue(rm, originX + 0, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 0, originY - 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 1, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 2, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY + 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY - 4, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY + 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY + 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY - 2, STRUCTURE_RAMPART);

    			//NUKER
    			this.AddToBuildQueue(rm, originX + 5, originY + 0, STRUCTURE_RAMPART);
    			//OBSERVER
    			this.AddToBuildQueue(rm, originX + 5, originY + 1, STRUCTURE_RAMPART);
    			//POWER SPAWN
    			this.AddToBuildQueue(rm, originX + 5, originY - 1, STRUCTURE_RAMPART);
    			//LABS
    			this.AddToBuildQueue(rm, originX + 6, originY - 2, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 6, originY - 3, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 7, originY - 1, STRUCTURE_RAMPART);
    			this.AddToBuildQueue(rm, originX + 8, originY - 1, STRUCTURE_RAMPART);
    			break;
    	}
    },
    BuildLabSetup: function(rm, originX, originY) {
        var rcl = Game.rooms[rm].controller.level;
        if (rcl >= 6 && Game.rooms[rm].storage) {
            var eng = Game.rooms[rm].storage.store[RESOURCE_ENERGY];
            
            
            if (rcl >= 8 && Memory.colonies[rm].autobuild['labStage'] == 2) {
                //1x TERMINAL, 3x LAB
                if (eng >= 375000) {
                    this.AddToBuildQueue(rm, originX + 8, originY - 1, STRUCTURE_LAB);
                    this.AddToBuildQueue(rm, originX + 8, originY - 4, STRUCTURE_LAB);
                    this.AddToBuildQueue(rm, originX + 9, originY - 2, STRUCTURE_LAB);
                    this.AddToBuildQueue(rm, originX + 9, originY - 3, STRUCTURE_LAB);
                    Memory.colonies[rm].autobuild['labStage'] = 3;
                }
            } else if (rcl >= 7 && Memory.colonies[rm].autobuild['labStage'] == 1) {
                //3x LAB
                if (eng >= 350000) { 
                    this.AddToBuildQueue(rm, originX + 6, originY - 2, STRUCTURE_LAB);
                    this.AddToBuildQueue(rm, originX + 7, originY - 1, STRUCTURE_LAB);
                    this.AddToBuildQueue(rm, originX + 7, originY - 4, STRUCTURE_LAB);
                    Memory.colonies[rm].autobuild['labStage'] = 2;
                }
            } else if (rcl >= 6 && Memory.colonies[rm].autobuild['labStage'] == 0) {
                //4x LAB
                if (eng >= 325000) {
                    this.AddToBuildQueue(rm, originX + 4, originY - 1, STRUCTURE_TERMINAL);
                    this.AddToBuildQueue(rm, originX + 7, originY - 3, STRUCTURE_LAB);
                    Game.rooms[rm].createFlag(originX + 7, originY - 3, 'L1_' + rm, COLOR_GREY, COLOR_WHITE); //Flag for source lab 

                    this.AddToBuildQueue(rm, originX + 8, originY - 2, STRUCTURE_LAB);
                    Game.rooms[rm].createFlag(originX + 8, originY - 2, 'L2_' + rm, COLOR_GREY, COLOR_WHITE); //Flag for source lab 2

                    this.AddToBuildQueue(rm, originX + 6, originY - 3, STRUCTURE_LAB);
                    Memory.colonies[rm].autobuild['labStage'] = 1;
                }
            }
        }
    },
    BuildNukerAndPowerSpawn: function(rm, originX, originY) {
        var rcl = Game.rooms[rm].controller.level;
        if (rcl == 8 && Game.rooms[rm].storage) {
            var eng = Game.rooms[rm].storage.store[RESOURCE_ENERGY];
            if (eng >= 400000) {
                if (Memory.colonies[rm].autobuild['labStage'] == 3) {
                    this.AddToBuildQueue(rm, originX + 5, originY - 1, STRUCTURE_POWER_SPAWN);
                    this.AddToBuildQueue(rm, originX + 5, originY - 0, STRUCTURE_NUKER);
                    Memory.colonies[rm].autobuild['labStage'] = 4;
                }
            }
        }
    },
    GetContainerPosition: function(rm, target, rng = 1) {
        var sp = Game.rooms[rm].find(FIND_MY_SPAWNS);
        var path = Game.rooms[rm].findPath(sp[0].pos, target.pos, {range: rng, ignoreCreeps: true});
        var containerPos = path[path.length - 1];
        return containerPos;
    },
    CheckRclLevelUp: function(rm) {
        if (Memory.colonies[rm].autobuild['RCL'] < Game.rooms[rm].controller.level) {
            Memory.colonies[rm].autobuild['RCL'] = Game.rooms[rm].controller.level;
            return true;
        } else return false;
    },
    SetAutoBuild: function(rm, enabled, originX, originY, reset = false) {
        Memory.colonies[rm].autobuild['enable'] = enabled;
        Memory.colonies[rm].autobuild['originX'] = originX;
        Memory.colonies[rm].autobuild['originY'] = originY;

        if (reset === true) {
            Memory.colonies[rm].autobuild['RCL'] = 1;
            Memory.colonies[rm].autobuild['labStage'] = 0;
            Memory.colonies[rm].autobuild['rampartStage'] = 0;
        }

        return '<font color="#ffdd32" type="highlight">' + 'Autobuilder enabled in: ' + rm + '</font>';
    },
    
    //BuildRoad only works from rooms with autobuild enabled!
    //NEEDS VISION IN ALL ROOMS IT BUILDS IN
    BuildRoad: function(startRoom, endPos, containerAtEnd = false) {
        var spwns = Game.rooms[startRoom].find(FIND_MY_SPAWNS);
        var startPos = spwns[0].pos;
        
        let ret = PathFinder.search(startPos, { pos: endPos, range: 1},
        {
            //Set terrain costs and options
            plainCost: 2,
            swampCost: 8,
            ignoreCreeps: true,
            
            roomCallback: function(roomName) {
                let room = Game.rooms[roomName];
                //Need vision in all rooms along the path
                if (!room) return;
                let costs = new PathFinder.CostMatrix;
                
                room.find(FIND_STRUCTURES).forEach(function(struct) {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        // Favor roads over plain tiles
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my)) {
                        // Can't walk through non-walkable buildings
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });
                //treat roads that are still under construction as if they were finished
                room.find(FIND_MY_CONSTRUCTION_SITES).forEach(function(constr) {
                     if (constr.structureType == STRUCTURE_ROAD) {
                         costs.set(constr.pos.x, constr.pos.y, 1);
                     }
                });
                return costs;
            },
        });    
        
        let path = this.GetPathWithoutBunkerPositions(ret.path, startRoom);

        if (containerAtEnd == true) {
            let last = _.last(path);
            this.AddToBuildQueue(last.roomName, last.x, last.y, STRUCTURE_CONTAINER);              
        }
        for (i = 0; i < path.length; i++) {
            this.AddToBuildQueue(path[i].roomName, path[i].x, path[i].y, STRUCTURE_ROAD);
        }
        
    },
    GetPathWithoutBunkerPositions: function(path, rm) {
        var newPath = path;
        for (i = 0; i < newPath.length; i++) {
            _.remove(newPath, function(p) {
                return autobuild.IsPositionInsideBunker(rm, p)     
            });
        }
        return newPath;
    },
    GetBunkerPositions: function (rm) {
        if (Memory.colonies[rm].autobuild['enable'] == true) {
            var originX = Memory.colonies[rm].autobuild['originX'];
            var originY = Memory.colonies[rm].autobuild['originY'];

            var x1 = originX - 3;
            var y1 = originY - 2;
            var x2 = originX + 11;
            var y2 = originY + 2;
            var bigSquare = this.GetPositionsInSquare(x1, y1, x2, y2, rm);
            x1 = originX + 2;
            y1 = originY - 7;
            x2 = originX + 6;
            y2 = originY - 3;
            var topSquare = this.GetPositionsInSquare(x1, y1, x2, y2, rm);
            x1 = originX + 2;
            y1 = originY + 3;
            x2 = originX + 6;
            y2 = originY + 7;
            var botSquare = this.GetPositionsInSquare(x1, y1, x2, y2, rm);
        	x1 = originX - 1;
            y1 = originY - 5;
            x2 = originX + 1;
            y2 = originY - 3;
            var tlSquare = this.GetPositionsInSquare(x1, y1, x2, y2, rm);
            x1 = originX - 1;
            y1 = originY + 3;
            x2 = originX + 1;
            y2 = originY + 5;
            var blSquare = this.GetPositionsInSquare(x1, y1, x2, y2, rm);
            x1 = originX + 7;
            y1 = originY - 5;
            x2 = originX + 9;
            y2 = originY - 3;
            var trSquare = this.GetPositionsInSquare(x1, y1, x2, y2, rm);
            x1 = originX + 7;
            y1 = originY + 3;
            x2 = originX + 9;
            y2 = originY + 5;
            var brSquare = this.GetPositionsInSquare(x1, y1, x2, y2, rm);

            var bunkerPositions = _.union(bigSquare, topSquare, botSquare, tlSquare, blSquare, trSquare, brSquare);
            return bunkerPositions;
        }
    },
    GetPositionsInSquare: function(x1, y1, x2, y2, rm) {
    	var positions = [];
		for(var i = x1; i <= x2; i++) {
            for (var j = y1; j <= y2; j++) {
                positions[_.size(positions)] = new RoomPosition(i, j, rm);
            }	
        }
        return positions;	
    },
    IsPositionInsideBunker: function(rm, position) {
        let bunkerPositions = this.GetBunkerPositions(rm);
        
        var containsPos = false;
        for (i = 0; i < bunkerPositions.length; i++) {
            if (bunkerPositions[i].x == position.x && bunkerPositions[i].y == position.y && bunkerPositions[i].roomName == position.roomName) {
                containsPos = true;
                break;
            }
        }
        return containsPos;
    },
    AddToBuildQueue: function(buildRoom, buildX, buildY, struct) {
        Memory.buildQueue[Memory.buildQueue.length] = { buildRoom: buildRoom, buildX: buildX, buildY: buildY, struct: struct };
    },
    BuildFromQueue: function() {
        if (Memory.buildQueue) {
            var buildQueue = Memory.buildQueue;
            if (buildQueue.length > 0) { //build queue has entries
                if (Object.keys(Game.constructionSites).length < MAX_CONSTRUCTION_SITES - 20) { //global limit for construction sites not reached yet.
                    var toBuild = buildQueue[0];

                    cSite = Game.rooms[toBuild['buildRoom']].lookForAt(LOOK_CONSTRUCTION_SITES, toBuild['buildX'], toBuild['buildY']);
                    
                    //check for creep at the position, as they block construction via code
                    var creeps = Game.rooms[toBuild['buildRoom']].lookForAt(LOOK_CREEPS, toBuild['buildX'], toBuild['buildY']);
                    //check if there is already a site here and for vision in the room
                    if ((cSite.length && cSite.length > 0) || !Game.rooms[toBuild['buildRoom']] || (creeps.length && creeps.length > 0)) { 
                        //same thing already being built here
                        if (cSite.length && cSite.length > 0 && cSite[0].structureType == toBuild['struct']) {
                            Memory.buildQueue = _.drop(buildQueue);
                            return; 
                        }
                        //move entry to the end of the queue
                        Memory.buildQueue[Memory.buildQueue.length] = toBuild;
                        Memory.buildQueue = _.drop(buildQueue);
                        return;
                    }
                    Game.rooms[toBuild['buildRoom']].createConstructionSite(toBuild['buildX'], toBuild['buildY'], toBuild['struct']);
                    Memory.buildQueue = _.drop(buildQueue);
                }
            }
        }
    },
    ClearAllConstructionSites: function(rooms) {
        rooms.forEach(r => {
            var constructionSites = Game.rooms[r].find(FIND_MY_CONSTRUCTION_SITES);
            constructionSites.forEach(c => {
                c.remove();
            });
        });
    },
    BuildRoadsForRemotes: function(colony, rebuild = false) {
        remotes = Memory.colonies[colony].remoteMines;

        remotes.forEach(oRemoteRoom => {
            if (this.CheckRuinsForRebuild(oRemoteRoom['room']) == true) rebuild = true; //rebuild destroyed raods and containers
            if (oRemoteRoom['built'] === true && rebuild === false) return; //it has already been built up

            if (!utilities.CheckRouteForVision(colony, oRemoteRoom['room'])) return; //we need vision in all relevant rooms

            sources = Game.rooms[oRemoteRoom['room']].find(FIND_SOURCES);


            //TODO: build closest source first, then second
            if (oRemoteRoom['built'] === false) {
                this.BuildRoad(colony, sources[0].pos, true);
                oRemoteRoom['built'] = 0;
            } else if (oRemoteRoom['built'] == 0) {
                if (sources.length > 1) { // only try to build second source if it's there.
                    this.BuildRoad(colony, sources[1].pos, true)
                }

                oRemoteRoom['built'] = true;
                return;
            }
                    
        });
    },
    CheckRuinsForRebuild: function(rm) {
        var rebuild = false;
        var numRuins = 0;
        Game.rooms[rm].find(FIND_RUINS).forEach(function(ruin) {
            if (ruin.structure.structureType == STRUCTURE_ROAD || ruin.structure.structureType == STRUCTURE_CONTAINER) {
                numRuins += 1;
            }
        });
        if (numRuins > 0) {
            rebuild = true;
        }
        return rebuild;
    }

};
module.exports = autobuild;