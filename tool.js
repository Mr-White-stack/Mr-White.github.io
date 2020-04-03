/* ETAP CODE:
    Author: GCA
    Project: LEY CONFIGURATOR
    Date: 01/10/2019	
*/

//Global vars
var strings = null;
var locale = 'en';
var version = 'v1.5'; //v0.73
var lenTot;
var total;
var imgLey;
var universalBOM = "\uFEFF";



//Data variables
var projectDef = {
    project:{
        name:'',
        room:'',
        address:'',
        date:''
    },
    contact:{
        name:'',
        address:'',
        country:'',
        phone:'',
        email:''
    },
    extra:''
};
var lineDef = {
    installation:-1,
    suslen:-1,
    color:-1,
    colorCode:'',
    led:-1,
    optics:-1,
    diffOut:-1,
    beam:-1
};

var codeList = null;

var cornersArray = [];  //corners
var segsArray = [];     //segments
var tConnArray = [];    //intersections

var configSegs = [];    //segments used in the configuration
var configCorners = [];    //corners used in the configuration
var configTs = [];    //t-connections used in the configuration


var modules = [];


/*PROJECT DEFINITION */
function loadProjectDefData(){
    //project
    projectDef.project.name = $('#pname').val();
    projectDef.project.room = $('#proom').val();
    projectDef.project.address = $('#paddr').val();
    projectDef.project.date = $('#date').val();
    //contact
    projectDef.contact.name = $('#cname').val();
    projectDef.contact.address = $('#caddr').val();
    projectDef.contact.country =  getCountry().name;
    projectDef.contact.phone =  $('#phone').val();
    projectDef.contact.email =  $('#email').val();
}
function getCountry(){
    var out = '',cod='',sel = $('#country :selected').val();
    switch(sel){
        case 'be':
            out = strings.country_be;
            cod = 'be';
            break;
        case 'lu':
            out = strings.country_lu;
            cod = 'lu';
            break;
        case 'fr':
            out = strings.country_fr;
            cod = 'fr';
            break;
        case 'de':
            out = strings.country_de;
            cod = 'de';
            break;
        case 'nl':
            out = strings.country_nl;
            cod = 'nl';
            break;
        case 'pt':
            out = strings.country_pt;
            cod = 'pt';
            break;
        case 'es':
            out = strings.country_es;
            cod = 'es';
            break;
        case 'se':
            out = strings.country_se;
            cod = 'se';
            break;
        case 'other':
            out = strings.other;
            cod = 'other';
            break;
    }    
    return {name:out,cod:cod, sel:sel};
}
function getToMail(country){
    switch(country){
        case strings.country_be:
        case strings.country_lu:
        case strings.other:
        default:
            out = 'info@etaplighting.com';
            break;
        case strings.country_fr:
            out = 'info.fr@etaplighting.com';
            break;
        case strings.country_de:
            out = 'info.de@etaplighting.com';
            break;
        case strings.country_nl:
            out = 'info.nl@etaplighting.com';
            break;
        case strings.country_pt:
            out = 'info.pt@etaplighting.com';
            break;
        case strings.country_es:
            out = 'info.es@etaplighting.com';
            break;
        case strings.country_se:
            out = 'info.se@etaplighting.com';
            break;
    }
    return out;
}

/* LINE DEFINITION */
function getInstalation(){
    var out = '',cod = '' ,sel = $('#installation :selected').val(); //cod = '',
    
    switch(sel){
        case '0':
            out = strings.ceiling;
            cod = 'R';
            break;
        case '1':
            out = strings.wall;
            cod = 'W';
            break;
        case '2':
            out = strings.suspended;
            cod = 'S';
            break;
        case '3':
            out = 'Recessed';
            cod = '?';
            break;
    }    
    return {name:out,cod:cod,sel:sel};
}
function getSuspensionType(){
    var out = '',type = -1, len= 0, sel = $('#susLength :selected').val(), auxlen;
    switch(sel){
        case '0': //custom length
            auxlen = $('#otherSusLen').val();
            out = strings.powerSupplyBox+', '+auxlen+'mm';
            type = 0;
            len = parseInt(auxlen);
            break;
        case '1':
            out = strings.powerSupplyBox + ', 1500mm';
            type = 0;
            len = 1500;
            break;
        case '2':
            out = strings.powerSupplyBox +', 3000mm';
            type = 0;
            len = 3000;
            break;
        case '3':
            out = strings.minimalistic+', 1500mm';
            type = 1;
            len = 1500;
            break;
        case '4':
            out = strings.minimalistic+', 3000mm';
            type = 1;
            len = 3000;
            break;
        case '5': //custom length
            auxlen = $('#otherSusLen').val();
            out = strings.minimalistic+', '+auxlen+'mm';
            type = 1;
            len = parseInt(auxlen);
            break;
    }    
    return {name:out,sel:sel, type: type, len:len};
}
function getOptics(){
    var out = '', cod='', sel= $('#optics :selected').val();
    switch(sel){
        case '0':
            out = strings.opalDiffuser;
            cod= 'D';
            break;
        case '1':
            out = 'Low Luminance Diffuser';
            break;
        case '2':
            out = strings.whiteShielding;
            cod= 'S';
            break;
        case '3':
            out = strings.blackShielding;
            cod= 'B';
            break;
    }    
    return {name:out,cod:cod,sel:sel};
}
function getColor(){
    var out = '',cod='',sel = $('#color :selected').val();
    switch(sel){
        case '0':
            out = strings.color_op0;
            cod = 'X1';
            break;
        case '1':            
            out = strings.color_op1;
            cod = 'X0';
            break;        
        case '2':
            out = strings.color_op2;
            cod = 'X2';
            break;
        case '3':
            out = strings.custom_ral + document.getElementById("otherColor").value;
            cod = '-';
            break;
    }    
    return {name:out,cod:cod, sel:sel};
}
function getLedColor(){
    var out = '', cod = '', sel = $('#ledcolor :selected').val();
    switch(sel){
        case '0':
            out = '3000K';
            cod='W';
            break;
        case '1':
            out = '4000K';
            cod='N';
            break;
    }    
    return {name:out, cod:cod, sel:sel};
}
function getBeam(){
    var out = '', out2= '', cod = '', sel = $('#beam :selected').val();
    switch(sel){
        case '0':
            out = strings.medBeam;
            out2 = strings.medLD; //light distribution
            cod='1';
            break;
        case '1':
            out = strings.vWideBeam;
            out2 = strings.vWideLD; //light distribution
            cod='3';
            break;
    }    
    return {name:out, ld:out2, cod:cod, sel:sel};
}
function getLightOutput(){
    var out = '', cod = '', sel= $('#lightOutput :selected').val();
    switch(sel){
        case '0':
            out = strings.lightSource_med;
            cod='M'; //medium
            break;
        case '1':
            out = strings.lightSource_low;
            cod='L'; //low
            break;
    }    
    return {name:out, cod:cod, sel:sel};
}
// function getDriver(){
//     var out = '';
//     switch($('#ballast :selected').val()){
//         case '0':
//             out = 'Static';
//             break;
//         case '1':
//             out = 'DALI';
//             break;
//     }    
//     return out;
// }
function loadLineCharacteristics(){
    /* Used on line design window */
    var aux_html = '<strong style="line-height: 25px">Line definition</strong>';
    aux_html+= '<br>'+ getInstalation().name;
    aux_html+='<br>'+getColor().name.split(' - ')[0];
    aux_html+='<br>'+getLedColor().name;
    // aux_html+='<br>'+getDriver();
    aux_html+='<br>'+getOptics().name;
    // $('#designDefinitions').html(aux_html);
}

/*MAP Functions*/
var designStage, drawLayer;
var segGrp, cornGrp, tGrp;

var configStage, confLayer;
var segGrp_c, cornGrp_c, tGrp_c, tooltipGrp_c;

var exportStage, exportLayer;
var segGrp_e, cornGrp_e, tGrp_e, tooltipGrp_e;

var mouseMode = 0; //0 - draw; 1 - select
var selSegment = null;
var currInt = null;
var addedSegment = false;

var opticsMode = 1; //1 - Diffuser; 2- Shielded
var wallMount = false;
//OLD VERSION - with smaller values
// var opticsLen = [
//     [840, 1120, 1400, 1680, 1960, 2240, 2520, 2800],
//     [912, 1368, 1824, 2280, 2736]
// ];
var opticsLen = [
    [1120, 1400, 1680, 1960, 2240, 2520, 2800], //difuser
    [1368, 1824, 2280, 2736] //shielded
];
// var minSquares = 3; //3 - Diffuser; 2- Shielded OLD
var minSquares = 4; //4 - Diffuser; 3- Shielded
var minLenght = minSquares*30;
var gridSizeInMM = 280;
var gridSize = 30;
var shieldedDir = null;
var maxScale = 1.75, minScale = 0.35;
var t_connLength = 2*gridSize;

var zoomVars_design = {scale: 1, factor: 1.1, origin: {x: 0, y: 0}};
var zoomVars_config = {scale: 1, factor: 1.1, origin: {x: 0, y: 0}};
var FIREFOX = /Firefox/i.test(navigator.userAgent);

var designHasChanged;

var intersectingSeg = false;
var intersectingCorner = false;

var exportPieces = [];

/* LINE DESIGN */
function setUpDesignMap(){
    var width = $('#designContainer').width();
    var height = $('#designContainer').height();
    var blockSnapSize = gridSize;
    var isDrawing = false;
    var drawShape = null;

    designStage = new Konva.Stage({
        container: 'designContainer',
        width: width,
        height: height,
        draggable: true,
        name:'designStage',
        scaleY: -1
        // dragBoundFunc: function(pos) {
        //     var newY = pos.y < 0 ? 0 : pos.y;
        //     var newX = pos.x < 0 ? 0 : pos.x;
        //     return {
        //         x: newX,
        //         y: newY
        //     };
        // }
    });
    /*Set up grid*/
    var gridLayer = new Konva.Layer({name:'gridLayer'});
    var tipLayer = new Konva.Layer({name:'tipLayer'});
    var lenLayer = new Konva.Layer({name:'lenLayer'});
    drawLayer = new Konva.Layer({name:'drawLayer'});
    segGrp = new Konva.Group({name:'segments'});


    /* draw grid */
    for (var i = 0; i < 240; i++) {
        gridLayer.add(new Konva.Line({
            points: [Math.round(i * blockSnapSize), 0, Math.round(i * blockSnapSize), 120*blockSnapSize],
            stroke: '#888',
            strokeWidth: 0.5,
        }));
    }
    gridLayer.add(new Konva.Line({points: [0,0,10,10]}));
    for (var j = 0; j < 120; j++) {
        gridLayer.add(new Konva.Line({
            points: [0, Math.round(j * blockSnapSize), 240*blockSnapSize, Math.round(j * blockSnapSize)],
            stroke: '#888',
            strokeWidth: 0.5,
        }));
    }
    /* Stage initial position*/
    zoomVars_design = {scale: 1, factor: 1.1, origin: {x:-100*gridSize,y:-50*gridSize}};
    designStage.position(zoomVars_design.origin);
    designStage.scale({ x: 1, y: 1 });
    
    /*Set up mouse tip*/
    var mouseTip = new Konva.Rect({
        width: 6,
        height: 6,
        opacity:0,
        fill: '#FFCC00',
        stroke: '#FFCC00'
    });
    tipLayer.add(mouseTip);
    /* Set up length indicator */
    var lenShape = new Konva.Line({
        points:[],
        opacity: 1,
        strokeWidth: 1,
        stroke: '#000',
        dash:[7,5]
    });
    lenLayer.add(lenShape);
    /* Set up length text*/
    var lenText = new Konva.Text({
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 12
    });
    lenLayer.add(lenText);

    var lenSide = new Konva.Line({
        points:[],
        opacity: 1,
        strokeWidth: 1,
        stroke: '#000',
        dash:[7,5]
    });
    lenLayer.add(lenSide);

    /*Mouse handlers*/
    //remove default behaviour for the container
    $("#designContainer").on('mousedown', function(e){
        e.preventDefault();
    });
    $("#designContainer").on('contextmenu', function(e){
        e.preventDefault();
    });


    //mouse handlers on stage
    designStage.on('contentMousedown', function (e) {
        if(e.evt.button == 0){
            designStage.draggable(false);
        }
        else{
            designStage.draggable(true);            
            return;
        }
        if(mouseMode == 0){ //draw mode
            var startPoint = {x:(mouseTip.attrs.x+3), y:(mouseTip.attrs.y+3)};
            if(!isDrawing){
                if(!isIntersection(startPoint)){ //cannot be intersection to avoid crosses

                    //check if there's an intersection on the begining
                    if(isCorner(startPoint)){
                        intersectingSeg = false;
                        intersectingCorner = true;
                        console.log('intersectingSeg = false')
                    }
                    else{
                        //check if its on an existing segment and that segment it s not connected to a t-piece
                        var isonseg = isOnSegment(startPoint);

                        if(isonseg.b){
                            var aux = compareArraySegment(isonseg.i, isonseg.d);

                            if(segsArray[aux].canDraw){
                                //validate resulting segments length
                                var intercected = getSegmentsArray(isonseg.d)[isonseg.i];
                                var res = breakSegAtIntersection(startPoint,intercected);
                                if(isValidLength(res[0].start,res[0].end) && isValidLength(res[1].start,res[1].end)){
                                    intersectingSeg = true;
                                    intersectingCorner = false;
                                    console.log('>>>>>>>Intersecting Segment at start')
                                }
                                else{
                                    consoleAdd(strings.too_small);
                                    return;
                                }
                            }
                            else{
                                consoleAdd("can only draw on seg limits");
                                return;
                                
                            }
                         } 
                        // else{
                        //     var isonlim = isOnSegLimit(startPoint);
                        //     if(isonlim.b){
                        //         if(!segsArray[isonlim.i].canDraw){
                        //             consoleAdd(strings.t_piece_impossible);
                        //             return;
                        //         }
                        //     }
                        // }
                    }
                    //start drawing
                    drawShape = new Konva.Line({
                        points: [startPoint.x, startPoint.y],
                        strokeWidth: 15,
                        stroke: 'black',
                        opacity: 0.5,
                        dir:'h'
                    });
                    drawShape.on('mouseover', function (e) {
                        if(mouseMode == 1){
                            this.stroke('#031C4D');
                            drawLayer.draw();
                        }
                    });
                    drawShape.on('mouseout', function (e) {
                        if(mouseMode == 1){
                            this.stroke('black');
                            drawLayer.draw();
                        }						
                    });
                    drawShape.on('mouseup', function (e) {
                        if(mouseMode == 1){
                            this.stroke('#092C70');
                            drawLayer.draw();
                        }
                    });
                    segGrp.add(drawShape);
                    drawLayer.add(segGrp);
                    drawLayer.draw();
                    isDrawing = true;
                }
                else{
                    consoleAdd(strings.cant_start_intersection);
                }
                gridLayer.draw();
            }
        }
    });
    designStage.on('contentMousemove', function (e) {
        // zoomVars_design.origin = {x: 0, y: 0};
        if(mouseMode == 0){ //draw mode
            var mousePos = designStage.getPointerPosition();
            var stageOffset = {x:designStage.offsetX(), y: designStage.offsetY()};
            //set mousetip position 
            mouseTip.opacity(1);
            var pointTo = { x:Math.round(mousePos.x/zoomVars_design.scale - (zoomVars_design.origin.x)/zoomVars_design.scale + stageOffset.x),
                            y:Math.round(mousePos.y/zoomVars_design.scale - (zoomVars_design.origin.y)/zoomVars_design.scale + stageOffset.y)
            }
            mouseTip.position({
                x: (Math.round(pointTo.x / blockSnapSize) * blockSnapSize)-3,
                y: (Math.round(pointTo.y / blockSnapSize) * blockSnapSize)-3
            });
            mousePos = {
                x: (Math.round(pointTo.x / blockSnapSize) * blockSnapSize)-3,
                y: (Math.round(pointTo.y / blockSnapSize) * blockSnapSize)-3
            };
            if(isDrawing && drawShape){
                //move line that's being drawn
                var points = drawShape.attrs.points;
                var dir;
                if(points.length == 2){
                    //started dragging
                    if(
                        (points[0] != Math.round(mousePos.x / blockSnapSize) * blockSnapSize) ||
                        (points[1] != Math.round(mousePos.y / blockSnapSize) * blockSnapSize)
                    ){
                        points[2] = Math.round(mousePos.x / blockSnapSize) * blockSnapSize; //P2 - x
                        points[3] = Math.round(mousePos.y / blockSnapSize) * blockSnapSize; //P2 - y
                    }
                }
                else{
                    if(points[0] == points[2] && points[1] == points[3]){
                        //if user returned to start point
                        points=[points[0],points[1]];
                    }
                    else{
                        var auxP; //temporary point being drawn 
                        //TODO: check auxS definition - temporary segment being drawn
                        if(points[0] != points[2]){
                            //horizontal
                            auxP = {x: Math.round(mousePos.x / blockSnapSize) * blockSnapSize, y: points[1]};
                            auxS = {
                                start: {x: points[0], y:points[1]},
                                end: {x: Math.round(mousePos.x / blockSnapSize) * blockSnapSize, y: points[1]}
                            };
                            dir = 'h';
                            //stop at intersection
                            if(!currInt){
                                if(!intersectsLine('v', auxS)){
                                    points[2] = auxP.x; //P2 - x
                                    points[3] = auxP.y; //P2 - y                                    
                                }
                                else{
                                    //first intersection
                                    points[2] = currInt.x; //P2 - x
                                    points[3] = currInt.y; //P2 - y                                    
                                }
                            }
                            else{
                                //check if still is intersecting
                                if(!intersectsLine('v', auxS)){
                                    points[2] = auxP.x; //P2 - x
                                    points[3] = auxP.y; //P2 - y
                                    currInt = null;
                                }
                            }
                        }
                        else{
                            //vertical
                            auxP = {x: points[0], y: Math.round(mousePos.y / blockSnapSize) * blockSnapSize};
                            auxS = {
                                start: {x: points[0], y:points[1]},
                                end: {x:points[0], y:Math.round(mousePos.y / blockSnapSize) * blockSnapSize}
                            };
                            dir = 'v';
                            //stop at intersection
                            if(!currInt){
                                // console.log('no current intersection');
                                if(!intersectsLine('h', auxS)){
                                    points[2] = auxP.x; //P2 - x
                                    points[3] = auxP.y; //P2 - y                                    
                                }
                                else{
                                    //first intersection
                                    points[2] = currInt.x; //P2 - x
                                    points[3] = currInt.y; //P2 - y
                                }
                            }
                            else{
                                //check if still is intersecting								
                                if(!intersectsLine('h', auxS)){
                                    points[2] = auxP.x; //P2 - x
                                    points[3] = auxP.y; //P2 - y
                                    currInt = null;
                                }
                            }
                        }
                    }
                }
                //draw layer
                drawShape.attrs.points = points;
                drawShape.attrs.dir = dir;
                drawLayer.batchDraw();
                //grid layer
                //length shape calculation
                var lenPoints = points.slice();                
                if(dir === 'v'){
                    //length dashed line

                    //add extra points for length display (2 on the beginning and 2 on the end). The height of the display is 25
                    lenPoints.unshift(points[1]);
                    lenPoints.unshift(points[0]+25);
                    lenPoints.push(points[points.length-2]+25);
                    lenPoints.push(points[points.length-1]);                                        
                    lenShape.attrs.points = lenPoints;
                    lenShape.offsetX(25);
                    lenShape.offsetY(0);

                    lenText.rotation(90);
                    lenText.x(points[0]-40);
                    lenText.y(points[1]);
                    if(points[1] > points[3])
                        lenText.y(points[3]);
                }else{
                    //length dashed line
                    //add extra points for length display (2 on th beginning and 2 on the end). The hight of the display is 25
                    lenPoints.unshift(points[1]+25);
                    lenPoints.unshift(points[0]);
                    lenPoints.push(points[points.length-2]);
                    lenPoints.push(points[points.length-1]+25);

                    lenShape.attrs.points = lenPoints;
                    lenShape.offsetY(25);
                    lenShape.offsetX(0);

                    lenText.rotation(0);                    
                    lenText.y(points[1]-40);
                    lenText.x(points[0]);
                    if(points[0] > points[2])
                        lenText.x(points[2]);
                }                
                //length text calculation
                var lenaux = getSegLength({start:{x:points[0],y:points[1]},end:{x:points[2],y:points[3]}});
                lenText.text(lenaux +' mm');
                lenaux = lenaux/gridSizeInMM * gridSize;
                lenText.width(lenaux);
                lenText.visible(true);
                lenShape.visible(true);
                if(points.length == 2){
                    lenText.visible(false);
                    lenShape.visible(false);
                }
                mouseTip.position({
                    x: points[2]-3,
                    y: points[3]-3
                });

            }
            //grid layer
            gridLayer.batchDraw();
            //len layer
            lenLayer.batchDraw();
            //tip layer
            tipLayer.batchDraw();
            tipLayer.moveToTop();
        }
        if(mouseMode==1){ //selection mode
            //hide mouse tip
            mouseTip.opacity(0);
            tipLayer.batchDraw();
        }
    });
    designStage.on('contentMouseup', function (e) {
        // console.log('triggered mouseup');
        if(mouseMode == 0 && e.evt.button == 0){ //draw mode
            if(isDrawing){
                //evaluate if valid shape
                var points = drawShape.attrs.points;
                var startPoint = {x:points[0], y:points[1]};
                var endPoint = {x:points[2], y:points[3]};

                addedSegment = true;

                if(points.length==2){
                    drawShape.destroy();
                    intersectingSeg = false;
                    intersectingCorner = false;
                    addedSegment = false;
                }else{
                    //evaluate if valid for shielded or wall mounted
                    if(opticsMode == 2 || wallMount){
                        if(segsArray.length !=0){
                            if(drawShape.attrs.dir !== shieldedDir){
                                //not valid
                                drawShape.destroy();
                                intersectingSeg = false;
                                intersectingCorner = false;
                                currInt = null;
                                endPoint = startPoint;
                                consoleAdd(strings.cant_standard);
                                addedSegment = false

                                //stop drawing
                                drawShape.opacity(1);
                                isDrawing = false;
                                drawShape = null;
                                lenShape.visible(false);
                                lenText.visible(false);

                                //recalculate
                                reCalculateDesign();
                                return;
                            }
                        }
                        else{
                            shieldedDir = drawShape.attrs.dir;
                        }
                    }
                    if(!isValidLength(startPoint,endPoint)){
                        //check if it's the continuation of an existing segment
                        if(getOverlapSeg({start:startPoint, end:endPoint}).b && !isCorner(startPoint) && !isCorner(endPoint)){
                            //valid, continue
                        }
                        else{
                            //length is not valid
                            drawShape.destroy();
                            intersectingSeg = false;
                            intersectingCorner = false;
                            currInt = null;
                            endPoint = startPoint;
                            consoleAdd(strings.too_small);
                            addedSegment = false
                        }
                    }
                    else{
                        //draw of extended segment
                        if(!intersectingSeg && !intersectingCorner && !currInt){
                            if(segsArray.length !== 0){
                                if(!isOnSegLimit(startPoint).b && !isOnSegLimit(endPoint).b){
                                    //make sure is continuation of existing, or start of new drawing
                                    drawShape.destroy();
                                    intersectingSeg = false;
                                    intersectingCorner = false;
                                    currInt = null;
                                    endPoint = startPoint;
                                    consoleAdd(strings.dsgnConsole_err0);
                                    addedSegment = false
                                }
                            }
                        }
                    }
                }
                //Intersection on END
                // if(currInt){
                //     //has intersection at the end

                //     if(!isIntersection(currInt)){
                //         if(isCorner(currInt)){
                //             //make sure the segment goes to the intersection
                //             drawShape.attrs.points[2] = currInt.x;
                //             drawShape.attrs.points[3] = currInt.y;
                //             tConnArray.push({x:currInt.x,y:currInt.y,checked:false});
                //             ///////////////////////////////// ADD_INTERSECTION
                //         }
                //         else{
                //             //check if its on an existing segment
                //             var isonseg = isOnSegment(currInt);
                //             if(isonseg.b){
                //                 var aux = compareArraySegment(isonseg.i, isonseg.d);

                //                 if(segsArray[aux].canDraw){
                //                     //validate resulting segments length
                //                     var intercected = getSegmentsArray(isonseg.d)[isonseg.i];
                //                     var res = breakSegAtIntersection(currInt,intercected);
                                    
                //                     // if(isValidLength(res[0].start,res[0].end) && isValidLength(res[1].start,res[1].end)){
                //                     if( isValidInterLength(res[0].start,res[0].end,0) &&
                //                         isValidInterLength(res[1].start,res[1].end,0) && 
                //                         isValidInterLength(startPoint,currInt,1)){
                //                         //make sure the segment goes to the intersection
                //                         drawShape.attrs.points[2] = currInt.x;
                //                         drawShape.attrs.points[3] = currInt.y;
                //                         tConnArray.push({x:currInt.x,y:currInt.y,checked:false});
                //                         currInt = null;
                //                         ///////////////////////////////// ADD_INTERSECTION
                //                     }
                //                     else{
                //                         //remove shape
                //                         drawShape.destroy();                                    
                //                         isDrawing = false;
                //                         drawShape = null;
                //                         lenShape.visible(false);
                //                         lenText.visible(false);
                //                         consoleAdd(strings.too_small);
                //                         addedSegment = false;
                //                         //recalculate
                //                         reCalculateDesign();
                //                         return;
                //                         }
                //                     }
                //                     else{
                //                         //remove shape
                //                         drawShape.destroy();                                    
                //                         isDrawing = false;
                //                         drawShape = null;
                //                         lenShape.visible(false);
                //                         lenText.visible(false);
                //                         consoleAdd("can t connect to a segment on T-Piece");
                //                         addedSegment = false;
                //                         //recalculate
                //                         reCalculateDesign();
                //                         return;
                //                     }
                //                 }
                //             else{
                //                 //remove shape
                //                 drawShape.destroy();                                    
                //                 isDrawing = false;
                //                 drawShape = null;
                //                 lenShape.visible(false);
                //                 lenText.visible(false);
                //                 consoleAdd(strings.too_small);
                //                 addedSegment = false;
                //                 //recalculate
                //                 reCalculateDesign();
                //                 return;
                //             }
                //         }
                //     }
                //     else{
                //         //remove shape
                //         drawShape.destroy();
                //         isDrawing = false;
                //         drawShape = null;
                //         lenShape.visible(false);
                //         lenText.visible(false);
                //         consoleAdd(strings.cant_end_intersection);
                //         addedSegment = false;
                //         //recalculate
                //         reCalculateDesign();
                //         return;
                //     }
                // }
                // else{
                //     //double check if it's not intersecting corner at the end
                //     if(isCorner(endPoint) && endPoint != startPoint && isNotEndOrStartCantDraw(endPoint)){
                //         //make sure the segment goes to the intersection
                //         drawShape.attrs.points[2] = endPoint.x;
                //         drawShape.attrs.points[3] = endPoint.y;
                //         tConnArray.push({x:endPoint.x,y:endPoint.y,checked:false});
                //         ///////////////////////////////// ADD_INTERSECTION
                //     } else{
                //         //double check if it's not intersecting an existing intersection at the end
                //         if(isIntersection(endPoint) && endPoint != startPoint){
                //             //remove shape
                //             drawShape.destroy();
                //             isDrawing = false;
                //             drawShape = null;
                //             lenShape.visible(false);
                //             lenText.visible(false);
                //             consoleAdd(strings.cant_end_intersection);
                //             addedSegment = false;
                //             //recalculate
                //             reCalculateDesign();
                //             return;
                //         }
                //     }
                // }
                //Intersection on START
                //check if it was corner
                if(intersectingCorner){
                    
                    // var intaux = isOnSegment(startPoint);
                    // if(intaux.b){
                    //     if(intaux.d != drawShape.attrs.dir){
                    //         if( isValidInterLength(res[0].start,res[0].end,0) &&
                    //             isValidInterLength(res[1].start,res[1].end,0) && 
                    //             isValidInterLength(startPoint,endPoint,1) ){                
                    //         }
                    //         else{
                    //             //remove shape
                    //             drawShape.destroy();
                    //             reCalculateDesign();
                    //             isDrawing = false;
                    //             drawShape = null;
                    //             lenShape.visible(false);
                    //             lenText.visible(false);
                                //consoleAdd(strings.too_small);
                    //             return;
                    //         }
                    //     }
                    // }
                    if(isValidSegment(startPoint) !== false){
                    //intersection on start
                    tConnArray.push({x:startPoint.x,y:startPoint.y,checked:false});
                    intersectingCorner = false;
                    }
                    else
                    {
                        drawShape.destroy();
                        isDrawing = false;
                        drawShape = null;
                        lenShape.visible(false);
                        lenText.visible(false);
                        consoleAdd(strings.too_small);
                        addedSegment = false;
                        //recalculate
                        reCalculateDesign();
                        return;
                    }
                    ///////////////////////////////// ADD_INTERSECTION
                }
                if(currInt)
                {
                    drawShape.destroy();
                    isDrawing = false;
                    drawShape = null;
                    lenShape.visible(false);
                    lenText.visible(false);
                    consoleAdd("new string for this situation");
                    addedSegment = false;
                    //recalculate
                    reCalculateDesign();
                    return;
                }
                
                // if(intersectingSeg){
                //     var intaux = isOnSegment(startPoint);
                //     var intauxEndLim = isOnSegLimit(endPoint);
                //     var intauxEnd = isOnSegment(endPoint);
                //     // var auxEndLim = compareArraySegment(intauxEndLim.i, intauxEndLim.d);
                //     // var auxEnd = compareArraySegment(intauxEnd.i, intauxEnd.d);


                //     if(intaux.b && !intauxEnd.b && !intauxEndLim.b){

                //         if(intaux.d != drawShape.attrs.dir){
                //             //validate resulting segments length
                //             var intercected = getSegmentsArray(intaux.d)[intaux.i];
                //             var res = breakSegAtIntersection(startPoint,intercected);
                //             if( isValidInterLength(res[0].start,res[0].end,0) &&
                //                 isValidInterLength(res[1].start,res[1].end,0) &&
                //                 isValidInterLength(startPoint,endPoint,1) ){
                //                     //intersection on start
                //                     tConnArray.push({x:startPoint.x,y:startPoint.y,checked:false});
                //                     intersectingSeg = false;
                //                     ///////////////////////////////// ADD_INTERSECTION
                //             }
                //             else{
                //                 //remove shape
                //                 drawShape.destroy();
                //                 isDrawing = false;
                //                 drawShape = null;
                //                 lenShape.visible(false);
                //                 lenText.visible(false);
                //                 consoleAdd(strings.too_small);
                //                 addedSegment = false;
                //                 //recalculate
                //                 reCalculateDesign();
                //                 return;
                //             }
                //         }
                        

                        
                //     }
                    
                //     else
                //     {
                //         if(intauxEnd.i != -1 && intauxEnd.b)
                //         {
                //             var aux = compareArraySegment(intauxEnd.i, intauxEnd.d);

                //             if(!segsArray[aux].canDraw)
                //             {
                                
                //                 drawShape.destroy();
                //                 isDrawing = false;
                //                 drawShape = null;
                //                 lenShape.visible(false);
                //                 lenText.visible(false);
                //                 consoleAdd("can t draw on to T Piece");
                //                 addedSegment = false;
                //                 //recalculate
                //                 reCalculateDesign();
                //                 return;
                //             }
                //         }
                //         else
                //         {
                //             if(intauxEndLim.b && !segsArray[intauxEndLim.i].canDraw)
                //             {
                //                 drawShape.destroy();
                //                 isDrawing = false;
                //                 drawShape = null;
                //                 lenShape.visible(false);
                //                 lenText.visible(false);
                //                 consoleAdd("can t draw on to T Piece");
                //                 addedSegment = false;
                //                 //recalculate
                //                 reCalculateDesign();
                //                 return;
                //             }
                //         }

                //     }
                // }
                //stop drawing
                drawShape.opacity(1);
                isDrawing = false;
                drawShape = null;
                lenShape.visible(false);
                lenText.visible(false);
            }
            // //enable undo button
            // $('#undoButton').removeClass();
            // $('#calcButton').removeClass();
            //recalculate
            reCalculateDesign();
            OuterDimensions();
        }
    });

    /*Zoom handler */
    $("#designContainer").on("mousewheel", function(e){
    // designStage.on('wheel', e => {
        e.preventDefault(); 
        var oldScale = designStage.scaleX();
        var mousePointTo = {
            x: designStage.getPointerPosition().x / oldScale - designStage.x() / oldScale,
            y: designStage.getPointerPosition().y / oldScale - designStage.y() / oldScale
        };
        var newScale = e.originalEvent.deltaY < 0 ? oldScale * zoomVars_design.factor : oldScale / zoomVars_design.factor;
        if(newScale > maxScale || newScale < minScale)
            return;
        designStage.scale({ x: newScale, y: newScale });
        var newPos = {
            x: -(mousePointTo.x - designStage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - designStage.getPointerPosition().y / newScale) * newScale
        };
        designStage.position(newPos);
        designStage.batchDraw();

        /*Save zoom data - scale and offset*/
        zoomVars_design.scale = newScale;
        zoomVars_design.origin = newPos;
    });
    /* Drag Handlers */
    designStage.on('dragstart', function (e) {
        //change cursor
        $('#designContainer').css('cursor','grab');
    });
    // designStage.on('dragmove', function (e) {
    //     console.log(this.position());
    // });
    designStage.on('dragend', function (e) {
        //change cursor
        $('#designContainer').css('cursor','crosshair');
        //reposition mousePointer
        zoomVars_design.origin = designStage.position();
    });
    // designStage.add(gridLayer);
    designStage.add(gridLayer,drawLayer,tipLayer,lenLayer);
    designStage.draw();
}


