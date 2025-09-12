import p5 from 'p5';

export class Asteroid {
  x: number;
  y: number;
  size = 120;
  speed: number;
  shape: p5.Vector[];

  constructor(private p: p5, speed: number) {
    this.x = p.width / 2;
    this.y = -100;
    this.speed = speed;
    this.shape = this.createShape(60, 15);
  }

  update(): void {
    this.y += this.speed;
  }

  draw(): void {
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.fill(150, 140, 130);
    this.p.noStroke();
    this.p.beginShape();
    for (const v of this.shape) {
      this.p.vertex(v.x, v.y);
    }
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }

  private createShape(radius: number, randomness: number): p5.Vector[] {
    const shape: p5.Vector[] = [];
    const numVertices = 12;
    for (let i = 0; i < numVertices; i++) {
      const angle = this.p.map(i, 0, numVertices, 0, this.p.TWO_PI);
      const r = radius + this.p.random(-randomness, randomness);
      const x = r * this.p.cos(angle);
      const y = r * this.p.sin(angle);
      shape.push(this.p.createVector(x, y));
    }
    return shape;
  }
}
