import { ActionTypes } from "./actions";
import { produce } from "immer";
export interface CycleState {
  cycles: Cycle[];
}
export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finisedDate?: Date;
  isActive: boolean;
}
interface CyclesReducerActionPayload {
  newCycle?: Cycle;
  cycleId?: string;
}
export interface CyclesReducerAction {
  payload: CyclesReducerActionPayload;
  type: string;
}

export function cyclesReducer(state: CycleState, action: CyclesReducerAction) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle!);
      });
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const index = state.cycles.findIndex((cycle) => cycle.isActive);
      if (index < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.cycles[index].isActive = false;
        draft.cycles[index].interruptDate = new Date();
      });
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISH: {
      const index = state.cycles.findIndex((cycle) => cycle.isActive);
      if (index < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.cycles[index].isActive = false;
        draft.cycles[index].finisedDate = new Date();
      });
    }
    case ActionTypes.CLEAR_CYCLE_BY_ID: {
      return produce(state, (draft) => {
        draft.cycles = draft.cycles.filter(
          (cycle) => cycle.id !== action.payload.cycleId
        );
      });
    }
    case ActionTypes.CLEAR_ALL_CYCLE: {
      console.log(state);
      return produce(state, (draft) => {
        draft.cycles = [];
      });
    }
    case ActionTypes.ACTIVE_BY_ID: {
      const indexToActive = state.cycles.findIndex(
        (cycle) =>
          cycle.id === action.payload.cycleId &&
          !cycle.finisedDate &&
          cycle.interruptDate
      );
      const indexToDesactive = state.cycles.findIndex(
        (cycle) => cycle.isActive
      );
      console.log(indexToActive);
      console.log(indexToDesactive);

      if (indexToActive < 0) {
        return state;
      }
      return produce(state, (draft) => {
        if (indexToDesactive >= 0) {
          draft.cycles[indexToDesactive].isActive = false;
          draft.cycles[indexToDesactive].interruptDate = new Date();
          console.log("desativando");
          console.log(draft.cycles[indexToDesactive].minutesAmount);
        }
        console.log("ativando");
        console.log(draft.cycles[indexToActive].minutesAmount);
        draft.cycles[indexToActive].isActive = true;
        draft.cycles[indexToActive].interruptDate = undefined;
      });
    }
    default:
      return state;
  }
}
