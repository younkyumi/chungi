"use client";
import { useState, useEffect } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 사주 계산
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CG_OHANG = ["목","목","화","화","토","토","금","금","수","수"];
const JJ_OHANG = ["수","토","목","목","토","화","화","토","금","금","토","수"];
const CG_YANG  = [0,2,4,6,8];
const JJ_YANG  = [2,3,6,7,10];
const CHEONGAN = ["갑","을","병","정","무","기","경","신","임","계"];

function getSaju(year, month, day, hour) {
  const a = Math.floor((14-month)/12);
  const y = year-a, m = month+12*a-2;
  const jd = day + Math.floor((153*m+2)/5) + 365*y +
    Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  const dayCG=(jd+4)%10, dayJJ=(jd+4)%12;
  const yearCG=(year-4)%10, yearJJ=(year-4)%12;
  const monthJJ=(month+1)%12;
  const monthCG=((((year-4)%10)%5)*2+month-1)%10;
  let hourJJ=-1, hourCG=-1;
  if(hour!=null){ hourJJ=Math.floor(((hour+1)%24)/2)%12; hourCG=((dayCG%5)*2+hourJJ)%10; }
  return { year:{cg:yearCG,jj:yearJJ}, month:{cg:monthCG,jj:monthJJ},
    day:{cg:dayCG,jj:dayJJ}, hour:hourJJ>=0?{cg:hourCG,jj:hourJJ}:null, ilgan:dayCG };
}

function getOhang(saju) {
  const s={목:0,화:0,토:0,금:0,수:0};
  const ps=[saju.year,saju.month,saju.day]; if(saju.hour) ps.push(saju.hour);
  ps.forEach(p=>{ s[CG_OHANG[p.cg]]+=2; s[JJ_OHANG[p.jj]]+=3; }); return s;
}

