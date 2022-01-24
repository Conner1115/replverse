import '../styles/globals.css'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar';
import Script from 'next/script';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/*" href="/logo.svg"/>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Replverse" />
        <meta property="og:description" content="Replverse is a rip-off recreation of replit apps, made by IroncladDev.  Replverse includes the most asked-for and requested features such as Following users, a powerful algorithm, a search engine, and more." />
        <meta property="og:image" content="/site.gif" />
        <meta property="og:image:type" content="image/*" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="675" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="copyright" content="2021" />
      </Head>
      <NextNProgress options={{showSpinner: false}} color="var(--accent-primary-default)"/>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></Script>
    </>
  )
}

export default MyApp
