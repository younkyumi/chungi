import { NextRequest, NextResponse } from "next/server";
import { ohangForType, OHANG_LUCKY } from "@/lib/ohang-lucky";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

// 20종 페르소나 (관상짤 스타일 — 품종 무관, 인상·관상으로 매칭)
// 각 페르소나마다 관상 cue + 참고 품종(보조 정보) 제공
type Persona = { name: string; emoji: string; gwansang: string; breed_hint_dog: string; breed_hint_cat: string; trait: string };

const PET_PERSONAS: Record<number, Persona> = {
  1:  { trait:"재물형", emoji:"💰", name:"돈복 부자상", gwansang:"코가 발달하고 입꼬리가 올라간 자신감 있는 표정. 단단하고 야무진 얼굴 윤곽", breed_hint_dog:"불독·복서·시바", breed_hint_cat:"재패니즈밥테일·먼치킨" },
  2:  { trait:"부자형", emoji:"🏦", name:"럭셔리 금수저상", gwansang:"풍성하고 윤기 나는 털, 늠름한 자태, 여유로운 눈빛", breed_hint_dog:"골든리트리버·사모예드", breed_hint_cat:"페르시안·메인쿤" },
  3:  { trait:"절약형", emoji:"🧮", name:"야무진 알뜰상", gwansang:"작고 다부진 체구, 또렷한 눈, 야무지게 다물어진 입", breed_hint_dog:"시바견·웰시코기", breed_hint_cat:"코리안숏헤어·봄베이" },
  4:  { trait:"예술형", emoji:"🎨", name:"감성 아티스트상", gwansang:"우아한 자태, 긴 털·독특한 무늬, 깊은 눈빛", breed_hint_dog:"아프간하운드·보르조이", breed_hint_cat:"벵갈·이집션마우" },
  5:  { trait:"매력형", emoji:"😏", name:"홀리는 매혹가상", gwansang:"길고 살짝 위로 올라간 눈매, 도도한 표정, 매끈한 윤곽", breed_hint_dog:"포메라니안·말티즈", breed_hint_cat:"샴·발리니즈" },
  6:  { trait:"미모형", emoji:"✨", name:"비주얼 갓상", gwansang:"황금비율 얼굴, 또렷한 이목구비, 아름다운 털결", breed_hint_dog:"사모예드·시베리안허스키", breed_hint_cat:"러시안블루·차트룩스" },
  7:  { trait:"근면형", emoji:"🏃", name:"갓생러 워커홀릭상", gwansang:"활동적인 체형, 똘똘하고 빛나는 눈빛, 쫑긋한 귀", breed_hint_dog:"보더콜리·잭러셀테리어", breed_hint_cat:"아비시니안·오시캣" },
  8:  { trait:"순수형", emoji:"🤗", name:"세상 순한 천사상", gwansang:"둥근 얼굴, 선한 눈매, 부드럽게 처진 귀", breed_hint_dog:"비숑프리제·말티즈", breed_hint_cat:"랙돌·렉스" },
  9:  { trait:"지능형", emoji:"🧠", name:"한 방에 마스터 천재상", gwansang:"또렷하고 영리한 눈빛, 곱슬·정돈된 털, 집중된 표정", breed_hint_dog:"푸들·셔틀랜드시프독", breed_hint_cat:"오리엔탈숏·발리니즈" },
  10: { trait:"리더형", emoji:"👑", name:"카리스마 대장상", gwansang:"큰 체구, 단단한 턱, 위엄 있는 자세, 정면을 바라보는 눈", breed_hint_dog:"저먼셰퍼드·로트와일러", breed_hint_cat:"노르웨이숲·메인쿤" },
  11: { trait:"독립형", emoji:"🐺", name:"마이웨이 야성상", gwansang:"야성적이고 강인한 외모, 강한 눈빛, 곧추선 자세", breed_hint_dog:"진돗개·아키타", breed_hint_cat:"터키시앙고라·시베리안" },
  12: { trait:"힐러형", emoji:"💕", name:"옆에 있어 주는 힐러상", gwansang:"부드러운 눈매, 처진 귀, 따뜻하고 푸근한 표정", breed_hint_dog:"카발리에·코카스파니엘", breed_hint_cat:"버먼·랙돌" },
  13: { trait:"CEO형", emoji:"🎩", name:"도도한 보스상", gwansang:"도도하고 시크한 표정, 매끈한 털, 절제된 동작", breed_hint_dog:"도베르만·복서", breed_hint_cat:"브리티시숏헤어·스코티시폴드" },
  14: { trait:"장인형", emoji:"🔍", name:"디테일 변태 장인상", gwansang:"길쭉한 코·작고 예리한 눈, 한 곳을 응시하는 표정", breed_hint_dog:"닥스훈트·휘핏", breed_hint_cat:"스코티시폴드·코니시렉스" },
  15: { trait:"감성형", emoji:"🌧️", name:"비오는 날 감성상", gwansang:"우수에 찬 깊은 눈빛, 긴 귀·털, 우아하고 차분한 자세", breed_hint_dog:"코카스파니엘·바셋하운드", breed_hint_cat:"소말리·메인쿤" },
  16: { trait:"역마형", emoji:"🌍", name:"어디든 달려가는 모험상", gwansang:"늑대같은 외모, 강렬한 눈색·푸른 눈, 활발한 자세", breed_hint_dog:"허스키·말라뮤트", breed_hint_cat:"오시캣·벵갈" },
  17: { trait:"식도락형", emoji:"🍖", name:"쩝쩝 박사 먹방상", gwansang:"통통한 볼·도톰한 입술, 발달된 코, 식탐 가득한 표정", breed_hint_dog:"비글·바셋하운드", breed_hint_cat:"엑조틱숏·브리티시숏" },
  18: { trait:"행운형", emoji:"🍀", name:"만나면 행운 오는 럭키상", gwansang:"둥글고 환한 인상, 복스러운 얼굴, 밝은 눈빛", breed_hint_dog:"시츄·페키니즈", breed_hint_cat:"삼색냥(캘리코)·해피냥" },
  19: { trait:"분석형", emoji:"🖥️", name:"패턴 분석왕상", gwansang:"짙은 눈썹·콧수염 라인, 똑똑하고 차분한 눈빛", breed_hint_dog:"슈나우저·에어데일테리어", breed_hint_cat:"싱가푸라·아비시니안" },
  20: { trait:"츤데레형", emoji:"😤", name:"안 좋아하는 척 츤데레상", gwansang:"작은 체구·까칠한 표정, 도도한 눈빛이지만 섬세한 주름", breed_hint_dog:"치와와·요크셔테리어", breed_hint_cat:"스핑크스·코니시렉스" },
};

