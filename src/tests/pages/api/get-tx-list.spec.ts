import fetch from 'jest-fetch-mock'
import { NextApiRequest, NextApiResponse } from 'next'
import { createMocks } from 'node-mocks-http'
import { blockExplorerApiResponse } from 'tests/__mocks__/blockExplorerAPI'
import getTxList from 'pages/api/get-tx-list'
import { chains } from 'data/networks'

describe('api route get-tx-list', () => {
  const searchAddress = '0x000000000000000000000000000000000000dead'
  const chainId = '137'

  beforeEach(() => {
    fetch.resetMocks()
  })

  it('use API token if exist', async () => {
    fetch.mockResponse(blockExplorerApiResponse)
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({
        method: 'GET',
        query: {
          address: searchAddress,
          chainId: chainId,
          startblock: 0
        }
      })

    await getTxList(req, res)

    let apiUrl = chains[chainId].blockExplorerApiUrls
    let request =
      `${apiUrl}?module=account&action=txlist&address=${searchAddress}` +
      `&startblock=0&endblock=latest&sort=asc&apikey=YOUR_API_TOKEN`

    expect(fetch).toHaveBeenCalledWith(request)

    req.query.chainId = '56'
    await getTxList(req, res)

    apiUrl = chains[56].blockExplorerApiUrls
    request =
      `${apiUrl}?module=account&action=txlist&address=${searchAddress}` +
      `&startblock=0&endblock=latest&sort=asc`

    expect(fetch).toHaveBeenLastCalledWith(request)
  })
})
