/*
  ECMAScript Modules

  ES modules are static and read only (no monkey patching)
  they are top level and can not be placed in control flow statements
  Three steps:
    1. recursively find all unique imports and loads file to memory
    2. from bottom up, reference import and export paths, build dependency graph
    3. from bottom up, execute imports
*/
import { fileURLToPath } from 'url'
console.log(fileURLToPath(import.meta.url), this)

import * as logger from './modules/logger.js'
console.log(logger.default)

// Dynamic imports (async)
if (Math.random() > 0.5)
  import('./modules/opt_1.js').then(({ main }) => main())
else
  import('./modules/opt_2.js').then(({ main }) => main())

import { count, add, obj } from './modules/opt_1.js'

// cant modify named exports (unless its a reference type)
console.log(count)
try { count++ } catch (e) { console.log(e.message) }
obj.new = 'test'
console.log(obj)

// this works tho
add()
console.log(count)

// note: initialValue is up to date in both modules references b/c they are references
// compared to CommonJS, which snapshots a shallow copy of the modules state at the time until it hits the circular require
import * as circular_dep_1 from './modules/circular_dep_1.js'
import * as circular_dep_2 from './modules/circular_dep_2.js'

console.log(circular_dep_1)
console.log(circular_dep_2)
console.log(circular_dep_2.calcSum())
