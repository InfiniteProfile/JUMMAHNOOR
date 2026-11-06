'use strict';
/* JUMMAHNOOR — deterministic infinite Muslim profile universe (vanilla JS, no backend) */
const $ = s => document.querySelector(s), root = document.documentElement;
const raf = f => { let d = 0; const g = () => { if (!d) { d = 1; f(); } }; requestAnimationFrame(g); setTimeout(g, 60); };
const LI = { en: 0, ar: 1, bn: 2 };
let lang = 'en';
try { lang = localStorage.getItem('jn-lang') || 'en'; } catch (e) {}
if (!(lang in LI)) lang = 'en';

/* ---------- UI text ---------- */
const T = {
en: { tag1: 'ONE UMMAH. INFINITE IDENTITIES.', tag2: 'A BEAUTIFUL INFINITE UNIVERSE OF ISLAM.', jm: 'Jummah Mubarak',
  todayF: 'Jummah Mubarak! Today is Friday in Bangladesh — a blessed day to remember Allah.',
  otherF: 'Every day is a chance to remember Allah, and every Friday the light returns.',
  col: 'Jummah collection', colF: 'Today’s Jummah collection', ph: 'Name, number or topic', num: 'Profile', fic: 'Fictional', his: 'Historical',
  view: 'View profile', close: 'Close', cat: 'Category', bio: 'Biography', info: 'Islamic information', quran: 'Quran',
  fn: 'This is a fictional, Islamic-inspired identity. It is not a real person, and no sayings are attributed to the Prophet ﷺ.',
  an: 'Artwork is symbolic Islamic geometric art, not a portrait.', no: 'No profiles match your search.' },
ar: { tag1: 'أمة واحدة. هويات لا نهائية.', tag2: 'عالم جميل لا نهائي من الإسلام.', jm: 'جمعة مباركة',
  todayF: 'جمعة مباركة! اليوم الجمعة في بنغلاديش — يوم مبارك لذكر الله.',
  otherF: 'كل يوم فرصة لذكر الله، ومع كل جمعة يتجدد النور.',
  col: 'مجموعة الجمعة', colF: 'مجموعة جمعة اليوم', ph: 'اسم أو رقم أو موضوع', num: 'ملف', fic: 'خيالي', his: 'تاريخي',
  view: 'عرض الملف', close: 'إغلاق', cat: 'التصنيف', bio: 'نبذة', info: 'معلومات إسلامية', quran: 'القرآن',
  fn: 'هذه هوية خيالية مستوحاة من الإسلام، وليست شخصًا حقيقيًا، ولا تُنسب أي أقوال إلى النبي ﷺ.',
  an: 'الصورة فن هندسي إسلامي رمزي وليست صورة شخصية.', no: 'لا توجد ملفات مطابقة.' },
bn: { tag1: 'এক উম্মাহ। অসীম পরিচয়।', tag2: 'ইসলামের এক সুন্দর অসীম মহাবিশ্ব।', jm: 'জুমা মোবারক',
  todayF: 'জুমা মোবারক! আজ বাংলাদেশে শুক্রবার — আল্লাহকে স্মরণের এক বরকতময় দিন।',
  otherF: 'প্রতিদিনই আল্লাহকে স্মরণের সুযোগ, আর প্রতি জুমায় নতুন করে নূর ফিরে আসে।',
  col: 'জুমা সংগ্রহ', colF: 'আজকের জুমা সংগ্রহ', ph: 'নাম, নম্বর বা বিষয়', num: 'প্রোফাইল', fic: 'কাল্পনিক', his: 'ঐতিহাসিক',
  view: 'প্রোফাইল দেখুন', close: 'বন্ধ', cat: 'বিভাগ', bio: 'পরিচিতি', info: 'ইসলামি তথ্য', quran: 'কুরআন',
  fn: 'এটি ইসলাম-অনুপ্রাণিত একটি কাল্পনিক পরিচয়; বাস্তব ব্যক্তি নয়, এবং নবী ﷺ-এর নামে কোনো উক্তি আরোপ করা হয়নি।',
  an: 'ছবিটি প্রতীকী ইসলামি জ্যামিতিক শিল্প, কোনো প্রতিকৃতি নয়।', no: 'কোনো প্রোফাইল মেলেনি।' }
};

