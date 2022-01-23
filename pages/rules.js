import Nav from '../components/nav.js'
import Footer from '../components/footer'
import Head from 'next/head'
import pos from '../styles/pos.module.css'
import ui from '../styles/ui.module.css'
export default function Rules(){
  return (
    <div>
      <Head>
        <title>Rules | Replverse</title>
      </Head>

      <div className={pos.relcont} style={{padding: '50px 0'}}>
        <h2 className={ui.header}>Community Rules</h2>
        
        <p>Replverse is meant to be a clean and helpful environment for all users.</p>
        <p>Not abiding by the rules can result in:</p>
        <p>
          <ul>
            <li>The deletion of some, or up to all your published repls on this site</li>
            <li>The disabling of your account <em>indefinitely</em></li>
            <li>An indefinite IP ban from the site</li>
          </ul>
        </p>

        <p><strong>1. Be nice</strong> - Hate speech, racism, inappropriate conversations, and other un-nice things will not be tolerated.</p>

        <p><strong>2. No NSFW content</strong> - Any obscene, inappropriate, or adult content will result in an immediate IP ban from the site as well as the deletion of your account.</p>
        
        <p><strong>3. Abide by the rules of third-parties</strong> - Breaking another company&apos;s terms of service such as selfbots, ddos attacks, proxies, etc. - are strictly not allowed.</p>

        <p><strong>4. Stealing User Data</strong> - Phishing, IP loggers, Token grabbers, malware, and other malicious content are absolutely not allowed on this site.</p>

      </div>

      <Footer/>
      <Nav/>
    </div>
  );
}