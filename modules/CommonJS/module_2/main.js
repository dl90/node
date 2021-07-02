const dep_2 = require('./dep_2')

exports.print = function () {
  console.log('\n\n\n****** Hi from module_2 ******\n')
  console.log(dep_2("hello"), '\n')
  console.log(require)
  console.log(module)
}
