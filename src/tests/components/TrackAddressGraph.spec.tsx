import { render, screen } from '@testing-library/react'
import TrackAddressGraph from 'components/TrackAddressGraph'
import { mockedTransferList } from 'tests/__mocks__/TrackAddressList'
import { Names, TransferList } from 'utils'

describe('TrackAddressGraph component', () => {
  it('init the svg', () => {
    const transferList: TransferList = []
    const names: Names = []
    const fetchList = { current: [] }
    const addSearch = jest.fn()

    const { container } = render(
      <TrackAddressGraph
        transferList={transferList}
        names={names}
        fetchList={fetchList}
        addSearch={addSearch}
      />
    )

    const graph = container.querySelector('.graph')
    expect(graph).toBeInTheDocument()
    expect(graph?.querySelector('.nodes')).toBeInTheDocument()
    expect(graph?.querySelector('.links')).toBeInTheDocument()
    expect(container.querySelector('.legend')).toBeInTheDocument()
  })

  it('render nodes and links', () => {
    let transferList: TransferList = []
    const names: Names = []
    const fetchList = { current: [] }
    const addSearch = jest.fn()

    const { container, rerender } = render(
      <TrackAddressGraph
        transferList={transferList}
        names={names}
        fetchList={fetchList}
        addSearch={addSearch}
      />
    )

    transferList = mockedTransferList
    rerender(
      <TrackAddressGraph
        transferList={transferList}
        names={names}
        fetchList={fetchList}
        addSearch={addSearch}
      />
    )

    const nodes = container.querySelector('.nodes')
    const links = container.querySelector('.links')

    expect(nodes?.childElementCount).toBe(5)
    expect(links?.childElementCount).toBe(4)
  })

  it('render names', async () => {
    let transferList: TransferList = []
    let names: Names = []
    const fetchList = { current: [] }
    const addSearch = jest.fn()

    const { rerender } = render(
      <TrackAddressGraph
        transferList={transferList}
        names={names}
        fetchList={fetchList}
        addSearch={addSearch}
      />
    )

    transferList = mockedTransferList
    names = [
      {
        address: '0x000000000000000000000000000000000000dead',
        name: 'vitalik.eth'
      }
    ]
    rerender(
      <TrackAddressGraph
        transferList={transferList}
        names={names}
        fetchList={fetchList}
        addSearch={addSearch}
      />
    )

    const name = screen.findByText('vitalik.eth', { selector: 'text' })

    expect(await name).toBeInTheDocument()
  })
})