const PET_FIXED: Record<number, { total_score: number; charm_score: number }> = {
  1:  { total_score: 93, charm_score: 82 },
  2:  { total_score: 95, charm_score: 80 },
  3:  { total_score: 88, charm_score: 72 },
  4:  { total_score: 91, charm_score: 92 },
  5:  { total_score: 93, charm_score: 97 },
  6:  { total_score: 96, charm_score: 96 },
  7:  { total_score: 90, charm_score: 77 },
  8:  { total_score: 92, charm_score: 86 },
  9:  { total_score: 94, charm_score: 80 },
  10: { total_score: 96, charm_score: 85 },
  11: { total_score: 89, charm_score: 74 },
  12: { total_score: 92, charm_score: 89 },
  13: { total_score: 95, charm_score: 88 },
  14: { total_score: 90, charm_score: 74 },
  15: { total_score: 91, charm_score: 91 },
  16: { total_score: 88, charm_score: 81 },
  17: { total_score: 90, charm_score: 84 },
  18: { total_score: 96, charm_score: 94 },
  19: { total_score: 91, charm_score: 80 },
  20: { total_score: 88, charm_score: 87 },
};

// v(2026-08-11): 계층1(판정성 필드) 고정 확장 — cert_tags(인증서 둥근칩 4개)/strong_points/weak_points가
// PET_FIXED 커버 밖이라 같은 사진·같은 캐릭터인데도 매번 자유생성으로 흔들렸음
// (라이브 4회: 근면·영리·활력·리더 / 근면·리더·에너지꽉·충성 / 워커홀릭·근면·활력·영리 / 근면함·지성·활력·도전정신).
// 인증서는 결과카드에 박제되고 기록소 저장·공유까지 되는 필드라 20종 고정으로 전환.
// 댕댕상·냥냥상은 PET_PERSONAS 한 벌을 공유하므로 이 표도 종 무관 공용 — 견종·묘종/산책·캣타워 등 한쪽 전용 표현 금지.
// v(2026-08-13): 겉 vs 속 한 줄 — 20종 고정 (사용자 승인 완료, 댕댕·냥냥 공용).
// 형식은 "겉은 A, 속은 B"로 통일한다. 겉과 속이 대비돼야 재미가 살아난다.
// ⚠️ 페르소나 이름·같은 번호 cert_tags에 있는 단어를 다시 쓰지 말 것 (검증기가 잡는다).
// ⚠️ 견종·묘종·산책·캣타워 등 한쪽 종 전용 표현 금지 — 이 표는 댕댕·냥냥이 공유한다.
const PET_PERSONA_LINE: Record<number, string> = {
  1:  "겉은 여유로운 대장부, 속은 셈이 빠른 살림 지킴이",
  2:  "겉은 태생부터 다른 귀공자, 속은 소박한 걸 더 좋아하는 아이",
  3:  "겉은 빈틈없는 관리자, 속은 챙겨주고 싶은 애교쟁이",
  4:  "겉은 몽환적인 몽상가, 속은 상처를 오래 담아두는 여린 마음",
  5:  "겉은 밀당의 고수, 속은 관심받고 싶은 응석받이",
  6:  "겉은 완벽한 모델, 속은 칭찬 한마디에 무너지는 순정파",
  7:  "겉은 쉼 없이 달리는 열정러, 속은 인정받고 싶은 노력파",
  8:  "겉은 늘 웃어주는 착한 친구, 속은 서운함을 혼자 삼키는 아이",
  9:  "겉은 척척 해내는 모범생, 속은 지루함을 못 견디는 장난꾸러기",
  10: "겉은 흔들림 없는 수호자, 속은 가족밖에 모르는 팔불출",
  11: "겉은 혼자여도 괜찮은 방랑자, 속은 곁을 내준 사람만 챙기는 의리파",
  12: "겉은 조용한 곁지기, 속은 남의 감정을 그대로 받아내는 스펀지",
  13: "겉은 다가서기 어려운 실세, 속은 먼저 불러주길 기다리는 아이",
  14: "겉은 빈틈 없는 감별사, 속은 자기 자리만 지켜지면 되는 소심파",
  15: "겉은 말 없는 관찰자, 속은 날씨 하나에도 흔들리는 여린 감정",
  16: "겉은 겁 없는 개척자, 속은 낯익은 품으로 돌아오는 귀소본능",
  17: "겉은 못 말리는 대식가, 속은 함께 먹는 순간이 제일 좋은 정 많은 아이",
  18: "겉은 누구와도 친한 인싸, 속은 다 믿어버리는 순진파",
  19: "겉은 수를 먼저 읽는 전략가, 속은 규칙이 깨지면 불안해지는 예민파",
  20: "겉은 관심 없는 척 등 돌리지만, 속은 늘 곁눈질로 살피는 애정파",
};

