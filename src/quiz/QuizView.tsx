import type { QuizItem } from "./types";
import { btnPrimary } from "./ui";

type Props = {
  q: QuizItem;
  indexLabel: string;
  progressPct: number;
  selected: number | null;
  judged: boolean;
  isCorrect: boolean | null;
  onSelect: (i: number) => void;
  onPrimary: () => void;
  primaryLabel: string;
  disablePrimary: boolean;
};

export function QuizView(props: Props) {
  const {
    q, indexLabel, progressPct, selected, judged, isCorrect,
    onSelect, onPrimary, primaryLabel, disablePrimary,
  } = props;

  const correctText = q.options[q.answer];
  const yourText = selected === null ? "未選択" : q.options[selected];

  const progressBarClass =
    "h-full transition-all duration-300 rounded-full " +
    (judged
      ? isCorrect ? "bg-emerald-400" : "bg-rose-400"
      : "bg-[#a8bcfa]");

  const optionClass = (i: number) => {
    const base =
      "flex items-center gap-3.5 rounded-xl px-[18px] py-3.5 " +
      "border-[1.5px] transition-all duration-150 cursor-pointer select-none";

    if (!judged) {
      return base + (selected === i
        ? " border-[#7a9cf7] bg-[#eef2fe] shadow-[0_0_0_3px_rgba(122,156,247,0.15)]"
        : " border-[#e4e7ec] bg-white hover:border-[#b8c8fa] hover:bg-[#f5f7ff]");
    }
    if (i === q.answer) return base + " border-[#6ee7b7] bg-[#ecfdf5] cursor-not-allowed";
    if (i === selected) return base + " border-[#fca5a5] bg-[#fff5f5] cursor-not-allowed";
    return base + " border-[#e4e7ec] bg-white opacity-40 cursor-not-allowed";
  };

  const RadioDot = ({ idx }: { idx: number }) => {
    const isSelected = selected === idx;
    const isAnswer = idx === q.answer;

    const base = "w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-150";

    // 判定前
    if (!judged) {
      if (isSelected) {
        return (
          <div className={base + " border-[#7a9cf7] bg-[#7a9cf7]"}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      }
      return <div className={base + " border-[#d1d5db] bg-white"} />;
    }

    // 判定後：正答
    if (isAnswer) {
      return (
        <div className={base + " border-emerald-500 bg-emerald-500"}>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    // 判定後：誤選択
    if (isSelected) {
      return (
        <div className={base + " border-rose-400 bg-rose-400"}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1L7 7M7 1L1 7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      );
    }
    return <div className={base + " border-[#d1d5db] bg-white"} />;
  };

  return (
    <div className="rounded-2xl bg-white border border-[#e4e7ec] shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-10 py-9">
      {/* Progress header */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-mono text-[15px] text-[#9aa0ae] tracking-wide">Q {indexLabel}</span>
        <span className="font-mono text-[15px] text-[#9aa0ae]">{progressPct}%</span>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1 rounded-full bg-[#eef0f4] overflow-hidden">
        <div className={progressBarClass} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question */}
      <p className="text-[19px] font-bold leading-[1.75] text-[#1a1d23] mb-6">
        {q.question}
      </p>

      {/* Options */}
      <div className="grid gap-2.5">
        {q.options.map((opt, i) => (
          <label key={i} className={optionClass(i)} onClick={() => !judged && onSelect(i)}>
            <RadioDot idx={i} />
            <input type="radio" name="opt" value={i} checked={selected === i}
              onChange={() => onSelect(i)} disabled={judged} className="sr-only" />
            <span className={
              "flex-1 text-[15px] leading-relaxed " +
              (!judged && selected === i ? "text-[#3b5bdb] font-medium" : "text-[#374151]")
            }>
              {opt}
            </span>
          </label>
        ))}
      </div>

      {/* Action */}
      <div className="mt-7 flex justify-end">
        <button type="button" onClick={onPrimary} disabled={disablePrimary} className={btnPrimary}>
          {primaryLabel}
        </button>
      </div>

      {/* Feedback */}
      {judged && (
        <div className="mt-5 rounded-xl border border-[#e4e7ec] bg-[#f9fafb] px-5 py-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={"text-[14px] font-extrabold " + (isCorrect ? "text-emerald-600" : "text-rose-500")}>
              {isCorrect ? "○ 正解" : "× 不正解"}
            </span>
            <span className="rounded-full bg-[#eef0f4] px-3 py-0.5 text-[11px] font-mono text-[#6b7280]">
              正答：{correctText}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-[#6b7280]">
            あなたの回答：{yourText}
          </p>
          {q.description && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#6b7280]">解説：{q.description}</p>
          )}
        </div>
      )}
    </div>
  );
}