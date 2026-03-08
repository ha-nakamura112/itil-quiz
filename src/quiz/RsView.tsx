import type { QuizItem, QuizState } from "./types";
import { btnPrimary } from "./ui";

type Props = {
  data: QuizItem[];
  state: QuizState;
  pct: number;
  correctCount: number;
  total: number;
  onRetryKeep: () => void;
  onRetryShuffle: () => void;
  onClear: () => void;
};

function ScoreRing({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* 背景トラック */}
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef0f4" strokeWidth="10" />
        {/* スコア円弧 */}
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      {/* 中央テキスト */}
      <div className="absolute flex flex-col items-center">
        <span className="text-[28px] font-black text-[#1a1d23]">{pct}%</span>
        <span className="text-[11px] text-[#9aa0ae]">スコア</span>
      </div>
    </div>
  );
}

function ScoreMessage({ pct }: { pct: number }) {
  if (pct === 100) return <p className="text-[15px] font-bold text-emerald-600">完璧です！全問正解！</p>;
  if (pct >= 80)  return <p className="text-[15px] font-bold text-emerald-600">素晴らしい！あと少しで満点！</p>;
  if (pct >= 60)  return <p className="text-[15px] font-bold text-amber-500">もう一息！苦手な問題を復習しよう</p>;
  return               <p className="text-[15px] font-bold text-rose-500">諦めずに繰り返し挑戦しよう！</p>;
}

export function ResultView(props: Props) {
  const { data, state, pct, correctCount, total, onRetryKeep, onRetryShuffle, onClear } = props;

  const wrongCount = total - correctCount;

  return (
    <div className="grid gap-5">

      {/* ── スコアカード ── */}
      <div className="rounded-2xl bg-white border border-[#e4e7ec] shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">

          {/* リング */}
          <ScoreRing pct={pct} />

          {/* 右側テキスト */}
          <div className="flex-1 text-center sm:text-left">
            <ScoreMessage pct={pct} />
            <div className="mt-4 flex justify-center sm:justify-start gap-6">
              <div className="text-center">
                <p className="text-[22px] font-black text-emerald-500">{correctCount}</p>
                <p className="text-[11px] text-[#9aa0ae]">正解</p>
              </div>
              <div className="w-px bg-[#eef0f4]" />
              <div className="text-center">
                <p className="text-[22px] font-black text-rose-400">{wrongCount}</p>
                <p className="text-[11px] text-[#9aa0ae]">不正解</p>
              </div>
              <div className="w-px bg-[#eef0f4]" />
              <div className="text-center">
                <p className="text-[22px] font-black text-[#1a1d23]">{total}</p>
                <p className="text-[11px] text-[#9aa0ae]">合計</p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2.5">
              <button type="button" onClick={onRetryKeep} className={btnPrimary}>
                もう一度（固定順）
              </button>
              <button type="button" onClick={onRetryShuffle} className={btnPrimary}>
                もう一度（シャッフル）
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center justify-center rounded-[11px] px-4 py-2.5 text-[13px] font-medium text-[#9aa0ae] border border-[#e4e7ec] bg-white hover:text-rose-400 hover:border-rose-200 transition-all"
              >
                結果をクリア
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 問題一覧 ── */}
      <div className="rounded-2xl bg-white border border-[#e4e7ec] shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-8 py-7">
        <p className="mb-5 text-[13px] font-semibold text-[#374151]">解答一覧</p>
        <div className="grid gap-3">
          {state.order.map((qIdx, n) => {
            const q = data[qIdx];
            const sel = state.selections[qIdx];
            const ok = state.correct[qIdx] === true;
            const your = sel === null ? "未回答" : q.options[sel];
            const ans = q.options[q.answer];

            return (
              <div
                key={qIdx}
                className={
                  "rounded-xl border px-5 py-4 transition-all " +
                  (ok
                    ? "border-emerald-100 bg-emerald-50/60"
                    : "border-rose-100 bg-rose-50/60")
                }
              >
                {/* 問題ヘッダー */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <span className={
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white " +
                      (ok ? "bg-emerald-500" : "bg-rose-400")
                    }>
                      {ok ? "○" : "×"}
                    </span>
                    <p className="text-[14px] font-semibold leading-relaxed text-[#1a1d23]">
                      Q{n + 1}. {q.question}
                    </p>
                  </div>
                  <span className={
                    "flex-shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium " +
                    (ok
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-500")
                  }>
                    {ok ? "Correct" : "Wrong"}
                  </span>
                </div>

                {/* 回答内容 */}
                <div className="mt-3 ml-7.5 grid gap-1 text-[12px] leading-relaxed text-[#6b7280]">
                  <div className="flex gap-2">
                    <span className="flex-shrink-0 font-medium text-[15px] text-[#9aa0ae]">あなた</span>
                    <span className={ok ? "text-emerald-700 text-[15px]  font-medium" : "text-rose-500 font-medium line-through"}>
                      {your}
                    </span>
                  </div>
                  {!ok && (
                    <div className="flex gap-2">
                      <span className="flex-shrink-0 font-medium text-[13px] text-[#9aa0ae]">正答　</span>
                      <span className="text-emerald-700 font-medium text-[15px]">{ans}</span>
                    </div>
                  )}
                  {q.description && (
                    <div className="mt-2 rounded-lg bg-white/70 border border-white px-3 py-2 text-[12px] text-[#6b7280] leading-relaxed">
                      💡 {q.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}