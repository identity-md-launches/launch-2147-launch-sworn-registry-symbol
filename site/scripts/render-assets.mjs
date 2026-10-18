import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createPublicClient, http, fallback, decodeFunctionResult, encodeFunctionData } from 'viem';
import { mainnet } from 'viem/chains';
import { parse } from 'lossless-json';
const a = JSON.parse(readFileSync('addresses.json', 'utf8'));
const abi = JSON.parse(readFileSync('src/abi/Renderer.json', 'utf8'));
const client = createPublicClient({ chain: mainnet, transport: fallback(a.publicRpcs.map(u => http(u, {timeout:30000,retryCount:0}))) });
const wallet = '0x000000000000000000000000000000000000c1a1';
mkdirSync('public/assets', { recursive: true });
const full = [101,202,303,404,503,601,701,801,901,1001,1101,1201,1301];
const sample = [101,202,302,402,502,0,701,0,0,0,1105,0,1301];
for (const [name, top, count] of [['logo',full,8192n],['sample-card',sample,0n]]) {
  const traits = top.filter(Boolean);
  const card = {tokenId:0n,claimant:wallet,top,traits,community:[],communityCount:count,oracle:[]};
  const result = await client.call({to:a.Renderer,data:encodeFunctionData({abi,functionName:'tokenURI',args:[card]}),gas:30000000n});
  const uri = decodeFunctionResult({abi,functionName:'tokenURI',data:result.data});
  const raw = Buffer.from(uri.split(',')[1], 'base64').toString('utf8');
  const meta = parse(raw,undefined,value=>value);
  let svg = decodeURIComponent(meta.image.slice(meta.image.indexOf(',')+1));
  if (name === 'logo') svg = svg.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, '');
  writeFileSync(`public/assets/${name}.svg`, svg);
  console.log(name, svg.length, 'bytes; Renderer.tokenURI eth_call');
}
