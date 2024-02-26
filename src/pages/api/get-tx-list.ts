import type { NextApiRequest, NextApiResponse } from 'next'
import { makeApiCall } from 'utils'

const getTxList = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, chainId, startblock } = req.query

  const request =
    `?module=account&action=txlist&address=${address}` +
    `&startblock=${startblock}&endblock=latest&sort=asc`

  try {
    const response = await makeApiCall(request, Number(chainId))
    if (response.status === '1') {
      res.status(200).json(response)
    } else {
      // catch reponse status error
      throw `${response.message} ${response.result} getTxList ${chainId} ${address} ${startblock}`
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
