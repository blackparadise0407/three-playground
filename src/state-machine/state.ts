import { KeyMapping } from "../model-controller";
import { FiniteStateMachine } from "./finite-state-machine";

export interface State {
  get name(): string;
  enter(prevState: State): void;
  exit(): void;
  update(delta: number, input: KeyMapping): void;
}

export interface StateConstructor {
  new (parent: FiniteStateMachine): State;
}
