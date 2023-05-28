const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#070113"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

class Vector {
    constructor(_x, _y) {
        this.x = _x
        this.y = _y
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y)
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y)
    }
    multiply(n) {
        return new Vector(this.x * n, this.y * n)
    }
    mag() {
        return Math.sqrt(this.x**2 + this.y**2)
    }
    normal() {
        return new Vector(-this.y, this.x).unit()
    }
    unit() {
        return this.mag() !== 0 ? new Vector(this.x / this.mag(), this.y / this.mag()) : new Vector(0, 0)
    }
    angle() {
        return Math.atan2(this.y, this.x)
    }


    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y
    }
    static setMag(v, mag) {
        return v.unit().multiply(mag)
    }

}

class Circle {
    constructor(_posX, _posY, _r) {
        this.pos = new Vector(_posX, _posY)
        this.r = _r
    }
    show() {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        ctx.fillStyle = "darkslategray"
        ctx.fill() 
    }
}

class Boid {
    constructor(_x, _y, _m) {
        this.pos = new Vector(_x, _y)
        this.v = new Vector(0, 0)
        this.a = new Vector(0, 0)
        this.m = 1
        this.r = 10
        this.friction = 0.0
        this.maxSpeed = 3
        this.maxForce = 0.06
    }
    show() {
        ctx.beginPath()
        ctx.moveTo(this.pos.x, this.pos.y)
        ctx.lineTo(this.pos.x - 35, this.pos.y + 10)
        ctx.lineTo(this.pos.x - 35, this.pos.y - 10)
        ctx.lineTo(this.pos.x, this.pos.y)
        ctx.strokeStyle = "white"
        ctx.stroke()
    }
    showVector() {
        ctx.beginPath()
        ctx.moveTo(this.pos.x - 15, this.pos.y)
        ctx.lineTo(this.pos.x + this.v.unit().x * 30 - 15, this.pos.y + this.v.unit().y * 30)
        ctx.strokeStyle = "white"
        ctx.stroke()
    }
    seek(target) {
        const direction = target.pos.subtract(this.pos).unit()
        const mag = direction.multiply(this.maxSpeed)
        const force = mag.subtract(this.v)
        return force.mag() > this.maxForce ? force.unit().multiply(this.maxForce) : force
    }
    flee(target) {
        const direction = target.pos.subtract(this.pos).unit()
        const mag = direction.multiply(-this.maxSpeed)
        const force = mag.subtract(this.v)
        return force.mag() > this.maxForce ? force.unit().multiply(this.maxForce) : force //flies off when multiplied by -1
    }
    move() {
        this.v = this.v.add(this.a)
        this.v = this.v.multiply(1 - this.friction)
        this.pos.x += this.v.x
        this.pos.y += this.v.y
        this.a = new Vector(0, 0)
    }
    applyForce(force) {
        this.a = this.a.add(force)
        console.log(this.a)
        // this.a = this.a.add(force).mag() < this.maxSpeed ? this.a.add(force) : this.a
        // once the magnitude of the force exceeds the max magnitude it will no longer change and
        // above function will return 'this.a' upon every iteration.
    }
}

const boid = new Boid(600, 600, 1)
const circle = new Circle(200, 200, 15)


window.addEventListener('mousemove', (e) => {
    circle.pos.x = e.clientX
    circle.pos.y = e.clientY
})

function animate() {
    clearCanvas()
    circle.show()
    const seek = boid.seek(circle)
    boid.applyForce(seek)
    boid.move()
    boid.show()
    requestAnimationFrame(animate)
}
animate()