import { HandPalm, Play } from 'phosphor-react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  HomeContainer,
  CountdonwContainer,
  FormContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
  StopCountdownButton,
} from './styles'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

const timerValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'A tarefa de ter no mínimo 5 minutos')
    .max(60, 'A tarefa de ter no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof timerValidationSchema>

interface CycleProps {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interuptedDate?: Date
  completedDate?: Date
}

export function Home() {
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(timerValidationSchema),
  })

  const [cycles, setCycles] = useState<CycleProps[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondPast, setAmountSecondsPast] = useState(0)

  function handleCreateNewCycle(data: NewCycleFormData) {
    setAmountSecondsPast(0)

    const newCycle: CycleProps = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((oldState) => [...oldState, newCycle])
    setActiveCycleId(newCycle.id)

    reset()
  }

  function handleInteruptCycle() {
    setCycles((oldState) =>
      oldState.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, interuptedDate: new Date() }
          : cycle,
      ),
    )

    setActiveCycleId(null)
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const task = watch('task')
  const isSubmitDisabled = !task

  const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondPast : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = Math.floor(currentSeconds % 60)

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let timer: number
    if (activeCycle) {
      timer = setInterval(() => {
        const differenceTimeInSeconds = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (differenceTimeInSeconds >= totalSeconds) {
          setCycles((oldState) =>
            oldState.map((cycle) =>
              cycle.id === activeCycleId
                ? { ...cycle, completedDate: new Date() }
                : cycle,
            ),
          )

          setActiveCycleId(null)
          clearInterval(timer)
        } else {
          setAmountSecondsPast(differenceTimeInSeconds)
        }
      }, 1000)
    }

    return () => {
      clearInterval(timer)
    }
  }, [activeCycle, activeCycleId, totalSeconds])

  useEffect(() => {
    if (activeCycle)
      document.title = `Ignite Timer | ${minutesAmount}:${secondsAmount}`
  }, [activeCycle, minutesAmount, secondsAmount])

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Dê um nome para seu o seu projeto"
            list="task-suggestions"
            disabled={!!activeCycle}
            readOnly={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
            <option value="Projeto 4"></option>
          </datalist>

          <label htmlFor="minutesAmount">Durante</label>
          <MinutesAmountInput
            type="number"
            step={5}
            min={1}
            max={60}
            id="minutesAmount"
            placeholder="00"
            {...register('minutesAmount', { valueAsNumber: true })}
            disabled={!!activeCycle}
            readOnly={!!activeCycle}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdonwContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>

          <Separator>:</Separator>

          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdonwContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInteruptCycle}>
            <HandPalm size={24} />
            Interromper Ciclo
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
