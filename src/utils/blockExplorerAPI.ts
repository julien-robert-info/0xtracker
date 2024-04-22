import { Tag } from 'pages/api/get-tags'

export const DEBANK_URL = 'https://debank.com/profile/'

export type TransferList = Array<{
  chainId: number
  blockNumber: string
  from: string
  to: string
  value: number
  tokenSymbol: string
  hash: string
  tokenDecimal: number
}>

interface Transfer {
  blockNumber: string
  hash: string
  from: string
  to: string
  value: number
  tokenSymbol: string
  tokenDecimal: number
}

// Retrieve erc20 event list for a given address from blockExplorer API behind API route
export const getErc20EventsFromAddress = async (
  address: string,
  chainId: number
) => {
  let transferList: Transfer[] = []
  let startblock = 0
  let response
  // blockExplorer API gives 10000 max result
  // Loop till we get all, filtering with startblock
  do {
    try {
      response = await fetch(
        `api/get-transfer-list?chainId=${chainId}&address=${address}&startblock=${startblock}`
      ).then(async (res) => {
        if (res.status === 200) {
          return await res.json()
        }
        throw await res.json()
      })
      transferList = [...transferList, ...response.result]
      startblock = Number(transferList[transferList.length - 1].blockNumber) + 1
    } catch (error) {
      console.log(error)
    }
  } while (response?.result?.length == 10000)

  return transferList
}

// Extract transfers from erc20 event list
export const getTransfersFromErc20Events = (
  chainId: number,
  eventList: Transfer[]
) => {
  let transfers: TransferList = []

  eventList.map((transfer: Transfer) => {
    transfers.push({
      chainId: chainId,
      blockNumber: transfer.blockNumber,
      from: transfer.from,
      to: transfer.to,
      hash: transfer.hash,
      value: transfer.value,
      tokenSymbol: transfer.tokenSymbol,
      tokenDecimal: transfer.tokenDecimal
    })
  })

  return transfers
}

export const getTags = async (
  address: string,
  chainId: number
): Promise<Tag | undefined> => {
  try {
    return await fetch(
      `/api/get-tags?chainId=${chainId}&address=${address}`
    ).then(async (res) => {
      const response = await res.json()
      if (res.status === 200) {
        return response
      }
      throw response
    })
  } catch (error) {
    console.log(error)
  }
}

export const uniqueAddressList = (transferList: TransferList) => {
  return [
    ...new Set([
      ...transferList.map((item) => item.from),
      ...transferList.map((item) => item.to)
    ])
  ]
}

export const formatAddress = (address: string, length: number) => {
  if (address.length <= length) {
    return address
  }
  const midLength = length / 2

  return (
    address.substring(0, midLength) +
    '...' +
    address.substring(address.length - midLength, address.length)
  )
}
