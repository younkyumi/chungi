"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        minHeight: "100dvh",
        background: "#1A3C32",
        color: "#F4F1E1",
        fontFamily: "'Pretendard', 'Noto Serif KR', 'Apple SD Gothic Neo', sans-serif",
        padding: "0 20px 60px",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(26,60,50,0.95)",
          backdropFilter: "blur(16px)",
          padding: "16px 0",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "#D4AF37",
            borderRadius: 20,
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          &larr; 홈
        </button>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#D4AF37",
            fontFamily: "'RIDIBatang', serif",
            letterSpacing: 1,
          }}
        >
          개인정보처리방침
        </h1>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 24, lineHeight: 1.85, fontSize: 13.5 }}>
        <p style={{ color: "#A8C4B8", fontSize: 12, marginBottom: 12 }}>
          시행일: 2026년 3월 31일
        </p>
        <p style={{ color: "#ddd", fontSize: 13, marginBottom: 28 }}>
          리슨스튜디오(이하 &quot;회사&quot;)는 개인정보보호법 등 관련 법령에 따라
          이용자의 개인정보를 보호하고, 이와 관련된 고충을 신속하고 원활하게
          처리하기 위하여 다음과 같이 개인정보처리방침을 수립 및 공개합니다.
        </p>

        {/* 제1조 */}
        <Section title="제1조 (수집하는 개인정보)">
          <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
          <Table
            rows={[
              [
                "필수 수집 항목",
                "이메일 주소, 이름(닉네임), 소셜 로그인 식별 정보",
              ],
              ["서비스 이용 시", "생년월일, 성별, 태어난 시간(선택)"],
              [
                "결제 시",
                "결제 수단 정보(카드번호 일부, 결제 승인번호 등), 결제 일시",
              ],
              [
                "자동 수집",
                "IP 주소, 쿠키, 기기 정보, 서비스 이용 기록, 방문 일시",
              ],
            ]}
          />
        </Section>

        {/* 제2조 */}
        <Section title="제2조 (개인정보의 수집 및 이용 목적)">
          <Ul
            items={[
              "회원 식별 및 가입 의사 확인, 본인 인증",
              "운세, 사주, 관상, 타로 등 맞춤형 콘텐츠 제공",
              "유료 서비스 결제 및 환불 처리",
              "서비스 개선 및 신규 서비스 개발을 위한 통계 분석",
              "고객 문의 및 불만 처리",
              "서비스 관련 공지사항 및 이벤트 안내",
            ]}
          />
        </Section>

        {/* 제3조 */}
        <Section title="제3조 (개인정보의 보유 및 이용 기간)">
          <p>
            회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이
            파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우 아래 기간 동안
            보관합니다.
          </p>
          <Table
            rows={[
              ["계약 또는 청약 철회 기록", "5년 (전자상거래법)"],
              ["대금 결제 및 재화 공급 기록", "5년 (전자상거래법)"],
              ["소비자 불만 또는 분쟁 처리 기록", "3년 (전자상거래법)"],
              ["로그인 기록", "3개월 (통신비밀보호법)"],
              ["회원 탈퇴 후 개인정보", "탈퇴 후 30일 이내 파기"],
            ]}
          />
        </Section>

        {/* 제4조 */}
        <Section title="제4조 (개인정보의 제3자 제공)">
          <p>
            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단,
            다음의 경우에는 예외로 합니다.
          </p>
          <Ol
            items={[
              "이용자가 사전에 동의한 경우",
              "법률에 특별한 규정이 있는 경우",
            ]}
          />
          <p style={{ marginTop: 12 }}>
            소셜 로그인 시 아래 제3자와 연동됩니다.
          </p>
          <Table
            rows={[
              [
                "카카오",
                "카카오 계정 식별 정보(이메일, 프로필)",
                "소셜 로그인 인증",
              ],
              [
                "구글",
                "구글 계정 식별 정보(이메일, 프로필)",
                "소셜 로그인 인증",
              ],
            ]}
            headers={["제공 대상", "제공 항목", "제공 목적"]}
          />
        </Section>

        {/* 제5조 */}
        <Section title="제5조 (쿠키의 사용)">
          <Ol
            items={[
              "회사는 이용자의 편의를 위해 쿠키(cookie)를 사용합니다.",
              "쿠키는 이용자의 로그인 상태 유지, 서비스 이용 패턴 분석, 맞춤형 서비스 제공 등의 목적으로 사용됩니다.",
              "이용자는 웹브라우저 설정을 통해 쿠키의 저장을 거부할 수 있으나, 이 경우 서비스 이용에 일부 제한이 있을 수 있습니다.",
            ]}
          />
        </Section>

        {/* 제6조 */}
        <Section title="제6조 (개인정보의 파기)">
          <Ol
            items={[
              "회사는 개인정보의 보유 기간 경과 또는 처리 목적이 달성된 경우 지체 없이 해당 개인정보를 파기합니다.",
              "전자적 파일 형태: 복원이 불가능한 방법으로 영구 삭제",
              "종이 문서: 분쇄기로 분쇄하거나 소각하여 파기",
            ]}
          />
        </Section>

        {/* 제7조 */}
        <Section title="제7조 (정보주체의 권리 및 행사 방법)">
          <p>이용자는 다음과 같은 권리를 행사할 수 있습니다.</p>
          <Ul
            items={[
              "개인정보 열람 요청",
              "오류 등이 있을 경우 정정 요청",
              "삭제 요청",
              "처리 정지 요청",
            ]}
          />
          <p style={{ marginTop: 10 }}>
            위 권리 행사는 이메일(listenstudio.inc@gmail.com)을 통해 요청할 수
            있으며, 회사는 지체 없이 조치하겠습니다. 대리인을 통한 권리 행사 시
            개인정보보호법 시행규칙에 따른 위임장을 제출하여야 합니다.
          </p>
        </Section>

        {/* 제8조 */}
        <Section title="제8조 (개인정보의 안전성 확보 조치)">
          <p>
            회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
            있습니다.
          </p>
          <Ul
            items={[
              "개인정보 암호화 전송 (SSL/TLS)",
              "접근 권한 관리 및 제한",
              "개인정보 접근 기록 보관 및 점검",
              "해킹 등에 대비한 보안 시스템 운영",
            ]}
          />
        </Section>

        {/* 제9조 */}
        <Section title="제9조 (개인정보 보호 책임자)">
          <Table
            rows={[
              ["성명", "윤규미"],
              ["직위", "대표"],
              ["이메일", "listenstudio.inc@gmail.com"],
            ]}
          />
          <p style={{ marginTop: 10 }}>
            기타 개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 기관에
            문의하실 수 있습니다.
          </p>
          <Ul
            items={[
              "개인정보침해신고센터 (privacy.kisa.or.kr / 118)",
              "대검찰청 사이버범죄수사과 (spo.go.kr / 1301)",
              "경찰청 사이버수사국 (ecrm.police.go.kr / 182)",
            ]}
          />
        </Section>

        {/* 제10조 */}
        <Section title="제10조 (개인정보처리방침의 변경)">
          <p>
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경
            내용의 추가, 삭제 및 정정이 있는 경우에는 시행일 7일 전부터 서비스 내
            공지사항을 통하여 고지할 것입니다.
          </p>
        </Section>

        {/* Business Info */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: "#1E4A3D",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#D4AF37",
              marginBottom: 12,
            }}
          >
            사업자 정보
          </p>
          <InfoLines />
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#D4AF37",
          fontFamily: "'RIDIBatang', serif",
          marginBottom: 10,
        }}
      >
        {title}
      </h2>
      <div style={{ color: "#ddd", fontSize: 13.5, lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 18, marginTop: 8 }}>
      {items.map((t, i) => (
        <li key={i} style={{ marginBottom: 4 }}>
          {t}
        </li>
      ))}
    </ul>
  );
}

