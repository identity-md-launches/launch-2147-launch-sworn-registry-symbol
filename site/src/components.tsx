import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { getAddress, isAddress } from 'viem';
import { A, EXPLORER, REPO, SYNTHETIC } from './config';
import type { Evidence } from './catalog';

export const Source=({children='CATALOG §3',href=`${REPO}/blob/main/CATALOG.md#3-trait-table-v1-25-slots-working-names`}:{children?:ReactNode;href?:string})=><a className="source" href={href}>{children}</a>;
export function Section({title,children,id,className=''}:{title:string;children:ReactNode;id?:string;className?:string}){
 return <section className={`section ${className}`} id={id}><h2 className="section-label">{title}</h2>{children}</section>;
}
export function AddressForm({initial='',onSubmit,label='Wallet address'}:{initial?:string;onSubmit:(value:string)=>void;label?:string}){
 const id=useId();const [value,setValue]=useState(initial);const [error,setError]=useState('');
 function submit(e:FormEvent){e.preventDefault();if(!isAddress(value,{strict:false})){setError('Enter a complete Ethereum address: 0x followed by 40 hexadecimal characters.');document.getElementById(id)?.focus();return;}setError('');onSubmit(getAddress(value.toLowerCase()));}
 return <form className="address-form" onSubmit={submit} noValidate>
  <label htmlFor={id}>{label}</label>
  <div className="address-controls"><input id={id} value={value} onChange={e=>setValue(e.target.value.trim())} placeholder={SYNTHETIC} spellCheck={false} autoCapitalize="none" autoComplete="off" aria-invalid={!!error} aria-describedby={error?`${id}-error`:undefined}/><button type="submit">Explore wallet</button></div>
  <p id={`${id}-error`} className={error?'error-text':'source'} role="status">{error||'Any Ethereum address. No wallet connection needed.'}</p>
 </form>;
}
export function Table({children,label,minWidth=680}:{children:ReactNode;label:string;minWidth?:number}){
 return <><div className="table-scroll" role="region" aria-label={label} tabIndex={0}><table style={{minWidth}}>{children}</table></div><p className="scroll-note source">Scroll the table sideways for all columns.</p></>;
}
export function ClassMark({value}:{value:Evidence}){return <span className={`class-mark ${value}`}>{value}</span>;}
export function ContractAddress({name,value}:{name:string;value:string}){return <div className="contract-address"><span>{name}</span><a className="address" href={`${EXPLORER}/address/${value}`}>{value}</a></div>;}
export function WhySworn(){return <p className="measure">WhitelistCurator.sol set out to make an onchain allowlist that contracts could read directly: no Merkle root to publish and no snapshot to maintain. Sworn builds on its frozen record, turning participation into wallet facts that other contracts can check.</p>;}
export function HowToVerify(){return <ol className="numbered-list">
 <li><div><h3>Read the registry</h3><p>Read <code>claimantOf(tokenId)</code>, then <code>hasTrait(claimant, traitId)</code> and <code>verified(claimant, traitId)</code>. Decode the card’s tokenURI as Base64 JSON, preserving all integers exactly. Its oracle array includes the recipe, block window and both request ids. A zero request id means not claimed.</p></div></li>
 <li><div><h3>Rerun the recipe on two public RPCs</h3><p>For T1 count matching logs; for T2 sum the named field; for T3 group, sum and rank (ties by ascending address). T4 compares a historical call. T5 checks the historical account nonce. Derive event topics from the stored item, including indexed arguments. Use the exact block window and check its closing block hash.</p></div></li>
 <li><div><h3>Check the signed attestation</h3><p>Take the first 16 bytes of oracleRequestId as its UUID and open the attestation link in Explorer. Check the EIP-712 signer and domain (<code>IdentityMD Oracle</code>, version 2, chain 1, this Registry), questionHash, answer type, signed panel size, quorum, agreement, issue time and expiry. Hash the canonical question document, not the entire request body. The card’s minPanelSize and minQuorum are acceptance minima.</p></div></li>
 <li><div><h3>Compare the deployed code</h3><p>Rebuild the launch source with solc 0.8.24 and the unchanged Foundry settings. Compare each deployed runtime byte for byte with Registry, Composer and Renderer: metadata hashing and CBOR are disabled, and there are no immutables. Read all eight dependency getters and compare them with the launch record and addresses.json. This site checks those getters and runtime hashes before enabling transactions.</p></div></li>
 </ol>;}
export const getterSource=(fn:string)=>{
 const target=fn.includes('priceOf')?A.IntakeV2:fn.includes('Quoter')?A.Quoter:fn==='IDMD.balanceOf'?A.IDMD:['firstHourOf','txCountOf','contributedBy','pointsOf'].includes(fn)?A.WhitelistCurator:A.Registry;
 return <Source href={`${EXPLORER}/address/${target}#readContract`}>{fn} · live</Source>;
};
