import { render, screen } from '@testing-library/react'
import TrackAddressGraph from 'components/TrackAddressGraph'
import { mockedTransferList } from 'tests/__mocks__/TrackAddressList'
import { Names, Tags, TrackerContext, TransferList } from 'utils'

describe('TrackAddressGraph component', () => {
  it('init the svg', () => {
    const transferList: TransferList = []
    const names: Names = []
    const tags: Tags = []
    const fetchList = { current: [] }
    const addSearch = jest.fn()
    const isLoading = false
    const search = jest.fn()

    const { container } = render(
      <TrackerContext.Provider
        value={{
          transferList,
          names,
          tags,
          fetchList,
          addSearch,
          isLoading,
          search
        }}
      >
        <TrackAddressGraph />
      </TrackerContext.Provider>
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
    const tags: Tags = []
    const fetchList = { current: [] }
    const addSearch = jest.fn()
    const isLoading = false
    const search = jest.fn()

    const { container, rerender } = render(
      <TrackerContext.Provider
        value={{
          transferList,
          names,
          tags,
          fetchList,
          addSearch,
          isLoading,
          search
        }}
      >
        <TrackAddressGraph />
      </TrackerContext.Provider>
    )

    transferList = mockedTransferList
    rerender(
      <TrackerContext.Provider
        value={{
          transferList,
          names,
          tags,
          fetchList,
          addSearch,
          isLoading,
          search
        }}
      >
        <TrackAddressGraph />
      </TrackerContext.Provider>
    )

    const nodes = container.querySelector('.nodes')
    const links = container.querySelector('.links')

    expect(nodes?.childElementCount).toBe(5)
    expect(links?.childElementCount).toBe(4)
  })

  it('render names', async () => {
    let transferList: TransferList = []
    let names: Names = []
    const tags: Tags = []
    const fetchList = { current: [] }
    const addSearch = jest.fn()
    const isLoading = false
    const search = jest.fn()

    const { rerender } = render(
      <TrackerContext.Provider
        value={{
          transferList,
          names,
          tags,
          fetchList,
          addSearch,
          isLoading,
          search
        }}
      >
        <TrackAddressGraph />
      </TrackerContext.Provider>
    )

    transferList = mockedTransferList
    names = [
      {
        address: '0x000000000000000000000000000000000000dead',
        name: 'vitalik.eth'
      }
    ]
    rerender(
      <TrackerContext.Provider
        value={{
          transferList,
          names,
          tags,
          fetchList,
          addSearch,
          isLoading,
          search
        }}
      >
        <TrackAddressGraph />
      </TrackerContext.Provider>
    )

    const name = screen.findByText('vitalik.eth', { selector: 'text' })

    expect(await name).toBeInTheDocument()
  })
})
