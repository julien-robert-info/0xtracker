import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { chains } from 'data/networks'
import { TransferList } from 'utils'
import TrackAddressListItem from './TrackAddressListItem'

export type TrackList = Array<
  Array<{
    address: string
    transfers: TransferList
  }>
>

interface TrackAddressListProps {
  list: TrackList
  selected: string | null
  setSelected: (selected: string | null) => void
  hiddenNodes: string[]
  setHiddenNodes: (nodes: string[]) => void
}

const TrackAddressList: React.FC<TrackAddressListProps> = ({
  list,
  selected,
  setSelected,
  hiddenNodes,
  setHiddenNodes
}) => {
  return (
    <Box maxWidth={300}>
      {list.map((items, chainId) => (
        <Accordion key={chainId} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="caption" sx={{ ml: 1 }}>
              {chains[chainId].chainName} ({items.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {items
                .sort((a, b) => b.transfers.length - a.transfers.length)
                .map((item) => (
                  <TrackAddressListItem
                    key={`${chainId}-${item.address}`}
                    item={item}
                    chainId={chainId}
                    selected={selected}
                    setSelected={setSelected}
                    hiddenNodes={hiddenNodes}
                    setHiddenNodes={setHiddenNodes}
                  />
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default TrackAddressList
