import { useState, useRef, useEffect } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"가장 궁금한 것은?", icon:"👁️", multi:true, skippable:false,
   opts:["❤️ 연애·결혼 인연운","💰 재물·사업운","💼 직업·명예운","🌿 건강·수명","👶 자녀운","🌟 총운 전체"]},
  {title:"지금 가장 신경 쓰이는 건?", icon:"💭", multi:false, skippable:true,
   opts:["❤️ 연애가 언제 될지","💰 돈복이 있는지","💼 직업·커리어 방향","🌿 건강·수명","👶 아이가 생길지","🔮 딱히 없어요"]},
];

var LOADING_MSGS = [
  "얼굴 윤곽 분석 중... 👁️","12궁 좌표 추출 중... 📐",
  "이마·코·입 기운 측정 중... ✨","관상 도사가 들여다보는 중... 🔮",
  "오악·삼정 균형 분석 중... ☯️","22종 관상 유형 대조 중... 📚",
];

// ── 관상 분석 결과 데이터 ──
var GWANSANG_RESULT = {
  overview: DEMO_NAME+"님 얼굴을 보는 순간 느낌이 왔어요. 이목구비가 단정하고 균형이 잘 잡혀 있어요. 이마가 넓고 깨끗하며, 코가 곧고 콧방울이 풍성해요. 이건 지혜와 재물이 함께 따라오는 얼굴이에요.",
  face_type: "귀격형 (貴格)",
  face_type_desc: "이목구비가 조화롭고 균형이 잘 잡힌 얼굴이에요. 사회적으로 인정받고 안정적인 삶을 사는 귀격형 관상이에요.",
  overall_score: 81,

  // ── 12궁 분석 ──
  gung_12: [
    {name:"명궁 (命宮)", area:"미간·인당", score:85, luck:"길",
     reading:"미간이 넓고 맑게 빛나요. 명궁이 좋으면 운이 열리고 귀인이 찾아와요. 인당에 주름이나 흉터가 없어 총운이 매우 길해요.",
     caution:"스트레스를 받으면 이 부위에 주름이 생겨요. 인당 마사지로 기운을 열어두세요."},
    {name:"재백궁 (財帛宮)", area:"코 전체", score:78, luck:"길",
     reading:"콧대가 곧고 코끝(준두)이 두툼해요. 이건 재물이 들어오면 잘 지키는 타입의 코예요. 콧구멍이 정면에서 보이지 않아 돈을 함부로 쓰지 않는 절약형이에요.",
     caution:"콧등에 세로 주름이 생기면 재물 손실 주의 신호예요."},
    {name:"관록궁 (官祿宮)", area:"이마 중앙", score:82, luck:"길",
     reading:"이마가 넓고 뼈가 둥글게 솟아 있어요. 관록궁이 발달하면 직장운과 명예운이 좋아요. 특히 30대 이후 커리어에서 인정받을 기운이 강해요.",
     caution:"이마에 가로 주름이 많으면 정신적 과부하 신호예요. 휴식이 필요해요."},
    {name:"처첩궁 (妻妾宮)", area:"눈꼬리 옆", score:74, luck:"중",
     reading:"눈꼬리가 살이 차 있고 주름이 적어요. 배우자 인연이 있고 결혼 후 안정적인 가정을 꾸릴 운이에요. 다만 처첩궁에 작은 점이 있어 이성 관계에서 선택에 신중함이 필요해요.",
     caution:"눈꼬리에 깊은 주름이 생기면 배우자 관계 변화 신호예요."},
    {name:"남녀궁 (男女宮)", area:"눈 아래 와잠", score:79, luck:"길",
     reading:"눈 아래(와잠)가 도톰하고 색택이 밝아요. 자녀운이 좋고 정력이 넘쳐요. 와잠이 풍성하면 자녀 복이 있고, 자녀가 부모를 기쁘게 하는 운이에요.",
     caution:"눈 아래가 어둡거나 꺼지면 생식 건강을 챙겨야 해요."},
    {name:"형제궁 (兄弟宮)", area:"눈썹", score:76, luck:"중",
     reading:"눈썹이 결이 고르고 눈보다 길게 이어져 있어요. 인복이 있고 형제자매와 우애가 좋아요. 눈썹이 선명하면 경쟁력도 뛰어나요.",
     caution:"눈썹이 중간에 끊기거나 숱이 없어지면 인덕 약화 신호예요."},
    {name:"질액궁 (疾厄宮)", area:"콧등 산근", score:71, luck:"중",
     reading:"콧등(산근)이 매끄럽고 윤기가 있어요. 건강운이 양호하고 큰 사고나 수술수는 없어요. 다만 산근이 약간 낮아 30대에 한 번 건강 체크를 해보세요.",
     caution:"콧등에 가로 주름이나 검은 기운이 오면 건강 이상 신호예요."},
    {name:"천이궁 (遷移宮)", area:"눈썹 끝 위 이마", score:77, luck:"길",
     reading:"눈썹 끝 위쪽 이마가 살이 붙어 있어요. 이동운이 좋아 이사나 여행에서 좋은 기운을 얻어요. 해외 인연도 있을 수 있어요.",
     caution:"이 부위에 흉터나 점이 있으면 이동 중 주의가 필요해요."},
    {name:"복덕궁 (福德宮)", area:"눈썹 위 이마 양쪽", score:80, luck:"길",
     reading:"이마 양쪽 복덕궁이 풍만하고 깨끗해요. 조상 덕이 있고 정신적으로 안락한 삶을 살아요. 복덕궁이 발달하면 덕을 베푸는 삶을 살게 돼요.",
     caution:"이 부위가 함몰되거나 색이 탁하면 조상과의 인연이 약해요."},
    {name:"노복궁 (奴僕宮)", area:"입 주변·턱", score:73, luck:"중",
     reading:"턱이 적당히 넓고 살집이 있어요. 아랫사람 복이 있고 리더십이 있어요. 하지만 너무 뾰족하지 않아 권위와 친근함이 공존해요.",
     caution:"턱에 흉터나 상처가 생기면 아랫사람과의 갈등 주의예요."},
    {name:"전택궁 (田宅宮)", area:"눈꺼풀", score:75, luck:"중",
     reading:"눈꺼풀이 적당히 넓고 탄력이 있어요. 부동산이나 주거 안정 운이 괜찮아요. 쌍꺼풀이 선명하면 감수성도 풍부해요.",
     caution:"눈꺼풀이 처지거나 좁아지면 주거 운 약화 신호예요."},
    {name:"상모궁 (相貌宮)", area:"얼굴 전체 조화", score:82, luck:"길",
     reading:"얼굴 전체 이목구비가 조화롭고 균형이 잘 잡혀 있어요. 상모궁이 좋으면 첫인상이 좋고 어디서든 환영받는 얼굴이에요. 총체적 기운이 안정적이에요.",
     caution:"얼굴 비대칭이 심해지면 몸의 불균형 신호일 수 있어요."},
  ],

  // ── 부위별 형태 분석 ──
  features: [
    {part:"👁️ 눈", shape:"봉황안 (鳳凰眼)", score:83,
     meaning:"눈꼬리가 살짝 올라가고 눈매가 선명해요. 봉황안은 리더십과 카리스마를 상징하는 최고의 눈 관상이에요. 눈빛이 맑고 안정적이어서 신뢰를 주는 타입이에요.",
     fortune:"직장이나 사업에서 리더십을 발휘하고 인정받을 운이에요."},
    {part:"👃 코", shape:"복코 (伏虎鼻)", score:79,
     meaning:"콧대가 곧고 코끝이 풍성하며 콧방울이 좌우 균형 있게 퍼져 있어요. 복코는 재물을 담는 그릇이 큰 코예요. 돈이 들어오면 잘 지키고 불리는 재물 복코예요.",
     fortune:"30대 이후 재물이 안정적으로 쌓이는 운이에요. 사업운도 좋아요."},
    {part:"👄 입", shape:"앵두입 (口如丹朱)", score:77,
     meaning:"입술이 선명하고 색이 붉으며 좌우 균형이 잡혀 있어요. 입이 단정하면 언변이 좋고 약속을 잘 지키는 신뢰형이에요. 식복도 있고 말 한마디로 사람을 이끄는 능력이 있어요.",
     fortune:"대인관계와 언변이 필요한 일에서 두각을 나타내요."},
    {part:"👂 귀", shape:"수주입구 (垂珠入口)", score:81,
     meaning:"귓불이 두툼하고 아래로 처져 입 쪽을 향하는 모양이에요. 이 귀 모양은 재물복과 장수를 상징하는 최길 관상이에요. 타인의 존경을 받고 큰 재산을 모으는 귀예요.",
     fortune:"재물복이 강하고 인덕이 있어 많은 이에게 사랑받아요."},
    {part:"✏️ 눈썹", shape:"유엽미 (柳葉眉)", score:75,
     meaning:"버들잎처럼 가늘고 길게 뻗어 있는 눈썹이에요. 유엽미는 감수성이 풍부하고 예술적 감각이 뛰어난 관상이에요. 인간관계가 원만하고 형제 인연이 좋아요.",
     fortune:"예술·창작·교육 분야에서 재능이 빛나는 운이에요."},
  ],

  // ── 나이별 집중 부위 ──
  age_reading: [
    {age:"10대", part:"이마 (15~30세)", reading:"이마의 기운이 10대를 지배해요. 이마가 넓고 맑으면 10대가 밝고 공부운이 좋아요."},
    {age:"20대", part:"눈썹~눈 (31~40세)", reading:"눈썹과 눈 사이의 기운이 20대 운을 결정해요. 눈썹이 선명하면 20대 인덕과 경쟁력이 강해요."},
    {age:"30대", part:"코 (41~50세)", reading:"코가 30대 재물과 건강운을 주관해요. 코가 곧고 풍성하면 30~40대 재물이 안정적으로 쌓여요."},
    {age:"40대", part:"광대·뺨 (51~55세)", reading:"광대 기운이 40대 권위와 사회적 지위를 결정해요. 광대가 적당히 솟아있으면 40대에 전성기가 와요."},
    {age:"50대", part:"입·인중 (56~60세)", reading:"입과 인중이 50대 말년 운을 주관해요. 인중이 길고 선명하면 자녀복과 말년이 편안해요."},
    {age:"60대+", part:"턱·귀 (61~100세)", reading:"턱과 귀가 말년 전체를 관장해요. 턱이 넓고 귓불이 두툼하면 노후가 풍요롭고 장수해요."},
  ],

  // ── 총운 ──
  personality: "전체적으로 이목구비가 조화롭고 귀격형 관상이에요. 지혜와 재물이 함께 따라오는 복 있는 얼굴이에요. 특히 이마와 코가 발달해 30~40대가 인생의 황금기가 될 가능성이 높아요.",
  fortune: "40대 전후가 인생 최고의 전성기예요. 지금 하고 있는 일에 집중하면 50대에 큰 결실이 와요.",
  gaeun: [
    "이마를 자주 마사지하면 명궁 기운이 활성화돼 귀인이 찾아와요",
    "코를 항상 깨끗하게 관리하세요 — 재백궁이 밝아야 재물이 들어와요",
    "입술이 건조하지 않게 관리하면 식복과 언변운이 살아나요",
    "귓볼을 자주 당겨주는 마사지가 장수와 재물운을 높여요",
    "눈썹은 자연스럽게 유지하는 게 인덕을 지키는 비결이에요",
  ],
};

