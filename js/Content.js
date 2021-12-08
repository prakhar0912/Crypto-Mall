import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

class Content{
    constructor(){
        gsap.registerPlugin(ScrollTrigger)
        this.yeah = document.querySelector('.yeah')
        this.astroL = document.querySelector('.intro > .left > img')
        this.astroR = document.querySelector('.intro > .right > img')
        this.blockL = document.querySelector('.yeah > .left-line > .left-block')
        this.blockR = document.querySelector('.yeah > .right-line > .right-block')
        this.nav = document.querySelector('.top-nav')
    }

    killAll(){
        if(this.astroLAnime){
            this.astroLAnime.kill()
        }
        if(this.astroRAnime){
            this.astroRAnime.kill()
        }
    }

    start(){

        this.killAll()

        this.astroLAnime = gsap.timeline({repeat: -1})
        this.astroLAnime.to(this.astroL, {
            yPercent: -8, duration: 1
        })
        this.astroLAnime.to(this.astroL, {
            yPercent: 0, duration: 1
        })

        this.astroRAnime = gsap.timeline({repeat: -1})
        this.astroRAnime.to(this.astroR, {
            yPercent: 8, duration: 1
        })
        this.astroRAnime.to(this.astroR, {
            yPercent: 0, duration: 1
        })

        this.blockLAnime = gsap.to(this.blockL, {
            scrollTrigger: {
                trigger: this.yeah,
                scrub: true,
                start: "top top",
            },
            top: "90%"
        })

        this.blockRAnime = gsap.to(this.blockR, {
            scrollTrigger: {
                trigger: this.yeah,
                scrub: true,
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
    }
}

export {
    Content
}