function redrawSegments(segArray){
    drawLayer.destroy();
    segGrp = new Konva.Group({name:'segments'});
    cornGrp = new Konva.Group({name:'corners'});
    tGrp = new Konva.Group({name:'tconnections'});
    lenGrp = new Konva.Group({name:'lengths'});
    /* SEGMENTS */
    for(var i=0;i<segArray.length;i++){
        drawShape = new Konva.Line({
            points: [segArray[i].start.x, segArray[i].start.y,
                    segArray[i].end.x, segArray[i].end.y],
            strokeWidth: 15,
            stroke: 'black',
            opacity: 1,
            dir:'',
            id:i
        });
        if(drawShape.attrs.points[0]==drawShape.attrs.points[2])
            drawShape.attrs.dir = 'v';
        else if(drawShape.attrs.points[1]==drawShape.attrs.points[3])
            drawShape.attrs.dir = 'h';
        drawShape.on('mouseover', function (e) {
            if(mouseMode == 1 && selSegment !== e.target.attrs.id){
                this.stroke('#092C70');
                drawLayer.draw();
            }
        });
        drawShape.on('mouseout', function (e) {
            if(mouseMode == 1 && selSegment !== e.target.attrs.id){
                this.stroke('black');
                drawLayer.draw();
            }
        });
        drawShape.on('mouseup', function (e){
            if(mouseMode == 1){
                if(selSegment !== null){
                    var aux = getDesignSegByID(selSegment);
                    if(aux !== -1)
                        segGrp.children[aux].stroke('black');
                    selSegment = null;
                }
                selSegment = e.target.attrs.id;
                this.stroke('#264F9F');
                drawLayer.draw();
                //make delete button active
                $('#delButton').removeClass('btn_disabled');
            }
        });
        segGrp.add(drawShape);

        //Length indicator
        var lenTxt = new Konva.Text({
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 12,
            resizeEnabled:true
        });        

          if(drawShape.attrs.dir === 'v'){
            lenTxt.rotation(90);
            lenTxt.x(drawShape.attrs.points[0]-18);
            lenTxt.y(drawShape.attrs.points[1]);
            if(drawShape.attrs.points[1] > drawShape.attrs.points[3])
                lenTxt.y(drawShape.attrs.points[3]);
        }else{
            //length dashed line
            lenTxt.rotation(0);                    
            lenTxt.y(drawShape.attrs.points[1]-25);
            lenTxt.x(drawShape.attrs.points[0]);
            if(drawShape.attrs.points[0] > drawShape.attrs.points[2])
                lenTxt.x(drawShape.attrs.points[2]);
        }                
        lenTot = getSegLength(segArray[i]);
        lenTxt.text(lenTot +' mm');
        lenTxt.width(lenTot/gridSizeInMM * gridSize);
        lenGrp.add(lenTxt);

    }

    drawLayer.add(segGrp);
    drawLayer.add(lenGrp); 
   


    /* CORNERS */
    var corners = calculateCorners();
    //draw corners
    for(var i=0;i<corners.length;i++){
        var cpoints = [];
        switch(corners[i].t){
            case 0:
                cpoints = [ corners[i].c.x,corners[i].c.y+(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x+(gridSize*2),corners[i].c.y ];
                break;
            case 1:
                cpoints = [ corners[i].c.x,corners[i].c.y-(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x+(gridSize*2),corners[i].c.y ];
                break;
            case 2:
                cpoints = [ corners[i].c.x,corners[i].c.y-(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x-(gridSize*2),corners[i].c.y ];
                break;
            case 3:
                cpoints = [ corners[i].c.x,corners[i].c.y+(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x-(gridSize*2),corners[i].c.y ];
                break;
        }
        drawShape = new Konva.Line({
            points: cpoints,
            strokeWidth: 16,
            stroke: '#777',
            opacity: 1
        });
        // drawShape = new Konva.Rect({
        //     width: 15,
        //     height: 15,
        //     fill: '#FFCC00',
        //     stroke: '#FFCC00'
        // });
        // drawShape.position({
        //     x: corners[i].x-7,
        //     y: corners[i].y-7
        // });			
        cornGrp.add(drawShape);
    }
    drawLayer.add(cornGrp);
    segsArray.forEach(function(element)
    {

        element.canDraw = false;

    });
    /* T-PIECES */    
    for(var i=0;i<tConnArray.length;i++){
        var intpoints = [];
        var interType = getInterType(tConnArray[i]);
        switch(getInterType(tConnArray[i])){
            //horizontal
            case 0:
                intpoints = [
                    tConnArray[i].x, tConnArray[i].y + gridSize,
                    tConnArray[i].x, tConnArray[i].y - gridSize,
                    tConnArray[i].x, tConnArray[i].y,
                    tConnArray[i].x + t_connLength, tConnArray[i].y
                ];
                break;
            //vertical
            case 1:
                intpoints = [
                    tConnArray[i].x - gridSize, tConnArray[i].y,
                    tConnArray[i].x + gridSize, tConnArray[i].y,
                    tConnArray[i].x, tConnArray[i].y,
                    tConnArray[i].x, tConnArray[i].y + t_connLength
                ];
                break;
            //horizontal
            case 2:
                intpoints = [
                    tConnArray[i].x, tConnArray[i].y + gridSize,
                    tConnArray[i].x, tConnArray[i].y - gridSize,
                    tConnArray[i].x, tConnArray[i].y,
                    tConnArray[i].x - t_connLength, tConnArray[i].y
                ];
                break;
            //vertical
            case 3:
                intpoints = [
                    tConnArray[i].x - gridSize, tConnArray[i].y,
                    tConnArray[i].x + gridSize, tConnArray[i].y,
                    tConnArray[i].x, tConnArray[i].y,
                    tConnArray[i].x, tConnArray[i].y - t_connLength
                ];
                break;
        }

        drawShape = new Konva.Line({
            points: intpoints,
            strokeWidth: 15,
            stroke: '#777',
            opacity: 1
        });
        // drawShape = new Konva.Rect({
        //     width: 15,
        //     height: 15,
        //     fill: '#FFCC00',
        //     stroke: 'red'
        // });
        // drawShape.position({
        //     x: tConnArray[i].x-7,
        //     y: tConnArray[i].y-7
        // });
        tGrp.add(drawShape);

    }
    drawLayer.add(tGrp);
    designStage.add(drawLayer);
    designStage.draw();

    //put intertype on the t-piece
    // tConnArray.forEach(function(element)
    // {
    //     if(element.checked == false)

    //     element.interType = interType;
    //     element.checked = true;

    // });
    // getSegmentAttached();

    //can add the function to the length
}
window.addEventListener('resize', () => {
    var width = $('#designContainer').width();
    var height = $('#designContainer').height();
    designStage.width(width);
    designStage.height(height);

  });
function getDesignSegByID(id){
    for(var i=0; i<segGrp.children.length; i++){
        if(segGrp.children[i].attrs.id === id)
            return i;
    }
    return -1;
}
//get the segment that we can t attach with a false canDraw
function getSegmentAttached()
{
    var arr = normalizeSegArray(segsArray); //start < end    


    for(var i = 0; i < tConnArray.length;i++)
    {
        for(var j = 0; j < arr.length;j++)
        {
            if(tConnArray[i].interType == 1)
            {
                if(tConnArray[i].x == arr[j].start.x && tConnArray[i].x == arr[j].end.x 
                    && tConnArray[i].y == arr[j].start.y && tConnArray[i].y < arr[j].end.y
                    && segsArray[j].canDraw)
                    segsArray[j].canDraw = false;
            }
            else if(tConnArray[i].interType == 3)
            {
                if(tConnArray[i].x == arr[j].start.x && tConnArray[i].x == arr[j].end.x
                    && tConnArray[i].y == arr[j].end.y && tConnArray[i].y > arr[j].start.y
                    && segsArray[j].canDraw)
                    segsArray[j].canDraw = false;

            }
            else if(tConnArray[i].interType == 2)
            {
                if(tConnArray[i].y == arr[j].start.y && tConnArray[i].y == arr[j].end.y
                    && tConnArray[i].x == arr[j].end.x && tConnArray[i].x > arr[j].start.x
                    && segsArray[j].canDraw)
                    segsArray[j].canDraw = false;

            }

            else
            {
                if(tConnArray[i].y == arr[j].start.y && tConnArray[i].y == arr[j].end.y
                    && tConnArray[i].x == arr[j].start.x && tConnArray[i].x < arr[j].end.x
                    && segsArray[j].canDraw)
                    
                    segsArray[j].canDraw = false;
            }
        }
    }
}

// function isNotEndOrStartCantDraw(point)
// {
//     for(var i = 0; i < segsArray.length; i++)
//     {
//         if(segsArray[i].canDraw == false)  
//         {
//             if(point.x == segsArray[i].start.x || point.x == segsArray[i].end.x || point.y == segsArray[i].start.y || point.y == segsArray[i].end.y)
//             {
//                 return false;
//             }
//         }
//         else
//         {
//             return true;
//         }
//     }
// }
// //checkl if it it s a valid segment to attach
// function isValidSegment(startPoint)
// {
//     for(var i = 0; i < segsArray.length; i++)
//     {
//         if(segsArray[i].start.x == segsArray[i].end.x)
//         //vertical
//         {
//             if(segsArray[i].start.y>segsArray[i].end.y)
//             {

//                 if(segsArray[i].start.y < startPoint.y < segsArray[i].end.y && startPoint.x == segsArray[i].start.x
//                     && !segsArray[i].canDraw)
//                     {
//                         return false;
//                     }
//             }
//             else
//             {
//                 if(segsArray[i].end.y < startPoint.y < segsArray[i].start.y && startPoint.x == segsArray[i].end.x
//                     && !segsArray[i].canDraw)
//                     {
//                         return false;
//                     }
//             }
//         }
//         else
//         //horizontal
//         {
//             if(segsArray[i].start.y>segsArray[i].end.y)
//             {

//                 if(segsArray[i].start.x < startPoint.x < segsArray[i].end.x && startPoint.y == segsArray[i].start.y
//                     && !segsArray[i].canDraw)
//                     {
//                         return false;
//                     }

//             }
//             else
//             {
//                 if(segsArray[i].end.x < startPoint.x < segsArray[i].start.x && startPoint.y == segsArray[i].end.y
//                     && !segsArray[i].canDraw)
//                     {
//                         return false;
//                     }
    
//             }
            
//         }
//     }
// }



function reCalculateDesign(){
    var segArray = getSegmentsArray();
    //clean overlapping segments
    console.log('Original Array:'+ segArray.length);
    segArray = cleanOverlap(segArray);
    segsArray = segArray;
    console.log('Cleaned Array:'+ segArray.length);
    //check intersections
    calculateNewSegments();

    //check corners
    calculateCorners();
    cleanDisconnected(segsArray);

    //validate lengths with last added segment
    if(addedSegment){
        addedSegment = false;
        //do stuff
        console.log("~~~~~ Added Segment ! ");

        //check if the added segment results in a valid design
        if(!hasValidLengths()){
            console.log("~~~~~ Valid? FALSE");
            consoleAdd(strings.segmentValidate);
            //remove last segment

            segGrp.children.pop();
            reCalculateDesign();
        }
    }
    redrawSegments(segsArray);
    designHasChanged = true;
}
function hasValidLengths(){
    /* Segment array should be normalized - start < end */
    var arr = normalizeSegArray(segsArray); //start < end    

    for(var i=0; i<arr.length; i++){
        var newStart = arr[i].start, newEnd = arr[i].end;
        var cornLen = 2*gridSize, intLenSmall = 1*gridSize, intLenBig=t_connLength;
        var length = 0;

        if(arr[i].start.x == arr[i].end.x){ //vertical  
            //start
            if(isCorner(arr[i].start)){
                newStart = {x: arr[i].start.x, y: arr[i].start.y+cornLen};
            }
            else if(isIntersection(arr[i].start)){
                var t_type = getInterType(arr[i].start);
                if(t_type == 0 || t_type == 2){
                    newStart = {x: arr[i].start.x, y: arr[i].start.y+intLenSmall};
                }else{
                    newStart = {x: arr[i].start.x, y: arr[i].start.y+intLenBig};
                }          
            }
            //end
            if(isCorner(arr[i].end)){
                newEnd = {x: arr[i].end.x, y: arr[i].end.y-cornLen};
            }
            else if(isIntersection(arr[i].end)){
                var t_type = getInterType(arr[i].end);
                if(t_type == 0 || t_type == 2){
                    newEnd = {x: arr[i].end.x, y: arr[i].end.y-intLenSmall};
                }else{
                    newEnd = {x: arr[i].end.x, y: arr[i].end.y-intLenBig};
                } 
            }

            length = newEnd.y - newStart.y;

        }
        else{ //horizontal
            //start
            if(isCorner(arr[i].start)){
                newStart = {x: arr[i].start.x+cornLen, y: arr[i].start.y};                
            }
            else if(isIntersection(arr[i].start)){
                var t_type = getInterType(arr[i].start);
                if(t_type == 0 || t_type == 2){
                    newStart = {x: arr[i].start.x+intLenBig, y: arr[i].start.y};
                }else{
                    newStart = {x: arr[i].start.x+intLenSmall, y: arr[i].start.y};
                } 
            }
            //end
            if(isCorner(arr[i].end)){
                newEnd = {x: arr[i].end.x-cornLen, y: arr[i].end.y};
            }
            else if(isIntersection(arr[i].end)){
                var t_type = getInterType(arr[i].end);
                if(t_type == 0 || t_type == 2){
                    newEnd = {x: arr[i].end.x-intLenBig, y: arr[i].end.y};
                }else{
                    newEnd = {x: arr[i].end.x-intLenSmall, y: arr[i].end.y};
                } 
            }
            length = newEnd.x - newStart.x;            
        }
        if(length<0 || (length>0 && length<minLenght)){
            return false;
        }
    }
    return true;
}
function getSegmentsArray(dir){
    var out = [];
    segGrp.children.forEach(function(e){
        var start = {x:e.attrs.points[0], y:e.attrs.points[1]};
        var end = {x:e.attrs.points[2], y:e.attrs.points[3]};
        var checked = false;
        if(dir == 'h' || dir === 'v'){
            if(e.attrs.dir == dir)
                out.push({start:start,end:end,canDraw:checked});
        }
        else //all
            out.push({start:start,end:end,canDraw:checked});
    });
    return out;
}
function getPointsArray(){
    var out = [];
    segsArray.forEach(function(e){
        // var start = {x:e.attrs.points[0], y:e.attrs.points[1]};
        // var end = {x:e.attrs.points[2], y:e.attrs.points[3]};
        out.push(e.start);
        out.push(e.end);
        
    });
    return out;
}
function cleanOverlap(arr){
    var old_out = arr.slice();
    var new_out = [];
    for(var i=0; i<old_out.length; i++){
        new_out = cleanSegOverlap(i,old_out);
        if(new_out.length != old_out.length){
            //found overlap, check overlap of new array
            return cleanOverlap(new_out);
        }
    }
    return new_out;
}
function cleanSegOverlap(index,array){
    var aux_out = array.slice();
    var saux = null;
    for(var i=0; i<array.length; i++){
        if(i!=index){
            saux = getOverlap(array[index],array[i]);
            if(saux){
                //take out old segments
                if(index>i){
                    aux_out.splice(index, 1);
                    aux_out.splice(i, 1);
                }
                else{
                    aux_out.splice(i, 1);
                    aux_out.splice(index, 1);						
                }
                //put new one
                aux_out.push(saux);
                break;
            }
        }
    }
    return aux_out;
}
function getOverlap(s1, s2) {
    var canDraw = false;
    var p1 = {x: s1.start.x, y: s1.start.y};
    var p2 = {x: s1.end.x, y: s1.end.y};		
    var p3 = {x: s2.start.x, y: s2.start.y};
    var p4 = {x: s2.end.x, y: s2.end.y};

    var s1_s={x:p1.x,y:p1.y};
    var s1_e={x:p2.x,y:p2.y};		
    var s2_s={x:p3.x,y:p3.y};
    var s2_e={x:p4.x,y:p4.y};

    var out_s={x:0,y:0};
    var out_e={x:0,y:0};

    if(p1.x==p2.x&&p1.x==p3.x&&p1.x==p4.x){
        //order points			
        if(p1.y>p2.y){
            s1_s={x:p2.x,y:p2.y};
            s1_e={x:p1.x,y:p1.y};
        }			
        if(p3.y>p4.y){
            s2_s={x:p4.x,y:p4.y};
            s2_e={x:p3.x,y:p3.y};
        }
        //check if overlap
        if(s1_e.y>=s2_s.y && s1_s.y<=s2_e.y){
            //overlap
            if(s2_s.y<=s1_s.y){
                out_s.y=s2_s.y;
                out_s.x=s2_s.x;
            }
            else{
                out_s.y=s1_s.y;
                out_s.x=s1_s.x;
            }
            if(s2_e.y<=s1_e.y){
                out_e.y=s1_e.y;
                out_e.x=s1_e.x;
            }
            else{
                out_e.y=s2_e.y;
                out_e.x=s2_e.x;
            }
            return{start:out_s,end:out_e, canDraw:canDraw};
        }
    }else if(p1.y==p2.y&&p1.y==p3.y&&p1.y==p4.y){
        //order points
        if(p1.x>p2.x){
            s1_s={x:p2.x,y:p2.y};
            s1_e={x:p1.x,y:p1.y};
        }
        if(p3.x>p4.x){
            s2_s={x:p4.x,y:p4.y};
            s2_e={x:p3.x,y:p3.y};
        }
        //check if overlap
        if(s1_e.x>=s2_s.x && s1_s.x<=s2_e.x){
            //overlap
            if(s2_s.x<=s1_s.x){
                out_s.y=s2_s.y;
                out_s.x=s2_s.x;
            }
            else{
                out_s.y=s1_s.y;
                out_s.x=s1_s.x;
            }
            if(s2_e.x<=s1_e.x){
                out_e.y=s1_e.y;
                out_e.x=s1_e.x;
            }
            else{
                out_e.y=s2_e.y;
                out_e.x=s2_e.x;
            }
            return{start:out_s,end:out_e, canDraw:canDraw};
        }
    }
    return null;
}
//joins the two segments.
function getOverlapSeg(s){
    var checked = true;

    var aux = getSegmentsArray(); 
    for(var i=0; i<aux.length;i++){
        //check if is not the same
        if(!compareSegments(s,aux[i])){
            if(getOverlap(s, aux[i])){
                return {b:true, i:i, checked:checked};
            }
        }
    }
    return {b:false, i:-1};
}
function cleanDisconnected(inArray){
    /* Clean the disconnected segments from the design */
    if(inArray.length >= 2){
        inArray.forEach(function(e,i){
            if(!(isCorner(e.start) || isIntersection(e.start) || isCorner(e.end) || isIntersection(e.end))){
                //delete this segment
                inArray.splice(i, 1);
                console.log('Cleaned disconected segment');
            }
        });
    }
    return inArray;
}
function canDelete(seg){
    var auxArray = getSegmentsArray();
    //delete the segment
    auxArray.splice(seg, 1);
    reCalculateDesign();
    auxArray = normalizeSegArray(auxArray);
    auxArray = getConfigSegments(auxArray);
    if(validateConfSegSizes(auxArray)){
        return true;
    }
    return false;
}
function validateConfSegSizes(arr){
    //validates the segment sizes on the parameter
    for(var i=0;i<arr.length;i++){
        if(!isValidLength(arr[i].newSeg.start,arr[i].newSeg.end))
            return false;
    }
    return true;
}
function getIntersection(sh, sv){
    //sh - horizontal, sv - vertical
    var p1 = {x: sh.start.x, y: sh.start.y};
    var p2 = {x: sh.end.x, y: sh.end.y};
    var p3 = {x: sv.start.x, y: sv.start.y};
    var p4 = {x: sv.end.x, y: sv.end.y};

    var sh_s={x:p1.x,y:p1.y};
    var sh_e={x:p2.x,y:p2.y};
    var sv_s={x:p3.x,y:p3.y};
    var sv_e={x:p4.x,y:p4.y};

    //re-order points
    if(p3.y>p4.y){
        sv_s={x:p4.x,y:p4.y};
        sv_e={x:p3.x,y:p3.y};
    }
    if(p1.x>p2.x){
        sh_s={x:p2.x,y:p2.y};
        sh_e={x:p1.x,y:p1.y};
    }

    //check for intersection
    if(
        ((sh_s.x < sv_s.x) && (sh_e.x > sv_e.x) && (sv_s.y < sh_s.y) && (sv_e.y > sh_e.y)) //default
        || ((sh_s.x == sv_s.x || sh_e.x == sv_s.x) && (sh_s.y < sv_e.y && sh_s.y > sv_s.y))
        || ((sv_s.y == sh_s.y || sv_e.y == sh_s.y) && (sv_s.x < sh_e.x && sv_s.x > sh_s.x))
        // ((sh_s.x < sv_s.x) && (sh_e.x > sv_e.x) && (sv_s.y < sh_s.y && sv_e.y > sh_e.y)) || //all cases
        // ((sh_s.x == sv_e.x || sh_e.x == sv_e.x) && (sv_s.y < sh_s.y && sv_e.y > sh_e.y)) || //special cases
        // ((sv_s.y == sh_e.y || sv_e.y == sh_e.y) && (sv_s.x > sh_s.x && sv_s.x < sh_e.x)) //special cases			
    ){
        return{x: sv_s.x,y: sh_s.y};
    }
    return null;
}
function calculateCorners(){
    var points = getPointsArray();
    var corners = [], out =[];
    for(var i=0; i<points.length; i++){
        if(checkIfCorner(points,points[i])){
            // console.log(' > Corner found at: x:'+points[i].x+' y:'+points[i].y);
            corners.push(points[i]);            
        }
    }
    //remove duplicates
    var dups = corners.filter(function({x, y}) {const key =`${x}${y}`;return !this.has(key) && this.add(key);}, new Set);

    //get type of corner    
    dups.forEach(function(e,i){
        var cp = getCornerPoints(e);
        var t = -1;
        if(cp[0].x == e.x){
            if(e.y<cp[0].y && e.x>cp[1].x) t = 3;
            if(e.y>cp[0].y && e.x>cp[1].x) t = 2;
            if(e.y>cp[0].y && e.x<cp[1].x) t = 1;
            if(e.y<cp[0].y && e.x<cp[1].x) t = 0;
        }
        else{
            if(e.y<cp[1].y && e.x>cp[0].x) t = 3;
            if(e.y>cp[1].y && e.x>cp[0].x) t = 2;
            if(e.y>cp[1].y && e.x<cp[0].x) t = 1;
            if(e.y<cp[1].y && e.x<cp[0].x) t = 0;
        }
        out.push({id:i,c:e, t:t});
    });
    cornersArray = dups;
    return out;
}
function checkIfCorner(array, value) {
    var c = 0;
    array.forEach((v) => (v.x === value.x && v.y === value.y && c++));
    if(c===2)
        return true;
    return false;
}
function intersectsLine(dir,seg){
    var segs = getSegmentsArray(dir);
    var inter, ignore = false;
    for(var i =0; i<segs.length; i++){
        if(dir==='h'){
            inter = getIntersection(segs[i],seg);
            if(inter != null){
                // tConnArray.push(int);
                if(intersectingSeg){
                    if(inter.x == seg.start.x && inter.y == seg.start.y){
                        console.log('intersection is start point - x:'+inter.x+' y:'+inter.y);
                        //ignore start intersection
                        ignore = true;
                    }
                    else{
                        ignore = false;
                    }
                }
                if(!ignore){
                    if(currInt === null){
                        currInt = inter;
                        console.log('Found valid intersection with horizontal segment @ x:'+currInt.x+' y:'+currInt.y);
                    }
                    ignore = false;
                    return true;
                }
            }
        }
        if(dir==='v'){
            inter = getIntersection(seg,segs[i]);
            if(inter != null){
                // tConnArray.push(int);
                if(intersectingSeg){
                    if(inter.x == seg.start.x && inter.y == seg.start.y){
                        console.log('intersection is start point - x:'+inter.x+' y:'+inter.y);
                        //ignore start intersection	
                        ignore = true;						
                    }
                    else{
                        ignore = false;
                    }
                }
                if(!ignore){
                    if(currInt === null){
                        currInt = inter;
                        console.log('Found valid intersection with vertical segment @ x:'+currInt.x+' y:'+currInt.y);
                    }
                    ignore = false;
                    return true;
                }
            }
        }
    }
    return false;		
}
function isCorner(c){
    var corn = cornersArray;
    for(var i=0; i<corn.length; i++){
        if(c.x === corn[i].x && c.y === corn[i].y)
            return true;
    }
    return false;
}
function isIntersection(t){
    for(var i=0; i<tConnArray.length; i++){
        if(t.x === tConnArray[i].x && t.y === tConnArray[i].y)
            return true;
    }
    return false;
}
function isOnSegment(p){
    var segArray_h =  getSegmentsArray('h');
    var segArray_v =  getSegmentsArray('v');
    
    //check on horizontal segments
    for(var i=0; i<segArray_h.length; i++){
        if( segArray_h[i].start.y === p.y && 
            ((p.x > segArray_h[i].start.x && p.x < segArray_h[i].end.x && segArray_h[i].start.x < segArray_h[i].end.x) ||
            (p.x < segArray_h[i].start.x && p.x > segArray_h[i].end.x && segArray_h[i].start.x > segArray_h[i].end.x)))
            return {b:true,d:'h',i:i}; //boolean and direction of the intersected segment
    }
    //check on vertical segments
    for(var i=0; i<segArray_v.length; i++){
        if(segArray_v[i].start.x === p.x &&
            ((p.y > segArray_v[i].start.y && p.y < segArray_v[i].end.y && segArray_v[i].start.y < segArray_v[i].end.y) ||
            (p.y < segArray_v[i].start.y && p.y > segArray_v[i].end.y && segArray_v[i].start.y > segArray_v[i].end.y)))
            return {b:true,d:'v',i:i}; //boolean and direction of the intersected segment
    }
    return {b:false,d:'',i:i};
}

function compareArraySegment(id, direction)
{
    var segArray_h =  getSegmentsArray('h');
    var segArray_v =  getSegmentsArray('v');

    for(var i = 0; i < segsArray.length; i++)
    {
        if(direction == 'h')
        {
            for(var j=0; j<segArray_h.length; j++) 
            {

                if(segsArray[i].start.x == segArray_h[id].start.x && segsArray[i].end.x == segArray_h[id].end.x &&
                    segsArray[i].start.y == segArray_h[id].start.y && segsArray[i].end.y == segArray_h[id].end.y)
                    return i;
            }
        }
        else
        {
            for(var x=0; x<segArray_v.length; x++)
            {
                if(segsArray[i].start.x == segArray_v[id].start.x && segsArray[i].end.x == segArray_v[id].end.x &&
                    segsArray[i].start.y == segArray_v[id].start.y && segsArray[i].end.y == segArray_v[id].end.y )
                    return i;
            }

        }

    }
}


function isOnSegLimit(p){
    var checked = false;
    for(var i=0; i<segsArray.length; i++){
        if( (segsArray[i].start.x === p.x && segsArray[i].start.y === p.y) ||
            (segsArray[i].end.x === p.x && segsArray[i].end.y === p.y) )
            return {b:true, i:i, checked:checked};
    }
    return {b:false, i:-1, checked:checked};
}
function calculateNewSegments(){
    var intArray_aux = tConnArray.slice();
    //go from intersection to intersection
    for(var i=0; i<intArray_aux.length; i++){
        var segsOfInter = getSegmentsOfIntersection(intArray_aux[i]);
        if(segsOfInter.length){
            if(segsOfInter.length == 1){
                //find the missing segments of the t-connection
                var missing = getMissingSeg(intArray_aux[i],segsOfInter[0].seg);
                if(missing.b){
                    //got the segments
                    var newsegs = breakSegAtIntersection(intArray_aux[i],segsArray[missing.id]);
                    if(newsegs.length == 2){
                        //TODO: Remove original segment from array and add the new ones
                        segsArray.splice(missing.id, 1);
                        segsArray.push(newsegs[0]);
                        segsArray.push(newsegs[1]);
                    }
                }
            }
            else if(segsOfInter.length == 2){
                //it's a corner and not an intersection 
                //remove intersection from array
                tConnArray.splice(i, 1);
                //rerun
                calculateNewSegments();
                return;
            }
        }
        else{
            //remove intersection from array
            tConnArray.splice(i, 1);
            //rerun
            calculateNewSegments();
            return;
        }
    }
}

function getCornerPoints(corn){
    /*return the corner points other than the corner itself (A,B)
        A
        |__ B
        C
    */
    var segs = segsArray;
    var out = [];
    for(var i=0;i<segs.length;i++){
        if(	segs[i].start.x == corn.x && segs[i].start.y == corn.y){
            out.push(segs[i].end);
        }
        if(segs[i].end.x == corn.x && segs[i].end.y == corn.y){
            out.push(segs[i].start);
        }
    }
    return out;
}

function getSegmentsOfIntersection(inter){
    var segs = segsArray;
    var out = [];
    for(var i=0;i<segs.length;i++){
        if(	segs[i].start.x == inter.x && segs[i].start.y == inter.y || 
        segs[i].end.x == inter.x && segs[i].end.y == inter.y){
            out.push({pos: i, seg:segs[i]});
        }
    }
    return out;
}

function getDirection(seg){
    if(seg.start.x == seg.end.x)
        return 'v';
    else
        return 'h';
}

function getInterType(inter){
    var out = -1, dirs = [];
    var segs_aux = getSegmentsOfIntersection(inter);
    segs_aux.forEach(function(e,i){
        segs_aux[i] = e.seg;
    })
    dirs.push(getDirection(segs_aux[0]));
    dirs.push(getDirection(segs_aux[1]));
    dirs.push(getDirection(segs_aux[2]));

    if(dirs[0] == dirs[1]){
        if(dirs[2] == 'v'){
            if(segs_aux[2].start.y > segs_aux[0].start.y || segs_aux[2].end.y > segs_aux[0].start.y )
                out = 1;
            else
                out = 3;
        }
        //horizontal
        else{
            if(segs_aux[2].start.x > segs_aux[0].start.x || segs_aux[2].end.x > segs_aux[0].start.x )
                out = 0;
            else
                out = 2;
        }
    }
    if(dirs[0] == dirs[2]){
        if(dirs[1] == 'v'){
            if(segs_aux[1].start.y > segs_aux[0].start.y || segs_aux[1].end.y > segs_aux[0].start.y )
                out = 1;            
            else
                out = 3;            
        }
        //horizontal
        else{
            if(segs_aux[1].start.x > segs_aux[0].start.x || segs_aux[1].end.x > segs_aux[0].start.x )
                out = 0;            
            else
                out = 2;            
        }
    }
    if(dirs[1] == dirs[2]){
        if(dirs[0] == 'v'){
            if(segs_aux[0].start.y > segs_aux[1].start.y || segs_aux[0].end.y > segs_aux[1].start.y )
                out = 1;            
            else
                out = 3;            
        }
        else{
            if(segs_aux[0].start.x > segs_aux[1].start.x || segs_aux[0].end.x > segs_aux[1].start.x )
                out = 0;            
            else
                out = 2;            
        }
    }
    return out;
}

function getMissingSeg(interPoint,ignoreSeg){
    // var segArray =  getSegmentsArray('h');		
    var segArray = segsArray;
    var canDraw = false;
    //check on horizontal segments
    for(var i=0; i<segArray.length; i++){
        if(segArray[i].start.y === segArray[i].end.y){
            //horizontal
            if( segArray[i].start.y === interPoint.y &&
            ((interPoint.x > segArray[i].start.x && interPoint.x < segArray[i].end.x && segArray[i].start.x < segArray[i].end.x) ||
            (interPoint.x < segArray[i].start.x && interPoint.x > segArray[i].end.x && segArray[i].start.x > segArray[i].end.x))){
                if(!compareSegments(segArray[i],ignoreSeg)){
                    return {b:true,id:i,dir:'h'}; //boolean, id of the intersected segment and direction
                }
            }
        }
        else if(segArray[i].start.x === segArray[i].end.x){
            //vertical
            if(segArray[i].start.x === interPoint.x &&
            ((interPoint.y > segArray[i].start.y && interPoint.y < segArray[i].end.y && segArray[i].start.y < segArray[i].end.y) ||
            (interPoint.y < segArray[i].start.y && interPoint.y > segArray[i].end.y && segArray[i].start.y > segArray[i].end.y))){
                if(!compareSegments(segArray[i],ignoreSeg)){
                    return {b:true,id:i,dir:'v'}; //boolean, id of the intersected segment and direction
                    }
                }
        }
    }
    return {b:false,d:''};
}
function compareSegments(seg1,seg2){
    if((seg1.start.x == seg2.start.x && seg1.start.y == seg2.start.y &&
    seg1.end.x == seg2.end.x && seg1.end.y == seg2.end.y) || 
    (seg1.start.x == seg2.end.x && seg1.start.y == seg2.end.y &&
    seg1.end.x == seg2.start.x && seg1.end.y == seg2.start.y)){
        return true;
    }
    return false;
}
function comparePoints(p1,p2){
    if(p1.x==p2.x && p1.y==p2.y)
        return true;
    return false;
}
function breakSegAtIntersection(inter,seg){
    var checked = false;
    out = [];
    if(seg.start.x == seg.end.x){
        if(inter.x == seg.start.x){
            //vertical
            if(seg.start.y < seg.end.y){
                if(inter.y >= seg.start.y && inter.y <= seg.end.y){
                    out = [
                        {start:{x:seg.start.x,y:seg.start.y}, end: {x:inter.x,y:inter.y}, canDraw:checked},
                        {start:{x:inter.x,y:inter.y}, end:{x:seg.end.x,y:seg.end.y}, canDraw:checked}
                    ];
                }
            }
            else{
                if(inter.y >= seg.end.y && inter.y <= seg.start.y){
                    out = [
                        {start:{x:seg.end.x,y:seg.end.y}, end:{x:inter.x,y:inter.y}, canDraw:checked},
                        {start:{x:inter.x,y:inter.y}, end:{x:seg.start.x,y:seg.start.y}, canDraw:checked}
                    ];
                }
            }
        }
    }
    if(seg.start.y == seg.end.y){
        if(inter.y == seg.start.y){
            //horizontal
            if(seg.start.x < seg.end.x){
                if(inter.x >= seg.start.x && inter.x <= seg.end.x){
                    out = [
                        {start:{x: seg.start.x,y:seg.start.y}, end:{x:inter.x,y:inter.y}, canDraw:checked},
                        {start:{x:inter.x,y:inter.y}, end:{x:seg.end.x,y:seg.end.y}, canDraw:checked}
                    ];
                }
            }
            else{
                if(inter.x >= seg.end.x && inter.x <= seg.start.x){
                    out = [
                        {start:{x:seg.end.x,y:seg.end.y}, end:{x:inter.x,y:inter.y}, canDraw:checked},
                        {start:{x:inter.x,y:inter.y}, end:{x:seg.start.x,y:seg.start.y}, canDraw:checked}
                    ];
                }
            }
        }
    }
    return out; //returns the 2 segments resulting from the segment
}
function isValidLength(s,e){
    var len=0;		
    if(s.x===e.x){
        //vertical
        len=Math.abs(e.y-s.y);
    }
    else{
        //horizontal
        len=Math.abs(e.x-s.x);
    }
    if(len<minLenght){
        return false;
    }
    else{
        return true;
    }		
}

function isValidInterLength(s,e,type){
    var len=0;		
    if(s.x===e.x){
        //vertical
        len=Math.abs(e.y-s.y);
    }
    else{
        //horizontal
        len=Math.abs(e.x-s.x);
    }
    if(type==0){
        //small part of t-connection
        if(len<((minSquares+1)*gridSize)){//4 squares
            
            return false;
        }
        else{
            return true;
        }
    }
    else{
        //big part of t-connection
        if(len<((minSquares+3)*gridSize)){//6 squares
            return false;
        }
        else{
            return true;
        }	
    }    	
}
function cleanDesign(){
    //removes all the elements of the design
    //clear arrays
    cornersArray = [];  //corners
    segsArray = [];     //segments
    tConnArray = [];    //intersections
    //reset konva groups
    segGrp = new Konva.Group({name:'segments'});
    cornGrp = new Konva.Group({name:'corners'});
    tGrp = new Konva.Group({name:'tconnections'});
    lenGrp = new Konva.Group({name:'lengths'});

    /*Clear the Line Design console contents */
    consoleClear();
}
function checkUnity(){
    //checks if theres unity on the drawing - i.e., theres only one connected line

    // TODO: implement it
    // use it right after delete, to compare the before and after efect on the drawing

}
//// CONSOLE
function consoleAdd(s){
    $('.lastEntry').removeClass( "lastEntry");
    $('#innerConsole').append('<p class="lastEntry">'+s+'</p>');
    $("#innerConsole").animate({ scrollTop: $('#innerConsole').prop("scrollHeight")}, 0);
}
function consoleClear(){
    $('#innerConsole').html('');
}

/*LINE CONFIGURATION*/
function setUpConfigMap(){
    var width = $('#configContainer').width();
    var height = $('#configContainer').height();
    var blockSnapSize = gridSize;
    confLayer = new Konva.Layer();
    configStage = new Konva.Stage({
        container: 'configContainer',
        width: width,
        height: height,
        scale:{ x: 0.75, y: 0.75 },
        name:'configStage'
    });

    /*Set up grid*/
    // var gridLayer = new Konva.Layer();	
    // for (var i = 0; i < (width*1.5) / blockSnapSize; i++) {
    // gridLayer.add(new Konva.Line({
    // 	points: [Math.round(i * blockSnapSize) + 0.5, 0, Math.round(i * blockSnapSize) + 0.5, height*1.5],
    // 	stroke: '#ddd',
    // 	strokeWidth: 2,
    // }));
    // }	
    // gridLayer.add(new Konva.Line({points: [0,0,10,10]}));
    // for (var j = 0; j < (height*1.5) / blockSnapSize; j++) {
    // gridLayer.add(new Konva.Line({
    // 	points: [0, Math.round(j * blockSnapSize), width*1.5, Math.round(j * blockSnapSize)],
    // 	stroke: '#ddd',
    // 	strokeWidth: 1,
    // }));
    // }
    // configStage.add(gridLayer);


    /*Set up table*/
    var wrapheight = $('#tableWrap').height();
    $('#tableContainer_inner').height(wrapheight-10);

    //set up headers
    $('.th_inner').each(function (){
        $(this).width($(this).parent().width());
    });
}


//length of the segment

function getSegLength(seg){
    // var gridSizeInMM = 600;

    // if($('#optics :selected').val() == 0 || $('#optics :selected').val() == 1){
    //     //diffuser
    //     gridSizeInMM = 280;
    // }else{
    //     //shielded unit
    //     gridSizeInMM = 456;
    // }
    var out = 0;
    if(seg.start.x === seg.end.x){
        //vertical
        if(seg.start.y>seg.end.y)
            out=((seg.start.y-seg.end.y)/gridSize)*gridSizeInMM;
        else
            out=((seg.end.y-seg.start.y)/gridSize)*gridSizeInMM;
    }
    else if(seg.start.y === seg.end.y){
        //horizontal
        if(seg.start.x>seg.end.x)
            out=((seg.start.x-seg.end.x)/gridSize)*gridSizeInMM;
        else
            out=((seg.end.x-seg.start.x)/gridSize)*gridSizeInMM;
    }
    return out;
}




function setupConfigSegments(){
    configSegs = [];
    var cfgSegments = getConfigSegments(segsArray);
    var control_id = 0; //control id, used to assign an unique id to each sub channel
    cfgSegments.forEach(function(e,i){
        var compArray_aux = getComposition(e.newSeg,control_id,i);
        configSegs.push({
            id:i,
            designSeg: {start:e.oldSeg.start, end:e.oldSeg.end},
            confSeg: {start:e.newSeg.start, end:e.newSeg.end},
            composition:compArray_aux.lens,
            subSegments:compArray_aux.segs
        });
        control_id = compArray_aux.c+1;
    });
    /* ConfigSeg structure:
        [{start:{x,y},end:{x,y},composition:string,subsegments:[{id:id,start:{x,y},end:{x,y},dir:bool,ind:bool}]}]
    */

}
function setupConfigCorners(){
    configCorners = [];
    var corners = calculateCorners();
    for(var i=0; i<corners.length; i++){
        var lim1 = -1, lim2= -1; //corner limit points
        switch(corners[i].t){
            case 0:
                lim1 = {x: corners[i].c.x, y:corners[i].c.y+(gridSize*2)};
                lim2 = {x: corners[i].c.x+(gridSize*2), y: corners[i].c.y};
                break;
            case 1:
                lim1 = {x: corners[i].c.x, y: corners[i].c.y-(gridSize*2)};
                lim2 = {x: corners[i].c.x+(gridSize*2), y: corners[i].c.y};
                break;
            case 2:
                lim1 = {x: corners[i].c.x, y: corners[i].c.y-(gridSize*2)};
                lim2 = {x: corners[i].c.x-(gridSize*2), y: corners[i].c.y};
                break;
            case 3:
                lim1 = {x: corners[i].c.x, y: corners[i].c.y+(gridSize*2) };
                lim2 = {x: corners[i].c.x-(gridSize*2), y: corners[i].c.y };
                break;
        }
        var dispStr = String.fromCharCode(65+i);
        configCorners.push({id:i, c:corners[i].c, t:corners[i].t, lim1:lim1, lim2:lim2, dir:true,disp:dispStr});
    }
}
function setupConfigTs(){
    configTs = [];
    for(var i=0; i<tConnArray.length; i++){
        var lim1=-1, lim2=-1, lim3=-1; //intersection limit points
        var interType = getInterType(tConnArray[i]);
        switch(interType){
            case 0:
                    lim1 = {x: tConnArray[i].x, y: tConnArray[i].y + gridSize };
                    lim2 = {x: tConnArray[i].x, y: tConnArray[i].y - gridSize };
                    lim3 = {x: tConnArray[i].x + t_connLength, y: tConnArray[i].y };
                break;
            case 1:
                    lim1 = {x: tConnArray[i].x - gridSize, y: tConnArray[i].y };
                    lim2 = {x: tConnArray[i].x + gridSize, y: tConnArray[i].y };
                    lim3 = {x: tConnArray[i].x, y: tConnArray[i].y + t_connLength };        
                break;
            case 2:
                    lim1 = {x: tConnArray[i].x, y: tConnArray[i].y + gridSize };
                    lim2 = {x: tConnArray[i].x, y: tConnArray[i].y - gridSize };
                    lim3 = {x: tConnArray[i].x - t_connLength, y: tConnArray[i].y };                
                break;
            case 3:
                    lim1 = {x: tConnArray[i].x - gridSize, y: tConnArray[i].y };
                    lim2 = {x: tConnArray[i].x + gridSize, y: tConnArray[i].y };
                    lim3 = {x: tConnArray[i].x, y: tConnArray[i].y - t_connLength };                
                break;
        }
        var dispStr = String.fromCharCode(65+i+configCorners.length);
        configTs.push({id:i, point:tConnArray[i], t:interType, lim1:lim1, lim2:lim2, lim3:lim3, dir:true,disp:dispStr});
    }
}
function loadConfigMap(){
    //calculate segments
    calculateNewSegments();
    segsArray = sortSegments();
    setupConfigSegments();
    setupConfigCorners();
    setupConfigTs();
    //draw
    drawConfigMap(configSegs,configCorners,configTs);
}
//draw of the config map

function drawConfigMap(segments,corners,intersections){
    segGrp_c = new Konva.Group();
    cornGrp_c = new Konva.Group();
    tGrp_c = new Konva.Group();
    tooltipGrp_c = new Konva.Group();    
    var shape, tip;
    var textposX, textposY
    var combArray = [];
    confLayer.destroy();

    /*Draw segments with subsegments*/
    for(var i=0;i<segments.length;i++){
        //get combinations
        combArray = segments[i].subSegments;
        if(combArray.length>1){
            //more than one segment
            combArray.forEach(function(e,ii){
                var aux_points = [];
                if(e.start.x == e.end.x){ //v
                    //points
                    aux_points = [e.start.x, e.start.y+1, e.end.x, e.end.y-1];
                    //text
                    textposX = e.start.x + 10;
                    if(e.start.y < e.end.y)
                        textposY = e.start.y + (Math.abs(e.end.y-e.start.y) / 2)-7;
                    else 
                        textposY = e.end.y + (Math.abs(e.start.y-e.end.y) / 2)-7;
                }
                else if(e.start.y == e.end.y){ //h
                    //points
                    aux_points = [e.start.x+1, e.start.y, e.end.x-1, e.end.y];
                    //text
                    textposY = e.start.y + 15;
                    if(e.start.x < e.end.x)
                        textposX = e.start.x + (Math.abs(e.end.x-e.start.x) / 2)-5;
                    else 
                        textposX = e.end.x + (Math.abs(e.start.x-e.end.x) / 2)-5;
                }                
                shape = new Konva.Line({
                    points: aux_points,
                    strokeWidth: 15,
                    stroke: 'black',
                    opacity: 1,
                    dir:'',
                    id: (i+1)+'_'+(ii+1)
                });                
                tip = new Konva.Text({
                    x: textposX,
                    y: textposY,
                    text: (i+1)+'.'+(ii+1),
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 20,
                    fill: "black"                    
                });
                segGrp_c.add(shape);
                tooltipGrp_c.add(tip);                
            });
        }
        else{
            var aux_points = [];
            var drawSeg = segments[i].subSegments[0];
            if(drawSeg.start.x == drawSeg.end.x){ //v
                //points
                aux_points = [drawSeg.start.x, drawSeg.start.y+1, drawSeg.end.x, drawSeg.end.y-1];            
                //text
                textposX = drawSeg.start.x + 10;
                if(drawSeg.start.y < drawSeg.end.y)
                    textposY = drawSeg.start.y + (Math.abs(drawSeg.end.y-drawSeg.start.y) / 2)-7;
                else 
                    textposY = drawSeg.end.y + (Math.abs(drawSeg.start.y-drawSeg.end.y) / 2)-7;
            }
            else if(drawSeg.start.y == drawSeg.end.y){ //h
                //points
                aux_points = [drawSeg.start.x+1, drawSeg.start.y, drawSeg.end.x-1, drawSeg.end.y]; 
                //text
                textposY = drawSeg.start.y + 15;
                if(drawSeg.start.x < drawSeg.end.x)
                    textposX = drawSeg.start.x + (Math.abs(drawSeg.end.x-drawSeg.start.x) / 2)-5;
                else 
                    textposX = drawSeg.end.x + (Math.abs(drawSeg.start.x-drawSeg.end.x) / 2)-5;
            }
            //only one segment
            shape = new Konva.Line({
                points: aux_points,
                strokeWidth: 15,
                stroke: 'black',
                opacity: 1,
                dir:'',
                id: (i+1)+'_0'
            });            
            tip = new Konva.Text({
                x: textposX,
                y: textposY,
                text: ''+(i+1),
                align: 'center',
                verticalAlign: 'middle',
                fontSize: 20,
                fill: "black"                
            });
            segGrp_c.add(shape);
            tooltipGrp_c.add(tip);
        }
    }
    confLayer.add(segGrp_c);
    confLayer.add(tooltipGrp_c);

    /* CORNERS */
    var special_pieces = 0;    
    //draw corners
    //TODO: use lim1 and lim2
    for(var i=0;i<corners.length;i++){
        var cpoints = [], textposX, textposY;
        switch(corners[i].t){
            case 0:
                cpoints = [ corners[i].c.x,corners[i].c.y+(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x+(gridSize*2),corners[i].c.y ];
                textposX = corners[i].c.x - 25;
                textposY = corners[i].c.y - 25;
                break;
            case 1:
                cpoints = [ corners[i].c.x,corners[i].c.y-(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x+(gridSize*2),corners[i].c.y ];
                textposX = corners[i].c.x - 25;
                textposY = corners[i].c.y + 10;
                break;
            case 2:
                cpoints = [ corners[i].c.x,corners[i].c.y-(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x-(gridSize*2),corners[i].c.y ];
                textposX = corners[i].c.x + 10;
                textposY = corners[i].c.y + 10;
                break;
            case 3:
                cpoints = [ corners[i].c.x,corners[i].c.y+(gridSize*2),
                            corners[i].c.x,corners[i].c.y,
                            corners[i].c.x-(gridSize*2),corners[i].c.y ];
                textposX = corners[i].c.x + 10;
                textposY = corners[i].c.y - 25;
                break;
        }
        drawShape = new Konva.Line({
            points: cpoints,
            strokeWidth: 16,
            stroke: '#777',
            opacity: 1
        });
        tip = new Konva.Text({
            x: textposX,
            y: textposY,
            text: String.fromCharCode(65+i),
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 20,
            fill: "black"            
        });
        special_pieces++;
        // drawShape = new Konva.Rect({
        //     width: 15,
        //     height: 15,
        //     fill: '#FFCC00',
        //     stroke: '#FFCC00'
        // });
        // drawShape.position({
        //     x: corners[i].x-7,
        //     y: corners[i].y-7
        // });			
        cornGrp_c.add(drawShape);
        tooltipGrp_c.add(tip);  
    }
    confLayer.add(cornGrp_c);
    /* T-CONNECTIONS */    
    for(var i=0;i<intersections.length;i++){
        var intpoints = [];
        //TODO: use lim1 lim2 lim3
        switch(intersections[i].t){
            case 0:
                intpoints = [
                    intersections[i].point.x, intersections[i].point.y + gridSize,
                    intersections[i].point.x, intersections[i].point.y - gridSize,
                    intersections[i].point.x, intersections[i].point.y,
                    intersections[i].point.x + t_connLength, intersections[i].point.y
                ];              
                textposX = intersections[i].point.x - 25;
                textposY = intersections[i].point.y - 5;
                break;
            case 1:
                intpoints = [
                    intersections[i].point.x - gridSize, intersections[i].point.y,
                    intersections[i].point.x + gridSize, intersections[i].point.y,
                    intersections[i].point.x, intersections[i].point.y,
                    intersections[i].point.x, intersections[i].point.y + t_connLength
                ];
                textposX = intersections[i].point.x - 5;
                textposY = intersections[i].point.y - 25;                
                break;
            case 2:
                intpoints = [
                    intersections[i].point.x, intersections[i].point.y + gridSize,
                    intersections[i].point.x, intersections[i].point.y - gridSize,
                    intersections[i].point.x, intersections[i].point.y,
                    intersections[i].point.x - t_connLength, intersections[i].point.y
                ];
                textposX = intersections[i].point.x + 10;
                textposY = intersections[i].point.y - 5;
                
                break;
            case 3:
                intpoints = [
                    intersections[i].point.x - gridSize, intersections[i].point.y,
                    intersections[i].point.x + gridSize, intersections[i].point.y,
                    intersections[i].point.x, intersections[i].point.y,
                    intersections[i].point.x, intersections[i].point.y - t_connLength
                ];
                textposX = intersections[i].point.x - 5;
                textposY = intersections[i].point.y + 10;                
                break;
        }
        drawShape = new Konva.Line({
            points: intpoints,
            strokeWidth: 15,
            stroke: '#777',
            opacity: 1
        });

        tip = new Konva.Text({
            x: textposX,
            y: textposY,
            text: String.fromCharCode(65+i+special_pieces),
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 20,
            fill: "black"            
        });

        // drawShape = new Konva.Rect({
        //     width: 15,
        //     height: 15,
        //     fill: '#FFCC00',
        //     stroke: 'red'
        // });
        // drawShape.position({
        //     x: intersections[i].point.x-7,
        //     y: intersections[i].point.y-7
        // });
        tGrp_c.add(drawShape);
        tooltipGrp_c.add(tip);  
    }
    confLayer.add(tGrp_c);
    configStage.add(confLayer);
    //Zoom and center config on ConfigMap
    zoomFit(configStage);
    configStage.draw();
}
function sortSegments(){
    var oldSegsArray = segsArray.slice();
    var newSegsArray = [];
    //normalize segments array
    newSegsArray = normalizeSegArray(oldSegsArray); //start < end
    //sort segments by coordinates
    newSegsArray = newSegsArray.sort(compareSegment);
    return newSegsArray;
}
function compareSegment(a,b){
    // Middle point
    //if(a.start.x === b.start.x){
    //     var mid_a = a.start.y + (a.end.y - a.start.y)/2;
    //     var mid_b = b.start.y + (b.end.y - b.start.y)/2;
    //     if (mid_a < mid_b)
    //         return -1;
    //     if (mid_a > mid_b)
    //         return 1;
    //     return 0;
    // }
    // else{
    //     var mid_a = a.start.x + (a.end.x - a.start.x)/2;
    //     var mid_b = b.start.x + (b.end.x - b.start.x)/2;
    //     if (mid_a < mid_b)
    //         return -1;
    //     if (mid_a > mid_b)
    //         return 1;
    // }

    //End Point
    // if(a.end.x === b.end.x){
    //     if (a.end.y < b.end.y)
    //         return -1;
    //     if (a.end.y > b.end.y)
    //         return 1;
    //     return 0;
    // }
    // else{
    //     if (a.end.x < b.end.x)
    //         return -1;
    //     if (a.end.x > b.end.x)
    //         return 1;
    // }
    // //Start Point
    if(a.start.x === b.start.x){
        if (a.start.y < b.start.y)
            return -1;
        if (a.start.y > b.start.y)
            return 1;
        return 0;
    }
    else{
        if (a.start.x < b.start.x)
            return -1;
        if (a.start.x > b.start.x)
            return 1;
    }
}
function normalizeSegArray(arr){
    /*makes the start coordinate always smaller than the end coordinate */
    var out = [];
    arr.forEach(function(e){
        //get direction
        if(e.start.x == e.end.x){
            //vertical
            if(e.end.y<e.start.y){
                out.push({start:{x: e.end.x,y: e.end.y},end:{x: e.start.x,y:e.start.y}});
            }
            else{
                out.push(e);
            }
        }else{
            //horizontal
            if(e.end.x<e.start.x){
                out.push({start:{x: e.end.x,y: e.end.y},end:{x: e.start.x,y:e.start.y}});
            }
            else{
                out.push(e);
            }
        }        
    });
    return out;
}
function getConfigSegments(arr){
    /* Returns the segments array with the true widths, without the corners and t-connections */
    /* Segment array should be normalized - start < end */
    var out=[];

    arr.forEach(function(e){
        var newStart = e.start, newEnd = e.end;
        var cornLen = 2*gridSize, intLenSmall = 1*gridSize, intLenBig=t_connLength;
        if(e.start.x == e.end.x){ //vertical  
            //start
            if(isCorner(e.start)){
                newStart = {x: e.start.x, y: e.start.y+cornLen};
            }
            else if(isIntersection(e.start)){
                var t_type = getInterType(e.start);
                if(t_type == 0 || t_type == 2){
                    newStart = {x: e.start.x, y: e.start.y+intLenSmall};
                }else{
                    newStart = {x: e.start.x, y: e.start.y+intLenBig};
                }          
            }
            //end
            if(isCorner(e.end)){
                newEnd = {x: e.end.x, y: e.end.y-cornLen};
            }
            else if(isIntersection(e.end)){
                var t_type = getInterType(e.end);
                if(t_type == 0 || t_type == 2){
                    newEnd = {x: e.end.x, y: e.end.y-intLenSmall};
                }else{
                    newEnd = {x: e.end.x, y: e.end.y-intLenBig};
                } 
            }
        }
        else{ //horizontal
            //start
            if(isCorner(e.start)){
                newStart = {x: e.start.x+cornLen, y: e.start.y};                
            }
            else if(isIntersection(e.start)){
                var t_type = getInterType(e.start);
                if(t_type == 0 || t_type == 2){
                    newStart = {x: e.start.x+intLenBig, y: e.start.y};
                }else{
                    newStart = {x: e.start.x+intLenSmall, y: e.start.y};
                } 
            }
            //end
            if(isCorner(e.end)){
                newEnd = {x: e.end.x-cornLen, y: e.end.y};
            }
            else if(isIntersection(e.end)){
                var t_type = getInterType(e.end);
                if(t_type == 0 || t_type == 2){
                    newEnd = {x: e.end.x-intLenBig, y: e.end.y};
                }else{
                    newEnd = {x: e.end.x-intLenSmall, y: e.end.y};
                } 
            }            
        }
        if(newStart.x != newEnd.x || newStart.y != newEnd.y) //only consider if lenght is > 0
            out.push({newSeg:{start:newStart, end:newEnd}, oldSeg:{start:e.start, end:e.end}});
    });    
    return out;
}
//composition i.e. division of the segment

function getComposition(seg,control,segId){
    var len = getSegLength(seg);
    var comb = [], mods = [];
    var add = 0;

    //diffuser
    if(opticsMode === 1){
        /*
        difuser
        lengths: 840; 1120 ; 1400 ; 1680 ; 1960 ; 2240 ; 2520 ; 2800 
        */
        if(len <= opticsLen[0][opticsLen[0].length-1]){
            //check if it can be only one channel
            switch(len){
                case opticsLen[0][0]:
                    comb.push(opticsLen[0][0]);
                    break;
                case opticsLen[0][1]:
                    comb.push(opticsLen[0][1]);
                    break;
                case opticsLen[0][2]:
                    comb.push(opticsLen[0][2]);
                    break;
                case opticsLen[0][3]:
                    comb.push(opticsLen[0][3]);
                    break;
                case opticsLen[0][4]:
                    comb.push(opticsLen[0][4]);
                    break;
                case opticsLen[0][5]:
                    comb.push(opticsLen[0][5]);
                    break;
                case opticsLen[0][6]:
                    comb.push(opticsLen[0][6]);
                    break;
                case opticsLen[0][7]:
                    comb.push(opticsLen[0][7]);
                    break;
            }
        }
        else{
            //more than one channel
            for(var i=opticsLen[0].length-1; i>=0;i--){
                var mod = len%opticsLen[0][i];
                // console.log('>Lenght: '+opticsLen[0][i]+' | Mod:'+mod);
                mods.push(mod);
                if(!mod){
                    var nPieces = len/opticsLen[0][i];
                    //mod = 0 -> seg can be divided in nPieces parts of opticsLen[0][i]
                    while(nPieces){
                        comb.push(opticsLen[0][i]);
                        add+=opticsLen[0][i];
                        nPieces--;
                    }
                    break;
                }
                if(opticsLen[0].includes(mod)){
                    // if mod = valid opticsLen value, use it
                    var nPieces = Math.floor(len/opticsLen[0][i]);
                    //will be using (nPieces+1) pieces. Check if there's a more symmetric one
                    for(var ii=opticsLen[0].length-1; ii>=0;ii--){
                        var mod2 = len%opticsLen[0][ii];
                        var nPieces2 = len/opticsLen[0][ii];
                        if(!mod2 && nPieces2 <= nPieces+1){
                            while(nPieces2){
                                comb.push(opticsLen[0][ii]);
                                add+=opticsLen[0][ii];
                                nPieces2--;
                            }
                            break;
                        }
                    }
                    if(!comb.length){
                        comb.push(mod);
                        while(nPieces){
                            comb.push(opticsLen[0][i]);
                            add+=opticsLen[0][i];
                            nPieces--;
                        }                        
                    }
                    break;
                }
            }
            // console.log('MODS: '+mods);
            if(!comb.length){
                var best = -1;
                //didn't work, find alternative
                mods.forEach(function(element,index){
                    if(opticsLen[0].includes(element)){
                        if(best == -1){
                            best = index;
                        }
                        else if(mods[best] < element){
                            best = index;
                        }
                    }
                });
                //push val of best					
                comb.push(mods[best]);
                add+=mods[best];
                var bestpos = (opticsLen[0].length-best-1);
                var div = Math.floor(len/opticsLen[0][bestpos]);
                while(div){
                    comb.push(opticsLen[0][bestpos]);
                    add+=opticsLen[0][bestpos];
                    div--;
                }
            }
        }
    }
    //shielded
    if(opticsMode === 2){
        

        
        
        
        /* 
        shielded

         5 * 2736 = 13680
         13680 + 1824 +1368 = 16872
        


        lengths: 1368 ; 1824 ; 2280 ; 2736    16872
        */
        if(len <= opticsLen[1][opticsLen[1].length-1]){
            //check if it can be only one channel
            switch(len){
                case opticsLen[1][0]:
                    comb.push(opticsLen[1][0]);
                    break;
                case opticsLen[1][1]:
                    comb.push(opticsLen[1][1]);
                    break;
                case opticsLen[1][2]:
                    comb.push(opticsLen[1][2]);
                    break;
                case opticsLen[1][3]:
                    comb.push(opticsLen[1][3]);
                    break;
                case opticsLen[1][4]:
                    comb.push(opticsLen[1][4]);
                    break;
            }
        }
        else{
            //add the exception for the length 16872, need to calculate the segments that result
            //more than one channel
            if(len = 16872)
        
            {
                comb.push(opticsLen[1][3]);
                comb.push(opticsLen[1][3]);
                comb.push(opticsLen[1][3]);
                comb.push(opticsLen[1][3]);
                comb.push(opticsLen[1][3]);
                comb.push(opticsLen[1][3]);
                comb.push(opticsLen[1][1]);
                comb.push(opticsLen[1][0]);

            }
            else{

            for(var i=opticsLen[1].length-1; i>=0;i--){
                var mod = len%opticsLen[1][i];
                // console.log(mod);
                mods.push(mod);
                if(!mod){
                    //mod = 0 -> seg can be divided in nPieces parts of opticsLen[1][i]
                    var nPieces = len/opticsLen[1][i];
                    while(nPieces){
                        comb.push(opticsLen[1][i]);
                        add+=opticsLen[1][i];
                        nPieces--;
                    }
                    break;
                }
                // if(opticsLen[1].includes(mod)){
                //     // if mod = valid opticsLen value, use it
                //     var nPieces = Math.floor(len/opticsLen[1][i]);16872 
                //     comb.push(mod);
                //     while(nPieces){
                //         comb.push(opticsLen[1][i]);
                //         add+=opticsLen[1][i];
                //         nPieces--;
                //     }
                //     break;
                // }
                if(opticsLen[1].includes(mod)){
                    // if mod = valid opticsLen value, use it
                    var nPieces = Math.floor(len/opticsLen[1][i]);
                    //will be using (nPieces+1) pieces. Check if there's a more symmetric one
                    for(var ii=opticsLen[1].length-1; ii>=0;ii--){
                        var mod2 = len%opticsLen[1][ii];
                        var nPieces2 = len/opticsLen[1][ii];
                        if(!mod2 && nPieces2 <= nPieces+1){
                            while(nPieces2){
                                comb.push(opticsLen[1][ii]);
                                add+=opticsLen[1][ii];
                                nPieces2--;
                            }
                            break;
                        }
                    }
                    if(!comb.length){
                        comb.push(mod);
                        while(nPieces){
                            comb.push(opticsLen[1][i]);
                            add+=opticsLen[1][i];
                            nPieces--;
                        }                        
                    }
                    break;
                }
            }
            if(!comb.length){
                var best = -1;
                //didn't work, find alternative
                mods.forEach(function(element,index){
                    if(opticsLen[1].includes(element)){
                        if(best == -1){
                            best = index;
                        }
                        else if(mods[best] < element){
                            best = index;
                        }
                    }
                });
                //push val of best
                comb.push(mods[best]);
                add+=mods[best];
                var bestpos = (opticsLen[1].length-best-1);
                var div = Math.floor(len/opticsLen[1][bestpos]);
                while(div){
                    comb.push(opticsLen[1][bestpos]);
                    add+=opticsLen[1][bestpos];
                    div--;
                }
            }
        }
        }
    }   
    var newControl = control;
    //Normalize lengths to the coordinates value
    comb.forEach(function(e,i){
        comb[i] = e * (gridSize/gridSizeInMM);
        newControl = newControl+1;
    });
    out = getSubSegs(seg,comb,control,segId);

    return {segs:out,lens:comb, c:newControl};
}
function getSubSegs(seg,lens,control,segId){
    var out = [], id=control;
    console.log('Segment: (' + seg.start.x +','+ seg.start.y +') -> ('+ seg.end.x +','+ seg.end.y +')');
    // console.log(' > divisions: ' + lens);
    // //Normalize lengths to the coordinates value
    // lens.forEach(function(e,i){
    //     lens[i] = e * (gridSize/gridSizeInMM);
    // });
    var displayStr = '';
    if(lens.length > 1){
        var i=0, prev = 0;
        while(i<lens.length){
            if(seg.start.x === seg.end.x){ //vertical
                auxStartX = auxEndX = seg.start.x;
                if(seg.start.y<seg.end.y){
                    auxStartY = seg.start.y + prev;
                    prev += lens[i];
                    auxEndY = auxStartY + lens[i];                    
                }                    
                else{
                    auxStartY = seg.end.y + prev;
                    prev += lens[i];
                    auxEndY = auxStartY + lens[i];                    
                }
            }
            else if(seg.start.y === seg.end.y){ //horizontal
                auxStartY = auxEndY = seg.start.y;
                if(seg.start.x<seg.end.x){
                    auxStartX = seg.start.x + prev;
                    prev += lens[i];
                    auxEndX = auxStartX + lens[i];                    
                }                    
                else{
                    auxStartX = seg.end.x + prev;
                    prev += lens[i];
                    auxEndX = auxStartX + lens[i];                    
                }                    
            }
            displayStr = (segId+1)+'.'+(i+1);
            out.push({id:id,segId: segId,start:{x:auxStartX,y:auxStartY}, end:{x:auxEndX,y:auxEndY},dir:true,ind:false,disp:displayStr});
            i++; id++;
        }
    }
    else{
        displayStr = ''+(segId+1);
        out.push({id:id, segId: segId,start:{x:seg.start.x,y:seg.start.y}, end:{x:seg.end.x,y:seg.end.y},dir:true,ind:false,disp:displayStr});
    }
    out.forEach(function(e,i){
        console.log(' > >  (' + e.start.x +','+ e.start.y +') -> ('+ e.end.x +','+ e.end.y +')' + ' | id: '+ e.id+' | disp: '+e.disp);
    });
    return out;
}
function getConfSegById(seg,subseg){
    var arr = [], seg_aux = null, subseg_aux = null;
    segGrp_c.children.forEach(function(e){
        seg_aux = parseInt(e.attrs.id.split('_')[0]);
        subseg_aux = parseInt(e.attrs.id.split('_')[1]);
        if(seg === seg_aux){
            if(subseg === 0){
                //put all
                arr.push(e);
            }
            else if(subseg === subseg_aux){
                arr.push(e);
            }
        }
    });
    return arr;
}
//// TABLE Functions
// ToDo need to translate the strings that are being passed by the json

function createChannelTable(){
    var html = '';
    var combhtml = ' - '; //combinations
    var comb_aux;
    var dirhtml = '';
    var indhtml = '';
    var chkbxlbl = '<svg><path d="M2 8 L6 13 L14 2"></path></svg>';
    var cols = 6;
    var directVal, indirectVal;
    
    if(hasUplight()){
        cols = 6;
        //Direct & Indirect Light - 5 columns
        $('#channelTable > thead').html('<tr><th colspan="2">'+strings.tblHead_ch+'<div class="th_inner">'+strings.tblHead_ch+'</div></th>'+
                                            '<th>'+strings.tblHead_len+'<div class="th_inner" style = "margin-left: 3px">'+strings.tblHead_len+'</div></th>'+
                                            '<th>'+strings.tblHead_comp+'<div class="th_inner">'+strings.tblHead_comp+'</div></th>'+
                                            '<th>'+strings.downlight+'<div class="th_inner">'+strings.downlight+'</div></th>'+
                                            '<th>'+strings.uplight+'<div class="th_inner">'+strings.uplight+'</div></th></tr>');
        for(var i=0; i<configSegs.length; i++){
            comb_aux = configSegs[i].subSegments;
            combhtml = getCompositionString(configSegs[i].composition);
            if(comb_aux.length > 1){
                html += '<tr class="parent" onmouseleave="highlightChannel(\''+(i+1)+'_0\',false)" onmouseenter="highlightChannel(\''+(i+1)+'_0\',true)">'+
                        '<td>'+(i+1)+'</td><td></td><td>'+getSegLength(configSegs[i].confSeg)+'</td><td>'+combhtml+'</td><td></td><td></td>'+
                        '</tr>';
                comb_aux.forEach(function(e,ii){
                    if(e.dir)
                        directVal = 'checked';
                    else
                        directVal = ''
                    if(e.ind)
                        indirectVal = 'checked';
                    else
                        indirectVal = ''
                        
                    dirhtml = '<input type="checkbox" class="chk" id="dir_'+(i+1)+'_'+(ii+1)+'_s" '+directVal+'/><label for="dir_'+(i+1)+'_'+(ii+1)+'_s">'+chkbxlbl+'</label>';
                    indhtml = '<input type="checkbox" class="chk" id="ind_'+(i+1)+'_'+(ii+1)+'_s" '+indirectVal+'/><label for="ind_'+(i+1)+'_'+(ii+1)+'_s">'+chkbxlbl+'</label>';
                    
                    html += '<tr class="child ch_'+i+'_'+ii+' grabable" onmouseleave="highlightChannel(\''+(i+1)+'_'+(ii+1)+'\',false)" onmouseenter="highlightChannel(\''+(i+1)+'_'+(ii+1)+'\',true)">'+
                            '<td><span class="grippy"></span></td><td style="text-align: left;">'+(i+1)+'.'+(ii+1)+'</td><td>'+getSegLength(e)+'</td><td></td><td>'+dirhtml+'</td><td>'+indhtml+'</td>'+
                            '</tr>';
                });
            }else{
                if(comb_aux[0].dir)
                    directVal = 'checked';
                else
                    directVal = ''
                if(comb_aux[0].ind)
                    indirectVal = 'checked';
                else
                    indirectVal = ''

                dirhtml = '<input type="checkbox" class="chk" id="dir_'+(i+1)+'_0_s" '+directVal+'/><label for="dir_'+(i+1)+'_0_s">'+chkbxlbl+'</label>';
                indhtml = '<input type="checkbox" class="chk" id="ind_'+(i+1)+'_0_s" '+indirectVal+'/><label for="ind_'+(i+1)+'_0_s">'+chkbxlbl+'</label>';

                html += '<tr class="parent" onmouseleave="highlightChannel(\''+(i+1)+'_0\',false)" onmouseenter="highlightChannel(\''+(i+1)+'_0\',true)">'+
                        '<td>'+(i+1)+'</td><td><td></td>'+getSegLength(configSegs[i].confSeg)+'</td><td>'+combhtml+'</td><td>'+dirhtml+'</td><td>'+indhtml+'</td>'+
                        '</tr>';
            }
        }
    }
    else{
        //only direct light - 4 columns
        cols = 5;
            


        $('#channelTable > thead').html('<tr><th colspan="2">'+strings.tblHead_ch+'<div class="th_inner">'+strings.tblHead_ch+'</div></th>'+
                                            '<th>'+strings.tblHead_len+'<div class="th_inner" style = "margin-left: 5px">'+strings.tblHead_len+'</div></th>'+
                                            '<th>'+strings.tblHead_comp+'<div class="th_inner">'+strings.tblHead_comp+'</div></th>'+
                                            '<th>'+strings.downlight+'<div class="th_inner">'+strings.downlight+'</div></th></tr>');
        
        
        for(var i=0; i<configSegs.length; i++){
            comb_aux = configSegs[i].subSegments;
            combhtml = getCompositionString(configSegs[i].composition);
            if(comb_aux.length > 1){
                html += '<tr><td>'+(i+1)+'</td><td></td><td>'+getSegLength(configSegs[i].confSeg)+'</td><td>'+combhtml+'</td></tr>';
                comb_aux.forEach(function(e,ii){
                    if(e.dir)
                        directVal = 'checked';
                    else
                        directVal = '';

                    dirhtml = '<input type="checkbox" class="chk" id="dir_'+(i+1)+'_'+(ii+1)+'_s" '+directVal+'/><label for="dir_'+(i+1)+'_'+(ii+1)+'_s">'+chkbxlbl+'</label>';

                    html += '<tr class="child ch_'+i+'_'+ii+' grabable"><td><span class="grippy"></span></td><td style="text-align: left;">'+(i+1)+'.'+(ii+1)+
                    '</td><td>'+getSegLength(e)+'</td><td></td><td>'+dirhtml+'</td></tr>';
                });
            }else{
                if(comb_aux[0].dir)
                    directVal = 'checked';
                else
                    directVal = '';

                dirhtml = '<input type="checkbox" class="chk" id="dir_'+(i+1)+'_0_s" '+directVal+'/><label for="dir_'+(i+1)+'_0_s">'+chkbxlbl+'</label>';

                html += '<tr><td>'+(i+1)+'</td><td><td></td>'+getSegLength(configSegs[i].confSeg)+'</td><td>'+combhtml+'</td><td>'+dirhtml+'</td></tr>';
            }
        }
    }    
    //SPECIAL PIECES
    var special_pieces = 0;
    // var corners = calculateCorners();
    if(configCorners.length > 0 || configTs.length > 0){
        //ADD SEPARATOR
        html+='<tr class="tableSeparator"><td colspan="'+cols+'">'+strings.cornersAndTs+'</td></tr>';

        html+='<br><br>'; //header for special pieces - TODO: make a definitive header...
        /* Corners */
        for(var i = 0; i<configCorners.length; i++){
            dirhtml = '<input type="checkbox" class="chk" id="dir_'+i+'_0_c" checked/><label for="dir_'+i+'_0_c">'+chkbxlbl+'</label>';
            html += '<tr class="child"><td colspan="2" style="text-allign:center">'+String.fromCharCode(65+i)+'</td><td>560 x 560</td><td></td><td>'+dirhtml+'</td><td></td></tr>';
            special_pieces++;
        }
        html+='<br><br>';  //header for special pieces - TODO: make a definitive header...
        /* T-Connections */
        for(var i = 0; i<configTs.length;i++){
            dirhtml = '<input type="checkbox" class="chk" id="dir_'+i+'_0_t" checked/><label for="dir_'+i+'_0_t">'+chkbxlbl+'</label>';
            html += '<tr class="child"><td colspan="2" style="text-allign:center">'+String.fromCharCode(65+i+special_pieces)+'</td><td>560 x 590</td><td></td><td>'+dirhtml+'</td><td></td>/tr>';            
        }
    }
    $('#channelTable > tbody').html(html);
    //set up headers
    if(configSegs.length){
        $('.table-dragable th:nth-child(1)').css('max-width','0px');
    }
    else{
        $('.table-dragable th:nth-child(1)').css('max-width','none');
    }

    $('.th_inner').each(function (i){
        $(this).width($(this).parent().width());
    });

    $('.table-dragable tbody .grabable').mousedown(function (e) {
        var tr = $(e.target).closest('tr'), sy = e.pageY, drag;
        if ($(e.target).is('tr')) tr = $(e.target);
        var index = tr.index();
        $(tr).addClass('grabbed');
        var selCh = tr[0].className.split(/\s+/)[1].split('_')[1];
        var selSub = tr[0].className.split(/\s+/)[1].split('_')[2];
        //mousemove handler
        function move (e) {
            if (!drag && Math.abs(e.pageY - sy) < 10) return;
            drag = true;
            tr.siblings().each(function(){
                var s = $(this), i = s.index(), y = s.offset().top;
                var s_ch = s[0].className.split(/\s+/);
                //ensure that can only move inside the same channel
                var valid = false;
                if(s_ch.length > 1){
                    s_ch = s_ch[1].split('_')[1];
                    if(s_ch == selCh){
                        valid = true;
                    }                        
                }                
                if (e.pageY >= y && e.pageY < y + s.outerHeight() && valid) {
                    if (i < tr.index()) s.insertAfter(tr);
                    else s.insertBefore(tr);
                    return false;
                }
            });
        }
        //mouseup handler
        function up (e) {
            if (drag && index != tr.index()) {
                var nmov = tr.index()-index;
                drag = false;
                //changed segment position
                var start = parseInt(selSub);
                var end = parseInt(selSub)+nmov;
                var ch = parseInt(selCh);                
                console.log('moved segment from:'+selSub+' to:'+end+' on channel '+selCh+' > nmov:'+nmov);
                moveSubSegments(ch,start,end);
                // return;
            }
            $(document).unbind('mousemove', move).unbind('mouseup', up);
            $(tr).removeClass('grabbed');
        }
        $(document).mousemove(move).mouseup(up);
    });


    //bind checkbox handlers
    $('.chk').bind('change', function(e){
        //get segment data
        var cbType = e.target.id.split('_')[0];
        var seg = parseInt(e.target.id.split('_')[1]);
        var subSeg = parseInt(e.target.id.split('_')[2]);
        var pType = e.target.id.split('_')[3]; //piece type - s:segment; c:corner; t:t-connection
        // var checked = 

        var segs;

        if(cbType == 'dir'){
            //direct light
            switch(pType){
                case 's':
                    segs = getConfSegById(seg,subSeg);
                    if(segs.length>1){
                        //TODO: SELECTION FOR ALL CHILDREN OF SEGMENT
                    }
                    else{
                        //only one element
                        if(subSeg)
                            configSegs[seg-1].subSegments[subSeg-1].dir = e.target.checked;
                        else
                            configSegs[seg-1].subSegments[subSeg].dir = e.target.checked;
                    }
                    break;
                case 'c':
                    configCorners[seg].dir = e.target.checked;
                    break;
                case 't':
                    configTs[seg].dir = e.target.checked;
                    break;
            }
        }
        else if(cbType == 'ind'){
            //indirect light - only on segments (pType=='s')
            segs = getConfSegById(seg,subSeg);

            if(seg.length>1){
                //TODO: SELECTION FOR ALL CHILDREN OF SEGMENT                
            }
            else{
                //only one element
                if(subSeg)
                    configSegs[seg-1].subSegments[subSeg-1].ind = e.target.checked;
                else
                    configSegs[seg-1].subSegments[subSeg].ind = e.target.checked;
            }

        }
        console.log(e.target.id);
    });
}
function hasUplight(){
    if($('#installation :selected').val() == 1 || $('#installation :selected').val() == 2)
        return true;
    else
        return false;
}
function getCompositionString(lens){
    var out = '';
    lens.forEach(function(element,index){
        if(index)
            out+=' + ';
        out+=''+Math.round(element * (gridSizeInMM/gridSize));
    });
    return out;
}
function highlightChannel(id, type){
    //parse the id
    var segID = parseInt(id.split('_')[0]);
    var subsegID = parseInt(id.split('_')[1]);
    var seg = null;
    //get segment for this id
    seg = getConfSegById(segID,subsegID);
    if(seg.length>1){
        //highlight all sub-segments of this segment
        seg.forEach(function(e){
            //highlight
            if(type)
                e.stroke('#264F9F');
            else
                e.stroke('#000');
        });        
    }
    else{
        //highlight this sub-segment        
        if(seg!=null){
            //highlight
            if(type)
                seg[0].stroke('#264F9F');
            else
                seg[0].stroke('#000');
        }
    }
    configStage.draw();
}
function moveSubSegments(ch,oldPos,newPos){
    //moves the subsegment of the channel ch from the oldPos to the newPos
    array_move(configSegs[ch].composition, oldPos, newPos);
    var aux = getSubSegs(configSegs[ch].confSeg,configSegs[ch].composition,configSegs[ch].subSegments[0].id);
    if(aux.length == configSegs[ch].subSegments.length){
        configSegs[ch].subSegments.forEach(function(e,i){
            //coordinates
            e.start = aux[i].start;
            e.end = aux[i].end;
            //other components
            e.id = aux[i].id;
            // e.dir = aux[i].dir;
            // e.ind = aux[i].ind;
        });
    }
    //redraw the config map
    drawConfigMap(configSegs,configCorners,configTs);
    //redo the config table
    createChannelTable();
}
//Aux functions
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    // return arr; // for testing
};

/* EXPORT */
// Path creation functions
function createPath(){
    // /* normalize segsArray */
    // segsArray = sortSegments();
    
    // /* check end point */
    // if(isCorner(startSeg.end)){  

    // }
    // if(isIntersection(startSeg.end)){

    // }

    var pieces = getPiecesArray();

    if(pieces.length == 0 && segsArray.length != 0){
        //user jumped over line configuration
        loadConfigMap();
        pieces = getPiecesArray();
    }
    fillPiecesArray(pieces);
    if(pieces.length){
        /* get first element - for now it will be the start point of the top left segment: segsArray[0] */
        var path = []; //array with pieces id
        var pathDisp = []; //array with pieces display names
        var pieceID_aux = getStartPiece(pieces);
        path.push(pieceID_aux);
        pathDisp.push(getPieceById(pieceID_aux,pieces).data.disp);

        pieces[pieceID_aux].path=true;
        pieces[pieceID_aux].path_type='M';

        var lastUsedT = null;
        while(path.length != pieces.length){
            var ignore=false;        
            /* Last piece */
            var last = getPieceById(path[path.length-1],pieces);
            /* Try con1 */
            var next = getPieceById(last.con1,pieces);
            if(next){
                if(!next.path){
                    inPoint = getInPoint(last, next);
                    //push piece
                    path.push(next.id);
                    pathDisp.push(next.data.disp);
                    pieces[next.id].path=true;
                    pieces[next.id].path_type=getNextPiecePathType(next,inPoint);
                    ignore = true;
                    //check if is a T piece
                    if(next.type == 2){
                        lastUsedT = next;
                    }
                }
            }
            if(!ignore){
                /* Try con2 */
                var next = getPieceById(last.con2,pieces);
                if(next){
                    if(!next.path){
                        inPoint = getInPoint(last, next);
                        //push piece
                        path.push(next.id);
                        pathDisp.push(next.data.disp);                    
                        pieces[next.id].path=true;
                        pieces[next.id].path_type=getNextPiecePathType(next,inPoint);
                        ignore = true;
                        //check if is a T piece
                        if(next.type == 2){
                            lastUsedT = next;
                        }
                    }
                }
            }
            if(!ignore){
                if(last.type == 2){
                    /* Try con3 */
                    var next = getPieceById(last.con3,pieces);
                    if(next){
                        if(!next.path){
                            inPoint = getInPoint(last, next);
                            //push piece
                            path.push(next.id);
                            pathDisp.push(next.data.disp);
                            pieces[next.id].path=true;
                            pieces[next.id].path_type=getNextPiecePathType(next,inPoint);
                            ignore=true;
                            //check if is a T piece
                            if(next.type == 2){
                                lastUsedT = next;
                            }
                        }
                    }
                }
            }
            if(!ignore){
                //check last used T
                if(lastUsedT){
                    if(!getPieceById(lastUsedT.con1,pieces).path){
                        //next piece will be this one
                        path.push(lastUsedT.con1);
                        pathDisp.push(getPieceById(lastUsedT.con1,pieces).data.disp);
                        pieces[ lastUsedT.con1 ].path=true;
                        pieces[ lastUsedT.con1 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                        console.log('started a secondary loop with last used T!');
                        ignore=true;
                    }
                    if(!getPieceById(lastUsedT.con2,pieces).path){
                        path.push(lastUsedT.con2);
                        pathDisp.push(getPieceById(lastUsedT.con2,pieces).data.disp);
                        pieces[ lastUsedT.con2 ].path=true;
                        pieces[ lastUsedT.con2 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                        console.log('started a secondary loop with last used T!');
                        ignore=true;
                    }
                    if(!getPieceById(lastUsedT.con3,pieces).path){
                        path.push(lastUsedT.con3);
                        pathDisp.push(getPieceById(lastUsedT.con3,pieces).data.disp);
                        pieces[ lastUsedT.con3 ].path=true;
                        pieces[ lastUsedT.con3 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                        console.log('started a secondary loop with last used T!');
                        ignore=true;                    
                    }
                    if(!ignore){
                        //failed, find an alternative  used T
                        for(var i=0;i<pieces.length;i++){
                            if(pieces[i].type==2 && pieces[i].path){ //Onlu used T's
                                if(!getPieceById(pieces[i].con1,pieces).path){
                                    //next piece will be this one
                                    path.push(pieces[i].con1);
                                    pathDisp.push(getPieceById(pieces[i].con1,pieces).data.disp);
                                    pieces[ pieces[i].con1 ].path=true;
                                    pieces[ pieces[i].con1 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                                    console.log('started a secondary loop with an unfinished T!');
                                    ignore = true;
                                    lastUsedT = pieces[i];
                                    break;
                                }
                                if(!getPieceById(pieces[i].con2,pieces).path){
                                    //next piece will be this one
                                    path.push(pieces[i].con2);
                                    pathDisp.push(getPieceById(pieces[i].con2,pieces).data.disp);
                                    pieces[ pieces[i].con2 ].path=true;
                                    pieces[ pieces[i].con2 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                                    console.log('started a secondary loop with an unfinished T!');
                                    ignore = true;
                                    lastUsedT = pieces[i];
                                    break;
                                }
                                if(!getPieceById(pieces[i].con3,pieces).path){
                                    //next piece will be this one
                                    path.push(pieces[i].con3);
                                    pathDisp.push(getPieceById(pieces[i].con3,pieces).data.disp);
                                    pieces[ pieces[i].con3 ].path=true;
                                    pieces[ pieces[i].con3 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                                    console.log('started a secondary loop with an unfinished T!');
                                    ignore = true;
                                    lastUsedT = pieces[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if(!ignore){
                //failed on every piece and last used T, check what's missing - avoid infinite loop
                for(var i=0;i<pieces.length;i++){
                    if(pieces[i].type==2){
                        if(!getPieceById(pieces[i].con1,pieces).path){
                            //next piece will be this one
                            path.push(pieces[i].con1);
                            pathDisp.push(getPieceById(pieces[i].con1,pieces).data.disp);
                            pieces[ pieces[i].con1 ].path=true;
                            pieces[ pieces[i].con1 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                            console.log('started a secondary loop!');
                            break;
                        }
                        if(!getPieceById(pieces[i].con2,pieces).path){
                            //next piece will be this one
                            path.push(pieces[i].con2);
                            pathDisp.push(getPieceById(pieces[i].con2,pieces).data.disp);
                            pieces[ pieces[i].con2 ].path=true;
                            pieces[ pieces[i].con2 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                            console.log('started a secondary loop!');
                            break;
                        }
                        if(!getPieceById(pieces[i].con3,pieces).path){
                            //next piece will be this one
                            path.push(pieces[i].con3);
                            pathDisp.push(getPieceById(pieces[i].con3,pieces).data.disp);
                            pieces[ pieces[i].con3 ].path=true;
                            pieces[ pieces[i].con3 ].path_type='C'; //TODO: for now, if the user can select here it can be an M
                            console.log('started a secondary loop!');
                            break;
                        }
                    }
                }
            }
        }
        
        path.forEach(function(e){
            console.log('Piece ID: '+ (pieces[e].id+1) + ' | Piece Type: '+pieces[e].path_type);
        });
        var log='';
        pathDisp.forEach(function(e,i){
            if(i==(pathDisp.length-1))
                log+=e;
            else
                log+=e+' -> ';
        });
        console.log(log);
        exportPieces = pieces;
    }
    //draw export pieces
    setUpExportMap();
    drawExportMap(pieces);
    pieces = assignPiecesCodes(pieces);
    modules = pieces;
    // genCodeList(pieces);
    loadOverviewData();
    genOverviewTable(pieces);    
}
function getPiecesArray(){
    /* Returns an array of pieces from the config arrays: segs, corners, intersections */
    var pieces = [];
    var id=0;
    /* Segments */
    configSegs.forEach(function(e,i){
        for(var ii = 0; ii<e.subSegments.length;ii++){
            pieces.push({id:id, type:0, con1: null, con2: null, con3: null, path:false, path_type: null, data:e.subSegments[ii]});
            id++;
        }        
    });
    /* Corners */
    configCorners.forEach(function(e,i){
        pieces.push({id:id, type:1, con1: null, con2: null, con3: null, path:false, path_type: null, data:e});
        id++;
    });
    /* intersections */
    configTs.forEach(function(e,i){
        pieces.push({id:id, type:2, con1: null, con2: null, con3: null, path:false, path_type: null, data:e});
        id++;
    });

    /* Piece: {id:id, type:(0->segment, 1->corner, 2->intersection), con1: pieceID, con2: pieceID, con3: pieceID (if applicable)} */
    return pieces;
}
function fillPiecesArray(arr){
    arr.forEach(function(e,i){
        switch(e.type){
            case 0: //segment
                //start
                e.con1 = findConnected(e.data.start,e.id,e.type, arr);
                //end
                e.con2 = findConnected(e.data.end,e.id,e.type, arr);
                break;
            case 1: //corner
                //lim1
                e.con1 = findConnected(e.data.lim1,e.id,e.type, arr);
                //lim2
                e.con2 = findConnected(e.data.lim2,e.id,e.type, arr);
                break;
            case 2: //intersection
                //lim1
                e.con1 = findConnected(e.data.lim1,e.id,e.type, arr);
                //lim2
                e.con2 = findConnected(e.data.lim2,e.id,e.type, arr);
                //lim3
                e.con3 = findConnected(e.data.lim3,e.id,e.type, arr);
                break;
        }
    });
}
function findConnected(point,originID,originType, arr){
    var out = null;
    arr.forEach(function(e,i){
        if( !(e.type == originType && e.id == originID)){ //ignore the same piece
            switch(e.type){
                case 0: //segment
                    if(comparePoints(point,e.data.start) || comparePoints(point,e.data.end)){
                        out=e.id;
                        return;
                    }
                    break;
                case 1: //corner
                    if( comparePoints(point,e.data.lim1) || comparePoints(point,e.data.lim2)){
                        out=e.id;
                        return;
                    }
                    break;
                case 2: //intersection
                    if( comparePoints(point,e.data.lim1) || comparePoints(point,e.data.lim2) || comparePoints(point,e.data.lim3)){
                        out=e.id;
                        return;
                    }
                    break;
            }
        }
    });
    return out;
}
function getPieceById(id,arr){
    for(var i=0; i<arr.length; i++){
        if(arr[i].id == id){
            return arr[i];
        }
    }
    return null;
}
function getStartPiece(arr){
    if(arr.length){
        //get first segment without a connection
        for(var i=0; i<arr.length; i++){
            if(arr[i].type==0 && (arr[i].con1==null || arr[i].con2==null)){
                //segments only
                return arr[i].id;
            }
        }
        //no segments without connection - closed loop -> there should have corners
        for(var i=0; i<arr.length; i++){
            if(arr[i].type==1){
                //get first segment attached to any corner
                return arr[i].con1;
            }
        }
    }
    return null;
}
function getCornerID(point){
    for(var i=0; i<configCorners.length; i++){
        if(point.x == configCorners[i].c.x && point.y == configCorners[i].c.y)
            return configCorners[i].id;
    }
    return -1;
}
function getTconnectionID(point){
    for(var i=0; i<configTs.length; i++){
        if(point.x == configTs[i].point.x && point.y == configTs[i].point.y)
            return configTs[i].id;
    }
    return -1;
}
function getInPoint(p1,p2){
    //returns the intersection between p1 and p2
    var points1 = getPiecePoints(p1), points2 = getPiecePoints(p2);
    for(var i=0; i<points1.length;i++){
        for(var ii=0; ii<points2.length;ii++){
            if(comparePoints(points1[i],points2[ii]))
                return points1[i];
        }
    }
    return null;
}
function getPiecePoints(p){
    //returns the limit points of a given piece
    var out = []
    switch(p.type){
        case 0:
            out.push(p.data.start);
            out.push(p.data.end);
            break;
        case 1:
            out.push(p.data.lim1);
            out.push(p.data.lim2);
            break;
        case 2:
            out.push(p.data.lim1);
            out.push(p.data.lim2);
            out.push(p.data.lim3);
            break;
    }
    return out;
}
//type of color if the next broken segment
function getNextPiecePathType(p,inPoint){
    var out;
    switch(p.type){
        case 0: //segments
            out = 'C';
            break;
        case 1: //corners
            if(p.data.t == 0 || p.data.t == 2){
                if(comparePoints(inPoint, p.data.lim1))
                    out='Y';
                else
                    out='C';
            }
            if(p.data.t == 1 || p.data.t == 3){
                if(comparePoints(inPoint, p.data.lim1))
                    out='C';
                else
                    out='Y';
            }
            break;
        case 2: //intersections
            if(comparePoints(inPoint, p.data.lim3)){
                out = 'M';
            }
            else{
                if(p.data.t == 0 || p.data.t == 1){
                    if(comparePoints(inPoint, p.data.lim1))
                        out='C';
                    else
                        out='Y';
                }
                if(p.data.t == 2 || p.data.t == 3){
                    if(comparePoints(inPoint, p.data.lim1))
                        out='Y';
                    else
                        out='C';

                }
            }
            break;
    }
    return out;
}
//Code generation
function assignPiecesCodes(pieces){
    for(var i=0; i<pieces.length; i++){
        pieces[i].code = getPieceCodeForCustomColor(pieces[i]);
    }
    return pieces;
}
function getPieceCode(p){
    //RANGE
    out='V3';
    //TYPE
    out+=getInstalation().cod;
    //OPTICS
    out+=getOptics().cod;
    //BEAM & MATERIAL
    if(p.data.dir){
        if(getOptics().cod == 'S' || getOptics().cod == 'B'){
            //shielded
            out+=getBeam().cod;
        }else{
            //diffuser
            out+='J'; //Lambertian PC - only option for diffuser
        }
    }
    else{
        out+='C';
    }
    //MODULATION
    var pMod = getPieceModulation(p);
    out+=pMod;
    //POWER SUPPLY CONFIGURATION
    out+=p.path_type;
    out+='/';
    //LAMP COLOUR
    out+=getLedColor().cod;
    //LENGTH
    if(p.type==0){
        //segment
        out+=getLengthCod(getSegLength(p.data));
    }
    else{
        if(p.type==1) //corner
            out+=getLengthCod(1120);  //560+560
        if(p.type==2) //t-connection
            out+=getLengthCod(1150); //590+560
    }        
    //LIGHT OUTPUT DIRECT
    if(p.data.dir){
        if(getOptics().cod == 'S'){
            out+= 'M'; //for shielded use always medium
        }
        else{
            out+= getLightOutput().cod;
        }
    }
    else{
        out+= '0'; //also cover plate on beam
    }
    //LIGHT OUTPUT INDIRECT
    if(p.data.ind){
        if(getOptics().cod == 'S'){
            out+= 'M'; //for shielded use always medium
        }
        else{
            out+= getLightOutput().cod;
        }
    }
    else{
        out+= '0';
    }
    //DRIVER - if not dir and ind then driver value = 0

    if(!p.data.ind && !p.data.dir)
    {
        out+= '0';
    }
    else{
        out+= 'D';
    }

    //THROUGH WIRING - default 5 pole, individual and end modules have 0
    if(pMod==0 || pMod==3)
        out+=0
    else
        out+= '5';
    //PROFILE COLOR
    if(getColor().cod == "-")
    {
        out+= "X1"
    }
    else{
    out+=getColor().cod;
    }
    return out;
}
function getPieceCodeForCustomColor(p){
    //RANGE
    out='V3';
    //TYPE
    out+=getInstalation().cod;
    //OPTICS
    out+=getOptics().cod;
    //BEAM & MATERIAL
    if(p.data.dir){
        if(getOptics().cod == 'S' || getOptics().cod == 'B'){
            //shielded
            out+=getBeam().cod;
        }else{
            //diffuser
            out+='J'; //Lambertian PC - only option for diffuser
        }
    }
    else{
        out+='C';
    }
    //MODULATION
    var pMod = getPieceModulation(p);
    out+=pMod;
    //POWER SUPPLY CONFIGURATION
    out+=p.path_type;
    out+='/';
    //LAMP COLOUR
    out+=getLedColor().cod;
    //LENGTH
    if(p.type==0){
        //segment
        out+=getLengthCod(getSegLength(p.data));
    }
    else{
        if(p.type==1) //corner
            out+=getLengthCod(1120);  //560+560
        if(p.type==2) //t-connection
            out+=getLengthCod(1150); //590+560
    }        
    //LIGHT OUTPUT DIRECT
    if(p.data.dir){
        if(getOptics().cod == 'S'){
            out+= 'M'; //for shielded use always medium
        }
        else{
            out+= getLightOutput().cod;
        }
    }
    else{
        out+= '0'; //also cover plate on beam
    }
    //LIGHT OUTPUT INDIRECT
    if(p.data.ind){
        if(getOptics().cod == 'S'){
            out+= 'M'; //for shielded use always medium
        }
        else{
            out+= getLightOutput().cod;
        }
    }
    else{
        out+= '0';
    }
    //DRIVER - if not dir and ind then driver value = 0

    if(!p.data.ind && !p.data.dir)
    {
        out+= '0';
    }
    else{
        out+= 'D';
    }

    //THROUGH WIRING - default 5 pole, individual and end modules have 0
    if(pMod==0 || pMod==3)
        out+=0
    else
        out+= '5';
    //PROFILE COLOR
    if(getColor().cod == "-")
    {
        out+= "X-"
    }
    else{
    out+=getColor().cod;
    }
    return out;
}




function getPieceModulation(p){
    var out = '';
    switch(p.type){
        case 0: //
            if(p.con1!==null || p.con2 !== null){
                if((p.con1==null && p.path_type=='M') || (p.con2==null && p.path_type=='M'))
                    out='1'; //start                
                else if(p.con1!=null && p.con2!=null)
                    out = '2'; //middle
                else 
                    out='3'; //end
            }
            else
                out = '0'; //individual
            break;
        case 1: //
            out = '4';
            break;
        case 2: //
            out = '5';
            break;
    }
    return out;
}
function getLengthCod(len){
    out = '';
    switch(len){
        case 280:   //diffuser
        case 456:   //shielded
            out = '1';
            break;
        case 560:   //diffuser
        case 912:   //shielded
            out = '2';
            break;
        case 840:   //diffuser
        case 1368:  //shielded
            out = '3';
            break;
        case 1120:  //diffuser
        case 1150:  //shielded
            out = '4';
            break;  
        case 1400:  //diffuser
        case 2280:  //shielded
            out = '5';
            break;
        case 1680:  //diffuser
        case 2736:  //shielded
            out = '6';
            break;
        case 1960:  //diffuser
            out = '7';
            break;
        case 2240:  //diffuser
            out = '8';
            break;
        case 2520:  //diffuser
            out = '9';
            break;
        case 2800:  //diffuser
            out = '0';
            break;
        //default - error
        default: 
            out = '?';
            break;
    }
    return out;
}
//Export Map
function setUpExportMap(){
    var width = $('#exportContainer').width();
    var height = $('#exportContainer').height();
    var blockSnapSize = gridSize;
    exportLayerImg = new Konva.Layer();

    exportLayer = new Konva.Layer();
    exportStage = new Konva.Stage({
        container: 'exportContainer',
        width: width,
        height: height,
        scale:{ x: 0.75, y: 0.75 },
        name:'exportStage'
    });
}
function drawExportMap(pieces){
    segGrp_e = new Konva.Group();
    cornGrp_e = new Konva.Group();
    tGrp_e = new Konva.Group();
    textpGrp_e = new Konva.Group();
    imgGrp_e = new Konva.Group();
    var shape, text, img;
    var textposX, textposY
    exportLayer.destroy();
    exportLayerImg.destroy();
    var aux_points;
    


    //Paint each segment with the respective type of color
    pieces.forEach(function(e,i){
        var stroke = 'black';
        if(e.path_type == 'C')
            stroke = '#00bfff';
        if(e.path_type == 'M'){
            if(e.type == 0){
            var auxX, auxY, middleX, middleY;

                auxY = (e.data.end.y - e.data.start.y)/2;
                middleY = e.data.end.y - auxY;
                auxX = (e.data.end.x - e.data.start.x)/2;
                middleX = e.data.end.x - auxX-50;
            var boltimg = new Image();
            boltimg.onload = function() {
                var konvaBolt = new Konva.Image({
                    name:'boltIMG',
                    image: boltimg,
                    x: middleX,   //based on text pos for horizontal , check best way to do it
                    y:  middleY ,  //based on text pos for horizontal, check best way to do it
                    scaleX: 0.5,
                    scaleY: 0.5,
                    width: 100,
                    height: 100
                });
                segGrp_e.add(konvaBolt);
                konvaBolt.moveToTop();
                
                // exportLayer.draw();
                exportStage.draw();
            };
            boltimg.src = 'images/electricity_lightning_symbol.png';   

       

            stroke = '#ff00bf';
        }
        else 
            stroke = '#ff00bf';

        }
        if(e.path_type == 'Y')
            stroke = '#ffbf00';
        

        switch(e.type){
            case 0:
                if(e.data.start.x == e.data.end.x){ //v
                    aux_points = [e.data.start.x, e.data.start.y+1, e.data.end.x, e.data.end.y-1];
                    //text
                    textposX = e.data.start.x + 10;
                    if(e.data.start.y < e.data.end.y)
                        textposY = e.data.start.y + (Math.abs(e.data.end.y-e.data.start.y) / 2)-7;
                    else 
                        textposY = e.data.end.y + (Math.abs(e.data.start.y-e.data.end.y) / 2)-7;
                }
                else{ //h
                    aux_points = [e.data.start.x+1, e.data.start.y, e.data.end.x-1, e.data.end.y];
                    //text
                    textposY = e.data.start.y + 15;
                    if(e.data.start.x < e.data.end.x)
                        textposX = e.data.start.x + (Math.abs(e.data.end.x-e.data.start.x) / 2)-5;
                    else 
                        textposX = e.data.end.x + (Math.abs(e.data.start.x-e.data.end.x) / 2)-5;
                }                
                break;
            case 1:
                aux_points = [ 
                    e.data.lim1.x, e.data.lim1.y,
                    e.data.c.x, e.data.c.y,
                    e.data.lim2.x, e.data.lim2.y 
                ];
                //text
                switch(e.data.t){
                    case 0:
                        textposX = e.data.c.x - 25;
                        textposY = e.data.c.y - 25;
                        break;
                    case 1:
                        textposX = e.data.c.x - 25;
                        textposY = e.data.c.y + 10;
                        break;
                    case 2:
                        textposX = e.data.c.x + 10;
                        textposY = e.data.c.y + 10;
                        break;
                    case 3:
                        textposX = e.data.c.x + 10;
                        textposY = e.data.c.y - 25;
                        break;
                }                
                break;
            case 2:
                aux_points = [
                    e.data.lim1.x, e.data.lim1.y,
                    e.data.point.x, e.data.point.y,
                    e.data.lim3.x, e.data.lim3.y,
                    e.data.point.x, e.data.point.y,
                    e.data.lim2.x, e.data.lim2.y
                ];
                switch(e.data.t){
                    case 0:             
                        textposX = e.data.point.x - 25;
                        textposY = e.data.point.y - 5;
                        break;
                    case 1:
                        textposX = e.data.point.x - 5;
                        textposY = e.data.point.y - 25;                
                        break;
                    case 2:
                        textposX = e.data.point.x + 10;
                        textposY = e.data.point.y - 5;                        
                        break;
                    case 3:
                        textposX = e.data.point.x - 5;
                        textposY = e.data.point.y + 10;                
                        break;
                }                
                break;
        }
        //add image of bolt to the magenta segment
        
        // Konva.Image.fromURL('images/electricity_lightning_symbol.png', function(darthNode) {
        //     darthNode.setAttrs({
        //       x: (modules[0].data.start.x - modules[0].data.end.x)/2,
        //       y: (modules[0].data.start.y - modules[0].data.end.y)/2,
        //       scaleX: 0.5,
        //       scaleY: 0.5
        //     });
        //     exportLayer.batchDraw();
        //     imgGrp_e.add(darthNode);

        // });

          
        

    

        shape = new Konva.Line({
            points: aux_points,
            strokeWidth: 15,
            stroke: stroke,
            opacity: 1
        });

        text = new Konva.Text({
            x: textposX,
            y: textposY,
            text: e.data.disp,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 20,
            fill: "black"                    
        });
        segGrp_e.add(shape);
        textpGrp_e.add(text);

});
    //draw of the export
    exportLayer.add(segGrp_e);
    exportLayer.add(textpGrp_e);
    exportLayer.add(imgGrp_e);
    exportStage.add(exportLayer,exportLayerImg);

    zoomFit(exportStage);
    exportStage.draw();

}
//Overview data
function loadOverviewData(){
    ///PROJECT OVERVIEW
    //Export
    
    //project
    $('#projName').html(strings.projName+': <strong>'+projectDef.project.name+'</strong>');
    $('#projRoom').html(strings.room+': <strong>'+projectDef.project.room+'</strong>');
    $('#projAddress').html(strings.projAddress+': <strong>'+projectDef.project.address+'</strong>');
    $('#projDate').html(strings.date+': <strong>'+projectDef.project.date+'</strong>');
    //contact
    $('#contName').html(strings.contName+': <strong>'+projectDef.contact.name+'</strong>');
    $('#contAddress').html(strings.contAddress+': <strong>'+projectDef.contact.address+'</strong>');
    $('#contCountry').html(strings.country+': <strong>'+projectDef.contact.country+'</strong>');
    $('#contPhone').html(strings.phone+': <strong>'+projectDef.contact.phone+'</strong>');
    $('#contEmail').html(strings.mail+': <strong>'+projectDef.contact.email+'</strong>');

    ///LEY
    $('#housing').html(strings.housing+': <strong>'+strings.alumProfile+'</strong>');

    $('#total_length').html(strings.total_length+': <strong>'+getTotalLen(modules)+' mm </strong>');
       
    $('#ley_source').html(strings.lightSource+': <strong>'+getLightOutput().name+' &#8231; '+getLedColor().name+'</strong>');
    if(opticsMode == 1){ //difuser
        // $('#ley_ugr').html(strings.ugr+': <strong> &#8804; 25 </strong>');
        $('#ley_optics').html(strings.optics+': <strong>'+getOptics().name+' &#8231; '+strings.diffuseLD+'</strong>');
    }
    else if(opticsMode == 2){ //shielded
        // $('#ley_ugr').html(strings.ugr+': <strong> &#8804; 19 </strong>');
        $('#ley_optics').html(strings.optics+': <strong>'+getOptics().name+' &#8231; '+getBeam().ld+'</strong>');
    }
    $('#ley_color').html(strings.color+': <strong>'+getColor().name+'</strong>');  
    $('#ley_driver').html(strings.driver+': <strong> '+strings.driver_dali+' </strong>');    
    $('#ley_voltage').html(strings.voltage+': <strong>230-240V</strong>');
    $('#ley_freq').html(strings.frequency+': <strong>50Hz AC</strong>');
    $('#ley_photoSafety').html(strings.photoSafety+': <strong>IEC/TR 62778: RG 1</strong>'); 
    //line parameters
    var lp = calcLineParam();
    $('#ley_ugr').html(strings.ugr+': <strong> &#8804; '+calcUGR()+' </strong>');
    $('#lumFlux_tot').html(strings.lumFlux_tot+': <strong>'+lp.tot+' '+strings.lumen+'</strong>');
    $('#lumFlux_up').html(strings.lumFlux_up+': <strong>'+lp.up+' '+strings.lumen+'</strong>');
    $('#lumFlux_down').html(strings.lumFlux_down+': <strong>'+lp.dwn+' '+strings.lumen+'</strong>');
    $('#lumEfficacy').html(strings.lumEfficacy+': <strong>'+lp.eff+' lm/W </strong>');
    var llmf = getLLMFValue().toString();
    var llmfHTML = llmf.substring(0, 4);
    $('#LLMF').html('LLMF'+': <strong>'+llmfHTML+'</strong>');
    $('#ley_power').html(strings.power+': <strong>'+lp.pow+' W</strong>');  //
    $('#number_of_drivers').html(strings.number_of_drivers +': <strong>'+getNumberOfDrivers()+'</strong>');  
    $('#max_drivers').html(strings.max_drivers);  

    var TPF = TotalPowerFactor().toString();
    var res = TPF.substring(0, 4);
    $('#tot_power_ft').html(strings.power_factor+': <strong>'+res+' </strong>');
    var fluxPerMeter = lp.tot/getTotalLen(modules) * 1000;

    if(modules.length){
        $('#tender').html(strings.tender_intro_1 + ifHasUpLight()  + getInstallationTranslation() + getLuminaire() + getOpticsTranslations()+ strings.tender_enec_certified_1 + strings.tender_warranty_1 +
            strings.tender_general_1 + strings.tender_dimensions_1 + getTotalLen(modules) + strings.tender_dimensions_2 + strings.tender_IP_20 + strings.tender_IK_07 + strings.tender_Glowwire_850 + strings.tender_light_technology_1 + 
            getDistribution() + strings.tender_UGR_1 + calcUGR() + strings.tender_UGR_2 + checkLuminance() + strings.tender_luminous_flux_1 + lp.tot + strings.tender_luminous_flux_2 + Math.round(fluxPerMeter)+
            strings.tender_luminous_flux_3 + uplightNotZero() + strings.tender_power_1 + lp.pow + strings.tender_power_2 + strings.tender_efficiency_1 + Math.round(lp.tot/lp.pow) + strings.tender_efficiency_2 + strings.tender_LLMF_1 +
            "95" + strings.tender_LLMF_2 + "95" + strings.tender_LLMF_3 + strings.tender_colour_temperature_1 + getLedColor().name + strings.tender_colour_temperature_2 + strings.tender_colour_rendering_1  + "80" + strings.tender_colour_rendering_2  +
            strings.tender_colour_tolerance_1 + hasShield() +




            strings.tender_electrical_1 + strings.tender_dali_driver_1 + strings.tender_insulation_class_1 + strings.tender_Housing_1 + strings.tender_Housing_2 + strings.tender_colour_1 + getColor().name + 
            strings.tender_Housing_3 + getSuspendedInstallation() + strings.tender_outro_1);
    }
}
/* */
//FUNCTIONS TO TENDER



function ifHasUpLight()
{
    var out = '';
    var count = 0;

    for(var i = 0; i < modules.length; i++)
    {
        if(modules[i].data.ind == true)
        {
            count++;
        }
        else
            count = count + 0;
    }
    if(count != 0)
    {
        out = strings.tender_uplight_1; 
    }
    else
    {
        out = '';
    }
    return out;
}

function getLuminaire()
{
    var out = '';
    if(modules.length == 1)
    {
        out = strings.tender_individual_luminaire_1;

    }
    else
    {
        out = strings.tender_in_line_luminaire_1;

    }
    return out;
}

function getInstallationTranslation()
{
    var out = '';
    var auxType = getInstalation().cod;

        if(auxType == "R")
        {
            out = strings.tender_installation_ceiling_mounted;
        }
        else if(auxType == "W")
        {
            out = strings.tender_installation_wall_mounted;
        }
        else
        {
            out = strings.tender_installation_suspended
        }
    return out;
}

function getOpticsTranslations()
{
    var out = '';
    var auxType = getOptics().cod;

        if (auxType == 'D' && modules.length > 1)//diffusor
        {
            out = strings.tender_intro_2;
        }
        else if(auxType == 'S')//white shield
        {
            out = strings.tender_intro_3;
            out+= strings.tender_intro_4;
        }
        else if(auxType == 'B')
        {
            out = strings.tender_intro_3;
            out+= strings.tender_intro_5;
        }
    return out;
}

function getDistribution()
{
    var out = '';
    var auxType = getOptics().cod;
    var auxBeam = getBeam().cod;

    if(auxType == 'D')
    {
        out = strings.tender_light_distribution_diffuse;
    }
    else
    {
        if(auxBeam == '1')
        {
            out = strings.tender_light_distribution_medium_beam;

        }
        else
        {
            out = strings.tender_light_distribution_wide_beam;
        }
    }
    return out;

}

function checkLuminance()
{
    var out = '';
    var auxType = getOptics().cod;

    if(auxType == 'S' || auxType == 'B')
    {
        out = strings.tender_luminance;
    }
    else
    {
        out = '';
    }
    return out;
}

function uplightNotZero()
{
    var lp = calcLineParam();
    var out = '';
    if(lp.up != 0)
    {
        out+=strings.tender_uplight_2;
        out+=lp.dwn;
        out+=strings.tender_uplight_3;
        out+=lp.up;
        out+=strings.tender_uplight_4;
        out+=Math.round((lp.dwn/lp.tot) * 100) //* 0.01;
        out+=strings.tender_uplight_5;
        out+=Math.round((lp.up/lp.tot) * 100) //* 0.01;
        out+=strings.tender_uplight_6;
    }
    else
    {
        out = '';
    }
    return out;
}

function getColorTranslation()
{
    var out = '';
    var auxType = getColor().cod;
    if(auxType == 'X1')
    {
        out = strings.color_op2;
    }
    else if(auxType == 'X0')
    {
        out = strings.color_op1;
    }
    else if(auxType == 'X2')
    {
        out = strings.color_op2;
    } 
    else
    {
        out = strings.custom_ral;
    }
    return out;
}

//If has suspended installation or not
function getSuspendedInstallation()
{
    var out = '';
    var auxSuspension = getSuspensionType().type;
    var auxType = getInstalation().cod;
    if(auxType == 'S' && auxSuspension == 0)
    {
        out = strings.tender_suspended_junction_box_1;
        out += getColor().name;
        out += strings.tender_suspended_junction_box_2;
        if(modules.length > 1)
        {
            out+=strings.tender_suspended_electric_installation_1;
            out+=strings.tender_connection_in_line_1;
        }
        else
        {
            out+=strings.tender_suspended_electric_installation_3;

        }
    }
    else if(auxType == 'S' && auxSuspension == 1)
    {
        if(modules.length > 1)
        {
            out = strings.tender_suspended_electric_installation_2;
            out+= strings.tender_connection_in_line_1;
        }
        else
        {
            out+= strings.tender_suspended_electric_installation_4;
        }
    }
    else if(auxType == 'R' || auxType == 'W' && checkInLine() == true)
    { 
        out = strings.tender_wall_or_ceiling_in_line_1;
        out+= strings.tender_connection_in_line_1;

    }
    return out;
    
}

//check size of the draw
function checkInLine()
{
    if(modules.length > 1)
    {
        return true;
    }
    else
    {
        return false;
    }  
}
//get light distribution for the module(tender remaining functions)
function lightDistributionCheck()
{
    count = 0;//if 0 all equals, 1 are differents
    var i = 0;
    for(var i  = 0; i < modules.length -1;i++){
        if(modules[i].type == 0 && modules[i+1].type == 0 )
        {
            if(modules[i].data.ind == modules[i + 1].data.ind && modules[i].data.dir == modules[i + 1].data.dir)
            {
                count = count + 0;
            }
            else
            {
                count = 1;
                break;
            }
        }
        else
        {
            if(modules[i].data.dir == modules[i + 1].data.dir)
            {
                count = count + 0;
            }
            else
            {
                count = 1;
                break;
            }
        }
    
    }
    return count;
}
function hasShield()
{
    var out;

    if(shieldingAngle().angle !== "false" || shieldingAngle().factors !== "false")
    {
        out = strings.tender_shielding_angle_1 + shieldingAngle().angle + strings.tender_shielding_angle_2 + strings.tender_room_utilization_factor_1 + shieldingAngle().factors + strings.tender_room_utilization_factor_2;
    }
    return out;
}
// function shieldingAngle()
// {

//     var angle = '', factors = '';
//     if(lightDistributionCheck() == 0)
//     {
//         var auxCode = getPieceCode(modules[0]);
//                 if(typeof codeList[code] !== 'undefined')
//                 {
//                     c0 = codeList[code].c0;
//                     c1 = codeList[code].c1;
//                 }
//                 else
//                 {
//                     drivers = 0;
//                 }
                
//             totalDrivers += drivers;
//         }
//         return totalDrivers;

//     }

function shieldingAngle()
{

    var angle = '', factors = '';
    if(lightDistributionCheck() == 0)
    {
        var auxCode = getPieceCode(modules[0]);

        var secondParameter = auxCode.substr(3, 2);
        var thirdParameter = auxCode.substr(10,2);

        switch(secondParameter)
        {
            case 'DJ':
                if (thirdParameter == "LL")
                {
                    angle = "80°/80°";
                    factors = "min. 60%";
                    break;
                }
                else if(thirdParameter == "L0")
                {
                    angle = "85°/85°";
                    factors = "min 71%";
                    break;
                }
                else if(thirdParameter == "MM")
                {
                    angle = "80°/80°";
                    factors = "min. 60%";
                    break;
                }
                else
                {
                    angle = "85°/85°";
                    factors = "min. 71%";
                    break;
                }
            case 'S1':
                if(thirdParameter == "MM")
                {
                    angle = "65°/65°";
                    factors = "min. 67%"
                    break;
                }
                else
                {
                    angle = "65°/75°";
                    factors = "min. 81%"
                    break;
                }
            case 'S3':
                if(thirdParameter == "MM")
                {
                    angle = "60°/65°";
                    factors = "min. 65%";
                    break;
                }
                else
                {
                    angle = "65°/70°";
                    factors = "min. 75%";
                    break;
                }
            case 'B1':
                if(thirdParameter == "MM")
                {
                    angle = "60°/60°";
                    factors = "min. 67%";
                    break;
                }
                else
                {
                    angle = "60°/65°";
                    factors = "min. 83%";
                    break;
                }
            case 'B3':
                if(thirdParameter == "MM")
                {
                    angle = "60°/60°";
                    factors = "min. 65%";
                    break;
                }                 
                else
                {
                    angle = "60°/60°";
                    factors = "min. 78%";
                    break;
                }

        }

    }
    else
    {
        angle = "false";
        factors = "false";
    }


    return {angle:angle, factors:factors};
}

//total number of drivers
function getNumberOfDrivers()
{
    var totalDrivers = 0;
    for(var i = 0; i < modules.length;i++)
    {
            var code = getPieceCode(modules[i]);
            if(typeof codeList[code] !== 'undefined')
            {
                drivers = codeList[code].drivers;
            }
            else
            {
                drivers = 0;
            }
            
        totalDrivers = totalDrivers + drivers;
    }
    return totalDrivers;
}

//Get code Data from ley_code.csv file
function getCodesData(){
    (function() {
        var url = 'res/ley_codes.csv';
        $.ajax({
            'global': false,
            'url': url,
            'success': function (data) {
                parseCodesData(data);
            }
        });
    })();
}
function parseCodesData(obj){
    var allTextLines = obj.split(/\r\n|\n/);
    var nr = allTextLines[0].split(';').length;
    // refESM.v = allTextLines[0].split(';')[1];
    var out = [];
    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        out[''+data[0]] = {
            ltr:data[1],
            llmf:parseFloat(data[16]),
            err: parseInt(data[17]),
            tot:parseInt(data[18]), 
            pow:parseInt(data[19]),
            pwft:parseFloat(data[20]),
            up:parseInt(data[21]), 
            dwn:parseInt(data[22]),
            ugr:parseInt(data[23]),
            c0:parseInt(data[24]),
            c1:parseInt(data[25]),
            drivers:parseInt(data[26])
        };
    }
    codeList = out;
}
//function to compare the codes of modules and CSV array
function getLLMFValue()
{
    var lowest = 10;
    var llmf;
    for(var i = 0; i < modules.length;i++)
    {
        if(modules[i].type == 0)
        {
            var code = getPieceCode(modules[i]);
            if(typeof codeList[code] !== 'undefined')
            {
                llmf = codeList[code].llmf;
            }

        }
        if(llmf == 0)
        {
        }
        else if(lowest > llmf)
        {
            lowest = llmf;
        }
    }
    return lowest;
}
//how to calculate the total power factor
function TotalPowerFactor()
{
    var lp = calcLineParam();

    var totalSegments = 0;
    var totalPower = 0;
    

    for(var i = 0; i < modules.length;i++)
    {
        if(modules[i].type == 0)
        {
            var code = getPieceCode(modules[i]);
            if(typeof codeList[code] !== 'undefined'){
                pwft = codeList[code].pwft;
                pow  = codeList[code].pow;
                totalPower = totalPower + pow

                var cos = Math.acos(pwft);
                var cosDegrees = cos * (180 / 3.1459);

                var tan = Math.tan(cos);
                var tanDegrees = tan * (180 / 3.1459);
                var result = pow * tan;
                totalSegments = totalSegments + result;
            }
        } 
    }
    var exponencial = Math.pow(totalPower, 2);
    var mySegments = Math.pow(totalSegments, 2);
    var total = exponencial + mySegments;
    var sqrt = Math.sqrt(total);
    var TPF = totalPower/sqrt;
    return TPF.toFixed(2);
}



function calcUGR(){
    var out = 0;
    for(var i=0; i<modules.length; i++){
        var code = getPieceCode(modules[i]);
        if(typeof codeList[code] !== 'undefined'){
            if(out < codeList[code].ugr)
                out = codeList[code].ugr;
            if(out === 25)
                return 25;
        }
        else{
            //log not present code
            console.log('>Code not present on codeList: '+code);
        }
    }
    return out;
}
//Get total val, up, dw and pow
function calcLineParam(){
    var tot=0, up=0, dwn=0, pow = 0, eff = 0;
    for(var i=0; i<modules.length; i++){
        var code = getPieceCode(modules[i]);
        if(typeof codeList[code] !== 'undefined'){
            up += codeList[code].up;
            dwn += codeList[code].dwn;
            pow += codeList[code].pow;
        }
        else{
            //log not present code
            console.log('>Code not present on codeList: '+code);
        }
    }
    tot = up+dwn;
    if(pow)
        eff = Math.round(tot / pow);
    return {tot:tot,up:up,dwn:dwn,pow:pow,eff:eff};
}

//Generate Overview Table
function genOverviewTable(pieces){
    //segments
    html = '<table id="chOverviewTable" class="export_table"><thead>';
    if(hasUplight()){
        html +='<tr><th colspan="2" style = "margin-left: 10px">'+strings.tblHead_ch+'</th><th>'+strings.tblHead_len+'</th><th>'+strings.downlight+'</th><th>'+strings.uplight+'</th><th>'+strings.orderCode+'</th><th>ULD</th></tr>';
        html+='</thead><tbody>';
        for(var i=0; i<configSegs.length; i++){
            var subAux = configSegs[i].subSegments;
            if(subAux.length > 1){

                var father = getCompositionString(configSegs[i].composition);

                //father
                html+='<tr><td>'+subAux[0].disp.split('.')[0]+'</td><td></td><td>'+fatherSumCompositon(father)+'</td><td></td><td></td><td></td><td></td></tr>';
                //children
                subAux.forEach(function(e){
                    var dir ='', ind = '';
                    if(e.dir)
                        dir = '&#10003';
                    if(e.ind)
                        ind = '&#10003';
                    var code = getPieceCode(getPieceBySegId(e.id,pieces));
                    var codeCustom = getPieceCodeForCustomColor(getPieceBySegId(e.id,pieces));

                    //generation of the ULD code 
                    var link = '<a href="/ley/uld/'+code.replace("/", "_")+'_LTRevAA.uld" type="application/octet-stream" title="'+code+'_LTRevAA.uld" target="_blank">ULD file (drag &amp; drop)</a>';
                    html+='<tr><td></td><td>'+e.disp+'</td><td>'+getSegLength(e)+'</td><td>'+dir+'</td><td>'+ind+'</td><td>'+codeCustom+'</td><td>'+link+'</td></tr>';
                });
            }
            else{
                var dir ='', ind = '';
                if(subAux[0].dir)
                    dir = '&#10003';
                if(subAux[0].ind)
                    ind = '&#10003';
                var code = getPieceCode(getPieceBySegId(subAux[0].id,pieces));
                var codeCustom = getPieceCodeForCustomColor(getPieceBySegId(subAux[0].id,pieces));

                var link = '<a href="/ley/uld/'+code.replace("/", "_")+'_LTRevAA.uld" type="application/octet-stream" title="'+code+'_LTRevAA.uld" target="_blank">ULD file (drag &amp; drop)</a>';
                //only father
                html+='<tr><td>'+subAux[0].disp+'</td><td></td><td>'+getSegLength(subAux[0])+'</td><td>'+dir+'</td><td>'+ind+'</td><td>'+codeCustom+'</td><td>'+link+'</td></tr>';
            }
        }
    }else{
        html +='<tr><th colspan="2">'+strings.tblHead_ch+'</th><th>'+strings.tblHead_len+'</th><th>'+strings.downlight+'</th><th>'+strings.orderCode+'</th><th>ULD</th></tr>';
        html+='</thead><tbody>';
        for(var i=0; i<configSegs.length; i++){
            var subAux = configSegs[i].subSegments;
            if(subAux.length > 1){
                //father
                var father = getCompositionString(configSegs[i].composition);

                html+='<tr><td>'+subAux[0].disp.split('.')[0]+'</td><td></td><td>'+fatherSumCompositon(father)+'</td><td></td><td></td><td></td></tr>';
                //children
                subAux.forEach(function(e){
                    var dir ='';
                    if(e.dir)
                        dir = '&#10003';
                    var code = getPieceCode(getPieceBySegId(e.id,pieces));
                    var codeCustom = getPieceCodeForCustomColor(getPieceBySegId(e.id,pieces));

                    var link = '<a href="/ley/uld/'+code.replace("/", "_")+'_LTRevAA.uld" type="application/octet-stream" title="'+code+'_LTRevAA.uld" target="_blank">ULD file (drag &amp; drop)</a>';
                    html+='<tr><td></td><td>'+e.disp+'</td><td>'+getSegLength(e)+'</td><td>'+dir+'</td><td>'+codeCustom+'</td><td>'+link+'</td></tr>';
                });
            }
            else{
                var dir ='';
                if(subAux[0].dir)
                    dir = '&#10003';
                var code = getPieceCode(getPieceBySegId(subAux[0].id,pieces));
                var codeCustom = getPieceCodeForCustomColor(getPieceBySegId(subAux[0].id,pieces));

                var link = '<a href="/ley/uld/'+code.replace("/", "_")+'_LTRevAA.uld" type="application/octet-stream" title="'+code+'_LTRevAA.uld" target="_blank">ULD file (drag &amp; drop)</a>';
                //only father
                html+='<tr><td>'+subAux[0].disp+'</td><td></td><td>'+getSegLength(subAux[0])+'</td><td>'+dir+'</td><td>'+codeCustom+'</td><td>'+link+'</td></tr>';
            }
        }
    }
    html+='</tbody></table>';
    //corners
    if(configCorners.length > 0){
        html += '<table id="cornerOverviewTable" class="export_table">';
        html += '<thead><tr><th style="width:120px">'+strings.corners+'</th><th>'+strings.downlight+'</th><th>'+strings.orderCode+'</th><th>ULD</th></tr></thead>';
        html += '<tbody>';
        pieces.forEach(function(e,i){
            if(e.type == 1){
                var dir ='';
                if(e.data.dir)
                    dir = '&#10003';
                var code = getPieceCode(e);
                var codeCustom = getPieceCodeForCustomColor(e);


                var link = '<a href="/ley/uld/'+code.replace("/", "_")+'_LTRevAA.uld" type="application/octet-stream" title="'+code+'_LTRevAA.uld" target="_blank">ULD file (drag &amp; drop)</a>';
                //corner
                html+='<tr><td>'+e.data.disp+'</td><td>'+dir+'</td><td>'+codeCustom+'</td><td>'+link+'</td></tr>';
            }
        });
        html+='</tbody></table>';
    }
    //t-connection
    if(configTs.length > 0){
        html += '<table id="tconnOverviewTable" class="export_table">';
        html += '<thead><tr><th style="width:120px">'+strings.tConns+'</th><th>'+strings.downlight+'</th><th>'+strings.orderCode+'</th><th>ULD</th></tr></thead>';
        html += '<tbody>';
        pieces.forEach(function(e,i){
            if(e.type == 2){
                //t-connection
                var dir ='';
                if(e.data.dir)
                    dir = '&#10003';
                var code = getPieceCode(e);
                var codeCustom = getPieceCodeForCustomColor(e);


                var link = '<a href="/ley/uld/'+code.replace("/", "_")+'_LTRevAA.uld" type="application/octet-stream" title="'+code+'_LTRevAA.uld" target="_blank">ULD file (drag &amp; drop)</a>';
                html+='<tr><td>'+e.data.disp+'</td><td>'+dir+'</td><td>'+codeCustom+'</td><td>'+link+'</td></tr>';
            }
        });
        html+='</tbody></table>';
    }

    //diffusor profile
    var diffProfs = [];
    if(opticsMode == 1 && pieces.length > 1){
        //only for diffuser, not shielded. Individual luminaires (pieces.length == 1) don't need separate profile
        html += '<table class="export_table">';
        html += '<thead><tr><th style="width:120px">'+strings.diffProfile+'</th><th>'+strings.tblHead_len+'</th><th>'+strings.orderCode+'</th></tr></thead>';
        html += '<tbody>';

        diffLength = getTotalDownlightLen(pieces); //total length in diffusor       
        if(diffLength <= 49000){
            code =  getDiffuserProfileCode(diffLength);
            diffProfs.push(diffLength);
            html+='<tr><td>'+strings.diffProfile+'</td><td>'+diffLength+'</td><td>'+code+'</td></tr>';            
        }
        else{
            while(diffLength > 49000){
                code =  getDiffuserProfileCode(diffLength);
                diffProfs.push(diffLength);
                diffLength = diffLength-49000;
                html+='<tr><td>'+strings.diffProfile+'</td><td>49000</td><td>'+code+'</td></tr>';
            }
            //remainder
            code =  getDiffuserProfileCode(diffLength);
            diffProfs.push(diffLength);
            html+='<tr><td>'+strings.diffProfile+'</td><td>'+diffLength+'</td><td>'+code+'</td></tr>';
        }
        html+='</tbody></table>';
    }

    //mounting accessories
    html += '<table class="export_table">';
    html += '<thead><tr><th>'+strings.mountAccess+'</th><th>'+strings.quantity+'</th><th>'+strings.orderCode+'</th></tr></thead>';
    html += '<tbody>';

    //Dossier
    html+='<tr><td>'+strings.dossier+'</td><td>1</td><td>V3H9900</td></tr>';

    switch(getInstalation().sel){
        case '0': //ceiling
            // if(pieces.length==1)
            var qnt = (pieces.length+1); //total plus 1
            // qnt+=configCorners.length; //one more for each corner
            qnt+=configTs.length; //one more for each T
            html+='<tr><td>'+strings.ceilingMount+'</td><td>'+qnt+'</td><td>V3H2500</td></tr>';
            break;
        case '1': //wall
            var qnt = (pieces.length+1); //total plus 1
            // qnt+=configCorners.length; //one more for each corner
            // qnt+=configTs.length; //one more for each T
            html+='<tr><td>'+strings.wallMount+'</td><td>'+qnt+'</td><td>V3H2700</td></tr>';
            break;
        case '2': //suspended
            var susType = getSuspensionType().type;
            var susLen = getSuspensionType().len;
            var code = '', desc = '';

            if(pieces.length>1){
                //magenta source
                if(susType == 0){ //power box
                    code = 'V3H2610/'+(susLen/10).toString().pad(3)+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2611/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;                    
                }
                html+='<tr><td>'+desc+'</td><td>1</td><td>'+code+'</td></tr>';
                //additional suspension points
                code = 'V3H2620/'+(susLen/10).toString().pad(3);
                var qnt = pieces.length + configTs.length; //total + t-conns
                // var qnt = pieces.length + configCorners.length + configTs.length; //total + corners + t-conns
                html+='<tr><td>'+strings.sus_additional+'</td><td>'+qnt+'</td><td>'+code+'</td></tr>';
            }
            else{
                //individual luminaire
                if(susType == 0){ //power box
                    code = 'V3H2600/'+parseInt((susLen/10))+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2601/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;  
                }
                html+='<tr><td>'+desc+'</td><td>1</td><td>'+code+'</td></tr>';
            }
            break;
    }
    if(opticsMode == 1 && pieces.length > 1){
        //diffuser cover plates
        diffProfs.forEach(function(e){
            if(e<=5000){
                //do nothing
            }
            else if(e<=12000){
                html+='<tr><td>'+strings.diffCoverPlate+'</td><td>2</td><td>V3H1208/1-'+getColor().cod+'</td></tr>';                
            }
            else if(e<=25000){
                html+='<tr><td>'+strings.diffCoverPlate+'</td><td>2</td><td>V3H1208/2-'+getColor().cod+'</td></tr>';
            }
            else{
                html+='<tr><td>'+strings.diffCoverPlate+'</td><td>2</td><td>V3H1208/4-'+getColor().cod+'</td></tr>';
            }
        });
    }    
    html+='</tbody></table>';

    $('#overviewComponents').html(html);
}
function getPieceBySegId(segId,pieces){
    for(var i=0; i<pieces.length; i++){
        if(pieces[i].type == 0){
            //segment
            if(pieces[i].data.id == segId)
            return pieces[i];
        }
    }
    return -1;
}
function getTotalDownlightLen(p){
    var out = 0;
    p.forEach(function(e){
        if(e.data.dir){
            switch(e.type){
                case 0: //seg
                    out+=getSegLength(e.data);
                    break;
                case 1: //corn
                    out+=1120; //560+560    
                    break;
                case 2: //t
                    out+=1960; //560+1400    
                    break;
            }
        }        
    });
    return out;
}

function getTotalLen(p){
    var out = 0;
    p.forEach(function(e){
            switch(e.type){
                case 0: //seg
                    out+=getSegLength(e.data);
                    break;
                case 1: //corn
                    out+=1120; //560+560    
                    break;
                case 2: //t
                    out+=1960; //560+1400    
                    break;
            }
                
    });
    return out;
}
function getDiffuserProfileCode(totLen){
    var code = '';
    if(totLen <= 3000){ //minimum length
        code =  'V3H3090/03000';
    }
    else if(totLen <= 40000){
        totLen = totLen /1000;
        totLen = Math.ceil(totLen)*1000;
        code =  'V3H3090/'+totLen.toString().pad(5); 
    }
    if(totLen>40000){ //maximum length
        code =  'V3H3090/49000';
    }
    return code;
}

//String pad function
String.prototype.pad = function (length, padder) {
    length = length || 2;
    padder = padder || '0';
    for (var i = 0, str = ''; i < length - this.toString().length - padder.length + 1; i++) {
        str += padder;
    }
    return str + this;
};

////Zoom Functions
function calcBound(i, j, xmin, xmax, ymin, ymax, x1, x2, y1, y2){
    var xcenter, ycenter;
    if (j === 0 && i === 0) {
        xmin = x1;
        xmax = x1;
        ymin = y1;
        ymax = y1;
        xcenter = x1;
        ycenter = y1;
    }

    if (xmin >= x1)
        xmin = x1;
    if (xmin >= x2)
        xmin = x2;
    if (xmax <= x1)
        xmax = x1;
    if (xmax <= x2)
        xmax = x2;

    if (ymin >= y1)
        ymin = y1;
    if (ymin >= y2)
        ymin = y2;
    if (ymax <= y1)
        ymax = y1;
    if (ymax <= y2)
        ymax = y2;

    xcenter = xmin + (Math.abs((xmax - xmin)) / 2);
    ycenter = ymin + (Math.abs((ymax - ymin)) / 2);

    return {xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax, xcenter: xcenter, ycenter: ycenter};
}
function getFocusArea(){
    var xmin, xmax, ymin, ymax, xcenter, ycenter;
    var bound;
    if(segsArray.length){
        for (var i = 0; i < segsArray.length; i++) {
            var j = 0;
            bound = calcBound(i, j, xmin, xmax, ymin, ymax, segsArray[i].start.x, segsArray[i].end.x, segsArray[i].start.y, segsArray[i].end.y);
            xmin = bound.xmin;
            xmax = bound.xmax;
            ymin = bound.ymin;
            ymax = bound.ymax;
            xcenter = bound.xcenter;
            ycenter = bound.ycenter;
        }
        return {xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax,
            width: (xmax - xmin), height: (ymax - ymin),
            xcenter: xcenter, ycenter: ycenter};
    }
    return false;
}
function zoomFit(zStage){
    var stageWidth = zStage.getWidth();
    var stageHeight = zStage.getHeight();
    var scale = zStage.getScaleX();
    var screenMargin = 100;

    var focusArea = getFocusArea();

    if(focusArea){
        var widthRatio = stageWidth / (focusArea.width + screenMargin);
        var heightRatio = stageHeight / (focusArea.height + screenMargin);
    
        if (widthRatio > heightRatio) {
            scale = heightRatio;
        } else {
            scale = widthRatio;
        }
        //scale limits - only applies to the design stage
        if(zStage.attrs.name == "designStage"){
            if(scale > maxScale)
                scale = maxScale;
            if(scale < minScale)
                scale = minScale;
        }
    
        zStage.scaleX(scale);
        zStage.scaleY(scale);
        zStage.offsetX(focusArea.xcenter);
        zStage.offsetY(focusArea.ycenter);
        // zStage.setX(focusArea.xcenter+zStage.x());
        // zStage.setY(focusArea.ycenter+zStage.y());
        zStage.setX(zStage.getWidth() * .5);
        zStage.setY(zStage.getHeight() * .5);
    
        // zoomVars.origin = zStage.position();    
        if(zStage.attrs.name == "designStage"){
            zoomVars_design.origin = {x: zStage.x()-focusArea.xcenter, y:zStage.y()-focusArea.ycenter};
            zoomVars_design.scale = scale;
        }        
        else if(zStage.attrs.name == "configStage")
            zoomVars_config.origin = {x: focusArea.xcenter+zStage.x(), y: focusArea.ycenter+zStage.y()};
    }
}


function getDataUri(url)
{
    return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); 
    xhr.responseType = "blob";
    xhr.onload = function (e) {
            var reader = new FileReader();
            reader.onload = function(event) {
                img = event.target.result;
                resolve(img);
            }            
            var file = this.response;
            reader.readAsDataURL(file);
    };
    xhr.send();
    })
}


//PDF for the pdf button and submit
function genProjectSummary(){
    return new Promise(async resolve => {
    var d = new jsPDF();
    url = "./images/images_pdf/" + getPieceCodeForImages()+ ".jpg";
    img = await getDataUri(url);
    d.page = 1;
    footer(d, 'p');
    var yy = 15; //first line y coordinate
    //header --------------------------------------------- todo: make function?
    d.setLineWidth(0.6);
    d.setDrawColor(255,192,0);
    d.line(15, 15, 195, 15);
    d.setFontSize(18);
    // d.setFontStyle('bold');
    yy+=8;
    d.text(17,yy,strings.title);
    yy+=8;
    d.setFontSize(16);
    d.text(17,yy,strings.projSumm);
    //---------------------------------------------------- IMAGE
    d.addImage(img, 'JPG', 105, 20, 90, 90);
    //---------------------------------------------------- PROJECT
    yy+=15;
    d.setFontSize(12);
    d.setFontStyle('bold');
    d.text(17,yy,strings.project);
    yy+=7;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.name);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.project.name);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.room);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.project.room);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.address);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.project.address);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.date);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.project.date);
    //---------------------------------------------------- CONTACT
    yy+=12;
    d.setFontSize(12);
    d.setFontStyle('bold');
    d.text(17,yy,strings.contact);
    yy+=7;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.name);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.contact.name);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.address);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.contact.address);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.country);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.contact.country);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.phone);
    d.setFontStyle('bold');
    d.text(48,yy,projectDef.contact.phone);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.mail);
    yy+=5;

    d.setFontStyle('bold');
    d.text(17,yy,projectDef.contact.email);
    yy+=6;
    // d.setFontSize(12);    
    d.setFontStyle('normal');
    d.text(17,yy,strings.addInfo);
    yy+=5;
    d.setFontStyle('normal');
    d.splitTextToSize(projectDef.extra, 170).forEach(function(e){
        if(yy < 182){
            yy+=4;
            d.text(22,yy,e);
        }
    });
    // var properYY = yy;
    //---------------------------------------------------- Line Properties
    yy+=12;
    d.setFontSize(12);
    d.setFontStyle('bold');
    d.text(17,yy,strings.lineProp);
    yy+=7;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.housing);
    d.setFontStyle('bold');
    d.text(63,yy, strings.alumProfile);
    yy+=5;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.total_length);
    d.setFontStyle('bold');    
    d.text(63,yy, getTotalLen(modules)+ ' mm'); //total lengtha
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy, strings.lightSource);
    d.setFontStyle('bold');
    d.text(63,yy, getLightOutput().name+ ' - '+getLedColor().name );
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy, strings.optics);
    d.setFontStyle('bold');
    if(opticsMode == 1){
    d.text(63,yy,getOptics().name + ' - ' + strings.diffuseLD);
    yy+=5;
    }
    else if(opticsMode == 2){ //shielded
        d.text(63,yy,getOptics().name + ' - ' + getBeam().ld);
        yy+=5;
    }
    d.setFontStyle('normal');
    d.text(17,yy,strings.ugr);
    d.setFontStyle('bold');
    d.text(63,yy, '<= '+calcUGR().toString());
    // if(opticsMode == 1)
    //     d.text(63,yy, ' ≤ 25');
    // else if(opticsMode == 2)
    //     d.text(63,yy, ' ≤ 19');

    //line parameters
    var lp = calcLineParam();
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy, strings.lumFlux_tot);
    d.setFontStyle('bold');
    d.text(63,yy, lp.tot.toString()+' '+strings.lumen);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.lumFlux_down);
    d.setFontStyle('bold');
    d.text(63,yy,lp.dwn.toString()+' '+strings.lumen);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,strings.lumFlux_up);
    d.setFontStyle('bold');
    d.text(63,yy,lp.up.toString()+' '+strings.lumen);
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy, strings.lumEfficacy);
    d.setFontStyle('bold');
    d.text(63,yy,lp.eff.toString() + ' lm/W');
    yy+=5;
    d.setFontStyle('normal');
    d.text(17,yy,'LLMF');
    d.setFontStyle('bold');
    var llmf = getLLMFValue().toString();
    var llmfHTML = llmf.substring(0, 4);
    d.text(63,yy,llmfHTML);

    //----------------------------------------------- Mechanical properties
    yy+=5;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.color);
    d.setFontStyle('bold');
    d.text(63,yy, getColor().name);

    //----------------------------------------------- Electrical properties
    yy+=5;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.driver);
    d.setFontStyle('bold');
    d.text(63,yy, strings.driver_dali);
    yy+=5;

    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.number_of_drivers);
    d.setFontStyle('bold');
    d.text(63,yy, getNumberOfDrivers().toString());
    yy+=5;

    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.max_drivers);
    yy+=14;
    
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.power);
    d.setFontStyle('bold');
    d.text(63,yy, lp.pow.toString()+' W');
    yy+=5;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy,strings.power_factor);
    d.setFontStyle('bold');
    var TPF = TotalPowerFactor().toString();
    var res = TPF.substring(0, 4);
    d.text(63,yy, res);
    yy+=5;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy, strings.voltage);
    d.setFontStyle('bold');
    d.text(63,yy, '230-240V');
    yy+=5;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy, strings.frequency);
    d.setFontStyle('bold');
    d.text(63,yy, '50Hz AC');
    yy+=5;
    d.setFontSize(10);
    d.setFontStyle('normal');
    d.text(17,yy, strings.photoSafety);
    d.setFontStyle('bold');
    d.text(63,yy, 'IEC/TR 62778: RG 1');


    //-------------------------------------------------- COMPONENTS PAGE
    //new page
    d.addPage();
    footer(d, 'p');
    yy = 15;
    d.setFontSize(12);
    d.setFontStyle('bold');
    d.text(17,yy, strings.lineDsgn);
    yy+=5;

    //LINE DESIGN IMAGE FROM STAGE
    var pieces = getPiecesArray();

    var imgData = exportStage.toDataURL(); //TODO: check how to work with pixelRatio on KONVA
    var ratioAux = exportStage.width() / exportStage.height();
    if( ratioAux >= 1 ){
        //width >= height - adjutst image size by width
        d.addImage(imgData, 'PNG', 15, yy, 180, Math.round(180/ratioAux));
        yy+= Math.round(180/ratioAux);
    }else{
        //width < height - adjutst image size by height
        xAux = Math.round((180 - (150*ratioAux))/2)+15;
        d.addImage(imgData, 'PNG', xAux, yy, Math.round(150*ratioAux), 150);
        yy+=150;
    }
    yy+=5;
    
    //COMPONENTS
    d.setFontSize(12);
    d.setFontStyle('bold');
    d.text(17,yy,strings.components);
    yy+=8;
    //segments table
    if(hasUplight()){
        var ch = 20, len=40, dwn = 93, up=113, oc = 139, uld = 180;
        //header
        yy = addSegTableHeader(d,yy,true);
        //elements
        for(var i=0; i<configSegs.length; i++){
            if (yy > 269) {
                //new page //new page
                d.addPage();
                footer(d, 'p');
                yy = 15;
                yy = addSegTableHeader(d,yy,true);
            }
            var subAux = configSegs[i].subSegments;
            if(subAux.length > 1){
                yy+=5;
                //father
                d.text((ch+2),yy,subAux[0].disp.split('.')[0]);
                d.text(len,yy,getCompositionString(configSegs[i].composition));                
                //children
                subAux.forEach(function(e){

                    if (yy > 269) {
                        //new page //new page
                        d.addPage();
                        footer(d, 'p');
                        yy = 15;
                        yy = addSegTableHeader(d,yy,true);
                    }
                    yy+=5;
                   
                    var code = getPieceCode(getPieceBySegId(e.id,modules));
                    var codeCustom = getPieceCodeForCustomColor(getPieceBySegId(e.id,modules));
                    if(typeof codeList[code] !== 'undefined')
                    {
                        var ltr = codeList[code].ltr;
                    }
                    d.text((ch+6),yy,e.disp);
                    d.text(len,yy,getSegLength(e).toString());
                    if(e.dir) d.text((dwn+7),yy,'x');
                    if(e.ind) d.text((up+5),yy,'x');
                    d.text(oc,yy,codeCustom);
                    d.setTextColor(0,0,255);
                    d.textWithLink('ULD', uld, yy, { url: 'https://ley.etaplighting.com/ley/uld/' + code.replace("/", "_") + ltr + '.uld' });
                    d.setTextColor(0,0,0);
                    d.setFontStyle('normal');
                });
            }
            else{
                //only father
                if (yy > 269) {
                    //new page //new page
                    d.addPage();
                    footer(d, 'p');
                    yy = 15;
                    yy = addSegTableHeader(d,yy,true);
                }
                //var code = getPieceCode(getPieceBySegId(subAux[0].id,modules));

                yy+=5;

                var code = getPieceCode(getPieceBySegId(subAux[0].id,pieces));
                if(typeof codeList[code] !== 'undefined')
                {
                    var ltr = codeList[code].ltr;
                }

                d.text((ch+2),yy,subAux[0].disp);
                d.text(len,yy,getSegLength(subAux[0]).toString());
                if(subAux[0].dir) d.text((dwn+7),yy,'x');
                if(subAux[0].ind) d.text((up+5),yy,'x');
                d.text(oc,yy,getPieceCodeForCustomColor(getPieceBySegId(subAux[0].id,modules)));
                d.setTextColor(0,0,255);
                d.textWithLink('ULD', uld, yy, { url: 'https://ley.etaplighting.com/ley/uld/'+code.replace("/", "_")+ ltr +'.uld' });
                d.setTextColor(0,0,0);
                d.setFontStyle('normal');
            }
        }
    }
    else{
        var ch = 20, len=40, dwn = 95, oc = 135, uld = 180;
        //header
        yy = addSegTableHeader(d,yy,false);
        //elements
        for(var i=0; i<configSegs.length; i++){
            if (yy > 269) {
                //new page //new page
                d.addPage();
                footer(d, 'p');
                yy = 15;
                yy = addSegTableHeader(d,yy,false);
            }
            var subAux = configSegs[i].subSegments;
            if(subAux.length > 1){
                yy+=5;
                //father
                d.text((ch+2),yy,subAux[0].disp.split('.')[0]);
                d.text(len,yy,getCompositionString(configSegs[i].composition));                
                //children
                subAux.forEach(function(e){
                    if (yy > 269) {
                        //new page //new page
                        d.addPage();
                        footer(d, 'p');
                        yy = 15;
                        yy = addSegTableHeader(d,yy,false);
                    }
                    yy+=5;

                    var code = getPieceCode(getPieceBySegId(e.id,modules));
                    var codeCustom = getPieceCodeForCustomColor(getPieceBySegId(e.id,modules));

                    if(typeof codeList[code] !== 'undefined')
                    {
                        var ltr = codeList[code].ltr;
                    }
                    d.text((ch+6),yy,e.disp);
                    d.text(len,yy,getSegLength(e).toString());
                    if(e.dir) d.text((dwn+7),yy,'x');
                    d.text(oc,yy,codeCustom);
      
                    d.setTextColor(0,0,255);
                    d.textWithLink('ULD', uld, yy, { url: 'https://ley.etaplighting.com/ley/uld/'+code.replace("/", "_")+ ltr + '.uld' });
                    d.setTextColor(0,0,0);
                    d.setFontStyle('normal');
                });
            }
            else{
                //only father
                if (yy > 269) {
                    //new page //new page
                    d.addPage();
                    footer(d, 'p');
                    yy = 15;
                    yy = addSegTableHeader(d,yy,false);
                }
                yy+=5;

                var code = getPieceCode(getPieceBySegId(subAux[0].id,pieces));
                if(typeof codeList[code] !== 'undefined')
                {
                    var ltr = codeList[code].ltr;
                }
                d.text((ch+2),yy,subAux[0].disp);
                d.text(len,yy,getSegLength(subAux[0]).toString());
                if(subAux[0].dir) d.text((dwn+7),yy,'x');
                d.text(oc,yy,getPieceCodeForCustomColor(getPieceBySegId(subAux[0].id,modules)));
                d.setFontStyle('italic');
                d.setTextColor(0,0,255);
                d.textWithLink('ULD', uld, yy, { url: 'https://ley.etaplighting.com/ley/uld/'+code.replace("/", "_")+ ltr + '.uld' });
                d.setTextColor(0,0,0);
                d.setFontStyle('normal');

            }
        }
    }
    //corners table       
    if(configCorners.length > 0){
        yy+=10;
        var ch = 20,  dwn = 95,  oc = 135, uld = 180;
        if (yy > 259) {
            //new page //new page
            d.addPage();
            footer(d, 'p');
            yy = 15;
        }        
        //header
        d.setFontSize(10);
        d.setFontStyle('bold');
        d.text(ch,yy,strings.corners);
        d.text(dwn,yy,strings.downlight);
        d.text(oc,yy,strings.orderCode);
        d.text(uld,yy,'ULD');

        yy+=1;
        d.setLineWidth(0.4);
        d.setDrawColor(0,0,0);
        d.line(17, yy, 193, yy);
        d.setFontStyle('normal');

        modules.forEach(function(e,i){
            if(e.type == 1){
                if (yy > 269) {
                    //new page //new page
                    d.addPage();
                    footer(d, 'p');
                    yy = 15;
                    //header
                    d.setFontSize(10);
                    d.setFontStyle('bold');
                    d.text(ch,yy,strings.corners);
                    d.text(dwn,yy,strings.downlight);
                    d.text(oc,yy,strings.orderCode);
                    d.link(uld,yy,'ULD');

                    yy+=1;
                    d.setLineWidth(0.4);
                    d.setDrawColor(0,0,0);
                    d.line(17, yy, 193, yy);
                    d.setFontStyle('normal');
                }
                var code = getPieceCode(e);
                var codeCustom = getPieceCodeForCustomColor(e);
                if(typeof codeList[code] !== 'undefined')
                {
                    var ltr = codeList[code].ltr;
                }

                yy+=5;
                d.text((ch+2),yy,e.data.disp);
                if(e.data.dir) d.text((dwn+7),yy,'x');
                d.text(oc,yy,codeCustom);
                d.setTextColor(0,0,255);
                d.textWithLink('ULD', uld, yy, { url: 'https://ley.etaplighting.com/ley/uld/'+code.replace("/", "_")+ ltr + '.uld' });
                d.setTextColor(0,0,0);
                d.setFontStyle('normal');
            }
        });
    }
    //T-connections table       
    if(configTs.length > 0){
        yy+=10; 
        var ch = 20,  dwn = 95,  oc = 135, uld = 180;
        if (yy > 259) {
            //new page //new page
            d.addPage();
            footer(d, 'p');
            yy = 15;
        }        
        //header
        d.setFontSize(10);
        d.setFontStyle('bold');
        d.text(ch,yy,strings.tConns);
        d.text(dwn,yy,strings.downlight);
        d.text(oc,yy,strings.orderCode);
        d.text(uld,yy,'ULD');

        yy+=1;
        d.setLineWidth(0.4);
        d.setDrawColor(0,0,0);
        d.line(17, yy, 193, yy);
        d.setFontStyle('normal');

        modules.forEach(function(e,i){
            if(e.type == 2){
                if (yy > 269) {
                    //new page //new page
                    d.addPage();
                    footer(d, 'p');
                    yy = 15;
                    //header
                    d.setFontSize(10);
                    d.setFontStyle('bold');
                    d.text(ch,yy,strings.tConns);
                    d.text(dwn,yy,strings.downlight);
                    d.text(oc,yy,strings.orderCode);
                    d.link(uld,yy,'ULD');

                    yy+=1;
                    d.setLineWidth(0.4);
                    d.setDrawColor(0,0,0);
                    d.line(17, yy, 193, yy);
                    d.setFontStyle('normal');
                }
                var code = getPieceCode(e);
                var codeCustom = getPieceCodeForCustomColor(e);

                if(typeof codeList[code] !== 'undefined')
                {
                    var ltr = codeList[code].ltr;
                } 
                yy+=5;
                d.text((ch+2),yy,e.data.disp);
                if(e.data.dir) d.text((dwn+7),yy,'x');
                d.text(oc,yy,codeCustom);
                d.setTextColor(0,0,255);
                d.textWithLink('ULD', uld, yy, { url: 'https://ley.etaplighting.com/ley/uld/'+code.replace("/", "_")+ ltr +'.uld' });
                d.setTextColor(0,0,0);
                d.setFontStyle('normal');

            }
        });
    }      
    //Diffusor profiles     
    if(opticsMode == 1 && modules.length > 1){
        yy+=10; 
        var ch = 20,  len = 100,  oc = 155;
        if (yy > 259) {
            //new page //new page
            d.addPage();
            footer(d, 'p');
            yy = 15;
        }
        //header
        d.setFontSize(10);
        d.setFontStyle('bold');
        d.text(ch,yy,strings.diffProfile);
        d.text(len,yy,strings.tblHead_len);
        d.text(oc,yy,strings.orderCode);
        yy+=1;
        d.setLineWidth(0.4);
        d.setDrawColor(0,0,0);
        d.line(17, yy, 193, yy);
        d.setFontStyle('normal');
        var diffProfs = [];
        var totLen = getTotalDownlightLen(modules);
        
        if(totLen <= 49000){
            diffProfs.push(totLen);
            yy+=5;
            d.text((ch+2),yy,strings.diffProfile);
            d.text(len,yy,totLen.toString());
            d.text(oc,yy,getDiffuserProfileCode(totLen));
        }
        else{
            while(totLen > 49000){
                if (yy > 255) {
                    //new page //new page
                    d.addPage();
                    footer(d, 'p');
                    yy = 15;                
                    //header
                    d.setFontSize(10);
                    d.setFontStyle('bold');
                    d.text(ch,yy,strings.diffProfile);
                    d.text(len,yy,strings.tblHead_len);
                    d.text(oc,yy,strings.orderCode);
                }
                diffProfs.push(totLen);
                yy+=5;
                code =  getDiffuserProfileCode(totLen);
                d.text((ch+2),yy,strings.diffProfile);
                d.text(len,yy,'49000'.toString());
                d.text(oc,yy,getDiffuserProfileCode(totLen));
                totLen = totLen-49000;
            }
            //remainder
            diffProfs.push(totLen);
            yy+=5;
            d.text((ch+2),yy,strings.diffProfile);
            d.text(len,yy,(totLen).toString());
            d.text(oc,yy,getDiffuserProfileCode(totLen));
        }
    }
    //Mounting accessories
    yy+=10;
    var ch = 20,  len = 130,  oc = 155;
    if (yy > 249) {
        //new page //new page
        d.addPage();
        footer(d, 'p');
        yy = 15;
    }
    //header
    d.setFontSize(10);
    d.setFontStyle('bold');
    d.text(ch,yy,strings.mountAccess);
    d.text(len,yy,strings.quantity);
    d.text(oc,yy,strings.orderCode);
    yy+=1;
    d.setLineWidth(0.4);
    d.setDrawColor(0,0,0);
    d.line(17, yy, 193, yy);
    d.setFontStyle('normal');
    yy+=5;
    //Dossier
    d.text((ch+2),yy,strings.dossier);
    d.text(len,yy,'1');
    d.text(oc,yy,'V3H9900');
    yy+=5;
    switch(getInstalation().sel){
        case '0': //ceiling
            var qnt = (modules.length+1); //total plus 1
            // qnt+=configCorners.length; //one more for each corner
            qnt+=configTs.length; //one more for each T
            d.text((ch+2),yy,strings.ceilingMount);
            d.text(len,yy,qnt.toString());
            d.text(oc,yy,'V3H2500');
            break;
        case '1': //wall
            var qnt = (modules.length+1); //total plus 1
            // qnt+=configCorners.length; //one more for each corner
            // qnt+=configTs.length; //one more for each T
            d.text((ch+2),yy,strings.wallMount);
            d.text(len,yy,qnt.toString());
            d.text(oc,yy,'V3H2700');
            break;
        case '2': //suspended
            var susType = getSuspensionType().type;
            var susLen = getSuspensionType().len;
            var code = '', desc = '';
            if(modules.length>1){
                //magenta source
                if(susType == 0){ //power box
                    code = 'V3H2610/'+parseInt((susLen/10))+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2611/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;                    
                }                
                d.text((ch+2),yy, desc);
                d.text(len,yy,'1');
                d.text(oc,yy,code);
                yy+=5;
                //additional suspension points
                code = 'V3H2620/'+parseInt((susLen/10));
                var qnt = modules.length + configTs.length; //total + t-conns
                // var qnt = modules.length + configCorners.length + configTs.length; //total + corners + t-conns                
                d.text((ch+2),yy,strings.sus_additional);
                d.text(len,yy,qnt.toString());
                d.text(oc,yy,code);
            }
            else{
                //individual luminaire
                if(susType == 0){ //power box
                    code = 'V3H2600/'+parseInt((susLen/10))+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2601/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;    
                }
                // html+='<tr><td>Suspension kit for individual luminaire</td><td>1</td><td>'+code+'</td></tr>';
                d.text((ch+2),yy,desc);
                d.text(len,yy,'1');
                d.text(oc,yy,code);
            }
            break;
    }
    //diffusor cover plates
    if(opticsMode == 1 && modules.length > 1){
        //diffuser cover plates
        diffProfs.forEach(function(e){
            yy+=5;
            if(e<=5000){
                //do nothing
            }
            else if(e<=12000){
                d.text((ch+2),yy,strings.diffCoverPlate);
                d.text(len,yy,'2');
                d.text(oc,yy,'V3H1208/1-'+getColor().cod);
            }
            else if(e<=25000){
                d.text((ch+2),yy,strings.diffCoverPlate);
                d.text(len,yy,'2');
                d.text(oc,yy,'V3H1208/2-'+getColor().cod);
            }
            else{
                d.text((ch+2),yy,strings.diffCoverPlate);
                d.text(len,yy,'2');
                d.text(oc,yy,'V3H1208/4-'+getColor().cod);
            }
        });
    }
    yy+=40;

    var description_lines = d.splitTextToSize($('#tender').val(), 180);
    var lastpointy = yy + description_lines.length*4;
    if(lastpointy > 160){
        d.addPage();
        footer(d, 'p');
        yy = 15;
    }
    d.setFontSize(12);
    d.setFontStyle('bold');
    d.text(17,yy,strings.tenderTitle);
    yy+=8;
    d.setFontStyle('normal');
    d.setFontSize(8);
    d.setFont("courier");
    d.text(17,yy, description_lines, {maxWidth: 180, align: 'justify'});
 
    
    resolve(d);
    });




}



    // var content_width = 30;
    // var page_margin = 1;
    // var lineWidth = content_width - (page_margin * 2);
    // var description_lines = d.splitTextToSize($('#tender').val(), lineWidth);

    // for(var i = 0; i < description_lines.length - 1;i++)
    // {
    //     d.text(10,yy, description_lines);
    //     yy+=5;
    // }

