import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Zap,
  Bookmark,
  Hash,
  Share2,
  Tv,
  HelpCircle,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import { SAMPLE_SCRIPTS, SampleScript } from '../data/sampleScripts';

interface ScriptInputSectionProps {
  scriptText: string;
  onChangeScriptText: (text: string) => void;
  genre: string;
  onChangeGenre: (genre: string) => void;
  focusKeyword: string;
  onChangeFocusKeyword: (kw: string) => void;
  channelName: string;
  onChangeChannelName: (name: string) => void;
  socialLinks: string;
  onChangeSocialLinks: (links: string) => void;
  algorithmStrategy: string;
  onChangeAlgorithmStrategy: (strat: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onOpenReferenceModal: () => void;
}

const GENRE_OPTIONS = [
  'Kisah Nyata & Mengharukan',
  'Alur Cerita Film',
  'Kisah Horor & Misteri',
  'Kisah Nyata & Biografi',
  'Edukasi & Finansial',
  'Misteri Dunia & Konspirasi',
  'Teknologi & AI',
  'Kisah Kriminal & Detektif',
  'Motivasi & Pengembangan Diri',
];

export const ScriptInputSection: React.FC<ScriptInputSectionProps> = ({
  scriptText,
  onChangeScriptText,
  genre,
  onChangeGenre,
  focusKeyword,
  onChangeFocusKeyword,
  channelName,
  onChangeChannelName,
  socialLinks,
  onChangeSocialLinks,
  algorithmStrategy,
  onChangeAlgorithmStrategy,
  onSubmit,
  isLoading,
  onOpenReferenceModal,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const charCount = scriptText.length;

  const handleSelectSample = (sample: SampleScript) => {
    onChangeScriptText(sample.content);
    onChangeGenre(sample.genre);
    onChangeFocusKeyword(sample.focusKeyword);
  };

  const handleAutoDetectFromStory = () => {
    const lines = scriptText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return;
    const first = lines[0].replace(/^[#\s*_\-]+/, '').replace(/^(Judul:|Alur Cerita Film:|Kisah Nyata:|Sinopsis:|Intisari Cerita:)/i, '').trim();
    if (/ayah|ibu|bapak|anak|keluarga|lapar|menangis|air mata|pengorbanan|darman|andi|rina/i.test(scriptText)) {
      onChangeGenre('Kisah Nyata & Mengharukan');
      onChangeFocusKeyword(first ? first : 'kisah pengorbanan ayah');
    } else if (/hantu|pocong|kuntilanak|gunung|tersesat|jurang|beringin|merinding/i.test(scriptText)) {
      onChangeGenre('Kisah Horor & Misteri');
      onChangeFocusKeyword(first ? `misteri ${first.toLowerCase()}` : 'kisah horor nyata');
    } else if (/bisnis|omzet|uang|kaya|modal|ai|pemuda/i.test(scriptText)) {
      onChangeGenre('Edukasi & Finansial');
      onChangeFocusKeyword(first ? `sukses ${first.toLowerCase()}` : 'kisah sukses pemuda');
    } else if (/detektif|miliarder|pembunuhan|pulau|mayat/i.test(scriptText)) {
      onChangeGenre('Alur Cerita Film');
      onChangeFocusKeyword(first ? first : 'alur cerita film plot twist');
    } else if (first) {
      onChangeFocusKeyword(first.substring(0, 30));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Input Naskah / Ide Cerita / Intisari
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Langkah 1
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Masukkan naskah alur cerita atau draft ide Anda. AI akan mengonversinya menjadi paket SEO YouTube yang mematuhi checklist VidIQ.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenReferenceModal}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
        >
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lihat Aturan Acuan Gambar</span>
        </button>
      </div>

      {/* Preset sample scripts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            Contoh Naskah Cepat (Klik untuk mencoba):
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCRIPTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectSample(item)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/60 text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Script Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="font-medium text-slate-300">
            Teks Naskah Cerita / Sinopsis / Ide:
          </label>
          <div className="font-mono text-[11px] text-slate-400">
            {wordCount} kata • {charCount} karakter
          </div>
        </div>
        <textarea
          value={scriptText}
          onChange={(e) => onChangeScriptText(e.target.value)}
          rows={7}
          placeholder="Tuliskan atau paste naskah cerita Anda di sini... (Misalnya alur cerita film dari awal hingga twist akhir, cerita misteri, atau poin-poin edukasi)"
          className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors leading-relaxed font-sans"
        />
      </div>

      {/* Quick metadata: Genre & Keyword */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-slate-400" />
            <span>Kategori / Niche Saluran:</span>
          </label>
          <select
            value={genre}
            onChange={(e) => onChangeGenre(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g} className="bg-slate-900 text-slate-200">
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Keyword Utama:</span>
            </label>
            <button
              type="button"
              onClick={handleAutoDetectFromStory}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/50"
              title="Deteksi judul dan tema langsung dari teks naskah Anda"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Auto-Deteksi dari Naskah</span>
            </button>
          </div>
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => onChangeFocusKeyword(e.target.value)}
            placeholder="Misal: Ayah Jangan Lapar Sendirian, Kisah Pengorbanan Ayah"
            className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Upgraded Algorithm Strategy Selector */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-xs text-slate-300 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fokus Riset Algoritma YouTube:</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-normal">
            ✓ Logika Riset Terverifikasi
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChangeAlgorithmStrategy('suggested_videos')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              algorithmStrategy === 'suggested_videos'
                ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-900/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${algorithmStrategy === 'suggested_videos' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
              Suggested Videos
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Membajak penonton video viral sejenis lewat kesamaan tag LSI.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChangeAlgorithmStrategy('high_ctr_viral')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              algorithmStrategy === 'high_ctr_viral'
                ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-900/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${algorithmStrategy === 'high_ctr_viral' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`} />
              High CTR & Hook
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Curiosity gap untuk alur cerita & naskah dengan plot twist.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChangeAlgorithmStrategy('search_ranking')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              algorithmStrategy === 'search_ranking'
                ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-900/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${algorithmStrategy === 'search_ranking' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-600'}`} />
              Search Evergreen
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Fokus kata kunci pencarian YouTube untuk traffic jangka panjang.
            </p>
          </button>
        </div>
      </div>

      {/* Toggle Advanced Channel Info */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          />
          <span>Opsi Tambahan: Nama Channel & Tautan Sosial Media (Opsional)</span>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl animate-fadeIn">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nama Channel YouTube:</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => onChangeChannelName(e.target.value)}
                placeholder="Misal: Cerita Alur ID"
                className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 px-3 py-2 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Tautan Media Sosial (Otomatis ditaruh di bawah baris 2):
              </label>
              <input
                type="text"
                value={socialLinks}
                onChange={(e) => onChangeSocialLinks(e.target.value)}
                placeholder="Misal: Instagram: @nama_channel, TikTok: @nama_channel"
                className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 px-3 py-2 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Big Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !scriptText.trim()}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm tracking-wide transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 animate-spin text-amber-300" />
              <div className="text-left">
                <span className="block font-bold">Sedang Mengeksekusi SEO YouTube...</span>
                <span className="text-[11px] text-red-200 font-normal">
                  Memverifikasi batas 20-60 karakter judul & 300-500 karakter tags
                </span>
              </div>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>EKSEKUSI JADI SEO (SESUAI ATURAN VIDIQ)</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-slate-500 mt-2">
          Memastikan Judul 20-60 karakter, Deskripsi berstruktur &gt;200 karakter, dan Kumpulan Tag 300-500 karakter.
        </p>
      </div>
    </div>
  );
};
