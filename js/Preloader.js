import gsap from "gsap"

class Preloader {
    constructor(options) {
        this.options = options
        this.preloaderContainer = document.querySelector('.preloader')
        this.imgs = this.preloaderContainer.querySelector('div')
        this.line = this.preloaderContainer.querySelector('.loader-line')
        this.videos = document.querySelectorAll('video')
        this.loaded = 0
        this.total = this.videos.length
        this.finalLoaded =
            this.addListeners()
        this.showPreloader()
    }

    addListeners() {
        this.videos.forEach(ele => {
            ele.addEventListener('canplay', (event) => {
                console.log(event)

                if (this.loaded <= 3) {
                    this.loaded++
                    this.updatea()
                }
            });
            setTimeout(() => {
                this.loaded = 3
                this.updatea()
            }, 9000)
        })
    }

    showPreloader() {
        gsap.to(this.preloaderContainer, {
            opacity: 1, duration: 0.8
        })
    }

    removePreloader() {
        let tl = gsap.timeline()
        tl.to(this.imgs, {
            opacity: 0, scale: 0.4
        })
        tl.to(this.preloaderContainer, {
            opacity: 0, duration: 0.8, delay: 0.6, onComplete: () => {
                gsap.set(this.preloaderContainer, {
                    pointerEvents: 'none',
                    display: 'none'
                })
            }
        })
    }

    updatea() {
        if (this.loaderAnime) {
            this.loaderAnime.kill()
        }



        this.loaderAnime = gsap.to(this.line, {
            width: `${this.loaded * 100 / this.total}%`, duration: 1.5, ease: 'Power4.out', onComplete: () => {
                if (this.loaded >= this.total) {
                    console.log('done')
                    this.removePreloader()
                    this.options.loaded()
                }
            }
        })
    }

}

export { Preloader }