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

context.lineWidth = 2;

const TAU = Math.PI * 2;
let msx = 0,
    msy = 0,
    time = true;


canvas.addEventListener("mousemove", mousemove);
canvas.addEventListener("click", (e) => { time = !time; });

function mousemove(e) {
    msx = e.clientX;
    msy = e.clientY;
}


function distance(x1, y1, x2, y2) { return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)); }



class Trai {
    constructor(l) {
        this.angle = 0;
        this.long = l;
        this.v = new Array(2);
    }
    update(x, y, awayx, awayy) {
        let diff = (this.angle % TAU) - Math.atan2(y - awayy, x - awayx);
        if (Math.abs(diff) > Math.PI) { diff -= Math.sign(diff) * TAU; }
        this.angle -= (diff) * 0.1;


    }
    draw(x, y) {
        this.v[0] = x + Math.cos(this.angle) * this.long;
        this.v[1] = y + Math.sin(this.angle) * this.long;
        context.moveTo(x, y);
        context.lineTo(this.v[0], this.v[1]);
    }
}
class Brin {
    constructor(x, y, det, long) {
        this.x = x
        this.y = y
        this.childs = new Array(det);
        this.couleur = 'green';
        this.brightCouleur = 'lightgreen';
        for (let i = 0; i < det; i++) {
            this.childs[i] = new Trai(long / det);
        }
    }
    draw() {
        let v = [this.x, this.y]
        this.lessgo = distance(msx, msy, v[0], v[1]) < 100;
        context.beginPath();
        for (const tr of this.childs) {

            if (this.lessgo) {
                tr.update(v[0], v[1], msx, msy);
            } else if (time) {
                tr.update(v[0], v[1], v[0], v[1] + 10);
            }
            tr.draw(v[0], v[1])
            v = [tr.v[0], tr.v[1]];
        }
        context.strokeStyle = this.lessgo ? this.brightCouleur : this.couleur;
        context.stroke();
        context.closePath();
    }
}
let brins = new Array();
const ecart = 10;

for (let y = 0; y < H/2; y += ecart) {
    for (let x = 0; x < W/2; x += ecart) {
        brins.push(new Brin(W/4 + x + (Math.random() - .5) * 10, H/4+y+ (Math.random()-.5)*10, 2, 30));
    }
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
