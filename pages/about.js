/* eslint-disable @next/next/no-img-element */
import Nav from '../components/nav.js'
import Footer from '../components/footer'
import Head from 'next/head'
import pos from '../styles/pos.module.css'
import ui from '../styles/ui.module.css'
export default function About(){
  return (
    <div>
      <Head>
        <title>About | Replverse</title>
      </Head>

      <div className={pos.relcont} style={{padding: '50px 0'}}>
        <h2 className={ui.header}>About Replverse</h2>
        
        <p>Replverse is a rip-off recreation of replit apps with more features then ever before.  What is included here are some of the most commonly requested features in the replit feedback board.  With a zeal to give replit users the greatest experience <strike>and a great desire to win Repl of the Year again</strike>, <a href="https://replit.com/@IroncladDev" target="_blank" rel="noreferrer">IroncladDev</a> started building and ended up with this.</p>

        <p>Replverse relies heavily on the official replit api for the sake of giving users an enhanced experience.  This also prevents users from creating large amounts of accounts and prevents disallowed actions more effectively.</p>

        <p>One of the main goals of using the same palette is to give users a simillar feel to replit and make this appear to be attached to the real thing.</p>

        <p>Huge thanks to <a href="https://replit.com/@JDOG787" target="_blank" rel="noreferrer">JDOG787</a> for coming up with the name Replverse and <a href="https://replit.com/@19wintersp" target="_blank" rel="noreferrer">19wintersp</a> for the logo and some of the badges.  Also, the hugest shout-out goes to <a href="https://replit.com/@Bookie0" target="_blank" rel="noreferrer">Bookie0</a> for providing the best design feedback, or Replverse would have ended up looking way different (in a not-so-good way).  Also, thanks to <a href="https://replit.com/@retronbv" target="_blank" rel="noreferrer">RetronBV</a> for being an amazing beta tester for the chat!</p>

        <p>Have fun, enjoy, and behave yourself.  We&apos;re counting on you to make replverse a reality.</p>
      </div>

      <Footer/>
      <Nav/>
    </div>
  );
}