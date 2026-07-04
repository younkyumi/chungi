import { useState, useEffect, useRef } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

const TAEMONG_DB = [
  // ── 동물 태몽 ──
  { keywords:["호랑이","범","백호","흰호랑이"],
    title:"호랑이 태몽", gender:"아들", prob:75,
    trait:"강인함·리더십·개척정신",
    careers:["정치가","군인","검사","CEO","운동선수"],
    result:"호랑이 태몽은 강하고 리더십 있는 큰 인물이 될 아이를 상징해요.",
    detail:"호랑이는 예로부터 강인함과 권위의 상징이에요. 이 태몽을 꾼 아이는 타고난 리더십과 불굴의 의지를 가져요. 어떤 분야든 최고를 향해 나아가는 개척자 기질이 있어요. 특히 흰 호랑이(백호)는 국가적 인물이 될 최고 귀격 태몽이에요.",
    name_tip:"강함과 용기를 담은 이름이 잘 어울려요. 勇(용기 용), 剛(굳셀 강), 豪(호걸 호) 같은 글자가 좋아요." },

  { keywords:["용","황룡","청룡","흑룡","용이","용을"],
    title:"용 태몽", gender:"아들", prob:80,
    trait:"권세·성공·큰 인물",
    careers:["정치가","대기업임원","판사","외교관","의사"],
    result:"용 태몽은 크게 성공하고 이름을 떨칠 최고의 길몽이에요.",
    detail:"용은 동양 최강의 길상 상징이에요. 용 태몽 아이는 어릴 때부터 범상치 않은 재능을 보이고, 사회적으로 인정받는 리더가 될 운명이에요. 여의주를 가진 용이면 최고의 태몽이에요.",
    name_tip:"권세와 성취를 담은 이름이 좋아요. 龍(용 룡), 昇(오를 승), 俊(준걸 준) 같은 한자를 활용해보세요." },

  { keywords:["뱀","구렁이","백사","흰뱀"],
    title:"뱀·구렁이 태몽", gender:"딸", prob:72,
    trait:"지혜·재능·신비로움",
    careers:["의사","역술가","연구원","작가","심리상담사"],
    result:"뱀 태몽은 지혜롭고 재능 넘치는 아이를 상징해요.",
    detail:"뱀은 지혜와 재물의 상징이에요. 특히 흰 뱀(백사)은 고귀한 귀인이 될 최고의 길몽이에요. 뱀 태몽 아이는 직관력과 분석력이 뛰어나고 어떤 분야든 전문가가 되는 경우가 많아요.",
    name_tip:"지혜와 신비로움을 담은 이름이 어울려요. 智(지혜 지), 玄(검을 현), 靈(신령 령) 같은 한자가 좋아요." },

  { keywords:["돼지","멧돼지","황금돼지","흑돼지"],
    title:"돼지 태몽", gender:"아들", prob:70,
    trait:"재물복·건강·명랑함",
    careers:["사업가","금융인","부동산업자","요식업자","유통업자"],
    result:"돼지 태몽은 재물복이 넘치고 건강한 아이를 상징해요.",
    detail:"돼지는 풍요와 재물의 최고 상징이에요. 특히 검은 돼지는 큰 권력형 재물, 황금 돼지는 일생 최대의 재복을 타고남을 의미해요. 재물운이 뛰어나고 경제적으로 성공할 가능성이 높아요.",
    name_tip:"건강함과 풍요를 담은 이름이 좋아요. 健(건강할 건), 富(부유할 부), 壽(장수할 수) 같은 한자를 활용해보세요." },

  { keywords:["독수리","eagle","매","솔개","봉황"],
    title:"독수리·봉황 태몽", gender:"아들", prob:77,
    trait:"원대한 포부·명예·자유",
    careers:["파일럿","항공우주","연예인","스포츠선수","탐험가"],
    result:"독수리·봉황 태몽은 세상을 호령할 큰 인물의 태몽이에요.",
    detail:"독수리는 하늘의 제왕, 봉황은 길조 중의 길조예요. 이 태몽을 꾼 아이는 원대한 포부와 빠른 판단력을 타고나요. 어떤 분야든 정상을 목표로 매진하는 성향이에요.",
    name_tip:"높은 뜻과 자유를 담은 이름이 어울려요. 鵬(대붕 붕), 翔(날 상), 雄(수컷 웅) 같은 한자를 활용해보세요." },

  { keywords:["말","백마","흑마","준마"],
    title:"말 태몽", gender:"아들", prob:68,
    trait:"활동력·도전·역마살",
    careers:["스포츠선수","연예인","외교관","여행가","영업직"],
    result:"말 태몽은 활동적이고 도전적인 아이를 상징해요.",
    detail:"말은 속도와 활동력의 상징이에요. 말 태몽 아이는 매우 활동적이고 새로운 도전을 즐겨요. 역마살이 있어 세계를 무대로 활약할 가능성이 높아요. 특히 백마는 순수함과 고귀함을 더해요.",
    name_tip:"활력과 도전을 담은 이름이 좋아요. 馳(달릴 치), 駿(준마 준), 翼(날개 익) 같은 한자를 활용해보세요." },

  { keywords:["곰","북극곰","불곰"],
    title:"곰 태몽", gender:"아들", prob:65,
    trait:"우직함·포용력·재물복",
    careers:["기업인","정치가","군인","스포츠선수","건설업자"],
    result:"곰 태몽은 우직하고 믿음직한 큰 인물이 될 아이를 상징해요.",
    detail:"곰은 재물복이 많고 듬직한 성품의 아이를 상징해요. 곰 태몽 아이는 한번 마음먹으면 끝까지 밀고 나가는 강인한 추진력을 가져요.",
    name_tip:"우직함과 포용력을 담은 이름이 어울려요. 大(클 대), 容(담을 용), 泰(클 태) 같은 한자가 좋아요." },

  { keywords:["물고기","잉어","금붕어","황금잉어","물고기를"],
    title:"잉어·물고기 태몽", gender:"딸", prob:70,
    trait:"다재다능·예술성·재물복",
    careers:["예술가","요리사","수산업","수영선수","음악가"],
    result:"잉어 태몽은 재주 많고 복 있는 아이를 상징해요.",
    detail:"잉어는 출세와 재물의 상징이에요. 황금 잉어는 가업 번창과 최고의 효자·효녀 태몽이에요. 물고기 태몽 아이는 재주가 많고 적응력이 뛰어나요.",
    name_tip:"풍요와 재능을 담은 이름이 좋아요. 泳(헤엄칠 영), 淸(맑을 청), 海(바다 해) 같은 한자를 활용해보세요." },

  { keywords:["새","파랑새","흰새","학","두루미","앵무"],
    title:"새·학 태몽", gender:"딸", prob:73,
    trait:"자유로움·예술적 재능·명예",
    careers:["예술가","교육자","성악가","무용가","항공승무원"],
    result:"새·학 태몽은 예술적 감각과 자유로운 영혼의 아이를 상징해요.",
    detail:"새는 자유와 예술의 상징이에요. 학은 장수와 고결함을 뜻해요. 이 태몽 아이는 창의적이고 자유로운 환경에서 빛을 발하는 예술적 기질이 있어요.",
    name_tip:"자유와 우아함을 담은 이름이 어울려요. 鶴(학 학), 羽(깃 우), 雅(우아할 아) 같은 한자가 좋아요." },

  { keywords:["거북","자라","거북이"],
    title:"거북 태몽", gender:"중립", prob:68,
    trait:"장수·지혜·끈기",
    careers:["학자","법조인","의사","역사가","교육자"],
    result:"거북 태몽은 장수하고 지혜로운 아이를 상징해요.",
    detail:"거북은 장수와 지혜의 상징이에요. 거북 태몽 아이는 느리지만 확실하고 깊은 지혜를 타고나요. 한번 시작한 일은 반드시 완성하는 끈기가 있어요.",
    name_tip:"지혜와 장수를 담은 이름이 좋아요. 壽(장수할 수), 智(지혜 지), 賢(어질 현) 같은 한자를 활용해보세요." },

  { keywords:["소","황소","흑소"],
    title:"소 태몽", gender:"중립", prob:65,
    trait:"성실·우직·자수성가",
    careers:["농업인","건설업자","의사","교사","공무원"],
    result:"소 태몽은 성실하고 믿음직한 자수성가형 아이를 상징해요.",
    detail:"소는 성실함과 풍요의 상징이에요. 소 태몽 아이는 느리지만 꾸준하게 목표를 달성하는 대기만성형이에요. 인내심이 강하고 남들이 포기하는 일도 끝까지 해내는 근성을 가져요.",
    name_tip:"성실함과 우직함을 담은 이름이 어울려요. 勤(부지런할 근), 耕(밭갈 경), 牧(칠 목) 같은 한자가 좋아요." },

  { keywords:["원숭이","반달가슴곰"],
    title:"원숭이 태몽", gender:"중립", prob:63,
    trait:"재치·영민함·다재다능",
    careers:["IT개발자","예능인","마케터","발명가","연구원"],
    result:"원숭이 태몽은 재치 있고 영민한 아이를 상징해요.",
    detail:"원숭이는 재치와 영민함의 상징이에요. 원숭이 태몽 아이는 다재다능하고 상황 판단이 빠른 임기응변 능력을 타고나요. 특히 IT·창의적 분야에서 두각을 나타낼 가능성이 높아요.",
    name_tip:"재치와 지혜를 담은 이름이 좋아요. 機(기틀 기), 敏(민첩할 민), 才(재주 재) 같은 한자를 활용해보세요." },

  // ── 식물 태몽 ──
  { keywords:["꽃","꽃밭","장미","벚꽃","꽃이","꽃을"],
    title:"꽃 태몽", gender:"딸", prob:78,
    trait:"아름다움·예술성·감수성",
    careers:["예술가","디자이너","패션","뷰티","음악가"],
    result:"꽃 태몽은 아름답고 예술적 재능이 풍부한 아이를 상징해요.",
    detail:"꽃은 아름다움과 예술적 감수성의 상징이에요. 이 태몽 아이는 미적 감각이 뛰어나고 예술·음악·문학 방면에서 특별한 재능을 보일 가능성이 높아요.",
    name_tip:"아름다움과 우아함을 담은 이름이 어울려요. 花(꽃 화), 美(아름다울 미), 雅(우아할 아) 같은 한자를 활용해보세요." },

  { keywords:["복숭아","사과","과일","배","포도","감","석류"],
    title:"과일 태몽", gender:"중립", prob:65,
    trait:"풍요·다복·사교성",
    careers:["사업가","요리사","농업인","유통업자","의사"],
    result:"과일 태몽은 풍요롭고 복이 많은 아이를 상징해요.",
    detail:"과일 태몽은 풍요와 다복의 상징이에요. 복숭아=장수와 복, 석류=자손 번창, 사과=건강과 평화를 의미해요. 재물복과 인복이 풍부한 아이예요.",
    name_tip:"풍요와 복을 담은 이름이 어울려요. 福(복 복), 豊(풍성할 풍), 實(열매 실) 같은 한자를 고려해보세요." },

  { keywords:["소나무","대나무","나무","고목"],
    title:"소나무·대나무 태몽", gender:"아들", prob:70,
    trait:"절개·강직·장수",
    careers:["군인","법조인","교육자","공무원","의사"],
    result:"소나무·대나무 태몽은 절개 있고 강직한 아이를 상징해요.",
    detail:"소나무와 대나무는 절개와 장수의 상징이에요. 이 태몽 아이는 원칙을 지키고 어떤 시련에도 굴하지 않는 강직한 성품을 타고나요. 신뢰받는 인물이 될 가능성이 높아요.",
    name_tip:"절개와 강직함을 담은 이름이 좋아요. 松(소나무 송), 竹(대나무 죽), 柏(잣나무 백) 같은 한자를 활용해보세요." },

  { keywords:["연꽃","연","연못","수련"],
    title:"연꽃 태몽", gender:"딸", prob:76,
    trait:"청아함·종교성·학문",
    careers:["종교인","학자","의사","상담사","예술가"],
    result:"연꽃 태몽은 청아하고 학문에 뛰어난 아이를 상징해요.",
    detail:"연꽃은 청아함과 고결함의 상징이에요. 진흙 속에서 피어나는 연꽃처럼 어떤 환경에서도 자신의 품격을 지키는 고결한 성품을 타고나요. 학문과 종교적 감수성이 뛰어나요.",
    name_tip:"청아함과 고결함을 담은 이름이 어울려요. 蓮(연꽃 련), 淸(맑을 청), 潔(깨끗할 결) 같은 한자가 좋아요." },

  // ── 자연현상 태몽 ──
  { keywords:["태양","해","햇빛","햇살"],
    title:"태양 태몽", gender:"아들", prob:72,
    trait:"빛·긍정·에너지·카리스마",
    careers:["방송인","정치가","연예인","CEO","교육자"],
    result:"태양 태몽은 밝고 카리스마 넘치는 큰 인물의 태몽이에요.",
    detail:"태양은 빛과 생명의 최고 상징이에요. 태양 태몽 아이는 어디서든 주목받는 존재감을 타고나요. 리더십이 강하고 주변에 활력을 주는 카리스마가 있어요.",
    name_tip:"밝음과 빛을 담은 이름이 어울려요. 日(해 일), 陽(볕 양), 明(밝을 명) 같은 한자를 활용해보세요." },

  { keywords:["달","보름달","달빛","달을"],
    title:"달 태몽", gender:"딸", prob:74,
    trait:"감성·지혜·예술성",
    careers:["예술가","작가","음악가","상담사","교육자"],
    result:"달 태몽은 감성이 풍부하고 지혜로운 아이를 상징해요.",
    detail:"달은 감성과 지혜의 상징이에요. 달 태몽 아이는 섬세한 감수성과 깊은 지혜를 타고나요. 예술적 감각이 뛰어나고 공감 능력이 높아요.",
    name_tip:"감성과 지혜를 담은 이름이 좋아요. 月(달 월), 慧(슬기로울 혜), 晨(새벽 신) 같은 한자를 활용해보세요." },

  { keywords:["별","별똥별","유성","샛별"],
    title:"별·별똥별 태몽", gender:"딸", prob:71,
    trait:"특별한 재능·예술성·직관력",
    careers:["예술가","연예인","과학자","우주항공","작가"],
    result:"별 태몽은 특별한 재능과 감수성을 타고난 아이를 상징해요.",
    detail:"별은 특별함과 재능의 상징이에요. 별 태몽 아이는 남다른 직관력과 예술적 감수성을 타고나요. 특정 분야에서 독보적인 존재가 될 가능성이 높아요.",
    name_tip:"특별함과 빛남을 담은 이름이 어울려요. 星(별 성), 燦(빛날 찬), 彗(별 혜) 같은 한자가 좋아요." },

  { keywords:["구름","흰구름","무지개"],
    title:"구름·무지개 태몽", gender:"딸", prob:68,
    trait:"자유로움·창의성·희망",
    careers:["예술가","디자이너","여행가","작가","방송인"],
    result:"구름·무지개 태몽은 자유롭고 창의적인 아이를 상징해요.",
    detail:"구름과 무지개는 자유와 창의성의 상징이에요. 특히 무지개 태몽은 행운과 기적을 상징하는 최고의 길몽이에요. 이 태몽 아이는 틀에 얽매이지 않는 창의적인 발상을 가져요.",
    name_tip:"자유와 창의를 담은 이름이 좋아요. 彩(채색할 채), 虹(무지개 홍), 雲(구름 운) 같은 한자를 활용해보세요." },

  { keywords:["산","높은산","명산","백두산","한라산"],
    title:"산 태몽", gender:"아들", prob:69,
    trait:"포용력·리더십·큰 그릇",
    careers:["정치가","경영자","학자","군인","종교인"],
    result:"산 태몽은 넓은 포용력과 큰 그릇의 인물이 될 아이를 상징해요.",
    detail:"산은 포용력과 리더십의 상징이에요. 산 태몽 아이는 흔들리지 않는 안정감과 넓은 포용력을 타고나요. 많은 사람들의 의지가 되는 큰 그릇의 인물이 될 가능성이 높아요.",
    name_tip:"큰 뜻과 안정감을 담은 이름이 어울려요. 岳(큰산 악), 峻(높을 준), 泰(클 태) 같은 한자가 좋아요." },

  { keywords:["바다","대양","파도","바닷가"],
    title:"바다 태몽", gender:"중립", prob:67,
    trait:"스케일·포용·글로벌",
    careers:["무역업자","외교관","해양관련","사업가","탐험가"],
    result:"바다 태몽은 스케일이 크고 세계를 무대로 활약할 아이를 상징해요.",
    detail:"바다는 무한한 가능성과 스케일의 상징이에요. 바다 태몽 아이는 틀에 갇히지 않는 넓은 사고와 글로벌한 시야를 타고나요. 세계를 무대로 큰 일을 이룰 가능성이 높아요.",
    name_tip:"큰 스케일과 포용을 담은 이름이 좋아요. 海(바다 해), 洋(큰바다 양), 深(깊을 심) 같은 한자를 활용해보세요." },

  { keywords:["금","황금","금덩이","금반지","보석","다이아"],
    title:"황금·보석 태몽", gender:"중립", prob:76,
    trait:"재물복·귀한 신분·명예",
    careers:["금융인","사업가","보석상","경영자","연예인"],
    result:"황금·보석 태몽은 타고난 재물복과 귀한 신분의 아이를 상징해요.",
    detail:"황금과 보석은 재물과 귀함의 최고 상징이에요. 이 태몽 아이는 풍요로운 환경과 타고난 재물복을 가지고 태어나요. 귀하게 자라고 사회적으로 높은 위치에 오를 가능성이 높아요.",
    name_tip:"귀함과 빛남을 담은 이름이 어울려요. 金(쇠 금), 玉(구슬 옥), 貴(귀할 귀) 같은 한자가 좋아요." },
];

