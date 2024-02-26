import fetch from 'jest-fetch-mock'
import {
  blockExplorerApiErrorResponse,
  blockExplorerApiResponse
} from 'tests/__mocks__/blockExplorerAPI'
import { getErc20EventsFromAddress } from 'utils'

describe('blockExplorerAPI helper getErc20EventsFromAddress', () => {
  const searchAddress = '0x000000000000000000000000000000000000dead'
  const chainId = 137
  const mockSetIsFetching = jest.fn()

  beforeEach(() => {
    fetch.resetMocks()
  })

  it('fire isFetching twice', async () => {
    fetch.mockResponse(blockExplorerApiResponse)

    await getErc20EventsFromAddress(searchAddress, chainId, mockSetIsFetching)

    expect(mockSetIsFetching).toHaveBeenCalledTimes(2)
    expect(mockSetIsFetching).toHaveBeenNthCalledWith(1, true)
    expect(mockSetIsFetching).toHaveBeenNthCalledWith(2, false)
  })

  it('return an array of transactions', async () => {
    fetch.mockResponse(blockExplorerApiResponse)

    const txList = await getErc20EventsFromAddress(
      searchAddress,
      chainId,
      mockSetIsFetching
    )

    expect(fetch).toBeCalled()
    expect(txList).toHaveLength(5)
  })

  it('log errors', async () => {
    fetch.mockReject(() => Promise.reject(blockExplorerApiErrorResponse))
    const logSpy = jest.spyOn(console, 'log')

    await getErc20EventsFromAddress('notanaddress', chainId, mockSetIsFetching)

    expect(logSpy).toHaveBeenCalledWith(blockExplorerApiErrorResponse)
  })
})

// describe('blockExplorerAPI helper getTransfersFromtxList', () => {
//   const Address1 = '0x000000000000000000000000000000000000dead'
//   const Address2 = '0x0000000000000000000000000000000000000000'

//   it('find transfer from another address', async () => {
//     const txList = [
//       {
//         blockNumber: '13553312',
//         hash: '0x598ed562641aa9e59738c364ca93a4cbf14dc87d16f25c99220e8eed0e4f415b',
//         from: Address2,
//         to: Address1,
//         input: '0x',
//         functionName: ''
//       }
//     ]
//     const transfers = getTransfersFromtxList(
//       137,
//       '0x000000000000000000000000000000000000dead',
//       txList
//     )

//     expect(transfers).toHaveLength(1)
//   })

//   it('find transfer to another address', async () => {
//     const txList = [
//       {
//         blockNumber: '13553312',
//         hash: '0x598ed562641aa9e59738c364ca93a4cbf14dc87d16f25c99220e8eed0e4f415b',
//         from: Address1,
//         to: Address2,
//         input: '0x',
//         functionName: ''
//       }
//     ]
//     const transfers = getTransfersFromtxList(
//       137,
//       '0x000000000000000000000000000000000000dead',
//       txList
//     )

//     expect(transfers).toHaveLength(1)
//   })

//   it('find ERC20 tranfer', async () => {
//     const txList = [
//       {
//         blockNumber: '13553312',
//         hash: '0x598ed562641aa9e59738c364ca93a4cbf14dc87d16f25c99220e8eed0e4f415b',
//         from: Address1,
//         to: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
//         input:
//           '0xa9059cbb0000000000000000000000002bf2b8757358ba7d064bad6760a36cfc3f561c9200000000000000000000000000000000000000000000141df5d77c6d9d600000',
//         functionName: 'transfer(address dst, uint256 rawAmount)'
//       }
//     ]
//     const transfers = getTransfersFromtxList(
//       137,
//       '0x000000000000000000000000000000000000dead',
//       txList
//     )

//     expect(transfers).toHaveLength(1)
//   })
// })
