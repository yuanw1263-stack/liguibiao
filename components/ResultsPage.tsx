
import React, { useState, useMemo } from 'react';
import { MANPOWER_DATA, INITIAL_RULES } from '../constants';
import { RuleCard } from './StrategyPage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CALC_STEPS = [
  { id: 1, label: "引擎触发", detail: "初始化分布式计算引擎..." },
  { id: 2, label: "信息准备", detail: "同步航网计划与人员资质库..." },
  { id: 3, label: "任务模拟", detail: "航班/备份/训练任务综合编排..." },
  { id: 4, label: "缺口评估", detail: "执行各基地各职级缺口分析..." },
  { id: 5, label: "结果生成", detail: "生成排班视图与汇总明细表..." }
];

const RANKS = [
  "C类教员", "B类教员", "A类教员", "高级机长", "B类机长", "A类机长", 
  "巡航机长", "F5副驾驶", "F4副驾驶", "F3副驾驶", "F2副驾驶", "F1副驾驶", "飞行学员"
];

const DEMAND_DATA = [
  { rank: "高级机长以上", m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 2, m7: 2, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 4 },
  { rank: "B类机长", m1: 1, m2: 1, m3: 3, m4: 0, m5: 4, m6: 1, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 10 },
  { rank: "A类机长", m1: 1, m2: 1, m3: 3, m4: 0, m5: 4, m6: 1, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 10 },
  { rank: "F3以上副驾驶", m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 2, m7: 2, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 4 },
  { rank: "储备人员", m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 2, m7: 2, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 4 },
];

const INITIAL_PAIRING_DATA = [
  { id: "P-001", fleet: "A321", airportType: "C类", base: "昆明", hours: 18.5 },
  { id: "P-002", fleet: "A320", airportType: "B类", base: "昆明", hours: 16.2 },
  { id: "P-003", fleet: "A321", airportType: "A类", base: "无锡", hours: 15.1 },
  { id: "P-004", fleet: "A319", airportType: "B类", base: "无锡", hours: 12.9 },
  { id: "P-005", fleet: "A320", airportType: "A类", base: "长沙", hours: 22.4 },
  { id: "P-006", fleet: "A321", airportType: "C类", base: "长沙", hours: 19.1 },
  { id: "P-007", fleet: "A320", airportType: "A类", base: "长沙", hours: 20.3 },
];

