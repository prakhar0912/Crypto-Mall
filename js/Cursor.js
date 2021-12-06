import gsap from "gsap";

const lerp = (a, b, n) => (1 - n) * a + n * b;
const body = document.body;

const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy }
}

class Cursor {
    constructor(el, mobile) {
        if (!mobile) {
            this.DOM = { el: el };
            this.DOM.dot = this.DOM.el.querySelector('.cursor__inner--dot');
            this.DOM.circle = this.DOM.el.querySelector('.cursor__inner--circle');
            this.hintContainer = this.DOM.el.querySelector('.cursor-hint');
            this.bounds = { dot: this.DOM.dot.getBoundingClientRect(), circle: this.DOM.circle.getBoundingClientRect() };
            this.triangles = this.DOM.el.querySelectorAll('.cursor > .arrow')
            gsap.set(this.hintContainer, {xPercent: -50})
            this.scale = 1;
            this.opacity = 1;
            this.mousePos = { x: 0, y: 0 };
            this.lastMousePos = { dot: { x: 0, y: 0 }, circle: { x: 0, y: 0 } };
            this.lastScale = 1;
            this.blowAnimation = null
            this.touch = false
            this.initEvents();
            this.blowHint()
            this.remove()
            // requestAnimationFrame(() => this.render());
        }
        else{
            this.touch = true
        }
    }
    initEvents() {
        window.onmousemove = (ev) => {
            this.mousePos = getMousePos(ev)
            // this.render()
        };
    }
    render() {
        if(this.touch) return
        this.lastMousePos.dot.x = this.mousePos.x - this.bounds.dot.width / 2
        this.lastMousePos.dot.y = this.mousePos.y - this.bounds.dot.height / 2
        this.lastMousePos.circle.x = this.mousePos.x - this.bounds.circle.width / 2
        this.lastMousePos.circle.y = this.mousePos.y - this.bounds.circle.height / 2
        this.lastScale = this.scale;
        gsap.set(this.DOM.el, {
            x: this.lastMousePos.dot.x,
            y: this.lastMousePos.dot.y,
            force3D: !0
        })
        // requestAnimationFrame(() => this.render())
    }

    showTriangle() {
        if(this.touch) return
        gsap.to(this.triangles, {
            display: 'block', opacity: 1, duration: 0.5
        })
    }

    hideTriangle() {
        if(this.touch) return
        gsap.to(this.triangles, {
            opacity: 0, duration: 0.5, onComplete: () => {
                gsap.set(this.triangles, {display: 'none'})
            }
        })
    }

    killHint() {
        if(this.touch) return
        console.log('arsstast')
        if (this.blowAnime) {
            this.blowAnime.kill()
            gsap.to(this.hintContainer, {
                scale: 1,
                duration: 0.3,
                onComplete: () => {
                    this.hintContainer.style.display = 'none'
                }
            })
        }
    }

    blowHint() {
        if(this.touch) return
        this.killBlow()
        this.hintContainer.style.display = 'block'
        this.blowAnime = gsap.timeline({
            repeat: 2, onComplete: () => {
                this.hintContainer.style.display = 'none'
            }
        })
        this.blowAnime.to(this.hintContainer, {
            scale: 1.1,
            duration: 1
        })
        this.blowAnime.to(this.hintContainer, {
            scale: 1,
            duration: 1
        })
    }

    updateHint(part) {
        if(this.touch) return
        let hint = ''
        if (part === 0) {
            hint = `Click &amp; Hold`
        }
        else if (part === 1) {
            hint = 'Click, Hold then Drag'
        }
        else if (part === 2) {
            hint = 'Scroll'
        }
        this.hintContainer.innerHTML = hint
        this.blowHint()
    }

    killBlow() {
        if(this.touch) return
        if (this.blowAnimation) {
            this.blowAnimation.kill()
        }
    }

    blowUp() {
        if(this.touch) return
        this.killBlow()
        this.blowAnimation = gsap.to(this.DOM.dot, {
            height: "50px", width: "50px", duration: 2.8
        })
    }

    blowDown() {
        if(this.touch) return
        this.killBlow()
        this.blowAnimation = gsap.to(this.DOM.dot, {
            height: "8px", width: "8px", duration: 1.2
        })
    }

    enter() {
        if(this.touch) return
        this.scale = 1.5;
        this.DOM.dot.style.display = 'none';
    }
    leave() {
        if(this.touch) return
        this.scale = 1;
        this.DOM.dot.style.display = '';
    }

    remove(){
        if(this.touch) return
        this.DOM.el.style.display = 'none';
    }
    add(){
        if(this.touch) return
        this.DOM.el.style.display = 'block';
    }

}

export { Cursor };