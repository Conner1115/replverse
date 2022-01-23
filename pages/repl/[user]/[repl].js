import DashNav from '../../../components/dashnav.js'
export default function Spotlight(props){
  return (<div>
    <DashNav>
      <div style={{padding: '50px 20px'}}>
        <h3 style={{padding: 0}}>{props.repl}</h3>
        <iframe src="https://replit.com/@IroncladDev/Xeragon?embed=true" style={{
          width: '100%',
          height: 'calc(100vh - 100px)',
          maxHeight: '800px',
          minHeight: '300px',
          position: 'relative',
          left: '50%',
          transform: 'translatex(-50%)',
          border: 'solid var(--outline-dimmest) 1px !important;',
          borderColor: 'var(--outline-dimmest) !important',
          borderRadius: '10px',
          margin: '20px 0',
        }}></iframe>

        <div style={{
          maxWidth: 800,
          margin: 'auto',
          width: '100%'
        }}>
          Test
        </div>
      </div>
    </DashNav>
  </div>)
}

export async function getServerSideProps(ctx){
  return {
    props: {
      user: ctx.params.user,
      repl: ctx.params.repl
    }
  }
}