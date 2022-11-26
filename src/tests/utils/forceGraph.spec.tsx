import { getDataFromTransferList, Names, TransferList } from 'utils'
import { mockedTransferList } from 'tests/__mocks__/TrackAddressList'
import { render } from 'react-dom'

describe('forceGraph helper getDataFromTransferList', () => {
  it('find nodes and links', async () => {
    const transferList: TransferList = mockedTransferList
    const names: Names = []

    const data = getDataFromTransferList(transferList, names)

    expect(data.nodes).toHaveLength(5)
    expect(data.links).toHaveLength(4)
  })
})
