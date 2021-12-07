import {
  GLManager
} from "./GLManager";
import {
  spring,
  parallel,
} from "popmotion";
// import {
//   Grab
// } from "./Grab";
import {
  reach
} from "./reach";

import gsap from "gsap";

// onFullscreenStart
// onFullscreenFinish
// onZoomOutStart
// onZoomOutFinish
// onAciveIndexChange
// onIndexChange
function Showcase(data, options = {}) {
  this.GL = new GLManager(data, options.cursorRender, options.updatePre);

  this.data = data;

  this.progress = 0;
  this.initialProgress = 10
  this.initialDirection = 5
  this.direction = 1;
  this.waveIntensity = 0;
  this.inTab = false
  this.inTransition = false
  this.part = 0


  this.options = options;

  this.index = {
    target: 0,
    current: 0,
    initial: 0,
    scrollSize: window.innerHeight / 6,
    active: 0
  };

  this.follower = {
    x: 0,
    y: 0
  };

  this.followerSpring = null;

  this.slidesSpring = null;

  this.waveIntensityRange = [0, 0.4]

  // this.slides = new Slides(data);
  // this.grab = new Grab({
  //   onGrabStart: this.onGrabStart.bind(this),
  //   onGrabMove: this.onGrabMove.bind(this),
  //   onGrabEnd: this.onGrabEnd.bind(this)
  // });

}

Showcase.prototype.applyEvents = function () {
  // this.grab.addListeners()
}

Showcase.prototype.removeEvents = function () {
  // this.grab.removeListeners()
}


Showcase.prototype.calculateTotalEntries = function (data) {
  let total = 0
  for (let i = 0; i < data.length; i++) {
    total += data[i].length
  }
  console.log(total)
  return total
}


Showcase.prototype.mount = function (container) {
  this.GL.mount(container);
};
Showcase.prototype.render = function () {
  this.GL.render();
};

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

Showcase.prototype.alterPlane0 = function () {
  this.GL.stopEffects = true
  this.GL.alterPlane0()
  this.startMoveToSection(0,1,5)
}

Showcase.prototype.onMouseMove = function (ev) {
  if (this.followerSpring) {
    this.followerSpring.stop();
    this.followerSpring = null;
  }

  this.followerSpring = reach({
    from: {
      x: this.follower.x,
      y: this.follower.y
    },
    to: {
      x: ev.clientX,
      y: ev.clientY
    },
    velocity: {
      x: this.follower.vx,
      y: this.follower.vy
    },
    stiffness: 500,
    damping: 50,
    mass: 1
  }).start({
    update: position => {
      const velocity = {
        x: position.x - this.follower.x,
        y: position.y - this.follower.y
      };
      this.GL.updateRgbEffect({
        position,
        velocity,
        part: this.part
      });
      this.follower = {
        x: position.x,
        y: position.y,
        vx: velocity.x,
        vy: velocity.y
      };
    },
    complete: () => {
      this.GL.updateRgbEffect({
        position: this.follower,
        velocity: {
          x: 0,
          y: 0
        },
        part: this.part
      });
      this.follower.vx = 0;
      this.follower.vy = 0;
    }
  });
};

Showcase.prototype.onGrabMove = function (scroll) {
  return
};


Showcase.prototype.titleClickStart = function () {
  if (this.part === 1) {
    if (this.options.onZoomOutStart) {
      this.options.onClickStart({
        activeIndex: this.index.active
      });
    }
    // this.slides.appear();
    this.index.initial = this.index.current;

    if (this.GLStickPop) {
      this.GLStickPop.stop();
    }
    this.GL.scheduleLoop();

    // const directionSpring = spring({
    //   from: this.progress === 0 ? 0 : this.direction,
    //   to: 0,
    //   mass: 1,
    //   stiffness: 800,
    //   damping: 2000
    // });
    // const progressSpring = spring({
    //   from: this.progress,
    //   to: 1,
    //   mass: 5,
    //   stiffness: 350,
    //   damping: 500
    // });

    const waveIntensitySpring = spring({
      from: this.waveIntensity,
      to: this.waveIntensityRange[1] - 0.33,
      mass: 5,
      stiffness: 10,
      damping: 200
    });
    this.GLStickPop = parallel(
      waveIntensitySpring
    ).start({
      update: values => {
        if (this.progress !== values[0]) { }
        this.waveIntensity = values[0];

        this.GL.updateStickEffect({
          progress: this.progress,
          direction: this.direction,
          waveIntensity: this.waveIntensity,
          part: this.part
        });
      },
      complete: () => {
        setTimeout(() => {
          this.titleClickEnd()
        }, 2000)
      }
    });
  }
};

