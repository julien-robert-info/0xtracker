import React from 'react'

export type Node = {
  id: string
  chain: number
  address: string
  name?: string
  color: string
  textColor: string
}

export type Link = {
  source: string
  target: string
  value: number
}

export type GraphData = {
  nodes: Node[]
  links: Link[]
}

export type Datum = {
  x: number
  y: number
  fx: number | null
  fy: number | null
}

export const useD3 = () => {
  const svgRef = React.useRef(null)
  const svgContainerRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(1080)
  const [height, setHeight] = React.useState(720)

  const getsvgContainerSize = () => {
    if (svgContainerRef.current) {
      setWidth(svgContainerRef.current.clientWidth)
      setHeight(svgContainerRef.current.clientHeight)
    }
  }

  // Update width & height properties on window resize event
  React.useEffect(() => {
    getsvgContainerSize()
    window.addEventListener('resize', getsvgContainerSize)
    return () => window.removeEventListener('resize', getsvgContainerSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { svgRef, svgContainerRef, getsvgContainerSize, width, height }
}