const LOADING_MSGS = [
  "태몽 기운을 분석하는 중... 🌟",
  "아이의 사주 기운을 읽는 중... 🔮",
  "전생 인연을 확인하는 중... ✨",
  "아이의 재능을 탐색하는 중... 💫",
  "하늘의 뜻을 살피는 중... 🌙",
];

const QUICK_KEYWORDS = ["호랑이","용","꽃","복숭아","돼지","태양","달","구렁이","사과","벚꽃"];

export default function TaemongInterp() {
  const [step,       setStep]       = useState("intro");  // intro | input | loading | result
  const [dream,      setDream]      = useState("");
  const [result,     setResult]     = useState(null);
  const [loadPct,    setLoadPct]    = useState(0);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const ivRef = useRef(null);

  useEffect(() => {
    if (step !== "loading") return;
    setLoadPct(0); setLoadMsgIdx(0);
    let pct = 0;
    ivRef.current = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 5 + 2);
      setLoadPct(Math.floor(pct));
      if (Math.random() > 0.88) setLoadMsgIdx(i => (i + 1) % LOADING_MSGS.length);
      if (pct >= 100) {
        clearInterval(ivRef.current);
        setTimeout(() => {
          const lower = dream.toLowerCase();
          const found = TAEMONG_DB.find(d => d.keywords.some(k => lower.includes(k)));
          setResult(found || {
            title:"특별한 태몽",
            gender:"미정",
            prob:50,
            trait:"독특한 기질·개성·창의성",
            result:"특별하고 개성 넘치는 아이가 찾아올 것 같아요.",
            detail:"입력하신 태몽의 상징을 분석했어요. 뚜렷한 상징이 있다면 더 자세한 분석이 가능해요. 이 아이는 틀에 얽매이지 않는 창의적인 기질을 가질 것으로 보여요.",
            name_tip:"개성과 창의성을 담은 이름이 어울릴 것 같아요.",
          });
          setStep("result");
        }, 500);
      }
    }, 180);
    return () => clearInterval(ivRef.current);
  }, [step]);

  function reset() {
    setStep("intro");
    setDream("");
    setResult(null);
    setLoadPct(0);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>👶 태몽해몽</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>태몽의 의미를 AI가 분석해드려요 · 380원</p>
      </div>

      {/* ── 인트로 ── */}
      {step === "intro" && (
        <div style={{padding:"20px 16px"}}>
          <div style={{background:DG,borderRadius:16,padding:"18px",marginBottom:12}}>
            <p style={{fontSize:15,fontWeight:700,color:G,margin:"0 0 14px"}}>🌟 태몽이란?</p>
            {[
              {icon:"🤰", t:"임신 중 또는 임신 직전에 꾸는 특별한 꿈이에요"},
              {icon:"👶", t:"아이의 기질, 재능, 성별을 암시한다고 믿어져요"},
              {icon:"🔮", t:"꿈의 상징을 분석해 아이의 운명을 엿볼 수 있어요"},
              {icon:"📖", t:"이름 지을 때 태몽의 의미를 참고하면 좋아요"},
            ].map(({icon,t})=>(
              <div key={t} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.7}}>{t}</p>
              </div>
            ))}
          </div>

          {/* 가격 */}
          <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:14,padding:"18px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 6px"}}>AI 태몽 분석</p>
            <p style={{fontSize:30,fontWeight:700,color:G,margin:"0 0 4px"}}>380원</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"0 0 12px",lineHeight:1.6}}>
              태몽 상세 분석 + 아이 기질 예측<br/>성별 예측 + 이름 방향 제안
            </p>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>
              {["💳 카드결제","🟡 카카오페이","💵 토스페이"].map(p=>(
                <span key={p} style={{fontSize:10,padding:"3px 8px",borderRadius:12,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.08)"}}>{p}</span>
              ))}
            </div>
          </div>

          <button onClick={()=>setStep("input")} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
            태몽 분석 시작하기 →
          </button>
        </div>
      )}

      {/* ── 입력 ── */}
      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 16px"}}>
            태몽 내용을 자세히 적어주세요.<br/>
            <span style={{color:G}}>어떤 것이 나왔나요?</span>
          </p>

          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>자주 나오는 태몽 키워드</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {QUICK_KEYWORDS.map(k=>(
              <button key={k} onClick={()=>setDream(d=>d?`${d} ${k}`:k)} style={{padding:"6px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:12,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit"}}>
                {k}
              </button>
            ))}
          </div>

          <textarea
            value={dream}
            onChange={e=>setDream(e.target.value)}
            placeholder="태몽 내용을 입력하세요&#10;예) 커다란 호랑이가 품 안으로 들어왔어요&#10;예) 황금빛 용이 하늘에서 내려왔어요"
            style={{width:"100%",minHeight:110,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${dream?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.7,marginBottom:14}}
          />

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={()=>{if(dream.trim())setStep("loading");}} style={{width:"100%",padding:"16px",border:"none",borderRadius:13,cursor:dream.trim()?"pointer":"default",fontSize:15,fontWeight:700,fontFamily:"inherit",background:dream.trim()?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",color:dream.trim()?"#0D0D14":"rgba(255,255,255,0.3)"}}>
              태몽 분석하기 (380원) →
            </button>
            <button onClick={()=>setStep("intro")} style={{width:"100%",padding:"13px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
              ← 이전으로
            </button>
          </div>
        </div>
      )}

      {/* ── 로딩 ── */}
      {step === "loading" && (
        <div style={{padding:"40px 16px",textAlign:"center"}}>
          <div style={{fontSize:54,marginBottom:14}}>👶</div>
          <p style={{fontSize:15,fontWeight:700,color:G,margin:"0 0 18px"}}>태몽 분석 중...</p>
          <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",width:`${loadPct}%`,background:`linear-gradient(90deg,${G},#C4922A)`,borderRadius:99,transition:"width 0.18s linear"}}/>
          </div>
          <p style={{fontSize:13,color:G,fontWeight:700,margin:"0 0 12px"}}>{loadPct}%</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:22}}>{LOADING_MSGS[loadMsgIdx]}</p>
        </div>
      )}

      {/* ── 결과 ── */}
      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <p style={{fontSize:36,margin:"0 0 4px"}}>✨</p>
            <p style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>태몽 분석 완료!</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>"{dream.slice(0,20)}{dream.length>20?"...":""}"</p>
          </div>

          {/* 성별 예측 */}
          <div style={{
            background: result.gender==="아들"?"rgba(100,150,255,0.1)":result.gender==="딸"?"rgba(255,150,180,0.1)":"rgba(232,200,122,0.08)",
            border:`1px solid ${result.gender==="아들"?"rgba(100,150,255,0.3)":result.gender==="딸"?"rgba(255,150,180,0.3)":"rgba(232,200,122,0.2)"}`,
            borderRadius:14,padding:"18px",marginBottom:12,textAlign:"center"
          }}>
            <p style={{fontSize:32,margin:"0 0 6px"}}>{result.gender==="아들"?"👦":result.gender==="딸"?"👧":"🌟"}</p>
            <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>
              {result.gender==="미정"?"성별 예측 불확실":`${result.gender} 예측`}
            </p>
            {result.prob && result.gender !== "미정" && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,margin:"8px 0"}}>
                <div style={{height:6,width:120,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${result.prob}%`,background:result.gender==="아들"?"rgba(100,150,255,0.7)":"rgba(255,150,180,0.7)",borderRadius:99}}/>
                </div>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>예측 확률 {result.prob}%</span>
              </div>
            )}
            <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:0}}>참고용 · 실제와 다를 수 있어요</p>
          </div>

          {/* 태몽 해석 */}
          <div style={{background:DG,borderRadius:14,padding:"15px",marginBottom:10}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 태몽 해석</p>
            <p style={{fontSize:14,fontWeight:600,color:"#F0EAD6",lineHeight:1.7,margin:"0 0 10px"}}>{result.result}</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.85,margin:0}}>{result.detail}</p>
          </div>

          {/* 아이 기질 */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px",marginBottom:10}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 아이의 기질 예측</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {result.trait.split("·").map(t=>(
                <span key={t} style={{fontSize:12,padding:"4px 12px",borderRadius:20,background:"rgba(232,200,122,0.1)",color:G,border:"1px solid rgba(232,200,122,0.25)",fontWeight:600}}>
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* 직업군 매핑 */}
          {result.careers && (
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px",marginBottom:10}}>
              <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 10px"}}>💼 이 태몽 아이가 잘 맞는 직업군</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {result.careers.map((c,i)=>(
                  <span key={i} style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:"rgba(95,196,158,0.1)",color:"#5FC49E",border:"1px solid rgba(95,196,158,0.25)",fontWeight:600}}>
                    {c}
                  </span>
                ))}
              </div>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:"8px 0 0",lineHeight:1.6}}>* 타고난 기질이 잘 발현될 때의 예시 직업군이에요</p>
            </div>
          )}

          {/* 이름 방향 */}
          <div style={{background:DG,borderRadius:14,padding:"14px",marginBottom:12}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 이름 방향 제안</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.85,margin:"0 0 10px"}}>{result.name_tip}</p>
            <div style={{background:"linear-gradient(135deg,#2a1a3a,#1a1030)",border:"1px solid rgba(150,80,220,0.3)",borderRadius:12,padding:"12px",textAlign:"center"}}>
              <p style={{fontSize:12,color:"rgba(200,150,255,0.8)",margin:"0 0 8px"}}>더 정확한 이름이 필요하다면?</p>
              <button style={{padding:"9px 20px",background:"linear-gradient(135deg,#9B59B6,#6C3483)",border:"none",borderRadius:20,fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>
                👶 아기 이름 짓기 (1,980원)
              </button>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={reset} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
              다시 분석하기
            </button>
            <button onClick={reset} style={{width:"100%",padding:"13px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
              ← 처음으로
            </button>
          </div>
        </div>
      )}

      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
