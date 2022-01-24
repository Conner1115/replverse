import Nav from './nav';
import styles from '../styles/pages/Home.module.css'
import Head from 'next/head'
export default function Error(props){
  return (<div>
    <Head>
      <title>404 Not Found</title>
      <meta name="robots" content="noindex"/>
    </Head>
    <Nav/>
    <div style={{
      position: 'fixed',
      top: '60px',
      left: 0,
      width: '100%',
      height: 'calc(100vh - 60px)',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <h1 style={{paddingTop: 0, textAlign: 'center'}}>{props.error || "404 Not Found"}</h1>
        <h3 style={{textAlign: 'center', paddingTop: 0, marginBottom: 50}}>This page doensn&apos;t exist.</h3>
        <img src="/logo.svg" alt="Replverse Logo" style={{height: '40vh', maxHeight: '600px'}} className={styles.illustration} />
      </div>
    </div>
  </div>)
}