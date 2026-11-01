import { ChecklistItemAudit, ChecklistStatus } from '../types/seo';

export interface LiveAuditState {
  title: string;
  description: string;
  tags: string[];
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\d_]+/g);
  return matches || [];
}

export function hasUrl(text: string): boolean {
  return /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|org|net|id|co|io|me|app)[^\s]*/i.test(text);
}

export function getFirstTwoLines(text: string): string {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return lines.slice(0, 2).join(' ');
}

export function auditSEO(data: LiveAuditState): {
  items: ChecklistItemAudit[];
  overallScore: number;
  passedCount: number;
  totalCheckable: number;
  tagsJoinedString: string;
  tagsLength: number;
  hashtags: string[];
} {
  const title = (data.title || '').trim();
  const description = (data.description || '').trim();
  const tags = data.tags || [];

  const titleLen = title.length;
  const descLen = description.length;
  const tagsJoinedString = tags.join(',');
  const tagsLen = tagsJoinedString.length;
  const hashtags = extractHashtags(description);
  const firstTwoLines = getFirstTwoLines(description);

  // Check if at least 1 tag is in title (case insensitive, partial word or phrase)
  const tagInTitleMatch = tags.find((t) => {
    const cleanTag = t.trim().toLowerCase();
    return cleanTag.length >= 3 && title.toLowerCase().includes(cleanTag);
  });

  // Check if at least 1 tag is in description
  const tagInDescMatch = tags.find((t) => {
    const cleanTag = t.trim().toLowerCase();
    return cleanTag.length >= 3 && description.toLowerCase().includes(cleanTag);
  });

  // Check if link is present in description
  const hasLinks = hasUrl(description);
  const linksInFirstTwoLines = hasUrl(firstTwoLines);

  const items: ChecklistItemAudit[] = [];

  // 1. Title length 44/60 (Target 20-60 characters)
  const isTitlePass = titleLen >= 20 && titleLen <= 60;
  items.push({
    id: 'title_length',
    title: `Title length ${titleLen}/60`,
    statValue: `${titleLen}/60`,
    status: isTitlePass ? 'pass' : 'fail',
    description:
      "Your title should be short and well-crafted (between 20-60 characters) to attract users. Include the keywords you want to rank for to be found easily by your audience. A shorter title has less chance of being cut off by YouTube's character display limit",
    actionableHelp:
      titleLen < 20
        ? `Judul terlalu pendek (${titleLen} karakter). Tambahkan kata kunci yang menarik minimal 20 karakter.`
        : titleLen > 60
        ? `Judul terlalu panjang (${titleLen} karakter). Potong agar <= 60 karakter agar tidak terpotong di layar HP.`
        : `Sempurna! Panjang judul ${titleLen} karakter berada di zona ideal (20-60 karakter).`,
  });

  // 2. Description length 665/5000 (Target > 200 characters)
  const isDescPass = descLen >= 200 && descLen <= 5000;
  items.push({
    id: 'description_length',
    title: `Description length ${descLen}/5000`,
    statValue: `${descLen}/5000`,
    status: isDescPass ? 'pass' : 'fail',
    description:
      'Create a well-crafted description (more than 200 characters). Make sure the first 2 lines contains the keywords you want to rank for but in a different way from your title. You can also include hashtags in it to help your audience find your video. The first 3 hashtags will be added above your video',
    actionableHelp:
      descLen < 200
        ? `Deskripsi saat ini baru ${descLen} karakter (minimal > 200 karakter). Tambahkan sinopsis naskah dan timestamps.`
        : descLen > 5000
        ? `Deskripsi melebihi batas maksimal YouTube (5000 karakter).`
        : `Bagus sekali! Deskripsi ${descLen} karakter sangat kaya informasi dan ramah algoritma.`,
  });

  // 3. Tags length 495/500 (Target > 300 characters in total and <= 500)
  const isTagsPass = tagsLen >= 300 && tagsLen <= 500;
  items.push({
    id: 'tags_length',
    title: `Tags length ${tagsLen}/500`,
    statValue: `${tagsLen}/500`,
    status: isTagsPass ? 'pass' : 'fail',
    description:
      'Make sure you add tags related to the topic of your video (more than 300 characters in total). Tip: With VidIQ, you will see a score for each tag and the ones you rank for',
    actionableHelp:
      tagsLen < 300
        ? `Total karakter tag baru ${tagsLen}/500. Tambahkan kata kunci relevan hingga mencapai minimal 300-480 karakter.`
        : tagsLen > 500
        ? `Total karakter tag melebihi 500 karakter (${tagsLen}/500). Hapus 1-2 tag agar diterima oleh YouTube Studio.`
        : `Mantap! Total tag ${tagsLen}/500 memenuhi standar VidIQ (>300 karakter).`,
  });

  // 4. Shared on social media (neutral reminder)
  items.push({
    id: 'shared_social',
    title: 'Shared on social media',
    status: 'neutral',
    description:
      'To reach a bigger audience, share your videos on social media with your community and engage your viewers. It will help you get more views if you can drive your audience to watch it.',
    actionableHelp: 'Ingat untuk membagikan tautan video ke Facebook, Instagram, TikTok, atau WhatsApp setelah upload.',
  });

  // 5. Added 1 tag in title
  const isTagInTitlePass = Boolean(tagInTitleMatch);
  items.push({
    id: 'tag_in_title',
    title: 'Added 1 tag in title',
    status: isTagInTitlePass ? 'pass' : 'fail',
    description:
      'Get find via YouTube search by adding your best tags in your title. Your title needs to be catchy, so make sure it is well crafted around your keywords',
    actionableHelp: isTagInTitlePass
      ? `Tag ditemukan dalam judul: "${tagInTitleMatch}"`
      : 'Belum ada tag yang cocok di dalam judul. Masukkan kata kunci utama naskah ke dalam judul.',
  });

  // 6. Added 1 tag in description
  const isTagInDescPass = Boolean(tagInDescMatch);
  items.push({
    id: 'tag_in_description',
    title: 'Added 1 tag in description',
    status: isTagInDescPass ? 'pass' : 'fail',
    description:
      'Add some keywords (tags) in the description of your video, specially in the first few lines. It helps YouTube to understand what your video is about',
    actionableHelp: isTagInDescPass
      ? `Tag ditemukan dalam deskripsi: "${tagInDescMatch}"`
      : 'Sertakan kata kunci / tag di baris awal deskripsi agar YouTube memahami topik video.',
  });

  // 7. Links in description
  const isLinksPass = hasLinks && !linksInFirstTwoLines;
  items.push({
    id: 'links_in_description',
    title: 'Links in description',
    status: isLinksPass ? 'pass' : hasLinks && linksInFirstTwoLines ? 'fail' : 'fail',
    description:
      "You can add links in the description to your channel, social media, product or service. Tip: it's better if you don't add them in the first 2 lines of the description",
    actionableHelp: !hasLinks
      ? 'Tambahkan tautan (Instagram, YouTube Subscribe, atau sumber) di bagian bawah deskripsi.'
      : linksInFirstTwoLines
      ? 'Peringatan: Tautan ditemukan di 2 baris pertama deskripsi! Pindahkan tautan ke bawah agar baris 1-2 fokus ke kata kunci pencarian.'
      : 'Tautan tersedia dan ditempatkan dengan aman di bawah 2 baris pertama.',
  });

  // 8. Hashtags in description 3/15
  const hashtagCount = hashtags.length;
  const isHashtagsPass = hashtagCount >= 3 && hashtagCount <= 15;
  items.push({
    id: 'hashtags_in_description',
    title: `Hashtags in description ${hashtagCount}/15`,
    statValue: `${hashtagCount}/15`,
    status: isHashtagsPass ? 'pass' : 'fail',
    description:
      "Include #hashtags in the description of your video. Don't add more than 15 tags or YouTube will not take them into account. Tip: the first three hashtags you include are gonna be added above the title of your video, so make sure you pick them well and that they are related to the topic of your video",
    actionableHelp:
      hashtagCount < 3
        ? `Baru ada ${hashtagCount} hashtag. Tambahkan minimal 3 hashtag (misal: #${tags[0]?.replace(/\s+/g, '') || 'cerita'}).`
        : hashtagCount > 15
        ? `Terlalu banyak hashtag (${hashtagCount}). YouTube akan mengabaikan jika lebih dari 15 hashtag.`
        : `Bagus! ${hashtagCount} hashtag terdeteksi. 3 hashtag pertama akan diprioritaskan YouTube.`,
  });

  // 9. Closed captions (manual)
  items.push({
    id: 'closed_captions',
    title: 'Closed captions (manual)',
    status: 'neutral',
    description:
      'Closed captions allow you to share your videos with a larger audience, including deaf or hard-of-hearing viewers and viewers who speak another language.',
    actionableHelp: 'Naskah yang Anda masukkan sudah bisa langsung digunakan sebagai file subtitle/CC di YouTube Studio.',
  });

  // 10. Made public
  items.push({
    id: 'made_public',
    title: 'Made public',
    status: 'pass',
    description:
      'To reach your audience, make sure your video is public. Your audience will be able to find it on YouTube via the search, related or recommended videos',
    actionableHelp: 'Pastikan status video disetel ke "Public" saat publish di YouTube Studio.',
  });

  // Calculate overall VidIQ Score (0 - 50 or 0 - 100)
  // Checkable items: title_length, desc_length, tags_length, tag_in_title, tag_in_desc, links_in_desc, hashtags, made_public (8 items)
  const scoredItems = [
    isTitlePass,
    isDescPass,
    isTagsPass,
    isTagInTitlePass,
    isTagInDescPass,
    isLinksPass,
    isHashtagsPass,
    true, // made public
  ];
  const passedCount = scoredItems.filter(Boolean).length;
  const totalCheckable = scoredItems.length;
  const overallScore = Math.round((passedCount / totalCheckable) * 50); // VidIQ uses /50 for checklist SEO

  return {
    items,
    overallScore,
    passedCount,
    totalCheckable,
    tagsJoinedString,
    tagsLength: tagsLen,
    hashtags,
  };
}
