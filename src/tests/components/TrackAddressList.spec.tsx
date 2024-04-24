import { fireEvent, render, screen } from '@testing-library/react'
import TrackAddressList, { TrackList } from 'components/TrackAddressList'
import { mockedTransferList } from 'tests/__mocks__/TrackAddressList'
import {
  Names,
  Tags,
  TrackerContext,
  TransferList,
  getDataFromTransferList
} from 'utils'

describe('TrackAddresslist component', () => {
  it('render nothing if transferList empty', () => {
    const transferList: TransferList = []
    const trackList: TrackList = []
    const fetchList = { current: [] }
    const names: Names = []
    const tags: Tags = []
    const setSelected = jest.fn()
    const setHiddenNodes = jest.fn()
    const addSearch = jest.fn()
    const isLoading = false
    const search = jest.fn()

    render(
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
        <TrackAddressList
          list={trackList}
          selected={null}
          setSelected={setSelected}
          hiddenNodes={[]}
          setHiddenNodes={setHiddenNodes}
        />
      </TrackerContext.Provider>
    )

    const accordionMenu = screen.queryByRole('button', {
      name: /Polygon/i
    })

    expect(accordionMenu).not.toBeInTheDocument()
  })

  it('render accordion menu', async () => {
    const transferList: TransferList = mockedTransferList
    const fetchList = { current: [] }
    const names: Names = []
    const tags: Tags = []
    const setSelected = jest.fn()
    const setHiddenNodes = jest.fn()
    const addSearch = jest.fn()
    const isLoading = false
    const search = jest.fn()

    const data = getDataFromTransferList(transferList, names, tags, [])

    render(
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
        <TrackAddressList
          list={data.list}
          selected={null}
          setSelected={setSelected}
          hiddenNodes={[]}
          setHiddenNodes={setHiddenNodes}
        />
      </TrackerContext.Provider>
    )

    const accordionMenu = screen.findByRole('button', {
      name: /Polygon/i
    })

    expect(await accordionMenu).toBeInTheDocument()

    fireEvent.click(await accordionMenu)

    expect(
      await screen.findByRole('button', {
        name: /0x00000000...000000dead/i
      })
    ).toBeInTheDocument()
  })

  it('render names', async () => {
    const transferList: TransferList = mockedTransferList
    const fetchList = { current: [] }
    const names: Names = [
      {
        address: '0x000000000000000000000000000000000000dead',
        name: 'vitalik.eth'
      }
    ]
    const tags: Tags = []
    const setSelected = jest.fn()
    const setHiddenNodes = jest.fn()
    const addSearch = jest.fn()
    const isLoading = false
    const search = jest.fn()

    const data = getDataFromTransferList(transferList, names, tags, [])

    render(
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
        <TrackAddressList
          list={data.list}
          selected={null}
          setSelected={setSelected}
          hiddenNodes={[]}
          setHiddenNodes={setHiddenNodes}
        />
      </TrackerContext.Provider>
    )

    const accordionMenu = screen.findByRole('button', {
      name: /Polygon/i
    })

    expect(await accordionMenu).toBeInTheDocument()

    fireEvent.click(await accordionMenu)

    expect(
      await screen.findByRole('button', {
        name: /vitalik.eth/i
      })
    ).toBeInTheDocument()
  })
})