// 별자리 계산
function getStarSign(month, day) {
  const signs = [
    {name:"염소",start:[1,1],end:[1,19],element:"토"},
    {name:"물병",start:[1,20],end:[2,18],element:"공기"},
    {name:"물고기",start:[2,19],end:[3,20],element:"수"},
    {name:"양",start:[3,21],end:[4,19],element:"화"},
    {name:"황소",start:[4,20],end:[5,20],element:"토"},
    {name:"쌍둥이",start:[5,21],end:[6,20],element:"공기"},
    {name:"게",start:[6,21],end:[7,22],element:"수"},
    {name:"사자",start:[7,23],end:[8,22],element:"화"},
    {name:"처녀",start:[8,23],end:[9,22],element:"토"},
    {name:"천칭",start:[9,23],end:[10,22],element:"공기"},
    {name:"전갈",start:[10,23],end:[11,21],element:"수"},
    {name:"사수",start:[11,22],end:[12,21],element:"화"},
    {name:"염소",start:[12,22],end:[12,31],element:"토"},
  ];
  for(const s of signs){
    const [sm,sd]=s.start, [em,ed]=s.end;
    if((month===sm&&day>=sd)||(month===em&&day<=ed)) return s;
  }
  return signs[0];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12수호신 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GUARDIANS = {
  봉황: { name:"봉황", hanja:"鳳凰", emoji:"🦅", color:"#FF6B35", darkColor:"#3a1500",
    subtitle:"불꽃을 품은 재생의 새",
    element:"화(火)·목(木)", ohangKey:"화",
    desc:"죽음과 재생을 반복하며 더 강해지는 불멸의 새. 열정과 창조, 끊임없는 변신의 기운을 상징한다. 실패를 딛고 더 강하게 일어서는 사람.",
    power:"재생의 불꽃 — 어떤 실패에도 더 강하게 부활하는 불굴의 힘",
    personality:"열정적이고 창의적. 변화를 두려워하지 않으며 매 순간 온 힘을 다한다.",
    lucky:"붉은색·주황색 물건 / 남쪽 방향 / 화요일",
    avoid:"너무 급하게 움직이면 에너지가 소진돼. 가끔은 쉬어가는 것도 용기야.",
    celeb:"나폴레옹, 스티브 잡스, BTS RM",
    affinity:["청룡","기린"],
    starSigns:["양","사자","사수"] },
  용: { name:"용", hanja:"龍", emoji:"🐉", color:"#00BCD4", darkColor:"#002a30",
    subtitle:"하늘과 땅을 잇는 신령",
    element:"수(水)·목(木)", ohangKey:"목",
    desc:"천지를 자유롭게 오가며 변화와 권위를 상징하는 최고의 영수. 어떤 상황에서도 주도권을 잡고 새로운 시대를 여는 존재.",
    power:"변화의 기운 — 어떤 상황에서도 흐름을 만들고 이끄는 힘",
    personality:"카리스마 있고 대담하다. 큰 그림을 보며 자연스럽게 주변을 이끈다.",
    lucky:"청록색·금색 / 동쪽·북쪽 방향 / 수요일",
    avoid:"혼자 다 하려는 경향이 있어. 팀의 힘을 빌리면 더 큰 용이 돼.",
    celeb:"이순신, 세종대왕, 류현진",
    affinity:["봉황","백학"],
    starSigns:["물고기","게","전갈"] },
  백호: { name:"백호", hanja:"白虎", emoji:"🐯", color:"#E0E0E0", darkColor:"#1a1a1a",
    subtitle:"서쪽을 지키는 강인한 수호자",
    element:"금(金)", ohangKey:"금",
    desc:"서방을 수호하는 사신 중 하나. 용맹과 정의, 흔들리지 않는 의지를 상징한다. 약자를 지키고 불의에 맞서는 타고난 수호자.",
    power:"수호의 방패 — 나와 소중한 것을 지키는 불굴의 힘",
    personality:"의지가 강하고 책임감이 남다르다. 한번 결정하면 끝까지 해낸다.",
    lucky:"흰색·은색 / 서쪽 방향 / 금요일",
    avoid:"고집이 너무 강해지면 주변이 멀어질 수 있어. 유연함도 힘이야.",
    celeb:"박지성, 손흥민, 반기문",
    affinity:["청룡","현무"],
    starSigns:["황소","처녀","염소"] },
  현무: { name:"현무", hanja:"玄武", emoji:"🐢", color:"#7986CB", darkColor:"#0a0a2a",
    subtitle:"북쪽을 지키는 지혜의 신",
    element:"수(水)", ohangKey:"수",
    desc:"북방을 수호하는 거북뱀. 인내와 지혜, 장수를 상징하는 신성한 존재. 깊은 곳에서 세상의 이치를 꿰뚫어 보는 현자.",
    power:"지혜의 갑옷 — 천 년의 경험으로 쌓인 흔들리지 않는 통찰력",
    personality:"신중하고 깊이가 있다. 서두르지 않지만 결국 원하는 것을 이룬다.",
    lucky:"검정·남색 / 북쪽 방향 / 수요일·목요일",
    avoid:"너무 오래 혼자 생각하다 기회를 놓칠 수 있어. 때로는 행동이 먼저야.",
    celeb:"워렌 버핏, 빌 게이츠, 반기문",
    affinity:["백호","해태"],
    starSigns:["염소","황소","처녀"] },
  기린: { name:"기린", hanja:"麒麟", emoji:"🦄", color:"#CE93D8", darkColor:"#1e0a2e",
    subtitle:"평화와 길함을 전하는 상서로운 짐승",
    element:"토(土)·목(木)", ohangKey:"목",
    desc:"어진 임금이 나타날 때 등장한다는 상서로운 영수. 평화와 자유, 무한한 가능성을 상징. 가는 곳마다 행운을 부르는 존재.",
    power:"길조의 뿔 — 가는 곳마다 행운과 좋은 기운을 불러오는 힘",
    personality:"자유롭고 창의적. 누구에게나 긍정적인 영향을 주는 밝은 에너지를 가졌다.",
    lucky:"보라·금색 / 중앙·사방 / 목요일",
    avoid:"너무 자유롭다 보면 책임이 흐릿해질 수 있어. 약속은 꼭 지켜.",
    celeb:"BTS 뷔, 로빈 윌리엄스, 유재석",
    affinity:["봉황","백학"],
    starSigns:["쌍둥이","천칭","물병"] },
  주작: { name:"주작", hanja:"朱雀", emoji:"🦜", color:"#EF5350", darkColor:"#2a0a0a",
    subtitle:"남쪽 하늘을 물들이는 불새",
    element:"화(火)", ohangKey:"화",
    desc:"남방을 수호하는 붉은 새. 열정과 표현력, 화려한 존재감을 상징한다. 모든 이의 시선을 사로잡는 타고난 주인공.",
    power:"남방의 불꽃 — 모든 이의 시선을 사로잡는 강렬한 존재감",
    personality:"표현력이 뛰어나고 존재감이 강하다. 어디서든 분위기를 주도한다.",
    lucky:"붉은색·자주색 / 남쪽 방향 / 화요일·일요일",
    avoid:"주목받고 싶은 욕구가 과하면 오해를 살 수 있어. 주변도 빛내줘.",
    celeb:"BTS 제이홉, 제니, 브루노 마스",
    affinity:["봉황","기린"],
    starSigns:["양","사자","사수"] },
  청룡: { name:"청룡", hanja:"靑龍", emoji:"🐲", color:"#29B6F6", darkColor:"#001e2a",
    subtitle:"동쪽 새벽을 깨우는 선도자",
    element:"목(木)", ohangKey:"목",
    desc:"동방을 수호하는 푸른 용. 새로운 시작과 추진력, 리더십을 상징한다. 누구보다 빠르게 새벽을 열고 길을 만드는 존재.",
    power:"동방의 번개 — 누구보다 빠르게 새벽을 여는 선구자의 힘",
    personality:"직관적이고 추진력이 강하다. 처음 가는 길도 두려워하지 않는다.",
    lucky:"청색·녹색 / 동쪽 방향 / 목요일·월요일",
    avoid:"너무 빨리 달리다 주변을 놓칠 수 있어. 가끔은 뒤를 돌아봐.",
    celeb:"나폴레옹, BTS RM, 스티브 잡스",
    affinity:["봉황","백호"],
    starSigns:["양","사자","사수","쌍둥이"] },
  백학: { name:"백학", hanja:"白鶴", emoji:"🕊️", color:"#80CBC4", darkColor:"#002020",
    subtitle:"하늘과 땅을 오가는 현자",
    element:"금(金)·목(木)", ohangKey:"목",
    desc:"하늘과 땅을 자유롭게 오가는 신선의 벗. 지혜와 장수, 고결함을 상징한다. 따뜻한 눈으로 세상을 품어주는 존재.",
    power:"신선의 날개 — 높은 곳에서 세상을 바라보는 초월적 시각",
    personality:"온화하고 지혜롭다. 말 한마디로 주변을 따뜻하게 만드는 능력이 있다.",
    lucky:"흰색·옥색 / 동쪽·서쪽 / 금요일·월요일",
    avoid:"너무 완벽하게 맞춰주다 내가 지칠 수 있어. 나를 먼저 챙겨.",
    celeb:"아이유, 오프라 윈프리, 달라이 라마",
    affinity:["용","기린"],
    starSigns:["물고기","게","전갈","처녀"] },
  흑호: { name:"흑호", hanja:"黑虎", emoji:"🖤", color:"#9C27B0", darkColor:"#12002a",
    subtitle:"어둠 속에서 빛나는 신비로운 존재",
    element:"수(水)·금(金)", ohangKey:"금",
    desc:"어둠 속에서도 빛을 발하는 신비로운 흑호. 독립성과 깊은 내면의 강함을 상징. 혼자서도 완전한 세계를 품고 있는 존재.",
    power:"어둠의 눈 — 남들이 보지 못하는 것을 꿰뚫어 보는 통찰력",
    personality:"독립적이고 신비롭다. 겉은 차갑지만 내면에 거대한 세계를 품고 있다.",
    lucky:"검정·보라 / 북서쪽 방향 / 토요일",
    avoid:"너무 혼자 있으면 외로워져. 마음을 열어줄 한 명을 찾아봐.",
    celeb:"크리스토퍼 놀란, 키아누 리브스, BTS 슈가",
    affinity:["현무","해태"],
    starSigns:["전갈","염소","물병"] },
  금오: { name:"금오", hanja:"金烏", emoji:"☀️", color:"#FFD600", darkColor:"#2a2000",
    subtitle:"태양을 등에 지고 나는 황금 까마귀",
    element:"화(火)·금(金)", ohangKey:"화",
    desc:"태양 속에 산다는 세 발 달린 황금 까마귀. 풍요와 행운, 밝은 에너지를 상징. 가는 곳마다 따뜻한 빛을 전파하는 존재.",
    power:"태양의 황금빛 — 가는 곳마다 행운과 풍요를 불러오는 빛",
    personality:"밝고 긍정적. 자연스럽게 주변에 에너지를 나눠주는 태양 같은 존재다.",
    lucky:"황금색·주황색 / 남쪽·중앙 / 일요일",
    avoid:"너무 밝아야 한다는 압박감을 느낄 수 있어. 지쳐도 괜찮아.",
    celeb:"유재석, 박보검, 브루노 마스",
    affinity:["주작","봉황"],
    starSigns:["사자","양","사수","황소"] },
  옥토: { name:"옥토", hanja:"玉兎", emoji:"🐇", color:"#69F0AE", darkColor:"#002a15",
    subtitle:"달빛 아래 불로초를 빚는 치유자",
    element:"금(金)·수(水)", ohangKey:"수",
    desc:"달 속에서 불로초를 빚는 옥토끼. 치유와 섬세함, 끈기 있는 노력을 상징. 조용히 세상을 치유하는 신비로운 존재.",
    power:"달빛의 치유 — 상처 입은 것을 회복시키는 신비로운 치유의 힘",
    personality:"섬세하고 성실하다. 꾸준한 노력으로 언젠가 반드시 꽃을 피운다.",
    lucky:"초록·흰색 / 서쪽·북쪽 / 월요일",
    avoid:"자기 자신을 마지막에 챙기는 습관이 있어. 나도 치유받을 자격이 있어.",
    celeb:"뉴진스 민지, 아이유(초기), 박효신",
    affinity:["백학","현무"],
    starSigns:["게","전갈","물고기","처녀"] },
  해태: { name:"해태", hanja:"獬豸", emoji:"🦁", color:"#D4AC0D", darkColor:"#1e1500",
    subtitle:"도성 중앙을 지키는 광화문의 신수",
    element:"토(土)·금(金)", ohangKey:"토",
    desc:"광화문 양옆에서 도성을 수호하는 외뿔의 신수. 거짓을 꿰뚫고 사악함을 들이받으며, 화재와 재앙으로부터 도시를 지키는 정의의 수호자.",
    power:"진실의 외뿔 — 거짓과 위선을 한눈에 가려내는 통찰의 힘",
    personality:"공정하고 강직하다. 옳고 그름이 명확해서 신뢰가 두텁다.",
    lucky:"황금색·붉은색 / 중앙·남쪽 / 토요일·화요일",
    avoid:"옳음을 너무 강조하면 주변이 부담스러워해. 공감의 여유를 잊지 마.",
    celeb:"이국종 교수, 추신수, 김혜수",
    affinity:["현무","흑호"],
    starSigns:["염소","황소","처녀","물병"] },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 수호신 도출 로직
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getGuardian(year, month, day, hour) {
  const saju = getSaju(year, month, day, hour);
  const oh = getOhang(saju);
  const star = getStarSign(month, day);
  const ilgan = saju.ilgan;
  const ilOh = CG_OHANG[ilgan];
  const isYang = CG_YANG.includes(ilgan);

  // 오행 최강 찾기
  const dominant = Object.entries(oh).sort((a,b)=>b[1]-a[1])[0][0];
  const second = Object.entries(oh).sort((a,b)=>b[1]-a[1])[1][0];

  // 별자리 원소
  const starEl = star.element; // 화/수/토/공기

  // 점수 방식으로 수호신 결정
  const scores = {};
  Object.keys(GUARDIANS).forEach(k => scores[k] = 0);

  // 일간 오행 매핑
  const ilganMap = { 목:["청룡","기린","백학"], 화:["봉황","주작","금오","천마"], 토:["해태","기린"], 금:["백호","흑호","현무"], 수:["현무","옥토"] };
  (ilganMap[ilOh]||[]).forEach(g => { if(scores[g]!==undefined) scores[g]+=3; });

  // 사주 강한 오행
  const ohMap = { 목:["청룡","기린","백학"], 화:["봉황","주작","금오","천마"], 토:["해태","기린"], 금:["백호","흑호","현무"], 수:["현무","옥토"] };
  (ohMap[dominant]||[]).forEach(g => { if(scores[g]!==undefined) scores[g]+=2; });
  (ohMap[second]||[]).forEach(g => { if(scores[g]!==undefined) scores[g]+=1; });

  // 별자리 원소
  const starMap = { "화":["봉황","주작","청룡","금오","천마"], "수":["현무","옥토"], "토":["백호","해태","백학"], "공기":["기린","청룡","봉황","천마"] };
  (starMap[starEl]||[]).forEach(g => { if(scores[g]!==undefined) scores[g]+=2; });

  // 음양 보정
  if(isYang) { ["봉황","청룡","백호","주작","금오","천마"].forEach(g=>{ if(scores[g]!==undefined) scores[g]+=1; }); }
  else { ["현무","흑호","옥토","해태","백학"].forEach(g=>{ if(scores[g]!==undefined) scores[g]+=1; }); }

  const result = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  return { guardian: GUARDIANS[result], saju, oh, star, ilgan, ilOh, isYang, ilganName: CHEONGAN[ilgan] };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인 컴포넌트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const G = "#E8C87A";
const wrap = { minHeight:"100vh", background:"#0D2318", fontFamily:"'Noto Serif KR',serif", color:"#F0EAD6", maxWidth:430, margin:"0 auto", boxSizing:"border-box" };

export default function 수호신() {
  const [screen, setScreen] = useState("intro"); // intro | input | result
  const [birth, setBirth] = useState({ year:"", month:"", day:"", hour:"" });
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [ohangAnim, setOhangAnim] = useState(false);

  function handleSubmit() {
    const {year,month,day,hour} = birth;
    if(!year||!month||!day) return;
    const res = getGuardian(+year,+month,+day,hour?+hour:null);
    setResult(res);
    setScreen("result");
  }

  useEffect(() => {
    if(screen==="result") {
      setTimeout(()=>setRevealed(true), 400);
      setTimeout(()=>setOhangAnim(true), 1200);
    }
  }, [screen]);

  function restart() {
    setScreen("intro"); setBirth({year:"",month:"",day:"",hour:""});
    setResult(null); setRevealed(false); setOhangAnim(false);
  }

  const hexToRgb = hex => {
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  };

  // ── INTRO ──
  if(screen==="intro") return (
    <div style={{...wrap,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{fontSize:72,marginBottom:4,filter:"drop-shadow(0 0 40px rgba(232,200,122,0.7))",animation:"float 3s ease-in-out infinite"}}>🔯</div>
      <div style={{fontSize:11,letterSpacing:8,color:G,marginBottom:4}}>十二守護神</div>
      <h1 style={{fontSize:34,fontWeight:700,margin:"0 0 4px",letterSpacing:3}}>12수호신</h1>
      <p style={{fontSize:11,color:"#444",letterSpacing:3,marginBottom:32}}>나의 수호 영수를 찾아서</p>

      <div style={{width:"100%",background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:20,padding:"22px 20px",marginBottom:20}}>
        <p style={{fontSize:13,color:"#888",lineHeight:1.9,margin:"0 0 16px",textAlign:"center"}}>
          생년월일 사주와 별자리를 종합 분석하여<br/>
          나의 기질과 에너지를 <span style={{color:G}}>12가지 신령스러운</span><br/>
          수호신에 빗댄 유형 분류입니다
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
          {Object.values(GUARDIANS).map(g=>(
            <div key={g.name} style={{textAlign:"center",padding:"8px 4px",background:"rgba(255,255,255,0.03)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:20,marginBottom:2}}>{g.emoji}</div>
              <div style={{fontSize:8,color:"#666"}}>{g.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px 18px",marginBottom:24}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{icon:"🌟",t:"사주 분석",d:"일간 오행으로 타고난 기운 파악"},
            {icon:"✨",t:"별자리 분석",d:"태양궁으로 성향의 방향성 파악"},
            {icon:"🔮",t:"종합 수호신 도출",d:"두 가지를 합산해 나의 수호신 결정"}
          ].map(({icon,t,d})=>(
            <div key={t} style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
              <div><p style={{fontSize:12,fontWeight:600,color:G,margin:0}}>{t}</p><p style={{fontSize:11,color:"#555",margin:0}}>{d}</p></div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=>setScreen("input")} style={{width:"100%",padding:"18px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:16,fontWeight:700,color:"#0D0D14",cursor:"pointer",letterSpacing:2,boxShadow:"0 8px 32px rgba(232,200,122,0.3)"}}>
        내 수호신 찾기 →
      </button>
      <p style={{fontSize:10,color:"#2a2a2a",marginTop:12,textAlign:"center"}}>동양 오행 철학 기반 · 무료</p>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );

  // ── 입력 ──
  if(screen==="input") return (
    <div style={{...wrap,padding:"60px 24px 40px"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{fontSize:11,color:G,letterSpacing:4,marginBottom:10}}>生年月日 입력</div>
        <h2 style={{fontSize:24,fontWeight:700,margin:"0 0 10px"}}>생년월일을 알려주세요</h2>
        <p style={{fontSize:13,color:"#555",margin:0,lineHeight:1.8}}>
          사주와 별자리를 함께 분석해<br/>
          <span style={{color:G}}>나만의 수호신</span>을 찾아드려요
        </p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
        {[
          {label:"출생 연도 *",key:"year",ph:"예) 1995",min:1900,max:2010},
          {label:"출생 월 *",key:"month",ph:"예) 8 (1~12)",min:1,max:12},
          {label:"출생 일 *",key:"day",ph:"예) 24 (1~31)",min:1,max:31},
          {label:"출생 시간 (선택)",key:"hour",ph:"예) 14 — 입력 시 더 정확해요",min:0,max:23},
        ].map(({label,key,ph,min,max})=>(
          <div key={key}>
            <p style={{fontSize:11,color:key==="hour"?"#555":G,letterSpacing:2,marginBottom:8}}>{label}</p>
            <input type="number" min={min} max={max} placeholder={ph} value={birth[key]}
              onChange={e=>setBirth(p=>({...p,[key]:e.target.value}))}
              style={{width:"100%",padding:"16px 18px",background:"rgba(255,255,255,0.04)",border:`1.5px solid ${birth[key]?"rgba(232,200,122,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:12,fontSize:16,color:"#F0EAD6",outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border 0.2s"}}/>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={!birth.year||!birth.month||!birth.day}
        style={{width:"100%",padding:"18px",background:(!birth.year||!birth.month||!birth.day)?"rgba(232,200,122,0.2)":`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:16,fontWeight:700,color:"#0D0D14",cursor:(!birth.year||!birth.month||!birth.day)?"not-allowed":"pointer",letterSpacing:1}}>
        수호신 분석하기 →
      </button>
    </div>
  );

  // ── 결과 ──
  if(screen==="result" && result) {
    const {guardian:g, oh, star, ilganName, ilOh} = result;
    const rgb = hexToRgb(g.color);
    const ohColors = {목:"#81C784",화:"#FF7043",토:"#FFB74D",금:"#B0BEC5",수:"#4FC3F7"};
    const total = Object.values(oh).reduce((a,b)=>a+b,0);

    return (
      <div style={{...wrap,padding:"40px 24px 72px"}}>

        {/* 수호신 등장 */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <p style={{fontSize:10,color:"#444",letterSpacing:4,marginBottom:16}}>당신의 수호신은</p>

          {/* 메인 이모지 */}
          <div style={{position:"relative",display:"inline-block",marginBottom:16}}>
            <div style={{
              fontSize:88,
              filter:`drop-shadow(0 0 40px rgba(${rgb},0.8))`,
              transform:revealed?"scale(1)":"scale(0.3)",
              opacity:revealed?1:0,
              transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)"
            }}>{g.emoji}</div>
            {revealed && <div style={{position:"absolute",inset:-20,borderRadius:"50%",background:`radial-gradient(circle,rgba(${rgb},0.15),transparent 70%)`,animation:"pulse 2s ease-in-out infinite"}}/>}
          </div>

          <h2 style={{fontSize:36,fontWeight:700,margin:"0 0 4px",
            transform:revealed?"translateY(0)":"translateY(20px)",
            opacity:revealed?1:0,transition:"all 0.5s ease 0.3s"
          }}>{g.name}</h2>
          <p style={{fontSize:15,color:`rgba(${rgb},1)`,margin:"0 0 6px",letterSpacing:1,
            transform:revealed?"translateY(0)":"translateY(10px)",
            opacity:revealed?1:0,transition:"all 0.5s ease 0.4s"
          }}>{g.subtitle}</p>
          <div style={{display:"inline-flex",gap:8,
            transform:revealed?"translateY(0)":"translateY(10px)",
            opacity:revealed?1:0,transition:"all 0.5s ease 0.5s"
          }}>
            <span style={{fontSize:11,color:"#555",background:"rgba(255,255,255,0.05)",padding:"4px 12px",borderRadius:20,letterSpacing:1}}>{g.hanja}</span>
            <span style={{fontSize:11,color:"#555",background:"rgba(255,255,255,0.05)",padding:"4px 12px",borderRadius:20,letterSpacing:1}}>{g.element}</span>
            <span style={{fontSize:11,color:"#555",background:"rgba(255,255,255,0.05)",padding:"4px 12px",borderRadius:20,letterSpacing:1}}>별자리: {star.name}자리</span>
          </div>
        </div>

        {/* 설명 */}
        <div style={{background:`rgba(${rgb},0.07)`,border:`1px solid rgba(${rgb},0.22)`,borderRadius:16,padding:"20px",marginBottom:14}}>
          <p style={{fontSize:15,lineHeight:1.9,color:"#C8BC9A",margin:0}}>{g.desc}</p>
        </div>

        {/* 수호 능력 */}
        <div style={{background:`rgba(${rgb},0.05)`,border:`1px solid rgba(${rgb},0.3)`,borderRadius:16,padding:"18px",marginBottom:14}}>
          <p style={{fontSize:10,color:`rgba(${rgb},1)`,letterSpacing:3,marginBottom:10}}>⚡ 수호 능력</p>
          <p style={{fontSize:15,fontWeight:600,color:"#F0EAD6",lineHeight:1.8,margin:0}}>{g.power}</p>
        </div>

        {/* 성격 */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"18px",marginBottom:14}}>
          <p style={{fontSize:10,color:G,letterSpacing:3,marginBottom:10}}>✦ 타고난 성격</p>
          <p style={{fontSize:14,color:"#C8BC9A",lineHeight:1.8,margin:0}}>{g.personality}</p>
        </div>

        {/* 오행 분포 */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"18px",marginBottom:14}}>
          <p style={{fontSize:10,color:G,letterSpacing:3,marginBottom:6}}>🌿 사주 오행 분포</p>
          <p style={{fontSize:10,color:"#555",marginBottom:12}}>일간: <span style={{color:G}}>{ilganName}</span>({ilOh})</p>
          {Object.entries(oh).map(([name,score])=>{
            const pct=Math.round((score/total)*100);
            return(
              <div key={name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:12,color:ohColors[name],width:14,fontWeight:600}}>{name}</span>
                <div style={{flex:1,height:6,background:"rgba(255,255,255,0.05)",borderRadius:99}}>
                  <div style={{height:"100%",width:ohangAnim?`${pct}%`:"0%",background:ohColors[name],borderRadius:99,transition:"width 1s ease",boxShadow:`0 0 6px ${ohColors[name]}60`}}/>
                </div>
                <span style={{fontSize:11,color:"#555",width:28,textAlign:"right"}}>{pct}%</span>
              </div>
            );
          })}
          <p style={{fontSize:11,color:"#555",marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            별자리: <span style={{color:G}}>{star.name}자리</span> · {star.element} 원소
          </p>
        </div>

        {/* 행운 & 주의 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px"}}>
            <p style={{fontSize:10,color:"#5FC49E",letterSpacing:2,marginBottom:10}}>🍀 행운</p>
            <p style={{fontSize:12,color:"#C8BC9A",lineHeight:1.7,margin:0}}>{g.lucky}</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px"}}>
            <p style={{fontSize:10,color:"#A89A6A",letterSpacing:2,marginBottom:10}}>⚠️ 주의</p>
            <p style={{fontSize:12,color:"#777",lineHeight:1.7,margin:0}}>{g.avoid}</p>
          </div>
        </div>

        {/* 친화 수호신 */}
        <div style={{background:"rgba(245,184,196,0.05)",border:"1px solid rgba(245,184,196,0.2)",borderRadius:16,padding:"18px",marginBottom:14}}>
          <p style={{fontSize:10,color:"#F5B8C4",letterSpacing:3,marginBottom:12}}>♡ 친화 수호신</p>
          <div style={{display:"flex",gap:12}}>
            {g.affinity.map(name=>{
              const af = GUARDIANS[name];
              if(!af) return null;
              const afRgb = hexToRgb(af.color);
              return(
                <div key={name} style={{flex:1,textAlign:"center",background:`rgba(${afRgb},0.08)`,border:`1px solid rgba(${afRgb},0.2)`,borderRadius:12,padding:"14px 8px"}}>
                  <div style={{fontSize:32,marginBottom:6}}>{af.emoji}</div>
                  <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{af.name}</p>
                  <p style={{fontSize:10,color:`rgba(${afRgb},0.9)`,margin:0}}>{af.hanja}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 유명인 */}
        <div style={{background:"rgba(95,196,158,0.05)",border:"1px solid rgba(95,196,158,0.2)",borderRadius:16,padding:"18px",marginBottom:28}}>
          <p style={{fontSize:10,color:"#5FC49E",letterSpacing:3,marginBottom:10}}>✦ 같은 수호신의 유명인</p>
          <p style={{fontSize:14,color:"#C8BC9A",margin:0}}>{g.celeb}</p>
        </div>

        {/* 버튼 */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button style={{padding:"18px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",letterSpacing:1,boxShadow:"0 8px 24px rgba(232,200,122,0.3)"}}>
            결과 공유하기 →
          </button>
          <button onClick={restart} style={{padding:"15px",background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,fontSize:13,color:"#555",cursor:"pointer"}}>
            다시 찾기
          </button>
        </div>
        <p style={{fontSize:10,color:"#2a2a2a",textAlign:"center",marginTop:20,lineHeight:1.7}}>동양 오행 철학 기반 분석 · 참고용 콘텐츠</p>
        <style>{`@keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}`}</style>
      </div>
    );
  }
  return null;
}
