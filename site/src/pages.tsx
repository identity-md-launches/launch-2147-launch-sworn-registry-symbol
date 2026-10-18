import { useEffect, useRef, useState, type ReactNode } from 'react';
import { isAddress, type Address } from 'viem';
import { A, CONTRIBUTORS, EXPLORER, LAUNCH, REPO } from './config';
import { CATALOG, FAMILIES, WINDOWS, isRare, topOf } from './catalog';
import { explore, type Snapshot, type Integrity } from './chain';
import { attestationUrl, number, units } from './format';
import { AddressForm, ClassMark, ContractAddress, HowToVerify, Section, Source, Table, WhySworn, getterSource } from './components';

export function Landing(){return <>
 <section className="landing-intro">
  <div className="intro-copy"><h1>Facts about wallets, onchain and sworn by the swarm.</h1>
   <p>Sworn is an ownerless registry on Ethereum mainnet. It records verifiable facts about wallets, starting with 25 built on the 19,522 wallets in WhitelistCurator.sol: some read live from the chain, the rest proven by panels of <a href="https://imd.fun/docs">IMD agents</a> and signed. A card shows a wallet's facts; any contract can check them. Everyone can add facts.</p>
   <AddressForm onSubmit={value=>{location.hash=`/explorer?address=${value}`;}}/>
  </div>
  <figure className="sample-card"><img src="./assets/sample-card.svg" width="330" height="330" alt="Renderer preview with Spawned, Zero-Shot, Hopper, Bullfrog, Benchmarked, Uptime, PID and Pretrained"/><figcaption>Synthetic wallet · Renderer preview<Source href={`${REPO}/blob/main/site/scripts/render-assets.mjs`}>eth_call / no card minted</Source></figcaption></figure>
 </section>
 <div className="stats" aria-label="Registry reference numbers">{[
  ['25','catalog facts','CATALOG §3',`${REPO}/blob/main/CATALOG.md#3-trait-table-v1-25-slots-working-names`],
  ['13','families','CATALOG §7',`${REPO}/blob/main/CATALOG.md#7-name-table-filled-by-the-entrant-on-2026-10-16`],
  ['19,522','contributors','eth_getLogs census','./data/hours.json'],
  ['0','owner roles','Registry.sol',`${REPO}/blob/main/src/Registry.sol`],
 ].map(([value,label,source,href])=><div className="stat" key={label}><div className="stat-number">{value}</div><span>{label}</span><Source href={href}>{source}</Source></div>)}</div>
 <Section title="How it works"><div className="three-columns">{[
  ['01','Read a wallet','Direct facts read WhitelistCurator.sol and Identity.md live. Any wallet can be inspected.'],
  ['02','Prove a fact','Request a verifiable answer. IMD agents check the recipe; the Registry accepts a signed attestation.'],
  ['03','Use the credential','Any contract can call hasTrait. Mint a card to display the facts; the card updates itself.'],
 ].map(([n,title,copy])=><div className="how-step" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{copy}</p><Source href={`${REPO}/blob/main/src/Registry.sol`}>Registry.sol</Source></div>)}</div></Section>
 <Section title="Why Sworn"><WhySworn/><a className="text-link" href="#/about">Read about Sworn</a></Section>
 <Section title="Built by the swarm"><p>Contracts, evidence and this interface are public. Inspect the source, rerun a recipe, or add a fact.</p><div className="link-row"><a href={REPO}>Repository</a><a href={LAUNCH}>Launch record</a><a href="https://imd.fun">Identity.md</a><a href="https://x.com/swornbyswarm">@swornbyswarm</a></div></Section>
 </>;}

