import React, { useState } from 'react';
import {
  Search,
  Swords,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { CompetitorAnalysisResult } from '../types/seo';

interface CompetitorAnalyzerProps {
  currentStoryConcept: string;
  onApplyTitle: (title: string) => void;
}

export const CompetitorAnalyzer: React.FC<CompetitorAnalyzerProps> = ({
  currentStoryConcept,
  onApplyTitle,
}) => {
  const [competitorTitle, setCompetitorTitle] = useState('');
  const [competitorChannel, setCompetitorChannel] = useState('');
  const [competitorTopic, setCompetitorTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sampleCompetitors = [
    {
      title: 'Alur Cerita Film: Terjebak di Pulau Rahasia Pembunuh',
      channel: 'Kamar Film Horor',
      topic: 'Review film misteri pulau terpencil dengan plot twist',
    },
    {
      title: 'Misteri Gunung Lawu: Jangan Pernah Menatap Pohon Ini',
      channel: 'Kisah Tanah Jawa',
      topic: 'Kisah nyata pendakian horor tersesat di gunung',
    },
    {
      title: 'Cara Pemuda Ini Bangun Bisnis AI dari Nol Sampai 100 Juta',
      channel: 'Finansial & Karier',
      topic: 'Tips menghasilkan uang dari AI untuk pemula',
    },
  ];

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!competitorTitle.trim() && !competitorTopic.trim()) {
      setError('Masukkan minimal judul atau topik video pesaing.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorTitle,
          competitorChannel,
          competitorTopic,
          userStoryConcept: currentStoryConcept,
        }),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || 'Gagal menganalisis video pesaing');
      }

      setAnalysis(resJson.data);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat memproses data pesaing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTitle = (title: string, idx: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Competitor Input Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Analisis Performa Video Pesaing & Strategi Menang
            </h3>
            <p className="text-xs text-slate-400">
              Bedah formula klik CTR pesaing, temukan celah konten yang mereka lewatkan, dan raih posisi teratas YouTube.
            </p>
          </div>
        </div>

        {/* Preset competitor quick buttons */}
        <div>
          <span className="text-xs text-slate-400 mb-2 block font-medium">Contoh Target Pesaing Populer:</span>
          <div className="flex flex-wrap gap-2">
            {sampleCompetitors.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCompetitorTitle(item.title);
                  setCompetitorChannel(item.channel);
                  setCompetitorTopic(item.topic);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition-all text-left"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRunAnalysis} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                Judul Video Pesaing:
              </label>
              <input
                type="text"
                value={competitorTitle}
                onChange={(e) => setCompetitorTitle(e.target.value)}
                placeholder="Contoh: Alur Cerita Film Plot Twist Paling Gila..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                Channel Pesaing (Opsional):
              </label>
              <input
                type="text"
                value={competitorChannel}
                onChange={(e) => setCompetitorChannel(e.target.value)}
                placeholder="Contoh: Nama Channel Kompetitor"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">
              Topik / Inti Cerita Video Pesaing:
            </label>
            <input
              type="text"
              value={competitorTopic}
              onChange={(e) => setCompetitorTopic(e.target.value)}
              placeholder="Contoh: Membahas misteri pembunuhan detektif di pulau terpencil..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-amber-200" />
                  <span>Menganalisis Pesaing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Bedah Video Pesaing Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
          {/* Summary Banner */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-amber-300 mb-0.5">
                Kesimpulan Riset Kompetitor:
              </strong>
              <p className="text-slate-300 leading-relaxed">{analysis.competitorScoreSummary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Analysis */}
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Bedah Formula Judul Pesaing
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {analysis.titleBreakdown.characters} Karakter
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Pemicu Klik (CTR Triggers):</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.titleBreakdown.clickTriggers.map((trig, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-medium border border-slate-700"
                    >
                      {trig}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-1">
                <p className="text-emerald-400">
                  <strong>Kekuatan:</strong> {analysis.titleBreakdown.strengths}
                </p>
                <p className="text-rose-400">
                  <strong>Kelemahan:</strong> {analysis.titleBreakdown.weaknesses}
                </p>
              </div>
            </div>

            {/* Estimated Hidden Tags */}
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Perkiraan Tag YouTube Pesaing
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {analysis.estimatedTagsUsed.length} Keywords
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {analysis.estimatedTagsUsed.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content Gaps to Exploit */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Celah Konten Pesaing Yang Bisa Anda Lengkapi:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {analysis.contentGaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Beat Strategy */}
          <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-500/30 p-5 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Strategi Mengalahkan Video Pesaing Ini:
            </h4>

            {/* Better Titles (Strictly 20-60 Characters) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">
                Saran Judul Pengalah (Memenuhi Syarat 20-60 Karakter):
              </span>
              <div className="space-y-2">
                {analysis.howToBeatStrategy.betterTitleSuggestions.map((title, idx) => {
                  const len = title.length;
                  const isPass = len >= 20 && len <= 60;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-100">{title}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded ${
                            isPass
                              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {len}/60
                        </span>
                        <button
                          onClick={() => onApplyTitle(title)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
                        >
                          Pakai Judul Ini
                        </button>
                        <button
                          onClick={() => handleCopyTitle(title, idx)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Thumbnail Counter Angle & Hijack tip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-amber-300">Sudut Visual Thumbnail Counter:</span>
                <p className="text-slate-300 leading-relaxed">
                  {analysis.howToBeatStrategy.thumbnailCounterAngle}
                </p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-cyan-300">Hook Menit Pertama Penonton:</span>
                <p className="text-slate-300 leading-relaxed">
                  {analysis.howToBeatStrategy.firstMinuteHook}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/30 text-xs">
              <span className="font-semibold text-emerald-400 block mb-1">
                Trik Membajak Kolom Suggested / Rekomendasi Video Pesaing:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {analysis.howToBeatStrategy.suggestedVideoHijackTip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
