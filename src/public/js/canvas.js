var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

var gridCanvas = document.getElementById("gridCanvas");
var gridCtx = gridCanvas.getContext("2d");

var W = 28;
var H = 28;

function initMainCanvas(canvas, ctx){
    
    fixBlur(canvas);

    let down = false;

    let downListener = function(e) {
        down = true;
    }

    let upListener = function(e) {
        down = false;
    }

    let moveListener = function(e) { 

        if (!down) return;

        // Get mouse position
        var mX = e.x;
        var mY = e.y;
        
        // Get canvas position
        var rect = canvas.getBoundingClientRect();
        var x = (mX - rect.left) * (canvas.width / rect.width);
        var y = (mY - rect.top) * (canvas.height / rect.height);

        // Get grid position (relative to canvas)
        var x = Math.floor(x / (canvas.width / W));
        var y = Math.floor(y / (canvas.height / H));

        if (canvasMode === "brush"){
            ctx.fillStyle = "black";
            ctx.fillRect(x * (canvas.width / W), y * (canvas.height / H), canvas.width / W, canvas.height / H);
        }
        else if (canvasMode === "eraser"){
            ctx.fillStyle = "white";
            ctx.clearRect(x * (canvas.width / W), y * (canvas.height / H), canvas.width / W, canvas.height / H);
        }
    }

    canvas.addEventListener("mousedown", downListener);
    canvas.addEventListener("mouseup", upListener);
    canvas.addEventListener("mousemove", moveListener);
}

function initGridCanvas(canvas, ctx){
    fixBlur(canvas);
    drawGrid(canvas, ctx);
}

// Fix blurry canvas
function fixBlur(canvas){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function drawGrid(){
    let gridCanvas = document.getElementById("gridCanvas");
    let gridCtx = gridCanvas.getContext("2d");
    fixBlur(canvas);

    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    for (var x = 0; x < gridCanvas.width; x += gridCanvas.width / W) {
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridCanvas.height);
    }

    for (var y = 0; y < gridCanvas.height; y += gridCanvas.height / H) {
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(gridCanvas.width, y);
    }

    gridCtx.strokeStyle = "grey";
    gridCtx.stroke();
}

function promptClear(){
    if (confirm("Are you sure you want to clear the canvas?")){
        clearCanvas();
    }
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleGrid(){
    if (activeStateModes.includes('grid')){
        $("#gridCanvas").fadeIn(50);
    }else{
        $("#gridCanvas").fadeOut(50);
    }
}

// ====================================================================================================
// CANVAS CONTROLS

var canvasMode = "brush";
var activeStateModes = ['grid'];
var stateModes = ['grid'];
var stateFunctions = {
    'grid': toggleGrid
}

function toggleMode(mode){

    if (stateModes.includes(mode)){
        // Toggle canvas state

        console.log("State: " + mode);
        console.log(activeStateModes);

        if (activeStateModes.includes(mode)){
            // Remove btn-active-state
            document.getElementById(mode + "-control").classList.remove('btn-active-state');
            activeStateModes.splice(activeStateModes.indexOf(mode), 1);
        }else{
            // Add btn-active-state
            document.getElementById(mode + "-control").classList.add('btn-active-state');
            activeStateModes.push(mode);
        }

        // Call function
        stateFunctions[mode]();
    }else{
        // Toggle canvas mode

        canvasMode = mode;
        modeButtons = document.getElementsByClassName('btn-control');
        for (var i = 0; i < modeButtons.length; i++) {
            modeButtons[i].classList.remove('btn-active');
            modeButtons[i].classList.remove('btn-active-clear');
        }
    
        if (mode == "clear"){
            document.getElementById(mode + "-control").classList.add('btn-active-clear');
        }else{
            document.getElementById(mode + "-control").classList.add('btn-active');
        }
    }

    console.log("Mode: " + canvasMode);
}