function addSegTableHeader(d,yy,up){
    if(up){ //has uplight
        var ch = 20, len=40, dwn = 93, up=113, oc = 139, uld = 180;
        //header
        d.setFontSize(10);
        d.setFontStyle('bold');
        d.text(ch,yy,strings.tblHead_ch);
        d.text(len,yy,strings.tblHead_len);
        d.text(dwn,yy,strings.downlight);
        d.text(up,yy,strings.uplight);
        d.text(oc,yy,strings.orderCode);
        d.text(uld,yy,'ULD');
        yy+=1;
        d.setLineWidth(0.4);
        d.setDrawColor(0,0,0);
        d.line(17, yy, 193, yy);
        d.setFontStyle('normal');
    }
    else{
        var ch = 20, len=40, dwn = 115, oc = 155, uld = 180;
        //header
        d.setFontSize(10);
        d.setFontStyle('bold');
        d.text(ch,yy,strings.tblHead_ch);
        d.text(len,yy,strings.tblHead_len);
        d.text(dwn,yy,strings.downlight);
        d.text(oc,yy,strings.orderCode);
        d.text(uld,yy,'ULD');
        yy+=1;
        d.setLineWidth(0.4);
        d.setDrawColor(0,0,0);
        d.line(17, yy, 193, yy);
        d.setFontStyle('normal');
    }
    return yy;
}

