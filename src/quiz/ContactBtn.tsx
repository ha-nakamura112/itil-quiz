import { useState } from "react";

export function ContactButton() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = new URLSearchParams({
      "form-name": "contact",
      ...form,
    });
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    setSent(true);
  };

  return (
    <>
      {/* 右下固定ボタン */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-white border border-[#e4e7ec] shadow-[0_4px_16px_rgba(0,0,0,0.10)] px-4 py-2.5 text-[13px] font-medium text-[#374151] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.13)]"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h10A1.5 1.5 0 0 1 14 2.5v8A1.5 1.5 0 0 1 12.5 12H8.5l-3 2.5V12H2.5A1.5 1.5 0 0 1 1 10.5v-8Z" stroke="#6b7280" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
        管理者に連絡
      </button>

      {/* モーダルオーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-6"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          {/* 背景薄暗め */}
          <div className="absolute inset-0 bg-black/10" onClick={() => setOpen(false)} />

          {/* モーダル本体 */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-[#e4e7ec] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-6">
            {/* ヘッダー */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-[#1a1d23]">管理者に連絡</p>
                <p className="mt-0.5 text-[11px] text-[#9aa0ae]">お気づきの点・ご要望をお聞かせください</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#9aa0ae] hover:bg-[#f4f6f9] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {sent ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8.5 14.5L16 6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[14px] font-semibold text-[#1a1d23]">送信しました！</p>
                <p className="mt-1 text-[12px] text-[#9aa0ae]">ご連絡ありがとうございます。</p>
                <button
                  onClick={() => { setOpen(false); setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="mt-4 rounded-lg border border-[#e4e7ec] bg-white px-4 py-1.5 text-[13px] text-[#374151] hover:bg-[#f4f6f9] transition-colors"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                data-netlify="true"
                name="contact"
              >
                <input type="hidden" name="form-name" value="contact" />

                <div className="grid gap-3.5">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#374151]">お名前</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="山田 太郎"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-lg border border-[#e4e7ec] bg-[#fafbfc] px-3 py-2 text-[13px] text-[#1a1d23] placeholder-[#c4c9d4] outline-none focus:border-[#a0b4f7] focus:ring-2 focus:ring-[#a0b4f7]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#374151]">メールアドレス</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full rounded-lg border border-[#e4e7ec] bg-[#fafbfc] px-3 py-2 text-[13px] text-[#1a1d23] placeholder-[#c4c9d4] outline-none focus:border-[#a0b4f7] focus:ring-2 focus:ring-[#a0b4f7]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#374151]">内容</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="問題の誤りや改善点など、お気軽にどうぞ。"
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full resize-none rounded-lg border border-[#e4e7ec] bg-[#fafbfc] px-3 py-2 text-[13px] text-[#1a1d23] placeholder-[#c4c9d4] outline-none focus:border-[#a0b4f7] focus:ring-2 focus:ring-[#a0b4f7]/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl border border-[#e4e7ec] bg-white py-2.5 text-[14px] font-semibold text-[#374151] shadow-[0_2px_6px_rgba(0,0,0,0.07)] transition-all hover:border-[#c8cdd6] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  送信する
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}