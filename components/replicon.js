/* eslint-disable @next/next/no-img-element */
export default function Replicon(props){
  return (
    <span>
      <img src="/replit.svg" width={props.fontSize||18} height={props.fontSize||18} style={{transform: 'translatey(4px)'}}/>
    </span>
  );
}