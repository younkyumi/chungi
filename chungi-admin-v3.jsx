import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --ink:#0D0D14;--ink2:#1A1A28;--ink3:#252535;--ink4:#2F2F42;
    --gold:#E8C87A;--gold2:#F5DFA0;--jade:#5FC49E;--blush:#F5B8C4;
    --violet:#9B8FD4;--coral:#F47C5A;--mist:#C8C4D8;--white:#FAF9F6;
  }
  html,body{background:var(--ink);color:var(--white);font-family:'Noto Serif KR','Apple SD Gothic Neo',serif;-webkit-tap-highlight-color:transparent;}
  .app{max-width:430px;margin:0 auto;min-height:100dvh;background:var(--ink);}
  .anav{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:13px 18px;background:rgba(13,13,20,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(244,124,90,0.2);}
  .anav-logo{display:flex;align-items:center;gap:8px;}
  .anav-badge{font-size:9px;font-weight:700;background:var(--coral);color:#fff;padding:2px 8px;border-radius:10px;}
  .anav-title{font-size:16px;font-weight:900;color:var(--gold);}
  .anav-user{font-size:11px;color:var(--mist);}
  .abtab{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:100;display:flex;background:rgba(13,13,20,0.97);backdrop-filter:blur(16px);border-top:1px solid rgba(244,124,90,0.15);padding-bottom:env(safe-area-inset-bottom,0);}
  .ati{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 0 7px;cursor:pointer;color:rgba(200,196,216,0.38);border:none;background:none;font-family:inherit;transition:color .18s;}
  .ati.on{color:var(--coral);}
  .ati-ic{font-size:17px;} .ati-lb{font-size:8px;font-weight:700;}
  .page{padding:64px 0 82px;}
  .card{background:var(--ink2);border-radius:16px;border:1px solid rgba(255,255,255,0.06);padding:16px;}
  .sec{padding:14px 18px 4px;}
  .sec-t{font-size:14px;font-weight:900;margin-bottom:12px;display:flex;align-items:center;gap:7px;}
  .sec-t::after{content:'';flex:1;height:1px;background:linear-gradient(to right,rgba(244,124,90,0.2),transparent);}
  .sec-t-btn{font-size:10px;font-weight:700;padding:4px 10px;border-radius:9px;border:1px solid rgba(244,124,90,0.3);background:transparent;color:var(--coral);cursor:pointer;font-family:inherit;flex-shrink:0;margin-left:auto;}
  .divider{height:8px;background:var(--ink);}
  .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 18px 4px;}
  .stat-card{background:var(--ink2);border-radius:16px;border:1px solid rgba(255,255,255,0.06);padding:16px 14px;position:relative;overflow:hidden;}
  .stat-card::before{content:'';position:absolute;top:0;right:0;width:60px;height:60px;border-radius:50%;opacity:0.07;transform:translate(20px,-20px);}
  .stat-card.gold::before{background:var(--gold);}
  .stat-card.jade::before{background:var(--jade);}
  .stat-card.blush::before{background:var(--blush);}
  .stat-card.violet::before{background:var(--violet);}
  .stat-label{font-size:10px;color:var(--mist);margin-bottom:6px;font-weight:700;}
  .stat-value{font-size:24px;font-weight:900;margin-bottom:3px;}
  .stat-value.gold{color:var(--gold2);}
  .stat-value.jade{color:var(--jade);}
  .stat-value.blush{color:var(--blush);}
  .stat-value.violet{color:var(--violet);}
  .stat-value.zero{color:rgba(200,196,216,0.25);}
  .stat-change{font-size:10px;font-weight:700;}
  .stat-change.up{color:var(--jade);}
  .stat-change.none{color:rgba(200,196,216,0.3);}
  .chart-wrap{padding:0 18px 4px;}
  .chart-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:9px;}
  .chart-bar-label{font-size:10px;color:var(--mist);min-width:60px;text-align:right;flex-shrink:0;line-height:1.3;}
  .chart-bar-track{flex:1;height:8px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;}
  .chart-bar-fill{height:100%;border-radius:4px;}
  .chart-bar-val{font-size:10px;font-weight:700;min-width:24px;text-align:right;flex-shrink:0;color:var(--mist);}
  .tbl{width:100%;border-collapse:collapse;font-size:12px;}
  .tbl th{font-size:10px;color:var(--mist);font-weight:700;text-align:left;padding:8px 8px;border-bottom:1px solid rgba(255,255,255,0.06);}
  .tbl td{padding:9px 8px;border-bottom:1px solid rgba(255,255,255,0.04);}
  .tbl tr:last-child td{border-bottom:none;}
  .bdg{display:inline-flex;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700;}
  .bdg-g{background:rgba(95,196,158,0.15);color:var(--jade);border:1px solid rgba(95,196,158,0.25);}
  .bdg-r{background:rgba(244,124,90,0.15);color:var(--coral);border:1px solid rgba(244,124,90,0.25);}
  .bdg-y{background:rgba(232,200,122,0.15);color:var(--gold);border:1px solid rgba(232,200,122,0.25);}
  .bdg-v{background:rgba(155,143,212,0.15);color:var(--violet);border:1px solid rgba(155,143,212,0.25);}
  .btn{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:11px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;transition:all .18s;}
  .btn-p{background:linear-gradient(135deg,var(--gold),#d4a843);color:var(--ink);}
  .btn-c{background:linear-gradient(135deg,var(--coral),#e05c38);color:#fff;}
  .btn-j{background:linear-gradient(135deg,var(--jade),#3da87e);color:var(--ink);}
  .btn-v{background:linear-gradient(135deg,var(--violet),#7a6db8);color:#fff;}
  .btn-g{background:transparent;border:1px solid rgba(255,255,255,0.1);color:var(--mist);}
  .btn-sm{padding:5px 11px;font-size:11px;border-radius:9px;}
  .btn:active{transform:scale(0.97);}
  .inp{width:100%;padding:10px 12px;background:var(--ink3);border:1px solid rgba(255,255,255,0.07);border-radius:11px;color:var(--white);font-family:inherit;font-size:13px;outline:none;transition:border-color .18s;}
  .inp:focus{border-color:rgba(244,124,90,0.4);}
  .inp::placeholder{color:rgba(200,196,216,0.3);}
  .sel{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23C8C4D8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;}
  .filter-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:12px;}
  .filter-chip{padding:5px 11px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.08);background:transparent;color:var(--mist);cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .18s;}
  .filter-chip.on{background:rgba(244,124,90,0.15);color:var(--coral);border-color:rgba(244,124,90,0.3);}
  .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
  .toggle-row:last-child{border-bottom:none;}
  .toggle-label{font-size:13px;}
  .toggle-sub{font-size:10px;color:var(--mist);margin-top:2px;}
  .toggle{width:44px;height:24px;border-radius:12px;background:rgba(255,255,255,0.1);position:relative;cursor:pointer;transition:background .2s;border:none;flex-shrink:0;}
  .toggle.on{background:var(--coral);}
  .toggle::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .2s;}
  .toggle.on::after{transform:translateX(20px);}
  .ov{position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:200;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(6px);animation:fi .18s;}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  .md{background:var(--ink2);border-radius:24px 24px 0 0;padding:22px 20px 40px;width:100%;max-width:430px;border-top:1px solid rgba(244,124,90,0.15);max-height:90dvh;overflow-y:auto;animation:su .2s ease-out;}
  @keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .hd{width:36px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 auto 18px;}
  .mt{font-size:18px;font-weight:900;margin-bottom:5px;}
  .ms{font-size:12px;color:var(--mist);margin-bottom:16px;line-height:1.6;}
  .dots{display:flex;gap:5px;justify-content:center;padding:16px;}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--coral);animation:b 1.1s ease-in-out infinite;}
  .dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}
  @keyframes b{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}
  .notice{background:rgba(244,124,90,0.07);border:1px solid rgba(244,124,90,0.18);border-radius:12px;padding:11px 13px;font-size:12px;color:var(--mist);line-height:1.6;margin-bottom:12px;}
  .notice strong{color:var(--coral);}
  .empty-state{text-align:center;padding:28px 20px;color:rgba(200,196,216,0.3);}
  .empty-state .ei{font-size:36px;margin-bottom:8px;}
  .empty-state .et{font-size:12px;line-height:1.6;}
  .export-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
  .export-row:last-child{border-bottom:none;}
  .export-label{font-size:12px;font-weight:700;}
  .export-sub{font-size:10px;color:var(--mist);margin-top:2px;}

  /* 그래프 날짜 도트 */
  .graph-dots-row{display:flex;justify-content:space-between;padding:8px 0 0;}
  .graph-dot-item{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;}
  .graph-dot-val{font-size:10px;font-weight:700;color:var(--gold2);}
  .graph-dot-date{font-size:9px;color:var(--mist);}

  /* 포털 탭 */
  .portal-tab-row{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none;}
  .portal-tab-row::-webkit-scrollbar{display:none;}
  .portal-tab{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.08);background:transparent;color:var(--mist);cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:all .18s;}
  .portal-tab.on{color:var(--white);border-color:rgba(255,255,255,0.2);background:var(--ink3);}
  .portal-tab.naver.on{color:#03C75A;border-color:rgba(3,199,90,0.3);background:rgba(3,199,90,0.08);}
  .portal-tab.google.on{color:#4285F4;border-color:rgba(66,133,244,0.3);background:rgba(66,133,244,0.08);}
  .portal-tab.kakao.on{color:#FEE500;border-color:rgba(254,229,0,0.3);background:rgba(254,229,0,0.08);}
  .portal-tab.insta.on{color:#E1306C;border-color:rgba(225,48,108,0.3);background:rgba(225,48,108,0.08);}
  .portal-tab.youtube.on{color:#FF0000;border-color:rgba(255,0,0,0.3);background:rgba(255,0,0,0.08);}
`;

// ─── 상수 데이터 ──────────────────────────────────────────────────────────────
const WEEK_DATES = ["3월24일(월)","3월25일(화)","3월26일(수)","3월27일(목)","3월28일(금)","3월29일(토)","3월30일(일)"];

// ─── 더미 데이터 (UI 확인용 — 서비스 오픈 시 실제 데이터로 교체) ──────────
const DUMMY_ON = true; // 개발 완료 후 false로 바꾸면 0으로 전환

const DUMMY_STATS = {
  visitors:1284, signups:87, revenue:284600, payments:312,
  visitors_change:12.4, signups_change:8.1, revenue_change:18.7,
};
const DUMMY_WEEK_V = [420,580,710,930,1050,1180,1284];
const DUMMY_WEEK_R = [82000,104000,138000,196000,221000,248000,284600];
const ZERO_WEEK   = [0,0,0,0,0,0,0];

// 더미 회원 19명 (천기인·북극성·별·달빛·새싹 골고루)
const DUMMY_MEMBERS = [
  {id:1, name:"김지연",emoji:"👩",email:"kim***@gmail.com",joinDate:"2026.01.15",lastVisit:"2026.03.30",totalPaid:52400,tags:["🐉 천기인","🛍️ 개운러"],blood:"A",ddi:"토끼",zodiac:"물고기자리",gijildo:"화형",inflow:"카카오 공유",  contents:["관상짤","사주","연애운","종합분석","파동성명학","굿즈"]},
  {id:2, name:"이민준",emoji:"👨",email:"lee***@naver.com", joinDate:"2026.02.03",lastVisit:"2026.03.30",totalPaid:8820, tags:["🌱 새싹"],           blood:"O",ddi:"말",  zodiac:"사자자리",  gijildo:"수형",inflow:"네이버 검색",contents:["관상짤","타로"]},
  {id:3, name:"박소희",emoji:"👩",email:"par***@kakao.com", joinDate:"2026.01.28",lastVisit:"2026.03.29",totalPaid:29400,tags:["⭐ 별","🛍️ 개운러"],  blood:"B",ddi:"용",  zodiac:"전갈자리",  gijildo:"목형",inflow:"인스타그램",  contents:["사주","연애운","파동성명학","관상짤"]},
  {id:4, name:"최도현",emoji:"👨",email:"cho***@gmail.com", joinDate:"2026.03.01",lastVisit:"2026.03.28",totalPaid:1960, tags:["🌱 새싹"],           blood:"AB",ddi:"쥐", zodiac:"양자리",    gijildo:"금형",inflow:"구글 검색",  contents:["관상짤"]},
  {id:5, name:"정유진",emoji:"👩",email:"jun***@naver.com", joinDate:"2026.02.14",lastVisit:"2026.03.30",totalPaid:22640,tags:["💫 북극성"],             blood:"A",ddi:"뱀",  zodiac:"처녀자리",  gijildo:"화형",inflow:"카카오 공유",  contents:["전체"]},
  {id:6, name:"강민서",emoji:"👨",email:"kan***@gmail.com", joinDate:"2026.03.20",lastVisit:"2026.03.30",totalPaid:980,  tags:["🌱 새싹"],           blood:"O",ddi:"소",  zodiac:"황소자리",  gijildo:"토형",inflow:"직접 방문",  contents:["사주"]},
  {id:7, name:"윤아름",emoji:"👩",email:"yun***@kakao.com", joinDate:"2026.01.05",lastVisit:"2026.03.29",totalPaid:68200,tags:["🐉 천기인","🌙 달빛"], blood:"A",ddi:"호랑이",zodiac:"사수자리", gijildo:"화형",inflow:"인스타그램",  contents:["전체","굿즈"]},
  {id:8, name:"오성민",emoji:"👨",email:"oh***@naver.com",  joinDate:"2026.02.28",lastVisit:"2026.03.25",totalPaid:4800, tags:["🌱 새싹"],           blood:"B",ddi:"닭",  zodiac:"천칭자리",  gijildo:"수형",inflow:"유튜브",      contents:["파동성명학"]},
  {id:9, name:"임채원",emoji:"👩",email:"lim***@gmail.com", joinDate:"2026.01.20",lastVisit:"2026.03.30",totalPaid:35600,tags:["⭐ 별"],             blood:"A",ddi:"양",  zodiac:"게자리",    gijildo:"목형",inflow:"네이버 검색",contents:["사주","연애운","굿즈"]},
  {id:10,name:"한지우",emoji:"👨",email:"han***@kakao.com", joinDate:"2026.03.10",lastVisit:"2026.03.28",totalPaid:3920, tags:["🌱 새싹"],           blood:"O",ddi:"원숭이",zodiac:"쌍둥이자리",gijildo:"금형",inflow:"카카오 공유",contents:["관상짤","기질도"]},
  {id:11,name:"신예은",emoji:"👩",email:"sin***@gmail.com", joinDate:"2026.02.01",lastVisit:"2026.03.30",totalPaid:41200,tags:["⭐ 별","🌙 달빛"],  blood:"B",ddi:"돼지",zodiac:"물병자리",   gijildo:"수형",inflow:"인스타그램",  contents:["사주","기질도","뇌과학"]},
  {id:12,name:"류정훈",emoji:"👨",email:"ryu***@naver.com", joinDate:"2026.03.05",lastVisit:"2026.03.27",totalPaid:980,  tags:["🌱 새싹"],           blood:"AB",ddi:"쥐", zodiac:"염소자리",  gijildo:"토형",inflow:"구글 검색",  contents:["사주"]},
  {id:13,name:"문소연",emoji:"👩",email:"mun***@kakao.com", joinDate:"2026.01.10",lastVisit:"2026.03.30",totalPaid:24500,tags:["⭐ 별"],             blood:"A",ddi:"토끼",zodiac:"양자리",    gijildo:"화형",inflow:"카카오 공유",  contents:["관상짤","연애운","타로"]},
  {id:14,name:"배태양",emoji:"👨",email:"bae***@gmail.com", joinDate:"2026.02.20",lastVisit:"2026.03.26",totalPaid:5760, tags:["🌱 새싹"],           blood:"O",ddi:"용",  zodiac:"사자자리",  gijildo:"목형",inflow:"유튜브",      contents:["사주","관상짤"]},
  {id:15,name:"조하늘",emoji:"👩",email:"jo***@naver.com",  joinDate:"2026.01.25",lastVisit:"2026.03.30",totalPaid:58800,tags:["🐉 천기인","🛍️ 개운러"], blood:"B",ddi:"말",  zodiac:"전갈자리",  gijildo:"화형",inflow:"인스타그램",  contents:["전체","굿즈"]},
  {id:16,name:"홍준혁",emoji:"👨",email:"hon***@kakao.com", joinDate:"2026.03.15",lastVisit:"2026.03.29",totalPaid:1960, tags:["🌱 새싹"],           blood:"A",ddi:"뱀",  zodiac:"쌍둥이자리",gijildo:"수형",inflow:"카카오 공유",  contents:["관상짤","관상짤"]},
  {id:17,name:"전민지",emoji:"👩",email:"jun***@gmail.com", joinDate:"2026.02.08",lastVisit:"2026.03.30",totalPaid:15680,tags:["🌙 달빛"],         blood:"AB",ddi:"닭", zodiac:"처녀자리",  gijildo:"금형",inflow:"네이버 검색",contents:["사주","기질도","연애운"]},
  {id:18,name:"남궁준",emoji:"👨",email:"nam***@naver.com", joinDate:"2026.03.25",lastVisit:"2026.03.30",totalPaid:980,  tags:["🌱 새싹"],           blood:"O",ddi:"소",  zodiac:"황소자리",  gijildo:"토형",inflow:"직접 방문",  contents:["사주"]},
  {id:19,name:"서다은",emoji:"👩",email:"seo***@kakao.com", joinDate:"2026.01.30",lastVisit:"2026.03.30",totalPaid:44800,tags:["⭐ 별","🌙 달빛"],  blood:"A",ddi:"양",  zodiac:"물고기자리",gijildo:"화형",inflow:"카카오 공유",  contents:["관상짤","사주","연애운","굿즈"]},
];

// 회원 등급 정의 (고객 표시 등급 기준)
const MEMBER_TYPES = {
  천기인: {label:"🐉 천기인", color:"var(--gold)",   bdg:"bdg-y", desc:"전체 유료 콘텐츠 이용 + 굿즈 구매 + 5만원 이상", cond:"최상위"},
  북극성: {label:"💫 북극성", color:"var(--violet)", bdg:"bdg-v", desc:"전체 유료 콘텐츠 이용 (약 2.2만원)",             cond:"헤비유저"},
  샛별:   {label:"🌟 샛별",   color:"var(--blush)",  bdg:"bdg-r", desc:"총 결제 5만원 이상 (굿즈 포함)",               cond:"고결제"},
  별:     {label:"⭐ 별",     color:"var(--coral)",  bdg:"bdg-r", desc:"유료 콘텐츠 5가지 이상 이용",                  cond:"활성"},
  태양:   {label:"☀️ 태양",   color:"var(--jade)",   bdg:"bdg-g", desc:"5일+ 연속 접속",                               cond:"접속"},
  달빛:   {label:"🌙 달빛",   color:"var(--jade)",   bdg:"bdg-g", desc:"주 3회+ 접속·콘텐츠 10개+ 이용",              cond:"파워"},
  개운러: {label:"🛍️ 개운러", color:"var(--coral)",  bdg:"bdg-r", desc:"굿즈샵 구매 이력 있음",                        cond:"굿즈"},
  새싹:   {label:"🌱 새싹",   color:"var(--mist)",   bdg:"bdg-g", desc:"가입 30일 이내",                               cond:"신규"},
};

// 공유 배지 정의
const SHARE_BADGES = {
  인플루언서: {label:"🌟 인플루언서", color:"var(--gold)",  desc:"20회+ 공유 · 명패 실물 발송"},
  홍보대사:   {label:"🏆 홍보대사",  color:"var(--blush)", desc:"10~19회 공유 · 키링 실물 발송"},
  전파자:     {label:"📢 전파자",    color:"var(--jade)",  desc:"5~9회 공유 · 디지털 부적 선택"},
  공유자:     {label:"🔗 공유자",    color:"var(--violet)",desc:"1~4회 공유 · 쿠폰 즉시 지급"},
};

// 더미 매출
const DUMMY_REVENUE = {
  오늘:284600, 이번주:1241600, 이번달:4820000, 전체:12480000
};
const DUMMY_CONTENTS_REV = [
  {name:"관상짤",     count:1240,revenue:471200},
  {name:"사주 풀이",  count:892, revenue:874160},
  {name:"연애운·궁합",count:634, revenue:621320},
  {name:"파동성명학", count:87,  revenue:417600},
  {name:"기질도",     count:312, revenue:305760},
  {name:"뇌과학 분석",count:124, revenue:595200},
];
const DUMMY_GOODS_REV = [
  {name:"화(火) 빨간 팔찌",   cat:"오행보완",sold:124,revenue:1847600,stock:76},
  {name:"주작형 레드 키링 (12수호신)",   cat:"12수호신",sold:89, revenue:1148100,stock:111},
  {name:"재물운 아크릴 부적", cat:"미니부적",sold:234,revenue:1848600,stock:466},
  {name:"2026 신년 개운 키트",cat:"시즌한정",sold:67, revenue:2814000,stock:33},
  {name:"A형 라벤더 향초",    cat:"혈액형",  sold:89, revenue:1602000,stock:111},
];
const DUMMY_INFLOW = [
  {id:"kakao",source:"카카오 공유",icon:"🟡",count:512,color:"#FEE500"},
  {id:"naver",source:"네이버 검색",icon:"🟢",count:389,color:"#03C75A"},
  {id:"insta",source:"인스타그램", icon:"📸",count:287,color:"#E1306C"},
  {id:"google",source:"구글 검색",icon:"🔵",count:156,color:"#4285F4"},
  {id:"direct",source:"직접 방문", icon:"🌐",count:98, color:"var(--mist)"},
  {id:"youtube",source:"유튜브",   icon:"🔴",count:87, color:"#FF0000"},
  {id:"twitter",source:"트위터/X", icon:"⚫",count:34, color:"rgba(200,196,216,0.5)"},
  {id:"other",source:"기타",       icon:"📎",count:21, color:"rgba(200,196,216,0.3)"},
];
const DUMMY_NOTIF = [
  {icon:"💳",msg:"윤아름님 굿즈 3개 주문 (44,800원)",time:"방금 전", type:"결제"},
  {icon:"👤",msg:"새 회원 가입 (kakao) — 남궁준님",  time:"3분 전",  type:"가입"},
  {icon:"💳",msg:"서다은님 사주 풀이 결제",           time:"8분 전",  type:"결제"},
  {icon:"💳",msg:"김지연님 관상짤 결제 (380원)",      time:"15분 전", type:"결제"},
  {icon:"👤",msg:"새 회원 가입 (google) — 배태양님",  time:"22분 전", type:"가입"},
  {icon:"⚠️",msg:"최도현님 환불 요청",               time:"1시간 전",type:"환불"},
  {icon:"💳",msg:"조하늘님 파동성명학 결제",          time:"1시간 전",type:"결제"},
];

// 회원 세그먼트 (기본 제공 + 커스텀 추가 가능)
const DEFAULT_SEGMENTS = [
  {id:1, label:"20대 여성 + 연애운 이용",      color:"var(--blush)",  count:287, locked:false},
  {id:2, label:"30대 여성 + 연애운 이용",      color:"var(--blush)",  count:312, locked:false},
  {id:3, label:"40대 여성 + 토정비결 이용",    color:"var(--violet)", count:124, locked:false},
  {id:4, label:"20대 남성 + 굿즈 구매",        color:"var(--jade)",   count:89,  locked:false},
  {id:5, label:"사주 결제 후 굿즈 미구매",     color:"var(--gold)",   count:534, locked:false},
  {id:6, label:"🌟 샛별 + 파동성명학 미이용",      color:"var(--coral)",  count:89,  locked:false},
  {id:7, label:"7일 이상 미방문",              color:"var(--coral)",  count:623, locked:false},
  {id:8, label:"기질도 관심 예상 유저",        color:"var(--violet)", count:412, locked:false},
  {id:9, label:"관상짤만 이용·사주 미이용",    color:"var(--gold)",   count:891, locked:false},
  {id:10,label:"30대 여성 + 기질도 관심",      color:"var(--blush)",  count:198, locked:false},
  {id:11,label:"뇌과학 분석 관심 예상 유저",   color:"var(--jade)",   count:345, locked:false},
  {id:12,label:"신규 가입 후 결제 미진행",     color:"var(--mist)",   count:456, locked:false},
];

// 굿즈 할인 쿠폰 (콘텐츠 쿠폰 + 굿즈 쿠폰 구분)
const GOODS_COUPONS_INIT = [
  {id:1,code:"GOODS20",  name:"굿즈 20% 할인",   type:"goods",    discount:"20%", minOrder:10000,expire:"2026.12.31",issued:0,used:0,active:true},
  {id:2,code:"OHAENG",   name:"오행 아이템 1000원 할인",type:"goods",discount:"1000원",minOrder:5000,expire:"2026.06.30",issued:0,used:0,active:true},
  {id:3,code:"NEWGOODS", name:"첫 굿즈 구매 10% 할인",type:"goods",discount:"10%",minOrder:0,expire:"상시",issued:0,used:0,active:true},
];
const CONTENT_COUPONS_INIT = [
  {id:4,code:"CHUNGI10", name:"첫 결제 10% 할인",  type:"content",  discount:"10%", minOrder:0,    expire:"2026.12.31",issued:0,used:0,active:true},
  {id:5,code:"FREELOOK", name:"무료 관상짤",         type:"content",  discount:"100%",minOrder:0,    expire:"상시",      issued:0,used:0,active:true},
  {id:6,code:"VIP500",   name:"⭐ 별 등급 500원 할인",     type:"content",  discount:"500원",minOrder:980,  expire:"상시",      issued:0,used:0,active:true},
];

const ALL_CONTENTS = [
  // 매일 무료 (6종)
  {id:"daily_unse",   name:"오늘의 운세",    cat:"매일무료", price:0,    open:true},
  {id:"today_tarot",  name:"오늘의 타로",    cat:"매일무료", price:0,    open:true},
  {id:"tarot_yesno",  name:"YES/NO 타로",    cat:"매일무료", price:0,    open:true},
  {id:"dream",        name:"꿈 해몽",        cat:"매일무료", price:0,    open:true},
  {id:"lotto",        name:"행운 로또번호",  cat:"매일무료", price:0,    open:true},
  {id:"monthly_unse", name:"이달의 운세",    cat:"매일무료", price:0,    open:true},
  // 상시 무료 (7종)
  {id:"ddi",          name:"띠별 운세",      cat:"무료",     price:0,    open:true},
  {id:"zodiac",       name:"별자리 운세",    cat:"무료",     price:0,    open:true},
  {id:"blood",        name:"혈액형 운세",    cat:"무료",     price:0,    open:true},
  {id:"celeb_look",   name:"연예인 닮은꼴",  cat:"무료",     price:0,    open:true},
  {id:"celeb_compat", name:"궁합 연예인",    cat:"무료",     price:0,    open:true},
  {id:"ytype_intro",  name:"12수호신 소개",  cat:"무료",     price:0,    open:true},
  {id:"synthesis",    name:"나의 천기 리포트",cat:"무료",    price:0,    open:true},
  // 관상 (유료)
  {id:"gwansang_zal", name:"관상짤",         cat:"관상",     price:380,  open:true},
  {id:"gwansang_full",name:"정밀 관상",      cat:"관상",     price:980,  open:true},
  // 운세·점술 (유료)
  {id:"saju",         name:"사주 풀이",      cat:"유료",     price:980,  open:true},
  {id:"saju_monthly", name:"사주 월별운세",  cat:"유료",     price:980,  open:true},
  {id:"love",         name:"연애운·궁합",    cat:"유료",     price:980,  open:true},
  {id:"newyear",      name:"신년운세",       cat:"유료",     price:980,  open:true},
  {id:"tojeong",      name:"토정비결",       cat:"유료",     price:980,  open:true},
  {id:"numerology",   name:"수비학",         cat:"유료",     price:980,  open:true},
  {id:"palmistry",    name:"손금",           cat:"유료",     price:980,  open:true},
  {id:"footreading",  name:"발금",           cat:"유료",     price:980,  open:true},
  {id:"mole",         name:"얼굴 점",        cat:"유료",     price:980,  open:true},
  {id:"past_life",    name:"전생 운세",      cat:"유료",     price:980,  open:true},
  // 타로 (유료)
  {id:"tarot_love",   name:"연애 타로",      cat:"타로",     price:980,  open:true},
  {id:"tarot_health", name:"건강 타로",      cat:"타로",     price:980,  open:true},
  {id:"tarot_money",  name:"재물 타로",      cat:"타로",     price:980,  open:true},
  {id:"tarot_career", name:"진로 타로",      cat:"타로",     price:980,  open:true},
  {id:"tarot_life",   name:"인생 타로",      cat:"타로",     price:980,  open:true},
  // 나를 알다 (유료)
  {id:"gijildo",      name:"기질 테스트",    cat:"나를알다", price:980,  open:true},
  {id:"namereading",  name:"이름 풀이",      cat:"이름성명", price:980,  open:true},
  // 프리미엄
  {id:"psych",        name:"뇌과학 분석 테스트",cat:"프리미엄",price:4800,open:true},
  {id:"pawdong",      name:"파동 성명학",    cat:"프리미엄", price:4800, open:true},
];

const PORTAL_KEYWORDS = {
  naver:   ["관상 분석 무료","오늘 운세 무료","소개팅 관상","사주 무료","이름 풀이"],
  google:  ["face reading app","korean fortune","saju analysis","free horoscope"],
  kakao:   ["천기 관상짤","천기 운세","천기 사주"],
  insta:   ["#관상","#운세","#사주","#소개팅관상","#기질도"],
  youtube: ["관상 보는 법","사주 무료 분석","운세 앱 추천"],
};

const INFLOW_SOURCES = [
  {id:"naver",   source:"네이버 검색",  icon:"🟢", count:0, color:"#03C75A"},
  {id:"kakao",   source:"카카오 공유",  icon:"🟡", count:0, color:"#FEE500"},
  {id:"insta",   source:"인스타그램",   icon:"📸", count:0, color:"#E1306C"},
  {id:"google",  source:"구글 검색",    icon:"🔵", count:0, color:"#4285F4"},
  {id:"direct",  source:"직접 방문",    icon:"🌐", count:0, color:"var(--mist)"},
  {id:"youtube", source:"유튜브",       icon:"🔴", count:0, color:"#FF0000"},
  {id:"twitter", source:"트위터/X",     icon:"⚫", count:0, color:"rgba(200,196,216,0.5)"},
  {id:"other",   source:"기타",         icon:"📎", count:0, color:"rgba(200,196,216,0.3)"},
];

// ─── 유틸 ─────────────────────────────────────────────────────────────────────
function downloadCSV(filename, headers, rows){
  const BOM="\uFEFF";
  const csv=BOM+[headers.join(","),...rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=filename;a.click();
  URL.revokeObjectURL(url);
}

function useSaved(){
  const[s,setS]=useState("");
  function save(k){setS(k);setTimeout(()=>setS(""),2000);}
  return[s,save];
}

// ─── 그래프 with 날짜+수치 ────────────────────────────────────────────────────
function GraphCard({data, dates, color, emptyText}){
  const max=Math.max(...data,1);
  const w=280;const h=50;
  const isEmpty=data.every(v=>v===0);
  return(
    <div className="card">
      {isEmpty
        ?<div className="empty-state" style={{padding:"16px 0"}}><div className="et">{emptyText}</div></div>
        :<>
          <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
            <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"
              points={data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v/max)*(h-8))-4}`).join(" ")}/>
            <polyline fill={`${color}22`} stroke="none"
              points={`0,${h} ${data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v/max)*(h-8))-4}`).join(" ")} ${w},${h}`}/>
            {data.map((v,i)=>{
              const x=(i/(data.length-1))*w;
              const y=h-((v/max)*(h-8))-4;
              return i===data.length-1?<circle key={i} cx={x} cy={y} r="4" fill={color}/>:null;
            })}
          </svg>
        </>
      }
      {/* 날짜 + 수치 */}
      <div className="graph-dots-row">
        {dates.map((d,i)=>(
          <div key={d} className="graph-dot-item">
            <div className="graph-dot-val">{data[i].toLocaleString()}</div>
            <div className="graph-dot-date">{d.replace("3/","").split("(")[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 도넛 ─────────────────────────────────────────────────────────────────────
function DonutChart({data}){
  const total=data.reduce((s,d)=>s+(d.pct||0),0);
  if(total===0) return(
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18"/>
      <circle cx="50" cy="50" r="31" fill="var(--ink2)"/>
    </svg>
  );
  let offset=0;const r=40;const c=50;const circ=2*Math.PI*r;
  return(
    <svg width="100" height="100" viewBox="0 0 100 100">
      {data.map((d,i)=>{
        const dash=(d.pct/total)*circ;const gap=circ-dash;
        const el=<circle key={i} cx={c} cy={c} r={r} fill="none" stroke={d.color} strokeWidth="18"
          strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}
          style={{transform:"rotate(-90deg)",transformOrigin:"50% 50%"}}/>;
        offset+=dash;return el;
      })}
      <circle cx={c} cy={c} r={31} fill="var(--ink2)"/>
    </svg>
  );
}

// ─── 로그인 ───────────────────────────────────────────────────────────────────
function LoginPage({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);const[loading,setLoading]=useState(false);
  function tryLogin(){
    if(pw==="chungi2026"){setLoading(true);setTimeout(()=>{setLoading(false);onLogin();},800);}
    else{setErr(true);setTimeout(()=>setErr(false),1800);}
  }
  return(
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px"}}>
      <div style={{fontSize:48,marginBottom:16}}>🔐</div>
      <div style={{fontSize:22,fontWeight:900,color:"var(--gold)",marginBottom:4}}>天機 관리자</div>
      <div style={{fontSize:12,color:"var(--mist)",marginBottom:28}}>관리자만 접근 가능합니다</div>
      <input className="inp" type="password" placeholder="비밀번호 입력" value={pw} onChange={e=>setPw(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&tryLogin()}
        style={{marginBottom:12,borderColor:err?"rgba(244,124,90,0.6)":""}}/>
      {err&&<div style={{fontSize:11,color:"var(--coral)",marginBottom:10}}>⚠️ 비밀번호가 틀렸습니다</div>}
      {loading?<div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
      :<button className="btn btn-c" style={{width:"100%",justifyContent:"center",padding:"13px"}} onClick={tryLogin}>로그인</button>}
    </div>
  );
}

// ─── 대시보드 ─────────────────────────────────────────────────────────────────
function DashboardTab(){
  const S=DUMMY_ON?DUMMY_STATS:{visitors:0,signups:0,revenue:0,payments:0,visitors_change:0,signups_change:0,revenue_change:0,payments_change:0};
  const weekV=DUMMY_ON?DUMMY_WEEK_V:ZERO_WEEK;
  const weekR=DUMMY_ON?DUMMY_WEEK_R:ZERO_WEEK;
  const notifs=DUMMY_ON?DUMMY_NOTIF:[{icon:"🔔",msg:"서비스가 시작됐습니다!",time:"방금 전",type:"시스템"}];
  const revCat=DUMMY_ON?[
    {name:"사주 계열",color:"var(--gold)",pct:42},{name:"관상 계열",color:"var(--blush)",pct:23},
    {name:"연애·궁합",color:"var(--violet)",pct:16},{name:"파동성명학",color:"var(--coral)",pct:9},
    {name:"기질도·뇌과학",color:"var(--jade)",pct:10},
  ]:[
    {name:"사주 계열",color:"var(--gold)",pct:0},{name:"관상 계열",color:"var(--blush)",pct:0},
    {name:"연애·궁합",color:"var(--violet)",pct:0},{name:"파동성명학",color:"var(--coral)",pct:0},
    {name:"기질도·뇌과학",color:"var(--jade)",pct:0},
  ];
  return(
    <div className="page">
      {DUMMY_ON&&<div style={{background:"rgba(155,143,212,0.08)",border:"1px solid rgba(155,143,212,0.18)",borderRadius:11,padding:"8px 14px",margin:"4px 18px 4px",fontSize:11,color:"var(--violet)"}}>
        🎭 더미 데이터 표시 중 — 코딩 완료 후 실제 데이터로 교체됩니다
      </div>}
      <div className="sec"><div className="sec-t">📊 오늘의 현황</div></div>
      <div className="stat-grid">
        {[
          {label:"오늘 방문자",cls:"gold",  val:S.visitors.toLocaleString(), chg:S.visitors_change},
          {label:"신규 가입",  cls:"jade",  val:`${S.signups}명`,            chg:S.signups_change},
          {label:"오늘 매출",  cls:"blush", val:S.revenue>0?`${(S.revenue/10000).toFixed(1)}만`:"0원", chg:S.revenue_change},
          {label:"결제 건수",  cls:"violet",val:`${S.payments}건`,           chg:S.payments_change||0},
        ].map((s,i)=>(
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-value ${DUMMY_ON?s.cls:"zero"}`}>{s.val}</div>
            <div className={`stat-change ${s.chg>0?"up":"none"}`}>{s.chg>0?`▲ ${s.chg}% 어제 대비`:"데이터 없음"}</div>
          </div>
        ))}
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">📈 주간 방문자 추이</div></div>
      <div className="chart-wrap">
        <GraphCard data={weekV} dates={WEEK_DATES} color="var(--gold)" emptyText="방문 데이터가 쌓이면 나타납니다"/>
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">💰 주간 매출 추이</div></div>
      <div className="chart-wrap">
        <GraphCard data={weekR} dates={WEEK_DATES} color="var(--jade)" emptyText="매출 데이터가 쌓이면 나타납니다"/>
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">🥧 매출 카테고리 분포</div></div>
      <div className="chart-wrap">
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <DonutChart data={revCat}/>
            <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
              {revCat.map(d=>(
                <div key={d.name} style={{display:"flex",alignItems:"center",gap:8,fontSize:11}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:d.color,flexShrink:0}}/>
                  <div style={{flex:1,color:"var(--mist)"}}>{d.name}</div>
                  <div style={{fontWeight:700,color:d.pct>0?d.color:"rgba(200,196,216,0.3)"}}>{d.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">🔔 실시간 알림</div></div>
      <div style={{padding:"0 18px 24px"}}>
        <div className="card">
          {notifs.map((n,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<notifs.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{n.msg}</div><div style={{fontSize:10,color:"var(--mist)",marginTop:2}}>{n.time}</div></div>
              <span className={`bdg ${n.type==="환불"?"bdg-r":n.type==="가입"?"bdg-g":n.type==="시스템"?"bdg-v":"bdg-y"}`}>{n.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 회원 탭 ─────────────────────────────────────────────────────────────────
function MembersTab(){
  const[filter,setFilter]=useState("전체");
  const[search,setSearch]=useState("");
  const[selected,setSelected]=useState(null);
  const[showTypes,setShowTypes]=useState(false);
  const filters=["전체","🐉 천기인","💫 북극성","🌟 샛별","⭐ 별","🌙 달빛","🛍️ 개운러","🌱 새싹"];
  const members = DUMMY_ON ? DUMMY_MEMBERS : [];

  const totalMembers = DUMMY_ON ? 2847 : 0;
  const vvipCount = DUMMY_ON ? 3 : 0;
  const mvpCount  = DUMMY_ON ? 1 : 0;
  const vipCount  = DUMMY_ON ? 45 : 0;

  const filtered = members.filter(m=>{
    const mf = filter==="전체" || m.tags.includes(filter);
    const ms = !search || m.name.includes(search) || m.email.includes(search);
    return mf && ms;
  });

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">👥 회원 관리 <button className="sec-t-btn" onClick={()=>setShowTypes(v=>!v)}>등급 설명</button></div></div>

      <div className="stat-grid" style={{marginBottom:4}}>
        <div className="stat-card gold"><div className="stat-label">전체 회원</div><div className={`stat-value ${DUMMY_ON?"gold":"zero"}`}>{totalMembers.toLocaleString()}</div><div className={`stat-change ${DUMMY_ON?"up":"none"}`}>{DUMMY_ON?"▲ 87명 오늘":"서비스 시작 전"}</div></div>
        <div className="stat-card jade"><div className="stat-label">🌟 샛별 이상</div><div className={`stat-value ${DUMMY_ON?"jade":"zero"}`}>{DUMMY_ON?`${vvipCount+mvpCount+vipCount}명`:"0"}</div><div className={`stat-change ${DUMMY_ON?"up":"none"}`}>{DUMMY_ON?`전체의 ${(((vvipCount+mvpCount+vipCount)/totalMembers)*100).toFixed(1)}%`:"전체의 0%"}</div></div>
      </div>

      {/* 회원 등급 설명 */}
      {showTypes&&(
        <div style={{padding:"0 18px 4px"}}>
          <div className="card">
            <div style={{fontSize:11,fontWeight:900,color:"var(--gold)",marginBottom:10}}>✦ 이용 등급 (고객에게 보임)</div>
            {Object.entries(MEMBER_TYPES).map(([k,v])=>(
              <div key={k} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{flexShrink:0,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.06)",color:v.color,border:`1px solid ${v.color}33`,whiteSpace:"nowrap"}}>{v.label}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:"rgba(200,196,216,0.4)",marginBottom:1}}>{v.cond}</div>
                  <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.5}}>{v.desc}</div>
                </div>
              </div>
            ))}
            <div style={{fontSize:11,fontWeight:900,color:"var(--gold)",margin:"12px 0 8px"}}>✦ 공유 배지 (별도 표시)</div>
            {Object.entries(SHARE_BADGES).map(([k,v])=>(
              <div key={k} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{flexShrink:0,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.06)",color:v.color,border:`1px solid ${v.color}33`,whiteSpace:"nowrap"}}>{v.label}</span>
                <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.5}}>{v.desc}</div>
              </div>
            ))}
            <div style={{fontSize:10,color:"rgba(200,196,216,0.3)",marginTop:8}}>
              * 전체 콘텐츠 유료 합산: 관상짤 380 + 유료×22개 + 프리미엄×2개 = 약 22,940원
            </div>
          </div>
        </div>
      )}

      <div className="divider"/>

      <div style={{padding:"14px 18px 8px"}}>
        <input className="inp" placeholder="🔍 이름, 이메일 검색" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:10}}/>
        <div className="filter-row">
          {filters.map(f=><button key={f} className={`filter-chip${filter===f?" on":""}`} onClick={()=>setFilter(f)}>{f}</button>)}
        </div>
      </div>

      <div style={{padding:"0 18px 24px"}}>
        {filtered.length===0
          ?<div className="card"><div className="empty-state"><div className="ei">👥</div><div className="et">해당 조건의 회원이 없어요</div></div></div>
          :<div className="card">
            {filtered.map((m,i)=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,0.04)":"none",cursor:"pointer"}} onClick={()=>setSelected(m)}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"var(--ink3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,border:"1px solid rgba(255,255,255,0.06)"}}>{m.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{m.name}</div>
                  <div style={{fontSize:10,color:"var(--mist)",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.email}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {m.tags.map(t=><span key={t} className={`bdg ${MEMBER_TYPES[t]?.bdg||"bdg-g"}`} style={{fontSize:9}}>{t}</span>)}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:900,color:"var(--gold)"}}>{m.totalPaid.toLocaleString()}원</div>
                  <div style={{fontSize:10,color:"var(--mist)",marginTop:2}}>{m.lastVisit}</div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* 공유 배지 실물 발송 관리 */}
      <div style={{padding:"0 18px 24px"}}>
        <div style={{fontSize:13,fontWeight:900,marginBottom:10,display:"flex",alignItems:"center",gap:7,color:"var(--gold)"}}>
          📦 공유 배지 실물 발송 관리
          <span style={{flex:1,height:1,background:"linear-gradient(to right,rgba(232,200,122,0.15),transparent)",display:"block"}}/>
        </div>

        {/* 발송 대상 — 홍보대사·인플루언서만 실물 */}
        {[
          {key:"인플루언서", badge:SHARE_BADGES["인플루언서"], gift:"명패 실물", members:[
            // 실제 DB 연동 시 채워짐
          ]},
          {key:"홍보대사",   badge:SHARE_BADGES["홍보대사"],   gift:"키링 실물", members:[
            // 실제 DB 연동 시 채워짐
          ]},
          {key:"전파자",     badge:SHARE_BADGES["전파자"],     gift:"디지털 부적", members:[
            {name:"김지연", sent:false, addrOk:false, tracking:""},
            {name:"정유진", sent:false, addrOk:false, tracking:""},
          ]},
          {key:"공유자",     badge:SHARE_BADGES["공유자"],     gift:"쿠폰 자동지급", members:[
            {name:"이수민", sent:true,  addrOk:true,  tracking:"자동"},
            {name:"박채원", sent:true,  addrOk:true,  tracking:"자동"},
            {name:"한소희", sent:false, addrOk:false, tracking:""},
            {name:"윤아름", sent:false, addrOk:false, tracking:""},
          ]},
        ].map(({key,badge,gift,members})=>(
          <div key={key} className="card" style={{marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.06)",color:badge.color,border:`1px solid ${badge.color}33`}}>{badge.label}</span>
              <span style={{fontSize:10,color:"var(--jade)",fontWeight:700}}>🎁 {gift}</span>
              <span style={{marginLeft:"auto",fontSize:10,color:"var(--mist)"}}>{members.length}명</span>
            </div>
            {members.length===0
              ?<div style={{fontSize:11,color:"rgba(200,196,216,0.3)",paddingBottom:4}}>해당 회원 없음</div>
              :members.map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:3}}>{m.name}</div>
                    <div style={{display:"flex",gap:5}}>
                      <span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:10,
                        background:m.addrOk?"rgba(95,196,158,0.15)":"rgba(244,124,90,0.15)",
                        color:m.addrOk?"var(--jade)":"var(--coral)"}}>
                        {m.addrOk?"주소 수집":"주소 미수집"}
                      </span>
                      <span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:10,
                        background:m.sent?"rgba(95,196,158,0.15)":"rgba(255,255,255,0.06)",
                        color:m.sent?"var(--jade)":"var(--mist)"}}>
                        {m.sent?"발송 완료":"미발송"}
                      </span>
                      {m.tracking&&m.tracking!=="자동"&&<span style={{fontSize:9,color:"var(--mist)"}}>📦 {m.tracking}</span>}
                    </div>
                  </div>
                  {!m.sent&&m.addrOk&&(
                    <button style={{padding:"5px 10px",borderRadius:8,border:"none",background:"var(--jade)",color:"var(--ink)",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                      발송 처리
                    </button>
                  )}
                  {!m.sent&&!m.addrOk&&(
                    <button style={{padding:"5px 10px",borderRadius:8,border:"1px solid rgba(244,124,90,0.3)",background:"transparent",color:"var(--coral)",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                      주소 요청
                    </button>
                  )}
                  {m.sent&&<span style={{fontSize:18}}>✅</span>}
                </div>
              ))
            }
          </div>
        ))}

        <div style={{fontSize:10,color:"rgba(200,196,216,0.3)",textAlign:"center",paddingTop:4}}>
          실제 서비스 오픈 후 DB 연동 시 자동으로 채워져요
        </div>
      </div>
      {selected&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
          <div className="md"><div className="hd"/>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:44,marginBottom:8}}>{selected.emoji}</div>
              <div style={{fontSize:18,fontWeight:900}}>{selected.name}</div>
              <div style={{fontSize:12,color:"var(--mist)",marginTop:3}}>{selected.email}</div>
              <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
                {selected.tags.map(t=><span key={t} className={`bdg ${MEMBER_TYPES[t]?.bdg||"bdg-g"}`}>{t}</span>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[["💰 총 결제",`${selected.totalPaid.toLocaleString()}원`,"var(--gold)"],
                ["📍 유입경로",selected.inflow,"var(--jade)"],
                ["📅 가입일",selected.joinDate,"var(--mist)"],
                ["🕐 최근방문",selected.lastVisit,"var(--mist)"]].map(([l,v,c])=>(
                <div key={l} style={{background:"var(--ink3)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"var(--mist)",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:11,fontWeight:700,color:c,lineHeight:1.3}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{background:"var(--ink3)",borderRadius:13,padding:"12px",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:7}}>✦ 운세 프로필</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[["🩸",selected.blood+"형"],["🐯",selected.ddi+"띠"],["⭐",selected.zodiac],["☯️",selected.gijildo]].map(([ic,v])=>(
                  <span key={v} style={{padding:"3px 9px",background:"var(--ink4)",borderRadius:20,fontSize:11,fontWeight:700}}>{ic} {v}</span>
                ))}
              </div>
            </div>
            <div style={{background:"var(--ink3)",borderRadius:13,padding:"12px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:7}}>✦ 이용 콘텐츠</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {selected.contents.map((c,i)=><span key={i} className="bdg bdg-y">{c}</span>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setSelected(null)}>닫기</button>
              <button className="btn btn-c" style={{justifyContent:"center"}}>광고 타겟 추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 매출 탭 ─────────────────────────────────────────────────────────────────
function RevenueTab(){
  const[period,setPeriod]=useState("오늘");
  const periods=["오늘","이번주","이번달","전체"];
  const revAmt = DUMMY_ON ? DUMMY_REVENUE[period] : 0;
  const contentsRev = DUMMY_ON ? DUMMY_CONTENTS_REV : [];
  const goodsRev = DUMMY_ON ? DUMMY_GOODS_REV : [];
  const payMethods = DUMMY_ON
    ? [{name:"카카오페이",pct:58,color:"#FEE500"},{name:"네이버페이",pct:27,color:"var(--jade)"},{name:"핸드폰 결제",pct:15,color:"var(--violet)"}]
    : [{name:"카카오페이",pct:0,color:"#FEE500"},{name:"네이버페이",pct:0,color:"var(--jade)"},{name:"핸드폰 결제",pct:0,color:"var(--violet)"}];

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">💰 매출 현황</div></div>
      <div style={{padding:"0 18px 12px"}}>
        <div className="filter-row">
          {periods.map(p=><button key={p} className={`filter-chip${period===p?" on":""}`} onClick={()=>setPeriod(p)}>{p}</button>)}
        </div>
        <div className="card" style={{textAlign:"center",padding:"22px"}}>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:6}}>{period} 총 매출</div>
          <div style={{fontSize:34,fontWeight:900,color:revAmt>0?"var(--gold2)":"rgba(200,196,216,0.2)"}}>{revAmt.toLocaleString()}원</div>
          {DUMMY_ON&&<div style={{fontSize:11,color:"var(--jade)",marginTop:4}}>▲ 전기 대비 +18.7%</div>}
        </div>
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">📊 콘텐츠별 매출</div></div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="card">
          {contentsRev.length===0
            ?<div className="empty-state"><div className="ei">📊</div><div className="et">결제가 발생하면 나타납니다</div></div>
            :<table className="tbl">
              <thead><tr><th>콘텐츠</th><th>건수</th><th>매출</th></tr></thead>
              <tbody>{contentsRev.sort((a,b)=>b.revenue-a.revenue).map(c=>(
                <tr key={c.name}><td style={{fontWeight:700}}>{c.name}</td><td style={{color:"var(--mist)"}}>{c.count}</td><td style={{color:"var(--gold)",fontWeight:700}}>{c.revenue.toLocaleString()}원</td></tr>
              ))}</tbody>
            </table>
          }
        </div>
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">🛍️ 굿즈 판매 순위</div></div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="card">
          {goodsRev.length===0
            ?<div className="empty-state"><div className="ei">🛍️</div><div className="et">굿즈 판매가 발생하면 나타납니다</div></div>
            :<table className="tbl">
              <thead><tr><th>상품</th><th>판매</th><th>재고</th></tr></thead>
              <tbody>{goodsRev.map(g=>(
                <tr key={g.name}>
                  <td><div style={{fontWeight:700,fontSize:11}}>{g.name}</div><div style={{fontSize:10,color:"var(--mist)"}}>{g.cat}</div></td>
                  <td style={{color:"var(--jade)",fontWeight:700}}>{g.sold}</td>
                  <td><span className={`bdg ${g.stock<30?"bdg-r":"bdg-g"}`}>{g.stock}</span></td>
                </tr>
              ))}</tbody>
            </table>
          }
        </div>
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">💳 결제 수단별</div></div>
      <div style={{padding:"0 18px 24px"}}>
        <div className="card">
          {payMethods.map(p=>(
            <div className="chart-bar-row" key={p.name}>
              <div className="chart-bar-label">{p.name}</div>
              <div className="chart-bar-track"><div className="chart-bar-fill" style={{width:`${p.pct}%`,background:p.color}}/></div>
              <div className="chart-bar-val">{p.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 유입경로 탭 ─────────────────────────────────────────────────────────────
function InflowTab(){
  const[portal,setPortal]=useState("naver");
  const portalInfo={
    naver: {name:"네이버",color:"#03C75A",icon:"🟢"},
    google:{name:"구글",  color:"#4285F4",icon:"🔵"},
    kakao: {name:"카카오",color:"#FEE500",icon:"🟡"},
    insta: {name:"인스타",color:"#E1306C",icon:"📸"},
    youtube:{name:"유튜브",color:"#FF0000",icon:"🔴"},
  };

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">📍 유입 경로</div></div>

      <div className="notice" style={{margin:"0 18px 8px"}}>
        <strong>💡 UTM 파라미터로 자동 수집</strong><br/>
        인스타 링크: <span style={{color:"var(--gold)"}}>?utm_source=instagram</span><br/>
        카카오 공유: <span style={{color:"var(--gold)"}}>?utm_source=kakao</span>
      </div>

      {/* 채널별 방문 */}
      <div className="sec"><div className="sec-t">🌐 채널별 방문수</div></div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="card">
          {INFLOW_SOURCES.map(s=>(
            <div className="chart-bar-row" key={s.id}>
              <div style={{display:"flex",alignItems:"center",gap:5,minWidth:80,flexShrink:0}}>
                <span style={{fontSize:13}}>{s.icon}</span>
                <span style={{fontSize:10,color:"var(--mist)"}}>{s.source}</span>
              </div>
              <div className="chart-bar-track"><div className="chart-bar-fill" style={{width:"0%",background:s.color}}/></div>
              <div className="chart-bar-val">0</div>
            </div>
          ))}
          <div className="empty-state" style={{paddingTop:12}}>
            <div className="et">서비스 오픈 후 유입 데이터가 쌓입니다</div>
          </div>
        </div>
      </div>

      <div className="divider"/>

      {/* 포털별 검색어 */}
      <div className="sec"><div className="sec-t">🔍 포털별 검색 키워드</div></div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="portal-tab-row">
          {Object.entries(portalInfo).map(([id,p])=>(
            <button key={id} className={`portal-tab ${id}${portal===id?" on":""}`} onClick={()=>setPortal(id)}>
              {p.icon} {p.name}
            </button>
          ))}
        </div>
        <div className="card">
          <div style={{fontSize:11,fontWeight:700,color:portalInfo[portal].color,marginBottom:10}}>
            {portalInfo[portal].icon} {portalInfo[portal].name} 검색 키워드 TOP 5
          </div>
          {PORTAL_KEYWORDS[portal].map((k,i)=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<PORTAL_KEYWORDS[portal].length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{width:22,height:22,borderRadius:8,background:"var(--ink4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"var(--mist)",flexShrink:0}}>{i+1}</div>
              <div style={{flex:1,fontSize:12,fontWeight:700}}>{k}</div>
              <div style={{fontSize:12,fontWeight:900,color:"rgba(200,196,216,0.3)"}}>0회</div>
            </div>
          ))}
          <div className="empty-state" style={{paddingTop:8}}>
            <div className="et">검색 콘솔 연동 후 실제 키워드 집계됩니다</div>
          </div>
        </div>
      </div>

      <div className="divider"/>

      {/* 결과 공유 현황 */}
      <div className="sec"><div className="sec-t">🔗 결과 공유 현황</div></div>
      <div style={{padding:"0 18px 24px"}}>
        <div className="card">
          {[["🟡","카카오 공유",0],["📸","인스타 저장",0],["🔗","링크 복사",0],["💾","이미지 저장",0]].map(([ic,name,cnt],i,arr)=>(
            <div key={name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <span style={{fontSize:18,flexShrink:0}}>{ic}</span>
              <div style={{flex:1,fontSize:13,fontWeight:700}}>{name}</div>
              <div style={{fontSize:14,fontWeight:900,color:"rgba(200,196,216,0.3)"}}>{cnt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 내보내기 탭 ─────────────────────────────────────────────────────────────
function ExportTab(){
  const[done,setDone]=useState("");
  const[exportModal,setExportModal]=useState(false);
  const[exported,setExported]=useState(false);
  const[filters,setFilters]=useState({
    age:"전체",gender:"전체",region:"전체",
    blood:"전체",ddi:"전체",zodiac:"전체",
    content:"전체",tag:"전체",portal:"전체",
    gijildo:"전체",interest:"전체",visit:"전체",
  });

  function dl(filename,headers,rows,key){
    downloadCSV(filename,headers,rows);
    setDone(key);setTimeout(()=>setDone(""),2000);
  }

  const exports=[
    {key:"member",    icon:"👥", label:"회원 전체 목록",      sub:"이름·이메일·가입일·결제금액·프로필",   filename:"천기_회원전체.csv",headers:["이름","이메일","가입일","총결제","혈액형","띠","별자리","기질도","유입경로","등급"],rows:[["데이터 없음","—","—","0","—","—","—","—","—","—"]]},
    {key:"vip",       icon:"⭐", label:"🌟 샛별 이상 회원",           sub:"총 결제 5만원 이상 · 샛별~천기인 등급",         filename:"천기_샛별이상회원.csv",headers:["이름","이메일","총결제"],rows:[["데이터 없음","—","0"]]},
    {key:"badge_send",icon:"📦", label:"공유배지 실물 발송 목록",  sub:"홍보대사(키링)·인플루언서(명패) 발송 관리",filename:"천기_공유배지발송.csv",headers:["이름","연락처","주소","배지등급","공유횟수","주소수집","발송여부","운송장번호"],rows:[["데이터 없음","—","—","—",0,"미수집","미발송","—"]]},
    {key:"badge_done",icon:"✅", label:"공유배지 발송 완료 목록", sub:"발송 처리 완료된 회원만",                  filename:"천기_공유배지발송완료.csv",headers:["이름","연락처","배지등급","운송장번호","발송일"],rows:[["데이터 없음","—","—","—","—"]]},
    {key:"revenue",   icon:"💰", label:"콘텐츠별 매출",        sub:"콘텐츠·결제건수·매출액",              filename:"천기_매출.csv",headers:["콘텐츠","카테고리","결제건수","매출액"],rows:ALL_CONTENTS.filter(c=>c.price>0).map(c=>[c.name,c.cat,0,0])},
    {key:"goods",     icon:"🛍️", label:"굿즈 판매 현황",       sub:"상품·판매수·매출·재고",               filename:"천기_굿즈.csv",headers:["상품명","카테고리","판매","매출","재고"],rows:[["데이터 없음","—",0,0,"—"]]},
    {key:"payment",   icon:"💳", label:"전체 결제 내역",        sub:"날짜·콘텐츠·금액·결제수단",           filename:"천기_결제내역.csv",headers:["날짜","콘텐츠","금액","결제수단","회원"],rows:[["데이터 없음","—",0,"—","—"]]},
    {key:"inflow",    icon:"📍", label:"유입경로 통계",         sub:"채널별 방문수·검색키워드",            filename:"천기_유입경로.csv",headers:["채널","방문수","비율(%)"],rows:INFLOW_SOURCES.map(s=>[s.source,0,0])},
    {key:"keyword",   icon:"🔍", label:"포털별 검색 키워드",    sub:"네이버·구글·카카오·인스타별",         filename:"천기_검색키워드.csv",headers:["포털","키워드","검색수"],rows:[["네이버","데이터 없음",0],["구글","데이터 없음",0]]},
    {key:"share",     icon:"🔗", label:"결과 공유 현황",        sub:"카카오·인스타·링크복사·이미지저장",   filename:"천기_공유현황.csv",headers:["공유채널","건수"],rows:[["카카오",0],["인스타",0],["링크복사",0],["이미지저장",0]]},
    {key:"settings",  icon:"⚙️", label:"콘텐츠 설정 현황",     sub:"콘텐츠·가격·활성화 여부",             filename:"천기_콘텐츠설정.csv",headers:["콘텐츠","카테고리","가격","상태"],rows:ALL_CONTENTS.map(c=>[c.name,c.cat,c.price,c.open?"활성":"준비중"])},
  ];

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">📤 데이터 내보내기</div></div>

      <div className="notice" style={{margin:"0 18px 8px"}}>
        <strong>📌 CSV 파일이란?</strong><br/>
        엑셀·구글 시트에서 바로 열리는 표 파일이에요.<br/>
        속 내용은 클순이 각 플랫폼 형식에 맞게 자동으로 만들어줘요 😄<br/>
        다운로드 후 → 카카오·Meta·구글·네이버·틱톡 광고 관리자에서 <strong>고객 목록 업로드</strong>로 활용!
      </div>

      <div style={{padding:"0 18px 4px"}}>
        <button className="btn btn-c btn-sm" style={{marginBottom:14,width:"100%",justifyContent:"center"}} onClick={()=>setExportModal(true)}>
          🎯 광고 타겟 맞춤 내보내기
        </button>

        <div className="card">
          {exports.map((e,i)=>(
            <div key={e.key} className="export-row" style={{borderBottom:i<exports.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{flex:1}}>
                <div className="export-label">{e.icon} {e.label}</div>
                <div className="export-sub">{e.sub}</div>
              </div>
              <button className="btn btn-j btn-sm" style={{flexShrink:0,marginLeft:10}}
                onClick={()=>dl(e.filename,e.headers,e.rows,e.key)}>
                {done===e.key?"✅":"⬇ CSV"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 광고 타겟 맞춤 내보내기 모달 */}
      {exportModal&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget){setExportModal(false);setExported(false);}}}>
          <div className="md">
            <div className="hd"/>
            <div className="mt">🎯 광고 타겟 맞춤 내보내기</div>
            <div className="ms">원하는 조건으로 회원 필터링 후 CSV 다운로드</div>
            {!exported?<>
              {[
                {label:"나이대",   key:"age",    opts:["전체","10대","20대","30대","40대","50대이상"]},
                {label:"성별",     key:"gender", opts:["전체","여성","남성"]},
                {label:"지역",     key:"region", opts:["전체","서울","경기","부산","인천","대구","대전","광주","기타"]},
                {label:"혈액형",   key:"blood",  opts:["전체","A형","B형","O형","AB형"]},
                {label:"띠",       key:"ddi",    opts:["전체","쥐띠","소띠","호랑이띠","토끼띠","용띠","뱀띠","말띠","양띠","원숭이띠","닭띠","개띠","돼지띠"]},
                {label:"별자리",   key:"zodiac", opts:["전체","양자리","황소자리","쌍둥이자리","게자리","사자자리","처녀자리","천칭자리","전갈자리","사수자리","염소자리","물병자리","물고기자리"]},
                {label:"기질도 유형",key:"gijildo",opts:["전체","화형(火·木)","수형(水·金)","음양형","복합형"]},
                {label:"관심사",   key:"interest",opts:["전체","연애·궁합","재물운","사주","관상","파동성명학","기질도","뇌과학분석","굿즈"]},
                {label:"이용 콘텐츠",key:"content",opts:["전체","관상짤","사주","연애운","파동성명학","기질도","뇌과학분석","🛍️ 개운러"]},
                {label:"유입 포털",key:"portal", opts:["전체","네이버","구글","카카오","인스타","유튜브","틱톡","직접방문"]},
                {label:"접속 패턴",key:"visit",  opts:["전체","매일 접속","주 3회+","월 1회+","7일이상 미접속"]},
                {label:"회원 등급",key:"tag",    opts:["전체","⭐ 별","🌱 새싹","🌙 달빛","🛍️ 개운러"]},
                // 플랫폼별 타겟 옵션
                {label:"📘 Meta 관심사",key:"meta_interest",opts:["선택안함","운세·점성술","자기계발","연애·관계","한국문화","뷰티·패션","영성·명상"]},
                {label:"🟢 네이버 타겟",key:"naver_target", opts:["선택안함","유사고객","리타겟팅","키워드연관"]},
                {label:"🟡 카카오 타겟",key:"kakao_target",  opts:["선택안함","카카오채널","친구톡","배너광고"]},
                {label:"🔵 구글 타겟",  key:"google_target",opts:["선택안함","유사잠재고객","리마케팅","키워드타겟"]},
                {label:"🎵 틱톡 타겟",  key:"tiktok_target",opts:["선택안함","맞춤타겟","유사타겟","관심사타겟"]},
                {label:"📺 유튜브 타겟",key:"yt_target",    opts:["선택안함","고객매칭","유사잠재고객","리마케팅"]},
              ].map(({label,key,opts})=>(
                <div key={key} style={{marginBottom:10}}>
                  <label style={{fontSize:11,color:label.startsWith("📘")||label.startsWith("🟢")||label.startsWith("🟡")||label.startsWith("🔵")||label.startsWith("🎵")||label.startsWith("📺")?"var(--gold)":"var(--mist)",fontWeight:700,display:"block",marginBottom:4}}>{label}</label>
                  <select className="inp sel" value={filters[key]||opts[0]} onChange={e=>setFilters(p=>({...p,[key]:e.target.value}))}>
                    {opts.map(v=><option key={v}>{v}</option>)}
                  </select>
                </div>
              ))}
              <div style={{background:"var(--ink3)",borderRadius:12,padding:"12px",margin:"8px 0 14px",textAlign:"center"}}>
                <div style={{fontSize:11,color:"var(--mist)",marginBottom:4}}>예상 대상 회원</div>
                <div style={{fontSize:24,fontWeight:900,color:"rgba(200,196,216,0.3)"}}>0명</div>
                <div style={{fontSize:10,color:"rgba(200,196,216,0.25)",marginTop:3}}>서비스 오픈 후 집계됩니다</div>
              </div>
              <button className="btn btn-c" style={{width:"100%",justifyContent:"center"}} onClick={()=>{
                downloadCSV("천기_광고타겟_맞춤.csv",
                  ["나이대","성별","지역","혈액형","띠","별자리","기질도","관심사","유입포털","등급"],
                  [["데이터 없음","—","—","—","—","—","—","—","—","—"]]
                );
                setExported(true);
              }}>CSV 다운로드</button>
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>setExportModal(false)}>취소</button>
            </>:<>
              <div style={{textAlign:"center",padding:"16px 0 8px"}}>
                <div style={{fontSize:52,marginBottom:10}}>✅</div>
                <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>내보내기 완료!</div>
                <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.6,marginBottom:12}}>
                  CSV 파일이 다운로드됐어요.<br/>각 광고 플랫폼에서 업로드하세요.
                </div>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:"var(--gold)",marginBottom:8}}>📌 플랫폼별 업로드 방법</div>
              {[
                {ic:"🟡",name:"카카오모먼트",  desc:"광고 관리자 → 맞춤 타겟 → 고객 파일 업로드",col:"#FEE500"},
                {ic:"📘",name:"Meta (인스타·페북)",desc:"광고 관리자 → 맞춤 타겟 → 고객 목록 업로드",col:"#4267B2"},
                {ic:"🔵",name:"구글·유튜브 Ads",desc:"고객 매칭 → 데이터 소스 → CSV 업로드",col:"#4285F4"},
                {ic:"🟢",name:"네이버 GFA",    desc:"광고 시스템 → 타겟 관리 → 고객 파일 업로드",col:"#03C75A"},
                {ic:"🎵",name:"틱톡 For Business",desc:"타겟 오디언스 → 고객 파일 → CSV 업로드",col:"#69C9D0"},
              ].map(p=>(
                <div key={p.name} style={{background:"var(--ink3)",borderRadius:11,padding:"10px 12px",marginBottom:7,display:"flex",alignItems:"flex-start",gap:9}}>
                  <span style={{fontSize:18,flexShrink:0}}>{p.ic}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:2,color:p.col}}>{p.name}</div>
                    <div style={{fontSize:11,color:"var(--mist)"}}>{p.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:11,padding:"10px 12px",marginTop:4,marginBottom:14}}>
                <div style={{fontSize:11,color:"var(--gold)",fontWeight:700,marginBottom:4}}>💡 CSV 형식 안내</div>
                <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.6}}>
                  파일 안에 이메일·전화번호 컬럼이 있으면 각 플랫폼이 자동으로 회원을 매칭해요.<br/>
                  매칭된 회원과 <strong style={{color:"var(--white)"}}>비슷한 신규 사용자</strong>에게도 광고 노출 가능 (유사 타겟)!
                </div>
              </div>
              <button className="btn btn-p" style={{width:"100%",justifyContent:"center",marginTop:14}} onClick={()=>{setExportModal(false);setExported(false);}}>확인</button>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 마케팅 탭 ───────────────────────────────────────────────────────────────
function MarketingTab(){
  const[toggles,setToggles]=useState({push:false,kakao:false,email:false,newbie:true,weekly:false,birthday:false});
  const[editNotif,setEditNotif]=useState(null);
  const[editCoupon,setEditCoupon]=useState(null);
  const[contentCoupons,setContentCoupons]=useState([...CONTENT_COUPONS_INIT]);
  const[goodsCoupons,setGoodsCoupons]=useState([...GOODS_COUPONS_INIT]);
  const[segments,setSegments]=useState([...DEFAULT_SEGMENTS]);
  const[addSegModal,setAddSegModal]=useState(false);
  const[newSeg,setNewSeg]=useState({label:"",color:"var(--blush)"});
  const[notifSettings,setNotifSettings]=useState({
    push:{title:"오늘의 운세가 도착했어요 🌙",time:"09:00",target:"전체"},
    kakao:{title:"천기 이벤트 안내",time:"10:00",target:"전체"},
    email:{title:"이번 주 천기 운세 요약",time:"월요일 08:00",target:"전체"},
    newbie:{title:"천기에 오신 걸 환영해요! 🔮",time:"가입 후 1시간",target:"🌱 새싹"},
    weekly:{title:"7일째 보고 싶었어요 😢",time:"미방문 7일째",target:"미방문"},
    birthday:{title:"생일 축하해요! 🎂 특별 쿠폰",time:"생일 당일",target:"생일"},
  });
  function toggle(key){setToggles(p=>({...p,[key]:!p[key]}));}

  function CouponSection({title,coupons,setCoupons}){
    return(
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:900,color:"var(--coral)",marginBottom:8,padding:"0 18px"}}>{title}</div>
        <div style={{padding:"0 18px"}}>
          <div className="card">
            {coupons.map((c,i)=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 0",borderBottom:i<coupons.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:1}}>{c.name}</div>
                  <div style={{fontSize:10,color:"var(--mist)"}}>
                    코드: <strong style={{color:"var(--gold)"}}>{c.code}</strong> · {c.discount} 할인
                    {c.minOrder>0?` · ${c.minOrder.toLocaleString()}원 이상`:""} · {c.expire}
                  </div>
                  <div style={{fontSize:10,color:"var(--mist)",marginTop:1}}>발급 {c.issued} · 사용 {c.used}</div>
                </div>
                <span className={`bdg ${c.active?"bdg-g":"bdg-r"}`} style={{flexShrink:0}}>{c.active?"활성":"비활성"}</span>
                <button className="btn btn-g btn-sm" onClick={()=>setEditCoupon({...c,_setter:setCoupons})}>수정</button>
              </div>
            ))}
            <button className="btn btn-p btn-sm" style={{marginTop:12,width:"100%",justifyContent:"center"}}>+ 새 쿠폰 만들기</button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="page">
      {/* 알림 설정 */}
      <div className="sec"><div className="sec-t">🔔 자동 알림 설정</div></div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="notice">
          <strong>💡 발송 채널 안내</strong><br/>
          카카오 가입 → 카카오 친구톡 발송 (오픈율 가장 높음!)<br/>
          구글·이메일 가입 → 이메일 발송<br/>
          전화번호 수집 시 → SMS 발송 가능
        </div>
        <div className="card">
          {[
            {key:"push",    label:"앱 푸시 알림",   sub:"오늘의 운세·타로 매일 발송"},
            {key:"kakao",   label:"카카오 친구톡",   sub:"카카오 가입 회원 대상 · 오픈율 40%+"},
            {key:"email",   label:"이메일 뉴스레터", sub:"구글·이메일 가입 회원 대상"},
            {key:"newbie",  label:"신규 가입 웰컴",  sub:"가입 후 1시간 내 자동 발송"},
            {key:"weekly",  label:"주간 리마인드",   sub:"7일 미방문 회원에게 발송"},
            {key:"birthday",label:"생일 쿠폰 발송",  sub:"생일 당일 특별 쿠폰 자동 발송"},
          ].map(t=>(
            <div key={t.key} className="toggle-row">
              <div style={{flex:1}}>
                <div className="toggle-label">{t.label}</div>
                <div className="toggle-sub">{t.sub}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <button className="btn btn-g btn-sm" onClick={()=>setEditNotif({key:t.key,...notifSettings[t.key]})}>수정</button>
                <button className={`toggle${toggles[t.key]?" on":""}`} onClick={()=>toggle(t.key)}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"/>

      {/* 쿠폰 — 콘텐츠 / 굿즈 분리 */}
      <div className="sec"><div className="sec-t">🎁 쿠폰 관리</div></div>
      <CouponSection title="💳 콘텐츠 쿠폰" coupons={contentCoupons} setCoupons={setContentCoupons}/>
      <CouponSection title="🛍️ 굿즈샵 쿠폰" coupons={goodsCoupons} setCoupons={setGoodsCoupons}/>

      <div className="divider"/>

      {/* 회원 세그먼트 */}
      <div className="sec">
        <div className="sec-t">
          🎯 회원 세그먼트
          <button className="sec-t-btn" onClick={()=>setAddSegModal(true)}>+ 추가</button>
        </div>
      </div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="notice">
          <strong>💡 활용 방법</strong><br/>
          <strong>푸시</strong> → 해당 세그먼트에 앱 알림·문자 발송<br/>
          <strong>내보내기</strong> → CSV 다운로드 → Meta·카카오·네이버 광고에 유사 타겟으로 업로드
        </div>
        <div className="card">
          {segments.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 0",borderBottom:i<segments.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{s.label}</div>
                <div style={{fontSize:10,color:s.color,fontWeight:700}}>{DUMMY_ON?s.count.toLocaleString():"0"}명</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                <button className="btn btn-sm btn-v" onClick={()=>alert(`"${s.label}" 세그먼트에 푸시를 발송합니다`)}>푸시</button>
                <button className="btn btn-sm btn-j" onClick={()=>{
                  downloadCSV(`천기_세그먼트_${s.label}.csv`,
                    ["이름","이메일","혈액형","띠","별자리","기질도","유입경로"],
                    DUMMY_MEMBERS.filter(()=>Math.random()>0.5).map(m=>[m.name,m.email,m.blood,m.ddi,m.zodiac,m.gijildo,m.inflow])
                  );
                }}>내보내기</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"/>

      {/* 알림 수정 모달 */}
      {editNotif&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setEditNotif(null);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🔔 알림 설정 수정</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>발송 메시지</label>
            <input className="inp" value={editNotif.title} onChange={e=>setEditNotif(p=>({...p,title:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>발송 시간</label>
            <input className="inp" value={editNotif.time} onChange={e=>setEditNotif(p=>({...p,time:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>발송 대상</label>
            <select className="inp sel" style={{marginBottom:16}} value={editNotif.target} onChange={e=>setEditNotif(p=>({...p,target:e.target.value}))}>
              {["전체","🌱 새싹","⭐ 별","🐉 천기인","💫 북극성","🌙 달빛","미방문","생일"].map(v=><option key={v}>{v}</option>)}
            </select>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setEditNotif(null)}>취소</button>
              <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>{
                setNotifSettings(p=>({...p,[editNotif.key]:{title:editNotif.title,time:editNotif.time,target:editNotif.target}}));
                setEditNotif(null);
              }}>저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 쿠폰 수정 모달 */}
      {editCoupon&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setEditCoupon(null);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🎁 쿠폰 수정</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>쿠폰 이름</label>
            <input className="inp" value={editCoupon.name} onChange={e=>setEditCoupon(p=>({...p,name:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>쿠폰 코드</label>
            <input className="inp" value={editCoupon.code} onChange={e=>setEditCoupon(p=>({...p,code:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>할인</label>
            <input className="inp" value={editCoupon.discount} onChange={e=>setEditCoupon(p=>({...p,discount:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>만료일</label>
            <input className="inp" value={editCoupon.expire} onChange={e=>setEditCoupon(p=>({...p,expire:e.target.value}))} style={{marginBottom:12}}/>
            <div className="toggle-row" style={{marginBottom:14,borderBottom:"none"}}>
              <div className="toggle-label">쿠폰 활성화</div>
              <button className={`toggle${editCoupon.active?" on":""}`} onClick={()=>setEditCoupon(p=>({...p,active:!p.active}))}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setEditCoupon(null)}>취소</button>
              <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>{
                if(editCoupon._setter) editCoupon._setter(prev=>prev.map(c=>c.id===editCoupon.id?editCoupon:c));
                setEditCoupon(null);
              }}>저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 세그먼트 추가 모달 */}
      {addSegModal&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setAddSegModal(false);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🎯 세그먼트 추가</div>
            <div className="ms">직접 타겟 조건을 입력해서 세그먼트를 만들어요</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>세그먼트 이름</label>
            <input className="inp" placeholder="예: 20대 여성 + 연애운 이용" value={newSeg.label} onChange={e=>setNewSeg(p=>({...p,label:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:8}}>색상 선택</label>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {["var(--blush)","var(--gold)","var(--jade)","var(--violet)","var(--coral)"].map(c=>(
                <div key={c} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:newSeg.color===c?"3px solid white":"3px solid transparent"}} onClick={()=>setNewSeg(p=>({...p,color:c}))}/>
              ))}
            </div>
            <div style={{background:"var(--ink3)",borderRadius:12,padding:"11px",marginBottom:14,fontSize:12}}>
              <div style={{color:"var(--mist)",marginBottom:3}}>미리보기:</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:newSeg.color}}/>
                <span style={{fontWeight:700}}>{newSeg.label||"세그먼트 이름"}</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setAddSegModal(false)}>취소</button>
              <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>{
                if(!newSeg.label.trim()) return;
                setSegments(prev=>[...prev,{id:Date.now(),label:newSeg.label,color:newSeg.color,count:0}]);
                setNewSeg({label:"",color:"var(--blush)"});
                setAddSegModal(false);
              }}>추가하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 설정 탭 ─────────────────────────────────────────────────────────────────
// ─── 굿즈 관리 탭 ─────────────────────────────────────────────────────────────
function GoodsMgrTab(){
  const SAMPLE_GOODS=[
    {id:1,icon:"🌿",name:"정화 쑥 인센스 번들",cat:"기운회복",price:11800,visible:true, rec:true,  stock:true},
    {id:2,icon:"🧿",name:"나자르 본주우 키링",  cat:"외국부적",price:4800, visible:true, rec:false, stock:true},
    {id:3,icon:"💫",name:"청룡형 그린 팔찌",   cat:"12수호신",price:14800,visible:true, rec:true,  stock:false},
    {id:4,icon:"🧧",name:"황금 미니 행운 부적", cat:"미니부적",price:5800, visible:false,rec:false, stock:true},
    {id:5,icon:"🌙",name:"문스톤 팔찌",        cat:"주얼리",  price:21800,visible:true, rec:false, stock:true},
    {id:6,icon:"🔮",name:"수정 구슬 키링",     cat:"기운보강",price:8800, visible:true, rec:true,  stock:true},
    {id:7,icon:"🕯️",name:"백단향 인센스 세트", cat:"명상향",  price:9800, visible:false,rec:false, stock:true},
    {id:8,icon:"🌸",name:"벚꽃 수호 팔찌",     cat:"시즌한정",price:12800,visible:true, rec:true,  stock:false},
  ];

  const[goods,setGoods]=useState(SAMPLE_GOODS);
  const[search,setSearch]=useState("");
  const[filterCat,setFilterCat]=useState("전체");
  const[filterVisible,setFilterVisible]=useState("전체");
  const[editId,setEditId]=useState(null);

  const cats=["전체",...new Set(SAMPLE_GOODS.map(g=>g.cat))];

  const filtered=goods.filter(g=>{
    const matchSearch=g.name.includes(search)||g.cat.includes(search);
    const matchCat=filterCat==="전체"||g.cat===filterCat;
    const matchVis=filterVisible==="전체"||(filterVisible==="공개"?g.visible:!g.visible);
    return matchSearch&&matchCat&&matchVis;
  });

  function toggle(id,field){
    setGoods(p=>p.map(g=>g.id===id?{...g,[field]:!g[field]}:g));
  }

  const visCount=goods.filter(g=>g.visible).length;
  const hidCount=goods.filter(g=>!g.visible).length;
  const noStockCount=goods.filter(g=>!g.stock).length;

  return(
    <div className="apage">
      <div className="asec"><div className="asec-t">🛍️ 굿즈 관리</div></div>

      {/* 요약 카드 */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,padding:"0 16px 14px"}}>
        {[
          {label:"전체",    val:goods.length,  color:"var(--gold)"},
          {label:"공개",    val:visCount,       color:"var(--jade)"},
          {label:"품절",    val:noStockCount,   color:"var(--coral)"},
        ].map(s=>(
          <div key={s.label} style={{background:"var(--c2)",borderRadius:12,padding:"12px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:18,fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:10,color:"var(--cm)",marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 검색 + 필터 */}
      <div style={{padding:"0 16px 10px"}}>
        <input
          placeholder="상품명·카테고리 검색"
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{width:"100%",padding:"10px 13px",background:"var(--c2)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,color:"var(--ct)",fontFamily:"inherit",fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:8}}
        />
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["전체","공개","비공개"].map(f=>(
            <button key={f} onClick={()=>setFilterVisible(f)}
              style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:filterVisible===f?"var(--ca)":"var(--c2)",color:filterVisible===f?"var(--c1)":"var(--cm)"}}>
              {f}
            </button>
          ))}
          <div style={{width:1,background:"rgba(255,255,255,0.06)",margin:"0 2px"}}/>
          {cats.slice(0,5).map(c=>(
            <button key={c} onClick={()=>setFilterCat(c)}
              style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:filterCat===c?"rgba(232,200,122,0.2)":"var(--c2)",color:filterCat===c?"var(--ca)":"var(--cm)"}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 일괄 처리 */}
      <div style={{padding:"0 16px 10px",display:"flex",gap:8}}>
        <button onClick={()=>setGoods(p=>p.map(g=>({...g,visible:true})))}
          style={{padding:"7px 14px",borderRadius:10,fontSize:11,fontWeight:700,border:"1px solid rgba(95,196,158,0.3)",background:"rgba(95,196,158,0.1)",color:"var(--cj)",cursor:"pointer",fontFamily:"inherit"}}>
          전체 공개
        </button>
        <button onClick={()=>setGoods(p=>p.map(g=>({...g,visible:false})))}
          style={{padding:"7px 14px",borderRadius:10,fontSize:11,fontWeight:700,border:"1px solid rgba(244,124,90,0.3)",background:"rgba(244,124,90,0.1)",color:"var(--co)",cursor:"pointer",fontFamily:"inherit"}}>
          전체 비공개
        </button>
        <div style={{marginLeft:"auto",fontSize:11,color:"var(--cm)",display:"flex",alignItems:"center"}}>
          {filtered.length}개 표시
        </div>
      </div>

      {/* 상품 목록 */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8,paddingBottom:80}}>
        {filtered.map(g=>(
          <div key={g.id} style={{background:"var(--c2)",borderRadius:14,padding:"12px 14px",border:`1px solid ${g.visible?"rgba(255,255,255,0.06)":"rgba(244,124,90,0.15)"}`,opacity:g.visible?1:0.65}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:28,flexShrink:0,width:44,height:44,borderRadius:10,background:"var(--c3)",display:"flex",alignItems:"center",justifyContent:"center"}}>{g.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:2,display:"flex",alignItems:"center",gap:6}}>
                  {g.name}
                  {!g.stock&&<span style={{fontSize:9,fontWeight:700,background:"rgba(244,124,90,0.2)",color:"var(--co)",padding:"1px 6px",borderRadius:8}}>품절</span>}
                  {g.rec&&<span style={{fontSize:9,fontWeight:700,background:"rgba(232,200,122,0.15)",color:"var(--ca)",padding:"1px 6px",borderRadius:8}}>추천</span>}
                </div>
                <div style={{fontSize:10,color:"var(--cm)"}}>{g.cat} · {g.price.toLocaleString()}원</div>
              </div>
            </div>
            {/* 토글 컨트롤 */}
            <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
              {[
                {label:"공개", field:"visible",  on:g.visible, onColor:"var(--cj)", offColor:"var(--co)"},
                {label:"추천", field:"rec",      on:g.rec,     onColor:"var(--ca)", offColor:"var(--cm)"},
                {label:"재고", field:"stock",    on:g.stock,   onColor:"var(--cj)", offColor:"var(--co)"},
              ].map(t=>(
                <button key={t.field} onClick={()=>toggle(g.id,t.field)}
                  style={{flex:1,padding:"6px",borderRadius:8,border:`1px solid ${t.on?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.04)"}`,background:t.on?"rgba(255,255,255,0.06)":"transparent",color:t.on?t.onColor:t.offColor,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .18s"}}>
                  {t.label}: {t.on?"ON":"OFF"}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"48px 0",color:"var(--cm)",fontSize:13}}>
            <div style={{fontSize:36,marginBottom:8}}>🔍</div>
            검색 결과가 없어요
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({onLogout}){
  const[prices,setPrices]=useState(()=>{const p={};ALL_CONTENTS.forEach(c=>{p[c.id]=c.price;});return p;});
  const[contentToggles,setContentToggles]=useState(()=>{const t={};ALL_CONTENTS.forEach(c=>{t[c.id]=c.open;});return t;});
  const[notice,setNotice]=useState("🎋 2026 병오년 신년 특가 이벤트 진행 중!");
  const[noticeOn,setNoticeOn]=useState(true);
  const[editNotice,setEditNotice]=useState(false);
  const[noticeTemp,setNoticeTemp]=useState("");
  const[saved,setSaved]=useState("");
  const[savedFeedback,saveFeedback]=useSaved();
  const catGroups=["매일무료","무료","유료","준비중","프리미엄"];
  const catLabel={매일무료:"🌙 매일 무료",무료:"🎁 무료",유료:"💳 유료",준비중:"⏳ 준비중 (미오픈)",프리미엄:"⭐ 프리미엄"};

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">⚙️ 서비스 설정</div></div>

      <div className="divider"/>

      {/* 가격 설정 */}
      <div className="sec"><div className="sec-t">💰 가격 설정</div></div>
      <div style={{padding:"0 18px 4px"}}>
        {catGroups.filter(cat=>ALL_CONTENTS.some(c=>c.cat===cat&&c.price>0)).map(cat=>{
          const items=ALL_CONTENTS.filter(c=>c.cat===cat&&c.price>0);
          return(
            <div key={cat} style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:900,color:"var(--coral)",marginBottom:8}}>{catLabel[cat]}</div>
              <div className="card">
                {items.map((c,i)=>(
                  <div key={c.id} style={{paddingBottom:i<items.length-1?12:0,marginBottom:i<items.length-1?12:0,borderBottom:i<items.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{fontSize:12,fontWeight:700}}>{c.name}</div>
                      {!c.open&&<span className="bdg bdg-v">미오픈</span>}
                    </div>
                    <input className="inp" type="number" value={prices[c.id]} onChange={e=>setPrices(p=>({...p,[c.id]:Number(e.target.value)}))} style={{marginBottom:0}}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button className="btn btn-p btn-sm" style={{marginBottom:4,width:"100%",justifyContent:"center"}} onClick={()=>saveFeedback("가격")}>
          {savedFeedback==="가격"?"✓ 저장됨":"가격 저장하기"}
        </button>
      </div>

      <div className="divider"/>

      {/* 콘텐츠 활성화 */}
      <div className="sec"><div className="sec-t">🔮 콘텐츠 활성화</div></div>
      <div style={{padding:"0 18px 4px"}}>
        {catGroups.map(cat=>{
          const items=ALL_CONTENTS.filter(c=>c.cat===cat);
          return(
            <div key={cat} style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:900,color:"var(--coral)",marginBottom:8}}>
                {catLabel[cat]}
                <span style={{fontSize:10,color:"rgba(200,196,216,0.3)",fontWeight:400,marginLeft:6}}>
                  {items.filter(c=>contentToggles[c.id]).length}/{items.length} 활성
                </span>
              </div>
              <div className="card">
                {items.map(c=>(
                  <div key={c.id} className="toggle-row">
                    <div>
                      <div className="toggle-label">{c.name}</div>
                      {!c.open&&<div style={{fontSize:10,color:"var(--violet)",marginTop:2}}>준비중 — 활성화 시 즉시 오픈</div>}
                    </div>
                    <button className={`toggle${contentToggles[c.id]?" on":""}`} onClick={()=>setContentToggles(p=>({...p,[c.id]:!p[c.id]}))}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button className="btn btn-p btn-sm" style={{marginBottom:4,width:"100%",justifyContent:"center"}} onClick={()=>saveFeedback("콘텐츠")}>
          {savedFeedback==="콘텐츠"?"✓ 저장됨":"콘텐츠 설정 저장"}
        </button>
      </div>

      <div className="divider"/>

      {/* 공지 배너 */}
      <div className="sec"><div className="sec-t">📣 공지 배너</div></div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="card">
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:"var(--mist)",marginBottom:5,fontWeight:700}}>현재 공지 내용</div>
              <div style={{fontSize:13,fontWeight:700,lineHeight:1.5,color:"var(--gold2)"}}>{notice}</div>
            </div>
            <button className="btn btn-g btn-sm" onClick={()=>{setNoticeTemp(notice);setEditNotice(true);}}>수정</button>
          </div>
          <div className="toggle-row" style={{borderBottom:"none",padding:"8px 0 0"}}>
            <div><div className="toggle-label">홈 배너 노출</div><div className="toggle-sub">{noticeOn?"현재 노출 중":"현재 숨김"}</div></div>
            <button className={`toggle${noticeOn?" on":""}`} onClick={()=>setNoticeOn(v=>!v)}/>
          </div>
        </div>
      </div>

      <div className="divider"/>

      {/* 관리자 정보 */}
      <div className="sec"><div className="sec-t">👤 관리자 정보</div></div>
      <div style={{padding:"0 18px 8px"}}>
        <div className="card">
          {[["사이트 이름","천기 (天機)"],["관리자","윤규미"],["서비스 시작일","2026.04.01"],["총 누적 매출","₩0"],["총 콘텐츠",`${ALL_CONTENTS.length}개`]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:13}}>
              <span style={{color:"var(--mist)"}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"8px 18px 24px"}}>
        <button className="btn btn-g" style={{width:"100%",justifyContent:"center",color:"var(--coral)",borderColor:"rgba(244,124,90,0.2)"}} onClick={onLogout}>로그아웃</button>
      </div>

      {/* 공지 수정 모달 */}
      {editNotice&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setEditNotice(false);}}>
          <div className="md">
            <div className="hd"/>
            <div className="mt">📣 공지 배너 수정</div>
            <div className="ms">홈 상단에 표시될 공지 내용을 입력해주세요</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:6}}>공지 내용</label>
            <textarea className="inp" rows={3} value={noticeTemp} onChange={e=>setNoticeTemp(e.target.value)}
              style={{marginBottom:14,resize:"none",lineHeight:1.6}}/>
            <div style={{background:"var(--ink3)",borderRadius:12,padding:"10px 12px",marginBottom:14}}>
              <div style={{fontSize:10,color:"var(--mist)",marginBottom:4}}>미리보기</div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--gold2)"}}>{noticeTemp}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setEditNotice(false)}>취소</button>
              <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>{setNotice(noticeTemp);setEditNotice(false);}}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function AdminApp(){
  const[loggedIn,setLoggedIn]=useState(false);
  const[tab,setTab]=useState("dashboard");

  if(!loggedIn) return(
    <><style dangerouslySetInnerHTML={{__html:css}}/><div className="app"><LoginPage onLogin={()=>setLoggedIn(true)}/></div></>
  );

  const tabs=[
    {id:"dashboard", ic:"📊", lb:"대시보드"},
    {id:"members",   ic:"👥", lb:"회원"},
    {id:"revenue",   ic:"💰", lb:"매출"},
    {id:"inflow",    ic:"📍", lb:"유입경로"},
    {id:"goods_mgr", ic:"🛍️", lb:"굿즈관리"},
    {id:"export",    ic:"📤", lb:"내보내기"},
    {id:"marketing", ic:"📢", lb:"마케팅"},
    {id:"settings",  ic:"⚙️", lb:"설정"},
  ];

  return(
    <><style dangerouslySetInnerHTML={{__html:css}}/>
    <div className="app">
      <nav className="anav">
        <div className="anav-logo"><span className="anav-title">天機</span><span className="anav-badge">관리자</span></div>
        <div className="anav-user">👤 윤규미 · {new Date().toLocaleDateString("ko-KR")}</div>
      </nav>

      {tab==="dashboard"&&<DashboardTab/>}
      {tab==="members"  &&<MembersTab/>}
      {tab==="revenue"  &&<RevenueTab/>}
      {tab==="inflow"   &&<InflowTab/>}
      {tab==="goods_mgr"&&<GoodsMgrTab/>}
      {tab==="export"   &&<ExportTab/>}
      {tab==="marketing"&&<MarketingTab/>}
      {tab==="settings" &&<SettingsTab onLogout={()=>setLoggedIn(false)}/>}

      <nav className="abtab">
        {tabs.map(t=>(
          <button key={t.id} className={`ati${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
            <span className="ati-ic">{t.ic}</span><span className="ati-lb">{t.lb}</span>
          </button>
        ))}
      </nav>
    </div></>
  );
}
