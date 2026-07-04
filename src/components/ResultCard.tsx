import { ReactNode } from "react";

type Props = {
  brand: string;
  title?: string;
  hash: string;
  children: ReactNode;
  captureId?: string;
};

// v715: v677 표준 검사정보 포맷 — 50+ 모달이 똑같이 인라인으로 만들고 있던 형식을 헬퍼화.
// 규격: "👤 {이름} : {YYYY-MM-DD} · {HH:mm}생 · {양력|음력} · {남|여}" + "🔍 {분석시각} 분석"
// time이 없거나 "모름"이면 "생"만, calendar·gender 없으면 해당 항목 제외.
export type PersonInfoData = {
  name?: string;
  birth?: string;
  time?: string;
  calendar?: string;
  gender?: string;
  testDate?: string;
};

export function formatPersonInfoLine(p: PersonInfoData): string {
  const name = p.name || "";
  if (!p.birth) return name ? `👤 ${name}` : "";
  const time = p.time && p.time !== "모름" ? ` · ${p.time}생` : "생";
  const calendar = p.calendar ? ` · ${p.calendar}` : "";
  const gender = p.gender ? ` · ${p.gender}` : "";
  return `👤 ${name} : ${p.birth}${time}${calendar}${gender}`;
}

// opts.label: 기본 "분석" / 손금·발금·관상 등 일부 콘텐츠는 "검사".
// opts.useDateOnly: true면 시·분 빼고 날짜만 (toLocaleDateString) — "검사" 라벨 변종에서 자주 씀.
// opts.suffix: " · 🤚 왼손" 같은 추가 표시 (라벨 앞에 붙음).
export function formatTestDateLine(
  testDate?: string,
  opts?: { label?: string; useDateOnly?: boolean; suffix?: string }
): string {
  const label = opts?.label ?? "분석";
  const suffix = opts?.suffix ?? "";
  const d = testDate || (opts?.useDateOnly
    ? new Date().toLocaleDateString("ko-KR")
    : new Date().toLocaleString("ko-KR", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
      }));
  return `🔍 ${d}${suffix} ${label}`;
}

// PersonInfo 컴포넌트 — fortune-modals 표준 wrapping. align/margin props로 위치 조정.
// page.tsx의 다양한 wrapping 패턴은 헬퍼만 import해서 인라인 처리.
export type PersonInfoProps = PersonInfoData & {
  align?: "center" | "left";
  marginTop?: number;
  marginBottom?: number;
};

// v723: BrandLine 컴포넌트 — 50+ 모달이 인라인 JSX로 만들던 "🔮 천기(天機) 오리지널 | {콘텐츠}" 상단 브랜딩.
// page.tsx에서 30+곳에 동일 스타일이 인라인으로 박혀 있음.
// ResultCard 컴포넌트와 동일 스타일 (fontSize 9, color #aaa, 중앙 정렬, 하단 보더, marginLeft/Right -16 컨테이너 outside extend).
export function BrandLine({ children, align = "center" }: { children: ReactNode; align?: "left" | "center" | "right" }) {
  return (
    <div style={{
      fontSize: 9,
      color: "#aaa",
      fontWeight: 600,
      letterSpacing: 0.3,
      textAlign: align,
      paddingBottom: 10,
      marginBottom: 14,
      marginLeft: -16,
      marginRight: -16,
      paddingLeft: 16,
      paddingRight: 16,
      borderBottom: "1px solid #f0f0f0",
    }}>
      🔮 천기(天機) 오리지널 | {children}
    </div>
  );
}

// v723: HashFooter 컴포넌트 — 하단 푸터 (해시태그 + 🌐 천기.kr).
// project_card_footer_spec.md 규격: marginBottom -10, marginLeft/Right -16, padding 10x16, borderTop, fontSize 9.
export function HashFooter({ hash }: { hash: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 16px 10px",
      marginTop: 14,
      marginLeft: -16,
      marginRight: -16,
      marginBottom: -10,
      fontSize: 9,
      color: "#aaa",
      fontWeight: 600,
      letterSpacing: 0.3,
      borderTop: "1px solid #f3f4f6",
    }}>
      <span>{hash}</span>
      <span style={{ fontWeight: 600 }}>🌐 천기.kr</span>
    </div>
  );
}

export function PersonInfo({ name, birth, time, calendar, gender, testDate, align = "left", marginTop, marginBottom }: PersonInfoProps) {
  const line1 = formatPersonInfoLine({ name, birth, time, calendar, gender });
  const line2 = formatTestDateLine(testDate);
  const style: React.CSSProperties = {
    fontSize: 10,
    color: "#888",
    fontWeight: 600,
    lineHeight: 1.6,
    textAlign: align,
  };
  if (marginTop !== undefined) style.marginTop = marginTop;
  if (marginBottom !== undefined) style.marginBottom = marginBottom;
  return (
    <div style={style}>
      {line1 && <div>{line1}</div>}
      <div style={{ color: "#aaa" }}>{line2}</div>
    </div>
  );
}

export function ResultCard({ brand, title, hash, children, captureId }: Props) {
  return (
    <div
      {...(captureId ? { id: captureId } : {})}
      style={{
        background: "#ffffff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
        border: "1px solid rgba(212,175,55,0.3)",
      }}
    >
      <div style={{ padding: "10px 16px 10px" }}>
        <div
          style={{
            fontSize: 9,
            color: "#aaa",
            fontWeight: 600,
            letterSpacing: 0.3,
            textAlign: "center",
            paddingBottom: 10,
            marginBottom: 14,
            marginLeft: -16,
            marginRight: -16,
            paddingLeft: 16,
            paddingRight: 16,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {brand}
        </div>
        {title && (
          <div
            style={{
              fontSize: 11,
              color: "#7A5C00",
              letterSpacing: 2,
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            {title}
          </div>
        )}
        {children}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 16px 10px",
            marginTop: 14,
            marginLeft: -16,
            marginRight: -16,
            marginBottom: -10,
            fontSize: 9,
            color: "#aaa",
            fontWeight: 600,
            letterSpacing: 0.3,
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <span>{hash}</span>
          <span style={{ fontWeight: 600 }}>🌐 천기.kr</span>
        </div>
      </div>
    </div>
  );
}