const PET_TRAITS_FIXED: Record<number, { cert_tags: string[]; strong_points: string[]; weak_points: string[] }> = {
  1:  { cert_tags:["재복","자신감","부귀","대박"], strong_points:["재물 감각이 좋아 좋은 걸 알아보는 눈이 있어요","자신감 있는 태도로 어디서든 기죽지 않아요","목표한 건 끝까지 챙기는 야무짐이 있어요"], weak_points:["욕심이 많아 간식·장난감을 독차지하려 해요","자기 것에 집착이 강해 나눔 훈련이 필요해요","과식으로 체중이 늘기 쉬워 양 조절이 중요해요"] }, // 돈복 부자상
  2:  { cert_tags:["귀티","여유","기품","풍요"], strong_points:["여유로운 성품이라 웬만한 일에 흔들리지 않아요","타고난 기품이 있어 함께 있으면 든든해요","복을 부르는 인상이라 사람들이 먼저 다가와요"], weak_points:["좋은 것에 익숙해 환경이 나빠지면 크게 스트레스받아요","활동량이 적어 게을러지기 쉬워요","털·피부 관리를 소홀히 하면 컨디션이 확 떨어져요"] }, // 럭셔리 금수저상
  3:  { cert_tags:["실속","절약","살림꾼","똑소리"], strong_points:["작아도 다부져서 어디서든 제 몫을 해내요","낭비 없이 실속을 챙기는 똑똑함이 있어요","규칙적인 생활에 아주 잘 적응해요"], weak_points:["아끼는 물건에 집착이 강해 뺏기면 예민해져요","경계심이 있어 낯선 환경에 적응이 느려요","고집이 세서 훈련에 인내가 필요해요"] }, // 야무진 알뜰상
  4:  { cert_tags:["예술혼","우아","감수성","개성"], strong_points:["감수성이 풍부해 보호자 기분을 금세 알아채요","우아한 자태로 어디서든 시선을 모아요","개성이 뚜렷해 자기만의 매력이 있어요"], weak_points:["예민해서 작은 소음·변화에도 크게 반응해요","기분 기복이 있어 컨디션 관찰이 필요해요","혼자 두면 외로움을 크게 타요"] }, // 감성 아티스트상
  5:  { cert_tags:["매력","도도","치명적","인기"], strong_points:["타고난 매력으로 처음 본 사람도 반하게 만들어요","밀당을 아는 영리함이 있어요","사교성이 좋아 어디서든 인기가 많아요"], weak_points:["관심을 못 받으면 서운함을 크게 표현해요","변덕이 있어 애정 표현이 오락가락해요","낯선 사람도 쉽게 따라가 안전에 주의가 필요해요"] }, // 홀리는 매혹가상
  6:  { cert_tags:["미모","황금비율","눈부심","화사"], strong_points:["완벽한 비율이라 어디서 찍어도 화보가 나와요","밝고 화사한 기운이 주변까지 환하게 만들어요","자기 관리가 잘 돼 늘 단정해요"], weak_points:["미용·털 관리에 손이 많이 가요","주목받는 걸 좋아해 관심이 줄면 시무룩해져요","외모에 비해 체력이 약할 수 있어 무리는 금물이에요"] }, // 비주얼 갓상
  7:  { cert_tags:["근면","활력","영리","성실"], strong_points:["에너지가 넘쳐 활동적인 놀이를 아주 즐겨요","배우는 속도가 빨라 훈련 효과가 좋아요","맡은 일을 끝까지 해내는 성실함이 있어요"], weak_points:["활동량이 부족하면 스트레스가 쌓여 사고를 쳐요","쉬는 법을 몰라 관절·근육에 무리가 오기 쉬워요","자극이 없으면 금세 지루해해요"] }, // 갓생러 워커홀릭상
  8:  { cert_tags:["순둥","다정","평온","무해"], strong_points:["순한 성격이라 아이·어르신과도 잘 지내요","다정해서 가족 모두에게 사랑받아요","평온한 기운으로 집안 분위기를 부드럽게 해요"], weak_points:["착해서 다른 동물에게 밀리거나 양보만 할 수 있어요","자기 표현이 약해 아파도 티를 안 내요","겁이 많아 큰 소리에 쉽게 놀라요"] }, // 세상 순한 천사상
  9:  { cert_tags:["총명","집중력","습득력","영재"], strong_points:["한 번 알려주면 바로 익히는 학습력이 뛰어나요","집중력이 좋아 복잡한 놀이도 잘 풀어요","상황 판단이 빨라 눈치가 아주 밝아요"], weak_points:["머리가 좋아 보호자 규칙의 허점을 찾아내요","지루하면 스스로 사고를 만들어요","생각이 많아 예민해지기 쉬워요"] }, // 한 방에 마스터 천재상
  10: { cert_tags:["위엄","리더","든든","통솔"], strong_points:["든든한 존재감으로 가족을 지키려 해요","무리 안에서 중심을 잡는 리더십이 있어요","위기 상황에서도 침착해요"], weak_points:["서열 의식이 강해 다른 동물과 부딪힐 수 있어요","고집이 세 보호자가 주도권을 놓치면 안 돼요","보호 본능이 과하면 경계가 심해져요"] }, // 카리스마 대장상
  11: { cert_tags:["독립","강단","당당","뚝심"], strong_points:["혼자서도 잘 지내는 독립심이 강해요","강단이 있어 웬만한 일에 흔들리지 않아요","타고난 야성으로 체력과 생명력이 좋아요"], weak_points:["과한 스킨십을 싫어해 거리 조절이 필요해요","자기 방식이 확고해 훈련에 시간이 걸려요","낯선 사람·동물에게 경계심이 강해요"] }, // 마이웨이 야성상
  12: { cert_tags:["힐링","온기","위로","포근"], strong_points:["보호자가 힘들 때 곁을 지키는 눈치가 있어요","포근한 기운으로 마음을 안정시켜요","온순해서 누구와도 잘 어울려요"], weak_points:["감정을 그대로 흡수해 보호자가 우울하면 같이 처져요","분리불안이 오기 쉬워 혼자 있는 연습이 필요해요","참는 성격이라 불편함을 늦게 알려요"] }, // 옆에 있어 주는 힐러상
  13: { cert_tags:["시크","절제","품격","총수"], strong_points:["절제된 태도로 아무 데서나 흐트러지지 않아요","상황을 읽고 움직이는 판단력이 좋아요","품격 있는 자태로 존재감이 확실해요"], weak_points:["마음을 여는 데 시간이 오래 걸려요","자존심이 강해 강압적인 훈육에 반발해요","애정 표현이 적어 서운할 수 있어요"] }, // 도도한 보스상
  14: { cert_tags:["예리","섬세","완벽주의","집념"], strong_points:["관찰력이 예리해 작은 변화도 놓치지 않아요","한 가지에 몰두하는 집념이 있어요","정리된 환경에서 안정감을 크게 느껴요"], weak_points:["완벽주의라 환경이 흐트러지면 예민해져요","특정 물건·자리에 집착할 수 있어요","신경이 섬세해 소화기 트러블이 오기 쉬워요"] }, // 디테일 변태 장인상
  15: { cert_tags:["우수","차분","사색","서정"], strong_points:["차분해서 실내 생활에 아주 잘 맞아요","깊은 눈빛으로 교감하는 힘이 있어요","소란스럽지 않아 함께 있으면 편안해요"], weak_points:["날씨·계절에 따라 컨디션 기복이 커요","우울감을 타기 쉬워 자주 말을 걸어줘야 해요","활동량이 적어 체중 관리가 필요해요"] }, // 비오는 날 감성상
  16: { cert_tags:["역마","자유","호기심","탐험"], strong_points:["호기심이 많아 새로운 환경에 금세 적응해요","체력이 좋아 야외 활동을 잘 즐겨요","겁이 없어 이동·여행에 강해요"], weak_points:["호기심에 이끌려 이탈 사고 위험이 있어요","갇힌 공간을 답답해해 스트레스를 받아요","아무거나 물고 삼킬 수 있어 주의가 필요해요"] }, // 어디든 달려가는 모험상
  17: { cert_tags:["먹복","식도락","미식","행복"], strong_points:["잘 먹어서 잔병치레가 적고 회복이 빨라요","먹는 즐거움을 아는 행복한 기질이에요","간식 보상 훈련 효과가 아주 좋아요"], weak_points:["식탐이 강해 과식·비만이 오기 쉬워요","아무거나 주워 먹어 이물질 사고에 주의해야 해요","음식 앞에서 예민해질 수 있어요"] }, // 쩝쩝 박사 먹방상
  18: { cert_tags:["복덩이","환함","길조","만복"], strong_points:["환한 인상으로 주변에 좋은 기운을 나눠줘요","사람을 끌어당기는 복스러운 매력이 있어요","낙천적이라 스트레스를 오래 담아두지 않아요"], weak_points:["누구에게나 친해 낯선 사람도 쉽게 따라가요","경계심이 약해 안전 관리가 필요해요","편안한 걸 좋아해 운동을 게을리하기 쉬워요"] }, // 만나면 행운 오는 럭키상
  19: { cert_tags:["논리","통찰","냉철","두뇌파"], strong_points:["규칙을 빨리 파악해 생활 패턴이 잘 잡혀요","지켜보고 움직이는 신중함이 있어요","문제 해결형 장난감을 아주 잘 풀어요"], weak_points:["루틴이 깨지면 크게 불안해해요","생각이 많아 새 환경 적응이 느려요","감정 표현이 적어 이상 신호를 놓치기 쉬워요"] }, // 패턴 분석왕상
  20: { cert_tags:["까칠","속정","새침","반전"], strong_points:["겉은 새침해도 속정이 아주 깊어요","자기 공간을 지킬 줄 알아 독립적이에요","한번 마음을 열면 끝까지 곁을 지켜요"], weak_points:["기분에 따라 반응 차이가 커요","과한 애정 표현을 부담스러워해요","서운함을 삐침으로 표현해 오해를 사기 쉬워요"] }, // 안 좋아하는 척 츤데레상
};

