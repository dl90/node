const logUpdate = require('log-update')

module.exports = { spin }

/**
 *
 * @param { 'process.hrtime' } startTime
 * @param { 'process.cpuUsage' } startUsage
 * @param { 'process.memoryUsage' } startMemory
 * @param { 'fs.statSync(...).size' } fileSize
 * @returns
 * ```
 * // read: counter for data read
 * // pass: counter for data passed
 * // done: flag
 * (read, pass, done = false) => logUpdate
 * ```
 */
function spin (startTime, startUsage, startMemory, fileSize) {
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let i = 0

  function hrtimeToMS (hrtime) {
    return hrtime[0] * 1000 + hrtime[1] / 1_000_000
  }

  return (read, passed, done = false) => {
    const elapsedTime = hrtimeToMS(process.hrtime(startTime))
    const elapsedUsage = process.cpuUsage(startUsage)
    const elapsedRSSMemory = (process.memoryUsage().rss - startMemory) / 1_048_576 // MB

    const elapsedUserMS = elapsedUsage.user / 1000
    const elapsedSystMS = elapsedUsage.system / 1000;
    const cpuPercent = (100 * (elapsedUserMS + elapsedSystMS) / elapsedTime).toFixed(1) + '%'

    logUpdate(`
      ${done ? '⠿' : spinner[i = ++i % spinner.length]} bytes read: ${read}
        bytes passed: ${passed}
        diff: ${read - passed}
        read: ${(read / fileSize * 100).toFixed(3)}%
        cpu usage: ~${cpuPercent}
        rss memory: ${elapsedRSSMemory.toFixed(3)} MB
        elapsed time: ${elapsedTime.toFixed(3)} ms
    `)
  }
}
