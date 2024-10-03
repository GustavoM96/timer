import { ActionTypes } from "./actions";
import { produce } from "immer";

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}
export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finisedDate?: Date;
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      });
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const index = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );
      if (index < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[index].interruptDate = new Date();
      });
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISH: {
      const index = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );
      if (index < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[index].finisedDate = new Date();
      });
    }
    default:
      return state;
  }
}
