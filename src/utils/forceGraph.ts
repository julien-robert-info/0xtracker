import { TrackList } from 'components/TrackAddressList'
import * as d3 from 'd3'
import { SimulationNodeDatum } from 'd3'
import {
  Datum,
  formatAddress,
  GraphData,
  Link,
  Names,
  Node,
  TransferList,
  uniqueAddressList
} from 'utils'
import { Tags } from './useExplorerTags'

type graphColors = {
  chainId: number
  node: string
  label: string
}[]

const nodeRadius = 15
const fontSize = 5
const colors: graphColors = [
  { chainId: 1, node: '#a8b9c6', label: 'ETH' },
  { chainId: 56, node: '#f0b90b', label: 'BNB' },
  { chainId: 137, node: '#8247e5', label: 'MATIC' },
  { chainId: 250, node: '#043572', label: 'FTM' },
  { chainId: 100, node: '#04795b', label: 'xDai' }
]

//legend parameters
const tickSize = 6
const l = {
  width: 320,
  height: 44 + tickSize,
  marginTop: 18,
  marginRight: 0,
  marginBottom: 16 + tickSize,
  marginLeft: 5
}
const ticks = l.width / 64
const tickFormat = d3.format('.0f')
const labelWidth = 40

export const getDataFromTransferList = (
  transferList: TransferList,
  names: Names,
  tags: Tags,
  hiddenNodes: string[]
) => {
  let nodes: Node[] = []
  let links: Link[] = []
  let list: TrackList = []

  const trackChains = [...new Set(transferList.map((item) => item.chainId))]
  // Lvl 1 Networks
  trackChains.map((chainId) => {
    list[chainId] = []
    const addresses = uniqueAddressList(
      transferList.filter((i) => i.chainId === chainId)
    ).filter((a) => a != '0x0000000000000000000000000000000000000000')
    // Lvl 2 Addresses
    addresses.map((address) => {
      // Lvl 3 Transfers
      list[chainId].push({
        address: address,
        transfers: transferList.filter(
          (i) =>
            i.chainId === chainId && (i.from === address || i.to === address)
        )
      })

      if (hiddenNodes.findIndex((n) => n === `${chainId}-${address}`) === -1) {
        nodes.push({
          id: `${chainId}-${address}`,
          chain: chainId,
          address: address,
          name: names[names.findIndex((i) => i.address === address)]?.name,
          tags: tags[
            tags.findIndex(
              (i) => i.address === address && i.chainId === chainId
            )
          ]?.tag.labels,
          color: colors[colors.findIndex((i) => i.chainId === chainId)].node
        })
      }
    })
  })

  //get links
  nodes.map((sourceNode) => {
    nodes
      .filter(
        (i) => i.chain === sourceNode.chain && i.address !== sourceNode.address
      )
      .map((targetNode) => {
        const linkValue = transferList.filter(
          (i) =>
            i.chainId === sourceNode.chain &&
            ((i.from === sourceNode.address && i.to === targetNode.address) ||
              (i.from === targetNode.address && i.to === sourceNode.address))
        ).length

        if (
          links.findIndex(
            (i) =>
              (i.source === sourceNode.id && i.target === targetNode.id) ||
              (i.source === targetNode.id && i.target === sourceNode.id)
          ) === -1 &&
          linkValue > 0
        ) {
          links.push({
            source: sourceNode.id,
            target: targetNode.id,
            value: linkValue
          })
        }
      })
  })

  const graphData: GraphData = { nodes: nodes, links: links }

  return { graph: graphData, list: list }
}

const initLinkLegend = (
  selection: d3.Selection<SVGGElement, unknown, HTMLElement, any>
) => {
  const linkLegend = selection
    .append('g')
    .attr('class', 'linkLegend')
    .attr('visibility', 'hidden')

  linkLegend
    .append('image')
    .attr('x', l.marginLeft)
    .attr('y', l.marginTop)
    .attr('width', l.width - l.marginLeft - l.marginRight)
    .attr('height', l.height - l.marginTop - l.marginBottom)
    .attr('preserveAspectRatio', 'none')

  linkLegend
    .append('g')
    .attr('transform', `translate(0,${l.height - l.marginBottom})`)
    .append('text')
    .attr('class', 'title')
    .attr('x', l.marginLeft + 6)
    .attr('y', l.marginTop + l.marginBottom - l.height - 6)
    .attr('fill', 'currentColor')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold')
    .text('Transfers')
}

export const initGraph = (svgRef: React.MutableRefObject<null>) => {
  if (svgRef.current) {
    const svg = d3.select(svgRef.current)

    const graph = svg.append('g').attr('class', 'graph')
    graph.append('g').attr('class', 'links')
    graph.append('g').attr('class', 'nodes')

    const legend = svg.append('g').attr('class', 'legend')
    initLinkLegend(legend)

    legend
      .append('g')
      .attr('class', 'nodeLegend')
      .attr('transform', `translate(0,${l.height + l.marginTop})`)
      .attr('visibility', 'hidden')
  }
}

