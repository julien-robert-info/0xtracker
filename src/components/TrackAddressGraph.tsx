import React from 'react'
import {
  getDataFromTransferList,
  GraphData,
  initGraph,
  Names,
  TransferList,
  updateGraph,
  useD3
} from 'utils'
import { useTheme } from '@mui/material/styles'

const TrackAddressGraph: React.FC<{
  transferList: TransferList
  names: Names
}> = ({ transferList, names }) => {
  const didMount = React.useRef(false)
  const { svgRef, svgContainerRef, width, height } = useD3()
  const graphData: GraphData = React.useMemo(
    () => getDataFromTransferList(transferList, names),
    [transferList, names]
  )

  // Needed for svg backgroundColor
  const theme = useTheme()

  // init graph on 1st render then update graph on graphData update
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
    <div ref={svgContainerRef} style={{ maxHeight: '800px' }} role="graph">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ backgroundColor: theme.palette.action.disabledBackground }}
      ></svg>
    </div>
  )
}

export default TrackAddressGraph
