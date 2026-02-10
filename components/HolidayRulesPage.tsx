
import React, { useState } from 'react';

type HolidayTab = 'annual' | 'recuperation' | 'parental' | 'agreement';

// --- 类型定义 ---
interface AnnualRule { id: string; tenure: string; days: number; }
interface RecupPilotRule { id: string; range: string; days: number; isLeader?: boolean; }
interface AgreementPerson { id: string; name: string; type: string; days: number; status: string; }

const HolidayRulesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HolidayTab>('annual');
  const [showModal, setShowModal] = useState<string | null>(null);

  // --- 全局状态管理 (模拟初始化数据) ---
  const [annualRules, setAnnualRules] = useState<AnnualRule[]>([
    { id: '1', tenure: '工龄 < 10年', days: 5 },
    { id: '2', tenure: '10年 ≤ 工龄 < 15年', days: 10 },
    { id: '3', tenure: '工龄 ≥ 15年', days: 15 },
  ]);

  const [recupPilotRules, setRecupPilotRules] = useState<RecupPilotRule[]>([
    { id: 'p1', range: '年飞时间 < 500h', days: 0 },
    { id: 'p2', range: '500h ≤ 年飞时间 < 700h', days: 5 },
    { id: 'p3', range: '年飞时间 ≥ 700h', days: 7 },
    { id: 'p4', range: '领导干部 (分部/科室及以上)', days: 6, isLeader: true },
  ]);

  const [agreementList, setAgreementList] = useState<AgreementPerson[]>([
    { id: 'AC1001', name: '李云龙', type: '高级机长', days: 5, status: '永久累计中' },
    { id: 'AC1002', name: '赵刚', id: 'AC1002', type: '教员', days: 5, status: '永久累计中' },
  ]);

  const tabs = [
    { id: 'annual', label: '年假规则', icon: 'fa-calendar-day' },
    { id: 'recuperation', label: '疗养假规则', icon: 'fa-bed' },
    { id: 'parental', label: '育儿/生育假', icon: 'fa-baby' },
    { id: 'agreement', label: '协议假管理', icon: 'fa-file-signature' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300 relative pb-20">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">假期计算规则配置</h2>
          <p className="text-sm text-slate-500 mt-1">配置各职能人员假期天数算法、连休策略及外部系统同步逻辑</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <i className="fa-solid fa-rotate"></i> 同步HR系统数据
          </button>
          <button 
            onClick={() => alert('全局配置已提交保存')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            保存全局配置
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as HolidayTab)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {activeTab === 'annual' && <AnnualLeaveContent rules={annualRules} onEdit={() => setShowModal('edit_annual')} />}
        {activeTab === 'recuperation' && <RecuperationLeaveContent pilotRules={recupPilotRules} onEditPilot={() => setShowModal('edit_recup_pilot')} />}
        {activeTab === 'parental' && <ParentalLeaveContent onEdit={() => setShowModal('edit_parental')} />}
        {activeTab === 'agreement' && <AgreementLeaveContent list={agreementList} onAdd={() => setShowModal('add_agreement')} onDelete={(id) => setAgreementList(prev => prev.filter(p => p.id !== id))} />}
      </div>

      {/* --- 全局模态框管理 --- */}
      {showModal === 'edit_annual' && (
        <Modal title="编辑年假阶梯规则" onClose={() => setShowModal(null)}>
          <div className="space-y-4">
            {annualRules.map((rule, idx) => (
              <div key={rule.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">区间说明</label>
                  <input type="text" defaultValue={rule.tenure} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                </div>
                <div className="w-24">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">天数</label>
                  <input type="number" defaultValue={rule.days} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                </div>
              </div>
            ))}
            <button className="text-blue-600 text-xs font-bold hover:underline mt-2"><i className="fa-solid fa-plus mr-1"></i>添加新的工龄区间</button>
          </div>
        </Modal>
      )}

      {showModal === 'add_agreement' && (
        <Modal title="添加协议假人员" onClose={() => setShowModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1 block">姓名</label>
              <input type="text" placeholder="请输入姓名" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1 block">职级类型</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm">
                <option>高级机长</option>
                <option>A类机长</option>
                <option>乘务长</option>
                <option>安全员</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1 block">月度协议天数</label>
              <input type="number" defaultValue={5} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="pt-4">
              <button 
                onClick={() => {
                  setAgreementList([...agreementList, { id: 'AC' + (1003 + agreementList.length), name: '新员工', type: '高级机长', days: 5, status: '已生效' }]);
                  setShowModal(null);
                }}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20"
              >确认添加</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// --- 通用模态框组件 ---
const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
      </div>
      <div className="p-6">
        {children}
      </div>
      <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white rounded-lg transition-colors">取消</button>
        <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-700">保存更新</button>
      </div>
    </div>
  </div>
);

// --- 子组件: 年假规则 ---
const AnnualLeaveContent: React.FC<{ rules: AnnualRule[], onEdit: () => void }> = ({ rules, onEdit }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
      <button onClick={onEdit} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white flex items-center justify-center">
        <i className="fa-solid fa-pencil text-xs"></i>
      </button>
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-blue-500 pl-3">年假天数统计标准</h3>
      <div className="space-y-4">
        {rules.map(rule => <TenureRow key={rule.id} label={rule.tenure} days={rule.days} />)}
      </div>
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
        <i className="fa-solid fa-link text-blue-400 mt-1"></i>
        <div className="flex-1">
          <p className="text-xs font-bold text-blue-700">人资系统集成已启用</p>
          <p className="text-[10px] text-blue-600 mt-1 italic">系统将根据HR同步的入职日期动态刷新每个周期的基准天数</p>
        </div>
        <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
          <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-orange-500 pl-3">空勤人员休假方案 (空/乘/安)</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-700">最小休假单元 (Block)</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">原则上一次必须休完5天，且包含法定休息时间</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-800">5</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Days</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-700">包含48小时大休</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">扣除5天年假，实际包含并满足法规大休时长</p>
          </div>
          <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-lg shadow-blue-500/20">
            <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- 子组件: 疗养假规则 ---
const RecuperationLeaveContent: React.FC<{ pilotRules: RecupPilotRule[], onEditPilot: () => void }> = ({ pilotRules, onEditPilot }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
        <button onClick={onEditPilot} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white flex items-center justify-center">
          <i className="fa-solid fa-pencil text-xs"></i>
        </button>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-blue-500 pl-3">飞行员疗养标准 (根据年度飞时)</h3>
        <div className="space-y-3">
          {pilotRules.map(rule => (
            <RecupItem key={rule.id} label={rule.range} value={`${rule.days}天`} color={rule.days === 0 ? 'text-slate-400' : 'text-slate-800'} bold={rule.isLeader} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
        <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white flex items-center justify-center">
          <i className="fa-solid fa-pencil text-xs"></i>
        </button>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-cyan-500 pl-3">乘务员/安全员标准 (两年一休)</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-600">休假周期设置</span>
            <span className="text-xs font-black text-slate-800">每 2 年一次 (连休)</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-600">休假名单导入</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded border border-blue-100">已同步 138 人</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-600">飞时达标门槛</span>
            <span className="text-xs font-black text-slate-800">年度飞时 > 1000h</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg text-emerald-700">
            <span className="text-xs font-bold">飞时达标奖励 (次年)</span>
            <span className="text-xs font-black">+ 5 天</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">疗养休假规则特别说明</h3>
        <div className="flex gap-2">
           <button className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">
            <i className="fa-solid fa-file-export mr-2"></i>导出人员疗养名单 (.xlsx)
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <RecupMetric label="新雇员开始休假年限" value="第 3 年" sub="入职起算,不跨年" />
        <RecupMetric label="最小休假包" value="5 天 (连续)" sub="包含48小时休息" />
        <RecupMetric label="非干部分类控制" value="启用" sub="疗养假不考虑干部职等" />
        <RecupMetric label="年度不跨年政策" value="严格执行" sub="过期自动失效" />
      </div>
    </div>
  </div>
);

// --- 子组件: 育儿假规则 ---
const ParentalLeaveContent: React.FC<{ onEdit: () => void }> = ({ onEdit }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300 relative group">
    <button onClick={onEdit} className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center">
      <i className="fa-solid fa-gear text-sm"></i>
    </button>
    
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-rose-500 pl-3">需求预测管理 (Maternity Demand Management)</h3>
      <div className="flex items-center gap-10">
        <div className="flex-1 space-y-4">
           <p className="text-xs text-slate-500 leading-relaxed font-medium italic">测算规则：若当年统计出的意向人数少于上一年度的 80%，排班引擎将自动采用上年度 80% 的总值进行冗余测算。</p>
           <div className="flex gap-4">
             <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-bold flex items-center gap-2">
               <i className="fa-solid fa-shield-heart"></i> 安全保护阈值: 80%
             </div>
           </div>
        </div>
        <div className="w-px h-24 bg-slate-100"></div>
        <div className="w-64">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">上年度总基数</p>
           <div className="text-2xl font-black text-slate-800">172 <span className="text-xs text-slate-400 font-normal">人次</span></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">女生怀孕停飞周期</h4>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-slate-800">9个月 + 158天</span>
        </div>
        <p className="text-xs text-slate-400 leading-tight">适用于确认怀孕即停飞的人员，包含完整产假时长。</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">育儿假标准 (男女通用)</h4>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-slate-800">10天 / 年</span>
          <span className="text-xs text-blue-600 font-bold">(有效期3年)</span>
        </div>
        <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic leading-snug">
          计算策略：三岁前每年10天。出生当年按剩余月份拆算 (例:5月出生,当年休 10*8/12 = 7天)。
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">陪产假标准 (男性)</h4>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-slate-800">20天</span>
        </div>
        <p className="text-xs text-rose-600 font-bold italic tracking-tighter"># 必须一次性休完，参考年假5天休假方案。</p>
      </div>
    </div>
  </div>
);

// --- 子组件: 协议假规则 ---
const AgreementLeaveContent: React.FC<{ list: AgreementPerson[], onAdd: () => void, onDelete: (id: string) => void }> = ({ list, onAdd, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
      <div>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-l-4 border-slate-800 pl-3">特殊协议假名单</h3>
        <p className="text-xs text-slate-500 mt-1">适用于名单内员工，支持每月累计 5 天固定假期，允许跨月永久累计</p>
      </div>
      <button 
        onClick={onAdd}
        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
      >
        <i className="fa-solid fa-user-plus"></i> 添加人员
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
          <tr>
            <th className="px-6 py-4">姓名 / 工号</th>
            <th className="px-6 py-4">职级角色</th>
            <th className="px-6 py-4">月度协议假 (天)</th>
            <th className="px-6 py-4">累计机制</th>
            <th className="px-6 py-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {list.map(p => (
            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-800">{p.name}</div>
                <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{p.id}</div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{p.type}</span>
              </td>
              <td className="px-6 py-4">
                <input type="number" defaultValue={p.days} className="w-16 px-2 py-1 bg-white border rounded text-sm font-black text-blue-600 text-center focus:ring-2 focus:ring-blue-500 outline-none" />
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-tighter ${p.status.includes('累计') ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><i className="fa-solid fa-floppy-disk"></i></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-center gap-3">
       <i className="fa-solid fa-circle-exclamation text-amber-500"></i>
       <p className="text-[10px] font-bold text-amber-800">注意：协议假天数未休满部分，将在离职结算测算时自动转化为薪资补偿规则。</p>
    </div>
  </div>
);

// --- 辅助原子组件 ---
const TenureRow: React.FC<{ label: string, days: number }> = ({ label, days }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-colors">
    <span className="text-sm font-bold text-slate-700">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-black text-blue-600 tracking-tighter">{days}</span>
      <span className="text-[10px] text-slate-400 font-bold uppercase">Days</span>
    </div>
  </div>
);

const RecupItem: React.FC<{ label: string, value: string, bold?: boolean, color?: string }> = ({ label, value, bold, color }) => (
  <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-lg transition-colors border-b border-slate-50">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    <span className={`text-xs font-black ${color} ${bold ? 'text-blue-600' : ''}`}>{value}</span>
  </div>
);

const RecupMetric: React.FC<{ label: string, value: string, sub: string }> = ({ label, value, sub }) => (
  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
     <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{label}</p>
     <p className="text-lg font-black text-slate-800 leading-none">{value}</p>
     <p className="text-[10px] text-slate-400 mt-2 italic font-medium"># {sub}</p>
  </div>
);

export default HolidayRulesPage;
