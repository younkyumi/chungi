"use client";

import { useRouter } from "next/navigation";

export default function TermsPage() {
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
          이용약관
        </h1>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 24, lineHeight: 1.85, fontSize: 13.5 }}>
        <p style={{ color: "#A8C4B8", fontSize: 12, marginBottom: 28 }}>
          시행일: 2026년 3월 31일
        </p>

        {/* 제1조 */}
        <Section title="제1조 (목적)">
          <p>
            이 약관은 리슨스튜디오(이하 &quot;회사&quot;)가 운영하는 CHUNGI
            서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 이용자 간의
            권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </Section>

        {/* 제2조 */}
        <Section title="제2조 (서비스의 내용)">
          <p>
            회사는 다음과 같은 운세 관련 디지털 콘텐츠를 제공합니다.
          </p>
          <Ul
            items={[
              "사주/명리학 기반 운세 분석",
              "AI 관상 분석",
              "타로 카드 리딩",
              "궁합 분석",
              "신년운세, 월간운세, 일일운세 등 기간별 운세",
              "기타 운세 및 점술 관련 콘텐츠",
            ]}
          />
        </Section>

        {/* 제3조 */}
        <Section title="제3조 (회원가입 및 탈퇴)">
          <Ol
            items={[
              "회원가입은 카카오, 구글 등 소셜 로그인 방식을 통해 이루어지며, 가입 시 본 약관에 동의한 것으로 간주합니다.",
              "회원은 언제든지 서비스 내 설정에서 회원 탈퇴를 요청할 수 있으며, 회사는 즉시 처리합니다.",
              "탈퇴 시 회원의 개인정보는 관련 법령에 따라 일정 기간 보관 후 파기됩니다.",
              "탈퇴 후 재가입은 가능하나, 이전 구매 내역 및 이용 기록은 복구되지 않습니다.",
            ]}
          />
        </Section>

        {/* 제4조 */}
        <Section title="제4조 (결제 및 환불)">
          <Ol
            items={[
              "서비스 내 유료 콘텐츠는 별도 결제를 통해 이용할 수 있습니다.",
              "결제는 신용카드, 간편결제 등 회사가 정한 수단을 통해 이루어집니다.",
              "디지털 콘텐츠의 특성상 콘텐츠 열람(결과 확인) 이후에는 환불이 제한됩니다. 단, 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 구매일로부터 7일 이내이며 콘텐츠를 열람하지 않은 경우 환불이 가능합니다.",
              "결제 오류, 중복 결제 등 회사의 귀책사유로 인한 경우 전액 환불합니다.",
              "환불 요청은 이메일(listenstudio.inc@gmail.com)로 접수할 수 있습니다.",
            ]}
          />
        </Section>

        {/* 제5조 */}
        <Section title="제5조 (서비스 이용 제한)">
          <p>회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다.</p>
          <Ol
            items={[
              "타인의 정보를 도용하여 서비스를 이용한 경우",
              "서비스의 운영을 고의로 방해한 경우",
              "서비스를 통해 얻은 정보를 회사의 동의 없이 상업적으로 이용하거나 제3자에게 제공한 경우",
              "법령 또는 본 약관을 위반한 경우",
              "기타 서비스의 정상적인 운영에 지장을 초래하는 행위를 한 경우",
            ]}
          />
        </Section>

        {/* 제6조 */}
        <Section title="제6조 (면책조항)">
          <Ol
            items={[
              "서비스에서 제공하는 운세, 관상, 사주, 타로 등의 결과는 오락 및 참고 목적으로 제공되는 것이며, 어떠한 법적 효력도 갖지 않습니다.",
              "회사는 서비스의 결과를 근거로 한 이용자의 판단이나 행동에 대해 어떠한 법적 책임도 지지 않습니다.",
              "이용자는 서비스의 결과를 의료, 법률, 재무 등 전문적 판단의 대체 수단으로 사용하여서는 안 됩니다.",
              "천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 회사는 책임을 지지 않습니다.",
              "이용자가 자신의 계정 정보를 관리하지 않아 발생하는 손해에 대해 회사는 책임을 지지 않습니다.",
            ]}
          />
        </Section>

        {/* 제7조 */}
        <Section title="제7조 (저작권 및 지적재산권)">
          <Ol
            items={[
              "서비스에 포함된 콘텐츠(텍스트, 이미지, 디자인, 알고리즘 등)의 저작권은 회사에 있습니다.",
              "이용자는 회사의 사전 동의 없이 서비스 콘텐츠를 복제, 배포, 전송, 출판할 수 없습니다.",
            ]}
          />
        </Section>

        {/* 제8조 */}
        <Section title="제8조 (분쟁 해결)">
          <Ol
            items={[
              "서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 분쟁 해결을 위해 성실히 협의합니다.",
              "협의로 해결되지 않는 경우, 관할 법원은 민사소송법에 따라 정합니다.",
              "서비스 관련 불만 및 문의는 아래 연락처로 접수할 수 있습니다.",
            ]}
          />
        </Section>

        {/* 제9조 */}
        <Section title="제9조 (약관의 변경)">
          <Ol
            items={[
              "회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 변경할 수 있습니다.",
              "약관이 변경되는 경우, 시행일 7일 전부터 서비스 내 공지사항을 통해 안내합니다.",
              "변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고 탈퇴할 수 있습니다.",
            ]}
          />
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
