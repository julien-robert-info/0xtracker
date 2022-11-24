import { ethers } from 'ethers'
import { RateLimit } from 'async-sema'
import { chains } from 'data/networks'

export type TransferList = Array<{
  chainId: number
  source: string
  target: string
  hash: string
}>

interface Tx {
  blockNumber: string
  hash: string
  from: string
  to: string
  input: string
  functionName: string
}

const limit = RateLimit(4)
const limitNoTOken = RateLimit(1, { timeUnit: 6000 })

export const getTxListFromAddress = async (
  address: string,
  chainId: number,
  setIsFetching: (isFetching: boolean) => void
) => {
  const apiUrl = chains[chainId].blockExplorerApiUrls
  const apiToken = chains[chainId].blockExplorerApiToken
  let txList: Tx[] = []

  setIsFetching(true)
  let startblock = 0
  let data
  do {
    const request =
      `${apiUrl}?module=account&action=txlist&address=${address}` +
      `&startblock=${startblock}&endblock=latest&sort=asc` +
      (apiToken !== undefined ? `&apikey=${apiToken}` : '')

    if (apiToken) {
      await limit()
    } else {
      await limitNoTOken()
    }

    try {
      const response = await fetch(request)
      data = await response.json()
      if (data.status === '1') {
        txList = [...txList, ...data.result]
        startblock = Number(txList[txList.length - 1].blockNumber) + 1
      } else {
        console.log(
          `${apiUrl} error : ${data.message} requesting ${address} from block ${startblock}`
        )
        console.log(data.result)
      }
    } catch (error) {
      console.log(error)
    }
  } while (data?.result?.length == 10000)
  setIsFetching(false)

  return txList
}

export const getTransfersFromtxList = (
  chainId: number,
  address: string,
  txList: Tx[]
) => {
  let transfers: TransferList = []

  txList.map((tx: Tx) => {
    switch (true) {
      // transfer from another address
      case tx.to === address.toLowerCase() && tx.from !== address.toLowerCase():
        transfers = [
          ...transfers,
          {
            chainId: chainId,
            source: tx.from,
            target: address.toLowerCase(),
            hash: tx.hash
          }
        ]
        break
      // transfer to another address
      case tx.from === address.toLowerCase() &&
        tx.to !== address.toLowerCase() &&
        tx.functionName === '':
        transfers = [
          ...transfers,
          {
            chainId: chainId,
            source: address.toLowerCase(),
            target: tx.to,
            hash: tx.hash
          }
        ]
        break
      // erc20 transfer()
      case tx.functionName.includes('transfer('):
        const decodedInput = ethers.utils.defaultAbiCoder.decode(
          ['address', 'uint256'],
          ethers.utils.hexDataSlice(tx.input, 4)
        )
        transfers = [
          ...transfers,
          {
            chainId: chainId,
            source: address.toLowerCase(),
            target: decodedInput[0].toLowerCase(),
            hash: tx.hash
          }
        ]
    }
  })

  return transfers
}
