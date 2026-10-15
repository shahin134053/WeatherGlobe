import React from 'react';
import { useApp } from '../context/AppContext';
import { History, ThermometerSnowflake, Flame } from 'lucide-react';

export const WeatherHistoryCard: React.FC = () => {
  const { languageCode, t } = useApp();
  const isBn = languageCode === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t('climateHistoryTitle')}
            </h2>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              {t('climateHistorySub')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-[10px] text-red-700 dark:text-red-300 font-bold">
              {t('highestTempRecord')}
            </p>
            <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">
              {isBn ? '৪৫.১° সেলসিয়াস' : '45.1° Celsius'}
            </p>
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400">
              {t('highestTempLocation')}
            </p>
          </div>
        </div>

        <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center gap-2.5">
          <ThermometerSnowflake className="w-5 h-5 text-sky-500 shrink-0" />
          <div>
            <p className="text-[10px] text-sky-700 dark:text-sky-300 font-bold">
              {t('lowestTempRecord')}
            </p>
            <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">
              {isBn ? '২.৬° সেলসিয়াস' : '2.6° Celsius'}
            </p>
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400">
              {t('lowestTempLocation')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
