import React from 'react';
import { XPENG_MODELS } from '../../types/auth';
import type { XpengModel } from '../../types/database';
import { useLocale } from '../../context/LocaleContext';

interface CarSelectorProps {
  value: XpengModel;
  onChange: (model: XpengModel) => void;
  disabled?: boolean;
}

export const CarSelector: React.FC<CarSelectorProps> = ({ value, onChange, disabled = false }) => {
  const { t } = useLocale();

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange((e.target.value || null) as XpengModel)}
        disabled={disabled}
        className="w-full px-4 py-3
                   bg-white dark:bg-gray-800
                   border border-gray-300 dark:border-gray-600
                   rounded-xl
                   text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   appearance-none cursor-pointer"
      >
        <option value="">{t('selectCarModel') || 'Select your XPENG model'}</option>
        {XPENG_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default CarSelector;