Showcase.prototype.setStickEffect = function () {
  this.waveIntensity = 0
  this.progress = 0
  this.direction = 0
  this.GL.updateStickEffect({
    progress: this.progress,
    direction: this.direction,
    waveIntensity: this.waveIntensity,
    part: this.part,
    inTransition: this.inTransition
  });
}

Showcase.prototype.onPart1 = function () {
  this.zoom.to(this.GL.camera.position, {
    z: this.GL.camera.position.z + 1, duration: 0.5, ease: "power4.in",
  })
  // this.options.showPart2()
  // if (this.GLStickPop) {
  //   this.GLStickPop.stop();
  // }
  // this.GL.scheduleLoop();
  // const startWaveIntensitySpring = spring({
  //   from: this.waveIntensity,
  //   to: this.waveIntensityRange[1]-0.2,
  //   mass: 5,
  //   stiffness: 10,
  //   damping: 200
  // });
  // this.GLStickPop = parallel(
  //   startWaveIntensitySpring
  // ).start({
  //   update: values => {
  //     this.waveIntensity = values[0];
  //     this.GL.updateStickEffect({
  //       waveIntensity: this.waveIntensity,
  //       part: this.part,
  //       inTransition: true
  //     });
  //   },
  // });
}



Showcase.prototype.startMoveToSection = function (from, to, delay = 0) {
  if (to < 0 || to > this.data.length - 1 || from === to) {
    console.log(from, to)
    return
  }
  if (to > from) {
    if (this.zoom) {
      this.zoom.kill();
    }

    this.zoom = gsap.timeline({delay: delay})
    this.zoom.to(this.GL.camera.position, {
      z: this.GL.camera.position.z, duration: 1, ease: "power4.in", onStart: () => {
        this.setStickEffect()
        this.GL.scheduleLoop();
        this.options.startTransitionPage(from, to)
      }
    })
    this.zoom.to(this.GL.camera.position, {
      z: this.data[to][0].position + 6, duration: 1.2, ease: "power4.in", onComplete: () => {
        console.log('start complete', from, to)
        this.setStickEffect()
        this.part = to
        this.GL.part = to
        this.options.updatePart(to, this.index.active)
        this.inTransition = false
        if (to == 0) {
          this.options.endPart1()
        }
        if (to === 1) {
          this.GL.stopEffects = false
          this.options.onPart1()
          this.onPart1()
        }
      }
    })



    if (this.GLStickPop) {
      this.GLStickPop.stop();
    }
    this.GL.scheduleLoop();
    const startWaveIntensitySpring = spring({
      from: this.waveIntensity,
      to: this.waveIntensityRange[1],
      mass: 5,
      stiffness: 10,
      damping: 200
    });
    this.GLStickPop = parallel(
      startWaveIntensitySpring
    ).start({
      update: values => {
        this.waveIntensity = values[0];
        if (this.inTransition)
          this.GL.updateStickEffect({
            waveIntensity: this.waveIntensity,
            part: this.part,
            inTransition: this.inTransition
          });
      },
    });
  }
  else {
    if (this.zoom) {
      this.zoom.kill();
    }
    this.setStickEffect()
    this.GL.scheduleLoop();
    this.options.startTransitionPage(from, to)
    this.zoom = gsap.timeline()
    this.zoom.to(this.GL.camera.position, {
      z: this.GL.camera.position.z - 2, duration: 1, ease: "power4.in",
    })
    this.zoom.to(this.GL.camera.position, {
      z: this.data[to][0].position + 6, duration: 1.2, ease: "power4.in", onComplete: () => {
        console.log('start complete', from, to)
        this.setStickEffect()
        this.options.updatePart(to, this.index.active)
        this.part = to
        this.GL.part = to
        this.inTransition = false
        if (to == 0) {
          this.options.endPart1()
        }
        if (to === 1) {
          this.options.onPart1()
        }

      }
    })
    this.onPart1()

    if (this.GLStickPop) {
      this.GLStickPop.stop();
    }
    // this.GL.scheduleLoop();
    const waveIntensitySpring = spring({
      from: this.waveIntensity,
      to: this.waveIntensityRange[1],
      mass: 5,
      stiffness: 10,
      damping: 200
    });
    this.GLStickPop = parallel(
      waveIntensitySpring
    ).start({
      update: values => {
        this.waveIntensity = values[0];
        if (this.inTransition)
          this.GL.updateStickEffect({
            waveIntensity: this.waveIntensity,
            part: this.part,
            inTransition: this.inTransition
          });
      },
    });
  }
}