/* index 14 = Jummah Special Profiles; category = id mod 20 */
const CATS = [
['Muslim Scholars','علماء مسلمون','মুসলিম আলেম'], ['Islamic History','التاريخ الإسلامي','ইসলামি ইতিহাস'],
['Muslim Scientists','علماء مسلمون في العلوم','মুসলিম বিজ্ঞানী'], ['Muslim Civilization','الحضارة الإسلامية','মুসলিম সভ্যতা'],
['Muslim Communities','المجتمعات المسلمة','মুসলিম সম্প্রদায়'], ['Islamic Architecture','العمارة الإسلامية','ইসলামি স্থাপত্য'],
['Islamic Knowledge','المعرفة الإسلامية','ইসলামি জ্ঞান'], ['Quranic Inspiration','إلهام قرآني','কুরআনিক অনুপ্রেরণা'],
['Islamic Spirituality','الروحانية الإسلامية','ইসলামি আধ্যাত্মিকতা'], ['Muslim Youth','الشباب المسلم','মুসলিম তরুণ'],
['Muslim Artists','الفنانون المسلمون','মুসলিম শিল্পী'], ['Muslim Inventors','المخترعون المسلمون','মুসলিম আবিষ্কারক'],
['Muslim Travelers','الرحّالة المسلمون','মুসলিম পর্যটক'], ['Muslim Leaders','القادة المسلمون','মুসলিম নেতৃবৃন্দ'],
['Jummah Special Profiles','ملفات الجمعة الخاصة','জুমা বিশেষ প্রোফাইল'], ['Islamic Heritage','التراث الإسلامي','ইসলামি ঐতিহ্য'],
['Muslim Family Values','قيم الأسرة المسلمة','মুসলিম পারিবারিক মূল্যবোধ'], ['Islamic Learning','التعلّم الإسلامي','ইসলামি শিক্ষা'],
['Muslim Ummah','الأمة المسلمة','মুসলিম উম্মাহ'], ['Fictional Islamic-Inspired Identities','هويات خيالية مستوحاة من الإسلام','ইসলাম-অনুপ্রাণিত কাল্পনিক পরিচয়']
];
const CATTXT = CATS.map(c => c.join(' ').toLowerCase());

