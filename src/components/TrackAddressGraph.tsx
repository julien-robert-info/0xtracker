import React from 'react'
import {
  getDataFromTransferList,
  GraphData,
  initGraph,
  Names,
  TransferList,
  updateGraph
} from 'utils'
import { useTheme } from '@mui/material/styles'

const TrackAddressGraph: React.FC<{
  transferList: TransferList
  names: Names
}> = ({ transferList, names }) => {
  const didMount = React.useRef(false)
  const svgRef = React.useRef(null)
  const graphData: GraphData = React.useMemo(
    () => getDataFromTransferList(transferList, names),
    [transferList, names]
  )

  const width = 1080
  const height = 720
  const theme = useTheme()

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      initGraph(svgRef)
      return
    }

    updateGraph(svgRef, graphData, width, height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData])

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ backgroundColor: theme.palette.action.disabledBackground }}
    ></svg>
  )
}

export default TrackAddressGraph
