import { useState } from "react";

const TRAITS = [
  // 🧠 신경다양성
  { id:1, code:"ADD", name:"과주의산만형", sub:"ADHD", emoji:"⚡", cat:"신경다양성",
    color:"#FFD93D", desc:"과집중 모드가 발동하면 누구도 못 막아요",
    cheat:"무한 창의력 + 과집중 슈퍼파워", when:"좋아하는 일 앞에서 시간을 잊을 때",
    famous:"에디슨, 일론 머스크, BTS RM", pct:null },
  { id:2, code:"HSP", name:"초감각예민형", sub:"HSP", emoji:"🌊", cat:"신경다양성",
    color:"#74B9FF", desc:"세상을 가장 깊이 느끼는 안테나를 가졌어요",
    cheat:"공감 레이더 + 예술적 직관", when:"말 안 해도 상대 감정이 느껴질 때",
    famous:"고흐, 헤르만 헤세, 아이유", pct:null },
  { id:3, code:"ASD", name:"자폐스펙트럼형", sub:"ASD", emoji:"🔮", cat:"신경다양성",
    color:"#A29BFE", desc:"패턴 인식과 전문성 집착의 천재",
    cheat:"초전문성 + 패턴 해독 능력", when:"아무도 못 보는 규칙을 발견할 때",
    famous:"아인슈타인, 앨런 튜링, 빌 게이츠", pct:null },
  { id:4, code:"DYS", name:"문자역독형", sub:"난독증", emoji:"🌀", cat:"신경다양성",
    color:"#FD79A8", desc:"3D 공간지각과 큰그림 사고의 천재",
    cheat:"공간 인식 최강 + 창의적 문제해결", when:"남들이 못 보는 전체 그림이 보일 때",
    famous:"다빈치, 스티브 잡스, 키아누 리브스", pct:null },
  { id:5, code:"DYC", name:"수리역독형", sub:"난산증", emoji:"🎨", cat:"신경다양성",
    color:"#FDCB6E", desc:"언어·감성 우뇌의 극강 발달",
    cheat:"감성 지능 최강 + 언어적 창의력", when:"숫자보다 이야기로 세상을 이해할 때",
    famous:"셰익스피어, 아가사 크리스티", pct:null },
  { id:6, code:"TIC", name:"운동신호형", sub:"틱/투렛", emoji:"🎯", cat:"신경다양성",
    color:"#55EFC4", desc:"창의적 충동과 폭발적 집중력",
    cheat:"에너지 방출 + 집중력 폭발", when:"몸이 먼저 반응하고 결과가 나올 때",
    famous:"모차르트, 빌리 아일리시", pct:null },
  { id:7, code:"SPD", name:"감각통합이형", sub:"감각처리장애", emoji:"🌈", cat:"신경다양성",
    color:"#FF7675", desc:"섬세한 감각으로 세상을 고해상도로 읽어요",
    cheat:"감각 고해상도 + 환경 적응 능력", when:"남들이 못 느끼는 미묘한 변화를 감지할 때",
    famous:"많은 예술가들이 해당", pct:null },
  { id:8, code:"SYN", name:"공감각보유형", sub:"Synesthesia", emoji:"🎵", cat:"신경다양성",
    color:"#6C5CE7", desc:"소리가 색으로 보이는 천재의 감각",
    cheat:"멀티감각 연결 + 창의적 인식", when:"음악을 들을 때 색이나 형태가 느껴질 때",
    famous:"칸딘스키, 리스트, 파렐 윌리엄스", pct:null },

  // 💭 사고 패턴
  { id:9, code:"HIT", name:"과직관형사고", sub:"Hyper Intuitive Thinking", emoji:"🔥", cat:"사고패턴",
    color:"#FF6B6B", desc:"데이터 없이 답을 먼저 아는 능력",
    cheat:"초고속 패턴 매칭 + 미래 감지", when:"설명할 수 없지만 답을 알 때",
    famous:"스티브 잡스, 오프라 윈프리", pct:null },
  { id:10, code:"OVT", name:"과잉사고형", sub:"Overthinking", emoji:"🌀", cat:"사고패턴",
    color:"#74B9FF", desc:"머릿속 시나리오 플래너, 미래를 미리 살아요",
    cheat:"리스크 감지 최강 + 완벽한 준비", when:"모든 경우의 수를 이미 계산했을 때",
    famous:"대부분의 천재들", pct:null },
  { id:11, code:"PFT", name:"완벽추구형", sub:"Perfectionism", emoji:"💎", cat:"사고패턴",
    color:"#DFE6E9", desc:"세상에서 가장 높은 기준을 가진 사람",
    cheat:"품질 보증 능력 + 높은 기준", when:"남들이 OK 해도 나만 더 나은 것을 볼 때",
    famous:"스티브 잡스, 봉준호", pct:null },
  { id:12, code:"DRM", name:"몽상창조형", sub:"Daydreamer", emoji:"☁️", cat:"사고패턴",
    color:"#B2BEC3", desc:"현실에 없는 세계를 설계하는 창조자",
    cheat:"무한 상상력 + 세계 창조 능력", when:"수업 중 딴생각이 실제 아이디어가 될 때",
    famous:"J.K. 롤링, 디즈니", pct:null },
  { id:13, code:"PTN", name:"패턴해독형", sub:"Pattern Recognition", emoji:"🧩", cat:"사고패턴",
    color:"#00B894", desc:"남들이 못 보는 규칙과 연결을 발견해요",
    cheat:"숨겨진 법칙 발견 + 예측 능력", when:"데이터에서 아무도 못 본 패턴을 볼 때",
    famous:"셜록 홈즈 스타일, 닐스 보어", pct:null },
  { id:14, code:"MTC", name:"초메타인지형", sub:"Meta Cognition", emoji:"🪞", cat:"사고패턴",
    color:"#FFEAA7", desc:"자기 뇌를 객관적으로 보는 드문 능력",
    cheat:"자기 객관화 + 빠른 자기 수정", when:"내가 왜 이런 생각을 하는지 알 때",
    famous:"마르쿠스 아우렐리우스, 달라이 라마", pct:null },
  { id:15, code:"DIV", name:"확산사고형", sub:"Divergent Thinking", emoji:"💥", cat:"사고패턴",
    color:"#FD79A8", desc:"하나에서 백을 떠올리는 아이디어 폭발",
    cheat:"아이디어 무한 생성 + 창의적 연결", when:"브레인스토밍에서 혼자 아이디어가 넘칠 때",
    famous:"레오나르도 다빈치, 에디슨", pct:null },
  { id:16, code:"DEP", name:"심층분석형", sub:"Deep Analysis", emoji:"🔬", cat:"사고패턴",
    color:"#55EFC4", desc:"한 가지를 누구보다 깊이 파고드는 힘",
    cheat:"전문성 극대화 + 깊이 있는 통찰", when:"하나를 파다 보면 세계가 열릴 때",
    famous:"찰스 다윈, 뉴턴", pct:null },
  { id:17, code:"DLT", name:"이중사고형", sub:"Dialectical Thinking", emoji:"⚖️", cat:"사고패턴",
    color:"#A29BFE", desc:"반대 관점을 동시에 볼 수 있는 능력",
    cheat:"중재 능력 최강 + 다면 이해", when:"양쪽 다 맞는 게 보여서 편을 못 들 때",
    famous:"링컨, 오바마", pct:null },

  // 💗 감정·공감
  { id:18, code:"EMP", name:"공감과부하형", sub:"Empath", emoji:"💗", cat:"감정공감",
    color:"#FF7675", desc:"타인의 감정을 내 것처럼 느끼는 치유자",
    cheat:"치유 능력 + 인간 이해 최강", when:"말 안 해도 상대가 무슨 감정인지 알 때",
    famous:"테레사 수녀, 오프라 윈프리", pct:null },
  { id:19, code:"RSD", name:"거절민감형", sub:"Rejection Sensitive Dysphoria", emoji:"🫀", cat:"감정공감",
    color:"#FD79A8", desc:"관계에 누구보다 진심인 사람의 이면",
    cheat:"관계 헌신 최강 + 깊은 감수성", when:"작은 말 한마디가 오래 마음에 남을 때",
    famous:"ADHD를 가진 많은 창의적 인물들", pct:null },
  { id:20, code:"ANA", name:"불안형애착", sub:"Anxious Attachment", emoji:"🌙", cat:"감정공감",
    color:"#6C5CE7", desc:"깊고 헌신적인 사랑의 원천",
    cheat:"깊은 사랑 능력 + 관계 집중력", when:"한 사람에게 온 우주가 될 때",
    famous:"많은 낭만주의 예술가들", pct:null },
  { id:21, code:"AVA", name:"회피형애착", sub:"Avoidant Attachment", emoji:"🏔️", cat:"감정공감",
    color:"#B2BEC3", desc:"완전한 자기충족과 독립성의 힘",
    cheat:"완전한 독립성 + 자기충족 능력", when:"혼자서도 완전한 세계가 있을 때",
    famous:"많은 철학자·예술가들", pct:null },
  { id:22, code:"EIN", name:"정서강도형", sub:"Emotional Intensity", emoji:"🌋", cat:"감정공감",
    color:"#FF6B6B", desc:"감정의 진폭이 커서 삶을 더 강렬하게 살아요",
    cheat:"강렬한 삶 경험 + 예술적 표현력", when:"기쁨도 슬픔도 남들보다 훨씬 강하게 느낄 때",
    famous:"프리다 칼로, 빈센트 반 고흐", pct:null },
  { id:23, code:"OVE", name:"감정이입과다형", sub:"Over-Empathy", emoji:"🫧", cat:"감정공감",
    color:"#74B9FF", desc:"예술적 감수성의 극한 형태",
    cheat:"최고의 예술적 감수성 + 치유력", when:"영화 속 인물의 감정이 실제처럼 느껴질 때",
    famous:"많은 작가·배우·음악가들", pct:null },
  { id:24, code:"BRN", name:"번아웃민감형", sub:"Burnout Prone", emoji:"🕯️", cat:"감정공감",
    color:"#FDCB6E", desc:"높은 기준과 헌신이 만든 훈장",
    cheat:"높은 기준 증거 + 깊은 헌신력", when:"최선을 다한 후 텅 빈 느낌이 올 때",
    famous:"대부분의 고성취자들", pct:null },
  { id:25, code:"TRS", name:"트라우마민감형", sub:"Trauma Sensitivity", emoji:"🌿", cat:"감정공감",
    color:"#00B894", desc:"위기 감지 레이더와 깊은 공감의 원천",
    cheat:"위기 감지 최강 + 공감 치유력", when:"과거 경험이 지금 나를 더 강하게 만들 때",
    famous:"많은 사회 활동가·치유사들", pct:null },

  // ⚡ 에너지·행동
  { id:26, code:"IMP", name:"충동실행형", sub:"Impulsivity", emoji:"🚀", cat:"에너지행동",
    color:"#FF7675", desc:"생각보다 빠른 실행력의 원천",
    cheat:"즉각 실행력 + 빠른 결정력", when:"남들이 고민할 때 이미 해버렸을 때",
    famous:"리처드 브랜슨, 유재석", pct:null },
  { id:27, code:"HYP", name:"경조증사이클형", sub:"Hypomanic Cycle", emoji:"🌟", cat:"에너지행동",
    color:"#FFD93D", desc:"창의력이 폭발하는 고에너지 사이클",
    cheat:"창의 폭발 사이클 + 에너지 최강", when:"며칠간 잠도 안 자고 뭔가를 만들 때",
    famous:"처칠, 반 고흐, 카리예", pct:null },
  { id:28, code:"NIT", name:"야간각성형", sub:"Night Owl", emoji:"🦉", cat:"에너지행동",
    color:"#6C5CE7", desc:"밤에 깨어나는 뇌, 올빼미의 진짜 능력",
    cheat:"야간 창의력 폭발 + 집중력 극대화", when:"밤 11시부터 뇌가 켜지는 느낌일 때",
    famous:"프란츠 카프카, 마르셀 프루스트", pct:null },
  { id:29, code:"HYA", name:"과각성형", sub:"Hyperarousal", emoji:"⚡", cat:"에너지행동",
    color:"#FFEAA7", desc:"위험 감지 레이더가 항상 켜진 상태",
    cheat:"위기 감지 능력 + 빠른 반응", when:"무언가 잘못되기 전에 먼저 느낄 때",
    famous:"많은 특수부대원·응급의료진", pct:null },
  { id:30, code:"HYO", name:"저각성형", sub:"Hypoarousal", emoji:"🌊", cat:"에너지행동",
    color:"#74B9FF", desc:"깊은 침잠과 사색의 능력",
    cheat:"깊은 사색력 + 평온한 집중", when:"폭풍 속에서도 고요함을 유지할 때",
    famous:"달라이 라마, 많은 철학자들", pct:null },
  { id:31, code:"ART", name:"루틴파괴형", sub:"Anti-Routine", emoji:"🎪", cat:"에너지행동",
    color:"#FD79A8", desc:"변화와 즉흥에서 에너지를 얻는 자유인",
    cheat:"즉흥 창의력 + 변화 적응 최강", when:"계획 없이 즉흥으로 최고의 결과가 나올 때",
    famous:"재즈 뮤지션들, 즉흥 배우들", pct:null },
  { id:32, code:"INT", name:"극내향형", sub:"Deep Introvert", emoji:"🏯", cat:"에너지행동",
    color:"#A29BFE", desc:"혼자서 완전한 세계를 가진 사람",
    cheat:"깊은 내면 세계 + 자기충족 능력", when:"혼자만의 시간이 진짜 충전될 때",
    famous:"뉴턴, 카프카, 박효신", pct:null },
  { id:33, code:"ENB", name:"에너지폭발형", sub:"Energy Burst", emoji:"💥", cat:"에너지행동",
    color:"#FF6B6B", desc:"일단 불이 붙으면 멈출 수 없는 힘",
    cheat:"폭발적 추진력 + 전염되는 에너지", when:"시작하면 주변까지 달아오를 때",
    famous:"제이홉, 유재석, 리처드 브랜슨", pct:null },

  // 🌊 감각·신체
  { id:34, code:"GST", name:"미각후각예민형", sub:"Gustatory Sensitivity", emoji:"🌸", cat:"감각신체",
    color:"#55EFC4", desc:"남이 못 느끼는 미묘한 차이를 감지해요",
    cheat:"감각 고해상도 + 품질 감별 능력", when:"음식 맛에서 재료를 하나하나 느낄 때",
    famous:"유명 셰프들, 소믈리에들", pct:null },
  { id:35, code:"BSG", name:"신체신호형", sub:"Body Signal Awareness", emoji:"💫", cat:"감각신체",
    color:"#FDCB6E", desc:"몸의 경고를 가장 먼저 읽는 능력",
    cheat:"신체 인식 최강 + 건강 감지 능력", when:"몸이 먼저 뭔가 잘못됐다고 알려줄 때",
    famous:"많은 운동선수·명상가들", pct:null },
  { id:36, code:"TCT", name:"촉각예민형", sub:"Tactile Sensitivity", emoji:"🤲", cat:"감각신체",
    color:"#DFE6E9", desc:"질감과 온도로 세상을 읽는 섬세함",
    cheat:"촉각 정보 최강 + 손끝 감각 능력", when:"소재 하나에서 수많은 정보가 느껴질 때",
    famous:"많은 조각가·도예가들", pct:null },
  { id:37, code:"ENV", name:"환경민감형", sub:"Environmental Sensitivity", emoji:"🌿", cat:"감각신체",
    color:"#00B894", desc:"공간의 에너지를 감지하는 능력",
    cheat:"공간 기운 감지 + 환경 최적화 능력", when:"어떤 공간에 들어가면 바로 기운이 느껴질 때",
    famous:"많은 풍수가·인테리어 디자이너", pct:null },

  // 🔮 특수능력
  { id:38, code:"EID", name:"사진기억형", sub:"Eidetic Memory", emoji:"📸", cat:"특수능력",
    color:"#6C5CE7", desc:"본 것을 사진처럼 저장하는 뇌",
    cheat:"시각 정보 완벽 저장 + 회상 능력", when:"한 번 본 것이 사진처럼 기억날 때",
    famous:"니콜라 테슬라, 모차르트", pct:null },
  { id:39, code:"APT", name:"절대음감형", sub:"Absolute Pitch", emoji:"🎼", cat:"특수능력",
    color:"#FFD93D", desc:"소리의 주파수를 정확히 인식하는 능력",
    cheat:"음악적 뇌 + 소리 패턴 인식", when:"음악을 들으면 음이름이 바로 들릴 때",
    famous:"모차르트, 머라이어 캐리", pct:null },
  { id:40, code:"PRE", name:"예지직관형", sub:"Pre-cognition Intuition", emoji:"🔮", cat:"특수능력",
    color:"#A29BFE", desc:"상황을 미리 읽는 선독 능력",
    cheat:"상황 선독 능력 + 미래 시뮬레이션", when:"일이 터지기 전에 이미 알고 있을 때",
    famous:"많은 전략가·예언가들", pct:null },
];

