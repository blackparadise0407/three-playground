import * as THREE from "three";

import { ModelLoader } from "./model-loader";
import { CharacterFSM } from "./state-machine/character-state-machine";
import {
  AnimationRecord,
  ModelControllerProxy,
} from "./model-controller-proxy";

interface CharacterConstructor {
  scene: THREE.Scene;
}

export class Character {
  private modelLoader: ModelLoader;
  private mixer?: THREE.AnimationMixer;
  private scene: THREE.Scene;
  private characterFSM: CharacterFSM;
  private animations: AnimationRecord;
  private manager?: THREE.LoadingManager;

  constructor({ scene }: CharacterConstructor) {
    this.modelLoader = ModelLoader.getInstance();
    this.scene = scene;
    this.animations = {};

    this.characterFSM = new CharacterFSM(
      new ModelControllerProxy(this.animations)
    );
  }

  public load() {
    return this.modelLoader.load("/ty.fbx").then((model) => {
      if (model) {
        model.scale.setScalar(0.01);
        this.scene.add(model);
        this.mixer = new THREE.AnimationMixer(model);

        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = () => {
          this.characterFSM.setState("idle");
        };

        this.modelLoader.load("/animations/idle.fbx").then((anim) => {
          if (anim) {
            this.loadAnim("idle", anim);
          }
        });
        this.modelLoader.load("/animations/walk.fbx").then((anim) => {
          if (anim) {
            this.loadAnim("walk", anim);
          }
        });
      }
      console.log(this.characterFSM);
      return model;
    });
  }

  public update(delta: number) {
    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.characterFSM.update(delta);
  }

  private loadAnim(name: string, anim: THREE.Group) {
    if (this.mixer) {
      const clip = anim.animations[0];
      const action = this.mixer.clipAction(clip);

      this.animations[name] = {
        clip: clip,
        action: action,
      };
    }
  }
}
