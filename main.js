import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import gsap from "gsap";

// ✅ Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1, 5);

// ✅ Renderer
const canvas =
  document.querySelector("#canvas") || document.createElement("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement);

// ✅ Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// ✅ Environment Map
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader().load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/modern_buildings_night_1k.hdr",
  (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
  },
  undefined,
  (error) => console.error("Error loading HDR texture:", error)
);

// ✅ Load GLTF Model
let model, mixer;
const loader = new GLTFLoader();
loader.load(
  "./public/scene.gltf",
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, -0.8, 0);
    scene.add(model);

    // Setup Animation Mixer
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }
  },
  (progress) =>
    console.log(`Loading model: ${(progress.loaded / progress.total) * 100}%`),
  (error) => console.error("Error loading GLTF model:", error)
);

// ✅ Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ✅ Postprocessing Effects
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms["amount"].value = 0; // Adjust the intensity as needed
composer.addPass(rgbShiftPass);

// ✅ Smooth Mouse Interaction
let lastMoveTime = 0;
const moveInterval = 10;
window.addEventListener("mousemove", (e) => {
  const currentTime = performance.now();
  if (currentTime - lastMoveTime > moveInterval && model) {
    lastMoveTime = currentTime;
    const rotationX = (e.clientX / window.innerWidth - 0.5) * Math.PI * 0.1;
    const rotationY = (e.clientY / window.innerHeight - 0.5) * Math.PI * 0.1;
    gsap.to(model.rotation, {
      x: rotationY,
      y: rotationX,
      duration: 0.9,
      ease: "power2.out",
    });
  }
});

// ✅ Animation Loop
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.01); // Update animations
  composer.render();
}
animate();

setTimeout(() => {
  let loader = document.getElementById("loader");
  loader.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
  loader.style.transform = "translateX(100vw)"; // Move right to left
  loader.style.opacity = "0"; // Fade out
  loader.style.borderRadius = "999px";

  setTimeout(() => {
    loader.style.display = "none";
  }, 800);
}, 3000);
