import '../styles/globals.css'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar';
import Script from 'next/script';
//import io from 'socket.io-client';
//import {useEffect} from 'react';
//let socket = false;
function MyApp({ Component, pageProps }) {
  
  /*useEffect(async () => {
    let userData = await fetch("/api/user/__me__").then(r => r.json());
    if(userData){
      if(!socket){
        socket = io("https://replverse-data.ironcladdev.repl.co", {
          extraHeaders: {
            username: userData.username
          }
        });
      }
      socket.emit("join", {
        username: userData.username,
        avatar: userData.icon.url
      });
    }
  })*/
  
  return (
    <>
      <Head>
        <meta name="google-site-verification" content="bkRxvS08xIT7SSv2FWIDnI70Ugu0nLprZnS3Eidl9vA" />
        {/*<meta name="google-site-verification" content="_aGKlyLpRC3C0bPPncSzNpAgQc7QSVIAc7t7NmxDTaU" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="ABC App">
    <meta name="msapplication-TileImage" content="logo.png">
    <meta name="msapplication-TileColor" content="#101C2A">
    <link rel="manifest" href="https://hemsirelik.serifoglu.repl.co/manifest.json">
    <link rel="apple-touch-icon" href="logo.png">*/}
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
      <NextNProgress options={{showSpinner: false}} color="var(--accent-primary-default)"/>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></Script>
    </>
  )
}

export default MyApp
