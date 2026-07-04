import { useState, useRef, useCallback } from "react";

const css =
`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}:root{--ink:#0D0D14;--ink2:#1A1A28;--ink3:#252535;--ink4:#2F2F42;--gold:#E8C87A;--gold2:#F5DFA0;--gold3:#D4A843;--blush:#F5B8C4;--jade:#5FC49E;--violet:#9B8FD4;--coral:#F47C5A;--mist:#C8C4D8;--white:#FAF9F6;--r:18px;}html,body{background:var(--ink);color:var(--white);font-family:'Noto Serif KR','Apple SD Gothic Neo',serif;-webkit-tap-highlight-color:transparent;overflow-x:hidden;}.app{max-width:430px;margin:0 auto;min-height:100dvh;background:var(--ink);}.topnav{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:13px 18px;background:rgba(13,13,20,0.93);backdrop-filter:blur(16px);border-bottom:1px solid rgba(232,200,122,0.1);}.logo-wrap{display:flex;flex-direction:column;}.logo-main{font-size:20px;font-weight:900;color:var(--gold);letter-spacing:2px;}.logo-sub{font-size:9px;color:var(--mist);letter-spacing:1px;margin-top:1px;}.nav-r{display:flex;gap:8px;align-items:center;}.nbtn{font-size:11px;padding:6px 13px;border-radius:20px;border:none;cursor:pointer;font-family:inherit;font-weight:700;transition:all .18s;}.nb-o{background:transparent;border:1px solid rgba(232,200,122,0.3);color:var(--gold);}.nb-f{background:var(--gold);color:var(--ink);}.btab{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:100;display:flex;background:rgba(13,13,20,0.97);backdrop-filter:blur(16px);border-top:1px solid rgba(232,200,122,0.07);padding-bottom:env(safe-area-inset-bottom,0);}.ti{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0 8px;cursor:pointer;color:rgba(200,196,216,0.38);border:none;background:none;font-family:inherit;transition:color .18s;}.ti.on{color:var(--gold);}.ti-ic{font-size:19px;}.ti-lb{font-size:9px;font-weight:700;}.page{padding:64px 0 82px;min-height:100dvh;}.btn{display:block;width:100%;padding:14px;border-radius:var(--r);border:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;transition:all .2s;}.btn-p{background:linear-gradient(135deg,var(--gold),var(--gold3));color:var(--ink);box-shadow:0 4px 16px rgba(232,200,122,0.25);}.btn-p:active{transform:scale(0.98);}.btn-g{background:transparent;border:1px solid rgba(232,200,122,0.25);color:var(--gold);margin-top:9px;}.btn-sm{padding:10px;font-size:13px;border-radius:12px;}.btn-coral{background:linear-gradient(135deg,var(--coral),#e05c38);color:#fff;}.btn-violet{background:linear-gradient(135deg,var(--violet),#7a6db8);color:#fff;}.ov{position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:200;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(6px);animation:fi .18s;}@keyframes fi{from{opacity:0}to{opacity:1}}.md{background:var(--ink2);border-radius:24px 24px 0 0;padding:22px 20px 40px;width:100%;max-width:430px;border-top:1px solid rgba(232,200,122,0.12);animation:su .22s ease-out;max-height:92dvh;overflow-y:auto;}@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}.hd{width:36px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 auto 20px;}.mt{font-size:19px;font-weight:900;margin-bottom:5px;}.ms{font-size:12px;color:var(--mist);margin-bottom:18px;line-height:1.6;}.lbl{font-size:11px;color:var(--mist);margin-bottom:5px;display:block;font-weight:700;}.inp{width:100%;padding:12px 14px;background:var(--ink3);border:1px solid rgba(255,255,255,0.07);border-radius:12px;color:var(--white);font-family:inherit;font-size:14px;outline:none;transition:border-color .18s;margin-bottom:12px;}.inp:focus{border-color:rgba(232,200,122,0.38);}.inp::placeholder{color:rgba(200,196,216,0.28);}.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}.tag{display:inline-flex;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;}.tg{background:rgba(232,200,122,0.12);color:var(--gold);border:1px solid rgba(232,200,122,0.2);}.tb{background:rgba(245,184,196,0.12);color:var(--blush);border:1px solid rgba(245,184,196,0.2);}.tj{background:rgba(95,196,158,0.12);color:var(--jade);border:1px solid rgba(95,196,158,0.2);}.tv{background:rgba(155,143,212,0.12);color:var(--violet);border:1px solid rgba(155,143,212,0.2);}.tc{background:rgba(244,124,90,0.12);color:var(--coral);border:1px solid rgba(244,124,90,0.2);}.tag-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;}.upzone{border:2px dashed rgba(232,200,122,0.22);border-radius:16px;padding:26px 16px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:14px;}.upzone:hover{border-color:rgba(232,200,122,0.5);}.prev-img{width:100%;height:180px;object-fit:cover;border-radius:14px;margin-bottom:14px;}.pay-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}.pay-opt{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;background:var(--ink3);border:1px solid rgba(255,255,255,0.06);border-radius:12px;cursor:pointer;transition:all .18s;}.pay-opt.on{border-color:rgba(232,200,122,0.45);background:rgba(232,200,122,0.06);}.pay-l{display:flex;align-items:center;gap:10px;}.pay-name{font-size:13px;font-weight:700;}.pay-desc{font-size:11px;color:var(--mist);}.radio{width:17px;height:17px;border-radius:50%;border:2px solid rgba(200,196,216,0.2);flex-shrink:0;}.radio.on{background:var(--gold);border-color:var(--gold);}.price-box{background:var(--ink3);border-radius:14px;padding:14px 15px;margin-bottom:14px;}.pr{display:flex;justify-content:space-between;font-size:13px;color:var(--mist);margin-bottom:5px;}.pr.tot{font-size:15px;font-weight:900;color:var(--white);border-top:1px solid rgba(255,255,255,0.06);padding-top:10px;margin:6px 0 0;}.pr.tot span:last-child{color:var(--gold);}.res-card{background:var(--ink3);border-radius:16px;padding:16px;margin-bottom:10px;border:1px solid rgba(232,200,122,0.08);}.res-lbl{font-size:10px;color:var(--gold);margin-bottom:6px;font-weight:700;letter-spacing:0.6px;}.res-val{font-size:13px;line-height:1.75;color:var(--mist);}.score-bar{height:7px;background:rgba(255,255,255,0.06);border-radius:4px;margin-top:7px;overflow:hidden;}.score-fill{height:100%;border-radius:4px;background:linear-gradient(to right,var(--gold3),var(--gold2));}.succ{text-align:center;padding:22px 16px 12px;}.succ-icon{font-size:52px;animation:pop .35s ease-out;margin-bottom:10px;}@keyframes pop{from{transform:scale(0.4);opacity:0}to{transform:scale(1);opacity:1}}.succ-title{font-size:20px;font-weight:900;margin-bottom:4px;}.succ-sub{font-size:12px;color:var(--mist);line-height:1.7;margin-bottom:14px;}.share-row{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:12px 0;}.sh-btn{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 6px;border-radius:13px;background:var(--ink3);border:1px solid rgba(255,255,255,0.06);cursor:pointer;}.sh-btn:active{transform:scale(0.95);}.sh-ic{font-size:20px;}.sh-lb{font-size:10px;color:var(--mist);font-weight:600;}.dots{display:flex;gap:5px;justify-content:center;padding:16px;}.dot{width:7px;height:7px;border-radius:50%;background:var(--gold);animation:b 1.1s ease-in-out infinite;}.dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}@keyframes b{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}.goods-rec{background:linear-gradient(135deg,rgba(232,200,122,0.08),rgba(155,143,212,0.05));border:1px solid rgba(232,200,122,0.15);border-radius:18px;padding:16px;margin-bottom:14px;animation:slideUp .3s ease-out;}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}.goods-rec-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}.goods-rec-title{font-size:13px;font-weight:900;color:var(--gold2);}.goods-rec-see-all{font-size:11px;color:var(--gold);cursor:pointer;}.goods-rec-sub{font-size:11px;color:var(--mist);margin-bottom:12px;line-height:1.5;}.goods-rec-scroll{display:flex;gap:9px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}.goods-rec-scroll::-webkit-scrollbar{display:none;}.goods-mini-card{flex-shrink:0;width:92px;background:var(--ink2);border-radius:13px;overflow:hidden;border:1px solid rgba(232,200,122,0.1);cursor:pointer;transition:all .2s;}.goods-mini-card:active{transform:scale(0.96);}.goods-mini-img{height:68px;display:flex;align-items:center;justify-content:center;font-size:28px;}.goods-mini-info{padding:7px 8px;}.goods-mini-name{font-size:9px;font-weight:700;margin-bottom:2px;line-height:1.3;color:var(--white);}.goods-mini-price{font-size:11px;font-weight:900;color:var(--gold);}.goods-mini-add{width:100%;padding:5px;border:none;background:rgba(232,200,122,0.15);color:var(--gold);font-family:inherit;font-size:10px;font-weight:700;cursor:pointer;border-top:1px solid rgba(232,200,122,0.1);}.goods-mini-add:hover{background:rgba(232,200,122,0.25);}.pay-done-ov{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:300;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(8px);animation:fi .2s;}.pay-done-md{background:var(--ink2);border-radius:24px 24px 0 0;padding:24px 20px 44px;width:100%;max-width:430px;border-top:2px solid rgba(232,200,122,0.2);animation:su .25s ease-out;max-height:88dvh;overflow-y:auto;}.pdc-icon{font-size:52px;text-align:center;margin-bottom:12px;animation:pop .35s ease-out;}.pdc-title{font-size:20px;font-weight:900;text-align:center;margin-bottom:4px;}.pdc-sub{font-size:12px;color:var(--mist);text-align:center;margin-bottom:20px;line-height:1.6;}.pdc-section-title{font-size:12px;font-weight:900;color:var(--gold);margin-bottom:10px;display:flex;align-items:center;gap:6px;}.pdc-section-title::after{content:'';flex:1;height:1px;background:rgba(232,200,122,0.15);}.pdc-goods-row{display:flex;gap:9px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}.pdc-goods-row::-webkit-scrollbar{display:none;}.pdc-goods-item{flex-shrink:0;width:110px;background:var(--ink3);border-radius:14px;overflow:hidden;border:1px solid rgba(232,200,122,0.12);cursor:pointer;transition:all .2s;}.pdc-goods-item:active{transform:scale(0.96);}.pdc-goods-img{height:80px;display:flex;align-items:center;justify-content:center;font-size:32px;}.pdc-goods-info{padding:8px 9px;}.pdc-goods-name{font-size:10px;font-weight:700;margin-bottom:3px;line-height:1.35;}.pdc-goods-price{font-size:12px;font-weight:900;color:var(--gold);}.pdc-reason{background:rgba(232,200,122,0.06);border:1px solid rgba(232,200,122,0.12);border-radius:12px;padding:11px 13px;margin:12px 0;font-size:11px;color:var(--mist);line-height:1.6;}.pdc-reason strong{color:var(--gold2);}.custom-banner{margin:0 18px 12px;background:linear-gradient(135deg,rgba(232,200,122,0.1),rgba(155,143,212,0.07));border:1px solid rgba(232,200,122,0.18);border-radius:16px;padding:14px 16px;cursor:pointer;transition:all .2s;}.custom-banner:active{transform:scale(0.98);}.cb-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}.cb-title{font-size:12px;font-weight:900;color:var(--gold);}.cb-badge{font-size:9px;font-weight:700;background:rgba(232,200,122,0.15);color:var(--gold2);padding:2px 8px;border-radius:10px;border:1px solid rgba(232,200,122,0.25);}.cb-tags{display:flex;gap:6px;flex-wrap:wrap;}.hero{padding:22px 18px 18px;position:relative;overflow:hidden;}.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% -10%,rgba(232,200,122,0.13) 0%,transparent 65%);pointer-events:none;}.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;background:rgba(232,200,122,0.1);border:1px solid rgba(232,200,122,0.22);font-size:11px;color:var(--gold);margin-bottom:12px;}.hero-title{font-size:24px;font-weight:900;line-height:1.3;margin-bottom:8px;letter-spacing:-0.5px;}.hero-title em{font-style:normal;color:var(--gold);}.hero-sub{font-size:12px;color:var(--mist);line-height:1.7;margin-bottom:16px;font-weight:300;}.stats-row{display:flex;background:var(--ink2);border-radius:14px;border:1px solid rgba(255,255,255,0.05);overflow:hidden;margin-bottom:16px;}.stat{flex:1;text-align:center;padding:12px 0;}.stat:not(:last-child){border-right:1px solid rgba(255,255,255,0.05);}.stat-num{font-size:16px;font-weight:900;color:var(--gold2);}.stat-lbl{font-size:9px;color:var(--mist);margin-top:2px;}.today-sec{padding:0 18px 4px;}.today-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;}.lucky-bar{display:flex;align-items:center;gap:10px;background:var(--ink2);border:1px solid rgba(255,255,255,0.05);border-radius:14px;padding:11px 14px;margin-bottom:9px;}.lucky-color-chip{width:28px;height:28px;border-radius:8px;flex-shrink:0;border:2px solid rgba(255,255,255,0.15);}.today-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:9px;}.td-card{border-radius:16px;padding:14px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.06);}.td-card:active{transform:scale(0.97);}.td-card.wide{grid-column:1/-1;display:flex;align-items:center;gap:14px;}.td-free-badge{position:absolute;top:8px;right:8px;font-size:9px;font-weight:700;background:rgba(95,196,158,0.2);color:var(--jade);padding:2px 7px;border-radius:10px;border:1px solid rgba(95,196,158,0.3);}.td-icon{font-size:26px;margin-bottom:7px;}.td-card.wide .td-icon{font-size:32px;margin-bottom:0;flex-shrink:0;}.td-name{font-size:12px;font-weight:700;margin-bottom:2px;}.td-value{font-size:11px;color:var(--mist);margin-top:3px;line-height:1.5;}.quote-card{background:linear-gradient(135deg,rgba(155,143,212,0.1),rgba(232,200,122,0.06));border:1px solid rgba(155,143,212,0.18);border-radius:16px;padding:14px 16px;margin-bottom:9px;cursor:pointer;}.gw-main{margin:0 18px 4px;border-radius:20px;overflow:hidden;cursor:pointer;transition:all .2s;}.gw-main:active{transform:scale(0.98);}.gw-bg{background:linear-gradient(135deg,rgba(245,184,196,0.14),rgba(232,200,122,0.09));border:1px solid rgba(245,184,196,0.22);border-radius:20px;padding:18px 16px;}.gw-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}.gw-label{font-size:11px;font-weight:700;color:var(--blush);}.gw-badge{font-size:9px;font-weight:700;background:rgba(245,184,196,0.2);color:var(--blush);padding:3px 9px;border-radius:20px;border:1px solid rgba(245,184,196,0.3);}.gw-title{font-size:17px;font-weight:900;margin-bottom:5px;}.gw-desc{font-size:11px;color:var(--mist);line-height:1.6;margin-bottom:12px;}.gw-examples{display:flex;gap:6px;flex-wrap:wrap;}.gw-ex{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:rgba(245,184,196,0.1);color:var(--blush);border:1px solid rgba(245,184,196,0.18);}.sec{padding:14px 18px 4px;}.sec-t{font-size:14px;font-weight:900;margin-bottom:11px;display:flex;align-items:center;gap:7px;}.sec-t::after{content:'';flex:1;height:1px;background:linear-gradient(to right,rgba(232,200,122,0.15),transparent);}.divider{height:8px;background:var(--ink);}.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:0 18px 4px;}.svc-card{background:var(--ink2);border:1px solid rgba(255,255,255,0.05);border-radius:var(--r);padding:15px 13px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}.svc-card:active{transform:scale(0.97);}.svc-card.coming{opacity:0.55;cursor:default;}.svc-ic{font-size:26px;margin-bottom:7px;}.svc-name{font-size:12px;font-weight:700;margin-bottom:2px;}.svc-desc{font-size:10px;color:var(--mist);line-height:1.5;}.svc-price{display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:var(--gold);background:rgba(232,200,122,0.1);padding:2px 8px;border-radius:20px;}.svc-price.free{color:var(--jade);background:rgba(95,196,158,0.1);}.svc-price.soon{color:var(--violet);background:rgba(155,143,212,0.1);}.svc-bdg{position:absolute;top:8px;right:8px;font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;}.bdg-hot{background:rgba(245,184,196,0.18);color:var(--blush);border:1px solid rgba(245,184,196,0.28);}.bdg-new{background:rgba(95,196,158,0.18);color:var(--jade);border:1px solid rgba(95,196,158,0.28);}.bdg-free{background:rgba(232,200,122,0.15);color:var(--gold);border:1px solid rgba(232,200,122,0.25);}.bdg-soon{background:rgba(155,143,212,0.15);color:var(--violet);border:1px solid rgba(155,143,212,0.25);}.bdg-premium{background:rgba(244,124,90,0.15);color:var(--coral);border:1px solid rgba(244,124,90,0.25);}.rv-wrap{overflow:hidden;margin-bottom:4px;}.rv-track{display:flex;gap:9px;animation:scroll 24s linear infinite;width:max-content;}@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}.rv-card{flex-shrink:0;width:185px;background:var(--ink2);border:1px solid rgba(255,255,255,0.05);border-radius:13px;padding:12px 13px;}.rv-stars{color:var(--gold);font-size:10px;margin-bottom:4px;}.rv-text{font-size:11px;color:var(--mist);line-height:1.6;}.rv-author{font-size:10px;color:rgba(200,196,216,0.32);margin-top:5px;}.ddi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;}.ddi-item{background:var(--ink3);border-radius:14px;padding:11px 6px;text-align:center;border:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:all .18s;}.ddi-item.sel{border-color:rgba(232,200,122,0.45);background:rgba(232,200,122,0.08);}.zodiac-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;}.zc-item{background:var(--ink3);border-radius:14px;padding:11px 6px;text-align:center;border:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:all .18s;}.zc-item.sel{border-color:rgba(155,143,212,0.5);background:rgba(155,143,212,0.08);}.blood-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}.blood-item{background:var(--ink3);border-radius:16px;padding:16px 8px;text-align:center;border:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:all .18s;}.blood-item.sel{border-color:rgba(245,184,196,0.5);background:rgba(245,184,196,0.08);}.goods-cat-scroll{display:flex;gap:7px;padding:0 18px 12px;overflow-x:auto;scrollbar-width:none;}.goods-cat-scroll::-webkit-scrollbar{display:none;}.gcat-btn{flex-shrink:0;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.07);background:transparent;color:var(--mist);cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .18s;}.gcat-btn.on{background:rgba(232,200,122,0.12);color:var(--gold);border-color:rgba(232,200,122,0.28);}.goods-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:0 18px 24px;}.gc{background:var(--ink2);border-radius:var(--r);overflow:hidden;border:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:all .2s;}.gc:active{transform:scale(0.97);}.gc-img{width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:44px;position:relative;}.gc-badge-tl{position:absolute;top:7px;left:7px;font-size:9px;font-weight:900;padding:2px 7px;border-radius:10px;}.gc-badge-tr{position:absolute;top:7px;right:7px;background:rgba(232,200,122,0.9);color:var(--ink);font-size:9px;font-weight:900;padding:2px 7px;border-radius:10px;}.gc-info{padding:10px 11px;}.gc-cat-lbl{font-size:9px;color:var(--mist);font-weight:700;margin-bottom:2px;}.gc-name{font-size:11px;font-weight:700;margin-bottom:4px;line-height:1.35;}.gc-price{font-size:13px;font-weight:900;color:var(--gold);}.gc-orig{font-size:10px;color:rgba(200,196,216,0.32);text-decoration:line-through;margin-left:4px;}.my-top{padding:24px 18px 14px;text-align:center;}.my-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(232,200,122,0.2),rgba(245,184,196,0.2));border:2px solid rgba(232,200,122,0.28);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 10px;}.my-name{font-size:17px;font-weight:900;margin-bottom:3px;}.my-email{font-size:12px;color:var(--mist);}.my-stats{display:flex;background:var(--ink2);border-radius:14px;margin:12px 18px;border:1px solid rgba(255,255,255,0.05);}.my-stat{flex:1;text-align:center;padding:12px 0;}.my-stat:not(:last-child){border-right:1px solid rgba(255,255,255,0.05);}.my-stat-num{font-size:15px;font-weight:900;color:var(--gold2);}.my-stat-lbl{font-size:10px;color:var(--mist);margin-top:2px;}.my-menu{padding:0 18px;}.my-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;}.my-row-l{display:flex;align-items:center;gap:10px;font-size:13px;}.my-row-r{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--mist);}.my-badge{background:rgba(245,184,196,0.15);color:var(--blush);font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;}.auth-div{display:flex;align-items:center;gap:10px;margin:14px 0;color:rgba(200,196,216,0.28);font-size:11px;}.auth-div::before,.auth-div::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.05);}.social-btn{width:100%;padding:13px;border-radius:12px;border:1px solid rgba(255,255,255,0.07);background:var(--ink3);color:var(--white);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;margin-bottom:8px;}.kakao{background:#FAE100;color:#3B1B1B;border-color:#FAE100;}.google{background:#fff;color:#333;border-color:#ddd;}.person-card{display:flex;align-items:center;gap:10px;padding:11px 13px;background:var(--ink3);border-radius:13px;border:1px solid rgba(255,255,255,0.06);margin-bottom:7px;cursor:pointer;}.person-avatar{width:38px;height:38px;border-radius:50%;background:var(--ink4);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}.tarot-card{width:120px;height:190px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid rgba(232,200,122,0.3);background:linear-gradient(135deg,var(--ink3),var(--ink2));cursor:pointer;transition:all .4s;flex-shrink:0;}.tarot-card.flipped{background:linear-gradient(135deg,rgba(155,143,212,0.2),rgba(232,200,122,0.15));}.lotto-balls{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:12px 0;}.lotto-ball{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff;flex-shrink:0;}.ytype-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;}.ytype-item{background:var(--ink3);border-radius:12px;padding:10px 6px;text-align:center;border:1px solid rgba(255,255,255,0.05);}`

const TODAY = {
  date:"2026년 3월 30일 월요일",
  운세:{overall:78,love:65,money:82,health:71},
  타로:{card:"🌟",name:"별(The Star)",meaning:"희망과 새로운 시작. 오늘은 믿음을 갖고 나아가세요."},
  행운:{
    color:"산호색", colorHex:"#F47C5A",
    number:7, direction:"동쪽",
    time:"오전 10시", food:"된장찌개",
    animal:"호랑이", energy:"활기·집중",
  },
  로또:[3,12,24,31,38,45],
  명언:{text:"하늘은 스스로 돕는 자를 돕는다",source:"— 천기 오늘의 말씀"},
  이달:{month:"3월",keyword:"전환점",stars:5,desc:"막혔던 것들이 뚫리기 시작하는 달."},
};

const OHAENG = {
  화:{label:"화(火)",color:"#E85555",bg:"rgba(232,85,85,0.15)",emoji:"🔴",desc:"열정·리더십·활력"},
  수:{label:"수(水)",color:"#5588E8",bg:"rgba(85,136,232,0.15)",emoji:"🔵",desc:"지혜·직관·냉정"},
  목:{label:"목(木)",color:"#55B855",bg:"rgba(85,184,85,0.15)",emoji:"🟢",desc:"성장·창의·도전"},
  금:{label:"금(金)",color:"#E8C555",bg:"rgba(232,197,85,0.15)",emoji:"🟡",desc:"의리·결단·재물"},
  토:{label:"토(土)",color:"#C8834A",bg:"rgba(200,131,74,0.15)",emoji:"🟤",desc:"안정·신뢰·포용"},
};

const DDIS = [
  {id:"쥐",emoji:"🐭",year:"96·08·20",ohaeng:"수"},{id:"소",emoji:"🐮",year:"97·09·21",ohaeng:"토"},
  {id:"호랑이",emoji:"🐯",year:"98·10·22",ohaeng:"목"},{id:"토끼",emoji:"🐰",year:"99·11·23",ohaeng:"목"},
  {id:"용",emoji:"🐲",year:"00·12·24",ohaeng:"토"},{id:"뱀",emoji:"🐍",year:"01·13·25",ohaeng:"화"},
  {id:"말",emoji:"🐴",year:"02·14·26",ohaeng:"화"},{id:"양",emoji:"🐑",year:"03·15·27",ohaeng:"토"},
  {id:"원숭이",emoji:"🐵",year:"04·16·28",ohaeng:"금"},{id:"닭",emoji:"🐔",year:"05·17·29",ohaeng:"금"},
  {id:"개",emoji:"🐶",year:"06·18·30",ohaeng:"토"},{id:"돼지",emoji:"🐷",year:"07·19·31",ohaeng:"수"},
];

