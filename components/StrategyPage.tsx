
import React, { useState } from 'react';
import { INITIAL_RULES, WEIGHTS, STRATEGIES } from '../constants';
import { Strategy } from '../types';

const StrategyPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'weights'>('rules');

  const handleEdit = (s: Strategy) => {
    setSelectedStrategy(s);
    setView('detail');
  };

  if (view === 'list') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">策略库管理</h2>
            <p className="text-sm text-slate-500 mt-1">管理年度、季度、月度及各类临时测算策略集</p>
          </div>
          <button 
            onClick={() => { setSelectedStrategy(null); setView('detail'); }}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> 新增策略集
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STRATEGIES.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                  s.type === '年度' ? 'bg-indigo-100 text-indigo-600' :
                  s.type === '季度' ? 'bg-emerald-100 text-emerald-600' :
                  s.type === '月度' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {s.type}策略
                </span>
                {s.isDefault && <span className="text-[10px] font-bold text-slate-400 italic">默认策略</span>}
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{s.name}</h3>
              <p className="text-xs text-slate-400 mt-2">最后修改: {s.lastModified}</p>
              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => handleEdit(s)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-xs font-bold transition-colors"
                >
                  配置规则
                </button>
                <button className="p-2 text-slate-400 hover:text-rose-500"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in slide-in-from-right duration-300">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{selectedStrategy ? `编辑：${selectedStrategy.name}` : '新建策略集'}</h2>
            <p className="text-sm text-slate-500 mt-1">定义测算时的规章、限制以及人力冗余裕度 (Margin)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">取消</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700">保存修改</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-5 gap-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">策略名称</label>
          <input type="text" defaultValue={selectedStrategy?.name || ""} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">排班时长裕度</label>
          <div className="relative">
            <input type="number" defaultValue="1" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">小时</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">组环效率目标</label>
          <div className="relative">
            <input type="number" defaultValue="15" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">适用机队</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none">
            <option>A320/A321 全机队</option>
            <option>B737 系列</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">规章等级</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none">
            <option>CAAC 规范 (标准)</option>
            <option>公司加严版 (高安全)</option>
          </select>
        </div>
      </div>

      <div className="border-b border-slate-200 flex gap-8 px-2">
        <button 
          onClick={() => setActiveTab('rules')}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === 'rules' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}
        >
          约束规则配置 (24)
        </button>
        <button 
          onClick={() => setActiveTab('weights')}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === 'weights' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}
        >
          测算优化权重 (12)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        {activeTab === 'rules' ? (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1 pb-2">
                <h3 className="text-sm font-bold text-slate-700">值勤与休息类</h3>
              </div>
              {INITIAL_RULES.filter(r => r.category === 'duty').map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1 pb-2">
                <h3 className="text-sm font-bold text-slate-700">运行连续性类</h3>
              </div>
              {INITIAL_RULES.filter(r => r.category === 'continuity').map(rule => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </>
        ) : (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700">指标名称</th>
                  <th className="px-6 py-4 font-bold text-slate-700">优化倾向</th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-center w-32">权重值 (0-100)</th>
                  <th className="px-6 py-4 font-bold text-slate-700">逻辑说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WEIGHTS.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{w.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        w.direction === 'less' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {w.direction === 'less' ? '越少越好' : '越多越好'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input type="number" defaultValue={w.weight} className="w-20 px-2 py-1 border border-slate-200 rounded text-center outline-none focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs italic">{w.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const RuleCard: React.FC<{ rule: any }> = ({ rule }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors">
    <div className="flex gap-4 items-start">
      <div className={`mt-1.5 w-2 h-2 rounded-full ${rule.isStrong ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-amber-500'}`}></div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 text-sm tracking-tight">{rule.name}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${
            rule.isStrong ? 'bg-red-50 border-red-200 text-red-600' : 'bg-amber-50 border-amber-200 text-amber-600'
          }`}>{rule.isStrong ? '强约束' : '弱约束'}</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 leading-tight">{rule.description}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 min-w-[100px] text-center">
          {rule.limit}
        </div>
      </div>
      <div className={`w-10 h-5 rounded-full relative cursor-pointer ${rule.isActive ? 'bg-blue-600' : 'bg-slate-300'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${rule.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
      </div>
    </div>
  </div>
);

export default StrategyPage;
