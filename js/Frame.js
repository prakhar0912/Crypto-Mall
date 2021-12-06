import gsap from "gsap"


class Frame {
    constructor(options, mobileDevice, numProjs) {
        this.options = options
        if (!mobileDevice) {
            // this.sectionContainer = document.querySelector('.current-section')
            // this.sections = this.sectionContainer.querySelectorAll('p')
            // this.nonActiveSections = this.sectionContainer.querySelectorAll('p:not(.active-section)')
            this.part = 0
            this.sectionShown = true
            this.pauseSectionActivity = false
            this.mobile = false
            // this.addSectionListeners()
        }
        else {
            // this.addNextPrevListeners()
            this.mobile = true
        }
        this.logo = document.querySelector('.main-logo')
        this.hintDiv = document.querySelector('.hint')
        this.hintContainer = this.hintDiv.querySelector('p')
        this.hintLine = this.hintDiv.querySelector('.lin')
        this.rotContainer = document.querySelector(".rot")
        this.projContainer = document.querySelector(".proj")
        this.lineTop = this.projContainer.querySelector(".on")
        this.lineBottom = this.projContainer.querySelector(".tw")
        this.checkScrollContainer = null
        this.projP = this.projContainer.querySelector("p")
        this.scrollContainer = document.querySelector('.scroll')
        this.scrollLine = this.scrollContainer.querySelector('.scroll-line')
        this.numProjs = numProjs
        this.addRotListeners()
        this.blowHint()
        this.logo.addEventListener('click', () => {
            this.options.moveToSection(0)
        })
    }


    addRotListeners() {
        this.rotAnime = gsap.to(this.rotContainer, { rotation: 360, repeat: -1, duration: 9, ease: "linear" })
        this.rotContainer.addEventListener('mouseover', () => {
            this.rotAnime.pause()
        })
        this.rotContainer.addEventListener('mouseleave', () => {
            this.rotAnime.play()
        })
    }

    hideNextPrev() {
        gsap.to(".mov", {
            opacity: 0, pointerEvents: 'none'
        })
    }

    showNextPrev() {
        gsap.to(".mov", {
            opacity: 1, pointerEvents: 'all'
        })

    }

    hideHint() {
        gsap.to(this.hintContainer, {
            opacity: 0, pointerEvents: 'none'
        })
    }

    showHint() {
        gsap.to(this.hintContainer, {
            opacity: 1, pointerEvents: 'all'
        })
    }

    hideLogo() {
        gsap.to(this.logo, { opacity: 0 })
    }

    showLogo() {
        gsap.to(this.logo, { opacity: 1 })
    }

    addSectionListeners() {
        this.sectionContainer.addEventListener('mouseenter', () => {
            this.showSection()
        })
        this.sectionContainer.addEventListener('mouseleave', () => {
            this.hideSection()
        })
        this.sections.forEach((ele, i) => {
            ele.addEventListener('click', () => {
                this.pauseSectionActivity = true
                if (i === 3) {
                    this.options.moveToSection(2)
                }
                else {
                    this.options.moveToSection(i)
                }
            })
        })
    }


    addNextPrevListeners() {
        // document.querySelector("button.nextbtn").addEventListener("mousedown", () => {
        //     this.options.nextSection('down', false)
        // })

        document.querySelector("button.nextbtn").addEventListener("touchstart", () => {
            this.options.nextSection('down', true)
        })

        // document.querySelector("button.nextbtn").addEventListener("mouseup", () => {
        //     this.options.nextSection('up', false)
        // })

        document.querySelector("button.nextbtn").addEventListener("touchend", () => {
            this.options.nextSection('up', true)
        })

        // document.querySelector("button.prevbtn").addEventListener("mousedown", () => {
        //     this.options.prevSection('down', false)
        // })

        document.querySelector("button.prevbtn").addEventListener("touchstart", () => {
            this.options.prevSection('down', true)
        })


        // document.querySelector("button.prevbtn").addEventListener("mouseup", () => {
        //     this.options.prevSection('up', false)
        // })

        document.querySelector("button.prevbtn").addEventListener("touchend", () => {
            this.options.prevSection('up', true)
        })
    }

    updateProj(index) {
        if (this.part === 1) {
            gsap.to(this.lineTop, {
                height: `${10 + ((80 / this.numProjs) * (-index))}%`
            })
            gsap.to(this.lineBottom, {
                height: `calc(${10 + ((80 / this.numProjs) * (this.numProjs + index))}% - 2rem)`
            })
            this.projP.innerHTML = (Math.round(-index)+1) + "/" + this.numProjs
        }
    }

    showProj() {
        gsap.to(this.projContainer, {
            opacity: 1
        })
    }

    hideProj() {
        gsap.to(this.projContainer, {
            opacity: 0
        })
    }

