import { networkInterfaces } from 'os'
let pkg = require('./package.json')

let scanPort = 8080
let host = findHost()
let hostPrefix = toHostPrefix(host)
let interval = 3000

for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i]
  if (arg == '--port' || arg == '-p') {
    i++
    scanPort = +process.argv[i]
    if (!scanPort) {
      console.error('Invalid port, expect number')
      process.exit(1)
    }
    continue
  }
  if (arg == '--interval' || arg == '-i') {
    i++
    let arg: string | number = process.argv[i]
    if (arg.endsWith('s')) {
      arg = +arg.substring(0, arg.length - 1) * 1000
    } else if (arg.endsWith('m')) {
      arg = +arg.substring(0, arg.length - 1) * 1000 * 60
    }
    interval = +arg
    if (!interval) {
      console.error('Invalid interval, expect number in ms')
      process.exit(1)
    }
    continue
  }
  if (arg == '--help' || arg == '-h') {
    console.log(
      `
scan-port-cli v${pkg.version}

Usage: scan-port-cli [options]

Options:
  -h, --help     : show this help message
  -p, --port     : specify port number, default is 8080
  -i, --interval : specify scan interval, default is 3000 (3 seconds)

Usage Example:

Scan port with default settings:
>  scan-port-cli

Scan port 3000:
>  scan-port-cli --port 3000

Scan every 2 seconds:
>  scan-port-cli --interval 2000
or using unit (s for seconds, m for minutes):
> scan-port-cli --interval 2s

Combine all settings:
> scan-port-cli --port 3000 --interval 2s
`.trim(),
    )
    process.exit(0)
  }
}

function formatInterval(): string {
  let string = (interval / 1000).toFixed(3)
  while (string.endsWith('0')) {
    string = string.substring(0, string.length - 1)
  }
  if (string.endsWith('.')) {
    string = string.substring(0, string.length - 1)
  }
  if (interval > 1000) {
    return string + ' seconds'
  } else {
    return string + ' second'
  }
}

console.log(`Scanning on port ${scanPort} every ${formatInterval()} ...`)

function findHost() {
  for (let iFaces of Object.values(networkInterfaces())) {
    if (iFaces) {
      for (let iFace of iFaces) {
        if (iFace.address.startsWith('192')) {
          return iFace.address
        }
      }
    }
  }
  throw new Error('Failed to find local network interface')
}

function toHostPrefix(host: string) {
  let parts = host.split('.')
  parts.pop()
  return parts.join('.')
}

let knownUrls: string[] = []
let pendingUrls: string[] = []

function scan(port: number) {
  for (let i = 1; i < 255; i++) {
    let url = `http://${hostPrefix}.${i}:${port}`
    pendingUrls.push(url)
  }
  loop()
}

function d2(x: number) {
  return x.toString().padStart(2, '0')
}

function formatTime(date: Date): string {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(d2)
    .join(':')
}

function loop() {
  Promise.all(
    pendingUrls.map(url =>
      fetch(url)
        .then(res => {
          knownUrls.push(url)
          console.log(`[${formatTime(new Date())}]`, url)
          let index = pendingUrls.indexOf(url)
          if (index != -1) {
            pendingUrls.splice(index, 1)
          }
        })
        .catch(err => {}),
    ),
  ).then(() => {
    setTimeout(loop, interval)
  })
}

scan(scanPort)
