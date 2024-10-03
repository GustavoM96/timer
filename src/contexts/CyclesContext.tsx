import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Cycle, cyclesReducer } from "../reducers/Cycles/reducer";
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishAction,
} from "../reducers/Cycles/actions";
import { differenceInSeconds } from "date-fns";
interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
  interruptCycle: () => void;
  createNewCycle: (data: CreateCycleData) => void;
  cycles: Cycle[];
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycleState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJson = localStorage.getItem(
        "@ignite-timer:cycles-state-1.0.0"
      );
      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson);
      }
      return initialState;
    }
  );
  const { cycles, activeCycleId } = cycleState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cycleState);
    localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJSON);
  }, [cycleState]);

  function interruptCycle() {
    setAmountSecondsPassed(0);
    dispatch(interruptCurrentCycleAction());
  }

  function createNewCycle({ task, minutesAmount }: CreateCycleData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
    };
    dispatch(addNewCycleAction(newCycle));
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishAction());
  }

  function setSecondsPassed(second: number) {
    setAmountSecondsPassed(second);
  }

  return (
    <CyclesContext.Provider
      value={{
        amountSecondsPassed,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        interruptCycle,
        createNewCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