Showcase.prototype.endMoveToSection = function (from, to) {
  if (to < 0 || to > this.data.length - 1 || from === to) {
    return
  }
  if (this.zoom) {
    console.log('stop ', from, to)
    this.zoom.kill();
  }
  this.options.endTransitionPage(from, to)
  this.GL.scheduleLoop();
  this.zoom = gsap.timeline()
  this.zoom.to(this.GL.camera.position, {
    z: this.data[from][0].position + 6, duration: 0.3, ease: "power2.in", onComplete: () => {
      console.log('end complete')
      this.inTransition = false
      this.GL.part = from
      this.part = from
      if (from == 1) {
        this.onPart1()
        this.options.onPart1()
      }
    }
  })
  if (this.GLStickPop) {
    this.GLStickPop.stop();
  }
  const waveIntensitySpring = spring({
    from: this.waveIntensity,
    to: this.waveIntensityRange[0],
    mass: 0.1,
    stiffness: 800,
    damping: 50
  });
  this.GLStickPop = parallel(
    waveIntensitySpring
  ).start({
    update: values => {
      this.waveIntensity = values[0];
      if (this.inTransition) {
        this.GL.updateStickEffect({
          waveIntensity: this.waveIntensity,
          part: this.part,
          inTransition: this.inTransition
        });
      }
    },
  });
}



Showcase.prototype.onGrabStart = function () {
  this.options.blowUp()
  if (this.part === 0) {
    this.inTransition = true
    this.startMoveToSection(0, 1)
  }
  else if (this.part === 1) {
    if (this.inTransition) {
      return
    }
    this.inTransition = true
    this.startMoveToSection(1, 0)
  }
};

Showcase.prototype.onGrabEnd = function () {
  this.options.blowDown()
  if (this.part === 0) {
    this.inTransition = true
    this.endMoveToSection(0, 1)
  }
  else if (this.part === 1) {
    this.inTransition = true
    this.endMoveToSection(1, 0)
  }
};



Showcase.prototype.snapCurrentToActiveIndex = function () {
  if (this.part === 1) {
    if (this.slidesPop) {
      this.slidesPop.stop();
    }
    this.slidesPop = reach({
      from: {
        index: this.index.current
      },
      to: {
        index: Math.round(this.index.target)
      },
      restDelta: 0.001
    }).start({
      complete: () => { },
      update: val => {
        // this.slides.onMove(val);
        if (this.options.onIndexChange) {
          this.options.onIndexChange(val.index);
        }
        this.index.current = val.index;
      }
    });
  }
};

Showcase.prototype.titleClickEnd = function () {
  // this.slides.disperse(this.index.active);
  if (this.part === 1) {
    // this.snapCurrentToActiveIndex();

    if (this.GLStickPop) {
      this.GLStickPop.stop();
    }
    // const directionSpring = spring({
    //   from: this.progress === 1 ? 1 : this.direction,
    //   to: 1,
    //   mass: 1,
    //   stiffness: 800,
    //   damping: 2000
    // });
    // const progressSpring = spring({
    //   from: this.progress,
    //   to: 0,
    //   mass: 4,
    //   stiffness: 400,
    //   damping: 70,
    //   restDelta: 0.0001
    // });
    const waveIntensitySpring = spring({
      from: this.waveIntensity,
      to: this.waveIntensityRange[0],
      mass: 0.1,
      stiffness: 800,
      damping: 50
    });

    this.GLStickPop = parallel(
      // progressSpring,
      // directionSpring,
      waveIntensitySpring
    ).start({
      update: values => {
        // this.progress = values[0];
        // this.direction = values[1];
        this.waveIntensity = values[0];
        this.GL.updateStickEffect({
          progress: this.progress,
          direction: this.direction,
          waveIntensity: this.waveIntensity,
          part: this.part
        });
      },
      complete: () => {
        // if (this.options.onClickEnd) {
        //   this.options.onClickEnd({
        //     activeIndex: this.index.active
        //   });
        // }
        // this.GL.cancelLoop();
      }
    });
  }
};

Showcase.prototype.onResize = function () {
  this.GL.onResize();
};
export {
  Showcase
};