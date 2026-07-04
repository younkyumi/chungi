"use client";

import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://cdn.jsdelivr.net/gh/ridi/ridi-font@latest/web/ridi-batang/ridi-batang.css');@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --ink:#1A3C32;--ink2:#1E4A3D;--ink3:#234F42;--ink4:#2A5A4D;
    --gold:#D4AF37;--gold2:#E8C86A;--jade:#5FC49E;--blush:#8B2929;
    --violet:#9B8FD4;--coral:#8B2929;--mist:#A8C4B8;--white:#F4F1E1;
    --c1:#1A3C32;--c2:#1E4A3D;--c3:#234F42;--ca:#D4AF37;--cm:#A8C4B8;--co:#8B2929;--cj:#5FC49E;--ct:#F4F1E1;
  }
  .apage{padding:64px 0 82px;min-height:100dvh;}
  .asec{padding:14px 18px 4px;}
  .asec-t{font-size:14px;font-weight:900;margin-bottom:12px;display:flex;align-items:center;gap:7px;}
  .asec-t::after{content:'';flex:1;height:1px;background:linear-gradient(to right,rgba(139,41,41,0.2),transparent);}
  html,body{background:var(--ink);color:var(--white);font-family:'Pretendard','Noto Serif KR','Apple SD Gothic Neo',serif;-webkit-tap-highlight-color:transparent;}
  .app{max-width:430px;margin:0 auto;min-height:100dvh;background:var(--ink);}
  .anav{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:13px 18px;background:rgba(26,60,50,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(139,41,41,0.2);}
  .anav-logo{display:flex;align-items:center;gap:8px;}
  .anav-badge{font-size:9px;font-weight:700;background:var(--coral);color:#fff;padding:2px 8px;border-radius:10px;}
  .anav-title{font-family:'Noto Serif KR','Batang',serif;font-size:16px;font-weight:900;color:var(--gold);}
  .anav-user{font-size:11px;color:var(--mist);}
  .abtab{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:100;display:flex;background:rgba(26,60,50,0.97);backdrop-filter:blur(16px);border-top:1px solid rgba(139,41,41,0.15);padding-bottom:env(safe-area-inset-bottom,0);}
  .ati{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 0 7px;cursor:pointer;color:rgba(168,196,184,0.38);border:none;background:none;font-family:inherit;transition:color .18s;}
  .ati.on{color:var(--coral);}
  .ati-ic{font-size:17px;} .ati-lb{font-size:8px;font-weight:700;}
  .page{padding:64px 0 82px;}
  .card{background:var(--ink2);border-radius:16px;border:1px solid rgba(255,255,255,0.06);padding:16px;}
  .sec{padding:14px 18px 4px;}
  .sec-t{font-size:14px;font-weight:900;margin-bottom:12px;display:flex;align-items:center;gap:7px;}
  .sec-t::after{content:'';flex:1;height:1px;background:linear-gradient(to right,rgba(139,41,41,0.2),transparent);}
  .sec-t-btn{font-size:10px;font-weight:700;padding:4px 10px;border-radius:9px;border:1px solid rgba(139,41,41,0.3);background:transparent;color:var(--coral);cursor:pointer;font-family:inherit;flex-shrink:0;margin-left:auto;}
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
  .stat-value.zero{color:rgba(168,196,184,0.25);}
  .stat-change{font-size:10px;font-weight:700;}
  .stat-change.up{color:var(--jade);}
  .stat-change.none{color:rgba(168,196,184,0.3);}
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
  .bdg-r{background:rgba(139,41,41,0.15);color:var(--coral);border:1px solid rgba(139,41,41,0.25);}
  .bdg-y{background:rgba(212,175,55,0.15);color:var(--gold);border:1px solid rgba(212,175,55,0.25);}
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
  .inp:focus{border-color:rgba(139,41,41,0.4);}
  .inp::placeholder{color:rgba(168,196,184,0.3);}
  .sel{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23C8C4D8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;}
  .filter-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:12px;}
  .filter-chip{padding:5px 11px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.08);background:transparent;color:var(--mist);cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .18s;}
  .filter-chip.on{background:rgba(139,41,41,0.15);color:var(--coral);border-color:rgba(139,41,41,0.3);}
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
  .md{background:var(--ink2);border-radius:24px 24px 0 0;padding:22px 20px 40px;width:100%;max-width:430px;border-top:1px solid rgba(139,41,41,0.15);max-height:90dvh;overflow-y:auto;animation:su .2s ease-out;}
  @keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .hd{width:36px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 auto 18px;}
  .mt{font-family:'Noto Serif KR','Batang',serif;font-size:18px;font-weight:900;margin-bottom:5px;}
  .ms{font-size:12px;color:var(--mist);margin-bottom:16px;line-height:1.6;}
  .dots{display:flex;gap:5px;justify-content:center;padding:16px;}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--coral);animation:b 1.1s ease-in-out infinite;}
  .dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}
  @keyframes b{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}
  .notice{background:rgba(139,41,41,0.07);border:1px solid rgba(139,41,41,0.18);border-radius:12px;padding:11px 13px;font-size:12px;color:var(--mist);line-height:1.6;margin-bottom:12px;}
  .notice strong{color:var(--coral);}
  .empty-state{text-align:center;padding:28px 20px;color:rgba(168,196,184,0.3);}
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
const WEEK_DATES = ["3/27(목)","3/28(금)","3/29(토)","3/30(일)","3/31(월)","4/1(화)","4/2(수)"];

// ─── 더미 데이터 (UI 확인용 — 서비스 오픈 시 실제 데이터로 교체) ──────────
const DUMMY_ON = true; // 개발 완료 후 false로 바꾸면 0으로 전환

const DUMMY_STATS = {
  visitors:1284, signups:87, revenue:284600, payments:312,
  visitors_change:12.4, signups_change:8.1, revenue_change:18.7,
};
const DUMMY_WEEK_V = [420,580,710,930,1050,1180,1284];
const DUMMY_WEEK_R = [82000,104000,138000,196000,221000,248000,284600];
const ZERO_WEEK   = [0,0,0,0,0,0,0];

// 더미 회원 19명 (천기인·북극성·별·달·새싹 골고루)
const DUMMY_MEMBERS = [
  {id:1, name:"김지연",emoji:"👩",email:"kim***@gmail.com",joinDate:"2026.01.15",lastVisit:"2026.03.30",totalPaid:52400,tags:["🐉 천기인","🛍️ 개운러"],blood:"A",ddi:"토끼",zodiac:"물고기자리",gijildo:"화형",inflow:"카카오 공유",  contents:["관상짤","사주","연애운","종합분석","파동성명학","굿즈"]},
  {id:2, name:"이민준",emoji:"👨",email:"lee***@naver.com", joinDate:"2026.02.03",lastVisit:"2026.03.30",totalPaid:8820, tags:["🌱 새싹"],           blood:"O",ddi:"말",  zodiac:"사자자리",  gijildo:"수형",inflow:"네이버 검색",contents:["관상짤","타로"]},
  {id:3, name:"박소희",emoji:"👩",email:"par***@kakao.com", joinDate:"2026.01.28",lastVisit:"2026.03.29",totalPaid:29400,tags:["⭐ 별","🛍️ 개운러"],  blood:"B",ddi:"용",  zodiac:"전갈자리",  gijildo:"목형",inflow:"인스타그램",  contents:["사주","연애운","파동성명학","관상짤"]},
  {id:4, name:"최도현",emoji:"👨",email:"cho***@gmail.com", joinDate:"2026.03.01",lastVisit:"2026.03.28",totalPaid:1960, tags:["🌱 새싹"],           blood:"AB",ddi:"쥐", zodiac:"양자리",    gijildo:"금형",inflow:"구글 검색",  contents:["관상짤"]},
  {id:5, name:"정유진",emoji:"👩",email:"jun***@naver.com", joinDate:"2026.02.14",lastVisit:"2026.03.30",totalPaid:22640,tags:["💫 북극성"],             blood:"A",ddi:"뱀",  zodiac:"처녀자리",  gijildo:"화형",inflow:"카카오 공유",  contents:["전체"]},
  {id:6, name:"강민서",emoji:"👨",email:"kan***@gmail.com", joinDate:"2026.03.20",lastVisit:"2026.03.30",totalPaid:980,  tags:["🌱 새싹"],           blood:"O",ddi:"소",  zodiac:"황소자리",  gijildo:"토형",inflow:"직접 방문",  contents:["사주"]},
  {id:7, name:"윤아름",emoji:"👩",email:"yun***@kakao.com", joinDate:"2026.01.05",lastVisit:"2026.03.29",totalPaid:68200,tags:["🐉 천기인","🌙 달"], blood:"A",ddi:"호랑이",zodiac:"사수자리", gijildo:"화형",inflow:"인스타그램",  contents:["전체","굿즈"]},
  {id:8, name:"오성민",emoji:"👨",email:"oh***@naver.com",  joinDate:"2026.02.28",lastVisit:"2026.03.25",totalPaid:4800, tags:["🌱 새싹"],           blood:"B",ddi:"닭",  zodiac:"천칭자리",  gijildo:"수형",inflow:"유튜브",      contents:["파동성명학"]},
  {id:9, name:"임채원",emoji:"👩",email:"lim***@gmail.com", joinDate:"2026.01.20",lastVisit:"2026.03.30",totalPaid:35600,tags:["⭐ 별"],             blood:"A",ddi:"양",  zodiac:"게자리",    gijildo:"목형",inflow:"네이버 검색",contents:["사주","연애운","굿즈"]},
  {id:10,name:"한지우",emoji:"👨",email:"han***@kakao.com", joinDate:"2026.03.10",lastVisit:"2026.03.28",totalPaid:3920, tags:["🌱 새싹"],           blood:"O",ddi:"원숭이",zodiac:"쌍둥이자리",gijildo:"금형",inflow:"카카오 공유",contents:["관상짤","기질도"]},
  {id:11,name:"신예은",emoji:"👩",email:"sin***@gmail.com", joinDate:"2026.02.01",lastVisit:"2026.03.30",totalPaid:41200,tags:["⭐ 별","🌙 달"],  blood:"B",ddi:"돼지",zodiac:"물병자리",   gijildo:"수형",inflow:"인스타그램",  contents:["사주","기질도","뇌과학"]},
  {id:12,name:"류정훈",emoji:"👨",email:"ryu***@naver.com", joinDate:"2026.03.05",lastVisit:"2026.03.27",totalPaid:980,  tags:["🌱 새싹"],           blood:"AB",ddi:"쥐", zodiac:"염소자리",  gijildo:"토형",inflow:"구글 검색",  contents:["사주"]},
  {id:13,name:"문소연",emoji:"👩",email:"mun***@kakao.com", joinDate:"2026.01.10",lastVisit:"2026.03.30",totalPaid:24500,tags:["⭐ 별"],             blood:"A",ddi:"토끼",zodiac:"양자리",    gijildo:"화형",inflow:"카카오 공유",  contents:["관상짤","연애운","타로"]},
  {id:14,name:"배태양",emoji:"👨",email:"bae***@gmail.com", joinDate:"2026.02.20",lastVisit:"2026.03.26",totalPaid:5760, tags:["🌱 새싹"],           blood:"O",ddi:"용",  zodiac:"사자자리",  gijildo:"목형",inflow:"유튜브",      contents:["사주","관상짤"]},
  {id:15,name:"조하늘",emoji:"👩",email:"jo***@naver.com",  joinDate:"2026.01.25",lastVisit:"2026.03.30",totalPaid:58800,tags:["🐉 천기인","🛍️ 개운러"], blood:"B",ddi:"말",  zodiac:"전갈자리",  gijildo:"화형",inflow:"인스타그램",  contents:["전체","굿즈"]},
  {id:16,name:"홍준혁",emoji:"👨",email:"hon***@kakao.com", joinDate:"2026.03.15",lastVisit:"2026.03.29",totalPaid:1960, tags:["🌱 새싹"],           blood:"A",ddi:"뱀",  zodiac:"쌍둥이자리",gijildo:"수형",inflow:"카카오 공유",  contents:["관상짤","관상짤"]},
  {id:17,name:"전민지",emoji:"👩",email:"jun***@gmail.com", joinDate:"2026.02.08",lastVisit:"2026.03.30",totalPaid:15680,tags:["🌙 달"],         blood:"AB",ddi:"닭", zodiac:"처녀자리",  gijildo:"금형",inflow:"네이버 검색",contents:["사주","기질도","연애운"]},
  {id:18,name:"남궁준",emoji:"👨",email:"nam***@naver.com", joinDate:"2026.03.25",lastVisit:"2026.03.30",totalPaid:980,  tags:["🌱 새싹"],           blood:"O",ddi:"소",  zodiac:"황소자리",  gijildo:"토형",inflow:"직접 방문",  contents:["사주"]},
  {id:19,name:"서다은",emoji:"👩",email:"seo***@kakao.com", joinDate:"2026.01.30",lastVisit:"2026.03.30",totalPaid:44800,tags:["⭐ 별","🌙 달"],  blood:"A",ddi:"양",  zodiac:"물고기자리",gijildo:"화형",inflow:"카카오 공유",  contents:["관상짤","사주","연애운","굿즈"]},
];

// 회원 등급 정의 (고객 표시 등급 기준)
const MEMBER_TYPES = {
  "새싹":   {label:"🌱 새싹",    color:"var(--jade)",   bdg:"bdg-g", desc:"가입한 모든 사람 (아무것도 안 해도 새싹)"},
  "달":     {label:"🌙 달",      color:"var(--mist)",   bdg:"bdg-g", desc:"유료 콘텐츠 1가지 이용 (첫 결제한 사람)"},
  "별":     {label:"⭐ 별",      color:"var(--gold)",   bdg:"bdg-y", desc:"유료 콘텐츠 5가지 이용 (약 4,900원+)"},
  "태양":   {label:"☀️ 태양",    color:"var(--gold)",   bdg:"bdg-y", desc:"유료 콘텐츠 10가지 이용 (약 9,800원+)"},
  "샛별":   {label:"🌟 샛별",    color:"var(--coral)",  bdg:"bdg-r", desc:"총 결제 3만원 이상 (콘텐츠, 굿즈 전체)"},
  "북극성": {label:"💫 북극성",  color:"var(--violet)", bdg:"bdg-v", desc:"총 결제 5만원 이상 (콘텐츠, 굿즈 전체)"},
  "천기인": {label:"🐉 천기인",  color:"var(--gold)",   bdg:"bdg-y", desc:"전체 콘텐츠 다 이용 (25,820원 달성+)"},
  "개운러": {label:"🛍️ 개운러",  color:"var(--blush)",  bdg:"bdg-r", desc:"굿즈샵 구매 이력 있음 (결제 금액 무관, 별도 배지)"},
};

// 공유 배지 정의
const SHARE_BADGES = {
  공유자:     {label:"🔗 공유자",     color:"var(--jade)",  desc:"1~4회 공유 · 쿠폰 즉시 지급"},
  전파자:     {label:"📢 전파자",     color:"var(--gold)",  desc:"5~9회 공유 · 디지털 부적 선택"},
  홍보대사:   {label:"🏆 홍보대사",   color:"var(--blush)", desc:"10~19회 공유 · 키링 실물 발송"},
  인플루언서: {label:"🌟 인플루언서", color:"var(--gold)",  desc:"20회+ 공유 · 명패 실물 발송"},
};

