export const items = [
  { id: 1, name: 'one' },
  { id: 2, name: 'two' },
  { id: 3, name: 'three' }
]

let id = items.length + 1
export const nextId = () => id++
