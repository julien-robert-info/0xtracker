import PQueue from 'p-queue'
import { chains } from 'data/networks'

const NB_REQ_TOKEN = 4
const NB_REQ_NO_TOKEN = 1
const INTERVAL_TOKEN = 1000
const INTERVAL_NO_TOKEN = 6000

let queue: PQueue[] = []
let intervalCap =
  chains[1].blockExplorerApiToken !== undefined ? NB_REQ_TOKEN : NB_REQ_NO_TOKEN
let interval =
  chains[1].blockExplorerApiToken !== undefined
    ? INTERVAL_TOKEN
    : INTERVAL_NO_TOKEN
queue[1] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap =
  chains[56].blockExplorerApiToken !== undefined
    ? NB_REQ_TOKEN
    : NB_REQ_NO_TOKEN
interval =
  chains[56].blockExplorerApiToken !== undefined
    ? INTERVAL_TOKEN
    : INTERVAL_NO_TOKEN
queue[56] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap =
  chains[137].blockExplorerApiToken !== undefined
    ? NB_REQ_TOKEN
    : NB_REQ_NO_TOKEN
interval =
  chains[137].blockExplorerApiToken !== undefined
    ? INTERVAL_TOKEN
    : INTERVAL_NO_TOKEN
queue[137] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap =
  chains[250].blockExplorerApiToken !== undefined
    ? NB_REQ_TOKEN
    : NB_REQ_NO_TOKEN
interval =
  chains[250].blockExplorerApiToken !== undefined
    ? INTERVAL_TOKEN
    : INTERVAL_NO_TOKEN
queue[250] = new PQueue({
  concurrency: 1,
  intervalCap: intervalCap,
  interval: interval
})
intervalCap =
  chains[100].blockExplorerApiToken !== undefined
    ? NB_REQ_TOKEN
    : NB_REQ_NO_TOKEN
interval =
  chains[100].blockExplorerApiToken !== undefined
    ? INTERVAL_TOKEN
    : INTERVAL_NO_TOKEN
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

  return queue[chainId].add(() => fetch(url).then((res) => res.json()))
}