function GBtn({children,onClick,dim,color}){
  return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":color||"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;
}
function ScoreBar({score,color}){
  return <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
    <div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}>
      <div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/>
    </div>
    <span style={{fontSize:12,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span>
  </div>;
}
function Section({title,children}){
  return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
    <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>
    {children}
  </div>;
}

// 얼굴 실루엣 SVG
function FaceSilhouette(){
  return (
    <svg viewBox="0 0 120 160" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto"}}>
      {/* 배경 */}
      <rect width="120" height="160" fill="linear-gradient(180deg,#0D2318,#1a3020)"/>
      {/* 얼굴 윤곽 */}
      <ellipse cx="60" cy="78" rx="38" ry="48" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.4)" strokeWidth="1"/>
      {/* 이마 */}
      <rect x="34" y="30" width="52" height="18" rx="4" fill="rgba(232,200,122,0.06)" stroke="rgba(232,200,122,0.2)" strokeWidth="0.5"/>
      <text x="60" y="42" fontSize="5" fill="rgba(232,200,122,0.6)" textAnchor="middle">관록궁·명궁</text>
      {/* 눈썹 */}
      <path d="M32,58 Q44,54 52,57" stroke="rgba(232,200,122,0.5)" strokeWidth="1.5" fill="none"/>
      <path d="M68,57 Q76,54 88,58" stroke="rgba(232,200,122,0.5)" strokeWidth="1.5" fill="none"/>
      {/* 눈 */}
      <ellipse cx="44" cy="65" rx="10" ry="5" fill="none" stroke="rgba(255,150,100,0.6)" strokeWidth="1"/>
      <ellipse cx="76" cy="65" rx="10" ry="5" fill="none" stroke="rgba(255,150,100,0.6)" strokeWidth="1"/>
      <text x="60" y="72" fontSize="4" fill="rgba(255,150,100,0.7)" textAnchor="middle">전택궁·처첩궁</text>
      {/* 코 */}
      <path d="M60,72 L56,90 Q60,93 64,90 L60,72" fill="rgba(116,185,255,0.15)" stroke="rgba(116,185,255,0.5)" strokeWidth="0.8"/>
      <text x="60" y="99" fontSize="4.5" fill="rgba(116,185,255,0.7)" textAnchor="middle">재백궁</text>
      {/* 입 */}
      <path d="M48,108 Q60,116 72,108" fill="rgba(255,100,100,0.15)" stroke="rgba(255,100,100,0.5)" strokeWidth="1"/>
      <text x="60" y="122" fontSize="4" fill="rgba(255,100,100,0.6)" textAnchor="middle">노복궁</text>
      {/* 귀 */}
      <ellipse cx="22" cy="76" rx="7" ry="12" fill="rgba(95,196,158,0.15)" stroke="rgba(95,196,158,0.4)" strokeWidth="0.8"/>
      <ellipse cx="98" cy="76" rx="7" ry="12" fill="rgba(95,196,158,0.15)" stroke="rgba(95,196,158,0.4)" strokeWidth="0.8"/>
      {/* 와잠 */}
      <ellipse cx="44" cy="73" rx="8" ry="3" fill="rgba(232,200,122,0.12)" stroke="rgba(232,200,122,0.3)" strokeWidth="0.5"/>
      <ellipse cx="76" cy="73" rx="8" ry="3" fill="rgba(232,200,122,0.12)" stroke="rgba(232,200,122,0.3)" strokeWidth="0.5"/>
    </svg>
  );
}

