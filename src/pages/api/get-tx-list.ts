import type { NextApiRequest, NextApiResponse } from 'next'
import { RateLimit } from 'async-sema'
import { chains } from 'data/networks'

const limit = RateLimit(4)
const limitNoTOken = RateLimit(1, { timeUnit: 6000 })

const getTxList = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, chainId, startblock } = req.query

  const apiUrl = chains[Number(chainId)].blockExplorerApiUrls
  const apiToken = chains[Number(chainId)].blockExplorerApiToken
  const request =
    `${apiUrl}?module=account&action=txlist&address=${address}` +
    `&startblock=${startblock}&endblock=latest&sort=asc` +
    (apiToken !== undefined ? `&apikey=${apiToken}` : '')

  // Rate limiter
  if (apiToken) {
    await limit()
  } else {
    await limitNoTOken()
  }

  try {
    const response = await fetch(request).then((e) => e.json())
    if (response.status === '1') {
      res.status(200).json(response)
    } else {
      // catch reponse status error
      throw `${response.message} ${response.result} requesting ${apiUrl}-${address} from block ${startblock}`
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Allow large response data
export const config = {
  api: {
    responseLimit: false
  }
}

export default getTxList
