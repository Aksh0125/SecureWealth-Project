import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import ListItem from '../ListItem';
import { useChartStyles } from './chartConfigs';

// Market data constants (colors tuned for white bg)
const MARKET_DATA = [
  { name: 'NIFTY', value: 1.2, color: '#15803d' },
  { name: 'SENSEX', value: -0.4, color: '#b91c1c' },
  { name: 'BANK NIFTY', value: 0.8, color: '#15803d' },
  { name: 'MIDCAP', value: 2.1, color: '#15803d' }
];

const HOLDINGS_DATA = [
  { name: 'NIFTY 50 ETF', price: '₹22,415', change: '+1.2%', changeType: 'up' },
  { name: 'Reliance Ind.', price: '₹2,847', change: '-0.4%', changeType: 'down' },
  { name: 'HDFC Bank', price: '₹1,654', change: '+0.8%', changeType: 'up' },
  { name: 'Infosys', price: '₹1,512', change: '+2.1%', changeType: 'up' }
];

const TopHoldings = ({ t }) => (
  <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 mb-4 shadow-sm">
    <div className="text-[13px] font-semibold text-[#1a1a1a] mb-4">{t.tophold}</div>
    {HOLDINGS_DATA.map((holding) => (
      <React.Fragment key={holding.name}>
        <ListItem label={holding.name} value={holding.change} badgeType={holding.changeType} />
        <div className="flex justify-end text-[13px] text-[#4a4a4a] py-2.5 border-b border-[#eeeeee] last:border-b-0">
          <span>{holding.price}</span>
        </div>
      </React.Fragment>
    ))}
  </div>
);

const MarketOverviewChart = () => {
  const { tickStyle, tooltipContentStyle, tooltipLabelStyle } = useChartStyles();

  const yAxisFormatter = useMemo(() => (value) => `${value}%`, []);

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
      <div className="text-[13px] font-semibold text-[#1a1a1a] mb-4">Market overview</div>
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MARKET_DATA}>
            <XAxis
              dataKey="name"
              stroke="#9a9a9a"
              style={{ fontSize: '11px' }}
              tick={tickStyle}
            />
            <YAxis
              stroke="#9a9a9a"
              style={{ fontSize: '11px' }}
              tick={tickStyle}
              tickFormatter={yAxisFormatter}
            />
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              cursor={{ fill: '#fde8ec' }}
            />
            <Bar dataKey="value" radius={4}>
              {MARKET_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MarketSection = ({ t }) => {
  return (
    <div>
      <div className="mb-5">
        <div className="text-xl font-semibold text-[#1a1a1a]">{t.f3}</div>
      </div>
      <TopHoldings t={t} />
      <MarketOverviewChart />
    </div>
  );
};

export default MarketSection;
