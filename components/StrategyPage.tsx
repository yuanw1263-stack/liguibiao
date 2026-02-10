
import React, { useState } from 'react';
import { STRATEGIES as INITIAL_STRATEGIES } from '../constants';
import { Strategy } from '../types';

type Role = 'pilot' | 'cabin' | 'safety';
type Tab = 'pairing_rules' | 'pairing_strategy' | 'manpower_strategy';

interface RuleItem {
  id: number;
  name: string;
  limitType: string;
  limitDetail: string;
  constraintType: string; // '强制约束' | '非强制约束' | '/'
  active: boolean;
  weight?: string;
}

const StrategyPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [activeRole, setActiveRole] = useState<Role>('pilot');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('pairing_rules');
  const [strategiesList, setStrategiesList] = useState<Strategy[]>(INITIAL_STRATEGIES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 新增策略表单状态
  const [newStrategy, setNewStrategy] = useState({
    role: 'pilot',
    type: '年度计划',
    name: '',
    isDefault: false
  });

  // 图片1 & 2: 组环规则配置数据
  const [pairingRules, setPairingRules] = useState<RuleItem[]>([
    { id: 1, name: '飞行值勤期内的飞行值勤时间限制', limitType: '裕度配置', limitDetail: '60分钟', constraintType: '强制约束', active: true },
    { id: 2, name: '飞行值勤期内的飞行时间限制', limitType: '裕度配置', limitDetail: '60分钟', constraintType: '强制约束', active: true },
    { id: 3, name: '飞行值勤前休10小时限制', limitType: '裕度配置', limitDetail: '60分钟', constraintType: '强制约束', active: true },
    { id: 4, name: '144休48小时限制', limitType: '裕度配置', limitDetail: '120分钟', constraintType: '强制约束', active: true },
    { id: 5, name: '连飞5天限制', limitType: '裕度配置', limitDetail: '120分钟', constraintType: '强制约束', active: true },
    { id: 6, name: '7日最大飞行值勤限制', limitType: '裕度配置', limitDetail: '120分钟', constraintType: '强制约束', active: true },
    { id: 7, name: '月飞时间限制', limitType: '裕度配置', limitDetail: '120分钟', constraintType: '强制约束', active: true },
    { id: 8, name: '月飞行值勤限制', limitType: '裕度配置', limitDetail: '120分钟', constraintType: '强制约束', active: true },
    { id: 9, name: '年飞时间限制', limitType: '裕度配置', limitDetail: '120分钟', constraintType: '强制约束', active: true },
    { id: 10, name: '一天内多个航班之前地点需要连续，第一个航班落地地点和第二个航班起飞地点一致', limitType: '', limitDetail: '', constraintType: '强制约束', active: true },
    { id: 11, name: '多天组环，第一天的结束地点 and 后续日期接的任务的开始地点必须连续', limitType: '', limitDetail: '', constraintType: '强制约束', active: true },
    { id: 12, name: '每天的第一个航班起飞和最后一个航班落地地点必须为过夜地点', limitType: '地点管理', limitDetail: '长沙、南京、天府、昆明、吐鲁番、长春、无锡、海拉尔、兰州、深圳、珠海、石河子、南昌', constraintType: '强制约束', active: true },
    { id: 13, name: '休息的48小时，最好在昆明、无锡、南京、长沙四个地方休息，也就是休48小时前落地的地点', limitType: '地点管理', limitDetail: '昆明、无锡、长沙、南京、深圳', constraintType: '非强制约束', active: true },
    { id: 14, name: '一天内的航班，尽量不跨飞机，如果一定跨飞机，需要满足间隔时间', limitType: '时间限制', limitDetail: '120分钟', constraintType: '强制约束', active: true },
    { id: 15, name: '一天内的航班，第一个航班和第二个航班之间的间隔时间，尽量不要大于4小时', limitType: '时间限制', limitDetail: '240分钟', constraintType: '非强制约束', active: true },
  ]);

  const [pairingStrategy, setPairingStrategy] = useState<RuleItem[]>([
    { id: 1, name: '完成所有航班组环，组环满足组环约束', limitType: '', limitDetail: '', constraintType: '/', weight: '/', active: true },
    { id: 2, name: '总的组环数量尽量少，目前人工控制在67个，系统要小于等于67', limitType: '数量限制', limitDetail: '60', constraintType: '', weight: '高', active: true },
    { id: 3, name: '机场分为C/B/A三类，一条航线按照高的类型来算类型（C类>B类>A类），同类型机场尽量分到一个环', limitType: '数量限制', limitDetail: 'C类机场组环数限制: 15; B类机场组环数限制: 20', constraintType: '', weight: '中', active: true },
    { id: 4, name: '多天的组环，321机型的航班，尽量组在一起', limitType: '', limitDetail: '', constraintType: '', weight: '中', active: true },
    { id: 5, name: '组环时间均衡', limitType: '', limitDetail: '', constraintType: '', weight: '低', active: true },
    { id: 6, name: '外站过夜天数统计', limitType: '', limitDetail: '', constraintType: '', weight: '高', active: true },
    { id: 7, name: '不衔接置位尽量少，最好没有', limitType: '', limitDetail: '', constraintType: '', weight: '高', active: true },
  ]);

  const [manpowerStrategy, setManpowerStrategy] = useState<RuleItem[]>([
    { id: 1, name: '人员裕度配置', limitType: '比例', limitDetail: '5%', constraintType: '', weight: '5%', active: true },
    { id: 2, name: '假期保障比例', limitType: '比例', limitDetail: '100%', constraintType: '', weight: '100%', active: true },
    { id: 3, name: '双人制航线需求', limitType: '机场', limitDetail: '吐鲁番、北京首都、北京大兴', constraintType: '', weight: '强制', active: true },
  ]);

  const handleEdit = (s: Strategy) => {
    setSelectedStrategy(s);
    setView('detail');
  };

  const handleCreateNew = () => {
    if (!newStrategy.name) {
      alert("请输入策略名称");
      return;
    }

    const strategyId = 'S' + (strategiesList.length + 1).toString().padStart(3, '0');
    const newEntry: Strategy = {
      id: strategyId,
      name: newStrategy.name,
      type: newStrategy.type.replace('计划', '') as any,
      lastModified: new Date().toISOString().split('T')[0],
      isDefault: newStrategy.isDefault
    };

    let updatedList = [...strategiesList];
    // 如果设置为默认，取消同类型的其他默认策略
    if (newStrategy.isDefault) {
      updatedList = updatedList.map(s => 
        s.type === newEntry.type ? { ...s, isDefault: false } : s
      );
    }
    
    setStrategiesList([...updatedList, newEntry]);
    setIsCreateModalOpen(false);
    setSelectedStrategy(newEntry);
    setView('detail');
    setNewStrategy({ role: 'pilot', type: '年度计划', name: '', isDefault: false });
  };

  const toggleConstraintType = (data: RuleItem[], setData: any, index: number) => {
    const newData = [...data];
    const current = newData[index].constraintType;
    if (current === '/') return;
    newData[index].constraintType = current === '强制约束' ? '非强制约束' : '强制约束';
    setData(newData);
  };

  const renderTable = (data: RuleItem[], setData: any, showWeight = false) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[#121826] text-white">
          <tr className="text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5 w-16 border-r border-white/10">序号</th>
            <th className="px-6 py-5 w-72 border-r border-white/10">规则/评价维度</th>
            <th className="px-6 py-5 w-32 border-r border-white/10">限制类型</th>
            <th className="px-6 py-5 border-r border-white/10">限制详细</th>
            {showWeight ? (
              <th className="px-6 py-5 w-32 border-r border-white/10 text-center">权重配置</th>
            ) : (
              <th className="px-6 py-5 w-40 border-r border-white/10 text-center">约束类型</th>
            )}
            <th className="px-6 py-5 w-24 text-center">开关</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-bold">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-5 text-slate-400 font-mono italic">{index + 1}</td>
              <td className="px-6 py-5 text-slate-800 leading-relaxed text-xs">
                {item.name}
              </td>
              <td className="px-6 py-5">
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-tighter">
                  {item.limitType || '--'}
                </span>
              </td>
              <td className="px-6 py-5">
                <input 
                  type="text"
                  className="w-full bg-transparent border-b border-transparent focus:border-blue-400 focus:bg-white px-2 py-1 text-slate-700 text-xs font-bold outline-none transition-all placeholder:italic placeholder:font-normal"
                  value={item.limitDetail}
                  placeholder={item.limitDetail ? "" : "点击配置详细值..."}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].limitDetail = e.target.value;
                    setData(newData);
                  }}
                />
              </td>
              {showWeight ? (
                <td className="px-6 py-5 text-center">
                  <input 
                    type="text" 
                    className="w-20 text-center bg-slate-50 border border-slate-200 rounded-lg py-1 text-blue-600 font-black text-[11px]" 
                    value={item.weight}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[index].weight = e.target.value;
                      setData(newData);
                    }}
                  />
                </td>
              ) : (
                <td className="px-6 py-5 text-center">
                  {item.constraintType === '/' ? (
                    <span className="text-slate-300 font-black">/</span>
                  ) : (
                    <button 
                      onClick={() => toggleConstraintType(data, setData, index)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border-2 transition-all active:scale-95 ${
                        item.constraintType === '强制约束' 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm shadow-rose-100' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm shadow-emerald-100'
                      }`}
                    >
                      {item.constraintType}
                    </button>
                  )}
                </td>
              )}
              <td className="px-6 py-5 text-center">
                <div 
                  onClick={() => {
                    const newData = [...data];
                    newData[index].active = !newData[index].active;
                    setData(newData);
                  }}
                  className={`w-11 h-6 rounded-full relative cursor-pointer mx-auto transition-all ${item.active ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1 shadow-sm'}`}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (view === 'list') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-800 italic uppercase">人力分析策略库</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">定义各职能人员在组环和人力测算时的基准规则</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-blue-600 text-white px-8 py-3 rounded-[20px] font-black shadow-xl shadow-blue-600/20 flex items-center gap-3 transition-all hover:bg-blue-700 active:scale-95"
          >
            <i className="fa-solid fa-plus"></i> 新增策略版本
          </button>
        </div>

        <div className="flex bg-white p-1.5 rounded-[22px] shadow-sm border border-slate-200 inline-flex">
          {['pilot', 'cabin', 'safety'].map(r => (
            <button
              key={r}
              onClick={() => setActiveRole(r as Role)}
              className={`px-10 py-2.5 rounded-[18px] text-xs font-black transition-all ${activeRole === r ? 'bg-[#121826] text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {r === 'pilot' ? '飞行员' : r === 'cabin' ? '乘务员' : '安全员'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-6">
          {strategiesList.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:border-blue-400 transition-all group relative">
              <div className="flex justify-between items-start mb-8">
                <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-tighter">{s.type}版本</span>
                {s.isDefault && (
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm animate-bounce" title="当前默认策略">
                    <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                  </div>
                )}
              </div>
              <h3 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors text-xl mb-3 tracking-tight">{s.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-10 tracking-widest italic opacity-60">Last Modified: {s.lastModified}</p>
              <button onClick={() => handleEdit(s)} className="w-full py-4 bg-slate-50 text-slate-600 rounded-[24px] text-xs font-black hover:bg-blue-50 hover:text-blue-600 transition-all shadow-inner border border-transparent hover:border-blue-100">配置详细规则</button>
            </div>
          ))}
        </div>

        {/* 新增策略弹窗 */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800 tracking-tight italic">CREATE NEW POLICY</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                  <i className="fa-solid fa-circle-xmark text-2xl"></i>
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">选择岗位</label>
                  <select 
                    value={newStrategy.role}
                    onChange={(e) => setNewStrategy({ ...newStrategy, role: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pilot">飞行员</option>
                    <option value="cabin">乘务员</option>
                    <option value="safety">安全员</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">应用类型</label>
                  <select 
                    value={newStrategy.type}
                    onChange={(e) => setNewStrategy({ ...newStrategy, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="年度计划">年度计划</option>
                    <option value="航季计划">航季计划</option>
                    <option value="月度计划">月度计划</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">策略名称</label>
                  <input 
                    type="text" 
                    placeholder="请输入描述性名称..."
                    value={newStrategy.name}
                    onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 text-blue-700">
                    <i className="fa-solid fa-star"></i>
                    <span className="text-xs font-black uppercase">默认使用该策略</span>
                  </div>
                  <div 
                    onClick={() => setNewStrategy({ ...newStrategy, isDefault: !newStrategy.isDefault })}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${newStrategy.isDefault ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newStrategy.isDefault ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
                <button 
                  onClick={handleCreateNew}
                  className="w-full py-4 bg-[#121826] text-white rounded-2xl text-sm font-black shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
                >
                  确认并进入详细配置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in slide-in-from-right duration-300">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <button onClick={() => setView('list')} className="w-14 h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all border border-slate-100 hover:border-slate-200 shadow-sm">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight">策略详情: {selectedStrategy?.name || '新建策略版本'}</h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AeroCrew Analytics Policy v3.22</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView('list')} className="px-8 py-3.5 border border-slate-200 rounded-[20px] text-sm font-black text-slate-500 hover:bg-slate-50 transition-all">取消更改</button>
          <button 
            onClick={() => { setView('list'); alert('策略详情已保存'); }}
            className="px-12 py-3.5 bg-[#121826] text-white rounded-[20px] text-sm font-black shadow-2xl shadow-slate-900/30 active:scale-95 transition-all"
          >
            保存当前策略
          </button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-[32px] shadow-sm border border-slate-200 flex gap-1">
        {[
          { id: 'pairing_rules', label: '组环规则配置', icon: 'fa-ruler-combined' },
          { id: 'pairing_strategy', label: '组环策略', icon: 'fa-diagram-project' },
          { id: 'manpower_strategy', label: '人力分析策略', icon: 'fa-users-gear' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 py-4 rounded-[26px] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === tab.id ? 'bg-[#121826] text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-blue-400' : 'opacity-40'}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pb-20">
        {activeTab === 'pairing_rules' && renderTable(pairingRules, setPairingRules)}
        {activeTab === 'pairing_strategy' && renderTable(pairingStrategy, setPairingStrategy, true)}
        {activeTab === 'manpower_strategy' && renderTable(manpowerStrategy, setManpowerStrategy, true)}
      </div>
    </div>
  );
};

export const RuleCard: React.FC<{ rule: any }> = ({ rule }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-all group">
    <div className="flex gap-5 items-center">
      <div className={`w-3 h-3 rounded-full ${rule.isStrong ? 'bg-rose-500 shadow-sm shadow-rose-200' : 'bg-amber-500 shadow-sm shadow-amber-200'}`}></div>
      <div>
        <div className="flex items-center gap-3">
          <span className="font-black text-slate-800 text-sm tracking-tight">{rule.name}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider opacity-60">Rule: {rule.id}</p>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-2.5 text-xs font-black text-slate-600 min-w-[120px] text-center shadow-inner tracking-tighter">
        {rule.limit}
      </div>
      <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${rule.isActive ? 'bg-blue-600 shadow-lg' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.isActive ? 'right-1' : 'left-1 shadow-sm'}`}></div>
      </div>
    </div>
  </div>
);

export default StrategyPage;