const ZODIACS = [
  {id:"양자리",icon:"♈",date:"3.21~4.19",stone:"다이아몬드",color:"#FF4444"},
  {id:"황소자리",icon:"♉",date:"4.20~5.20",stone:"에메랄드",color:"#44BB44"},
  {id:"쌍둥이자리",icon:"♊",date:"5.21~6.20",stone:"진주",color:"#FFDD44"},
  {id:"게자리",icon:"♋",date:"6.21~7.22",stone:"루비",color:"#FF6688"},
  {id:"사자자리",icon:"♌",date:"7.23~8.22",stone:"페리도트",color:"#FF8844"},
  {id:"처녀자리",icon:"♍",date:"8.23~9.22",stone:"사파이어",color:"#4488FF"},
  {id:"천칭자리",icon:"♎",date:"9.23~10.22",stone:"오팔",color:"#FF99CC"},
  {id:"전갈자리",icon:"♏",date:"10.23~11.21",stone:"토파즈",color:"#AA44AA"},
  {id:"사수자리",icon:"♐",date:"11.22~12.21",stone:"터키석",color:"#44AAAA"},
  {id:"염소자리",icon:"♑",date:"12.22~1.19",stone:"가넷",color:"#884422"},
  {id:"물병자리",icon:"♒",date:"1.20~2.18",stone:"자수정",color:"#6644BB"},
  {id:"물고기자리",icon:"♓",date:"2.19~3.20",stone:"아쿠아마린",color:"#44AAFF"},
];

const BLOODS = [
  {type:"A",trait:"꼼꼼·계획적",color:"#FF6666",goods_cat:"혈액형_A"},
  {type:"B",trait:"자유·창의적",color:"#FFAA44",goods_cat:"혈액형_B"},
  {type:"O",trait:"리더·열정적",color:"#FF4444",goods_cat:"혈액형_O"},
  {type:"AB",trait:"논리·이중성",color:"#8844BB",goods_cat:"혈액형_AB"},
];

const TWELVE_TYPES = [
  {id:"봉황",icon:"🦅",hanja:"鳳凰",desc:"카리스마와 재생. 어떤 상황에서도 다시 일어서는 리더.",tags:["리더십","재생","카리스마"]},
  {id:"용",icon:"🐉",hanja:"龍",desc:"야망과 변화의 화신. 큰 목표를 향해 거침없이 나아갑니다.",tags:["야망","변화","추진력"]},
  {id:"백호",icon:"🐯",hanja:"白虎",desc:"독립과 용기. 자신만의 길을 개척하는 강인한 의지.",tags:["독립","용기","강인함"]},
  {id:"현무",icon:"🐢",hanja:"玄武",desc:"지혜와 끈기. 신중하게 판단하고 오래 참는 깊은 내공.",tags:["지혜","끈기","신중함"]},
  {id:"기린",icon:"🦄",hanja:"麒麟",desc:"온화함과 고귀함. 희귀한 재능을 품고 자연스럽게 이끕니다.",tags:["온화","고귀","재능"]},
  {id:"주작",icon:"🔥",hanja:"朱雀",desc:"열정과 직관. 감정 표현이 풍부하고 예술적 감수성이 뛰어납니다.",tags:["열정","직관","표현력"]},
  {id:"청룡",icon:"💫",hanja:"靑龍",desc:"성장과 창의. 새로운 것에 도전하고 끊임없이 발전합니다.",tags:["성장","창의","도전"]},
  {id:"백학",icon:"🕊️",hanja:"白鶴",desc:"순수함과 고고함. 예술적 감각과 높은 이상을 추구합니다.",tags:["순수","예술","고고함"]},
  {id:"흑호",icon:"🖤",hanja:"黑虎",desc:"신비와 통찰. 남들이 보지 못하는 것을 꿰뚫는 예리함.",tags:["신비","통찰","예리함"]},
  {id:"금오",icon:"☀️",hanja:"金烏",desc:"활력과 사교. 밝은 에너지로 주변을 빛나게 하는 태양.",tags:["활력","사교","밝음"]},
  {id:"옥토",icon:"🌙",hanja:"玉兎",desc:"감성과 섬세함. 깊은 공감 능력으로 사람 마음을 어루만집니다.",tags:["감성","공감","섬세함"]},
  {id:"신구",icon:"⭐",hanja:"神龜",desc:"안정과 신뢰. 묵묵히 자리를 지키며 든든한 버팀목이 됩니다.",tags:["안정","신뢰","수호"]},
];

const REVIEWS = [
  {text:"천기에서 소개팅 상대 관상짤 봤는데 소름... 완전 맞음",author:"서울 b***4",stars:5},
  {text:"꿈 해몽 매일 보는데 그날그날 맞아서 신기해요",author:"부산 j***1",stars:5},
  {text:"관상짤 보고 굿즈샵에서 오행 팔찌 샀는데 진짜 좋아요",author:"인천 m***8",stars:5},
  {text:"결제 완료하고 굿즈 추천 떴는데 딱 사고 싶었던 거 ㅋㅋ",author:"대전 k***2",stars:5},
  {text:"12수호신 주작형 나왔는데 완전 나야...친구들도 다 해봄",author:"광주 s***7",stars:5},
  {text:"파동성명학 보고 굿즈도 같이 샀어요. 세트로 잘 맞아요",author:"수원 h***5",stars:5},
];

const GOODS_DATA = [
  {id:1,cat:"기운회복",tags:["정화","액막이"],icon:"🌿",name:"정화 쑥 인센스 번들",price:11800,orig:null,sale:null,color:"rgba(85,184,85,0.2)",rec:false},
  {id:2,cat:"기운회복",tags:["정화","수면"],icon:"🧂",name:"히말라야 핑크솔트 정화 세트",price:14800,orig:18800,sale:17,color:"rgba(232,200,122,0.2)",rec:false},
  {id:3,cat:"기운회복",tags:["정화","공간"],icon:"🪬",name:"터키석 나쁜기운 차단 팔찌",price:16800,orig:null,sale:null,color:"rgba(68,170,255,0.2)",rec:false},
  {id:7,cat:"기운보강",tags:["차단","보호"],icon:"💎",name:"블랙 투르말린 원석",price:17800,orig:null,sale:null,color:"rgba(30,30,50,0.5)",rec:false},
  {id:8,cat:"기운보강",tags:["직관","정신력"],icon:"🟣",name:"자수정 클러스터",price:27800,orig:35800,sale:20,color:"rgba(155,143,212,0.2)",rec:false},
  {id:9,cat:"기운보강",tags:["사랑","감성"],icon:"💗",name:"로즈쿼츠 원석 원형",price:14800,orig:null,sale:null,color:"rgba(245,184,196,0.3)",rec:false},
  {id:13,cat:"오행보완",ohaeng:"화",tags:["열정","재물"],icon:"🔴",name:"화(火) 빨간 팔찌",price:14800,orig:null,sale:null,color:"rgba(232,85,85,0.15)",rec:true},
  {id:14,cat:"오행보완",ohaeng:"화",tags:["화기운","행운"],icon:"🔑",name:"빨간 열쇠고리 미니",price:8800,orig:null,sale:null,color:"rgba(232,85,85,0.15)",rec:true},
  {id:15,cat:"오행보완",ohaeng:"화",tags:["화기운"],icon:"📱",name:"레드 핸드폰 고리",price:9800,orig:null,sale:null,color:"rgba(232,85,85,0.15)",rec:true},
  {id:29,cat:"띠별",ddi:"쥐",tags:["지혜","영리"],icon:"🐭",name:"쥐띠 스마트 블루 팔찌",price:13800,orig:null,sale:null,color:"rgba(85,136,232,0.2)",rec:false},
  {id:30,cat:"띠별",ddi:"소",tags:["성실","끈기"],icon:"🐮",name:"소띠 브라운 어스 팔찌",price:13800,orig:null,sale:null,color:"rgba(200,131,74,0.2)",rec:false},
  {id:31,cat:"띠별",ddi:"호랑이",tags:["용기","독립"],icon:"🐯",name:"호랑이띠 수호 팔찌",price:13800,orig:null,sale:null,color:"rgba(232,150,50,0.2)",rec:false},
  {id:41,cat:"영수형",ytype:"봉황",tags:["리더십","재생"],icon:"🦅",name:"봉황형 골드 뱅글 팔찌",price:23800,orig:30800,sale:20,color:"rgba(232,200,122,0.25)",rec:false},
  {id:42,cat:"영수형",ytype:"용",tags:["야망","추진력"],icon:"🐉",name:"용형 블루 드래곤 키링",price:12800,orig:null,sale:null,color:"rgba(85,136,232,0.2)",rec:false},
  {id:43,cat:"영수형",ytype:"백호",tags:["용기","독립"],icon:"🐯",name:"백호형 화이트 팔찌",price:15800,orig:19800,sale:16,color:"rgba(220,220,230,0.3)",rec:false},
  {id:53,cat:"별자리",zodiac:"양자리",tags:["열정","도전"],icon:"♈",name:"양자리 레드 루비 키링",price:9800,orig:null,sale:null,color:"rgba(255,68,68,0.2)",rec:false},
  {id:54,cat:"별자리",zodiac:"황소자리",tags:["안정","감각"],icon:"♉",name:"황소자리 에메랄드 팔찌",price:18800,orig:24800,sale:21,color:"rgba(68,187,68,0.2)",rec:false},
  {id:55,cat:"별자리",zodiac:"쌍둥이자리",tags:["소통","변화"],icon:"♊",name:"쌍둥이자리 듀얼 귀걸이",price:14800,orig:null,sale:null,color:"rgba(255,221,68,0.2)",rec:false},
  {id:65,cat:"혈액형",blood:"A",tags:["안정","진정"],icon:"🌸",name:"A형 라벤더 진정 향초",price:17800,orig:null,sale:null,color:"rgba(180,150,220,0.2)",rec:false},
  {id:66,cat:"혈액형",blood:"A",tags:["계획","집중"],icon:"📿",name:"A형 화이트 퀘이츠 팔찌",price:15800,orig:19800,sale:16,color:"rgba(240,240,245,0.3)",rec:false},
  {id:67,cat:"혈액형",blood:"A",tags:["안정","수면"],icon:"💜",name:"A형 아마란스 수면 디퓨저",price:21800,orig:null,sale:null,color:"rgba(180,100,220,0.2)",rec:false},
  {id:77,cat:"수비학",number:1,tags:["리더십","독립"],icon:"1️⃣",name:"운명수 1번 골드 팔찌",price:16800,orig:null,sale:null,color:"rgba(232,197,85,0.2)",rec:false},
  {id:78,cat:"수비학",number:2,tags:["조화","협력"],icon:"2️⃣",name:"운명수 2번 실버 팔찌",price:14800,orig:null,sale:null,color:"rgba(180,180,200,0.2)",rec:false},
  {id:79,cat:"수비학",number:3,tags:["창의","표현"],icon:"3️⃣",name:"운명수 3번 옐로우 키링",price:9800,orig:null,sale:null,color:"rgba(255,221,68,0.2)",rec:false},
  {id:160,cat:"기질도",gijil:"화형",tags:["열정","직관","기질도"],icon:"🔥",name:"화형(火) 기질도 팔찌",price:15800,orig:null,sale:null,color:"rgba(232,85,85,0.2)",rec:false},
  {id:161,cat:"기질도",gijil:"수형",tags:["지혜","냉철","기질도"],icon:"💧",name:"수형(水) 기질도 팔찌",price:15800,orig:null,sale:null,color:"rgba(85,136,232,0.2)",rec:false},
  {id:162,cat:"기질도",gijil:"목형",tags:["성장","창의","기질도"],icon:"🌱",name:"목형(木) 기질도 팔찌",price:15800,orig:null,sale:null,color:"rgba(85,184,85,0.2)",rec:false},
  {id:86,cat:"미니부적",tags:["재물","금전"],icon:"🧧",name:"재물운 아크릴 부적",price:7800,orig:null,sale:null,color:"rgba(232,200,122,0.2)",rec:false},
  {id:87,cat:"미니부적",tags:["연애","애정"],icon:"❤️",name:"애정운 스티커 부적",price:3800,orig:null,sale:null,color:"rgba(245,184,196,0.2)",rec:false},
  {id:88,cat:"미니부적",tags:["합격","시험"],icon:"📋",name:"합격운 카드형 부적",price:5800,orig:null,sale:null,color:"rgba(95,196,158,0.2)",rec:false},
  {id:94,cat:"운세점사",tags:["타로","자기통찰"],icon:"🎴",name:"메이저 아르카나 미니 타로덱",price:19800,orig:24800,sale:17,color:"rgba(155,143,212,0.2)",rec:false},
  {id:95,cat:"운세점사",tags:["오라클","직관"],icon:"🔯",name:"별자리 오라클 카드 36장",price:24800,orig:29800,sale:14,color:"rgba(232,200,122,0.2)",rec:false},
  {id:96,cat:"운세점사",tags:["운세","포토카드"],icon:"📮",name:"2026 월별 운세 포토카드 12장",price:14800,orig:null,sale:null,color:"rgba(245,184,196,0.2)",rec:false},
  {id:100,cat:"명상향",tags:["재물","집중"],icon:"🕯️",name:"재물운 소이 향초 (시나몬)",price:17800,orig:null,sale:null,color:"rgba(232,200,122,0.2)",rec:false},
  {id:101,cat:"명상향",tags:["연애","분위기"],icon:"🌹",name:"연애운 로즈 인센스 10개",price:9800,orig:12800,sale:18,color:"rgba(245,184,196,0.2)",rec:false},
  {id:102,cat:"명상향",tags:["정화","명상"],icon:"🌿",name:"정화 쑥 번들 4개입",price:11800,orig:null,sale:null,color:"rgba(85,184,85,0.2)",rec:false},
  {id:113,cat:"9800",tags:["부적","연애"],icon:"❤️",name:"연애대통 부적",price:3800,orig:null,sale:null,color:"rgba(245,184,196,0.25)",rec:true},
  {id:114,cat:"9800",tags:["부적","재물"],icon:"💛",name:"재물대통 부적",price:3800,orig:null,sale:null,color:"rgba(232,197,85,0.25)",rec:true},
  {id:115,cat:"9800",tags:["부적","합격"],icon:"📗",name:"합격·취업 부적",price:3800,orig:null,sale:null,color:"rgba(95,196,158,0.25)",rec:false},
  {id:160,cat:"5800",tags:["부적","연애"],icon:"❤️",name:"연애대통 부적 (미니)",price:2800,orig:null,sale:null,color:"rgba(245,184,196,0.25)",rec:true},
  {id:161,cat:"5800",tags:["부적","재물"],icon:"💛",name:"재물대통 부적 (미니)",price:2800,orig:null,sale:null,color:"rgba(232,197,85,0.25)",rec:true},
  {id:162,cat:"5800",tags:["부적","합격"],icon:"📗",name:"합격·취업 부적 (미니)",price:2800,orig:null,sale:null,color:"rgba(95,196,158,0.25)",rec:false},
  {id:128,cat:"이사개업",tags:["부적","세트","차·집·회사"],icon:"📦",name:"장소 3종 부적 세트 (차·집·회사)",price:9800,orig:12800,sale:18,color:"rgba(232,200,122,0.2)",rec:true},
  {id:129,cat:"이사개업",tags:["이사","정화","4종"],icon:"🏡",name:"이사 정화 4종 키트 (방2+거실+화장실)",price:11800,orig:null,sale:null,color:"rgba(95,196,158,0.2)",rec:true},
  {id:130,cat:"이사개업",tags:["이사","정화","6종"],icon:"🏠",name:"이사 정화 6종 키트 (방3+거실+화장실2)",price:16800,orig:20800,sale:16,color:"rgba(95,196,158,0.25)",rec:false},
  {id:132,cat:"커플",tags:["연애","세트"],icon:"💕",name:"연애운 3종 세트 (부적+팔찌+인센스)",price:9800,orig:13800,sale:25,color:"rgba(245,184,196,0.2)",rec:false},
  {id:134,cat:"집안정화",tags:["정화","쑥","스머징"],icon:"🌿",name:"쑥 스머징 번들 (공간 정화)",price:11800,orig:null,sale:null,color:"rgba(85,184,85,0.2)",rec:false},
  {id:135,cat:"집안정화",tags:["정화","소금","스프레이"],icon:"💧",name:"천일염 정화 스프레이",price:14800,orig:18800,sale:17,color:"rgba(85,136,232,0.2)",rec:false},
  {id:136,cat:"집안정화",tags:["수호","밥솥","조왕신"],icon:"🍚",name:"조왕신 부엌 수호 패브릭 패치",price:12800,orig:null,sale:null,color:"rgba(232,197,85,0.2)",rec:false},
  {id:140,cat:"외국부적",tags:["나자르","악운차단","터키"],icon:"🧿",name:"나자르 본주우 벽걸이 (터키)",price:14800,orig:null,sale:null,color:"rgba(68,136,255,0.25)",rec:true},
  {id:141,cat:"외국부적",tags:["함사","보호","중동"],icon:"🪬",name:"함사 실버 팔찌 (중동·북아프리카)",price:24800,orig:null,sale:null,color:"rgba(68,170,255,0.2)",rec:true},
  {id:142,cat:"외국부적",tags:["클로버","행운","아일랜드"],icon:"🍀",name:"네잎클로버 황동 펜던트 (아일랜드)",price:12800,orig:null,sale:null,color:"rgba(85,184,85,0.25)",rec:false},
  {id:152,cat:"프리미엄",tags:["옥돌","거북이","장수","명품"],icon:"🐢",name:"진짜 옥돌 거북이 소품",price:197800,orig:null,sale:null,color:"rgba(85,184,85,0.3)",rec:false},
  {id:153,cat:"프리미엄",tags:["황동","마네키네코","대형"],icon:"🐱",name:"황동 마네키네코 대형 (수제)",price:97800,orig:null,sale:null,color:"rgba(232,197,85,0.25)",rec:false},
  {id:154,cat:"프리미엄",tags:["자수정","천연","클러스터"],icon:"💜",name:"천연 자수정 클러스터 (대)",price:67800,orig:88800,sale:23,color:"rgba(155,143,212,0.3)",rec:false},
  {id:107,cat:"시즌",tags:["신년","개운","선물"],icon:"🎋",name:"2026 신년 개운 프리미엄 키트",price:41800,orig:55800,sale:24,color:"rgba(232,200,122,0.2)",rec:false},
  {id:108,cat:"시즌",tags:["신년","팔찌"],icon:"✨",name:"2026 병오년 행운 팔찌",price:19800,orig:null,sale:null,color:"rgba(232,200,122,0.2)",rec:false},
  {id:109,cat:"시즌",tags:["봄","새출발"],icon:"🌸",name:"봄 개운 팔찌 춘분 에디션",price:19800,orig:null,sale:null,color:"rgba(245,184,196,0.2)",rec:false},
  {id:256,cat:"반려동물",tags:["강아지","수호","부적"],icon:"🐶",name:"강아지 수호 부적",price:5800,orig:null,sale:null,color:"rgba(232,197,85,0.2)",rec:true},
  {id:257,cat:"반려동물",tags:["고양이","수호","부적"],icon:"🐱",name:"고양이 수호 부적",price:5800,orig:null,sale:null,color:"rgba(245,184,196,0.2)",rec:true},
  {id:258,cat:"반려동물",tags:["강아지","행운","방석"],icon:"🛏️",name:"강아지 행운의 방석",price:28800,orig:null,sale:null,color:"rgba(232,200,122,0.2)",rec:true},
  {id:167,cat:"전생유형",gijil:"선비",tags:["지혜","문인","학자"],icon:"📜",name:"전생 선비형 지혜의 붓 키링",price:9800,orig:null,sale:null,color:"rgba(232,200,122,0.2)",rec:true},
  {id:168,cat:"전생유형",gijil:"무사",tags:["용기","강인","무사"],icon:"⚔️",name:"전생 무사형 용기의 검 펜던트",price:12800,orig:null,sale:null,color:"rgba(232,85,85,0.2)",rec:false},
  {id:169,cat:"전생유형",gijil:"왕족",tags:["리더십","권위","왕"],icon:"👑",name:"전생 왕족형 골드 크라운 키링",price:12800,orig:null,sale:null,color:"rgba(232,197,85,0.25)",rec:true},
  {id:170,cat:"전생유형",gijil:"상인",tags:["재물","교역","사업"],icon:"💰",name:"전생 상인형 황금 동전 키링",price:9800,orig:null,sale:null,color:"rgba(232,200,122,0.2)",rec:false},
  {id:171,cat:"전생유형",gijil:"예인",tags:["예술","창의","표현"],icon:"🎭",name:"전생 예인형 달빛 브로치",price:11800,orig:14800,sale:20,color:"rgba(155,143,212,0.2)",rec:true},
  {id:172,cat:"전생유형",gijil:"승려",tags:["지혜","수행","명상"],icon:"🕯️",name:"전생 승려형 연꽃 인센스 홀더",price:8800,orig:null,sale:null,color:"rgba(95,196,158,0.2)",rec:false},
  {id:173,cat:"전생유형",gijil:"무녀",tags:["신기","영감","치유"],icon:"🌙",name:"전생 무녀형 문스톤 목걸이",price:19800,orig:24800,sale:20,color:"rgba(155,143,212,0.25)",rec:true},
  {id:174,cat:"전생유형",gijil:"농부",tags:["성실","풍요","대지"],icon:"🌱",name:"전생 농부형 오행 씨앗 키링",price:6800,orig:null,sale:null,color:"rgba(95,196,158,0.15)",rec:false},
  {id:175,cat:"전생유형",gijil:"장군",tags:["용맹","전략","리더"],icon:"⚔️",name:"전생 장군형 철갑 팔찌",price:15800,orig:19800,sale:20,color:"rgba(180,180,200,0.2)",rec:false},
  {id:176,cat:"전생유형",gijil:"도인",tags:["신비","통찰","자연"],icon:"🌊",name:"전생 도인형 수정 명상 볼",price:13800,orig:null,sale:null,color:"rgba(85,136,232,0.2)",rec:true},
  {id:177,cat:"전생유형",gijil:"장인",tags:["손재주","창조","장인정신"],icon:"🔨",name:"전생 장인형 황동 부적 펜던트",price:14800,orig:null,sale:null,color:"rgba(200,150,50,0.2)",rec:false},
  {id:178,cat:"전생유형",gijil:"신관",tags:["영성","신성","의식"],icon:"🌟",name:"전생 신관형 칠성 수정 팔찌",price:18800,orig:23800,sale:21,color:"rgba(232,200,122,0.2)",rec:true},
  {id:180,cat:"헤나키트",tags:["헤나","손금","인도"],icon:"🪷",name:"인도 헤나 손금 강화 키트",price:9800,orig:null,sale:null,color:"rgba(245,184,196,0.25)",rec:true},
  {id:181,cat:"헤나키트",tags:["헤나","만트라","문양"],icon:"🌺",name:"만트라 문양 헤나 키트",price:12800,orig:null,sale:null,color:"rgba(245,184,196,0.2)",rec:false},
  {id:182,cat:"헤나키트",tags:["타투펜","점","얼굴"],icon:"✏️",name:"천기 얼굴 점 찍기 키트 (타투펜+가이드)",price:9800,orig:null,sale:null,color:"rgba(232,200,122,0.2)",rec:true},
  {id:186,cat:"주얼리",tags:["목걸이","초승달","실버"],icon:"🌙",name:"초승달 실버 목걸이",price:18800,orig:null,sale:null,color:"rgba(200,200,220,0.25)",rec:true},
  {id:187,cat:"주얼리",tags:["목걸이","네잎클로버"],icon:"🍀",name:"네잎클로버 골드 목걸이",price:18800,orig:null,sale:null,color:"rgba(85,184,85,0.25)",rec:true},
  {id:188,cat:"주얼리",tags:["목걸이","나자르","눈"],icon:"🧿",name:"나자르 눈 실버 목걸이",price:16800,orig:null,sale:null,color:"rgba(68,136,255,0.2)",rec:false},
]
const GOODS_CATS = [
  // 1줄 — 빠른접근 (6개)
  {id:"5800",     label:"🏷️ 5,800원↓"},
  {id:"9800",     label:"🏷️ 9,800원↓"},
  {id:"추천",     label:"✨ 내 맞춤"},
  {id:"프리미엄", label:"💎 프리미엄"},
  {id:"시즌",     label:"🎋 시즌한정"},
  {id:"전체",     label:"🔍 전체보기"},
  // 2줄 — 나의 유형 (7개)
  {id:"영수형",   label:"🐉 12수호신"},
  {id:"띠별",     label:"🐯 띠별"},
  {id:"별자리",   label:"⭐ 별자리"},
  {id:"혈액형",   label:"🩸 혈액형"},
  {id:"기질도",   label:"🧬 기질도"},
  {id:"수비학",   label:"🔢 수비학"},
  {id:"전생유형", label:"🎴 전생유형"},
  // 3줄 — 기운·정화 (6개)
  {id:"집안정화", label:"🧹 집안 정화"},
  {id:"미니부적", label:"🧧 미니 부적"},
  {id:"오행보완", label:"🔥 오행 보완"},
  {id:"기운회복", label:"✨ 기운 회복"},
  {id:"기운보강", label:"💪 기운 보강"},
  {id:"명상향",   label:"🕯️ 향·인센스"},
  // 4줄 — 테마샵 (6개)
  {id:"외국부적", label:"🌍 외국 부적"},
  {id:"운세점사", label:"🔮 운세·점사"},
  {id:"럭키",     label:"🍀 럭키템"},
  {id:"커플",     label:"💌 커플·연애"},
  {id:"반려동물", label:"🐾 반려동물"},
  {id:"헤나키트", label:"🪄 손금·점키트"},
  // 5줄 — 라이프·패션 (6개)
  {id:"집안수호신",label:"🏠 집안 수호신"},
  {id:"이사개업",  label:"🏡 이사·개업"},
  {id:"종교영성",  label:"⛩️ 종교·영성"},
  {id:"아기육아",  label:"🌱 탄생·수호"},
  {id:"주얼리",    label:"💍 천기 주얼리"},
  {id:"의류",      label:"👗 천기 굿즈"},
];

