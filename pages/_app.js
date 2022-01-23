import '../styles/globals.css'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar';
import Script from 'next/script';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/*" href="/logo.svg"/>
      </Head>
      <NextNProgress options={{showSpinner: false}} color="var(--accent-primary-default)"/>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></Script>
    </>
  )
}

export default MyApp
