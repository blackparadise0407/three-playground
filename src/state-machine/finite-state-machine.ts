import { State, StateConstructor } from "./state";
import { KeyMapping } from "../model-controller";
import { ModelControllerProxy } from "../model-controller-proxy";

export class FiniteStateMachine {
  public proxy: ModelControllerProxy;
  private states: Map<string, StateConstructor>;
  private currentState: State | null = null;

  constructor(proxy: ModelControllerProxy) {
    this.states = new Map();
    this.proxy = proxy;
  }

  protected addState(name: string, state: StateConstructor) {
    this.states.set(name, state);
  }

  public setState(name: string) {
    const prevState = this.currentState;

    if (prevState) {
      if (prevState.name == name) {
        return;
      }
      prevState.exit();
    }

    const S = this.states.get(name);
    if (S) {
      const nState = new S(this);
      this.currentState = nState;
      prevState && nState.enter(prevState);
    }
  }

  public update(delta: number, input: KeyMapping) {
    if (this.currentState) {
      this.currentState.update(delta, input);
    }
  }
}
