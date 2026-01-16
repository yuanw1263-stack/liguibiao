
import React, { useState, useRef, useEffect } from 'react';
import { MANPOWER_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Page } from '../types';

interface AnalysisPageProps {
  onNavigate: (page: Page) => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ onNavigate }) => {
  const [viewType, setViewType] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) setIsYearDropdownOpen(false);
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) setIsMonthDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMonthIdx = selectedMonth - 1;
  const displayData = viewType === 'yearly' 
    ? MANPOWER_DATA 
    : [MANPOWER_DATA[currentMonthIdx]];

  const monthsList = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
  const yearsList = [2025, 2026, 2027];

  return (
    <div className="space-y-6 max-full animate-in fade-in duration-300 pb-20">
      {/* Redesigned Process Banner based on image */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        {/* Top Teal Section */}
        <div className="bg-[#2D9384] p-4 flex items-center justify-between text-white relative">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <i className="fa-solid fa-circle-info text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight tracking-wide">年度计划任务：2026年公司计划</h3>
              <p className="text-[11px] opacity-80 mt-1">当前阶段：飞行员预排班中 (Step 2/4)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate(Page.PILOT_PRE_SCHEDULE)}
              className="bg-white text-[#2D9384] px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 group"
            >
              进入预排班 <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Bottom Steps Section */}
        <div className="px-12 py-6 bg-white flex items-center justify-between relative">
          {/* Progress Lines */}
          <div className="absolute top-1/2 left-[15%] right-[15%] h-px bg-slate-100 -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-[15%] w-[25%] h-px bg-emerald-400 -translate-y-1/2 z-0"></div>

          {/* Step 1: Completed */}
          <div 
            onClick={() => onNavigate(Page.STRATEGY)}
            className="flex items-center gap-3 cursor-pointer group z-10"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-check text-xs"></i>
            </div>
            <span className="text-sm font-bold text-slate-500">策略管理</span>
          </div>

          {/* Step 2: Active */}
          <div 
            onClick={() => onNavigate(Page.PILOT_PRE_SCHEDULE)}
            className="flex items-center gap-3 cursor-pointer group z-10 bg-[#E8F6F4] px-5 py-2 rounded-full ring-1 ring-[#2D9384]/20"
          >
            <div className="w-8 h-8 rounded-full bg-[#2D9384] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-[#2D9384]/20">2</div>
            <span className="text-sm font-bold text-[#2D9384]">飞行员预排班</span>
          </div>

          {/* Step 3: Pending */}
          <div className="flex items-center gap-3 opacity-40 z-10 bg-white px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">3</div>
            <span className="text-sm font-bold text-slate-400">飞管训练审核</span>
          </div>

          {/* Step 4: Pending */}
          <div className="flex items-center gap-3 opacity-40 z-10 bg-white px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">4</div>
            <span className="text-sm font-bold text-slate-400">战规审核</span>
          </div>
        </div>
      </div>

      {/* Redesigned Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-slate-200">
           <button 
              onClick={() => setViewType('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'yearly' ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >年度监控</button>
           <button 
              onClick={() => setViewType('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'monthly' ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >月度监控</button>
        </div>
        
        <div className="flex items-center gap-4">
          {viewType === 'yearly' ? (
            <div className="relative" ref={yearDropdownRef}>
              <button 
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-400 flex items-center gap-3 text-sm font-bold text-blue-600"
              >
                <i className="fa-regular fa-calendar"></i>
                <span>当前年份: {selectedYear}年</span>
                <i className={`fa-solid fa-chevron-up text-[10px] transition-transform ${isYearDropdownOpen ? '' : 'rotate-180'}`}></i>
              </button>
              {isYearDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {yearsList.map(y => (
                    <button 
                      key={y} 
                      onClick={() => { setSelectedYear(y); setIsYearDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold ${selectedYear === y ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {y}年
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={monthDropdownRef}>
              <button 
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                className="bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-400 flex items-center gap-3 text-sm font-bold text-blue-600"
              >
                <i className="fa-regular fa-calendar"></i>
                <span>当前月份: {selectedMonth}月</span>
                <i className={`fa-solid fa-chevron-up text-[10px] transition-transform ${isMonthDropdownOpen ? '' : 'rotate-180'}`}></i>
              </button>
              {isMonthDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 h-64 overflow-y-auto no-scrollbar">
                  {monthsList.map((m, idx) => (
                    <button 
                      key={m} 
                      onClick={() => { setSelectedMonth(idx + 1); setIsMonthDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold ${selectedMonth === idx + 1 ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard title="月飞行小时" value="78.5" unit="h" status="good" sub="单位飞行员月均产出" />
        <MetricCard title="月度平均裕度" value={viewType === 'yearly' ? "550.8" : displayData[0].marginHours.toString()} unit="h" status="good" sub="可用时长 - 测算需求" />
        <MetricCard title="人员短缺预警" value={viewType === 'yearly' ? "3" : (displayData[0].marginHours < 200 ? "1" : "0")} unit="人" status={displayData[0].marginHours < 200 ? "warning" : "good"} sub="关键岗次部分月份缺口" />
        <MetricCard title="计划偏差" value="-25" unit="天" status="warning" sub="较基准计划进度延迟" isRed={true} />
      </div>

      {/* Manpower Progress Bar (Splitted into Captain and FO in Monthly View) */}
      {viewType === 'monthly' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
          {/* Captain Progress */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-black text-slate-600 min-w-[60px]">机长</span>
            <div className="flex-1 relative">
              <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex items-center pr-4">
                <div 
                  className="h-full bg-[#E85F15] rounded-full flex items-center justify-end pr-4 transition-all duration-1000" 
                  style={{width: '56%'}}
                >
                  <span className="text-white text-[11px] font-black">1350 h</span>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-blue-400 text-[11px] font-black tracking-tight">计划总额 2400</span>
                </div>
              </div>
              <div className="absolute top-[-10px] bottom-[-10px] left-[52.5%] w-px bg-rose-500 z-10 opacity-70"></div>
            </div>
          </div>

          {/* FO Progress */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-black text-slate-600 min-w-[60px]">副驾</span>
            <div className="flex-1 relative">
              <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex items-center pr-4">
                <div 
                  className="h-full bg-[#E85F15] rounded-full flex items-center justify-end pr-4 transition-all duration-1000" 
                  style={{width: '54%'}}
                >
                  <span className="text-white text-[11px] font-black">1150 h</span>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-blue-400 text-[11px] font-black tracking-tight">计划总额 2100</span>
                </div>
              </div>
              <div className="absolute top-[-10px] bottom-[-10px] left-[52.5%] w-px bg-rose-500 z-10 opacity-70"></div>
              <div className="flex justify-between mt-6 px-1">
                {[0, 20, 40, 60, 80, 100].map(p => (
                  <span key={p} className="text-[10px] font-black text-slate-300">{p} %</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly View Detailed Data Tables */}
      {viewType === 'monthly' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Summary Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm">
               {selectedMonth}月机长整体保障能力情况
             </div>
             <table className="w-full text-xs">
               <thead className="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                 <tr className="border-b border-slate-100">
                   <th className="px-6 py-3 text-left">人员类型</th>
                   <th className="px-6 py-3 text-center border-l border-slate-50">机长</th>
                   <th className="px-6 py-3 text-center border-l border-slate-50">副驾驶</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-slate-600">
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-3 font-medium">总人数</td><td className="px-6 py-3 text-center font-bold">72</td><td className="px-6 py-3 text-center font-bold">85</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-3 font-medium">人力折损</td><td className="px-6 py-3 text-center font-bold">7</td><td className="px-6 py-3 text-center font-bold">5</td></tr>
                 <tr className="hover:bg-slate-50/50 bg-blue-50/30"><td className="px-6 py-3 font-bold text-blue-700">可用实力人数</td><td className="px-6 py-3 text-center font-black text-blue-700">74</td><td className="px-6 py-3 text-center font-black text-blue-700">80</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-3 font-medium">其他任务占用</td><td className="px-6 py-3 text-center font-bold">7.4</td><td className="px-6 py-3 text-center font-bold">8.3</td></tr>
                 <tr className="hover:bg-slate-50/50 border-t-2 border-slate-100"><td className="px-6 py-3 font-bold text-slate-800">总保障小时</td><td className="px-6 py-3 text-center font-black text-slate-800">5000</td><td className="px-6 py-3 text-center font-black text-slate-800">5600</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-3 font-medium">市场计划小时</td><td className="px-6 py-3 text-center font-bold">4930</td><td className="px-6 py-3 text-center font-bold">-</td></tr>
                 <tr className="hover:bg-slate-50/50 bg-emerald-50/40"><td className="px-6 py-3 font-bold text-emerald-700">小时裕度</td><td className="px-6 py-3 text-center font-black text-emerald-700">100</td><td className="px-6 py-3 text-center font-black text-emerald-700">700</td></tr>
               </tbody>
             </table>
          </div>

          {/* Attrition Detail Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <table className="w-full text-xs">
               <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                 <tr className="border-b border-slate-100">
                   <th className="px-6 py-4 text-left">人员类型</th>
                   <th className="px-6 py-4 text-center border-l border-slate-50">机长</th>
                   <th className="px-6 py-4 text-center border-l border-slate-50">副驾驶</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-slate-500">
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">模拟机占用</td><td className="px-6 py-2.5 text-center font-bold">188</td><td className="px-6 py-2.5 text-center font-bold">76</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">理论训练</td><td className="px-6 py-2.5 text-center font-bold">155</td><td className="px-6 py-2.5 text-center font-bold">139</td></tr>
                 <tr className="hover:bg-slate-50/50 bg-rose-50/20"><td className="px-6 py-2.5 font-bold text-rose-600">疗养假</td><td className="px-6 py-2.5 text-center font-black text-rose-600">73</td><td className="px-6 py-2.5 text-center font-black text-rose-600">73</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">副驾驶月考</td><td className="px-6 py-2.5 text-center">8</td><td className="px-6 py-2.5 text-center">8</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">公司值班</td><td className="px-6 py-2.5 text-center">13</td><td className="px-6 py-2.5 text-center">13</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">专家席值班</td><td className="px-6 py-2.5 text-center">40</td><td className="px-6 py-2.5 text-center">40</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">公务</td><td className="px-6 py-2.5 text-center">62</td><td className="px-6 py-2.5 text-center">62</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">年度航线检查</td><td className="px-6 py-2.5 text-center">14</td><td className="px-6 py-2.5 text-center">14</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">航线资质建立321</td><td className="px-6 py-2.5 text-center">0</td><td className="px-6 py-2.5 text-center">0</td></tr>
                 <tr className="hover:bg-slate-50/50"><td className="px-6 py-2.5 font-medium">体检</td><td className="px-6 py-2.5 text-center">10</td><td className="px-6 py-2.5 text-center">10</td></tr>
               </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Yearly View Detailed Table */}
      {viewType === 'yearly' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="font-black text-slate-800 tracking-tight uppercase">飞行人力保障明细表</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-center border-collapse">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-600 w-40 sticky left-0 bg-slate-50 z-10">年度指标</th>
                  {monthsList.map(m => <th key={m} className="px-2 py-4 font-bold">{m}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-500">
                <DataRow label="机长可用总数" values={MANPOWER_DATA.map(d => d.captains)} />
                <DataRow label="副驾驶可用总数" values={MANPOWER_DATA.map(d => d.fo)} />
                <DataRow label="训练/考试损耗" values={MANPOWER_DATA.map(d => d.trainingAttrition)} />
                <DataRow label="公务/会议占用" values={MANPOWER_DATA.map(d => d.officialBusiness)} />
                <DataRow label="各类休假损耗" values={MANPOWER_DATA.map(d => d.leaveAttrition)} />
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-left font-bold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-50">可保障总小时</td>
                  {MANPOWER_DATA.map((d, i) => (
                    <td key={i} className="px-2 py-4 font-black text-blue-600">{d.totalAvailableHours}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-left font-bold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-50">人力裕度 (Margin)</td>
                  {MANPOWER_DATA.map((d, i) => (
                    <td key={i} className={`px-2 py-4 font-black ${d.marginHours < 200 ? 'text-rose-600 bg-rose-50' : 'text-slate-800'}`}>{d.marginHours}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts Section - Only visible in Yearly View */}
      {viewType === 'yearly' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                机组人力保障趋势 ({selectedYear} 全年)
              </h3>
              <div className="flex gap-4">
                 <LegendBadge color="bg-blue-600" label="机长保障" />
                 <LegendBadge color="bg-cyan-400" label="副驾保障" />
                 <LegendBadge color="bg-slate-300" label="市场计划" />
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="captainAvailableHours" name="机长保障小时" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="foAvailableHours" name="副驾保障小时" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="marketPlanHours" name="市场计划小时" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-black text-slate-700 mb-6 uppercase tracking-tight">损耗监控与预警</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="trainingAttrition" name="训练/考试" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff'}} />
                  <Line type="monotone" dataKey="leaveAttrition" name="休假" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} />
                  <Line type="monotone" dataKey="officialBusiness" name="公务/会议" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Capability Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          <h3 className="font-black text-slate-800 tracking-tight uppercase">
            {viewType === 'monthly' ? `飞行人力保障核心指标明细 (${displayData[0].month})` : '飞行人力年度整体概览'}
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CapabilityItem label="机长可用总数" value={viewType === 'yearly' ? 84 : displayData[0].captains} icon="fa-user-tie" color="blue" />
            <CapabilityItem label="副驾驶可用总数" value={viewType === 'yearly' ? 85 : displayData[0].fo} icon="fa-user" color="cyan" />
            <CapabilityItem label="训练/考试损耗" value={`${displayData[0].trainingAttrition}%`} icon="fa-graduation-cap" color="rose" />
            <CapabilityItem label="公务/会议占用" value={`${displayData[0].officialBusiness}%`} icon="fa-briefcase" color="amber" />
            <CapabilityItem label="各类休假损耗" value={`${displayData[0].leaveAttrition}%`} icon="fa-umbrella-beach" color="emerald" />
            <CapabilityItem label="可保障总小时" value={`${displayData[0].totalAvailableHours}h`} icon="fa-clock" color="indigo" bold />
        </div>
      </div>
    </div>
  );
};

const DataRow: React.FC<{ label: string, values: number[] }> = ({ label, values }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 text-left font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-50">{label}</td>
    {values.map((v, i) => (
      <td key={i} className="px-2 py-4">{v}</td>
    ))}
  </tr>
);

const MetricCard: React.FC<{ title: string, value: string, unit: string, status: 'good' | 'warning' | 'normal', sub: string, isRed?: boolean }> = ({ title, value, unit, status, sub, isRed }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
      <div className={`w-2 h-2 rounded-full ${
        status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-rose-500' : 'bg-blue-500'
      }`}></div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className={`text-3xl font-black ${isRed ? 'text-rose-600' : 'text-slate-800'}`}>{value}</span>
      <span className={`text-xs font-bold ${isRed ? 'text-rose-400' : 'text-slate-400'}`}>{unit}</span>
    </div>
    <p className="text-[10px] text-slate-400 mt-2 font-bold opacity-70 tracking-tight leading-none italic"># {sub}</p>
  </div>
);

const CapabilityItem: React.FC<{ label: string, value: any, icon: string, color: string, bold?: boolean }> = ({ label, value, icon, color, bold }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-500 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all bg-white group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]} group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-base font-black ${bold ? 'text-blue-600' : 'text-slate-800'}`}>{value}</p>
      </div>
    </div>
  );
};

const LegendBadge: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2.5 h-2.5 rounded ${color}`}></div>
    <span className="text-[10px] font-black text-slate-500 uppercase">{label}</span>
  </div>
);

export default AnalysisPage;
