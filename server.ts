import { networkInterfaces } from 'os'

let scanPort = 8080
let host = findHost()
let hostPrefix = toHostPrefix(host)
let interval = 5000

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

function loop() {
  Promise.all(
    pendingUrls.map(url =>
      fetch(url)
        .then(res => {
          knownUrls.push(url)
          console.log('found', url)
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
