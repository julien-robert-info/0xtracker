import type { NextApiRequest, NextApiResponse } from 'next'
import bsc from 'data/tags/bsc.json'
import ethereum  from 'data/tags/ethereum.json'
import ftm from 'data/tags/ftm.json'
import polygon from 'data/tags/polygon.json'

export type Tag ={
  name: string
  labels: string[]
}

const getTags = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, chainId } = req.query
  let dataset: { [address: string]: Tag }
  switch (chainId) {
    case '56':
      dataset = bsc
      break
    case '137':
      dataset = polygon
      break
    case '250':
      dataset = ftm
      break
    default:
      dataset = ethereum
  }

  const tags = dataset[address as string]

  res.status(200).json(tags)
}

export default getTags
