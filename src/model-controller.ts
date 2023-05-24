import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export interface KeyMapping {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

export class ModelController {
  public keyMapping: KeyMapping = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  };
  private model: THREE.Group;
  private camera: THREE.Camera;
  private orbitControl: OrbitControls;

  private rotateAngle = new THREE.Vector3(0, 1, 0);
  private rotateQuaternion = new THREE.Quaternion();
  private cameraTarget = new THREE.Vector3();
  private direction = new THREE.Vector3();

  constructor(
    model: THREE.Group,
    camera: THREE.Camera,
    orbitControl: OrbitControls
  ) {
    this.model = model;
    this.camera = camera;
    this.orbitControl = orbitControl;
    document.addEventListener("keydown", (e) => {
      this.toggleKey(e.key, true);
    });
    document.addEventListener("keyup", (e) => {
      this.toggleKey(e.key, false);
    });
    this.updateCameraTarget(0, 0);
  }

  public enableDevTool() {
    document
      .getElementsByClassName("keyboard-overlay")[0]
      .classList.add("show");
  }

  public update(delta: number) {
    if (
      Object.entries(this.keyMapping).some(
        ([key, val]) => val && key !== "sprint"
      )
    ) {
      const angleYCameraDirection = Math.atan2(
        this.model.position.x - this.camera.position.x,
        this.model.position.z - this.camera.position.z
      );

      const directionOffset = this.directionOffset();

      this.rotateQuaternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.1);

      this.camera.getWorldDirection(this.direction);
      this.direction.y = 0;
      this.direction.normalize();
      this.direction.applyAxisAngle(this.rotateAngle, directionOffset);

      const moveX = this.direction.x * 3 * delta;
      const moveZ = this.direction.z * 3 * delta;
      this.model.position.x += moveX;
      this.model.position.z += moveZ;
      this.updateCameraTarget(moveX, moveZ);
    }
  }

  private updateCameraTarget(moveX: number, moveZ: number) {
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;

    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControl.target = this.cameraTarget;
  }

  private toggleKey(key: string, val: boolean) {
    const el = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
    if (el) {
      el.classList.toggle("active", val);
    }
    switch (key.toLowerCase()) {
      case "w":
        this.keyMapping.forward = val;
        break;
      case "s":
        this.keyMapping.backward = val;
        break;
      case "a":
        this.keyMapping.left = val;
        break;
      case "d":
        this.keyMapping.right = val;
        break;
      case "shift":
        this.keyMapping.sprint = val;
        break;
    }
  }

  private directionOffset() {
    let directionOffset = 0;
    if (this.keyMapping.forward) {
      if (this.keyMapping.left) {
        directionOffset = Math.PI / 4;
      } else if (this.keyMapping.right) {
        directionOffset = -Math.PI / 4;
      }
    } else if (this.keyMapping.backward) {
      if (this.keyMapping.left) {
        directionOffset = Math.PI / 4 + Math.PI / 2;
      } else if (this.keyMapping.right) {
        directionOffset = -Math.PI / 4 - Math.PI / 2;
      } else {
        directionOffset = Math.PI;
      }
    } else if (this.keyMapping.left) {
      directionOffset = Math.PI / 2;
    } else if (this.keyMapping.right) {
      directionOffset = -Math.PI / 2;
    }
    return directionOffset;
  }
}
