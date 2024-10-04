import { useContext } from "react";
import {
  ClearContainer,
  CycleActionButton,
  HistoryContainer,
  HistoryList,
  Status,
  ButtonContainer,
  TitleContainer,
} from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Play, Trash } from "phosphor-react";

export function History() {
  const { cycles, clearCycles, activatorCycle } = useContext(CyclesContext);

  return (
    <HistoryContainer>
      <TitleContainer>
        <h1>Meu Histórico</h1>
        <CycleActionButton
          onClick={() => clearCycles()}
          title="Deletar todo o histórico"
        >
          <Trash color="red" size={24} />
        </CycleActionButton>
      </TitleContainer>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutesAmount} minutos</td>
                  <td>
                    {formatDistanceToNow(new Date(cycle.startDate), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td>
                    <ClearContainer>
                      {cycle.finisedDate && (
                        <Status statusColor="green">Concluído</Status>
                      )}
                      {cycle.interruptDate && (
                        <Status statusColor="red">Interrumpido</Status>
                      )}
                      {cycle.isActive && (
                        <Status statusColor="yellow">Em Andamento</Status>
                      )}
                      <ButtonContainer>
                        <CycleActionButton
                          title="Deletar"
                          onClick={() => clearCycles(cycle.id)}
                        >
                          <Trash color="red" size={24} />
                        </CycleActionButton>
                        <CycleActionButton
                          title="Ativar tarefa"
                          disabled={cycle.isActive || !!cycle.finisedDate}
                          onClick={() => activatorCycle(cycle)}
                        >
                          <Play color="green" size={24} />
                        </CycleActionButton>
                      </ButtonContainer>
                    </ClearContainer>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
