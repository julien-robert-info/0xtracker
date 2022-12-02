import * as d3 from 'd3'
import { SimulationNodeDatum } from 'd3'
import {
  Datum,
  DEBANK_URL,
  GraphData,
  Link,
  Names,
  Node,
  TransferList
} from 'utils'

type graphColors = {
  chainId: number
  node: string
  text: string
  label: string
}[]

const nodeRadius = 15
const fontSize = 5
const colors: graphColors = [
  { chainId: 1, node: '#a8b9c6', text: '#44494c', label: 'ETH' },
  { chainId: 56, node: '#f0b90b', text: '#4a4f55', label: 'BNB' },
  { chainId: 137, node: '#8247e5', text: '#e5ecf3', label: 'MATIC' },
  { chainId: 250, node: '#043572', text: '#fff', label: 'FTM' },
  { chainId: 100, node: '#04795b', text: '#fff', label: 'xDai' }
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
  names: Names
) => {
  let nodes: Node[] = []
  let links: Link[] = []

  //get nodes
  transferList.map((transfer) => {
    if (
      nodes.findIndex(
        (i) => i.id === `${transfer.chainId}-${transfer.source}`
      ) === -1
    ) {
      nodes.push({
        id: `${transfer.chainId}-${transfer.source}`,
        chain: transfer.chainId,
        address: transfer.source,
        name: names[names.findIndex((i) => i.address === transfer.source)]
          ?.name,
        color:
          colors[colors.findIndex((i) => i.chainId === transfer.chainId)].node,
        textColor:
          colors[colors.findIndex((i) => i.chainId === transfer.chainId)].text
      })
    }

    if (
      nodes.findIndex(
        (i) => i.id === `${transfer.chainId}-${transfer.target}`
      ) === -1
    ) {
      nodes.push({
        id: `${transfer.chainId}-${transfer.target}`,
        chain: transfer.chainId,
        address: transfer.target,
        name: names[names.findIndex((i) => i.address === transfer.target)]
          ?.name,
        color:
          colors[colors.findIndex((i) => i.chainId === transfer.chainId)].node,
        textColor:
          colors[colors.findIndex((i) => i.chainId === transfer.chainId)].text
      })
    }
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
            ((i.source === sourceNode.address &&
              i.target === targetNode.address) ||
              (i.source === targetNode.address &&
                i.target === sourceNode.address))
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

  return graphData
}

export const initGraph = (svgRef: React.MutableRefObject<null>) => {
  if (svgRef.current) {
    const svg = d3.select(svgRef.current)

    const graph = svg.append('g').attr('class', 'graph')
    graph.append('g').attr('class', 'links')
    graph.append('g').attr('class', 'nodes')

    const legend = svg.append('g').attr('class', 'legend')
    const linkLegend = legend
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

export const updateGraph = (
  svgRef: React.MutableRefObject<null>,
  graphData: GraphData,
  width: number,
  height: number
) => {
  if (svgRef.current) {
    const simulation = d3
      .forceSimulation(graphData.nodes as SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(graphData.links)
          .id((d: SimulationNodeDatum) => (d as Node).id)
      )
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(nodeRadius + 10))
      .on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y)

        node.attr('transform', (d: any) => 'translate(' + d.x + ',' + d.y + ')')
      })

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
    const linkColors = d3
      .scaleSequential()
      .domain(<[number, number]>d3.extent(graphData.links, (d) => d.value))
      .interpolator(d3.interpolateCool)

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
          let g = enter.append('g')

          g.append('circle')
            .attr('r', nodeRadius)
            .attr('fill', (d) => d.color)

          g.append('a')
            .attr('xlink:href', (d) => `${DEBANK_URL}${d.address}`)
            .attr('target', 'blank')
            .append('text')
            .attr('dy', '.3em')
            .attr('fill', (d) => d.textColor)
            .attr('font-size', fontSize)
            .attr('font-weight', 'bold')
            .style('text-anchor', 'middle')
            .text((d) =>
              d.name
                ? d.name
                : `0x...${d.address.substring(d.address.length - 4)}`
            )

          return g
        },
        (update) => {
          update.select('circle').attr('fill', (d) => d.color)
          update
            .select('a')
            .attr('xlink:href', (d) => `${DEBANK_URL}${d.address}`)
          update
            .select('text')
            .attr('fill', (d) => d.textColor)
            .text((d) =>
              d.name
                ? d.name
                : `0x...${d.address.substring(d.address.length - 4)}`
            )

          return update
        }
      )

    //Legend
    const linkLegend = svg.select('.linkLegend')
    if (graphData.links.length === 0) {
      linkLegend.attr('visibility', 'hidden')
    } else {
      linkLegend.attr('visibility', 'visible')
      const x = Object.assign(
        linkColors
          .copy()
          .interpolator(
            d3.interpolateRound(l.marginLeft, l.width - l.marginRight)
          ),
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

      linkLegend
        .select('image')
        .attr('xlink:href', ramp(linkColors.interpolator()).toDataURL())

      linkLegend
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

    const colorList = [...new Set(graphData.nodes.map((item) => item.color))]
    const nodeLegend = svg.select('.nodeLegend')
    if (colorList.length < 2) {
      nodeLegend.attr('visibility', 'hidden')
    } else {
      nodeLegend
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

          g.append('text')
            .attr('dy', '.3em')
            .attr('x', l.marginLeft + nodeRadius)
            .attr('fill', 'currentColor')
            .text((d) => colors[colors.findIndex((i) => i.node === d)].label)

          return g
        })
    }

    //Zoom
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .extent([
          [0, 0],
          [width, height]
        ])
        .scaleExtent([1, 8])
        .on('zoom', (event: any) => {
          svg.select('.graph').attr('transform', event.transform)
        })
    )

    //Drag & drop
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
}
