import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { TransferList, uniqueAddressList } from './blockExplorerAPI'

export type Names = {
  address: string
  name: string
}[]

export const useEnsNames = (transferList: TransferList) => {
  const didMount = React.useRef(false)
  const [names, setNames] = React.useState<Names>([])
  const verifiedAddress = React.useRef<string[]>([])
  const { library } = useWeb3React()

  const updateNames = () => {
    const uniqueTransferListAddress = uniqueAddressList(transferList)

    // Filter already searched addresses before looping through new ones
    uniqueTransferListAddress
      .filter((i) => verifiedAddress.current.findIndex((j) => j === i) === -1)
      .map(async (adr) => {
        try {
          const name = await library.lookupAddress(adr)
          verifiedAddress.current = [...verifiedAddress.current, adr]
          if (name) {
            setNames((names) => [...names, { address: adr, name: name }])
          }
        } catch (error) {
          console.log(error)
        }
      })
  }

  // Update names on transferList update
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

    // Update names if provider is connected
    if (library) {
      updateNames()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferList])

  return names
}
