let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let reset_photo = document.querySelector("#reset-photo");
let reset_and_calculate_buttons_div = document.querySelector("#reset-and-calculate-buttons");
let calculate_distance = document.querySelector("#calculate");
let video_image_div = document.querySelector("#video-and-image");

let eyeLeft = ''
let eyeRight = ''
let backgroundImageDataURL = ''
let creditCardPathStart = ''
let creditCardPathEnd = ''

// let fabricCanvas = new fabric.Canvas('canvasForFabric');
let fabricCanvas = new fabric.Canvas('canvasForFabric', {selection: false,});
let canvasContainer = document.querySelector('.canvas-container');
canvasContainer.style.display = 'none';

var zoom = document.getElementById("zoom");
var zoomCtx = zoom.getContext("2d");

async function startCamera() {
    let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    video.srcObject = stream;
}

click_button.addEventListener('click', function () {
    video_image_div.style.display = "none";
    // canvas.style.display = "block";
    reset_and_calculate_buttons_div.style.display = "block";
    click_button.style.display = "none";
    canvasContainer.style.display = 'block';
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let ctx = canvas.getContext('2d')
    ctx.save(); 
    ctx.scale(-1, 1); 
    ctx.drawImage(video, canvas.width * -1, 0, canvas.width, canvas.height);
    ctx.restore();

    backgroundImageDataURL = canvas.toDataURL();
    fabricCanvas.setBackgroundImage(backgroundImageDataURL, fabricCanvas.renderAll.bind(fabricCanvas), {
        backgroundImageStretch: false
    });
    // fabricCanvas.backgroundColor = 'transparent';

    creditCardPathStart = new fabric.Path('M 50 0 L 3 0 L 3 45', {
        stroke: 'blue',
        top:    294,
        left:   283,
        strokeWidth: 4,
        hasControls: false,
        fill: 'transparent',
        scaleX: .4,
        scaleY: .4,
    });

    creditCardPathEnd = new fabric.Path('M 0 0 L 50 0 L 50 45', {
        stroke: 'blue',
        top:    289,
        left:   400,
        strokeWidth: 4,
        hasControls: false,
        fill: 'transparent',
        scaleX: .4,
        scaleY: .4,
    });

    eyeLeft = new fabric.Circle({
        top:    198,
        left:   255,
        radius: 12,
        fill:   'transparent',
        stroke: 'red',
        strokeWidth: 3,
        hasControls: false,
    });
    eyeRight = new fabric.Circle({
        top:    196,
        left:   390,
        radius: 12,
        fill:   'transparent',
        stroke: 'red',
        strokeWidth: 3,
        hasControls: false,
    });

    fabricCanvas.add(eyeLeft);
    fabricCanvas.add(eyeRight);
    fabricCanvas.add(creditCardPathStart);
    fabricCanvas.add(creditCardPathEnd);
});

reset_photo.addEventListener('click', function () {
    canvas.style.display        = "none";
    video_image_div.style.display         = "";
    reset_and_calculate_buttons_div.style.display  = "none";
    click_button.style.display  = "block";
    fabricCanvas.remove(eyeLeft);
    fabricCanvas.remove(eyeRight);
    fabricCanvas.remove(creditCardPathStart);
    fabricCanvas.remove(creditCardPathEnd);
    canvasContainer.style.display = 'none';
});

calculate_distance.addEventListener('click', function () {
    const creditCardLengthInMM = 85.6;

    let creditCardWidthInPixel = Math.sqrt( Math.pow((creditCardPathStart.left + creditCardPathStart.strokeWidth) - (creditCardPathEnd.aCoords.tr.x -  creditCardPathEnd.strokeWidth), 2) + Math.pow((creditCardPathStart.top + creditCardPathStart.strokeWidth) - (creditCardPathEnd.top + creditCardPathEnd.strokeWidth), 2));
    let creditCardLengthRatio =  (creditCardLengthInMM/creditCardWidthInPixel);

    let distanceBwEyes = Math.sqrt(Math.pow((eyeLeft.left + eyeLeft.radius) - (eyeRight.left + eyeRight.radius), 2) + Math.pow((eyeLeft.top + eyeLeft.radius ) - (eyeRight.top + eyeRight.radius), 2));
    let pupilDistanceInMM = (Math.round(distanceBwEyes * creditCardLengthRatio) * 100 ) / 100;

    alert("your Pupil Distance is approximately " + pupilDistanceInMM + "mm");
});

startCamera()

fabricCanvas.on('object:moving', function(e) {
    let object = e.target;
    if(object.top > 67 && object.top < 393 && object.left > 150 && object.left < 489) {
        this.isDragging = true;
    }else{
        this.isDragging = false;
    }

});

fabricCanvas.on('object:modified', function(e) {
    this.isDragging = false;
    zoom.style.display = "none";
})

fabricCanvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
        var e = opt.e;
        zoomCtx.clearRect(0, 0, zoom.width, zoom.height);
        zoomCtx.fillStyle = "transparent";
        zoomCtx.drawImage(
            fabricCanvas.lowerCanvasEl, e.offsetX - 50, e.offsetY - 50, 100, 100, 0, 0, 200, 200
        );
        zoom.style.top = e.pageY + 10 + "px";
        zoom.style.left = e.pageX + 10 + "px";
        zoom.style.display = "block";
    }
});