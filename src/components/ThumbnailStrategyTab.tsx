import React from 'react';
import { Image, Sparkles, Layers, Eye, Target, AlertCircle } from 'lucide-react';
import { StrategyInsights } from '../types/seo';

interface ThumbnailStrategyTabProps {
  insights?: StrategyInsights;
  title: string;
}

export const ThumbnailStrategyTab: React.FC<ThumbnailStrategyTabProps> = ({
  insights,
  title,
}) => {
  const thumbnailIdea = insights?.thumbnailIdea || 'Wajah karakter utama dengan ekspresi terkejut di latar belakang pulau berkabut dan mercusuar gelap.';
  const thumbnailText = insights?.thumbnailText || 'JANGAN KESINI!';
  const storyHookOpening = insights?.storyHookOpening || 'Dalam 5 detik pertama, sebutkan misteri terbesar tanpa membongkar plot twist.';
  const retentionAdvice = insights?.retentionAdvice || 'Gunakan potongan suara aneh setiap 45 detik untuk menjaga retensi penonton tetap di atas 60%.';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Image className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Strategi Visual Thumbnail & CTR Hook
          </h3>
          <p className="text-xs text-slate-400">
            Kombinasi Judul SEO + Thumbnail dengan CTR tinggi adalah kunci utama agar algoritma YouTube merekomendasikan video Anda.
          </p>
        </div>
      </div>

      {/* Mock Thumbnail Preview Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/80 border-2 border-slate-700/80 p-6 flex flex-col justify-between overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.2),transparent_60%)] pointer-events-none" />
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-300 border border-white/10 backdrop-blur-md">
              PREVIEW THUMBNAIL YOUTUBE
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white font-mono">
              CTR BOOSTER
            </span>
          </div>

          {/* Bold Visual Text Overlay */}
          <div className="z-10 text-center my-auto">
            <span className="inline-block px-4 py-2 bg-yellow-400 text-black font-black text-xl md:text-2xl uppercase tracking-tighter rounded-lg shadow-2xl transform -rotate-2 border-2 border-black">
              {thumbnailText}
            </span>
            <p className="text-xs text-slate-200 mt-3 font-semibold line-clamp-2 max-w-xs mx-auto drop-shadow-md">
              "{thumbnailIdea}"
            </p>
          </div>

          <div className="flex justify-between items-end z-10 text-[10px] text-slate-400">
            <span className="bg-black/80 px-2 py-0.5 rounded font-mono">16:9 • HD 1080p</span>
            <span className="bg-black/90 px-1.5 py-0.5 rounded font-mono text-white">12:45</span>
          </div>
        </div>

        {/* Thumbnail Strategy Directives */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Teks Singkat Pada Thumbnail:
            </h4>
            <div className="text-lg font-black text-amber-300 font-mono tracking-wide">
              "{thumbnailText}"
            </div>
            <p className="text-[11px] text-slate-400">
              *Aturan Desain: Jangan menaruh seluruh judul di thumbnail. Gunakan maksimal 2-4 kata pemicu rasa penasaran instan.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Instruksi Gambar Thumbnail:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{thumbnailIdea}</p>
          </div>
        </div>
      </div>

      {/* Story Retention Hook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4" />
            Hook 5 Detik Pertama Video:
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            "{storyHookOpening}"
          </p>
        </div>

        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Strategi Durasi Tonton (Retention Rate):
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            {retentionAdvice}
          </p>
        </div>
      </div>
    </div>
  );
};
