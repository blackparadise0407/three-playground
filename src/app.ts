import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { ModelLoader } from "./model-loader";
import { ModelController } from "./model-controller";

export class App {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private plane!: THREE.Mesh;
  private cameraOrbitControls!: OrbitControls;
  private directLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;
  private modelController?: ModelController;

  constructor() {
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    this.initCameraOrbitControl();
    const modelLoader = ModelLoader.getInstance();
    modelLoader.load("/race-car.fbx", "/race-car.png").then((model) => {
      model.scale.setScalar(0.001);
      model.position.y = 0.4;
      this.scene.add(model);
      this.modelController = new ModelController(
        model,
        this.camera,
        this.cameraOrbitControls
      );
      this.modelController.enableDevTool();
    });

    document.body.appendChild(this.renderer.domElement);

    this.initPlane();

    this.initAmbientLight();
    this.initDirectLight();

    if (!import.meta.env.PROD) {
      this.initGUI();
      this.initHelpers();
    }

    this.handleResize();
  }

  public run(): void {
    const clock = new THREE.Clock();
    const animate = () => {
      if (this.modelController) {
        this.modelController.update(clock.getDelta());
      }
      requestAnimationFrame(animate);
      this.cameraOrbitControls.update();
      this.render();
    };
    animate();
  }

  private createScene() {
    return new THREE.Scene();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private createCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(2, 0.7, 1.1);
    camera.lookAt(this.scene.position);
    return camera;
  }

  private createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
  }

  private initCameraOrbitControl() {
    this.cameraOrbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.cameraOrbitControls.update();
  }

  private initPlane() {
    const geometry = new THREE.PlaneGeometry(100, 100, 10, 10);
    const material = new THREE.MeshStandardMaterial({
      color: 0x876853,
      side: THREE.DoubleSide,
    });
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.receiveShadow = true;
    this.plane.rotation.x = degToRad(90);
    this.scene.add(this.plane);
  }

  private initGUI() {
    const gui = new GUI();
    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.add(this.camera.position, "x", 0, 10);
    cameraFolder.add(this.camera.position, "y", 0, 10);
    cameraFolder.add(this.camera.position, "z", 0, 10);
    cameraFolder.open();

    const ambientLightFolder = gui.addFolder("Ambient light");
    ambientLightFolder.add(this.ambientLight, "visible");
    ambientLightFolder.add(this.ambientLight, "intensity", 0, 10);
    const ambientLightParams = {
      color: this.ambientLight.color.getHex(),
    };
    ambientLightFolder
      .addColor(ambientLightParams, "color")
      .onChange((v) => this.ambientLight.color.set(v));
    ambientLightFolder.open();

    const directLightParams = {
      color: this.directLight.color.getHex(),
    };
    const dLightFolder = gui.addFolder("Direct light");
    dLightFolder.add(this.directLight, "visible");
    dLightFolder.add(this.directLight, "intensity", 0, 10);
    dLightFolder
      .addColor(directLightParams, "color")
      .onChange((v) => this.directLight.color.set(v));
    dLightFolder.open();
  }

  private initHelpers() {
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    const directLightHelper = new THREE.DirectionalLightHelper(
      this.directLight
    );
    this.scene.add(directLightHelper);
  }

  private initDirectLight() {
    this.directLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directLight.castShadow = true;
    this.directLight.position.set(0, 1, 0);
    this.directLight.target = this.plane;
    this.scene.add(this.directLight);
  }

  private initAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(this.ambientLight);
  }

  private handleResize() {
    window.addEventListener("resize", () => {
      this.onResize();
      this.render();
    });
  }

  private onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
