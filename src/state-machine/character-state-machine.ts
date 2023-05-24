import { ModelControllerProxy } from "../model-controller-proxy";
import { FiniteStateMachine } from "./finite-state-machine";
import { IdleState } from "./idle";

export class CharacterFSM extends FiniteStateMachine {
  constructor(proxy: ModelControllerProxy) {
    super(proxy);
    this.init();
  }

  private init() {
    this.addState("idle", IdleState);
  }
}
