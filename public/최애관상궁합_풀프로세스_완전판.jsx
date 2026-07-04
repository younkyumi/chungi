// ============================================================
// 천기(chungi.kr) 관상 궁합 풀프로세스 완전판
// 베프 / 최애 / 비즈니스 / 악연·상극
// ============================================================
// 사용법: 각 export를 파일로 분리하거나 탭 UI로 전환
// ============================================================

import { useState, useRef } from "react";
const G="#E8C87A",DG="#0D2318";

// ── 공통 컴포넌트
const H=()=><div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>;
const X=({onClick})=><button onClick={onClick} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,cursor:"pointer"}}>✕</button>;
const Wrap=({children})=><div style={{minHeight:"100vh",background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}><div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>{children}</div></div>;

const SAVED=[
  {id:1,name:"○ (본인)",tag:"본인",birth:"2026-04-30 · 양력 · 여",avatar:"R"},
  {id:2,name:"김진순",tag:"관상짤",birth:"undefined · 양력 · undefined",avatar:"W"},
  {id:3,name:"ㄷㄷ",tag:"관상짤",birth:"undefined · 양력 · undefined",avatar:"W"},
  {id:4,name:"윤규미",tag:"본인",birth:" · 양력 · 여",avatar:"R"},
];

function PayStep({price,accentColor,onNext,onClose}){
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
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>상품 가격</span><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{price}</span></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:14,fontWeight:700,color:G}}>{price}</span></div>
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 10px",fontWeight:600}}>🔐 결제 수단</p>
      {ms.map(mm=><button key={mm.k} onClick={()=>setM(mm.k)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:m===mm.k?`${accentColor}18`:"rgba(255,255,255,0.05)",border:`1px solid ${m===mm.k?`${accentColor}55`:"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}><div style={{width:28,height:28,borderRadius:"50%",background:m===mm.k?`${accentColor}22`:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>{m===mm.k&&<div style={{width:10,height:10,borderRadius:"50%",background:accentColor}}/>}</div><div><p style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)",margin:"0 0 1px"}}>{mm.l}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{mm.s}</p></div></button>)}
      <button onClick={onNext} style={{width:"100%",padding:"16px",marginTop:8,background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.5}}>{price} 결제하기 →</button>
    </div>
  </div>;
}

function PersonSelectStep({emoji,title,idx,first,accentColor,onSelect,onClose}){
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
    <H/>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"14px 16px 16px"}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:18}}>{emoji}</span><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>{idx===1?"누구와 누구의 궁합을 볼까요?":"두 번째 인물을 선택하세요"}</h3></div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:0}}>{idx===1?"두 명을 순서대로 선택합니다":`✓ ${first?.name} 선택됨 → 상대방을 선택하세요`}</p>
      </div>
      <X onClick={onClose}/>
    </div>
    <div style={{padding:"0 16px"}}>
      {SAVED.map(p=>{
        const dis=idx===2&&first?.id===p.id;
        return <button key={p.id} onClick={()=>!dis&&onSelect(p)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:dis?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.05)",border:`1px solid ${dis?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.1)"}`,borderRadius:14,cursor:dis?"not-allowed":"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:12,opacity:dis?0.4:1}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:p.avatar==="R"?`${accentColor}22`:"rgba(255,255,255,0.08)",border:`2px solid ${p.avatar==="R"?`${accentColor}55`:"rgba(255,255,255,0.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:13,fontWeight:600,color:"#F0EAD6"}}>{p.name}</span><span style={{fontSize:9,padding:"1px 7px",borderRadius:10,background:p.tag==="본인"?`${accentColor}22`:"rgba(232,200,122,0.15)",color:p.tag==="본인"?accentColor:G,border:`1px solid ${p.tag==="본인"?`${accentColor}44`:"rgba(232,200,122,0.3)"}`}}>{p.tag}</span></div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.birth}</p>
          </div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:16}}>›</span>
        </button>;
      })}
      <button style={{width:"100%",padding:"14px 16px",marginBottom:16,background:"transparent",border:`1px dashed rgba(232,200,122,0.3)`,borderRadius:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:G,fontSize:13,fontWeight:600}}><span style={{fontSize:18}}>＋</span> 새 인물 추가하고 시작</button>
      <button onClick={onClose} style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>취소</button>
    </div>
  </div>;
}

function PhotoUploadStep({emoji,ctaLabel,price,accentColor,p1,p2,onNext,onClose}){
  const [ph1,setPh1]=useState(null),[ph2,setPh2]=useState(null),[agreed,setAgreed]=useState(false);
  const r1=useRef(),r2=useRef();
  const ok=ph1&&ph2&&agreed;
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
    <H/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 16px"}}>
      <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><span style={{fontSize:18}}>{emoji}</span><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>{ctaLabel}</h3></div><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{price}</p></div>
      <X onClick={onClose}/>
    </div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[p1,p2].map((p,i)=><div key={i} style={{flex:1,background:`${accentColor}18`,border:`1px solid ${accentColor}44`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 3px"}}>{i===0?"첫 번째":"두 번째"}</p><p style={{fontSize:12,fontWeight:600,color:accentColor,margin:0}}>· {p?.name}</p></div>)}
      </div>
      <button onClick={()=>setAgreed(v=>!v)} style={{width:"100%",padding:"12px 14px",marginBottom:14,background:agreed?`${accentColor}11`:"rgba(255,255,255,0.04)",border:`1px solid ${agreed?`${accentColor}44`:"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"flex-start",gap:10,textAlign:"left"}}>
        <div style={{width:18,height:18,borderRadius:4,flexShrink:0,marginTop:1,background:agreed?accentColor:"transparent",border:`2px solid ${agreed?accentColor:"rgba(255,255,255,0.3)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{agreed&&<span style={{fontSize:10,color:"#fff"}}>✓</span>}</div>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.7,margin:0}}>사진 속 인물의 <span style={{color:accentColor}}>동의를 받았으며</span>, 본 분석은 <span style={{color:accentColor}}>재미용</span>임을 이해합니다.</p>
      </button>
      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",marginBottom:16}}>
        <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 8px"}}>📸 정확한 분석을 위한 사진 가이드</p>
        {["1명만 나온 정면 사진","밝은 조명, 선명한 화질"].map((t,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:"#4ade80",fontSize:11}}>✓</span><span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{t}</span></div>)}
        {["선글라스·마스크·과도한 필터 금지","단체사진·아기·그림/캐릭터 불가"].map((t,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:"#f87171",fontSize:11}}>✗</span><span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{t}</span></div>)}
        <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:"8px 0 0"}}>🔒 업로드된 사진은 분석 즉시 삭제됩니다.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[{label:p1?.name||"첫 번째",photo:ph1,setter:setPh1,ref:r1},{label:p2?.name||"두 번째",photo:ph2,setter:setPh2,ref:r2}].map((it,i)=>(
          <div key={i}>
            <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 6px"}}>📸 {it.label}</p>
            <input type="file" accept="image/*" ref={it.ref} onChange={e=>e.target.files[0]&&it.setter(URL.createObjectURL(e.target.files[0]))} style={{display:"none"}}/>
            <button onClick={()=>it.ref.current?.click()} style={{width:"100%",aspectRatio:"1",padding:0,background:it.photo?"transparent":"rgba(255,255,255,0.04)",border:`2px dashed ${it.photo?"transparent":"rgba(255,255,255,0.15)"}`,borderRadius:12,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
              {it.photo?<img src={it.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<><span style={{fontSize:28,opacity:0.4}}>📷</span><span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>사진 올리기</span></>}
            </button>
          </div>
        ))}
      </div>
      <button onClick={()=>ok&&onNext()} style={{width:"100%",padding:"16px",marginBottom:8,background:ok?`linear-gradient(135deg,${accentColor},${accentColor}bb)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:ok?"#fff":"rgba(255,255,255,0.3)",cursor:ok?"pointer":"default",fontFamily:"inherit"}}>{ctaLabel} 분석하기 ({price}) →</button>
      <button onClick={onClose} style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>취소</button>
    </div>
  </div>;
}

// ─────────────────────────────────────────
// 베프 관상 궁합 (초록 #22c55e)
// ─────────────────────────────────────────
const BFF_A="#22c55e";
const BFF_TABS=[{k:"total",l:"총운"},{k:"me",l:"나"},{k:"bff",l:"베프"},{k:"harmony",l:"합"},{k:"fight",l:"갈등"},{k:"future",l:"미래"},{k:"talisman",l:"개운"}];
const BFF_C={
  total:{score:87,grade:"A+",rank:"상위 11%",title:"전생부터 이어진 천생 베프",subtitle:"이유 없이 편안한 이 사람, 전생의 기억이 남긴 신호예요",good:"자연스러운 케미 · 말 안 해도 아는 사이\n처음 만났는데 오래된 친구 같은 느낌",bad:"너무 가까워 상처도 깊음\n의존도 과다 주의",body:`두 분의 관상을 처음 마주했을 때 — 마치 오래된 책의 페이지와 페이지처럼, 서로의 이야기를 이미 알고 있는 듯한 기운이 느껴졌습니다.\n\n두 분의 눈매에서 읽히는 에너지는 전통 관상학에서 '막역지우(莫逆之友)'의 형상입니다. 이는 평생을 함께할 진정한 친구를 의미해요. 처음 만났을 때 '어? 이 사람 왠지 낯설지 않아'라고 느끼셨나요? 전생의 기억이 이번 생에서도 작동한 신호예요.\n\n어떤 계기로 친해졌든, 두 분의 관상을 보면 이 만남은 우연이 아니라 필연이었습니다.`},
  me:{score:null,grade:null,rank:null,title:"나의 관상 분석",subtitle:"베프에게 주는 나의 에너지",good:"진심을 다해 사람을 대하는 기운\n한 번 정을 주면 끝까지 가는 스타일",bad:"상처를 표현하지 못하고 삭이는 경향\n오래된 감정이 쌓이면 터짐",body:`관상에서 가장 먼저 눈에 들어오는 것은 눈썹의 형태입니다. 자연스럽게 자란 눈썹은 '인복목(人福目)'의 기운을 담고 있어요. 사람들이 이유 없이 끌리고, 베푸는 사람에게는 반드시 더 큰 것으로 돌아오는 기운입니다.\n\n입술의 형태에서 솔직함과 의리가 읽혀요. 친구를 위해서라면 자신을 희생하는 것도 마다하지 않는 기질이지만, 그 과정에서 자신의 감정을 너무 억누르지 않도록 조심하세요.\n\n귀의 형태에서는 인복이 강하게 보여요. 이 관상을 가진 사람은 진정한 친구를 오래오래 곁에 두는 복을 타고났습니다.`},
  bff:{score:null,grade:null,rank:null,title:"베프 관상 분석",subtitle:"나에게 주는 베프의 에너지",good:"강한 추진력으로 나를 앞으로 이끌어줌\n내가 망설일 때 먼저 손 내미는 스타일",bad:"솔직한 말이 때로 상처가 될 수 있음\n감정보다 팩트를 먼저 말하는 스타일",body:`베프분의 관상에서 가장 강하게 읽히는 것은 눈빛의 생동감입니다. 항상 뭔가를 찾고, 발견하고, 만들어내려는 에너지가 넘쳐요. 이런 기운의 사람 옆에 있으면 자연스럽게 나도 활기를 띠게 됩니다.\n\n이마의 형태는 독립적인 사고와 빠른 판단력을 보여줍니다. 처음 만났을 때 '이 사람 되게 시원시원하다'고 느끼셨나요? 그 시원함은 단순한 성격이 아니라 타고난 기운이에요.\n\n광대뼈의 형태에서 강한 사회성과 추진력이 보입니다. 다만 이 추진력이 가끔 '왜 이렇게 빠르게 가려고 해?'라는 부담을 줄 수 있어요.`},
  harmony:{score:92,grade:"S",rank:"상위 6%",title:"우정 합산",subtitle:"평생 가는 찐친의 에너지 구조",good:"무조건적인 지지 · 서로의 성장을 응원\n어떤 상황에서도 편이 되어주는 관계",bad:"연애 문제로 갈등 가능성\n서로의 연인이 끼면 복잡해질 수 있음",body:`두 분의 관상을 나란히 놓고 보면 — 서로 다른 악기가 하나의 화음을 만들어내듯, 각자의 기운이 합쳐질 때 더 아름다운 소리가 나는 형상입니다.\n\n나의 안정적인 기운과 베프의 역동적인 기운 — 이 조합은 관상학에서 '이합지우(以合之友)'라 부릅니다. 서로 다르기 때문에 오래갈 수 있는 우정이에요.\n\n87점이라는 우정 궁합은 단순히 '잘 맞는다'를 넘어, 서로에게 진정한 성장을 가져다주는 관계임을 의미해요.`},
  fight:{score:70,grade:"B+",rank:"상위 30%",title:"갈등 패턴",subtitle:"이걸 조심하면 평생 베프",good:"갈등 후 더 솔직해지는 관계\n빠른 화해 에너지",bad:"연애·이성 문제로 갈등 가능성\n서로의 비밀이 무기가 될 수 있음",body:`두 분의 갈등 패턴에서 가장 주의해야 할 것은 '말하지 않는 것들'입니다. 두 분 모두 상대방을 위해 참고 넘어가는 성향이 있어요. 이게 쌓이면 어느 순간 예상치 못한 큰 폭발로 이어질 수 있습니다.\n\n연애 이야기가 갈등의 불씨가 될 수 있어요. 상대방의 연인을 마음에 들어 하지 않을 때, 이 부분을 미리 솔직하게 이야기해두는 것이 중요합니다.\n\n✨ 갈등 예방법 — '나 요즘 섭섭해'라고 말할 수 있는 관계를 유지하세요. 참지 말고 말하세요.`},
  future:{score:85,grade:"A",rank:"상위 15%",title:"우정의 미래",subtitle:"나이 들어도 연락하는 그 사람",good:"인생의 큰 변화에도 유지되는 우정\n각자 바쁠 때도 기다려주는 관계",bad:"바쁜 시기 의식적 연락 노력 필요\n오랫동안 못 보면 어색해질 수 있음",body:`두 분의 관상에서 읽히는 우정의 미래는 — 오래된 나무처럼 천천히 자라지만 결코 쓰러지지 않는 형상입니다.\n\n앞으로 두 분에게 각각 인생의 큰 변화가 찾아올 때마다, 이 우정은 기준점이 되어줄 거예요. '그래도 저 친구가 있지'라는 안도감 — 그것이 두 분 관계의 핵심입니다.\n\n2026년은 두 분 모두에게 새로운 전환점이 찾아오는 해예요. 이 시기에 서로의 변화를 응원하고 지지해준다면, 두 분의 우정은 한 단계 더 깊어질 것입니다.`},
  talisman:{score:null,grade:null,rank:null,title:"개운법 & 우정 아이템",subtitle:"두 분의 우정 기운을 높이는 방법",good:"木木 — 같은 나무 기운끼리\n서로의 성장을 돕는 시너지",bad:"경쟁 의식이 생기면 기운 소모\n서로 비교하는 순간 관계에 금이 감",body:`두 분의 관상 오행 분석 결과, 두 분 모두 木(목) 기운이 강한 형상입니다. 같은 기운끼리 모이면 더 강해지는 '목목상생(木木相生)'의 관계예요.\n\n✨ 두 분에게 추천하는 개운 아이템\n🌿 함께 식물 키우기 — 우정을 상징하는 식물 하나씩 나눠 갖기\n📸 함께한 사진 인화 — 에너지를 물리적으로 연결하는 방법\n🍵 함께하는 카페 루틴 — 정기적인 만남이 기운을 유지시킴\n💌 가끔 손편지 — 디지털 시대에 아날로그 감성은 관계를 더 깊게 만들어요\n🟢 초록색 소품 공유 — 같은 색을 갖고 있으면 에너지가 이어짐`},
};

export function BffFull() {
  const [step,setStep]=useState("intro");
  const [p1,setP1]=useState(null),[p2,setP2]=useState(null),[ans,setAns]=useState(null);
  const [tab,setTab]=useState("total"),[full,setFull]=useState(false);
  const c=BFF_C[tab]; const paras=c.body.split("\n\n"); const long=paras.length>3; const vis=full||!long?paras:paras.slice(0,3);

  const Q=({onNext,onClose})=>{
    const [qs,setQs]=useState(1),[q1,setQ1]=useState(null),[q2,setQ2]=useState([]);
    const q1o=[{e:"👯",l:"10년 이상 된 오랜 친구"},{e:"🤝",l:"3~10년 된 친구"},{e:"🆕",l:"최근 1~2년 안에 친해진"},{e:"💼",l:"직장·업무 동료"},{e:"🏫",l:"학교·대학 동창"},{e:"🪖",l:"군대·사회복무 동기"},{e:"🏘️",l:"동네·지역 친구"},{e:"🌐",l:"온라인·SNS로 친해진"},{e:"💭",l:"기타"}];
    const q2o=[{e:"🤝",l:"우리 우정 얼마나 갈까"},{e:"⚡",l:"갈등이 자꾸 생기는 이유"},{e:"💡",l:"서로에게 어떤 존재인가"},{e:"🔮",l:"전생에 어떤 인연이었을까"},{e:"💰",l:"같이 사업·프로젝트 하면 잘 맞을까"},{e:"🌟",l:"전체 다 궁금해요!"},{e:"💭",l:"기타"}];
    const tog=l=>setQ2(p=>p.includes(l)?p.filter(v=>v!==l):[...p,l]);
    return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><H/>
      <div style={{padding:"12px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>👯 베프 관상 궁합</h3><X onClick={onClose}/></div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>{qs}/2</p>
        <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,marginBottom:20}}><div style={{height:"100%",width:`${qs*50}%`,background:BFF_A,borderRadius:2,transition:"0.3s"}}/></div>
        {qs===1&&<><p style={{fontSize:14,fontWeight:600,color:BFF_A,margin:"0 0 12px"}}>어떤 사이인가요?</p>
          <div style={{maxHeight:340,overflowY:"auto"}}>{q1o.map(o=><button key={o.l} onClick={()=>setQ1(o.l)} style={{width:"100%",padding:"13px 16px",marginBottom:7,background:q1===o.l?`${BFF_A}22`:"rgba(255,255,255,0.05)",border:`1px solid ${q1===o.l?`${BFF_A}77`:"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:q1===o.l?"#86efac":"rgba(255,255,255,0.7)",textAlign:"left",display:"flex",alignItems:"center",gap:10}}><span>{o.e}</span>{o.l}{q1===o.l&&<span style={{marginLeft:"auto",color:BFF_A}}>✓</span>}</button>)}</div>
          <button onClick={()=>q1&&setQs(2)} style={{width:"100%",padding:"15px",marginTop:12,background:q1?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q1?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q1?"pointer":"default",fontFamily:"inherit"}}>다음 →</button></>}
        {qs===2&&<><p style={{fontSize:14,fontWeight:600,color:BFF_A,margin:"0 0 4px"}}>가장 궁금한 건?</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>💡 하나만 고를수록 더 깊고 정밀하게 분석해드려요</p>
          {q2o.map(o=><button key={o.l} onClick={()=>tog(o.l)} style={{width:"100%",padding:"13px 16px",marginBottom:7,background:q2.includes(o.l)?`${BFF_A}22`:"rgba(255,255,255,0.05)",border:`1px solid ${q2.includes(o.l)?`${BFF_A}77`:"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:q2.includes(o.l)?"#86efac":"rgba(255,255,255,0.7)",textAlign:"left",display:"flex",alignItems:"center",gap:10}}><span>{o.e}</span><span style={{flex:1}}>{o.l}</span><div style={{width:18,height:18,borderRadius:4,flexShrink:0,background:q2.includes(o.l)?BFF_A:"transparent",border:`2px solid ${q2.includes(o.l)?BFF_A:"rgba(255,255,255,0.3)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{q2.includes(o.l)&&<span style={{fontSize:10,color:"#fff"}}>✓</span>}</div></button>)}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={()=>setQs(1)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button>
            <button onClick={()=>q2.length>0&&onNext({q1,q2})} style={{flex:2,padding:"15px",background:q2.length>0?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q2.length>0?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q2.length>0?"pointer":"default",fontFamily:"inherit"}}>분석 시작 →</button>
          </div></>}
      </div>
    </div>;
  };

  if(step==="intro") return <Wrap><div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><H/><div style={{display:"flex",justifyContent:"flex-end",padding:"8px 16px 0"}}><X onClick={()=>{}}/></div>
    <div style={{textAlign:"center",padding:"0 20px 16px"}}><div style={{fontSize:36,marginBottom:8}}>👯</div><h2 style={{fontSize:20,fontWeight:700,color:BFF_A,margin:"0 0 6px"}}>베프 관상 궁합</h2><p style={{fontSize:13,color:"rgba(255,255,255,0.55)",margin:0}}>전생부터 절친? 우정 싱크로율 · 1,980원</p></div>
    <div style={{margin:"0 16px 16px",borderRadius:14,overflow:"hidden",background:"#000",border:`1px solid ${BFF_A}44`}}><div style={{background:`linear-gradient(90deg,${DG},#0a1a10)`,padding:"6px 12px",display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${BFF_A}33`}}><span style={{fontSize:9,color:G,letterSpacing:2}}>CHUNGI_AI v2.0</span><span style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>AI_SCANNING... [OK]</span></div><div style={{height:160,background:"linear-gradient(135deg,#001a00,#0a1a0a)",display:"flex",alignItems:"center",justifyContent:"center",gap:20}}><div style={{width:60,height:60,borderRadius:"50%",background:`${BFF_A}22`,border:`2px solid ${BFF_A}77`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>👤</div><div style={{fontSize:22,color:BFF_A}}>👯</div><div style={{width:60,height:60,borderRadius:"50%",background:`${BFF_A}22`,border:`2px solid ${BFF_A}77`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>👤</div></div></div>
    <div style={{padding:"0 16px 16px"}}>{[{i:"👯",l:"우정 싱크로율",d:"두 관상의 우정 에너지"},{i:"✨",l:"전생 인연 분석",d:"전생에서 어떤 관계였는지"},{i:"💬",l:"갈등 패턴",d:"연애·돈 문제 갈등 포인트"},{i:"🌙",l:"우정 지속성",d:"평생 가는 찐친인지"},{i:"🌿",l:"시너지 분석",d:"함께 있을 때 더 빛나는지"},{i:"🌈",l:"RAINBOW 인증서",d:"초록 인증서 발급"}].map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}><span style={{fontSize:18,flexShrink:0}}>{it.i}</span><div style={{flex:1}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>{it.l}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>{it.d}</p></div><span style={{fontSize:9,color:BFF_A,padding:"2px 8px",borderRadius:10,border:`1px solid ${BFF_A}44`,background:`${BFF_A}11`}}>분석</span></div>)}</div>
    <div style={{padding:"0 16px"}}><div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"12px 14px",marginBottom:16}}><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:0}}>두 분의 사진을 올리면 AI가 우정 에너지를 분석해드려요.<br/><span style={{color:G}}>업로드된 사진은 분석 즉시 삭제됩니다.</span></p></div>
    <button onClick={()=>setStep("p1")} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${BFF_A},#16a34a)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>시작하기 →</button>
    <button style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button></div>
  </div></Wrap>;

  if(step==="p1") return <Wrap><PersonSelectStep emoji="👯" title="베프 관상 궁합" idx={1} first={null} accentColor={BFF_A} onSelect={p=>{setP1(p);setStep("p2");}} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="p2") return <Wrap><PersonSelectStep emoji="👯" title="베프 관상 궁합" idx={2} first={p1} accentColor={BFF_A} onSelect={p=>{setP2(p);setStep("photo");}} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="photo") return <Wrap><PhotoUploadStep emoji="👯" ctaLabel="베프 관상 궁합" price="1,980원" accentColor={BFF_A} p1={p1} p2={p2} onNext={()=>setStep("q")} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="q") return <Wrap><Q onNext={a=>{setAns(a);setStep("pay");}} onClose={()=>setStep("intro")}/></Wrap>;
  if(step==="pay") return <Wrap><PayStep price="1,980원" accentColor={BFF_A} onNext={()=>setStep("result")} onClose={()=>setStep("intro")}/></Wrap>;

  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"14px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 베프 관상 궁합 리포트</p></div>
        <div style={{padding:"14px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:18}}>👯</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>{p1?.name||"나"} &amp; {p2?.name||"베프"}</h2></div><p style={{fontSize:11,color:"#6b7280",margin:"0 0 2px"}}>베프 관상 궁합</p><p style={{fontSize:11,color:"#6b7280",margin:0}}>{ans?.q1||"👯 10년 이상 된 오랜 친구"}</p></div>
          <div style={{background:"#f0fdf4",border:"2px solid #bbf7d0",borderRadius:14,padding:"10px 14px",textAlign:"center",flexShrink:0}}><div style={{display:"flex",alignItems:"baseline",gap:2,justifyContent:"center"}}><span style={{fontSize:28,fontWeight:700,color:BFF_A,lineHeight:1}}>87</span><span style={{fontSize:12,fontWeight:700,color:BFF_A}}>점</span></div><div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>A+등급 · 상위 11%</div></div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",overflowX:"auto",background:"#fafafa"}}>{BFF_TABS.map(t=><button key={t.k} onClick={()=>{setTab(t.k);setFull(false);}} style={{flexShrink:0,padding:"12px 13px",border:"none",borderBottom:tab===t.k?`2px solid ${DG}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:tab===t.k?700:500,color:tab===t.k?DG:"#9ca3af",fontFamily:"inherit",transition:"0.15s"}}>{t.l}</button>)}</div>
        <div style={{padding:"18px 16px"}}>
          {c.score&&<div style={{display:"flex",alignItems:"center",gap:12,background:"#fafafa",borderRadius:12,padding:"12px 14px",marginBottom:16,border:"1px solid #f3f4f6"}}><div style={{width:48,height:48,borderRadius:"50%",background:"#f0fdf4",border:"2px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18,fontWeight:700,color:BFF_A}}>{c.grade}</span></div><div><div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:32,fontWeight:700,color:BFF_A}}>{c.score}</span><span style={{fontSize:13,color:"#9ca3af"}}>점</span></div><span style={{fontSize:11,color:"#6b7280"}}>{c.rank}</span></div></div>}
          <h3 style={{fontSize:16,fontWeight:700,color:"#111827",margin:"0 0 4px"}}>{c.title}</h3>
          <p style={{fontSize:12,color:"#6b7280",margin:"0 0 16px"}}>{c.subtitle}</p>
          {vis.map((p,i)=><p key={i} style={{fontSize:13,color:"#374151",lineHeight:1.95,margin:i<vis.length-1?"0 0 14px":0}}>{p}</p>)}
          {long&&<button onClick={()=>setFull(v=>!v)} style={{display:"block",width:"100%",padding:"12px 0",marginTop:12,background:"none",border:"none",borderTop:"1px solid #f3f4f6",fontSize:12,color:BFF_A,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>{full?"▲ 접기":"▼ 전체 보기"}</button>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}}>
            <div style={{background:"#f0fdf4",borderRadius:10,padding:"12px",border:"1px solid #bbf7d0"}}><p style={{fontSize:9,color:"#16a34a",fontWeight:700,letterSpacing:1,margin:"0 0 5px"}}>✓ 찰떡 관상</p><p style={{fontSize:11,color:"#166534",lineHeight:1.65,margin:0,whiteSpace:"pre-line"}}>{c.good}</p></div>
            <div style={{background:"#fef2f2",borderRadius:10,padding:"12px",border:"1px solid #fecaca"}}><p style={{fontSize:9,color:"#dc2626",fontWeight:700,letterSpacing:1,margin:"0 0 5px"}}>△ 주의 관상</p><p style={{fontSize:11,color:"#991b1b",lineHeight:1.65,margin:0,whiteSpace:"pre-line"}}>{c.bad}</p></div>
          </div>
        </div>
        <div style={{padding:"12px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px",lineHeight:1.8}}>#천기관상 #베프관상궁합 #천생베프 #상위11%</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
      </div>
      {/* 인증서 */}
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:20}}>
        <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",padding:"20px",textAlign:"center"}}>
          <p style={{fontSize:8,letterSpacing:3,color:"#166534",margin:"0 0 2px"}}>CHUNGI ORIGINALS · RAINBOW 🌈</p>
          <p style={{fontSize:8,letterSpacing:2,color:"#15803d",margin:"0 0 14px"}}>— 초록 인증서 —</p>
          <div style={{fontSize:44,marginBottom:10}}>👯</div>
          <p style={{fontSize:10,color:"#166534",margin:"0 0 4px"}}>— THIS FRIENDSHIP IS —</p>
          <p style={{fontSize:20,fontWeight:700,color:"#14532d",margin:"0 0 6px"}}>"👯 천생 베프"</p>
          <p style={{fontSize:11,color:"#15803d",margin:"0 0 14px",lineHeight:1.7}}>"전생에서 맺은 우정의 인연, 이번 생에서도 찐친으로 다시 만났어요"</p>
          <p style={{fontSize:12,color:"#166534",lineHeight:1.8,margin:"0 0 14px"}}>두 분의 관상에서 읽힌 기운은<br/>이번 생에서 처음 만난 인연이 아니에요.<br/>전생에서 이미 깊은 우정으로 연결된<br/>두 사람이 다시 서로를 알아본 것입니다.</p>
          <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>{["#천생베프","#상위11%","#전생절친","#평생우정"].map(t=><span key={t} style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"rgba(22,101,52,0.08)",color:"#166534",border:"1px solid rgba(22,101,52,0.18)"}}>{t}</span>)}</div>
          <div style={{borderTop:"1px solid #bbf7d0",paddingTop:10}}><p style={{fontSize:8,color:"#15803d",margin:"0 0 2px",letterSpacing:2}}>✦ 天機 ORIGINAL · No. 2026-B0055</p><p style={{fontSize:8,color:"#166534",margin:0}}>— 천기(天機) · 관기 —</p></div>
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
        {[{e:"💑",l:"커플 궁합",p:"1,980원"},{e:"💼",l:"비즈니스 궁합",p:"1,980원"},{e:"🪞",l:"내 관상보기",p:"980원"},{e:"🔮",l:"오늘의 타로",p:"무료"}].map(it=><div key={it.l} style={{minWidth:80,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 8px",textAlign:"center",flexShrink:0}}><div style={{fontSize:22,marginBottom:4}}>{it.e}</div><div style={{fontSize:10,fontWeight:600,color:"#F0EAD6",marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:it.p==="무료"?"#4ade80":G}}>{it.p}</div></div>)}
      </div>
      <button style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.5}}>확인 완료</button>
    </div>
  </div>;
}

// ─────────────────────────────────────────
// 최애 / 비즈니스 / 악연 — 베프와 동일 구조
// ACCENT 색상과 CONTENT, 사전질문만 교체
// ─────────────────────────────────────────
// 최애: A="#3b82f6" (파랑), 인증서 "🌟 운명의 최애", Q1=최애 종류(1개)
// 비즈니스: A="#6366f1" (남색), 인증서 "💼 사업 콤비", Q1=관계+Q2=궁금한것
// 악연상극: A="#a855f7" (보라), 인증서 "⚡ 상극 판독", 가격=980원, Q1=관계+Q2=힘든점

// 터미널에서 각각 파일로 분리 후 ACCENT/CONTENT 교체 필요:
// 1. 최애관상궁합_풀프로세스_완전판.jsx → A="#3b82f6"
// 2. 비즈니스관상궁합_풀프로세스_완전판.jsx → A="#6366f1"
// 3. 악연상극관상궁합_풀프로세스_완전판.jsx → A="#a855f7", price="980원"

export default BffFull;
