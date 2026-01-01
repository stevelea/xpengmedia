import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import { useCustomServices } from '../../context/CustomServicesContext';
import { TrashIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export const CustomServicesList: React.FC = () => {
  const { t } = useLocale();
  const { customServices, removeService } = useCustomServices();

  if (customServices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <GlobeAltIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>{t('noCustomServices') || 'No custom services yet'}</p>
        <p className="text-sm mt-1">{t('addServiceHint') || 'Add your first service above'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {customServices.map((service) => (
        <div
          key={service.id}
          className="flex items-center gap-3 p-3
                     bg-gray-50 dark:bg-gray-800/50
                     rounded-xl
                     group"
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {service.icon ? (
              <img
                src={service.icon}
                alt={service.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-lg">${service.name.charAt(0).toUpperCase()}</span>`;
                }}
              />
            ) : (
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                {service.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Name and URL */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {service.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {service.url}
            </p>
          </div>

          {/* Delete button */}
          <button
            onClick={() => removeService(service.id)}
            className="p-2 text-gray-400 hover:text-red-500
                       opacity-0 group-hover:opacity-100
                       transition-all"
            title={t('removeService') || 'Remove service'}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CustomServicesList;
