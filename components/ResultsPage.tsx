
import React, { useState, useMemo, useEffect } from 'react';
import { MANPOWER_DATA, INITIAL_RULES, WEIGHTS } from '../constants';
import { RuleCard } from './StrategyPage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CALC_STEPS = [
  { id: 1, label: "预排班触发", detail: "初始化分布式计算引擎..." },
  { id: 2, label: "信息准备", detail: "同步航网计划与人员资质库..." },
  { id: 3, label: "任务预排", detail: "航班/训练/请假/公务任务综合编排..." },
  { id: 4, label: "人员评估", detail: "执行招聘与晋升人力缺口分析..." },
  { id: 5, label: "结果输出", detail: "生成排班视图与汇总明细表..." }
];

const ResultsPage: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState(8);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState('自动测算版本1');
  const [newVersionName, setNewVersionName] = useState('');

  const versions = [
    '自动测算版本1',
    '调整长沙-昆明航班版本2',
    '昆明无锡连线版本3'
  ];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = useMemo(() => new Date(2026, activeMonth, 0).getDate(), [activeMonth]);
  const monthDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // 模拟计算步骤
  const handleRecalculate = async () => {
    setIsCalculating(true);
    setShowAdjustmentModal(false);
    
    for (let i = 1; i <= CALC_STEPS.length; i++) {
      setCalcStep(i);
      await new Promise(resolve => setTimeout(resolve, 800)); // 每个步骤模拟耗时
    }
    
    setTimeout(() => {
      setIsCalculating(false);
      setCalcStep(0);
      // 模拟添加新版本到下拉框（演示用）
      if (newVersionName) {
        setSelectedVersion(newVersionName);
        setNewVersionName('');
      }
    }, 500);
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    alert('计划已确认并提交反馈至航网系统');
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

  const rankManpowerData = [
    { rank: "高级机长以上", values: [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0], total: 4 },
    { rank: "B类机长", values: [1, 1, 3, 0, 4, 1, 0, 0, 0, 0, 0, 0], total: 10 },
    { rank: "A类机长", values: [1, 1, 3, 0, 4, 1, 0, 0, 0, 0, 0, 0], total: 10 },
    { rank: "F3以上副驾驶", values: [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0], total: 4 },
    { rank: "储备人员", values: [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0], total: 4 },
  ];

  const trainingData = [
    { name: '1月', trainee: 120, trainer: 45 },
    { name: '2月', trainee: 150, trainer: 50 },
    { name: '3月', trainee: 180, trainer: 60 },
    { name: '4月', trainee: 140, trainer: 40 },
    { name: '5月', trainee: 160, trainer: 55 },
    { name: '6月', trainee: 200, trainer: 70 },
    { name: '7月', trainee: 220, trainer: 75 },
    { name: '8月', trainee: 210, trainer: 65 },
    { name: '9月', trainee: 190, trainer: 60 },
    { name: '10月', trainee: 170, trainer: 55 },
    { name: '11月', trainee: 150, trainer: 45 },
    { name: '12月', trainee: 130, trainer: 40 },
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
      {/* Enhanced Step-by-Step Calculation Overlay */}
      {isCalculating && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-lg flex flex-col items-center">
            {/* Spinning Loader & Progress Circle */}
            <div className="relative mb-10">
               <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
               <div className="absolute inset-0 w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-blue-600">
                 {Math.round((calcStep / CALC_STEPS.length) * 100)}%
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-8">预排班引擎深度计算中</h3>
            
            {/* Step Pipeline Display */}
            <div className="w-full space-y-4">
              {CALC_STEPS.map((step) => {
                const isActive = calcStep === step.id;
                const isDone = calcStep > step.id;
                return (
                  <div key={step.id} className={`flex items-start gap-4 transition-all duration-300 ${isActive ? 'scale-105' : isDone ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-colors ${isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      {isDone ? <i className="fa-solid fa-check"></i> : step.id}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-slate-700'}`}>{step.label}</p>
                      {isActive && <p className="text-[10px] text-blue-400 animate-pulse mt-0.5">{step.detail}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-10">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                style={{ width: `${(calcStep / CALC_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="mt-6 text-white/80 text-sm font-medium tracking-widest animate-pulse">正在处理海量规章与人力配额关系...</p>
        </div>
      )}

      {/* Top Header with Metrics Cards */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-6">
          <HeaderMetricCard 
            title="月飞行小时" 
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
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <span className="text-slate-500">飞行员总人数:</span> <span className="text-slate-800 font-black">130</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span className="text-slate-500">人力折损:</span> <span className="text-slate-800 font-black">5.5</span>
              </div>
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
             
             <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">方案版本:</span>
               <div className="relative group">
                 <select 
                   value={selectedVersion}
                   onChange={(e) => setSelectedVersion(e.target.value)}
                   className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[200px]"
                 >
                   {versions.map(v => (
                     <option key={v} value={v}>{v}</option>
                   ))}
                 </select>
                 <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]"></i>
               </div>
             </div>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setShowConfirmModal(true)}
               className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
             >
               确认计划
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

      {/* Gantt Container */}
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

      {/* Yearly Capability Detail Table (補全的表格) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          <h3 className="font-bold text-slate-800 tracking-tight uppercase">2026年度飞行人力保障明细表 (1-12月)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-center border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-600 w-40 sticky left-0 bg-slate-50 z-10">年度指标</th>
                {months.map(m => <th key={m} className="px-2 py-4 font-bold">{m}月</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-500">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-left font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-50">机长可用总数</td>
                {MANPOWER_DATA.map((d, i) => (
                  <td key={i} className={`px-2 py-4 ${i === 5 || i === 11 ? 'text-rose-600 font-bold' : ''}`}>{d.captains}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-left font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-50">副驾驶可用总数</td>
                {MANPOWER_DATA.map((d, i) => (
                  <td key={i} className="px-2 py-4">{d.fo}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-left font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-50">训练/考试损耗</td>
                {MANPOWER_DATA.map((d, i) => (
                  <td key={i} className="px-2 py-4">{d.trainingAttrition}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-left font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-50">公务/会议占用</td>
                {MANPOWER_DATA.map((d, i) => (
                  <td key={i} className="px-2 py-4">{d.officialBusiness}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-left font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-50">各类休假损耗</td>
                {MANPOWER_DATA.map((d, i) => (
                  <td key={i} className="px-2 py-4">{d.leaveAttrition}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-left font-bold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-50">可保障总小时</td>
                {MANPOWER_DATA.map((d, i) => (
                  <td key={i} className="px-2 py-4 font-black text-blue-600">{d.totalAvailableHours}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-left font-bold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-50">人力裕度 (Margin)</td>
                {MANPOWER_DATA.map((d, i) => (
                  <td key={i} className={`px-2 py-4 font-black ${i === 5 ? 'text-rose-600 bg-rose-50' : 'text-slate-800'}`}>{d.marginHours}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rank Manpower Requirement Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-white">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          <h3 className="font-bold text-slate-800 tracking-tight">各职级人力需求</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-center border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-600 w-48 sticky left-0 bg-slate-50 z-10">职级</th>
                {months.map(m => <th key={m} className="px-2 py-4 font-bold">{m}月</th>)}
                <th className="px-6 py-4 font-bold border-l border-slate-100">合计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-400">
              {rankManpowerData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-left font-bold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-50">{row.rank}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={`px-2 py-4 font-bold ${v > 0 ? 'text-indigo-600' : 'text-slate-200 opacity-60'}`}>
                      {v}
                    </td>
                  ))}
                  <td className="px-6 py-4 font-black text-indigo-700 bg-indigo-50/30 border-l border-slate-100">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Training Statistics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          <h3 className="font-bold text-slate-800 tracking-tight">月度训练统计</h3>
        </div>

        <div className="space-y-4">
          <h4 className="text-center text-xl font-bold text-slate-600">飞行训练人次</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 500]} />
                <Tooltip />
                <Legend iconType="rect" verticalAlign="bottom" height={36}/>
                <Bar dataKey="trainee" name="学员人次" stackId="a" fill="#3b82f6" barSize={30} />
                <Bar dataKey="trainer" name="教员人次" stackId="a" fill="#f97316" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 text-sm">各类型训练统计</h4>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 bg-slate-100/50 w-32">类型</th>
                  <th className="px-4 py-3 border-l border-slate-200">复训</th>
                  <th className="px-4 py-3 border-l border-slate-200">新雇员培训</th>
                  <th className="px-4 py-3 border-l border-slate-200">晋升培训</th>
                  <th className="px-4 py-3 border-l border-slate-200 bg-slate-100/30">总天数</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr>
                  <td className="px-4 py-3 font-bold bg-slate-50/30 border-r border-slate-200">训练天数</td>
                  <td className="px-4 py-3">275</td>
                  <td className="px-4 py-3 border-l border-slate-200">31</td>
                  <td className="px-4 py-3 border-l border-slate-200">72</td>
                  <td className="px-4 py-3 border-l border-slate-200 font-bold bg-slate-50/20">235</td>
                </tr>
              </tbody>
            </table>
          </div>
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
            
            {/* New Version Name Input Section */}
            <div className="px-10 py-4 bg-white border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">本次测算的名称版本说明</label>
              <input 
                type="text" 
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="例如：调整长沙-昆明航班版本4" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="px-8 py-6 bg-white border-t flex justify-end gap-3 shadow-inner">
              <button onClick={() => setShowAdjustmentModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">放弃本次修改</button>
              <button onClick={handleRecalculate} className="px-10 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-orange-700 transition-all active:scale-95">重新预排班</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Feedback Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">确认计划并提交反馈</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">结果反馈类型</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none text-sm focus:ring-2 focus:ring-blue-500">
                  <option>完全符合年度保障要求</option>
                  <option>基本符合，部分月份需微调</option>
                  <option>存在显著冲突，需重新编排航网</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">反馈详细说明</label>
                <textarea 
                  rows={4}
                  placeholder="请输入您的反馈意见或需要航网部门注意的事项..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-5 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-colors">取消</button>
              <button onClick={handleFinalConfirm} className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition-all">确认提交</button>
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

export default ResultsPage;
