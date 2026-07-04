import { useState, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318", A = "#eab308";
const CB = "linear-gradient(135deg,#fefce8,#fef9c3)", CBR = "#fef08a";

const SAVED = [
  { id:1, name:"○ (본인)", tag:"본인", birth:"2026-04-30 · 양력 · 여", avatar:"R" },
  { id:2, name:"김진순", tag:"관상짤", birth:"undefined · 양력 · undefined", avatar:"W" },
  { id:3, name:"ㄷㄷ", tag:"관상짤", birth:"undefined · 양력 · undefined", avatar:"W" },
  { id:4, name:"윤규미", tag:"본인", birth:" · 양력 · 여", avatar:"R" },
];

const H = () => <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>;
const X = ({onClick}) => <button onClick={onClick} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,cursor:"pointer"}}>✕</button>;
const Wrap = ({children}) => <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}><div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>{children}</div></div>;

function Intro({onNext,onClose}) {
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
    <H/><div style={{display:"flex",justifyContent:"flex-end",padding:"8px 16px 0"}}><X onClick={onClose}/></div>
    <div style={{textAlign:"center",padding:"0 20px 16px"}}>
      <div style={{fontSize:36,marginBottom:8}}>🐾</div>
      <h2 style={{fontSize:20,fontWeight:700,color:A,margin:"0 0 6px"}}>멍·냥 주인 관상 궁합</h2>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",margin:0}}>우리 애랑 나, 전생부터 인연? · 1,980원</p>
    </div>
    <div style={{margin:"0 16px 16px",borderRadius:14,overflow:"hidden",background:"#000",border:`1px solid rgba(234,179,8,0.3)`}}>
      <div style={{background:`linear-gradient(90deg,${DG},#0a1a10)`,padding:"6px 12px",display:"flex",justifyContent:"space-between",borderBottom:"1px solid rgba(234,179,8,0.2)"}}>
        <span style={{fontSize:9,color:G,letterSpacing:2}}>CHUNGI_AI v2.0</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>AI_SCANNING... [OK]</span>
      </div>
      <div style={{height:160,background:"linear-gradient(135deg,#1a1a00,#0a1a0a)",display:"flex",alignItems:"center",justifyContent:"center",gap:24}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(234,179,8,0.2)",border:"2px solid rgba(234,179,8,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 4px"}}>👤</div>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>주인</p>
        </div>
        <div style={{fontSize:26}}>🐾</div>
        <div style={{textAlign:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(234,179,8,0.2)",border:"2px solid rgba(234,179,8,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 4px"}}>🐶</div>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>반려동물</p>
        </div>
      </div>
    </div>
    <div style={{padding:"0 16px 16px"}}>
      {[{i:"🐾",l:"집사 인연 지수",d:"전생부터 이어진 반려동물 인연"},{i:"✨",l:"전생 관계 분석",d:"전생에서 어떤 사이였는지"},{i:"💬",l:"성격 궁합",d:"서로의 에너지가 맞는지"},{i:"🌙",l:"유대감 분석",d:"말 안 해도 통하는 교감"},{i:"🌿",l:"건강 궁합",d:"함께 건강해지는 방법"},{i:"🌈",l:"RAINBOW 인증서",d:"노랑 인증서 발급"}].map((it,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
          <span style={{fontSize:18,flexShrink:0}}>{it.i}</span>
          <div style={{flex:1}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>{it.l}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>{it.d}</p></div>
          <span style={{fontSize:9,color:A,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(234,179,8,0.3)",background:"rgba(234,179,8,0.1)"}}>분석</span>
        </div>
      ))}
    </div>
    <div style={{padding:"0 16px"}}>
      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"12px 14px",marginBottom:16}}>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:0}}>주인과 반려동물 사진을 올리면 AI가 인연 에너지를 분석해드려요.<br/><span style={{color:G}}>업로드된 사진은 분석 즉시 삭제됩니다.</span></p>
      </div>
      <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${A},#ca8a04)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>시작하기 →</button>
      <button onClick={onClose} style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
    </div>
  </div>;
}

function PersonSelect({idx,first,onSelect,onClose}) {
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
    <H/>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"14px 16px 16px"}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:18}}>🐾</span>
          <h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>{idx===1?"누구의 관상을 볼까요?":"반려동물을 선택하세요"}</h3>
        </div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:0}}>{idx===1?"주인을 먼저 선택합니다":`✓ ${first?.name} 선택됨 → 반려동물을 선택하세요`}</p>
      </div>
      <X onClick={onClose}/>
    </div>
    <div style={{padding:"0 16px"}}>
      {SAVED.map(p=>{
        const dis=idx===2&&first?.id===p.id;
        return <button key={p.id} onClick={()=>!dis&&onSelect(p)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:dis?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.05)",border:`1px solid ${dis?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.1)"}`,borderRadius:14,cursor:dis?"not-allowed":"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:12,opacity:dis?0.4:1}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:p.avatar==="R"?"rgba(234,179,8,0.2)":"rgba(255,255,255,0.08)",border:`2px solid ${p.avatar==="R"?"rgba(234,179,8,0.4)":"rgba(255,255,255,0.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
              <span style={{fontSize:13,fontWeight:600,color:"#F0EAD6"}}>{p.name}</span>
              <span style={{fontSize:9,padding:"1px 7px",borderRadius:10,background:p.tag==="본인"?"rgba(234,179,8,0.2)":"rgba(232,200,122,0.15)",color:p.tag==="본인"?"#fde047":G,border:`1px solid ${p.tag==="본인"?"rgba(234,179,8,0.3)":"rgba(232,200,122,0.3)"}`}}>{p.tag}</span>
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.birth}</p>
          </div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:16}}>›</span>
        </button>;
      })}
      <button style={{width:"100%",padding:"14px 16px",marginBottom:16,background:"transparent",border:`1px dashed rgba(232,200,122,0.3)`,borderRadius:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:G,fontSize:13,fontWeight:600}}>
        <span style={{fontSize:18}}>＋</span> 새 인물 추가하고 시작
      </button>
      <button onClick={onClose} style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>취소</button>
    </div>
  </div>;
}

