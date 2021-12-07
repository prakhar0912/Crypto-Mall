import gsap from "gsap"


const createEleWithClass = (tag, className) => {
  const ele = document.createElement(tag);
  ele.className = className;
  return ele;
};

class Slides {
  constructor(data, options = {}) {
    this.data = data;
    this.container = createEleWithClass("div", "slides");
    this.currentIdx = 0;
    this.part = 0
    this.masterSlides = []
    this.slides = this.createSlides()
    this.options = options
    this.tl = null;
  }

  createSlides() {
    let slides = []
    for (let i = 0; i < this.data.length; i++) {
      let Mastercontainer = createEleWithClass("div", "master-slide-container hide")
      if (i == 0) {
        Mastercontainer = createEleWithClass("div", "master-slide-container current")
      }
      let innerSlides = []
      for (let j = 0; j < this.data[i].length; j++) {

        const slide = createEleWithClass("div", "slide");
        slide.classList.add(j !== 0 && i === 1 ? "next" : "show-meta");
        slide.innerHTML = this.data[i][j].content
        Mastercontainer.appendChild(slide);
        innerSlides.push(slide)
      }
      this.masterSlides.push(Mastercontainer)
      slides.push(innerSlides)
      this.container.appendChild(Mastercontainer)
    }
    return slides
  }

  updatePart(part) {
    this.part = part
  }

  mount(container) {
    container.appendChild(this.container);
    this.addClickEvents()
  }

  addClickEvents(){
    this.exploreBtn = document.querySelector('.explore')
    this.exploreBtn.addEventListener('click', () => {
      gsap.to(this.exploreBtn, {
        opacity: 0, duration: 1.5
      })
      this.options.alterPlane0()
    })
  }

  startTransitionParts(from, to) {
    if (this.tl) {
      this.tl.kill()
    }
    this.tl = gsap.timeline()
    this.tl.to(this.masterSlides[from], {
      opacity: 0, duration: 2.3, onComplete: () => {
        this.masterSlides[from].classList.remove('current')
        this.masterSlides[from].classList.add('hide')
        this.masterSlides[to].classList.remove('hide')
      }
    })
    this.tl.to(this.masterSlides[to], {
      opacity: 1, duration: 0.7, delay: -0.1, onComplete: () => {
        this.masterSlides[to].classList.add('current')
        this.part = to
        if(to == 0){
          gsap.to(this.exploreBtn, {
            opacity: 1, duration: 0.5
          })
        }
      }
    })
  }

  endTransitionParts(from, to) {
    if (this.tl) {
      console.log('kill')
      this.tl.kill()
    }
    this.tl = gsap.timeline()
    this.tl.to(this.masterSlides[to], {
      opacity: 0, duration: 0.7, onComplete: () => {
        this.masterSlides[to].classList.remove('current')
      }
    })
    this.tl.to(this.masterSlides[from], {
      opacity: 1, duration: 0.7, delay: -0.1, onComplete: () => {
        this.masterSlides[from].classList.add('current')
        this.part = from
      }
    })

  }

  scrollToContact(){
    let obj = document.querySelector('.master-slide-container:nth-of-type(3) > .slide')
    gsap.to(obj, {
      scrollTop: obj.scrollHeight
    })
  }
}

export {
  Slides
};