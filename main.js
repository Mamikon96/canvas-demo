

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


let useRandomColor = false;
let canvasColor = '#00ff00';


const clearBtn = document.querySelector('[data-id=clear-btn]');
clearBtn.addEventListener('click', clearCanvas);


const smoothBtn = document.querySelector('[data-id=smooth-btn]');
smoothBtn.addEventListener('click', () => {useRandomColor = true});


const saveBtn = document.querySelector('[data-id=save-btn]');
saveBtn.addEventListener('click', saveImage);


const gridBtn = document.querySelector('[data-id=grid-btn]');
gridBtn.addEventListener('click', showGrid(false));


const selectColorBtn = document.querySelector('[data-id=select-color-btn]');
selectColorBtn.addEventListener('click', selectColor);

const selectColorStatus = document.querySelector('[data-id=select-color-btn] .actions__btn-status');

const selectColorInput = selectColorBtn.querySelector('[data-id=select-color-btn] input');
selectColorInput.addEventListener('change', setColor);




function initCanvas() {
	// const canvasStyles = canvas.getBoundingClientRect();
	// console.log(canvasStyles);

	// canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + 'px';
//   canvas.style.top =window.innerHeight / 2 - canvas.height / 2 + 'px';

	// canvas.style.width = '50%';
	// canvas.style.height = '50%';

  console.log(window);
}

initCanvas();




// ===============================================================

function getRandomColorFrom(color) {
	let colorCode = color;

	function increaseColor() {
		const code = colorCode.substring(1);

		const newHexCode = parseInt(code, 16) + 1;
		let newColor = newHexCode.toString(16);

		if (newColor.length > 6) {
			colorCode = `#000000`;
		} else {
			switch (newColor.length) {
				case 6:
					break;
				case 5:
					newColor = `0${newColor}`;
					break;
				case 4:
					newColor = `00${newColor}`;
					break;
				case 3:
					newColor = `000${newColor}`;
					break;
				case 2:
					newColor = `0000${newColor}`;
					break;
				case 1:
					newColor = `00000${newColor}`;
					break;
				case 0:
					newColor = `000000`;
					break;
			}
			colorCode = `#${newColor}`;
		}
		return colorCode;
	}

	return () => {
		return increaseColor();
	};
}

let greenColor = '#00ff00';
let getColorFromGreen = getRandomColorFrom(greenColor);

rxjs.fromEvent(canvas, 'mousedown')
	.pipe(
		rxjs.switchMap((data) => {
			return rxjs.fromEvent(canvas, 'mousemove')
				.pipe(
					rxjs.bufferCount(2, 1),
					rxjs.takeUntil(rxjs.fromEvent(canvas, 'mouseup'))
				)
		})
	)
	.subscribe(data => {
		console.log(canvas.style.left);

		const x1 = data[0].x - canvas.offsetLeft;
		const y1 = data[0].y - canvas.offsetTop;
		const x2 = data[1].x - canvas.offsetLeft;
		const y2 = data[1].y - canvas.offsetTop;

		// const x1 = data[0].x;
		// const y1 = data[0].y;
		// const x2 = data[1].x;
		// const y2 = data[1].y;

		drawLine(x1, y1, x2, y2, useRandomColor ? getColorFromGreen() : canvasColor);
	});

// ===============================================================

function drawLine(x1, y1, x2, y2, color) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineWidth = 20;
	ctx.lineCap = 'round';

	if (color) {
		ctx.strokeStyle = color;
	} else {
		ctx.strokeStyle = '#00ff00';
	}

	ctx.stroke();
}

function clearCanvas() {
	ctx.clearRect(0, 0, 500, 500);
	// drawGrid();
}

function selectColor() {
	useRandomColor = false;
	selectColorInput.click();
}

function setColor(e) {
	selectColorStatus.style.backgroundColor = e.target.value;
	// getColorFromGreen = getRandomColorFrom(e.target.value);
	canvasColor = e.target.value;
}

function saveImage() {
	// const image = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
	const image = canvas.toDataURL('image/png');
	// window.location.href = image;
	var a = document.createElement('a');
    a.href = image;
    a.download = 'canvas.png';
    document.body.appendChild(a);
    a.click();
}


function drawGrid() {
		var span = 30;
        ctx.strokeStyle = "#aaa";
		ctx.lineWidth = 1;
        var w = canvas.width - 1;
        var h = canvas.height - 1;
        for (var x = -0.5; x < w; x += span) ctx.strokeRect(x, 0, 0.1, h);
        for (var y = -0.5; y < h; y += span) ctx.strokeRect(0, y, w, 0.1);
        return canvas.toDataURL();
}

function showGrid(show) {
	let showGrid = show;

	return () => {
		if (showGrid) {
			drawGrid();
		} else {
			clearCanvas();
		}
		showGrid = !showGrid;
	}
}