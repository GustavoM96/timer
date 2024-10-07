import { useFormContext } from "react-hook-form";
import { FormContainer, TaskInput, MinutesAmountinput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();
  return (
    <FormContainer>
      <label htmlFor="">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="Dê um nomepara o seu projeto"
        {...register("task")}
        disabled={!!activeCycle}
      />

      <label htmlFor="">Durante</label>
      <MinutesAmountinput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={1}
        max={60000}
        {...register("minutesAmount", { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}