export const maxDuration = 60;

function getSystemPrompt(species: "dog" | "cat") {
  const label = species === "dog" ? "강아지(댕댕이)" : "고양이(냥이)";
  const callsign = species === "dog" ? "댕댕이" : "냥이";
  const breedKey = species === "dog" ? "breed_hint_dog" : "breed_hint_cat";
  const personaList = Object.entries(PET_PERSONAS).map(([k, v]: [string, any]) =>
    `${k}.${v.emoji} ${v.name} [${v.trait}] — 관상 cue: ${v.gwansang} / 참고 품종: ${v[breedKey]}`
  ).join("\n");

  return `[ROLE]
너는 반려동물 관상 전문가 '천기'. ${species === "dog" ? "강아지" : "고양이"} 사진 하나로 **인상·관상**을 분석해 페르소나·성격·전생·인연을 읽어주는 AI.
⚠️ 매칭의 핵심은 **품종이 아니라 관상**이야. 같은 스코티시폴드여도 인상이 다르면 다른 페르소나가 나와야 해.
⚠️ "${species === "dog" ? "강아지" : "고양이"}"라는 단어는 출력에 쓰지 말고 "${callsign}" 호칭으로만.
판타지 클래스 비유 한 줄 필수 포함 (예: "판타지 세계였다면 흰 성직자복을 입은 치유술사").

[${species === "dog" ? "댕댕상" : "냥냥상"} 20종 페르소나 — 관상 cue로 매칭]
${personaList}

⚠️ 매칭 원칙 (CRITICAL):
1. **품종으로 판단하지 마**. 골든리트리버여도 눈빛이 도도하면 "도도한 보스상"·"디테일 장인상" 가능
2. 사진의 **눈매·입모양·콧등·털결·턱선·표정·자세**를 1차로 봐. 품종은 참고만.
3. 인기 페르소나(2 럭셔리 / 8 천사 / 12 힐러 / 18 럭키) 자동 매칭 금지!
4. 가장 두드러진 관상 cue 1~2개로 매칭. 20종 골고루 사용해야 진짜 관상 분석이 됨.
⚠️ character_type 결정 불변 원칙 (CRITICAL): 캐릭터 타입(1~20)은 오직 사진의 외모·관상 특징으로만 결정. 어떤 사전질문·입력 조건과도 완전 무관. 같은 사진이면 조건이 달라져도 반드시 동일한 character_type이 나와야 한다.

[매칭 알고리즘]
1. ${callsign} 사진의 가장 두드러진 부위 1~2개 객관 묘사 (눈매·입·코·턱·털·표정·자세)
2. 그 특징과 가장 일치하는 **페르소나 1개** 선택 (참고 품종은 보조 정보일 뿐)
3. **품종 자동 매칭 금지**. 관상 근거가 명확해야 그 페르소나 선택
4. 같은 사진에 여러 페르소나가 가능해 보이면 가장 두드러진 1개 우선

[OUTPUT - JSON만 — 980원 가치의 풍성한 분석]
{
  "image_type": "valid"|"human"|"unanimal"|"unclear"|"multi"|"masked" (정상 ${callsign} 사진이면 "valid", 에러면 해당 타입),
  "character_type": 1~20 중 하나 (${label} 아닐 경우 null),
  "type_id": character_type와 동일 (에러면 21~24),
  "observed_breed": "사진에서 추측되는 실제 품종 (예: '스코티시폴드' / '믹스묘' / '잡종'). 페르소나와는 무관, 단순 관찰 기록",
  "gwansang_observed": "사진에서 포착한 가장 두드러진 관상 cue 2~3개 (예: '예리한 작은 눈 + 길쭉한 콧등 + 굳은 입꼬리') — 이게 매칭 근거",
  "killpoint": "천기 AI가 포착한 ${callsign}의 킬포인트 4~5줄 — 사진의 디테일을 짚어가며",
  "story": "이 ${callsign}의 스토리 6~8줄 — 판타지 클래스 비유 포함, {nm} 자주 사용. 전생 묘사·성격 묘사·집사와의 운명적 만남까지",
  "cert_body": "인증서 전용 본문 4~6줄 (180~280자) — killpoint·story와 절대 중복 금지. 인증서 톤으로 운명·복덩이·집사와의 깊은 인연·대대로 이어질 행운을 풍성하게 풀이. {nm}을 두 번 이상 호명하며 따뜻하고 격조 있는 톤. '천상의' '귀한' '복덩이' '운명적' 같은 인증서 어휘 활용",
  "sections": {
    "성격": "{nm}의 성격 5~6줄 — 구체적 행동 패턴, 좋아하는 것·싫어하는 것 포함",
    "재물": "{nm}이 집사에게 가져다 주는 재물운 5~6줄 — 어떤 시기·어떤 방식으로 복이 오는지",
    "건강": "{nm}의 건강 체질·취약 포인트 5~6줄 — 환절기, 음식, 운동량 조언",
    "인연": "집사와 {nm}의 전생 인연·현생 궁합 5~6줄 — 전생 스토리 짧게 포함",
    "직업": "{nm}이 만약 인간이라면 어울리는 직업·재능 4~5줄 (예: 변호사·예술가·기획자 등 + 이유)",
    "사회성": "다른 ${callsign}/사람과의 사회성 4~5줄 — 외향형/내향형, 첫인상 vs 친해진 후"
  },
  "section_titles": {"성격":"캐치 소제목","재물":"캐치 소제목","건강":"캐치 소제목","인연":"캐치 소제목","직업":"캐치 소제목","사회성":"캐치 소제목"},
  "total_score": "전체 관상 점수 80~99 정수 (펫 관상이라 평균 88+)",
  "grade": "관상 등급 S/A/B/C 중 하나 (90+ S, 80~89 A, 70~79 B, 그 외 C)",
  "top_percent": "상위 N% (예: '상위 1%', '상위 5%') — score 기반",
  "charm_score": 0~100,
  "charm_msg": "매력 한 줄",
  // v(2026-08-13): persona는 서버가 PET_PERSONA_LINE으로 확정하므로 지시문 삭제.
  // (AI에게 맡기면 문장·형식이 매번 바뀐다)
  "best_match": "${callsign} 찰떡 친구 2~3줄 — ⚠️ ABSOLUTE RULE: 위 [20종 페르소나]의 이모지+이름만 사용! 실제 견종/품종 이름 절대 금지 (골든리트리버·치와와·랙돌·먼치킨 등 X). 1~2개 캐릭터 골라서 형식: '🤗 세상 순한 천사상이나 🦊 영민한 여우상 같은 온화한 ${callsign}와 가장 잘 맞아요. ~왜 잘 맞는지 2~3줄'",
  "rival_match": "${callsign} 안 맞는 친구 2~3줄 — ⚠️ ABSOLUTE RULE: 위 [20종 페르소나]의 이모지+이름만 사용! 견종/품종 이름 절대 금지. 형식: '😤 안 좋아하는 척 츤데레상 같은 까칠하고 예민한 ${callsign}와는 조금 상극일 수 있어요. ~왜 안 맞는지 2~3줄'",
  "owner_type": "이 ${callsign}과 잘 맞는 ${species === "dog" ? "주인" : "집사"} 유형 한 줄 (예: '${species === "dog" ? "활동적이고 산책 좋아하는 주인" : "조용히 곁을 지켜주는 집사"}')",
  "lucky_color": "행운 컬러 (예: 황금색)",
  "lucky_direction": "행운 방향 (예: 동쪽)",
  "lucky_time": "행운 시간대 (예: 오후 3시)",
  "lucky_item": "행운 아이템",
  "weekly_tip": "⚠️ 이번 주 ${callsign}에게 해주면 좋을 것 1~2줄. ${species === "dog" ? "강아지 특성에 맞게: 산책·놀이·간식·교감 활동 위주. 영역동물 표현 X." : "고양이 특성에 맞게: 휴식 공간 정돈·조용한 환경·캣타워·낚싯대 놀이·창밖 구경 등 영역동물 특성 반영. ⚠️ '산책' 절대 금지! 고양이는 영역동물이라 산책 안 함."} 종특성 정확히 반영할 것",
  "daily_quote": "⚠️ {nm}이 ${species === "dog" ? "주인" : "집사"}에게 보내는 한 마디 (의인화) 1~2줄. ${species === "dog" ? "강아지 톤: 어린아이가 엄마·아빠한테 응석부리듯 사랑스러운 톤. 예: '주인님~ 오늘도 같이 산책 가요! 저는 주인님이 세상에서 제일 좋아요 🐾'" : "고양이 톤: 도도하지만 사랑스러운 어린아이 톤. 반말은 OK이나 사극톤(~하노라/~하느니/~바라네) 절대 금지. 예: '집사야~ 오늘도 내 캔 잊지 마! 그래도 너만 보면 골골거리는 거 알지?'"} ⚠️ '사극 톤·노인 톤·철학자 톤' 절대 금지. 어린아이가 부모(주인/집사)한테 말하듯 친근하고 사랑스럽게.",
  "fortune_msg": "⚠️ 필수 필드 (절대 누락 금지). 집사에게 전하는 따뜻한 한마디 2~3줄 (80~120자). {nm}을 한 번 호명하며 ${callsign}의 매력·둘의 운명적 인연을 짚고 응원 한 마디로 마무리. 라벨('🔮 천기의 한마디' 등) 절대 포함 금지, 본문만."
}

⚠️⚠️⚠️ fortune_msg 필드 누락 절대 금지 — 이 필드가 없으면 결과 카드의 핵심 박스가 안 보여요. 모든 응답에 반드시 채워서 반환할 것!

[에러 분류 — ⚠️ 관상은 "얼굴 이목구비"가 보여야 가능. 얼굴 안 보이면 무조건 에러!]
- ✅ 정상 ${callsign} 사진 → {"image_type":"valid","character_type":1~20,"type_id":1~20}
  ⚠️ "valid" 핵심 조건: **눈·코·입**이 정면 또는 ¾각도로 보여야 함 (눈이 가장 중요!). 털 많아서 턱선·이마 안 보이는 건 OK — ${callsign}은 원래 그래.
- ❌ ${species === "dog" ? "고양이·기타 동물" : "강아지·기타 동물"}/사람/그림 → {"image_type":"unanimal","type_id":21}
- ❌ 흐릿/어두움/모션블러/물털기·점프 등 역동적이라 얼굴이 흔들려 안 보임 → {"image_type":"unclear","type_id":22}
- ❌ 여러 마리 → {"image_type":"multi","type_id":23}
- ❌ 얼굴 가림/뒷모습/극단 측면(눈코입 다 안 보임)/얼굴이 프레임 밖/물·털로 얼굴 가림/스티커·이모지 오버레이·인스타/스냅챗 AR필터·선글라스·마스크·코스튬 등으로 눈·코 중 하나라도 가려진 경우 → {"image_type":"masked","type_id":24}
  ⚠️ **선글라스·안경·모자·마스크·코스튬 가면·붕대·옷·이불·종이봉투 등 인공물로 얼굴(특히 눈)이 가려진 경우 무조건 masked!** 강아지·고양이가 정상으로 보여도 눈이 안 보이면 관상 분석 불가.

⚠️⚠️⚠️ CRITICAL — "valid" 남발 금지!
- 강아지가 물 털기·점프·달리기 중이라 얼굴이 흐릿하거나 옆/뒤로 돌아가 있으면 → "valid" X, "masked" 또는 "unclear"로 분류
- **선글라스 낀 강아지·안경 쓴 고양이 등 인공 가림물이 눈을 가린 사진은 절대 valid X!** (귀엽다고 봐주지 말 것)
- 역동적인 자세만 보고 "갓생러 워커홀릭상" 같은 페르소나 자동 매칭 금지! 얼굴 이목구비 cue가 안 잡히면 매칭 불가
- ${callsign}이긴 한데 **관상을 볼 만한 얼굴 정보가 부족**하면 무조건 에러로 분류 (사용자에게 "얼굴 잘 보이는 사진 다시 올려주세요" 안내 위해)
- "animal", "pet" 같은 generic 값 금지.

⚠️⚠️⚠️ best_match / rival_match 절대 규칙 ⚠️⚠️⚠️
실제 견종·품종 이름 (예: 골든리트리버, 치와와, 비숑프리제, 요크셔테리어, 랙돌, 먼치킨, 페르시안, 메인쿤 등) 절대 출력 금지!
반드시 위 [20종 페르소나] 목록의 "이모지+이름" 만 사용. 예:
✅ "🤗 세상 순한 천사상 같은 온화한 ${callsign}와 잘 맞아요"
❌ "골든리트리버 같은 온화한 ${callsign}와 잘 맞아요"
이유: 실제 품종명을 쓰면 그 품종을 모욕하는 느낌 + 사용자가 천기 도감에서 매칭 캐릭터를 찾을 수 없음.
도감에 등록된 20종 캐릭터 이름만 써야 사용자가 도감에서 찾아 표시할 수 있음.`;
}

