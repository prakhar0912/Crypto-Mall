import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

class Vid {
    constructor() {
        this.video1 = document.querySelector('#video1')
        this.video2 = document.querySelector('#video2')
        this.section = document.querySelector('.yeah')
        this.running = false
        this.acc = 0.1
        this.scrollPos = 0
        this.delay = 0
        this.sec = 15
        gsap.registerPlugin(ScrollTrigger)

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
            // clearInterval(this.inte)
            this.running = false
            this.scrollTrig.kill()
            this.video2.pause()

        }
    }


    scrollPlay() {
        clearInterval(this.inte)
        if(this.scrollTrig){
            this.scrollTrig.kill()
        }

        this.scrollTrig = ScrollTrigger.create({
            trigger: this.section,
            duration: 1,
            markers: true,
            ease: "power4.out",
            onUpdate: (e) => {
                this.scrollPos = e.progress * this.video2.duration
            }
        })
        this.run()
        // this.inte = setInterval(this.playVideo.bind(this), 1)

    }

    run(){
        this.playVideo()
        if(this.running){
            requestAnimationFrame(this.run.bind(this))
        }
    }

    playVideo() {
        this.delay += (this.scrollPos - this.delay) * this.acc
        this.video2.currentTime = this.delay.toFixed(1)
    }
}

export {
    Vid
}