const CATS = ["전체","신경다양성","사고패턴","감정공감","에너지행동","감각신체","특수능력"];
const CAT_COLORS = {
  신경다양성:"#FFD93D", 사고패턴:"#FF6B6B", 감정공감:"#FD79A8",
  에너지행동:"#FF7675", 감각신체:"#55EFC4", 특수능력:"#A29BFE"
};
const CAT_EMOJIS = {
  신경다양성:"🧠", 사고패턴:"💭", 감정공감:"💗",
  에너지행동:"⚡", 감각신체:"🌊", 특수능력:"🔮"
};

function Modal({ t, onClose }) {
  const rgb = hexToRgb(t.color);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:430,background:"#111118",borderRadius:"24px 24px 0 0",padding:"28px 24px 48px",maxHeight:"88vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:54,marginBottom:8,filter:`drop-shadow(0 0 20px rgba(${rgb},0.7))`}}>{t.emoji}</div>
          <div style={{fontSize:10,color:t.color,letterSpacing:3,marginBottom:4}}>{t.code}</div>
          <h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>{t.name}</h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 4px"}}>{t.sub}</p>
          <span style={{fontSize:10,color:CAT_COLORS[t.cat],background:`rgba(${hexToRgb(CAT_COLORS[t.cat])},0.12)`,padding:"3px 10px",borderRadius:20}}>{CAT_EMOJIS[t.cat]} {t.cat}</span>
        </div>

        <div style={{background:`rgba(${rgb},0.08)`,border:`1px solid rgba(${rgb},0.25)`,borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:11,color:t.color,letterSpacing:3,marginBottom:8}}>🔮 이 특성은</p>
          <p style={{fontSize:15,lineHeight:1.8,color:"#C8BC9A",margin:0}}>{t.desc}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:11,color:"#FFD93D",letterSpacing:3,marginBottom:8}}>⚡ 치트키</p>
          <p style={{fontSize:14,fontWeight:600,color:"#F0EAD6",margin:0}}>{t.cheat}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:11,color:"#55EFC4",letterSpacing:3,marginBottom:8}}>✨ 초능력 발동 순간</p>
          <p style={{fontSize:13,color:"#C8BC9A",lineHeight:1.8,margin:0}}>{t.when}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px",marginBottom:20}}>
          <p style={{fontSize:11,color:"#FD79A8",letterSpacing:3,marginBottom:8}}>🌟 이 특성을 가진 유명인</p>
          <p style={{fontSize:13,color:"#C8BC9A",margin:0}}>{t.famous}</p>
        </div>

        <button onClick={onClose} style={{width:"100%",padding:"16px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:14,color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>닫기</button>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

export default function 특성갤러리() {
  const [cat, setCat] = useState("전체");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = TRAITS.filter(t => {
    const matchCat = cat === "전체" || t.cat === cat;
    const matchSearch = !search || t.name.includes(search) || t.sub.includes(search) || t.code.includes(search.toUpperCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{minHeight:"100vh",background:"#0D2318",fontFamily:"'Noto Serif KR',serif",color:"#F0EAD6",maxWidth:430,margin:"0 auto",boxSizing:"border-box"}}>

      {/* 헤더 */}
      <div style={{padding:"32px 20px 0",background:"linear-gradient(180deg,#0A0A10,transparent)"}}>
        <div style={{fontSize:10,letterSpacing:6,color:"#FFD93D",marginBottom:4,textAlign:"center"}}>BRAIN TRAITS</div>
        <h1 style={{fontSize:26,fontWeight:700,margin:"0 0 4px",textAlign:"center",letterSpacing:1}}>40가지 뇌 특성</h1>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px",lineHeight:1.6}}>
          당신의 뇌는 고장난 게 아니라<br/>
          <span style={{color:"#FFD93D"}}>다르게 설계된 거예요</span>
        </p>

        {/* 검색 */}
        <div style={{position:"relative",marginBottom:14}}>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="특성 검색... (ADHD, HSP, ADD...)"
            style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontSize:13,color:"#F0EAD6",outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
          />
        </div>

        {/* 카테고리 탭 */}
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:12,scrollbarWidth:"none"}}>
          {CATS.map(c => (
            <button key={c} onClick={()=>setCat(c)} style={{
              flexShrink:0,padding:"7px 14px",
              background:cat===c?(c==="전체"?"rgba(255,217,61,0.2)":`rgba(${hexToRgb(CAT_COLORS[c]||"255,217,61")},0.2)`):"rgba(255,255,255,0.04)",
              border:cat===c?`1px solid ${c==="전체"?"#FFD93D":CAT_COLORS[c]||"#FFD93D"}`:"1px solid rgba(255,255,255,0.08)",
              borderRadius:20,fontSize:11,
              color:cat===c?(c==="전체"?"#FFD93D":CAT_COLORS[c]||"#FFD93D"):"rgba(255,255,255,0.4)",
              cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"
            }}>
              {c !== "전체" && CAT_EMOJIS[c]} {c}
            </button>
          ))}
        </div>

        {/* 카운트 */}
        <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",margin:"0 0 12px"}}>
          {filtered.length}가지 특성
        </p>
      </div>

      {/* 카드 그리드 */}
      <div style={{padding:"0 16px 100px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {filtered.map((t,i) => {
          const rgb = hexToRgb(t.color);
          return (
            <div key={t.id} onClick={()=>setSelected(t)}
              style={{
                background:`rgba(${rgb},0.07)`,
                border:`1px solid rgba(${rgb},0.2)`,
                borderRadius:16,padding:"16px 14px",cursor:"pointer",
                transition:"all 0.2s",
                animation:`fadeIn 0.3s ease ${i*0.03}s both`
              }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 20px rgba(${rgb},0.2)`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
            >
              {/* 코드 뱃지 */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:9,color:t.color,background:`rgba(${rgb},0.15)`,padding:"2px 7px",borderRadius:8,letterSpacing:1,fontWeight:700}}>{t.code}</span>
                <span style={{fontSize:8,color:"rgba(255,255,255,0.2)"}}>{CAT_EMOJIS[t.cat]}</span>
              </div>

              {/* 이모지 */}
              <div style={{fontSize:32,marginBottom:8,filter:`drop-shadow(0 0 10px rgba(${rgb},0.5))`}}>{t.emoji}</div>

              {/* 이름 */}
              <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px",lineHeight:1.3}}>{t.name}</p>
              <p style={{fontSize:9,color:`rgba(${rgb},0.8)`,margin:"0 0 8px",letterSpacing:0.5}}>{t.sub}</p>

              {/* 설명 */}
              <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 10px",lineHeight:1.5}}>{t.desc}</p>

              {/* 치트키 */}
              <div style={{background:"rgba(255,217,61,0.06)",borderRadius:8,padding:"6px 8px"}}>
                <span style={{fontSize:9,color:"#FFD93D"}}>⚡ </span>
                <span style={{fontSize:9,color:"rgba(255,217,61,0.7)",lineHeight:1.4}}>{t.cheat.split("+")[0].trim()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 CTA */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"16px 20px 24px",background:"linear-gradient(transparent,#0A0A10 40%)",boxSizing:"border-box"}}>
        <button style={{width:"100%",padding:"17px",background:"linear-gradient(135deg,#FFD93D,#FF6B6B)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0A0A10",cursor:"pointer",letterSpacing:1,boxShadow:"0 8px 24px rgba(255,107,107,0.3)"}}>
          🧠 내 특성 종합 검사하기 (4,800원) →
        </button>
      </div>

      {/* 모달 */}
      {selected && <Modal t={selected} onClose={()=>setSelected(null)}/>}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { display:none; }
        input::placeholder { color:rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