/* ---------- Quran (Arabic preserved; translations are meanings) ---------- */
const V = [
{ s: 'Al-Ikhlas', r: '112:1–4', a: 'قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  en: 'Say, “He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, and there is none comparable to Him.”',
  bn: 'বলুন, তিনিই আল্লাহ, এক। আল্লাহ অমুখাপেক্ষী। তিনি কাউকে জন্ম দেননি এবং কেউ তাঁকে জন্ম দেয়নি। আর তাঁর সমকক্ষ কেউ নেই।' },
{ s: 'Ar-Rahman', r: '55:1–4', a: 'الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ خَلَقَ الْإِنسَانَ عَلَّمَهُ الْبَيَانَ',
  en: 'The Most Merciful taught the Quran. He created humankind and taught them clear expression.',
  bn: 'পরম দয়াময় আল্লাহ কুরআন শিখিয়েছেন। তিনি মানুষকে সৃষ্টি করেছেন এবং তাকে ভাষা শিখিয়েছেন।' },
{ s: 'Al-Jumu\'ah', r: '62:9', a: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ',
  en: 'O believers! When the call to prayer is made on Friday, hasten to the remembrance of Allah and leave off trade. That is best for you, if only you knew.',
  bn: 'হে মুমিনগণ! জুমার দিনে যখন সালাতের জন্য আহ্বান করা হয়, তখন আল্লাহর স্মরণের দিকে দ্রুত যাও এবং বেচাকেনা ছেড়ে দাও। এটাই তোমাদের জন্য উত্তম, যদি তোমরা জানতে।' },
{ s: 'Al-Jumu\'ah', r: '62:10', a: 'فَإِذَا قُضِيَتِ الصَّلَاةُ فَانتَشِرُوا فِي الْأَرْضِ وَابْتَغُوا مِن فَضْلِ اللَّهِ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ',
  en: 'When the prayer is concluded, disperse in the land and seek the bounty of Allah, and remember Allah often so that you may succeed.',
  bn: 'অতঃপর সালাত শেষ হলে তোমরা জমিনে ছড়িয়ে পড় এবং আল্লাহর অনুগ্রহ সন্ধান কর, আর আল্লাহকে বেশি বেশি স্মরণ কর, যাতে তোমরা সফল হও।' },
{ s: 'Al-Kahf', r: '18:1', a: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا',
  en: 'All praise is for Allah, who revealed the Book to His servant and placed no crookedness in it.',
  bn: 'সমস্ত প্রশংসা আল্লাহর, যিনি তাঁর বান্দার প্রতি কিতাব নাযিল করেছেন এবং তাতে কোনো বক্রতা রাখেননি।' },
{ s: 'Ash-Sharh', r: '94:5–6', a: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  en: 'Indeed, with hardship comes ease. Indeed, with hardship comes ease.',
  bn: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে। নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।' },
{ s: 'Ta-Ha', r: '20:114 (part)', a: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
  en: 'And say, “My Lord, increase me in knowledge.”', bn: 'আর বলুন, হে আমার রব, আমার জ্ঞান বৃদ্ধি করুন।' },
{ s: 'Ar-Ra\'d', r: '13:28 (part)', a: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
  en: 'Surely in the remembrance of Allah hearts find rest.', bn: 'জেনে রাখ, আল্লাহর স্মরণেই অন্তর প্রশান্তি লাভ করে।' },
{ s: 'Al-Hujurat', r: '49:13 (part)', a: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا',
  en: 'O people! We created you from a male and a female and made you peoples and tribes so that you may know one another.',
  bn: 'হে মানুষ! আমরা তোমাদের সৃষ্টি করেছি এক পুরুষ ও এক নারী থেকে এবং তোমাদের বিভক্ত করেছি জাতি ও গোত্রে, যাতে তোমরা একে অপরকে চিনতে পার।' },
{ s: 'Az-Zumar', r: '39:9 (part)', a: 'هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ',
  en: 'Say, “Are those who know equal to those who do not know?”', bn: 'বলুন, যারা জানে এবং যারা জানে না, তারা কি সমান?' },
{ s: 'Al-Baqarah', r: '2:152 (part)', a: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
  en: 'So remember Me; I will remember you.', bn: 'অতএব তোমরা আমাকে স্মরণ কর, আমিও তোমাদের স্মরণ করব।' }
];
const VC = [6, 8, 9, 8, 8, 1, 6, 4, 7, 5, 1, 9, 8, 5, 2, 8, 10, 6, 8, 0];

/* ---------- Real historical entries: id = 20*(index+1)+category ---------- */
const RL = [
[0, 'Imam al-Bukhari', 'c. 810–870', 'Scholar who compiled Sahih al-Bukhari, one of the most respected hadith collections in Sunni Islam.'],
[2, 'Ibn Sina (Avicenna)', '980–1037', 'Physician and philosopher whose Canon of Medicine served as a standard medical text for centuries.'],
[2, 'Al-Khwarizmi', 'c. 780–850', 'Baghdad scholar whose book on algebra gave the field its name; “algorithm” derives from his name.'],
[2, 'Ibn al-Haytham', 'c. 965–1040', 'Author of the Book of Optics, a landmark in the study of vision and experimental method.'],
[17, 'Fatima al-Fihri', '9th century', 'Founded the al-Qarawiyyin mosque and learning centre in Fez in 859.'],
[12, 'Ibn Battuta', '1304–c. 1368', 'Moroccan traveler whose Rihla recounts journeys across Africa, Asia and Europe.'],
[2, 'Al-Zahrawi (Abulcasis)', 'c. 936–1013', 'Andalusian physician whose Kitab al-Tasrif described surgical instruments and procedures.'],
[11, 'Al-Jazari', '1136–1206', 'Engineer who wrote the Book of Knowledge of Ingenious Mechanical Devices in 1206.'],
[5, 'Mimar Sinan', 'c. 1489–1588', 'Chief Ottoman architect; designed the Süleymaniye Mosque in Istanbul and the Selimiye Mosque in Edirne.'],
[1, 'Ibn Khaldun', '1332–1406', 'Historian whose Muqaddimah is a foundational work on history and society.'],
[13, 'Salahuddin al-Ayyubi', '1137–1193', 'Founder of the Ayyubid dynasty, who recaptured Jerusalem in 1187.'],
[12, 'Al-Idrisi', 'c. 1100–1165', 'Geographer who produced the Tabula Rogeriana world map in 1154.'],
[11, 'Maryam al-Ijliya', '10th century', 'Astrolabe maker in Aleppo, working at the court of Sayf al-Dawla.'],
[2, 'Al-Biruni', '973–1048', 'Polymath who wrote on astronomy, mathematics and geography.'],
[14, 'Masjid al-Haram', 'Makkah', 'The Great Mosque of Makkah surrounds the Kaaba, the direction Muslims face in prayer.'],
[14, 'Masjid an-Nabawi', 'Madinah', 'The Prophet’s Mosque in Madinah, founded by the Prophet ﷺ after the Hijrah.']
];
const REAL = {};
RL.forEach((r, i) => { REAL[20 * (i + 1) + r[0]] = { n: r[1], y: r[2], f: r[3] }; });

/* ---------- Name & bio parts ---------- */
const F = 'Yusuf Maryam Idris Layla Hamza Amina Zayd Safiya Omar Hana Ibrahim Noor Tariq Sumayya Salman Zainab Rashid Aisha Karim Samira Nasir Huda Imran Rukhsana Farhan Nusrat Anwar Mahmud'.split(' ');
const L = 'al-Andalusi,al-Hijazi,al-Shami,al-Misri,al-Maghribi,al-Yamani,al-Baghdadi,al-Qurtubi,al-Halabi,al-Tunisi,al-Dimashqi,al-Najdi,al-Dhakawi,al-Sylheti,Rahman,Chowdhury,Siddiqui,Hossain,Karim,Ahmed,Yilmaz,Demir,Haddad,Nasser,Farouk,Ansari,Mirza,Qureshi'.split(',');
const E = ['the Lantern Keeper', 'the Quiet Reader', 'the Star Counter', 'of the Courtyard', 'the Patient Student', 'of the Blue Dome', 'the Friday Walker', 'the Well Digger', 'the Orchard Keeper', 'of the Silk Road', 'the Light Bearer', 'the Calligrapher’s Friend'];
const P1 = 'Emerald Pearl Quiet Radiant Golden Turquoise Blessed Silent Starlit Serene Luminous Tranquil'.split(' ');
const P2 = 'Courtyard Minaret Dome Mihrab Arch Fountain Garden Gateway Lantern Pavilion Colonnade Horizon'.split(' ');
const P3 = 'Fez Cordoba Samarkand Isfahan Cairo Istanbul Dhaka Bukhara Granada Kairouan Delhi Sylhet'.split(' ');
const PLACE = new Set([3, 4, 5, 14, 15, 18]);
const AA = [
['patience', 'gratitude', 'curiosity', 'generosity', 'humility', 'sincerity', 'remembrance of Allah', 'brotherhood'],
['الصبر', 'الشكر', 'الفضول العلمي', 'الكرم', 'التواضع', 'الإخلاص', 'ذكر الله', 'الأخوّة'],
['ধৈর্য', 'কৃতজ্ঞতা', 'জ্ঞানের অনুসন্ধান', 'উদারতা', 'বিনয়', 'ইখলাস', 'আল্লাহর যিকির', 'ভ্রাতৃত্ব']];
const BB = [
['gathering knowledge', 'quiet reflection', 'serving the neighborhood', 'studying the stars', 'preserving heritage', 'teaching the young', 'crafting geometric art', 'preparing for Friday prayer'],
['طلب العلم', 'التأمل الهادئ', 'خدمة الجيران', 'رصد النجوم', 'حفظ التراث', 'تعليم الناشئة', 'صناعة الفنون الهندسية', 'الاستعداد لصلاة الجمعة'],
['জ্ঞান অর্জন', 'শান্ত চিন্তা', 'প্রতিবেশীর সেবা', 'তারা পর্যবেক্ষণ', 'ঐতিহ্য সংরক্ষণ', 'তরুণদের শেখানো', 'জ্যামিতিক শিল্পচর্চা', 'জুমার প্রস্তুতি']];
const TP = [
(c, b, a) => `A fictional Islamic-inspired identity in ${c}, devoted to ${b} and guided by ${a}.`,
(c, b, a) => `هوية خيالية مستوحاة من الإسلام ضمن «${c}»، تُعنى بـ${b} وتسترشد بـ${a}.`,
(c, b, a) => `“${c}” বিভাগে ইসলাম-অনুপ্রাণিত একটি কাল্পনিক পরিচয়, যা ${b} নিয়ে নিবেদিত এবং ${a} দ্বারা পরিচালিত।`];

/* ---------- Deterministic BigInt hashing (no precision loss, any size) ---------- */
const M64 = (1n << 64n) - 1n;
const mix = x => { x = (x + 0x9E3779B97F4A7C15n) & M64; x = ((x ^ (x >> 30n)) * 0xBF58476D1CE4E5B9n) & M64; x = ((x ^ (x >> 27n)) * 0x94D049BB133111EBn) & M64; return x ^ (x >> 31n); };
const fold = id => { let x = 0n; do { x = mix(x ^ (id & M64)); id >>= 64n; } while (id > 0n); return x; };
const R = (s, k, n) => Number(mix(s + BigInt(k) * 0x1F3D5B79n) % BigInt(n));

function prof(id) {
  const c = Number(id % 20n), key = id.toString(), real = REAL[key], s = fold(id);
  let name;
  if (real) name = real.n;
  else if (PLACE.has(c)) name = `${P1[R(s, 1, 12)]} ${P2[R(s, 2, 12)]} of ${P3[R(s, 3, 12)]}`;
  else name = `${F[R(s, 1, F.length)]} ${L[R(s, 2, L.length)]}` + (R(s, 3, 3) ? ` ${E[R(s, 4, 12)]}` : '');
  return { id, key, c, real, s, name };
}
const cn = c => CATS[c][LI[lang]];
const bio = p => { if (p.real) return p.real.f; const i = LI[lang]; return TP[i](cn(p.c), BB[i][R(p.s, 6, 8)], AA[i][R(p.s, 5, 8)]); };
const verse = p => V[p.c === 14 ? [2, 3, 4][R(p.s, 7, 3)] : VC[p.c]];

/* ---------- Artwork: generated Islamic geometric SVG (no photos, no broken images) ---------- */
const PAL = [['#0b3d2e', '#06130f', '#d4b46a'], ['#0f5a45', '#07201a', '#7fe0d0'], ['#06241d', '#020807', '#eadfc3'], ['#116149', '#0a2b22', '#c9a64e'], ['#0a4a50', '#051c20', '#9be8e0'], ['#0d3b2c', '#10241f', '#d9c58a']];
const SN = [8, 8, 10, 12, 6, 16], ARCH = new Set([5, 8, 14, 15, 17]), MOON = new Set([6, 7, 14, 18, 19]);
const star = (R0, R1, n, o) => { let d = ''; for (let i = 0; i < 2 * n; i++) { const a = o + i * Math.PI / n, r = i % 2 ? R1 : R0; d += (i ? 'L' : 'M') + (100 + r * Math.sin(a)).toFixed(1) + ' ' + (100 - r * Math.cos(a)).toFixed(1); } return d + 'Z'; };
function art(p) {
  const s = p.s, pal = PAL[R(s, 10, 6)], n = SN[R(s, 11, 6)], lay = 1 + R(s, 12, 3), o = R(s, 13, 8) * 0.1, ac = pal[2];
  let g = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></radialGradient></defs><rect width="200" height="200" fill="url(#g)"/>`;
  for (let i = 0; i < lay; i++) { const r0 = 88 - i * 22; g += `<path d="${star(r0, r0 * .62, n, o + i * Math.PI / (2 * n))}" fill="none" stroke="${ac}" stroke-opacity="${(.8 - i * .2).toFixed(1)}" stroke-width="1.3"/>`; }
  g += `<circle cx="100" cy="100" r="${22 + R(s, 14, 10)}" fill="${ac}" fill-opacity=".12" stroke="${ac}" stroke-opacity=".5"/>`;
  if (ARCH.has(p.c)) g += `<path d="M62 200V138Q62 98 100 78Q138 98 138 138V200Z" fill="${pal[1]}" fill-opacity=".75" stroke="${ac}" stroke-opacity=".7"/>`;
  if (MOON.has(p.c)) g += `<path d="M146 30a22 22 0 1 0 8 30a17 17 0 1 1-8-30z" fill="${ac}" fill-opacity=".9"/>`;
  return 'data:image/svg+xml,' + encodeURIComponent(g + '</svg>');
}
const FB = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0a2a22"/><path d="M100 20L118 70 170 60 135 100 170 140 118 130 100 180 82 130 30 140 65 100 30 60 82 70Z" fill="none" stroke="#c9a85c"/></svg>');
addEventListener('error', e => { const t = e.target; if (t && t.tagName === 'IMG' && !t.dataset.f) { t.dataset.f = 1; t.src = FB; } }, true);

/* ---------- Cards ---------- */
function fill(e, p) {
  const t = T[lang], q = x => e.querySelector(x);
  q('.tg').textContent = p.real ? t.his : t.fic;
  q('.nm').textContent = p.name;
  q('.nu').textContent = `${t.num} #${p.key}`;
  q('.ct').textContent = cn(p.c);
  q('.bi').textContent = bio(p);
  q('.bt').textContent = t.view;
}
function mk(id) {
  const p = prof(id), e = document.createElement('article');
  e.className = 'cd' + (p.c === 14 ? ' j' : '');
  e.dataset.id = p.key;
  e.innerHTML = `<img class="im" src="${art(p)}" alt="" width="200" height="200" loading="lazy" decoding="async"><div class="bd"><span class="tg"></span><h3 class="nm"></h3><div class="nu"></div><div class="ct"></div><p class="bi"></p><button class="bt" type="button"></button></div>`;
  fill(e, p);
  return e;
}

/* ---------- Infinite feed engine ---------- */
function Feed(box, sc, src, batch, gap, onEmpty) {
  let pend = 0, dead = 0;
  const room = () => sc ? sc.scrollHeight - sc.scrollTop - sc.clientHeight : root.scrollHeight - scrollY - innerHeight;
  function go(n) {
    if (pend || dead) return;
    pend = 1;
    const ids = src.more(n);
    if (!ids.length) {
      pend = 0;
      if (src.done) { dead = 1; if (!box.firstChild && onEmpty) onEmpty(); } else setTimeout(() => go(n), 30);
      return;
    }
    let i = 0;
    (function ch() {
      const f = document.createDocumentFragment(), e = Math.min(i + 60, ids.length);
      for (; i < e; i++) f.appendChild(mk(ids[i]));
      box.appendChild(f);
      if (i < ids.length) raf(ch); else { pend = 0; chk(); }
    })();
  }
  function chk() { if (!dead && room() < gap()) go(batch); }
  return { go, chk, stop() { dead = 1; } };
}

/* Main universe: contiguous ids 1,2,3,… with no upper bound */
const mainSrc = { n: 1n, done: false, more(k) { const a = []; for (let i = 0; i < k; i++) a.push(this.n++); return a; } };
const main = Feed($('#feed'), null, mainSrc, 300, () => Math.max(6000, innerHeight * 8));
main.go(360);
const tick = () => main.chk();
addEventListener('scroll', tick, { passive: true });
addEventListener('resize', tick);
setInterval(tick, 700); /* fallback if observers/scroll events are throttled */
if ('IntersectionObserver' in window) new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) tick(); }, { rootMargin: '0px 0px 5000px 0px' }).observe($('#sn'));

