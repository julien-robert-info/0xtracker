import React from 'react'
import {
  getDataFromTransferList,
  GraphData,
  initGraph,
  setNodeSelected,
  updateGraph,
  useD3,
  useTracker
} from 'utils'
import { useTheme } from '@mui/material/styles'
import { Button, Collapse, IconButton, Paper } from '@mui/material'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import ListIcon from '@mui/icons-material/List'
import TrackAddressList, { TrackList } from './TrackAddressList'

const TrackAddressGraph = () => {
  const didMount = React.useRef(false)
  const theme = useTheme()
  const { svgRef, svgContainerRef, width, height } = useD3()
  const [displayList, setDisplayList] = React.useState(true)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [hiddenNodes, setHiddenNodes] = React.useState<string[]>([])
  const { transferList, names, tags } = useTracker()
  const data: { graph: GraphData; list: TrackList } = React.useMemo(
    () => getDataFromTransferList(transferList, names, tags, hiddenNodes),
    [transferList, names, tags, hiddenNodes]
  )

  // init graph on 1st render then update graph on graphData update
  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      initGraph(svgRef)
      return
    }

    updateGraph(
      svgRef,
      data.graph,
      setSelected,
      width,
      height,
      theme.palette.mode,
      theme.palette.text.secondary
    )
    setNodeSelected(svgRef, selected, theme.palette.text.secondary)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, theme])

  React.useEffect(() => {
    setNodeSelected(svgRef, selected, theme.palette.text.secondary)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <div
      ref={svgContainerRef}
      style={{
        position: 'relative',
        height: height,
        maxHeight: '800px',
        overflow: 'hidden'
      }}
      role="graph"
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ backgroundColor: theme.palette.action.disabledBackground }}
      ></svg>
      <Button
        variant="outlined"
        startIcon={<ListIcon />}
        onClick={() => setDisplayList(true)}
        sx={{
          position: 'absolute',
          top: 15,
          right: 40
        }}
      >
        List
      </Button>
      <Collapse in={displayList} orientation="horizontal">
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            px: 2,
            height: height,
            overflow: 'auto'
          }}
        >
          <IconButton
            onClick={(e) => setDisplayList(false)}
            sx={{ mt: 1, p: '10px' }}
            aria-label="hide list"
          >
            <KeyboardDoubleArrowRightIcon
              fontSize="large"
              sx={{ color: 'primary.light' }}
            />
          </IconButton>
          <TrackAddressList
            list={data.list}
            selected={selected}
            setSelected={setSelected}
            hiddenNodes={hiddenNodes}
            setHiddenNodes={setHiddenNodes}
          />
        </Paper>
      </Collapse>
    </div>
  )
}

export default TrackAddressGraph
