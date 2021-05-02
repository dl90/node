const childProcess = require("child_process")


const echo = childProcess.spawn('echo', ['hello world'])
echo.on('message', msg => console.log(msg))
echo.on("exit", (code, signal) => console.log(`PID: ${echo.pid} code: ${code} signal: ${signal}\n`))

echo.stdout.on('data', data => console.log(data.toString() + '\n'))
echo.stderr.on('data', data => console.log(data.toString() + '\n'))

/*
  for spawned child processes, their stdio is accessible as streams
  - stdin is a writable stream
  - stdout is a readable stream
  - stderr is a readable stream

  these can be pipped
  process1.stdout.pipe(process2.stdin)
  process2.stdout.on('data', data => handelData(data))

  options can be passed to let the child process inherit the main processes stdio and stream to it directly
  shell can also be enabled
*/

const git = childProcess.spawn('git status', { stdio: 'inherit', shell: true })
git.on('close', (code, signal) => console.log(`PID: ${git.pid} code: ${code} signal: ${signal}\n`))

/*
  for exec child processes, the stdio are buffers
  exec uses the shell and can be dangerous
*/
const ls = childProcess.exec('ls -la')
ls.stdout.on('data', data => console.log(data.toString() + '\n'))
ls.stderr.on('data', data => console.log(data.toString() + '\n'))
ls.on('close', (code, signal) => console.log(`PID: ${ls.pid} code: ${code} signal: ${signal}\n`))

/*
  processes can be detached from parent and run independently
  unref is used to allow the parent process to exit independently
*/
const terminal = childProcess.spawn('open', ['-a', 'Terminal'], { detached: true, stdio: 'ignore' })
terminal.unref()
