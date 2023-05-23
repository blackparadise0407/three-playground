import * as THREE from "three";

import { ModelLoader } from "./model-loader";

interface CharacterConstructor {
  scene: THREE.Scene;
}

export class Character {
  private modelLoader: ModelLoader;
  private mixer?: THREE.AnimationMixer;
  private scene: THREE.Scene;

  constructor({ scene }: CharacterConstructor) {
    this.modelLoader = ModelLoader.getInstance();
    this.scene = scene;
  }

  public load() {
    return this.modelLoader.load("/ty.fbx").then((model) => {
      if (model) {
        model.scale.setScalar(0.01);
        this.scene.add(model);
        this.modelLoader.load("/animations/Walking.fbx").then((anim) => {
          this.mixer = new THREE.AnimationMixer(model);
          if (anim) {
            this.mixer.clipAction(anim.animations[0]).play();
          }
        });
      }
      return model;
    });
  }

  public update(delta: number) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}