const ramp = (color: any, n = 256) => {
  const canvas = document.createElement('canvas')
  canvas.width = n
  canvas.height = 1
  const context = canvas.getContext('2d')
  if (context) {
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1))
      context.fillRect(i, 0, 1, 1)
    }
  }
  return canvas
}

const appendNode = (
  selection: d3.Selection<d3.EnterElement, Node, d3.BaseType, unknown>,
  onNodeClick: (selected: string | null) => void,
  textColor: string
) => {
  let g = selection.append('g').attr('cursor', 'pointer')

  g.append('circle')
    .attr('r', nodeRadius)
    .attr('fill', (d) => d.color)
    .attr('fill-opacity', '.2')
    .attr('stroke', (d) => d.color)

  g.append('text')
    .attr('dy', '.3em')
    .attr('fill', textColor)
    .attr('font-size', fontSize)
    .attr('font-weight', 'bold')
    .style('text-anchor', 'middle')
    .text((d) => (d.name ? d.name : `${formatAddress(d.address, 8)}`))

  g.on('mouseover', (e) => {
    d3.select(e.currentTarget)
      .select('circle')
      .attr('fill-opacity', '.8')
      .attr('stroke', textColor)
  })
    .on('mouseout', (e, d) => {
      d3.select(e.currentTarget)
        .select('circle')
        .attr('fill-opacity', '.2')
        .attr('stroke', () => d.color)
    })
    .on('click', (e, d) => {
      d3.select(e.currentTarget)
      onNodeClick(d.id)
    })

  return g
}

const updateNode = (
  selection: d3.Selection<d3.BaseType, Node, d3.BaseType, unknown>,
  onNodeClick: (selected: string | null) => void,
  textColor: string
) => {
  selection
    .select('circle')
    .attr('fill', (d) => d.color)
    .attr('fill-opacity', '.2')
    .attr('stroke', (d) => d.color)

  selection
    .select('text')
    .attr('fill', textColor)
    .text((d) =>
      d.name ? d.name : d.tags ? d.tags[0] : `${formatAddress(d.address, 8)}`
    )

  selection
    .on('mouseover', (e) => {
      d3.select(e.currentTarget)
        .select('circle')
        .attr('fill-opacity', '.8')
        .attr('stroke', textColor)
    })
    .on('mouseout', (e, d) => {
      d3.select(e.currentTarget)
        .select('circle')
        .attr('fill-opacity', '.2')
        .attr('stroke', () => d.color)
    })
    .on('click', (e, d) => {
      onNodeClick(d.id)
    })

  return selection
}

export const setNodeSelected = (
  svgRef: React.MutableRefObject<null>,
  id: string | null,
  textColor: string
) => {
  if (!svgRef.current) {
    return
  }

  const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)

  //unselect all nodes
  svg
    .select('.nodes')
    .selectAll('g')
    .on('mouseover', (e) => {
      d3.select(e.currentTarget)
        .select('circle')
        .attr('fill-opacity', '.8')
        .attr('stroke', textColor)
    })
    .on('mouseout', (e, d: any) => {
      d3.select(e.currentTarget)
        .select('circle')
        .attr('fill-opacity', '.2')
        .attr('stroke', () => d.color)
    })
    .select('circle')
    .attr('fill-opacity', '.2')
    .attr('stroke', (d: any) => d.color)

  if (id !== null) {
    svg
      .select('.nodes')
      .selectAll('g')
      .select(function (d: any) {
        return d.id == id ? this : null
      })
      .on('mouseover', () => {})
      .on('mouseout', () => {})
      .select('circle')
      .attr('fill-opacity', '.8')
      .attr('stroke', textColor)
  }
}

export const hideNodes = (
  svgRef: React.MutableRefObject<null>,
  nodes: string[]
) => {
  if (!svgRef.current) {
    return
  }

  const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
  svg
    .select('.nodes')
    .selectAll('g')
    .attr('position', 'relative')
    .attr('visibility', 'visible')

  if (nodes.length > 0) {
    svg
      .select('.nodes')
      .selectAll('g')
      .select(function (d: any) {
        return nodes.findIndex((n) => d.id === n) !== -1 ? this : null
      })
      .attr('position', 'absolute')
      .attr('visibility', 'hidden')
  }
}

