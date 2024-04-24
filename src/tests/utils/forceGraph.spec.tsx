import { getDataFromTransferList, Names, Tags, TransferList } from 'utils'
import { mockedTransferList } from 'tests/__mocks__/TrackAddressList'

describe('forceGraph helper getDataFromTransferList', () => {
  it('find nodes and links', async () => {
    const transferList: TransferList = mockedTransferList
    const names: Names = []
    const tags: Tags = []

    const data = getDataFromTransferList(transferList, names, tags, [])

    expect(data.graph.nodes).toHaveLength(5)
    expect(data.graph.links).toHaveLength(4)
    expect(data.list).toHaveLength(138)
    expect(data.list[137]).toHaveLength(5)
  })
})
