import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as THREE from "three";

export class ModelLoader {
  private loader: FBXLoader;
  private textureLoader: THREE.TextureLoader;
  private static instance: ModelLoader | null = null;

  public static getInstance(): ModelLoader {
    if (this.instance) {
      return this.instance;
    }
    return new ModelLoader();
  }

  private constructor() {
    this.loader = new FBXLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  public load(path: string, texturePath?: string) {
    return new Promise<THREE.Group>((resolve, reject) => {
      this.loader.load(
        path,
        async (fbx) => {
          let texture: THREE.Texture;
          if (texturePath) {
            texture = await this.loadTexture(texturePath);
          }
          fbx.traverse((child: any) => {
            if (child.isMesh) {
              if (texture) {
                child.material.map = texture;
                child.material.needsupdate = true;
              }
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          resolve(fbx);
        },
        undefined,
        reject
      );
    });
  }

  private async loadTexture(path: string) {
    return new Promise<THREE.Texture>((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }
}
