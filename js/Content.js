import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

class Content {
    constructor() {
        gsap.registerPlugin(ScrollTrigger)
        this.yeah = document.querySelector('.yeah')
        this.astroL = document.querySelector('.intro > .left > img')
        this.astroR = document.querySelector('.intro > .right > img')
        this.blockL = document.querySelector('.yeah > .left-line > .left-block')
        this.blockR = document.querySelector('.yeah > .right-line > .right-block')
        this.nav = document.querySelector('.top-nav')
    }

    killAll() {
        if (this.astroLAnime) {
            this.astroLAnime.kill()
        }
        if (this.astroRAnime) {
            this.astroRAnime.kill()
        }
    }

    start() {

        this.killAll()

        this.astroLAnime = gsap.timeline({ repeat: -1 })
        this.astroLAnime.to('.skewElem1', {
            yPercent: -8, duration: 1
        })
        this.astroLAnime.to('.skewElem1', {
            yPercent: 0, duration: 1
        })

        this.astroRAnime = gsap.timeline({ repeat: -1 })
        this.astroRAnime.to('.skewElem2', {
            yPercent: 8, duration: 1
        })
        this.astroRAnime.to('.skewElem2', {
            yPercent: 0, duration: 1
        })

        this.blockLAnime = gsap.to(this.blockL, {
            scrollTrigger: {
                trigger: this.yeah,
                scrub: true,
                scroller: this.yeah,
                start: "top top",
            },
            top: "90%"
        })

        this.blockRAnime = gsap.to(this.blockR, {
            scrollTrigger: {
                trigger: this.yeah,
                scrub: true,
                scroller: this.yeah,
                start: "top top",
            },
            top: "60%"
        })

        gsap.to(this.nav, {
            gridTemplateColumns: "30% 40% 30%",
            onComplete: () => {
                gsap.to(this.nav.querySelector(".center"), {
                    display: "block", opacity: 1
                })
            }
        })

        // let proxy = { skew: 0 },
        //     skewSetter = gsap.quickSetter(".skewElem", "skewY", "deg"), // fast
        //     clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees. 

        // ScrollTrigger.create({
        //     onUpdate: (self) => {
        //         let skew = clamp(self.getVelocity() / -100);
        //         // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
        //         if (Math.abs(skew) > Math.abs(proxy.skew)) {
        //             proxy.skew = skew;
        //             gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
        //         }
        //     },
        //     scroller: this.yeah,
        //     trigger: this.yeah,
        //     markers: true
        // }); 

        // // make the right edge "stick" to the scroll bar. force3D: true improves performance
        // gsap.set(".skewElem", { transformOrigin: "right center", force3D: true });

        // ScrollTrigger.refresh()

    }
}

export {
    Content
}