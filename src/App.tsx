import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CitySelector } from './components/aqi/CitySelector';
import { AqiOverviewCard } from './components/aqi/AqiOverviewCard';
import { PollutantBreakdown } from './components/aqi/PollutantBreakdown';
import { SmogHourlyForecast } from './components/aqi/SmogHourlyForecast';
import { LifestyleForm } from './components/routines/LifestyleForm';
import { RoutineGenerator } from './components/routines/RoutineGenerator';
import { IaqHacksLab } from './components/hacks/IaqHacksLab';
import { DirectImpactDashboard } from './components/impact/DirectImpactDashboard';
import { CommunityActionBeacon } from './components/community/CommunityActionBeacon';
import { GenAiAssistantModal } from './components/assistant/GenAiAssistantModal';
import { ApiKeyConfigModal } from './components/assistant/ApiKeyConfigModal';
import { HelpInfoModal } from './components/common/HelpInfoModal';
import { useAqiData } from './hooks/useAqiData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FamilyProfile } from './types/routines';
import { Sparkles } from 'lucide-react';

const DEFAULT_PROFILE: FamilyProfile = {
  cityName: 'Delhi - Anand Vihar',
  familyMembersCount: 4,
  hasInfants: true,
  hasSeniors: true,
  hasAsthmaRespiratory: false,
  hasPets: false,
  commuteMode: 'metro',
  cookingFuel: 'induction',
  heatingType: 'electric_blower',
  ventilationType: 'diy_filtered',
  dailyCommuteDistanceKm: 18,
};

export const App: React.FC = () => {
  // Theme & Accessibility States
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('vayumitra_dark_mode', false);
  const [highContrast, setHighContrast] = useLocalStorage<boolean>('vayumitra_high_contrast', false);

  // Modal States
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // AQI Data Hook
  const {
    cities,
    selectedCityId,
    cityData,
    isLoading,
    selectCity,
    refresh,
  } = useAqiData();

  // Family Profile State
  const [familyProfile, setFamilyProfile] = useLocalStorage<FamilyProfile>(
    'vayumitra_family_profile',
    DEFAULT_PROFILE
  );

  // Sync profile city with selected city
  useEffect(() => {
    if (cityData) {
      setFamilyProfile((prev) => ({
        ...prev,
        cityName: cityData.name,
      }));
    }
  }, [cityData, setFamilyProfile]);

  // Synchronize dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${highContrast ? 'contrast-125' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        highContrast={highContrast}
        toggleHighContrast={() => setHighContrast(!highContrast)}
      />

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* City Station Selector Ribbon */}
        <CitySelector
          cities={cities}
          selectedCityId={selectedCityId}
          onSelectCity={selectCity}
          onRefresh={refresh}
          isLoading={isLoading}
        />

        {/* Primary AQI Overview & Weather Station Card */}
        <AqiOverviewCard
          city={cityData}
          highContrast={highContrast}
        />

        {/* Hourly Smog Forecast & Thermal Inversion Tracker */}
        <SmogHourlyForecast
          forecast={cityData.forecast}
        />

        {/* Detailed Pollutant Breakdown (PM2.5, PM10, NO2, etc.) */}
        <PollutantBreakdown
          pollutants={cityData.pollutants}
        />

        {/* Family Lifestyle Profile & Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <LifestyleForm
              profile={familyProfile}
              onChangeProfile={setFamilyProfile}
            />
          </div>

          <div className="lg:col-span-7">
            <RoutineGenerator
              profile={familyProfile}
              city={cityData}
            />
          </div>
        </div>

        {/* Indoor Air Quality (IAQ) Hacks Lab & DIY Purifier Calculator */}
        <IaqHacksLab />

        {/* Direct Impact Quantifier & Community Multiplier */}
        <DirectImpactDashboard
          profile={familyProfile}
          city={cityData}
        />

        {/* Community Action Beacon & RWA Blueprint */}
        <CommunityActionBeacon />
      </main>

      {/* Persistent Floating Chat Trigger */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-emerald-400 active:scale-95"
          aria-label="Open VayuBot GenAI Assistant"
        >
          <Sparkles className="w-5 h-5 animate-spin-slow" />
          <span className="font-bold text-xs sm:text-sm">Ask VayuBot</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <GenAiAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        city={cityData}
        profile={familyProfile}
      />

      <ApiKeyConfigModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => {}}
      />

      <HelpInfoModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default App;
