import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useDispatch, useSelector } from "react-redux"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const { isActive, onItemClick } = props
  const { roleFilter, presentStudents, lateStudents, absentStudents } = useSelector((state) => state.studentAttendence)

  const applyRollFilter = (filterType) => {
    let filterBy = roleFilter !== filterType ? filterType : "none"
    if (filterType === "all") {
      filterBy = "none"
    }
    dispatch({
      type: "SET_ROLE_FILTER",
      payload: roleFilter !== filterType ? filterType : "none",
    })
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: presentStudents.length + lateStudents.length + absentStudents.length },
              { type: "present", count: presentStudents.length },
              { type: "late", count: lateStudents.length },
              { type: "absent", count: absentStudents.length },
            ]}
            onItemClick={applyRollFilter}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("exit")}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
