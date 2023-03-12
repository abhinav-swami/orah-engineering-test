function comparator(a, b, key) {
  if (a[key] < b[key]) {
    return -1
  }
  if (a[key] > b[key]) {
    return 1
  }
  return 0
}

export function sortAndFilter({ arr, key, querystring, sortmethod }) {
  if (!arr || arr.length === 0) return arr

  let updatedArray = [...arr]
  // filter out students that match with query
  if (querystring.length > 0) {
    // case in-sensitive search
    updatedArray = updatedArray.filter(
      (student) => student.first_name.toUpperCase().match(querystring.toUpperCase()) || student.last_name.toUpperCase().match(querystring.toUpperCase())
    )
  }

  // sort the available array

  if (sortmethod === "none") {
    return updatedArray
  } else if (sortmethod === "ascending") {
    updatedArray = updatedArray.sort((a, b) => comparator(a, b, key))
  } else if (sortmethod === "decending") {
    updatedArray = updatedArray.sort((a, b) => comparator(b, a, key))
  }

  return updatedArray
}
