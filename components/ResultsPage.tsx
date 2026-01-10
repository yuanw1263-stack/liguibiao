
import React, { useState, useMemo } from 'react';
import { MANPOWER_DATA, INITIAL_RULES, WEIGHTS } from '../constants';
import { RuleCard } from './StrategyPage';

const ResultsPage: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState(8);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = useMemo(() => new Date(2026, activeMonth, 0).getDate(), [activeMonth]);
  const monthDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setShowAdjustmentModal(false);
    setTimeout(() => {
      setIsCalculating(false);
    }, 2000);
  };

  const crewData = [
    { name: "张伟", rank: "高级机长", code: "CK-I", base: "长沙", fleet: "A321", hours: "88.5" },
    { name: "李明", rank: "B类机长", code: "CP-B", base: "昆明", fleet: "A320", hours: "86.2" },
    { name: "王凯", rank: "高级机长", code: "CK-II", base: "长沙", fleet: "A321", hours: "88.1" },
    { name: "赵敏", rank: "A类机长", code: "CP-A", base: "南京", fleet: "A319", hours: "85.9" },
    { name: "刘杰", rank: "B类机长", code: "CP-B", base: "无锡", fleet: "A320", hours: "82.4" },
    { name: "孙亮", rank: "机长", code: "CP-A", base: "长沙", fleet: "A321", hours: "79.1" },
    { name: "周强", rank: "副驾驶", code: "FO-I", base: "昆明", fleet: "A320", hours: "92.3" },
  ];

  const getDayTasks = (idx: number, day: number) => {
    if (idx === 0) {
      if (day === 1) return [{ label: "湘-昆 (C类)", color: "bg-purple-500" }];
      if (day === 2) return [{ label: "昆-深", color: "bg-blue-500" }];
      if (day === 3) return [{ label: "公司会议", color: "bg-slate-400" }];
      if (day === 4) return [{ label: "深-芒-深", color: "bg-purple-500" }];
      if (day === 6) return [{ label: "深-湘", color: "bg-blue-500" }];
    }
    if (idx === 1) {
      if (day === 2) return [{ label: "昆-京-昆", color: "bg-blue-600" }];
      if (day === 4) return [{ label: "昆-蓉", color: "bg-blue-600" }];
      if (day === 6) return [{ label: "蓉-昆", color: "bg-blue-600" }];
    }
    if (idx === 2) {
      if (day === 4) return [{ label: "锡-呼-锡", color: "bg-yellow-400 text-slate-900" }];
      if (day === 5) return [{ label: "锡-呼-锡", color: "bg-yellow-400 text-slate-900" }];
      if (day === 6) return [{ label: "锡-呼-锡", color: "bg-yellow-400 text-slate-900" }];
    }
    if (idx === 3) {
      if (day === 2) return [{ label: "湘-芒-洪", color: "bg-orange-400" }];
      if (day === 5) return [{ label: "湘-芒-洪", color: "bg-orange-400" }];
      if (day === 6) return [{ label: "湘-芒-洪", color: "bg-orange-400" }];
    }
    if (idx === 4) {
      if (day >= 2 && day <= 6) return [{ label: "湘-昆", color: "bg-cyan-400 text-slate-800" }];
    }
    if (idx === 5) {
       if (day === 2) return [{ label: "昆-保-昆-宁", color: "bg-yellow-300 text-slate-800" }];
       if (day === 3) return [{ label: "模拟机训练", color: "bg-rose-500" }];
       if (day === 5) return [{ label: "疗养假", color: "bg-emerald-500" }];
       if (day === 6) return [{ label: "昆-保-昆-宁", color: "bg-orange-300 text-slate-800" }];
    }
    return [];
  };

  return (
    <div className="space-y-6 max-full animate-in fade-in duration-300 relative pb-12">
      {isCalculating && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold text-slate-800">正在重新测算...</p>
        </div>
      )}

      {/* Re-designed Top Header with Metrics Cards */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-6">
          <HeaderMetricCard 
            title="排班负荷指标" 
            value="78.25" unit="h" 
            sub="月均小时" 
            secondaryValue="2.57h" secondarySub="日均小时"
            status="good"
          />
          <HeaderMetricCard 
            title="人力配置规模" 
            value="8.3:1" unit="" 
            sub="人机比" 
            secondaryValue="45 / 78" secondarySub="高级/总机长"
            status="good"
          />
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">任务人力消耗分布</span>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-500">航班运行:</span> <span className="text-slate-800 font-black">100人</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-500">训练任务:</span> <span className="text-slate-800 font-black">7.2人</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500">请假损耗:</span> <span className="text-slate-800 font-black">3.8人</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-500">公务/会议:</span> <span className="text-slate-800 font-black">4.5人</span>
              </div>
            </div>
          </div>
          <HeaderMetricCard 
            title="可用小时测算" 
            value="358" unit="h" 
            sub="裕度小时" 
            secondaryValue="6125 / 5872" secondarySub="可飞/计划总计"
            status="good"
          />
        </div>
        
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
             <button onClick={() => setShowAdjustmentModal(true)} className="px-4 py-2 border-2 border-orange-200 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-100 flex items-center gap-2">
               <i className="fa-solid fa-wand-magic-sparkles"></i> 调整策略并计算
             </button>
          </div>
          <div className="flex gap-4">
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-4 py-1.5 bg-white text-blue-600 shadow-sm rounded-md text-xs font-bold">测算结果一览</button>
                <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold">人力缺口地图</button>
             </div>
             <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700">
               确认并回传航网系统
             </button>
          </div>
        </div>
      </div>

      {/* Month Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
        {months.map(m => (
          <button
            key={m}
            onClick={() => setActiveMonth(m)}
            className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg transition-all ${
              activeMonth === m ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {m}月
          </button>
        ))}
      </div>

      {/* Legend Indicator Bar */}
      <div className="flex items-center gap-6 px-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        <span className="text-sm font-bold text-slate-800 mr-2 border-r pr-6 border-slate-200">人员排班视图</span>
        <LegendItem color="bg-blue-500" label="A类" />
        <LegendItem color="bg-blue-600" label="B类" />
        <LegendItem color="bg-purple-500" label="C类" />
        <div className="w-px h-4 bg-slate-200 mx-2"></div>
        <LegendItem color="bg-slate-400" label="公司任务" />
        <LegendItem color="bg-rose-500" label="训练任务" />
        <LegendItem color="bg-emerald-500" label="个人请假" />
      </div>

      {/* Re-structured Gantt Container: Sidebar + Scrollable Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden">
        {/* Left Frozen Sidebar */}
        <div className="flex-none w-[280px] flex flex-col border-r border-slate-200 bg-white z-20 shadow-[4px_0_12px_rgba(0,0,0,0.05)]">
          <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="w-[180px] px-6 border-r border-slate-100">机组人员 / 职级</div>
            <div className="w-[100px] px-2 text-center">月飞H</div>
          </div>
          {crewData.map((crew, idx) => (
            <div key={idx} className="h-24 border-b border-slate-50 flex items-center hover:bg-slate-50 transition-colors bg-white">
              <div className="w-[180px] px-6 py-4 flex flex-col justify-center border-r border-slate-100">
                <div className="font-bold text-slate-800 text-sm whitespace-nowrap tracking-tight">
                  {crew.name} ({crew.rank})
                </div>
                <div className="flex gap-1.5 mt-2">
                   <span className="px-1.5 py-0.5 bg-blue-50 text-blue-400 rounded text-[9px] font-bold border border-blue-100 uppercase tracking-tighter">
                     {crew.base}/{crew.fleet}
                   </span>
                </div>
              </div>
              <div className="w-[100px] text-center">
                <span className="text-xl font-black text-blue-600 tracking-tighter">{crew.hours}h</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scrollable Grid Area */}
        <div className="flex-1 overflow-x-auto bg-white">
          <div className="min-w-max flex flex-col">
            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {monthDays.map(d => (
                <div key={d} className="w-[150px] px-4 text-center border-l border-slate-100 text-slate-600">
                  {activeMonth}月{d}日
                </div>
              ))}
            </div>
            {crewData.map((_, idx) => (
              <div key={idx} className="h-24 border-b border-slate-50 flex items-center relative hover:bg-slate-50/50 transition-colors">
                {monthDays.map(d => (
                  <div key={d} className="w-[150px] h-full border-l border-slate-50 relative">
                    {getDayTasks(idx, d).map((task, i) => (
                      <div 
                        key={i}
                        className={`absolute top-1/2 -translate-y-1/2 h-10 w-[94%] left-[3%] rounded-lg ${task.color} text-white text-[9px] font-bold flex flex-col items-center justify-center shadow-sm truncate px-1 border border-white/10 tracking-tighter z-10`}
                      >
                        {task.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manpower Detail Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 tracking-tight">2026年度飞行人力保障明细表 (1-12月)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-center border-collapse">
            <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-black text-slate-800 w-44 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">年度指标</th>
                {MANPOWER_DATA.map(d => <th key={d.month} className="px-2 py-4 min-w-[70px]">{d.month}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
              <DataTableRow label="机长可用总数" values={MANPOWER_DATA.map(d => d.captains)} highlightIndex={[5, 11]} />
              <DataTableRow label="副驾驶可用总数" values={MANPOWER_DATA.map(d => d.fo)} />
              <DataTableRow label="训练/考试损耗" values={MANPOWER_DATA.map(d => d.trainingAttrition)} />
              <DataTableRow label="公务/会议占用" values={MANPOWER_DATA.map(d => d.officialBusiness)} />
              <DataTableRow label="各类休假损耗" values={MANPOWER_DATA.map(d => d.leaveAttrition)} />
              <tr className="bg-slate-50/50">
                <td className="px-6 py-4 text-left font-black text-slate-800 border-r border-slate-100 sticky left-0 bg-slate-50 z-10 shadow-sm">可保障总小时</td>
                {MANPOWER_DATA.map(d => <td key={d.month} className="px-2 py-4 font-bold text-blue-600">{d.totalAvailableHours}</td>)}
              </tr>
              <tr className="bg-blue-50/30">
                <td className="px-6 py-4 text-left font-black text-slate-900 border-r border-slate-100 sticky left-0 bg-blue-50 z-10 shadow-sm">人力裕度 (Margin)</td>
                {MANPOWER_DATA.map((d, idx) => (
                  <td key={d.month} className={`px-2 py-4 font-black ${d.marginHours < 200 ? 'text-rose-600 bg-rose-50' : 'text-slate-900'}`}>
                    {d.marginHours}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">二次优化：策略详细参数微调</h3>
              <button onClick={() => setShowAdjustmentModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-10 space-y-10 bg-slate-50/30 no-scrollbar">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">核心值勤规章调校</h4>
                  {INITIAL_RULES.filter(r => r.category === 'duty').map((rule) => (
                    <RuleCard key={rule.id} rule={rule} />
                  ))}
                </div>
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-4 border-orange-500 pl-3">运行连续性配置</h4>
                  {INITIAL_RULES.filter(r => r.category === 'continuity').map(rule => (
                    <RuleCard key={rule.id} rule={rule} />
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-emerald-500 pl-3">测算优化权重 (12项)</h4>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {WEIGHTS.map(w => (
                    <div key={w.id} className="flex items-center justify-between group">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{w.name}</span>
                        <span className="text-[10px] text-slate-400 italic">{w.description}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input type="range" min="0" max="100" defaultValue={w.weight} className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        <span className="text-xs font-black text-blue-600 w-8">{w.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-8 py-6 bg-white border-t flex justify-end gap-3 shadow-inner">
              <button onClick={() => setShowAdjustmentModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">放弃本次修改</button>
              <button onClick={handleRecalculate} className="px-10 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-orange-700 transition-all">应用配置并重新触发引擎计算</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderMetricCard: React.FC<{ title: string, value: string, unit: string, sub: string, secondaryValue: string, secondarySub: string, status: 'good' | 'warning' }> = ({ title, value, unit, sub, secondaryValue, secondarySub, status }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
      <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black text-slate-800">{value}</span>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
      <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-tighter">({sub})</span>
    </div>
    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
      <span className="text-[10px] text-slate-400 font-bold uppercase">{secondarySub}</span>
      <span className="text-xs font-black text-slate-700">{secondaryValue}</span>
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-md ${color} shadow-sm`}></div>
    <span className="text-xs font-bold text-slate-600">{label}</span>
  </div>
);

const DataTableRow: React.FC<{ label: string, values: number[], highlightIndex?: number[] }> = ({ label, values, highlightIndex }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4 text-left font-bold text-slate-700 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-sm">{label}</td>
    {values.map((v, i) => (
      <td key={i} className={`px-2 py-4 ${highlightIndex?.includes(i) ? 'text-rose-600 font-bold' : ''}`}>
        {v}
      </td>
    ))}
  </tr>
);

export default ResultsPage;