//Generation of Installation PDF
function genInstallationSummary(){
    var ins = new jsPDF();
    ins.page = 1;
    footer(ins, 'p');
    var yy = 15;


    
    ins.setLineWidth(0.6);
    ins.setDrawColor(255,192,0);
    ins.line(15, 15, 195, 15);
    ins.setFontSize(18);

    yy+=8;
    ins.text(17,yy,strings.installTitle);
    yy+=8
    ins.setFontSize(16);
    ins.text(17,yy,strings.installSubtitle);
    //-------------------------------------------- PROJECT
    yy+=15;
    ins.setFontSize(12);
    ins.setFontStyle('bold');
    ins.text(17,yy,strings.project);
    yy+=7;
    ins.setFontSize(10);
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.name);
    ins.setFontStyle('bold');
    ins.text(48,yy,projectDef.project.name);
    yy+=5;
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.room);
    ins.setFontStyle('bold');
    ins.text(48,yy,projectDef.project.room);
    yy+=5;
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.address);
    ins.setFontStyle('bold');
    ins.text(48,yy,projectDef.project.address);
    yy+=5;
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.date);
    ins.setFontStyle('bold');
    ins.text(48,yy,projectDef.project.date);

    //-------------------------------------------- Electrical properties
    var lp = calcLineParam();

    yy+=12;
    ins.setFontSize(12);
    ins.setFontStyle('bold');
    ins.text(17,yy,strings.install);
    yy+=7;


    ins.setFontSize(10);
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.driver);
    ins.setFontStyle('bold');
    ins.text(48,yy,strings.driver_dali);
    yy+=5;
    ins.setFontSize(10);
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.number_of_drivers);
    ins.setFontStyle('bold');
    ins.text(48,yy,getNumberOfDrivers().toString());
    yy+=5;

    ins.setFontSize(10);
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.max_drivers);
    yy+=14;

    ins.setFontSize(10);
    ins.setFontStyle('normal');
    ins.text(17,yy,strings.power);
    ins.setFontStyle('bold');
    ins.text(48,yy,lp.pow.toString()+' W');
    yy+=5;
    ins.setFontSize(10);
    ins.setFontStyle('normal');
    ins.text(17,yy, strings.voltage);
    ins.setFontStyle('bold');
    ins.text(48,yy, '230-240V');
    yy+=5;
    ins.setFontStyle('normal');
    ins.text(17,yy, strings.frequency);
    ins.setFontStyle('bold');
    ins.text(48,yy, '50Hz AC');
    yy+=10;
    ins.setFontStyle('normal');
    ins.text(17,yy, strings.electrical_connection);
    

    //-------------------------------------------- Dimensions
    //new page
    ins.addPage();
    footer(ins, 'p');
    var yy = 15;

    ins.setLineWidth(0.6);
    ins.setDrawColor(255,192,0);
    ins.line(15, 15, 195, 15);
    ins.setFontSize(18);
    ins.setFontStyle('normal');

    yy+=8;
    ins.text(17,yy,strings.installTitle);
    yy+=8
    ins.setFontSize(16);
    ins.text(17,yy,strings.dimensions);
    yy+=2

    //prepare design map
    var auxDesignStage = designStage.clone();
    auxDesignStage.find(".gridLayer").destroy()
    auxDesignStage.find(".tipLayer").destroy();

    var ratioLine = auxDesignStage.width()/auxDesignStage.height();
    auxDesignStage.width(auxDesignStage.width()*2);
    auxDesignStage.height(auxDesignStage.height()*2);
    zoomFit(auxDesignStage);

    var imgLine = auxDesignStage.toDataURL();
    if(ratioLine >= 1){
        ins.addImage(imgLine, 'PNG', 15, yy, 180, Math.round(180/ratioLine));
        yy+= Math.round(180/ratioLine);
    }else{
        xAux = Math.round((180 - (150*ratioLine))/2)+15;
        ins.addImage(imgData, 'PNG', xAux, yy, Math.round(250*ratioAux),150);
        yy+=150;
    }
    auxDesignStage.destroy();
    //-------------------------------------------- Components
    //new page
    ins.addPage();
    footer(ins, 'p');
    var yy = 15;

    ins.setLineWidth(0.6);
    ins.setDrawColor(255,192,0);
    ins.line(15, 15, 195, 15);
    ins.setFontSize(18);

    yy+=8;
    ins.text(17,yy,strings.installTitle);
    yy+=8
    ins.setFontSize(16);
    ins.text(17,yy,strings.componentsInstall);

    //Line Desing from Stage
    var imgStage = exportStage.toDataURL();
    var auxRatio = exportStage.width() / exportStage.height();
    if( auxRatio >= 1 ){
        //width >= height - adjutst image size by width
        ins.addImage(imgStage, 'PNG', 15, yy, 180, Math.round(180/auxRatio));
        yy+= Math.round(180/auxRatio);
    }else{
        //width < height - adjutst image size by height
        xAux = Math.round((180 - (150*auxRatio))/2)+15;
        ins.addImage(imgStage, 'PNG', xAux, yy, Math.round(150*auxRatio), 150);
        yy+=150;
    }
    yy+=5;


    //COMPONENTS
    ins.setFontSize(12);
    ins.setFontStyle('bold');
    ins.text(17,yy,strings.components);
    yy+=8;
    //segments table
    if(hasUplight()){
        var ch = 20, len=40, clr=80, dwn = 100, up=130, oc = 155;
        
        //header
        yy = addSegTableHeaderPDF(ins,yy,true);
        //elements
        for(var i=0; i<configSegs.length; i++){
            if (yy > 269) {
                //new page //new page
                ins.addPage();
                footer(ins, 'p');
                yy = 15;
                yy = addSegTableHeaderPDF(ins,yy,true);
            }
            var subAux = configSegs[i].subSegments;
            if(subAux.length > 1){
                yy+=5;
                //father
                ins.text((ch+2),yy,subAux[0].disp.split('.')[0]);
                ins.text(len,yy,getCompositionString(configSegs[i].composition));                
                //children
                subAux.forEach(function(e){
                    if (yy > 269) {
                        //new page //new page
                        ins.addPage();
                        footer(ins, 'p');
                        yy = 15;
                        yy = addSegTableHeaderPDF(ins,yy,true);
                    }
                    var colorType = [];
                    auxColor = getPieceBySegId(e.id, modules).path_type;
                    if(auxColor == "M")
                    {
                        auxColor = "Magenta";
                        colorType[0] = 255;
                        colorType[1] = 0;
                        colorType[2] = 191;


                    }
                    else if(auxColor == "C")
                    {
                        auxColor = "Cyan";
                        colorType[0] = 0;
                        colorType[1] = 191;
                        colorType[2] = 255;

                    }
                    else
                    {
                        auxColor = "Yellow";
                        colorType[0] = 255;
                        colorType[1] = 191;
                        colorType[2] = 0;
                    }


                    yy+=5;
                    ins.text((ch+6),yy,e.disp);
                    ins.text(len,yy,getSegLength(e).toString());
                    //place of the color type (M, C, Y)
                    ins.setTextColor(colorType[0], colorType[1], colorType[2]);
                    ins.text(clr, yy,auxColor);
                    ins.setTextColor(0,0,0);
                    if(e.dir) ins.text((dwn+7),yy,'x');
                    if(e.ind) ins.text((up+5),yy,'x');
                    ins.text(oc,yy,getPieceCodeForCustomColor(getPieceBySegId(e.id,modules)));
                });
            }
            else{
                //only father
                if (yy > 269) {
                    //new page //new page
                    ins.addPage();
                    footer(ins, 'p');
                    yy = 15;
                    yy = addSegTableHeaderPDF(ins,yy,true);
                }
                var colorType = [];

                var auxColour = getPieceBySegId(subAux[0].id,modules).path_type;

                if(auxColour == "M")
                    {
                        auxColour = "Magenta";
                        colorType[0] = 255;
                        colorType[1] = 0;
                        colorType[2] = 191;
                    }
                    else if(auxColour == "C")
                    {
                        auxColour = "Cyan";
                        colorType[0] = 0;
                        colorType[1] = 191;
                        colorType[2] = 255;
                    }
                    else
                    {
                        auxColour = "Yellow";
                        colorType[0] = 255;
                        colorType[1] = 191;
                        colorType[2] = 0;
                    }


                yy+=5;
                ins.text((ch+2),yy,subAux[0].disp);
                ins.text(len,yy,getSegLength(subAux[0]).toString());
                ins.setTextColor(colorType[0], colorType[1], colorType[2]);

                ins.text(clr, yy, auxColour)
                ins.setTextColor(0,0,0);

                if(subAux[0].dir) ins.text((dwn+7),yy,'x');
                if(subAux[0].ind) ins.text((up+5),yy,'x');
                ins.text(oc,yy,getPieceCodeForCustomColor(getPieceBySegId(subAux[0].id,modules)));
            }
        }
    }
    else{
        var ch = 20, len=40, clr=80, dwn = 130, oc = 155;
        //header
        yy = addSegTableHeaderPDF(ins,yy,false);
        //elements
        for(var i=0; i<configSegs.length; i++){
            if (yy > 269) {
                //new page //new page
                ins.addPage();
                footer(ins, 'p');
                yy = 15;
                yy = addSegTableHeaderPDF(ins,yy,false);
            }
            var subAux = configSegs[i].subSegments;
            if(subAux.length > 1){
                yy+=5;
                //father
                ins.text((ch+2),yy,subAux[0].disp.split('.')[0]);
                ins.text(len,yy,getCompositionString(configSegs[i].composition));                
                //children
                subAux.forEach(function(e){
                    if (yy > 269) {
                        //new page //new page
                        ins.addPage();
                        footer(ins, 'p');
                        yy = 15;
                        yy = addSegTableHeaderPDF(ins,yy,false);
                    }
                    var colorType = [];

                    var auxColor = getPieceBySegId(e.id, modules).path_type;
                    if(auxColor == "M")
                    {
                        auxColor = "Magenta";
                        colorType[0] = 255;
                        colorType[1] = 0;
                        colorType[2] = 191;
                    }
                    else if(auxColor == "C")
                    {
                        auxColor = "Cyan";
                        colorType[0] = 0;
                        colorType[1] = 191;
                        colorType[2] = 255;
                    }
                    else
                    {
                        auxColor = "Yellow";
                        colorType[0] = 255;
                        colorType[1] = 191;
                        colorType[2] = 0;
                    }
                    yy+=5;
                    ins.text((ch+6),yy,e.disp);
                    ins.text(len,yy,getSegLength(e).toString());
                    ins.setTextColor(colorType[0], colorType[1], colorType[2]);
                    ins.text(clr, yy, auxColor);
                    ins.setTextColor(0,0,0);
                    if(e.dir) ins.text((dwn+7),yy,'x');
                    ins.text(oc,yy,getPieceCodeForCustomColor(getPieceBySegId(e.id,modules)));
                });
            }
            else{
                //only father
                if (yy > 269) {
                    //new page //new page
                    ins.addPage();
                    footer(ins, 'p');
                    yy = 15;
                    yy = addSegTableHeaderPDF(ins,yy,false);
                }
                var colorType = [];

                var auxColour = modules[i].path_type;;
                if(auxColour == "M")
                {
                    auxColour = "Magenta";
                    colorType[0] = 255;
                    colorType[1] = 0;
                    colorType[2] = 191;
                }
                else if(auxColour == "C")
                {
                    auxColour = "Cyan";
                    colorType[0] = 0;
                    colorType[1] = 191;
                    colorType[2] = 255;
                }
                else
                {
                    auxColour = "Yellow";
                    colorType[0] = 255;
                    colorType[1] = 191;
                    colorType[2] = 0;
                }
                yy+=5;
                ins.text((ch+2),yy,subAux[0].disp);
                ins.setTextColor(colorType[0], colorType[1], colorType[2]);
                ins.text(clr, yy, auxColour);
                ins.setTextColor(0,0,0);
                ins.text(len,yy,getSegLength(subAux[0]).toString());
                if(subAux[0].dir) ins.text((dwn+7),yy,'x');
                ins.text(oc,yy,getPieceCodeForCustomColor(getPieceBySegId(subAux[0].id,modules)));
            }
        }
    }
    //corners table       
    if(configCorners.length > 0){
        yy+=10;
        var ch = 20,  dwn = 100,  oc = 155;
        if (yy > 259) {
            //new page //new page
            ins.addPage();
            footer(ins, 'p');
            yy = 15;
        }        
        //header
        ins.setFontSize(10);
        ins.setFontStyle('bold');
        ins.text(ch,yy,strings.corners);
        ins.text(clr,yy,strings.color);
        ins.text(dwn,yy,strings.downlight);
        ins.text(oc,yy,strings.orderCode);
        yy+=1;
        ins.setLineWidth(0.4);
        ins.setDrawColor(0,0,0);
        ins.line(17, yy, 193, yy);
        ins.setFontStyle('normal');

        modules.forEach(function(e,i){
            if(e.type == 1){
                if (yy > 269) {
                    //new page //new page
                    ins.addPage();
                    footer(ins, 'p');
                    yy = 15;
                    //header
                    ins.setFontSize(10);
                    ins.setFontStyle('bold');
                    ins.text(ch,yy,strings.corners);
                    ins.text(clr,yy,strings.color);
                    ins.text(dwn,yy,strings.downlight);
                    ins.text(oc,yy,strings.orderCode);
                    yy+=1;
                    ins.setLineWidth(0.4);
                    ins.setDrawColor(0,0,0);
                    ins.line(17, yy, 193, yy);
                    ins.setFontStyle('normal');
                }
                var colorType = [];

                auxCornes = modules[e.id].path_type;
                if(auxCornes == "M")
                {
                    auxCornes = "Magenta";
                    colorType[0] = 255;
                    colorType[1] = 0;
                    colorType[2] = 191;
                }
                else if(auxCornes == "C")
                {
                    auxCornes = "Cyan";
                    colorType[0] = 0;
                    colorType[1] = 191;
                    colorType[2] = 255;
                }
                else
                {
                    auxCornes = "Yellow";
                    colorType[0] = 255;
                    colorType[1] = 191;
                    colorType[2] = 0;
                }

                yy+=5;
                ins.text((ch+2),yy,e.data.disp);
                ins.setTextColor(colorType[0], colorType[1], colorType[2]);
                ins.text(clr,yy, auxCornes);
                ins.setTextColor(0,0,0);
                if(e.data.dir) ins.text((dwn+7),yy,'x');
                ins.text(oc,yy,getPieceCodeForCustomColor(e));
            }
        });
    }
    //T-connections table       
    if(configTs.length > 0){
        yy+=10; 
        var ch = 20,  dwn = 100,  oc = 155;
        if (yy > 259) {
            //new page //new page
            ins.addPage();
            footer(ins, 'p');
            yy = 15;
        }        
        //header
        ins.setFontSize(10);
        ins.setFontStyle('bold');
        ins.text(ch,yy,strings.tConns);
        ins.text(dwn,yy,strings.downlight);
        ins.text(oc,yy,strings.orderCode);
        yy+=1;
        ins.setLineWidth(0.4);
        ins.setDrawColor(0,0,0);
        ins.line(17, yy, 193, yy);
        ins.setFontStyle('normal');

        modules.forEach(function(e,i){
            if(e.type == 2){
                if (yy > 269) {
                    //new page //new page
                    ins.addPage();
                    footer(ins, 'p');
                    yy = 15;
                    //header
                    ins.setFontSize(10);
                    ins.setFontStyle('bold');
                    ins.text(ch,yy,strings.tConns);
                    ins.text(clr,yy,strings.color);
                    ins.text(dwn,yy,strings.downlight);
                    ins.text(oc,yy,strings.orderCode);
                    yy+=1;
                    ins.setLineWidth(0.4);
                    ins.setDrawColor(0,0,0);
                    ins.line(17, yy, 193, yy);
                    ins.setFontStyle('normal');
                }
                var colorType = [];

                auxTcorners = modules[e.id].path_type;
                if(auxTcorners == "M")
                {
                    auxTcorners = "Magenta";
                    colorType[0] = 255;
                    colorType[1] = 0;
                    colorType[2] = 191;
                }
                else if(auxTcorners == "C")
                {
                    auxTcorners = "Cyan";
                    colorType[0] = 0;
                    colorType[1] = 191;
                    colorType[2] = 255;
                }
                else
                {
                    auxTcorners = "Yellow";
                    colorType[0] = 255;
                    colorType[1] = 191;
                    colorType[2] = 0;
                }
                yy+=5;
                ins.text((ch+2),yy,e.data.disp);
                ins.setTextColor(colorType[0], colorType[1], colorType[2]);

                ins.text(clr,yy,auxTcorners);
                ins.setTextColor(0,0,0);

                if(e.data.dir) ins.text((dwn+7),yy,'x');
                ins.text(oc,yy,getPieceCodeForCustomColor(e));
            }
        });
    }      
    //Diffusor profiles     
    if(opticsMode == 1 && modules.length > 1){
        yy+=10; 
        var ch = 20,  len = 100,  oc = 155;
        if (yy > 259) {
            //new page //new page
            ins.addPage();
            footer(ins, 'p');
            yy = 15;
        }
        //header
        ins.setFontSize(10);
        ins.setFontStyle('bold');
        ins.text(ch,yy,strings.diffProfile);
        ins.text(len,yy,strings.tblHead_len);
        ins.text(oc,yy,strings.orderCode);
        yy+=1;
        ins.setLineWidth(0.4);
        ins.setDrawColor(0,0,0);
        ins.line(17, yy, 193, yy);
        ins.setFontStyle('normal');
        var diffProfs = [];
        var totLen = getTotalDownlightLen(modules);
        
        if(totLen <= 49000){
            diffProfs.push(totLen);
            yy+=5;
            ins.text((ch+2),yy,strings.diffProfile);
            ins.text(len,yy,totLen.toString());
            ins.text(oc,yy,getDiffuserProfileCode(totLen));
        }
        else{
            while(totLen > 49000){
                if (yy > 255) {
                    //new page //new page
                    ins.addPage();
                    footer(ins, 'p');
                    yy = 15;                
                    //header
                    ins.setFontSize(10);
                    ins.setFontStyle('bold');
                    ins.text(ch,yy,strings.diffProfile);
                    ins.text(len,yy,strings.tblHead_len);
                    ins.text(oc,yy,strings.orderCode);
                }
                diffProfs.push(totLen);
                yy+=5;
                code =  getDiffuserProfileCode(totLen);
                ins.text((ch+2),yy,strings.diffProfile);
                ins.text(len,yy,'49000'.toString());
                ins.text(oc,yy,getDiffuserProfileCode(totLen));
                totLen = totLen-49000;
            }
            //remainder
            diffProfs.push(totLen);
            yy+=5;
            ins.text((ch+2),yy,strings.diffProfile);
            ins.text(len,yy,(totLen).toString());
            ins.text(oc,yy,getDiffuserProfileCode(totLen));
        }
    }
    //Mounting accessories
    yy+=10;
    var ch = 20,  len = 100,  oc = 155;
    if (yy > 249) {
        //new page //new page
        ins.addPage();
        footer(ins, 'p');
        yy = 15;
    }
    //header
    ins.setFontSize(10);
    ins.setFontStyle('bold');
    ins.text(ch,yy,strings.mountAccess);
    ins.text(len,yy,strings.quantity);
    ins.text(oc,yy,strings.orderCode);
    yy+=1;
    ins.setLineWidth(0.4);
    ins.setDrawColor(0,0,0);
    ins.line(17, yy, 193, yy);
    ins.setFontStyle('normal');
    yy+=5;
    //Dossier
    ins.text((ch+2),yy,strings.dossier);
    ins.text(len,yy,'1');
    ins.text(oc,yy,'V3H9900');
    yy+=5;
    switch(getInstalation().sel){
        case '0': //ceiling
            var qnt = (modules.length+1); //total plus 1
            // qnt+=configCorners.length; //one more for each corner
            qnt+=configTs.length; //one more for each T
            ins.text((ch+2),yy,strings.ceilingMount);
            ins.text(len,yy,qnt.toString());
            ins.text(oc,yy,'V3H2500');
            break;
        case '1': //wall
            var qnt = (modules.length+1); //total plus 1
            // qnt+=configCorners.length; //one more for each corner
            // qnt+=configTs.length; //one more for each T
            ins.text((ch+2),yy,strings.wallMount);
            ins.text(len,yy,qnt.toString());
            ins.text(oc,yy,'V3H2700');
            break;
        case '2': //suspended
            var susType = getSuspensionType().type;
            var susLen = getSuspensionType().len;
            var code = '', desc = '';
            if(modules.length>1){
                //magenta source
                if(susType == 0){ //power box
                    code = 'V3H2610/'+parseInt((susLen/10))+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2611/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;                    
                }                
                ins.text((ch+2),yy, desc);
                ins.text(len,yy,'1');
                ins.text(oc,yy,code);
                yy+=5;
                //additional suspension points
                code = 'V3H2620/'+parseInt((susLen/10));
                var qnt = modules.length + configTs.length; //total + t-conns
                // var qnt = modules.length + configCorners.length + configTs.length; //total + corners + t-conns                
                ins.text((ch+2),yy,strings.sus_additional);
                ins.text(len,yy,qnt.toString());
                ins.text(oc,yy,code);
            }
            else{
                //individual luminaire
                if(susType == 0){ //power box
                    code = 'V3H2600/'+parseInt((susLen/10))+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2601/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;    
                }
                // html+='<tr><td>Suspension kit for individual luminaire</td><td>1</td><td>'+code+'</td></tr>';
                ins.text((ch+2),yy,desc);
                ins.text(len,yy,'1');
                ins.text(oc,yy,code);
            }
            break;
    }
    //diffusor cover plates
    if(opticsMode == 1 && modules.length > 1){
        //diffuser cover plates
        diffProfs.forEach(function(e){
            yy+=5;
            if(e<=5000){
                //do nothing
            }
            else if(e<=12000){
                ins.text((ch+2),yy,strings.diffCoverPlate);
                ins.text(len,yy,'2');
                ins.text(oc,yy,'V3H1208/1-'+getColor().cod);
            }
            else if(e<=25000){
                ins.text((ch+2),yy,strings.diffCoverPlate);
                ins.text(len,yy,'2');
                ins.text(oc,yy,'V3H1208/2-'+getColor().cod);
            }
            else{
                ins.text((ch+2),yy,strings.diffCoverPlate);
                ins.text(len,yy,'2');
                ins.text(oc,yy,'V3H1208/4-'+getColor().cod);
            }
        });
    }


    //-------------------------------------------- Installation Manuals
    ins.addPage();
    footer(ins, 'p');
    var yy = 15;

    ins.setLineWidth(0.6);
    ins.setDrawColor(255,192,0);
    ins.line(15, 15, 195, 15);
    ins.setFontSize(18);

    yy+=8;
    ins.text(17,yy,strings.installTitle);
    yy+=8
    ins.setFontSize(16);
    ins.text(17,yy,strings.installation_manuals);
    yy+=15
    ins.setFontSize(10);
    ins.setFontStyle('normal');
    if(checkInLine() == true)
    {
        ins.text(17, yy, strings.installation_manual_in_line);
        yy+=5
        ins.setTextColor(0,0,255);
        ins.text(30, yy, "https://www.etaplighting.com/sites/default/files/uploads/Manuals/V3E9980.pdf");
        ins.setTextColor(0,0,0);
        yy+=5


    }
    else if(modules.length == 1)
    {
        ins.text(17, yy, strings.installation_manual_individual);
        yy+=5
        ins.setTextColor(0,0,255);
        ins.text(30, yy, "https://www.etaplighting.com/sites/default/files/uploads/Manuals/V3E9990.pdf");
        ins.setTextColor(0,0,0);
        yy+=5

    }
    
    if(checkCorners() == true) 
    {
        ins.text(17, yy, strings.installation_manual_corner);
        yy+=5
        ins.setTextColor(0,0,255);
        ins.text(30, yy, "https://www.etaplighting.com/sites/default/files/uploads/Manuals/V3E9940.pdf");
        ins.setTextColor(0,0,0);
        yy+=5
    }
    if(checkTpieces() == true)
    {
        ins.text(17, yy, strings.installation_manual_T_piece);
        yy+=5
        ins.setTextColor(0,0,255);
        ins.text(30, yy, "https://www.etaplighting.com/sites/default/files/uploads/Manuals/V3E9970.pdf");
        ins.setTextColor(0,0,0);
        yy+=5
    }
    if(hasDiffusorAndLength() == true)
    {
        ins.text(17, yy, strings.installation_manual_cover_plate);
        yy+=5
        ins.setTextColor(0,0,255);
        ins.text(30, yy, "https://www.etaplighting.com/sites/default/files/uploads/Manuals/V3E9930.pdf");
        ins.setTextColor(0,0,0);
        yy+=5
    }

    yy+=8
    ins.setFontSize(16);
    ins.text(17,yy,"Videos to install");
    yy+=15
    ins.setFontSize(10);
    ins.setFontStyle('normal');
    switch(getInstalation().sel){
        case '0': //ceiling
            if(getOptics().cod == 'D')
            {
                ins.text(17, yy, strings.installation_video_ceiling_diff);
                yy+=5
                ins.setTextColor(0,0,255);
                ins.text(30, yy, strings.installation_video_ceiling_diff_link);
                ins.setTextColor(0,0,0);
                yy+=5
                ins.text(17, yy, strings.installation_video_diffusor_optic);
                yy+=5
                ins.setTextColor(0,0,255);
                ins.text(30, yy, strings.installation_video_diffusor_optic_link);
                ins.setTextColor(0,0,0);
                yy+=5
            }
            else if(getOptics().cod == 'S' && getOptics().cod == 'B')
            {
                ins.text(17, yy, strings.installation_video_ceiling_shield);
                yy+=5
                ins.setTextColor(0,0,255);
                ins.text(30, yy, strings.installation_video_ceiling_shield_link);
                ins.setTextColor(0,0,0);
                yy+=5
            }
    break;
    case '1': //wall
            if(getOptics().cod == 'D')
            {
                ins.text(17, yy, strings.installation_video_wall_diff);
                yy+=5
                ins.setTextColor(0,0,255);
                ins.text(30, yy, strings.installation_video_wall_diff_link);
                ins.setTextColor(0,0,0);
                yy+=5
                ins.text(17, yy, strings.installation_video_diffusor_optic);
                yy+=5
                ins.setTextColor(0,0,255);
                ins.text(30, yy, strings.installation_video_diffusor_optic_link);
                ins.setTextColor(0,0,0);
                yy+=5
            }

    break;
    case '2': //suspended
        if(getOptics().cod == 'D')
        {
            ins.text(17, yy, strings.installation_video_suspended_diff);
            yy+=5
            ins.setTextColor(0,0,255);
            ins.text(30, yy, strings.installation_video_suspended_diff_link);
            ins.setTextColor(0,0,0);
            yy+=5
            ins.text(17, yy, strings.installation_video_diffusor_optic);
            yy+=5
            ins.setTextColor(0,0,255);
            ins.text(30, yy, strings.installation_video_diffusor_optic_link);
            ins.setTextColor(0,0,0);
            yy+=5
        }
        else if(getOptics().cod == 'S' && getOptics().cod == 'B')
        {
            ins.text(17, yy, strings.installation_video_suspended_shield);
            yy+=5
            ins.setTextColor(0,0,255);
            ins.text(30, yy, strings.installation_video_suspended_shield_link);
            ins.setTextColor(0,0,0);
            yy+=5
        }
    break;

    }
    if(checkCorners() == true) 
    {
        ins.text(17, yy, strings.installation_video_corner);
        yy+=5
        ins.setTextColor(0,0,255);
        ins.text(30, yy, strings.installation_video_corner_link);
        ins.setTextColor(0,0,0);
        yy+=5
    }
    if(checkTpieces() == true)
    {
        ins.text(17, yy, strings.installation_video_t_piece);
        yy+=5
        ins.setTextColor(0,0,255);
        ins.text(30, yy, strings.installation_video_t_piece_link);
        ins.setTextColor(0,0,0);
        yy+=5
    }
    return ins;
}

