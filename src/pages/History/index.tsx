import { HistoryContainer, HistoryList, StatusLabel } from './styles'

export function History() {
  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td>Terefa 1</td>
                <td>20 minutos</td>
                <td>Há 2 meses</td>
                <td>
                  <StatusLabel status="canceled">Concluído</StatusLabel>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