// 더미 매출
const DUMMY_REVENUE = {
  오늘:284600, 이번주:1241600, 이번달:4820000, 전체:12480000
};
const DUMMY_CONTENTS_REV = [
  // 🪞 관상 (1~15)
  {name:"1) 관상짤",                  count:1240, revenue:471200},
  {name:"2) 내 관상보기",             count:328,  revenue:321440},
  {name:"3) 조선 초상화",              count:456,  revenue:446880},
  {name:"4) 커플 관상 궁합",          count:89,   revenue:175820},
  {name:"5) 부모·자식 관상 궁합",     count:0,    revenue:0},
  {name:"6) 2세 얼굴 & 운명 예측",    count:23,   revenue:110400},
  {name:"7) 우리 아기 관상",          count:67,   revenue:65660},
  {name:"8) 돌잡이 시뮬레이션",       count:0,    revenue:0},
  {name:"9) 댕댕상",                  count:0,    revenue:0},
  {name:"10) 냥냥상",                 count:0,    revenue:0},
  {name:"11) 멍·냥 주인 관상 궁합",   count:0,    revenue:0},
  {name:"12) 베프 관상 궁합",         count:0,    revenue:0},
  {name:"13) 최애 관상 궁합",         count:0,    revenue:0},
  {name:"14) 비즈니스 관상 궁합",     count:45,   revenue:89100},
  {name:"15) 악연·상극 관상 궁합",    count:0,    revenue:0},
  // 🧬 성향 분석 (16~18)
  {name:"16) 기질도",                 count:312,  revenue:305760},
  {name:"17) 수비학",                 count:187,  revenue:183260},
  {name:"18) 뇌과학 분석 테스트",     count:124,  revenue:595200},
  // ✦ 오늘의 천기 (19~23)
  {name:"19) 오늘의 운세",            count:3842, revenue:0},
  {name:"20) 오늘의 타로",            count:2156, revenue:0},
  {name:"21) 행운 로또번호",          count:987,  revenue:0},
  {name:"22) 이달의 운세",            count:1523, revenue:0},
  {name:"23) 오늘의 명언",            count:1456, revenue:0},
  // 🔮 지금 바로 물어봐 (24~25)
  {name:"24) YES/NO 타로",            count:1834, revenue:0},
  {name:"25) 꿈 · 태몽 해몽",         count:1247, revenue:0},
  // 🐲 띠·별자리·혈액형 (26~28)
  {name:"26) 띠별 운세",              count:1456, revenue:0},
  {name:"27) 별자리 운세",            count:1289, revenue:0},
  {name:"28) 혈액형 운세",            count:1134, revenue:0},
  // 🃏 타로 (29~33)
  {name:"29) 재물 타로",              count:298,  revenue:292040},
  {name:"30) 연애 타로",              count:423,  revenue:414540},
  {name:"31) 건강 타로",              count:156,  revenue:152880},
  {name:"32) 진로 타로",              count:187,  revenue:183260},
  {name:"33) 인생 타로",              count:213,  revenue:208740},
  // ☯️ 사주 (34~40)
  {name:"34) 사주 풀이",              count:892,  revenue:874160},
  {name:"35) 월별 운세",              count:234,  revenue:229320},
  {name:"36) 대운 해설",              count:178,  revenue:174440},
  {name:"37) 연도별 운세",            count:145,  revenue:142100},
  {name:"38) 신년 운세",              count:456,  revenue:902880},
  {name:"39) 토정비결",               count:312,  revenue:617760},
  {name:"40) 전생 운세",              count:267,  revenue:261660},
  // 📅 택일 (41~42)
  {name:"41) 좋은 날 확인하기",       count:534,  revenue:0},
  {name:"42) 좋은 날 찾기",           count:198,  revenue:194040},
  // 💌 궁합 (43~44)
  {name:"43) 연애운·궁합",            count:634,  revenue:1255320},
  {name:"44) 궁합 연예인",            count:876,  revenue:0},
  // ✋ 신체 운세 (45~48) - 할인중
  {name:"45) 손금 (할인중)",          count:276,  revenue:104880},
  {name:"46) 발금 (할인중)",          count:98,   revenue:37240},
  {name:"47) 얼굴 점 (할인중)",       count:345,  revenue:131100},
  {name:"48) 눈 점 (할인중)",         count:67,   revenue:25460},
  // ✍️ 이름 (49~51)
  {name:"49) 이름 풀이",              count:198,  revenue:194040},
  {name:"50) 아기 이름 짓기",         count:0,    revenue:0},
  {name:"51) 파동 성명학",            count:87,   revenue:417600},
  // 📱 디지털 풍수 (52~53)
  {name:"52) 행운의 번호·비밀번호",   count:0,    revenue:0},
  {name:"53) AI 행운 배경화면",       count:0,    revenue:0},
  // 🔍 천기 리포트 (54~55)
  {name:"54) 나의 천기 리포트",       count:432,  revenue:0},
  {name:"55) 12수호신 소개",          count:654,  revenue:0},
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
  {id:"twitter",source:"트위터/X", icon:"⚫",count:34, color:"rgba(168,196,184,0.5)"},
  {id:"other",source:"기타",       icon:"📎",count:21, color:"rgba(168,196,184,0.3)"},
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

// 프리셋 쿠폰 (통합)
const COUPONS_INIT = [
  // 가입 시 자동 지급 4종
  {id:1, code:"WELCOME280", name:"🎉 관상짤 280원 할인 (카톡 친추)", discount:"280원", discountType:"fixed", target:"관상짤 결제 전용", useCondition:"관상짤 유료 결제시 사용 가능", issueCondition:"카카오 채널 친구 추가 시 지급", expire:"발급 후 7일 이내", minPrice:100, minOrder:100, issued:0, used:0, active:true},
  {id:2, code:"PREMIUM2000", name:"💎 프리미엄 2,800원 할인 (카톡 친추)", discount:"2,800원", discountType:"fixed", target:"4,800원 프리미엄 콘텐츠", useCondition:"4,800원 프리미엄 콘텐츠 결제 시 사용", issueCondition:"카카오 채널 친구 추가 시 지급", expire:"발급 후 3일 이내", minPrice:2000, minOrder:2000, issued:0, used:0, active:true},
  {id:3, code:"NEWSAJU500", name:"🌱 새싹 응원 쿠폰", discount:"500원", discountType:"fixed", target:"980원 콘텐츠 전체", useCondition:"두 번째 980원 콘텐츠 결제 시 사용 (정가 기준)", issueCondition:"첫 번째 980원 이상 결제 완료 후 자동 지급", expire:"발급 후 3일 이내", minPrice:980, minOrder:980, issued:0, used:0, active:true},
  {id:4, code:"NEWGOODS10", name:"🛍️ 첫 굿즈 구매 10% 할인", discount:"10%", discountType:"percent", target:"굿즈샵 모든 상품", useCondition:"굿즈샵 첫 구매 시에만 사용 가능", issueCondition:"가입 시 자동 지급", expire:"2026년 12월 31일", minPrice:10000, minOrder:10000, issued:0, used:0, active:true},
  // 등급별 자동 지급
  {id:5, code:"THANKYOU380", name:"🪞 첫 결제 감사, 무료 관상짤", discount:"380원", discountType:"fixed", target:"관상짤 결제 전용", useCondition:"980원 이상 결제 후 사용", issueCondition:"달 등급 달성 시 자동 지급", expire:"발급 후 7일 이내", minPrice:0, minOrder:0, issued:0, used:0, active:true},
  {id:6, code:"MOON500", name:"🌙 달 등급 달성 축하", discount:"500원", discountType:"fixed", target:"980원 콘텐츠 전체", useCondition:"두 번째 콘텐츠 결제 시", issueCondition:"달 등급 달성 시 자동 지급 (첫 유료 결제 완료)", expire:"발급 후 7일 이내", minPrice:980, minOrder:980, issued:0, used:0, active:true},
  {id:7, code:"STAR1000", name:"⭐ 별 등급 달성 축하", discount:"1,000원", discountType:"fixed", target:"모든 콘텐츠 + 굿즈샵", useCondition:"모든 결제에 사용 가능", issueCondition:"별 등급 달성 시 자동 지급 (유료 5가지 이상)", expire:"발급 후 14일 이내", minPrice:980, minOrder:980, issued:0, used:0, active:true},
  {id:8, code:"SOLAR1000", name:"☀️ 태양 등급 달성 축하", discount:"1,000원", discountType:"fixed", target:"굿즈샵 전체", useCondition:"굿즈샵 결제 시", issueCondition:"태양 등급 달성 시 자동 지급 (유료 10가지 이용)", expire:"발급 후 14일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:9, code:"STARRISE2000", name:"🌟 샛별 등급 달성 축하", discount:"2,000원", discountType:"fixed", target:"굿즈샵 전체", useCondition:"굿즈샵 결제 시", issueCondition:"샛별 등급 달성 시 자동 지급 (총 결제 30,000원 이상)", expire:"발급 후 14일 이내", minPrice:10000, minOrder:10000, issued:0, used:0, active:true},
  {id:10, code:"POLARIS3000", name:"💫 북극성 등급 축하", discount:"3,000원", discountType:"fixed", target:"모든 콘텐츠 + 굿즈샵", useCondition:"모든 결제에 사용 가능", issueCondition:"북극성 등급 달성 시 자동 지급 (총 결제 50,000원 이상)", expire:"발급 후 30일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:11, code:"GOODS20", name:"🛍️ 굿즈샵 20% 할인", discount:"20%", discountType:"percent", target:"굿즈샵 전체", useCondition:"굿즈샵 50,000원 이상 결제 시", issueCondition:"북극성 등급 달성 시 자동 지급", expire:"발급 후 30일 이내", minPrice:50000, minOrder:50000, issued:0, used:0, active:true},
  {id:12, code:"CHUNGIN5000", name:"🐉 천기인 등급 달성 축하", discount:"5,000원", discountType:"fixed", target:"굿즈샵 전체", useCondition:"굿즈샵 결제 시", issueCondition:"천기인 등급 달성 시 자동 지급 (전체 콘텐츠 이용)", expire:"발급 후 30일 이내", minPrice:20000, minOrder:20000, issued:0, used:0, active:true},
  {id:13, code:"GOODS30", name:"🛍️ 굿즈샵 30% 할인", discount:"30%", discountType:"percent", target:"굿즈샵 전체", useCondition:"굿즈샵 100,000원 이상 결제 시", issueCondition:"천기인 등급 달성 시 자동 지급", expire:"발급 후 30일 이내", minPrice:100000, minOrder:100000, issued:0, used:0, active:true},
  // 선물권 페이백
  {id:14, code:"GIFT3000", name:"🎁 선물권 감사 10% (3천원권)", discount:"300원", discountType:"fixed", target:"모든 콘텐츠", useCondition:"모든 콘텐츠 사용 가능", issueCondition:"3,000원 선물권 구매 시 자동 지급, 환불 시 철회", expire:"발급 후 14일 이내", minPrice:0, minOrder:0, issued:0, used:0, active:true},
  {id:15, code:"GIFT5000", name:"🎁 선물권 감사 10% (5천원권)", discount:"500원", discountType:"fixed", target:"모든 콘텐츠", useCondition:"모든 콘텐츠 사용 가능", issueCondition:"5,000원 선물권 구매 시 자동 지급, 환불 시 철회", expire:"발급 후 14일 이내", minPrice:0, minOrder:0, issued:0, used:0, active:true},
  {id:16, code:"GIFT10000", name:"🎁 선물권 감사 10% (1만원권)", discount:"1,000원", discountType:"fixed", target:"모든 콘텐츠", useCondition:"모든 콘텐츠 사용 가능", issueCondition:"10,000원 선물권 구매 시 자동 지급, 환불 시 철회", expire:"발급 후 14일 이내", minPrice:0, minOrder:0, issued:0, used:0, active:true},
  {id:17, code:"GIFT30000", name:"🎁 선물권 감사 10% (3만원권)", discount:"3,000원", discountType:"fixed", target:"모든 콘텐츠", useCondition:"모든 콘텐츠 사용 가능", issueCondition:"30,000원 선물권 구매 시 자동 지급, 환불 시 철회", expire:"발급 후 14일 이내", minPrice:0, minOrder:0, issued:0, used:0, active:true},
  // 별개 운영
  {id:18, code:"BIRTHDAY", name:"🎂 생일 축하 쿠폰", discount:"1,000원", discountType:"fixed", target:"모든 콘텐츠", useCondition:"생일 당일 및 생일 3일 전후", issueCondition:"프로필에 생년월일 등록 시 매년 생일 자동 지급", expire:"생일 기준 7일 이내", minPrice:980, minOrder:980, issued:0, used:0, active:true},
  {id:19, code:"INVITE1000", name:"🔗 친구 초대 감사", discount:"1,000원", discountType:"fixed", target:"모든 콘텐츠", useCondition:"초대한 친구가 첫 결제 완료 시", issueCondition:"내 초대 링크로 가입한 친구가 첫 결제 완료하면 자동 지급", expire:"발급 후 14일 이내", minPrice:980, minOrder:980, issued:0, used:0, active:true},
  {id:20, code:"FACE10PACK", name:"📸 관상짤 10장 패키지", discount:"10장 3,000원", discountType:"fixed", target:"관상짤 전용", useCondition:"1회 결제로 10회 이용권 구매", issueCondition:"직접 구매 (자동 지급 아님)", expire:"구매 후 30일 이내", minPrice:3000, minOrder:3000, issued:0, used:0, active:true},
  // 콘텐츠 연동 자동 지급
  {id:21, code:"OHAENG1000", name:"🔥 내 오행 굿즈 1,000원 할인", discount:"1,000원", discountType:"fixed", target:"굿즈샵 오행 관련 (오행보완/기운회복/기운보강)", useCondition:"오행 관련 굿즈 결제 시", issueCondition:"사주풀이 or 수비학 결제 완료 시 자동 지급", expire:"발급 후 14일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:22, code:"FACE500", name:"👁️ 관상 개운 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 집안정화/미니부적", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"관상짤 or 내관상보기 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:23, code:"PASTLIFE500", name:"⏳ 전생 유형 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 전생유형", useCondition:"전생유형 카테고리 굿즈 결제 시", issueCondition:"전생 운세 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:24, code:"GIJILDO500", name:"☯️ 기질도 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 기질도", useCondition:"기질도 카테고리 굿즈 결제 시", issueCondition:"기질도 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:25, code:"TAROT500", name:"🃏 타로 개운 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 운세·점사", useCondition:"운세·점사 카테고리 굿즈 결제 시", issueCondition:"타로 시리즈 중 1개 이상 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:26, code:"PALM500", name:"✋ 손금·발금 개운 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 럭키템/오행보완", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"손금 or 발금 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:27, code:"GUARDIAN1000", name:"🐉 12수호신 굿즈 1,000원 할인", discount:"1,000원", discountType:"fixed", target:"굿즈샵 12수호신", useCondition:"12수호신 카테고리 굿즈 결제 시", issueCondition:"12수호신 소개 이용 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:28, code:"LOVE500", name:"💌 커플·연애 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 커플·연애", useCondition:"커플·연애 카테고리 굿즈 결제 시", issueCondition:"연애운궁합 or 관상궁합 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:29, code:"NEWYEAR1000", name:"🎋 새해 기운 보완 굿즈 1,000원 할인", discount:"1,000원", discountType:"fixed", target:"굿즈샵 집안정화/미니부적", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"신년운세 or 토정비결 결제 완료 시 자동 지급", expire:"발급 후 14일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:30, code:"NAME500", name:"✍️ 이름 에너지 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 천기주얼리/천기굿즈", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"이름풀이 or 파동성명학 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:31, code:"JOSEON500", name:"🎁 한국 뮷즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 한국 뮷즈", useCondition:"한국 뮷즈 카테고리 굿즈 결제 시", issueCondition:"조선 초상화 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:32, code:"MONTHLY500", name:"📅 이달의 기운 보완 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 기운회복/기운보강", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"사주 월별운세 결제 완료 시 자동 지급", expire:"발급 후 14일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  // 신규 콘텐츠 연동 쿠폰
  {id:33, code:"TAEKIL500", name:"📅 좋은 날 개운 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 이사·개업", useCondition:"이사·개업 카테고리 굿즈 결제 시", issueCondition:"택일 (좋은 날 확인/찾기) 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:34, code:"EYEMOLE500", name:"👁️ 눈 점 개운 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 미니부적/럭키템", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"눈 점 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:35, code:"DAEUN1000", name:"🌊 대운 개운 굿즈 1,000원 할인", discount:"1,000원", discountType:"fixed", target:"굿즈샵 오행보완/기운회복", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"대운 해설 결제 완료 시 자동 지급", expire:"발급 후 14일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:36, code:"YEARLY500", name:"📆 연도별운세 개운 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 기운회복/기운보강", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"연도별 운세 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:37, code:"NATURE500", name:"🧬 성향 분석 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 기질도/수비학", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"뇌과학 분석 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:38, code:"BABY500", name:"👶 우리 아기 관상 개운 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 탄생·수호", useCondition:"탄생·수호 카테고리 굿즈 결제 시", issueCondition:"우리 아기 관상 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:39, code:"BABY2GEN1000", name:"🍼 2세 얼굴 개운 굿즈 1,000원 할인", discount:"1,000원", discountType:"fixed", target:"굿즈샵 탄생·수호/커플·연애", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"2세 얼굴 & 운명 예측 결제 완료 시 자동 지급", expire:"발급 후 14일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:40, code:"BIZ500", name:"💼 비즈니스 관상 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 집안수호신/이사·개업", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"비즈니스 관상 궁합 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  // 신규 관상 궁합 6대 천왕 연동 쿠폰
  {id:41, code:"PARENT500", name:"👪 부모·자식 천륜 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 가족수호/탄생·수호", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"부모·자식 관상 궁합 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:42, code:"BFF500", name:"👯 베프 우정 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 우정·인연/럭키템", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"베프 관상 궁합 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:43, code:"FAN500", name:"🌟 최애 팬심 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 럭키템/천기주얼리", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"최애 팬심 관상 궁합 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:44, code:"ENEMY500", name:"⚡ 악연 방어 부적 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 미니부적/집안정화", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"악연·상극 관상 궁합 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  // 🐶🐱 반려동물 집사 쿠폰
  {id:45, code:"DOGPARENT500", name:"🐶 강아지 집사 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 반려동물/집안수호", useCondition:"반려동물 관련 굿즈 결제 시", issueCondition:"댕댕상 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:46, code:"CATPARENT500", name:"🐱 고양이 집사 굿즈 500원 할인", discount:"500원", discountType:"fixed", target:"굿즈샵 반려동물/집안수호", useCondition:"반려동물 관련 굿즈 결제 시", issueCondition:"냥냥상 결제 완료 시 자동 지급", expire:"발급 후 7일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
  {id:47, code:"PETOWNER1000", name:"🐾 집사 인연 굿즈 1,000원 할인", discount:"1,000원", discountType:"fixed", target:"굿즈샵 반려동물/우정·인연", useCondition:"해당 카테고리 굿즈 결제 시", issueCondition:"멍·냥 주인 관상 궁합 결제 완료 시 자동 지급", expire:"발급 후 14일 이내", minPrice:5000, minOrder:5000, issued:0, used:0, active:true},
];

const ALL_CONTENTS = [
  // 🪞 관상 (1~15)
  {id:"gwansang_zal",        name:"관상짤",                cat:"관상",     price:380,  original_price:380,   open:true},
  {id:"gwansang_full",       name:"내 관상보기",           cat:"관상",     price:980,  original_price:980,  open:true},
  {id:"joseon_portrait",     name:"조선 초상화",           cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"gwansang_compat",     name:"커플 관상 궁합",        cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"parent_child_compat", name:"부모·자식 관상 궁합",   cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"baby_face",           name:"2세 얼굴 & 운명 예측",  cat:"관상",     price:4800, original_price:9800,  open:true},
  {id:"baby_gwansang",       name:"우리 아기 관상",        cat:"관상",     price:980,  original_price:980,  open:true},
  {id:"doljabi_sim",         name:"돌잡이 시뮬레이션",     cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"dog_gwansang",        name:"댕댕상",                cat:"관상",     price:980,  original_price:980,  open:true},
  {id:"cat_gwansang",        name:"냥냥상",                cat:"관상",     price:980,  original_price:980,  open:true},
  {id:"pet_owner_compat",    name:"멍·냥 주인 관상 궁합",  cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"bff_compat",          name:"베프 관상 궁합",        cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"fan_compat",          name:"최애 관상 궁합",        cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"biz_gwansang",        name:"비즈니스 관상 궁합",    cat:"관상",     price:1980, original_price:1980,  open:true},
  {id:"enemy_compat",        name:"악연·상극 관상 궁합",   cat:"관상",     price:1980, original_price:1980,  open:true},
  // 🧬 성향 분석 (8~10)
  {id:"gijildo",         name:"기질도",              cat:"성향",     price:980,  original_price:1980, open:true},
  {id:"numerology",      name:"수비학",              cat:"성향",     price:980,  original_price:980, open:true},
  {id:"psych",           name:"뇌과학 분석 테스트",  cat:"프리미엄", price:4800, original_price:4800, open:true},
  // ✦ 오늘의 천기 (11~17)
  {id:"daily_unse",      name:"오늘의 운세",         cat:"매일무료", price:0,    open:true},
  {id:"today_tarot",     name:"오늘의 타로",         cat:"매일무료", price:0,    open:true},
  {id:"lotto",           name:"행운 로또번호",       cat:"매일무료", price:0,    open:true},
  {id:"monthly_unse",    name:"이달의 운세",         cat:"매일무료", price:0,    open:true},
  {id:"daily_quote",     name:"오늘의 명언",         cat:"매일무료", price:0,    open:true},
  {id:"tarot_yesno",     name:"YES/NO 타로",         cat:"매일무료", price:0,    open:true},
  {id:"dream",           name:"꿈 · 태몽 해몽",             cat:"사주",     price:380,  original_price:380, open:true},
  // 🐲 띠·별자리·혈액형 (18~20)
  {id:"ddi",             name:"띠별 운세",           cat:"무료",     price:0,    open:true},
  {id:"zodiac",          name:"별자리 운세",         cat:"무료",     price:0,    open:true},
  {id:"blood",           name:"혈액형 운세",         cat:"무료",     price:0,    open:true},
  // 🃏 타로 (21~25)
  {id:"tarot_love",      name:"연애 타로",           cat:"타로",     price:980,  open:true},
  {id:"tarot_health",    name:"건강 타로",           cat:"타로",     price:980,  open:true},
  {id:"tarot_money",     name:"재물 타로",           cat:"타로",     price:980,  open:true},
  {id:"tarot_career",    name:"진로 타로",           cat:"타로",     price:980,  open:true},
  {id:"tarot_life",      name:"인생 타로",           cat:"타로",     price:980,  open:true},
  // ☯️ 사주 (26~32)
  {id:"saju",            name:"사주 풀이",           cat:"사주",     price:980,  original_price:980, open:true},
  {id:"saju_monthly",    name:"월별 운세",           cat:"사주",     price:980,  original_price:980, open:true},
  {id:"daeun",           name:"대운 해설",           cat:"사주",     price:980,  open:true},
  {id:"yearly_unse",     name:"연도별 운세",         cat:"사주",     price:980,  open:true},
  {id:"newyear",         name:"신년 운세",           cat:"사주",     price:1980, original_price:1980, open:true},
  {id:"tojeong",         name:"토정비결",            cat:"사주",     price:1980, original_price:1980, open:true},
  {id:"past_life",       name:"전생 운세",           cat:"사주",     price:980,  original_price:980, open:true},
  // 📅 택일 (33~34)
  {id:"taegil_free",     name:"좋은 날 확인하기",    cat:"택일",     price:0,    open:true},
  {id:"taegil",          name:"좋은 날 찾기",        cat:"택일",     price:980,  open:true},
  // 💌 궁합 (35~36)
  {id:"love",            name:"연애운·궁합",         cat:"궁합",     price:1980, original_price:1980, open:true},
  {id:"celeb_compat",    name:"궁합 연예인",         cat:"궁합",     price:0,    open:true},
  // ✋ 신체 운세 (37~40)
  {id:"palmistry",       name:"손금",                cat:"신체",     price:1980, original_price:1980, open:true},
  {id:"footreading",     name:"발금",                cat:"신체",     price:1980, original_price:1980, open:true},
  {id:"mole",            name:"얼굴 점",             cat:"신체",     price:1980, original_price:1980, open:true},
  {id:"eye_mole",        name:"눈 점",               cat:"신체",     price:1980, original_price:1980, open:true},
  // ✍️ 이름
  {id:"namereading",     name:"이름 풀이",           cat:"이름",     price:980,  open:true},
  {id:"baby_naming",     name:"아기 이름 짓기",      cat:"이름",     price:1980, open:true},
  {id:"pawdong",         name:"파동 성명학",         cat:"프리미엄", price:4800, open:true},
  // 📱 디지털 풍수 (NEW)
  {id:"lucky_number",    name:"행운의 번호·비밀번호",cat:"디지털풍수", price:980,  open:true},
  {id:"lucky_wallpaper", name:"AI 행운 배경화면",    cat:"디지털풍수", price:1980, open:true},
  // 🔍 천기 리포트
  {id:"synthesis",       name:"나의 천기 리포트",    cat:"무료",     price:0,    open:true},
  {id:"ytype_intro",     name:"12수호신 소개",       cat:"무료",     price:0,    open:true},
];

const PORTAL_KEYWORDS = {
  naver:   ["관상 분석 무료","오늘 운세 무료","소개팅 관상","사주 무료","이름 풀이"],
  google:  ["face reading app","korean fortune","saju analysis","free horoscope"],
  kakao:   ["천기 관상짤","천기 운세","천기 사주"],
  insta:   ["#관상","#운세","#사주","#소개팅관상","#기질도"],
  youtube: ["관상 보는 법","사주 무료 분석","운세 앱 추천"],
};

const INFLOW_SOURCES = [
  {id:"naver",    source:"네이버 검색",  icon:"🟢", count:0, color:"#03C75A"},
  {id:"kakao",    source:"카카오 공유",  icon:"🟡", count:0, color:"#FEE500"},
  {id:"insta",    source:"인스타그램",   icon:"📸", count:0, color:"#E1306C"},
  {id:"google",   source:"구글 검색",    icon:"🔵", count:0, color:"#4285F4"},
  {id:"direct",   source:"직접 방문",    icon:"🌐", count:0, color:"var(--mist)"},
  {id:"youtube",  source:"유튜브",       icon:"🔴", count:0, color:"#FF0000"},
  {id:"threads",  source:"스레드",       icon:"🔗", count:0, color:"#000000"},
  {id:"facebook", source:"페이스북",     icon:"🟦", count:0, color:"#1877F2"},
  {id:"tiktok",   source:"틱톡",         icon:"🎵", count:0, color:"#00F2EA"},
  {id:"twitter",  source:"트위터/X",     icon:"⚫", count:0, color:"rgba(168,196,184,0.5)"},
  {id:"other",    source:"기타",         icon:"📎", count:0, color:"rgba(168,196,184,0.3)"},
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
  return[s,save] as const;
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
            <div className="graph-dot-date">{d}</div>
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
  async function tryLogin(){
    setLoading(true);
    try{
      const res=await fetch("/api/admin/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
      const data=await res.json();
      if(res.ok&&data.token){
        try{sessionStorage.setItem("admin_token",data.token);}catch{}
        setLoading(false);onLogin();
      }else{
        setLoading(false);setErr(true);setTimeout(()=>setErr(false),1800);
      }
    }catch{
      setLoading(false);setErr(true);setTimeout(()=>setErr(false),1800);
    }
  }
  return(
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px"}}>
      <div style={{fontSize:48,marginBottom:16}}>🔐</div>
      <div style={{fontSize:22,fontWeight:900,color:"var(--gold)",marginBottom:4}}>天機 관리자</div>
      <div style={{fontSize:12,color:"var(--mist)",marginBottom:28}}>관리자만 접근 가능합니다</div>
      <input className="inp" type="password" placeholder="비밀번호 입력" value={pw} onChange={e=>setPw(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&tryLogin()}
        style={{marginBottom:12,borderColor:err?"rgba(139,41,41,0.6)":""}}/>
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
    {name:"🪞 관상",      color:"#8B2929",pct:25},
    {name:"🃏 타로",      color:"#D4AF37",pct:18},
    {name:"☯️ 사주",      color:"#4A90D9",pct:22},
    {name:"📅 택일",      color:"#10B981",pct:8},
    {name:"💌 궁합",      color:"#9B8FD4",pct:12},
    {name:"✋ 신체 운세",  color:"#F59E0B",pct:7},
    {name:"🧬 성향 분석", color:"#06B6D4",pct:5},
    {name:"✍️ 이름",      color:"#A855F7",pct:3},
    {name:"📱 디지털풍수", color:"#EC4899",pct:0},
  ]:[
    {name:"🪞 관상",      color:"#8B2929",pct:0},
    {name:"🃏 타로",      color:"#D4AF37",pct:0},
    {name:"☯️ 사주",      color:"#4A90D9",pct:0},
    {name:"📅 택일",      color:"#10B981",pct:0},
    {name:"💌 궁합",      color:"#9B8FD4",pct:0},
    {name:"✋ 신체 운세",  color:"#F59E0B",pct:0},
    {name:"🧬 성향 분석", color:"#06B6D4",pct:0},
    {name:"✍️ 이름",      color:"#A855F7",pct:0},
    {name:"📱 디지털풍수", color:"#EC4899",pct:0},
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
          {label:"결제 건수",  cls:"violet",val:`${S.payments}건`,           chg:(S as any).payments_change||0},
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
                  <div style={{fontWeight:700,color:d.pct>0?d.color:"rgba(168,196,184,0.3)"}}>{d.pct}%</div>
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
  const[selected,setSelected]=useState<any>(null);
  const[showTypes,setShowTypes]=useState(false);
  const[signups,setSignups]=useState<any[]>([]);
  const[showSignups,setShowSignups]=useState(false);
  const[realUsers,setRealUsers]=useState<any[]>([]);
  const[showRealUsers,setShowRealUsers]=useState(true);
  const[showPaidMembers,setShowPaidMembers]=useState(false);
  const[showBadges,setShowBadges]=useState(false);
  const[sentSignups,setSentSignups]=useState<Set<number>>(new Set());
  const[sentBadges,setSentBadges]=useState<Set<number>>(new Set());
  const[expandedSignup,setExpandedSignup]=useState<number|null>(null);
  const[expandedBadge,setExpandedBadge]=useState<number|null>(null);
  function markSignupSent(id:number){setSentSignups(prev=>new Set([...prev,id]));setExpandedSignup(null);}
  function markBadgeSent(id:number){setSentBadges(prev=>new Set([...prev,id]));setExpandedBadge(null);}

  useEffect(()=>{
    const token=(()=>{try{return sessionStorage.getItem("admin_token")||"";}catch{return"";}})();
    const headers={"x-admin-key":token};
    fetch("/api/notification-signups",{headers}).then(r=>r.json()).then(d=>{if(d.signups)setSignups(d.signups);}).catch(()=>{});
    fetch("/api/admin-users",{headers}).then(r=>r.json()).then(d=>{if(d.users)setRealUsers(d.users);}).catch(()=>{});
  },[]);
  const filters=["전체","🌱 새싹","🌙 달","⭐ 별","☀️ 태양","🌟 샛별","💫 북극성","🐉 천기인","🛍️ 개운러"];
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
            <div style={{fontSize:10,color:"rgba(168,196,184,0.3)",marginTop:8}}>
              * 전체 콘텐츠 유료 합산: 관상짤 380 + 유료×22개 + 프리미엄×2개 = 약 22,940원
            </div>
          </div>
        </div>
      )}

      <div className="divider"/>

      <div style={{padding:"0 18px 14px"}}>
        <button onClick={()=>setShowSignups(v=>!v)} style={{width:"100%",padding:"12px",background:"var(--c2)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:14,color:"var(--ca)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>📋 미오픈 서비스 알림 신청자 ({signups.length}명)</span>
          <span>{showSignups?"▲":"▼"}</span>
        </button>
        {showSignups && (
          <div style={{marginTop:8,maxHeight:400,overflowY:"auto"}}>
            {signups.length === 0 ? (
              <div style={{textAlign:"center",padding:"20px",color:"var(--cm)",fontSize:12}}>아직 신청자가 없어요</div>
            ) : signups.map((s:any,i:number) => (
              <div key={i} style={{background:"var(--c3)",borderRadius:10,marginBottom:4,border:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>{s.user_name}</div>
                    <div style={{fontSize:10,color:"var(--cm)"}}>{s.user_email} · {s.notify_method==="kakao"?"카톡":"이메일"}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--ca)"}}>{s.service_name}</div>
                      <div style={{fontSize:9,color:"var(--cm)"}}>{new Date(s.created_at).toLocaleDateString("ko-KR")}</div>
                    </div>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8,
                      background: sentSignups.has(i) ? "rgba(95,196,158,0.15)" : "rgba(139,41,41,0.15)",
                      color: sentSignups.has(i) ? "var(--cj)" : "var(--co)"
                    }}>{sentSignups.has(i)?"발송완료":"미발송"}</span>
                    <button onClick={()=>setExpandedSignup(expandedSignup===i?null:i)} style={{padding:"3px 8px",borderRadius:8,fontSize:9,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:sentSignups.has(i)?"rgba(155,143,212,0.15)":"rgba(212,175,55,0.15)",color:sentSignups.has(i)?"var(--violet)":"var(--ca)"}}>
                      {sentSignups.has(i)?"한번 더 보내기":"알림 보내기"}
                    </button>
                  </div>
                </div>
                {expandedSignup===i && (
                  <div style={{padding:"0 12px 10px"}}>
                    <div style={{background:"var(--c2)",borderRadius:10,padding:"10px"}}>
                      <div style={{fontSize:10,color:"var(--cm)",marginBottom:4}}>카톡/이메일로 발송될 내용</div>
                      <div style={{fontSize:11,color:"var(--ct)",marginBottom:8,lineHeight:1.6}}>
                        &ldquo;{s.service_name} 서비스가 오픈되었습니다! 지금 바로 이용해보세요 🎉&rdquo;
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>markSignupSent(i)} style={{flex:1,padding:"6px",borderRadius:8,fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:"rgba(212,175,55,0.2)",color:"var(--ca)"}}>발송하기</button>
                        <button onClick={()=>setExpandedSignup(null)} style={{flex:1,padding:"6px",borderRadius:8,fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:"var(--c3)",color:"var(--cm)"}}>취소</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 공유 배지 실물 발송 관리 */}
      {(()=>{
        const badgeGroups = [
          {key:"인플루언서", badge:SHARE_BADGES["인플루언서"], gift:"명패 실물", members:[] as any[]},
          {key:"홍보대사",   badge:SHARE_BADGES["홍보대사"],   gift:"키링 실물", members:[] as any[]},
          {key:"전파자",     badge:SHARE_BADGES["전파자"],     gift:"디지털 부적", members:[
            {id:0, name:"김지연", email:"jiyeon@example.com", level:"전파자", shareCount:10},
            {id:1, name:"정유진", email:"yujin@example.com", level:"전파자", shareCount:8},
          ]},
          {key:"공유자",     badge:SHARE_BADGES["공유자"],     gift:"쿠폰 자동지급", members:[
            {id:2, name:"이수민", email:"sumin@example.com", level:"공유자", shareCount:5},
            {id:3, name:"박채원", email:"chaewon@example.com", level:"공유자", shareCount:4},
            {id:4, name:"한소희", email:"sohee@example.com", level:"공유자", shareCount:3},
            {id:5, name:"윤아름", email:"areum@example.com", level:"공유자", shareCount:3},
          ]},
        ];
        const allBadgeMembers = badgeGroups.flatMap(g=>g.members);
        return(
          <div style={{padding:"0 18px 14px"}}>
            <button onClick={()=>setShowBadges(v=>!v)} style={{width:"100%",padding:"12px",background:"var(--c2)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:14,color:"var(--ca)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>🏆 공유 배지 실물 발송 관리 ({allBadgeMembers.length}명)</span>
              <span>{showBadges?"▲":"▼"}</span>
            </button>
            {showBadges && (
              <div style={{marginTop:8,maxHeight:500,overflowY:"auto"}}>
                {badgeGroups.map(({key,badge,gift,members})=>(
                  <div key={key} className="card" style={{marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.06)",color:badge.color,border:`1px solid ${badge.color}33`}}>{badge.label}</span>
                      <span style={{fontSize:10,color:"var(--jade)",fontWeight:700}}>🎁 {gift}</span>
                      <span style={{marginLeft:"auto",fontSize:10,color:"var(--mist)"}}>{members.length}명</span>
                    </div>
                    {members.length===0
                      ?<div style={{fontSize:11,color:"rgba(168,196,184,0.3)",paddingBottom:4}}>해당 회원 없음</div>
                      :members.map((m)=>(
                        <div key={m.id} style={{borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0"}}>
                            <div>
                              <div style={{fontSize:12,fontWeight:700}}>{m.name}</div>
                              <div style={{fontSize:10,color:"var(--cm)"}}>{m.email} · {m.level} · 공유 {m.shareCount}회</div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8,
                                background: sentBadges.has(m.id) ? "rgba(95,196,158,0.15)" : "rgba(139,41,41,0.15)",
                                color: sentBadges.has(m.id) ? "var(--cj)" : "var(--co)"
                              }}>{sentBadges.has(m.id)?"발송완료":"미발송"}</span>
                              <button onClick={()=>setExpandedBadge(expandedBadge===m.id?null:m.id)} style={{padding:"3px 8px",borderRadius:8,fontSize:9,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:sentBadges.has(m.id)?"rgba(155,143,212,0.15)":"rgba(212,175,55,0.15)",color:sentBadges.has(m.id)?"var(--violet)":"var(--ca)"}}>
                                {sentBadges.has(m.id)?"한번 더 보내기":"알림 보내기"}
                              </button>
                            </div>
                          </div>
                          {expandedBadge===m.id && (
                            <div style={{paddingBottom:10}}>
                              <div style={{background:"var(--c2)",borderRadius:10,padding:"10px"}}>
                                <div style={{fontSize:10,color:"var(--cm)",marginBottom:4}}>카톡/이메일로 발송</div>
                                <div style={{fontSize:11,color:"var(--ct)",marginBottom:8,lineHeight:1.6}}>
                                  &ldquo;축하합니다! 공유 배지 {m.level} 달성! 선물을 보내드릴게요 🎉 chungi.kr → 내 정보 → 배송지를 입력해주세요!&rdquo;
                                </div>
                                <div style={{display:"flex",gap:6}}>
                                  <button onClick={()=>markBadgeSent(m.id)} style={{flex:1,padding:"6px",borderRadius:8,fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:"rgba(212,175,55,0.2)",color:"var(--ca)"}}>발송하기</button>
                                  <button onClick={()=>setExpandedBadge(null)} style={{flex:1,padding:"6px",borderRadius:8,fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:"var(--c3)",color:"var(--cm)"}}>취소</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>
                ))}
                <div style={{fontSize:10,color:"rgba(168,196,184,0.3)",textAlign:"center",paddingTop:4}}>
                  실제 서비스 오픈 후 DB 연동 시 자동으로 채워져요
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 가입 회원 (실제 Supabase) */}
      <div style={{padding:"14px 18px 4px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",marginBottom:8}} onClick={()=>setShowRealUsers(v=>!v)}>
          <div style={{fontSize:13,fontWeight:900}}>📋 가입 회원 ({realUsers.length}명)</div>
          <span style={{fontSize:10,color:"var(--mist)",transform:showRealUsers?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>▾</span>
        </div>
        {showRealUsers&&(realUsers.length>0?<div className="card">
          {realUsers.map((u,i)=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<realUsers.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"var(--ink3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,border:"1px solid rgba(255,255,255,0.06)",overflow:"hidden"}}>
                {u.avatar?<img src={u.avatar} style={{width:34,height:34,objectFit:"cover"}} alt=""/>:"👤"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700}}>{u.name}</div>
                <div style={{fontSize:10,color:"var(--mist)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,background:u.provider==="kakao"?"rgba(250,225,0,0.2)":"rgba(74,144,217,0.15)",color:u.provider==="kakao"?"#3B1B1B":"#4A90D9"}}>{u.provider==="kakao"?"카카오":"구글"}</span>
                <div style={{fontSize:9,color:"var(--mist)",marginTop:3}}>{u.created_at?new Date(u.created_at).toLocaleDateString("ko-KR"):""}</div>
              </div>
            </div>
          ))}
        </div>:<div className="card"><div style={{textAlign:"center",padding:"20px",color:"var(--mist)",fontSize:12}}>가입 회원이 없거나 Supabase 연결이 필요합니다</div></div>)}
      </div>

      {/* 결제 회원 (더미/실제) */}
      <div style={{padding:"14px 18px 8px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",marginBottom:8}} onClick={()=>setShowPaidMembers(v=>!v)}>
          <div style={{fontSize:13,fontWeight:900}}>💰 결제 회원 ({filtered.length}명)</div>
          <span style={{fontSize:10,color:"var(--mist)",transform:showPaidMembers?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>▾</span>
        </div>
        {showPaidMembers&&<>
        <input className="inp" placeholder="🔍 이름, 이메일 검색" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:10}}/>
        <div className="filter-row">
          {filters.map(f=><button key={f} className={`filter-chip${filter===f?" on":""}`} onClick={()=>setFilter(f)}>{f}</button>)}
        </div>
        </>}
      </div>

      {showPaidMembers&&<div style={{padding:"0 18px 24px"}}>
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
      </div>}

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
    ? [{name:"카카오페이",pct:32,color:"#FEE500"},{name:"토스페이",pct:15,color:"#0064FF"},{name:"네이버페이",pct:16,color:"#03C75A"},{name:"카드결제",pct:14,color:"#4A90D9"},{name:"핸드폰 결제",pct:5,color:"var(--violet)"},{name:"천기캐시",pct:10,color:"var(--gold)"},{name:"이용권",pct:4,color:"#FF8C00"},{name:"쿠폰 전액",pct:3,color:"var(--jade)"},{name:"선물권",pct:2,color:"#E84A8A"}]
    : [{name:"카카오페이",pct:0,color:"#FEE500"},{name:"토스페이",pct:0,color:"#0064FF"},{name:"네이버페이",pct:0,color:"#03C75A"},{name:"카드결제",pct:0,color:"#4A90D9"},{name:"핸드폰 결제",pct:0,color:"var(--violet)"},{name:"천기캐시",pct:0,color:"var(--gold)"},{name:"이용권",pct:0,color:"#FF8C00"},{name:"쿠폰 전액",pct:0,color:"var(--jade)"},{name:"선물권",pct:0,color:"#E84A8A"}];

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">💰 매출 현황</div></div>
      <div style={{padding:"0 18px 12px"}}>
        <div className="filter-row">
          {periods.map(p=><button key={p} className={`filter-chip${period===p?" on":""}`} onClick={()=>setPeriod(p)}>{p}</button>)}
        </div>
        <div className="card" style={{textAlign:"center",padding:"22px"}}>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:6}}>{period} 총 매출</div>
          <div style={{fontSize:34,fontWeight:900,color:revAmt>0?"var(--gold2)":"rgba(168,196,184,0.2)"}}>{revAmt.toLocaleString()}원</div>
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
              <tbody>{contentsRev.map(c=>(
                <tr key={c.name}><td style={{fontWeight:700}}>{c.name}</td><td style={{color:"var(--mist)"}}>{c.count}</td><td style={{color:"var(--gold)",fontWeight:700}}>{c.revenue.toLocaleString()}원</td></tr>
              ))}</tbody>
            </table>
          }
        </div>
      </div>

      <div className="divider"/>

      <div className="sec"><div className="sec-t">💳 스페셜 이용권 매출</div></div>
      <div style={{padding:"0 18px 4px"}}>
        <div className="card" style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead><tr><th>상품</th><th>판매</th><th>매출</th></tr></thead>
            <tbody>
              {[
                {name:"📸 관상짤 10장 패키지", sold:0, revenue:0},
                {name:"📸 관상짤 5장 패키지", sold:0, revenue:0},
                {name:"💘 관상 연애 패키지", sold:0, revenue:0},
                {name:"☯️ 사주 완전정복 패키지", sold:0, revenue:0},
                {name:"📖 나를 알다 패키지", sold:0, revenue:0},
                {name:"💘 커플 패키지", sold:0, revenue:0},
                {name:"🃏 타로 풀코스 패키지", sold:0, revenue:0},
                {name:"🔍 천기 리포트 풀 패키지", sold:0, revenue:0},
                {name:"✨ 프리미엄 패키지", sold:0, revenue:0},
                {name:"🎁 선물권 3,000원", sold:0, revenue:0},
                {name:"🎁 선물권 5,000원", sold:0, revenue:0},
                {name:"🎁 선물권 10,000원", sold:0, revenue:0},
                {name:"🎁 선물권 30,000원", sold:0, revenue:0},
              ].map(s=>(
                <tr key={s.name}>
                  <td style={{fontWeight:700}}>{s.name}</td>
                  <td style={{color:"var(--mist)"}}>{s.sold}건</td>
                  <td style={{color:"var(--gold)",fontWeight:700}}>{s.revenue.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div style={{fontSize:12,fontWeight:900,color:"rgba(168,196,184,0.3)"}}>0회</div>
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
          {[["🟡","카톡 공유",0],["🔗","링크 복사",0],["📸","스크린샷 캡쳐",0]].map(([ic,name,cnt],i,arr)=>(
            <div key={name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <span style={{fontSize:18,flexShrink:0}}>{ic}</span>
              <div style={{flex:1,fontSize:13,fontWeight:700}}>{name}</div>
              <div style={{fontSize:14,fontWeight:900,color:"rgba(168,196,184,0.3)"}}>{cnt}</div>
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
    {key:"member",    icon:"👥", label:"회원 전체 목록",      sub:"이름·이메일·가입일·결제금액·등급·프로필",filename:"천기_회원전체.csv",headers:["이름","이메일","가입일","총결제","등급(새싹~천기인)","혈액형","띠","별자리","기질도","유입경로"],rows:[["데이터 없음","—","—","0","🌱 새싹","—","—","—","—","—"]]},
    {key:"vip",       icon:"⭐", label:"🌟 샛별 이상 회원",           sub:"총 결제 3만원 이상 · 샛별~북극성~천기인",       filename:"천기_샛별이상회원.csv",headers:["이름","이메일","총결제","등급","가입일"],rows:[["데이터 없음","—","0","—","—"]]},
    {key:"badge_send",icon:"📦", label:"공유배지 발송 목록",  sub:"전파자(디지털부적)·홍보대사(키링)·인플루언서(명패) 발송 관리",filename:"천기_공유배지발송.csv",headers:["이름","연락처","주소","배지등급","공유횟수","보상내용","주소수집","발송여부","운송장번호"],rows:[["데이터 없음","—","—","—",0,"—","미수집","미발송","—"]]},
    {key:"badge_done",icon:"✅", label:"공유배지 발송 완료 목록", sub:"발송 처리 완료된 회원만",                  filename:"천기_공유배지발송완료.csv",headers:["이름","연락처","배지등급","운송장번호","발송일"],rows:[["데이터 없음","—","—","—","—"]]},
    {key:"revenue",   icon:"💰", label:"콘텐츠별 매출",        sub:"콘텐츠·결제건수·매출액",              filename:"천기_매출.csv",headers:["콘텐츠","카테고리","결제건수","매출액"],rows:ALL_CONTENTS.filter(c=>c.price>0).map(c=>[c.name,c.cat,0,0])},
    {key:"goods",     icon:"🛍️", label:"굿즈 판매 현황",       sub:"상품·판매수·매출·재고",               filename:"천기_굿즈.csv",headers:["상품명","카테고리","판매","매출","재고"],rows:[["데이터 없음","—",0,0,"—"]]},
    {key:"payment",   icon:"💳", label:"전체 결제 내역",        sub:"날짜·콘텐츠·금액·결제수단",           filename:"천기_결제내역.csv",headers:["날짜","콘텐츠","금액","결제수단","회원"],rows:[["데이터 없음","—",0,"—","—"]]},
    {key:"inflow",    icon:"📍", label:"유입경로 통계",         sub:"채널별 방문수·검색키워드",            filename:"천기_유입경로.csv",headers:["채널","방문수","비율(%)"],rows:INFLOW_SOURCES.map(s=>[s.source,0,0])},
    {key:"keyword",   icon:"🔍", label:"포털별 검색 키워드",    sub:"네이버·구글·카카오·인스타별",         filename:"천기_검색키워드.csv",headers:["포털","키워드","검색수"],rows:[["네이버","데이터 없음",0],["구글","데이터 없음",0]]},
    {key:"share",     icon:"🔗", label:"결과 공유 현황",        sub:"카톡·링크복사·스크린샷",filename:"천기_공유현황.csv",headers:["공유채널","건수"],rows:[["카톡 공유",0],["링크 복사",0],["스크린샷 캡쳐",0]]},
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
                {label:"회원 등급",key:"tag",    opts:["전체","🌱 새싹","🌙 달","⭐ 별","☀️ 태양","🌟 샛별","💫 북극성","🐉 천기인","🛍️ 개운러"]},
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
                <div style={{fontSize:24,fontWeight:900,color:"rgba(168,196,184,0.3)"}}>0명</div>
                <div style={{fontSize:10,color:"rgba(168,196,184,0.25)",marginTop:3}}>서비스 오픈 후 집계됩니다</div>
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
              <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:11,padding:"10px 12px",marginTop:4,marginBottom:14}}>
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

const SPECIAL_ITEMS_DEFAULT_ADMIN=[
  {id:"face10",icon:"📸",title:"관상짤 10장 패키지",sub:"1장 300원꼴! 친구랑 돌려보기",price:"3,000원",originalPrice:"3,800원",discount:"20%",badge:"베스트"},
  {id:"face5",icon:"📸",title:"관상짤 5장 패키지",sub:"1장 320원꼴! 소개팅 전 필수!",price:"1,600원",originalPrice:"1,900원",discount:"16%",badge:"인기"},
  {id:"gift3000",icon:"🎁",title:"선물권 3,000원",sub:"친구 소개팅 전에 선물하세요!",price:"3,000원",originalPrice:"",discount:"",badge:"선물"},
  {id:"gift5000",icon:"🎁",title:"선물권 5,000원",sub:"둘이 같이 써요! 커플·친구 선물",price:"5,000원",originalPrice:"",discount:"",badge:"선물"},
  {id:"gift10000",icon:"🎁",title:"선물권 10,000원",sub:"부모님께 드리세요!",price:"10,000원",originalPrice:"",discount:"",badge:"인기"},
  {id:"gift30000",icon:"🎁",title:"선물권 30,000원",sub:"천기 풀코스! 모든 콘텐츠 마음껏",price:"30,000원",originalPrice:"",discount:"",badge:"🔥"},
  {id:"mirror_pkg",icon:"🪞",title:"나의 거울 패키지",sub:"나에 대한 18가지 도감 풀세트\n관상+기질+사주+조선+타로+손금+전생+뇌과학+파동 外",price:"18,400원",originalPrice:"26,360원",discount:"30%",badge:"신규"},
  {id:"know_me",icon:"📖",title:"나를 알다 패키지",sub:"내 관상보기+기질도+사주 풀이",price:"2,300원",originalPrice:"2,940원",discount:"20%",badge:"신규"},
  {id:"couple_pkg",icon:"💘",title:"커플 패키지",sub:"관상 궁합+연애운·궁합+연애 타로",price:"3,900원",originalPrice:"4,940원",discount:"20%",badge:"인기"},
  {id:"love_pkg",icon:"💘",title:"관상 연애 패키지",sub:"관상짤+내 관상보기+관상 궁합",price:"2,700원",originalPrice:"3,340원",discount:"20%",badge:"인기"},
  {id:"saju_pkg",icon:"☯️",title:"사주 완전정복 패키지",sub:"사주 풀이+월별 운세+신년 운세",price:"3,100원",originalPrice:"3,940원",discount:"20%",badge:"강추"},
  {id:"tarot_full",icon:"🃏",title:"타로 풀코스 패키지",sub:"연애+건강+재물+진로+인생",price:"3,900원",originalPrice:"4,900원",discount:"20%",badge:"베스트"},
  {id:"baby_album_pkg",icon:"👶",title:"우리 아이 성장 앨범 패키지",sub:"부모 입덕 풀세트! 6종\n2세얼굴+아기관상+돌잡이+부모궁합+태몽+이름짓기",price:"8,400원",originalPrice:"12,100원",discount:"30%",badge:"베스트"},
  {id:"premium_pkg",icon:"✨",title:"프리미엄 패키지",sub:"파동 성명학+뇌과학",price:"7,600원",originalPrice:"9,600원",discount:"20%",badge:"프리미엄"},
  {id:"report_full",icon:"🔍",title:"천기 리포트 풀 패키지",sub:"사주+관상+궁합+기질도+손금+이름",price:"6,300원",originalPrice:"7,880원",discount:"20%",badge:"베스트"},
];

// ─── 마케팅 탭 ───────────────────────────────────────────────────────────────
function MarketingTab(){
  const[toggles,setToggles]=useState({push:false,kakao:false,email:false,newbie:true,weekly:false,birthday:false});
  const[editNotif,setEditNotif]=useState<any>(null);
  const[editCoupon,setEditCoupon]=useState<any>(null);
  // 스페셜 이용권 (마케팅에서 관리)
  const [mktSpecialItems, setMktSpecialItems] = useState(() => {
    try { const s = localStorage.getItem('chungi_special_items_v4'); if (s){const p=JSON.parse(s);if(p.length>=15)return p;} } catch {}
    return SPECIAL_ITEMS_DEFAULT_ADMIN;
  });
  useEffect(()=>{try{localStorage.setItem('chungi_special_items_v4',JSON.stringify(mktSpecialItems));}catch{}},[mktSpecialItems]);
  const[mktSpecialSaved,setMktSpecialSaved]=useState(false);
  function saveMktSpecial(){try{localStorage.setItem('chungi_special_items_v4',JSON.stringify(mktSpecialItems));}catch{}setMktSpecialSaved(true);setTimeout(()=>setMktSpecialSaved(false),2000);}
  function updateMktSpecial(id:string,field:string,value:any){setMktSpecialItems(prev=>prev.map(s=>s.id===id?{...s,[field]:value}:s));}
  const[mktDragIdx,setMktDragIdx]=useState<number|null>(null);
  const[mktDragOverIdx,setMktDragOverIdx]=useState<number|null>(null);
  function mktHandleDragStart(i:number){setMktDragIdx(i);}
  function mktHandleDragOver(e:any,i:number){e.preventDefault();setMktDragOverIdx(i);}
  function mktHandleDrop(i:number){if(mktDragIdx!==null&&mktDragIdx!==i){const arr=[...mktSpecialItems];const[moved]=arr.splice(mktDragIdx,1);arr.splice(i,0,moved);setMktSpecialItems(arr);}setMktDragIdx(null);setMktDragOverIdx(null);}
  const[contentCoupons,setContentCoupons]=useState(()=>{
    try{
      const s=localStorage.getItem('chungi_admin_coupons');
      if(s){
        const saved=JSON.parse(s);
        const savedIds=new Set(saved.map((c:any)=>c.id));
        const missing=COUPONS_INIT.filter(c=>!savedIds.has(c.id));
        return missing.length>0?[...saved,...missing]:saved;
      }
    }catch{}
    return [...COUPONS_INIT];
  });
  useEffect(()=>{try{localStorage.setItem('chungi_admin_coupons',JSON.stringify(contentCoupons));}catch{}},[contentCoupons]);
  const[couponsSaved,setCouponsSaved]=useState(false);
  function saveAllCoupons(){try{localStorage.setItem('chungi_admin_coupons',JSON.stringify(contentCoupons));}catch{}setCouponsSaved(true);setTimeout(()=>setCouponsSaved(false),2000);}
  function restoreDefaultCoupons(){
    if(!window.confirm("기본 쿠폰(선물권 4종·집사 3종 등)을 복구할까요?\n기존 쿠폰은 그대로 유지됩니다."))return;
    setContentCoupons(prev=>{
      const ids=new Set(prev.map((c:any)=>c.id));
      const missing=COUPONS_INIT.filter(c=>!ids.has(c.id));
      return missing.length>0?[...prev,...missing]:prev;
    });
  }
  const[goodsCoupons,setGoodsCoupons]=useState<any[]>([]);
  const[segments,setSegments]=useState([...DEFAULT_SEGMENTS]);
  const[addSegModal,setAddSegModal]=useState(false);
  const[newSeg,setNewSeg]=useState({label:"",color:"var(--blush)"});
  const[newCouponModal,setNewCouponModal]=useState<any>(null);
  const[newCoupon,setNewCoupon]=useState({name:"",code:"",discountType:"percent",discountValue:"",target:"전체",useCondition:"",issueCondition:"",expire:"",minPrice:0,active:true});
  const[editSeg,setEditSeg]=useState<any>(null);
  const[notifSettings,setNotifSettings]=useState({
    push:{title:"오늘의 운세가 도착했어요 🌙",time:"09:00",target:"전체",sub:"오늘의 운세·타로 매일 발송"},
    kakao:{title:"천기 이벤트 안내",time:"10:00",target:"전체",sub:"카카오 가입 회원 대상 · 오픈율 40%+"},
    email:{title:"이번 주 천기 운세 요약",time:"월요일 08:00",target:"전체",sub:"구글·이메일 가입 회원 대상"},
    newbie:{title:"천기에 오신 걸 환영해요! 🔮",time:"가입 직후",target:"🌱 새싹",sub:"가입 직후 자동 발송"},
    weekly:{title:"7일째 보고 싶었어요 😢",time:"미방문 7일째",target:"미방문",sub:"7일 미방문 회원에게 발송"},
    birthday:{title:"생일 축하해요! 🎂 특별 쿠폰",time:"생일 당일",target:"생일",sub:"생일 당일 특별 쿠폰 자동 발송"},
  });
  function toggle(key){setToggles(p=>({...p,[key]:!p[key]}));}

  function CouponSection({title,coupons,setCoupons,couponType}){
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
                  {(c.minPrice||c.minOrder)>0 && <div style={{fontSize:10,color:"var(--cm)"}}>최소 {(c.minPrice||c.minOrder).toLocaleString()}원 이상</div>}
                  <div style={{fontSize:10,color:"var(--mist)",marginTop:1}}>발급 {c.issued} · 사용 {c.used}</div>
                </div>
                <button
                  onClick={()=>setCoupons(prev=>prev.map(x=>x.id===c.id?{...x,active:!x.active}:x))}
                  title={c.active?"클릭해서 비활성화":"클릭해서 활성화"}
                  style={{flexShrink:0,padding:"4px 10px",borderRadius:10,border:`1px solid ${c.active?"rgba(95,196,158,0.4)":"rgba(239,68,68,0.35)"}`,background:c.active?"rgba(95,196,158,0.15)":"rgba(239,68,68,0.12)",color:c.active?"#5fc49e":"#ef4444",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}
                >{c.active?"● 활성":"○ 비활성"}</button>
                <button className="btn btn-g btn-sm" onClick={()=>setEditCoupon({...c,_setter:setCoupons})}>수정</button>
                <button style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",color:"#ef4444",cursor:"pointer",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:6,fontFamily:"inherit"}} onClick={()=>{if(window.confirm(`쿠폰 "${c.name}"를 정말 삭제할까요?`))setCoupons(prev=>prev.filter(x=>x.id!==c.id));}} title="삭제">삭제</button>
              </div>
            ))}
            <button className="btn btn-p btn-sm" style={{marginTop:12,width:"100%",justifyContent:"center"}} onClick={()=>{
              setNewCoupon({name:"",code:"",discountType:"percent",discountValue:"",target:"전체",useCondition:"",issueCondition:"",expire:"",minPrice:0,active:true});
              setNewCouponModal({type:couponType,setter:setCoupons});
            }}>+ 새 쿠폰 만들기</button>
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
            {key:"push",    label:"앱 푸시 알림"},
            {key:"kakao",   label:"카카오 친구톡"},
            {key:"email",   label:"이메일 뉴스레터"},
            {key:"newbie",  label:"신규 가입 웰컴"},
            {key:"weekly",  label:"주간 리마인드"},
            {key:"birthday",label:"생일 쿠폰 발송"},
          ].map(t=>(
            <div key={t.key} className="toggle-row">
              <div style={{flex:1}}>
                <div className="toggle-label">{t.label}</div>
                <div className="toggle-sub">{notifSettings[t.key]?.sub||""}</div>
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

      {/* 쿠폰 — 통합 */}
      <div className="sec"><div className="sec-t">🎁 쿠폰 관리</div></div>
      <div style={{padding:"0 18px 10px",display:"flex",gap:8}}>
        <button onClick={saveAllCoupons} style={{flex:1,padding:"10px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,background:couponsSaved?"rgba(95,196,158,0.3)":"linear-gradient(135deg,var(--ca),var(--gold))",color:couponsSaved?"var(--cj)":"var(--c1)"}}>
          {couponsSaved?"✅ 저장 완료!":"💾 쿠폰 전체 저장"}
        </button>
        <button onClick={restoreDefaultCoupons} style={{padding:"10px 14px",borderRadius:12,border:"1px solid rgba(212,175,55,0.4)",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,background:"transparent",color:"var(--gold)",whiteSpace:"nowrap"}}>
          ↺ 기본 쿠폰 복구
        </button>
      </div>
      <CouponSection title="🎁 전체 쿠폰" coupons={[...contentCoupons,...goodsCoupons]} setCoupons={(fn)=>{setContentCoupons(fn);setGoodsCoupons(fn);}} couponType="all"/>

      <div className="divider"/>

      {/* 💳 스페셜 이용권 관리 */}
      <div className="sec"><div className="sec-t">💳 스페셜 이용권 관리</div></div>
      <div style={{padding:"0 18px 10px"}}>
        <button onClick={saveMktSpecial} style={{width:"100%",padding:"10px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,background:mktSpecialSaved?"rgba(95,196,158,0.3)":"linear-gradient(135deg,var(--ca),var(--gold))",color:mktSpecialSaved?"var(--cj)":"var(--c1)",marginBottom:10}}>
          {mktSpecialSaved?"✅ 저장 완료!":"💾 스페셜 이용권 전체 저장"}
        </button>
      </div>
      <div style={{padding:"0 18px 4px"}}>
        {mktSpecialItems.map((s:any,i:number)=>(
          <div key={s.id} draggable onDragStart={()=>mktHandleDragStart(i)} onDragOver={e=>mktHandleDragOver(e,i)} onDrop={()=>mktHandleDrop(i)} onDragEnd={()=>{setMktDragIdx(null);setMktDragOverIdx(null);}}
            style={{background:mktDragOverIdx===i?"rgba(212,175,55,0.1)":"var(--c2)",borderRadius:14,padding:"12px 14px",marginBottom:8,border:mktDragOverIdx===i?"1px solid rgba(212,175,55,0.3)":"1px solid rgba(255,255,255,0.06)",opacity:mktDragIdx===i?0.5:1,display:"flex",gap:10,alignItems:"stretch"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <input value={s.icon} onChange={e=>updateMktSpecial(s.id,'icon',e.target.value)} style={{width:36,padding:"3px",background:"var(--c3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"var(--ct)",fontFamily:"inherit",fontSize:16,textAlign:"center",outline:"none"}}/>
                <input value={s.title} onChange={e=>updateMktSpecial(s.id,'title',e.target.value)} style={{flex:1,padding:"4px 8px",background:"var(--c3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"var(--ct)",fontFamily:"inherit",fontSize:11,outline:"none",minWidth:0}}/>
                <input value={s.price} onChange={e=>updateMktSpecial(s.id,'price',e.target.value)} style={{width:68,padding:"4px 6px",background:"var(--c3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"var(--ca)",fontFamily:"inherit",fontSize:11,fontWeight:700,outline:"none"}}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <span style={{fontSize:9,color:"var(--cm)"}}>정가</span>
                <input value={s.originalPrice||""} onChange={e=>updateMktSpecial(s.id,'originalPrice',e.target.value)} placeholder="없음" style={{width:58,padding:"3px 6px",background:"var(--c3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"var(--co)",fontFamily:"inherit",fontSize:10,outline:"none",textDecoration:s.originalPrice?"line-through":"none"}}/>
                <span style={{fontSize:9,color:"var(--cm)"}}>할인</span>
                <input value={s.discount||""} onChange={e=>updateMktSpecial(s.id,'discount',e.target.value)} placeholder="20%" style={{width:44,padding:"3px 6px",background:"var(--c3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"var(--co)",fontFamily:"inherit",fontSize:10,fontWeight:700,outline:"none"}}/>
              </div>
              <input value={s.sub} onChange={e=>updateMktSpecial(s.id,'sub',e.target.value)} placeholder="설명" style={{width:"100%",padding:"4px 8px",background:"var(--c3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"var(--cm)",fontFamily:"inherit",fontSize:10,outline:"none",marginBottom:6,boxSizing:"border-box"}}/>
              <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  <button onClick={()=>{const opts=["없음","강추","인기","선물","🔥","신규","이벤트","천기픽","풀코스","할인중","한정판","프리미엄"];const idx=opts.indexOf(s.badge||"없음");updateMktSpecial(s.id,'badge',opts[(idx+1)%opts.length]);}} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:11,padding:"0 2px"}}>◀</button>
                  <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8,background:"rgba(212,175,55,0.15)",color:"var(--ca)",minWidth:28,textAlign:"center"}}>{s.badge||"없음"}</span>
                  <button onClick={()=>{const opts=["없음","강추","인기","선물","🔥","신규","이벤트","천기픽","풀코스","할인중","한정판","프리미엄"];const idx=opts.indexOf(s.badge||"없음");updateMktSpecial(s.id,'badge',opts[(idx+1)%opts.length]);}} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:11,padding:"0 2px"}}>▶</button>
                </div>
                <button onClick={()=>updateMktSpecial(s.id,'visible',!(s.visible!==false))} style={{padding:"3px 8px",borderRadius:8,fontSize:9,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:s.visible!==false?"rgba(95,196,158,0.15)":"rgba(139,41,41,0.15)",color:s.visible!==false?"var(--cj)":"var(--co)"}}>{s.visible!==false?"공개":"비공개"}</button>
                <button onClick={()=>updateMktSpecial(s.id,'mainExpose',!(s.mainExpose!==false))} style={{padding:"3px 8px",borderRadius:8,fontSize:9,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:s.mainExpose!==false?"rgba(212,175,55,0.2)":"rgba(255,255,255,0.05)",color:s.mainExpose!==false?"var(--ca)":"var(--cm)"}}>{s.mainExpose!==false?"🏠메인":"메인숨김"}</button>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,flexShrink:0,cursor:"grab",borderLeft:"1px solid rgba(255,255,255,0.06)",paddingLeft:8}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{fontSize:16,color:"var(--cm)",lineHeight:1}}>⠿</div>
                <div style={{fontSize:8,color:"var(--cm)"}}>{i+1}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider"/>

      {/* 🎋 시즌 관리 — 마케팅으로 이동됨 */}
      <SeasonTab/>

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
                {!s.locked&&<button className="btn btn-sm btn-g" onClick={()=>setEditSeg({...s})}>수정</button>}
                {!s.locked&&<button style={{padding:"4px 10px",borderRadius:6,background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.35)",color:"#ff6b6b",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setSegments(prev=>prev.filter(x=>x.id!==s.id))}>[삭제]</button>}
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
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>메시지 제목</label>
            <input className="inp" value={editNotif.title} onChange={e=>setEditNotif(p=>({...p,title:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>설명 (서브 텍스트)</label>
            <input className="inp" value={editNotif.sub||""} onChange={e=>setEditNotif(p=>({...p,sub:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>발송 시간</label>
            <input className="inp" value={editNotif.time} onChange={e=>setEditNotif(p=>({...p,time:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>발송 대상</label>
            <select className="inp sel" style={{marginBottom:16}} value={editNotif.target} onChange={e=>setEditNotif(p=>({...p,target:e.target.value}))}>
              {["전체","🌱 새싹","🌙 달","⭐ 별","☀️ 태양","🌟 샛별","💫 북극성","🐉 천기인","🛍️ 개운러","미방문","생일"].map(v=><option key={v}>{v}</option>)}
            </select>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setEditNotif(null)}>취소</button>
              <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>{
                setNotifSettings(p=>({...p,[editNotif.key]:{title:editNotif.title,time:editNotif.time,target:editNotif.target,sub:editNotif.sub||""}}));
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
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>할인 타입</label>
            <select className="inp sel" value={editCoupon.discountType||"fixed"} onChange={e=>setEditCoupon(p=>({...p,discountType:e.target.value}))} style={{marginBottom:12}}>
              <option value="percent">퍼센트 (%)</option>
              <option value="fixed">정액 (원)</option>
            </select>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>할인 값</label>
            <input className="inp" value={editCoupon.discount} onChange={e=>setEditCoupon(p=>({...p,discount:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>적용 대상</label>
            <select className="inp sel" value={editCoupon.target||"전체"} onChange={e=>setEditCoupon(p=>({...p,target:e.target.value}))} style={{marginBottom:12}}>
              <option value="전체">전체</option>
              <option value="굿즈">굿즈</option>
              <option value="콘텐츠">콘텐츠</option>
              <option value="특정 상품">특정 상품</option>
            </select>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>사용 조건</label>
            <input className="inp" placeholder="예: 980원 이상 콘텐츠" value={editCoupon.useCondition||""} onChange={e=>setEditCoupon(p=>({...p,useCondition:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>발급 조건</label>
            <input className="inp" placeholder="예: 가입시 자동 / 공유 1회" value={editCoupon.issueCondition||""} onChange={e=>setEditCoupon(p=>({...p,issueCondition:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>만료일</label>
            <input className="inp" value={editCoupon.expire} onChange={e=>setEditCoupon(p=>({...p,expire:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>최소 구매 금액</label>
            <input className="inp" type="number" placeholder="0 (제한 없음)" value={editCoupon.minPrice||editCoupon.minOrder||""} onChange={e=>setEditCoupon(p=>({...p,minPrice:parseInt(e.target.value)||0,minOrder:parseInt(e.target.value)||0}))} style={{marginBottom:12}}/>
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
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {["var(--blush)","var(--jade)","var(--violet)","var(--coral)","var(--gold)","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8"].map(c=>(
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
                setSegments(prev=>[...prev,{id:Date.now(),label:newSeg.label,color:newSeg.color,count:0,locked:false}]);
                setNewSeg({label:"",color:"var(--blush)"});
                setAddSegModal(false);
              }}>추가하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 새 쿠폰 만들기 모달 */}
      {newCouponModal&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setNewCouponModal(null);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🎁 새 쿠폰 만들기</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>쿠폰 이름</label>
            <input className="inp" placeholder="예: 첫 결제 10% 할인" value={newCoupon.name} onChange={e=>setNewCoupon(p=>({...p,name:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>쿠폰 코드</label>
            <input className="inp" placeholder="예: WELCOME10" value={newCoupon.code} onChange={e=>setNewCoupon(p=>({...p,code:e.target.value.toUpperCase()}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>할인 타입</label>
            <select className="inp sel" value={newCoupon.discountType} onChange={e=>setNewCoupon(p=>({...p,discountType:e.target.value}))} style={{marginBottom:12}}>
              <option value="percent">퍼센트 (%)</option>
              <option value="fixed">정액 (원)</option>
            </select>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>할인 값</label>
            <input className="inp" type="number" placeholder={newCoupon.discountType==="percent"?"예: 10":"예: 1000"} value={newCoupon.discountValue} onChange={e=>setNewCoupon(p=>({...p,discountValue:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>적용 대상</label>
            <select className="inp sel" value={newCoupon.target} onChange={e=>setNewCoupon(p=>({...p,target:e.target.value}))} style={{marginBottom:12}}>
              <option value="전체">전체</option>
              <option value="굿즈">굿즈</option>
              <option value="콘텐츠">콘텐츠</option>
              <option value="특정 상품">특정 상품</option>
            </select>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>사용 조건</label>
            <input className="inp" placeholder="예: 980원 이상 콘텐츠" value={(newCoupon as any).useCondition||""} onChange={e=>setNewCoupon(p=>({...p,useCondition:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>발급 조건</label>
            <input className="inp" placeholder="예: 가입시 자동 / 공유 1회" value={(newCoupon as any).issueCondition||""} onChange={e=>setNewCoupon(p=>({...p,issueCondition:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>만료일</label>
            <input className="inp" placeholder="예: 2026.12.31 또는 상시" value={newCoupon.expire} onChange={e=>setNewCoupon(p=>({...p,expire:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>최소 구매 금액</label>
            <input className="inp" type="number" placeholder="0 (제한 없음)" value={(newCoupon as any).minPrice||""} onChange={e=>setNewCoupon(p=>({...p,minPrice:parseInt(e.target.value)||0}))} style={{marginBottom:12}}/>
            <div className="toggle-row" style={{marginBottom:14,borderBottom:"none"}}>
              <div className="toggle-label">활성 여부</div>
              <button className={`toggle${newCoupon.active?" on":""}`} onClick={()=>setNewCoupon(p=>({...p,active:!p.active}))}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setNewCouponModal(null)}>취소</button>
              <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>{
                if(!newCoupon.name.trim()||!newCoupon.code.trim()) return;
                const discountLabel = newCoupon.discountType==="percent"?`${newCoupon.discountValue}%`:`${newCoupon.discountValue}원`;
                const coupon = {
                  id:Date.now(),
                  code:newCoupon.code,
                  name:newCoupon.name,
                  type:newCouponModal.type,
                  discount:discountLabel,
                  minOrder:(newCoupon as any).minPrice||0,
                  minPrice:(newCoupon as any).minPrice||0,
                  expire:newCoupon.expire||"상시",
                  issued:0,used:0,
                  active:newCoupon.active,
                };
                newCouponModal.setter(prev=>[...prev,coupon]);
                setNewCouponModal(null);
              }}>저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 세그먼트 수정 모달 */}
      {editSeg&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setEditSeg(null);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🎯 세그먼트 수정</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:5}}>세그먼트 이름</label>
            <input className="inp" value={editSeg.label} onChange={e=>setEditSeg(p=>({...p,label:e.target.value}))} style={{marginBottom:12}}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:8}}>색상 선택</label>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {["var(--blush)","var(--jade)","var(--violet)","var(--coral)","var(--gold)","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8"].map(c=>(
                <div key={c} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:editSeg.color===c?"3px solid white":"3px solid transparent"}} onClick={()=>setEditSeg(p=>({...p,color:c}))}/>
              ))}
            </div>
            <div style={{background:"var(--ink3)",borderRadius:12,padding:"11px",marginBottom:14,fontSize:12}}>
              <div style={{color:"var(--mist)",marginBottom:3}}>미리보기:</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:editSeg.color}}/>
                <span style={{fontWeight:700}}>{editSeg.label||"세그먼트 이름"}</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>setEditSeg(null)}>취소</button>
              <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>{
                if(!editSeg.label.trim()) return;
                setSegments(prev=>prev.map(s=>s.id===editSeg.id?{...s,label:editSeg.label,color:editSeg.color}:s));
                setEditSeg(null);
              }}>저장</button>
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
  const[goods,setGoods]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[search,setSearch]=useState("");
  const[filterCat,setFilterCat]=useState("전체");
  const[filterVisible,setFilterVisible]=useState("전체");
  const[editId,setEditId]=useState<any>(null);

  useEffect(()=>{
    fetch("/api/goods?admin=true")
      .then(r=>r.json())
      .then(d=>{
        if(d.goods){
          // Map Supabase columns to admin display format
          const mapped=d.goods.map((g:any)=>({
            ...g,
            cat: g.category || g.cat || "",
            visible: g.is_public ?? true,
            rec: g.is_active ?? false,
            season: g.is_season ?? false,
            stock: typeof g.stock==="number" ? g.stock>0 : g.stock ?? true,
            icon: g.icon || "📦",
          }));
          setGoods(mapped);
        }
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  },[]);

  const cats=["전체","추천","12수호신","띠별","별자리","혈액형","기질도","수비학","전생유형","집안정화","미니부적","오행보완","기운회복","기운보강","향인센스","한국뮷즈","외국부적","운세점사","럭키템","커플연애","반려동물","손금점키트","집안수호신","이사개업","종교영성","탄생수호","천기주얼리","천기굿즈"];

  const filtered=goods.filter(g=>{
    const matchSearch=(g.name||"").includes(search)||(g.cat||"").includes(search);
    const matchCat=filterCat==="전체"||g.cat===filterCat;
    const matchVis=filterVisible==="전체"||(filterVisible==="공개"?g.visible:!g.visible);
    return matchSearch&&matchCat&&matchVis;
  });

  // Map local field names to Supabase column names
  const fieldToColumn:Record<string,string> = { visible:"is_public", season:"is_season", rec:"is_active", stock:"stock" };

  async function toggle(id:number,field:string){
    const current=goods.find(g=>g.id===id);
    if(!current) return;
    const newVal=!current[field];
    // Optimistic update
    setGoods(p=>p.map(g=>g.id===id?{...g,[field]:newVal}:g));
    // Send to Supabase
    const dbField=fieldToColumn[field]||field;
    const dbVal=field==="stock" ? (newVal ? 100 : 0) : newVal;
    try{
      const res=await fetch("/api/goods",{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id,[dbField]:dbVal})
      });
      if(!res.ok){
        console.error("굿즈 토글 저장 실패:",res.status,await res.text());
        // Revert on failure
        setGoods(p=>p.map(g=>g.id===id?{...g,[field]:!newVal}:g));
      }
    }catch(err){
      console.error("굿즈 토글 에러:",err);
      // Revert on failure
      setGoods(p=>p.map(g=>g.id===id?{...g,[field]:!newVal}:g));
    }
  }

  const[saveAllLoading,setSaveAllLoading]=useState(false);
  const[saveAllDone,setSaveAllDone]=useState(false);
  async function saveAllGoods(){
    setSaveAllLoading(true);
    let ok=0,fail=0;
    for(const g of goods){
      try{
        const res=await fetch("/api/goods",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({id:g.id,is_public:g.visible,is_active:g.rec,is_season:g.season,stock:g.stock?100:0})
        });
        if(res.ok)ok++;else fail++;
      }catch{fail++;}
    }
    setSaveAllLoading(false);
    setSaveAllDone(true);
    setTimeout(()=>setSaveAllDone(false),2500);
  }

  const visCount=goods.filter(g=>g.visible).length;
  const hidCount=goods.filter(g=>!g.visible).length;
  const noStockCount=goods.filter(g=>!g.stock).length;

  if(loading) return(
    <div className="apage">
      <div className="asec"><div className="asec-t">🛍️ 굿즈 관리</div></div>
      <div style={{textAlign:"center",padding:"60px 0",color:"var(--cm)"}}>
        <div style={{fontSize:32,marginBottom:12}}>⏳</div>
        <div style={{fontSize:13}}>상품 데이터를 불러오는 중...</div>
      </div>
    </div>
  );

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
              style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:filterCat===c?"rgba(212,175,55,0.2)":"var(--c2)",color:filterCat===c?"var(--ca)":"var(--cm)"}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 전체 저장 버튼 */}
      <div style={{padding:"0 16px 10px"}}>
        <button onClick={saveAllGoods} disabled={saveAllLoading}
          style={{width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:saveAllLoading?"not-allowed":"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,background:saveAllDone?"rgba(95,196,158,0.3)":saveAllLoading?"var(--c3)":"linear-gradient(135deg,var(--ca),var(--gold))",color:saveAllDone?"var(--cj)":saveAllLoading?"var(--cm)":"var(--c1)"}}>
          {saveAllDone?`✅ 전체 저장 완료! (${goods.length}개)`:saveAllLoading?"저장 중...":`💾 굿즈 전체 저장 (${goods.length}개 한번에)`}
        </button>
      </div>

      {/* 일괄 처리 */}
      <div style={{padding:"0 16px 10px",display:"flex",gap:8}}>
        <button onClick={()=>setGoods(p=>p.map(g=>({...g,visible:true})))}
          style={{padding:"7px 14px",borderRadius:10,fontSize:11,fontWeight:700,border:"1px solid rgba(95,196,158,0.3)",background:"rgba(95,196,158,0.1)",color:"var(--cj)",cursor:"pointer",fontFamily:"inherit"}}>
          전체 공개
        </button>
        <button onClick={()=>setGoods(p=>p.map(g=>({...g,visible:false})))}
          style={{padding:"7px 14px",borderRadius:10,fontSize:11,fontWeight:700,border:"1px solid rgba(139,41,41,0.3)",background:"rgba(139,41,41,0.1)",color:"var(--co)",cursor:"pointer",fontFamily:"inherit"}}>
          전체 비공개
        </button>
        <div style={{marginLeft:"auto",fontSize:11,color:"var(--cm)",display:"flex",alignItems:"center"}}>
          {filtered.length}개 표시
        </div>
      </div>

      {/* 상품 목록 */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8,paddingBottom:80}}>
        {filtered.map(g=>(
          <div key={g.id} style={{background:"var(--c2)",borderRadius:14,padding:"12px 14px",border:`1px solid ${g.visible?"rgba(255,255,255,0.06)":"rgba(139,41,41,0.15)"}`,opacity:g.visible?1:0.65}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:28,flexShrink:0,width:44,height:44,borderRadius:10,background:"var(--c3)",display:"flex",alignItems:"center",justifyContent:"center"}}>{g.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:2,display:"flex",alignItems:"center",gap:6}}>
                  {g.name}
                  {!g.stock&&<span style={{fontSize:9,fontWeight:700,background:"rgba(139,41,41,0.2)",color:"var(--co)",padding:"1px 6px",borderRadius:8}}>품절</span>}
                  {g.price>=30000&&<span style={{fontSize:9,fontWeight:700,background:"rgba(155,143,212,0.2)",color:"var(--violet)",padding:"1px 6px",borderRadius:8}}>프리미엄</span>}
                  {g.season&&<span style={{fontSize:9,fontWeight:700,background:"rgba(212,175,55,0.2)",color:"var(--ca)",padding:"1px 6px",borderRadius:8}}>시즌</span>}
                  {g.rec&&<span style={{fontSize:9,fontWeight:700,background:"rgba(212,175,55,0.15)",color:"var(--ca)",padding:"1px 6px",borderRadius:8}}>추천</span>}
                </div>
                <div style={{fontSize:10,color:"var(--cm)"}}>{g.cat} · {g.price.toLocaleString()}원</div>
              </div>
            </div>
            {/* 토글 컨트롤 */}
            <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
              {[
                {label:"공개", field:"visible",  on:g.visible, onColor:"var(--cj)", offColor:"var(--co)"},
                {label:"시즌", field:"season",  on:g.season, onColor:"var(--ca)", offColor:"var(--cm)"},
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎋 대나무숲 관리 — 카테고리 CRUD · 글/댓글 모니터링 · 키워드 필터 · 사용자 차단 · 공지 · 통계
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DEFAULT_CATEGORIES=[
  {id:"brag",name:"자랑",emoji:"✨",order:1},
  {id:"worry",name:"고민",emoji:"💭",order:2},
  {id:"pilgrim",name:"성지순례",emoji:"🙏",order:3},
  {id:"qna",name:"Q&A",emoji:"❓",order:4},
  {id:"love",name:"연애",emoji:"💘",order:5},
  {id:"money",name:"재물",emoji:"💰",order:6},
  {id:"career",name:"이직",emoji:"💼",order:7},
  {id:"health",name:"건강",emoji:"🌿",order:8},
  {id:"daily",name:"일상",emoji:"☕",order:9},
];
const DEFAULT_BLOCKED_KEYWORDS=["광고","홍보","카지노","토토","성인","야동","섹스","폰번호","계좌","입금"];

function CommunityTab(){
  const[subTab,setSubTab]=useState<"posts"|"comments"|"categories"|"filter"|"users"|"notice"|"stats">("posts");
  // 서브탭 드래그 스크롤 (마우스)
  const subTabRef=useRef<HTMLDivElement|null>(null);
  const dragState=useRef({down:false,startX:0,scrollLeft:0,moved:false});
  function onSubTabMouseDown(e:React.MouseEvent){
    if(!subTabRef.current)return;
    dragState.current={down:true,startX:e.pageX-subTabRef.current.offsetLeft,scrollLeft:subTabRef.current.scrollLeft,moved:false};
  }
  function onSubTabMouseMove(e:React.MouseEvent){
    if(!dragState.current.down||!subTabRef.current)return;
    e.preventDefault();
    const x=e.pageX-subTabRef.current.offsetLeft;
    const walk=x-dragState.current.startX;
    if(Math.abs(walk)>3)dragState.current.moved=true;
    subTabRef.current.scrollLeft=dragState.current.scrollLeft-walk;
  }
  function onSubTabMouseEnd(){dragState.current.down=false;}
  // 카테고리
  const[categories,setCategories]=useState<any[]>(()=>{try{const s=localStorage.getItem("chungi_bamboo_categories");return s?JSON.parse(s):DEFAULT_CATEGORIES;}catch{return DEFAULT_CATEGORIES;}});
  const[editCat,setEditCat]=useState<any>(null);
  const[newCat,setNewCat]=useState({name:"",emoji:""});
  // 키워드 필터
  const[blockedWords,setBlockedWords]=useState<string[]>(()=>{try{const s=localStorage.getItem("chungi_bamboo_blocked_words");return s?JSON.parse(s):DEFAULT_BLOCKED_KEYWORDS;}catch{return DEFAULT_BLOCKED_KEYWORDS;}});
  const[newWord,setNewWord]=useState("");
  // 사용자 차단
  const[blockedNicks,setBlockedNicks]=useState<string[]>(()=>{try{const s=localStorage.getItem("chungi_bamboo_blocked_nicks");return s?JSON.parse(s):[];}catch{return[];}});
  const[newNick,setNewNick]=useState("");
  // 글/댓글 로드
  const[posts,setPosts]=useState<any[]>(()=>{try{return JSON.parse(localStorage.getItem("chungi_bamboo_posts")||"[]");}catch{return[];}});
  const[allComments,setAllComments]=useState<Record<number,any[]>>(()=>{try{return JSON.parse(localStorage.getItem("chungi_bamboo_comments")||"{}");}catch{return{};}});
  const[savedMsg,setSavedMsg]=useState("");
  const[postSearch,setPostSearch]=useState("");

  function toast(msg:string){setSavedMsg(msg);setTimeout(()=>setSavedMsg(""),1800);}
  function saveCategories(arr:any[]){setCategories(arr);try{localStorage.setItem("chungi_bamboo_categories",JSON.stringify(arr));}catch{}toast("카테고리 저장됨");}
  function saveBlockedWords(arr:string[]){setBlockedWords(arr);try{localStorage.setItem("chungi_bamboo_blocked_words",JSON.stringify(arr));}catch{}toast("키워드 저장됨");}
  function saveBlockedNicks(arr:string[]){setBlockedNicks(arr);try{localStorage.setItem("chungi_bamboo_blocked_nicks",JSON.stringify(arr));}catch{}toast("차단 사용자 저장됨");}
  function savePosts(arr:any[]){setPosts(arr);try{localStorage.setItem("chungi_bamboo_posts",JSON.stringify(arr));}catch{}}
  function saveAllComments(cm:Record<number,any[]>){setAllComments(cm);try{localStorage.setItem("chungi_bamboo_comments",JSON.stringify(cm));}catch{}}

  // 카테고리 CRUD
  function addCategory(){
    if(!newCat.name.trim()){alert("카테고리명을 입력해주세요");return;}
    const id=`cat_${Date.now()}`;
    const order=Math.max(0,...categories.map(c=>c.order))+1;
    saveCategories([...categories,{id,name:newCat.name.trim(),emoji:newCat.emoji||"🏷️",order}]);
    setNewCat({name:"",emoji:""});
  }
  function updateCategory(id:string,patch:any){saveCategories(categories.map(c=>c.id===id?{...c,...patch}:c));}
  function deleteCategory(id:string){if(!confirm("이 카테고리를 삭제할까요?"))return;saveCategories(categories.filter(c=>c.id!==id));}
  function moveCategory(id:string,dir:-1|1){
    const idx=categories.findIndex(c=>c.id===id);if(idx<0)return;
    const target=idx+dir;if(target<0||target>=categories.length)return;
    const arr=[...categories];const[m]=arr.splice(idx,1);arr.splice(target,0,m);
    saveCategories(arr.map((c,i)=>({...c,order:i+1})));
  }

  // 키워드 필터 CRUD
  function addBlockedWord(){
    const w=newWord.trim();if(!w)return;
    if(blockedWords.includes(w)){alert("이미 등록된 키워드예요");return;}
    saveBlockedWords([...blockedWords,w]);setNewWord("");
  }
  function removeBlockedWord(w:string){saveBlockedWords(blockedWords.filter(x=>x!==w));}

  // 사용자 차단 CRUD
  function addBlockedNick(){
    const n=newNick.trim();if(!n)return;
    if(blockedNicks.includes(n)){alert("이미 차단된 사용자예요");return;}
    saveBlockedNicks([...blockedNicks,n]);setNewNick("");
  }
  function removeBlockedNick(n:string){saveBlockedNicks(blockedNicks.filter(x=>x!==n));}

  // 글 강제 삭제
  function forceDeletePost(id:number){
    if(!confirm("이 글을 강제 삭제할까요? 댓글도 함께 사라져요."))return;
    savePosts(posts.filter(p=>p.id!==id));
    const nc={...allComments};delete nc[id];saveAllComments(nc);
  }
  // 글 고정/해제
  function togglePin(id:number){savePosts(posts.map(p=>p.id===id?{...p,pinned:!p.pinned}:p));}
  // 댓글 삭제
  function deleteComment(postId:number,commentId:number){
    if(!confirm("이 댓글을 삭제할까요?"))return;
    const nc={...allComments,[postId]:(allComments[postId]||[]).filter(c=>c.id!==commentId)};
    saveAllComments(nc);
    savePosts(posts.map(p=>p.id===postId?{...p,comments:Math.max(0,(p.comments||1)-1)}:p));
  }

  // 금칙어 자동 스캔 — 글/댓글 중 금칙어 포함된 것
  const flaggedPosts=posts.filter(p=>{
    const text=`${p.title||""} ${p.content||""}`.toLowerCase();
    return blockedWords.some(w=>text.includes(w.toLowerCase()));
  });
  const flaggedComments:any[]=[];
  Object.entries(allComments).forEach(([pid,cs])=>{
    cs.forEach(c=>{
      if(blockedWords.some(w=>(c.content||"").toLowerCase().includes(w.toLowerCase()))){
        flaggedComments.push({...c,postId:parseInt(pid)});
      }
    });
  });

  // 통계
  const totalComments=Object.values(allComments).reduce((s,cs)=>s+cs.length,0);
  const totalViews=posts.reduce((s,p)=>s+(p.views||0),0);
  const totalLikes=posts.reduce((s,p)=>s+(p.likes||0),0);
  const topAuthors:Record<string,number>={};
  posts.forEach(p=>{if(p.nick)topAuthors[p.nick]=(topAuthors[p.nick]||0)+1;});
  const topAuthorsList=Object.entries(topAuthors).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const filteredPosts=posts.filter(p=>{
    const q=postSearch.trim().toLowerCase();
    if(!q)return true;
    return(p.title||"").toLowerCase().includes(q)||(p.content||"").toLowerCase().includes(q)||(p.nick||"").toLowerCase().includes(q);
  });

  const subTabs=[
    {id:"posts",ic:"📝",lb:`글 (${posts.length})`},
    {id:"comments",ic:"💬",lb:`댓글 (${totalComments})`},
    {id:"categories",ic:"🏷️",lb:"카테고리"},
    {id:"filter",ic:"🚫",lb:`키워드 필터${flaggedPosts.length+flaggedComments.length>0?` (🚨${flaggedPosts.length+flaggedComments.length})`:""}`},
    {id:"users",ic:"👤",lb:"사용자 차단"},
    {id:"notice",ic:"📌",lb:"공지 고정"},
    {id:"stats",ic:"📊",lb:"통계"},
  ];

  return(
    <div className="page">
      <div style={{padding:"20px 18px 6px"}}>
        <div style={{fontSize:20,fontWeight:900,marginBottom:8}}>🎋 대나무숲 관리</div>
        {/* 관리 항목 — 3칸 × 2줄 grid (한줄 글자 잘림 방지, 사용자 요청 v233) */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,fontSize:11,color:"var(--mist)"}}>
          {[
            {ic:"🏷️",t:"카테고리"},
            {ic:"📝",t:"글 모니터링"},
            {ic:"💬",t:"댓글 모니터링"},
            {ic:"🚫",t:"키워드 필터"},
            {ic:"👤",t:"사용자 차단"},
            {ic:"📊",t:"공지·통계"},
          ].map(it=>(
            <div key={it.t} style={{background:"rgba(95,196,158,0.06)",border:"1px solid rgba(95,196,158,0.18)",borderRadius:8,padding:"6px 8px",textAlign:"center",fontWeight:700,color:"#5fc49e"}}>{it.ic} {it.t}</div>
          ))}
        </div>
      </div>

      {/* 서브탭 — 마우스 드래그 + 터치 스크롤 */}
      <div
        ref={subTabRef}
        onMouseDown={onSubTabMouseDown}
        onMouseMove={onSubTabMouseMove}
        onMouseUp={onSubTabMouseEnd}
        onMouseLeave={onSubTabMouseEnd}
        style={{display:"flex",gap:6,overflowX:"auto",padding:"10px 18px",scrollbarWidth:"none",WebkitOverflowScrolling:"touch" as any,cursor:"grab",userSelect:"none"}}
      >
        {subTabs.map(t=>{
          const sel=subTab===t.id;
          return <button key={t.id} onClick={()=>{if(!dragState.current.moved)setSubTab(t.id as any);}} style={{flexShrink:0,padding:"7px 13px",background:sel?"linear-gradient(135deg,#5fc49e,#3a9e74)":"rgba(255,255,255,0.04)",color:sel?"#0e2921":"var(--mist)",border:`1px solid ${sel?"#5fc49e":"rgba(255,255,255,0.08)"}`,borderRadius:18,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",pointerEvents:"auto"}}>{t.ic} {t.lb}</button>;
        })}
      </div>

      {savedMsg&&<div style={{padding:"0 18px 6px",fontSize:11,color:"#5fc49e",fontWeight:700}}>✓ {savedMsg}</div>}

      {/* 📝 글 모니터링 */}
      {subTab==="posts"&&
        <div style={{padding:"10px 18px"}}>
          <input type="text" placeholder="🔎 제목·본문·닉네임 검색" value={postSearch} onChange={e=>setPostSearch(e.target.value)} style={{width:"100%",padding:10,background:"var(--ink3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,color:"#fff",fontSize:12,marginBottom:10,fontFamily:"inherit"}}/>
          {filteredPosts.length===0?<div style={{textAlign:"center",padding:"40px 0",color:"var(--mist)",fontSize:12}}>글이 없습니다</div>:
            filteredPosts.map(p=>{
              const flagged=blockedWords.some(w=>`${p.title} ${p.content}`.toLowerCase().includes(w.toLowerCase()));
              return(
                <div key={p.id} style={{background:flagged?"rgba(255,107,107,0.06)":"rgba(255,255,255,0.03)",border:`1px solid ${flagged?"rgba(255,107,107,0.3)":"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"12px 14px",marginBottom:8}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,fontSize:10,flexWrap:"wrap"}}>
                    <span style={{color:"#5fc49e",fontWeight:700}}>{p.cat}</span>
                    <span style={{color:"#E8C87A",fontWeight:700}}>🌿 {p.nick}</span>
                    <span style={{color:"var(--mist)"}}>{p.date}</span>
                    {p.pinned&&<span style={{background:"#5fc49e",color:"#0e2921",padding:"1px 6px",borderRadius:5,fontSize:9,fontWeight:800}}>📌 고정</span>}
                    {flagged&&<span style={{background:"#ff6b6b",color:"#fff",padding:"1px 6px",borderRadius:5,fontSize:9,fontWeight:800}}>🚨 금칙어</span>}
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:3}}>{p.title}</div>
                  <div style={{fontSize:11,color:"rgba(220,232,226,0.6)",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as any,overflow:"hidden",marginBottom:8}}>{p.content}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:10,color:"var(--mist)"}}>❤ {p.likes} · 💬 {p.comments} · 👁 {p.views}</span>
                    <button onClick={()=>togglePin(p.id)} style={{marginLeft:"auto",padding:"4px 10px",borderRadius:6,background:p.pinned?"rgba(95,196,158,0.15)":"rgba(255,255,255,0.05)",border:"1px solid rgba(95,196,158,0.3)",color:"#5fc49e",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{p.pinned?"📌 고정 해제":"📌 고정"}</button>
                    <button onClick={()=>forceDeletePost(p.id)} style={{padding:"4px 10px",borderRadius:6,background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.35)",color:"#ff6b6b",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[삭제]</button>
                  </div>
                </div>
              );
            })
          }
        </div>
      }

      {/* 💬 댓글 모니터링 */}
      {subTab==="comments"&&
        <div style={{padding:"10px 18px"}}>
          {totalComments===0?<div style={{textAlign:"center",padding:"40px 0",color:"var(--mist)",fontSize:12}}>댓글이 없습니다</div>:
            Object.entries(allComments).map(([pid,cs])=>{
              const post=posts.find(p=>p.id===parseInt(pid));
              if(!post||cs.length===0)return null;
              return(
                <div key={pid} style={{marginBottom:12,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.05)"}}>
                  <div style={{fontSize:11,color:"#E8C87A",fontWeight:700,marginBottom:6,borderBottom:"1px dashed rgba(255,255,255,0.1)",paddingBottom:4}}>📝 {post.title}</div>
                  {cs.map(c=>{
                    const flagged=blockedWords.some(w=>(c.content||"").toLowerCase().includes(w.toLowerCase()));
                    return(
                      <div key={c.id} style={{padding:"8px 0",borderBottom:"1px dashed rgba(255,255,255,0.06)",display:"flex",gap:8,alignItems:"flex-start"}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:10,color:"#5fc49e",fontWeight:700,marginBottom:2}}>🌿 {c.nick} <span style={{color:"rgba(168,196,184,0.5)",fontWeight:400}}>· {c.date}</span> {flagged&&<span style={{background:"#ff6b6b",color:"#fff",padding:"1px 5px",borderRadius:4,fontSize:8,fontWeight:800,marginLeft:4}}>🚨</span>}</div>
                          <div style={{fontSize:11,color:"#ddd",lineHeight:1.5}}>{c.content}</div>
                        </div>
                        <button onClick={()=>deleteComment(parseInt(pid),c.id)} style={{flexShrink:0,padding:"4px 10px",borderRadius:6,background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.35)",color:"#ff6b6b",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[삭제]</button>
                      </div>
                    );
                  })}
                </div>
              );
            })
          }
        </div>
      }

      {/* 🏷️ 카테고리 CRUD */}
      {subTab==="categories"&&
        <div style={{padding:"10px 18px"}}>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:8}}>카테고리 추가·수정·삭제·순서 변경</div>
          {/* 추가 폼 */}
          <div style={{background:"var(--ink3)",borderRadius:12,padding:"10px 12px",marginBottom:12,border:"1px solid rgba(95,196,158,0.2)"}}>
            <div style={{fontSize:11,color:"#5fc49e",fontWeight:700,marginBottom:6}}>➕ 새 카테고리 추가</div>
            <div style={{display:"flex",gap:6}}>
              <input type="text" placeholder="이모지 (예: ✨)" value={newCat.emoji} onChange={e=>setNewCat(p=>({...p,emoji:e.target.value}))} style={{width:80,padding:8,background:"var(--ink)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"#fff",fontSize:12,fontFamily:"inherit"}}/>
              <input type="text" placeholder="카테고리명" value={newCat.name} onChange={e=>setNewCat(p=>({...p,name:e.target.value}))} style={{flex:1,padding:8,background:"var(--ink)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"#fff",fontSize:12,fontFamily:"inherit"}}/>
              <button onClick={addCategory} style={{padding:"8px 14px",background:"#5fc49e",color:"#0e2921",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>추가</button>
            </div>
          </div>
          {/* 카테고리 리스트 — active 토글 추가 (사용자 요청 v233) */}
          {categories.map((c,i)=>{
            const isActive=c.active!==false; // 기본 true (기존 카테고리 호환)
            return (
            <div key={c.id} style={{background:isActive?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.2)",border:`1px solid ${isActive?"rgba(255,255,255,0.07)":"rgba(255,107,107,0.2)"}`,borderRadius:10,padding:"10px 12px",marginBottom:6,display:"flex",alignItems:"center",gap:8,opacity:isActive?1:0.55}}>
              <div style={{fontSize:9,color:"var(--mist)",width:20}}>{i+1}</div>
              <div style={{fontSize:22,width:30}}>{c.emoji}</div>
              {editCat?.id===c.id?
                <input autoFocus type="text" value={editCat.name} onChange={e=>setEditCat((p:any)=>({...p,name:e.target.value}))} onBlur={()=>{if(editCat.name.trim())updateCategory(c.id,{name:editCat.name.trim(),emoji:editCat.emoji});setEditCat(null);}} onKeyDown={e=>{if(e.key==="Enter"){if(editCat.name.trim())updateCategory(c.id,{name:editCat.name.trim(),emoji:editCat.emoji});setEditCat(null);}}} style={{flex:1,padding:6,background:"var(--ink)",border:"1px solid #5fc49e",borderRadius:6,color:"#fff",fontSize:12,fontFamily:"inherit"}}/>
                :<div style={{flex:1,fontSize:13,fontWeight:700,color:isActive?"#fff":"rgba(255,255,255,0.5)"}}>{c.name}{!isActive&&<span style={{fontSize:9,marginLeft:6,padding:"1px 6px",background:"rgba(255,107,107,0.15)",color:"#ff6b6b",borderRadius:6,fontWeight:800}}>비활성</span>}</div>
              }
              <button onClick={()=>updateCategory(c.id,{active:!isActive})} title={isActive?"비활성화":"활성화"} style={{padding:"4px 10px",borderRadius:6,background:isActive?"rgba(95,196,158,0.15)":"rgba(150,150,150,0.15)",border:`1px solid ${isActive?"rgba(95,196,158,0.4)":"rgba(150,150,150,0.4)"}`,color:isActive?"#5fc49e":"#888",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{isActive?"✓ 활성":"○ 비활성"}</button>
              <button onClick={()=>moveCategory(c.id,-1)} disabled={i===0} style={{padding:"4px 8px",borderRadius:6,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:i===0?"rgba(168,196,184,0.3)":"#fff",fontSize:11,cursor:i===0?"not-allowed":"pointer",fontFamily:"inherit"}}>▲</button>
              <button onClick={()=>moveCategory(c.id,1)} disabled={i===categories.length-1} style={{padding:"4px 8px",borderRadius:6,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:i===categories.length-1?"rgba(168,196,184,0.3)":"#fff",fontSize:11,cursor:i===categories.length-1?"not-allowed":"pointer",fontFamily:"inherit"}}>▼</button>
              <button onClick={()=>setEditCat({id:c.id,name:c.name,emoji:c.emoji})} style={{padding:"4px 10px",borderRadius:6,background:"rgba(232,200,122,0.12)",border:"1px solid rgba(232,200,122,0.35)",color:"#E8C87A",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[수정]</button>
              <button onClick={()=>deleteCategory(c.id)} style={{padding:"4px 10px",borderRadius:6,background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.35)",color:"#ff6b6b",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[삭제]</button>
            </div>
            );
          })}
        </div>
      }

      {/* 🚫 키워드 필터 */}
      {subTab==="filter"&&
        <div style={{padding:"10px 18px"}}>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:8}}>금칙어가 포함된 글/댓글을 자동으로 표시해줘요</div>
          <div style={{background:"var(--ink3)",borderRadius:12,padding:"10px 12px",marginBottom:12,border:"1px solid rgba(255,107,107,0.2)"}}>
            <div style={{fontSize:11,color:"#ff6b6b",fontWeight:700,marginBottom:6}}>➕ 금칙어 추가</div>
            <div style={{display:"flex",gap:6}}>
              <input type="text" placeholder="차단할 키워드 (예: 광고, 성인)" value={newWord} onChange={e=>setNewWord(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addBlockedWord();}} style={{flex:1,padding:8,background:"var(--ink)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"#fff",fontSize:12,fontFamily:"inherit"}}/>
              <button onClick={addBlockedWord} style={{padding:"8px 14px",background:"#ff6b6b",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>추가</button>
            </div>
          </div>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:6,fontWeight:700}}>현재 금칙어 ({blockedWords.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {blockedWords.map(w=>(
              <span key={w} style={{fontSize:11,background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.3)",color:"#ff6b6b",padding:"4px 10px",borderRadius:12,fontWeight:700,display:"inline-flex",alignItems:"center",gap:5}}>
                {w}
                <button onClick={()=>removeBlockedWord(w)} style={{background:"none",border:"none",color:"#ff6b6b",fontSize:11,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
              </span>
            ))}
          </div>
          {/* 탐지된 글/댓글 */}
          {(flaggedPosts.length+flaggedComments.length)>0&&<>
            <div style={{fontSize:12,color:"#ff6b6b",fontWeight:800,marginBottom:8}}>🚨 탐지된 항목 ({flaggedPosts.length+flaggedComments.length})</div>
            {flaggedPosts.map(p=>(
              <div key={p.id} style={{background:"rgba(255,107,107,0.06)",border:"1px solid rgba(255,107,107,0.25)",borderRadius:10,padding:"10px 12px",marginBottom:6}}>
                <div style={{fontSize:10,color:"#ff6b6b",fontWeight:800,marginBottom:3}}>🚨 글 · {p.cat}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:2}}>{p.title}</div>
                <div style={{fontSize:10,color:"rgba(220,232,226,0.55)",marginBottom:6,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as any,overflow:"hidden"}}>{p.content}</div>
                <button onClick={()=>forceDeletePost(p.id)} style={{padding:"4px 10px",borderRadius:6,background:"rgba(255,107,107,0.18)",border:"1px solid rgba(255,107,107,0.4)",color:"#ff6b6b",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[강제 삭제]</button>
              </div>
            ))}
            {flaggedComments.map(c=>(
              <div key={c.id} style={{background:"rgba(255,107,107,0.06)",border:"1px solid rgba(255,107,107,0.25)",borderRadius:10,padding:"10px 12px",marginBottom:6}}>
                <div style={{fontSize:10,color:"#ff6b6b",fontWeight:800,marginBottom:3}}>🚨 댓글 · 🌿 {c.nick}</div>
                <div style={{fontSize:11,color:"#fff",lineHeight:1.5,marginBottom:6}}>{c.content}</div>
                <button onClick={()=>deleteComment(c.postId,c.id)} style={{padding:"4px 10px",borderRadius:6,background:"rgba(255,107,107,0.18)",border:"1px solid rgba(255,107,107,0.4)",color:"#ff6b6b",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[댓글 삭제]</button>
              </div>
            ))}
          </>}
          {(flaggedPosts.length+flaggedComments.length)===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#5fc49e",fontSize:12,fontWeight:700}}>✨ 탐지된 금칙어 항목 없음 — 깨끗해요!</div>}
        </div>
      }

      {/* 👤 사용자 차단 */}
      {subTab==="users"&&
        <div style={{padding:"10px 18px"}}>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:8}}>차단한 닉네임의 글/댓글은 유저에게 보이지 않아요 (예정 기능)</div>
          <div style={{background:"var(--ink3)",borderRadius:12,padding:"10px 12px",marginBottom:12,border:"1px solid rgba(155,143,212,0.2)"}}>
            <div style={{fontSize:11,color:"#9B8FD4",fontWeight:700,marginBottom:6}}>➕ 사용자 차단</div>
            <div style={{display:"flex",gap:6}}>
              <input type="text" placeholder="차단할 닉네임 정확히 입력" value={newNick} onChange={e=>setNewNick(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addBlockedNick();}} style={{flex:1,padding:8,background:"var(--ink)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"#fff",fontSize:12,fontFamily:"inherit"}}/>
              <button onClick={addBlockedNick} style={{padding:"8px 14px",background:"#9B8FD4",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>차단</button>
            </div>
          </div>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:6,fontWeight:700}}>차단된 사용자 ({blockedNicks.length})</div>
          {blockedNicks.length===0?<div style={{textAlign:"center",padding:"20px 0",color:"var(--mist)",fontSize:11}}>차단된 사용자 없음</div>:
            blockedNicks.map(n=>(
              <div key={n} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(155,143,212,0.06)",border:"1px solid rgba(155,143,212,0.25)",borderRadius:10,padding:"8px 12px",marginBottom:6}}>
                <span style={{fontSize:12,color:"#C4B8ED",fontWeight:700}}>🚫 {n}</span>
                <button onClick={()=>removeBlockedNick(n)} style={{padding:"3px 9px",borderRadius:6,background:"rgba(95,196,158,0.12)",border:"1px solid rgba(95,196,158,0.3)",color:"#5fc49e",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>해제</button>
              </div>
            ))
          }
        </div>
      }

      {/* 📌 공지 고정 */}
      {subTab==="notice"&&
        <div style={{padding:"10px 18px"}}>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:10}}>고정된 글(📌 HOT)은 대나무숲 최상단에 노출돼요</div>
          {posts.filter(p=>p.pinned).length===0?<div style={{textAlign:"center",padding:"30px 0",color:"var(--mist)",fontSize:12}}>고정된 글 없음 — 글 관리 탭에서 📌 고정하세요</div>:
            posts.filter(p=>p.pinned).map(p=>(
              <div key={p.id} style={{background:"rgba(95,196,158,0.06)",border:"1px solid rgba(95,196,158,0.3)",borderRadius:10,padding:"10px 12px",marginBottom:6}}>
                <div style={{fontSize:10,color:"#5fc49e",fontWeight:700,marginBottom:3}}>📌 고정 · {p.cat} · 🌿 {p.nick}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:6}}>{p.title}</div>
                <button onClick={()=>togglePin(p.id)} style={{padding:"3px 9px",borderRadius:6,background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.3)",color:"#ff6b6b",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📌 고정 해제</button>
              </div>
            ))
          }
        </div>
      }

      {/* 📊 통계 */}
      {subTab==="stats"&&
        <div style={{padding:"10px 18px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {ic:"📝",l:"총 게시글",v:posts.length,c:"#5fc49e"},
              {ic:"💬",l:"총 댓글",v:totalComments,c:"#E8C87A"},
              {ic:"👁",l:"총 조회",v:totalViews,c:"#5BB5D6"},
              {ic:"❤",l:"총 좋아요",v:totalLikes,c:"#ff6b6b"},
            ].map(s=>(
              <div key={s.l} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${s.c}33`,borderRadius:10,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{s.ic}</div>
                <div style={{fontSize:10,color:"var(--mist)",fontWeight:700}}>{s.l}</div>
                <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,fontWeight:800,color:"var(--gold)",marginBottom:6}}>🏆 게시글 TOP 5 작성자</div>
          {topAuthorsList.length===0?<div style={{fontSize:11,color:"var(--mist)",padding:"16px 0",textAlign:"center"}}>작성자가 없어요</div>:
            topAuthorsList.map(([nick,cnt],i)=>(
              <div key={nick} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,marginBottom:4,border:"1px solid rgba(255,255,255,0.05)"}}>
                <span style={{fontSize:14,fontWeight:900,color:i===0?"#E8C87A":i===1?"#C0C0C0":i===2?"#CD7F32":"var(--mist)",width:24}}>{i+1}위</span>
                <span style={{flex:1,fontSize:12,fontWeight:700,color:"#fff"}}>🌿 {nick}</span>
                <span style={{fontSize:11,color:"#5fc49e",fontWeight:700}}>{cnt}개</span>
              </div>
            ))
          }
        </div>
      }
    </div>
  );
}

function SeasonTab(){
  const[seasons,setSeasons]=useState<any[]>([]);
  const[allGoods,setAllGoods]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[addModal,setAddModal]=useState(false);
  const[editSeason,setEditSeason]=useState<any>(null);
  const[editId,setEditId]=useState<any>(null);
  const[newSeason,setNewSeason]=useState({name:"",start_date:"",end_date:""});
  const[goodsSearch,setGoodsSearch]=useState("");
  const[goodsCatFilter,setGoodsCatFilter]=useState("전체");

  // Fetch seasons and goods from Supabase on mount
  useEffect(()=>{
    Promise.all([
      fetch("/api/seasons").then(r=>r.json()),
      fetch("/api/goods?admin=true").then(r=>r.json()),
    ]).then(([sData,gData])=>{
      if(sData.seasons) setSeasons(sData.seasons);
      if(gData.goods) setAllGoods(gData.goods.map((g:any)=>({...g, cat: g.category||g.cat||""})));
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  const goodsCategories = ["전체",...Array.from(new Set(allGoods.map(g=>g.cat).filter(Boolean)))];

  async function toggleSeason(id:number){
    const s=seasons.find(x=>x.id===id);
    if(!s) return;
    const newActive=!s.is_active;
    // Optimistic update
    setSeasons(p=>p.map(x=>x.id===id?{...x,is_active:newActive}:x));
    try{
      const res=await fetch("/api/seasons",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,is_active:newActive})});
      const d=await res.json();
      if(d.error){setSeasons(p=>p.map(x=>x.id===id?{...x,is_active:!newActive}:x));}
    }catch{setSeasons(p=>p.map(x=>x.id===id?{...x,is_active:!newActive}:x));}
  }

  async function toggleGoodsInSeason(seasonId:number, goodsId:number){
    const s=seasons.find(x=>x.id===seasonId);
    if(!s) return;
    const currentIds:number[] = s.product_ids||[];
    const newIds = currentIds.includes(goodsId) ? currentIds.filter((g:number)=>g!==goodsId) : [...currentIds, goodsId];
    // Optimistic update
    setSeasons(p=>p.map(x=>x.id===seasonId?{...x,product_ids:newIds}:x));
    try{
      await fetch("/api/seasons",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:seasonId,product_ids:newIds})});
    }catch{setSeasons(p=>p.map(x=>x.id===seasonId?{...x,product_ids:currentIds}:x));}
  }

  async function addSeason(){
    if(!newSeason.name.trim()) return;
    try{
      const res=await fetch("/api/seasons",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:newSeason.name,start_date:newSeason.start_date,end_date:newSeason.end_date,is_active:false,product_ids:[]})});
      const d=await res.json();
      if(d.season) setSeasons(p=>[...p,d.season]);
    }catch{}
    setNewSeason({name:"",start_date:"",end_date:""});
    setAddModal(false);
  }

  async function deleteSeason(id:number){
    setSeasons(p=>p.filter(s=>s.id!==id));
    try{
      await fetch(`/api/seasons?id=${id}`,{method:"DELETE"});
    }catch{}
  }

  async function saveEditSeason(){
    if(!editSeason) return;
    const {id,name,start_date,end_date}=editSeason;
    if(!name.trim()) return;
    // Optimistic update
    setSeasons(p=>p.map(s=>s.id===id?{...s,name,start_date,end_date}:s));
    setEditSeason(null);
    try{
      const res=await fetch("/api/seasons",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,name,start_date,end_date})});
      if(!res.ok){
        console.error("시즌 수정 실패");
      }
    }catch(err){
      console.error("시즌 수정 에러:",err);
    }
  }

  const activeSeason = seasons.find(s=>s.is_active);

  // Filter goods for season product picker
  const filteredGoods = allGoods.filter(g=>{
    const matchSearch = !goodsSearch.trim() || (g.name||"").includes(goodsSearch.trim());
    const matchCat = goodsCatFilter==="전체" || g.cat===goodsCatFilter;
    return matchSearch && matchCat;
  });

  if(loading) return(
    <div className="page">
      <div className="sec"><div className="sec-t">🎋 시즌 관리</div></div>
      <div style={{textAlign:"center",padding:"60px 0",color:"var(--mist)"}}>
        <div style={{fontSize:32,marginBottom:12}}>⏳</div>
        <div style={{fontSize:13}}>시즌 데이터를 불러오는 중...</div>
      </div>
    </div>
  );

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">🎋 시즌 관리</div></div>

      {/* 현재 활성 시즌 */}
      <div style={{padding:"0 18px 14px"}}>
        <div style={{background:"var(--ink2)",borderRadius:14,padding:"14px",border:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:4}}>현재 활성 시즌</div>
          <div style={{fontSize:16,fontWeight:900,color:activeSeason?"var(--gold)":"rgba(168,196,184,0.3)"}}>
            {activeSeason ? `🎋 ${activeSeason.name}` : "없음"}
          </div>
          {activeSeason&&<div style={{fontSize:11,color:"var(--mist)",marginTop:4}}>{activeSeason.start_date} ~ {activeSeason.end_date} · 상품 {(activeSeason.product_ids||[]).length}개</div>}
        </div>
      </div>

      {/* 시즌 추가 버튼 */}
      <div style={{padding:"0 18px 14px"}}>
        <button className="btn btn-p" style={{fontSize:13}} onClick={()=>setAddModal(true)}>+ 시즌 추가</button>
      </div>

      {/* 시즌 목록 */}
      <div style={{padding:"0 18px"}}>
        <div style={{fontSize:12,fontWeight:900,marginBottom:10}}>시즌 목록</div>
        {seasons.map(s=>(
          <div key={s.id} style={{background:"var(--ink2)",borderRadius:14,padding:"14px",border:`1px solid ${s.is_active?"rgba(212,175,55,0.3)":"rgba(255,255,255,0.06)"}`,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{s.name}</div>
                <div style={{fontSize:10,color:"var(--mist)",marginTop:2}}>{s.start_date} ~ {s.end_date}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button style={{width:44,height:24,borderRadius:12,background:s.is_active?"var(--coral)":"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",transition:"background .2s",border:"none",flexShrink:0}} onClick={()=>toggleSeason(s.id)}>
                  <div style={{position:"absolute",width:18,height:18,borderRadius:"50%",background:"#fff",top:3,left:s.is_active?23:3,transition:"left .2s"}}/>
                </button>
                <button onClick={()=>setEditSeason({id:s.id,name:s.name,start_date:s.start_date||"",end_date:s.end_date||""})} style={{padding:"4px 10px",borderRadius:6,background:"rgba(232,200,122,0.12)",border:"1px solid rgba(232,200,122,0.35)",color:"#E8C87A",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[수정]</button>
                <button onClick={()=>deleteSeason(s.id)} style={{padding:"4px 10px",borderRadius:6,background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.35)",color:"#ff6b6b",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>[삭제]</button>
              </div>
            </div>

            {/* 상품 체크박스 - 펼치기 */}
            <button onClick={()=>setEditId(editId===s.id?null:s.id)} style={{fontSize:11,color:"var(--gold)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
              상품 지정 ({(s.product_ids||[]).length}개) {editId===s.id?"▲":"▼"}
            </button>
            {editId===s.id&&(
              <div style={{marginTop:8}}>
                {/* 상품 검색 + 카테고리 필터 */}
                <input placeholder="상품명 검색" value={goodsSearch} onChange={e=>setGoodsSearch(e.target.value)}
                  style={{width:"100%",padding:"7px 10px",background:"var(--ink3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"var(--white)",fontFamily:"inherit",fontSize:11,outline:"none",boxSizing:"border-box",marginBottom:6}}/>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                  {goodsCategories.slice(0,8).map(c=>(
                    <button key={c} onClick={()=>setGoodsCatFilter(c)}
                      style={{padding:"3px 8px",borderRadius:12,fontSize:9,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:goodsCatFilter===c?"rgba(212,175,55,0.2)":"var(--ink3)",color:goodsCatFilter===c?"var(--gold)":"var(--mist)"}}>
                      {c}
                    </button>
                  ))}
                </div>
                <div style={{maxHeight:250,overflowY:"auto"}}>
                  {filteredGoods.map(g=>(
                    <label key={g.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer",fontSize:12}}>
                      <input type="checkbox" checked={(s.product_ids||[]).includes(g.id)} onChange={()=>toggleGoodsInSeason(s.id,g.id)} style={{accentColor:"var(--gold)"}}/>
                      <span style={{flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.icon||"📦"} {g.name}</span>
                      <span style={{fontSize:9,color:"var(--mist)",flexShrink:0}}>{g.cat}</span>
                    </label>
                  ))}
                  {filteredGoods.length===0&&<div style={{textAlign:"center",padding:"16px 0",fontSize:11,color:"var(--mist)"}}>검색 결과 없음</div>}
                </div>
              </div>
            )}
          </div>
        ))}
        {seasons.length===0&&<div style={{textAlign:"center",padding:"32px 0",fontSize:12,color:"var(--mist)"}}>등록된 시즌이 없습니다</div>}
      </div>

      {/* 시즌 추가 모달 */}
      {addModal&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setAddModal(false);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🎋 새 시즌 추가</div>
            <div className="ms">시즌 이름과 기간을 입력하세요</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:4}}>시즌 이름</label>
            <input className="inp" placeholder="예: 발렌타인" value={newSeason.name} onChange={e=>setNewSeason(p=>({...p,name:e.target.value}))}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:4}}>시작일</label>
            <input className="inp" type="date" value={newSeason.start_date} onChange={e=>setNewSeason(p=>({...p,start_date:e.target.value}))}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:4}}>종료일</label>
            <input className="inp" type="date" value={newSeason.end_date} onChange={e=>setNewSeason(p=>({...p,end_date:e.target.value}))}/>
            <button className="btn btn-p" onClick={addSeason}>추가하기</button>
            <button className="btn btn-g" onClick={()=>setAddModal(false)}>취소</button>
          </div>
        </div>
      )}

      {/* 시즌 수정 모달 */}
      {editSeason&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setEditSeason(null);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">✏️ 시즌 수정</div>
            <div className="ms">시즌 이름과 기간을 수정하세요</div>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:4}}>시즌 이름</label>
            <input className="inp" placeholder="예: 발렌타인" value={editSeason.name} onChange={e=>setEditSeason((p:any)=>({...p,name:e.target.value}))}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:4,marginTop:10}}>시작일</label>
            <input className="inp" type="date" value={editSeason.start_date} onChange={e=>setEditSeason((p:any)=>({...p,start_date:e.target.value}))}/>
            <label style={{fontSize:11,color:"var(--mist)",fontWeight:700,display:"block",marginBottom:4,marginTop:10}}>종료일</label>
            <input className="inp" type="date" value={editSeason.end_date} onChange={e=>setEditSeason((p:any)=>({...p,end_date:e.target.value}))}/>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button className="btn btn-p" style={{flex:1}} onClick={saveEditSeason}>저장하기</button>
              <button className="btn btn-g" style={{flex:1}} onClick={()=>setEditSeason(null)}>취소</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SettingsTab({onLogout}){
  const[settings,setSettings]=useState(()=>{
    try{
      const saved=localStorage.getItem('chungi_content_settings');
      if(saved){
        const parsed=JSON.parse(saved);
        // 저장된 설정을 기반으로, 새 콘텐츠는 추가하고 삭제된 건 제거
        const savedMap=new Map(parsed.map((s:any)=>[s.content_id||s.id,s]));
        return ALL_CONTENTS.map((c,i)=>{
          const existing:any=savedMap.get((c as any).content_id||c.id);
          if(existing) return {...existing,num:i+1,name:c.name,icon:(c as any).icon}; // 기존 설정 유지, 순번만 갱신
          return {...c,num:i+1,isPublic:true,isPreparing:false,badgeType:c.price===0?"무료":"유료",originalPrice:0}; // 새 콘텐츠 기본값
        });
      }
    }catch{}
    return ALL_CONTENTS.map((c,i)=>({...c,num:i+1,isPublic:true,isPreparing:false,badgeType:c.price===0?"무료":"유료",originalPrice:0}));
  });
  // 🔐 마운트 시 Supabase에서 서버 저장값 hydrate — localStorage 비어도 리셋 안 됨
  // (저장은 양쪽에 가지만 로드는 localStorage만 보던 버그 fix. 다른 브라우저·기기·캐시 클리어 후에도 살아남음)
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const res=await fetch("/api/content-settings");
        if(!res.ok)return;
        const json=await res.json();
        const rows=json?.settings;
        if(!Array.isArray(rows)||rows.length===0||cancelled)return;
        const serverMap=new Map(rows.map((r:any)=>[r.content_id,r]));
        const merged=ALL_CONTENTS.map((c,i)=>{
          const r:any=serverMap.get(c.id);
          if(r) return {
            ...c,num:i+1,name:c.name,icon:(c as any).icon,
            price:typeof r.price==="number"?r.price:c.price,
            isPublic:r.is_public!==false,
            isPreparing:!!r.is_preparing,
            badgeType:r.badge_type||(c.price===0?"무료":"유료"),
            originalPrice:r.original_price||0,
          };
          return {...c,num:i+1,isPublic:true,isPreparing:false,badgeType:c.price===0?"무료":"유료",originalPrice:0};
        });
        setSettings(merged);
        try{localStorage.setItem('chungi_content_settings',JSON.stringify(merged));}catch{}
      }catch{}
    })();
    return()=>{cancelled=true;};
  },[]);
  const[savedId,setSavedId]=useState(null);
  const BADGE_OPTIONS=[
    {label:"없음",color:"transparent",bg:"transparent",border:"transparent"},
    {label:"무료",color:"#5FC49E",bg:"rgba(95,196,158,0.15)",border:"rgba(95,196,158,0.25)"},         // 초록
    {label:"유료",color:"#888",bg:"rgba(150,150,150,0.15)",border:"rgba(150,150,150,0.25)"},           // 회색
    {label:"프리미엄",color:"#4A90D9",bg:"rgba(74,144,217,0.15)",border:"rgba(74,144,217,0.25)"},      // 파랑
    {label:"인기",color:"#DC3545",bg:"rgba(220,53,69,0.15)",border:"rgba(220,53,69,0.25)"},            // 빨강
    {label:"신규",color:"#FF8C00",bg:"rgba(255,140,0,0.15)",border:"rgba(255,140,0,0.25)"},            // 주황
    {label:"베스트",color:"#E6A817",bg:"rgba(230,168,23,0.15)",border:"rgba(230,168,23,0.25)"},        // 골드
    {label:"이벤트",color:"#C71585",bg:"rgba(199,21,133,0.15)",border:"rgba(199,21,133,0.25)"},        // 핑크
    {label:"강추",color:"#00B4D8",bg:"rgba(0,180,216,0.15)",border:"rgba(0,180,216,0.25)"},            // 하늘
    {label:"천기픽",color:"#8B5CF6",bg:"rgba(139,92,246,0.15)",border:"rgba(139,92,246,0.25)"},        // 보라
    {label:"엄선",color:"#10B981",bg:"rgba(16,185,129,0.15)",border:"rgba(16,185,129,0.25)"},          // 에메랄드
    {label:"팩폭",color:"#F4F1E1",bg:"rgba(0,0,0,0.8)",border:"rgba(255,255,255,0.2)"},               // 블랙
    {label:"풀코스",color:"#F59E0B",bg:"rgba(245,158,11,0.15)",border:"rgba(245,158,11,0.25)"},        // 앰버
    {label:"첫회무료",color:"#06B6D4",bg:"rgba(6,182,212,0.15)",border:"rgba(6,182,212,0.25)"},        // 시안
    {label:"할인중",color:"#EF4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.22)"},          // 레드
    {label:"한정판",color:"#A855F7",bg:"rgba(168,85,247,0.15)",border:"rgba(168,85,247,0.25)"},        // 퍼플
  ];
  const[notice,setNotice]=useState(()=>{try{const s=localStorage.getItem('chungi_notice');return s||"🎋 2026 병오년 신년 특가 이벤트 진행 중!";}catch{return "🎋 2026 병오년 신년 특가 이벤트 진행 중!";}});
  const[noticeOn,setNoticeOn]=useState(()=>{try{const s=localStorage.getItem('chungi_noticeOn');return s?JSON.parse(s):true;}catch{return true;}});
  const[editNotice,setEditNotice]=useState(false);
  const[noticeTemp,setNoticeTemp]=useState("");
  const [specialItems, setSpecialItems] = useState(() => {
    try { const s = localStorage.getItem('chungi_special_items_v4'); if (s){const p=JSON.parse(s);if(p.length>=15)return p;} } catch {}
    return [
      {id:"face10",icon:"📸",title:"관상짤 10장 패키지",sub:"1장 300원꼴! 친구랑 돌려보기",price:"3,000원",originalPrice:"3,800원",discount:"20%",badge:"베스트",contents:["gwansang_zal x10"]},
      {id:"face5",icon:"📸",title:"관상짤 5장 패키지",sub:"1장 320원꼴! 소개팅 전 필수!",price:"1,600원",originalPrice:"1,900원",discount:"16%",badge:"인기",contents:["gwansang_zal x5"]},
      {id:"gift3000",icon:"🎁",title:"선물권 3,000원",sub:"친구 소개팅 전에 선물하세요!\n+10% 페이백 쿠폰 증정",price:"3,000원",originalPrice:"",discount:"",badge:"선물",contents:[]},
      {id:"gift5000",icon:"🎁",title:"선물권 5,000원",sub:"둘이 같이 써요! 커플·친구 선물\n+10% 페이백 쿠폰 증정",price:"5,000원",originalPrice:"",discount:"",badge:"선물",contents:[]},
      {id:"gift10000",icon:"🎁",title:"선물권 10,000원",sub:"부모님께 드리세요! 사주+운세 다 봐요\n+10% 페이백 쿠폰 증정",price:"10,000원",originalPrice:"",discount:"",badge:"인기",contents:[]},
      {id:"gift30000",icon:"🎁",title:"선물권 30,000원",sub:"천기 풀코스! 모든 콘텐츠 마음껏\n+10% 페이백 쿠폰 증정",price:"30,000원",originalPrice:"",discount:"",badge:"🔥",contents:[]},
      {id:"mirror_pkg",icon:"🪞",title:"나의 거울 패키지",sub:"나에 대한 18가지 도감 풀세트\n관상+기질+사주+조선+타로+손금+전생+뇌과학+파동 外",price:"18,400원",originalPrice:"26,360원",discount:"30%",badge:"신규",contents:["gwansang_full","gijildo","blood","saju","ddi","namereading","zodiac","tarot_life","numerology","palmistry","joseon_portrait","past_life","footreading","mole","eye_mole","psych","pawdong","synthesis"]},
      {id:"know_me",icon:"📖",title:"나를 알다 패키지",sub:"내 관상보기+기질도+사주 풀이",price:"2,300원",originalPrice:"2,940원",discount:"20%",badge:"신규",contents:["gwansang_full","gijildo","saju"]},
      {id:"couple_pkg",icon:"💘",title:"커플 패키지",sub:"관상 궁합+연애운·궁합+연애 타로",price:"3,900원",originalPrice:"4,940원",discount:"20%",badge:"인기",contents:["gwansang_compat","love","tarot_love"]},
      {id:"love_pkg",icon:"💘",title:"관상 연애 패키지",sub:"관상짤+내 관상보기+관상 궁합",price:"2,700원",originalPrice:"3,340원",discount:"20%",badge:"인기",contents:["gwansang_zal","gwansang_full","gwansang_compat"]},
      {id:"saju_pkg",icon:"☯️",title:"사주 완전정복 패키지",sub:"사주 풀이+월별 운세+신년 운세",price:"3,100원",originalPrice:"3,940원",discount:"20%",badge:"강추",contents:["saju","saju_monthly","newyear"]},
      {id:"tarot_full",icon:"🃏",title:"타로 풀코스 패키지",sub:"연애+건강+재물+진로+인생",price:"3,900원",originalPrice:"4,900원",discount:"20%",badge:"베스트",contents:["tarot_love","tarot_health","tarot_money","tarot_career","tarot_life"]},
      {id:"baby_album_pkg",icon:"👶",title:"우리 아이 성장 앨범 패키지",sub:"부모 입덕 풀세트! 6종\n2세얼굴+아기관상+돌잡이+부모궁합+태몽+이름짓기",price:"8,400원",originalPrice:"12,100원",discount:"30%",badge:"베스트",contents:["baby_face","baby_gwansang","doljabi_sim","parent_child_compat","taemong","baby_naming"]},
      {id:"premium_pkg",icon:"✨",title:"프리미엄 패키지",sub:"파동 성명학+뇌과학",price:"7,600원",originalPrice:"9,600원",discount:"20%",badge:"프리미엄",contents:["pawdong","psych"]},
      {id:"report_full",icon:"🔍",title:"천기 리포트 풀 패키지",sub:"사주 풀이+내 관상보기+연애운·궁합\n+기질도+손금+이름 풀이",price:"6,300원",originalPrice:"7,880원",discount:"20%",badge:"베스트",contents:["saju","gwansang_full","love","gijildo","palmistry","namereading"]},
    ];
  });
  useEffect(()=>{try{localStorage.setItem('chungi_special_items_v4',JSON.stringify(specialItems));}catch{}},[specialItems]);

  // 🔐 마운트 시 Supabase에서 hydrate — localStorage 비어도 다른 브라우저·기기·캐시 클리어 후 살아남
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const res=await fetch("/api/special-items");
        if(!res.ok)return;
        const json=await res.json();
        const rows=json?.items;
        if(!Array.isArray(rows)||rows.length===0||cancelled)return;
        const mapped=rows.map((r:any)=>({
          id:r.id,icon:r.icon||"",title:r.title||"",sub:r.sub||"",
          price:r.price||"",originalPrice:r.original_price||"",discount:r.discount||"",
          badge:r.badge||"",imageUrl:r.image_url||"",contents:r.contents||[],
        }));
        setSpecialItems(mapped);
        try{localStorage.setItem('chungi_special_items_v4',JSON.stringify(mapped));}catch{}
      }catch{}
    })();
    return()=>{cancelled=true;};
  },[]);

  const [specialSaved, setSpecialSaved] = useState(false);
  async function saveSpecialItems() {
    try { localStorage.setItem('chungi_special_items_v4', JSON.stringify(specialItems)); } catch {}
    // Supabase에도 저장 (어디서 열어도 일관)
    try {
      await fetch("/api/special-items",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({items:specialItems}),
      });
    } catch {}
    setSpecialSaved(true);
    setTimeout(() => setSpecialSaved(false), 2000);
  }

  function updateSpecial(id, field, value) {
    setSpecialItems(prev => prev.map(s => s.id === id ? {...s, [field]: value} : s));
  }
  // 터치 드래그 순서 변경
  const [dragIdx, setDragIdx] = useState<number|null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number|null>(null);
  const touchStartY = useRef(0);
  const dragItemRef = useRef<number|null>(null);
  function handleDragStart(i:number){ setDragIdx(i); }
  function handleDragOver(e, i:number){ e.preventDefault(); setDragOverIdx(i); }
  function handleDrop(i:number){
    if(dragIdx!==null && dragIdx!==i){
      const arr=[...specialItems]; const [moved]=arr.splice(dragIdx,1); arr.splice(i,0,moved); setSpecialItems(arr);
    }
    setDragIdx(null); setDragOverIdx(null);
  }
  function handleTouchStart(e, i:number){ touchStartY.current=e.touches[0].clientY; dragItemRef.current=i; setDragIdx(i); }
  function handleTouchMove(e){
    if(dragItemRef.current===null)return;
    const touch=e.touches[0];
    const els=document.querySelectorAll('[data-sp-item]');
    els.forEach((el,idx)=>{
      const rect=el.getBoundingClientRect();
      if(touch.clientY>=rect.top&&touch.clientY<=rect.bottom){ setDragOverIdx(idx); }
    });
  }
  function handleTouchEnd(){
    if(dragItemRef.current!==null&&dragOverIdx!==null&&dragItemRef.current!==dragOverIdx){
      const arr=[...specialItems]; const [moved]=arr.splice(dragItemRef.current,1); arr.splice(dragOverIdx,0,moved); setSpecialItems(arr);
    }
    dragItemRef.current=null; setDragIdx(null); setDragOverIdx(null);
  }

  useEffect(()=>{try{localStorage.setItem('chungi_noticeOn',JSON.stringify(noticeOn));}catch{}},[noticeOn]);
  useEffect(()=>{try{localStorage.setItem('chungi_notice',notice);}catch{}},[notice]);
  // 🔐 settings 어떤 변경이든 즉시 localStorage에 반영 (페이지 이동/새로고침시 리셋 방지)
  useEffect(()=>{try{localStorage.setItem('chungi_content_settings',JSON.stringify(settings));}catch{}},[settings]);

  // 🔐 어떤 변경이든 즉시 localStorage에 저장 (페이지 이동·새로고침해도 유지)
  function persistSettings(next){
    try{localStorage.setItem('chungi_content_settings',JSON.stringify(next));}catch{}
    return next;
  }
  function updateSetting(id,field,value){
    setSettings(prev=>persistSettings(prev.map(s=>s.id===id?{...s,[field]:value}:s)));
  }
  function adjustPrice(id,delta){
    setSettings(prev=>persistSettings(prev.map(s=>s.id===id?{...s,price:Math.max(0,s.price+delta)}:s)));
  }
  const[saveAllLoading,setSaveAllLoading]=useState(false);
  const[saveAllDone,setSaveAllDone]=useState(false);
  async function saveSetting(id){
    try{localStorage.setItem('chungi_content_settings',JSON.stringify(settings));}catch{}
    const s=settings.find(x=>x.id===id);
    if(s){
      try{
        await fetch("/api/content-settings",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({id:s.id,price:s.price,isPublic:s.isPublic,isPreparing:s.isPreparing,name:s.name,badgeType:s.badgeType,originalPrice:s.originalPrice||0})
        });
      }catch{}
    }
    setSavedId(id);
    setTimeout(()=>setSavedId(null),1500);
  }
  async function saveAll(){
    setSaveAllLoading(true);
    try{localStorage.setItem('chungi_content_settings',JSON.stringify(settings));}catch{}
    try{localStorage.setItem('chungi_special_items_v4',JSON.stringify(specialItems));}catch{}
    for(const s of settings){
      try{
        await fetch("/api/content-settings",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({id:s.id,price:s.price,isPublic:s.isPublic,isPreparing:s.isPreparing,name:s.name,badgeType:s.badgeType||"무료",originalPrice:s.originalPrice||0})
        });
      }catch{}
    }
    // 패키지·선물권도 일괄 저장 (Supabase)
    try{
      await fetch("/api/special-items",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({items:specialItems}),
      });
    }catch{}
    setSaveAllLoading(false);
    setSaveAllDone(true);
    setTimeout(()=>setSaveAllDone(false),2000);
  }

  return(
    <div className="page">
      <div className="sec"><div className="sec-t">⚙️ 서비스 설정</div></div>

      <div className="divider"/>

      {/* 콘텐츠 관리 */}
      <div className="sec">
        <div className="sec-t" style={{marginBottom:0}}>⚙️ 콘텐츠 관리 (가격·공개·준비중)</div>
      </div>
      <div style={{padding:"0 18px 10px"}}>
        <button onClick={saveAll} disabled={saveAllLoading} style={{width:"100%",padding:"10px",borderRadius:12,border:"none",cursor:saveAllLoading?"not-allowed":"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,background:saveAllDone?"rgba(95,196,158,0.3)":saveAllLoading?"var(--c3)":"linear-gradient(135deg,var(--ca),var(--gold))",color:saveAllDone?"var(--cj)":saveAllLoading?"var(--cm)":"var(--c1)"}}>
          {saveAllDone?"✅ 전체 저장 완료!":saveAllLoading?"저장 중...":"💾 전체 저장 ("+settings.length+"개 한번에)"}
        </button>
      </div>
      <div style={{padding:"0 18px 4px"}}>
        {settings.map(s=>(
          <div key={s.id} style={{background:"var(--c2)",borderRadius:14,padding:"12px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,0.06)"}}>
            {/* Row 1: Number + Name + Badge */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{fontSize:13,fontWeight:700}}>{s.num}) {s.name}</div>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,
                background:s.price===0?"rgba(95,196,158,0.15)":"rgba(212,175,55,0.15)",
                color:s.price===0?"var(--cj)":"var(--ca)",
                border:s.price===0?"1px solid rgba(95,196,158,0.25)":"1px solid rgba(212,175,55,0.25)",
              }}>{s.price===0?"무료":"유료"}</span>
            </div>
            {/* Row 2: Price control + toggles + save */}
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              {/* Price */}
              <div style={{display:"flex",alignItems:"center",gap:4,background:"var(--c3)",borderRadius:8,padding:"4px 8px"}}>
                <button onClick={()=>adjustPrice(s.id,-10)} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:14,fontWeight:700,padding:"0 4px"}}>−</button>
                <input type="number" value={s.price} onChange={e=>updateSetting(s.id,'price',Math.max(0,parseInt(e.target.value)||0))} style={{width:50,fontSize:12,fontWeight:700,color:"var(--ct)",background:"transparent",border:"none",textAlign:"center",outline:"none",fontFamily:"inherit"}}/>
                <button onClick={()=>adjustPrice(s.id,10)} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:14,fontWeight:700,padding:"0 4px"}}>+</button>
                <span style={{fontSize:10,color:"var(--cm)"}}>원</span>
              </div>
              {/* 정가 (취소선) */}
              <div style={{display:"flex",alignItems:"center",gap:3,background:"var(--c3)",borderRadius:8,padding:"4px 6px"}}>
                <span style={{fontSize:9,color:"var(--cm)"}}>정가</span>
                <button onClick={()=>updateSetting(s.id,'originalPrice',Math.max(0,(s.originalPrice||0)-10))} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:12,fontWeight:700,padding:"0 2px"}}>−</button>
                <input type="number" value={s.originalPrice||0} onChange={e=>updateSetting(s.id,'originalPrice',Math.max(0,parseInt(e.target.value)||0))} style={{width:40,fontSize:10,fontWeight:700,color:s.originalPrice>0?"var(--co)":"var(--cm)",background:"transparent",border:"none",textAlign:"center",outline:"none",fontFamily:"inherit",textDecoration:s.originalPrice>0?"line-through":"none"}}/>
                <button onClick={()=>updateSetting(s.id,'originalPrice',(s.originalPrice||0)+10)} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:12,fontWeight:700,padding:"0 2px"}}>+</button>
              </div>
              {/* 공개 toggle — 클릭 시 즉시 Supabase 저장 */}
              <button onClick={async()=>{const next=!s.isPublic;updateSetting(s.id,'isPublic',next);try{await fetch("/api/content-settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:s.id,isPublic:next})});}catch{}}}
                style={{padding:"5px 12px",borderRadius:8,fontSize:10,fontWeight:800,border:s.isPublic?"1.5px solid #5FC49E":"1.5px solid #8B2929",cursor:"pointer",fontFamily:"inherit",
                background:s.isPublic?"#5FC49E":"#8B2929",
                color:"#fff"}}>
                {s.isPublic?"✓ 공개":"✕ 비공개"}
              </button>
              {/* 준비중 toggle — 클릭 시 즉시 Supabase 저장 */}
              <button onClick={async()=>{const next=!s.isPreparing;updateSetting(s.id,'isPreparing',next);try{await fetch("/api/content-settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:s.id,isPreparing:next})});}catch{}}}
                style={{padding:"5px 12px",borderRadius:8,fontSize:10,fontWeight:800,border:s.isPreparing?"1.5px solid #9B8FD4":"1.5px solid rgba(168,196,184,0.25)",cursor:"pointer",fontFamily:"inherit",
                background:s.isPreparing?"#9B8FD4":"transparent",
                color:s.isPreparing?"#fff":"var(--cm)"}}>
                {s.isPreparing?"⏳ 준비중":"운영중"}
              </button>
              {/* 배지 선택 */}
              <div style={{display:"flex",alignItems:"center",gap:2}}>
                <button onClick={()=>{const idx=BADGE_OPTIONS.findIndex(b=>b.label===s.badgeType);const prev=idx<=0?BADGE_OPTIONS.length-1:idx-1;updateSetting(s.id,'badgeType',BADGE_OPTIONS[prev].label);}} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:12,padding:"0 2px"}}>◀</button>
                <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:BADGE_OPTIONS.find(b=>b.label===s.badgeType)?.bg||"var(--c3)",color:BADGE_OPTIONS.find(b=>b.label===s.badgeType)?.color||"var(--cm)",border:`1px solid ${BADGE_OPTIONS.find(b=>b.label===s.badgeType)?.border||"transparent"}`,minWidth:40,textAlign:"center",display:"inline-block"}}>{s.badgeType||"무료"}</span>
                <button onClick={()=>{const idx=BADGE_OPTIONS.findIndex(b=>b.label===s.badgeType);const next=idx>=BADGE_OPTIONS.length-1?0:idx+1;updateSetting(s.id,'badgeType',BADGE_OPTIONS[next].label);}} style={{background:"none",border:"none",color:"var(--cm)",cursor:"pointer",fontSize:12,padding:"0 2px"}}>▶</button>
              </div>
              {/* 개별 저장 버튼 (가격·정가·배지 변경 후 클릭해서 Supabase에 즉시 반영) */}
              <button onClick={()=>saveSetting(s.id)}
                style={{marginLeft:"auto",padding:"5px 12px",borderRadius:8,fontSize:10,fontWeight:800,border:"none",cursor:"pointer",fontFamily:"inherit",
                background:savedId===s.id?"rgba(95,196,158,0.3)":"linear-gradient(135deg,var(--ca),var(--gold))",
                color:savedId===s.id?"var(--cj)":"var(--c1)"}}>
                {savedId===s.id?"✅ 저장됨":"💾 저장"}
              </button>
            </div>
          </div>
        ))}
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
        <button className="btn btn-g" style={{width:"100%",justifyContent:"center",color:"var(--coral)",borderColor:"rgba(139,41,41,0.2)"}} onClick={onLogout}>로그아웃</button>
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
export default function Page(){
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
    {id:"community", ic:"🎋", lb:"대나무숲"},
    {id:"settings",  ic:"⚙️", lb:"설정"},
  ];

  return(
    <><style dangerouslySetInnerHTML={{__html:css}}/>
    <div className="app">
      <nav className="anav">
        <div className="anav-logo" style={{display:"flex",alignItems:"center",gap:8}}><img src="/logo8.png" alt="천기" style={{height:40}}/><span className="anav-badge">관리자</span></div>
        <div className="anav-user">👤 윤규미 · {new Date().toLocaleDateString("ko-KR")}</div>
      </nav>

      {tab==="dashboard"&&<DashboardTab/>}
      {tab==="members"  &&<MembersTab/>}
      {tab==="revenue"  &&<RevenueTab/>}
      {tab==="inflow"   &&<InflowTab/>}
      {tab==="goods_mgr"&&<GoodsMgrTab/>}
      {tab==="export"   &&<ExportTab/>}
      {tab==="marketing"&&<MarketingTab/>}
      {tab==="community"&&<CommunityTab/>}
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
