let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let reset_photo = document.querySelector("#reset-photo");
let reset_and_calculate_buttons_div = document.querySelector("#reset-and-calculate-buttons");
let calculate_distance = document.querySelector("#calculate");
let eyeLeft = ''
let eyeRight = ''
let img = ''
let creditCardPathStart = ''
let creditCardPathEnd = ''
let fabricCanvas = new fabric.Canvas('canvasForFabric');
let canvasContainer = document.querySelector('.canvas-container');
canvasContainer.style.display = 'none';
canvasContainer.style.position = 'absolute';
canvasContainer.style.top = '7px';

async function startCamera() {
    let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    video.srcObject = stream;
}

click_button.addEventListener('click', function () {
    video.style.display = "none";
    canvas.style.display = "block";
    reset_and_calculate_buttons_div.style.display = "block";
    click_button.style.display = "none";
    canvasContainer.style.display = 'block';
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    fabricCanvas.backgroundColor = 'transparent';

    creditCardPathStart = new fabric.Path('M 50 0 L 3 0 L 3 45', {
        stroke: 'blue',
        top:    200,
        left:   100,
        strokeWidth: 4,
        hasControls: false,
        fill: 'transparent',
    });

    creditCardPathEnd = new fabric.Path('M 0 0 L 50 0 L 50 45', {
        stroke: 'blue',
        top:    200,
        left:   (canvas.width - 130),
        strokeWidth: 4,
        hasControls: false,
        fill: 'transparent',
    });

    eyeLeft= new fabric.Circle({
        top:    100,
        left:   100,
        radius: 20,
        fill:   'transparent',
        stroke: 'red',
        strokeWidth: 4,
        hasControls: false,
    });

    eyeRight = new fabric.Circle({
        top:    100,
        left:   (canvas.width - 130),
        radius: 20,
        fill:   'transparent',
        stroke: 'red',
        strokeWidth: 4,
        hasControls: false,
    });

    fabricCanvas.add(eyeLeft);
    fabricCanvas.add(eyeRight);
    fabricCanvas.add(creditCardPathStart);
    fabricCanvas.add(creditCardPathEnd);
});

reset_photo.addEventListener('click', function () {
    canvas.style.display        = "none";
    video.style.display         = "";
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

    console.log('------------------------------')
    console.log('Credit Card Start: ', creditCardPathStart)
    console.log('Credit Card end: ', creditCardPathEnd)
    console.log('eye left: ', eyeLeft)
    console.log('eye right: ', eyeRight)
    console.log('------------------------------')
    console.log(creditCardWidthInPixel, creditCardLengthRatio);
    console.log(distanceBwEyes, pupilDistanceInMM);

    alert("your Pupil Distance is approximately " + pupilDistanceInMM + "mm");
});

startCamera()