// 콘텐츠 결과 → 굿즈 필터링 로직
const GOODS_ENGINE = {
  // 관상 계열 → 기운회복 + 오행(화) + 미니부적
  gwansang_zal:   (ctx) => GOODS_DATA.filter(g => g.cat==="기운회복" || (g.cat==="오행보완"&&g.ohaeng===ctx.ohaeng) || (g.cat==="미니부적")),
  gwansang_full:  (ctx) => GOODS_DATA.filter(g => g.cat==="기운회복" || (g.cat==="오행보완"&&g.ohaeng===ctx.ohaeng) || g.tags?.includes("재물")),
  // 사주 계열 → 오행보완 + 수비학
  saju:           (ctx) => GOODS_DATA.filter(g => (g.cat==="오행보완"&&g.ohaeng===ctx.ohaeng) || g.cat==="수비학" || g.cat==="기운보강"),
  saju_monthly:   (ctx) => GOODS_DATA.filter(g => (g.cat==="오행보완"&&g.ohaeng===ctx.ohaeng) || g.cat==="시즌"),
  // 연애 계열 → 애정 부적 + 연애향초
  love:           (ctx) => GOODS_DATA.filter(g => g.tags?.includes("연애") || g.tags?.includes("애정") || g.tags?.includes("분위기")),
  // 별자리 → 별자리 전용 + 수호석 기반
  zodiac:         (ctx) => GOODS_DATA.filter(g => (g.cat==="별자리"&&g.zodiac===ctx.zodiac) || g.cat==="기운보강"),
  // 12영수형 → 영수형 전용 + 오행
  ytype:          (ctx) => GOODS_DATA.filter(g => (g.cat==="영수형"&&g.ytype===ctx.ytype) || (g.cat==="오행보완"&&g.ohaeng===ctx.ohaeng)),
  // 띠별 → 띠별 수호 + 오행
  ddi:            (ctx) => GOODS_DATA.filter(g => (g.cat==="띠별"&&g.ddi===ctx.ddi) || (g.cat==="오행보완"&&g.ohaeng===ctx.ohaeng)),
  // 혈액형 → 혈액형별
  blood:          (ctx) => GOODS_DATA.filter(g => (g.cat==="혈액형"&&g.blood===ctx.blood) || g.cat==="명상향"),
  // 꿈 해몽 → 키워드별 부적 + 기운회복
  dream:          (ctx) => GOODS_DATA.filter(g => g.cat==="미니부적" || g.cat==="기운회복"),
  // 타로 → 타로카드 + 수정
  tarot_today:    (ctx) => GOODS_DATA.filter(g => g.cat==="타로카드" || g.cat==="기운보강"),
  tarot_love:     (ctx) => GOODS_DATA.filter(g => g.tags?.includes("연애") || g.cat==="타로카드"),
  tarot_health:   (ctx) => GOODS_DATA.filter(g => g.cat==="기운회복" || g.cat==="명상향"),
  tarot_career:   (ctx) => GOODS_DATA.filter(g => g.cat==="기운보강" || g.cat==="수비학"),
  tarot_life:     (ctx) => GOODS_DATA.filter(g => g.cat==="타로카드" || g.cat==="기운보강"),
  // 수비학 → 운명수 컬러 아이템
  numerology:     (ctx) => GOODS_DATA.filter(g => (g.cat==="수비학"&&g.number===ctx.number) || g.cat==="오행보완"),
  // 신년운세 → 시즌 개운 키트
  newyear:        (ctx) => GOODS_DATA.filter(g => g.cat==="시즌" || g.cat==="기운회복"),
  // 파동성명학 → 부족 오행 아이템
  pawdong:        (ctx) => GOODS_DATA.filter(g => (g.cat==="오행보완"&&g.ohaeng===ctx.ohaeng) || g.cat==="기운보강"),
  // 로또 → 행운 강화
  lotto:          (ctx) => GOODS_DATA.filter(g => g.tags?.includes("재물") || g.tags?.includes("행운") || g.cat==="수비학"),
  // 전생 → 기운회복 + 보강
  past_life:      (ctx) => GOODS_DATA.filter(g => g.cat==="기운회복" || g.cat==="기운보강"),
  // 기본 fallback
  default:        (ctx) => GOODS_DATA.filter(g => g.rec || g.cat==="기운회복").slice(0,6),
};

function getGoodsRec(svcId, ctx={}) {
  const fn = GOODS_ENGINE[svcId] || GOODS_ENGINE.default;
  return fn(ctx).slice(0, 5);
}

// 유저 이용 기록 기반 맞춤 추천
function getPersonalizedGoods(history) {
  if(!history || history.length===0) return GOODS_DATA.filter(g=>g.rec).slice(0,8);
  const ohaengSet = new Set(history.map(h=>h.ctx?.ohaeng).filter(Boolean));
  const ytypeSet  = new Set(history.map(h=>h.ctx?.ytype).filter(Boolean));
  const ddiSet    = new Set(history.map(h=>h.ctx?.ddi).filter(Boolean));
  const bloodSet  = new Set(history.map(h=>h.ctx?.blood).filter(Boolean));
  const zodiacSet = new Set(history.map(h=>h.ctx?.zodiac).filter(Boolean));

  const scored = GOODS_DATA.map(g => {
    let score = 0;
    if(g.cat==="오행보완"   && ohaengSet.has(g.ohaeng)) score += 10;
    if(g.cat==="영수형"     && ytypeSet.has(g.ytype))   score += 9;
    if(g.cat==="띠별"       && ddiSet.has(g.ddi))       score += 8;
    if(g.cat==="혈액형"     && bloodSet.has(g.blood))   score += 7;
    if(g.cat==="별자리"     && zodiacSet.has(g.zodiac)) score += 7;
    if(g.rec) score += 3;
    return {...g, _score: score};
  });
  return scored.sort((a,b)=>b._score-a._score).slice(0,10);
}

function Dots(){return<div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>;}
// 공유 배지 레벨 정의
const SHARE_LEVELS = [
  {min:0,  max:0,   label:"기본 회원",   icon:"👤", reward:null},
  {min:1,  max:4,   label:"공유자",      icon:"🔗", reward:"쿠폰 즉시 지급!"},
  {min:5,  max:9,   label:"전파자",      icon:"📢", reward:"디지털 부적 3종 중 선택!"},
  {min:10, max:19,  label:"홍보대사",    icon:"🏆", reward:"운 좋아지는 키링 실물 발송!"},
  {min:20, max:999, label:"인플루언서",  icon:"🌟", reward:"천기 명패 실물 발송!"},
];

function getShareLevel(cnt){
  return SHARE_LEVELS.find(l=>cnt>=l.min&&cnt<=l.max)||SHARE_LEVELS[0];
}

function ShareRow({isLoggedIn, onLoginRequest}){
  const[showPopup,setShowPopup]=useState(false);
  const[shareCount]=useState(0); // 실제는 서버에서
  const level=getShareLevel(shareCount);
  const nextLevel=SHARE_LEVELS[SHARE_LEVELS.indexOf(level)+1];

  function handleSave(){
    if(!isLoggedIn&&onLoginRequest){onLoginRequest();return;}
    alert("결과가 저장됐어요! 마이페이지에서 확인하세요 📋");
  }

  return(
    <>
      {/* 저장 + 공유 버튼 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <button onClick={handleSave}
          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",background:"var(--ink3)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:isLoggedIn?"var(--jade)":"var(--mist)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          📥 {isLoggedIn?"결과 저장":"저장 (로그인)"}
        </button>
        <button onClick={()=>setShowPopup(true)}
          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:12,color:"var(--gold)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          🔗 공유하기
        </button>
      </div>

      {/* 공유 혜택 팝업 */}
      {showPopup&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setShowPopup(false);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🔗 공유하고 혜택 받기!</div>
            <div style={{background:"var(--ink3)",borderRadius:14,padding:"12px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:8}}>✦ 공유 배지 레벨</div>
              {SHARE_LEVELS.slice(1).map((l,i)=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.04)":"none"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{l.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700}}>{l.label} ({l.min}회{l.max<999?`~${l.max}회`:`+`})</div>
                    <div style={{fontSize:10,color:"var(--gold)",marginTop:1}}>{l.reward}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:12,padding:"10px 13px",marginBottom:14,fontSize:11,color:"var(--mist)",textAlign:"center",lineHeight:1.6}}>
              현재 공유 횟수: <strong style={{color:"var(--gold)",fontSize:14}}>{shareCount}회</strong>
              {nextLevel&&<><br/><span style={{color:"var(--mist)"}}>다음 레벨까지 </span><strong style={{color:"var(--jade)"}}>{nextLevel.min-shareCount}번</strong> 더!</>}
            </div>
            <div className="share-row" style={{marginBottom:12}}>
              {[{ic:"🟡",lb:"카카오 공유"},{ic:"📸",lb:"인스타"},{ic:"🔗",lb:"링크 복사"}].map(s=>(
                <div key={s.lb} className="sh-btn" onClick={()=>{setShowPopup(false);}}><span className="sh-ic">{s.ic}</span><span className="sh-lb">{s.lb}</span></div>
              ))}
            </div>
            <button className="btn btn-g" onClick={()=>setShowPopup(false)}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
}

// 쿠폰 코드 검증 (더미 — 실제는 서버에서)
const DEMO_COUPONS = {
  "CHUNGI10": {type:"percent", value:10, label:"첫 결제 10% 할인"},
  "FREELOOK": {type:"free",    value:0,  label:"무료 관상짤 쿠폰"},
  "VIP500":   {type:"fixed",   value:500,label:"⭐ 별 등급 500원 할인"},
};

function PayStepComp({price,onPay,onBack,loading}){
  const[m,setM]=useState("kakao");
  const[showCoupon,setShowCoupon]=useState(false);
  const[couponCode,setCouponCode]=useState("");
  const[appliedCoupon,setAppliedCoupon]=useState(null);
  const[couponErr,setCouponErr]=useState("");

  const origPrice = parseInt(String(price).replace(/[^0-9]/g,""))||0;
  const discountAmt = appliedCoupon
    ? appliedCoupon.type==="percent" ? Math.floor(origPrice*(appliedCoupon.value/100))
    : appliedCoupon.type==="fixed"   ? appliedCoupon.value
    : origPrice  // free
    : 0;
  const finalPrice = Math.max(0, origPrice - discountAmt);
  const isFree = finalPrice === 0;

  function applyCoupon(){
    const c = DEMO_COUPONS[couponCode.trim().toUpperCase()];
    if(c){
      setAppliedCoupon(c);
      setCouponErr("");
    } else {
      setCouponErr("유효하지 않은 쿠폰 번호예요");
      setAppliedCoupon(null);
    }
  }

  return(
    <>
      {/* 가격 박스 */}
      <div className="price-box">
        <div className="pr"><span>이용권</span><span>{price}</span></div>
        {appliedCoupon&&<div className="pr" style={{color:"var(--jade)"}}>
          <span>🎁 {appliedCoupon.label}</span>
          <span>-{discountAmt.toLocaleString()}원</span>
        </div>}
        <div className="pr tot">
          <span>결제금액</span>
          <span>{isFree?"무료 🎉":`${finalPrice.toLocaleString()}원`}</span>
        </div>
      </div>

      {/* 쿠폰 입력 */}
      {!appliedCoupon?(
        !showCoupon
          ?<button style={{width:"100%",padding:"10px",background:"transparent",border:"1px dashed rgba(232,200,122,0.2)",borderRadius:12,color:"rgba(200,196,216,0.5)",fontFamily:"inherit",fontSize:12,cursor:"pointer",marginBottom:12}} onClick={()=>setShowCoupon(true)}>
            🎁 쿠폰 번호가 있어요
          </button>
          :<div style={{marginBottom:12}}>
            <div style={{display:"flex",gap:8}}>
              <input className="inp" style={{marginBottom:0,flex:1,borderColor:couponErr?"rgba(244,124,90,0.5)":""}}
                placeholder="쿠폰 번호 입력 (예: CHUNGI10)"
                value={couponCode} onChange={e=>setCouponCode(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&applyCoupon()}/>
              <button style={{padding:"10px 14px",background:"var(--ink3)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:11,color:"var(--gold)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}} onClick={applyCoupon}>
                적용
              </button>
            </div>
            {couponErr&&<div style={{fontSize:11,color:"var(--coral)",marginTop:5}}>⚠️ {couponErr}</div>}
          </div>
      ):(
        <div style={{background:"rgba(95,196,158,0.08)",border:"1px solid rgba(95,196,158,0.2)",borderRadius:12,padding:"10px 13px",marginBottom:12,display:"flex",alignItems:"center",justify:"space-between"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--jade)"}}>✓ 쿠폰 적용됨</div>
            <div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>{appliedCoupon.label}</div>
          </div>
          <button style={{background:"none",border:"none",color:"rgba(200,196,216,0.3)",cursor:"pointer",fontSize:18,padding:4}} onClick={()=>{setAppliedCoupon(null);setCouponCode("");setShowCoupon(false);}}>✕</button>
        </div>
      )}

      {/* 결제 수단 — 무료면 숨김 */}
      {!isFree&&<div className="pay-list">
        {[{id:"kakao",ic:"🟡",name:"카카오페이",desc:"원터치 간편결제"},{id:"naver",ic:"💚",name:"네이버페이",desc:"포인트 적립"},{id:"phone",ic:"📱",name:"핸드폰 결제",desc:"통신사 결제"}].map(p=>(
          <div key={p.id} className={`pay-opt${m===p.id?" on":""}`} onClick={()=>setM(p.id)}>
            <div className="pay-l"><span style={{fontSize:20}}>{p.ic}</span><div><div className="pay-name">{p.name}</div><div className="pay-desc">{p.desc}</div></div></div>
            <div className={`radio${m===p.id?" on":""}`}/>
          </div>
        ))}
      </div>}

      {loading?<Dots/>:<button className="btn btn-p" onClick={()=>onPay(m)}>
        {isFree?"무료로 결과 보기 🎉":`${finalPrice.toLocaleString()}원 결제하고 결과 보기 ✨`}
      </button>}
      <button className="btn btn-g" onClick={onBack}>이전으로</button>
      <p style={{textAlign:"center",fontSize:10,color:"rgba(200,196,216,0.25)",marginTop:10}}>결제 후 무한 이용 · 7일 이내 환불</p>
    </>
  );
}

function GoodsRecSection({svcId, ctx={}, cart, setCart, onGoShop, title, sub}){
  const recs = getGoodsRec(svcId, ctx);
  if(recs.length===0) return null;

  function addCart(item){
    setCart(prev=>{
      const ex=prev.find(c=>c.id===item.id);
      return ex?prev.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...prev,{...item,qty:1}];
    });
  }

  return(
    <div className="goods-rec">
      <div className="goods-rec-header">
        <span className="goods-rec-title">🛍️ {title||"맞춤 굿즈 추천"}</span>
        <span className="goods-rec-see-all" onClick={onGoShop}>전체 보기 →</span>
      </div>
      <div className="goods-rec-sub">{sub||"이 결과에 어울리는 기운 강화 아이템"}</div>
      <div className="goods-rec-scroll">
        {recs.map(g=>(
          <div key={g.id} className="goods-mini-card">
            <div className="goods-mini-img" style={{background:g.color||"var(--ink3)"}}>{g.icon}</div>
            <div className="goods-mini-info">
              <div className="goods-mini-name">{g.name}</div>
              <div className="goods-mini-price">{g.price.toLocaleString()}원</div>
            </div>
            <button className="goods-mini-add" onClick={()=>addCart(g)}>+ 담기</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayDonePopup({svc, ctx={}, cart, setCart, onClose, onGoShop}){
  const recs = getGoodsRec(svc.id, ctx);
  const [added, setAdded] = useState({});

  function addCart(item){
    setCart(prev=>{const ex=prev.find(c=>c.id===item.id);return ex?prev.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...prev,{...item,qty:1}];});
    setAdded(prev=>({...prev,[item.id]:true}));
  }

  // 결과 기반 추천 이유 텍스트
  const reasonText = (() => {
    if(ctx.ohaeng) return `<strong>${OHAENG[ctx.ohaeng]?.label} 기운이 부족</strong>한 사주예요. 아래 아이템이 기운 보완에 도움이 됩니다.`;
    if(ctx.ytype)  return `<strong>${ctx.ytype}형</strong>의 에너지를 강화하는 아이템을 추천드려요.`;
    if(ctx.ddi)    return `<strong>${ctx.ddi}띠</strong>에게 어울리는 수호 아이템이에요.`;
    if(ctx.blood)  return `<strong>${ctx.blood}형</strong> 에너지를 높이는 맞춤 아이템이에요.`;
    if(ctx.zodiac) return `<strong>${ctx.zodiac}</strong>의 수호석 기반 추천 아이템이에요.`;
    return "이 결과에 어울리는 <strong>개운 아이템</strong>을 추천드려요.";
  })();

  return(
    <div className="pay-done-ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="pay-done-md">
        <div className="hd"/>
        <div className="pdc-icon">✨</div>
        <div className="pdc-title">결제 완료!</div>
        <div className="pdc-sub">
          {svc.name} 분석이 완료됐어요.<br/>
          결과에 맞는 개운 굿즈도 확인해보세요 🛍️
        </div>

        {/* 추천 이유 */}
        <div className="pdc-reason" dangerouslySetInnerHTML={{__html:reasonText}}/>

        {/* 추천 굿즈 */}
        <div className="pdc-section-title">✦ 이 결과에 어울리는 굿즈</div>
        <div className="pdc-goods-row">
          {recs.map(g=>(
            <div key={g.id} className="pdc-goods-item">
              <div className="pdc-goods-img" style={{background:g.color||"var(--ink3)"}}>{g.icon}</div>
              <div className="pdc-goods-info">
                <div className="pdc-goods-name">{g.name}</div>
                <div className="pdc-goods-price">{g.price.toLocaleString()}원</div>
              </div>
              <button
                style={{width:"100%",padding:"7px",border:"none",background:added[g.id]?"rgba(95,196,158,0.2)":"rgba(232,200,122,0.15)",color:added[g.id]?"var(--jade)":"var(--gold)",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",borderTop:"1px solid rgba(232,200,122,0.1)"}}
                onClick={()=>addCart(g)}
              >
                {added[g.id]?"✓ 담김":"+ 장바구니"}
              </button>
            </div>
          ))}
        </div>

        {Object.keys(added).length>0 && (
          <div style={{background:"rgba(95,196,158,0.1)",border:"1px solid rgba(95,196,158,0.2)",borderRadius:12,padding:"10px 13px",marginTop:12,fontSize:12,color:"var(--jade)",fontWeight:700,textAlign:"center"}}>
            🛒 {Object.keys(added).length}개 담겼어요! 굿즈샵에서 결제하세요.
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:16}}>
          <button className="btn btn-g btn-sm" onClick={onClose} style={{margin:0}}>결과 보기</button>
          <button className="btn btn-p btn-sm" onClick={onGoShop}>굿즈샵 가기</button>
        </div>
      </div>
    </div>
  );
}

function PawdongModal({onClose, cart, setCart, onGoShop, addHistory, isLoggedIn}){
  const[step,setStep]=useState("intro"); // intro → input → pay → result
  const[form,setForm]=useState({name:"",year:"",month:"",day:"",hour:""});
  const[loading,setLoading]=useState(false);

  const JAMO_OHAENG={
    "ㄱ":"목(木)","ㅋ":"목(木)",
    "ㄴ":"화(火)","ㄷ":"화(火)","ㄹ":"화(火)","ㅌ":"화(火)",
    "ㅇ":"토(土)","ㅎ":"토(土)",
    "ㅅ":"금(金)","ㅈ":"금(金)","ㅊ":"금(金)",
    "ㅁ":"수(水)","ㅂ":"수(水)","ㅍ":"수(水)",
  };
  const OHAENG_COLOR={"목(木)":"var(--jade)","화(火)":"var(--coral)","토(土)":"#C8834A","금(金)":"var(--gold)","수(水)":"var(--violet)"};

  function analyze(){
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setStep("result");
      addHistory({icon:"🌊",name:"파동 성명학",person:form.name||"나",date:new Date().toLocaleDateString("ko-KR"),ctx:{ohaeng:"목"}});
    },2200);
  }

  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>

        {/* 진입 설명 화면 */}
        {step==="intro"&&<>
          <div className="mt">🌊 파동 성명학</div>
          <div style={{background:"rgba(155,143,212,0.08)",border:"1px solid rgba(155,143,212,0.18)",borderRadius:16,padding:"16px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--violet)",marginBottom:10}}>✦ 왜 한글 이름의 파동이 중요할까요?</div>
            <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.8}}>
              한국에서는 이름을 지을 때 한자 뜻에 집중합니다.<br/>
              하지만 실제로 우리가 매일 부르는 건 <strong style={{color:"var(--white)"}}>한글 발음</strong>이에요.<br/><br/>
              누군가 내 이름을 부를 때마다,<br/>
              그 자음이 만들어내는 <strong style={{color:"var(--gold)"}}>오행 파동</strong>이<br/>
              나의 기운에 영향을 줍니다.<br/><br/>
              <strong style={{color:"var(--white)"}}>이름·닉네임·회사명</strong> 모두 해당돼요.
            </div>
          </div>
          <div style={{background:"var(--ink3)",borderRadius:14,padding:"14px",marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--gold)",marginBottom:10}}>✦ 자음 오행 원리</div>
            {[
              {jamo:"ㄱ, ㅋ",ohaeng:"목(木)",color:"var(--jade)",   desc:"성장·창의·도전"},
              {jamo:"ㄴ,ㄷ,ㄹ,ㅌ",ohaeng:"화(火)",color:"var(--coral)", desc:"열정·빠름·표현"},
              {jamo:"ㅇ, ㅎ",ohaeng:"토(土)",color:"#C8834A",       desc:"안정·신뢰·중심"},
              {jamo:"ㅅ,ㅈ,ㅊ",ohaeng:"금(金)",color:"var(--gold)",  desc:"결단·날카로움·재물"},
              {jamo:"ㅁ,ㅂ,ㅍ",ohaeng:"수(水)",color:"var(--violet)",desc:"지혜·감성·깊이"},
            ].map(r=>(
              <div key={r.jamo} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:13,fontWeight:900,color:r.color,minWidth:52}}>{r.jamo}</div>
                <div style={{fontSize:12,fontWeight:700,color:r.color,minWidth:56}}>{r.ohaeng}</div>
                <div style={{fontSize:11,color:"var(--mist)"}}>{r.desc}</div>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:14,padding:"12px 14px",marginBottom:14,fontSize:12,color:"var(--mist)",lineHeight:1.7}}>
            💡 <strong style={{color:"var(--gold)"}}>이름 구조:</strong><br/>
            첫째 자리(성) → 뿌리·조상<br/>
            둘째 자리 → 현재·사회운<br/>
            셋째 자리 → 말년·결실<br/>
            받침 없음 → 기운이 막힘 없이 흐름
          </div>
          <button className="btn btn-p" onClick={()=>setStep("input")}>내 이름 파동 분석하기 →</button>
          <button className="btn btn-g" onClick={onClose}>닫기</button>
        </>}

        {/* 입력 화면 */}
        {step==="input"&&<>
          <div className="mt">🌊 이름 입력</div>
          <div className="ms">현재 이름·닉네임·회사명 모두 분석 가능해요</div>
          <label className="lbl">분석할 이름</label>
          <input className="inp" placeholder="홍길동 / 천기 / 닉네임" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <label className="lbl">생년월일</label>
          <div className="row2">
            <input className="inp" placeholder="1988 (년)" style={{marginBottom:0}} value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/>
            <input className="inp" placeholder="08 (월)" style={{marginBottom:0}} value={form.month} onChange={e=>setForm({...form,month:e.target.value})}/>
          </div>
          <div className="row2" style={{marginTop:8}}>
            <input className="inp" placeholder="22 (일)" style={{marginBottom:0}} value={form.day} onChange={e=>setForm({...form,day:e.target.value})}/>
            <input className="inp" placeholder="01 (시)" style={{marginBottom:0}} value={form.hour} onChange={e=>setForm({...form,hour:e.target.value})}/>
          </div>
          <div style={{fontSize:10,color:"rgba(200,196,216,0.3)",marginTop:4,marginBottom:12}}>태어난 시간을 알면 더 정확해요 (모르면 비워도 됩니다)</div>
          <button className="btn btn-p" style={{marginTop:4}} onClick={()=>setStep("pay")}>다음 — 결제하기</button>
          <button className="btn btn-g" onClick={()=>setStep("intro")}>설명 다시보기</button>
        </>}

        {/* 결제 화면 */}
        {step==="pay"&&<>
          <div className="mt">결제하기</div>
          <div className="price-box">
            <div className="pr"><span>파동 성명학 분석</span><span>4,800원</span></div>
            <div className="pr tot"><span>결제금액</span><span>4,800원</span></div>
          </div>
          <div className="pay-list">
            {[{id:"kakao",ic:"🟡",name:"카카오페이",desc:"원터치 간편결제"},{id:"naver",ic:"💚",name:"네이버페이",desc:"포인트 적립"},{id:"phone",ic:"📱",name:"핸드폰 결제",desc:"통신사 결제"}].map(p=>(
              <div key={p.id} className="pay-opt"><div className="pay-l"><span style={{fontSize:20}}>{p.ic}</span><div><div className="pay-name">{p.name}</div><div className="pay-desc">{p.desc}</div></div></div><div className="radio"/></div>
            ))}
          </div>
          {loading?<Dots/>:<button className="btn btn-p" onClick={analyze}>4,800원 결제하고 결과 보기 ✨</button>}
          <button className="btn btn-g" onClick={()=>setStep("input")}>이전으로</button>
        </>}

        {/* 결과 화면 */}
        {step==="result"&&<>
          <div className="mt">🌊 파동 성명학 결과</div>
          <div style={{background:"linear-gradient(135deg,rgba(155,143,212,0.12),rgba(232,200,122,0.07))",border:"1px solid rgba(155,143,212,0.2)",borderRadius:18,padding:"18px",marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:900,letterSpacing:"8px",color:"var(--gold2)",marginBottom:8}}>{form.name||"윤규미"}</div>
            <div style={{display:"flex",justifyContent:"center",gap:12}}>
              {(form.name||"윤규미").split("").map((char,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:900}}>{char}</div>
                  <div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>
                    {i===0?"뿌리":i===1?"현재":"말년"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="res-card">
            <div className="res-lbl">▸ 사주 오행 현황</div>
            {[["목(木)","▓▓░░░","부족","var(--jade)"],["화(火)","▓▓▓░░","보통","var(--coral)"],["토(土)","▓▓▓▓░","충분","#C8834A"],["금(金)","▓░░░░","매우 부족","var(--gold)"],["수(水)","▓▓▓▓▓","넘침","var(--violet)"]].map(([name,bar,status,color])=>(
              <div key={name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{fontSize:11,fontWeight:700,color,minWidth:52}}>{name}</div>
                <div style={{fontSize:12,letterSpacing:2,color}}>{bar}</div>
                <div style={{fontSize:10,color:"var(--mist)"}}>{status}</div>
              </div>
            ))}
          </div>
          <div className="res-card">
            <div className="res-lbl">▸ 이름 파동 분석</div>
            <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.8}}>
              사주에 <strong style={{color:"var(--jade)"}}>목(木)</strong> 기운이 부족하여<br/>
              둘째 자리에 <strong style={{color:"var(--jade)"}}>ㄱ, ㅋ</strong>(목 자음)을 배치했어요.<br/>
              말년 <strong style={{color:"var(--violet)"}}>수(水)</strong> 기운으로 지혜와 감성을 더했습니다.
            </div>
          </div>
          <div className="res-card">
            <div className="res-lbl">▸ 받침 원칙</div>
            <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.8}}>
              이 사주는 <strong style={{color:"var(--white)"}}>받침 없는 이름</strong>이 좋아요.<br/>
              받침이 있으면 기운이 막혀 흐름이 답답해질 수 있어요.
            </div>
          </div>
          <div className="res-card">
            <div className="res-lbl">▸ 추천 자음 조합 (참고용)</div>
            <div style={{fontSize:11,color:"var(--mist)",marginBottom:8,lineHeight:1.7}}>
              둘째: <strong style={{color:"var(--jade)"}}>ㄱ, ㅋ</strong> 중 선택<br/>
              셋째: <strong style={{color:"var(--violet)"}}>ㅁ, ㅂ, ㅍ</strong> 중 선택<br/>
              받침: 없는 것 권장
            </div>
            <div style={{fontSize:10,color:"rgba(200,196,216,0.35)"}}>이 원리 안에서 원하는 이름을 직접 결정하세요!</div>
          </div>
          <GoodsRecSection svcId="pawdong" ctx={{ohaeng:"목"}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="부족한 오행 보완 굿즈" sub="목(木) 기운을 보완하는 아이템"/>
          <ShareRow isLoggedIn={isLoggedIn}/>
          <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        </>}
      </div>
    </div>
  );
}

function SvcModal({svc, onClose, isLoggedIn, cart, setCart, onGoShop, addHistory}){
  const[step,setStep]=useState(isLoggedIn||svc.free?"input":"auth");
  const[loading,setLoading]=useState(false);
  const[form,setForm]=useState({name:"",year:"",month:"",day:""});
  const[ctx,setCtx]=useState({ohaeng:"화", number:7}); // 분석 결과 컨텍스트
  const[showPayDone,setShowPayDone]=useState(false);
  const fileRef=useRef();const[imgSrc,setImgSrc]=useState(null);
  const isFree=svc.free||svc.price==="무료";
  const isPhoto=["gwansang_full","palmistry","footreading","celeb_look"].includes(svc.id);

  function doAnalyze(){
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setStep("result");
      addHistory({icon:svc.icon,name:svc.name,person:form.name||"나",date:new Date().toLocaleDateString("ko-KR"),ctx});
    },2000);
  }
  function onPay(){
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setShowPayDone(true); // 결제 완료 팝업 먼저!
    },1800);
  }

  return(
    <>
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md">
        <div className="hd"/>
        {step==="auth"&&<>
          <div className="mt">로그인 후 이용 가능해요</div>
          <div className="ms">카카오 또는 구글로 1초 로그인!</div>
          <button className="social-btn kakao" onClick={()=>setStep("input")}>🟡 카카오로 시작하기</button>
          <button className="social-btn google" onClick={()=>setStep("input")}>🔵 구글로 시작하기</button>
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}

        {step==="input"&&<>
          <div className="mt">{svc.icon} {svc.name}</div>
          <div className="ms">{svc.desc}{isFree?" · 무료":""}</div>
          {isPhoto&&<div className="upzone" onClick={()=>fileRef.current.click()}>
            {imgSrc?<img src={imgSrc} className="prev-img" alt=""/>:<><div style={{fontSize:34,marginBottom:7}}>📸</div><div style={{fontSize:13,fontWeight:700,marginBottom:3}}>사진을 올려주세요</div><div style={{fontSize:11,color:"var(--mist)"}}>JPG/PNG</div></>}
            <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)setImgSrc(URL.createObjectURL(f));}}/>
          </div>}
          {!isPhoto&&<>
            <label className="lbl">이름</label>
            <input className="inp" placeholder="홍길동" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <label className="lbl">생년월일</label>
            <div className="row2">
              <input className="inp" placeholder="1998 (년)" style={{marginBottom:0}} value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/>
              <input className="inp" placeholder="03 (월)"   style={{marginBottom:0}} value={form.month} onChange={e=>setForm({...form,month:e.target.value})}/>
            </div>
            <input className="inp" placeholder="15 (일)" style={{marginTop:8}} value={form.day} onChange={e=>setForm({...form,day:e.target.value})}/>
          </>}
          {isFree
            ?loading?<Dots/>:<button className="btn btn-p" style={{marginTop:8}} onClick={doAnalyze}>무료 결과 보기 →</button>
            :<button className="btn btn-p" style={{marginTop:8}} onClick={()=>setStep("pay")}>다음 — 결제하기</button>
          }
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}

        {step==="pay"&&<>
          <div className="mt">결제하기</div>
          <div className="ms">안전하게 처리됩니다</div>
          <PayStepComp price={svc.price} onPay={onPay} onBack={()=>setStep("input")} loading={loading}/>
        </>}

        {step==="result"&&<>
          <div className="succ"><div className="succ-icon">✨</div><div className="succ-title">분석 완료!</div><div className="succ-sub">{form.name||"당신"}의 {svc.name}</div></div>
          <div className="res-card"><div className="res-lbl">▸ 핵심 분석</div><div className="res-val">목(木) 기운이 강한 일간으로 창의적이고 성장 지향적 성향입니다. 2026년 하반기부터 결정적인 기회가 열립니다.</div></div>
          <div className="res-card">
            <div className="res-lbl">▸ 오행 보완</div>
            <div className="res-val" style={{marginBottom:8}}>화(火) 기운이 부족합니다. 빨간색 아이템을 지니면 도움이 돼요.</div>
            <div className="tag-row"><span className="tag tc">🔴 화(火) 보완 필요</span><span className="tag tg">빨간 아이템 추천</span></div>
          </div>

          {/* ① 결과 하단 굿즈 자동 노출 */}
          <GoodsRecSection
            svcId={svc.id}
            ctx={ctx}
            cart={cart}
            setCart={setCart}
            onGoShop={()=>{onClose();onGoShop();}}
            title="이 결과 맞춤 굿즈"
            sub={`화(火) 기운 보완에 좋은 아이템`}
          />

          <ShareRow isLoggedIn={isLoggedIn}/>
          <button className="btn btn-p" onClick={onClose}>확인 완료</button>
          <button className="btn btn-g" onClick={()=>{onClose();onGoShop();}}>굿즈샵 전체 보기 →</button>
        </>}
      </div>
    </div>

    {/* ③ 결제 완료 팝업 */}
    {showPayDone&&(
      <PayDonePopup
        svc={svc}
        ctx={ctx}
        cart={cart}
        setCart={setCart}
        onClose={()=>{setShowPayDone(false);setStep("result");doAnalyze();}}
        onGoShop={()=>{setShowPayDone(false);onClose();onGoShop();}}
      />
    )}
    </>
  );
}