//Check for corners in the line(all draw)s
function checkCorners()
{
    for(var  i = 0; i < modules.length; i++)
    {
        if(modules[i].type == 1)
        {
            return true;
            
        }
    }
}
//Check for Tpieces in the line(all draw)
function checkTpieces()
{
    for(var i = 0;i < modules.length; i++)
    {
        if(modules[i].type == 2)
        {
            return true;
        }
    }
}

//check if line has diffusor and more than 5 meters length
function hasDiffusorAndLength()
{
    var aux  =  getTotalLen(modules);

            if( aux > 5000)
            {
                return true;
            }
}



function addSegTableHeaderPDF(ins,yy,up){
    if(up){ //has uplight
        var ch = 20, len=40, clr=80, dwn = 100, up=130, oc = 155;
        //header
        ins.setFontSize(10);
        ins.setFontStyle('bold');
        ins.text(ch,yy,strings.tblHead_ch);
        ins.text(len,yy,strings.tblHead_len);
        ins.text(clr,yy,strings.color);
        ins.text(dwn,yy,strings.downlight);
        ins.text(up,yy,strings.uplight);
        ins.text(oc,yy,strings.orderCode);
        yy+=1;
        ins.setLineWidth(0.4);
        ins.setDrawColor(0,0,0);
        ins.line(17, yy, 193, yy);
        ins.setFontStyle('normal');
    }
    else{
        var ch = 20, len=40, clr=80, dwn = 130, oc = 155;
        //header
        ins.setFontSize(10);
        ins.setFontStyle('bold');
        ins.text(ch,yy,strings.tblHead_ch);
        ins.text(len,yy,strings.tblHead_len);
        ins.text(clr,yy,strings.color);
        ins.text(dwn,yy,strings.downlight);
        ins.text(oc,yy,strings.orderCode);
        yy+=1;
        ins.setLineWidth(0.4);
        ins.setDrawColor(0,0,0);
        ins.line(17, yy, 193, yy);
        ins.setFontStyle('normal');
    }
    return yy;
}