export default function GwansangPreview(){
  const [step, setStep] = useState("info");   // info | questions | loading | result
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sel, setSel] = useState([]);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [loadMsg, setLoadMsg] = useState(0);
  const [openGung, setOpenGung] = useState(null);
  const fileRef = useRef();
  const R = GWANSANG_RESULT;

  useEffect(()=>{
    if(step!=="loading") return;
    let i=0;
    const iv = setInterval(()=>{
      i++;
      setLoadMsg(i % LOADING_MSGS.length);
      if(i>=LOADING_MSGS.length*2) { clearInterval(iv); setStep("result"); }
    }, 700);
    return ()=>clearInterval(iv);
  },[step]);

  function handleImg(e){
    const f = e.target.files?.[0];
    if(!f) return;
    const url = URL.createObjectURL(f);
    setUploadedImg(url);
  }

  // ── 정보 화면 ──
  if(step==="info") return (
    <div style={{minHeight:"100vh",background:"#0a1a0f",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 오리지널 · AI 관상 분석</p>
        <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>👁️ 관상 보기</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>사진 한 장으로 얼굴의 기운을 읽어드려요 · 380원</p>
      </div>
      <div style={{padding:"16px"}}>
        {/* 얼굴 실루엣 */}
        <div style={{background:DG,borderRadius:16,padding:"20px",marginBottom:12,textAlign:"center"}}>
          <FaceSilhouette/>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.75,margin:"14px 0 0",wordBreak:"keep-all"}}>
            얼굴에는 운명이 새겨져 있어요.<br/>12궁과 이목구비로 당신의 기운을 읽어드려요.
          </p>
        </div>
        {/* 특징 */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 걸 알려드려요</p>
          {[
            {icon:"🏛️",title:"얼굴 12궁 분석",desc:"명궁·재백궁·관록궁 등 12개 영역별 운세를 상세히 풀어드려요"},
            {icon:"👁️",title:"이목구비 형태 풀이",desc:"눈·코·입·귀·눈썹 형태로 성격과 재능을 분석해요"},
            {icon:"📅",title:"나이별 집중 부위",desc:"10대~60대 각 시기마다 어느 부위가 운을 주관하는지 알려드려요"},
            {icon:"✨",title:"개운법 제안",desc:"얼굴 관리로 운기를 높이는 맞춤 개운법을 알려드려요"},
          ].map(item=>(
            <div key={item.title} style={{display:"flex",gap:10,marginBottom:10}}>
              <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:G,margin:"0 0 2px"}}>{item.title}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.65}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginBottom:14}}>
          <span style={{fontSize:11,padding:"4px 14px",borderRadius:20,background:"rgba(95,196,158,0.15)",color:"#5FC49E",border:"1px solid rgba(95,196,158,0.3)",fontWeight:600}}>✦ 사진 없이 미리보기 가능</span>
        </div>
        <GBtn onClick={()=>setStep("questions")}>관상 보기 시작 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 질문 화면 ──
  if(step==="questions"){
    const q = QUESTIONS[qIdx];
    return (
      <div style={{minHeight:"100vh",background:"#0a1a0f",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ {qIdx+1} / {QUESTIONS.length}</p>
          <h2 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:0}}>{q.icon} {q.title}</h2>
        </div>
        <div style={{padding:"16px"}}>
          {/* 이미지 업로드 (1번 질문에만) */}
          {qIdx===0&&(
            <div style={{background:DG,borderRadius:14,padding:"14px",marginBottom:14}}>
              <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>📸 사진 업로드 (선택)</p>
              <div onClick={()=>fileRef.current?.click()} style={{border:"1px dashed rgba(232,200,122,0.3)",borderRadius:12,padding:"16px",textAlign:"center",cursor:"pointer",background:"rgba(232,200,122,0.04)"}}>
                {uploadedImg
                  ? <img src={uploadedImg} style={{width:100,height:100,objectFit:"cover",borderRadius:8}} alt="업로드"/>
                  : <>
                    <p style={{fontSize:24,margin:"0 0 6px"}}>📷</p>
                    <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>사진을 업로드하면 더 정확하게 분석해요</p>
                  </>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImg}/>
            </div>
          )}
          {/* 선택지 */}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {q.opts.map(opt=>{
              const isSelected = sel.includes(opt);
              return (
                <button key={opt} onClick={()=>{
                  if(q.multi) setSel(p=>p.includes(opt)?p.filter(x=>x!==opt):[...p,opt]);
                  else setSel([opt]);
                }} style={{padding:"13px 16px",background:isSelected?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.04)",border:isSelected?"1px solid rgba(232,200,122,0.5)":"1px solid rgba(255,255,255,0.08)",borderRadius:12,fontSize:13,color:isSelected?G:"rgba(255,255,255,0.7)",cursor:"pointer",fontFamily:"inherit",textAlign:"left",fontWeight:isSelected?700:400,transition:"0.2s"}}>
                  {opt}
                </button>
              );
            })}
          </div>
          <GBtn onClick={()=>{
            if(qIdx<QUESTIONS.length-1){ setQIdx(q=>q+1); setSel([]); }
            else setStep("loading");
          }} dim={!q.skippable&&sel.length===0}>
            {qIdx<QUESTIONS.length-1?"다음 →":"분석 시작 🔮"}
          </GBtn>
          {q.skippable&&<button onClick={()=>setStep("loading")} style={{width:"100%",marginTop:8,padding:"12px",background:"transparent",border:"none",fontSize:12,color:"rgba(255,255,255,0.35)",cursor:"pointer",fontFamily:"inherit"}}>건너뛰기</button>}
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ── 로딩 ──
  if(step==="loading") return (
    <div style={{minHeight:"100vh",background:"#0a1a0f",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",padding:"40px 20px"}}>
        <div style={{fontSize:64,marginBottom:20,animation:"spin 3s linear infinite"}}>👁️</div>
        <p style={{fontSize:15,fontWeight:700,color:G,margin:"0 0 8px"}}>관상 분석 중...</p>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:0}}>{LOADING_MSGS[loadMsg]}</p>
      </div>
      <style>{`@keyframes spin{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}`}</style>
    </div>
  );

  // ── 결과 ──
  return (
    <div style={{minHeight:"100vh",background:"#0a1a0f",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 관상 분석 완료</p>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>👁️ {DEMO_NAME}님의 관상</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>AI 관상 분석 결과 · 380원</p>
      </div>

      <div style={{padding:"16px 14px"}}>
        {/* 총점 카드 */}
        <div style={{background:"#fff",borderRadius:20,overflow:"hidden",marginBottom:12,boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
          <div style={{background:"linear-gradient(135deg,#0D2318,#1a3020)",padding:"24px 20px",textAlign:"center"}}>
            <FaceSilhouette/>
            <div style={{marginTop:14}}>
              <span style={{fontSize:11,padding:"3px 12px",borderRadius:20,background:"rgba(232,200,122,0.15)",color:G,border:"1px solid rgba(232,200,122,0.3)",fontWeight:700}}>{R.face_type}</span>
            </div>
          </div>
          <div style={{padding:"18px 20px"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 8px"}}>✦ 종합 관상 점수</p>
            <ScoreBar score={R.overall_score}/>
            <p style={{fontSize:13,color:"#333",lineHeight:1.85,margin:"10px 0 0",wordBreak:"keep-all"}}>{R.face_type_desc}</p>
          </div>
        </div>

        {/* 총운 한줄 */}
        <div style={{background:DG,borderRadius:14,padding:"14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 8px"}}>✦ 한줄 총운</p>
          <p style={{fontSize:14,fontWeight:600,color:"#F0EAD6",lineHeight:1.75,margin:"0 0 8px"}}>{R.overview}</p>
          <p style={{fontSize:12,color:G,margin:0}}>{R.fortune}</p>
        </div>

        {/* 12궁 분석 */}
        <Section title="🏛️ 얼굴 12궁 분석">
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 12px"}}>얼굴을 12개 구역으로 나눠 각 영역의 운을 분석해요. 궁을 탭하면 상세 해석이 펼쳐져요.</p>
          {R.gung_12.map((g,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <button onClick={()=>setOpenGung(openGung===i?null:i)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:"rgba(232,200,122,0.04)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:10,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:12,background:g.luck==="길"?"rgba(46,125,50,0.12)":"rgba(255,152,0,0.12)",color:g.luck==="길"?"#2E7D32":"#E65100",fontWeight:700,flexShrink:0}}>{g.luck}</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:12,fontWeight:700,color:"#111",margin:0}}>{g.name}</p>
                    <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:0}}>{g.area}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:50,height:4,background:"#f0ede6",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:g.score+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/>
                    </div>
                    <span style={{fontSize:10,color:"#7A5C00",fontWeight:700,flexShrink:0}}>{g.score}</span>
                  </div>
                </div>
                <span style={{fontSize:12,color:"rgba(0,0,0,0.3)",marginLeft:8,transform:openGung===i?"rotate(180deg)":"none",transition:"0.2s"}}>▾</span>
              </button>
              {openGung===i&&(
                <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.6)",borderRadius:"0 0 10px 10px",borderLeft:"3px solid rgba(232,200,122,0.4)"}}>
                  <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:"0 0 8px"}}>{g.reading}</p>
                  {g.caution&&<p style={{fontSize:11,color:"#B85C00",lineHeight:1.65,margin:0,padding:"8px 10px",background:"rgba(255,152,0,0.06)",borderRadius:8}}>⚠️ {g.caution}</p>}
                </div>
              )}
            </div>
          ))}
        </Section>

        {/* 이목구비 형태 */}
        <Section title="👁️ 이목구비 형태 분석">
          {R.features.map((f,i)=>(
            <div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<R.features.length-1?"1px solid rgba(0,0,0,0.06)":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{f.part}</p>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:12,background:"rgba(232,200,122,0.1)",color:"#7A5C00",border:"1px solid rgba(232,200,122,0.2)",fontWeight:600}}>{f.shape}</span>
              </div>
              <ScoreBar score={f.score}/>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:"6px 0 4px"}}>{f.meaning}</p>
              <p style={{fontSize:11,color:"#2E7D32",fontWeight:600,margin:0}}>💫 {f.fortune}</p>
            </div>
          ))}
        </Section>

        {/* 나이별 집중 부위 */}
        <Section title="📅 나이별 집중 관상 부위">
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 12px"}}>관상은 나이에 따라 운을 주관하는 부위가 달라져요. 지금 내 나이 구간을 주목하세요!</p>
          {R.age_reading.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:12,padding:"10px 12px",background:i===2?"rgba(232,200,122,0.08)":"rgba(0,0,0,0.02)",borderRadius:10,border:i===2?"1px solid rgba(232,200,122,0.25)":"1px solid transparent"}}>
              <div style={{flexShrink:0,textAlign:"center"}}>
                <p style={{fontSize:12,fontWeight:700,color:i===2?G:"rgba(0,0,0,0.5)",margin:0}}>{a.age}</p>
                {i===2&&<span style={{fontSize:8,color:G}}>▲ 지금</span>}
              </div>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 2px"}}>{a.part}</p>
                <p style={{fontSize:11,color:"#333",lineHeight:1.65,margin:0}}>{a.reading}</p>
              </div>
            </div>
          ))}
        </Section>

        {/* 성격 총평 */}
        <Section title="☯️ 관상 총평">
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 10px",wordBreak:"keep-all"}}>{R.personality}</p>
          <div style={{background:"rgba(232,200,122,0.06)",borderRadius:10,padding:"12px 14px"}}>
            <p style={{fontSize:11,color:"#7A5C00",fontWeight:700,margin:"0 0 4px"}}>🌟 인생 황금기</p>
            <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{R.fortune}</p>
          </div>
        </Section>

        {/* 개운법 */}
        <Section title="✨ 얼굴 관상 개운법">
          {R.gaeun.map((g,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<R.gaeun.length-1?10:0}}>
              <span style={{fontSize:16,flexShrink:0}}>✦</span>
              <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{g}</p>
            </div>
          ))}
        </Section>

        {/* 버튼 */}
        <GBtn onClick={()=>setStep("info")}>다시 분석하기</GBtn>
        <div style={{marginTop:8}}>
          <button onClick={()=>setStep("info")} style={{width:"100%",padding:"13px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 처음으로</button>
        </div>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