function DdiModal({onClose,cart,setCart,onGoShop,addHistory}){
  const[sel,setSel]=useState(null);const[step,setStep]=useState("pick");const[loading,setLoading]=useState(false);
  function analyze(){setLoading(true);setTimeout(()=>{setLoading(false);setStep("result");addHistory({icon:"🐯",name:"띠별 운세",person:"나",date:new Date().toLocaleDateString("ko-KR"),ctx:{ddi:sel,ohaeng:DDIS.find(d=>d.id===sel)?.ohaeng}});},1500);}
  const d=DDIS.find(d=>d.id===sel);
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        {step==="pick"&&<>
          <div className="mt">🐯 띠별 운세</div>
          <div className="ms">내 띠를 선택해주세요 · 무료</div>
          <div className="ddi-grid">{DDIS.map(d=>(
            <div key={d.id} className={`ddi-item${sel===d.id?" sel":""}`} onClick={()=>setSel(d.id)}>
              <div style={{fontSize:22,marginBottom:4}}>{d.emoji}</div>
              <div style={{fontSize:10,fontWeight:700}}>{d.id}띠</div>
              <div style={{fontSize:9,color:"var(--mist)",marginTop:1}}>{d.year}</div>
            </div>
          ))}</div>
          {loading?<Dots/>:<button className="btn btn-p" onClick={analyze} disabled={!sel}>운세 보기 (무료)</button>}
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}
        {step==="result"&&d&&<>
          <div className="succ"><div className="succ-icon">{d.emoji}</div><div className="succ-title">{d.id}띠 운세</div></div>
          <div className="res-card"><div className="res-lbl">▸ 2026년 총운</div><div className="res-val">{d.id}띠는 올해 변화의 기운이 강합니다. 하반기부터 결실을 맺는 해입니다.</div></div>
          <div className="res-card"><div className="res-lbl">▸ 오행 연결</div><div className="tag-row"><span className="tag tg">{OHAENG[d.ohaeng]?.emoji} {OHAENG[d.ohaeng]?.label}</span></div></div>
          <GoodsRecSection svcId="ddi" ctx={{ddi:d.id,ohaeng:d.ohaeng}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title={`${d.id}띠 맞춤 굿즈`} sub={`${d.id}띠 수호 + ${OHAENG[d.ohaeng]?.label} 기운 보완`}/>
          <ShareRow/>
          <button className="btn btn-p" onClick={onClose}>확인</button>
        </>}
      </div>
    </div>
  );
}

function ZodiacModal({onClose,cart,setCart,onGoShop,addHistory}){
  const[sel,setSel]=useState(null);const[step,setStep]=useState("pick");const[loading,setLoading]=useState(false);
  function analyze(){setLoading(true);setTimeout(()=>{setLoading(false);setStep("result");addHistory({icon:"⭐",name:"별자리 운세",person:"나",date:new Date().toLocaleDateString("ko-KR"),ctx:{zodiac:sel}});},1500);}
  const z=ZODIACS.find(z=>z.id===sel);
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        {step==="pick"&&<>
          <div className="mt">⭐ 별자리 운세</div>
          <div className="ms">내 별자리를 선택해주세요 · 무료</div>
          <div className="zodiac-grid">{ZODIACS.map(z=>(
            <div key={z.id} className={`zc-item${sel===z.id?" sel":""}`} onClick={()=>setSel(z.id)}>
              <div style={{fontSize:20,marginBottom:4}}>{z.icon}</div>
              <div style={{fontSize:10,fontWeight:700}}>{z.id.replace("자리","").replace("자리","")}</div>
              <div style={{fontSize:9,color:"var(--mist)",marginTop:1}}>{z.date}</div>
            </div>
          ))}</div>
          {loading?<Dots/>:<button className="btn btn-p" onClick={analyze} disabled={!sel}>오늘 운세 보기 (무료)</button>}
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}
        {step==="result"&&z&&<>
          <div className="succ"><div className="succ-icon">{z.icon}</div><div className="succ-title">{z.id}</div><div className="succ-sub">수호석: {z.stone}</div></div>
          <div className="res-card"><div className="res-lbl">▸ 오늘의 {z.id}</div><div className="res-val">오늘은 {z.id}에게 새로운 시작의 기운이 강하게 흐릅니다.</div></div>
          <GoodsRecSection svcId="zodiac" ctx={{zodiac:z.id}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title={`${z.id} 전용 굿즈`} sub={`${z.stone} 수호석 기반 아이템`}/>
          <ShareRow/>
          <button className="btn btn-p" onClick={onClose}>확인</button>
        </>}
      </div>
    </div>
  );
}

function BloodModal({onClose,cart,setCart,onGoShop,addHistory}){
  const[sel,setSel]=useState(null);const[step,setStep]=useState("pick");const[loading,setLoading]=useState(false);
  function analyze(){setLoading(true);setTimeout(()=>{setLoading(false);setStep("result");addHistory({icon:"🩸",name:"혈액형 운세",person:"나",date:new Date().toLocaleDateString("ko-KR"),ctx:{blood:sel}});},1200);}
  const b=BLOODS.find(b=>b.type===sel);
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        {step==="pick"&&<>
          <div className="mt">🩸 혈액형 운세</div>
          <div className="ms">내 혈액형을 선택해주세요 · 무료</div>
          <div className="blood-grid">{BLOODS.map(b=>(
            <div key={b.type} className={`blood-item${sel===b.type?" sel":""}`} onClick={()=>setSel(b.type)}>
              <div style={{fontSize:24,fontWeight:900,color:b.color,marginBottom:4}}>{b.type}형</div>
              <div style={{fontSize:9,color:"var(--mist)"}}>{b.trait}</div>
            </div>
          ))}</div>
          {loading?<Dots/>:<button className="btn btn-p" onClick={analyze} disabled={!sel}>오늘 운세 보기 (무료)</button>}
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}
        {step==="result"&&b&&<>
          <div className="succ"><div className="succ-icon">🩸</div><div className="succ-title">{b.type}형 오늘 운세</div></div>
          <div className="res-card"><div className="res-lbl">▸ {b.type}형 특성</div><div className="res-val">{b.trait} 성향으로 오늘 이 특성이 빛을 발합니다.</div></div>
          <GoodsRecSection svcId="blood" ctx={{blood:b.type}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title={`${b.type}형 맞춤 굿즈`} sub={`${b.type}형 에너지를 높이는 아이템`}/>
          <ShareRow/>
          <button className="btn btn-p" onClick={onClose}>확인</button>
        </>}
      </div>
    </div>
  );
}

function YtypeModal({onClose,cart,setCart,onGoShop,addHistory}){
  const[step,setStep]=useState("input");const[form,setForm]=useState({name:"",year:"",month:"",day:""});const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);
  function analyze(){setLoading(true);setTimeout(()=>{const r=TWELVE_TYPES[Math.floor(Math.random()*TWELVE_TYPES.length)];setResult(r);setLoading(false);setStep("result");addHistory({icon:r.icon,name:"12수호신",person:form.name||"나",date:new Date().toLocaleDateString("ko-KR"),ctx:{ytype:r.id,ohaeng:"화"}});},2000);}
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        {step==="input"&&<>
          <div className="mt">🐉 12수호신 (十二守護神)</div>
          <div className="ms">사주 기반 나의 수호 영수 · 무료</div>
          <div className="ytype-grid">{TWELVE_TYPES.map(t=><div key={t.id} className="ytype-item"><div style={{fontSize:20,marginBottom:3}}>{t.icon}</div><div style={{fontSize:10,fontWeight:700}}>{t.id}형</div></div>)}</div>
          <label className="lbl">이름</label><input className="inp" placeholder="홍길동" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <label className="lbl">생년월일</label>
          <div className="row2"><input className="inp" placeholder="1998 (년)" style={{marginBottom:0}} value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/><input className="inp" placeholder="03 (월)" style={{marginBottom:0}} value={form.month} onChange={e=>setForm({...form,month:e.target.value})}/></div>
          <input className="inp" placeholder="15 (일)" style={{marginTop:8}} value={form.day} onChange={e=>setForm({...form,day:e.target.value})}/>
          {loading?<Dots/>:<button className="btn btn-p" style={{marginTop:4}} onClick={analyze}>내 수호신 알아보기 (무료)</button>}
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}
        {step==="result"&&result&&<>
          <div className="succ"><div className="succ-icon">{result.icon}</div><div className="succ-title">{form.name||"당신"}은 {result.id}형!</div></div>
          <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.1),rgba(155,143,212,0.07))",border:"1px solid rgba(232,200,122,0.15)",borderRadius:18,padding:"18px",textAlign:"center",marginBottom:12}}>
            <div style={{fontSize:50,marginBottom:8}}>{result.icon}</div>
            <div style={{fontSize:20,fontWeight:900,color:"var(--gold2)",marginBottom:2}}>{result.id}형 (型)</div>
            <div style={{fontSize:12,color:"var(--mist)",marginBottom:8}}>{result.hanja} · 十二靈獸</div>
            <div style={{fontSize:13,color:"var(--mist)",lineHeight:1.7}}>{result.desc}</div>
            <div className="tag-row" style={{justifyContent:"center",marginTop:8}}>{result.tags.map(t=><span key={t} className="tag tg">{t}</span>)}</div>
          </div>
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:13,padding:"13px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--gold)",marginBottom:5}}>상세 분석 받기</div>
            <div style={{fontSize:11,color:"var(--mist)",marginBottom:8}}>{result.id}형 재물·연애·직업·2026 종합 — 980원</div>
            <button className="btn btn-p btn-sm">종합 리포트 980원</button>
          </div>
          {/* 결과 하단 굿즈 */}
          <GoodsRecSection svcId="ytype" ctx={{ytype:result.id,ohaeng:"화"}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title={`${result.id}형 전용 굿즈`} sub={`${result.id}형 기운을 강화하는 아이템`}/>
          <ShareRow/>
          <button className="btn btn-g" onClick={onClose}>확인</button>
        </>}
      </div>
    </div>
  );
}

function GwansangZalModal({onClose,savedPersons,setSavedPersons,cart,setCart,onGoShop,addHistory}){
  const[step,setStep]=useState("upload");const[imgSrc,setImgSrc]=useState(null);const[personName,setPersonName]=useState("");const[loading,setLoading]=useState(false);const[showPayDone,setShowPayDone]=useState(false);
  const fileRef=useRef();const isFirst=savedPersons.length===0;
  function analyze(){if(!isFirst){setStep("pay");return;}setLoading(true);setTimeout(()=>{setLoading(false);setStep("result");addHistory({icon:"🪞",name:"관상짤",person:personName||"분석",date:new Date().toLocaleDateString("ko-KR"),ctx:{ohaeng:"화"}});},1800);}
  function pay(){setLoading(true);setTimeout(()=>{setLoading(false);setShowPayDone(true);},1600);}
  function saveResult(){if(personName.trim())setSavedPersons(prev=>[...prev,{name:personName,date:new Date().toLocaleDateString("ko-KR"),icon:"👤"}]);onClose();}

  return(
    <>
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        {step==="upload"&&<>
          <div className="mt">🪞 관상짤</div>
          <div className="ms">사진 한 장으로 관상 분석{isFirst?" · 처음 무료!":""}</div>
          {savedPersons.length>0&&<>{savedPersons.map((p,i)=><div key={i} className="person-card" onClick={()=>{setPersonName(p.name);setStep("result");}}>
            <div className="person-avatar">{p.icon}</div>
            <div><div style={{fontSize:13,fontWeight:700}}>{p.name}</div><div style={{fontSize:10,color:"var(--mist)"}}>재분석 무료</div></div>
            <span style={{marginLeft:"auto",fontSize:11,color:"var(--jade)"}}>무료</span>
          </div>)}<div style={{fontSize:11,color:"var(--mist)",textAlign:"center",margin:"6px 0 12px"}}>또는 새 인물 분석</div></>}
          <div className="upzone" onClick={()=>fileRef.current.click()}>
            {imgSrc?<img src={imgSrc} className="prev-img" alt=""/>:<><div style={{fontSize:36,marginBottom:8}}>📸</div><div style={{fontSize:13,fontWeight:700,marginBottom:3}}>사진을 올려주세요</div><div style={{fontSize:11,color:"var(--mist)"}}>정면 얼굴 권장</div></>}
            <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)setImgSrc(URL.createObjectURL(f));}}/>
          </div>
          {isFirst&&<div style={{background:"rgba(95,196,158,0.08)",border:"1px solid rgba(95,196,158,0.2)",borderRadius:12,padding:"10px 13px",fontSize:12,color:"var(--jade)",marginBottom:14}}>🎁 처음 무료! 이후 인물당 380원</div>}
          {loading?<Dots/>:<button className="btn btn-p" onClick={analyze} disabled={!imgSrc}>{isFirst?"무료 관상 분석 →":"분석하기 →"}</button>}
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}

        {step==="pay"&&<><div className="mt">새 인물 분석</div><div className="ms">인물 1명당 380원 · 저장 후 재분석 무료</div><PayStepComp price="380원" onPay={pay} onBack={()=>setStep("upload")} loading={loading}/></>}

        {step==="result"&&<>
          <div className="succ"><div className="succ-icon">🪞</div><div className="succ-title">{personName||"이 분"}의 관상</div></div>
          {[{ic:"😏",t:"도화살 농후",d:"이 얼굴, 이성이 그냥 못 지나쳐요 👀"},{ic:"💰",t:"재물복 있음, 지출도 빠름",d:"버는 만큼 나갑니다. 저축 습관이 중요!"},{ic:"⚡",t:"추진력 갑, 급한 성격 주의",d:"충동적 결정을 조심하세요."},{ic:"🌟",t:"사회운 탄탄",d:"30대가 피크. 인맥 관리가 미래를 결정합니다."}].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"12px 14px",background:"var(--ink3)",borderRadius:14,marginBottom:8,border:"1px solid rgba(255,255,255,0.05)"}}>
              <span style={{fontSize:22,flexShrink:0}}>{r.ic}</span>
              <div><div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{r.t}</div><div style={{fontSize:11,color:"var(--mist)",lineHeight:1.5}}>{r.d}</div></div>
            </div>
          ))}
          {/* 결과 하단 굿즈 */}
          <GoodsRecSection svcId="gwansang_zal" ctx={{ohaeng:"화"}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="관상 개운 굿즈" sub="이 관상의 기운을 보완하는 아이템"/>
          {!savedPersons.find(p=>p.name===personName)&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:13,padding:"13px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--gold)",marginBottom:7}}>이 분 저장하면 다음엔 무료 재분석!</div>
            <input className="inp" style={{marginBottom:8}} placeholder="이름/별명 (예: 소개팅남A)" value={personName} onChange={e=>setPersonName(e.target.value)}/>
            <button className="btn btn-p btn-sm" onClick={saveResult}>저장하고 나가기</button>
          </div>}
          <ShareRow/>
          <button className="btn btn-g" onClick={onClose}>확인</button>
        </>}
      </div>
    </div>

    {/* 결제 완료 팝업 */}
    {showPayDone&&(
      <PayDonePopup
        svc={{id:"gwansang_zal",name:"관상짤"}}
        ctx={{ohaeng:"화"}}
        cart={cart} setCart={setCart}
        onClose={()=>{setShowPayDone(false);setStep("result");addHistory({icon:"🪞",name:"관상짤",person:personName||"분석",date:new Date().toLocaleDateString("ko-KR"),ctx:{ohaeng:"화"}});}}
        onGoShop={()=>{setShowPayDone(false);onClose();onGoShop();}}
      />
    )}
    </>
  );
}