function footer(d, o) {
    //disclaimer text
    var d1 = 'This document has been compiled by ETAP with the greatest possible care.',
        d2 = 'However, the information contained in this publication is not binding and may change due to technical development.',
        d3 = 'ETAP is not liable for any damage whatsoever resulting from the use of this document.',
        d4 = 'www.etaplighting.com // Made in Belgium';

    d.setLineWidth(0.6);
    d.setDrawColor(255,192,0);
    d.setFontSize(6);
    if (o == 'p') { //portrait
        d.line(15, 275, 195, 275);
        d.text(193, 280, d1, {align: 'right'});
        d.text(193, 283, d2, {align: 'right'});
        d.text(193, 286, d3, {align: 'right'});
        d.text(193, 289, d4, {align: 'right'});
        d.addImage(etplg, 'JPEG', 17, 277, 35, 12);
    } else if (o == 'l') { //landscape
        //not used, for now
        // d.line(15, 195, 282, 195);
        // d.writeText(-15, 200, d1, {align: 'right'});
        // d.writeText(-15, 203, d2, {align: 'right'});
        // d.writeText(-15, 206, d3, {align: 'right'});
        // d.writeText(-15, 209, d4, {align: 'right'});
        // d.addImage(etplg, 'JPEG', 17, 277, 35, 12);
    }
    d.setFontSize(10);
    d.page++;
}

