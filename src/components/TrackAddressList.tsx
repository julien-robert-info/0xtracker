import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { chains } from 'data/networks'
import {
  DEBANK_URL,
  Names,
  TransferList,
  formatAddress,
  uniqueAddressList
} from 'utils'

const TrackAddressList: React.FC<{
  transferList: TransferList
  names: Names
}> = ({ transferList, names }) => {
  // Construct hierarchical tree for accordion menu
  let tree: Array<
    Array<{
      address: string
      transfers: Array<{ address: string; hashs: string[] }>
    }>
  > = []

  const trackChains = [...new Set(transferList.map((item) => item.chainId))]
  // Lvl 1 Networks
  trackChains.map((chainId) => {
    const addresses = uniqueAddressList(
      transferList.filter((i) => i.chainId === chainId)
    )

    // Lvl 2 Addresses
    addresses.map((address) => {
      let transfers: Array<{ address: string; hashs: string[] }> = []

      const uniqueTransferAddresses = uniqueAddressList(
        transferList.filter(
          (i) =>
            i.chainId === chainId &&
            (i.target === address || i.source === address)
        )
      ).filter((i) => i !== address)

      // Lvl 3 Interracted with addresses
      uniqueTransferAddresses.map((transferAddress) => {
        transfers.push({
          address: transferAddress,
          hashs: transferList
            .filter(
              (i) =>
                i.chainId === chainId &&
                ((i.source === address && i.target === transferAddress) ||
                  (i.target === address && i.source === transferAddress))
            )
            .map((item) => item.hash)
            .filter((value, index, self) => self.indexOf(value) === index)
        })
      })
      // Lvl 4 Tx hashs
      if (transfers.length > 1) {
        tree[chainId] = [
          ...(tree[chainId] ?? []),
          { address: address, transfers: transfers }
        ]
      }
    })
  })

  return (
    <Box fontSize={'caption.fontSize'} maxWidth={300}>
      {tree.map((addresses, chainId) => (
        <Accordion key={chainId} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {chains[chainId].chainName}
            <Typography sx={{ ml: 1 }}>({addresses.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {addresses.map((address) => (
              <Accordion key={`${chainId}-${address.address}`}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Link
                    href={`${DEBANK_URL}${address.address}`}
                    target="blank"
                    underline="hover"
                    sx={{ color: 'text.secondary' }}
                  >
                    {formatAddress(
                      names.findIndex((i) => i.address === address.address) !==
                        -1
                        ? names[
                            names.findIndex(
                              (i) => i.address === address.address
                            )
                          ].name
                        : address.address,
                      20
                    )}
                  </Link>
                  <Typography sx={{ ml: 1 }}>
                    ({address.transfers.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {address.transfers.map((txList) => (
                    <Accordion
                      key={`${chainId}-${address.address}-${txList.address}`}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                      >
                        <Link
                          href={`${DEBANK_URL}${txList.address}`}
                          target="blank"
                          underline="hover"
                          sx={{ color: 'text.secondary' }}
                        >
                          {formatAddress(
                            names.findIndex(
                              (i) => i.address === txList.address
                            ) !== -1
                              ? names[
                                  names.findIndex(
                                    (i) => i.address === txList.address
                                  )
                                ].name
                              : txList.address,
                            20
                          )}
                        </Link>
                        <Typography sx={{ ml: 1 }}>
                          ({txList.hashs.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {txList.hashs.map((tx) => (
                          <Link
                            key={`${chainId}-${address.address}-${txList.address}-${tx}`}
                            href={`${chains[chainId].blockExplorerUrls}tx/${tx}`}
                            target="blank"
                            underline="hover"
                            sx={{
                              display: 'block',
                              color: 'text.secondary'
                            }}
                          >
                            {`${formatAddress(tx, 30)}`}
                          </Link>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default TrackAddressList
