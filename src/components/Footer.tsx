"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      width: "100%",
      maxWidth: 430,
      margin: "0 auto",
      backgroundColor: "var(--ink, #1A3C32)",
      padding: "0 0 70px",
    }}>
      {/* 일월오봉도 + 텍스트 나란히 */}
      <div style={{display:"flex",alignItems:"flex-end",padding:"0 14px"}}>
        {/* 왼쪽: 텍스트 */}
        <div style={{flex:1,paddingTop:48,paddingBottom:8}}>
          <div style={{ marginBottom: 6 }}>
            <Link href="/terms" style={{ color: "rgba(168, 196, 184, 0.5)", textDecoration: "none", fontSize: 10 }}>
              이용약관
            </Link>
            <span style={{ display: "inline", margin: "0 5px", color: "rgba(168, 196, 184, 0.25)" }}>|</span>
            <Link href="/privacy" style={{ color: "rgba(168, 196, 184, 0.5)", textDecoration: "none", fontSize: 10 }}>
              개인정보처리방침
            </Link>
          </div>

          <div style={{
            fontSize: 7,
            lineHeight: 1.5,
            color: "rgba(168, 196, 184, 0.3)",
          }}>
            상호: 리슨스튜디오<br />
            대표: 윤규미<br />
            사업자번호: 115-40-01646<br />
            통신판매업: 2026-의정부흥선-0098<br />
            이메일: listenstudio.inc@gmail.com
          </div>

          <div style={{
            fontSize: 6,
            color: "rgba(168, 196, 184, 0.2)",
            marginTop: 4,
          }}>
            © 2026 리슨스튜디오. All rights reserved.
          </div>
        </div>

        {/* 오른쪽: 일월오봉도 */}
        <img src="/img/gemini (5)_4.png" alt="" style={{width:"26%",display:"block",flexShrink:0}}/>
      </div>
    </footer>
  );
}