//function to check if the email has fundamental char i.e. -> (@ and .)
function checkEmail(str)
{
    var title = "Email"; //need to add translation string from json files; same in msg variable

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(str))
    var $content =  "<div class='dialog-ovelay'>" +
                    "<div class='dialog'><header>" +
                        " <h3> " + title + " </h3> "+
                    "</header>" +
                    "<div class='dialog-msg'>" +
                        " <p> " + strings.wrongEmail + " </p> " +
                    "</div>" +
                    "<footer>" +
                        "<div class='controls'>" +
                            " <button class='button button-clear doAction'>" + "OK" + "</button> " +							
                        "</div>" +
                    "</footer>" +
                "</div>" +
            "</div>";
    $('body').prepend($content);
    $('.doAction').click(function () {
        $(this).parents('.dialog-ovelay').fadeOut(500, function () {
            $(this).remove();
        });
    });	
    
}

  function warningMsg(title, msg) { /*change*/
    var $content =  "<div class='dialog-ovelay'>" +
                    "<div class='dialog'><header>" +
                        " <h3> " + title + " </h3> "+
                    "</header>" +
                    "<div class='dialog-msg'>" +
                        " <p> " + msg + " </p> " +
                    "</div>" +
                    "<footer>" +
                        "<div class='controls'>" +
                            " <button class='button button-clear doAction'>" + "OK" + "</button> " +							
                        "</div>" +
                    "</footer>" +
                "</div>" +
            "</div>";
    $('body').prepend($content);
    $('.doAction').click(function () {
        $(this).parents('.dialog-ovelay').fadeOut(500, function () {
            $(this).remove();
        });
    });	
}

function confirmDel(title, msg, $true, $false) { /*change*/
    var $content =  "<div class='dialog-ovelay'>" +
                    "<div class='dialog'><header>" +
                        " <h3> " + title + " </h3> "+
                    "</header>" +
                    "<div class='dialog-msg'>" +
                        " <p> " + msg + " </p> " +
                    "</div>" +
                    "<footer>" +
                        "<div class='controls'>" +
                            " <button class='button button-default cancelAction'>" + $false + "</button> " +
                            " <button class='button button-danger doAction'>" + $true + "</button> " +							
                        "</div>" +
                    "</footer>" +
                "</div>" +
            "</div>";
    $('body').prepend($content);
    $('.doAction').click(function () {
        cleanDesign();
        reCalculateDesign();
        $(this).parents('.dialog-ovelay').fadeOut(500, function () {
            $(this).remove();
        });
    });
    $('.cancelAction').click(function () {
        $(this).parents('.dialog-ovelay').fadeOut(500, function () {
            $(this).remove();
        });
    });	
}


//function to verify if there is a draw in the line design, when changing the type of installation
function hasDrawing()
{
    if(segsArray.length === null || segsArray.length === 0)
    {

        return false;
    }
    else
    {
        return true;
    }
}



//function to convert the modules to csv

function CSV()
{
    var count = 0;
    var array = modules;


    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);
    var csvArr = [[strings.orderCode, strings.quantity, strings.description, strings.room]];

    // Build header
    var result = '';
    var dupCheck = [];
    // Add the rows


    //LUMINAIRES
    //check duplicated codes on luminaires
    array.forEach(function(obj){        
        dupCheck.push(obj.code);
    });
    // Unique array without duplicates ['a', 'b', ... , 'h']
    let unique = [...new Set(dupCheck)];
    // This array counts duplicates [['a', 3], ['b', 2], ... , ['h', 3]] 
    let dups = unique.map(value => [value, dupCheck.filter(str => str === value).length]);
    dups.forEach(function(obj){
        csvArr.push([obj[0],obj[1],"Luminaire",projectDef.project.room]);
    });

    //DIFFUSOR PROFILE
    // var diffProfs = [];
    // if(opticsMode == 1 && modules.length > 1){
    //     var diffCode;
    //     var totLen = getTotalDownlightLen(modules);

    //     if(totLen > 49000){ 
    //         while(totLen > 49000){
    //             var count;
    //             diffCode = getDiffuserProfileCode(totLen);
    //             totLen = totLen - 49000;
    //             count++;
    //         }
    //         csvArr.push([diffCode,count,"Diffusor Profile",projectDef.project.room]);
    //         var remainCode = getDiffuserProfileCode(totLen);
    //         csvArr.push([remainCode,"1", "Diffusor Profile", projectDef.project.room]);
    //     }
    //     //case only one diffusor profile
    //     else 
    //     {
    //         diffCode = getDiffuserProfileCode(totLen);
    //         csvArr.push([diffCode,"1","Diffusor Profile",projectDef.project.room]);      
    //     }
    // }



    var diffProfs = [];
    if(opticsMode == 1 && modules.length > 1){
        diffLength = getTotalDownlightLen(modules); //total length in diffusor       
        if(diffLength <= 49000){
            code =  getDiffuserProfileCode(diffLength);
            diffProfs.push(diffLength);
            // html+='<tr><td>'+strings.diffProfile+'</td><td>'+diffLength+'</td><td>'+code+'</td></tr>';
            csvArr.push([code,"1",strings.diffProfile,projectDef.project.room]);   
        }
        else{
            while(diffLength > 49000){
                code =  getDiffuserProfileCode(diffLength);
                diffProfs.push(diffLength);
                diffLength = diffLength-49000;
                // html+='<tr><td>'+strings.diffProfile+'</td><td>49000</td><td>'+code+'</td></tr>';
                csvArr.push([code,"1",strings.diffProfile,projectDef.project.room]);   
            }
            //remainder
            code =  getDiffuserProfileCode(diffLength);
            diffProfs.push(diffLength);
            // html+='<tr><td>'+strings.diffProfile+'</td><td>'+diffLength+'</td><td>'+code+'</td></tr>';
            csvArr.push([code,"1",strings.diffProfile,projectDef.project.room]);   
        }
    }



    //MOUNTING ACESSORIES
    ////Dossier
    csvArr.push(["V3H9900","1",strings.dossier,projectDef.project.room]);
    ////Suspension kit

    ////Cover plate


    switch(getInstalation().sel){
        case '0': //ceiling
            var qnt = (modules.length+1); //total plus 1
            qnt+=configTs.length; //one more for each T
            csvArr.push(["V3H2500",qnt,strings.ceilingMount,projectDef.project.room]);
            break;
        case '1': //wall
            var qnt = (modules.length+1); //total plus 1
            csvArr.push(["V3H2700",qnt,strings.wallMount,projectDef.project.room]);
            break;
        case '2': //suspended
            var susType = getSuspensionType().type;
            var susLen = getSuspensionType().len;
            var code = '', desc = '';
            if(modules.length>1){
                //magenta source
                if(susType == 0){ //power box
                    code = 'V3H2610/'+(susLen/10).toString().pad(3)+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2611/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;
                }
                csvArr.push([code,1,desc,projectDef.project.room]);
                //additional suspension points
                code = 'V3H2620/'+(susLen/10).toString().pad(3);
                var qnt = modules.length + configTs.length; //total + t-conns
                csvArr.push([code,qnt,strings.sus_additional,projectDef.project.room]);
            }
            else{
                //individual luminaire
                if(susType == 0){ //power box
                    code = 'V3H2600/'+parseInt((susLen/10))+'-5'+getColor().cod;
                    desc = strings.sus_box;
                }else{ //minimalistic
                    code = 'V3H2601/'+parseInt((susLen/10))+'-5';
                    desc = strings.sus_minimal;
                }
                csvArr.push([code,1,desc,projectDef.project.room]);
            }
            break;
    }
    if(opticsMode == 1 && modules.length > 1){
        var code;
        //diffuser cover plates
        diffProfs.forEach(function(e){
            if(e<=5000){
                //do nothing
            }
            else if(e<=12000){
                code = 'V3H1208/1-'+getColor().cod;
                // html+='<tr><td>'+strings.diffCoverPlate+'</td><td>2</td><td></td></tr>';
                csvArr.push([code,2,strings.diffCoverPlate,projectDef.project.room]);
            }
            else if(e<=25000){
                code = 'V3H1208/2-'+getColor().cod;
                // html+='<tr><td>'+strings.diffCoverPlate+'</td><td>2</td><td>V3H1208/2-'+getColor().cod+'</td></tr>';
                csvArr.push([code,2,strings.diffCoverPlate,projectDef.project.room]);
            }
            else{
                code = 'V3H1208/4-'+getColor().cod;
                // html+='<tr><td>'+strings.diffCoverPlate+'</td><td>2</td><td>V3H1208/4-'+getColor().cod+'</td></tr>';
                csvArr.push([code,2,strings.diffCoverPlate,projectDef.project.room]);
            }
        });
    }    

    csvArr.forEach(function(obj){
        result += obj.join(';');
        result += '\n';
    });

    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(universalBOM + result));
    link.setAttribute('download', 'Ley-'+projectDef.project.name+'-'+projectDef.project.room+'-orderlist.csv');
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()
    link.parentNode.removeChild(link);
}