function Ol({ items }: { items: string[] }) {
  return (
    <ol style={{ paddingLeft: 18, marginTop: 8 }}>
      {items.map((t, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {t}
        </li>
      ))}
    </ol>
  );
}

function Table({
  rows,
  headers,
}: {
  rows: string[][];
  headers?: string[];
}) {
  const cellStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: "1px solid rgba(212,175,55,0.08)",
    fontSize: 12.5,
    verticalAlign: "top",
  };
  return (
    <div style={{ overflowX: "auto", marginTop: 10, marginBottom: 8 }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#1E4A3D",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {headers && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    ...cellStyle,
                    color: "#D4AF37",
                    fontWeight: 700,
                    textAlign: "left",
                    background: "rgba(212,175,55,0.06)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    ...cellStyle,
                    color: ci === 0 ? "#A8C4B8" : "#ddd",
                    fontWeight: ci === 0 ? 600 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoLines() {
  const lines = [
    ["사업자", "리슨스튜디오"],
    ["대표", "윤규미"],
    ["사업자번호", "115-40-01646"],
    ["통신판매업", "2026-의정부흥선-0098"],
    ["이메일", "listenstudio.inc@gmail.com"],
  ];
  return (
    <div style={{ fontSize: 12.5, lineHeight: 2, color: "#A8C4B8" }}>
      {lines.map(([k, v]) => (
        <div key={k}>
          <span style={{ color: "#999", marginRight: 8 }}>{k}</span>
          {v}
        </div>
      ))}
    </div>
  );
}
