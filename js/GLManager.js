import * as THREE from "three";
import {
  fragment,
  vertex
} from "./shaders";
import {
  fragment1,
  vertex1
} from "./shaders";
import {
  fragment2,
  vertex2
} from "./shaders";
import 'regenerator-runtime/runtime'
import Stats from "stats.js";

function GLManager(data, cursorRender, updatePre) {
  this.totalEntries = this.calculateTotalEntries(data);
  this.loadedEntries = 0;
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  camera.position.z = 16;
  this.cursorRender = cursorRender
  this.updatePre = updatePre
  this.meshes = []
  const scene = new THREE.Scene();
  camera.lookAt = scene.position;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  this.part = 0
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0.3)
  this.camera = camera;
  this.scene = scene;
  this.renderer = renderer;
  this.render = this.render.bind(this);
  this.loadTextures(data).then(textures => {
    this.textures = textures
    this.factors = this.loadFactors(data)
    this.currentIndex = 0;
    this.nextIndex = 0;
    this.textureProgress = 0;
    this.initialRender = false;
    this.time = 0;
    this.loopRaf = null;
    this.loop = this.loop.bind(this);

    this.createPlane(0, data[0][0].position)
    this.createPlane(1, data[1][0].position)
    // this.createPlane(2, data[2][0].position)
    this.calcAspectRatios()
    // this.setUpGui()
    if (!this.loopRaf) {
      this.render();
    }
  })
}

GLManager.prototype.setUpGui = function () {
  this.stats = Stats()
  this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(this.stats.dom);
}


GLManager.prototype.loadFactors = function (data) {
  let factorsMaster = []
  for (let i = 0; i < data.length; i++) {
    let factors = []
    for (let j = 0; j < data[i].length; j++) {
      factors.push(new THREE.Vector2(1, 1))
    }
    factorsMaster.push(factors)
  }
  return factorsMaster
}


GLManager.prototype.calcAspectRatios = function () {
  for (let i = 0; i < this.textures.length; i++) {
    for (let j = 0; j < this.textures[i].length; j++) {
      this.calculateAspectRatioFactor(i, j, this.textures[i][j])
    }
  }
}

GLManager.prototype.loadTextures = async function (data) {
  return new Promise(async (res, rej) => {
    let texturesMaster = []
    for (let i = 0; i < data.length; i++) {
      let textures = []
      for (let j = 0; j < data[i].length; j++) {
        textures.push(await this.loadTexture(data[i][j], i, j))
      }
      texturesMaster.push(textures)
    }
    res(texturesMaster)
  })
}

GLManager.prototype.loadTexture = function (data, i, j) {
  return new Promise(res => {
    new THREE.TextureLoader().load(data.image, (texture) => {
      if (this.initialRender) {
        this.loadedEntries++;
        this.updatePre(this.loadedEntries, this.totalEntries)
        this.calculateAspectRatioFactor.bind(this, i, j)
        if (this.loadedEntries === this.totalEntries) {
          document.body.classList.remove('loading');
          console.log('loaded all')
        }
        this.render();
        res(texture)
      }
    })
  })
}

GLManager.prototype.calculateTotalEntries = function (data) {
  let total = 0
  for (let i = 0; i < data.length; i++) {
    total += data[i].length
  }
  return total
}


GLManager.prototype.getViewSize = function () {
  const fovInRadians = (this.camera.fov * Math.PI) / 180;
  const viewSize = Math.abs(
    (this.camera.position.z - 10) * Math.tan(fovInRadians / 2) * 2
  );

  return viewSize;
};

GLManager.prototype.getPlaneSize = function () {
  const viewSize = this.getViewSize();
  return {
    width: viewSize * 1,
    height: viewSize
  };
};

