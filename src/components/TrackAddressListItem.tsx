import React from 'react'
import { ethers } from 'ethers'
import {
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
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DownloadIcon from '@mui/icons-material/Download'
import { DEBANK_URL, TransferList, formatAddress, useTracker } from 'utils'

export type AddressItem = {
  address: string
  transfers: TransferList
}

interface TrackAddressListItemProps {
  item: AddressItem
  chainId: number
  selected: string | null
  setSelected: (selected: string | null) => void
  hiddenNodes: string[]
  setHiddenNodes: (nodes: string[]) => void
}

const TrackAddressListItem: React.FC<TrackAddressListItemProps> = ({
  item,
  chainId,
  selected,
  setSelected,
  hiddenNodes,
  setHiddenNodes
}) => {
  const { fetchList, names, tags, addSearch } = useTracker()
  return (
    <Box>
      <ListItemButton
        alignItems="flex-start"
        selected={selected === `${chainId}-${item.address}`}
        autoFocus={selected === `${chainId}-${item.address}`}
        onClick={() =>
          selected !== `${chainId}-${item.address}`
            ? setSelected(`${chainId}-${item.address}`)
            : setSelected(null)
        }
        sx={{
          opacity:
            hiddenNodes.findIndex((n) => n === `${chainId}-${item.address}`) !==
            -1
              ? 0.4
              : 1
        }}
      >
        <ListItemText
          primary={`${formatAddress(
            names.findIndex((i) => i.address === item.address) !== -1
              ? names[names.findIndex((i) => i.address === item.address)].name
              : tags.findIndex(
                  (i) => i.chainId === chainId && i.address === item.address
                ) !== -1
              ? tags[
                  tags.findIndex(
                    (i) => i.chainId === chainId && i.address === item.address
                  )
                ].tag.name
              : item.address,
            20
          )}`}
          primaryTypographyProps={{
            fontSize: 'caption.fontSize'
          }}
        />
        <Typography variant="caption">({item.transfers.length})</Typography>
      </ListItemButton>
      <Collapse in={selected === `${chainId}-${item.address}`}>
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
                (i) => i.chainId === chainId && i.address === item.address
              )
            ]?.tag.labels.map((label, i) => (
              <Chip
                key={`tag-${i}-${chainId}-${item.address}`}
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
                      search.address === item.address
                  ) !== -1
                }
                onClick={() =>
                  addSearch({
                    chainId: chainId,
                    address: item.address
                  })
                }
              >
                <DownloadIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1 }}>
              {hiddenNodes.findIndex(
                (node) => node === `${chainId}-${item.address}`
              ) !== -1 ? (
                <IconButton
                  aria-label="show"
                  size="small"
                  onClick={() =>
                    setHiddenNodes(
                      hiddenNodes.filter(
                        (node) => node !== `${chainId}-${item.address}`
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
                      `${chainId}-${item.address}`
                    ])
                  }
                >
                  <VisibilityOffIcon fontSize="inherit" />
                </IconButton>
              )}
            </Box>
            <Link
              href={`${DEBANK_URL}${item.address}`}
              target="blank"
              underline="hover"
              sx={{ color: 'text.secondary', flex: 1 }}
            >
              Debank
            </Link>
          </Box>
          <List>
            {item.transfers
              .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
              .map((transfer, i) => (
                <ListItem key={`${chainId}-${item.address}-${i}`}>
                  {transfer.from == item.address ? (
                    <ListItemText
                      primary={`sent ${ethers.utils.formatUnits(
                        transfer.value,
                        transfer.tokenDecimal
                      )} ${transfer.tokenSymbol} to ${formatAddress(
                        names.findIndex((i) => i.address === transfer.to) !== -1
                          ? names[
                              names.findIndex((i) => i.address === transfer.to)
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
                      )} ${transfer.tokenSymbol} from ${formatAddress(
                        names.findIndex((i) => i.address === transfer.from) !==
                          -1
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
  )
}

export default TrackAddressListItem
