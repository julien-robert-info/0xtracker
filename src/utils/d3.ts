import React from 'react'

export type Node = {
  id: string
  chain: number
  address: string
  name?: string
  tags?: string[]
  color: string
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
      //weird result between mobile and desktop
      setHeight(
        (window.innerHeight < window.outerHeight
          ? window.innerHeight
          : window.outerHeight) - svgContainerRef.current.offsetTop
      )
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