const updateLinkLegend = (
  selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  linkColors: d3.ScaleSequential<string, never>
) => {
  selection.attr('visibility', 'visible')
  const x = Object.assign(
    linkColors
      .copy()
      .interpolator(d3.interpolateRound(l.marginLeft, l.width - l.marginRight)),
    {
      range() {
        return [l.marginLeft, l.width - l.marginRight]
      }
    }
  )
  const n = Math.round(ticks + 1)
  const tickValues = d3
    .range(n)
    .map((i) => d3.quantile(linkColors.domain(), i / (n - 1)))

  selection
    .select('image')
    .attr('xlink:href', ramp(linkColors.interpolator()).toDataURL())

  selection
    .select<SVGGElement>('g')
    .call(
      d3
        .axisBottom(x)
        .ticks(ticks)
        .tickFormat(tickFormat)
        .tickSize(tickSize)
        .tickValues(tickValues as number[])
    )
    .call((g) =>
      g
        .selectAll('.tick line')
        .attr('y1', l.marginTop + l.marginBottom - l.height)
    )
    .call((g) => g.select('.domain').remove())
}

const updateNodeLegend = (
  selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  colorList: string[],
  textColor: string
) => {
  selection
    .attr('visibility', 'visible')
    .selectAll('g')
    .data(colorList)
    .join((enter) => {
      let g = enter
        .append('g')
        .attr(
          'transform',
          (d, i) =>
            `translate(${
              l.marginLeft +
              nodeRadius +
              i * ((l.marginLeft + nodeRadius) * 2 + labelWidth)
            },0)`
        )

      g.append('circle')
        .attr('r', nodeRadius)
        .attr('fill', (d) => d)
        .attr('fill-opacity', '.8')

      g.append('text')
        .attr('dy', '.3em')
        .attr('x', l.marginLeft + nodeRadius)
        .attr('fill', textColor)
        .text((d) => colors[colors.findIndex((i) => i.node === d)].label)

      return g
    })
}

const getSimulation = (
  graphData: GraphData,
  width: number,
  height: number,
  links: d3.Selection<d3.BaseType | SVGLineElement, Link, d3.BaseType, unknown>,
  nodes: d3.Selection<d3.BaseType | SVGGElement, Node, d3.BaseType, unknown>
) => {
  return d3
    .forceSimulation(graphData.nodes as SimulationNodeDatum[])
    .force(
      'link',
      d3
        .forceLink(graphData.links)
        .id((d: SimulationNodeDatum) => (d as Node).id)
    )
    .force('charge', d3.forceManyBody().strength(-5))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force(
      'collide',
      d3
        .forceCollide()
        .radius(nodeRadius + 10)
        .strength(0.5)
    )
    .on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      nodes.attr('transform', (d: any) => 'translate(' + d.x + ',' + d.y + ')')
    })
}

const addZoomFeat = (
  selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  width: number,
  height: number
) => {
  selection.call(
    d3
      .zoom<SVGSVGElement, unknown>()
      .extent([
        [0, 0],
        [width, height]
      ])
      .scaleExtent([-1, 8])
      .on('zoom', (event: any) => {
        selection.select('.graph').attr('transform', event.transform)
      })
  )
}

const addDragNDropFeat = (
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
) => {
  d3.select('.nodes')
    .selectAll<SVGGElement, Datum>('g')
    .call(
      d3
        .drag<SVGGElement, Datum>()
        .on('start', (event: any, d: Datum) => {
          if (!event.active) {
            simulation.alphaTarget(0.3).restart()
          }
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event: any, d: Datum) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event: any, d: Datum) => {
          if (!event.active) {
            simulation.alphaTarget(0)
          }
          d.fx = null
          d.fy = null
        })
    )
}

export const updateGraph = (
  svgRef: React.MutableRefObject<null>,
  graphData: GraphData,
  onNodeClick: (selected: string | null) => void,
  width: number,
  height: number,
  themeMode: string,
  textColor: string
) => {
  if (svgRef.current) {
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
    const linkColors = d3
      .scaleSequential()
      .domain(<[number, number]>d3.extent(graphData.links, (d) => d.value))
      .interpolator(
        themeMode === 'dark' ? d3.interpolateCool : d3.interpolateWarm
      )

    const link = svg
      .select('.links')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke-width', 2)
      .attr('stroke', (d) => linkColors(d.value))

    const node = svg
      .select('.nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .join(
        (enter) => {
          return appendNode(enter, onNodeClick, textColor)
        },
        (update) => {
          return updateNode(update, onNodeClick, textColor)
        }
      )

    const simulation = getSimulation(graphData, width, height, link, node)

    //Legend
    const linkLegend = svg.select('.linkLegend')
    if (graphData.links.length === 0) {
      linkLegend.attr('visibility', 'hidden')
    } else {
      updateLinkLegend(linkLegend, linkColors)
    }

    const colorList = [...new Set(graphData.nodes.map((item) => item.color))]
    const nodeLegend = svg.select('.nodeLegend')
    if (colorList.length < 2) {
      nodeLegend.attr('visibility', 'hidden')
    } else {
      updateNodeLegend(nodeLegend, colorList, textColor)
    }

    //graph features
    addZoomFeat(svg, width, height)
    addDragNDropFeat(simulation)
  }
}
