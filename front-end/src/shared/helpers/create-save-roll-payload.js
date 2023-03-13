export const createSaveRollPayload = ({ presentStudents, lateStudents, absentStudents }) => {
  const student_roll_states = []

  const saveRollState = (arr, key) => {
    if (arr.length !== 0) {
      arr.forEach(({ student_id }) => {
        student_roll_states.push({
          student_id,
          roll_state: key,
        })
      })
    }
  }

  saveRollState(presentStudents, "present")
  saveRollState(lateStudents, "late")
  saveRollState(absentStudents, "absent")

  return student_roll_states
}