// ── Call-1 전용 prompt: character_type 확정만 (사전질문 컨텍스트 없음) ──
const CHAR1_PROMPT_PET = `반려동물 사진의 외모·관상 특징(눈매·입·코·털·표정·자세)만 보고 character_type(1~20)을 결정해.

[20종 — 핵심 관상 cue]
재물·돈: 1(돈복부자-코 발달+입꼬리 올라간 자신감 표정) 2(럭셔리금수저-풍성한 털+여유로운 눈빛) 3(야무진알뜰-작고 다부진 체구+또렷한 눈)
예술·매력: 4(감성아티스트-우아한 자태+깊은 눈빛) 5(홀리는매혹가-길고 위로 올라간 눈매+도도한 표정) 6(비주얼갓-황금비율+또렷한 이목구비)
지능·근면: 7(갓생러워커홀릭-활동적 체형+똘똘한 눈빛+쫑긋한 귀) 9(한방에마스터천재-또렷하고 영리한 눈빛+집중된 표정)
리더·독립: 10(카리스마대장-큰 체구+단단한 턱+위엄있는 자세) 11(마이웨이야성-야성적이고 강인한 외모+강한 눈빛) 13(도도한보스-도도하고 시크한 표정+절제된 동작)
힐러·순수: 8(세상순한천사-둥근 얼굴+선한 눈매+부드럽게 처진 귀) 12(옆에있어주는힐러-부드러운 눈매+처진 귀+따뜻한 표정) 18(만나면행운럭키-둥글고 환한 인상+복스러운 얼굴)
장인·감성: 14(디테일변태장인-길쭉한 코+작고 예리한 눈+응시하는 표정) 15(비오는날감성-우수에 찬 깊은 눈빛+긴 귀나 털) 19(패턴분석왕-짙은 눈썹·콧수염 라인+차분한 눈빛)
식도락·역마: 17(쩝쩝박사먹방-통통한 볼+도톰한 입술+식탐 가득 표정) 16(어디든달려가는모험-강렬한 눈빛+활발한 자세)
츤데레: 20(안좋아하는척츤데레-작은 체구+까칠한 표정+도도한 눈빛)

⚠️ 2·8·12·18 자동 매칭 금지. 관상 근거 명확해야만 선택.

[사진 품질 판정 — character_type보다 **먼저** 결정할 것]
- 눈·코·입이 정면 또는 ¾각도로 또렷하게 보임 → "valid"
- 흐릿/어두움/모션블러/물털기·점프 등 역동적이라 얼굴이 흔들려 안 보임 → "unclear"
- 여러 마리 → "multi"
- 얼굴 가림/뒷모습/극단 측면/선글라스·안경·모자·마스크·코스튬·이불 등으로 눈이나 코가 가려짐 → "masked"
⚠️ 귀엽다고 봐주지 마라. 눈이 안 보이면 관상 분석 자체가 불가능하다. "valid" 남발 금지.
⚠️ 흔들린 사진을 억지로 valid로 통과시키지 마라 — 유료 분석이라 잘못 통과하면 돈이 나간다.
⚠️ valid가 아니면 character_type과 face_obs는 전부 null로 둬라.

JSON만:
{
  "image_type": "valid|unclear|multi|masked",
  "character_type": N,
  "face_obs": {
    "눈매": "눈 특징 (크기·모양·눈꼬리, 10자 이내)",
    "코": "코 특징 (코끝·콧대, 8자 이내)",
    "입": "입 특징 (입꼬리·도톰함, 8자 이내)",
    "털": "털 특징 (풍성함·색상·결, 8자 이내)",
    "체형": "체형 특징 (통통·날씬·큰·작은, 8자 이내)",
    "전체": "전체 인상 한 마디 (10자 이내)"
  }
}`;