GLManager.prototype.calculateAspectRatioFactor = function (index, j, texture) {
  const plane = this.getPlaneSize();
  const windowRatio = window.innerWidth / window.innerHeight;
  const rectRatio = (plane.width / plane.height) * windowRatio;
  const imageRatio = texture.image.width / texture.image.height;
  // console.log(imageRatio, rectRatio)

  let factorX = 1;
  let factorY = 1;
  if (rectRatio > imageRatio) {
    factorX = 1;
    factorY = (1 / rectRatio) * imageRatio;
  } else {
    factorX = (1 * rectRatio) / imageRatio;
    factorY = 1;
  }
  this.factors[index][j] = new THREE.Vector2(factorX, factorY);
  if (index === 1) {
    if (this.currentIndex === j) {
      this.meshes[1].material.uniforms.u_textureFactor.value = this.factors[1][j];
      this.meshes[1].material.uniforms.u_textureFactor.needsUpdate = true;
    }
    if (this.nextIndex === j) {
      this.meshes[1].material.uniforms.u_texture2Factor.value = this.factors[1][j];
      this.meshes[1].material.uniforms.u_texture2Factor.needsUpdate = true;
    }
  }
  else {
    if (this.meshes[index]) {
      this.meshes[index].material.uniforms.u_textureFactor.value = this.factors[index][j];
      this.meshes[index].material.uniforms.u_textureFactor.needsUpdate = true;
    }
  }
  if (this.initialRender) {
    this.loadedEntries++;
    if (this.loadedEntries === this.totalEntries) {
      document.body.classList.remove('loading');
      console.log('loaded all')
    }
    this.render();
  }
};
// Plane Stuff
GLManager.prototype.createPlane = function (index, pos) {
  // Calculate bas of Isoceles triangle(camera)
  if (index === 0) {
    const {
      width,
      height
    } = this.getPlaneSize();

    const segments = 60;
    const geometry = new THREE.PlaneBufferGeometry(
      width,
      height,
      segments,
      segments
    );

    const video = document.querySelector('#video1')
    video.play();
    const videoTexture = new THREE.VideoTexture(video)
    const material = new THREE.ShaderMaterial({
      // map: videoTexture,
      uniforms: {
        u_texture: {
          type: "t",
          value: videoTexture
        },
        u_textureFactor: {
          type: "f",
          value: this.factors[0][0]
        },
        u_offset: {
          type: "f",
          value: 8
        },
        u_progress: {
          type: "f",
          value: 0
        },
        u_direction: {
          type: "f",
          value: 1
        },
        u_effect: {
          type: "f",
          value: 0
        },
        u_time: {
          type: "f",
          value: this.time
        },
        u_waveIntensity: {
          type: "f",
          value: 0
        },
        u_resolution: {
          type: "v2",
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        },
        u_rgbPosition: {
          type: "v2",
          value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2)
        },
        u_rgbVelocity: {
          type: "v2",
          value: new THREE.Vector2(0, 0)
        },
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide
    });
    const mesh2 = new THREE.Mesh(geometry, material);
    mesh2.position.z = pos
    this.scene.add(mesh2);
    this.meshes.push(mesh2)
  }
  else if (index == 1) {
    const {
      width,
      height
    } = this.getPlaneSize();

    const segments = 60;
    const geometry = new THREE.PlaneBufferGeometry(
      width,
      height,
      segments,
      segments
    );
    const video = document.querySelector('#video2')
    // video.play();
    const videoTexture = new THREE.VideoTexture(video)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_texture: {
          type: "t",
          value: videoTexture
        },
        u_textureFactor: {
          type: "f",
          value: this.factors[1][this.currentIndex]
        },
        u_texture2: {
          type: "t",
          value: this.textures[1][this.nextIndex]
        },
        u_texture2Factor: {
          type: "f",
          value: this.factors[1][this.nextIndex]
        },
        u_textureProgress: {
          type: "f",
          value: this.textureProgress
        },
        u_offset: {
          type: "f",
          value: 8
        },
        u_progress: {
          type: "f",
          value: 0
        },
        u_direction: {
          type: "f",
          value: 1
        },
        u_effect: {
          type: "f",
          value: 0
        },
        u_time: {
          type: "f",
          value: this.time
        },
        u_waveIntensity: {
          type: "f",
          value: 0
        },
        u_resolution: {
          type: "v2",
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        },
        u_rgbPosition: {
          type: "v2",
          value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2)
        },
        u_rgbVelocity: {
          type: "v2",
          value: new THREE.Vector2(0, 0)
        }
      },
      vertexShader: vertex1,
      fragmentShader: fragment1,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = pos
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }
  else if (index === 2) {
    const {
      width,
      height
    } = this.getPlaneSize();

    const segments = 60;
    const geometry = new THREE.PlaneBufferGeometry(
      width,
      height,
      segments,
      segments
    );
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_texture: {
          type: "t",
          value: this.textures[2][0]
        },
        u_textureFactor: {
          type: "f",
          value: this.factors[2][0]
        },
        u_offset: {
          type: "f",
          value: 8
        },
        u_progress: {
          type: "f",
          value: 0
        },
        u_direction: {
          type: "f",
          value: 1
        },
        u_effect: {
          type: "f",
          value: 0
        },
        u_time: {
          type: "f",
          value: this.time
        },
        u_waveIntensity: {
          type: "f",
          value: 0
        },
        u_resolution: {
          type: "v2",
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        },
        u_rgbPosition: {
          type: "v2",
          value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2)
        },
        u_rgbVelocity: {
          type: "v2",
          value: new THREE.Vector2(0, 0)
        }
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      side: THREE.DoubleSide
    });
    const mesh3 = new THREE.Mesh(geometry, material);
    mesh3.position.z = pos
    this.scene.add(mesh3);
    this.meshes.push(mesh3)
  }
};

