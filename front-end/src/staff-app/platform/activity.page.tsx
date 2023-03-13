import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { LoadState } from "shared/load-state/LoadState"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { createRollSummary } from "shared/helpers/create-roll-summary"
import { PieChart } from "react-minimal-pie-chart"

export const ActivityPage: React.FC = () => {
  const [getActivity, data, loadState] = useApi({ url: "get-activities" })

  useEffect(() => {
    void getActivity()
  }, [getActivity])

  console.log({ data })

  return (
    <S.Container>
      {loadState === "loading" && <LoadState state={loadState} />}

      {loadState === "loaded" && data.activity && data.activity?.length === 0 && <LoadState state="empty" title="No student found with current filter" />}

      {loadState === "loaded" && data.activity && (
        <>
          {data.activity.map((activity, index) => (
            <RollSummaryCard key={index} activity={activity} />
          ))}
        </>
      )}
      {loadState === "error" && <LoadState state={loadState} />}
    </S.Container>
  )
}

const RollSummaryCard = ({ activity }) => {
  const [rollSummary, setRollSummary] = useState({ present: 0, absent: 0, late: 0, total: 0})
  const { date, entity: { name, student_roll_states }} = activity

  const parsedDate = new Date(date)
  useEffect(() => {
    if (student_roll_states?.length > 0) {
      setRollSummary(createRollSummary({ student_roll_states }))
    }
  }, [student_roll_states])

  return (
    <S.Card>
      <S.FlextContainer>
        <S.Heading>{name}</S.Heading>
        {"Submitted on: " + parsedDate.toDateString()}

        {student_roll_states && student_roll_states.length > 0 && (
          <div>
            <RollStateList
              stateList={[
                { type: "all", count: rollSummary.total },
                { type: "present", count: rollSummary.present },
                { type: "late", count: rollSummary.late },
                { type: "absent", count: rollSummary.present },
              ]}
            />
          </div>
        )}
      </S.FlextContainer>
      <div>
        <PieChart
          data={[
            { title: "Present", value: rollSummary.present, color: "#13943b" },
            { title: "Late", value: rollSummary.late, color: "#f5a623" },
            { title: "Absent", value: rollSummary.absent, color: "#9b9b9b" },
          ]}
          animate={true}
          label={({ dataEntry }) => {
            const valueInPercent = parseInt((dataEntry.value * 100) / rollSummary.total) || 0
            return valueInPercent ? valueInPercent + " %" : false
          }}
          labelStyle={{
            fontSize: "8px",
            color: "#fff",
          }}
          style={{ width: "100px" }}
        />
      </div>
    </S.Card>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  Card: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: ${Spacing.u4};
    border: 1px solid grey;
    border-radius: ${BorderRadius.default};
    margin: ${Spacing.u4};
  `,
  FlextContainer: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  Heading: styled.span`
    display: block;
    margin-bottom: ${Spacing.u4};
    font-weight: ${FontWeight.normal};
  `,
}
