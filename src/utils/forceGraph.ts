import { GraphData, Link, Names, Node, TransferList } from 'utils'

type graphColors = {
  chainId: number
  node: string
  text: string
  label: string
}[]

const colors: graphColors = [
  { chainId: 1, node: '#a8b9c6', text: '#44494c', label: 'ETH' },
  { chainId: 56, node: '#f0b90b', text: '#4a4f55', label: 'BNB' },
  { chainId: 137, node: '#8247e5', text: '#e5ecf3', label: 'MATIC' },
  { chainId: 250, node: '#043572', text: '#fff', label: 'FTM' },
  { chainId: 100, node: '#04795b', text: '#fff', label: 'xDai' }
]

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