/* ---------- Sources for panels ---------- */
const catSrc = h => ({ k: 0n, done: false, more(n) { const a = []; while (a.length < n) { for (const c of h) { const id = 20n * this.k + BigInt(c); if (id > 0n) a.push(id); } this.k++; } return a; } });
const once = v => ({ done: true, u: false, more() { if (this.u || !v) return []; this.u = true; return [v]; } });
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
function nameSrc(q) {
  return { id: 1n, done: false, more(n) {
    const a = []; let b = 0;
    while (a.length < n && b < 30000 && this.id <= 200000n) { const p = prof(this.id); if (norm(p.name).includes(q)) a.push(this.id); this.id++; b++; }
    if (this.id > 200000n) this.done = true;
    return a;
  } };
}
function srcFor(raw) {
  const s = raw.trim(); if (!s) return null;
  const m = s.match(/^#?\s*(\d+)$/);
  if (m) return once(BigInt(m[1]) > 0n ? BigInt(m[1]) : null);
  const toks = norm(s).split(/\s+/).map(t => t.replace(/s$/, '')).filter(Boolean);
  const hits = [];
  CATTXT.forEach((t, i) => { if (toks.every(k => t.includes(k))) hits.push(i); });
  return hits.length ? catSrc(hits) : nameSrc(norm(s));
}

/* ---------- Panel (search + Jummah collection) ---------- */
const pn = $('#pn'), pg = $('#pg'), q = $('#q'), ne = $('#ne');
let pf = null, kind = null, lastFocus = null, tm = 0;
function start(src) {
  if (pf) pf.stop();
  pg.innerHTML = ''; ne.hidden = true; pn.scrollTop = 0;
  if (!src) { pf = null; return; }
  pf = Feed(pg, pn, src, 120, () => pn.clientHeight * 4, () => { ne.hidden = false; });
  pf.go(60);
}
function openPanel(k) {
  lastFocus = document.activeElement; kind = k; pn.hidden = false;
  q.hidden = k !== 's'; $('#pt').hidden = k === 's';
  if (k === 'j') start(catSrc([14])); else { q.value = ''; start(null); q.focus({ preventScroll: true }); }
}
function closePanel() { if (pf) pf.stop(); pf = null; pn.hidden = true; pg.innerHTML = ''; kind = null; if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
q.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => start(srcFor(q.value)), 150); });
pn.addEventListener('scroll', () => pf && pf.chk(), { passive: true });
setInterval(() => pf && pf.chk(), 700);
$('#sb').onclick = () => openPanel('s');
$('#cb').onclick = () => openPanel('j');
$('#pc').onclick = closePanel;

