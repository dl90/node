import * as circular_dep_2 from './circular_dep_2.js'

export let loaded = false
export let initialValue = 1
export let sum = circular_dep_2.calcSum()
export const dep_2_ref = circular_dep_2

loaded = true
initialValue = 101