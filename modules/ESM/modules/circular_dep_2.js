import * as circular_dep_1 from './circular_dep_1.js'

export let loaded = false
export const calcSum = () => circular_dep_1.initialValue + 99
export const dep_1_ref = circular_dep_1

loaded = true