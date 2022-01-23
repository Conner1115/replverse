import ui from '../styles/ui.module.css';
import pos from '../styles/pos.module.css';
import Head from 'next/head'
import Nav from '../components/nav'
import Link from 'next/link'
import { useState } from 'react'

export default function Signup() {
  const [error, setError] = useState("")
  const [email, setEmail] = useState("");
  const [verify, setVf] = useState(false);
  const authenticate = async () => {
    window.addEventListener('message', authComplete);

    var h = 500;
    var w = 350;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);

    var authWindow = window.open(
      'https://repl.it/auth_with_repl_site?domain=' + location.host,
      '_blank',
      'modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    function authComplete(e) {
      if (e.data !== 'auth_complete') {
        return;
      }
      window.removeEventListener('message', authComplete);
      authWindow.close();
      fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          email: email
        })
      })
      .then(r => r.json())
      .then(data => {
        if(data.success){
          setVf(true);
        }else{
          setError(data.message)
        }
      })
    }
  }
  const submit = (e) => { 
    e.preventDefault();
  };
  return (
    <div className={pos.relcont}>
      <Head>
        <title>Sign Up | Replverse</title>
      </Head>
    
      {!verify && <form onSubmit={submit} style={{borderColor: 'var(--outline-dimmer)', maxWidth: 350, width: 350, padding: 20, position: 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)' }}>
        <h4 style={{ marginTop: 0, marginBottom: 10, paddingTop: 0 }}>Sign Up</h4>
        <div className={ui.formLabel}>Email Address (same as replit account)</div>
        <input autoComplete="off" className={ui.inputSmall + " " + ui.blockEl} placeholder="you@email.com" value={email} onChange={(v) => setEmail(v.target.value)} name="email" />
        <button className={ui.uiButtonDark + " " + ui.blockEl} onClick={authenticate}>Sign Up</button>
        <div className={ui.errorText + " " + ui.formLabel}>{error}</div>
        <div className={ui.formLabel} style={{marginTop: 15}}>Already have an account?  <Link href="/login">Log In</Link></div>
      </form>}

      {verify && <div style={{borderColor: 'var(--outline-dimmer)', maxWidth: 300, padding: 20, position: 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)' }}>
              <h4 style={{marginBottom: 10}}>Check your Email</h4>
              <div className={ui.formLabel}>For security reasons, email verification is required before you can use replverse.  Please click the activation link sent to your inbox and be sure to check the spam folder.</div>
      </div>}

      <Nav/>
    </div>
  );
}