    updatePart(index) {
        this.part = index
        if (!this.mobile) {
            this.paintSection()
        }
        this.updateHint()
        // this.updateLogo()
        // if (this.part === 1) {
        //     this.showProj()
        // }
        // else {
        //     this.hideProj()
        // }
    }

    updateLogo() {
        if (this.logoAnime) {
            this.logoAnime.kill()
        }
        if (this.part == 0) {
            this.logoAnime = gsap.timeline()
            this.logoAnime.to(this.logo, { opacity: 0, duration: 0.4 })
            this.logoAnime.set(this.logo, {
                width: "100px",
                top: "-29px",
                left: "50%",
                xPercent: -50,
                rotate: -30,
            })
            this.logoAnime.to(this.logo, { opacity: 1, duration: 0.3 })
        }
        else if (this.part == 1 || this.part == 2) {
            this.logoAnime = gsap.timeline()
            this.logoAnime.to(this.logo, { opacity: 0, duration: 0.4 })
            this.logoAnime.set(this.logo, {
                top: this.mobile ? "5px" : "7px",
                left: this.mobile ? "5px" : "20px",
                width: "70px",
                xPercent: 0,
                rotate: 0,
            })
            this.logoAnime.to(this.logo, { opacity: 1, duration: 0.3 })
        }
    }

    killBlow() {
        if (this.blowAnime) {
            this.blowAnime.kill()
            console.log('yeah')
            gsap.to(this.hintLine, {
                width: "100%",
                opacity: 0.6,
                duration: 0.3
            })
        }
    }

    blowHint() {
        this.killBlow()
        console.log('noienon')
        this.blowAnime = gsap.timeline({ repeat: 6 })
        this.blowAnime.to(this.hintLine, {
            width: "100%",
            duration: 0.3
        })
        this.blowAnime.to(this.hintLine, {
            width: "20%",
            duration: 1
        })
        this.blowAnime.to(this.hintLine, {
            width: "100%",
            duration: 0.3
        })
    }

    updateHint() {
        let hint = ''
        if (this.part === 0) {
            hint = `CLICK &amp; HOLD`
        }
        else if (this.part === 1) {
            if(this.mobile){
                hint = 'SCROLL'
            }
            else{
                hint = ''
            }
        }
        else if (this.part === 2) {
            hint = 'SCROLL'
        }
        // alert('arst')
        this.hintContainer.innerHTML = hint
        this.blowHint()
    }


    showSection(nextFunc) {
        // console.log(this.sectionShown, this.pauseSectionActivity)
        if (this.sectionShown && !nextFunc || this.pauseSectionActivity) {
            return
        }
        if (this.sectionAnim) {
            this.sectionAnim.kill()
        }
        this.sectionAnime = gsap.to(this.sections, {
            opacity: 1, duration: 0.3, width: '100%', marginRight: '25px', onComplete: () => {
                this.sectionShown = true
                console.log(nextFunc)
                if (nextFunc) {
                    this.hideSection()
                }
            }
        })
    }


    hideSection() {
        if (!this.sectionShown || this.pauseSectionActivity) {
            return
        }
        if (this.sectionAnim) {
            this.sectionAnim.kill()
        }
        this.sectionAnime = gsap.to(this.nonActiveSections, {
            opacity: 0, duration: 0.3, width: 0, marginRight: 0, onComplete: () => {
                this.sectionShown = false
            }
        })
    }

    paintSection() {
        return
        this.sections.forEach((ele, i) => {
            if (i === this.part) {
                ele.classList.add("active-section")
            }
            else {
                ele.classList.remove("active-section")
            }
            if (i === this.sections.length - 1) {
                this.nonActiveSections = this.sectionContainer.querySelectorAll('p:not(.active-section)')
                this.pauseSectionActivity = false
                console.log('here')
                this.showSection(true)
            }
        })
    }

    updateScroll(e){
        if(this.scrollAnime){
            this.scrollAnime.kill()
        }
        this.scrollAnime = gsap.to(this.scrollLine, {
            height: (this.checkScrollContainer.scrollTop+this.docHeight)*100/this.checkScroll.offsetHeight + "%",
            duration: 0.4
        })
    }

    onResize(){
        this.docHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight);
    }

    showScroll(){
        this.docHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight);
        this.checkScrollContainer = document.querySelector('.master-slide-container:nth-of-type(3) > .slide')
        this.checkScroll = this.checkScrollContainer.querySelector('div > .slide-desc')
        this.updateScroll()
        this.checkScrollContainer.addEventListener('scroll', this.updateScroll.bind(this))
        gsap.to(this.scrollContainer, {
            opacity: 1, duration: 0.8
        })
    }

    hideScroll(){
        this.checkScrollContainer.removeEventListener('scroll', this.updateScroll)
        gsap.to(this.scrollContainer, {
            opacity: 0, duration: 0.8
        })
    }


}

export { Frame }