export function Catalog(){return <>
 <div className="page-intro"><h1>Catalog</h1><p>The frozen catalog: <span>25 facts <Source/></span> across <span>13 families <Source>CATALOG §7</Source></span>. An id is family × 100 + tier. Direct facts are live; other facts need an accepted attestation.</p></div>
 <Table label="The 25 catalog facts" minWidth={1020}><thead><tr>{['Id / family','Fact','Class','Rule','Window','Population'].map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{FAMILIES.map((family,i)=><FamilyRows key={family} family={family} index={i}/>)}</tbody></Table>
 <p className="source">Populations are frozen reference measurements from CATALOG.md §3, not live claim counts. Where the catalog provides no exact population, none is invented. Capital is the largest single send, not a sum.</p>
 <p className="source">The frozen capital sample covers 15,576 wallets: median 0.45 ETH, p90 14 ETH, p99 98.8 ETH, maximum 1,000 ETH (the cap). At most 2,037 wallets made more than one deposit. <Source>CATALOG §3</Source></p>
 <Section title="Four evidence classes"><Table label="Evidence classes" minWidth={660}><thead><tr><th>Class</th><th>Source</th><th>Acceptance</th></tr></thead><tbody>
  <tr><td><ClassMark value="direct"/></td><td>WhitelistCurator.sol / IDMD</td><td>Evaluated live by the getter</td></tr>
  <tr><td><ClassMark value="chain-proven"/></td><td>Reproducible chain recipe</td><td>Minimum panel 5, quorum 3 <Source>CATALOG §4</Source></td></tr>
  <tr><td><ClassMark value="shared"/></td><td>One ranked list, applied by each member</td><td>Minimum panel 5, quorum 3 <Source>CATALOG §4</Source></td></tr>
  <tr><td><ClassMark value="panel"/></td><td>Historical nonce, checked by IMD agents</td><td>Minimum panel 11, quorum 7 <Source>CATALOG §4</Source></td></tr>
 </tbody></Table><p>White dots identify the rare ids in Renderer._rare. Color names the evidence class; each row also states it in text.</p></Section>
 <Section title="Four block windows"><Table label="Canonical block windows" minWidth={720}><thead><tr><th>Window</th><th>First block</th><th>Last block</th><th>Blocks</th><th>Hex bounds</th></tr></thead><tbody>{WINDOWS.map(([name,from,to,count,hfrom,hto])=><tr key={name}><th>{name}</th><td>{from}<Source>CATALOG §1</Source></td><td>{to}<Source>CATALOG §1</Source></td><td>{count}<Source>CATALOG §1</Source></td><td>{hfrom} to {hto}</td></tr>)}</tbody></Table><p>The lifetime window ends with hour 65, before the Settled event. <Source>CATALOG §1</Source> PID displays the lowest verified id; every other family displays its highest true tier. Lower tiers remain valid credentials.</p></Section>
 <Section title="Limits of the underlying record"><p><a href="#/whitelistcurator#source">WhitelistCurator.sol is not sybil-resistant by design</a>. Its record proves participation, timing and capital held at the moment of a send. Read the verified source before using it as an allowlist.</p></Section>
 </>;}
function FamilyRows({family,index}:{family:string;index:number}){return <>
 <tr className="family-row"><th colSpan={6}>{String(index+1).padStart(2,'0')} / {family}</th></tr>
 {CATALOG.filter(t=>t.family===index+1).map(t=><tr key={t.id}><td className="id-cell">{t.id}{isRare(t.id)&&<span className="rare-dot" role="img" aria-label="Rare id"/>}</td><td>{t.name}</td><td><ClassMark value={t.evidence}/></td><td>{t.rule}</td><td>{t.window}</td><td>{t.population}<Source/></td></tr>)}
 </>;}

export function Explorer({rpc,query}:{rpc:string;query:string}){
 const supplied=new URLSearchParams(query).get('address')??'';
 const [status,setStatus]=useState<'idle'|'loading'|'error'|'loaded'>('idle');const [error,setError]=useState('');const [data,setData]=useState<Snapshot>();const serial=useRef(0);
 async function load(wallet:string){const s=++serial.current;setData(undefined);setStatus('loading');setError('');try{const result=await explore(rpc,wallet as Address);if(s!==serial.current)return;setData(result);setStatus('loaded');}catch(e){if(s!==serial.current)return;setStatus('error');setError(e instanceof Error?e.message:'RPC unavailable');}}
 useEffect(()=>{if(supplied&&isAddress(supplied,{strict:false}))void load(supplied);else{serial.current++;setData(undefined);setStatus('idle');}return()=>{serial.current++;};},[supplied,rpc]);
 const focusedTrait=Number(new URLSearchParams(query).get('trait'));
 useEffect(()=>{if(data&&focusedTrait)document.getElementById(`trait-${focusedTrait}`)?.scrollIntoView({block:'center'});},[data,focusedTrait]);
 return <><div className="page-intro"><h1>Explorer</h1><p>Read any wallet. <strong>hasTrait is the credential, never ownerOf.</strong></p></div>
  <AddressForm key={supplied} initial={supplied} onSubmit={wallet=>{if(wallet.toLowerCase()===supplied.toLowerCase())void load(wallet);else location.hash=`/explorer?address=${wallet}`;}}/>
  <div className="public-examples">Public contributors from the fork tests: {CONTRIBUTORS.map(c=><a key={c.address} href={`#/explorer?address=${c.address}`}>{c.name}</a>)}</div>
  <div role="status" className="read-status">{status==='loading'?'Reading Ethereum mainnet. No result is assumed while calls are pending.':status==='error'?error:status==='idle'?'Enter an address to read its facts and Renderer card.':`Read at block ${number(data!.block)} from ${data!.endpoint}.`}</div>
  {status==='error'&&<button className="secondary" onClick={()=>void load(supplied)}>Retry reads</button>}
  {data&&<WalletResult data={data} focusedTrait={focusedTrait}/>}
 </>;
}
function WalletResult({data:d,focusedTrait}:{data:Snapshot;focusedTrait:number}){
 const top=topOf(d.traits);
 const values:ReactNode[]=[d.joined?'joined':'not joined',d.joined?`hour ${number(d.firstHour)}`:'not joined',number(d.txCount),`${units(d.capital)} ETH`,number(d.points),`${number(d.idmd)} IDMD`];
 return <>
  <div className="wallet-heading"><span className="address">{d.wallet}</span><Source href={`${EXPLORER}/block/${d.block}`}>Ethereum block {number(d.block)}</Source></div>
  <div className="explorer-grid"><figure className="explorer-card"><img src={d.image} width={300} height={300} alt="Onchain Sworn card showing this wallet’s true traits"/><figcaption>{d.tokenId===0n?'preview, no card minted':`Sworn #${number(d.tokenId)}`}<Source href={`${EXPLORER}/address/${d.tokenId===0n?A.Renderer:A.Registry}#readContract`}>{d.tokenId===0n?'Renderer.tokenURI(Card)':'Registry.tokenURI(tokenId)'}</Source></figcaption>{d.tokenId===0n&&<a className="button secondary" href="#/claim">Mint your card</a>}</figure>
   <Table label="13-family wallet summary" minWidth={620}><thead><tr><th>Family</th><th>Highest tier / id</th><th>Getter</th><th>Value</th></tr></thead><tbody>{FAMILIES.map((family,i)=><tr key={family}><th>{family}</th><td>{top[i]||'none'}{isRare(top[i])&&<span className="rare-dot" role="img" aria-label="Rare id"/>}{i===10&&<span className="source">lowest verified id</span>}</td><td><code>{i<6?CATALOG.find(t=>t.family===i+1)?.getter:'verified'}</code></td><td>{i<6?values[i]:top[i]?'verified':'not claimed'}{getterSource(i<6?CATALOG.find(t=>t.family===i+1)!.getter:'Registry.verified')}</td></tr>)}</tbody></Table>
  </div>
  <Section title="Every catalog id"><Table label="Every hasTrait result" minWidth={780}><thead><tr><th>Id</th><th>Fact</th><th>Class</th><th>hasTrait</th><th>Evidence / request</th></tr></thead><tbody>{CATALOG.map(t=>{
   const trueFact=d.traits.includes(t.id);const proof=d.verified.find(v=>v.id===t.id);const pending=d.pending[t.id] && !/^0x0+$/.test(d.pending[t.id]);const url=proof&&attestationUrl(proof.oracleRequestId);
   return <tr key={t.id} id={`trait-${t.id}`} className={focusedTrait===t.id?'selected-trait':undefined}><td>{t.id}{isRare(t.id)&&<span className="rare-dot" role="img" aria-label="Rare id"/>}</td><td>{t.name}</td><td><ClassMark value={t.evidence}/></td><td>{trueFact?'true':t.evidence==='direct'?'false':pending?'not claimed · pending':'not claimed'}{getterSource('hasTrait')}</td><td>{url?<a href={url}>Signed attestation</a>:t.evidence==='direct'?'Live rule':pending?<a href={`${EXPLORER}/address/${A.Registry}#readContract`}>Pending request</a>:'No accepted attestation'}</td></tr>;
  })}</tbody></Table></Section>
  <Section title="Oracle facts this wallet can still request"><p>An unclaimed fact has no accepted proof. It does not mean the fact is false. Requests cost the live oracle price whatever the answer.</p><Table label="Requestable oracle facts" minWidth={620}><thead><tr><th>Id</th><th>Fact</th><th>Price</th><th>Action</th></tr></thead><tbody>{CATALOG.filter(t=>t.id>=701&&!d.traits.includes(t.id)).map(t=><tr key={t.id}><td>{t.id}</td><td>{t.name}</td><td>{units(d.price)} IMD {getterSource('priceOf')}</td><td>{d.pending[t.id]&&!/^0x0+$/.test(d.pending[t.id])?'Request pending':<a href={`#/claim?trait=${t.id}`}>{t.id===1201?'Request / apply shared fact':'Open claim guide'}</a>}</td></tr>)}</tbody></Table></Section>
  <Section title="Community and raw metadata"><p><code>verifiedSpecsOf</code>: {d.specs.length?d.specs.map(id=>number(id)).join(', '):'no verified community specs'} {getterSource('verifiedSpecsOf')} · <code>tokenOf</code>: {number(d.tokenId)} {getterSource('tokenOf')}</p>
   {!!d.verified.length&&<Table label="Accepted oracle windows" minWidth={730}><thead><tr><th>Id</th><th>From block</th><th>To block</th><th>Attestation</th></tr></thead><tbody>{d.verified.map(v=><tr key={v.id}><td>{v.id}</td><td>{number(v.fromBlock)}</td><td>{number(v.toBlock)}</td><td><a href={attestationUrl(v.oracleRequestId)}>Read signed answer</a>{getterSource('verified')}</td></tr>)}</tbody></Table>}
   <details><summary>Inspect exact tokenURI JSON</summary><p className="source">Bare JSON integers stay decimal strings in this viewer; fixedVal and threshold never pass through double precision.</p><pre className="raw-json">{d.rawMetadata}</pre></details>
  </Section>
 </>;
}

export function FactArtifact(){return <><div className="page-intro"><h1>Fact vs artifact</h1><p>The wallet has the fact. The holder owns the card.</p></div>
 <Table label="Fact and card comparison" minWidth={660}><thead><tr><th></th><th>The fact</th><th>The card</th></tr></thead><tbody>
  <tr><th>Read with</th><td><code>hasTrait(wallet, traitId)</code></td><td><code>tokenOf(wallet)</code>, <code>tokenURI(tokenId)</code></td></tr>
  <tr><th>Belongs to</th><td>The claimant wallet</td><td>The current ERC-721 holder</td></tr>
  <tr><th>Transfer</th><td>A card transfer does not move a fact</td><td>Transferable artifact</td></tr>
  <tr><th>Needs a mint</th><td>No</td><td>0.10 IMD <Source>CATALOG §6</Source></td></tr>
  <tr><th>Updates</th><td>Direct reads live; oracle facts after acceptance</td><td>tokenURI rebuilds the claimant’s current card</td></tr>
 </tbody></Table>
 <Section title="What an attestation proves"><p className="measure">The configured signer accepted a specific answer to a specific question, with a block window, signed panel values and expiry. The Registry checked the signature, domain, question hash, answer type, quorum, window and acceptance rule before recording the trait.</p><p className="measure">It does not prove uniqueness of a person, ownership of the card, future behavior, or correctness beyond the underlying evidence. A missed request, refused panel or absent verdict is not a false fact. Direct traits need no attestation.</p></Section>
 <Section title="How to verify a card" id="verify"><HowToVerify/><a href={`${REPO}/blob/main/README.md#how-to-verify-a-card`}>Verification instructions in the README</a></Section>
 </>;}

export const SOLIDITY=`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface ISworn {
    function hasTrait(address wallet, uint16 traitId)
        external view returns (bool);
    function tokenOf(address wallet)
        external view returns (uint256);
}

contract SwornGate {
    ISworn public constant SWORN =
        ISworn(0x39Bec7648259d5a128c29b24951eAbcD4d1F95A6);

    function canEnter(address wallet) external view returns (bool) {
        return SWORN.hasTrait(wallet, 701);
    }

    function cardOfWallet(address wallet) external view returns (uint256) {
        return SWORN.tokenOf(wallet);
    }
}`;
export const CAST=`cast call 0x39bec7648259d5a128c29b24951eabcd4d1f95a6 \\
  'hasTrait(address,uint16)(bool)' \\
  0x000000000000000000000000000000000000c1a1 701 \\
  --rpc-url https://ethereum-rpc.publicnode.com

cast call 0x39bec7648259d5a128c29b24951eabcd4d1f95a6 \\
  'tokenOf(address)(uint256)' \\
  0x000000000000000000000000000000000000c1a1 \\
  --rpc-url https://ethereum-rpc.publicnode.com`;
export function Integrate({check}:{check?:Integrity}){return <><div className="page-intro"><h1>Integrate</h1><p>Use <code>hasTrait</code> for credentials and <code>tokenOf</code> for the artifact. Never gate on <code>ownerOf</code>.</p></div>
 <Section title="Ids and tiers"><p className="measure">Catalog ids are family × 100 + tier. Lower tiers stay true when a higher tier holds. PID ids are independent facts; the card displays the lowest verified one. Community specs start at 10,001. <Source>CATALOG §2, §5</Source> Unknown ids return false. An oracle false result means no verified entry; it is not a negative verdict.</p><a href="#/catalog">Read all ids, rules and windows</a></Section>
 <Section title="Solidity · solc 0.8.24"><pre tabIndex={0} role="region" aria-label="Solidity integration example"><code>{SOLIDITY}</code></pre><Source href={`${REPO}/blob/main/site/public/examples/SwornGate.sol`}>Compiled example source</Source></Section>
 <Section title="cast · Ethereum mainnet"><pre tabIndex={0} role="region" aria-label="cast integration commands"><code>{CAST}</code></pre><p className="source">The example wallet is synthetic. Both commands query the deployed Registry.</p></Section>
 <Section title="Contracts and getter check"><p role="status">{check?`Getter and runtime checks passed at block ${number(check.block)}.`:'RPC verification is pending or unavailable. Transactions remain disabled until verified.'}</p>{(['Registry','Composer','Renderer','WhitelistCurator','IDMD','IMD','IntakeV2','attester','BurnExecutorV2'] as const).map(name=><ContractAddress key={name} name={name==='WhitelistCurator'?'WhitelistCurator.sol':name} value={A[name]}/>)}
  <p className="source">Expected addresses are bundled in <a href="./data/addresses.json">addresses.json</a>. The site checks curator(), imd() and intake(), the other immutable dependencies and all three launched runtime hashes. A mismatch shows a red banner and disables transactions.</p>
 </Section></>;}

type Hour={hour:number;deposits:number;firstDeposits:number;contributors:number};
type Census={hours:Hour[];deposits:number;contributors:number;fromBlock:number;toBlock:number;closingBlockHash:string;endpoints:string[]};
type Excerpt={url:string;sourceSha256:string;lines:{line:number;text:string}[]};
export function WhitelistCurator(){
 const [data,setData]=useState<Census>();const [source,setSource]=useState<Excerpt>();const [error,setError]=useState('');
 useEffect(()=>{let active=true;Promise.all([fetch('./data/hours.json').then(r=>{if(!r.ok)throw Error();return r.json();}),fetch('./data/curator-source.json').then(r=>{if(!r.ok)throw Error();return r.json();})]).then(([d,s])=>{if(active){setData(d);setSource(s);}}).catch(()=>setError('Reference files unavailable. Reload this page.'));return()=>{active=false;};},[]);
 useEffect(()=>{if(data&&source&&location.hash.endsWith('#source'))requestAnimationFrame(()=>document.getElementById('source')?.scrollIntoView());},[data,source]);
 return <><div className="page-intro"><h1>WhitelistCurator</h1><p>Hour by hour, from the first deposit to the frozen allowlist.</p><ContractAddress name="WhitelistCurator.sol" value={A.WhitelistCurator}/></div>
  {error&&<p role="alert">{error}</p>}
  {data&&<><div className="census-totals"><span>{number(data.deposits)} deposits <Source href="./data/hours.json">eth_getLogs</Source></span><span>{number(data.contributors)} contributors <Source href="./data/hours.json">FirstDeposit census</Source></span></div>
  <Section title="The lifetime window"><div className="hour-bands"><div>00–23 / Grace period<Source>CATALOG §1</Source></div><div>24–64 / Judged hours<Source>CATALOG §1</Source></div><div>65 / Final hour<Source>CATALOG §1</Source></div></div>
   <figure className="hour-chart"><svg viewBox="0 0 1100 220" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">Deposits per hour, hours 0 to 65</title><desc id="chart-desc">{number(data.deposits)} deposits. The table below gives every hourly value.</desc><line x1="28" y1="185" x2="1090" y2="185" stroke="#5f6861"/>{data.hours.map(h=>{const height=h.deposits/Math.max(...data.hours.map(h=>h.deposits))*155;return <rect key={h.hour} x={30+h.hour*16} y={185-height} width={10} height={Math.max(height,0.8)} fill="#8c968e"><title>Hour {h.hour}: {number(h.deposits)} deposits</title></rect>;})}{[0,12,24,36,48,65].map(h=><text key={h} x={30+h*16} y="208" fill="#8c968e" fontSize="12">{h}</text>)}</svg><figcaption>Deposits per hour <Source href="./data/hours.json">One eth_getLogs census / W_LIFE</Source></figcaption></figure>
   <p className="source">Blocks {number(data.fromBlock)} to {number(data.toBlock)}. Deposited and FirstDeposit were fetched together with an OR topic filter in disjoint chunks. The closing block hash was cross-checked on a second operator. Contributor counts within each hour are distinct; they must not be summed across hours.</p>
  </Section>
  <Table label="All 66 curator hours" minWidth={680}><thead><tr><th>Hour</th><th>Band</th><th>Deposits</th><th>First deposits</th><th>Distinct contributors</th><th>Source</th></tr></thead><tbody>{data.hours.map(h=><tr key={h.hour}><td>{number(h.hour)}</td><td>{h.hour<24?'Grace':h.hour<65?'Judged':'Final hour'}</td><td>{number(h.deposits)}</td><td>{number(h.firstDeposits)}</td><td>{number(h.contributors)}</td><td><Source href="./data/hours.json">Deposited / FirstDeposit</Source></td></tr>)}</tbody></Table></>}
  <Section title="Verified source · lines 4 to 62" id="source"><p><strong>WhitelistCurator.sol is not sybil-resistant by design.</strong> The contract’s own comment explains its aim and its limits. The excerpt below is verbatim, including punctuation.</p>{source?<><div className="source-excerpt" role="region" aria-label="Verified WhitelistCurator.sol source lines 4 to 62" tabIndex={0}><pre>{source.lines.map(line=><span className="source-line" key={line.line}><span className="line-number" aria-hidden="true">{line.line}</span><code>{line.text}</code>{'\n'}</span>)}</pre></div><div className="link-row"><a href={source.url}>Blockscout v2 verified source</a><a href={`${EXPLORER}/address/${A.WhitelistCurator}#code`}>Read on Etherscan</a><a href="./data/curator-source.json">Bundled excerpt and source hash</a></div></>:<p>Loading bundled verified source.</p>}</Section>
 </>;
}

export function About(){return <div className="narrow"><div className="page-intro"><h1>About</h1><p>Sworn · SWORN · Ethereum mainnet</p></div><Section title="Why Sworn"><WhySworn/></Section><Section title="Ownerless"><p className="measure">The Registry, Composer and Renderer have no owner roles. The Registry has no upgrade path, pause or fee switch. Its dependencies are fixed at construction. The oracle signer, Intake, BurnExecutor V2 and bridge have their own trust and operational boundaries; ownerless does not erase those dependencies.</p></Section><Section title="No coin"><p className="measure">SWORN is the card collection’s symbol. Sworn issues no coin. Fees use the existing IMD token; pool funds are an irrevocable donation. A card is an artifact. A trait is a credential about its claimant.</p></Section><Section title="Built by the swarm"><p className="measure">Sworn was built through the IdentityMD contributor network. Panels of IMD agents provide signed evidence for oracle facts. The contracts and this site are MIT licensed; review the public work and rerun the evidence.</p><div className="about-links"><a href={REPO}>Repository</a><a href={LAUNCH}>Launch record</a><a href={`${REPO}/pulls`}>Job records</a><a href="#/fact-vs-artifact#verify">How to verify a card</a><a href={`${REPO}/blob/main/INTEGRATION.md`}>INTEGRATION.md</a><a href="https://imd.fun">imd.fun</a><a href="https://imd.fun/docs">imd.fun/docs</a><a href="https://x.com/swornbyswarm">@swornbyswarm</a></div></Section></div>;}
