import { fireEvent, render, screen } from '@testing-library/react'
import TrackAddressList from 'components/TrackAddressList'
import { mockedTransferList } from 'tests/__mocks__/TrackAddressList'
import { Names, TransferList } from 'utils'

describe('TrackAddresslist component', () => {
  it('render nothing if transferList empty', () => {
    const transferList: TransferList = []
    const names: Names = []

    render(<TrackAddressList transferList={transferList} names={names} />)

    const accordionMenu = screen.queryByRole('button', {
      name: /Polygon/i
    })

    expect(accordionMenu).not.toBeInTheDocument()
  })

  it('render accordion menu', async () => {
    const transferList: TransferList = mockedTransferList
    const names: Names = []

    render(<TrackAddressList transferList={transferList} names={names} />)

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
    const names: Names = [
      {
        address: '0x000000000000000000000000000000000000dead',
        name: 'vitalik.eth'
      }
    ]

    render(<TrackAddressList transferList={transferList} names={names} />)

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
