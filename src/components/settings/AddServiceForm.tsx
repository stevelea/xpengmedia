import React, { useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { useCustomServices } from '../../context/CustomServicesContext';
import { PlusIcon } from '@heroicons/react/24/outline';

export const AddServiceForm: React.FC = () => {
  const { t } = useLocale();
  const { addService } = useCustomServices();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!name.trim()) {
      setError(t('serviceNameRequired') || 'Service name is required');
      return;
    }

    if (!url.trim()) {
      setError(t('serviceUrlRequired') || 'URL is required');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError(t('invalidUrl') || 'Please enter a valid URL');
      return;
    }

    // Add the service
    addService({
      name: name.trim(),
      url: url.trim(),
      icon: icon.trim() || '',
    });

    // Reset form
    setName('');
    setUrl('');
    setIcon('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('serviceName') || 'Service Name'} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('serviceNamePlaceholder') || 'e.g., Home Assistant'}
          className="w-full px-4 py-2.5
                     bg-white dark:bg-gray-900
                     border border-gray-300 dark:border-gray-600
                     rounded-xl
                     text-gray-900 dark:text-white
                     placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* URL input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('serviceUrl') || 'URL'} *
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://homeassistant.local:8123"
          className="w-full px-4 py-2.5
                     bg-white dark:bg-gray-900
                     border border-gray-300 dark:border-gray-600
                     rounded-xl
                     text-gray-900 dark:text-white
                     placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Icon URL input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('serviceIcon') || 'Icon URL'} ({t('optional') || 'optional'})
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="https://example.com/icon.png"
            className="flex-1 px-4 py-2.5
                       bg-white dark:bg-gray-900
                       border border-gray-300 dark:border-gray-600
                       rounded-xl
                       text-gray-900 dark:text-white
                       placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              <img
                src={icon}
                alt="Preview"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2
                   px-4 py-3
                   bg-blue-500 hover:bg-blue-600
                   text-white font-medium
                   rounded-xl
                   transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        {t('addService') || 'Add Service'}
      </button>
    </form>
  );
};

export default AddServiceForm;
