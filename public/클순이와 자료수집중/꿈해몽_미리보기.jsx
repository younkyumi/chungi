import { useState } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

const DREAM_DB = [
  // ── 동물 꿈 ──
  { keywords:["뱀","구렁이","백사","흰뱀"], title:"뱀 꿈", good:true,
    short:"뱀 꿈은 재물과 지혜를 상징하는 길몽이에요.",
    traditional:"뱀은 재물·지혜·인연의 상징이에요. 큰 뱀일수록 큰 재물운, 나를 감싸면 재물 유입, 잡으면 기회 획득이에요. 흰 뱀(백사)은 고귀한 귀인·맑은 재물·학문적 성취를 뜻해요.",
    modern:"성적인 욕구나 창의적 에너지의 상징. 변화와 재생에 대한 무의식적 욕망이에요.",
    detail:"뱀은 동양 사상에서 재물과 지혜의 상징이에요. 큰 뱀일수록 큰 재물운을 의미해요. 뱀이 나를 감쌌다면 재물이 들어오는 신호, 뱀을 잡았다면 기회를 잡게 될 것을 의미해요. 단, 뱀에 물리는 꿈은 재물운 상승(길몽)으로도 봐요.",
    advice:"재물 관련 결정을 앞두고 있다면 오늘이 적기일 수 있어요." },

  { keywords:["돼지","멧돼지","황금돼지","흑돼지"], title:"돼지 꿈", good:true,
    short:"돼지 꿈은 대표적인 재물 길몽이에요!",
    traditional:"돼지는 재복·풍요·우직함의 상징이에요. 집에 들어오면 재물 유입, 잡거나 안으면 횡재, 검은 돼지는 큰 권력형 재물, 황금 돼지는 일생 최대의 기회를 뜻해요.",
    modern:"물질적 풍요에 대한 갈망이나 보상에 대한 확신이에요.",
    detail:"돼지는 풍요와 재물의 상징이에요. 돼지가 집에 들어오는 꿈은 가정에 재물이 들어오는 것을 의미하고, 돼지를 잡거나 안는 꿈은 큰 횡재를 의미해요.",
    advice:"복권 구매나 재테크에 관심을 가져보기 좋은 날이에요." },

  { keywords:["용","황룡","청룡","흑룡","용이","용을"], title:"용 꿈", good:true,
    short:"용 꿈은 승진, 성공, 큰 행운을 상징하는 최고의 길몽이에요.",
    traditional:"용은 권력·명예·대업의 상징이에요. 하늘로 승천하면 최고 권력·명예·대업 달성, 여의주를 얻으면 횡재·태몽, 나를 공격하면 오히려 큰 행운이에요.",
    modern:"초자아의 발현, 잠재력 폭발, 강력한 보호본능이에요.",
    detail:"용은 권세와 성공의 상징이에요. 하늘을 나는 용을 봤다면 원대한 꿈이 이루어질 것을 의미해요. 용을 탔다면 큰 성공이, 용이 알을 낳으면 풍요로운 결실을 의미해요.",
    advice:"오늘은 중요한 제안이나 기회에 적극적으로 나서보세요." },

  { keywords:["호랑이","범","백호"], title:"호랑이 꿈", good:true,
    short:"호랑이 꿈은 권력·명예·귀인의 상징이에요.",
    traditional:"호랑이가 집에 들어오면 권세가 당당한 아이 태몽 또는 명예직 취임, 타면 승진·합격, 산으로 도망가면 직장 상실·명예 실추예요.",
    modern:"억압적인 권위자에 대한 공포 또는 극복 욕구예요.",
    detail:"호랑이를 만나면 큰 권력자나 귀인의 도움을 받아 대성하는 꿈이에요. 호랑이와 싸워 이기면 강력한 경쟁자를 물리치는 것을 의미해요.",
    advice:"중요한 만남이나 미팅이 있다면 자신감 있게 임하세요." },

  { keywords:["개","강아지","백구","검은개"], title:"개 꿈", good:false,
    short:"개가 짖거나 무는 꿈은 배신·구설수 주의 신호예요.",
    traditional:"사납게 짖으면 믿었던 사람의 배신·구설수, 물리면 아랫사람에게 배신당하거나 금전 손실, 흰 개는 새로운 우정·충직한 조력자예요.",
    modern:"인간관계의 스트레스, 공격성에 대한 불안, 신뢰 붕괴에요.",
    detail:"개에게 물리는 꿈은 믿었던 사람에게 배신당할 수 있다는 경고예요. 반면 개가 반기며 따르는 꿈은 조력자를 얻게 됨을 의미해요.",
    advice:"가까운 사람과의 금전 거래는 잠시 보류하는 게 좋아요." },

  { keywords:["이빨","이가","치아","이빨이"], title:"이빨 빠지는 꿈", good:false,
    short:"이빨 꿈은 가까운 사람의 우환이나 스트레스의 신호예요.",
    traditional:"윗니 빠짐=윗사람(부모·상사) 우환, 아랫니=아랫사람(자녀·부하) 우환, 앞니=부모·형제, 어금니=자신 건강이에요.",
    modern:"극심한 스트레스·무기력감·능력 상실에 대한 불안이에요. 가장 흔한 스트레스 꿈이에요.",
    detail:"이빨이 빠지는 꿈은 가족이나 가까운 사람의 건강을 상징해요. 앞니=부모 또는 형제, 어금니=자신의 건강과 관련이 있어요.",
    advice:"오늘은 가족의 건강을 챙겨보는 것이 좋겠어요." },

  { keywords:["똥","대변","오줌","배변"], title:"똥·대변 꿈", good:true,
    short:"똥 꿈은 대표적인 재물 길몽이에요!",
    traditional:"밟거나 만지면 횡재수·복권 당첨·큰 재물, 변기가 넘치면 감당 못 할 정도의 큰돈과 운이 따르는 꿈이에요.",
    modern:"재정적 풍요에 대한 갈망, 억눌렸던 감정의 해소예요.",
    detail:"똥을 밟거나 만지는 꿈은 뜻밖의 횡재가 생길 수 있는 길몽이에요. 더럽다고 피하지 마세요!",
    advice:"뜻밖의 수입이나 행운이 생길 수 있어요. 오늘 활발히 움직여보세요." },

  { keywords:["뱀에 물리","뱀이 물","뱀 물었"], title:"뱀에 물리는 꿈", good:true,
    short:"뱀에 물리는 꿈은 오히려 재물운 상승의 길몽이에요!",
    traditional:"뱀에 물리는 꿈은 재물 획득·귀인 만남·태몽으로 해석해요. 치명적인 유혹이나 강력한 에너지를 흡수하는 것을 의미해요.",
    modern:"성적 호기심이나 두려움, 지혜의 흡수예요.",
    detail:"뱀에 물리는 꿈은 상처가 아닌 에너지를 받는 것으로 해석해요. 재물운이 강하게 들어오는 신호예요.",
    advice:"새로운 기회나 제안을 열린 마음으로 받아보세요." },

  // ── 자연 꿈 ──
  { keywords:["물","홍수","바다","강","비","폭포"], title:"물 꿈", good:true,
    short:"맑은 물은 재물과 건강의 길몽, 흙탕물은 정리가 필요하다는 신호예요.",
    traditional:"맑은 물=건강·재물 상승, 홍수=피할 수 없는 변화·파산 위험, 바다 파도가 덮침=압도적 시련, 폭포=에너지 방출·카타르시스예요.",
    modern:"감정의 흐름과 무의식을 상징해요. 맑으면 정화, 흁탕물이면 혼란한 심리예요.",
    detail:"물은 재물과 감정을 상징해요. 맑고 깨끗한 물을 마시면 건강운이 상승하고, 넓은 바다를 바라보는 꿈은 큰 사업 기회를 의미해요.",
    advice:"맑은 물이라면 오늘 중요한 일을 추진하기 좋아요." },

  { keywords:["불","화재","불길","불꽃","불이"], title:"불 꿈", good:true,
    short:"활활 타오르는 불꿈은 강력한 에너지와 열정의 길몽이에요.",
    traditional:"활활 타오르면 사업 번창·가업 융성, 집이 불타면 큰 부자가 됨(대길), 불을 못 끄면 통제할 수 없는 재물이 들어옴이에요.",
    modern:"열정의 분출, 억누를 수 없는 욕망, 강한 창조적 에너지예요.",
    detail:"불은 에너지와 변화를 상징해요. 활활 타오르는 불은 사업의 번창이나 강한 열정을 의미하고, 집이 불타는 꿈은 가정이 번창하고 큰 부자가 됨을 의미해요.",
    advice:"열정적으로 시작하고 싶은 일이 있다면 오늘 시작해보세요." },

  { keywords:["하늘","구름","날다","하늘을","비행"], title:"하늘 나는 꿈", good:true,
    short:"하늘을 나는 꿈은 신분 상승·자유·목표 달성의 길몽이에요.",
    traditional:"신분 상승·명예 획득·시험 합격의 신호예요.",
    modern:"억압으로부터의 자유 갈망, 현실 도피, 과도한 자신감이에요.",
    detail:"맑고 푸른 하늘은 밝은 미래와 성공을 의미해요. 하늘을 자유롭게 나는 꿈은 현재의 어려움을 이겨내고 높은 곳에 오르게 될 것을 암시해요.",
    advice:"오늘은 자신감 있게 목표를 향해 나아가세요." },

  { keywords:["비","장마","폭우"], title:"비 꿈", good:null,
    short:"가는 비는 은혜, 폭우는 고난의 신호예요.",
    traditional:"촉촉한 비=은혜·축복, 폭우=슬픔·고난, 비를 흠뻑 맞음=카타르시스·감정 해소예요.",
    modern:"카타르시스, 눈물, 감정 해소, 누군가에게 위로받고 싶음이에요.",
    detail:"비 꿈은 맥락에 따라 달라요. 기분 좋게 비를 맞았다면 감정의 정화, 폭우에 휩쓸렸다면 외부 환경의 압박을 의미해요.",
    advice:"감정을 억누르지 말고 솔직하게 표현해보세요." },

  { keywords:["눈","설경","눈이 온다"], title:"눈 꿈", good:true,
    short:"눈이 소복이 쌓이는 꿈은 평화·사업 순조로움을 뜻해요.",
    traditional:"눈이 소복=평화·사업 순조·결백 증명, 폭설=기회의 도래예요.",
    modern:"감정의 마비, 냉담함, 순수에 대한 갈망이에요.",
    detail:"하얀 눈이 내리는 꿈은 깨끗한 시작과 평화를 상징해요. 눈이 쌓이는 꿈은 재물이 조금씩 쌓이는 것을 의미하기도 해요.",
    advice:"오늘은 복잡한 생각을 내려놓고 마음을 비워보세요." },

  // ── 상황 꿈 ──
  { keywords:["죽음","죽는","사망","시체","죽었"], title:"죽음 꿈", good:true,
    short:"죽음 꿈은 새로운 시작과 변화를 의미하는 길몽이에요!",
    traditional:"내가 죽는 꿈=귀인의 도움·수명 연장·새로운 시작, 남이 죽는 꿈=재물 획득·관계 발전이에요.",
    modern:"현재 상황의 완전한 리셋을 바라는 마음, 환골탈태 욕구예요.",
    detail:"꿈에서 죽음은 실제 죽음이 아닌 '끝과 시작'을 상징해요. 내가 죽는 꿈은 현재 상황이 완전히 새롭게 변화할 것을 의미해요.",
    advice:"변화를 두려워하지 말고 새로운 시작을 준비해보세요." },

  { keywords:["피","피를","출혈","피가"], title:"피 꿈", good:true,
    short:"피가 나오는 꿈은 재물 획득과 소원 성취의 길몽이에요!",
    traditional:"피를 흘리는 꿈=재물 획득·소원 성취·생명력 상승(대길몽), 남이 피 흘리는 것=타인의 불행으로 내가 이득이에요.",
    modern:"심리적 상처, 에너지가 고갈되고 있다는 무의식의 경고예요.",
    detail:"피 꿈은 많은 분들이 무섭게 생각하지만 재물을 상징하는 대표적인 길몽이에요. 많이 흘릴수록 더 큰 재물을 의미해요.",
    advice:"예상치 못한 수입이 생길 수 있어요. 재테크에 관심을 가져보세요." },

  { keywords:["쫓기","도망","쫓겨"], title:"쫓기는 꿈", good:false,
    short:"쫓기는 꿈은 현실의 압박이나 스트레스를 나타내요.",
    traditional:"계획의 차질·구설수·실패·장애물 신호예요.",
    modern:"현실의 책임감·마감 압박·회피하고 싶은 트라우마예요.",
    detail:"쫓기는 꿈은 현재 직면한 어려움이나 도망치고 싶은 상황을 반영해요. 맞서 싸워 이기면 문제가 해결되는 신호예요.",
    advice:"피하기보다 정면 돌파를 시도해보세요. 의외로 쉽게 해결될 수 있어요." },

  { keywords:["떨어지다","추락","낙하","떨어졌"], title:"추락하는 꿈", good:false,
    short:"추락하는 꿈은 불안감이나 통제력 상실의 신호예요.",
    traditional:"지위 하락·명예 실추·건강 악화 주의예요.",
    modern:"성장통(청소년기), 불안감, 통제력 상실에 대한 공포예요.",
    detail:"추락하는 꿈은 현실에서 어떤 상황에 불안감을 느끼고 있다는 신호예요. 땅에 닿기 전에 깨어났다면 문제를 인식하고 있다는 의미예요.",
    advice:"지금 불안한 상황이 있다면 회피하지 말고 직면해보세요." },

  { keywords:["시험","합격","불합격","시험을"], title:"시험 꿈", good:null,
    short:"시험 꿈은 현실에서 평가받는 상황의 불안을 반영해요.",
    traditional:"시험에 합격=계획한 일이 성사, 시험에 떨어지면 역몽으로 오히려 합격이에요.",
    modern:"타인의 시선과 평가에 대한 극심한 스트레스, 완벽주의예요.",
    detail:"시험 꿈은 현실에서 평가받는 상황(취업·발표·인간관계)에 대한 불안을 반영해요. 특히 시험에 떨어지는 꿈은 역몽으로 오히려 합격의 징조예요.",
    advice:"완벽하게 하려는 부담을 내려놓으세요. 준비된 것만으로 충분해요." },

  { keywords:["임신","출산","아기","태몽"], title:"임신·출산 꿈", good:true,
    short:"임신·출산 꿈은 새로운 시작과 창조의 길몽이에요.",
    traditional:"임신=새로운 사업 아이템·기회 잉태, 출산=노력의 결실·재물 획득이에요.",
    modern:"새로운 자아의 발현, 잠재력, 창의적 프로젝트의 시작이에요.",
    detail:"임신이나 출산 꿈은 무언가 새로운 것을 창조하거나 시작하는 것을 상징해요. 실제 임신과는 별개로 새로운 기회나 아이디어를 의미해요.",
    advice:"새로운 프로젝트나 계획을 시작하기 좋은 신호예요." },

  { keywords:["결혼","웨딩","결혼식","혼인"], title:"결혼 꿈", good:true,
    short:"결혼 꿈은 중요한 결합이나 계약의 성사를 의미해요.",
    traditional:"결혼=새로운 합의·계약·중요한 인연, 행복한 결혼식=큰 경사예요.",
    modern:"관계에 대한 헌신, 영원한 사랑에 대한 갈망, 자아의 통합이에요.",
    detail:"결혼 꿈은 실제 결혼뿐 아니라 중요한 파트너십이나 계약이 이루어질 것을 암시해요.",
    advice:"중요한 관계나 계약에 적극적으로 임해보세요." },

  { keywords:["돈","지폐","금","보석","황금","돈을"], title:"돈·보물 꿈", good:true,
    short:"돈이나 보물이 나오는 꿈은 재물운 상승의 길몽이에요!",
    traditional:"돈을 줍거나 받으면 실제 횡재수·뜻밖의 이득, 황금이나 보석을 주는 꿈=귀인의 도움이에요.",
    modern:"애정이나 인정에 대한 갈망, 결핍의 심리적 보상이에요.",
    detail:"꿈에서 돈이나 금을 발견하거나 받는 것은 현실에서도 재물운이 좋아질 것을 암시해요.",
    advice:"재테크나 투자에 관심을 기울여볼 적기예요." },

  { keywords:["지갑","잃어버","분실","잃어"], title:"잃어버리는 꿈", good:false,
    short:"중요한 것을 잃는 꿈은 재물 손실이나 관계 변화의 신호예요.",
    traditional:"지갑을 잃으면 재물 손실·권리 박탈, 신발을 잃으면 직장 상실·배우자 이별이에요.",
    modern:"소중한 것을 잃을까 하는 불안, 자아 정체성의 상실감이에요.",
    detail:"무언가를 잃어버리는 꿈은 현실에서 소중한 것에 대한 불안감을 반영해요. 실제로 중요한 것을 챙겨보라는 신호예요.",
    advice:"중요한 서류나 약속, 인간관계를 점검해보세요." },

  { keywords:["조상","할머니","할아버지","돌아가신"], title:"조상·돌아가신 분 꿈", good:true,
    short:"돌아가신 분이 밝게 웃으면 집안 경사와 행운의 신호예요.",
    traditional:"밝게 웃으면=집안 경사·사업 번창, 돈이나 물건을 주면=유산·횡재, 표정이 어두우면=건강 주의예요.",
    modern:"부모나 권위자로부터 인정받고 싶은 욕구, 심리적 안정이에요.",
    detail:"돌아가신 분이 나타나는 꿈은 조상의 보호와 인도를 의미해요. 밝은 표정으로 나타나면 길조예요.",
    advice:"조상에 대한 감사한 마음을 가져보세요." },

  { keywords:["귀신","유령","혼령","귀신이"], title:"귀신 꿈", good:false,
    short:"귀신 꿈은 건강 이상이나 심리적 불안의 신호예요.",
    traditional:"건강 악화·사고수·하는 일이 막히는 신호예요.",
    modern:"무의식적 죄책감, 억압된 공포, 극도의 피로와 신경쇠약이에요.",
    detail:"귀신 꿈은 현실에서 해결하지 못한 두려움이나 죄책감을 반영해요. 자주 꾼다면 심신의 피로를 점검해보세요.",
    advice:"충분한 휴식과 수면을 취하고, 마음의 짐을 내려놓으세요." },

  { keywords:["고양이","냥이","고양이가"], title:"고양이 꿈", good:null,
    short:"고양이 꿈은 독립성과 신비로운 인연을 상징해요.",
    traditional:"할퀴거나 물면=이성 문제로 상처·아랫사람 갈등, 귀엽게 애교=연애운 상승이에요.",
    modern:"독립적이고 이기적인 인물에 대한 매혹과 경계예요.",
    detail:"고양이 꿈은 상황에 따라 달라요. 부드럽게 안기면 좋은 인연의 신호, 할퀴면 조심해야 할 인연이에요.",
    advice:"주변의 소중한 인연에 감사한 마음을 표현해보세요." },

  { keywords:["뱀 물", "물고기","잉어","고기"], title:"물고기·잉어 꿈", good:true,
    short:"물고기를 잡거나 보는 꿈은 재물과 기회의 길몽이에요.",
    traditional:"그물로 잡으면 성실한 노력으로 큰 부 축적, 황금 잉어=가업 번창·최고의 효자 태몽이에요.",
    modern:"무의식 깊은 곳에서 건져 올린 영감이나 아이디어예요.",
    detail:"물고기를 잡는 꿈은 노력으로 재물을 얻는 것을 상징해요. 클수록 더 큰 성과를 의미해요.",
    advice:"지금 진행 중인 일에 집중하면 좋은 결과가 나올 거예요." },

  { keywords:["하늘나는","나는 꿈","날아","비행기"], title:"하늘 나는 꿈", good:true,
    short:"하늘을 자유롭게 나는 꿈은 성취와 해방의 길몽이에요.",
    traditional:"신분 상승·명예 획득·시험 합격의 신호예요.",
    modern:"억압으로부터의 자유 갈망, 높은 목표 달성에 대한 기대예요.",
    detail:"하늘을 나는 꿈은 현실의 어려움을 이겨내고 높은 곳에 오르게 될 것을 암시해요.",
    advice:"오늘은 크게 생각하고 더 높은 목표를 설정해보세요." },

  { keywords:["학교","교실","선생","수업"], title:"학교·교실 꿈", good:null,
    short:"학교 꿈은 배움이나 사회적 평가에 대한 불안을 반영해요.",
    traditional:"새로운 공부·기술 습득의 기회, 수업을 듣지 못하면 기회를 놓친다는 신호예요.",
    modern:"타인의 평가에 대한 스트레스, 준비 부족에 대한 불안이에요.",
    detail:"학교 꿈은 현재 배우거나 성장해야 하는 상황을 반영해요. 배움의 기회를 놓치지 마세요.",
    advice:"새로운 것을 배우거나 공부를 시작하기 좋은 신호예요." },

  { keywords:["태양","해","햇빛","태양이"], title:"태양 꿈", good:true,
    short:"태양은 최고의 명예와 성공을 상징하는 강력한 길몽이에요.",
    traditional:"국가적 명예·최고의 길조·생명력 상승이에요.",
    modern:"아버지·남성성에 대한 긍정, 확실하고 명료한 자아예요.",
    detail:"태양이 밝게 빛나는 꿈은 크고 밝은 성공이 찾아올 것을 의미해요.",
    advice:"자신감 있게 행동하세요. 빛나는 기회가 찾아오고 있어요." },

  { keywords:["달","달빛","보름달"], title:"달 꿈", good:true,
    short:"달 꿈은 임신 태몽이거나 예술적 성취의 길몽이에요.",
    traditional:"임신 태몽, 여성 귀인, 예술적 성취를 의미해요.",
    modern:"어머니·여성성, 직관력, 내면의 신비로운 감정이에요.",
    detail:"보름달이 밝게 빛나는 꿈은 소원 성취의 징조예요. 달이 흐리면 감정의 혼란을 정리할 필요가 있어요.",
    advice:"직관을 믿고 감성적인 부분에 귀를 기울여보세요." },

  { keywords:["꽃","장미","벚꽃","꽃이"], title:"꽃 꿈", good:true,
    short:"아름다운 꽃이 피는 꿈은 명예 상승과 연애운의 길몽이에요.",
    traditional:"명예 상승·훌륭한 창작물·연애의 시작이에요.",
    modern:"미적 감각의 발현, 감정이 만발함, 심리적 안정과 행복이에요.",
    detail:"꽃이 만발하는 꿈은 아름다운 인연이나 좋은 소식이 찾아올 것을 의미해요.",
    advice:"자신을 표현하고 아름다운 것을 즐기는 시간을 가져보세요." },

  { keywords:["산","등산","산에서"], title:"산 꿈", good:true,
    short:"산 정상에 오르는 꿈은 소원 성취와 명예의 길몽이에요.",
    traditional:"정상에 오르면 소원 성취·최고의 지위, 절벽에 서면 위기일발이에요.",
    modern:"목표 달성에 대한 강한 집념, 쾌감, 성취감이에요.",
    detail:"산을 오르는 꿈은 현재의 노력이 결실을 맺을 것을 의미해요. 정상에 오를수록 더 큰 성공이에요.",
    advice:"목표를 향해 꾸준히 나아가세요. 정상이 보이고 있어요." },

  { keywords:["자동차","운전","차를","교통사고"], title:"자동차 꿈", good:null,
    short:"운전하는 꿈은 인생의 주도권을, 사고는 위험 신호예요.",
    traditional:"운전=단체나 사업의 주도권을 잡음, 교통사고=예기치 못한 재난·관재구설이에요.",
    modern:"내 삶의 통제력, 목표를 향한 드라이브, 독립심이에요.",
    detail:"자동차를 운전하는 꿈은 삶의 방향을 스스로 이끌어가고 있다는 신호예요.",
    advice:"중요한 결정을 앞두고 있다면 신중하게 생각해보세요." },

  { keywords:["집","이사","새집","집이"], title:"집 꿈", good:true,
    short:"새 집을 얻는 꿈은 새로운 시작과 안정의 길몽이에요.",
    traditional:"새 집=새로운 환경·새로운 기회, 집이 무너지면=가정 불화·사업 파탄 주의예요.",
    modern:"자아와 안식처에 대한 갈망, 심리적 안정 욕구예요.",
    detail:"새 집에 이사하는 꿈은 삶의 새로운 챕터가 시작됨을 의미해요.",
    advice:"새로운 환경이나 변화를 두려워하지 마세요." },

  { keywords:["싸우다","싸움","다투","격투"], title:"싸우는 꿈", good:null,
    short:"싸우는 꿈은 내적 갈등이나 해소되지 못한 감정의 표현이에요.",
    traditional:"대인관계의 마찰·소송·시비 신호예요. 이기면 경쟁에서 승리예요.",
    modern:"내적 자아의 충돌, 억눌린 불만의 표출, 공격성 해소예요.",
    detail:"싸우는 꿈은 현실에서 해결하지 못한 갈등을 꿈에서 처리하는 경우가 많아요.",
    advice:"중요한 갈등이 있다면 솔직한 대화로 해결해보세요." },

  { keywords:["우는","울다","눈물","엉엉"], title:"우는 꿈", good:true,
    short:"꿈에서 펑펑 우는 것은 막힌 일이 풀리는 길몽이에요!",
    traditional:"소리 내어 펑펑 울면=막혔던 일이 크게 풀리고 소원 성취예요.",
    modern:"억압된 슬픔의 카타르시스, 무의식적 치유 과정이에요.",
    detail:"꿈에서 우는 것은 감정의 정화를 의미해요. 실컷 울고 나서 기분이 좋았다면 더욱 좋은 징조예요.",
    advice:"감정을 억누르지 말고 충분히 표현해보세요." },
];

