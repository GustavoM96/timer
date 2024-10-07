import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Cycle, cyclesReducer } from "../reducers/Cycles/reducer";
import {
  activeCycleByIdAction,
  addNewCycleAction,
  clearAllCycleAction,
  clearCycleByIdAction,
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
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
  interruptCycle: () => void;
  createNewCycle: (data: CreateCycleData) => void;
  cycles: Cycle[];
  clearCycles: (cycleId?: string) => void;
  activatorCycle: (cycle: Cycle) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function GetSecondsToFisishCycle(cycle: Cycle) {
  const diffSecondsToNow = differenceInSeconds(
    new Date(),
    new Date(cycle.restartDate ?? cycle.startDate)
  );
  console.log(diffSecondsToNow);
  return cycle.secondsPassedRunning + diffSecondsToNow;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycleState, dispatch] = useReducer(
    cyclesReducer,
    { cycles: [] },
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
  const { cycles } = cycleState;
  const activeCycle = cycles.find((cycle) => cycle.isActive);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return GetSecondsToFisishCycle(activeCycle);
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

  function activatorCycle(cycle: Cycle) {
    setAmountSecondsPassed(
      differenceInSeconds(new Date(), new Date(cycle.startDate))
    );
    dispatch(activeCycleByIdAction(cycle.id));
  }

  function createNewCycle({ task, minutesAmount }: CreateCycleData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
      isActive: true,
      secondsPassedRunning: 0,
    };
    dispatch(addNewCycleAction(newCycle));
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishAction());
  }

  function setSecondsPassed(second: number) {
    setAmountSecondsPassed(second);
  }
  function clearCycles(cycleId?: string) {
    if (!cycleId) {
      setAmountSecondsPassed(0);
      return dispatch(clearAllCycleAction());
    }

    const isCycleActive = cycles.some(
      (cycle) => cycle.id == cycleId && cycle.isActive
    );

    if (isCycleActive) {
      setAmountSecondsPassed(0);
    }

    dispatch(clearCycleByIdAction(cycleId!));
  }

  return (
    <CyclesContext.Provider
      value={{
        amountSecondsPassed,
        activeCycle,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        interruptCycle,
        createNewCycle,
        cycles,
        clearCycles,
        activatorCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
