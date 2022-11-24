import { NetworkConnector } from '@web3-react/network-connector'

interface ChainInfo {
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string
  blockExplorerUrls: string
  blockExplorerApiUrls?: string
  blockExplorerApiToken?: string
}

export const chains: { [chainId: number]: ChainInfo } = {
  1: {
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: 'https://rpc.ankr.com/eth',
    blockExplorerUrls: 'https://etherscan.io',
    blockExplorerApiUrls: 'https://api.etherscan.io/api',
    blockExplorerApiToken: process.env.NEXT_PUBLIC_ETHEREUM_API_TOKEN
  },
  56: {
    chainName: 'BSC',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: 'https://bsc-dataseed.binance.org',
    blockExplorerUrls: 'https://bscscan.com/',
    blockExplorerApiUrls: 'https://api.bscscan.com/api',
    blockExplorerApiToken: process.env.NEXT_PUBLIC_BSC_API_TOKEN
  },
  137: {
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: 'https://polygon-rpc.com',
    blockExplorerUrls: 'https://polygonscan.com/',
    blockExplorerApiUrls: 'https://api.polygonscan.com/api',
    blockExplorerApiToken: process.env.NEXT_PUBLIC_POLYGON_API_TOKEN
  },
  250: {
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18
    },
    rpcUrls: 'https://rpc.ftm.tools',
    blockExplorerUrls: 'https://ftmscan.com/',
    blockExplorerApiUrls: 'https://api.ftmscan.com/api',
    blockExplorerApiToken: process.env.NEXT_PUBLIC_FANTOM_API_TOKEN
  },
  100: {
    chainName: 'Gnosis',
    nativeCurrency: {
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18
    },
    rpcUrls: 'https://rpc.xdaichain.com/',
    blockExplorerUrls: 'https://blockscout.com/poa/xdai',
    blockExplorerApiUrls: 'https://api.polygonscan.com/api',
    blockExplorerApiToken: process.env.NEXT_PUBLIC_GNOSIS_API_TOKEN
  }
}

const urls: { [chainId: number]: string } = Object.keys(chains).reduce<{
  [chainId: number]: string
}>((accumulator, chainId) => {
  accumulator[Number(chainId)] = chains[Number(chainId)].rpcUrls

  return accumulator
}, {})

export const networkConnector = new NetworkConnector({
  urls,
  defaultChainId: 1
})
