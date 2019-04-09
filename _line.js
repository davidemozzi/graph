class Line {
  constructor(f = (x) => x) {
    this.f = f;
    this.drawing = true;
    let r, g, b;
    do {
      r = random(255);
      g = random(255);
      b = random(255);
    }
    while(r + g + b > 510);
    this.color = color(r, g, b);
  }

  draw() {
    stroke(this.color);
    strokeWeight(2);
    noFill();
    let a = -(width / 2 + xOffset) / SCALE;
    let b = (width / 2 - xOffset) / SCALE;
    beginShape();
    for (let i = a; i < b; i += 1 / RESOLUTION) {
      let fi = this.f(i);
      if (this.drawing == true) {
        let x = i * SCALE;
        let y = -fi * SCALE;
        vertex(x, y);
        if (abs(fi) > upperBound * 5) {
          endShape();
          this.drawing = false;
        }
      } else if (abs(fi) < upperBound * 5) {
        beginShape();
        this.drawing = true;
      }
    }
    endShape();
  }
}
