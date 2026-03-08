import { useQuiz } from "./quiz/useQuiz";
import { QuizView } from "./quiz/QuizView";
import { ResultView } from "./quiz/RsView";
import { btnHeader } from "./quiz/ui";
import { ContactButton } from "./quiz/ContactBtn";
import AdBanner from "./components/AdBanner";

export default function App() {
  const { data, state, current, stats, error, actions } = useQuiz("/json/questions.json");

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1a1d23]">
      <div className="mx-auto max-w-[700px] px-7 pt-16 pb-20">
        {children}
      </div>
    </div>
  );

  const Header = ({ modeLabel }: { modeLabel?: string }) => (
    <div className="mb-7 flex items-center justify-between gap-6">
      {/* タイトルのみ・サブテキストなし */}
      <h1 className="text-[30px] font-extrabold tracking-tight text-[#1a1d23]">
        ITIL4 Foundation
      </h1>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {modeLabel && (
          <span className="text-[13px] text-[#9aa0ae] tracking-wide">
            モード：{modeLabel}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => actions.retry(false)} className={btnHeader}>
            最初から（固定）
          </button>
          <button type="button" onClick={() => actions.retry(true)} className={btnHeader}>
            最初から（シャッフル）
          </button>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <Shell>
        <Header />
        <div className="rounded-2xl bg-white border border-[#e4e7ec] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8">
          <p className="text-sm font-bold text-rose-500">読み込みエラー</p>
          <p className="mt-2 text-sm text-[#6b7280] leading-relaxed">{error}</p>
          <p className="mt-1 text-sm text-[#6b7280] leading-relaxed">
            /public/json/questions.json の配置とJSON形式を確認してください。
          </p>
        </div>
      </Shell>
    );
  }

  if (!data || !state || !current || !stats) {
    return (
      <Shell>
        <Header />
        <div className="rounded-2xl bg-white border border-[#e4e7ec] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8">
          <p className="text-sm text-[#9aa0ae]">Loading…</p>
        </div>
        <ContactButton />
      </Shell>
    );
  }

  const modeLabel = state.shuffle ? "シャッフル" : "固定";

  return (
    <Shell>
      <Header modeLabel={modeLabel} />
      {current.finished ? (
        <ResultView
          data={data}
          state={state}
          pct={stats.pct}
          correctCount={stats.correctCount}
          total={stats.total}
          onRetryKeep={() => actions.retry(false)}
          onRetryShuffle={() => actions.retry(true)}
          onClear={actions.clearResultsKeepData}
        />
      ) : (
        <QuizView
          q={current.question!}
          indexLabel={`${current.pos + 1} / ${current.total}`}
          progressPct={Math.round((current.pos / current.total) * 100)}
          selected={current.selected}
          judged={current.judged}
          isCorrect={current.qIndex !== null ? state.correct[current.qIndex] : null}
          onSelect={actions.selectOption}
          onPrimary={() => {
            if (!current.judged) actions.judgeCurrent();
            else actions.next();
          }}
          primaryLabel={current.judged ? (current.pos === current.total - 1 ? "結果を見る" : "次へ") : "回答する"}
          disablePrimary={!current.judged && current.selected === null}
        />
      )}
        {/* 広告②：ページ下部 */}
        <AdBanner
          adClient="ca-pub-xxxxxxxxxx"
          adSlot="2222222222"
          style={{ margin: "40px 0" }}
        />
      <ContactButton />
    </Shell>
  );
}