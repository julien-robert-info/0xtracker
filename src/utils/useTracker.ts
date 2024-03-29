import React from 'react'
import { TrackAddressFormValues } from 'components/TrackAddressForm'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import {
  getErc20EventsFromAddress,
  getTransfersFromErc20Events,
  isContract,
  TransferList,
  uniqueAddressList,
  useEnsNames
} from 'utils'

type Search = {
  chainId: number
  address: string
}

export const useTracker = () => {
  const didMount = React.useRef(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [transferList, setTransferList] = React.useState<TransferList>([])
  const [searchList, setSearchList] = React.useState<Search[]>([])
  const [isFetching, setIsFetching] = React.useState(false)
  const fetchList = React.useRef<Search[]>([])
  const missingNodes = React.useRef<{ chain: string; missingNodes: number }[]>(
    []
  )
  const searchValue = React.useRef<TrackAddressFormValues>({
    searchAddress: '',
    minToDig: 0,
    maxNodes: 0,
    selectedNetworks: []
  })
  const { library } = useWeb3React()
  const names = useEnsNames(transferList)

  const search = async (
    formValues: TrackAddressFormValues,
    setFormValues: (formValues: TrackAddressFormValues) => void
  ) => {
    if (formValues.searchAddress !== '') {
      if (!ethers.utils.isAddress(formValues.searchAddress)) {
        //ENS resolution
        const resolved = await library?.resolveName(formValues.searchAddress)
        if (resolved) {
          setFormValues({ ...formValues, searchAddress: resolved as string })
        } else {
          console.log('invalid address!')
        }
        return
      }

      //initialize values before search
      searchValue.current = formValues
      setTransferList([])
      setSearchList([])
      fetchList.current = []
      missingNodes.current = []

      searchValue.current.selectedNetworks.map((chainId) => {
        missingNodes.current = [
          ...missingNodes.current,
          { chain: chainId, missingNodes: searchValue.current.maxNodes }
        ]

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

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    //recursive search fonction
    const RecursiveSearch = async (newSearch: Search) => {
      //get transfers from search address
      fetchList.current.push(newSearch)
        const erc20List = await getErc20EventsFromAddress(
          newSearch.address,
          newSearch.chainId,
          setIsFetching
        )
        const transfers = getTransfersFromErc20Events(
          newSearch.chainId,
          erc20List
        )

      let addSearch = false
      //add transfers to transferList depending on missingNodes
      if (
        transfers.length > 0 &&
        missingNodes.current[
          missingNodes.current.findIndex(
            (i) => Number(i.chain) === newSearch.chainId
          )
        ].missingNodes > 0
      ) {
        setTransferList((transferList) => {
          const allTransfersUniqueAddress = uniqueAddressList(
            [...transferList, ...transfers].filter(
              (i) => i.chainId === newSearch.chainId
            )
          )

          let transfersAdd: TransferList =
            allTransfersUniqueAddress.length <= searchValue.current.maxNodes
              ? transfers
              : []

          let newUniqueTransferListAddress = uniqueAddressList(
            [...transferList, ...transfersAdd].filter(
              (i) => i.chainId === newSearch.chainId
            )
          )
          let i = 0
          while (
            newUniqueTransferListAddress.length <
              searchValue.current.maxNodes &&
            transfersAdd.length < transfers.length
          ) {
            transfersAdd.push(transfers[i])
            newUniqueTransferListAddress = uniqueAddressList(
              [...transferList, ...transfersAdd].filter(
                (i) => i.chainId === newSearch.chainId
              )
            )

            i++
          }

          missingNodes.current[
            missingNodes.current.findIndex(
              (i) => Number(i.chain) === newSearch.chainId
            )
          ].missingNodes =
            searchValue.current.maxNodes - newUniqueTransferListAddress.length
          return [...transferList, ...transfersAdd]
        })

        //dig through transfers addresses for new search
        //depending on minToDig and missingNodes
        if (
          missingNodes.current[
            missingNodes.current.findIndex(
              (i) => Number(i.chain) === newSearch.chainId
            )
          ].missingNodes > 0
        ) {
          uniqueAddressList(transfers).map(async (adr) => {
            if (
              transfers.filter((i) => i.source === adr || i.target === adr)
                .length >= searchValue.current.minToDig &&
              fetchList.current.findIndex(
                (i) => i.address === adr && i.chainId === newSearch.chainId
              ) === -1
            ) {
              setSearchList((searchList) => [
                ...searchList,
                {
                  chainId: newSearch.chainId,
                  address: adr
                }
              ])
              addSearch = true
            }
          })
        }
      }

      if (!isFetching && !addSearch) {
        setIsLoading(false)
      }
    }

    //pop search on searchList change
    const newSearch = searchList[0]
    if (newSearch) {
      setIsLoading(true)
      setSearchList((searchList) => searchList.slice(1))
      //lauch recursive search
      RecursiveSearch(newSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchList])

  return { search, transferList, names, isLoading }
}
