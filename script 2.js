const EMAIL='aquarpotero@gmail.com';
const $=id=>document.getElementById(id);
const S={a:0,k:0,exA:[],exK:[]};
const catSVG=`<ellipse cx="80" cy="140" rx="55" ry="8" fill="#0001"/><path d="M28 62 L36 14 L70 40Z M132 62 L124 14 L90 40Z" fill="#FFA24C" stroke="#4a2c12" stroke-width="4" stroke-linejoin="round"/><path d="M38 28 L46 44 L58 38Z M122 28 L114 44 L102 38Z" fill="#FFB3C1"/><ellipse cx="80" cy="76" rx="56" ry="48" fill="#FFA24C" stroke="#4a2c12" stroke-width="4"/><path d="M70 32 v12 M80 30 v14 M90 32 v12" stroke="#E07A1F" stroke-width="5" stroke-linecap="round"/><ellipse cx="58" cy="74" rx="7" ry="9" fill="#4a2c12"/><ellipse cx="102" cy="74" rx="7" ry="9" fill="#4a2c12"/><circle cx="60" cy="71" r="3" fill="#fff"/><circle cx="104" cy="71" r="3" fill="#fff"/><ellipse cx="42" cy="90" rx="9" ry="6" fill="#FF8FA3" opacity=".7"/><ellipse cx="118" cy="90" rx="9" ry="6" fill="#FF8FA3" opacity=".7"/><path d="M75 88 h10 l-5 6Z" fill="#FF6B8B"/><path d="M80 94 q-8 10 -16 2 M80 94 q8 10 16 2" fill="none" stroke="#4a2c12" stroke-width="3" stroke-linecap="round"/><path d="M30 84 l-18 -4 M30 92 l-18 4 M130 84 l18 -4 M130 92 l18 4" stroke="#4a2c12" stroke-width="3" stroke-linecap="round"/><path d="M40 118 h80 q0 22 -40 22 q-40 0 -40 -22Z" fill="#FFD23F" stroke="#4a2c12" stroke-width="4" stroke-linejoin="round"/><path d="M52 114 q28 -14 56 0" fill="#fff" stroke="#4a2c12" stroke-width="3"/>`;
document.querySelectorAll('.cat').forEach(s=>s.innerHTML=catSVG);

function renderOpts(id,items,key){
  const box=$(id);box.innerHTML='';
  const qty=key==='exA'?S.a:S.k;
  if(!qty)S[key]=['ไม่ได้สั่ง'];else S[key]=S[key].filter(x=>x!=='ไม่ได้สั่ง');
  [...items,'ไม่มี (ใส่ครบ)','ไม่ได้สั่ง'].forEach(t=>{
    const b=document.createElement('button');b.className='opt';b.textContent=t;
    const val=t.startsWith('ไม่มี')?'ไม่มี':t;
    b.disabled=!qty&&val!=='ไม่ได้สั่ง'||qty&&val==='ไม่ได้สั่ง';
    if(S[key].includes(val))b.classList.add('sel');
    b.onclick=()=>{
      let a=S[key];
      if(val==='ไม่มี'){a=a.includes(val)?[]:['ไม่มี']}
      else{a=a.filter(x=>x!=='ไม่มี');a=a.includes(val)?a.filter(x=>x!==val):[...a,val]}
      S[key]=a;renderOpts(id,items,key);
    };
    box.appendChild(b);
  });
}
function q(t,d){S[t]=Math.max(0,Math.min(50,S[t]+d));$('q'+t).textContent=S[t]}

