const CAPACITY = 30;
const STEPS = 3;
const STRIDE = 7;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** A bounded path, not particles. All working geometry is allocated once. */
export class WaterWake {
  private samples = new Float64Array(CAPACITY * 4);
  private curve = new Float32Array(CAPACITY * STEPS * STRIDE);
  private edges = new Float32Array(CAPACITY * STEPS * 4);
  private colors: string[][] = [[], []];
  private head = 0;
  private count = 0;

  constructor() {
    // Age removes both energy and chroma. Palette strings are reused during drawing.
    for (let bank = 0; bank < 2; bank++) for (let age = 0; age < 12; age++) for (let speed = 0; speed < 8; speed++) {
      const fade = (1 - age / 12) ** 1.35;
      const color = bank ? [96, 161, 142] : [82, 174, 182];
      const desaturate = age / 12 * .8;
      const rgb = color.map(value => Math.round(value + (137 - value) * desaturate));
      this.colors[bank]!.push(`rgba(${rgb.join(",")},${fade * (.09 + speed / 7 * .2)})`);
    }
  }

  clear() { this.head = this.count = 0; }

  add(x: number, y: number, now: number, speed: number) {
    if (this.count) {
      const previous = ((this.head + this.count - 1) % CAPACITY) * 4;
      // At most 40 samples/second; still points never add atmosphere.
      if (now - this.samples[previous + 2]! < 25 || Math.hypot(x - this.samples[previous]!, y - this.samples[previous + 1]!) < 2) return;
    }
    const slot = ((this.head + this.count) % CAPACITY) * 4;
    this.samples[slot] = x; this.samples[slot + 1] = y;
    this.samples[slot + 2] = now; this.samples[slot + 3] = clamp(speed);
    if (this.count === CAPACITY) this.head = (this.head + 1) % CAPACITY;
    else this.count++;
  }

  draw(context: CanvasRenderingContext2D, now: number, intensity: number) {
    while (this.count && now - this.samples[this.head * 4 + 2]! > 1100) {
      this.head = (this.head + 1) % CAPACITY; this.count--;
    }
    if (this.count < 2) return this.count > 0;
    const sample = (index: number, field: number) => this.samples[((this.head + Math.max(0, Math.min(this.count - 1, index))) % CAPACITY) * 4 + field]!;
    let vertices = 0;
    for (let i = 0; i < this.count; i++) {
      const px = sample(i, 0), py = sample(i, 1);
      const ax = (sample(i - 1, 0) + px) / 2, ay = (sample(i - 1, 1) + py) / 2;
      const bx = (sample(i + 1, 0) + px) / 2, by = (sample(i + 1, 1) + py) / 2;
      for (let step = 0; step < STEPS; step++) {
        const t = step / (i === this.count - 1 ? STEPS - 1 : STEPS), u = 1 - t, slot = vertices++ * STRIDE;
        const dx = 2 * u * (px - ax) + 2 * t * (bx - px), dy = 2 * u * (py - ay) + 2 * t * (by - py);
        const length = Math.hypot(dx, dy) || 1;
        const born = u * u * (sample(i - 1, 2) + sample(i, 2)) / 2 + 2 * u * t * sample(i, 2) + t * t * (sample(i + 1, 2) + sample(i, 2)) / 2;
        const speed = sample(i, 3), ageMs = now - born, age = clamp(ageMs / (600 + speed * 500));
        const fresh = clamp((ageMs - 20) / 90);
        this.curve[slot] = u * u * ax + 2 * u * t * px + t * t * bx;
        this.curve[slot + 1] = u * u * ay + 2 * u * t * py + t * t * by;
        this.curve[slot + 2] = -dy / length; this.curve[slot + 3] = dx / length;
        this.curve[slot + 4] = age; this.curve[slot + 5] = speed;
        this.curve[slot + 6] = fresh * Math.min(1, i + t) * Math.min(1, this.count - i - t);
      }
    }
    // Overlapping soft banks suggest separated refracted light; no centerline/glowing head.
    context.globalCompositeOperation = "screen";
    for (let bank = 0; bank < 2; bank++) for (let layer = 4; layer > 0; layer--) {
      const sign = bank ? -1 : 1;
      for (let i = 0; i < vertices; i++) {
        const slot = i * STRIDE, edge = i * 4;
        const age = this.curve[slot + 4]!, velocity = this.curve[slot + 5]!;
        const taper = Math.sqrt(this.curve[slot + 6]!);
        const spread = (2 + velocity * 5 + age * 19) * taper;
        const bend = Math.sin(i * .16 + age * 2 + bank) * age * 4;
        const width = (3 + velocity * 8 + age * 13) * layer / 4 * taper;
        const offset = sign * spread + bend;
        this.edges[edge] = this.curve[slot]! + this.curve[slot + 2]! * (offset + width);
        this.edges[edge + 1] = this.curve[slot + 1]! + this.curve[slot + 3]! * (offset + width);
        this.edges[edge + 2] = this.curve[slot]! + this.curve[slot + 2]! * (offset - width);
        this.edges[edge + 3] = this.curve[slot + 1]! + this.curve[slot + 3]! * (offset - width);
      }
      let previousColor = -1, previousFresh = -1, open = false;
      for (let i = 1; i < vertices; i++) {
        const a = (i - 1) * STRIDE, b = i * STRIDE;
        const age = (this.curve[a + 4]! + this.curve[b + 4]!) / 2;
        const speed = (this.curve[a + 5]! + this.curve[b + 5]!) / 2;
        const fresh = Math.round((this.curve[a + 6]! + this.curve[b + 6]!) * 4) / 8;
        if (age >= 1 || fresh < .01) continue;
        const color = Math.min(11, Math.floor(age * 12)) * 8 + Math.min(7, Math.round(speed * 7));
        if (color !== previousColor || fresh !== previousFresh) {
          if (open) context.fill();
          context.fillStyle = this.colors[bank]![color]!;
          context.globalAlpha = intensity * fresh * (layer === 4 ? .15 : layer === 3 ? .22 : layer === 2 ? .32 : .28);
          context.beginPath(); open = true; previousColor = color; previousFresh = fresh;
        }
        const left = (i - 1) * 4, right = i * 4;
        context.moveTo(this.edges[left]!, this.edges[left + 1]!);
        context.lineTo(this.edges[right]!, this.edges[right + 1]!);
        context.lineTo(this.edges[right + 2]!, this.edges[right + 3]!);
        context.lineTo(this.edges[left + 2]!, this.edges[left + 3]!);
        context.closePath();
      }
      if (open) context.fill();
    }
    context.globalAlpha = 1; context.globalCompositeOperation = "source-over";
    return true;
  }
}
