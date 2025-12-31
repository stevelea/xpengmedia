import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { otherServices } from '../data/platforms';
import { PlatformCategorySection } from '../components/platforms/PlatformCategorySection';
import { useLocale } from '../context/LocaleContext';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

const ChargingPage: React.FC = () => {
  const { t, tCategory } = useLocale();

  // Location state for the charging map
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        // Default to a central location if geolocation fails
        // Using London as default
        setLocation({
          latitude: 51.5074,
          longitude: -0.1278,
          loading: false,
          error: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  // Find charging-related categories from otherServices
  const chargingCategories = otherServices?.filter(cat =>
    cat.id.includes('charging') ||
    cat.id.includes('ev') ||
    cat.id.includes('navigation')
  ) || [];

  // Build Open Charge Map URL with location
  const getMapUrl = () => {
    if (location.latitude && location.longitude) {
      return `https://map.openchargemap.io/?mode=embedded&latitude=${location.latitude}&longitude=${location.longitude}&zoom=12`;
    }
    // Default map view (Europe centered)
    return 'https://map.openchargemap.io/?mode=embedded&latitude=51.5074&longitude=-0.1278&zoom=10';
  };

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-green-500 p-[1px] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.65)]">
        <div className="rounded-[calc(2rem-1px)] bg-slate-950/60 px-8 py-12 backdrop-blur-xl md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">XPENG CHARGING</p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              {t('chargingPageTitle')}
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70">
              {t('chargingPageSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#charging-map"
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                {t('findStations')}
              </a>
              <a
                href="#navigation"
                className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                {t('planRoute')}
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* EV Charging Map Section */}
      <section id="charging-map" className="scroll-mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('chargingMapTitle') !== 'chargingMapTitle' ? t('chargingMapTitle') : 'Charging Stations Near You'}
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {t('chargingMapSubtitle') !== 'chargingMapSubtitle' ? t('chargingMapSubtitle') : 'Find EV charging stations based on your current location'}
              </p>
            </div>
            {location.latitude && location.longitude && !location.error && (
              <div className="hidden md:flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{t('locationDetected') !== 'locationDetected' ? t('locationDetected') : 'Location detected'}</span>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-lg">
            {location.loading ? (
              <div className="flex h-[500px] items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto"></div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t('detectingLocation') !== 'detectingLocation' ? t('detectingLocation') : 'Detecting your location...'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {location.error && (
                  <div className="absolute top-4 left-4 right-4 z-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-medium">{t('locationError') !== 'locationError' ? t('locationError') : 'Location unavailable'}:</span> {t('usingDefaultLocation') !== 'usingDefaultLocation' ? t('usingDefaultLocation') : 'Showing default map. Allow location access for nearby stations.'}
                  </div>
                )}
                <iframe
                  src={getMapUrl()}
                  title="EV Charging Stations Map"
                  className="h-[500px] w-full border-0"
                  loading="lazy"
                  allow="geolocation"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </>
            )}
          </div>

          {/* Map Attribution */}
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-right">
            {t('poweredBy') !== 'poweredBy' ? t('poweredBy') : 'Powered by'}{' '}
            <a
              href="https://openchargemap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline dark:text-green-400"
            >
              Open Charge Map
            </a>
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <div className="space-y-10">
        {chargingCategories.map((category, index) => {
          // Get translated category info
          const categoryTrans = tCategory(category.id);
          const localizedCategory = {
            ...category,
            title: categoryTrans.title || category.title,
            subtitle: categoryTrans.subtitle || category.subtitle,
          };

          return (
            <div key={category.id} id={category.id}>
              <PlatformCategorySection
                category={localizedCategory}
                index={index}
                maxPlatforms={12}
              />
            </div>
          );
        })}
      </div>

      {/* If no specific charging categories, show a helpful message */}
      {chargingCategories.length === 0 && (
        <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-800">
          <div className="text-6xl mb-4">🔋</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            {t('noServicesForRegion')}
          </h3>
        </div>
      )}
    </div>
  );
};

export default ChargingPage;
