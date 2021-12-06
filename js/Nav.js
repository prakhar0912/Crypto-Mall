import gsap from "gsap"


class Nav {
    constructor(options) {
        this.navEle = document.querySelector(".nav")
        this.navContainer = this.navEle.parentElement
        this.navDisplayed = false
        this.startNavAnimation = gsap.timeline()
        this.startBurgerAnimation = gsap.timeline()
        this.startOpacityAnimation = gsap.timeline()

        this.endNavAnimation = gsap.timeline()
        this.endBurgerAnimation = gsap.timeline()
        this.endOpacityAnimation = gsap.timeline()

        this.centerEle = document.querySelector(".center")
        this.socialsEle = document.querySelector(".socials")
        this.lettersAnimations = []
        this.inTransition = false
        this.textWrappers = document.querySelectorAll('.text')
        this.lines = document.querySelectorAll('.line')
        this.options = options
        this.part = 0
        this.letters = []
        gsap.set(this.centerEle, {
            yPercent: -20,
            opacity: 0
        })
        gsap.set(this.socialsEle, {
            xPercent: -20,
            opacity: 0
        })
        this.addListeners()
        this.setLetters()
        this.direction = 0
        // this.delay = 1
    }

    updatePart(index) {
        this.part = index
        this.textWrappers.forEach((ele, i) => {
            if (i === this.part) {
                ele.classList.add("active")
            }
            else {
                ele.classList.remove("active")
            }
        })
    }

    showNav() {
        // this.killAnimation(false)
        this.startBurgerAnimation.to(this.lines[0], {
            top: 0,
            rotate: "45deg",
            duration: 0.1,
        })
        // this.startBurgerAnimation.to(this.lines[1], {
        //     opacity: "0",
        //     duration: 0.1,
        //     delay: -0.1
        // })
        this.startBurgerAnimation.to(this.lines[1], {
            top: "90%",
            rotate: "-45deg",
            duration: 0.1,
            delay: -0.1
        })

        this.startOpacityAnimation.to(this.centerEle, {
            yPercent: 0,
            opacity: 1,
            delay: 0.6
        })
        this.startOpacityAnimation.to(this.socialsEle, {
            xPercent: 0,
            opacity: 1,
        })

        this.startNavAnimation.to(this.navEle, {
            clipPath: "ellipse(200% 110% at 50% 0%)",
            duration: 0.6,
            onComplete: () => {
                this.navDisplayed = true
                this.navContainer.style.pointerEvents = "all"
            }
        })
    }

    hideNav() {
        // this.killAnimation(true)
        this.endBurgerAnimation.to(this.lines[0], {
            top: "40%",
            rotation: 0,
            duration: 0.1
        })
        // this.endBurgerAnimation.to(this.lines[1], {
        //     opacity: "1",
        //     duration: 0.1,
        //     delay: -0.1
        // })
        this.endBurgerAnimation.to(this.lines[1], {
            top: "80%",
            rotation: 0,
            duration: 0.1,
            delay: -0.1
        })

        this.endOpacityAnimation.to(this.socialsEle, {
            xPercent: -20,
            opacity: 0,
        })
        this.endOpacityAnimation.to(this.centerEle, {
            yPercent: -20,
            opacity: 0,
        })

        this.endNavAnimation.to(this.navEle, {
            clipPath: "ellipse(0% 0% at 50% 0%)",
            delay: this.delay,
            duration: 0.6,
            onComplete: () => {
                this.navDisplayed = false
                this.navContainer.style.pointerEvents = "none"
            }
        })
    }

    addListeners() {
        document.querySelector(".burger").addEventListener("click", () => {
            if (this.navDisplayed === false) {
                this.navDisplayed = true
                this.showNav()
            }
            else {
                this.navDisplayed = false
                this.hideNav()
            }
        })

        this.textWrappers.forEach((textWrapper, i) => {
            textWrapper.addEventListener('mouseenter', () => {
                this.lettersAnimation(i)
            })
            textWrapper.addEventListener('click', () => {
                if(this.part !== i){
                    if(this.part === 2 && i === 3){
                        console.log('arst')
                        this.hideNav()
                        this.options.scrollToContact()
                    }
                    else{
                        this.moveToSection(i)
                    }
                }
                else{
                    this.hideNav()
                }
            })
            // textWrapper.addEventListener('touchend', () => {
            //     this.moveToSection(i)
            // })
        })
    }

    moveToSection(index) {
        // this.textWrappers.forEach((ele, i) => {
        //     if (i === index) {
        //         ele.classList.add("active")
        //     }
        //     else {
        //         ele.classList.remove("active")
        //     }
        // })
        this.hideNav()
        if (this.part === 2) {
            this.options.onHidePart3()
        }
        if (index === 3) {
            this.part = index
            this.options.onSectionSelected(2, true)
        }
        else {
            this.part = index
            this.options.onSectionSelected(index)
        }
    }

    setLetters() {
        this.textWrappers.forEach(textWrapper => {
            textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>")
            this.letters.push([...textWrapper.querySelectorAll(".letter")])
        })
    }

    lettersAnimation(i) {
        if (this.direction % 2 === 0) {
            this.letters[i].forEach((el, i) => {
                gsap.fromTo(el, {
                    scale: 2,
                    opacity: 0,
                }, {
                    scale: 1,
                    opacity: 1,
                    translateZ: 0,
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: "power4.in"
                })
            })
            this.direction = 1
        }
        else {
            this.letters[i].reverse().forEach((el, i) => {
                gsap.fromTo(el, {
                    scale: 2,
                    opacity: 0,
                }, {
                    scale: 1,
                    opacity: 1,
                    translateZ: 0,
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: "power4.in"
                })
            })
            this.direction = 0
        }

    }
}

export { Nav };