GLManager.prototype.updateCameraPosition = function (position) {
  if (position >= 4 && position <= 11) {
    this.camera.position.z = position
  }
}


GLManager.prototype.updateTexture = function (newIndex, progress) {
  let didChange = false;
  if (newIndex != null && this.newIndex !== this.currentIndex) {
    this.currentIndex = this.nextIndex;
    this.nextIndex = newIndex;
    this.textureProgress = 0;
    this.meshes[this.part].material.uniforms.u_textureProgress.value = 0;
    this.meshes[this.part].material.uniforms.u_texture.value = this.textures[1][this.currentIndex];
    this.meshes[this.part].material.uniforms.u_textureFactor.value = this.factors[1][this.currentIndex];
    this.meshes[this.part].material.uniforms.u_texture2.value = this.textures[1][newIndex];
    this.meshes[this.part].material.uniforms.u_texture2Factor.value = this.factors[1][newIndex];
    didChange = true;
  }
  if (progress != null && progress !== this.textureProgress) {
    this.meshes[this.part].material.uniforms.u_textureProgress.value = progress;
    this.textureProgress = progress;
    didChange = true;
  }

  if (!this.loopRaf && didChange) {
    this.render();
  }
};
GLManager.prototype.updateStickEffect = function ({ progress, direction, waveIntensity, part, inTransition }) {
  if (inTransition) {
    this.meshes[this.part].material.uniforms.u_waveIntensity.value = waveIntensity;
  }
  else {
    this.meshes[this.part].material.uniforms.u_progress.value = progress;
    this.meshes[this.part].material.uniforms.u_direction.value = direction;
    this.meshes[this.part].material.uniforms.u_waveIntensity.value = waveIntensity;
  }
};

GLManager.prototype.updateRgbEffect = function ({ position, velocity, part }) {
  if (this.meshes[this.part]) {
    this.meshes[this.part].material.uniforms.u_rgbPosition.value = new THREE.Vector2(position.x, position.y);
    this.meshes[this.part].material.uniforms.u_rgbVelocity.value = new THREE.Vector2(velocity.x, velocity.y);
    if (!this.loopRaf) {
      this.render();
    }
  }
};
// Other stuff
GLManager.prototype.render = function () {
  if (!this.initialRender) {
    this.initialRender = true;
  }
  this.cursorRender()
  this.renderer.render(this.scene, this.camera);
};
GLManager.prototype.mount = function (container) {
  this.renderer.domElement.style.height = "100%"
  this.renderer.domElement.style.width = "100%"
  container.appendChild(this.renderer.domElement);
};
GLManager.prototype.unmount = function () {
  this.mesh.material.dispose();
  this.mesh.geometry.dispose();
  this.initialMesh.material.dispose();
  this.initialMesh.geometry.dispose();
  this.initialMesh = null;
  this.mesh = null;
  this.renderer = null;
  this.camera = null;
  this.scene = null;
  this.container = null;
};
GLManager.prototype.onResize = function () {

  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.domElement.style.height = "100%"
  this.renderer.domElement.style.width = "100%"
  for (let i = 0; i < this.meshes.length; i++) {
    this.meshes[i].material.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  }
  for (var i = 0; i < this.textures.length; i++) {
    for (let j = 0; j < this.textures[i].length; j++) {
      if (this.textures[i][j].image) {
        this.calculateAspectRatioFactor(i, j, this.textures[i][j]);
      }
    }
  }
  this.render();
};
GLManager.prototype.scheduleLoop = function () {
  if (this.loopRaf) return;
  this.loop();
};

GLManager.prototype.loop = function () {
  // this.stats.begin()
  this.render();
  this.time += 0.1;
  for (let i = 0; i < this.meshes.length; i++) {
    this.meshes[i].material.uniforms.u_time.value = this.time;
  }
  // this.stats.end()
  this.loopRaf = requestAnimationFrame(this.loop);
};

GLManager.prototype.cancelLoop = function () {
  cancelAnimationFrame(this.loopRaf);
  this.loopRaf = null;
};

export {
  GLManager
};