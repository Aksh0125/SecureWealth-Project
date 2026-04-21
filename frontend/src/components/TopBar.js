import React, { useMemo } from 'react';

const TabButton = ({ tab, activeSection, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs cursor-pointer border transition-colors ${
      activeSection === tab.key
        ? 'bg-[#c8102e] border-[#c8102e] text-white font-semibold'
        : 'bg-white border-[#e5e5e5] text-[#3a3a3a] hover:bg-[#fde8ec] hover:text-[#c8102e] hover:border-[#f5c7cf]'
    }`}
    data-testid={`topbar-tab-${tab.key}`}
  >
    {tab.label}
  </button>
);

const LanguageSelector = ({ language, onToggle, onSelect }) => (
  <div className="flex gap-2 items-center">
    <button
      onClick={onToggle}
      className="text-[11px] px-3 py-1.5 bg-white border border-[#e5e5e5] text-[#3a3a3a] rounded-full cursor-pointer hover:bg-[#fde8ec] hover:text-[#c8102e] hover:border-[#f5c7cf] transition-colors"
      data-testid="topbar-language-toggle"
    >
      ENG / हिंदी
    </button>
    <select
      value={language === 'en' || language === 'hi' ? '' : language}
      onChange={onSelect}
      className="text-[11px] px-2.5 py-1.5 bg-white border border-[#e5e5e5] text-[#3a3a3a] rounded-full cursor-pointer hover:border-[#f5c7cf]"
      data-testid="topbar-language-select"
    >
      <option value="">Other</option>
      <option value="ta">Tamil</option>
      <option value="te">Telugu</option>
      <option value="ml">Malayalam</option>
      <option value="kn">Kannada</option>
      <option value="bn">Bengali</option>
      <option value="mr">Marathi</option>
      <option value="gu">Gujarati</option>
      <option value="pa">Punjabi</option>
    </select>
  </div>
);

const DigitalTwinIndicator = ({ label }) => (
  <div
    className="flex items-center gap-1.5 text-xs text-[#c8102e] font-semibold"
    data-testid="digital-twin-indicator"
  >
    <span className="w-[7px] h-[7px] rounded-full bg-[#c8102e] animate-pulse" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

const TopBar = ({ activeSection, setActiveSection, language, setLanguage, t, onLogout }) => {
  const tabs = useMemo(() => [
    { key: 'spending', label: t.f1 },
    { key: 'risk', label: t.f2 },
    { key: 'market', label: t.f3 },
    { key: 'bank', label: t.f4 },
    { key: 'assets', label: t.f5 },
    { key: 'suggestions', label: t.f6 },
    { key: 'security', label: t.f7 }
  ], [t]);

  const handleLangToggle = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleLangSelect = (e) => {
    if (e.target.value) {
      setLanguage(e.target.value);
    }
  };

  return (
    <div
      className="flex justify-between items-center px-6 py-3.5 border-b border-[#e5e5e5] bg-white"
      data-testid="topbar"
    >
      <div className="flex gap-1 flex-wrap">
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            activeSection={activeSection}
            onClick={() => setActiveSection(tab.key)}
          />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector
          language={language}
          onToggle={handleLangToggle}
          onSelect={handleLangSelect}
        />
        <DigitalTwinIndicator label={t.dt} />
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="text-[11px] px-3 py-1.5 bg-[#c8102e] text-white rounded-full cursor-pointer hover:bg-[#a80d26] font-semibold transition-colors"
            data-testid="topbar-logout-button"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
