import React from 'react'
import { ethers } from 'ethers'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
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
import DownloadIcon from '@mui/icons-material/Download'
import { chains } from 'data/networks'
import { DEBANK_URL, Names, Search, TransferList, formatAddress } from 'utils'
import { Tags } from 'utils/useExplorerTags'

export type TrackList = Array<
  Array<{
    address: string
    transfers: TransferList
  }>
>

interface TrackAddressListProps {
  list: TrackList
  names: Names
  tags: Tags
  fetchList: React.MutableRefObject<Search[]>
  selected: string | null
  setSelected: (selected: string | null) => void
  hiddenNodes: string[]
  setHiddenNodes: (nodes: string[]) => void
  addSearch: (search: Search) => void
}

const TrackAddressList: React.FC<TrackAddressListProps> = ({
  list,
  names,
  tags,
  fetchList,
  selected,
  setSelected,
  hiddenNodes,
  setHiddenNodes,
  addSearch
}) => {
  console.log(tags)
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
                            : tags.findIndex(
                                (i) =>
                                  i.chainId === chainId &&
                                  i.address === address.address
                              ) !== -1
                            ? tags[
                                tags.findIndex(
                                  (i) =>
                                    i.chainId === chainId &&
                                    i.address === address.address
                                )
                              ].tag.name
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
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                          }}
                        >
                          {tags[
                            tags.findIndex(
                              (i) =>
                                i.chainId === chainId &&
                                i.address === address.address
                            )
                          ]?.tag.labels.map((label, i) => (
                            <Chip
                              key={`tag-${i}-${chainId}-${address.address}`}
                              label={label}
                              sx={{ m: 1 }}
                            />
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <IconButton
                              aria-label="retrive"
                              size="small"
                              disabled={
                                fetchList.current.findIndex(
                                  (search) =>
                                    search.chainId === chainId &&
                                    search.address === address.address
                                ) !== -1
                              }
                              onClick={() =>
                                addSearch({
                                  chainId: chainId,
                                  address: address.address
                                })
                              }
                            >
                              <DownloadIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                          <Box sx={{ flex: 1 }}>
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
                          </Box>
                          <Link
                            href={`${DEBANK_URL}${address.address}`}
                            target="blank"
                            underline="hover"
                            sx={{ color: 'text.secondary', flex: 1 }}
                          >
                            Debank
                          </Link>
                        </Box>
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
                                    primary={`sent ${ethers.utils.formatUnits(
                                      transfer.value,
                                      transfer.tokenDecimal
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
                                    primary={`received ${ethers.utils.formatUnits(
                                      transfer.value,
                                      transfer.tokenDecimal
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
