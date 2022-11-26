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
