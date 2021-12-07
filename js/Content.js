import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

class Content{
    constructor(){
        gsap.registerPlugin(ScrollTrigger)
        console.log('arst')
        this.astroL = document.querySelector('.intro > .left > img')
        this.astroR = document.querySelector('.intro > .right > img')
        // this.start()
    }

    start(){
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
    }
}

export {
    Content
}