//generate the code for the pick of the image
function getPieceCodeForImages()
{
    //RANGE
    out='V3';
    //TYPE
    out+=getInstalation().cod;
    //OPTICS
    out+=getOptics().cod;

    //FIXED DIGITS
    out+='0';
    out+='M';
    //LIGHT OUTPUT DIRECT  --- Need to see in the line configuration if it is direct or not
    if(modules[0].data.ind == true){
        out+= 'M';
    }
    else{
        out+= '0';
    }

    //PROFILE COLOR
    if(getColor().sel == '3')
    {
        out+= "X1";
    }
    else
    {
        out+=getColor().cod;
    }    
    return out;
}

//Get the sum of the composition on the father segment
function fatherSumCompositon(father){
var sum = 0;
var holyFather = father.split("+");
    for(var i = 0; i <holyFather.length;i++){
        sum += parseInt(holyFather[i]);

    }
return sum;
}

//autocad functions

function getDirectionAutoCad(seg){
    if(seg.data.start.x == seg.data.end.x)
    //0 angle degree
        return 'v';
    else
    //90 angle degree
        return 'h';
}

//global variables, regarding the first segment
//start point of the attribute
function StartPoint()
{


    var initialPointX0 = (modules[0].data.start.x - modules[0].data.end.x)/2;
    var initialPointY0 = (modules[0].data.start.y - modules[0].data.end.y)/2;

    var initialX0 = (modules[0].data.end.x - initialPointX0)/gridSize*gridSizeInMM;
    var initialY0 = (modules[0].data.end.y - initialPointY0)/gridSize*gridSizeInMM;
    var length = getSegLength(modules[0].data);
    var aux ='';
    if(getDirectionAutoCad(modules[0]) == 'h')
    //90 angle degree
    {
        aux = initialX0+ ",";
        aux += -initialY0 + 50;
        return aux;
    }
    else
    //0 angle degree
    {
        aux = (initialX0 - 50) + ",";
        aux += -initialY0;
        return aux;
    }

}

//last point of the attribute
function LastPoint()
{

    var initialPointX0 = (modules[0].data.start.x - modules[0].data.end.x)/2;
    var initialPointY0 = (modules[0].data.start.y - modules[0].data.end.y)/2;

    var initialX0 = (modules[0].data.end.x - initialPointX0)/gridSize*gridSizeInMM;
    var initialY0 = (modules[0].data.end.y - initialPointY0)/gridSize*gridSizeInMM;

    var length = getSegLength(modules[0].data);
    var aux = '';
    if(getDirectionAutoCad(modules[0]) == 'h')
    //90 angle degree
    {
        aux = initialX0 + ",";
        aux += -initialY0 - 230;
        return aux;
    }
    else
    //0 angle degree
    {
        aux = initialX0 + 230 + ",";
        aux += -initialY0;
        return aux;
    }
}

//angle of the first segment
function RotationAngleFirstSegment(segment)
{
    if(getDirectionAutoCad(segment) == 'h')
    {
        return 0;
    }
    else
        return 90;
}


//angle of every segment
function RotationAngleEverySegment(segment)
{
    if(getDirectionAutoCad(segment) == 'h')
    {
        if(segment.data.start.x > segment.data.end.x)
        {
           return -270;
        }
        else
        {
            return -90;
        }
    }
    else
        if(segment.data.start.y > segment.data.end.y)
        {
            return -180;
        }
        else
        {
            return 0;
        }
}


//function to print in the autocad file, segments, corners and T-pieces
function EveryAutoCadSegment()
{        
    var result = '';
    for(var i = 0; i < modules.length;i++){

        //segments
        if(modules[i].type == 0)
        {
            result += "-COLOR " + colorNumber(modules[i]);
            result += "\r\n";
            result += "RECTANGLE";
            result += "\r\n";
            result += StartPointEverySegment(modules[i]);
            result += "\r\n";
            result += LastPointEverySegment(modules[i]);
            result += "\r\n";
            result += "ROTATE LAST SINGLE";
            result += "\r\n";
            result += MiddlePointsEverySegment(modules[i]);
            result += "\r\n";
            result += RotationAngleEverySegment(modules[i]);
            result += "\r\n";
        }
        //corners
        else if(modules[i].type == 1)
        {
            result += "-COLOR " + colorNumber(modules[i]);
            result += "\r\n";
            result += "PLINE";
            result += "\r\n";
            result += EveryPointOnCorner(modules[i]);
            result += "CLOSE";
            result += "\r\n";
            result += "ROTATE LAST SINGLE";
            result += "\r\n";
            result += centerPointsCorners(modules[i]);
            result += "\r\n";
            result += cornerRotation(modules[i]);
            result += "\r\n";
        }
        //t-piece
        else
        {
            result += "-COLOR " + colorNumber(modules[i]);
            result += "\r\n";
            result += "PLINE";
            result += "\r\n";
            result += EveryPointOnTPiece(modules[i]);
            result += "CLOSE";
            result += "\r\n";
            result += "ROTATE LAST SINGLE";
            result += "\r\n";
            result += centerPointsTPiece(modules[i]);
            result += "\r\n";
            result += TPieceRotation(modules[i]);
            result += "\r\n";
        }
    }
    return result;
}


//Auto-Cad Segments
function MiddlePointsEverySegment(segment)
{


    var initialPointX0 = (segment.data.end.x - segment.data.start.x)/2;
    var initialPointY0 = (segment.data.end.y - segment.data.start.y)/2;


    var middlePointY0 = (segment.data.end.y - initialPointY0)/gridSize*gridSizeInMM;
    var middlePointX0 = (segment.data.end.x - initialPointX0)/gridSize*gridSizeInMM;

    var aux ='';
    aux += middlePointX0 + ",";
    aux += -middlePointY0;
    
    return aux;


}
//Auto-Cad Segments X1Y1

function StartPointEverySegment(segment)
{
    var initialPointX0 = (segment.data.end.x - segment.data.start.x)/2;
    var initialPointY0 = (segment.data.end.y - segment.data.start.y)/2;

    var middlePointY0 = (segment.data.end.y - initialPointY0)/gridSize*gridSizeInMM;
    var middlePointX0 = (segment.data.end.x - initialPointX0)/gridSize*gridSizeInMM;

    var length = getSegLength(segment.data);
    var aux = '';

        aux += (middlePointX0 - 30) + ",";
        aux += -(middlePointY0 + (length/2));
        return aux;
}

//Auto-Cad Segments X2Y2

function LastPointEverySegment(segment)
{

    //distance to middle point
    var initialPointX0 = (segment.data.end.x - segment.data.start.x)/2;
    var initialPointY0 = (segment.data.end.y - segment.data.start.y)/2;

    var middlePointY0 = (segment.data.end.y - initialPointY0)/gridSize*gridSizeInMM;
    var middlePointX0 = (segment.data.end.x - initialPointX0)/gridSize*gridSizeInMM;

    var length = getSegLength(segment.data);
    var aux = '';


    aux += (middlePointX0 +30) + ",";
    aux += -(middlePointY0 - (length/2));
    return aux;

}
//T-Piece Draw
function EveryPointOnTPiece(segment)
{
    var out = '';
    var centerPointX0 = segment.data.point.x/gridSize*gridSizeInMM;
    var centerPointY0 = -(segment.data.point.y/gridSize*gridSizeInMM);
    //point 1
    out += (centerPointX0 - 280) + ",";
    out += (centerPointY0 - 30);
    out += "\r\n";
   
    //point 2
    out += (centerPointX0 - 280) + ",";
    out += (centerPointY0 + 30);
    out += "\r\n";

    //point 3
    out += (centerPointX0 + 280) + ",";
    out += (centerPointY0 + 30);
    out += "\r\n";

    //point 4
    out += (centerPointX0 + 280) + ",";
    out += (centerPointY0 - 30);
    out += "\r\n";

    //point 5
    out += (centerPointX0 + 30) + ",";
    out += (centerPointY0 - 30);
    out += "\r\n";

    //point 6
    out += (centerPointX0 + 30) + ",";
    out += (centerPointY0 - 590);
    out += "\r\n";

    //point 7
    out += (centerPointX0 - 30) + ",";
    out += (centerPointY0 - 590);
    out += "\r\n";

    //point 8
    out += (centerPointX0 - 30) + ",";
    out += (centerPointY0 - 30);
    out += "\r\n";

    return out;   

}


//center points of the TPiece
function centerPointsTPiece(segment)
{
    var out = '';

    out += segment.data.point.x/gridSize*gridSizeInMM + ",";
    out += -(segment.data.point.y/gridSize*gridSizeInMM);

    return out;
}

//Rotation of the TPiece
function TPieceRotation(segment)
{   
    switch(segment.data.t)
    {
        case 1:
            return 0;
        case 0:
            return 90;
        case 3:
            return 180;
        case 2:
            return 270;
    
    }
}

//Corner Draw
function EveryPointOnCorner(segment)
{
    var out = '';
    var centerPointX0 = segment.data.c.x/gridSize*gridSizeInMM;
    var centerPointY0 = -(segment.data.c.y/gridSize*gridSizeInMM);

    out += (centerPointX0 - 560) + ",";
    out += (centerPointY0 - 28);
    out += "\r\n";
    out += (centerPointX0 - 560) + ",";
    out += (centerPointY0 + 28);
    out += "\r\n";
    out += (centerPointX0 + 28) + ",";
    out += (centerPointY0 + 28);
    out += "\r\n";
    out += (centerPointX0 + 28) + ",";
    out += (centerPointY0 - 560);
    out += "\r\n";
    out += (centerPointX0 - 28) + ",";
    out += (centerPointY0 - 560);
    out += "\r\n";
    out += (centerPointX0 - 28) + ",";
    out += (centerPointY0 - 28);
    out += "\r\n";

    return out;   

}

//center points for the corner
function centerPointsCorners(segment)
{
    var out = '';

    out += segment.data.c.x/gridSize*gridSizeInMM + ",";
    out += -(segment.data.c.y/gridSize*gridSizeInMM);

    return out;
}

//Rotation of the corners
function cornerRotation(segment)
{   
    switch(segment.data.t)
    {
        case 3:
            return 0;
        case 0:
            return 90;
        case 1:
            return 180;
        case 2:
            return 270;
    
    }
}

//Auto cad color ( magenta = 6, cyan = 4, yellow = 2)
function colorNumber(segment)
{
    if(segment.path_type == 'M')
    {
        return 6;
    }
    else if(segment.path_type == 'C')
    {
        return 4;
    }
    else
    {
        return 2;
    }

}

// function to center the draw in autocad
function MoveAll()
{

    var initialPointX0 = (modules[0].data.start.x - modules[0].data.end.x)/2;
    var initialPointY0 = (modules[0].data.start.y - modules[0].data.end.y)/2;

    var initialX0 = (modules[0].data.end.x - initialPointX0)/gridSize*gridSizeInMM;
    var initialY0 = (modules[0].data.end.y - initialPointY0)/gridSize*gridSizeInMM;

    var length = getSegLength(modules[0].data);

    var out = '';

    var XM = initialX0 - 30;
    var YM = initialY0 - (length/2);

    out += -XM + ",";
    out += YM;
    return out;
}

//calculate the outer dimensions on the line design page
function OuterDimensions()
{
    var arr = normalizeSegArray(segsArray);

    //Axis of X
    var maximumX = arr[0].end.x;
    var minimumX = arr[0].start.x;
    //Axis of Y
    var maximumY = arr[0].end.y;
    var minimumY = arr[0].start.y;

    var valueOfX;
    var valueOfY; 
    for(var i = 0; i < arr.length;i ++)
    {
        if(arr[i].start.x < minimumX )
        {
            minimumX = arr[i].start.x;
        }
        if(arr[i].end.x > maximumX)
        {
            maximumX = arr[i].end.x;
        }
        if(arr[i].start.y < minimumY)
        {
            minimumY = arr[i].start.y;
        }
        if(arr[i].end.y > maximumY)
        {
            maximumY = arr[i].end.y;
        }
    }

    valueOfX = ((maximumX - minimumX) /gridSize)*gridSizeInMM;
    valueOfY = ((maximumY - minimumY) /gridSize)*gridSizeInMM;
    return valueOfX, valueOfY;
}




//ETAP LOGO:
var etplg = "data:image/jpeg;base64,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L2tleT4KCQkJCTxkYXRlPjIwMDgtMDMtMTFUMTQ6MTg6NTZaPC9kYXRlPgoJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LnN0YXRlRmxhZzwva2V5PgoJCQkJPGludGVnZXI+MDwvaW50ZWdlcj4KCQkJPC9kaWN0PgoJCTwvYXJyYXk+Cgk8L2RpY3Q+Cgk8a2V5PmNvbS5hcHBsZS5wcmludC5QYWdlRm9ybWF0LlBNT3JpZW50YXRpb248L2tleT4KCTxkaWN0PgoJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jcmVhdG9yPC9rZXk+CgkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lml0ZW1BcnJheTwva2V5PgoJCTxhcnJheT4KCQkJPGRpY3Q+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYWdlRm9ybWF0LlBNT3JpZW50YXRpb248L2tleT4KCQkJCTxpbnRlZ2VyPjE8L2ludGVnZXI+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuY2xpZW50PC9rZXk+CgkJCQk8c3RyaW5nPmNvbS5hcHBsZS5wcmludGluZ21hbmFnZXI8L3N0cmluZz4KCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5tb2REYXRlPC9rZXk+CgkJCQk8ZGF0ZT4yMDA4LTAzLTExVDE0OjE4OjU2WjwvZGF0ZT4KCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5zdGF0ZUZsYWc8L2tleT4KCQkJCTxpbnRlZ2VyPjA8L2ludGVnZXI+CgkJCTwvZGljdD4KCQk8L2FycmF5PgoJPC9kaWN0PgoJPGtleT5jb20uYXBwbGUucHJpbnQuUGFnZUZvcm1hdC5QTVNjYWxpbmc8L2tleT4KCTxkaWN0PgoJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jcmVhdG9yPC9rZXk+CgkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lml0ZW1BcnJheTwva2V5PgoJCTxhcnJheT4KCQkJPGRpY3Q+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYWdlRm9ybWF0LlBNU2NhbGluZzwva2V5PgoJCQkJPHJlYWw+MTwvcmVhbD4KCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jbGllbnQ8L2tleT4KCQkJCTxzdHJpbmc+Y29tLmFwcGxlLnByaW50aW5nbWFuYWdlcjwvc3RyaW5nPgoJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lm1vZERhdGU8L2tleT4KCQkJCTxkYXRlPjIwMDgtMDMtMTFUMTQ6MTg6NTZaPC9kYXRlPgoJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LnN0YXRlRmxhZzwva2V5PgoJCQkJPGludGVnZXI+MDwvaW50ZWdlcj4KCQkJPC9kaWN0PgoJCTwvYXJyYXk+Cgk8L2RpY3Q+Cgk8a2V5PmNvbS5hcHBsZS5wcmludC5QYWdlRm9ybWF0LlBNVmVydGljYWxSZXM8L2tleT4KCTxkaWN0PgoJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jcmVhdG9yPC9rZXk+CgkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lml0ZW1BcnJheTwva2V5PgoJCTxhcnJheT4KCQkJPGRpY3Q+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYWdlRm9ybWF0LlBNVmVydGljYWxSZXM8L2tleT4KCQkJCTxyZWFsPjcyPC9yZWFsPgoJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LmNsaWVudDwva2V5PgoJCQkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQubW9kRGF0ZTwva2V5PgoJCQkJPGRhdGU+MjAwOC0wMy0xMVQxNDoxODo1Nlo8L2RhdGU+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuc3RhdGVGbGFnPC9rZXk+CgkJCQk8aW50ZWdlcj4wPC9pbnRlZ2VyPgoJCQk8L2RpY3Q+CgkJPC9hcnJheT4KCTwvZGljdD4KCTxrZXk+Y29tLmFwcGxlLnByaW50LlBhZ2VGb3JtYXQuUE1WZXJ0aWNhbFNjYWxpbmc8L2tleT4KCTxkaWN0PgoJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jcmVhdG9yPC9rZXk+CgkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lml0ZW1BcnJheTwva2V5PgoJCTxhcnJheT4KCQkJPGRpY3Q+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYWdlRm9ybWF0LlBNVmVydGljYWxTY2FsaW5nPC9rZXk+CgkJCQk8cmVhbD4xPC9yZWFsPgoJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LmNsaWVudDwva2V5PgoJCQkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQubW9kRGF0ZTwva2V5PgoJCQkJPGRhdGU+MjAwOC0wMy0xMVQxNDoxODo1Nlo8L2RhdGU+CgkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuc3RhdGVGbGFnPC9rZXk+CgkJCQk8aW50ZWdlcj4wPC9pbnRlZ2VyPgoJCQk8L2RpY3Q+CgkJPC9hcnJheT4KCTwvZGljdD4KCTxrZXk+Y29tLmFwcGxlLnByaW50LnN1YlRpY2tldC5wYXBlcl9pbmZvX3RpY2tldDwva2V5PgoJPGRpY3Q+CgkJPGtleT5jb20uYXBwbGUucHJpbnQuUGFnZUZvcm1hdC5QTUFkanVzdGVkUGFnZVJlY3Q8L2tleT4KCQk8ZGljdD4KCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LmNyZWF0b3I8L2tleT4KCQkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5pdGVtQXJyYXk8L2tleT4KCQkJPGFycmF5PgoJCQkJPGRpY3Q+CgkJCQkJPGtleT5jb20uYXBwbGUucHJpbnQuUGFnZUZvcm1hdC5QTUFkanVzdGVkUGFnZVJlY3Q8L2tleT4KCQkJCQk8YXJyYXk+CgkJCQkJCTxyZWFsPjAuMDwvcmVhbD4KCQkJCQkJPHJlYWw+MC4wPC9yZWFsPgoJCQkJCQk8cmVhbD43ODM8L3JlYWw+CgkJCQkJCTxyZWFsPjU1OTwvcmVhbD4KCQkJCQk8L2FycmF5PgoJCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jbGllbnQ8L2tleT4KCQkJCQk8c3RyaW5nPmNvbS5hcHBsZS5wcmludGluZ21hbmFnZXI8L3N0cmluZz4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQubW9kRGF0ZTwva2V5PgoJCQkJCTxkYXRlPjIwMDgtMDMtMTFUMTQ6MTg6NTZaPC9kYXRlPgoJCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5zdGF0ZUZsYWc8L2tleT4KCQkJCQk8aW50ZWdlcj4wPC9pbnRlZ2VyPgoJCQkJPC9kaWN0PgoJCQk8L2FycmF5PgoJCTwvZGljdD4KCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYWdlRm9ybWF0LlBNQWRqdXN0ZWRQYXBlclJlY3Q8L2tleT4KCQk8ZGljdD4KCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LmNyZWF0b3I8L2tleT4KCQkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5pdGVtQXJyYXk8L2tleT4KCQkJPGFycmF5PgoJCQkJPGRpY3Q+CgkJCQkJPGtleT5jb20uYXBwbGUucHJpbnQuUGFnZUZvcm1hdC5QTUFkanVzdGVkUGFwZXJSZWN0PC9rZXk+CgkJCQkJPGFycmF5PgoJCQkJCQk8cmVhbD4tMTg8L3JlYWw+CgkJCQkJCTxyZWFsPi0xODwvcmVhbD4KCQkJCQkJPHJlYWw+ODI0PC9yZWFsPgoJCQkJCQk8cmVhbD41Nzc8L3JlYWw+CgkJCQkJPC9hcnJheT4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuY2xpZW50PC9rZXk+CgkJCQkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lm1vZERhdGU8L2tleT4KCQkJCQk8ZGF0ZT4yMDA4LTAzLTExVDE0OjE4OjU2WjwvZGF0ZT4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuc3RhdGVGbGFnPC9rZXk+CgkJCQkJPGludGVnZXI+MDwvaW50ZWdlcj4KCQkJCTwvZGljdD4KCQkJPC9hcnJheT4KCQk8L2RpY3Q+CgkJPGtleT5jb20uYXBwbGUucHJpbnQuUGFwZXJJbmZvLlBNUGFwZXJOYW1lPC9rZXk+CgkJPGRpY3Q+CgkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jcmVhdG9yPC9rZXk+CgkJCTxzdHJpbmc+Y29tLmFwcGxlLnByaW50LnBtLlBvc3RTY3JpcHQ8L3N0cmluZz4KCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lml0ZW1BcnJheTwva2V5PgoJCQk8YXJyYXk+CgkJCQk8ZGljdD4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYXBlckluZm8uUE1QYXBlck5hbWU8L2tleT4KCQkJCQk8c3RyaW5nPmlzby1hNDwvc3RyaW5nPgoJCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jbGllbnQ8L2tleT4KCQkJCQk8c3RyaW5nPmNvbS5hcHBsZS5wcmludC5wbS5Qb3N0U2NyaXB0PC9zdHJpbmc+CgkJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lm1vZERhdGU8L2tleT4KCQkJCQk8ZGF0ZT4yMDAzLTA3LTAxVDE3OjQ5OjM2WjwvZGF0ZT4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuc3RhdGVGbGFnPC9rZXk+CgkJCQkJPGludGVnZXI+MTwvaW50ZWdlcj4KCQkJCTwvZGljdD4KCQkJPC9hcnJheT4KCQk8L2RpY3Q+CgkJPGtleT5jb20uYXBwbGUucHJpbnQuUGFwZXJJbmZvLlBNVW5hZGp1c3RlZFBhZ2VSZWN0PC9rZXk+CgkJPGRpY3Q+CgkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jcmVhdG9yPC9rZXk+CgkJCTxzdHJpbmc+Y29tLmFwcGxlLnByaW50LnBtLlBvc3RTY3JpcHQ8L3N0cmluZz4KCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lml0ZW1BcnJheTwva2V5PgoJCQk8YXJyYXk+CgkJCQk8ZGljdD4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYXBlckluZm8uUE1VbmFkanVzdGVkUGFnZVJlY3Q8L2tleT4KCQkJCQk8YXJyYXk+CgkJCQkJCTxyZWFsPjAuMDwvcmVhbD4KCQkJCQkJPHJlYWw+MC4wPC9yZWFsPgoJCQkJCQk8cmVhbD43ODM8L3JlYWw+CgkJCQkJCTxyZWFsPjU1OTwvcmVhbD4KCQkJCQk8L2FycmF5PgoJCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jbGllbnQ8L2tleT4KCQkJCQk8c3RyaW5nPmNvbS5hcHBsZS5wcmludGluZ21hbmFnZXI8L3N0cmluZz4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQubW9kRGF0ZTwva2V5PgoJCQkJCTxkYXRlPjIwMDgtMDMtMTFUMTQ6MTg6NTZaPC9kYXRlPgoJCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5zdGF0ZUZsYWc8L2tleT4KCQkJCQk8aW50ZWdlcj4wPC9pbnRlZ2VyPgoJCQkJPC9kaWN0PgoJCQk8L2FycmF5PgoJCTwvZGljdD4KCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYXBlckluZm8uUE1VbmFkanVzdGVkUGFwZXJSZWN0PC9rZXk+CgkJPGRpY3Q+CgkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5jcmVhdG9yPC9rZXk+CgkJCTxzdHJpbmc+Y29tLmFwcGxlLnByaW50LnBtLlBvc3RTY3JpcHQ8L3N0cmluZz4KCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lml0ZW1BcnJheTwva2V5PgoJCQk8YXJyYXk+CgkJCQk8ZGljdD4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC5QYXBlckluZm8uUE1VbmFkanVzdGVkUGFwZXJSZWN0PC9rZXk+CgkJCQkJPGFycmF5PgoJCQkJCQk8cmVhbD4tMTg8L3JlYWw+CgkJCQkJCTxyZWFsPi0xODwvcmVhbD4KCQkJCQkJPHJlYWw+ODI0PC9yZWFsPgoJCQkJCQk8cmVhbD41Nzc8L3JlYWw+CgkJCQkJPC9hcnJheT4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuY2xpZW50PC9rZXk+CgkJCQkJPHN0cmluZz5jb20uYXBwbGUucHJpbnRpbmdtYW5hZ2VyPC9zdHJpbmc+CgkJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0Lm1vZERhdGU8L2tleT4KCQkJCQk8ZGF0ZT4yMDA4LTAzLTExVDE0OjE4OjU2WjwvZGF0ZT4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuc3RhdGVGbGFnPC9rZXk+CgkJCQkJPGludGVnZXI+MDwvaW50ZWdlcj4KCQkJCTwvZGljdD4KCQkJPC9hcnJheT4KCQk8L2RpY3Q+CgkJPGtleT5jb20uYXBwbGUucHJpbnQuUGFwZXJJbmZvLnBwZC5QTVBhcGVyTmFtZTwva2V5PgoJCTxkaWN0PgoJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuY3JlYXRvcjwva2V5PgoJCQk8c3RyaW5nPmNvbS5hcHBsZS5wcmludC5wbS5Qb3N0U2NyaXB0PC9zdHJpbmc+CgkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5pdGVtQXJyYXk8L2tleT4KCQkJPGFycmF5PgoJCQkJPGRpY3Q+CgkJCQkJPGtleT5jb20uYXBwbGUucHJpbnQuUGFwZXJJbmZvLnBwZC5QTVBhcGVyTmFtZTwva2V5PgoJCQkJCTxzdHJpbmc+QTQ8L3N0cmluZz4KCQkJCQk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQuY2xpZW50PC9rZXk+CgkJCQkJPHN0cmluZz5jb20uYXBwbGUucHJpbnQucG0uUG9zdFNjcmlwdDwvc3RyaW5nPgoJCQkJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5tb2REYXRlPC9rZXk+CgkJCQkJPGRhdGU+MjAwMy0wNy0wMVQxNzo0OTozNlo8L2RhdGU+CgkJCQkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LnN0YXRlRmxhZzwva2V5PgoJCQkJCTxpbnRlZ2VyPjE8L2ludGVnZXI+CgkJCQk8L2RpY3Q+CgkJCTwvYXJyYXk+CgkJPC9kaWN0PgoJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5BUElWZXJzaW9uPC9rZXk+CgkJPHN0cmluZz4wMC4yMDwvc3RyaW5nPgoJCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5wcml2YXRlTG9jazwva2V5PgoJCTxmYWxzZS8+CgkJPGtleT5jb20uYXBwbGUucHJpbnQudGlja2V0LnR5cGU8L2tleT4KCQk8c3RyaW5nPmNvbS5hcHBsZS5wcmludC5QYXBlckluZm9UaWNrZXQ8L3N0cmluZz4KCTwvZGljdD4KCTxrZXk+Y29tLmFwcGxlLnByaW50LnRpY2tldC5BUElWZXJzaW9uPC9rZXk+Cgk8c3RyaW5nPjAwLjIwPC9zdHJpbmc+Cgk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQucHJpdmF0ZUxvY2s8L2tleT4KCTxmYWxzZS8+Cgk8a2V5PmNvbS5hcHBsZS5wcmludC50aWNrZXQudHlwZTwva2V5PgoJPHN0cmluZz5jb20uYXBwbGUucHJpbnQuUGFnZUZvcm1hdFRpY2tldDwvc3RyaW5nPgo8L2RpY3Q+CjwvcGxpc3Q+CjhCSU0D6QAAAAAAeAADAAAASABIAAAAAAMPAi//7v/uAzgCQQNnBXsD4AACAAAASABIAAAAAALYAigAAQAAAGQAAAABAAMDAwAAAAF//wABAAEAAAAAAAAAAAAAAABoCAAZAZAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhCSU0D7QAAAAAAEAEsAAAAAQACASwAAAABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAB44QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0ECgAAAAAAAQAAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAADhCSU0EAgAAAAAAAgAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0UAAAAGAAAAAAAAAAAAAAGxAAAE5AAAAAgATABBADAAMAA2AEQAMgAwAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAATkAAABsQAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAABsQAAAABSZ2h0bG9uZwAABOQAAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0ZWQAAAAAVHlwZWVudW0AAAAKRVNsaWNlVHlwZQAAAABJbWcgAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAbEAAAAAUmdodGxvbmcAAATkAAAAA3VybFRFWFQAAAABAAAAAAAAbnVsbFRFWFQAAAABAAAAAAAATXNnZVRFWFQAAAABAAAAAAAGYWx0VGFn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cy5hZG9iZS5jb20vaVgvMS4wLyI+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmMxN2QwMjZkLWYxMTAtMTFkYy1hZDA4LThlMTg2M2I4M2UzNSIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPg0KCQkJPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+DQoJCQk8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI1MjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+DQoJCQk8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NDMzPC9leGlmOlBpeGVsWURpbWVuc2lvbj4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmMxN2QwMjZkLWYxMTAtMTFkYy1hZDA4LThlMTg2M2I4M2UzNSIgeG1sbnM6cGRmPSJodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvIj4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmMxN2QwMjZkLWYxMTAtMTFkYy1hZDA4LThlMTg2M2I4M2UzNSIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIj4NCgkJCTxwaG90b3Nob3A6SGlzdG9yeT48L3Bob3Rvc2hvcDpIaXN0b3J5Pg0KCQk8L3JkZjpEZXNjcmlwdGlvbj4NCgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6YzE3ZDAyNmQtZjExMC0xMWRjLWFkMDgtOGUxODYzYjgzZTM1IiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+DQoJCQk8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4NCgkJCTx0aWZmOllSZXNvbHV0aW9uPjMwMC8xPC90aWZmOllSZXNvbHV0aW9uPg0KCQkJPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmMxN2QwMjZkLWYxMTAtMTFkYy1hZDA4LThlMTg2M2I4M2UzNSIgeG1sbnM6eGFwPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4NCgkJCTx4YXA6Q3JlYXRlRGF0ZT4yMDA4LTAzLTExVDE1OjE5OjA1KzAxOjAwPC94YXA6Q3JlYXRlRGF0ZT4NCgkJCTx4YXA6TW9kaWZ5RGF0ZT4yMDA4LTAzLTExVDE1OjE5OjA1KzAxOjAwPC94YXA6TW9kaWZ5RGF0ZT4NCgkJCTx4YXA6TWV0YWRhdGFEYXRlPjIwMDgtMDMtMTFUMTU6MTk6MDUrMDE6MDA8L3hhcDpNZXRhZGF0YURhdGU+DQoJCQk8eGFwOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDUyBNYWNpbnRvc2g8L3hhcDpDcmVhdG9yVG9vbD4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmMxN2QwMjZkLWYxMTAtMTFkYy1hZDA4LThlMTg2M2I4M2UzNSIgeG1sbnM6eGFwTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iPg0KCQkJPHhhcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMxN2QwMjZjLWYxMTAtMTFkYy1hZDA4LThlMTg2M2I4M2UzNTwveGFwTU06RG9jdW1lbnRJRD4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmMxN2QwMjZkLWYxMTAtMTFkYy1hZDA4LThlMTg2M2I4M2UzNSIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4NCgkJCTxkYzpmb3JtYXQ+aW1hZ2UvanBlZzwvZGM6Zm9ybWF0Pg0KCQk8L3JkZjpEZXNjcmlwdGlvbj4NCgk8L3JkZjpSREY+DQo8L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVz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";