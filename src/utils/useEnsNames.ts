import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { TransferList } from './blockExplorerAPI'

type Names = {
  address: string
  name: string
}[]

export const useEnsNames = (transferList: TransferList) => {
  const didMount = React.useRef(false)
  const [names, setNames] = React.useState<Names>([])
  const verifiedAddress = React.useRef<string[]>([])
  const { library } = useWeb3React()

  const updateNames = () => {
    const uniqueTransferListAddress = [
      ...new Set([
        ...transferList.map((item) => item.source),
        ...transferList.map((item) => item.target)
      ])
    ]

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

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (transferList.length === 0) {
      verifiedAddress.current = []
      return
    }

    if (library) {
      updateNames()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferList])

  return names
}
