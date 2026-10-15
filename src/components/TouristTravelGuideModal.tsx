import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Luggage, MapPin, Sparkles, X } from 'lucide-react';

interface TouristDestination {
  id: string;
  name: string;
  nameBn: string;
  regionBn: string;
  regionEn: string;
  bestMonthsBn: string;
  bestMonthsEn: string;
  clothingTipsBn: string;
  clothingTipsEn: string;
  packingListBn: string[];
  packingListEn: string[];
  safetyIndexPercent: number;
}

const TOURIST_DESTINATIONS: TouristDestination[] = [
  {
    id: 'sajek',
    name: 'Sajek Valley',
    nameBn: 'সাজেক ভ্যালি (মেঘের রাজ্য)',
    regionBn: 'রাঙ্গামাটি পাহাড়ি অঞ্চল',
    regionEn: 'Rangamati Hill Tracts',
    bestMonthsBn: 'সেপ্টেম্বর থেকে মার্চ (শীত ও মেঘের মৌসুম)',
    bestMonthsEn: 'September to March (Winter & Cloud season)',
    clothingTipsBn: 'পাহাড়ের ওপর সকালে ও রাতে ভালো ঠান্ডা থাকে। জ্যাকেট বা উইন্ডব্রেকার সাথে রাখুন।',
    clothingTipsEn: 'Cold temperatures on hilltops at morning and night. Carry a windbreaker or warm jacket.',
    packingListBn: ['উইন্ডপ্রুফ জ্যাকেট', 'পাহাড়ি ট্রেকিং জুতো', 'পাওয়ার ব্যাংক', 'প্যারাসিটামল ও ফার্স্ট এইড'],
    packingListEn: ['Windproof jacket', 'Trekking shoes', 'Power bank', 'First aid & medicine'],
    safetyIndexPercent: 95,
  },
  {
    id: 'coxsbazar',
    name: "Cox's Bazar",
    nameBn: 'কক্সবাজার সমুদ্র সৈকত',
    regionBn: 'চট্টগ্রাম উপকূল',
    regionEn: 'Chattogram Coast',
    bestMonthsBn: 'অক্টোবর থেকে এপ্রিল (স্বচ্ছ পানি ও শান্ত সমুদ্র)',
    bestMonthsEn: 'October to April (Calm seas & clear water)',
    clothingTipsBn: 'হালকা সুতির পোশাক, সানগ্লাস ও সানস্ক্রিন লোশন ব্যবহার করুন।',
    clothingTipsEn: 'Light cotton wear, sunglasses, and high-SPF sunscreen.',
    packingListBn: ['সানগ্লাস ও হ্যাট', 'সানস্ক্রিন এসপিএফ ৫০', 'সুইমস্যুট / হালকা পোশাক', 'ওয়াটারপ্রুফ ফোন ব্যাগ'],
    packingListEn: ['Sunglasses & Hat', 'Sunscreen SPF 50', 'Light beachwear', 'Waterproof phone pouch'],
    safetyIndexPercent: 92,
  },
  {
    id: 'sreemangal',
    name: 'Sreemangal',
    nameBn: 'শ্রীমঙ্গল চা বাগান ও লাউয়াছড়া',
    regionBn: 'মৌলভীবাজার, সিলেট',
    regionEn: 'Moulvibazar, Sylhet',
    bestMonthsBn: 'জুলাই থেকে মার্চ (চা বাগানের সবুজ রূপ ও পাখি দর্শন)',
    bestMonthsEn: 'July to March (Lush green tea gardens & bird watching)',
    clothingTipsBn: 'বনের ভেতর হাঁটার জন্য ফুল হাতা পোশাক ও আরামদায়ক ক্যাজুয়াল জুতো পরুন।',
    clothingTipsEn: 'Full sleeve shirts and comfortable walking shoes for rainforest treks.',
    packingListBn: ['মশানিরোধক ক্রিম (Odomos)', 'হাঁটার রানিং শু', 'বৃষ্টির জন্য হালকা ছাতা', 'ক্যামেরা'],
    packingListEn: ['Mosquito repellent', 'Walking sneakers', 'Light umbrella', 'Camera'],
    safetyIndexPercent: 98,
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans',
    nameBn: 'সুন্দরবন ম্যানগ্রোভ ফরেস্ট',
    regionBn: 'খুলনা / বাগেরহাট',
    regionEn: 'Khulna / Bagerhat',
    bestMonthsBn: 'নভেম্বর থেকে ফেব্রুয়ারি (হরিণ ও বাঘ দেখার সেরা সময়)',
    bestMonthsEn: 'November to February (Best window for wildlife spotting)',
    clothingTipsBn: 'হালকা সবুজ বা খাকি রঙের সুতির পোশাক পরুন (উজ্জ্বল রঙ বুনো প্রাণীকে চমকে দেয়)।',
    clothingTipsEn: 'Muted olive or khaki clothing (bright colors distress wildlife).',
    packingListBn: ['বাইনোকুলার (Binoculars)', 'ফ্ল্যাশলাইট', 'লাইফ জ্যাকেট', 'ফার্স্ট এইড ও ব্যাকআপ মেডিসিন'],
    packingListEn: ['Binoculars', 'Flashlight', 'Life jacket', 'First aid kit'],
    safetyIndexPercent: 88,
  },
];

export const TouristTravelGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { languageCode } = useApp();
  const [selectedDestId, setSelectedDestId] = useState<string>('sajek');

  if (!isOpen) return null;
  const isBn = languageCode === 'bn';
  const dest = TOURIST_DESTINATIONS.find((d) => d.id === selectedDestId) || TOURIST_DESTINATIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {isBn ? 'পর্যটন স্পট আবহাওয়া ও ভ্রমণ গাইড' : 'Tourist Weather & Packing Guide'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'বাংলাদেশের জনপ্রিয় স্পটের স্মার্ট প্যাকিং ও নিরাপত্তা গাইড' : 'Smart packing and safety tips for Bangladesh travel spots'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spot selection chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TOURIST_DESTINATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDestId(d.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedDestId === d.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isBn ? d.nameBn.split(' ')[0] : d.name}
            </button>
          ))}
        </div>

        {/* Details Card */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-black text-base text-slate-900 dark:text-white">
                {isBn ? dest.nameBn : dest.name}
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isBn ? dest.regionBn : dest.regionEn}</span>
              </p>
            </div>
            <span className="bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-xs">
              {dest.safetyIndexPercent}% {isBn ? 'নিরাপত্তা সূচক' : 'Safety Score'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-amber-500/20 space-y-1">
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
              🗓️ {isBn ? 'ভ্রমণের সেরা সময়: ' : 'Best Travel Window: '}
              <strong className="text-slate-900 dark:text-white">{isBn ? dest.bestMonthsBn : dest.bestMonthsEn}</strong>
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
              👕 {isBn ? 'পোশাকের ধরন: ' : 'Clothing Tips: '}
              <span className="text-slate-800 dark:text-slate-200">{isBn ? dest.clothingTipsBn : dest.clothingTipsEn}</span>
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-900 dark:text-white text-xs mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isBn ? 'প্রয়োজনীয় প্যাকিং লিস্ট:' : 'Recommended Packing Items:'}</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {(isBn ? dest.packingListBn : dest.packingListEn).map((item, i) => (
                <div key={i} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
