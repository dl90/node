
// revealing module pattern
const CustomModule = (() => {
  const private = {}

  function print () {
    console.log(private.name, private.number)
    return this
  }
  function setName (name) {
    private.name = name
    return this
  }
  function setNumber (number) {
    private.number = number
    return this
  }

  return {
    setName,
    setNumber,
    print
  }
})()

// CustomModule.setName('john').setNumber(123).print()

/*
  CommonJS specifications:

  1. require is a function that allows you to import a module to the local filesystem
  2. exports and module.exports are special variables that can be used to export public functionality from the current module
*/

// globals used to manage modules, main entry point require.main.id === '.'
console.log(module === require.main)
console.log(module)
console.log(require)

function _require (moduleName) {
  /*
    resolve full path of module

    - names without path references (. ./ ../) are first looked for in Node.js core modules
    - then checks in node_modules, walking up the directory tree

    module dependencies are not shared, even if they are the same, to avoid version compatibility issues
    hence the size
  */
  const id = _require.resolve(moduleName)
  if (_require.cache[id])
    return require.cache[id].exports

  // create module to hold exports and metadata (require.main)
  const _module = {
    id,
    exports: {},
    ...require.main
  }
  _require.cache[id] = _module

  /*
    reads file and execute it
    this recurs until all required modules are imported, completing the dependency tree
    circular dependencies are resolved by cache, the first module cached will be used
  */
  _loadModule(id, _module, _require)

  // return exported variables
  return _module.exports
}

const module_1 = require('./module_1')
const module_2 = require('./module_2')

module_1.print()
module_2.print()

const dep_2 = require('./module_2/dep_2')
console.log('\n\n!!!!!! dep_2 has been changed (from within module 1), this is bad !!!!!!')
console.log(dep_2('Hi from main'))
dep_2.print()

console.log('\n\n', require)

for (const childModule of module.children) {
  console.log(childModule.id)
  console.log(childModule.exports)
}

console.log(exports === module.exports)
