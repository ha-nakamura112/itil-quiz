import { useEffect, useMemo, useState } from "react";
import type { QuizItem, QuizState } from "./types";
import { storage } from "./storage";

const DEFAULT_JSON_URL = "/json/questions.json";

function normalizeQuizData(json: any): QuizItem[] {
  const arr = Array.isArray(json) ? json : [json];
  const data: QuizItem[] = arr.map((x, idx) => {
    if (!x || typeof x.question !== "string" || !Array.isArray(x.options) || typeof x.answer !== "number") {
      throw new Error(`Invalid : ${idx}`);
    }
    return {
      question: x.question,
      options: x.options,
      answer: x.answer,
      description: x.description ?? "",
    };
  });
  data.forEach((q, i) => {
    if (q.answer < 0 || q.answer >= q.options.length) throw new Error(`Invalid answer index : ${i}`);
  });
  return data;
}

function shuffleArray<T>(arr: T[], seed = Date.now()): T[] {
  const a = arr.slice();
  let m = a.length;
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 0xffffffff;
    return s / 0xffffffff;
  };
  while (m) {
    const i = Math.floor(rand() * m--);
    [a[m], a[i]] = [a[i], a[m]];
  }
  return a;
}

function createInitialState(data: QuizItem[], shuffle: boolean): QuizState {
  const base = data.map((_, i) => i);
  const order = shuffle ? shuffleArray(base) : base;

  return {
    order,
    currentPos: 0,
    selections: Array(data.length).fill(null),
    correct: Array(data.length).fill(null),
    shuffle,
    createdAt: Date.now(),
  };
}

export function useQuiz(jsonUrl = DEFAULT_JSON_URL) {
  const [data, setData] = useState<QuizItem[] | null>(null);
  const [state, setState] = useState<QuizState | null>(null);
  const [error, setError] = useState<string>("");

  // ① JSON読み込み（publicからfetch）
  useEffect(() => {
    const cached = storage.loadDataCache();
    if (cached) {
      setData(cached);
      return;
    }
    (async () => {
      try {
        const res = await fetch(jsonUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load ${jsonUrl}: ${res.status}`);
        const json = await res.json();
        const normalized = normalizeQuizData(json.questions ?? json);
        storage.saveDataCache(normalized);
        setData(normalized);
      } catch (e: any) {
        setError(String(e?.message ?? e));
      }
    })();
  }, [jsonUrl]);

  // ⑤ sessionStorageから復元 or 初期化
  useEffect(() => {
    if (!data) return;
    const loaded = storage.loadState();
    if (!loaded || loaded.selections.length !== data.length || loaded.correct.length !== data.length) {
      const init = createInitialState(data, false);
      storage.saveState(init);
      setState(init);
    } else {
      // clamp
      const fixed = { ...loaded, currentPos: Math.min(loaded.currentPos, loaded.order.length) };
      storage.saveState(fixed);
      setState(fixed);
    }
  }, [data]);

  const current = useMemo(() => {
    if (!data || !state) return null;
    const total = state.order.length;
    const finished = state.currentPos >= total;
    const pos = Math.min(state.currentPos, total - 1);
    const qIndex = finished ? null : state.order[pos];
    return {
      total,
      finished,
      pos,
      qIndex,
      question: qIndex !== null ? data[qIndex] : null,
      selected: qIndex !== null ? state.selections[qIndex] : null,
      judged: qIndex !== null ? state.correct[qIndex] !== null : false,
    };
  }, [data, state]);

  function persist(next: QuizState) {
    storage.saveState(next);
    setState(next);
  }

  // ③ 選択（ラジオ1択）
  function selectOption(optionIndex: number) {
    if (!data || !state || !current || current.qIndex === null) return;
    const qIdx = current.qIndex;
    const next: QuizState = {
      ...state,
      selections: state.selections.map((v, i) => (i === qIdx ? optionIndex : v)),
    };
    persist(next);
  }

  // ④ 成否判定（answer index一致）
  function judgeCurrent() {
    if (!data || !state || !current || current.qIndex === null) return;
    const qIdx = current.qIndex;
    const sel = state.selections[qIdx];
    if (sel === null) return;
    const ok = sel === data[qIdx].answer;

    const next: QuizState = {
      ...state,
      correct: state.correct.map((v, i) => (i === qIdx ? ok : v)),
    };
    persist(next);
  }

  function next() {
    if (!state) return;
    const nextState: QuizState = { ...state, currentPos: state.currentPos + 1 };
    persist(nextState);
  }

  // ⑥ 再チャレンジ（順番固定/シャッフル）
  function retry(shuffle: boolean) {
    if (!data) return;
    const init = createInitialState(data, shuffle);
    persist(init);
  }

  function clearResultsKeepData() {
    storage.clearState();
    if (!data) return;
    const init = createInitialState(data, false);
    persist(init);
  }

  const stats = useMemo(() => {
    if (!data || !state) return null;
    const total = state.order.length;
    const correctCount = state.order.filter((qIdx) => state.correct[qIdx] === true).length;
    const answeredCount = state.order.filter((qIdx) => state.correct[qIdx] !== null).length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    return { total, correctCount, answeredCount, pct };
  }, [data, state]);

  return {
    data,
    state,
    current,
    stats,
    error,
    actions: { selectOption, judgeCurrent, next, retry, clearResultsKeepData },
  };
}