function TodayUnseModal({onClose,cart,setCart,onGoShop,isLoggedIn}){
  const bars=[{ic:"💫",lb:"종합운",n:TODAY.운세.overall,c:"var(--gold)"},{ic:"💕",lb:"애정운",n:TODAY.운세.love,c:"var(--blush)"},{ic:"💰",lb:"재물운",n:TODAY.운세.money,c:"var(--jade)"},{ic:"🌿",lb:"건강운",n:TODAY.운세.health,c:"var(--violet)"}];
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div className="succ">
          <div className="succ-icon">🌙</div>
          <div className="succ-title">오늘의 운세</div>
          <div className="succ-sub">{TODAY.date}</div>
          {!isLoggedIn&&<div style={{fontSize:10,color:"rgba(200,196,216,0.4)",marginTop:3}}>공통 운세 · 로그인하면 내 사주 기반으로!</div>}
        </div>
        {bars.map(b=>(
          <div className="res-card" key={b.lb}>
            <div className="res-lbl">▸ {b.ic} {b.lb}</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20,fontWeight:900,color:"var(--gold2)"}}>{b.n}</span>
              <div className="score-bar" style={{flex:1}}><div className="score-fill" style={{width:`${b.n}%`,background:b.c}}/></div>
            </div>
          </div>
        ))}
        <div className="res-card"><div className="res-lbl">▸ 오늘의 메시지</div><div className="res-val">"{TODAY.명언.text}"<br/><br/>오늘은 새로운 시도에 좋은 기운이 흐릅니다.</div></div>

        {/* C방식: 비로그인 업그레이드 CTA */}
        {!isLoggedIn&&(
          <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.1),rgba(155,143,212,0.07))",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"13px 14px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--gold)",marginBottom:4}}>✦ 내 사주 기반 운세로 업그레이드</div>
            <div style={{fontSize:11,color:"var(--mist)",marginBottom:10,lineHeight:1.6}}>
              지금은 공통 운세예요.<br/>로그인하면 내 생년월일 기반<br/><strong style={{color:"var(--white)"}}>개인 맞춤 운세</strong>로 바뀝니다!
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button className="btn btn-p btn-sm" style={{justifyContent:"center"}}>🟡 카카오로 시작</button>
              <button className="btn btn-g btn-sm" style={{justifyContent:"center",marginTop:0}}>🔵 구글로 시작</button>
            </div>
          </div>
        )}
        {isLoggedIn&&<div style={{background:"rgba(95,196,158,0.07)",border:"1px solid rgba(95,196,158,0.15)",borderRadius:12,padding:"9px 13px",marginBottom:12,fontSize:11,color:"var(--jade)"}}>✓ 내 생년월일 기반 개인 운세입니다</div>}

        <GoodsRecSection svcId="default" ctx={{ohaeng:"화"}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="오늘의 개운 굿즈" sub="오늘 기운을 높이는 추천 아이템"/>
        <ShareRow/>
        <button className="btn btn-p" onClick={onClose}>확인</button>
      </div>
    </div>
  );
}

function TodayTarotModal({onClose,cart,setCart,onGoShop}){
  const[flipped,setFlipped]=useState(false);const[loading,setLoading]=useState(false);
  function flip(){setLoading(true);setTimeout(()=>{setLoading(false);setFlipped(true);},1200);}
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div className="mt">🃏 오늘의 타로</div>
        <div className="ms">{TODAY.date} · 무료</div>
        <div style={{display:"flex",justifyContent:"center",margin:"8px 0 18px"}}>
          <div className={`tarot-card${flipped?" flipped":""}`} onClick={!flipped?flip:undefined}>
            {!flipped?<><span style={{fontSize:38}}>🌟</span><span style={{fontSize:11,color:"var(--mist)",marginTop:8}}>탭하여 뽑기</span></>
            :<><span style={{fontSize:44}}>{TODAY.타로.card}</span><span style={{fontSize:11,color:"var(--gold2)",marginTop:8,textAlign:"center",padding:"0 8px"}}>{TODAY.타로.name}</span></>}
          </div>
        </div>
        {loading&&<Dots/>}
        {flipped&&<>
          <div className="res-card"><div className="res-lbl">▸ {TODAY.타로.name}</div><div className="res-val">{TODAY.타로.meaning}</div></div>
          <GoodsRecSection svcId="tarot_today" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="타로 카드 굿즈" sub="타로 에너지를 담은 추천 아이템"/>
          <ShareRow/>
        </>}
        {!flipped&&!loading&&<button className="btn btn-p" onClick={flip}>오늘의 카드 뽑기 ✨</button>}
        <button className="btn btn-g" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

// ─── YES/NO 타로 모달 (무료) ─────────────────────────────────────────────────
// ─── 얼굴점 모달 ─────────────────────────────────────────────────────────────
function MoleModal({onClose,addHistory,cart,setCart,onGoShop,isLoggedIn}){
  const[step,setStep]=useState("choose"); // choose→diagram→photo→pay→result
  const[selected,setSelected]=useState([]);
  const[loading,setLoading]=useState(false);
  const[imgSrc,setImgSrc]=useState(null);
  const fileRef=useRef();

  const MOLES=[
    // 이마
    {id:1, x:50,y:8,  label:"이마 중앙",      meaning:"관운·리더십",  detail:"지도자 기질. 사회적 지위가 높아지는 운명", photoOk:true},
    {id:2, x:28,y:12, label:"이마 왼쪽",      meaning:"초년운·가족운",detail:"초년에 어려움이 있으나 극복하는 운명", photoOk:true},
    {id:3, x:72,y:12, label:"이마 오른쪽",    meaning:"귀인운",       detail:"귀인의 도움을 받는 운. 후원자가 나타남", photoOk:true},
    // 눈썹
    {id:4, x:28,y:22, label:"왼눈썹 위",      meaning:"재물운",       detail:"재물이 들어오는 점. 투자·사업에 길함", photoOk:true},
    {id:5, x:72,y:22, label:"오른눈썹 위",    meaning:"배우자 복",    detail:"좋은 배우자를 만날 운. 부유한 인연", photoOk:true},
    // 눈 옆
    {id:6, x:14,y:34, label:"왼쪽 눈 옆",     meaning:"도화살·매력", detail:"이성에게 매력적으로 보임. 연애운 강함", photoOk:true},
    {id:7, x:86,y:34, label:"오른쪽 눈 옆",   meaning:"도화살·인기", detail:"인기운. 대중 앞에서 빛나는 운명", photoOk:true},
    // 코
    {id:8, x:38,y:50, label:"코 왼쪽",        meaning:"건강·재물",   detail:"건강하고 재물이 따르는 점", photoOk:true},
    {id:9, x:62,y:50, label:"코 오른쪽",      meaning:"재물·축재",   detail:"돈을 모으는 능력. 재산이 불어남", photoOk:true},
    {id:10,x:50,y:56, label:"코 끝",          meaning:"자존심·운세", detail:"자존심 강함. 만년에 운이 상승", photoOk:true},
    // 입술
    {id:11,x:26,y:66, label:"왼쪽 입술 옆",   meaning:"구설수",      detail:"말로 인한 구설. 말을 아끼면 길함", photoOk:true},
    {id:12,x:74,y:66, label:"오른쪽 입술 옆", meaning:"식복·재물",   detail:"먹복 있음. 풍요로운 생활", photoOk:true},
    {id:13,x:50,y:72, label:"입술 아래",      meaning:"애정운",      detail:"이성과의 인연이 강함. 연애복 있음", photoOk:true},
    // 턱
    {id:14,x:24,y:82, label:"왼쪽 턱",        meaning:"이주·변화",   detail:"이사나 이직이 많음. 변화를 즐김", photoOk:true},
    {id:15,x:76,y:82, label:"오른쪽 턱",      meaning:"끈기·안정",   detail:"한 곳에 뿌리내리는 안정적 운명", photoOk:true},
    {id:16,x:50,y:88, label:"턱 중앙",        meaning:"말년운",      detail:"나이 들수록 운이 좋아지는 점", photoOk:true},
    // 귀
    {id:17,x:8, y:28, label:"왼쪽 귀 위",     meaning:"수명·장수",   detail:"장수하는 운명. 건강하게 오래 삶", photoOk:true},
    {id:18,x:8, y:42, label:"왼쪽 귀 중간",   meaning:"재물·귀인",   detail:"뜻밖의 재물이 들어오는 운", photoOk:true},
    {id:19,x:92,y:28, label:"오른쪽 귀 위",   meaning:"건강·장수",   detail:"체력이 좋고 병에 잘 안 걸림", photoOk:true},
    {id:20,x:92,y:42, label:"오른쪽 귀 중간", meaning:"인기·사교",   detail:"사람들에게 인기가 많은 운명", photoOk:true},
    // 목 앞·옆
    {id:21,x:50,y:100,label:"목 앞 중앙",     meaning:"말복·언변운", detail:"말을 잘하고 언변으로 성공하는 운", photoOk:true},
    {id:22,x:28,y:104,label:"목 왼쪽",        meaning:"재물·식복",   detail:"음식과 재물이 풍족한 운명", photoOk:true},
    {id:23,x:72,y:104,label:"목 오른쪽",      meaning:"건강·장수",   detail:"체력이 좋고 활동적인 삶", photoOk:true},
    // 목 뒤 (도식 전용)
    {id:24,x:35,y:115,label:"목 뒤 왼쪽",    meaning:"숨겨진 재물운",detail:"겉으로 드러나지 않는 숨겨진 재물. 뜻밖의 횡재", photoOk:false},
    {id:25,x:65,y:115,label:"목 뒤 오른쪽",  meaning:"숨겨진 인연운",detail:"운명적 인연이 뒤에서 나타남. 늦은 만남이 진짜", photoOk:false},
  ];

  function toggle(id){setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);}

  function analyze(){
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setStep("result");
      addHistory({icon:"⚫",name:"얼굴 점",person:"나",date:new Date().toLocaleDateString("ko-KR"),ctx:{ohaeng:"화"}});
    },1800);
  }

  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>

        {/* 1단계: 방법 선택 */}
        {step==="choose"&&<>
          <div className="mt">⚫ 얼굴 점 운명 분석</div>
          <div className="ms">내 얼굴 점 위치로 보는 운명 분석 · 980원</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div style={{background:"var(--ink3)",borderRadius:16,padding:"18px 12px",textAlign:"center",cursor:"pointer",border:"1px solid rgba(232,200,122,0.2)"}} onClick={()=>setStep("diagram")}>
              <div style={{fontSize:40,marginBottom:8}}>👤</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>도식으로 선택</div>
              <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.5}}>얼굴·귀·목 도식에서<br/>점 위치 직접 선택</div>
              <div style={{fontSize:10,color:"var(--gold)",marginTop:4}}>목 뒤 포함!</div>
            </div>
            <div style={{background:"var(--ink3)",borderRadius:16,padding:"18px 12px",textAlign:"center",cursor:"pointer",border:"1px solid rgba(245,184,196,0.2)"}} onClick={()=>setStep("photo")}>
              <div style={{fontSize:40,marginBottom:8}}>📸</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>사진 올리기</div>
              <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.5}}>AI가 점 위치 감지<br/>본인이 최종 확인</div>
              <div style={{fontSize:10,color:"var(--mist)",marginTop:4}}>목 뒤 제외</div>
            </div>
          </div>
          <button className="btn btn-g" onClick={onClose}>닫기</button>
        </>}

        {/* 2단계A: 도식 선택 */}
        {step==="diagram"&&<>
          <div className="mt">👤 점 위치 선택</div>
          <div className="ms">점이 있는 위치를 모두 탭하세요 ({selected.length}개 선택)</div>
          {/* 얼굴+귀+목 SVG — 세로로 긴 도식 */}
          <div style={{position:"relative",width:"100%",paddingBottom:"130%",marginBottom:12,background:"var(--ink3)",borderRadius:20,border:"1px solid rgba(255,255,255,0.06)"}}>
            <svg viewBox="0 0 100 130" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
              {/* 얼굴 윤곽 */}
              <ellipse cx="50" cy="48" rx="32" ry="42" fill="rgba(232,200,122,0.03)" stroke="rgba(232,200,122,0.12)" strokeWidth="0.7"/>
              {/* 귀 */}
              <ellipse cx="8"  cy="38" rx="5" ry="10" fill="rgba(232,200,122,0.03)" stroke="rgba(232,200,122,0.1)" strokeWidth="0.6"/>
              <ellipse cx="92" cy="38" rx="5" ry="10" fill="rgba(232,200,122,0.03)" stroke="rgba(232,200,122,0.1)" strokeWidth="0.6"/>
              {/* 목 */}
              <rect x="40" y="88" width="20" height="18" rx="4" fill="rgba(232,200,122,0.03)" stroke="rgba(232,200,122,0.1)" strokeWidth="0.6"/>
              {/* 목 뒤 (구분선) */}
              <rect x="38" y="108" width="24" height="16" rx="4" fill="rgba(155,143,212,0.06)" stroke="rgba(155,143,212,0.15)" strokeWidth="0.5"/>
              <text x="50" y="116" textAnchor="middle" fontSize="2.5" fill="rgba(155,143,212,0.5)">목 뒤</text>
              {/* 눈썹 */}
              <path d="M27 26 Q35 23 42 26" fill="none" stroke="rgba(200,196,216,0.15)" strokeWidth="0.8"/>
              <path d="M58 26 Q65 23 73 26" fill="none" stroke="rgba(200,196,216,0.15)" strokeWidth="0.8"/>
              {/* 눈 */}
              <ellipse cx="34" cy="34" rx="7" ry="3.5" fill="none" stroke="rgba(200,196,216,0.15)" strokeWidth="0.6"/>
              <ellipse cx="66" cy="34" rx="7" ry="3.5" fill="none" stroke="rgba(200,196,216,0.15)" strokeWidth="0.6"/>
              {/* 코 */}
              <path d="M50 42 L47 54 Q50 56 53 54 Z" fill="none" stroke="rgba(200,196,216,0.15)" strokeWidth="0.6"/>
              {/* 입 */}
              <path d="M38 64 Q50 70 62 64" fill="none" stroke="rgba(200,196,216,0.15)" strokeWidth="0.6"/>
              {/* 모든 점 위치 */}
              {MOLES.map(p=>(
                <g key={p.id} style={{cursor:"pointer"}} onClick={()=>toggle(p.id)}>
                  <circle cx={p.x} cy={p.y} r="4"
                    fill={selected.includes(p.id)?"rgba(232,200,122,0.9)":p.photoOk===false?"rgba(155,143,212,0.15)":"rgba(200,196,216,0.08)"}
                    stroke={selected.includes(p.id)?"var(--gold)":p.photoOk===false?"rgba(155,143,212,0.3)":"rgba(200,196,216,0.2)"}
                    strokeWidth="0.7"/>
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fontSize="2.6"
                    fill={selected.includes(p.id)?"var(--ink)":"rgba(200,196,216,0.4)"} fontWeight="bold">{p.id}</text>
                </g>
              ))}
            </svg>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10,fontSize:10,color:"var(--mist)"}}>
            <span>⚪ 일반 위치</span>
            <span style={{color:"var(--violet)"}}>🟣 목 뒤 (도식 전용)</span>
          </div>
          {selected.length>0&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {MOLES.filter(m=>selected.includes(m.id)).map(m=>(
                <span key={m.id} className="tag tg" style={{fontSize:10}}>⚫ {m.label}</span>
              ))}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button className="btn btn-g btn-sm" style={{marginTop:0}} onClick={()=>setStep("choose")}>이전</button>
            <button className="btn btn-p btn-sm" style={{opacity:selected.length===0?0.4:1}} onClick={()=>selected.length>0&&setStep("pay")}>다음 →</button>
          </div>
        </>}

        {/* 2단계B: 사진 업로드 */}
        {step==="photo"&&<>
          <div className="mt">📸 사진 올리기</div>
          <div className="ms">정면 얼굴 사진을 올려주세요 · AI가 점 위치 감지</div>
          <div style={{background:"rgba(155,143,212,0.08)",border:"1px solid rgba(155,143,212,0.15)",borderRadius:12,padding:"9px 13px",marginBottom:12,fontSize:11,color:"var(--mist)"}}>
            💡 AI가 점 위치를 찾아드려요. 내가 몰랐던 점도 발견될 수 있어요!<br/>
            <span style={{color:"rgba(200,196,216,0.4)"}}>목 뒤는 사진으로 감별이 어려워요 → 도식에서 선택하세요</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>setImgSrc(ev.target?.result);r.readAsDataURL(f);}}}/>
          {imgSrc
            ?<><img src={imgSrc} alt="얼굴" style={{width:"100%",borderRadius:14,marginBottom:10,maxHeight:240,objectFit:"cover"}}/>
              <button className="btn btn-g btn-sm" style={{marginBottom:10}} onClick={()=>{setImgSrc(null);fileRef.current?.click();}}>다시 선택</button>
            </>
            :<div className="upzone" onClick={()=>fileRef.current?.click()}>
              <div style={{fontSize:36,marginBottom:8}}>📷</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>사진을 올려주세요</div>
              <div style={{fontSize:11,color:"var(--mist)"}}>정면 얼굴 · 밝은 조명 권장</div>
            </div>
          }
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:4}}>
            <button className="btn btn-g btn-sm" style={{marginTop:0}} onClick={()=>setStep("choose")}>이전</button>
            <button className="btn btn-p btn-sm" style={{opacity:!imgSrc?0.4:1}} onClick={()=>imgSrc&&setStep("pay")}>다음 →</button>
          </div>
        </>}

        {/* 3단계: 결제 */}
        {step==="pay"&&<>
          <div className="mt">결제하기</div>
          <div className="price-box">
            <div className="pr"><span>얼굴 점 운명 분석</span><span>980원</span></div>
            <div className="pr tot"><span>결제금액</span><span>980원</span></div>
          </div>
          <div className="pay-list">
            {[{id:"kakao",ic:"🟡",name:"카카오페이",desc:"원터치 간편결제"},{id:"naver",ic:"💚",name:"네이버페이",desc:"포인트 적립"},{id:"phone",ic:"📱",name:"핸드폰 결제",desc:"통신사 결제"}].map(p=>(
              <div key={p.id} className="pay-opt"><div className="pay-l"><span style={{fontSize:20}}>{p.ic}</span><div><div className="pay-name">{p.name}</div><div className="pay-desc">{p.desc}</div></div></div><div className="radio"/></div>
            ))}
          </div>
          {loading?<Dots/>:<button className="btn btn-p" onClick={analyze}>980원 결제하고 결과 보기 ✨</button>}
          <button className="btn btn-g" onClick={()=>setStep(imgSrc?"photo":"diagram")}>이전으로</button>
        </>}

        {/* 4단계: 결과 */}
        {step==="result"&&<>
          <div className="mt">⚫ 얼굴 점 분석 결과</div>
          <div style={{fontSize:11,color:"var(--jade)",marginBottom:14}}>
            {selected.length>0?`${selected.length}개 점 분석 완료`:"사진 분석 완료"}
          </div>
          {(selected.length>0?MOLES.filter(m=>selected.includes(m.id)):MOLES.slice(0,3)).map(m=>(
            <div key={m.id} className="res-card">
              <div className="res-lbl">▸ ⚫ {m.label} — {m.meaning}</div>
              <div className="res-val">{m.detail}</div>
            </div>
          ))}
          <div className="res-card">
            <div className="res-lbl">▸ 종합 운세</div>
            <div className="res-val">점의 위치와 조합으로 볼 때, 재물운과 대인운이 강한 관상입니다. 특히 30대 중반부터 운이 크게 열릴 것으로 보입니다.</div>
          </div>
          <GoodsRecSection svcId="default" ctx={{ohaeng:"화"}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="얼굴점 개운 굿즈" sub="점 기운을 살리는 추천 아이템"/>
          <ShareRow/>
          <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        </>}
      </div>
    </div>
  );
}

function YesNoTarotModal({onClose,cart,setCart,onGoShop}){
  const[question,setQuestion]=useState("");
  const[flipped,setFlipped]=useState(false);
  const[loading,setLoading]=useState(false);
  const[answer,setAnswer]=useState(null);

  const YESNO_CARDS=[
    {card:"🌟",name:"별",answer:"YES",msg:"긍정적인 기운이 흐릅니다. 믿음을 갖고 행동하세요!",color:"var(--jade)"},
    {card:"☀️",name:"태양",answer:"YES",msg:"강력한 YES! 자신감을 갖고 앞으로 나아가세요.",color:"var(--gold)"},
    {card:"🌙",name:"달",answer:"글쎄요",msg:"아직 명확하지 않아요. 조금 더 기다려보세요.",color:"var(--violet)"},
    {card:"⚡",name:"탑",answer:"NO",msg:"지금은 아닌 것 같아요. 신중하게 생각해보세요.",color:"var(--coral)"},
    {card:"🌹",name:"연인",answer:"YES",msg:"마음이 통할 때예요. 솔직하게 표현해보세요!",color:"var(--blush)"},
    {card:"⚖️",name:"정의",answer:"YES",msg:"균형 잡힌 선택이에요. 공정하게 판단하세요.",color:"var(--mist)"},
  ];

  function flip(){
    if(!question.trim()){alert("질문을 입력해주세요!");return;}
    setLoading(true);
    setTimeout(()=>{
      setAnswer(YESNO_CARDS[Math.floor(Math.random()*YESNO_CARDS.length)]);
      setLoading(false);
      setFlipped(true);
    },1200);
  }

  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div className="mt">✨ YES/NO 타로</div>
        <div className="ms">질문 하나, 카드 하나 · 무료</div>
        {!flipped?<>
          <input className="inp" placeholder="오늘 그 사람한테 연락해야 할까?" value={question} onChange={e=>setQuestion(e.target.value)} style={{marginBottom:16}}/>
          {loading?<Dots/>:<button className="btn btn-p" onClick={flip}>카드 뽑기 ✨</button>}
        </>:<>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:12,color:"var(--mist)",marginBottom:8}}>Q. {question}</div>
            <div style={{fontSize:64,marginBottom:8}}>{answer.card}</div>
            <div style={{fontSize:24,fontWeight:900,color:answer.color,marginBottom:4}}>{answer.answer}</div>
            <div style={{fontSize:13,color:answer.name==="달"?"var(--violet)":answer.color,marginBottom:4}}>{answer.name} 카드</div>
            <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.7}}>{answer.msg}</div>
          </div>
          <ShareRow/>
          <button className="btn btn-p" onClick={()=>{setFlipped(false);setQuestion("");setAnswer(null);}}>다시 뽑기</button>
          <button className="btn btn-g" onClick={onClose}>닫기</button>
        </>}
      </div>
    </div>
  );
}

