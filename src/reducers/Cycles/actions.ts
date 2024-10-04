import { Cycle, CyclesReducerAction } from "./reducer";

export enum ActionTypes {
  ADD_NEW_CYCLE = "ADD_NEW_CYCLE",
  INTERRUPT_CURRENT_CYCLE = "INTERRUPT_CURRENT_CYCLE",
  MARK_CURRENT_CYCLE_AS_FINISH = "MARK_CURRENT_CYCLE_AS_FINISH",
  CLEAR_CYCLE_BY_ID = "CLEAR_CYCLE_BY_ID",
  CLEAR_ALL_CYCLE = "CLEAR_ALL_CYCLE",
  ACTIVE_BY_ID = "ACTIVE_BY_ID",
}

export function addNewCycleAction(newCycle: Cycle): CyclesReducerAction {
  return { type: ActionTypes.ADD_NEW_CYCLE, payload: { newCycle } };
}

export function markCurrentCycleAsFinishAction(): CyclesReducerAction {
  return { type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISH, payload: {} };
}

export function interruptCurrentCycleAction(): CyclesReducerAction {
  return { type: ActionTypes.INTERRUPT_CURRENT_CYCLE, payload: {} };
}

export function clearCycleByIdAction(cycleId: string): CyclesReducerAction {
  return { type: ActionTypes.CLEAR_CYCLE_BY_ID, payload: { cycleId } };
}

export function clearAllCycleAction(): CyclesReducerAction {
  return { type: ActionTypes.CLEAR_ALL_CYCLE, payload: {} };
}

export function activeCycleByIdAction(cycleId: string): CyclesReducerAction {
  console.log(ActionTypes.ACTIVE_BY_ID);

  return { type: ActionTypes.ACTIVE_BY_ID, payload: { cycleId } };
}
