export type Animation = {
  clip: THREE.AnimationClip;
  action: THREE.AnimationAction;
};

export type AnimationRecord = Record<string, Animation>;

export class ModelControllerProxy {
  private _animations: AnimationRecord;

  constructor(animations: AnimationRecord) {
    this._animations = animations;
  }

  public get animations(): AnimationRecord {
    return this._animations;
  }
}
