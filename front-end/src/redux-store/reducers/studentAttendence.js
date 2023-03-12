const initialState = {
  presentStudents: [],
  absentStudents: [],
  lateStudents: [],
  roleFilter: "all",
}

const checkIfStudentAlreadyExistsInArr = (student, arr) => arr.some((s) => s.id === student.id)

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_PRESENT_STUDENTS":
      if (checkIfStudentAlreadyExistsInArr(action.payload, state.presentStudents)) {
        return state
      }
      return {
        ...state,
        presentStudents: [...state.presentStudents, action.payload],
        absentStudents: state.absentStudents.filter((s) => s.id !== action.payload.id),
        lateStudents: state.lateStudents.filter((s) => s.id !== action.payload.id),
      }

    case "SET_ABSENT_STUDENTS":
      if (checkIfStudentAlreadyExistsInArr(action.payload, state.absentStudents)) {
        return state
      }
      return {
        ...state,
        absentStudents: [...state.absentStudents, action.payload],
        presentStudents: state.presentStudents.filter((s) => s.id !== action.payload.id),
        lateStudents: state.lateStudents.filter((s) => s.id !== action.payload.id),
      }

    case "SET_LATE_STUDENTS":
      if (checkIfStudentAlreadyExistsInArr(action.payload, state.lateStudents)) {
        return state
      }
      return {
        ...state,
        lateStudents: [...state.lateStudents, action.payload],
        absentStudents: state.absentStudents.filter((s) => s.id !== action.payload.id),
        presentStudents: state.presentStudents.filter((s) => s.id !== action.payload.id),
      }

    case "SET_ROLE_FILTER":
      return {
        ...state,
        roleFilter: action.payload,
      }

    default:
      return state
  }
}