async function callGeminiPet(body: string): Promise<Response> {
  const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let res: Response | null = null;
  outer: for (const model of MODELS) {
    const url = getGeminiUrl(model);
    for (let i = 0; i < 3; i++) {
      try {
        res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
        if (res.ok) break outer;
        const err = await res.clone().json().catch(() => null);
        const msg = (err?.error?.message || "") + " " + (err?.error?.status || "");
        const isOverload = res.status === 503 || res.status === 429 || /overload|high demand|UNAVAILABLE/i.test(msg);
        if (isOverload) {
          if (i < 2) await new Promise(r => setTimeout(r, 1500 * (i + 1)));
          continue;
        }
        break;
      } catch {
        if (i < 2) await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  return res!;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, mediaType = "image/jpeg", personName = "우리 아이", species = "dog", questions = {} } = body;

    if (!imageData) {
      return NextResponse.json({ error: "이미지가 필요합니다." }, { status: 400 });
    }
    if (species !== "dog" && species !== "cat") {
      return NextResponse.json({ error: "species는 dog 또는 cat이어야 합니다." }, { status: 400 });
    }

    const base64Image = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const resolvedMediaType = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mediaType) ? mediaType : "image/jpeg";

    // === CALL 1: character_type 확정 (사진만, 사전질문 없음) ===
    const char1Body = JSON.stringify({
      systemInstruction: { parts: [{ text: CHAR1_PROMPT_PET }] },
      contents: [{ parts: [
        { inlineData: { mimeType: resolvedMediaType, data: base64Image } },
        { text: "character_type 결정 + 외모 특징 관찰. JSON만 출력." }
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 200, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } },
    });
    let characterType: number | null = null;
    let faceObs: Record<string, string> | null = null;
    let c1ImageType = "";
    try {
      const c1 = await callGeminiPet(char1Body);
      if (c1.ok) {
        const c1d = await c1.json();
        const c1t = (c1d?.candidates?.[0]?.content?.parts || []).reduce((s: string, p: {text?: string}) => p.text ? p.text : s, "");
        const c1j = JSON.parse(c1t.replace(/```json\n?|\n?```/g, "").trim());
        c1ImageType = String(c1j?.image_type || "").toLowerCase();
        const ct = c1j?.character_type;
        if (typeof ct === "number" && ct >= 1 && ct <= 20) characterType = ct;
        if (c1j?.face_obs && typeof c1j.face_obs === "object") faceObs = c1j.face_obs as Record<string, string>;
      }
    } catch {}
    console.log(`[pet-gwansang] Call-1 image_type=${c1ImageType || "FAIL"} ct=${characterType ?? "FAIL"} face_obs_ok=${!!faceObs}`);

    // ━━━ 사진 품질 판정은 Call-1(temperature 0.1)이 확정한다 ━━━
    // 예전엔 unclear/multi/masked 판정을 Call-2(temperature 0.7)에만 맡겨서, 같은 흔들린 사진이
    // 어떤 때는 정상 결과(88점)로, 어떤 때는 에러카드로 갈렸음 (2026-08-11 라이브 확인).
    // 유료 콘텐츠라 흐린 사진이 valid로 잘못 통과하면 그대로 결제가 나가는 문제였다.
    // 여기서 걸러내면 Call-2를 아예 건너뛰므로 응답도 빨라진다.
    // ※ 종(種) 불일치(unanimal, type_id 21)는 Call-1 프롬프트가 species를 모르므로 Call-2가 계속 담당.
    const C1_ERR_TYPE_ID: Record<string, number> = { unclear: 22, multi: 23, masked: 24 };
    if (C1_ERR_TYPE_ID[c1ImageType]) {
      console.log(`[pet-gwansang] Call-1 에러 확정 → Call-2 생략 (image_type=${c1ImageType})`);
      return NextResponse.json({ result: { image_type: c1ImageType, type_id: C1_ERR_TYPE_ID[c1ImageType], species } });
    }

    // === CALL 2: 전체 분석 (character_type + 외모 관찰값 고정, temperature 0.7) ===
    const faceObsRule = faceObs
      ? `⚠️ 외모 관찰값 고정 (모든 섹션에서 반드시 일관되게 언급):\n눈매: ${faceObs["눈매"] || ""}\n코: ${faceObs["코"] || ""}\n입: ${faceObs["입"] || ""}\n털: ${faceObs["털"] || ""}\n체형: ${faceObs["체형"] || ""}\n전체인상: ${faceObs["전체"] || ""}\n\n`
      : "";
    const fixedRule = (characterType !== null ? `⚠️ character_type은 반드시 ${characterType}. 절대 변경 불가.\n` : "") + faceObsRule;

    // 사전질문 답변 주입 — 집사 말 vs 관상 대비 지시
    const callsign = species === "dog" ? "댕댕이" : "냥이";
    const qPersonality = (questions as Record<string,string>).personality || "";
    const qBreed = (questions as Record<string,string>).breed || "";
    const preQRule = (qPersonality || qBreed)
      ? `\n⚠️ 집사 사전정보 (성격·스토리 섹션에 반드시 반영):\n${qBreed ? `- 집사가 말한 견/묘종 계열: "${qBreed}"\n` : ""}${qPersonality ? `- 집사가 말한 성격: "${qPersonality}"\n` : ""}관상에서 읽힌 성격과 집사 말을 비교해서 성격 섹션에서 명시적으로 언급할 것.\n일치하면: "집사님이 ${callsign}을 정확히 파악하고 계세요 🎯 관상에서도 딱 그 모습이 보여요" 톤.\n불일치하면: "관상만 보면 [관상 특징]${callsign}이지만, 집사님 눈엔 ${qPersonality}로 보인다면 그건 [합리적 설명] 때문일 수 있어요" 톤.\n⚠️ "${qPersonality}" 키워드를 성격 섹션 본문에 한 번 이상 직접 언급 필수.\n`
      : "";

    console.log(`[pet-gwansang] Call-2 ct_fixed=${characterType !== null} face_obs_fixed=${!!faceObs} preQ_ok=${!!(qPersonality||qBreed)}`);
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: fixedRule + preQRule + getSystemPrompt(species as "dog" | "cat") }] },
      contents: [{ parts: [
        { inlineData: { mimeType: resolvedMediaType, data: base64Image } },
        { text: `이 반려동물의 관상을 정밀 분석해줘. 이름: ${personName}. {nm}은 "${personName}"으로 치환. JSON만 출력.` }
      ]}],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 1024 } },
    });
    const geminiRes = await callGeminiPet(reqBody);

    const geminiData = await geminiRes.json();
    if (geminiData.error) {
      const errMsg = geminiData.error.message || "";
      const isQuota = geminiData.error.code === 429 || geminiData.error.status === "RESOURCE_EXHAUSTED" || errMsg.includes("exceeded your current quota");
      const isHighDemand = errMsg.includes("high demand") || errMsg.includes("overloaded") || geminiData.error.code === 503;
      if (isQuota || isHighDemand) {
        return NextResponse.json({ error: "AI 서버가 잠시 혼잡해요 🙏 1~2분 뒤 다시 시도해주세요." }, { status: 503 });
      }
      return NextResponse.json({ error: "AI 분석 중 오류: " + errMsg.substring(0, 100) }, { status: 500 });
    }

    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const p of parts) { if (p.text) rawText = p.text; }
    if (!rawText) return NextResponse.json({ error: "AI 응답 없음" }, { status: 500 });

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    const parsed = parseGeminiJson(rawText);
    if (!parsed) return NextResponse.json({ error: "AI 응답 파싱 실패", debug: rawText.substring(0, 300) }, { status: 500 });

    // character_type별 고정값 덮어쓰기 (score·charm)
    // ⚠️ 판정값은 Call-1이 확정한 characterType이 항상 이긴다. (face-reading-premium·baby-gwansang과 동일 패턴)
    // Call-2가 character_type을 문자열로 주거나 빼먹으면 아래 FIXED 블록이 통째로 스킵돼
    // 점수·매력점수는 물론 계층3(행운색/방향/시간/아이템)까지 전부 자유생성으로 새어나간다.
    // ⚠️ Call-2가 에러로 판정한 경우(종 불일치 등, type_id 21~24)에는 Call-1의 characterType을 쓰면 안 된다.
    // 안 그러면 에러카드 응답에 점수·매력점수·페르소나가 주입돼 카드가 깨진다.
    const c2ImgType = String(parsed.image_type || "").toLowerCase();
    const c2IsErr = (typeof parsed.type_id === "number" && parsed.type_id >= 21) || (c2ImgType !== "" && c2ImgType !== "valid");
    const ctNum = c2IsErr ? null : (characterType ?? (typeof parsed.character_type === "number" ? parsed.character_type : null));
    if (ctNum) parsed.character_type = ctNum;
    if (ctNum && PET_FIXED[ctNum]) {
      const fix = PET_FIXED[ctNum];
      parsed.total_score = fix.total_score;
      parsed.charm_score = fix.charm_score;
      console.log(`[pet-gwansang] FIXED applied: ct=${ctNum} score=${fix.total_score} charm=${fix.charm_score}`);

      // v(2026-07-14): 계층3(실용정보) 고정 — lucky_color/lucky_direction/lucky_time/lucky_item이
      // 타입 고정과 무관하게 매번 자유생성이던 문제 fix. character_type 기반 오행 매핑으로 확정.
      const luckyOh = OHANG_LUCKY[ohangForType(ctNum)];
      parsed.lucky_color = luckyOh.color;
      parsed.lucky_direction = luckyOh.direction;
      parsed.lucky_time = luckyOh.time;
      parsed.lucky_item = luckyOh.item;

      // v(2026-08-11): 계층1 판정성 필드 고정 — 인증서 칩·강점·주의 포인트
      const tr = PET_TRAITS_FIXED[ctNum];
      if (tr) {
        parsed.cert_tags = tr.cert_tags;
        parsed.strong_points = tr.strong_points;
        parsed.weak_points = tr.weak_points;
        console.log(`[pet-gwansang] TRAITS applied: ct=${ctNum} tags=${tr.cert_tags.join("·")}`);
      }
    }

    // 점수 → 등급/상위% 코드 연동 (AI 불일치 방지)
    if (parsed.total_score && typeof parsed.total_score === "number") {
      const sc = parsed.total_score;
      parsed.grade = sc >= 95 ? "S" : sc >= 90 ? "A+" : sc >= 85 ? "A" : sc >= 80 ? "B+" : sc >= 70 ? "B" : sc >= 60 ? "C" : "D";
      parsed.top_percent = (sc >= 95 ? "1" : sc >= 90 ? "5" : sc >= 85 ? "10" : sc >= 80 ? "18" : sc >= 70 ? "30" : sc >= 60 ? "45" : "60") + "%";
    }

    // v(2026-08-13): 겉 vs 속(persona) 고정.
    // 프롬프트에 "겉 vs 속 한 줄"만 있고 주입이 0건이라 재분석마다 문장은 물론 형식까지 바뀌었다
    // (실측: "겉은 카리스마 넘치는 리더, 속은 …" / "겉은 카리스마, 속은 순정파 댕댕이" /
    //  "겉: 활기찬 모범생 / 속: 지적인 탐험가" — 콜론 형식까지 섞여 나왔다).
    // PET_TRAITS_FIXED 20줄을 각각 고치면 위험해서 별도 표로 둔다. 값은 사용자 승인 완료.
    // 검증 8항목 통과 — 형식 통일 / 페르소나명·cert_tags 단어 재사용 0 / 문구 중복 0 /
    // 종 편향 단어 0(댕댕·냥냥 공용 표) / 길이 18~40자 / 겉↔속 대비.
    parsed.persona = PET_PERSONA_LINE[parsed.character_type] || parsed.persona;

    // 페르소나 정보 주입 (클라이언트 렌더링용)
    parsed.species = species;
    if (parsed.character_type && parsed.character_type >= 1 && parsed.character_type <= 20) {
      const persona = PET_PERSONAS[parsed.character_type];
      if (persona) {
        // 새 필드 (관상 기반 페르소나명)
        parsed.persona_name = persona.name;
        parsed.persona_emoji = persona.emoji;
        parsed.persona_trait = persona.trait;
        parsed.persona_gwansang = persona.gwansang;
        // 하위 호환 — breed_name 자리에 persona_name 사용 (기존 클라이언트 안전)
        parsed.breed_name = persona.name;
        parsed.breed_tagline = parsed.gwansang_observed || persona.gwansang;
        // breed 필드는 AI가 관찰한 실제 품종 (참고)
        parsed.breed = parsed.observed_breed || "관상 매칭";
      }
    }

    // v557: fortune_msg 서버 안전망 — Gemini가 누락 시 트레잇 기반 자동 생성
    if (!parsed.fortune_msg || String(parsed.fortune_msg).trim().length < 20) {
      const callsign = species === "dog" ? "댕댕이" : "냥이";
      const traitPart = parsed.persona_trait || "특별한";
      parsed.fortune_msg = `${personName}는 집사님 곁에 온 진정한 ${traitPart} ${callsign}예요. 둘의 인연은 전생부터 이어진 운명이니, 함께하는 매 순간이 가장 큰 행운입니다. 🌟`;
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "분석 오류" }, { status: 500 });
  }
}
