let canvas = document.getElementById("fen");
let context = canvas.getContext("2d");
let W = window.innerWidth;
let H = window.innerHeight;
let ratio = window.devicePixelRatio;
canvas.width = W * ratio;
canvas.height = H * ratio;
canvas.style.width = W + "px";
canvas.style.height = H + "px";
context.scale(ratio, ratio);

context.font = "50px cursive";
context.textBaseline = "middle"


canvas.addEventListener("mousedown", (e) => { lessgo = !lessgo; });
canvas.addEventListener("mousemove", mousemove);

let msx = 0,
    lessgo = false,
    msy = 0;

function mousemove(e) {
    msx = e.clientX;
    msy = e.clientY;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
const TAU = Math.PI * 2;
let diff;
class Trai {
    constructor(couleur) {
        this.angle = 0;
        this.couleur = couleur;
        this.v = new Array(2);
        this.long = 100;
    }
    update(x, y, awayx, awayy) {
        diff = this.angle % TAU - Math.atan2(y - awayy, x - awayx);
        if (Math.abs(diff) > Math.PI) {
            diff -= Math.sign(diff) * TAU;
        }
        this.angle -= (diff) * 0.1;
        this.v[0] = x + Math.cos(this.angle) * this.long;
        this.v[1] = y + Math.sin(this.angle) * this.long;

    }
    draw(x, y) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(this.v[0], this.v[1]);
        context.strokeStyle = this.couleur;
        context.stroke();
        context.closePath();
        return this.v;

    }
}
class Brin {
    constructor(x, y, det, long) {
        this.x = x
        this.y = y
        this.childs = new Array(det);
        for (let i = 0; i < det; i++) {
            this.childs[i] = new Trai("green");
            this.childs[i].long = long / det
        }
    }
    draw() {
        this.v = [this.x, this.y]
        this.lessgo = distance(msx, msy, this.v[0], this.v[1]) < 100
        for (const tr of this.childs) {

            if (this.lessgo) {
                tr.update(this.v[0], this.v[1], msx, msy);
            } else {
                tr.update(this.v[0], this.v[1], this.v[0], this.v[1] + 10);
            }
            this.v = tr.draw(this.v[0], this.v[1])

        }
    }
}
let brins = new Array();
const ecart = 50;
const w = parseInt(W / ecart),
    h = parseInt(H / ecart);
for (let i = 0; i < w * h; i++) {
    brins.push(new Brin((i % w) * ecart, parseInt(i / h) * ecart, 4, 100));
}


function bLoop() {
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0, 0, W, H);
    context.closePath();
    for (const b of brins) {
        b.draw();
    }
    requestAnimationFrame(bLoop)

}
bLoop()