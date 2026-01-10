
import React, { useState } from 'react';
import { MANPOWER_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const AnalysisPage: React.FC = () => {
  const [viewType, setViewType] = useState<'yearly' | 'monthly'>('yearly');
  const [activeSubTab, setActiveSubTab] = useState<'current' | 'next'>('current');

  const currentMonthIdx = 7; // August
  const displayData = viewType === 'yearly' 
    ? MANPOWER_DATA 
    : [MANPOWER_DATA[activeSubTab === 'current' ? currentMonthIdx : currentMonthIdx + 1]];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">人力效能与缺口监控</h2>
          <p className="text-sm text-slate-500 mt-1">全局视角下的 2026 年度计划人力保障力测算结果</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
             <button 
                onClick={() => setViewType('yearly')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewType === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >年度视图</button>
             <button 
                onClick={() => setViewType('monthly')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewType === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >月度视图</button>
          </div>
          {viewType === 'monthly' && (
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setActiveSubTab('current')}
                className={`px-3 py-1 rounded text-xs font-bold ${activeSubTab === 'current' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >当月 (8月)</button>
              <button 
                onClick={() => setActiveSubTab('next')}
                className={`px-3 py-1 rounded text-xs font-bold ${activeSubTab === 'next' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >次月 (9月)</button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard title="月度平均裕度" value={viewType === 'yearly' ? "550.8" : displayData[0].marginHours.toString()} unit="小时" status="good" sub="可用时长 - 测算需求" />
        <MetricCard title="人员短缺预警" value={viewType === 'yearly' ? "3" : (displayData[0].marginHours < 200 ? "1" : "0")} unit="人" status={displayData[0].marginHours < 200 ? "warning" : "good"} sub="关键岗次部分月份缺口" />
        <MetricCard title="训练损耗" value={displayData[0].trainingAttrition.toString()} unit="%" status="normal" sub="年度各类培训损耗均值" />
        <MetricCard title="收益转化率" value="96.2" unit="%" status="good" sub="人力资源有效转化产出" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-6">机组人力保障趋势 ({viewType === 'yearly' ? '2026 全年' : displayData[0].month})</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
                <Bar dataKey="totalAvailableHours" name="可保障小时" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="requiredHours" name="需求保障小时" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-6">损耗监控 ({viewType === 'yearly' ? '2026 全年' : displayData[0].month})</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
                <Line type="monotone" dataKey="trainingAttrition" name="训练/考试" stroke="#f43f5e" strokeWidth={3} dot={{r: 3}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="leaveAttrition" name="休假" stroke="#10b981" strokeWidth={3} dot={{r: 3}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="officialBusiness" name="公务/会议" stroke="#f59e0b" strokeWidth={3} dot={{r: 3}} activeDot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">飞行人力保障明细表</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-center border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-black text-slate-800 w-40 sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">年度指标</th>
                {displayData.map(d => <th key={d.month} className="px-2 py-4 min-w-[70px]">{d.month}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
              <DataTableRow label="机长可用总数" values={displayData.map(d => d.captains)} />
              <DataTableRow label="副驾驶可用总数" values={displayData.map(d => d.fo)} />
              <DataTableRow label="训练/考试损耗" values={displayData.map(d => d.trainingAttrition)} />
              <DataTableRow label="公务/会议占用" values={displayData.map(d => d.officialBusiness)} />
              <DataTableRow label="各类休假损耗" values={displayData.map(d => d.leaveAttrition)} />
              <tr className="bg-slate-50/50">
                <td className="px-6 py-4 text-left font-black text-slate-800 border-r border-slate-100 sticky left-0 bg-slate-50/50 z-10">可保障总小时</td>
                {displayData.map(d => <td key={d.month} className="px-2 py-4 font-bold text-blue-600">{d.totalAvailableHours}</td>)}
              </tr>
              <tr className="bg-blue-50/30">
                <td className="px-6 py-4 text-left font-black text-slate-900 border-r border-slate-100 sticky left-0 bg-blue-50/30 z-10">人力裕度 (Margin)</td>
                {displayData.map((d, idx) => (
                  <td key={d.month} className={`px-2 py-4 font-black ${d.marginHours < 200 ? 'text-rose-600 bg-rose-50' : 'text-slate-900'}`}>
                    {d.marginHours}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string, value: string, unit: string, status: 'good' | 'warning' | 'normal', sub: string }> = ({ title, value, unit, status, sub }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
      <div className={`w-2 h-2 rounded-full ${
        status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-rose-500' : 'bg-blue-500'
      }`}></div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black text-slate-800">{value}</span>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </div>
    <p className="text-[10px] text-slate-400 mt-2 font-medium">{sub}</p>
  </div>
);

const DataTableRow: React.FC<{ label: string, values: number[], highlightIndex?: number[] }> = ({ label, values, highlightIndex }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4 text-left font-bold text-slate-700 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10">{label}</td>
    {values.map((v, i) => (
      <td key={i} className={`px-2 py-4 ${highlightIndex?.includes(i) ? 'text-rose-600 font-bold' : ''}`}>
        {v}
      </td>
    ))}
  </tr>
);

export default AnalysisPage;
