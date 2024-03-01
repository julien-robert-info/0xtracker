export const DEBANK_URL = 'https://debank.com/profile/'

export type TransferList = Array<{
  chainId: number
  blockNumber: string
  from: string
  to: string
  value: number
  tokenSymbol: string
  hash: string
}>

interface Transfer {
  blockNumber: string
  hash: string
  from: string
  to: string
  value: number
  tokenSymbol: string
}

// interface Tx {
//   blockNumber: string
//   hash: string
//   from: string
//   to: string
//   input: string
//   functionName: string
// }

// Retrieve erc20 event list for a given address from blockExplorer API behind API route
export const getErc20EventsFromAddress = async (
  address: string,
  chainId: number,
  setIsFetching: (isFetching: boolean) => void
) => {
  let transferList: Transfer[] = []

  setIsFetching(true)
  let startblock = 0
  let response
  // blockExplorer API gives 10000 max result
  // Loop till we get all, filtering with startblock
  do {
    try {
      response = await fetch(
        `api/get-transfer-list?chainId=${chainId}&address=${address}&startblock=${startblock}`
      ).then(async (e) => {
        if (e.status === 200) {
          return await e.json()
        }
        throw await e.json()
      })
      transferList = [...transferList, ...response.result]
      startblock = Number(transferList[transferList.length - 1].blockNumber) + 1
    } catch (error) {
      console.log(error)
    }
  } while (response?.result?.length == 10000)
  setIsFetching(false)

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
      tokenSymbol: transfer.tokenSymbol
    })
  })

  return transfers
}

// // Retrieve tx list for a given address from blockExplorer API behind API route
// export const getTxListFromAddress = async (
//   address: string,
//   chainId: number,
//   setIsFetching: (isFetching: boolean) => void
// ) => {
//   let txList: Tx[] = []

//   setIsFetching(true)
//   let startblock = 0
//   let response
//   // blockExplorer API gives 10000 max result
//   // Loop till we get all, filtering with startblock
//   do {
//     try {
//       response = await fetch(
//         `api/get-tx-list?chainId=${chainId}&address=${address}&startblock=${startblock}`
//       ).then(async (e) => {
//         if (e.status === 200) {
//           return await e.json()
//         }
//         throw await e.json()
//       })
//       txList = [...txList, ...response.result]
//       startblock = Number(txList[txList.length - 1].blockNumber) + 1
//     } catch (error) {
//       console.log(error)
//     }
//   } while (response?.result?.length == 10000)
//   setIsFetching(false)

//   return txList
// }

// // Extract transfer tx from tx list
// export const getTransfersFromtxList = (
//   chainId: number,
//   address: string,
//   txList: Tx[]
// ) => {
//   let transfers: TransferList = []

//   txList.map((tx: Tx) => {
//     switch (true) {
//       // transfer from another address
//       case tx.to === address.toLowerCase() && tx.from !== address.toLowerCase():
//         transfers = [
//           ...transfers,
//           {
//             chainId: chainId,
//             blockNumber: tx.blockNumber,
//             from: tx.from,
//             to: address.toLowerCase(),
//             hash: tx.hash
//           }
//         ]
//         break
//       // transfer to another address
//       case tx.from === address.toLowerCase() &&
//         tx.to !== address.toLowerCase() &&
//         tx.functionName === '':
//         transfers = [
//           ...transfers,
//           {
//             chainId: chainId,
//             blockNumber: tx.blockNumber,
//             from: address.toLowerCase(),
//             to: tx.to,
//             hash: tx.hash
//           }
//         ]
//         break
//       // erc20 transfer()
//       case tx.functionName.includes('transfer('):
//         const decodedInput = ethers.utils.defaultAbiCoder.decode(
//           ['address', 'uint256'],
//           ethers.utils.hexDataSlice(tx.input, 4)
//         )
//         transfers = [
//           ...transfers,
//           {
//             chainId: chainId,
//             blockNumber: tx.blockNumber,
//             from: address.toLowerCase(),
//             to: decodedInput[0].toLowerCase(),
//             hash: tx.hash
//           }
//         ]
//     }
//   })

//   return transfers
// }

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
      source: transfer.from,
      target: transfer.to,
      hash: transfer.hash,
      value: transfer.value,
      tokenSymbol: transfer.tokenSymbol
    })
  })

  return transfers
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
