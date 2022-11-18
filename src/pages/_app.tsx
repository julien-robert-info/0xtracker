import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { createEmotionCache } from 'utils'
import { CssBaseline } from '@mui/material'

import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/700.css'
import { Layout } from 'components/Layout'
import { AppThemeProvider } from 'components/Theme'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

const App: React.FC<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>0xTracker</title>
          <meta name="description" content="Ethereum address tracking tool" />
        </Head>
        <AppThemeProvider>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppThemeProvider>
      </CacheProvider>
    </>
  )
}

export default App