/* ---------- Profile details ---------- */
const dt = $('#dt'); let dId = null, dFocus = null;
function detail(id, keep) {
  const p = prof(id), t = T[lang], v = verse(p);
  if (!keep) dFocus = document.activeElement;
  dId = id; dt.hidden = false;
  dt.innerHTML = `<div class="sh" role="dialog" aria-modal="true"><button id="dx" class="ib x" type="button" aria-label="${t.close}">✕</button>
<img class="da" src="${art(p)}" alt="" width="200" height="200" decoding="async">
<span class="tg">${p.real ? t.his : t.fic}</span><h2>${p.name}</h2><div class="nu">${t.num} #${p.key}</div><div class="ct">${t.cat}: ${cn(p.c)}</div>
<h4>${t.bio}</h4><p>${p.real ? p.real.y + ' — ' : ''}${bio(p)}</p>
<h4>${t.info}</h4><div class="qv"><p class="ar" lang="ar" dir="rtl">${v.a}</p>${lang === 'ar' ? '' : `<p>${v[lang]}</p>`}<cite>${t.quran} · ${v.s} ${v.r}</cite></div>
<p class="nt">${p.real ? t.an : t.fn}</p></div>`;
  if (!keep) dt.scrollTop = 0;
  $('#dx').onclick = closeDetail;
  if (!keep) $('#dx').focus({ preventScroll: true });
}
function closeDetail() { dt.hidden = true; dt.innerHTML = ''; dId = null; if (dFocus && dFocus.focus) dFocus.focus({ preventScroll: true }); }
document.addEventListener('click', e => {
  if (e.target.closest('#dt')) { if (e.target === dt) closeDetail(); return; }
  const c = e.target.closest('.cd'); if (c) detail(BigInt(c.dataset.id));
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!dt.hidden) closeDetail(); else if (!pn.hidden) closePanel(); } });

