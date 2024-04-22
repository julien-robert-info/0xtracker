import React from 'react'
import { TransferList, getTags, uniqueAddressList } from './blockExplorerAPI'
import { Tag } from 'pages/api/get-tags'

export type Tags = {
  chainId: number
  address: string
  tag: Tag
}[]

export const useExplorerTags = (transferList: TransferList) => {
  const didMount = React.useRef(false)
  const [tags, setTags] = React.useState<Tags>([])
  const verifiedAddress = React.useRef<string[]>([])

  const updateTags = () => {
    const chains = [...new Set(transferList.map((item) => item.chainId))]
    chains.map((chainId) => {
      const uniqueTransferListAddress = uniqueAddressList(
        transferList.filter((i) => i.chainId === chainId)
      )
      // Filter already searched addresses before looping through new ones
      uniqueTransferListAddress
        .filter(
          (i) =>
            verifiedAddress.current.findIndex(
              (j) => j === `${chainId}-${i}`
            ) === -1
        )
        .map(async (adr) => {
          try {
            const addressTags = await getTags(adr, chainId)
            verifiedAddress.current = [
              ...verifiedAddress.current,
              `${chainId}-${adr}`
            ]
            if (addressTags) {
              setTags((tags) => [
                ...tags,
                { chainId: chainId, address: adr, tag: addressTags }
              ])
            }
          } catch (error) {
            console.log(error)
          }
        })
    })
  }

  // Update tags on transferList update
  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    // Reset verifiedAddress if transferList is empty
    if (transferList.length === 0) {
      verifiedAddress.current = []
      return
    }

    updateTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferList])

  return tags
}
