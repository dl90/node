import path from 'path'
import rfs from 'rotating-file-stream'

const pad = num => (num > 9 ? '' : '0') + num
const accessLog = (time, index) => {
  if (!time) return 'latest.access.log'

  const month = time.getFullYear() + '-' + pad(time.getMonth() + 1)
  const day = pad(time.getDate())
  const hour = pad(time.getHours())
  const minute = pad(time.getMinutes())

  return `${month}/${month}-${day} ${hour}:${minute} ${index}-access.log`
}

export const accessLogStream = rfs.createStream(accessLog, {
  interval: '5m',
  path: path.join(path.resolve(), '../logs')
})