/* ---------- Language ---------- */
function applyText() {
  const t = T[lang];
  document.querySelectorAll('[data-t]').forEach(e => { e.textContent = t[e.dataset.t]; });
  document.querySelectorAll('[data-p]').forEach(e => { e.placeholder = t[e.dataset.p]; });
  $('#sb').setAttribute('aria-label', t.ph); $('#pc').setAttribute('aria-label', t.close);
  document.querySelectorAll('.l3 button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === lang));
}
function refreshCards() {
  const list = document.querySelectorAll('.cd'); let i = 0;
  (function ch() { const e = Math.min(i + 200, list.length); for (; i < e; i++) fill(list[i], prof(BigInt(list[i].dataset.id))); if (i < list.length) raf(ch); })();
}
function setLang(l) {
  lang = l; try { localStorage.setItem('jn-lang', l); } catch (e) {}
  root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
  fri(); refreshCards();
  if (dId !== null) detail(dId, true);
}
document.querySelector('.l3').addEventListener('click', e => { const b = e.target.closest('[data-l]'); if (b) setLang(b.dataset.l); });

/* ---------- Jummah: Friday in Bangladesh (Asia/Dhaka), not device time ---------- */
function isFri() {
  try { return new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', weekday: 'long' }).format(new Date()) === 'Friday'; }
  catch (e) { return new Date(Date.now() + 6 * 36e5).getUTCDay() === 5; }
}
function fri() {
  const f = isFri();
  root.classList.toggle('fri', f);
  $('#fg').dataset.t = f ? 'todayF' : 'otherF';
  $('#cb').dataset.t = f ? 'colF' : 'col';
  $('#hp').hidden = !f;
  applyText();
}
setInterval(() => { if (isFri() !== root.classList.contains('fri')) fri(); }, 60000);

root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
fri();
