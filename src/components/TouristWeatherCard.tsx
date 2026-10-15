import React from 'react';
import { useApp } from '../context/AppContext';
import { LocationItem } from '../types';
import { MapPin, Luggage } from 'lucide-react';

const TOURIST_SPOTS: (LocationItem & { descBn: string; descEn: string })[] = [
  {
    id: 'spot-sajek',
    name: 'Sajek Valley',
    localName: 'সাজেক ভ্যালি, রাঙ্গামাটি',
    country: 'Bangladesh',
    countryCode: 'BD',
    lat: 23.3820,
    lng: 92.2938,
    admin1: 'Rangamati Hill Tracts',
    descBn: 'মেঘের রাজ্য ও মনোরম পাহাড় (৯৫% স্কোর)',
    descEn: 'Kingdom of clouds & hills (95% Score)',
  },
  {
    id: 'spot-coxs',
    name: "Cox's Bazar",
    localName: 'কক্সবাজার সমুদ্র সৈকত',
    country: 'Bangladesh',
    countryCode: 'BD',
    lat: 21.4272,
    lng: 92.0058,
    admin1: 'Chattogram',
    descBn: 'বিশ্বের দীর্ঘতম সমুদ্র সৈকত (৯২% স্কোর)',
    descEn: 'World longest sea beach (92% Score)',
  },
  {
    id: 'spot-sreemangal',
    name: 'Sreemangal',
    localName: 'শ্রীমঙ্গল চা বাগান, মৌলভীবাজার',
    country: 'Bangladesh',
    countryCode: 'BD',
    lat: 24.3065,
    lng: 91.7296,
    admin1: 'Sylhet',
    descBn: 'সবুজ চা বাগান ও লাউয়াছড়া (৯৮% স্কোর)',
    descEn: 'Tea gardens & Lawachara forest (98% Score)',
  },
  {
    id: 'spot-sundarbans',
    name: 'Sundarbans',
    localName: 'সুন্দরবন ম্যানগ্রোভ বন',
    country: 'Bangladesh',
    countryCode: 'BD',
    lat: 21.9497,
    lng: 89.1833,
    admin1: 'Khulna',
    descBn: 'বিশ্বের বৃহত্তম ম্যানগ্রোভ বন (৮৮% স্কোর)',
    descEn: 'World largest mangrove forest (88% Score)',
  },
];

export const TouristWeatherCard: React.FC = () => {
  const { setSelectedLocation, languageCode, t } = useApp();
  const isBn = languageCode === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Luggage className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t('touristGuideTitle')}
            </h2>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              {t('touristGuideSub')}
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20">
          {t('touristGuideBadge')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {TOURIST_SPOTS.map((spot) => {
          const spotLabel = isBn ? (spot.localName || spot.name) : spot.name;
          const spotDesc = isBn ? spot.descBn : spot.descEn;

          return (
            <button
              key={spot.id}
              onClick={() => setSelectedLocation(spot)}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-slate-900 dark:text-white">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{spotLabel}</span>
              </div>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold line-clamp-1">
                {spotDesc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
