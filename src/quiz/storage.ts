import type { QuizState, QuizItem } from "./types.ts";

const KEY_STATE = "quiz_state_v1";
const KEY_DATA_CACHE = "quiz_data_cache_v1";

export const storage = {
  loadState(): QuizState | null {
    const raw = sessionStorage.getItem(KEY_STATE);
    if (!raw) return null;
    try { return JSON.parse(raw) as QuizState; } catch { return null; }
  },
  saveState(state: QuizState) {
    sessionStorage.setItem(KEY_STATE, JSON.stringify(state));
  },
  clearState() {
    sessionStorage.removeItem(KEY_STATE);
  },

  // optional: cache quiz data in-session to avoid refetch
  loadDataCache(): QuizItem[] | null {
    const raw = sessionStorage.getItem(KEY_DATA_CACHE);
    if (!raw) return null;
    try { return JSON.parse(raw) as QuizItem[]; } catch { return null; }
  },
  saveDataCache(data: QuizItem[]) {
    sessionStorage.setItem(KEY_DATA_CACHE, JSON.stringify(data));
  },
};