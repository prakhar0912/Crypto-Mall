import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import locomotiveScroll from "locomotive-scroll";

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
        this.video0 = document.querySelector('#video1')
        this.video1 = document.querySelector('#video1')
        this.video2 = document.querySelector('#video3')
        this.section = document.querySelector('.yeah')
        this.sectionHeight = this.section.clientHeight - document.body.clientHeight + 10
        this.running = false
        this.prev = 0
        this.go = false
        this.done = false
        gsap.registerPlugin(ScrollTrigger)
        this.locoScroll = new locomotiveScroll({
            el: this.section,
            smooth: true
        })
        this.locoScroll.on("scroll", ScrollTrigger.update)
        ScrollTrigger.scrollerProxy(this.section, {
            scrollTop: (value) => {
                return arguments.length ? this.locoScroll.scrollTo(value, 0, 0) : this.locoScroll.scroll.instance.scroll.y;
            },
            // scrollTop(value){
            // }, // we don't have to define a scrollLeft because we're only scrolling vertically.
            getBoundingClientRect: () => {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
            pinType: this.section.style.transform ? "transform" : "fixed"
        });
        // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
        ScrollTrigger.addEventListener("refresh", () => this.locoScroll.update());
        // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
        ScrollTrigger.refresh();

    }

    scrollTop(value) {
    }

    start(part) {
        if (part == 0) {
            this.video0.play()
        }
        else if (part == 1) {
            this.running = true
            this.video1.pause()
            this.video0.pause()
            this.scrollPlay()

        }

    }

    pause(part) {
        if (part == 0) {
            this.video1.pause()
            this.video0.pause()
            this.video
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

        this.scrollTrig = gsap.timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
                trigger: this.section,
                scroller: this.section,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });

        this.scrollTrig.fromTo(
            this.video2,
            {
                currentTime: 0,
            },
            {
                currentTime: this.video2.duration-0.6 || 1,
            }
        );

        // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
        ScrollTrigger.refresh();

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