import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight, FontSize } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { sortAndFilter } from "shared/helpers/sortAndFilterUtils"
import sortIcon from "assets/icons/sort-icon.png"
import sortAlphaAZ from "assets/icons/sort-alpha-a-to-z.png"
import sortAlphaZA from "assets/icons/sort-alpha-z-to-a.png"
import { useSelector } from "react-redux"

const iconsSrc = {
  none: sortIcon,
  ascending: sortAlphaAZ,
  decending: sortAlphaZA,
}

export const HomeBoardPage: React.FC = () => {
  const { roleFilter, presentStudents, lateStudents, absentStudents } = useSelector((state) => state.studentAttendence)
  const [isRollMode, setIsRollMode] = useState(false)
  const [sorting, setSorting] = useState("none")
  const [renderList, setRenderList] = useState([])
  const [filterByKey, setFilterByKey] = useState("first_name")
  const [filterQuery, setFilterQuery] = useState("")
  const [getStudents, data, loadState] = useApi<{ students: Person[]; success: Boolean }>({ url: "get-homeboard-students" })

  const filterRollArrByKey = {
    all: data?.students,
    present: presentStudents,
    late: lateStudents,
    absent: absentStudents,
  }

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    const uptodateList = sortAndFilter({
      arr: filterRollArrByKey[roleFilter] || [],
      sortmethod: sorting,
      querystring: filterQuery,
      key: filterByKey,
    })
    setRenderList(uptodateList)
  }, [filterQuery, sorting, data, filterByKey, roleFilter])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort") {
      setSorting((prevVal) => {
        if (prevVal === "none") {
          return "ascending"
        } else if (prevVal === "ascending") {
          return "decending"
        } else {
          return "none"
        }
      })
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const changeFilterByKey = (event, key) => {
    event.stopPropagation()
    if (key !== filterByKey) {
      setFilterByKey(key)
    }
  }
  return (
    <>
      <S.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction}
          sorting={sorting}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          changeFilterByKey={changeFilterByKey}
          filterByKey={filterByKey}
        />
        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && renderList && renderList.length === 0 && (
          <CenteredContainer>
            <div>No student found with current filter</div>
          </CenteredContainer>
        )}

        {loadState === "loaded" && renderList && (
          <>
            {renderList.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sorting, setFilterQuery, filterQuery, filterByKey, changeFilterByKey } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")} style={{ cursor: "pointer" }}>
        Sort
        <S.Img src={iconsSrc[sorting]} width={14} alt="sort icon" />
        <SortByTabs filterByKey={filterByKey} changeFilterByKey={changeFilterByKey} />
      </div>
      <input type="text" value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} placeholder="Search by student name" />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const SortByTabs = (props) => {
  const { filterByKey, changeFilterByKey } = props
  return (
    <div style={{ display: "inline" }}>
      <S.TabCaptionText>By:</S.TabCaptionText>
      <S.TabAlikeButton className={filterByKey === "first_name" ? "activeTabAlikeButton" : "tabAlikeButton"} onClick={(e) => changeFilterByKey(e, "first_name")}>
        First Name
      </S.TabAlikeButton>
      <S.TabAlikeButton className={filterByKey === "last_name" ? "activeTabAlikeButton" : "tabAlikeButton"} onClick={(e) => changeFilterByKey(e, "last_name")}>
        Last Name
      </S.TabAlikeButton>
    </div>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Img: styled.img`
    margin: auto ${Spacing.u1};
    vertical-align: middle;
  `,
  Input: styled.input`
    padding: ${Spacing.u1};
  `,
  TabCaptionText: styled.span`
    font-sixe: ${FontSize.u6};
    margin-left: ${Spacing.u1};
  `,
  TabAlikeButton: styled.button`
    font-size: ${FontSize.u6};
    padding: 0 ${Spacing.u1};
  `,
}
