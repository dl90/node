function print () {
  console.log('\n\n\n****** Hi from dep_1 ******\n')
  console.log(require)
  console.log(module)
}

// prevents modifying the exported module (monkey patching)
module.exports = Object.freeze({ print })
