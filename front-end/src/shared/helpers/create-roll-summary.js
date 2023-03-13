export const createRollSummary = ({ student_roll_states }) => {
  let present = 0
  let absent = 0
  let late = 0

  student_roll_states.forEach(({ roll_state }) => {
    if (roll_state === "present") {
      present++
    }
    if (roll_state === "late") {
      late++
    }
    if (roll_state === "absent") {
      absent++
    }
  })

  return { present, absent, late, total: present + late + absent }
}
