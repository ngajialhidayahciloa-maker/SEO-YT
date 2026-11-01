import React, { useState } from 'react';
import {
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Hash,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';
import { TitleOption, TagItem } from '../types/seo';

interface DetailsEditorViewProps {
  titles: TitleOption[];
  selectedTitle: string;
  onSelectTitle: (title: string) => void;
  description: string;
  onChangeDescription: (desc: string) => void;
  tags: TagItem[];
  onAddTag: (newTag: string) => void;
  onRemoveTag: (index: number) => void;
  tagsLength: number;
  hashtags: string[];
  focusKeywords: string[];
}

export const DetailsEditorView: React.FC<DetailsEditorViewProps> = ({
  titles,
  selectedTitle,
  onSelectTitle,
  description,
  onChangeDescription,
  tags,
  onAddTag,
  onRemoveTag,
  tagsLength,
  hashtags,
  focusKeywords,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const titleLength = selectedTitle.trim().length;
  const isTitlePass = titleLength >= 20 && titleLength <= 60;

  const descLength = description.length;
  const isDescPass = descLength >= 200 && descLength <= 5000;

  const isTagsPass = tagsLength >= 300 && tagsLength <= 500;
  const hashtagCount = hashtags.length;
  const isHashtagPass = hashtagCount >= 3 && hashtagCount <= 15;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    onAddTag(newTagInput.trim());
    setNewTagInput('');
  };

  const tagsCommaString = tags.map((t) => t.tag).join(',');

  return (
    <div className="space-y-6">
      {/* SECTION 1: TITLE GENERATOR & SELECTOR (20-60 Characters) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              1. Judul Video YouTube
            </h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-md font-semibold border ${
                isTitlePass
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              {titleLength}/60 karakter {isTitlePass ? '✓ Ideal' : titleLength < 20 ? '(Terlalu Pendek)' : '(Terlalu Panjang)'}
            </span>
          </div>

          <button
            onClick={() => handleCopy(selectedTitle, 'title')}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copiedField === 'title' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Judul</span>
              </>
            )}
          </button>
        </div>

        {/* Selected Title Input */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">
            Judul Aktif (Bisa diedit langsung):
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedTitle}
              onChange={(e) => onSelectTitle(e.target.value)}
              maxLength={100}
              className={`w-full bg-slate-950 border px-3.5 py-2.5 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors ${
                isTitlePass
                  ? 'border-slate-700 focus:border-emerald-500'
                  : 'border-rose-500/80 focus:border-rose-400'
              }`}
            />
            <span
              className={`absolute right-3 top-2.5 text-xs font-mono ${
                isTitlePass ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-bold'
              }`}
            >
              {titleLength}/60
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            *Aturan VidIQ: Judul 20-60 karakter memiliki peluang tertinggi tidak terpotong di YouTube mobile.
          </p>
        </div>

        {/* Title Alternatives Carousel / Grid */}
        {titles && titles.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium text-slate-300">Pilihan Variasi Judul AI:</span>
            <div className="grid grid-cols-1 gap-2">
              {titles.map((item, idx) => {
                const len = item.title.length;
                const isCurrent = selectedTitle === item.title;
                const lenPass = len >= 20 && len <= 60;
                return (
                  <div
                    key={idx}
                    onClick={() => onSelectTitle(item.title)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-slate-800/90 border-red-500 shadow-md shadow-red-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-red-400 border border-slate-700">
                          {item.type || 'Hook'}
                        </span>
                        {item.matchedTag && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                            Tag: {item.matchedTag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 font-medium truncate">{item.title}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ${
                          lenPass
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {len}/60
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.title, `title-${idx}`);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Salin"
                      >
                        {copiedField === `title-${idx}` ? (
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
        )}
      </div>

      {/* SECTION 2: DESCRIPTION EDITOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              2. Deskripsi Terstruktur
            </h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-md font-semibold border ${
                isDescPass
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              {descLength}/5000 karakter {descLength >= 200 ? '✓ >200 Karakter' : '(Kurang dari 200)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-md border ${
                isHashtagPass
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {hashtagCount}/15 Hashtag
            </span>
            <button
              onClick={() => handleCopy(description, 'description')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copiedField === 'description' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Deskripsi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* VidIQ Description Tips Card */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1 text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Format Sesuai Checklist Gambar:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1 text-[11px]">
            <li>2 Baris pertama memuat kata kunci fokus tanpa link agar video mudah ditemukan di pencarian.</li>
            <li>Link channel/media sosial ditempatkan aman di bagian bawah.</li>
            <li>Hashtags (3-15) disisipkan di baris akhir; 3 pertama akan muncul di atas judul video.</li>
          </ul>
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 p-3.5 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none"
            placeholder="Deskripsi video YouTube..."
          />
        </div>
      </div>

      {/* SECTION 3: TAGS MANAGER (300-500 Karakter) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              3. Kumpulan Tags YouTube
            </h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-md font-semibold border ${
                isTagsPass
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              {tagsLength}/500 karakter {isTagsPass ? '✓ Memenuhi >300' : tagsLength < 300 ? '(Kurang dari 300)' : '(Melebihi 500)'}
            </span>
          </div>

          <button
            onClick={() => handleCopy(tagsCommaString, 'tags')}
            className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors shadow-md shadow-red-900/20"
          >
            {copiedField === 'tags' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Format Koma Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Semua Tag (Format Koma YouTube Studio)</span>
              </>
            )}
          </button>
        </div>

        {/* Tag Length Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Batas Karakter Tag YouTube</span>
            <span className="font-mono font-bold text-slate-200">
              {tagsLength} / 500
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                tagsLength > 500
                  ? 'bg-rose-500'
                  : tagsLength >= 300
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((tagsLength / 500) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            *Aturan Gambar: VidIQ mewajibkan total karakter tag lebih dari 300 karakter dan tidak melebihi 500 batas YouTube Studio.
          </p>
        </div>

        {/* Add custom tag form */}
        <form onSubmit={handleAddTagSubmit} className="flex gap-2">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            placeholder="Tambah tag kustom..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-red-500 px-3 py-2 rounded-xl text-xs text-slate-200 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </form>

        {/* Tag Pills Grid */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((item, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 transition-colors"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{item.tag}</span>
              {item.score && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.score}
                </span>
              )}
              <button
                onClick={() => onRemoveTag(idx)}
                className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                title="Hapus tag"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