const ResultsPage: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState(8);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTrainingDetailModal, setShowTrainingDetailModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState('自动测算版本1');

  // 排序与筛选状态
  const [pairingData, setPairingData] = useState(INITIAL_PAIRING_DATA);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [filters, setFilters] = useState({ base: '全部', fleet: '全部', airportType: '全部' });

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = useMemo(() => new Date(2026, activeMonth, 0).getDate(), [activeMonth]);
  const monthDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setCalcStep(0);
    setShowAdjustmentModal(false);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < CALC_STEPS.length) {
        setCalcStep(currentStep);
      } else {
        clearInterval(interval);
        setIsCalculating(false);
        setSelectedVersion(`优化调整版本 ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      }
    }, 800);
  };

  // 排序逻辑
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    
    const sorted = [...pairingData].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setSortConfig({ key, direction });
    setPairingData(sorted);
  };

  // 筛选逻辑
  const displayPairingData = useMemo(() => {
    return pairingData.filter(item => {
      return (filters.base === '全部' || item.base === filters.base) &&
             (filters.fleet === '全部' || item.fleet === filters.fleet) &&
             (filters.airportType === '全部' || item.airportType === filters.airportType);
    });
  }, [pairingData, filters]);

  const getDayTasks = (idx: number, day: number) => {
    if (idx === 0) {
      if (day === 1) return [{ label: "湘-昆 (C类)", color: "bg-purple-500" }];
      if (day === 2) return [{ label: "昆-深", color: "bg-blue-500" }];
      if (day === 3) return [{ label: "备份任务", color: "bg-slate-400" }];
      if (day === 4) return [{ label: "深-芒-深 (C类)", color: "bg-purple-500" }];
      if (day === 6) return [{ label: "深-湘", color: "bg-blue-500" }];
    }
    if (idx === 1) {
      if (day === 2) return [{ label: "昆-京-昆 (B类)", color: "bg-blue-700" }];
      if (day === 4) return [{ label: "昆-蓉", color: "bg-blue-700" }];
      if (day === 6) return [{ label: "蓉-昆", color: "bg-blue-700" }];
    }
    if (idx === 2) {
      if (day >= 4 && day <= 6) return [{ label: "锡-呼-锡 (A类)", color: "bg-blue-500" }];
    }
    if (idx === 3) {
      if (day === 1 || day === 2 || day === 5 || day === 6) return [{ label: "湘-芒-洪", color: "bg-blue-700" }];
    }
    if (idx === 4) {
      if (day >= 1 && day <= 5) return [{ label: "湘-昆 (A类)", color: "bg-blue-500" }];
    }
    if (idx === 5) {
      if (day === 1 || day === 6) return [{ label: "昆-保-昆-宁 (C类)", color: "bg-purple-500" }];
      if (day === 2) return [{ label: "模拟机训练", color: "bg-rose-500" }];
    }
    return [];
  };

  const trainingChartData = months.map(m => ({
    name: `${m}月`,
    trainee: 120 + (m * 5),
    trainer: 40 + (m * 2)
  }));

  return (
    <div className="space-y-6 max-full animate-in fade-in duration-300 relative pb-12">
      {/* 顶部指标 */}
      <div className="grid grid-cols-4 gap-6">
        <HeaderMetricCard title="月飞行小时" value="78.25" unit="h" sub="月均小时" status="good" />
        <HeaderMetricCard title="人力配置规模" value="8.3:1" unit="" sub="人机比" status="good" />
        <HeaderMetricCard title="计划小时总计" value="6125" unit="h" sub="全航网需求" status="good" />
        <HeaderMetricCard title="小时裕度" value="358" unit="h" sub="Margin" status="good" />
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
           <button onClick={() => setShowAdjustmentModal(true)} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold border border-orange-200 hover:bg-orange-100 flex items-center gap-2">
             <i className="fa-solid fa-wand-magic-sparkles"></i> 调整策略并计算
           </button>
           <div className="flex items-center gap-2 ml-4 pl-4 border-l">
             <span className="text-xs font-bold text-slate-400 uppercase">当前版本:</span>
             <span className="text-sm font-black text-slate-700">{selectedVersion}</span>
           </div>
        </div>
        <button onClick={() => setShowConfirmModal(true)} className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all">最终结果确认</button>
      </div>

      {/* 图例栏 - 移除航班任务，移除C类红线 */}
      <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <span className="text-sm font-bold text-slate-800 mr-2">人力排班结果预览</span>
        
        <div className="w-px h-4 bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-4 relative">
          <LegendItem color="bg-slate-400" label="备份任务" />
        </div>

        <div className="w-px h-4 bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-5 relative">
          <LegendItem color="bg-blue-500" label="A类航线" />
          <LegendItem color="bg-blue-700" label="B类航线" />
          <LegendItem color="bg-purple-500" label="C类航线" />
        </div>
      </div>

      {/* 甘特图 - 增加排序与筛选表头 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden">
        <div className="flex-none w-[440px] flex flex-col border-r border-slate-200 bg-white z-20 shadow-lg">
          <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            <div className="w-[80px] border-r h-full flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors gap-1" onClick={() => handleSort('id')}>
              组环序号 {sortConfig.key === 'id' && <i className={`fa-solid fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-blue-500`}></i>}
            </div>
            <div className="w-[80px] border-r h-full flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors gap-1" onClick={() => handleSort('fleet')}>
              机型 {sortConfig.key === 'fleet' && <i className={`fa-solid fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-blue-500`}></i>}
            </div>
            <div className="w-[100px] border-r h-full flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors gap-1" onClick={() => handleSort('airportType')}>
              机场类型 {sortConfig.key === 'airportType' && <i className={`fa-solid fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-blue-500`}></i>}
            </div>
            <div className="w-[90px] border-r h-full flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors gap-1" onClick={() => handleSort('base')}>
              属地 {sortConfig.key === 'base' && <i className={`fa-solid fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-blue-500`}></i>}
            </div>
            <div className="w-[90px] h-full flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors gap-1" onClick={() => handleSort('hours')}>
              月飞H {sortConfig.key === 'hours' && <i className={`fa-solid fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-blue-500`}></i>}
            </div>
          </div>
          {displayPairingData.map((p, idx) => (
            <div key={idx} className="h-20 border-b border-slate-50 flex items-center hover:bg-slate-50">
              <div className="w-[80px] text-center font-black text-slate-700 text-sm border-r h-full flex items-center justify-center tracking-tighter">{p.id}</div>
              <div className="w-[80px] text-center font-bold text-blue-600 text-sm border-r h-full flex items-center justify-center">{p.fleet}</div>
              <div className="w-[100px] text-center font-bold text-slate-500 text-[11px] border-r h-full flex items-center justify-center">{p.airportType}</div>
              <div className="w-[90px] text-center font-bold text-slate-600 text-xs border-r h-full flex items-center justify-center">{p.base}</div>
              <div className="w-[90px] text-center font-black text-blue-500 text-sm h-full flex items-center justify-center tracking-tighter">{p.hours}h</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto bg-white shadow-inner">
          <div className="min-w-max">
            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center">
              {monthDays.map(d => <div key={d} className="w-[150px] text-center text-[10px] font-bold text-slate-400 border-l uppercase">{activeMonth}月{d}日</div>)}
            </div>
            {displayPairingData.map((_, idx) => (
              <div key={idx} className="h-20 border-b border-slate-50 flex relative hover:bg-slate-50/50">
                {monthDays.map(d => <div key={d} className="w-[150px] border-l border-slate-50 h-full"></div>)}
                {monthDays.map(d => (
                  <div key={`${idx}-${d}`} className="absolute top-0 bottom-0 flex items-center justify-center" style={{ left: `${(d-1) * 150}px`, width: '150px' }}>
                    {getDayTasks(idx, d).map((t, i) => (
                      <div key={i} className={`h-12 w-[94%] rounded-xl ${t.color} text-white text-[10px] font-black flex items-center justify-center shadow-md border border-white/10 uppercase tracking-tighter px-1 text-center`}>
                        {t.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 各职级人力需求明细 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
          <h3 className="font-black text-slate-800 tracking-tight uppercase">各职级人力需求/变动明细</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-center border-collapse">
            <thead className="bg-slate-50/80 text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-600 w-40 sticky left-0 bg-white">职级</th>
                {months.map(m => <th key={m} className="px-2 py-4">{m}月</th>)}
                <th className="px-4 py-4 bg-blue-50/50 sticky right-0 text-blue-600 border-l border-slate-100">合计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-bold">
              {DEMAND_DATA.map((row, ridx) => (
                <tr key={ridx} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 text-left font-black text-slate-800 sticky left-0 bg-white border-r border-slate-50">{row.rank}</td>
                  {months.map(m => {
                    const val = (row as any)[`m${m}`];
                    return <td key={m} className={`px-2 py-4 ${val > 0 ? 'text-blue-600' : 'text-slate-300 opacity-50'}`}>{val}</td>
                  })}
                  <td className="px-4 py-4 font-black bg-blue-50/30 sticky right-0 border-l border-slate-50 text-slate-900">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 年度飞行人力保障明细表 - 末尾新增“预留时长”与“市场小时需求” */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="font-black text-slate-800 tracking-tight uppercase">2026年度飞行人力保障明细表 (1-12月)</h3>
          </div>
          <button onClick={() => setShowDetailModal(true)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100 hover:bg-blue-100 flex items-center gap-2">
            <i className="fa-solid fa-table-list"></i> 查看保障明细
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-center border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left w-40 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">年度指标</th>
                {months.map(m => <th key={m} className="px-2 py-4">{m}月</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-500 font-bold">
              <tr className="hover:bg-slate-50/50"><td className="px-6 py-4 text-left text-slate-700 sticky left-0 bg-white border-r">机长可用总数</td>{MANPOWER_DATA.map((d, i) => <td key={i} className={`px-2 py-4 ${i === 5 || i === 11 ? 'text-rose-600' : ''}`}>{d.captains}</td>)}</tr>
              <tr className="hover:bg-slate-50/50"><td className="px-6 py-4 text-left text-slate-700 sticky left-0 bg-white border-r">副驾驶可用总数</td>{MANPOWER_DATA.map((d, i) => <td key={i} className="px-2 py-4">{d.fo}</td>)}</tr>
              <tr className="hover:bg-slate-50/50"><td className="px-6 py-4 text-left text-slate-700 sticky left-0 bg-white border-r">训练/考试损耗</td>{MANPOWER_DATA.map((d, i) => <td key={i} className="px-2 py-4">{d.trainingAttrition}</td>)}</tr>
              <tr className="hover:bg-slate-50/50"><td className="px-6 py-4 text-left text-slate-700 sticky left-0 bg-white border-r">公务/会议占用</td>{MANPOWER_DATA.map((d, i) => <td key={i} className="px-2 py-4">{d.officialBusiness}</td>)}</tr>
              <tr className="hover:bg-slate-50/50"><td className="px-6 py-4 text-left text-slate-700 sticky left-0 bg-white border-r">各类休假损耗</td>{MANPOWER_DATA.map((d, i) => <td key={i} className="px-2 py-4">{d.leaveAttrition}</td>)}</tr>
              <tr className="bg-blue-50/30 hover:bg-blue-50/50"><td className="px-6 py-4 text-left text-blue-700 sticky left-0 bg-white border-r font-black border-slate-100">可保障总小时</td>{MANPOWER_DATA.map((d, i) => <td key={i} className="px-2 py-4 text-blue-600 font-black tracking-tighter">5783</td>)}</tr>
              {/* 新增: 预留时长 */}
              <tr className="hover:bg-amber-50/50"><td className="px-6 py-4 text-left text-slate-700 sticky left-0 bg-white border-r font-bold border-slate-100">预留时长</td>{months.map(m => <td key={m} className="px-2 py-4 text-amber-600 font-bold">150</td>)}</tr>
              {/* 新增: 市场小时需求 */}
              <tr className="hover:bg-indigo-50/50"><td className="px-6 py-4 text-left text-slate-700 sticky left-0 bg-white border-r font-bold border-slate-100">市场小时需求</td>{months.map(m => <td key={m} className="px-2 py-4 text-indigo-600 font-bold">5123</td>)}</tr>
              <tr className="hover:bg-rose-50/30"><td className="px-6 py-4 text-left text-slate-800 sticky left-0 bg-white border-r font-black border-slate-100">人力裕度 (Margin)</td>{MANPOWER_DATA.map((d, i) => <td key={i} className={`px-2 py-4 font-black ${i === 5 ? 'text-rose-600 bg-rose-50' : 'text-slate-800'}`}>{i === 5 ? 124 : 510}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 月度训练统计 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800 tracking-tight uppercase">月度训练统计</h3>
          </div>
          <button onClick={() => setShowTrainingDetailModal(true)} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-black border border-orange-100 hover:bg-orange-100 flex items-center gap-2">
            <i className="fa-solid fa-clipboard-list"></i> 查看训练明细
          </button>
        </div>
        <div className="h-[360px] w-full flex flex-col">
          <h4 className="text-center text-lg font-black text-slate-700 mb-6 italic uppercase tracking-widest">飞行训练人次</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trainingChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 500]} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
              <Legend verticalAlign="bottom" height={36} iconType="rect" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 'bold'}} />
              <Bar dataKey="trainee" name="学员人次" stackId="a" fill="#3b82f6" barSize={35} radius={[0, 0, 0, 0]} />
              <Bar dataKey="trainer" name="教员人次" stackId="a" fill="#f97316" barSize={35} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 弹窗部分 */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[95vw] h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <i className="fa-solid fa-chart-line text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Detailed Capability Reports</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">各职级人力需量与小时饱和度明细</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-300 hover:text-slate-600 transition-colors p-2">
                 <i className="fa-solid fa-circle-xmark text-3xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-10 space-y-12 no-scrollbar bg-[#f8fafc]">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                  <h4 className="text-lg font-black text-slate-800 uppercase italic">月需人数统计 (HEADCOUNT DEMAND)</h4>
                </div>
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm">
                  <table className="w-full text-[11px] text-center border-collapse">
                    <thead className="bg-[#121826] text-white font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-5 text-left border-r border-white/10 w-40 sticky left-0 bg-[#121826] z-10">职级</th>
                        <th className="px-4 py-5 border-r border-white/10">基准人数</th>
                        {months.map(m => <th key={m} className="px-2 py-5 border-r border-white/10">{m}月</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-bold italic">
                      {RANKS.map((rank, ridx) => {
                        const base = 10 + ridx * 5;
                        return (
                          <tr key={ridx} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-6 py-4 text-left font-black text-slate-900 border-r border-slate-50 sticky left-0 bg-white">{rank}</td>
                            <td className="px-4 py-4 border-r border-slate-50 text-slate-300">{base}</td>
                            {months.map(m => (
                              <td key={m} className="px-2 py-4 border-r border-slate-50 last:border-r-0">
                                {base + (m % 2 === 0 ? 7 : 3 + (ridx % 2))}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                  <h4 className="text-lg font-black text-slate-800 uppercase italic">月均时间统计 (AVG. FLIGHT HOURS)</h4>
                </div>
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm">
                  <table className="w-full text-[11px] text-center border-collapse">
                    <thead className="bg-[#121826] text-white font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-5 text-left border-r border-white/10 w-40 sticky left-0 bg-[#121826] z-10">职级</th>
                        <th className="px-4 py-5 border-r border-white/10">基准飞时</th>
                        {months.map(m => <th key={m} className="px-2 py-5 border-r border-white/10">{m}月</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                      {RANKS.map((rank, ridx) => {
                        const baseTime = "85:00";
                        return (
                          <tr key={ridx} className="hover:bg-emerald-50/50 transition-colors">
                            <td className="px-6 py-4 text-left font-black text-slate-900 border-r border-slate-50 sticky left-0 bg-white">{rank}</td>
                            <td className="px-4 py-4 border-r border-slate-50 text-slate-300">{baseTime}</td>
                            {months.map(m => {
                              const hh = 80 + (ridx % 5) + (m % 10);
                              const mm = 10 + (m * 2) + (ridx % 15);
                              const isOver = hh >= 91;
                              return (
                                <td key={m} className={`px-2 py-4 border-r border-slate-50 last:border-r-0 ${isOver ? 'text-rose-600 font-black' : 'text-slate-600'}`}>
                                  {hh}:{mm < 10 ? `0${mm}` : mm}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="px-10 py-6 bg-white border-t border-slate-100 flex justify-between items-center shadow-inner">
               <div className="flex items-center gap-2 text-slate-400">
                  <i className="fa-solid fa-circle-exclamation text-amber-500"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">以上数据基于 “2026年度测算策略 V3.2” 实时动态渲染</span>
               </div>
               <button onClick={() => setShowDetailModal(false)} className="px-12 py-3 bg-[#121826] text-white rounded-2xl text-sm font-black shadow-xl hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-widest">确认并返回主视图</button>
            </div>
          </div>
        </div>
      )}

      {showTrainingDetailModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[95vw] h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E85F15] text-white flex items-center justify-center shadow-lg shadow-orange-600/20">
                  <i className="fa-solid fa-graduation-cap text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Training Task Details</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">训练人力需求明细与单项训练任务列表</p>
                </div>
              </div>
              <button onClick={() => setShowTrainingDetailModal(false)} className="text-slate-300 hover:text-slate-600 transition-colors p-2">
                 <i className="fa-solid fa-circle-xmark text-3xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-10 space-y-12 no-scrollbar bg-[#f8fafc]">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-[#E85F15] rounded-full"></span>
                  <h4 className="text-lg font-black text-slate-800 uppercase italic">训练人力需求明细</h4>
                </div>
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-[11px] text-center border-collapse">
                    <thead className="bg-[#1D2939] text-white font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-5 text-left border-r border-white/10 w-40 sticky left-0 bg-[#1D2939]">人员类型</th>
                        {months.map(m => <th key={m} className="px-2 py-5 border-r border-white/10">{m}月</th>)}
                        <th className="px-6 py-5 bg-[#121826]">总数</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                      <tr className="hover:bg-orange-50/50 transition-colors">
                        <td className="px-6 py-5 text-left font-black text-slate-900 border-r border-slate-50 sticky left-0 bg-white">学员</td>
                        {months.map(m => <td key={m} className="px-2 py-5 border-r border-slate-50">37</td>)}
                        <td className="px-6 py-5 font-black text-[#E85F15] bg-[#FEF6EE] sticky right-0">400</td>
                      </tr>
                      <tr className="hover:bg-orange-50/50 transition-colors">
                        <td className="px-6 py-5 text-left font-black text-slate-900 border-r border-slate-50 sticky left-0 bg-white">教员</td>
                        {months.map(m => <td key={m} className="px-2 py-5 border-r border-slate-50">12</td>)}
                        <td className="px-6 py-5 font-black text-[#E85F15] bg-[#FEF6EE] sticky right-0">230</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                  <h4 className="text-lg font-black text-slate-800 uppercase italic">训练明细表</h4>
                </div>
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-x-auto">
                  <table className="w-full text-[10px] text-left border-collapse min-w-[1800px]">
                    <thead className="bg-slate-100 text-slate-500 font-black uppercase tracking-tighter border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-5 sticky left-0 bg-slate-100 z-10">学员姓名</th>
                        <th className="px-4 py-5">训练类型</th>
                        <th className="px-4 py-5">训练名称</th>
                        <th className="px-4 py-5">介入日期</th>
                        <th className="px-4 py-5">日期范围</th>
                        <th className="px-4 py-5">耗时</th>
                        <th className="px-4 py-5">地点</th>
                        <th className="px-4 py-5 text-center">学员开班人数限制</th>
                        <th className="px-4 py-5">教员要求类型</th>
                        <th className="px-4 py-5">教员要求明细</th>
                        <th className="px-4 py-5 text-center">教员数量要求</th>
                        <th className="px-4 py-5">检查员要求类型</th>
                        <th className="px-4 py-5">检查员要求明细</th>
                        <th className="px-4 py-5 text-center">检查员数量要求</th>
                        <th className="px-4 py-5">特殊要求</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-bold uppercase">
                      {[
                        { name: "张三", type: "模拟机训练", title: "初始训练", date: "2026年3月31日", range: "截止月", time: "1天", loc: "长沙", limit: 2, tType: "委派", tDetail: "外委单位", tNum: 1, cType: "委派", cDetail: "外委单位", cNum: 1, special: "/" },
                        { name: "张三", type: "模拟机训练", title: "初始训练", date: "2026年5月20日", range: "截止前3天", time: "2天", loc: "昆明", limit: 2, tType: "委派", tDetail: "其他部门", tNum: 1, cType: "委派", cDetail: "其他部门", cNum: 1, special: "/" },
                        { name: "李四", type: "模拟机训练", title: "初始训练", date: "2026年10月27日", range: "截止前1周", time: "1天", loc: "无锡", limit: 6, tType: "职级", tDetail: "C类教员", tNum: 2, cType: "/", cDetail: "/", cNum: "/", special: "/" },
                        { name: "李四", type: "模拟机训练", title: "初始训练", date: "2026年10月27日", range: "截止前1周", time: "1天", loc: "深圳", limit: 6, tType: "职级", tDetail: "A类教员", tNum: 2, cType: "职级", cDetail: "A类教员", cNum: 2, special: "教员互斥", sColor: "text-rose-600 font-black italic" },
                        { name: "李四", type: "模拟机训练", title: "初始训练", date: "2026年10月27日", range: "截止前1周", time: "1天", loc: "北京", limit: 6, tType: "资质", tDetail: "教员资质", tNum: 2, cType: "资质", cDetail: "教员资质", cNum: 2, special: "/" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 font-black text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50">{row.name}</td>
                          <td className="px-4 py-4">{row.type}</td>
                          <td className="px-4 py-4 text-blue-600 font-black">{row.title}</td>
                          <td className="px-4 py-4">{row.date}</td>
                          <td className="px-4 py-4 italic text-slate-400">{row.range}</td>
                          <td className="px-4 py-4">{row.time}</td>
                          <td className="px-4 py-4 font-bold text-slate-800">{row.loc}</td>
                          <td className="px-4 py-4 text-center">{row.limit}</td>
                          <td className="px-4 py-4">{row.tType}</td>
                          <td className="px-4 py-4">{row.tDetail}</td>
                          <td className="px-4 py-4 text-center">{row.tNum}</td>
                          <td className="px-4 py-4">{row.cType}</td>
                          <td className="px-4 py-4">{row.cDetail}</td>
                          <td className="px-4 py-4 text-center">{row.cNum}</td>
                          <td className={`px-4 py-4 ${row.sColor || 'text-slate-400'}`}>{row.special}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="px-10 py-6 bg-white border-t border-slate-100 flex justify-between items-center shadow-inner">
               <div className="flex items-center gap-2 text-slate-400">
                  <i className="fa-solid fa-circle-exclamation text-[#E85F15]"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">注意：单项训练明细需根据介入日期范围进行灵活编排，以防实力集中损耗</span>
               </div>
               <button onClick={() => setShowTrainingDetailModal(false)} className="px-12 py-3 bg-[#1D2939] text-white rounded-2xl text-sm font-black shadow-xl hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-widest">确认并关闭</button>
            </div>
          </div>
        </div>
      )}

      {showAdjustmentModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">二次优化：策略详细参数微调</h3>
              <button onClick={() => setShowAdjustmentModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="flex-1 overflow-auto p-10 space-y-10 bg-slate-50/30">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">核心值勤规章调校</h4>
                  {INITIAL_RULES.filter(r => r.category === 'duty').map((rule) => <RuleCard key={rule.id} rule={rule} />)}
                </div>
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-4 border-orange-500 pl-3">运行连续性配置</h4>
                  {INITIAL_RULES.filter(r => r.category === 'continuity').map(rule => <RuleCard key={rule.id} rule={rule} />)}
                </div>
              </div>
            </div>
            <div className="px-8 py-6 bg-white border-t flex justify-end gap-3">
              <button onClick={() => setShowAdjustmentModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">放弃</button>
              <button onClick={handleRecalculate} className="px-10 py-2.5 bg-[#E85F15] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-orange-700">重新预排班</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">确认结果并提交</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
                <i className="fa-solid fa-check text-2xl"></i>
              </div>
              <h4 className="text-lg font-bold text-slate-800 tracking-tight italic uppercase">Final Review Confirm</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">确认本次飞行员人力分析结果，并同步反馈至航网计划部？</p>
            </div>
            <div className="px-6 py-5 bg-slate-50 border-t flex justify-end gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-6 py-2 border border-slate-200 rounded-lg text-sm text-slate-600">取消</button>
              <button onClick={() => { setShowConfirmModal(false); alert('已提交同步'); }} className="px-10 py-2 bg-blue-600 text-white rounded-lg text-sm font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">确认并提交</button>
            </div>
          </div>
        </div>
      )}

      {isCalculating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl text-center space-y-8 animate-in zoom-in duration-300">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-black text-blue-600">{Math.round((calcStep + 1) / CALC_STEPS.length * 100)}%</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Calculating Engine</h3>
              <p className="text-sm text-slate-500 font-bold tracking-widest uppercase">{CALC_STEPS[calcStep].label}</p>
              <p className="text-[11px] text-slate-400 italic">{CALC_STEPS[calcStep].detail}</p>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((calcStep + 1) / CALC_STEPS.length) * 100}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderMetricCard: React.FC<{ title: string, value: string, unit: string, sub: string, status: 'good' | 'warning' }> = ({ title, value, unit, sub, status }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-200 transition-all">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
      <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black text-slate-800 tracking-tighter">{value}</span>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </div>
    <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase italic tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity"># {sub}</div>
  </div>
);

const LegendItem: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
    <span className="text-xs font-bold text-slate-600">{label}</span>
  </div>
);

export default ResultsPage;
