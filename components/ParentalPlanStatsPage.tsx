
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const ParentalPlanStatsPage: React.FC = () => {
  const lastYearTotal = 200; // 上一年度申报人次
  const safetyThreshold = lastYearTotal * 0.8; // 80% 保护线
  const [currentCount, setCurrentCount] = useState(145); // 模拟本年度已统计人数

  // 核心业务判定逻辑
  const useSafetyValue = currentCount < safetyThreshold;
  const engineBaseValue = useSafetyValue ? safetyThreshold : currentCount;

  const chartData = [
    { name: '上一年度总值', value: lastYearTotal, color: '#94a3b8' },
    { name: '80% 保护阈值', value: safetyThreshold, color: '#f59e0b' },
    { name: '本年实统人次', value: currentCount, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* 1. 测算逻辑决策看板 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tight">Parental Demand Analytics</h3>
              <p className="text-sm text-slate-500 mt-1">根据申报计划自动判定排班引擎的人力冗余注入值</p>
            </div>
            
            <div className="flex gap-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">判定结论</p>
                <div className={`text-2xl font-black ${useSafetyValue ? 'text-amber-600' : 'text-blue-600'}`}>
                   {useSafetyValue ? '采用保护阈值测算' : '采用实统数据测算'}
                </div>
                <p className="text-[10px] text-slate-400 italic">#{useSafetyValue ? '实统人数低于去年80%' : '实统人数已覆盖保护线'}</p>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">引擎注入基数</p>
                <div className="text-2xl font-black text-slate-800">{engineBaseValue} <span className="text-xs font-normal">人次</span></div>
                <p className="text-[10px] text-slate-400 italic"># 实力损耗测算核心因子</p>
              </div>
            </div>
          </div>

          <div className="w-64 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
           <i className="fa-solid fa-baby-carriage absolute -right-6 -bottom-6 text-9xl opacity-10"></i>
           <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-4">实力损耗预测明细</p>
           <div className="space-y-4 relative z-10">
              <LossItem label="怀孕停飞 (9M+158D)" hours="2850h" percentage={60} color="bg-rose-400" />
              <LossItem label="育儿假 (10天/年)" hours="1120h" percentage={25} color="bg-blue-400" />
              <LossItem label="陪产假 (20天)" hours="640h" percentage={15} color="bg-emerald-400" />
           </div>
        </div>
      </div>

      {/* 2. 详细申报清单 */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 italic uppercase">申报计划明细列表 (实时同步)</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all">
              <i className="fa-solid fa-download mr-2"></i> 导出测算报告
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">申报人 (工号)</th>
              <th className="px-6 py-4">性别</th>
              <th className="px-6 py-4">计划类型</th>
              <th className="px-6 py-4">关键日期 (预产期/生日)</th>
              <th className="px-6 py-4">损耗算法</th>
              <th className="px-6 py-4">本年损耗权重</th>
              <th className="px-8 py-4 text-right">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            <StatsRow 
              name="张晓丽" code="802111" sex="女" type="怀孕停飞" date="2026-05-15" 
              calc="9M + 158D" impact="100% 实力排除" status="执行中"
            />
            <StatsRow 
              name="王志鹏" code="801552" sex="男" type="陪产假" date="2026-08-01" 
              calc="20天 (一次性)" impact="20天连休损耗" status="待生效"
            />
            <StatsRow 
              name="刘晨阳" code="800332" sex="男" type="育儿假" date="2024-05-01" 
              calc="10D * (8/12)" impact="折算约 7天" status="生效中"
            />
             <StatsRow 
              name="赵静宜" code="805521" sex="女" type="备孕上报" date="2026-12-20" 
              calc="未触发" impact="仅入库监控" status="已备案"
            />
          </tbody>
        </table>
      </div>

      {/* 3. 业务规则快读 */}
      <div className="grid grid-cols-4 gap-6">
        <RuleMiniCard icon="fa-person-breastfeeding" title="育儿假阶梯" desc="10天/年, 跨3年。最后一年按月比例折算。" />
        <RuleMiniCard icon="fa-calendar-check" title="休假包机制" desc="参考年假, 5天一包。陪产假20天需一次修完。" />
        <RuleMiniCard icon="fa-venus" title="女性关怀" desc="怀孕停飞锁定时长 9个月+158天。" />
        <RuleMiniCard icon="fa-shield-heart" title="测算冗余" desc="低于去年80%时触发保底机制。" />
      </div>
    </div>
  );
};

const LossItem = ({ label, hours, percentage, color }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px] font-black">
      <span className="opacity-60">{label}</span>
      <span>{hours}</span>
    </div>
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

const RuleMiniCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <h4 className="text-xs font-black text-slate-800 mb-1">{title}</h4>
      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatsRow = ({ name, code, sex, type, date, calc, impact, status }: any) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="px-8 py-5 font-black text-slate-800">
      {name} <span className="text-[10px] text-slate-400 font-mono tracking-tighter">#{code}</span>
    </td>
    <td className="px-6 py-5">
      <span className={`text-[10px] font-black uppercase ${sex === '女' ? 'text-rose-500' : 'text-blue-500'}`}>{sex}</span>
    </td>
    <td className="px-6 py-5">
      <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${
        type === '怀孕停飞' ? 'bg-rose-50 border-rose-100 text-rose-600' :
        type === '陪产假' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
        'bg-blue-50 border-blue-100 text-blue-600'
      }`}>{type}</span>
    </td>
    <td className="px-6 py-5 text-xs font-bold text-slate-600 italic">{date}</td>
    <td className="px-6 py-5 text-[10px] font-black text-slate-400 italic">{calc}</td>
    <td className="px-6 py-5 font-black text-slate-700 text-xs">{impact}</td>
    <td className="px-8 py-5 text-right">
       <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[9px] font-black rounded uppercase">{status}</span>
    </td>
  </tr>
);

export default ParentalPlanStatsPage;
