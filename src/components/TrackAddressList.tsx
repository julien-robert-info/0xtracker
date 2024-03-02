import React from 'react'
import { ethers } from 'ethers'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Collapse,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { chains } from 'data/networks'
import { DEBANK_URL, Names, TransferList, formatAddress } from 'utils'

export type TrackList = Array<
  Array<{
    address: string
    transfers: TransferList
  }>
>

interface TrackAddressListProps {
  list: TrackList
  names: Names
  selected: string | null
  setSelected: (selected: string | null) => void
  hiddenNodes: string[]
  setHiddenNodes: (nodes: string[]) => void
}

const TrackAddressList: React.FC<TrackAddressListProps> = ({
  list,
  names,
  selected,
  setSelected,
  hiddenNodes,
  setHiddenNodes
}) => {
  return (
    <Box maxWidth={300}>
      {list.map((addresses, chainId) => (
        <Accordion key={chainId} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="caption" sx={{ ml: 1 }}>
              {chains[chainId].chainName} ({addresses.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {addresses
                .sort((a, b) => b.transfers.length - a.transfers.length)
                .map((address) => (
                  <Box key={`${chainId}-${address.address}`}>
                    <ListItemButton
                      alignItems="flex-start"
                      selected={selected === `${chainId}-${address.address}`}
                      autoFocus={selected === `${chainId}-${address.address}`}
                      onClick={() =>
                        selected !== `${chainId}-${address.address}`
                          ? setSelected(`${chainId}-${address.address}`)
                          : setSelected(null)
                      }
                      sx={{
                        opacity:
                          hiddenNodes.findIndex(
                            (n) => n === `${chainId}-${address.address}`
                          ) !== -1
                            ? 0.4
                            : 1
                      }}
                    >
                      <ListItemText
                        primary={`${formatAddress(
                          names.findIndex(
                            (i) => i.address === address.address
                          ) !== -1
                            ? names[
                                names.findIndex(
                                  (i) => i.address === address.address
                                )
                              ].name
                            : address.address,
                          20
                        )} (${address.transfers.length})`}
                        primaryTypographyProps={{
                          fontSize: 'caption.fontSize'
                        }}
                      />
                      <Typography variant="caption">
                        ({address.transfers.length})
                      </Typography>
                    </ListItemButton>
                    <Collapse in={selected === `${chainId}-${address.address}`}>
                      <Paper elevation={9}>
                        {hiddenNodes.findIndex(
                          (node) => node === `${chainId}-${address.address}`
                        ) !== -1 ? (
                          <IconButton
                            aria-label="show"
                            size="small"
                            onClick={() =>
                              setHiddenNodes(
                                hiddenNodes.filter(
                                  (node) =>
                                    node !== `${chainId}-${address.address}`
                                )
                              )
                            }
                          >
                            <VisibilityIcon fontSize="inherit" />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="hide"
                            size="small"
                            onClick={() =>
                              setHiddenNodes([
                                ...hiddenNodes,
                                `${chainId}-${address.address}`
                              ])
                            }
                          >
                            <VisibilityOffIcon fontSize="inherit" />
                          </IconButton>
                        )}
                        <Link
                          href={`${DEBANK_URL}${address.address}`}
                          target="blank"
                          underline="hover"
                          sx={{ color: 'text.secondary' }}
                        >
                          Debank
                        </Link>
                        <List>
                          {address.transfers
                            .sort(
                              (a, b) =>
                                Number(b.blockNumber) - Number(a.blockNumber)
                            )
                            .map((transfer, i) => (
                              <ListItem
                                key={`${chainId}-${address.address}-${i}`}
                              >
                                {transfer.from == address.address ? (
                                  <ListItemText
                                    primary={`sent ${ethers.utils.formatEther(
                                      transfer.value
                                    )} ${
                                      transfer.tokenSymbol
                                    } to ${formatAddress(
                                      names.findIndex(
                                        (i) => i.address === transfer.to
                                      ) !== -1
                                        ? names[
                                            names.findIndex(
                                              (i) => i.address === transfer.to
                                            )
                                          ].name
                                        : transfer.to,
                                      20
                                    )}`}
                                    primaryTypographyProps={{
                                      color: 'error',
                                      fontSize: 'caption.fontSize'
                                    }}
                                  />
                                ) : (
                                  <ListItemText
                                    primary={`received ${ethers.utils.formatEther(
                                      transfer.value
                                    )} ${
                                      transfer.tokenSymbol
                                    } from ${formatAddress(
                                      names.findIndex(
                                        (i) => i.address === transfer.from
                                      ) !== -1
                                        ? names[
                                            names.findIndex(
                                              (i) => i.address === transfer.from
                                            )
                                          ].name
                                        : transfer.from,
                                      20
                                    )}`}
                                    primaryTypographyProps={{
                                      color: 'success',
                                      fontSize: 'caption.fontSize'
                                    }}
                                  />
                                )}
                              </ListItem>
                            ))}
                        </List>
                      </Paper>
                    </Collapse>
                  </Box>
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default TrackAddressList
