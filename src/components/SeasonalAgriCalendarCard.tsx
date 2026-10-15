import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout } from 'lucide-react';

interface SeasonalCropInfo {
  seasonBn: string;
  seasonEn: string;
  bengaliMonthsBn: string;
  bengaliMonthsEn: string;
  cropsBn: string;
  cropsEn: string;
  adviceBn: string;
  adviceEn: string;
  weatherFocusBn: string;
  weatherFocusEn: string;
}

const BENGALI_SEASONS: SeasonalCropInfo[] = [
  {
    seasonBn: 'গ্রীষ্মকাল (বৈশাখ - জ্যৈষ্ঠ)',
    seasonEn: 'Summer (Boishakh - Jaishtha)',
    bengaliMonthsBn: 'এপ্রিল - মে',
    bengaliMonthsEn: 'April - May',
    cropsBn: 'আউশ ধান, পাট, তিল, আম, জাম, লিচু',
    cropsEn: 'Aus Rice, Jute, Sesame, Mango, Litchi',
    adviceBn: 'কালবৈশাখী ঝড় ও শিলাবৃষ্টির সম্ভাবনা থাকে। পেকে যাওয়া ধান দ্রুত কেটে মাড়াই করুন। গাছপালায় হালকা সেচ দিন।',
    adviceEn: 'Risk of Norwester storms and hail. Harvest mature paddy promptly and ensure scheduled light irrigation.',
    weatherFocusBn: 'তীব্র তাপপ্রবাহ ও কালবৈশাখী',
    weatherFocusEn: 'Heatwaves & Severe Norwester Storms',
  },
  {
    seasonBn: 'বর্ষাকাল (আষাঢ় - শ্রাবণ)',
    seasonEn: 'Monsoon (Asharh - Srabon)',
    bengaliMonthsBn: 'জুন - জুলাই',
    bengaliMonthsEn: 'June - July',
    cropsBn: 'রোপা আমন ধান, পাটের জাগ দেওয়া, গ্রীষ্মকালীন সবজি',
    cropsEn: 'Transplanted Aman Rice, Jute retting, Summer vegetables',
    adviceBn: 'ভারী বৃষ্টির জমে থাকা অতিরিক্ত পানি নিষ্কাশনের পথ খোলা রাখুন। আমন ধানের চারা রোপণের উপযুক্ত সময়।',
    adviceEn: 'Keep field drainage canals clear of waterlogging. Ideal window for transplanting Aman rice seedlings.',
    weatherFocusBn: 'ভারী বৃষ্টিপাত ও বন্যা সতর্কতা',
    weatherFocusEn: 'Heavy Rains & Flood Alert Risk',
  },
  {
    seasonBn: 'শরৎকাল (ভাদ্র - আশ্বিন)',
    seasonEn: 'Autumn (Bhadro - Ashwin)',
    bengaliMonthsBn: 'আগস্ট - সেপ্টেম্বর',
    bengaliMonthsEn: 'August - September',
    cropsBn: 'আমন ধান পরিচর্যা, আগাম শীতকালীন সবজি',
    cropsEn: 'Aman rice maintenance, Early winter vegetables',
    adviceBn: 'আমন ক্ষেতে সুষম সার প্রয়োগ করুন। পোকা দমনে খেত নিয়মিত পর্যবেক্ষণ করুন।',
    adviceEn: 'Apply balanced fertilizers to Aman fields. Monitor crops regularly for pest and blight control.',
    weatherFocusBn: 'মাঝারি বৃষ্টি ও উজ্জ্বল রোদ',
    weatherFocusEn: 'Moderate Rain & Bright Sunshine',
  },
  {
    seasonBn: 'হেমন্তকাল (কার্তিক - অগ্রহায়ণ)',
    seasonEn: 'Late Autumn (Kartik - Agrahayan)',
    bengaliMonthsBn: 'অক্টোবর - নভেম্বর',
    bengaliMonthsEn: 'October - November',
    cropsBn: 'আমন ধান কাটা, সরিষা, আলু, পেঁয়াজ, রসুন',
    cropsEn: 'Aman harvesting, Mustard, Potato, Onion, Garlic',
    adviceBn: 'আমন ধান কাটার কাজ শেষ করুন এবং শীতকালীন ফসল ও সরিষার বীজ বপন শুরু করুন।',
    adviceEn: 'Finish Aman harvesting. Sow seeds for mustard, potato, and seasonal winter vegetables.',
    weatherFocusBn: 'হালকা শুষ্ক আবহাওয়া ও শিশির',
    weatherFocusEn: 'Mild Dry Weather & Morning Dew',
  },
  {
    seasonBn: 'শীতকাল (পৌষ - মাঘ)',
    seasonEn: 'Winter (Poush - Magh)',
    bengaliMonthsBn: 'ডিসেম্বর - জানুয়ারি',
    bengaliMonthsEn: 'December - January',
    cropsBn: 'বোরো ধানের বীজতলা, সরিষা, গম, আলু, টমেটো',
    cropsEn: 'Boro seedbeds, Mustard, Wheat, Potato, Tomato',
    adviceBn: 'কুয়াশা থেকে আলু ও টমেটোর নাবি ধসা রোগ বাঁচাতে সতর্ক থাকুন। বোরো ধান রোপণে সেচ নিশ্চিত করুন।',
    adviceEn: 'Guard potatoes & tomatoes against late blight in heavy fog. Ensure regular irrigation for Boro rice.',
    weatherFocusBn: 'ঘন কুয়াশা ও শৈত্যপ্রবাহ',
    weatherFocusEn: 'Dense Fog & Cold Wave Risk',
  },
  {
    seasonBn: 'বসন্তকাল (ফাল্গুন - চৈত্র)',
    seasonEn: 'Spring (Falgun - Choitra)',
    bengaliMonthsBn: 'ফেব্রুয়ারি - মার্চ',
    bengaliMonthsEn: 'February - March',
    cropsBn: 'বোরো ধান পরিচর্যা, তরমুজ, বাঙ্গি, ভুট্টা',
    cropsEn: 'Boro maintenance, Watermelon, Melon, Maize',
    adviceBn: 'বোরো ক্ষেতে পর্যাপ্ত পানি ধরে রাখুন। আম ও লিচুর মুকুলে রোগ দমনে প্রয়োজনীয় ছত্রাকনাশক প্রয়োগ করুন।',
    adviceEn: 'Maintain standing water in Boro fields. Apply protective organic spray for mango & litchi blossoms.',
    weatherFocusBn: 'উষ্ণ ও রৌদ্রোজ্জ্বল আবহাওয়া',
    weatherFocusEn: 'Warm & Sunny Weather',
  },
];

