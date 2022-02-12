import ui from '../styles/ui.module.css';
import pos from '../styles/pos.module.css';
import Head from 'next/head'
import Nav from '../components/nav'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Signup() {
  const [error, setError] = useState("")
  const [email, setEmail] = useState("");
  const [verify, setVf] = useState(false);

  useEffect(() => {
    if(window.location !== window.parent.location){
        Swal.fire({
          allowEnterKey: false,
          allowOutsideClick: false,
          showClass, hideClass,
          title: "Hold Up there, buddy!",
          text: "Replverse only works in fullscreen.  Please allow repverse to open this in fullscreen before you can access it.",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Open in Fullscreen",
          preConfirm: async () => {
            localStorage.setItem("windowopen", true)
            window.open("https://replverse.ironcladdev.repl.co")
          }
        });
    }
  }, [])

  
  const authenticate = async () => {
    if(window.location !== window.parent.location){
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
          location.href = "/dashboard"
        }else{
          setError(data.message)
        }
      })
    }
    }else{
      Swal.fire({
          allowEnterKey: false,
          allowOutsideClick: false,
          showClass, hideClass,
          title: "Hold Up there, buddy!",
          text: "Replverse only works in fullscreen.  Please allow repverse to open this in fullscreen before you can access it.",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Open in Fullscreen",
          preConfirm: async () => {
            localStorage.setItem("windowopen", true)
            window.open("https://replverse.ironcladdev.repl.co")
          }
        });
    }
  }
  const submit = (e) => { 
    e.preventDefault();
  };
  return (
    <div className={pos.relcont}>
      <Head>
        <title>Authorize Replverse</title>
      </Head>
    
      <form onSubmit={submit} style={{borderColor: 'var(--outline-dimmer)', maxWidth: 350, width: 350, padding: 20, position: 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)' }}>
        <h4 style={{ marginTop: 0, marginBottom: 10, paddingTop: 0 }}>Log In with Replit</h4>
        <button className={ui.uiButtonDark + " " + ui.blockEl} onClick={authenticate}>Authorize Replverse</button>
        <div className={ui.errorText + " " + ui.formLabel}>{error}</div>
      </form>
      <Nav/>
    </div>
  );
}

export function getServerSideProps({req, res}){
  if(req.headers["x-replit-user-name"]){
    return {
        redirect: {
          destination: "/user/" + req.headers["x-replit-user-name"]
        }                                                              
    }
  }else{
    return {
      props: {
        
      }
    }
  }
}