let cur=1;
function go(n){
  document.querySelectorAll('.step').forEach(e=>e.classList.remove('on'));
  $('s'+n).classList.add('on');cur=n;
  if(n===3)renderOpts('oa',['ต้นหอม','หมูเด้ง','ไข่','ขิง'],'exA');
  if(n===4)renderOpts('ok',['หมูเด้ง','ไข่'],'exK');
  if(n===5)renderSum();
  if(n===7)$('paytotal').textContent='ยอดที่ต้องโอน '+calc().total+' บาท';
  $('dots').innerHTML=n<6?[1,2,3,4,5].map(i=>`<b class="${i<=n?'on':''}"></b>`).join(''):'';
  scrollTo({top:0,behavior:'smooth'});
}
function next(n){
  const err=$('e'+n);err.textContent='';
  if(n===1&&!$('name').value.trim())return err.textContent='⚠ กรุณาพิมพ์ชื่อก่อนนะคะ/ครับ';
  if(n===2&&S.a+S.k===0)return err.textContent='⚠ กรุณาเลือกอย่างน้อย 1 ถุงค่ะ/ครับ';
  if(n===3&&!S.exA.length)return err.textContent='⚠ กรุณาเลือกอย่างน้อย 1 ข้อ (ถ้าใส่ครบให้กด "ไม่มี")';
  if(n===4&&!S.exK.length)return err.textContent='⚠ กรุณาเลือกอย่างน้อย 1 ข้อ (ถ้าใส่ครบให้กด "ไม่มี")';
  go(n+1);
}
function calc(){
  const noEggA=S.a>0&&S.exA.includes('ไข่')?5:0, noEggK=S.k>0&&S.exK.includes('ไข่')?5:0;
  return {total:S.a*30+S.k*25-noEggA-noEggK,noEggA,noEggK};
}
function line(n,q,ex){
  if(!q)return '';
  return `${n} ${q} ถุง · ไม่ใส่: ${ex.includes('ไม่มี')?'ไม่มี (ใส่ครบ)':ex.join(', ')}`;
}
function renderSum(){
  const c=calc();
  let h=`<p>👤 ${esc($('name').value.trim())}</p>`;
  if(S.a)h+=`<p>🥣 ${esc(line('โจ๊กผู้ใหญ่',S.a,S.exA))} = ${S.a*30} บาท</p>`;
  if(S.k)h+=`<p>🥣 ${esc(line('โจ๊กเด็ก',S.k,S.exK))} = ${S.k*25} บาท</p>`;
  if(c.noEggA)h+=`<p>ไม่ใส่ไข่ (ผู้ใหญ่ 1 ถุง) −5 บาท</p>`;
  if(c.noEggK)h+=`<p>ไม่ใส่ไข่ (เด็ก 1 ถุง) −5 บาท</p>`;
  h+=`<div class="total">รวม ${c.total} บาท</div>`;
  $('sum').innerHTML=h;
}
function esc(s){return s.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}

async function submitOrder(){
  const c=calc(),btn=$('send'),err=$('e5');err.textContent='';
  btn.disabled=true;btn.textContent='กำลังส่ง...';
  const data={
    _subject:`ออเดอร์ใหม่ โจ๊กนายตั้ม - ${$('name').value.trim()}`,_template:'table',_captcha:'false',
    ชื่อลูกค้า:$('name').value.trim(),
    โจ๊กผู้ใหญ่:S.a?`${S.a} ถุง | ไม่ใส่: ${S.exA.join(', ')}`:'ไม่ได้สั่ง',
    โจ๊กเด็ก:S.k?`${S.k} ถุง | ไม่ใส่: ${S.exK.join(', ')}`:'ไม่ได้สั่ง',
    รายละเอียดเพิ่มเติม:$('note').value.trim()||'-',
    ราคารวม:c.total+' บาท'
  };
  try{
    const r=await fetch('https://formsubmit.co/ajax/'+EMAIL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
    const j=await r.json();
    const ok=r.ok&&j.success!=='false';
    if(!ok)throw new Error('fail');
    S.total=c.total;$('payTotal').textContent='ยอดที่ต้องโอน '+c.total+' บาท';go(6);
  }catch(e){
    err.textContent='⚠ ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ/ครับ';
    btn.disabled=false;btn.textContent='✅ ยืนยันออเดอร์';
  }
}
go(1);

function copyTxt(t,b){
  const done=()=>{const o=b.textContent;b.textContent='✔ คัดลอกแล้ว';setTimeout(()=>b.textContent=o,1800)};
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(done,()=>{});else done();
}
