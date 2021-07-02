// attempts to change imported module
require('./dep_1').print = () => console.log('changed')
require('../module_2/dep_2').print = () => console.log('changed')

const dep = require('./dep_1')
const dep_2 = require('../module_2/dep_2')

dep.print()
console.log(dep, Object.isFrozen(dep))
dep_2.print()

function print () {
  console.log('\n\n\n****** Hi from module_1 ******\n')
  console.log(require)
  console.log(module)
}

let count = 1
function add () { count++ }

module.exports = {
  print,
  count,
  add
}
