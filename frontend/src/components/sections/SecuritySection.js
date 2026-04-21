import React from 'react';
import ListItem from '../ListItem';

const SecuritySection = ({ t }) => {
  return (
    <div>
      <div className="mb-5">
        <div className="text-xl font-semibold text-[#1a1a1a]">{t.f7}</div>
      </div>
      <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
        <ListItem label={t.pass} value="Strong" badgeType="ok" />
        <ListItem label={t.twofa} value="Enabled" badgeType="ok" />
        <ListItem label={t.devices} value="3" badgeType="warn" />
        <ListItem label={t.lastlogin} value="Today, 9:42 AM" badgeType="info" />
      </div>
    </div>
  );
};

export default SecuritySection;
