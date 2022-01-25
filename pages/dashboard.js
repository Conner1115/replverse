export default function Dashboard(props){
  return <div/>
}

export async function getServerSideProps({ req, res }){
  if(req.headers["x-replit-user-name"]){
    return {
        redirect: {
          destination: "/user/" + req.headers["x-replit-user-name"]
        }                                                              
    }
  }else{
    return {
      redirect: {
        destination: "/login",
      }
    }
  }
}