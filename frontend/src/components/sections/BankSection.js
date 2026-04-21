import React from 'react';
import ListItem from '../ListItem';
import { useWealth } from '../../context/WealthContext';

const BankSection = ({ t }) => {
  const { aaAccounts, formatted } = useWealth();

  return (
    <div>
      <div className="mb-5">
        <div className="text-xl font-semibold text-[#1a1a1a]">{t.f4}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-[#6b6b6b] mb-2 font-semibold uppercase tracking-wider">Total Linked Balance</div>
          <div className="text-[22px] font-semibold text-[#1a1a1a]">{formatted.aaBalance || "₹0"}</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-[#6b6b6b] mb-2 font-semibold uppercase tracking-wider">Linked Institutions</div>
          <div className="text-[22px] font-semibold text-[#1d4ed8]">{aaAccounts.length}</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-[#6b6b6b] mb-2 font-semibold uppercase tracking-wider">Status</div>
          <div className="text-[22px] font-semibold text-[#15803d]">Active</div>
        </div>
      </div>
      
      {aaAccounts.length > 0 ? (
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
          <div className="text-[13px] font-semibold text-[#1a1a1a] mb-4">Linked Bank Accounts</div>
          {aaAccounts.map((acc, i) => (
            <ListItem 
              key={i}
              label={`${acc.fip_name} (${acc.masked_account_number})`} 
              value={`₹${new Intl.NumberFormat('en-IN').format(acc.current_balance)}`} 
              badgeType="info" 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-10 text-center shadow-sm">
          <p className="text-[#4a4a4a]">No bank accounts linked via AA yet.</p>
        </div>
      )}
    </div>
  );
};

export default BankSection;
