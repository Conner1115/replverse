import '../styles/globals.css'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar';
import Script from 'next/script';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="google-site-verification" content="bkRxvS08xIT7SSv2FWIDnI70Ugu0nLprZnS3Eidl9vA" />
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-220435644-1"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-220435644-1', { page_path: window.location.pathname });
            `,
          }}
        />
          <script dangerouslySetInnerHTML={{
            html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KDFR3D8');`
          }}/>
        <meta name="apple-mobile-web-app-title" content="ABC App"/>
        <meta name="msapplication-TileImage" content="/logo.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="apple-touch-icon" href="/logo.png"/>
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
        {/*<meta name="viewport" content="viewport-fit=cover" />*/}
      </Head>
      <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KDFR3D8"
height="0" width="0" style="display:none;visibility:hidden"></iframe>          </noscript>
      <NextNProgress options={{showSpinner: false}} color="var(--accent-primary-default)"/>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></Script>
    </>
  )
}

export default MyApp
