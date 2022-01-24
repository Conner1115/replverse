/* eslint-disable @next/next/no-img-element */
export default function Replicon(props){
  return (
    <span>
      <img src="/replit.svg" width={props.fontSize||14} height={props.fontSize||14} style={{transform: 'translatey(2px)'}}/>
    </span>
  );
}