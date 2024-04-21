import fetch from 'jest-fetch-mock'
import {
  blockExplorerApiErrorResponse,
  blockExplorerApiResponse
} from 'tests/__mocks__/blockExplorerAPI'
import { getErc20EventsFromAddress } from 'utils'

describe('blockExplorerAPI helper getErc20EventsFromAddress', () => {
  const searchAddress = '0x000000000000000000000000000000000000dead'
  const chainId = 137

  beforeEach(() => {
    fetch.resetMocks()
  })

  it('return an array of transactions', async () => {
    fetch.mockResponse(blockExplorerApiResponse)

    const txList = await getErc20EventsFromAddress(searchAddress, chainId)

    expect(fetch).toBeCalled()
    expect(txList).toHaveLength(5)
  })

  it('log errors', async () => {
    fetch.mockReject(() => Promise.reject(blockExplorerApiErrorResponse))
    const logSpy = jest.spyOn(console, 'log')

    await getErc20EventsFromAddress('notanaddress', chainId)

    expect(logSpy).toHaveBeenCalledWith(blockExplorerApiErrorResponse)
  })
})
