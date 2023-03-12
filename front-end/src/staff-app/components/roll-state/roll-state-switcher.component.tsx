import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, student }) => {
  const [rollState, setRollState] = useState(initialState)
  const { presentStudents, lateStudents, absentStudents } = useSelector((state) => state.studentAttendence)

  useEffect(() => {
    if (presentStudents.some((s) => s.id === student.id)) {
      setRollState("present")
    } else if (lateStudents.some((s) => s.id === student.id)) {
      setRollState("late")
    } else if (absentStudents.some((s) => s.id === student.id)) {
      setRollState("absent")
    }
  }, [presentStudents, lateStudents, absentStudents])

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
