import papaparse from 'papaparse'

export default function parse(arr) {
  const numberOfRows = arr.reduce((acc, e) => Math.max(e.aule.length, acc), 0)

  let end = false
  let matrix = []
  let j = 0

  while (end === false) {
    for (let i = 0; i < arr.length; i++) {
      const stanza = arr[i].aule[j]

      // No more aule found, so putting empty array
      if (!matrix[j]) {
        matrix[j] = []
      }
      matrix[j] = [...matrix[j], stanza]
    }

    if (j + 1 === numberOfRows) {
      end = true
    }

    j++
  }

  return papaparse.unparse({
    fields: arr.map((e) => e.edificio),
    data: matrix,
  })
}
