import React from 'react'
import { TrackAddressFormValues } from 'components/TrackAddressForm'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import {
  getErc20EventsFromAddress,
  getTransfersFromErc20Events,
  TransferList,
  useEnsNames
} from 'utils'

export type Search = {
  chainId: number
  address: string
}

export const useTracker = () => {
  const didMount = React.useRef(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [transferList, setTransferList] = React.useState<TransferList>([])
  const [searchList, setSearchList] = React.useState<Search[]>([])
  const fetchList = React.useRef<Search[]>([])
  const searchValue = React.useRef<TrackAddressFormValues>({
    searchAddress: '',
    selectedNetworks: []
  })
  const { library } = useWeb3React()
  const names = useEnsNames(transferList)

  const search = async (
    formValues: TrackAddressFormValues,
    setFormValues: (formValues: TrackAddressFormValues) => void
  ) => {
    setIsLoading(true)
    if (formValues.searchAddress !== '') {
      if (!ethers.utils.isAddress(formValues.searchAddress)) {
        //ENS resolution
        const resolved = await library?.resolveName(formValues.searchAddress)
        if (resolved) {
          setFormValues({ ...formValues, searchAddress: resolved as string })
        } else {
          setIsLoading(false)
          console.log('invalid address!')
        }
        return
      }

      //initialize values before search
      searchValue.current = formValues
      setTransferList([])
      setSearchList([])
      fetchList.current = []

      searchValue.current.selectedNetworks.map((chainId) => {
        //search for each selected networks
        setSearchList((searchList) => [
          ...searchList,
          {
            chainId: Number(chainId),
            address: searchValue.current.searchAddress.toLowerCase()
          }
        ])
      })
    }
  }

  const addSearch = async (search: Search) => {
    setSearchList((searchList) => [...searchList, search])
  }

  const simpleSearch = async (search: Search) => {
    const erc20List = await getErc20EventsFromAddress(
      search.address,
      search.chainId
    )
    if (erc20List.length > 0) {
      fetchList.current.push(search)
      const transfers = getTransfersFromErc20Events(search.chainId, erc20List)
      setTransferList((transferList) => [...transferList, ...transfers])
      console.log('erc20List', erc20List, search)
      console.log('transfers', transfers, search)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    //pop search on searchList change
    const newSearch = searchList[0]
    if (newSearch) {
      setIsLoading(true)
      setSearchList((searchList) => searchList.slice(1))
      //lauch search
      simpleSearch(newSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchList])

  return { search, addSearch, transferList, fetchList, names, isLoading }
}