function DreamModal({onClose,cart,setCart,onGoShop}){
  const[step,setStep]=useState("input");const[dream,setDream]=useState("");const[loading,setLoading]=useState(false);
  const keywords=["물","불","하늘","바다","산","뱀","돈","사람","집","길","동물","죽음","결혼","임신","비행","학교"];
  function analyze(){setLoading(true);setTimeout(()=>{setLoading(false);setStep("result");},1800);}
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        {step==="input"&&<>
          <div className="mt">💭 꿈 해몽</div>
          <div className="ms">어젯밤 꿈 키워드 · 무료</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
            {keywords.map(k=><div key={k} onClick={()=>setDream(k)} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",background:dream===k?"rgba(232,200,122,0.15)":"var(--ink3)",color:dream===k?"var(--gold)":"var(--mist)",border:dream===k?"1px solid rgba(232,200,122,0.35)":"1px solid rgba(255,255,255,0.06)"}}>{k}</div>)}
          </div>
          <input className="inp" placeholder="또는 직접 입력" value={dream} onChange={e=>setDream(e.target.value)}/>
          {loading?<Dots/>:<button className="btn btn-p" onClick={analyze} disabled={!dream}>해몽 보기 (무료) →</button>}
          <button className="btn btn-g" onClick={onClose}>취소</button>
        </>}
        {step==="result"&&<>
          <div className="succ"><div className="succ-icon">💭</div><div className="succ-title">"{dream}" 해몽</div></div>
          <div className="res-card"><div className="res-lbl">▸ 꿈의 의미</div><div style={{fontSize:15,fontWeight:700,color:"var(--gold2)",marginBottom:6}}>재물이 들어올 징조</div><div className="res-val">꿈에 {dream}이/가 나왔다면 새로운 기회나 재물이 들어올 좋은 신호입니다.</div></div>
          <GoodsRecSection svcId="dream" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="꿈 해몽 개운 굿즈" sub="액막이·기운 정화 추천 아이템"/>
          <ShareRow/>
          <button className="btn btn-p" onClick={onClose}>확인</button>
        </>}
      </div>
    </div>
  );
}

function LottoModal({onClose,cart,setCart,onGoShop}){
  const[step,setStep]=useState("ready");const[loading,setLoading]=useState(false);
  const colors=["#F9A825","#9E9E9E","#E53935","#1565C0","#2E7D32","#6A1B9A"];
  function generate(){setLoading(true);setTimeout(()=>{setLoading(false);setStep("result");},1500);}
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div className="mt">🎰 행운의 로또번호</div>
        <div className="ms">수비학 + 오늘의 기운 · 무료</div>
        {step==="ready"&&<><div style={{textAlign:"center",fontSize:60,margin:"18px 0"}}>🎰</div>{loading?<Dots/>:<button className="btn btn-p" onClick={generate}>이번 주 행운 번호 뽑기 ✨</button>}</>}
        {step==="result"&&<>
          <div className="lotto-balls">{TODAY.로또.map((n,i)=><div key={i} className="lotto-ball" style={{background:colors[i]}}>{n}</div>)}</div>
          <div className="res-card"><div className="res-lbl">▸ 행운의 구매 시간</div><div className="res-val"><strong style={{color:"var(--gold)"}}>목요일 오후 3~5시</strong> · 동쪽 방향 편의점</div></div>
          <GoodsRecSection svcId="lotto" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="행운 강화 굿즈" sub="재물운·행운을 높이는 아이템"/>
          <ShareRow/>
          <button className="btn btn-p" onClick={onClose}>확인</button>
        </>}
        {step==="ready"&&<button className="btn btn-g" onClick={onClose}>취소</button>}
        {step==="result"&&<button className="btn btn-g" onClick={onClose}>닫기</button>}
      </div>
    </div>
  );
}

function MonthlyModal({onClose,cart,setCart,onGoShop}){
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div className="succ"><div className="succ-icon">🌸</div><div className="succ-title">{TODAY.이달.month} 운세</div></div>
        <div className="res-card"><div className="res-lbl">▸ 이달의 흐름</div><div style={{fontSize:15,fontWeight:700,color:"var(--gold2)",marginBottom:6}}>"{TODAY.이달.keyword}"</div><div className="res-val">{TODAY.이달.desc}</div></div>
        <GoodsRecSection svcId="default" ctx={{ohaeng:"화"}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="이달의 개운 굿즈" sub="이번 달 기운을 높이는 추천 아이템"/>
        <ShareRow/>
        <button className="btn btn-p" onClick={onClose}>확인</button>
      </div>
    </div>
  );
}

function ComingModal({svc,onClose}){
  const[email,setEmail]=useState("");const[done,setDone]=useState(false);
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div style={{textAlign:"center",fontSize:52,marginBottom:12}}>{svc.icon}</div>
        <div className="mt" style={{textAlign:"center"}}>{svc.name}</div>
        <div className="ms" style={{textAlign:"center"}}>열심히 준비 중이에요! 오픈 시 먼저 알려드릴게요 🙌</div>
        {!done?<><input className="inp" placeholder="이메일 주소" value={email} onChange={e=>setEmail(e.target.value)}/><button className="btn btn-violet btn-sm" onClick={()=>setDone(true)}>출시 알림 신청</button></>
        :<div style={{background:"rgba(155,143,212,0.1)",border:"1px solid rgba(155,143,212,0.2)",borderRadius:13,padding:"14px",textAlign:"center"}}><div style={{fontSize:24,marginBottom:6}}>✅</div><div style={{fontSize:13,fontWeight:700,color:"var(--violet)"}}>알림 신청 완료!</div></div>}
        <button className="btn btn-g" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

function YtypeIntroModal({onClose, onBuy}){
  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div className="mt">🐉 12수호신 (十二守護神)</div>
        <div className="ms">동양 사주에서 영감받은 12가지 수호 영수 유형 · 무료 소개</div>
        <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:14,padding:"13px 14px",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--gold)",marginBottom:6}}>✦ 12수호신이란?</div>
          <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.75}}>
            생년월일 사주와 별자리를 종합 분석하여 나의 기질과 에너지를 12가지 신령스러운 수호신에 빗댄 유형 분류입니다. 서양의 MBTI가 심리학 기반이라면, 12수호신은 동양 오행 철학 기반입니다.
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          {TWELVE_TYPES.map(t=>(
            <div key={t.id} style={{background:"var(--ink3)",borderRadius:12,padding:"11px 6px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{fontSize:22,marginBottom:4}}>{t.icon}</div>
              <div style={{fontSize:10,fontWeight:700}}>{t.id}형</div>
              <div style={{fontSize:9,color:"var(--mist)",marginTop:1}}>{t.hanja}</div>
            </div>
          ))}
        </div>
        <div style={{background:"var(--ink3)",borderRadius:14,padding:"13px 14px",marginBottom:14}}>
          <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.7}}>
            봉황·용·백호·현무·기린·주작·청룡·백학·흑호·금오·옥토·신구<br/>
            <strong style={{color:"var(--white)"}}>총 12가지</strong> 유형 중 내가 어떤 영수인지는 사주 분석이 필요합니다.
          </div>
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.1),rgba(155,143,212,0.07))",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"14px",marginBottom:14,textAlign:"center"}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--gold2)",marginBottom:5}}>✦ 내 12수호신 알아보기</div>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:12,lineHeight:1.6}}>생년월일 입력 → 사주 + 별자리 종합 분석<br/>→ 내 수호 영수 유형 + 종합 리포트 제공</div>
          <button className="btn btn-p btn-sm" onClick={()=>{onClose();onBuy();}}>나의 천기 리포트에서 수호신 도출하기 (무료)</button>
        </div>
        <button className="btn btn-g" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

