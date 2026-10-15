import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { speakWeatherAlert, stopSpeech } from '../services/voiceAlertService';
import { ShieldAlert, Volume2, VolumeX, X } from 'lucide-react';

interface SignalItem {
  num: number;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
}

const SIGNALS: SignalItem[] = [
  { num: 1, titleBn: '১ নম্বর দূরবর্তী সতর্ক সংকেত', titleEn: 'Signal No. 1: Distant Cautionary', descBn: 'জাহাজ ছেড়ে যাওয়ার পর দূর সাগরে একটি ঝোড়ো হাওয়া সৃষ্টি হয়েছে।', descEn: 'A storm or squall has formed in the distant deep sea.' },
  { num: 2, titleBn: '২ নম্বর দূরবর্তী হুশিয়ারী সংকেত', titleEn: 'Signal No. 2: Distant Warning', descBn: 'দূরে গভীর সাগরে একটি ঘূর্ণিঝড় সৃষ্টি হয়েছে, সমুদ্রবন্দরে ঝড় বয়ে যেতে পারে।', descEn: 'A cyclonic storm has formed in the deep sea with potential impact.' },
  { num: 3, titleBn: '৩ নম্বর স্থানীয় সতর্ক সংকেত', titleEn: 'Signal No. 3: Local Cautionary', descBn: 'বন্দরে একটি ঝোড়ো হাওয়া বয়ে যেতে পারে, ছোট ছোট নৌযান সাবধানে চলাচল করুক।', descEn: 'Squally weather may affect the port; small watercraft should navigate with caution.' },
  { num: 4, titleBn: '৪ নম্বর স্থানীয় হুশিয়ারী সংকেত', titleEn: 'Signal No. 4: Local Warning', descBn: 'বন্দর ঘূর্ণিঝড় কবলিত, সমস্ত ছোট নৌযান অবিলম্বে নিরাপদ আশ্রয়ে চলো।', descEn: 'Port threatened by cyclonic squalls; all small vessels must take immediate shelter.' },
  { num: 5, titleBn: '৫ নম্বর বিপদ সংকেত', titleEn: 'Signal No. 5: Danger Signal', descBn: 'বন্দরটি একটি মাঝারি ধরনের ঘূর্ণিঝড়ের কবলে পতিত হয়েছে, উপকূলে জলোচ্ছ্বাসের আশঙ্কা।', descEn: 'Port will experience severe weather from a moderate cyclone with storm surge risk.' },
  { num: 6, titleBn: '৬ নম্বর বিপদ সংকেত', titleEn: 'Signal No. 6: Danger Signal (Right Track)', descBn: 'বন্দরটির ওপর দিয়ে ঘূর্ণিঝড়টি ডান দিক থেকে যাওয়ার সম্ভাবনা।', descEn: 'Severe cyclonic storm likely to cross leaving port to its right.' },
  { num: 7, titleBn: '৭ নম্বর বিপদ সংকেত', titleEn: 'Signal No. 7: Danger Signal (Left Track)', descBn: 'বন্দরটির ওপর দিয়ে বা কাছ দিয়ে প্রচণ্ড তীব্রতার ঘূর্ণিঝড় অতিক্রম করবে।', descEn: 'Severe cyclonic storm likely to cross leaving port to its left or over it.' },
  { num: 8, titleBn: '৮ নম্বর মহাবিপদ সংকেত', titleEn: 'Signal No. 8: Great Danger Signal', descBn: 'প্রচণ্ড তীব্রতার সাইক্লোন সরাসরি বন্দর অতিক্রম করবে, ৮-১২ ফুট উঁচু জলোচ্ছ্বাস হতে পারে।', descEn: 'Very severe cyclone will cross directly over the port with dangerous tidal surge.' },
  { num: 9, titleBn: '৯ নম্বর মহাবিপদ সংকেত', titleEn: 'Signal No. 9: Great Danger Signal', descBn: 'ঘূর্ণিঝড়ের তীব্রতা অত্যধিক, সমস্ত উপকূলবাসী অবিলম্বে সাইক্লোন শেল্টারে যান।', descEn: 'Severe cyclone with violent winds; immediate coastal evacuation to shelters advised.' },
  { num: 10, titleBn: '১০ নম্বর মহাবিপদ সংকেত', titleEn: 'Signal No. 10: Super Cyclone Danger', descBn: 'সর্বোচ্চ মাত্রার সাইক্লোনিক বিপর্যয়, বন্দরের ওপর দিয়ে সরাসরি সাইক্লোনের কেন্দ্র যাবে।', descEn: 'Maximum super cyclonic devastation; eye of cyclone crossing directly over port.' },
];

export const BmdSignalGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { languageCode, t } = useApp();
  const [playingNum, setPlayingNum] = useState<number | null>(null);

  if (!isOpen) return null;
  const isBn = languageCode === 'bn';

  const handleSpeakSignal = (num: number, title: string, desc: string) => {
    if (playingNum === num) {
      stopSpeech();
      setPlayingNum(null);
      return;
    }

    setPlayingNum(num);
    const speech = isBn ? `${title}। ${desc}` : `Warning ${title}. ${desc}`;
    speakWeatherAlert(speech, languageCode, () => {
      setPlayingNum(null);
    });
  };

  const handleClose = () => {
    stopSpeech();
    setPlayingNum(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {t('bmdSignalsModalTitle')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('bmdSignalsModalSub')}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {SIGNALS.map((sig) => {
            const isPlaying = playingNum === sig.num;
            const title = isBn ? sig.titleBn : sig.titleEn;
            const desc = isBn ? sig.descBn : sig.descEn;

            return (
              <div
                key={sig.num}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {sig.num}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <button
                  onClick={() => handleSpeakSignal(sig.num, title, desc)}
                  className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                    isPlaying
                      ? 'bg-red-600 text-white animate-pulse shadow-md'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                  title={isPlaying ? t('stopAudio') : t('listenAudio')}
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-500" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
