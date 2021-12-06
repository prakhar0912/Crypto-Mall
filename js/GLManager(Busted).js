import * as THREE from "three";
import {
  fragment,
  vertex
} from "./shaders";
import 'regenerator-runtime/runtime'

function GLManager(data) {
  this.totalEntries = this.calculateTotalEntries(data)
  this.loadedEntries = 0;
  this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  this.camera.position.z = 10;
  this.meshes = [];
  // this.initialMesh = null;
  this.scene = new THREE.Scene();
  this.camera.lookAt = this.scene.position;

  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);

  this.part = 0

  this.render = this.render.bind(this);
  this.loadTextures(data).then((textures) => {
    this.textures = textures
    console.log(textures)
    this.factors = this.loadFactors(data)
    this.createPlanes(data)
    this.currentIndex = 0;
    this.nextIndex = 0;
    this.textureProgress = 0;
    this.initialTextureProgress = 0;
    this.initialRender = false;
    this.time = 0;
    this.loopRaf = null;
    this.loop = this.loop.bind(this);
    this.calcAspectRatios()
    if (!this.loopRaf) {
      this.render();
    }
  })
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
  console.log(factorsMaster)
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
        this.calculateAspectRatioFactor.bind(this, i, j);
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
  console.log(total)
  return total
}

GLManager.prototype.onPartChange = function (part) {
  this.part = part
}

GLManager.prototype.getViewSize = function () {
  const fovInRadians = (this.camera.fov * Math.PI) / 180;
  const viewSize = Math.abs(
    (this.camera.position.z - 5) * Math.tan(fovInRadians / 2) * 2
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
GLManager.prototype.calculateAspectRatioFactor = function (i, j, texture) {
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
  this.factors[i][j] = new THREE.Vector2(factorX, factorY);
  if (i === 1) {
    if (this.currentIndex === j) {
      this.meshes[i].material.uniforms.u_textureFactor.value = this.factors[i][j];
      this.meshes[i].material.uniforms.u_textureFactor.needsUpdate = true;
    }
    if (this.nextIndex === j) {
      this.meshes[i].material.uniforms.u_texture2Factor.value = this.factors[i][j];
      this.meshes[i].material.uniforms.u_texture2Factor.needsUpdate = true;
    }
  }
  else {
    this.meshes[i].material.uniforms.u_textureFactor.value = this.factors[i][j];
    this.meshes[i].material.uniforms.u_textureFactor.needsUpdate = true;
  }
};
// Plane Stuff
GLManager.prototype.createPlanes = function (data) {
  // Calculate bas of Isoceles triangle(camera)
  const viewSize = this.getViewSize();
  const {
    width,
    height
  } = this.getPlaneSize();

  const segments = 60;
  const geometrya = new THREE.PlaneGeometry(
    width,
    height,
    segments,
    segments
  );
  const materiala = new THREE.ShaderMaterial({
    uniforms: {
      u_texture: {
        type: "t",
        value: this.textures[0][0]
      },
      u_textureFactor: {
        type: "f",
        value: this.factors[0][0]
      },
      u_textureProgress: {
        type: "f",
        value: this.textureProgress
      },
      u_offset: {
        type: "f",
        value: 8
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
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide
  });
  const mesha = new THREE.Mesh(geometrya, materiala);
  mesha.position.z = 5
  this.scene.add(mesha);
  this.meshes.push(mesha);

  // const viewSize = this.getViewSize();
  // const {
  //   width,
  //   height
  // } = this.getPlaneSize();

  // const segments = 60;
  const geometry = new THREE.PlaneGeometry(
    width,
    height,
    segments,
    segments
  );
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_texture: {
        type: "t",
        value: this.textures[1][this.currentIndex]
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
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0
  this.scene.add(mesh);
  this.meshes.push(mesh);
  console.log(this.meshes[0].position.z, this.meshes[1].position.z)
};

GLManager.prototype.updateCameraPosition = function (position) {
  if (position >= 4 && position <= 11) {
    this.camera.position.z = position
  }
}


GLManager.prototype.updateTexture = function (newIndex, progress) {
  let didChange = false;
  console.log(this.part)
  if (newIndex != null && this.newIndex !== this.currentIndex) {
    this.currentIndex = this.nextIndex;
    this.nextIndex = newIndex;
    this.textureProgress = 0;
    this.meshes[this.part].material.uniforms.u_textureProgress.value = 0;
    this.meshes[this.part].material.uniforms.u_texture.value = this.textures[1][this.currentIndex];
    this.meshes[this.part].material.uniforms.u_textureFactor.value = this.factors[1][this.currentIndex];
    this.meshes[1].material.uniforms.u_texture2.value = this.textures[1][newIndex];
    this.meshes[1].material.uniforms.u_texture2Factor.value = this.factors[1][newIndex];
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

GLManager.prototype.updateStickEffect = function ({ progress, direction, waveIntensity, part }) {
  if (part === 0) {
    this.meshes[0].material.uniforms.u_waveIntensity.value = waveIntensity;
  }
  else if (part === 1) {
    // console.log('here')
    this.meshes[1].material.uniforms.u_progress.value = progress;
    this.meshes[1].material.uniforms.u_direction.value = direction;
    this.meshes[1].material.uniforms.u_waveIntensity.value = waveIntensity;
  }
};

GLManager.prototype.updateRgbEffect = function ({ position, velocity, part }) {
  this.meshes[this.part].material.uniforms.u_rgbPosition.value = new THREE.Vector2(position.x, position.y);
  this.meshes[this.part].material.uniforms.u_rgbVelocity.value = new THREE.Vector2(velocity.x, velocity.y);
  if (!this.loopRaf) {
    this.render();
  }
};
// Other stuff
GLManager.prototype.render = function () {
  if (!this.initialRender) {
    this.initialRender = true;
  }
  this.renderer.render(this.scene, this.camera);
};
GLManager.prototype.mount = function (container) {
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
  for (let i = 0; i < this.meshes.length; i++) {
    this.meshes[i].material.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  }
  // this.camera.aspect = window.inenrWidth / window.innerHeight;
  // this.camera.updateProjectionMatrix();
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

GLManager.prototype.updatePart = function (part) {
  this.part = part
};

GLManager.prototype.loop = function () {
  this.render();
  this.time += 0.1;
  // this.meshes.material.uniforms.u_time.value = this.time;
  for (let i = 0; i < this.meshes.length; i++) {
    this.meshes[i].material.uniforms.u_time.value = this.time;
  }
  this.loopRaf = requestAnimationFrame(this.loop);
};

GLManager.prototype.cancelLoop = function () {
  cancelAnimationFrame(this.loopRaf);
  this.loopRaf = null;
};

export {
  GLManager
};