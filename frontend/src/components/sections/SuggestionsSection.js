import React from 'react';
import TipCard from '../TipCard';

const SuggestionsSection = ({ t }) => {
  return (
    <div>
      <div className="mb-5">
        <div className="text-xl font-semibold text-[#1a1a1a]">{t.f6}</div>
        <div className="text-[13px] text-[#4a4a4a] mt-1">{t.wisub}</div>
      </div>
      <TipCard number={1} text={t.tip1} />
      <TipCard number={2} text={t.tip2} />
      <TipCard number={3} text={t.tip3} />
    </div>
  );
};

export default SuggestionsSection;
