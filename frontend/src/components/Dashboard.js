import React, { useState } from 'react';
import { translations } from '../translations';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SpendingSection from './sections/SpendingSection';
import RiskSection from './sections/RiskSection';
import MarketSection from './sections/MarketSection';
import BankSection from './sections/BankSection';
import AssetsSection from './sections/AssetsSection';
import SuggestionsSection from './sections/SuggestionsSection';
import SecuritySection from './sections/SecuritySection';

const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('spending');
  const [language, setLanguage] = useState('en');

  const t = translations[language] || translations.en;

  const renderSection = () => {
    switch (activeSection) {
      case 'spending':
        return <SpendingSection t={t} />;
      case 'risk':
        return <RiskSection t={t} />;
      case 'market':
        return <MarketSection t={t} />;
      case 'bank':
        return <BankSection t={t} />;
      case 'assets':
        return <AssetsSection t={t} />;
      case 'suggestions':
        return <SuggestionsSection t={t} />;
      case 'security':
        return <SecuritySection t={t} />;
      default:
        return <SpendingSection t={t} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7f8] text-[#1a1a1a]">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        t={t}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          language={language}
          setLanguage={setLanguage}
          t={t}
          onLogout={onLogout}
        />
        <div className="flex-1 p-6 overflow-y-auto">{renderSection()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