export const SeasonalAgriCalendarCard: React.FC = () => {
  const { languageCode, t } = useApp();
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(0);

  const isBn = languageCode === 'bn';
  const activeSeason = BENGALI_SEASONS[selectedSeasonIdx];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t('agriCalendarTitle')}
            </h2>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              {t('agriCalendarSub')}
            </p>
          </div>
        </div>
      </div>

      {/* Season Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {BENGALI_SEASONS.map((s, idx) => {
          const tabLabel = isBn ? s.seasonBn.split(' ')[0] : s.seasonEn.split(' ')[0];
          return (
            <button
              key={idx}
              onClick={() => setSelectedSeasonIdx(idx)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSeasonIdx === idx
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Season Details Card */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
            {isBn ? activeSeason.seasonBn : activeSeason.seasonEn}
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {isBn ? activeSeason.bengaliMonthsBn : activeSeason.bengaliMonthsEn}
          </span>
        </div>

        <div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
            {isBn ? 'প্রধান শস্য ও ফসল: ' : 'Key Crops & Produce: '}
            <strong className="text-slate-900 dark:text-white font-extrabold">
              {isBn ? activeSeason.cropsBn : activeSeason.cropsEn}
            </strong>
          </p>
        </div>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-emerald-500/20">
          💡 <span className="font-bold">{isBn ? 'কৃষক পরামর্শ: ' : 'Farming Advisory: '}</span>
          {isBn ? activeSeason.adviceBn : activeSeason.adviceEn}
        </p>

        <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
          <span>🌦️ {isBn ? 'আবহাওয়া ফোকাস: ' : 'Weather Focus: '}</span>
          <span>{isBn ? activeSeason.weatherFocusBn : activeSeason.weatherFocusEn}</span>
        </div>
      </div>
    </div>
  );
};