const UNKNOWN_RESULT = {
  title:"특별한 꿈",
  good:null,
  short:"꿈의 상징을 분석했어요. 감정이 가장 중요한 단서예요.",
  detail:"입력하신 꿈의 요소를 분석한 결과, 당신의 무의식이 현재 상황을 정리하고 있는 것으로 보여요. 꿈에서 느낀 감정이 가장 중요한 단서예요. 기분이 좋았다면 길몽, 불안했다면 삶의 어떤 부분을 돌아보라는 신호일 수 있어요.",
  advice:"오늘 꿈에서 느낀 감정을 일기에 기록해보세요.",
};

const QUICK_KEYWORDS = ["뱀","돼지","용","이빨","물","불","똥","호랑이","죽음","돈","피","우는","하늘","꽃","산"];

export default function DreamInterp() {
  const [step,   setStep]   = useState("input"); // input | result
  const [dream,  setDream]  = useState("");
  const [result, setResult] = useState(null);

  function analyze() {
    if (!dream.trim()) return;
    const lower = dream.toLowerCase();
    const found = DREAM_DB.find(d => d.keywords.some(k => lower.includes(k)));
    setResult(found || { ...UNKNOWN_RESULT, good: dream.length > 10 });
    setStep("result");
  }

  function reset() {
    setStep("input");
    setDream("");
    setResult(null);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🌙 꿈해몽</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>어젯밤 꿈의 의미를 알려드려요 · 무료</p>
      </div>

      {/* ── 입력 ── */}
      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 16px"}}>
            꿈에서 인상적이었던 것을 적어주세요.<br/>
            <span style={{color:G}}>어떤 것이 나왔나요?</span>
          </p>

          {/* 빠른 키워드 */}
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>자주 나오는 꿈 키워드</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {QUICK_KEYWORDS.map(k=>(
              <button key={k} onClick={()=>setDream(d=>{
                if (d.includes(k)) return d;
                return d ? `${d} ${k}` : k;
              })} style={{padding:"6px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:12,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit"}}>
                {k}
              </button>
            ))}
          </div>

          {/* 텍스트 입력 */}
          <textarea
            value={dream}
            onChange={e=>setDream(e.target.value)}
            placeholder="꿈 내용을 자유롭게 적어주세요&#10;예) 큰 뱀이 나를 감쌌어요&#10;예) 돼지가 집 안으로 들어왔어요"
            style={{width:"100%",minHeight:110,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${dream?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.7,marginBottom:14}}
          />

          <button
            onClick={analyze}
            style={{width:"100%",padding:"16px",border:"none",borderRadius:13,cursor:dream.trim()?"pointer":"default",fontSize:15,fontWeight:700,fontFamily:"inherit",background:dream.trim()?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",color:dream.trim()?"#0D0D14":"rgba(255,255,255,0.3)",transition:"0.2s"}}
          >
            꿈 해몽하기 →
          </button>

          <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center",marginTop:12,lineHeight:1.6}}>
            꿈은 무의식의 메시지예요.<br/>구체적으로 적을수록 더 정확한 해몽이 가능해요.
          </p>
        </div>
      )}

      {/* ── 결과 ── */}
      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>

          {/* 입력한 꿈 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 4px"}}>입력한 꿈</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",margin:0,lineHeight:1.6}}>"{dream}"</p>
          </div>

          {/* 길흉 판정 배너 */}
          <div style={{
            background: result.good===true ? "rgba(95,196,158,0.1)" : result.good===false ? "rgba(255,118,117,0.1)" : "rgba(232,200,122,0.08)",
            border: `1px solid ${result.good===true?"rgba(95,196,158,0.3)":result.good===false?"rgba(255,118,117,0.3)":"rgba(232,200,122,0.2)"}`,
            borderRadius:14,padding:"18px",marginBottom:12,textAlign:"center"
          }}>
            <p style={{fontSize:32,margin:"0 0 6px"}}>{result.good===true?"🌟":result.good===false?"⚠️":"🔮"}</p>
            <p style={{fontSize:17,fontWeight:700,color:result.good===true?"#5FC49E":result.good===false?"#FF7675":G,margin:"0 0 4px"}}>
              {result.title}
            </p>
            <span style={{fontSize:11,padding:"3px 12px",borderRadius:20,fontWeight:600,
              background: result.good===true?"rgba(95,196,158,0.15)":result.good===false?"rgba(255,118,117,0.12)":"rgba(232,200,122,0.1)",
              color: result.good===true?"#5FC49E":result.good===false?"#FF7675":G,
              border: `1px solid ${result.good===true?"rgba(95,196,158,0.3)":result.good===false?"rgba(255,118,117,0.25)":"rgba(232,200,122,0.2)"}`
            }}>
              {result.good===true?"✦ 길몽":result.good===false?"✦ 흉몽 (주의)":"✦ 해몽 결과"}
            </span>
          </div>

          {/* 한줄 요약 */}
          <div style={{background:DG,borderRadius:14,padding:"15px",marginBottom:10}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 한줄 해몽</p>
            <p style={{fontSize:14,fontWeight:600,color:"#F0EAD6",lineHeight:1.75,margin:0}}>{result.short}</p>
          </div>

          {/* 전통해몽 */}
          {result.traditional && (
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"15px",marginBottom:10}}>
              <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>🏮 전통 해몽</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.9,margin:0}}>{result.traditional}</p>
            </div>
          )}

          {/* 현대심리 해석 */}
          {result.modern && (
            <div style={{background:"rgba(116,185,255,0.06)",border:"1px solid rgba(116,185,255,0.15)",borderRadius:14,padding:"15px",marginBottom:10}}>
              <p style={{fontSize:9,color:"#74B9FF",letterSpacing:2,margin:"0 0 8px"}}>🧠 현대 심리 해석</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.9,margin:0}}>{result.modern}</p>
            </div>
          )}

          {/* 상세 해몽 (전통/현대 없을 때 fallback) */}
          {!result.traditional && (
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"15px",marginBottom:10}}>
              <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 상세 해몽</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.9,margin:0}}>{result.detail}</p>
            </div>
          )}

          {/* 오늘의 조언 */}
          <div style={{background:DG,borderRadius:14,padding:"13px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>💡</span>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.7,margin:0}}>{result.advice}</p>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={reset} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
              다른 꿈 해몽하기
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
