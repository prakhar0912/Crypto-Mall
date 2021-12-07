import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

function once(el, event, fn, opts) {
    var onceFn = function (e) {
        el.removeEventListener(event, onceFn);
        fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
}

class Vid {
    constructor() {
        this.video1 = document.querySelector('#video1')
        this.video2 = document.querySelector('#video3')
        this.section = document.querySelector('.yeah')
        this.sectionHeight = this.section.clientHeight - document.body.clientHeight + 10
        this.running = false
        this.prev = 0
        this.go = false
        this.done = false
        gsap.registerPlugin(ScrollTrigger)
    }

    // start(part) {
    //     if (part == 0) {
    //         this.video1.play()
    //     }
    //     else if (part == 1) {
    //         this.running = true
    //         this.video1.pause()
    //         this.scrollPlay()
    //     }

    // }

    // pause(part) {
    //     if (part == 0) {
    //         this.video1.pause()
    //     }
    //     else if (part == 1) {
    //         this.running = false
    //         this.video2.pause()
    //     }
    // }

    // oneShot() {
    //     if(!this.done){
    //         this.done = true
    //         setTimeout(() => {
    //             this.go = false
    //             this.video2.pause()
    //             this.done = false
    //         }, 500)
    //     }
    // }

    // scrollPlay() {
    //     if (this.video2.duration) {
    //         if (this.prev != window.scrollY && !this.go) {
    //             this.go = true
    //             this.video2.play()

    //         }
    //         else if (this.prev == window.scrollY) {
    //             this.oneShot()
    //         }
    //         this.prev = window.scrollY

    //     }
    //     if (this.running) {
    //         requestAnimationFrame(this.scrollPlay.bind(this));
    //     }
    // }

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
        // clearInterval(this.inte)
        if (this.scrollTrig) {
            this.scrollTrig.kill()
        }

        // this.scrollTrig = ScrollTrigger.create({
        //     trigger: this.section,
        //     duration: 1,
        //     markers: true,
        //     ease: "power4.out",
        //     scrub: true
        // })

        this.scrollTrig = gsap.timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
                trigger: this.section,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });


        this.scrollTrig.fromTo(
            this.video2,
            {
                currentTime: 0
            },
            {
                currentTime: this.video2.duration || 1
            }
        );

        // this.run()
        // this.inte = setInterval(this.playVideo.bind(this), 1)

    }

    run() {
        this.playVideo()
        if (this.running) {
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