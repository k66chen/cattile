//handles syntax for a generic unit on the field
var unit = function (game){
    this.spriteframe;
    this.name;
    this.hp;
    this.sp;
    this.movement;

    //x and y coordinates in the grid (multiplied by 50) 10x16
    this.x;
    this.y;

    this.infotext;
    this.infoswitch = false;
    this.movedone = true;

    //movepanel = game.add.group();
    this.tempmovepanel;
    this.tempgrid;
    var testtext = game.add.text(0,0);

    this.getType = function (){
        return "unit";
    }

    this.create = function (name,sprite, hp, sp, movement,x,y){
        this.name = name;
        this.hp = hp;
        this.sp = sp;
        this.movement = movement;

        this.x = x*50;
        this.y = y*50;
        this.spriteframe = game.add.sprite (this.x,this.y,sprite); 
        game.physics.arcade.enable (this.spriteframe);
        //this.spriteframe.body.gravity.y = 300;
        //this.spriteframe.collideWorldBounds = true;

        //create on click functions    
        //
        this.spriteframe.inputEnabled = true;
        this.spriteframe.events.onInputDown.add(this.click,this);
    }

    this.click = function (){
        if (this.movedone){
            if (!this.infoswitch){

                //this.infotext = game.add.text (this.x+50,this.y+10,this.name + " Hp: "+this.hp + " Mv: " + this.movement);
                //show movement panels

                //this.infotext.fill = "#ff0044";
                this.infoswitch = true;
                if (movepanel != undefined){
                    //remove move panels on other units
                    movepanel.destroy();
                }

                movepanel = game.add.group();
                this.tempgrid = new Array (10);
                for (var i =0; i< 10;i++){
                    this.tempgrid[i] = new Array (16);
                }
                this.movePathFind (this.x,this.y,this.movement);
/*
                //determine movable tiles in the game
                for (i = 1; i< this.movement+1; i++){
                    //check the grid for each
                    if (checkGrid((this.x+50*i)/50,this.y/50)){movepanel.create(this.x + 50*i,this.y,'trans');}
                    if (checkGrid((this.x-50*i)/50,this.y/50)){movepanel.create (this.x - 50*i,this.y,'trans');}
                    if (checkGrid((this.x)/50,(this.y+50*i)/50)){movepanel.create (this.x,this.y+50*i,'trans');}
                    if (checkGrid((this.x)/50,(this.y-50*i)/50)) {movepanel.create (this.x,this.y-50*i,'trans');}
                    //diagonal panels
                    //movepanel.create (this.x-50*(i-1),this.y-50*(i-1),'trans');
                }
                */
                movepanel.setAll ('inputEnabled',true);
                movepanel.setAll ('alpha',0.2);
                movepanel.callAll ('events.onInputDown.add','events.onInputDown',this.move,this);
            }else{
                //this.infotext.destroy();
                movepanel.destroy();
                this.infoswitch = false;
            }
        }
    }

    this.movePathFind = function (x,y,tempmv){
        //recursively check squares around the user until move is 0

        //check this x,y
        if (tempmv > 0){
            //check that this grid is not itself
            if (this.x == x && this.y == y){
                console.log ("this");
                //check up,left,right,down
                this.movePathFind(x+50,y,tempmv);
                this.movePathFind(x-50,y,tempmv);
                this.movePathFind(x,y-50,tempmv);
                this.movePathFind(x,y+50,tempmv);

            }
            else if ((checkGrid(x/50,y/50))){
                //this panel is empty, add move panel here
                //check if we already have a movepanel here though
                if (this.tempgrid[x/50][y/50] != 'as'){
                    movepanel.create (x,y,'trans');
                    this.tempgrid[x/50][y/50] = 'as';
                }

                tempmv -=1;
                if (tempmv > 0){
                    //check up,left,right,down
                    this.movePathFind(x+50,y,tempmv);
                    this.movePathFind(x-50,y,tempmv);
                    this.movePathFind(x,y-50,tempmv);
                    this.movePathFind(x,y+50,tempmv);
                }
            }
            else{
                console.log ("err");
            }
            //else this path is blocked
        }

    }

    movepanelInputAdd =function (){
        movepanel.inputEnabled = true;
        movepanel.alpha = 0.2;
        //   movepanel.events.onInputDown.add(this.move,self);

    }


    this.move = function (event){
        //move the player depending on which movepanel was picked (panel in mouse event)
        event.alpha = 0.5;
        //game.add.text (0,0,"x:"+event.x+"y:"+event.y);
        //   this.spriteframe.body.velocity.x= 150;
        this.infoswitch = false;
        //destroy the old element in grid
        //determine destination x and destination y
        var destx = event.x /50;
        var desty = event.y / 50;
        //var testtext = game.add.text (0,0,"x:"+this.spriteframe.x+"dx:"+destx);

        //game.physics.arcade.moveToXY (this.spriteframe,event.x,this.spriteframe.y,50,500); 
        this.spriteframe.body.moves = false;
        this.tempmovepanel = game.add.sprite (event.x,event.y,'trans');
        this.tempmovepanel.alpha = 0.5;
        this.movedone = false;
        movetween = game.add.tween(this.spriteframe).to({x:event.x,y:event.y},600);
        //x tween complete, add y tween
        movetween.onComplete.add(function (){
            this.movedone = true;
            this.tempmovepanel.destroy();
            this.updateGrid ();
        },this);
        movetween.start();
        //movetweeny = game.add.tween(this.spriteframe).to({x:this.spriteframe.x,y:event.y},600);
        //movetweeny.start();

        movepanel.destroy();

        //update the local x and y
        //update the grid

        /* 
           while (this.spriteframe.x < event.x){
        //this.spriteframe.body.velocity.x = 50;
        testtext.text = " "+this.spriteframe.x +" to:" + event.x;

        setTimeout (function (){
        this.spriteframe.x ++;
        }, 10);


        }
        */
        //this.spriteframe.body.velocity.x = 0;
    }
    this.updateGrid = function(){
        delete grid[this.x/50][this.y/50];
        console.log ("deleted"+this.x/50+","+this.y/50);
        this.x = this.spriteframe.x;
        this.y = this.spriteframe.y;
        grid[this.x/50][this.y/50] = this;

    }


}
