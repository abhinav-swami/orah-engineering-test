import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"

const Loading = () => {
  return (
    <CenteredContainer>
      <FontAwesomeIcon icon="spinner" size="2x" spin />
    </CenteredContainer>
  )
}

const EmptyList = ({ title = "No content" }) => {
  return (
    <CenteredContainer>
      <div>{title}</div>
    </CenteredContainer>
  )
}

const Error = () => {
  return (
    <CenteredContainer>
      <div>Failed to load</div>
    </CenteredContainer>
  )
}

export const LoadState = ({ state, title }) => {
  const states = {
    error: <Error />,
    loading: <Loading />,
    empty: <EmptyList title={title} />,
  }
  return <>{states[state]}</>
}
