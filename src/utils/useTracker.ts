import { TrackAddressFormValues } from 'components/TrackAddressForm'
import { ethers } from 'ethers'
import React from 'react'
import {
  getTransfersFromtxList,
  getTxListFromAddress,
  TransferList
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

  const search = (formValues: TrackAddressFormValues) => {
    if (formValues.searchAddress !== '') {
      if (!ethers.utils.isAddress(formValues.searchAddress)) {
        console.log('invalid address!')

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
      const txList = await getTxListFromAddress(
        newSearch.address,
        newSearch.chainId,
        setIsFetching
      )
      const transfers = getTransfersFromtxList(
        newSearch.chainId,
        newSearch.address,
        txList
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
          const allTransfersUniqueAddress = [
            ...new Set([
              ...[...transferList, ...transfers]
                .filter((i) => i.chainId === newSearch.chainId)
                .map((item) => item.source),
              ...[...transferList, ...transfers]
                .filter((i) => i.chainId === newSearch.chainId)
                .map((item) => item.target)
            ])
          ]
          let transfersAdd: TransferList =
            allTransfersUniqueAddress.length <= searchValue.current.maxNodes
              ? transfers
              : []

          let newUniqueTransferListAddress = [
            ...new Set([
              ...[...transferList, ...transfersAdd]
                .filter((i) => i.chainId === newSearch.chainId)
                .map((item) => item.source),
              ...[...transferList, ...transfersAdd]
                .filter((i) => i.chainId === newSearch.chainId)
                .map((item) => item.target)
            ])
          ]

          let i = 0
          while (
            newUniqueTransferListAddress.length <
              searchValue.current.maxNodes &&
            transfersAdd.length < transfers.length
          ) {
            transfersAdd.push(transfers[i])
            newUniqueTransferListAddress = [
              ...new Set([
                ...[...transferList, ...transfersAdd]
                  .filter((i) => i.chainId === newSearch.chainId)
                  .map((item) => item.source),
                ...[...transferList, ...transfersAdd]
                  .filter((i) => i.chainId === newSearch.chainId)
                  .map((item) => item.target)
              ])
            ]

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

        const uniqueTransferAddress = [
          ...new Set([
            ...transfers.map((item) => item.source),
            ...transfers.map((item) => item.target)
          ])
        ]

        //dig through transfers addresses for new search
        //depending on minToDig and missingNodes
        if (
          missingNodes.current[
            missingNodes.current.findIndex(
              (i) => Number(i.chain) === newSearch.chainId
            )
          ].missingNodes > 0
        ) {
          uniqueTransferAddress.map(async (adr) => {
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

  return { search, transferList, isLoading }
}
