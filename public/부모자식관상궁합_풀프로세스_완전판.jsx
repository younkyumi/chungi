import { useState, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318", A = "#f97316";
const CERT_BG = "linear-gradient(135deg,#fff7ed,#ffedd5)";
const CERT_BORDER = "#fed7aa";

const SAVED = [
  { id:1, name:"○ (본인)", tag:"본인", birth:"2026-04-30 · 양력 · 여", avatar:"R" },
  { id:2, name:"김진순", tag:"관상짤", birth:"undefined · 양력 · undefined", avatar:"W" },
  { id:3, name:"ㄷㄷ", tag:"관상짤", birth:"undefined · 양력 · undefined", avatar:"W" },
  { id:4, name:"윤규미", tag:"본인", birth:" · 양력 · 여", avatar:"R" },
];

function Popup({ children }) {
  return (
    <div style={{ minHeight:"100vh", background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", fontFamily:"'Noto Serif KR',serif" }}>
      <div style={{ width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>{children}</div>
    </div>
  );
}
function Handle() { return <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 0" }}><div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }}/></div>; }
function X({ onClick }) { return <button onClick={onClick} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.1)", border:"none", color:"rgba(255,255,255,0.5)", fontSize:14, cursor:"pointer" }}>✕</button>; }

// ── 1. 설명팝업
function Intro({ onNext, onClose }) {
  const items = [
    { icon:"👪", label:"천륜 지수", desc:"전생부터 이어진 가족 인연" },
    { icon:"✨", label:"전생 관계 분석", desc:"부모·자식의 전생 인연" },
    { icon:"💬", label:"갈등 원인", desc:"사춘기·독립 시기 갈등 패턴" },
    { icon:"🌙", label:"유대감 흐름", desc:"나이 들수록 깊어지는 정" },
    { icon:"🌿", label:"양육 가이드", desc:"함께 성장하는 방법" },
    { icon:"🌈", label:"RAINBOW 인증서", desc:"주황 인증서 발급" },
  ];
  return (
    <div style={{ background:DG, borderRadius:"20px 20px 0 0", padding:"0 0 32px" }}>
      <Handle/><div style={{ display:"flex", justifyContent:"flex-end", padding:"8px 16px 0" }}><X onClick={onClose}/></div>
      <div style={{ textAlign:"center", padding:"0 20px 16px" }}>
        <div style={{ fontSize:36, marginBottom:8 }}>👪</div>
        <h2 style={{ fontSize:20, fontWeight:700, color:A, margin:"0 0 6px" }}>부모·자식 관상 궁합</h2>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", margin:0 }}>우리는 천륜일까, 전생의 숙제일까? · 1,980원</p>
      </div>
      <div style={{ margin:"0 16px 16px", borderRadius:14, overflow:"hidden", background:"#000", border:`1px solid rgba(249,115,22,0.3)` }}>
        <div style={{ background:`linear-gradient(90deg,${DG},#0a1a10)`, padding:"6px 12px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid rgba(249,115,22,0.2)" }}>
          <span style={{ fontSize:9, color:G, letterSpacing:2 }}>CHUNGI_AI v2.0</span>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>AI_SCANNING... [OK]</span>
        </div>
        <div style={{ height:160, background:"linear-gradient(135deg,#1a0a00,#0a1a0a)", display:"flex", alignItems:"center", justifyContent:"center", gap:24 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(249,115,22,0.2)", border:"2px solid rgba(249,115,22,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 4px" }}>👨</div>
            <p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", margin:0 }}>부모</p>
          </div>
          <div style={{ fontSize:26 }}>🤝</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(249,115,22,0.2)", border:"2px solid rgba(249,115,22,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 4px" }}>👶</div>
            <p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", margin:0 }}>자녀</p>
          </div>
        </div>
      </div>
      <div style={{ padding:"0 16px 16px" }}>
        {items.map((it,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", marginBottom:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10 }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{it.icon}</span>
            <div style={{ flex:1 }}><p style={{ fontSize:12, fontWeight:700, color:"#F0EAD6", margin:"0 0 1px" }}>{it.label}</p><p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", margin:0 }}>{it.desc}</p></div>
            <span style={{ fontSize:9, color:A, padding:"2px 8px", borderRadius:10, border:"1px solid rgba(249,115,22,0.3)", background:"rgba(249,115,22,0.1)" }}>분석</span>
          </div>
        ))}
      </div>
      <div style={{ padding:"0 16px" }}>
        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", lineHeight:1.7, margin:0 }}>부모님과 자녀의 사진을 올리면 AI가 천륜 에너지를 분석해드려요.<br/><span style={{ color:G }}>업로드된 사진은 분석 즉시 삭제됩니다.</span></p>
        </div>
        <button onClick={onNext} style={{ width:"100%", padding:"16px", background:`linear-gradient(135deg,${A},#ea580c)`, border:"none", borderRadius:14, fontSize:15, fontWeight:700, color:"#fff", cursor:"pointer", fontFamily:"inherit", marginBottom:8 }}>시작하기 →</button>
        <button onClick={onClose} style={{ width:"100%", padding:"14px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, fontSize:13, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"inherit" }}>닫기</button>
      </div>
    </div>
  );
}

// ── 2 & 3. 인물선택
function PersonSelect({ idx, first, onSelect, onClose }) {
  return (
    <div style={{ background:DG, borderRadius:"20px 20px 0 0", padding:"0 0 32px" }}>
      <Handle/>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"14px 16px 16px" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontSize:18 }}>👪</span>
            <h3 style={{ fontSize:16, fontWeight:700, color:"#F0EAD6", margin:0 }}>{idx===1 ? "누구와 누구의 관상을 볼까요?" : "두 번째 인물을 선택하세요"}</h3>
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>{idx===1 ? "두 명을 순서대로 선택합니다" : `✓ ${first?.name} 선택됨 → 상대방을 선택하세요`}</p>
        </div>
        <X onClick={onClose}/>
      </div>
      <div style={{ padding:"0 16px" }}>
        {SAVED.map(p => {
          const disabled = idx===2 && first?.id===p.id;
          return (
            <button key={p.id} onClick={() => !disabled && onSelect(p)} style={{ width:"100%", padding:"14px 16px", marginBottom:8, background:disabled?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.05)", border:`1px solid ${disabled?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.1)"}`, borderRadius:14, cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", textAlign:"left", display:"flex", alignItems:"center", gap:12, opacity:disabled?0.4:1 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:p.avatar==="R"?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.08)", border:`2px solid ${p.avatar==="R"?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.15)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>👤</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#F0EAD6" }}>{p.name}</span>
                  <span style={{ fontSize:9, padding:"1px 7px", borderRadius:10, background:p.tag==="본인"?"rgba(249,115,22,0.2)":"rgba(232,200,122,0.15)", color:p.tag==="본인"?"#fdba74":G, border:`1px solid ${p.tag==="본인"?"rgba(249,115,22,0.3)":"rgba(232,200,122,0.3)"}` }}>{p.tag}</span>
                </div>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.birth}</p>
              </div>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:16 }}>›</span>
            </button>
          );
        })}
        <button style={{ width:"100%", padding:"14px 16px", marginBottom:16, background:"transparent", border:`1px dashed rgba(232,200,122,0.3)`, borderRadius:14, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:G, fontSize:13, fontWeight:600 }}>
          <span style={{ fontSize:18 }}>＋</span> 새 인물 추가하고 시작
        </button>
        <button onClick={onClose} style={{ width:"100%", padding:"14px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, fontSize:13, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"inherit" }}>취소</button>
      </div>
    </div>
  );
}

// ── 4. 사진업로드
function PhotoUpload({ p1, p2, onNext, onClose }) {
  const [ph1,setPh1]=useState(null), [ph2,setPh2]=useState(null), [agreed,setAgreed]=useState(false);
  const r1=useRef(), r2=useRef();
  const ok = ph1&&ph2&&agreed;
  const handle = (f,set) => f && set(URL.createObjectURL(f));
  return (
    <div style={{ background:DG, borderRadius:"20px 20px 0 0", padding:"0 0 32px" }}>
      <Handle/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 16px" }}>
        <div><div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}><span style={{ fontSize:18 }}>👪</span><h3 style={{ fontSize:16, fontWeight:700, color:"#F0EAD6", margin:0 }}>부모·자식 관상 궁합</h3></div><p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0 }}>우리는 천륜일까? · 1,980원</p></div>
        <X onClick={onClose}/>
      </div>
      <div style={{ padding:"0 16px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[p1,p2].map((p,i)=>(
            <div key={i} style={{ flex:1, background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.3)", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", margin:"0 0 3px" }}>{i===0?"첫 번째":"두 번째"}</p>
              <p style={{ fontSize:12, fontWeight:600, color:"#fdba74", margin:0 }}>· {p?.name}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setAgreed(v=>!v)} style={{ width:"100%", padding:"12px 14px", marginBottom:14, background:agreed?"rgba(249,115,22,0.08)":"rgba(255,255,255,0.04)", border:`1px solid ${agreed?"rgba(249,115,22,0.3)":"rgba(255,255,255,0.1)"}`, borderRadius:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"flex-start", gap:10, textAlign:"left" }}>
          <div style={{ width:18, height:18, borderRadius:4, flexShrink:0, marginTop:1, background:agreed?A:"transparent", border:`2px solid ${agreed?A:"rgba(255,255,255,0.3)"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>{agreed&&<span style={{ fontSize:10, color:"#fff" }}>✓</span>}</div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.6)", lineHeight:1.7, margin:0 }}>사진 속 인물의 <span style={{ color:A }}>동의를 받았으며</span>, 본 분석은 <span style={{ color:A }}>재미용</span>임을 이해합니다.</p>
        </button>
        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
          <p style={{ fontSize:11, color:G, fontWeight:600, margin:"0 0 8px" }}>📸 정확한 분석을 위한 사진 가이드</p>
          {["1명만 나온 정면 사진","밝은 조명, 선명한 화질"].map((t,i)=><div key={i} style={{ display:"flex", gap:6, marginBottom:4 }}><span style={{ color:"#4ade80", fontSize:11 }}>✓</span><span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{t}</span></div>)}
          {["선글라스·마스크·과도한 필터 금지","단체사진·아기·그림/캐릭터 불가"].map((t,i)=><div key={i} style={{ display:"flex", gap:6, marginBottom:4 }}><span style={{ color:"#f87171", fontSize:11 }}>✗</span><span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{t}</span></div>)}
          <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", margin:"8px 0 0", lineHeight:1.6 }}>🔒 업로드된 사진은 분석 즉시 삭제되며, 서버에 저장되지 않습니다.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[{label:p1?.name||"첫 번째",photo:ph1,setter:setPh1,ref:r1},{label:p2?.name||"두 번째",photo:ph2,setter:setPh2,ref:r2}].map((it,i)=>(
            <div key={i}>
              <p style={{ fontSize:11, color:G, fontWeight:600, margin:"0 0 6px" }}>📸 {it.label}</p>
              <input type="file" accept="image/*" ref={it.ref} onChange={e=>handle(e.target.files[0],it.setter)} style={{ display:"none" }}/>
              <button onClick={()=>it.ref.current?.click()} style={{ width:"100%", aspectRatio:"1", padding:0, background:it.photo?"transparent":"rgba(255,255,255,0.04)", border:`2px dashed ${it.photo?"transparent":"rgba(255,255,255,0.15)"}`, borderRadius:12, cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
                {it.photo?<img src={it.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>:<><span style={{ fontSize:28, opacity:0.4 }}>📷</span><span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>사진 올리기</span></>}
              </button>
            </div>
          ))}
        </div>
        <button onClick={()=>ok&&onNext()} style={{ width:"100%", padding:"16px", marginBottom:8, background:ok?`linear-gradient(135deg,${A},#ea580c)`:"rgba(255,255,255,0.08)", border:"none", borderRadius:14, fontSize:15, fontWeight:700, color:ok?"#fff":"rgba(255,255,255,0.3)", cursor:ok?"pointer":"default", fontFamily:"inherit" }}>부모·자식 궁합 분석하기 (1,980원) →</button>
        <button onClick={onClose} style={{ width:"100%", padding:"14px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, fontSize:13, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"inherit" }}>취소</button>
      </div>
    </div>
  );
}

// ── 5. 사전질문
function Question({ onNext, onClose }) {
  const [qs,setQs]=useState(1), [q1,setQ1]=useState(null), [q2,setQ2]=useState([]);
  const q1opts=[{e:"👩",l:"엄마"},{e:"👨",l:"아빠"},{e:"👵",l:"할머니 (친가)"},{e:"👴",l:"할아버지 (친가)"},{e:"👵",l:"외할머니 (외가)"},{e:"👴",l:"외할아버지 (외가)"},{e:"👩",l:"고모"},{e:"👨",l:"삼촌 (친삼촌·숙부)"},{e:"👩",l:"이모"},{e:"👨",l:"외삼촌"},{e:"👦",l:"형·오빠·남자형제"},{e:"👧",l:"누나·언니·여자형제"},{e:"💭",l:"기타"}];
  const q2opts=[{e:"❤️",l:"우리 기운 잘 맞을까"},{e:"🌟",l:"아기의 타고난 기질·성격"},{e:"💰",l:"아기의 재물복"},{e:"🔮",l:"전생에 어떤 인연이었을까"},{e:"💬",l:"어떻게 키워주면 좋을까"},{e:"🧬",l:"누구를 닮았을까"},{e:"🌈",l:"전체 다 궁금해요!"},{e:"💭",l:"기타"}];
  const tog = (l) => setQ2(p=>p.includes(l)?p.filter(v=>v!==l):[...p,l]);
  return (
    <div style={{ background:DG, borderRadius:"20px 20px 0 0", padding:"0 0 32px" }}>
      <Handle/>
      <div style={{ padding:"12px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:"#F0EAD6", margin:0 }}>👪 부모·자식 관상 궁합</h3><X onClick={onClose}/>
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:"0 0 12px" }}>{qs}/2</p>
        <div style={{ height:3, background:"rgba(255,255,255,0.1)", borderRadius:2, marginBottom:20 }}><div style={{ height:"100%", width:`${qs*50}%`, background:A, borderRadius:2, transition:"0.3s" }}/></div>
        {qs===1&&<>
          <p style={{ fontSize:14, fontWeight:600, color:A, margin:"0 0 12px" }}>아기와 어떤 관계예요?</p>
          <div style={{ maxHeight:360, overflowY:"auto" }}>
            {q1opts.map(o=><button key={o.l} onClick={()=>setQ1(o.l)} style={{ width:"100%", padding:"13px 16px", marginBottom:7, background:q1===o.l?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.05)", border:`1px solid ${q1===o.l?"rgba(249,115,22,0.5)":"rgba(255,255,255,0.1)"}`, borderRadius:12, cursor:"pointer", fontFamily:"inherit", fontSize:13, color:q1===o.l?"#fdba74":"rgba(255,255,255,0.7)", textAlign:"left", display:"flex", alignItems:"center", gap:10 }}><span>{o.e}</span>{o.l}{q1===o.l&&<span style={{ marginLeft:"auto", color:A }}>✓</span>}</button>)}
          </div>
          <button onClick={()=>q1&&setQs(2)} style={{ width:"100%", padding:"15px", marginTop:12, background:q1?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)", border:"none", borderRadius:14, fontSize:14, fontWeight:700, color:q1?"#0D0D14":"rgba(255,255,255,0.3)", cursor:q1?"pointer":"default", fontFamily:"inherit" }}>다음 →</button>
        </>}
        {qs===2&&<>
          <p style={{ fontSize:14, fontWeight:600, color:A, margin:"0 0 4px" }}>가장 궁금한 건?</p>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:"0 0 12px" }}>💡 하나만 고를수록 더 깊고 정밀하게 분석해드려요</p>
          {q2opts.map(o=><button key={o.l} onClick={()=>tog(o.l)} style={{ width:"100%", padding:"13px 16px", marginBottom:7, background:q2.includes(o.l)?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.05)", border:`1px solid ${q2.includes(o.l)?"rgba(249,115,22,0.5)":"rgba(255,255,255,0.1)"}`, borderRadius:12, cursor:"pointer", fontFamily:"inherit", fontSize:13, color:q2.includes(o.l)?"#fdba74":"rgba(255,255,255,0.7)", textAlign:"left", display:"flex", alignItems:"center", gap:10 }}><span>{o.e}</span><span style={{ flex:1 }}>{o.l}</span><div style={{ width:18, height:18, borderRadius:4, flexShrink:0, background:q2.includes(o.l)?A:"transparent", border:`2px solid ${q2.includes(o.l)?A:"rgba(255,255,255,0.3)"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>{q2.includes(o.l)&&<span style={{ fontSize:10, color:"#fff" }}>✓</span>}</div></button>)}
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button onClick={()=>setQs(1)} style={{ flex:1, padding:"15px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, fontSize:13, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontFamily:"inherit" }}>← 이전</button>
            <button onClick={()=>q2.length>0&&onNext({q1,q2})} style={{ flex:2, padding:"15px", background:q2.length>0?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)", border:"none", borderRadius:14, fontSize:14, fontWeight:700, color:q2.length>0?"#0D0D14":"rgba(255,255,255,0.3)", cursor:q2.length>0?"pointer":"default", fontFamily:"inherit" }}>분석 시작 →</button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ── 6. 결제
function Payment({ onNext, onClose }) {
  const [m,setM]=useState("kakao");
  const ms=[{k:"kakao",l:"카카오페이",s:"원터치 간편결제"},{k:"toss",l:"토스페이",s:"간편결제"},{k:"naver",l:"네이버페이",s:"포인트 적립"},{k:"card",l:"카드결제",s:"신용/체크카드"},{k:"phone",l:"핸드폰 결제",s:"통신사 결제"}];
  return (
    <div style={{ background:DG, borderRadius:"20px 20px 0 0", padding:"0 0 32px" }}>
      <Handle/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px 16px" }}><h3 style={{ fontSize:16, fontWeight:700, color:"#F0EAD6", margin:0 }}>결제하기</h3><X onClick={onClose}/></div>
      <div style={{ padding:"0 16px" }}>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 16px", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div><p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", margin:"0 0 2px" }}>💰 보유 캐시</p><p style={{ fontSize:18, fontWeight:700, color:G, margin:0 }}>2,000원</p></div>
          <button style={{ padding:"8px 14px", background:`linear-gradient(135deg,${G},#C4922A)`, border:"none", borderRadius:8, fontSize:12, fontWeight:700, color:"#0D0D14", cursor:"pointer" }}>캐시 사용</button>
        </div>
        {[{i:"🎫",l:"쿠폰 (0장)"},{i:"🎟️",l:"이용권 (0장)"}].map(it=><div key={it.l} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 16px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}><div><p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", margin:"0 0 2px" }}>{it.i} {it.l}</p><p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", margin:0 }}>눌러서 목록 보기</p></div><span style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>›</span></div>)}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>상품 가격</span><span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>1,980원</span></div>
          <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:14, fontWeight:700, color:"#F0EAD6" }}>결제 금액</span><span style={{ fontSize:14, fontWeight:700, color:G }}>1,980원</span></div>
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:"0 0 10px", fontWeight:600 }}>🔐 결제 수단</p>
        {ms.map(mm=><button key={mm.k} onClick={()=>setM(mm.k)} style={{ width:"100%", padding:"14px 16px", marginBottom:8, background:m===mm.k?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.05)", border:`1px solid ${m===mm.k?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.1)"}`, borderRadius:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}><div style={{ width:28, height:28, borderRadius:"50%", background:m===mm.k?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>{m===mm.k&&<div style={{ width:10, height:10, borderRadius:"50%", background:A }}/>}</div><div><p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.8)", margin:"0 0 1px" }}>{mm.l}</p><p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0 }}>{mm.s}</p></div></button>)}
        <button onClick={onNext} style={{ width:"100%", padding:"16px", marginTop:8, background:`linear-gradient(135deg,${G},#C4922A)`, border:"none", borderRadius:14, fontSize:15, fontWeight:700, color:"#0D0D14", cursor:"pointer", fontFamily:"inherit", letterSpacing:0.5 }}>1,980원 결제하기 →</button>
      </div>
    </div>
  );
}

// ── 7. 결과
const TABS=[{k:"total",l:"총운"},{k:"parent",l:"부모님"},{k:"child",l:"자녀"},{k:"harmony",l:"합"},{k:"growth",l:"성장"},{k:"future",l:"미래"},{k:"talisman",l:"개운"}];
const C={
  total:{score:90,grade:"A+",rank:"상위 8%",title:"하늘이 맺어준 천륜의 관계",subtitle:"전생부터 약속한 가족, 이번 생에서 다시 만났어요",good:"이마와 눈매의 기운이 서로 닮음\n천륜상통(天倫相通)의 형상",bad:"사춘기·독립 시기 갈등 주의\n각자 자존심이 강한 형",body:`두 분의 관상을 마주하는 순간, 마치 큰 나무와 그 나무에서 떨어진 씨앗처럼 — 같은 뿌리에서 나온 기운이 느껴졌습니다. 이마의 형태와 눈빛의 에너지가 놀랍도록 닮아 있어요.\n\n전통 관상학에서 '천륜상통(天倫相通)'이라 부르는 형상입니다. 이번 생에서 처음 만난 인연이 아니라, 전생에서도 깊이 연결되어 있던 가족이 다시 이어진 것이에요.\n\n이 관상은 단순한 부모·자식 관계를 넘어, 서로가 서로의 성장을 돕기 위해 이 세상에 함께 온 '동반 성장형' 인연임을 보여줍니다. 자녀가 부모를 통해 배우는 것만큼, 부모도 자녀를 통해 깊은 것을 배우게 되는 관계예요.`},
  parent:{score:null,grade:null,rank:null,title:"부모님 관상 분석",subtitle:"자녀에게 주는 에너지와 영향력",good:"넓은 이마 · 강한 책임감\n자녀를 위해 모든 것을 내어주는 기운",bad:"기대가 높아 압박이 될 수 있음\n표현보다 행동으로 사랑하는 스타일",body:`부모님의 관상에서 가장 강하게 읽히는 것은 이마와 눈썹 사이의 기운입니다. 이 영역은 관상학에서 자녀를 향한 마음과 책임감이 담기는 자리로, 매우 넓고 안정적인 형상이에요.\n\n눈빛에서는 강한 보호 본능과 헌신이 읽힙니다. 자녀를 위해서라면 어떤 희생도 감수할 수 있는 마음이 얼굴 곳곳에 새겨져 있어요. 이런 관상을 가진 부모님 밑에서 자란 자녀는 무의식 중에 '나는 안전하다'는 깊은 안도감을 품게 됩니다.\n\n다만 코의 형태와 입술의 선에서 높은 기준과 기대감이 보여요. 잔소리 대신 '넌 잘 하고 있어'라는 한마디가 관계를 더 깊게 만들어줄 거예요.`},
  child:{score:null,grade:null,rank:null,title:"자녀 관상 분석",subtitle:"타고난 기질과 부모와의 에너지 흐름",good:"맑고 생동감 있는 눈빛\n호기심과 창의력이 넘치는 기운",bad:"자기 주장이 강한 편\n독립심이 일찍 발달할 수 있음",body:`자녀분의 관상에서 가장 먼저 눈에 들어오는 것은 눈빛의 생동감입니다. 맑고 빛나는 눈은 관상학에서 '총명목(聰明目)'의 특징으로, 타고난 지능과 강한 호기심을 나타내요.\n\n이마의 형태는 창의적인 사고와 독립적인 기질을 보여줍니다. 이런 관상의 아이는 정해진 틀보다는 자신만의 방식으로 세상을 탐구하는 것을 좋아해요. 부모님이 기대하는 방향과 다를 수 있지만, 그 독창성이 이 아이의 가장 큰 재능입니다.\n\n귀의 형태는 조상의 덕과 재복을 담는 자리입니다. 두툼하고 귓불이 발달한 형은 평생 먹고사는 걱정 없이 살 수 있는 복이 있다는 의미예요.`},
  harmony:{score:85,grade:"A",rank:"상위 14%",title:"두 관상의 합",subtitle:"서로를 통해 함께 성장하는 관계",good:"서로 닮은 기운 · 강한 유대감\n위기에 더 단단해지는 관계",bad:"너무 가까워 상처도 깊어질 수 있음\n독립 시기 갈등 주의",body:`두 분의 관상을 나란히 놓고 보면, 마치 강물과 그 강에서 자란 돌처럼 — 오랜 시간 함께하며 서로의 형태를 다듬어온 흔적이 보입니다.\n\n부모님의 넓은 이마(포용·책임)와 자녀의 빛나는 눈빛(창의·독립) — 이 조합은 관상학에서 '수목상생(水木相生)'이라 부릅니다. 부모님의 든든한 지원이 자녀의 재능을 키우는 물이 되어주는 형상이에요.\n\n두 분 모두 자존심이 강한 관상으로, 의견 충돌이 생겼을 때 서로 먼저 양보하기 어려울 수 있어요. 하지만 갈등 후에는 반드시 더 깊은 이해로 이어지는 관계예요.`},
  growth:{score:78,grade:"A-",rank:"상위 22%",title:"성장 궁합 — 어떻게 키워주면 빛날까",subtitle:"이 아이에게 맞는 양육법",good:"자유로운 환경에서 더 잘 자람\n창의력을 인정해줄 때 급성장",bad:"통제하면 반발심이 커짐\n비교는 절대 금물",body:`자녀분의 관상을 보면 '내 방식대로 하게 해줘'라는 메시지가 강하게 읽힙니다. 이 아이는 스스로 탐구하고 실패하고 다시 일어서는 과정을 통해 가장 크게 성장하는 기질이에요.\n\n✨ 이 아이에게 맞는 양육법\n첫째, 결과보다 과정을 칭찬해주세요. "잘했다"보다 "혼자서 해봤구나, 대단하다"가 훨씬 효과적이에요.\n둘째, 선택권을 주세요. 사소한 것이라도 스스로 결정하게 하면 책임감이 자연스럽게 생겨요.\n셋째, 비교는 독입니다. 이 아이의 관상은 다른 사람과 비교당할 때 자존감이 크게 흔들리는 형상이에요.`},
  future:{score:88,grade:"A+",rank:"상위 10%",title:"미래 전망 — 나이 들수록 더 좋아지는 사이",subtitle:"성인 이후 친구 같은 관계로 발전해요",good:"성인 이후 친구 같은 관계로 발전\n서로의 가장 든든한 지원군",bad:"청소년기 소통 단절 구간 주의\n이 시기를 잘 넘기면 평생 베프",body:`부모·자식 관계에서 가장 중요한 시기는 자녀가 독립을 시작하는 10대 후반~20대 초반이에요. 두 분의 관상을 보면 이 시기에 잠깐 거리가 생길 수 있지만, 그건 이별이 아니라 성숙의 과정입니다.\n\n자녀가 성인이 된 이후부터 두 분의 관계는 완전히 새로운 국면에 접어들어요. 부모와 자식이 아닌, 인생을 함께 논할 수 있는 친구 같은 관계로 발전할 운세예요.\n\n2026년 이후 자녀분에게 큰 성장의 기운이 들어옵니다. 지금 이 순간 건네는 따뜻한 말 한마디가 자녀의 평생 기억에 남는 힘이 될 거예요.`},
  talisman:{score:null,grade:null,rank:null,title:"개운법 & 행운 아이템",subtitle:"가족 기운을 높이는 방법",good:"土生木 — 흙이 나무를 키우는\n부모의 안정이 자녀의 빛남을 만듦",bad:"木 기운 과다 시 반항기 강해짐\n노란색 아이템으로 균형 맞추기",body:`두 분의 관상 오행 분석 결과, 부모님은 土(토) 기운, 자녀는 木(목) 기운이 강한 형상입니다. 흙 위에서 나무가 자라는 '토생목(土生木)'의 관계예요.\n\n✨ 가족에게 추천하는 개운 아이템\n🟡 노란색 또는 황토색 소품 — 土 기운을 강화해 가족의 안정감 UP\n🌿 함께 키우는 식물 — 木 기운을 함께 키우며 유대감 강화\n🏠 가족사진을 남동쪽 벽에 배치 — 목기(木氣) 방향으로 관계 활성화\n🍊 주황색 쿠션이나 소품 — 소통과 활력을 불어넣는 색\n📅 한 달에 한 번 둘만의 외출 — 일상의 루틴이 관계를 유지하는 힘`},
};

function Result({ p1, p2, answers }) {
  const [tab,setTab]=useState("total"), [full,setFull]=useState(false);
  const c=C[tab]; const paras=c.body.split("\n\n"); const long=paras.length>3; const vis=full||!long?paras:paras.slice(0,3);
  return (
    <div style={{ minHeight:"100vh", background:DG, padding:"20px 12px 40px", fontFamily:"'Noto Serif KR',serif" }}>
      <div style={{ maxWidth:430, margin:"0 auto" }}>

        {/* 결과 카드 */}
        <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.4)", marginBottom:12 }}>
          <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #f3f4f6", textAlign:"center" }}>
            <p style={{ fontSize:9, color:"#9ca3af", letterSpacing:1, margin:0 }}>🔮 천기(天機) 오리지널 | 부모·자식 관상 궁합 리포트</p>
          </div>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}><span style={{ fontSize:18 }}>👪</span><h2 style={{ fontSize:15, fontWeight:700, color:"#111827", margin:0 }}>{p1?.name||"부모님"} &amp; {p2?.name||"자녀"}</h2></div>
              <p style={{ fontSize:11, color:"#6b7280", margin:"0 0 2px" }}>부모·자식 관상 궁합</p>
              <p style={{ fontSize:11, color:"#6b7280", margin:0 }}>{answers?.q1||"👩 엄마"}</p>
            </div>
            <div style={{ background:"#fff7ed", border:"2px solid #fed7aa", borderRadius:14, padding:"10px 14px", textAlign:"center", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:2, justifyContent:"center" }}><span style={{ fontSize:28, fontWeight:700, color:A, lineHeight:1 }}>90</span><span style={{ fontSize:12, fontWeight:700, color:A }}>점</span></div>
              <div style={{ fontSize:9, color:"#9ca3af", marginTop:2 }}>A+등급 · 상위 8%</div>
            </div>
          </div>
          <div style={{ display:"flex", borderBottom:"1px solid #e5e7eb", overflowX:"auto", background:"#fafafa" }}>
            {TABS.map(t=><button key={t.k} onClick={()=>{setTab(t.k);setFull(false);}} style={{ flexShrink:0, padding:"12px 13px", border:"none", borderBottom:tab===t.k?`2px solid ${DG}`:"2px solid transparent", background:"transparent", cursor:"pointer", fontSize:12, fontWeight:tab===t.k?700:500, color:tab===t.k?DG:"#9ca3af", fontFamily:"inherit", transition:"0.15s" }}>{t.l}</button>)}
          </div>
          <div style={{ padding:"18px 16px" }}>
            {c.score&&<div style={{ display:"flex", alignItems:"center", gap:12, background:"#fafafa", borderRadius:12, padding:"12px 14px", marginBottom:16, border:"1px solid #f3f4f6" }}><div style={{ width:48, height:48, borderRadius:"50%", background:"#fff7ed", border:"2px solid #fed7aa", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><span style={{ fontSize:18, fontWeight:700, color:A }}>{c.grade}</span></div><div><div style={{ display:"flex", alignItems:"baseline", gap:4 }}><span style={{ fontSize:32, fontWeight:700, color:A }}>{c.score}</span><span style={{ fontSize:13, color:"#9ca3af" }}>점</span></div><span style={{ fontSize:11, color:"#6b7280" }}>{c.rank}</span></div></div>}
            <h3 style={{ fontSize:16, fontWeight:700, color:"#111827", margin:"0 0 4px" }}>{c.title}</h3>
            <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 16px" }}>{c.subtitle}</p>
            {vis.map((p,i)=><p key={i} style={{ fontSize:13, color:"#374151", lineHeight:1.95, margin:i<vis.length-1?"0 0 14px":0 }}>{p}</p>)}
            {long&&<button onClick={()=>setFull(v=>!v)} style={{ display:"block", width:"100%", padding:"12px 0", marginTop:12, background:"none", border:"none", borderTop:"1px solid #f3f4f6", fontSize:12, color:A, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textAlign:"center" }}>{full?"▲ 접기":"▼ 전체 보기"}</button>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:16 }}>
              <div style={{ background:"#f0fdf4", borderRadius:10, padding:"12px", border:"1px solid #bbf7d0" }}><p style={{ fontSize:9, color:"#16a34a", fontWeight:700, letterSpacing:1, margin:"0 0 5px" }}>✓ 찰떡 관상</p><p style={{ fontSize:11, color:"#166534", lineHeight:1.65, margin:0, whiteSpace:"pre-line" }}>{c.good}</p></div>
              <div style={{ background:"#fef2f2", borderRadius:10, padding:"12px", border:"1px solid #fecaca" }}><p style={{ fontSize:9, color:"#dc2626", fontWeight:700, letterSpacing:1, margin:"0 0 5px" }}>△ 주의 관상</p><p style={{ fontSize:11, color:"#991b1b", lineHeight:1.65, margin:0, whiteSpace:"pre-line" }}>{c.bad}</p></div>
            </div>
          </div>
          <div style={{ padding:"12px 16px 14px", borderTop:"1px solid #f3f4f6", textAlign:"center" }}>
            <p style={{ fontSize:10, color:"#9ca3af", margin:"0 0 3px", lineHeight:1.8 }}>#천기관상 #부모자식궁합 #천륜가족 #상위8%</p>
            <p style={{ fontSize:10, color:"#374151", margin:0, fontWeight:600 }}>🌐 천기.kr</p>
          </div>
        </div>

        {/* 인증서 카드 */}
        <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.4)", marginBottom:20 }}>
          <div style={{ background:CERT_BG, padding:"20px", textAlign:"center" }}>
            <p style={{ fontSize:8, letterSpacing:3, color:"#9a3412", margin:"0 0 2px" }}>CHUNGI ORIGINALS · RAINBOW 🌈</p>
            <p style={{ fontSize:8, letterSpacing:2, color:"#c2410c", margin:"0 0 14px" }}>— 주황 인증서 —</p>
            <div style={{ fontSize:44, marginBottom:10 }}>👪</div>
            <p style={{ fontSize:10, color:"#9a3412", margin:"0 0 4px" }}>— THIS FAMILY IS —</p>
            <p style={{ fontSize:20, fontWeight:700, color:"#7c2d12", margin:"0 0 6px" }}>"👪 천륜 가족"</p>
            <p style={{ fontSize:11, color:"#c2410c", margin:"0 0 14px", lineHeight:1.7 }}>"전생에서 맺은 천륜의 인연,<br/>이번 생에서도 가족으로 다시 만났어요"</p>
            <p style={{ fontSize:12, color:"#9a3412", lineHeight:1.8, margin:"0 0 14px" }}>두 분의 관상에서 읽힌 기운은<br/>이번 생에서 처음 만난 인연이 아니에요.<br/>전생에서 이미 천륜으로 묶인 가족이<br/>다시 서로를 알아본 것입니다.</p>
            <div style={{ display:"flex", gap:5, justifyContent:"center", flexWrap:"wrap", marginBottom:14 }}>
              {["#천륜가족","#상위8%","#전생가족","#동반성장"].map(t=><span key={t} style={{ fontSize:10, padding:"3px 10px", borderRadius:20, background:"rgba(154,52,18,0.08)", color:"#9a3412", border:"1px solid rgba(154,52,18,0.18)" }}>{t}</span>)}
            </div>
            <div style={{ borderTop:`1px solid ${CERT_BORDER}`, paddingTop:10 }}>
              <p style={{ fontSize:8, color:"#c2410c", margin:"0 0 2px", letterSpacing:2 }}>✦ 天機 ORIGINAL · No. 2026-F0018</p>
              <p style={{ fontSize:8, color:"#9a3412", margin:0 }}>— 천기(天機) · 관기 —</p>
            </div>
          </div>
        </div>

        {/* 다크그린 퍼널 영역 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
          <button style={{ padding:"13px", background:"#FEE500", border:"none", borderRadius:12, cursor:"pointer", fontSize:12, fontWeight:700, color:"#3c1e1e", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><span>💬</span> 카카오 공유</button>
          <button style={{ padding:"13px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, cursor:"pointer", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><span>🔗</span> 링크 복사</button>
        </div>
        <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", textAlign:"center", margin:"0 0 20px" }}>*공유하면 50% 확률로 오늘 하루 더 좋은 기운이 터짐 🌿</p>
        <p style={{ fontSize:11, color:G, fontWeight:600, margin:"0 0 10px" }}>✦ 이것도 해볼래요?</p>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:20 }}>
          {[{e:"👶",l:"우리 아기 관상",p:"980원"},{e:"🧬",l:"2세 얼굴 예측",p:"4,800원"},{e:"💑",l:"커플 궁합",p:"1,980원"},{e:"🔮",l:"오늘의 타로",p:"무료"}].map(it=><div key={it.l} style={{ minWidth:80, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 8px", textAlign:"center", flexShrink:0 }}><div style={{ fontSize:22, marginBottom:4 }}>{it.e}</div><div style={{ fontSize:10, fontWeight:600, color:"#F0EAD6", marginBottom:2 }}>{it.l}</div><div style={{ fontSize:10, color:it.p==="무료"?"#4ade80":G }}>{it.p}</div></div>)}
        </div>
        <button style={{ width:"100%", padding:"16px", background:`linear-gradient(135deg,${G},#C4922A)`, border:"none", borderRadius:14, fontSize:15, fontWeight:700, color:"#0D0D14", cursor:"pointer", fontFamily:"inherit", letterSpacing:0.5 }}>확인 완료</button>
      </div>
    </div>
  );
}

export default function ParentChildFull() {
  const [step,setStep]=useState("intro");
  const [p1,setP1]=useState(null), [p2,setP2]=useState(null), [ans,setAns]=useState(null);
  if(step==="intro") return <Popup><Intro onNext={()=>setStep("p1")} onClose={()=>{}}/></Popup>;
  if(step==="p1") return <Popup><PersonSelect idx={1} first={null} onSelect={p=>{setP1(p);setStep("p2");}} onClose={()=>setStep("intro")}/></Popup>;
  if(step==="p2") return <Popup><PersonSelect idx={2} first={p1} onSelect={p=>{setP2(p);setStep("photo");}} onClose={()=>setStep("intro")}/></Popup>;
  if(step==="photo") return <Popup><PhotoUpload p1={p1} p2={p2} onNext={()=>setStep("q")} onClose={()=>setStep("intro")}/></Popup>;
  if(step==="q") return <Popup><Question onNext={a=>{setAns(a);setStep("pay");}} onClose={()=>setStep("intro")}/></Popup>;
  if(step==="pay") return <Popup><Payment onNext={()=>setStep("result")} onClose={()=>setStep("intro")}/></Popup>;
  return <Result p1={p1} p2={p2} answers={ans}/>;
}