function SynthesisModal({onClose, cart, setCart, onGoShop, addHistory, userHistory}){
  const[step,setStep]=useState("main");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);

  // 이용 기록 기반 완성도 계산
  const REPORT_ITEMS = [
    {id:"saju",      icon:"🔮", label:"사주 풀이",    desc:"운명의 뼈대",        keys:["사주 풀이","사주 월별운세"]},
    {id:"gwansang",  icon:"🪞", label:"관상 분석",    desc:"얼굴에 새겨진 운세", keys:["관상짤","정밀 관상"]},
    {id:"love",      icon:"💌", label:"연애운·궁합",  desc:"인연의 흐름",        keys:["연애운·궁합","연애 타로"]},
    {id:"gijildo",   icon:"☯️", label:"기질도",       desc:"타고난 성질",        keys:["기질도"]},
    {id:"palmistry", icon:"✋", label:"손금·발금",    desc:"신체에 새겨진 운명 ✋🦶", keys:["손금","발금"]},
    {id:"name",      icon:"✍️", label:"이름 풀이",    desc:"이름이 가진 에너지 📝", keys:["이름 풀이","파동 성명학"]},
  ];

  const historyNames = userHistory.map(h=>h.name);
  const completed = REPORT_ITEMS.map(item=>({
    ...item,
    done: item.keys.some(k=>historyNames.includes(k))
  }));
  const doneCount = completed.filter(c=>c.done).length;
  const pct = Math.round((doneCount/6)*100);

  function generateReport(){
    setLoading(true);
    setTimeout(()=>{
      const r=TWELVE_TYPES[Math.floor(Math.random()*TWELVE_TYPES.length)];
      setResult(r);
      setLoading(false);
      setStep("result");
      addHistory({icon:"🌟",name:"나의 천기 리포트",person:"나",date:new Date().toLocaleDateString("ko-KR"),ctx:{ytype:r.id,ohaeng:"화"}});
    },1800);
  }

  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>

        {step==="main"&&<>
          <div className="mt">🌟 나의 천기 리포트</div>
          <div className="ms">결제한 콘텐츠를 기반으로 자동 생성돼요.<br/>더 많이 이용할수록 리포트가 풍부해집니다!</div>

          {/* 완성도 바 */}
          <div style={{background:"var(--ink3)",borderRadius:16,padding:"14px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:700}}>분석 완성도</div>
              <div style={{fontSize:13,fontWeight:900,color:doneCount===6?"var(--jade)":"var(--gold)"}}>{doneCount}/6</div>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${pct}%`,background:doneCount===6?"var(--jade)":"var(--gold)",borderRadius:4,transition:"width .6s"}}/>
            </div>
            {completed.map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:item.done?"var(--white)":"rgba(200,196,216,0.4)"}}>{item.label}</div>
                  <div style={{fontSize:10,color:"rgba(200,196,216,0.35)"}}>{item.desc}</div>
                </div>
                {item.done
                  ?<span style={{fontSize:12,color:"var(--jade)",fontWeight:700}}>✓ 완료</span>
                  :<span style={{fontSize:11,color:"rgba(200,196,216,0.25)"}}>미이용</span>
                }
              </div>
            ))}
          </div>

          {/* 12수호신 도출 안내 */}
          <div style={{background:"rgba(155,143,212,0.08)",border:"1px solid rgba(155,143,212,0.2)",borderRadius:14,padding:"12px 14px",marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--violet)",marginBottom:4}}>🐉 내 12수호신</div>
            {doneCount>=3
              ?<div style={{fontSize:12,color:"var(--mist)"}}>리포트 생성 후 수호신이 도출됩니다!</div>
              :<div style={{fontSize:12,color:"rgba(200,196,216,0.4)"}}>3개 이상 이용하면 수호신이 나타납니다</div>
            }
          </div>

          {doneCount===0
            ?<div style={{textAlign:"center",padding:"8px 0 12px",fontSize:12,color:"rgba(200,196,216,0.35)"}}>
               아직 이용한 콘텐츠가 없어요<br/>사주·관상 등을 먼저 이용해보세요!
             </div>
            :<div/>
          }

          {loading?<Dots/>:<>
            <button className="btn btn-p" onClick={generateReport}
              style={{opacity:doneCount===0?0.5:1}}>
              {doneCount===0?"먼저 콘텐츠를 이용해보세요":
               doneCount<3?`리포트 미리보기 (${doneCount}/6)`:
               doneCount===6?"🎉 천기 리포트 완성본 보기":"리포트 생성하기 →"}
            </button>
            {doneCount<6&&<div style={{textAlign:"center",fontSize:11,color:"rgba(200,196,216,0.3)",marginTop:8}}>
              {6-doneCount}개 더 이용하면 완성 리포트가 돼요!
            </div>}
          </>}
          <button className="btn btn-g" onClick={onClose}>닫기</button>
        </>}

        {step==="result"&&result&&<>
          <div className="mt">🌟 나의 천기 리포트</div>
          <div style={{fontSize:11,color:"var(--jade)",marginBottom:14}}>분석 완성도 {doneCount}/6 · {doneCount===6?"완성!":"더 이용하면 풍부해져요"}</div>

          {/* 12수호신 결과 */}
          <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(155,143,212,0.08))",border:"1px solid rgba(232,200,122,0.2)",borderRadius:20,padding:"20px 18px",textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--gold)",fontWeight:700,letterSpacing:"1px",marginBottom:8}}>✦ 나의 12수호신</div>
            <div style={{fontSize:54,marginBottom:10}}>{result.icon}</div>
            <div style={{fontSize:22,fontWeight:900,color:"var(--gold2)",marginBottom:2}}>{result.id}</div>
            <div style={{fontSize:12,color:"var(--mist)",marginBottom:10}}>{result.hanja}</div>
            <div style={{fontSize:13,color:"var(--mist)",lineHeight:1.7,marginBottom:10}}>{result.desc}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>{result.tags.map(t=><span key={t} className="tag tg">{t}</span>)}</div>
          </div>

          {/* 이용한 항목만 결과 표시 */}
          {completed.filter(c=>c.done).map(item=>(
            <div key={item.id} className="res-card">
              <div className="res-lbl">▸ {item.label}</div>
              <div className="res-val">
                {item.id==="saju"&&"목(木) 기운이 강한 일간. 창의적이고 성장 지향적 성향으로 2026년 하반기부터 새로운 기회가 열립니다."}
                {item.id==="gwansang"&&"재물복 있는 눈매와 의지력 강한 코 라인. 30대 후반부터 재물운이 상승합니다."}
                {item.id==="love"&&"5월 전후로 강렬한 감정적 연결이 찾아올 수 있습니다. 먼저 표현하는 쪽이 이득입니다."}
                {item.id==="gijildo"&&"화형(火) 기질. 직관적이고 표현력이 강하며 새로운 것에 빠르게 반응합니다."}
                {item.id==="palmistry"&&"감정선이 강하게 발달했습니다. 공감 능력이 뛰어나고 관계에서 주도적 역할을 합니다."}
                {item.id==="name"&&"이름의 오행 파동이 사주와 잘 맞습니다. 현재 이름이 좋은 기운을 불러오고 있습니다."}
              </div>
            </div>
          ))}

          {/* 미이용 항목 유도 */}
          {completed.filter(c=>!c.done).length>0&&(
            <div style={{background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.12)",borderRadius:14,padding:"12px 14px",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--gold)",marginBottom:8}}>✦ 아직 분석 안된 항목</div>
              {completed.filter(c=>!c.done).map(item=>(
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",fontSize:11,color:"rgba(200,196,216,0.4)"}}>
                  <span>{item.icon}</span><span>{item.label}</span><span style={{marginLeft:"auto"}}>→ 이용하면 리포트 추가!</span>
                </div>
              ))}
            </div>
          )}

          {doneCount===6&&<div style={{background:"rgba(95,196,158,0.08)",border:"1px solid rgba(95,196,158,0.2)",borderRadius:14,padding:"12px 14px",marginBottom:12,textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:900,color:"var(--jade)",marginBottom:4}}>🎉 천기 리포트 완성!</div>
            <div style={{fontSize:11,color:"var(--mist)"}}>PDF로 저장해서 보관하세요</div>
            <button style={{marginTop:8,padding:"7px 16px",background:"var(--jade)",border:"none",borderRadius:10,color:"var(--ink)",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer"}}>📄 PDF 저장</button>
          </div>}

          <GoodsRecSection svcId="ytype" ctx={{ytype:result.id,ohaeng:"화"}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="맞춤 수호 굿즈" sub="내 수호신과 부족한 오행을 보완하는 아이템"/>
          <ShareRow/>
          <button className="btn btn-p" onClick={onClose}>확인</button>
        </>}
      </div>
    </div>
  );
}

const SVC_CATS = [
  {id:"unse",label:"🔮 운세·점술",items:[
    {id:"saju",         icon:"☯️",name:"사주 풀이",    desc:"평생 운명의 흐름 · 점집 5만원을 980원에",   price:"980원",badge:null,    bdgCls:"",          coming:false},
    {id:"saju_monthly", icon:"📅",name:"사주 월별운세", desc:"이번 달 놓치면 안 되는 운의 흐름",             price:"980원",badge:"NEW",  bdgCls:"bdg-new",   coming:false},
    {id:"love",         icon:"💌",name:"연애운·궁합",  desc:"그 사람과 나, 정말 잘 맞을까?",           price:"980원",badge:null,   bdgCls:"",          coming:false},
    {id:"newyear",      icon:"🎋",name:"신년운세",      desc:"2026년 12달 월별 대운 미리 보기",           price:"980원",badge:null,   bdgCls:"",          coming:false},
    {id:"tojeong",      icon:"📜",name:"토정비결",      desc:"조선시대부터 내려온 나의 한 해 운",        price:"980원",badge:null,   bdgCls:"",          coming:false},
    {id:"numerology",   icon:"🔢",name:"수비학",        desc:"전 세계 유행 · 생년월일로 운명수 계산",     price:"980원",badge:"NEW",  bdgCls:"bdg-new",   coming:false},
    {id:"palmistry",    icon:"✋",name:"손금",           desc:"사진으로 손바닥에 새겨진 운명선 분석",         price:"980원",badge:null,   bdgCls:"",          coming:false},
    {id:"footreading",  icon:"🦶",name:"발금",           desc:"사진으로 발바닥 건강·운세 분석",        price:"980원",badge:"NEW",  bdgCls:"bdg-new",   coming:false},
    {id:"mole",         icon:"⚫",name:"얼굴 점",        desc:"내 얼굴 점 위치로 보는 운명 분석",        price:"980원",badge:null,   bdgCls:"",          coming:false},
    {id:"past_life",    icon:"⏳",name:"전생 운세",      desc:"전생에 나는 누구였을까",     price:"980원",badge:"NEW",  bdgCls:"bdg-new",   coming:false},
  ]},
  {id:"gwansang",label:"🪞 관상",items:[
    {id:"gwansang_zal", icon:"🪞",name:"관상짤",       desc:"소개팅 상대 관상 분석",  price:"무료/380원",badge:"메인",bdgCls:"bdg-hot", free:true, coming:false},
    {id:"gwansang_full",icon:"🔍",name:"정밀 관상",    desc:"재물·연애·건강 상세",   price:"980원",     badge:"인기",bdgCls:"bdg-hot", coming:false},
    {id:"celeb_look",   icon:"🎬",name:"연예인 닮은꼴",desc:"닮은 연예인 관상 분석", price:"무료",       badge:"무료",bdgCls:"bdg-free",free:true, coming:false},
  ]},
  {id:"tarot",label:"🃏 타로",items:[
    {id:"tarot_today",  icon:"🃏",name:"오늘의 타로",   desc:"오늘 타로 1장 뽑기",              price:"무료",  badge:"무료", bdgCls:"bdg-free",  free:true, coming:false},
    {id:"tarot_yesno",  icon:"✨",name:"YES/NO 타로",   desc:"1장 — 질문 하나, 답 하나",        price:"무료",  badge:"무료", bdgCls:"bdg-free",  free:true, coming:false},
    {id:"tarot_love",   icon:"💘",name:"연애 타로",     desc:"3장 — 나·상대·관계 리딩",         price:"980원", badge:null,   bdgCls:"",          coming:false},
    {id:"tarot_health", icon:"🌿",name:"건강 타로",     desc:"3장 — 현재·원인·조언",            price:"980원", badge:"NEW",  bdgCls:"bdg-new",   coming:false},
    {id:"tarot_money",  icon:"💰",name:"재물 타로",     desc:"5장 — 현재·장애·기회·행동·결과", price:"980원", badge:"NEW",  bdgCls:"bdg-new",   coming:false},
    {id:"tarot_career", icon:"🧭",name:"진로 타로",     desc:"5장 — 직업·학업·사업·이직",       price:"980원", badge:"NEW",  bdgCls:"bdg-new",   coming:false},
    {id:"tarot_life",   icon:"🌌",name:"인생 타로",     desc:"10장 켈틱크로스 — 인생 전반",     price:"980원", badge:null,   bdgCls:"",          coming:false},
  ]},
  {id:"nawa",label:"📖 나를 알다",items:[
    {id:"synthesis",    icon:"🌟",name:"나의 천기 리포트",  desc:"결제할수록 풍부해지는 내 운명 종합서",       price:"무료",   badge:"무료",     bdgCls:"bdg-free",   free:true, coming:false},
    {id:"ytype_intro",  icon:"🐉",name:"12수호신 소개",    desc:"12가지 수호신 유형 알아보기",                price:"무료",   badge:"무료",     bdgCls:"bdg-free",   free:true, coming:false},
    {id:"gijildo",      icon:"🧬",name:"기질 테스트",      desc:"오행·음양으로 보는 내 기질 테스트",              price:"980원",  badge:"NEW",      bdgCls:"bdg-new",    coming:false},
    {id:"psych",        icon:"🧠",name:"뇌과학 분석 테스트",desc:"고지능·ADHD 등 내가 가진 숨은 능력은?",    price:"4,800원",badge:"프리미엄", bdgCls:"bdg-premium",coming:false},
  ]},
  {id:"name",label:"✍️ 이름·성명",items:[
    {id:"namereading",  icon:"📝",name:"이름 풀이",    desc:"한자 획수·뜻으로 내 이름 풀이",                   price:"980원",  badge:null,       bdgCls:"",           coming:false},
    {id:"pawdong",      icon:"🌊",name:"파동 성명학", desc:"불릴수록 운이 바뀐다 — 내 이름의 오행 파동",price:"4,800원",badge:"프리미엄", bdgCls:"bdg-premium",coming:false},
  ]},
];

function HomePage({onSvc,isLoggedIn,savedPersons,setSavedPersons,cart,setCart,onGoShop,addHistory,userHistory}){
  const[gwanzalOpen,setGwanzalOpen]=useState(false);
  const[todayModal,setTodayModal]=useState(null);

  // ② 맞춤 배너 — 이용 기록 기반
  const personalGoods = getPersonalizedGoods(userHistory);
  const hasHistory = userHistory.length > 0;

  const todayCards=[
    {id:"unse",  ic:"🌙",bg:"rgba(155,143,212,0.12)",border:"rgba(155,143,212,0.2)",  name:"오늘의 운세",   value:`종합 ${TODAY.운세.overall}점`},
    {id:"tarot", ic:"🃏",bg:"rgba(232,200,122,0.1)", border:"rgba(232,200,122,0.2)",  name:"오늘의 타로",   value:TODAY.타로.name},
    {id:"lotto", ic:"🎰",bg:"rgba(244,124,90,0.1)",  border:"rgba(244,124,90,0.2)",   name:"행운 로또번호", value:TODAY.로또.slice(0,3).join(" ")+"···"},
    // B그룹 (지금 바로 물어봐)
    {id:"yesno", ic:"✨",bg:"rgba(95,196,158,0.1)",  border:"rgba(95,196,158,0.2)",   name:"YES/NO 타로",   value:"질문 하나, 카드 하나"},
    {id:"dream", ic:"💭",bg:"rgba(155,143,212,0.1)", border:"rgba(155,143,212,0.15)", name:"꿈 해몽",       value:"키워드 입력"},
  ];

  return(
    <div className="page">
      <div className="hero">
        <div className="hero-badge">✨ 2026 병오년 붉은 말의 해 · 천기 오픈</div>
        <h1 className="hero-title">하늘이 감춘<br/><em>나의 운명을 보다</em></h1>
        <p className="hero-sub">관상짤부터 파동성명학까지 · 980원~</p>
        <div className="stats-row">
          <div className="stat"><div className="stat-num">150만+</div><div className="stat-lbl">누적 이용자</div></div>
          <div className="stat"><div className="stat-num">4.9★</div><div className="stat-lbl">만족도</div></div>
          <div className="stat"><div className="stat-num">980원~</div><div className="stat-lbl">시작 가격</div></div>
        </div>
      </div>

      {/* 🪞 관상 배너 — 히어로 바로 아래 */}
      <div style={{padding:"0 0 4px"}}>
        <div className="sec"><div className="sec-t">🪞 관상</div></div>
        <div className="gw-main" onClick={()=>setGwanzalOpen(true)}>
          <div className="gw-bg">
            <div className="gw-top"><span className="gw-label">🪞 천기 관상짤</span><span className="gw-badge">처음 한 번 무료</span></div>
            <div className="gw-title">소개팅 상대<br/>관상 바로 확인</div>
            <div className="gw-desc">사진 올리면 도화살·재물운·성격 즉시 분석</div>
            <div className="gw-examples">
              <span className="gw-ex">😏 도화살 있음</span><span className="gw-ex">💰 재물복</span>
              <span className="gw-ex">⚡ 성격 체크</span><span className="gw-ex">🛍️ 오행 굿즈</span>
            </div>
          </div>
        </div>
        <div className="svc-grid" style={{marginTop:10}}>
          {SVC_CATS.find(c=>c.id==="gwansang").items
            .filter(s=>s.id!=="gwansang_zal")
            .map(svc=>(
              <div key={svc.id} className="svc-card" onClick={()=>onSvc(svc)}>
                {svc.badge&&<div className={`svc-bdg ${svc.bdgCls}`}>{svc.badge}</div>}
                <div className="svc-ic">{svc.icon}</div>
                <div className="svc-name">{svc.name}</div>
                <div className="svc-desc">{svc.desc}</div>
                <div className={`svc-price${svc.free||svc.price==="무료"?" free":""}`}>{svc.price}</div>
              </div>
            ))}
        </div>
      </div>

      <div className="divider"/>

      {/* 오늘의 천기 */}
      <div className="today-sec">
        <div className="today-hdr"><span style={{fontSize:15,fontWeight:900}}>✦ 오늘의 천기</span><span style={{fontSize:11,color:"var(--mist)"}}>{TODAY.date.split(" ")[0]} · 매일 무료</span></div>

        {/* 수호 기운 */}
        <div style={{marginBottom:9}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:8}}>✦ 오늘의 수호 기운</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",paddingRight:32,paddingBottom:2}}>
            {[
              {icon:null, colorChip:true, label:"수호색",  val:TODAY.행운.color},
              {icon:"🧭", label:"수호 방향", val:TODAY.행운.direction},
              {icon:"🔢", label:"수호 숫자", val:`${TODAY.행운.number}`},
              {icon:"🕐", label:"수호 시간", val:TODAY.행운.time},
              {icon:"🍱", label:"수호 음식", val:TODAY.행운.food},
              {icon:"🐯", label:"수호 동물", val:TODAY.행운.animal},
            ].map((s,i)=>(
              <div key={i} style={{flexShrink:0,background:"var(--ink3)",borderRadius:12,padding:"9px 11px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)",minWidth:68}}>
                <div style={{height:22,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:3}}>
                  {s.colorChip
                    ?<div style={{width:18,height:18,borderRadius:5,background:TODAY.행운.colorHex,border:"1px solid rgba(255,255,255,0.2)"}}/>
                    :<span style={{fontSize:16}}>{s.icon}</span>
                  }
                </div>
                <div style={{fontSize:9,color:"var(--mist)",marginBottom:3}}>{s.label}</div>
                <div style={{fontSize:11,fontWeight:700}}>{s.val}</div>
              </div>
            ))}
            <div style={{flexShrink:0,width:20,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(200,196,216,0.2)",fontSize:18,paddingRight:4}}>›</div>
          </div>
        </div>

        {/* A그룹 — 오늘 공통 운세 (4개 그리드) */}
        <div className="today-grid">
          {todayCards.filter(c=>!["yesno","dream"].includes(c.id)).map(c=>(
            <div key={c.id} className="td-card" style={{background:c.bg,border:`1px solid ${c.border}`}} onClick={()=>setTodayModal(c.id)}>
              <div className="td-free-badge">무료</div>
              <div className="td-icon">{c.ic}</div>
              <div className="td-name">{c.name}</div>
              <div className="td-value">{c.value}</div>
            </div>
          ))}
          <div className="td-card" style={{background:"rgba(245,184,196,0.09)",border:"1px solid rgba(245,184,196,0.2)"}} onClick={()=>setTodayModal("monthly")}>
            <div className="td-free-badge">무료</div>
            <div className="td-icon">🌸</div>
            <div className="td-name">이달의 운세</div>
            <div className="td-value">3월 "{TODAY.이달.keyword}" {"★".repeat(TODAY.이달.stars)}</div>
          </div>
        </div>

        {/* 오늘의 명언 */}
        <div style={{background:"linear-gradient(135deg,rgba(155,143,212,0.1),rgba(232,200,122,0.06))",border:"1px solid rgba(155,143,212,0.18)",borderRadius:16,padding:"14px 16px",marginTop:9,cursor:"pointer"}} onClick={()=>setTodayModal("unse")}>
          <div style={{fontSize:10,color:"var(--violet)",fontWeight:700,marginBottom:5}}>✦ 오늘의 명언</div>
          <div style={{fontSize:14,fontWeight:700,color:"var(--gold2)",lineHeight:1.5,marginBottom:4}}>"{TODAY.명언.text}"</div>
          <div style={{fontSize:10,color:"var(--mist)"}}>{TODAY.명언.source}</div>
        </div>

        {/* B그룹 — 지금 바로 물어봐 */}
        <div style={{marginTop:12}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:8}}>🔮 지금 바로 물어봐</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {todayCards.filter(c=>["yesno","dream"].includes(c.id)).map(c=>(
              <div key={c.id} className="td-card" style={{background:c.bg,border:`1px solid ${c.border}`}} onClick={()=>setTodayModal(c.id)}>
                <div className="td-free-badge">무료</div>
                <div className="td-icon">{c.ic}</div>
                <div className="td-name">{c.name}</div>
                <div className="td-value">{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider"/>

      {/* ② 맞춤 굿즈 배너 (이용 기록 있을 때) */}
      {hasHistory&&(
        <>
          <div className="sec"><div className="sec-t">🛍️ 내 맞춤 굿즈</div></div>
          <div className="custom-banner" onClick={onGoShop}>
            <div className="cb-top">
              <span className="cb-title">✦ 내 운세 기록 기반 추천</span>
              <span className="cb-badge">맞춤 {personalGoods.length}개</span>
            </div>
            <div style={{fontSize:11,color:"var(--mist)",marginBottom:10}}>내가 본 결과들을 종합해서 딱 맞는 굿즈를 골랐어요</div>
            <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none"}}>
              {personalGoods.slice(0,5).map(g=>(
                <div key={g.id} style={{flexShrink:0,textAlign:"center"}}>
                  <div style={{width:52,height:52,borderRadius:13,background:g.color||"var(--ink3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:4}}>{g.icon}</div>
                  <div style={{fontSize:9,color:"var(--mist)",maxWidth:52,lineHeight:1.3}}>{g.name.slice(0,6)}···</div>
                </div>
              ))}
              <div style={{flexShrink:0,width:52,height:52,borderRadius:13,background:"var(--ink3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"var(--gold)"}}>→</div>
            </div>
          </div>
          <div className="divider"/>
        </>
      )}

      <div className="divider"/>

      {/* 무료 콘텐츠 빠른 접근 */}
      <div className="sec"><div className="sec-t">🎁 무료 콘텐츠</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,padding:"0 18px 4px"}}>
        {[{id:"ddi",ic:"🐯",name:"띠별"},{id:"zodiac",ic:"⭐",name:"별자리"},{id:"blood",ic:"🩸",name:"혈액형"},{id:"celeb_compat",ic:"💕",name:"궁합 연예인"}].map(item=>(
          <div key={item.id} style={{background:"var(--ink2)",borderRadius:14,padding:"13px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)",cursor:"pointer"}} onClick={()=>onSvc({id:item.id,icon:item.ic,name:item.name,desc:"",price:"무료",free:true,coming:false})}>
            <div style={{fontSize:24,marginBottom:5}}>{item.ic}</div>
            <div style={{fontSize:10,fontWeight:700}}>{item.name}</div>
            <div style={{fontSize:9,color:"var(--jade)",marginTop:2}}>무료</div>
          </div>
        ))}
      </div>

      {/* ⭐ 첫 이용자 혜택 */}
      <div style={{padding:"14px 18px 0"}}>
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.11),rgba(245,184,196,0.07))",border:"1px solid rgba(232,200,122,0.2)",borderRadius:18,padding:"18px 18px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:34,flexShrink:0}}>🎁</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:900,marginBottom:4}}>첫 이용자 혜택</div>
            <div style={{fontSize:11,color:"var(--mist)",marginBottom:12,lineHeight:1.6}}>관상짤 처음 한 번 무료 + 가입 시<br/><strong style={{color:"var(--gold)"}}>매일 6종 · 상시 7종 무료 13종 무제한!</strong></div>
            <button className="btn btn-p btn-sm" style={{maxWidth:160}}>무료로 시작하기</button>
          </div>
        </div>
      </div>

      <div className="divider"/>

      {/* 전체 서비스 — 운세부터 순서대로 (관상은 별도 배너 섹션으로) */}
      {SVC_CATS.filter(cat=>cat.id!=="gwansang").map(cat=>(
        <div key={cat.id}>
          <div className="sec"><div className="sec-t">{cat.label}</div></div>
          <div className="svc-grid">
            {cat.items.map(svc=>(
              <div key={svc.id} className={`svc-card${svc.coming?" coming":""}`} onClick={()=>!svc.coming&&onSvc(svc)}>
                {svc.badge&&<div className={`svc-bdg ${svc.bdgCls}`}>{svc.badge}</div>}
                <div className="svc-ic">{svc.icon}</div>
                <div className="svc-name">{svc.name}</div>
                <div className="svc-desc">{svc.desc}</div>
                <div className={`svc-price${svc.free||svc.price==="무료"?" free":svc.coming?" soon":""}`}>{svc.coming?"곧 오픈":svc.price}</div>
              </div>
            ))}
          </div>
          {/* 운세 섹션 다음 관상은 히어로 아래 이미 노출 */}
          {cat.id==="unse"&&<div/>}
          <div className="divider"/>
        </div>
      ))}
      ))}

      {/* 후기 */}
      <div className="sec"><div className="sec-t">💬 실시간 후기</div></div>
      <div className="rv-wrap">
        <div className="rv-track">
          {[...REVIEWS,...REVIEWS].map((r,i)=>(
            <div key={i} className="rv-card"><div className="rv-stars">{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</div><div className="rv-text">{r.text}</div><div className="rv-author">{r.author}</div></div>
          ))}
        </div>
      </div>

      {gwanzalOpen&&<GwansangZalModal onClose={()=>setGwanzalOpen(false)} savedPersons={savedPersons} setSavedPersons={setSavedPersons} cart={cart} setCart={setCart} onGoShop={onGoShop} addHistory={addHistory}/>}
      {todayModal==="unse"    &&<TodayUnseModal  onClose={()=>setTodayModal(null)} cart={cart} setCart={setCart} onGoShop={onGoShop} isLoggedIn={isLoggedIn}/>}
      {todayModal==="tarot"   &&<TodayTarotModal onClose={()=>setTodayModal(null)} cart={cart} setCart={setCart} onGoShop={onGoShop}/>}
      {todayModal==="yesno"   &&<YesNoTarotModal onClose={()=>setTodayModal(null)} cart={cart} setCart={setCart} onGoShop={onGoShop}/>}
      {todayModal==="dream"   &&<DreamModal      onClose={()=>setTodayModal(null)} cart={cart} setCart={setCart} onGoShop={onGoShop}/>}
      {todayModal==="lotto"   &&<LottoModal      onClose={()=>setTodayModal(null)} cart={cart} setCart={setCart} onGoShop={onGoShop}/>}
      {todayModal==="monthly" &&<MonthlyModal    onClose={()=>setTodayModal(null)} cart={cart} setCart={setCart} onGoShop={onGoShop}/>}
    </div>
  );
}

function CartCouponBox(){
  const[show,setShow]=useState(false);
  const[code,setCode]=useState("");
  const[applied,setApplied]=useState(null);
  const[err,setErr]=useState("");
  function apply(){
    const c=DEMO_COUPONS[code.trim().toUpperCase()];
    if(c){setApplied(c);setErr("");}
    else{setErr("유효하지 않은 쿠폰 번호예요");setApplied(null);}
  }
  if(applied) return(
    <div style={{background:"rgba(95,196,158,0.08)",border:"1px solid rgba(95,196,158,0.2)",borderRadius:12,padding:"10px 13px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"var(--jade)"}}>✓ 쿠폰 적용됨</div><div style={{fontSize:11,color:"var(--mist)",marginTop:1}}>{applied.label}</div></div>
      <button style={{background:"none",border:"none",color:"rgba(200,196,216,0.3)",cursor:"pointer",fontSize:18}} onClick={()=>{setApplied(null);setCode("");setShow(false);}}>✕</button>
    </div>
  );
  if(!show) return(
    <button style={{width:"100%",padding:"10px",background:"transparent",border:"1px dashed rgba(232,200,122,0.2)",borderRadius:12,color:"rgba(200,196,216,0.5)",fontFamily:"inherit",fontSize:12,cursor:"pointer",marginBottom:12}} onClick={()=>setShow(true)}>
      🎁 쿠폰 번호가 있어요
    </button>
  );
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",gap:8}}>
        <input className="inp" style={{marginBottom:0,flex:1,borderColor:err?"rgba(244,124,90,0.5)":""}}
          placeholder="쿠폰 번호 입력" value={code} onChange={e=>setCode(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&apply()}/>
        <button style={{padding:"10px 14px",background:"var(--ink3)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:11,color:"var(--gold)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}} onClick={apply}>적용</button>
      </div>
      {err&&<div style={{fontSize:11,color:"var(--coral)",marginTop:5}}>⚠️ {err}</div>}
    </div>
  );
}

function GoodsPage({cart,setCart,userHistory,onGoHome}){
  const[cat,setCat]=useState("추천");
  const topRef=useRef(null);
  const[sort,setSort]=useState("추천순");
  const[detail,setDetail]=useState(null);
  const[showCart,setShowCart]=useState(false);
  const[showSort,setShowSort]=useState(false);
  const cartCount=cart.reduce((s,c)=>s+c.qty,0);
  const cartTotal=cart.reduce((s,c)=>s+c.price*c.qty,0);

  const SORT_OPTS = ["추천순","인기순","신상품","가격낮은순","가격높은순"];

  function applySort(items, s){
    const arr=[...items];
    if(s==="가격낮은순")  return arr.sort((a,b)=>a.price-b.price);
    if(s==="가격높은순")  return arr.sort((a,b)=>b.price-a.price);
    if(s==="신상품")      return arr.sort((a,b)=>b.id-a.id);
    if(s==="인기순")      return arr.sort((a,b)=>(b.sale||0)-(a.sale||0));
    return arr; // 추천순 — 기본
  }

  const base = (() => {
    if(cat==="추천") return getPersonalizedGoods(userHistory);
    if(cat==="전체") return GOODS_DATA;
    if(cat==="5800") return GOODS_DATA.filter(g=>g.price<=5800).sort((a,b)=>a.price-b.price);
    if(cat==="9800") return GOODS_DATA.filter(g=>g.price<=9800).sort((a,b)=>a.price-b.price);
    return GOODS_DATA.filter(g=>g.cat===cat);
  })();
  const filtered = applySort(base, sort);

  function addCart(item){setCart(prev=>{const ex=prev.find(c=>c.id===item.id);return ex?prev.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...prev,{...item,qty:1}];});setDetail(null);}

  // 카테고리 5줄 그룹핑
  const CAT_ROW1 = GOODS_CATS.slice(0, 6);   // 빠른접근 (6개)
  const CAT_ROW2 = GOODS_CATS.slice(6, 13);  // 나의 유형 (7개)
  const CAT_ROW3 = GOODS_CATS.slice(13, 19); // 기운·정화 (6개)
  const CAT_ROW4 = GOODS_CATS.slice(19, 25); // 테마샵 (6개)
  const CAT_ROW5 = GOODS_CATS.slice(25);     // 라이프·패션 (6개)

  return(
    <div className="page" ref={topRef}>
      <div style={{padding:"20px 18px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontSize:20,fontWeight:900,marginBottom:2}}>🛍️ 개운 굿즈샵</div><div style={{fontSize:12,color:"var(--mist)"}}>5,800원↓ · 9,800원↓ · 프리미엄까지</div></div>
        <button style={{position:"relative",background:"var(--ink3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"9px 14px",cursor:"pointer",color:"var(--white)",fontFamily:"inherit",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}} onClick={()=>setShowCart(true)}>
          🛒{cartCount>0&&<span style={{background:"var(--blush)",color:"var(--ink)",fontSize:9,fontWeight:900,minWidth:16,height:16,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{cartCount}</span>}
        </button>
      </div>

      {/* 카테고리 탭 5줄 */}
      <div style={{padding:"0 0 2px"}}>
        {[
          {row:CAT_ROW1, label:"빠른접근"},
          {row:CAT_ROW2, label:"나의 유형"},
          {row:CAT_ROW3, label:"기운·정화"},
          {row:CAT_ROW4, label:"테마샵"},
          {row:CAT_ROW5, label:"라이프·패션"},
        ].map(({row,label},ri)=>(
          <div key={label}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"0 18px 2px"}}>
              <span style={{fontSize:9,color:"rgba(200,196,216,0.3)",fontWeight:700,flexShrink:0,letterSpacing:"0.3px"}}>{label}</span>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,0.04)"}}/>
            </div>
            <div className="goods-cat-scroll" style={{marginBottom:ri<4?4:0}}>
              {row.map(c=><button key={c.id} className={`gcat-btn${cat===c.id?" on":""}`} onClick={()=>{setCat(c.id);setShowSort(false);}}>{c.label}</button>)}
            </div>
          </div>
        ))}
        {/* 정렬 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"6px 18px 0",position:"relative"}}>
          <button style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:"var(--ink3)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,color:"var(--mist)",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>setShowSort(v=>!v)}>
            ⇅ {sort}
          </button>
          {showSort&&(
            <div style={{position:"absolute",top:"calc(100% + 4px)",right:18,zIndex:50,background:"var(--ink2)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",minWidth:150}} onClick={e=>e.stopPropagation()}>
              {SORT_OPTS.map(s=>(
                <button key={s} style={{width:"100%",padding:"11px 16px",background:sort===s?"rgba(232,200,122,0.1)":"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.04)",color:sort===s?"var(--gold)":"var(--mist)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"left"}} onClick={()=>{setSort(s);setShowSort(false);}}>
                  {sort===s?"✓ ":""}{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 카테고리별 배너 */}
      {/* ── 탭별 CTA 배너 (클릭 시 홈 콘텐츠 연결) ── */}
      {(() => {
        const CtaBanner = ({bg, border, titleColor, title, desc, btnLabel, onBtn}) => (
          <div style={{background:bg, border:`1px solid ${border}`, borderRadius:14, margin:"8px 18px 10px", padding:"11px 14px"}}>
            <div style={{fontSize:13,fontWeight:900,color:titleColor,marginBottom:2}}>{title}</div>
            <div style={{fontSize:11,color:"var(--mist)",marginBottom:btnLabel?8:0}}>{desc}</div>
            {btnLabel&&onBtn&&<button onClick={onBtn} style={{padding:"5px 13px",borderRadius:20,border:"none",background:titleColor,color:"var(--ink)",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",opacity:0.9}}>{btnLabel} →</button>}
          </div>
        );
        const go = onGoHome;
        if(cat==="5800")     return <CtaBanner bg="rgba(95,196,158,0.07)"   border="rgba(95,196,158,0.15)"   titleColor="var(--jade)"   title="🏷️ 5,800원 이하 특가"     desc="부담 없이 시작하는 개운 첫 걸음 · 재구매율 1위 가격대"/>;
        if(cat==="9800")     return <CtaBanner bg="rgba(95,196,158,0.07)"   border="rgba(95,196,158,0.15)"   titleColor="var(--jade)"   title="🏷️ 9,800원 이하 베스트"    desc="선물하기 딱 좋은 가격 · 가장 많이 팔리는 구간"/>;
        if(cat==="내맞춤"||cat==="추천") return userHistory.length>0
          ?<CtaBanner bg="linear-gradient(135deg,rgba(232,200,122,0.09),rgba(155,143,212,0.06))" border="rgba(232,200,122,0.18)" titleColor="var(--gold)" title="✨ 내 운세 기록 기반 맞춤 추천" desc={`${userHistory.map(h=>h.name).slice(0,3).join(" · ")} 결과를 종합했어요`}/>
          :<CtaBanner bg="var(--ink3)" border="rgba(255,255,255,0.05)" titleColor="var(--mist)" title="✨ 내 맞춤 굿즈" desc="사주·관상·띠별 등을 이용하면 맞춤 굿즈가 자동으로 추천돼요" btnLabel="운세 먼저 보기" onBtn={go}/>;
        if(cat==="시즌")     return <CtaBanner bg="rgba(244,124,90,0.07)"   border="rgba(244,124,90,0.18)"   titleColor="var(--coral)"  title="🎋 시즌 한정 · 재입고 없음" desc="⏳ 한정 수량 소진 시 종료 · 지금 아니면 못 사요"/>;
        if(cat==="영수형")   return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="🐉 내 12수호신이 뭔지 모른다면?" desc="나의 천기 리포트를 먼저 확인해보세요" btnLabel="천기 리포트 (무료)" onBtn={go}/>;
        if(cat==="띠별")     return <CtaBanner bg="rgba(232,200,122,0.07)"  border="rgba(232,200,122,0.15)"  titleColor="var(--gold)"   title="🐴 붉은 말의 해 태어난 아기!" desc="2026년생 아이 첫 사주가 궁금하다면?" btnLabel="사주 풀이 보기" onBtn={go}/>;
        if(cat==="별자리")   return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="⭐ 경계선 생일이라면?" desc="별자리가 헷갈린다면 정확한 별자리를 먼저 확인하세요" btnLabel="별자리 운세 (무료)" onBtn={go}/>;
        if(cat==="혈액형")   return <CtaBanner bg="rgba(245,184,196,0.07)"  border="rgba(245,184,196,0.15)"  titleColor="var(--blush)"  title="🩸 혈액형별 성격 & 개운 아이템" desc="혈액형 무료 운세도 함께 확인해보세요!" btnLabel="혈액형 운세 (무료)" onBtn={go}/>;
        if(cat==="기질도")   return <CtaBanner bg="rgba(95,196,158,0.07)"   border="rgba(95,196,158,0.15)"   titleColor="var(--jade)"   title="🧬 내 기질 유형을 모른다면?" desc="기질 테스트로 먼저 확인하고 맞는 굿즈를 찾아보세요!" btnLabel="기질 테스트 보기" onBtn={go}/>;
        if(cat==="전생유형") return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="⏳ 내 전생이 궁금하다면?" desc="전생 운세로 나의 전생 유형을 먼저 확인해보세요" btnLabel="전생 운세 보기" onBtn={go}/>;
        if(cat==="수비학")   return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="🔢 전 세계 유행 수비학" desc="내 운명수를 아직 모른다면?" btnLabel="수비학 분석 (980원)" onBtn={go}/>;
        if(cat==="오행보완") return <CtaBanner bg="rgba(95,196,158,0.07)"   border="rgba(95,196,158,0.15)"   titleColor="var(--jade)"   title="🔥 내 사주에 부족한 오행은?" desc="모른다면 사주 풀이로 먼저 확인 → 딱 맞는 보완 굿즈 추천" btnLabel="사주 풀이 보기" onBtn={go}/>;
        if(cat==="기운회복") return <CtaBanner bg="rgba(232,200,122,0.07)"  border="rgba(232,200,122,0.15)"  titleColor="var(--gold)"   title="✨ 기운이 떨어졌다고 느껴진다면" desc="오늘의 수호 기운과 함께 사용하면 효과가 더 좋아요!" btnLabel="오늘의 수호 기운 보기" onBtn={go}/>;
        if(cat==="기운보강") return <CtaBanner bg="rgba(232,200,122,0.07)"  border="rgba(232,200,122,0.15)"  titleColor="var(--gold)"   title="💪 기운을 더 강하게!" desc="사주에서 강화해야 할 기운을 알고 쓰면 훨씬 효과적이에요" btnLabel="사주 풀이 보기" onBtn={go}/>;
        if(cat==="집안정화") return <CtaBanner bg="rgba(95,196,158,0.07)"   border="rgba(95,196,158,0.15)"   titleColor="var(--jade)"   title="🧹 공간의 기운을 바꾸고 싶다면" desc="이사·개업 전후로 공간 정화를 하면 좋은 기운이 시작돼요"/>;
        if(cat==="미니부적") return <CtaBanner bg="rgba(232,200,122,0.07)"  border="rgba(232,200,122,0.15)"  titleColor="var(--gold)"   title="🧧 작지만 강한 수호 부적" desc="지갑·가방·책상에 하나씩 · 일상 속 개운 루틴"/>;
        if(cat==="명상향")   return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="🕯️ 향으로 마음과 공간을 정화" desc="명상·수면·집중력 향상에 도움되는 향 아이템"/>;
        if(cat==="커플")     return <CtaBanner bg="rgba(245,184,196,0.07)"  border="rgba(245,184,196,0.15)"  titleColor="var(--blush)"  title="💌 그 사람이랑 진짜 잘 맞을까?" desc="선물 전에 궁합부터 확인해봐요" btnLabel="연애운·궁합 보기" onBtn={go}/>;
        if(cat==="럭키")     return <CtaBanner bg="rgba(232,200,122,0.07)"  border="rgba(232,200,122,0.15)"  titleColor="var(--gold)"   title="🍀 행운을 부르는 아이템" desc="오늘의 수호 기운과 함께 쓰면 효과 두 배!" btnLabel="오늘의 수호 기운 보기" onBtn={go}/>;
        if(cat==="이사개업") return <CtaBanner bg="rgba(95,196,158,0.07)"   border="rgba(95,196,158,0.15)"   titleColor="var(--jade)"   title="🏡 이사·개업 날짜, 사주로 잡아볼까?" desc="좋은 날 고른 다음 개운 굿즈로 마무리!" btnLabel="사주 풀이 보기" onBtn={go}/>;
        if(cat==="집안수호신") return <CtaBanner bg="rgba(232,200,122,0.07)" border="rgba(232,200,122,0.15)" titleColor="var(--gold)"  title="🏠 집을 지키는 수호신" desc="내 집에 맞는 수호신 굿즈로 가정의 평화와 재물운을 지키세요"/>;
        if(cat==="종교영성") return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="⛩️ 영성과 신앙을 위한 아이템" desc="종교를 넘어 마음의 평화를 찾는 모든 분께"/>;
        if(cat==="아기육아") return <CtaBanner bg="rgba(232,200,122,0.07)"  border="rgba(232,200,122,0.15)"  titleColor="var(--gold)"   title="🌱 붉은 말의 해 태어난 아이!" desc="2026년생 아기의 사주와 첫 수호 굿즈" btnLabel="아이 사주 보기" onBtn={go}/>;
        if(cat==="반려동물") return <CtaBanner bg="rgba(244,124,90,0.07)"   border="rgba(244,124,90,0.15)"   titleColor="var(--coral)"  title="🐾 우리 아이 수호 굿즈" desc="반려동물의 건강과 행복을 기원하는 아이템"/>;
        if(cat==="주얼리")   return <CtaBanner bg="rgba(232,200,122,0.07)"  border="rgba(232,200,122,0.15)"  titleColor="var(--gold)"   title="💍 천기 주얼리" desc="매일 착용하는 주얼리로 기운을 더해보세요 · 선물로도 최고"/>;
        if(cat==="의류")     return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="👗 천기 브랜드 굿즈" desc="천기의 기운을 담은 의류·패션 아이템"/>;
        if(cat==="헤나키트") return <CtaBanner bg="rgba(245,184,196,0.07)"  border="rgba(245,184,196,0.15)"  titleColor="var(--blush)"  title="🪄 손금·점 아트 키트" desc="내 손바닥에 직접 그리는 개운 헤나 · 얼굴점 찍기 키트" btnLabel="손금 분석 먼저 보기" onBtn={go}/>;
        if(cat==="프리미엄")   return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.18)"  titleColor="var(--violet)" title="💎 프리미엄 컬렉션" desc="진짜 천연석·수제 공예품 · 소장 가치 있는 개운 아이템"/>;
        if(cat==="외국부적")   return <CtaBanner bg="rgba(68,136,255,0.07)"   border="rgba(68,136,255,0.14)"   titleColor="#7aadff"       title="🌍 세계의 부적·개운 아이템" desc="나자르·함사·마네키네코·클로버 등 세계 전통 수호 아이템"/>;
        if(cat==="운세점사")   return <CtaBanner bg="rgba(155,143,212,0.07)"  border="rgba(155,143,212,0.15)"  titleColor="var(--violet)" title="🔮 운세·점사 아이템" desc="타로덱·오라클·점술 도구 · 나만의 점술 루틴을 만들어보세요" btnLabel="오늘의 타로 보기" onBtn={go}/>;
        return null;
      })()}

      <div className="goods-grid">
        {filtered.length===0
          ?<div style={{gridColumn:"1/-1",textAlign:"center",padding:"48px 20px",color:"var(--mist)",fontSize:13}}><div style={{fontSize:40,marginBottom:12}}>🔍</div>해당 카테고리 상품 준비 중이에요!</div>
          :filtered.map(g=>(
          <div key={g.id} className="gc" onClick={()=>setDetail(g)}>
            <div className="gc-img" style={{background:g.color||"var(--ink3)"}}>
              {g.sale&&<div className="gc-badge-tl" style={{background:"var(--coral)",color:"#fff"}}>-{g.sale}%</div>}
              {g.rec&&cat==="추천"&&<div className="gc-badge-tr">맞춤</div>}
              {g.icon}
            </div>
            <div className="gc-info">
              <div className="gc-cat-lbl">{g.cat}</div>
              <div className="gc-name">{g.name}</div>
              <div><span className="gc-price">{g.price.toLocaleString()}원</span>{g.orig&&<span className="gc-orig">{g.orig.toLocaleString()}원</span>}</div>
            </div>
          </div>
        ))}
      </div>


      {/* 맨 위로 플로팅 버튼 */}
      <button onClick={()=>topRef.current?.scrollIntoView({behavior:"smooth"})}
        style={{position:"fixed",right:18,bottom:96,zIndex:90,width:44,height:44,borderRadius:"50%",background:"var(--ink2)",border:"1px solid rgba(232,200,122,0.25)",color:"var(--gold)",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",backdropFilter:"blur(8px)"}}>
        ↑
      </button>

      {detail&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setDetail(null);}}>
          <div className="md"><div className="hd"/>
            <div style={{textAlign:"center",fontSize:68,padding:"16px 0 12px",background:detail.color||"var(--ink3)",borderRadius:14,marginBottom:14}}>{detail.icon}</div>
            <div className="mt">{detail.name}</div>
            <div style={{fontSize:21,fontWeight:900,color:"var(--gold)",marginBottom:14}}>{detail.price.toLocaleString()}원{detail.orig&&<span style={{fontSize:12,color:"rgba(200,196,216,0.35)",textDecoration:"line-through",marginLeft:7}}>{detail.orig.toLocaleString()}원</span>}</div>
            {detail.ohaeng&&<div className="res-card"><div className="res-lbl">✦ 오행 보완 효과</div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{OHAENG[detail.ohaeng]?.emoji}</span><div><div style={{fontSize:12,fontWeight:700}}>{OHAENG[detail.ohaeng]?.label} 기운 보완</div><div style={{fontSize:11,color:"var(--mist)"}}>{OHAENG[detail.ohaeng]?.desc}</div></div></div></div>}
            {detail.tags&&<div className="res-card"><div className="res-lbl">✦ 기대 효과</div><div className="tag-row">{detail.tags.map(t=><span key={t} className="tag tg">{t}</span>)}</div></div>}
            <button className="btn btn-p" onClick={()=>addCart(detail)}>장바구니 담기</button>
            <button className="btn btn-coral btn-sm" style={{marginTop:8}} onClick={()=>{addCart(detail);setShowCart(true);}}>바로 구매</button>
            <button className="btn btn-g" onClick={()=>setDetail(null)}>닫기</button>
          </div>
        </div>
      )}

      {showCart&&(
        <div className="ov" onClick={e=>{if(e.target===e.currentTarget)setShowCart(false);}}>
          <div className="md"><div className="hd"/>
            <div className="mt">🛒 장바구니</div>
            <div className="ms">{cart.length===0?"담긴 상품 없음":`총 ${cartCount}개`}</div>
            {cart.length===0?<div style={{textAlign:"center",padding:"32px 0",fontSize:44}}>🛒</div>:<>
              {cart.map(item=>(
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:9,padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{width:44,height:44,background:item.color||"var(--ink3)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{item.name}</div>
                    <div style={{fontSize:12,fontWeight:900,color:"var(--gold)"}}>{item.price.toLocaleString()}원</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                      <button style={{width:22,height:22,borderRadius:6,background:"var(--ink4)",border:"none",color:"var(--white)",cursor:"pointer",fontSize:13}} onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:Math.max(1,c.qty-1)}:c))}>−</button>
                      <span style={{fontSize:12,fontWeight:900,minWidth:16,textAlign:"center"}}>{item.qty}</span>
                      <button style={{width:22,height:22,borderRadius:6,background:"var(--ink4)",border:"none",color:"var(--white)",cursor:"pointer",fontSize:13}} onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c))}>+</button>
                    </div>
                  </div>
                  <button style={{background:"none",border:"none",color:"rgba(200,196,216,0.25)",cursor:"pointer",fontSize:15,padding:4}} onClick={()=>setCart(p=>p.filter(c=>c.id!==item.id))}>✕</button>
                </div>
              ))}
              <div className="price-box" style={{marginTop:12}}>
                <div className="pr"><span>합계</span><span>{cartTotal.toLocaleString()}원</span></div>
                <div className="pr"><span>배송비</span><span style={{color:"var(--jade)"}}>무료</span></div>
                <div className="pr tot"><span>결제금액</span><span>{cartTotal.toLocaleString()}원</span></div>
              </div>
              {/* 굿즈샵 쿠폰 */}
              <CartCouponBox/>
              <button className="btn btn-p">결제하기 →</button>
            </>}
            <button className="btn btn-g" onClick={()=>setShowCart(false)}>계속 쇼핑</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MyPage({isLoggedIn,onLogin,onLogout,savedPersons,userHistory,cart,setCart,onGoShop}){
  const[showHist,setShowHist]=useState(false);const[showPersons,setShowPersons]=useState(false);
  if(!isLoggedIn)return(
    <div className="page">
      <div style={{padding:"56px 20px 0",textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:14}}>🔮</div>
        <div style={{fontSize:19,fontWeight:900,marginBottom:7}}>로그인이 필요해요</div>
        <div style={{fontSize:13,color:"var(--mist)",marginBottom:26,lineHeight:1.7}}>로그인하면 내 운세 기록과<br/>저장된 인물을 관리할 수 있어요</div>
        <button className="social-btn kakao" onClick={onLogin}>🟡 카카오로 시작하기</button>
        <button className="social-btn google" onClick={onLogin}>🔵 구글로 시작하기</button>
      </div>
    </div>
  );
  const personal = getPersonalizedGoods(userHistory).slice(0,4);
  return(
    <div className="page">
      <div className="my-top">
        <div className="my-avatar">🔮</div>
        <div className="my-name">운세 탐험가</div>
        <div className="my-email">user@example.com</div>
        {/* 고객 표시 등급 + 공유 배지 */}
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:9,flexWrap:"wrap"}}>
          <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"linear-gradient(135deg,rgba(232,200,122,0.2),rgba(155,143,212,0.15))",border:"1px solid rgba(232,200,122,0.3)",color:"var(--gold)"}}>🌱 새싹</span>
          <span className="tag tg">주작형 🔥</span>
          <span className="tag tj">화(火) 일간</span>
        </div>
        {/* 다음 등급 안내 */}
        <div style={{fontSize:10,color:"rgba(200,196,216,0.35)",marginTop:6}}>
          유료 콘텐츠 1개 이용하면 🌙 달빛으로 업그레이드!
        </div>
      </div>
      <div className="my-stats">
        {[["기록",`${userHistory.length}건`],["저장 인물",`${savedPersons.length}명`],["포인트","1,200P"]].map(([l,v])=>(
          <div key={l} className="my-stat"><div className="my-stat-num">{v}</div><div className="my-stat-lbl">{l}</div></div>
        ))}
      </div>

      {/* 맞춤 굿즈 섹션 */}
      {personal.length>0&&(
        <div style={{padding:"0 18px 4px"}}>
          <div style={{fontSize:13,fontWeight:900,marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
            🛍️ 내 운세 기반 굿즈 추천
            <span style={{flex:1,height:1,background:"linear-gradient(to right,rgba(232,200,122,0.15),transparent)",display:"block"}}/>
          </div>
          <div style={{display:"flex",gap:9,overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}}>
            {personal.map(g=>(
              <div key={g.id} style={{flexShrink:0,width:100,background:"var(--ink2)",borderRadius:14,overflow:"hidden",border:"1px solid rgba(232,200,122,0.1)",cursor:"pointer"}} onClick={onGoShop}>
                <div style={{height:70,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,background:g.color||"var(--ink3)"}}>{g.icon}</div>
                <div style={{padding:"7px 8px"}}><div style={{fontSize:9,fontWeight:700,marginBottom:2,lineHeight:1.3}}>{g.name}</div><div style={{fontSize:11,fontWeight:900,color:"var(--gold)"}}>{(g.price/1000).toFixed(1)}k</div></div>
              </div>
            ))}
            <div style={{flexShrink:0,width:60,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--gold)",fontSize:24}} onClick={onGoShop}>→</div>
          </div>
        </div>
      )}

      <div className="my-menu">
        <div className="my-row" onClick={()=>setShowHist(!showHist)}>
          <div className="my-row-l"><span>📋</span><span>내 운세 기록</span></div>
          <div className="my-row-r"><span>{userHistory.length}건</span><span style={{fontSize:13,color:"rgba(200,196,216,0.25)"}}>›</span></div>
        </div>
        {showHist&&<div style={{paddingBottom:8}}>
          {userHistory.length===0?<div style={{fontSize:12,color:"var(--mist)",padding:"10px 0",textAlign:"center"}}>아직 기록이 없어요</div>
          :userHistory.map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{width:40,height:40,borderRadius:11,background:"var(--ink3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{h.icon}</div>
              <div><div style={{fontSize:12,fontWeight:700}}>{h.name}</div><div style={{fontSize:10,color:"var(--mist)"}}>{h.person||"나"}</div></div>
              <div style={{fontSize:10,color:"rgba(200,196,216,0.3)",marginLeft:"auto"}}>{h.date}</div>
            </div>
          ))}
        </div>}
        <div className="my-row" onClick={()=>setShowPersons(!showPersons)}>
          <div className="my-row-l"><span>👥</span><span>저장된 인물</span></div>
          <div className="my-row-r"><span>{savedPersons.length}명</span><span style={{fontSize:13,color:"rgba(200,196,216,0.25)"}}>›</span></div>
        </div>
        {showPersons&&<div style={{paddingBottom:8}}>
          {savedPersons.length===0?<div style={{fontSize:12,color:"var(--mist)",padding:"10px 0",textAlign:"center"}}>저장된 인물이 없어요</div>
          :savedPersons.map((p,i)=><div key={i} className="person-card" style={{marginTop:6}}><div className="person-avatar">{p.icon}</div><div><div style={{fontSize:13,fontWeight:700}}>{p.name}</div><div style={{fontSize:10,color:"var(--mist)"}}>{p.date}</div></div><span style={{marginLeft:"auto",fontSize:11,color:"var(--jade)"}}>재분석 무료</span></div>)}
        </div>}
        {[["🎁","쿠폰함","1장"],["🔔","알림 설정",null],["📦","주문 내역·배송 조회",null],["↩️","환불 신청",null],["🔒","계정 보안",null]].map(([ic,lb,right])=>(
          <div key={lb} className="my-row">
            <div className="my-row-l"><span>{ic}</span><span>{lb}</span></div>
            <div className="my-row-r">{right&&<span className="my-badge">{right}</span>}<span style={{fontSize:13,color:"rgba(200,196,216,0.25)"}}>›</span></div>
          </div>
        ))}
      </div>

      {/* 출석 이벤트 */}
      <div style={{padding:"14px 18px 4px"}}>
        <div style={{fontSize:13,fontWeight:900,marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
          🗓️ 출석 이벤트
          <span style={{flex:1,height:1,background:"linear-gradient(to right,rgba(232,200,122,0.15),transparent)",display:"block"}}/>
        </div>
        <div style={{background:"var(--ink2)",borderRadius:16,padding:"14px",border:"1px solid rgba(232,200,122,0.1)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700}}>30일 개근 챌린지</div>
            <div style={{fontSize:11,color:"var(--gold)",fontWeight:700}}>3/30일 완료</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:10}}>
            {Array.from({length:30},(_,i)=>(
              <div key={i} style={{aspectRatio:"1",borderRadius:6,background:i<3?"rgba(95,196,158,0.3)":"var(--ink3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:i<3?"var(--jade)":"rgba(200,196,216,0.2)",fontWeight:700}}>
                {i<3?"✓":i+1}
              </div>
            ))}
          </div>
          <div style={{background:"rgba(232,200,122,0.07)",borderRadius:10,padding:"9px 12px",fontSize:11,color:"var(--mist)",lineHeight:1.6}}>
            🎁 30일 개근 달성 시 <strong style={{color:"var(--gold)"}}>특별 제작 부적 3종 세트</strong> 실물 발송!
          </div>
        </div>
      </div>

      {/* 공유 배지 */}
      <div style={{padding:"14px 18px 4px"}}>
        <div style={{fontSize:13,fontWeight:900,marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
          🔗 공유 배지
          <span style={{flex:1,height:1,background:"linear-gradient(to right,rgba(232,200,122,0.15),transparent)",display:"block"}}/>
        </div>
        <div style={{background:"var(--ink2)",borderRadius:16,padding:"14px",border:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:12,fontWeight:700}}>현재 등급</div>
              <div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>👤 기본 회원 · 0회 공유</div>
            </div>
            <div style={{fontSize:11,color:"var(--jade)",fontWeight:700}}>1회만 더! →</div>
          </div>
          {SHARE_LEVELS.slice(1).map((l,i,arr)=>(
            <div key={l.label} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <span style={{fontSize:20,flexShrink:0,marginTop:1}}>{l.icon}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{fontSize:12,fontWeight:700}}>{l.label}</div>
                  <div style={{fontSize:10,color:"rgba(200,196,216,0.4)"}}>{l.min}회{l.max<999?`~${l.max}회`:"+"}</div>
                </div>
                <div style={{fontSize:11,color:"var(--gold)",marginTop:2}}>{l.reward}</div>
                {l.min===5&&<div style={{fontSize:10,color:"rgba(200,196,216,0.35)",marginTop:2}}>연애운·재물운·합격운 중 1개 선택</div>}
              </div>
              <div style={{fontSize:11,color:"rgba(200,196,216,0.2)"}}>0/{l.min}</div>
            </div>
          ))}
          <button className="btn btn-sm btn-p" style={{marginTop:12}}>결과 공유하고 배지 받기 →</button>
        </div>
      </div>

      {/* 고객센터 */}
      <div style={{padding:"14px 18px 4px"}}>
        <div style={{fontSize:13,fontWeight:900,marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
          💬 고객센터
          <span style={{flex:1,height:1,background:"linear-gradient(to right,rgba(232,200,122,0.15),transparent)",display:"block"}}/>
        </div>
        <div style={{background:"var(--ink2)",borderRadius:16,border:"1px solid rgba(255,255,255,0.05)"}}>
          {[
            ["❓","자주 묻는 질문 (FAQ)"],
            ["✉️","문의하기"],
            ["📄","이용약관"],
            ["🔐","개인정보처리방침"],
          ].map(([ic,lb],i,arr)=>(
            <div key={lb} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 14px",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.04)":"none",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:9,fontSize:13}}><span>{ic}</span><span>{lb}</span></div>
              <span style={{fontSize:13,color:"rgba(200,196,216,0.25)"}}>›</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 18px 8px"}}>
        <button className="btn btn-sm" style={{background:"transparent",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(200,196,216,0.35)",fontSize:12}} onClick={onLogout}>로그아웃</button>
      </div>
    </div>
  );
}

function AuthModal({onClose,onSuccess}){
  const[loading,setLoading]=useState(false);
  const[agree,setAgree]=useState(false);
  const[err,setErr]=useState("");

  function socialGo(){
    if(!agree){setErr("이용약관에 동의해주세요");return;}
    setErr("");
    setLoading(true);
    setTimeout(()=>{setLoading(false);onSuccess();},900);
  }

  return(
    <div className="ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="md"><div className="hd"/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:32,marginBottom:8}}>🔮</div>
          <div style={{fontSize:18,fontWeight:900,marginBottom:4}}>천기 시작하기</div>
          <div style={{fontSize:12,color:"var(--mist)"}}>로그인하면 운세 기록이 저장돼요</div>
        </div>

        <button className="social-btn kakao" onClick={socialGo} style={{opacity:loading?0.6:1}}>
          🟡 카카오로 시작하기
        </button>
        <button className="social-btn google" onClick={socialGo} style={{opacity:loading?0.6:1}}>
          🔵 구글로 시작하기
        </button>

        <div style={{background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.12)",borderRadius:11,padding:"10px 13px",marginBottom:16,fontSize:11,color:"var(--mist)",lineHeight:1.7}}>
          💡 이름·이메일이 <strong style={{color:"var(--white)"}}>자동으로 입력</strong>돼요<br/>
          전화번호는 결제 시 따로 입력해요
        </div>

        {/* 약관 동의 */}
        <div style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:14,cursor:"pointer"}} onClick={()=>{setAgree(v=>!v);setErr("");}}>
          <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${agree?"var(--jade)":"rgba(255,255,255,0.15)"}`,background:agree?"var(--jade)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .18s"}}>
            {agree&&<span style={{fontSize:11,color:"var(--ink)",fontWeight:900}}>✓</span>}
          </div>
          <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.6}}>
            <span style={{color:"var(--gold)",fontWeight:700}}>이용약관</span> 및 <span style={{color:"var(--gold)",fontWeight:700}}>개인정보처리방침</span>에 동의합니다 (필수)
          </div>
        </div>

        {err&&<div style={{fontSize:11,color:"var(--coral)",marginBottom:10,textAlign:"center"}}>⚠️ {err}</div>}
        {loading&&<Dots/>}
        <button className="btn btn-g" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default function App(){
  const[tab,setTab]=useState("home");
  const[modal,setModal]=useState(null);
  const[authOpen,setAuthOpen]=useState(false);
  const[isLoggedIn,setIsLoggedIn]=useState(false);
  const[cart,setCart]=useState([]);
  const[savedPersons,setSavedPersons]=useState([]);
  const[userHistory,setUserHistory]=useState([]);
  const cartCount=cart.reduce((s,c)=>s+c.qty,0);

  // 이용 기록 추가
  const addHistory = useCallback((entry)=>{
    setUserHistory(prev=>[entry,...prev].slice(0,20));
  },[]);

  function goShop(){setTab("goods");}

  function handleSvc(svc){
    if(svc.coming){setModal({...svc,_coming:true});return;}
    if(!isLoggedIn&&!svc.free&&svc.price!=="무료"){setAuthOpen(true);return;}
    setModal(svc);
  }

  function renderModal(){
    if(!modal) return null;
    if(modal._coming) return <ComingModal svc={modal} onClose={()=>setModal(null)}/>;
    const props={onClose:()=>setModal(null),cart,setCart,onGoShop:goShop,addHistory,isLoggedIn};
    const specialMap={
      gwansang_zal: <GwansangZalModal {...props} savedPersons={savedPersons} setSavedPersons={setSavedPersons}/>,
      mole:         <MoleModal onClose={()=>setModal(null)} cart={cart} setCart={setCart} onGoShop={goShop} addHistory={addHistory} isLoggedIn={isLoggedIn}/>,
      pawdong:      <PawdongModal onClose={()=>setModal(null)} cart={cart} setCart={setCart} onGoShop={goShop} addHistory={addHistory} isLoggedIn={isLoggedIn}/>,
      ytype_intro:  <YtypeIntroModal onClose={()=>setModal(null)} onBuy={()=>setModal({id:"synthesis",icon:"🌟",name:"나의 천기 리포트",desc:"결제할수록 풍부해지는 내 운명 종합서",price:"무료",coming:false})}/>,
      synthesis:    <SynthesisModal {...props} userHistory={userHistory}/>,
      ddi:          <DdiModal {...props}/>,
      zodiac:       <ZodiacModal {...props}/>,
      blood:        <BloodModal {...props}/>,
      tarot_today:  <TodayTarotModal onClose={()=>setModal(null)} cart={cart} setCart={setCart} onGoShop={goShop}/>,
      dream:        <DreamModal onClose={()=>setModal(null)} cart={cart} setCart={setCart} onGoShop={goShop}/>,
      lotto:        <LottoModal onClose={()=>setModal(null)} cart={cart} setCart={setCart} onGoShop={goShop}/>,
    };
    return specialMap[modal.id] || <SvcModal svc={modal} {...props}/>;
  }

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <div className="app">
        <nav className="topnav">
          <div className="logo-wrap"><div className="logo-main">天機</div><div className="logo-sub">CHUNGI · 천기</div></div>
          <div className="nav-r">
            {cartCount>0&&<button style={{position:"relative",background:"none",border:"none",fontSize:20,cursor:"pointer",padding:4}} onClick={()=>setTab("goods")}>
              🛒<span style={{position:"absolute",top:-2,right:-4,background:"var(--blush)",color:"var(--ink)",fontSize:9,fontWeight:900,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>
            </button>}
            {!isLoggedIn
              ?<><button className="nbtn nb-o" onClick={()=>setAuthOpen(true)}>로그인</button><button className="nbtn nb-f" onClick={()=>setAuthOpen(true)}>가입</button></>
              :<button className="nbtn nb-o" onClick={()=>setTab("my")}>🔮 내 정보</button>
            }
          </div>
        </nav>

        {tab==="home"  &&<HomePage onSvc={handleSvc} isLoggedIn={isLoggedIn} savedPersons={savedPersons} setSavedPersons={setSavedPersons} cart={cart} setCart={setCart} onGoShop={goShop} addHistory={addHistory} userHistory={userHistory}/>}
        {tab==="goods" &&<GoodsPage cart={cart} setCart={setCart} userHistory={userHistory} onGoHome={()=>setTab("home")}/>}
        {tab==="my"    &&<MyPage isLoggedIn={isLoggedIn} onLogin={()=>setAuthOpen(true)} onLogout={()=>setIsLoggedIn(false)} savedPersons={savedPersons} userHistory={userHistory} cart={cart} setCart={setCart} onGoShop={goShop}/>}

        <nav className="btab">
          {[{id:"home",ic:"🏠",lb:"홈"},{id:"goods",ic:"🛍️",lb:"굿즈샵"},{id:"my",ic:"👤",lb:"내 정보"}].map(t=>(
            <button key={t.id} className={`ti${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
              <span className="ti-ic">{t.ic}</span><span className="ti-lb">{t.lb}</span>
            </button>
          ))}
        </nav>

        {renderModal()}
        {authOpen&&<AuthModal onClose={()=>setAuthOpen(false)} onSuccess={()=>{setIsLoggedIn(true);setAuthOpen(false);}}/>}
      </div>
    </>
  );
}
