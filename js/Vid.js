import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

class Vid {
    constructor() {
        this.video1 = document.querySelector('#video1')
        this.video2 = document.querySelector('#video2')
        this.section = document.querySelector('.yeah')
        this.sectionHeight = this.section.clientHeight - document.body.clientHeight + 10
        this.running = false
        this.prev = 0
        this.go = false
        this.done = false
    }

    start(part) {
        if (part == 0) {
            this.video1.play()
        }
        else if (part == 1) {
            this.running = true
            this.video1.pause()
            this.scrollPlay()
        }

    }

    pause(part) {
        if (part == 0) {
            this.video1.pause()
        }
        else if (part == 1) {
            this.running = false
            this.video2.pause()
        }
    }

    oneShot() {
        if(!this.done){
            this.done = true
            setTimeout(() => {
                this.go = false
                this.video2.pause()
                this.done = false
            }, 500)
        }
    }

    scrollPlay() {
        if (this.video2.duration) {
            if (this.prev != window.scrollY && !this.go) {
                this.go = true
                this.video2.play()

            }
            else if (this.prev == window.scrollY) {
                this.oneShot()
            }
            this.prev = window.scrollY

        }
        if (this.running) {
            requestAnimationFrame(this.scrollPlay.bind(this));
        }
    }
}

export {
    Vid
}