function PhotoUpload({p1,p2,onNext,onClose}) {
  const [ph1,setPh1]=useState(null),[ph2,setPh2]=useState(null),[agreed,setAgreed]=useState(false);
  const r1=useRef(),r2=useRef();
  const ok=ph1&&ph2&&agreed;
  const handle=(f,set)=>f&&set(URL.createObjectURL(f));
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
    <H/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 16px"}}>
      <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><span style={{fontSize:18}}>🐾</span><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>멍·냥 주인 관상 궁합</h3></div><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>우리 애랑 나, 전생부터 인연? · 1,980원</p></div>
      <X onClick={onClose}/>
    </div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[p1,p2].map((p,i)=><div key={i} style={{flex:1,background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",borderRadius:10,padding:"10px 12px",textAlign:"center"}}><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 3px"}}>{i===0?"주인":"반려동물"}</p><p style={{fontSize:12,fontWeight:600,color:"#fde047",margin:0}}>· {p?.name}</p></div>)}
      </div>
      <button onClick={()=>setAgreed(v=>!v)} style={{width:"100%",padding:"12px 14px",marginBottom:14,background:agreed?"rgba(234,179,8,0.08)":"rgba(255,255,255,0.04)",border:`1px solid ${agreed?"rgba(234,179,8,0.3)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"flex-start",gap:10,textAlign:"left"}}>
        <div style={{width:18,height:18,borderRadius:4,flexShrink:0,marginTop:1,background:agreed?A:"transparent",border:`2px solid ${agreed?A:"rgba(255,255,255,0.3)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{agreed&&<span style={{fontSize:10,color:"#0D0D14"}}>✓</span>}</div>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.7,margin:0}}>사진 속 인물의 <span style={{color:A}}>동의를 받았으며</span>, 본 분석은 <span style={{color:A}}>재미용</span>임을 이해합니다.</p>
      </button>
      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",marginBottom:16}}>
        <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 8px"}}>📸 정확한 분석을 위한 사진 가이드</p>
        {["1명(1마리)만 나온 정면 사진","밝은 조명, 선명한 화질"].map((t,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:"#4ade80",fontSize:11}}>✓</span><span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{t}</span></div>)}
        {["선글라스·마스크·과도한 필터 금지","단체사진·그림/캐릭터 불가"].map((t,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:"#f87171",fontSize:11}}>✗</span><span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{t}</span></div>)}
        <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:"8px 0 0",lineHeight:1.6}}>🔒 업로드된 사진은 분석 즉시 삭제됩니다.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[{label:p1?.name||"주인",photo:ph1,setter:setPh1,ref:r1},{label:p2?.name||"반려동물",photo:ph2,setter:setPh2,ref:r2}].map((it,i)=>(
          <div key={i}>
            <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 6px"}}>📸 {it.label}</p>
            <input type="file" accept="image/*" ref={it.ref} onChange={e=>handle(e.target.files[0],it.setter)} style={{display:"none"}}/>
            <button onClick={()=>it.ref.current?.click()} style={{width:"100%",aspectRatio:"1",padding:0,background:it.photo?"transparent":"rgba(255,255,255,0.04)",border:`2px dashed ${it.photo?"transparent":"rgba(255,255,255,0.15)"}`,borderRadius:12,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
              {it.photo?<img src={it.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<><span style={{fontSize:28,opacity:0.4}}>📷</span><span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>사진 올리기</span></>}
            </button>
          </div>
        ))}
      </div>
      <button onClick={()=>ok&&onNext()} style={{width:"100%",padding:"16px",marginBottom:8,background:ok?`linear-gradient(135deg,${A},#ca8a04)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:ok?"#0D0D14":"rgba(255,255,255,0.3)",cursor:ok?"pointer":"default",fontFamily:"inherit"}}>멍·냥 궁합 분석하기 (1,980원) →</button>
      <button onClick={onClose} style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>취소</button>
    </div>
  </div>;
}

function Question({onNext,onClose}) {
  const [qs,setQs]=useState(1),[q1,setQ1]=useState(null),[q2,setQ2]=useState(null);
  const q1o=[{e:"🐶",l:"강아지"},{e:"🐱",l:"고양이"},{e:"🐰",l:"토끼·햄스터 등 소동물"},{e:"💭",l:"기타"}];
  const q2o=[{e:"📅",l:"6개월 미만"},{e:"🌱",l:"6개월~1년"},{e:"💕",l:"1~3년"},{e:"🏠",l:"3~5년"},{e:"👴",l:"5년 이상"},{e:"💭",l:"기타"}];
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
    <H/>
    <div style={{padding:"12px 16px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>🐾 멍·냥 주인 관상 궁합</h3><X onClick={onClose}/>
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>{qs}/2</p>
      <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,marginBottom:20}}><div style={{height:"100%",width:`${qs*50}%`,background:A,borderRadius:2,transition:"0.3s"}}/></div>
      {qs===1&&<>
        <p style={{fontSize:14,fontWeight:600,color:A,margin:"0 0 12px"}}>반려동물 종류는?</p>
        {q1o.map(o=><button key={o.l} onClick={()=>setQ1(o.l)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:q1===o.l?"rgba(234,179,8,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q1===o.l?"rgba(234,179,8,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:q1===o.l?"#fde047":"rgba(255,255,255,0.7)",textAlign:"left",display:"flex",alignItems:"center",gap:10}}><span>{o.e}</span>{o.l}{q1===o.l&&<span style={{marginLeft:"auto",color:A}}>✓</span>}</button>)}
        <button onClick={()=>q1&&setQs(2)} style={{width:"100%",padding:"15px",marginTop:8,background:q1?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q1?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q1?"pointer":"default",fontFamily:"inherit"}}>다음 →</button>
      </>}
      {qs===2&&<>
        <p style={{fontSize:14,fontWeight:600,color:A,margin:"0 0 12px"}}>함께한 기간은?</p>
        {q2o.map(o=><button key={o.l} onClick={()=>setQ2(o.l)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:q2===o.l?"rgba(234,179,8,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q2===o.l?"rgba(234,179,8,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:q2===o.l?"#fde047":"rgba(255,255,255,0.7)",textAlign:"left",display:"flex",alignItems:"center",gap:10}}><span>{o.e}</span>{o.l}{q2===o.l&&<span style={{marginLeft:"auto",color:A}}>✓</span>}</button>)}
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={()=>setQs(1)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button>
          <button onClick={()=>q2&&onNext({q1,q2})} style={{flex:2,padding:"15px",background:q2?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q2?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q2?"pointer":"default",fontFamily:"inherit"}}>분석 시작 →</button>
        </div>
      </>}
    </div>
  </div>;
}

function Payment({onNext,onClose}) {
  const [m,setM]=useState("kakao");
  const ms=[{k:"kakao",l:"카카오페이",s:"원터치 간편결제"},{k:"toss",l:"토스페이",s:"간편결제"},{k:"naver",l:"네이버페이",s:"포인트 적립"},{k:"card",l:"카드결제",s:"신용/체크카드"},{k:"phone",l:"핸드폰 결제",s:"통신사 결제"}];
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
    <H/><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px 16px"}}><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>결제하기</h3><X onClick={onClose}/></div>
    <div style={{padding:"0 16px"}}>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div>
        <button style={{padding:"8px 14px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:8,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button>
      </div>
      {[{i:"🎫",l:"쿠폰 (0장)"},{i:"🎟️",l:"이용권 (0장)"}].map(it=><div key={it.l} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>{it.i} {it.l}</p><p style={{fontSize:12,color:"rgba(255,255,255,0.3)",margin:0}}>눌러서 목록 보기</p></div><span style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>›</span></div>)}
      <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>상품 가격</span><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>1,980원</span></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:14,fontWeight:700,color:G}}>1,980원</span></div>
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 10px",fontWeight:600}}>🔐 결제 수단</p>
      {ms.map(mm=><button key={mm.k} onClick={()=>setM(mm.k)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:m===mm.k?"rgba(234,179,8,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${m===mm.k?"rgba(234,179,8,0.4)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}><div style={{width:28,height:28,borderRadius:"50%",background:m===mm.k?"rgba(234,179,8,0.2)":"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>{m===mm.k&&<div style={{width:10,height:10,borderRadius:"50%",background:A}}/>}</div><div><p style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)",margin:"0 0 1px"}}>{mm.l}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{mm.s}</p></div></button>)}
      <button onClick={onNext} style={{width:"100%",padding:"16px",marginTop:8,background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.5}}>1,980원 결제하기 →</button>
    </div>
  </div>;
}

const TABS=[{k:"total",l:"총운"},{k:"owner",l:"주인"},{k:"pet",l:"반려동물"},{k:"harmony",l:"합"},{k:"life",l:"일상"},{k:"future",l:"미래"},{k:"talisman",l:"개운"}];
const C={
  total:{score:94,grade:"S",rank:"상위 4%",title:"천생 집사와 반려동물",subtitle:"전생부터 함께한 인연, 이번 생에서 다시 만났어요",good:"강한 신뢰감 · 눈빛으로 통하는 사이\n함께 있을수록 기운이 상승",bad:"분리불안 주의\n주인 스트레스에 민감하게 반응",body:`주인의 눈매와 반려동물의 눈빛 에너지가 강하게 공명합니다. 전통 관상학적으로 '주종상합(主從相合)'의 최상급 조합으로, 전생에서도 함께했던 인연이 이번 생에서 다시 이어진 형상이에요.\n\n처음 만난 순간 '이 아이다' 싶은 강한 끌림이 있으셨나요? 그건 직감이 아니라 전생의 기억이 남긴 신호였어요.\n\n집에서 반려동물이 있는 것만으로도 기운이 안정되고, 힘든 날 곁에 있어주는 것만으로도 치유가 되는 — 이런 관계는 정말 드물고 소중한 인연이에요.`},
  owner:{score:null,grade:null,rank:null,title:"주인 관상 분석",subtitle:"반려동물에게 주는 에너지",good:"따뜻하고 안정적인 기운\n반려동물이 본능적으로 신뢰함",bad:"감정 기복이 클 때 반려동물도 불안해함\n규칙적인 루틴이 중요",body:`주인의 관상에서 가장 먼저 눈에 들어오는 것은 눈 주변의 기운입니다. 관상학에서 '남녀궁(男女宮)'이라 부르는 이 영역이 따뜻하고 윤기가 있는 형상으로, 생명에 대한 깊은 애정과 책임감이 얼굴에 새겨져 있어요.\n\n입술의 형태에서 부드러운 언어 에너지가 읽힙니다. 반려동물에게 말을 걸고, 이름을 자주 부르고, 눈을 마주치는 방식으로 소통하는 스타일이에요.\n\n다만 이마에서 강한 감정 기복의 에너지가 보여요. 주인이 스트레스를 받을 때, 반려동물은 그것을 고스란히 흡수해요. 내가 지쳐있을 때 반려동물도 함께 지쳐있다는 걸 기억해주세요.`},
  pet:{score:null,grade:null,rank:null,title:"반려동물 관상 분석",subtitle:"타고난 기질과 주인과의 에너지",good:"주인을 끝없이 신뢰하는 눈빛\n감정 교감 능력 최상",bad:"혼자 있는 시간에 외로움 느낌\n분리불안 체크 필요",body:`반려동물의 눈에서 가장 강하게 읽히는 것은 신뢰와 애정의 기운입니다. 주인을 바라볼 때 눈동자가 살짝 커지는 형상은 관상학적으로 '애정목(愛情目)'의 특징으로, 이 세상에서 주인이 전부인 사랑을 표현하고 있어요.\n\n귀와 이마의 형태에서 높은 지능과 감수성이 보입니다. 주인의 기분 변화를 발 소리만으로도 구분하는 능력, 주인이 슬플 때 먼저 다가와 곁에 있어주는 행동 — 이 모든 것이 타고난 감수성에서 비롯된 거예요.\n\n코와 입 주변의 기운은 수명과 건강을 담당하는 자리입니다. 전체적으로 밝고 윤기가 있는 형상으로, 건강하고 오래오래 함께할 운세를 갖고 있어요.`},
  harmony:{score:96,grade:"S+",rank:"상위 2%",title:"궁합 합산",subtitle:"말 안 해도 통하는 영혼의 단짝",good:"감정 교감이 최상급\n함께 있을수록 서로의 기운 상승",bad:"너무 강한 유대감 → 분리 시 스트레스\n짧은 분리 연습 필요",body:`두 분의 관상을 나란히 놓고 보면 — 마치 오랫동안 함께 살아온 사람처럼 서로의 에너지가 하나로 어우러져 있는 것이 보입니다.\n\n주인의 따뜻한 기운과 반려동물의 순수한 신뢰 — 이 조합은 관상학에서 보기 드문 '상생쌍합(相生雙合)'의 형상이에요. 두 기운이 만날 때 어느 한쪽도 소모되지 않고, 오히려 서로를 충전시키는 관계입니다.\n\n주인이 힘들 때 반려동물 곁에 있으면 신기하게 기운이 회복되는 경험을 하셨나요? 두 분의 기운은 실제로 서로를 치유하는 에너지를 갖고 있습니다.`},
  life:{score:88,grade:"A+",rank:"상위 8%",title:"일상 궁합",subtitle:"함께하는 루틴이 두 분을 더 강하게 만들어요",good:"산책·놀이·식사 시간의 기운 최상\n규칙적인 루틴이 둘 다 안정시킴",bad:"주인의 불규칙한 생활 패턴\n반려동물 건강에 영향",body:`두 분의 일상 에너지 흐름을 보면, 오전 시간대에 기운이 가장 잘 맞습니다. 아침 산책이나 밥 주는 루틴을 통해 하루를 함께 시작하면 두 분 모두에게 긍정적인 기운이 퍼져나가요.\n\n저녁 시간대는 휴식과 유대감의 시간입니다. 소파에서 함께 쉬거나, 조용히 옆에 있어주는 것만으로도 서로의 기운이 안정되는 시간이에요.\n\n주인이 외출할 때 반려동물은 기운이 불안정해지는 형상입니다. 떠나기 전 짧게라도 눈을 맞추고 "금방 와"라고 말해주는 루틴이 분리불안을 크게 줄여줄 수 있어요.`},
  future:{score:92,grade:"S",rank:"상위 6%",title:"미래 전망",subtitle:"오래오래 함께할 운세를 갖고 있어요",good:"건강하고 장수할 기운\n나이 들수록 더 깊어지는 유대",bad:"주인의 생활 변화에 적응 시간 필요\n큰 변화 전 충분한 적응 기간 주기",body:`반려동물의 관상에서 장수의 기운이 강하게 읽힙니다. 귀의 형태와 코의 윤기 — 이 두 가지는 건강과 수명을 담당하는 자리인데, 두 곳 모두 매우 좋은 형상이에요.\n\n두 분의 에너지는 시간이 지날수록 더욱 깊고 단단해지는 형상입니다. 처음 함께했을 때보다 지금이 더 좋고, 지금보다 내년이 더 좋아질 인연이에요.\n\n주인에게 큰 변화가 생기는 시기에 반려동물도 영향을 받을 수 있어요. 이럴 때는 기존의 루틴을 최대한 유지해주는 것이 좋아요.`},
  talisman:{score:null,grade:null,rank:null,title:"개운법 & 집사 아이템",subtitle:"두 분의 기운을 높이는 방법",good:"함께하는 산책·놀이 시간\n황금 시간대: 오전 7~9시",bad:"주인의 극심한 스트레스\n반려동물도 함께 지침",body:`두 분의 관상 오행 분석 결과, 주인은 木(목) 기운, 반려동물은 土(토) 기운이 강한 형상입니다. 나무가 흙에서 자라는 '목의토(木依土)'의 관계 — 반려동물의 안정적인 기운이 주인의 성장을 돕고, 주인의 풍부한 감성이 반려동물의 삶을 풍요롭게 만들어요.\n\n✨ 두 분에게 추천하는 개운 아이템\n🟡 노란색 또는 연두색 반려동물 용품 — 서로의 기운을 조화롭게 연결\n🌿 자연 소재 장난감 — 土 기운을 활성화해 반려동물 안정감 UP\n☀️ 매일 아침 함께 햇빛 쬐기 — 두 분 모두의 기운을 충전\n📸 함께한 사진을 거실에 배치 — 인연의 에너지를 지속적으로 강화`},
};

function Result({p1,p2,answers}) {
  const [tab,setTab]=useState("total"),[full,setFull]=useState(false);
  const c=C[tab]; const paras=c.body.split("\n\n"); const long=paras.length>3; const vis=full||!long?paras:paras.slice(0,3);
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      {/* 결과 카드 */}
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"14px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}>
          <p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 멍·냥 주인 관상 궁합 리포트</p>
        </div>
        <div style={{padding:"14px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:18}}>🐾</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>{p1?.name||"주인"}님 &amp; {answers?.q1||"강아지"}</h2></div>
            <p style={{fontSize:11,color:"#6b7280",margin:"0 0 2px"}}>멍·냥 주인 관상 궁합</p>
            <p style={{fontSize:11,color:"#6b7280",margin:0}}>함께한 지 {answers?.q2||"1~3년"}</p>
          </div>
          <div style={{background:"#fefce8",border:"2px solid #fef08a",borderRadius:14,padding:"10px 14px",textAlign:"center",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"baseline",gap:2,justifyContent:"center"}}><span style={{fontSize:28,fontWeight:700,color:A,lineHeight:1}}>94</span><span style={{fontSize:12,fontWeight:700,color:A}}>점</span></div>
            <div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>S등급 · 상위 4%</div>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",overflowX:"auto",background:"#fafafa"}}>
          {TABS.map(t=><button key={t.k} onClick={()=>{setTab(t.k);setFull(false);}} style={{flexShrink:0,padding:"12px 13px",border:"none",borderBottom:tab===t.k?`2px solid ${DG}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:tab===t.k?700:500,color:tab===t.k?DG:"#9ca3af",fontFamily:"inherit",transition:"0.15s"}}>{t.l}</button>)}
        </div>
        <div style={{padding:"18px 16px"}}>
          {c.score&&<div style={{display:"flex",alignItems:"center",gap:12,background:"#fafafa",borderRadius:12,padding:"12px 14px",marginBottom:16,border:"1px solid #f3f4f6"}}><div style={{width:48,height:48,borderRadius:"50%",background:"#fefce8",border:"2px solid #fef08a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18,fontWeight:700,color:A}}>{c.grade}</span></div><div><div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:32,fontWeight:700,color:A}}>{c.score}</span><span style={{fontSize:13,color:"#9ca3af"}}>점</span></div><span style={{fontSize:11,color:"#6b7280"}}>{c.rank}</span></div></div>}
          <h3 style={{fontSize:16,fontWeight:700,color:"#111827",margin:"0 0 4px"}}>{c.title}</h3>
          <p style={{fontSize:12,color:"#6b7280",margin:"0 0 16px"}}>{c.subtitle}</p>
          {vis.map((p,i)=><p key={i} style={{fontSize:13,color:"#374151",lineHeight:1.95,margin:i<vis.length-1?"0 0 14px":0}}>{p}</p>)}
          {long&&<button onClick={()=>setFull(v=>!v)} style={{display:"block",width:"100%",padding:"12px 0",marginTop:12,background:"none",border:"none",borderTop:"1px solid #f3f4f6",fontSize:12,color:A,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>{full?"▲ 접기":"▼ 전체 보기"}</button>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}}>
            <div style={{background:"#f0fdf4",borderRadius:10,padding:"12px",border:"1px solid #bbf7d0"}}><p style={{fontSize:9,color:"#16a34a",fontWeight:700,letterSpacing:1,margin:"0 0 5px"}}>✓ 찰떡 관상</p><p style={{fontSize:11,color:"#166534",lineHeight:1.65,margin:0,whiteSpace:"pre-line"}}>{c.good}</p></div>
            <div style={{background:"#fef2f2",borderRadius:10,padding:"12px",border:"1px solid #fecaca"}}><p style={{fontSize:9,color:"#dc2626",fontWeight:700,letterSpacing:1,margin:"0 0 5px"}}>△ 주의 관상</p><p style={{fontSize:11,color:"#991b1b",lineHeight:1.65,margin:0,whiteSpace:"pre-line"}}>{c.bad}</p></div>
          </div>
        </div>
        <div style={{padding:"12px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}>
          <p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px",lineHeight:1.8}}>#천기관상 #집사인연 #멍냥궁합 #상위4%</p>
          <p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
      </div>
      {/* 인증서 */}
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:20}}>
        <div style={{background:CB,padding:"20px",textAlign:"center"}}>
          <p style={{fontSize:8,letterSpacing:3,color:"#854d0e",margin:"0 0 2px"}}>CHUNGI ORIGINALS · RAINBOW 🌈</p>
          <p style={{fontSize:8,letterSpacing:2,color:"#92400e",margin:"0 0 14px"}}>— 노랑 인증서 —</p>
          <div style={{fontSize:44,marginBottom:10}}>🐕‍🦺</div>
          <p style={{fontSize:10,color:"#854d0e",margin:"0 0 4px"}}>— THIS IS —</p>
          <p style={{fontSize:20,fontWeight:700,color:"#713f12",margin:"0 0 6px"}}>"🐕‍🦺 집사 인연"</p>
          <p style={{fontSize:11,color:"#92400e",margin:"0 0 14px",lineHeight:1.7}}>"전생에서 함께했던 인연,<br/>이번 생에서도 최고의 집사로 만났어요"</p>
          <p style={{fontSize:12,color:"#854d0e",lineHeight:1.8,margin:"0 0 14px"}}>두 분의 관상에서 읽힌 기운은<br/>이번 생에서 처음 만난 인연이 아니에요.<br/>전생에서 이미 함께했던 인연이<br/>다시 이어진 것입니다.</p>
          <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
            {["#집사인연","#상위4%","#전생반려","#영혼의단짝"].map(t=><span key={t} style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"rgba(133,77,14,0.08)",color:"#854d0e",border:"1px solid rgba(133,77,14,0.18)"}}>{t}</span>)}
          </div>
          <div style={{borderTop:`1px solid ${CBR}`,paddingTop:10}}>
            <p style={{fontSize:8,color:"#92400e",margin:"0 0 2px",letterSpacing:2}}>✦ 天機 ORIGINAL · No. 2026-P0031</p>
            <p style={{fontSize:8,color:"#854d0e",margin:0}}>— 천기(天機) · 관기 —</p>
          </div>
        </div>
      </div>
      {/* 퍼널 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span>💬</span> 카카오 공유</button>
        <button style={{padding:"13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span>🔗</span> 링크 복사</button>
      </div>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px"}}>*공유하면 50% 확률로 오늘 하루 더 좋은 기운이 터짐 🌿</p>
      <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 10px"}}>✦ 이것도 해볼래요?</p>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
        {[{e:"🪞",l:"내 관상보기",p:"980원"},{e:"💑",l:"커플 궁합",p:"1,980원"},{e:"👶",l:"우리 아기 관상",p:"980원"},{e:"🔮",l:"오늘의 타로",p:"무료"}].map(it=><div key={it.l} style={{minWidth:80,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 8px",textAlign:"center",flexShrink:0}}><div style={{fontSize:22,marginBottom:4}}>{it.e}</div><div style={{fontSize:10,fontWeight:600,color:"#F0EAD6",marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:it.p==="무료"?"#4ade80":G}}>{it.p}</div></div>)}
      </div>
      <button style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.5}}>확인 완료</button>
    </div>
  </div>;
}

export default function PetFull() {
  const [step,setStep]=useState("intro");
  const [p1,setP1]=useState(null),[p2,setP2]=useState(null),[ans,setAns]=useState(null);
  if(step==="intro") return <Wrap><Intro onNext={()=>setStep("p1")} onClose={()=>{}}/></Wrap>;
  if(step==="p1") return <Wrap><PersonSelect idx={1} first={null} onSelect={p=>{setP1(p);setStep("p2");}} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="p2") return <Wrap><PersonSelect idx={2} first={p1} onSelect={p=>{setP2(p);setStep("photo");}} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="photo") return <Wrap><PhotoUpload p1={p1} p2={p2} onNext={()=>setStep("q")} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="q") return <Wrap><Question onNext={a=>{setAns(a);setStep("pay");}} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="pay") return <Wrap><Payment onNext={()=>setStep("result")} onClose={()=>setStep("intro")}/></Wrap>;
  return <Result p1={p1} p2={p2} answers={ans}/>;
}
