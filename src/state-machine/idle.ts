import { State } from "./state";
import { KeyMapping } from "../model-controller";
import { FiniteStateMachine } from "./finite-state-machine";

export class IdleState implements State {
  private parent: FiniteStateMachine;

  get name(): string {
    return "idle";
  }

  constructor(parent: FiniteStateMachine) {
    this.parent = parent;
  }

  enter(prevState: State): void {
    throw new Error("Method not implemented.");
  }

  exit(): void {}

  update(delta: number, input: KeyMapping): void {
    throw new Error("Method not implemented.");
  }
}
