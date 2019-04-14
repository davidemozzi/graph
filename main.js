const e = Math.E;
const E = Math.E;

let RESOLUTION = 300;
let SCALE = 100;
let upperBound;
let xOffset = 0;
let yOffset = 0;
let f = [];
let body;
let input;
// let resolution;
let container;
let oneTouch;

function setup() {
  createCanvas(innerWidth, innerHeight);
  input = document.getElementById('input');
  // resolution = document.getElementById('resolution');
  container = document.getElementById('container');
  document.addEventListener("keydown", keyDown);
}

function draw() {
  upperBound = (height / 2 + abs(yOffset)) / SCALE;
  // RESOLUTION = resolution.value;
  background(255);
  translate(width / 2 + xOffset, height / 2 + yOffset);
  drawPlain();
  for (let fn of f) {
    if (fn != undefined) {
      try {
        fn.draw();
      }
      catch (e) {
        deleteElement(id - 1);
        //document.write(e);
      }
    }
  }
}

let id = 0;

function keyDown(e) {
  if (e.key == 'Enter') {
    let div = createDiv();
    div.elt.id = "div" + id;
    div.parent('container');
    let p = createP(input.value);
    p.parent(div);
    let button = createButton("Delete");
    button.parent(div);
    let i = id;
    button.mouseClicked(() => deleteElement(i));
    id++;
    addLine(input.value);
  }
}

function addLine(functionString) {
  while (functionString.includes('^')) {
    let i = functionString.indexOf('^');
    functionString = functionString.slice(0, i) + '**' + functionString.slice(i + 1, functionString.length);
  }
  try {
    f.push(new Line(eval('(x) => ' + functionString)));
    try {
      f[f.length - 1].draw();
      input.value = '';
    } catch (e) {}
  }
  catch (e) {
    f.push(0);
    deleteElement(id - 1);
  }
}

function deleteElement(i) {
  delete f[i];
  container.removeChild(document.getElementById('div' + i));
}

function slider(min, max, period = 1) {
  if (max == undefined) {
    if (min == undefined) {
      min = 0;
      max = 1;
    } else {
      max = min;
      min = 0;
    }
  }
  return map(sin(frameCount / 60 / period), -1, 1, min, max);
}

let frameZero = null;

function delta(speed = 1) {
  if (frameZero == null) {
    frameZero = frameCount;
  }
  return (frameCount - frameZero) / 60 * speed;
}

function drawPlain() {
  strokeWeight(1);
  let w = width / 2 + abs(xOffset);
  let h = height / 2 + abs(yOffset);
  stroke(220);
  for (let i = SCALE; i < max(width, height) / 2 + max(abs(xOffset), abs(yOffset)); i += SCALE) {
    line(i, -h, i, h);
    line(-i, -h, -i, h);
    line(-w, i, w, i);
    line(-w, -i, w, -i);
  }
  stroke(100);
  line(-width / 2 - xOffset, 0, width / 2 - xOffset, 0);
  line(0, -height / 2 - yOffset, 0, height / 2 - yOffset);
}

function mouseWheel(e) {
  let oldScale = SCALE;
  SCALE *= 1 - Math.sign(e.delta) / 10;
  if (SCALE < 4) {
    SCALE = 4;
  }
  if (SCALE > 2000) {
    SCALE = 2000;
  }
  let x = mouseX - width / 2 - xOffset;
  let y = mouseY - height / 2 - yOffset;
  xOffset += x * (1 - SCALE / oldScale);
  yOffset += y * (1 - SCALE / oldScale);
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

let dist = null;
let x0, y0;

function touchStarted(e) {
  if (e.type == 'mousedown') {
    return;
  }
  if (e.touches.length > 0) {
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
    if (e.touches.length > 1) {
      dist = sqrt((e.touches[0].clientX - e.touches[1].clientX)**2 + (e.touches[0].clientY - e.touches[1].clientY)**2);
    }
    if (e.touches.length == 1) {
      oneTouch = true;
    } else {
      oneTouch = false;
    }
  }
}

function touchMoved(e) {
  if (e.touches.length >= 2) {
    let d = sqrt((e.touches[0].clientX - e.touches[1].clientX)**2 + (e.touches[0].clientY - e.touches[1].clientY)**2);
    let oldScale = SCALE;
    SCALE = constrain(SCALE + d - dist, 10, 1000);
    dist = d;
    let middleX = e.touches[0].clientX + e.touches[1].clientX;
    let middleY = e.touches[0].clientY + e.touches[1].clientY;
    let x = middleX / 2 - width / 2 - xOffset;
    let y = middleY / 2 - height / 2 - yOffset;
    xOffset += x * (1 - SCALE / oldScale);
    yOffset += y * (1 - SCALE / oldScale);
  }
  if (e.touches.length == 1 && oneTouch) {
    xOffset += e.touches[0].clientX - x0;
    yOffset += e.touches[0].clientY - y0;
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
  }
}

function mouseDragged() {
  xOffset += mouseX - pmouseX;
  yOffset += mouseY - pmouseY;
}
