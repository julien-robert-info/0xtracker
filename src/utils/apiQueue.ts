import PQueue from 'p-queue'
import { chains } from 'data/networks'

let queue: PQueue[] = []
let intervalCap = chains[1].blockExplorerApiToken !== undefined ? 4 : 1
let interval = chains[1].blockExplorerApiToken !== undefined ? 1000 : 6000
queue[1] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap = chains[56].blockExplorerApiToken !== undefined ? 4 : 1
interval = chains[56].blockExplorerApiToken !== undefined ? 1000 : 6000
queue[56] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap = chains[137].blockExplorerApiToken !== undefined ? 4 : 1
interval = chains[137].blockExplorerApiToken !== undefined ? 1000 : 6000
queue[137] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap = chains[250].blockExplorerApiToken !== undefined ? 4 : 1
interval = chains[250].blockExplorerApiToken !== undefined ? 1000 : 6000
queue[250] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap = chains[100].blockExplorerApiToken !== undefined ? 4 : 1
interval = chains[100].blockExplorerApiToken !== undefined ? 1000 : 6000
queue[100] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})

export const makeApiCallQueued = async (request: string, chainId: number) => {
  if (!queue[chainId]) {
    throw `Unsupported chaindId ${chainId}`
  }

  const apiUrl = chains[chainId].blockExplorerApiUrls
  const apiToken = chains[chainId].blockExplorerApiToken
  const url =
    `${apiUrl}${request}` +
    (apiToken !== undefined ? `&apikey=${apiToken}` : '')

  return queue[chainId].add(() => fetch(url).then((e) => e.json()))
}
