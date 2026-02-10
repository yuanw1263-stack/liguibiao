
import React, { useState } from 'react';

type CrewRole = 'pilot' | 'safety' | 'cabin';

interface CrewMemberConfig {
  id: string;
  name: string;
  code: string;
  originalRank: string; // 原始职级
  mappingRank: string; // 映射职级
  isParticipating: boolean; // 是否参与运行
  groundDays: number; // 地面办公天数
  monthlyLimit: number; // 月飞限制
  yearlyLimit: number; // 年飞限制
  specialTags: string[]; // 标签
  notes: string; // 特殊标记/备注
  base: string;
  position?: string; // 岗位
  modifiedBy: string; // 修改人
  modifiedTime: string; // 修改时间
}

const CrewAvailabilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CrewRole>('pilot');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingMember, setEditingMember] = useState<CrewMemberConfig | null>(null);

  // 模拟全场景业务数据
  const [crewList, setCrewList] = useState<CrewMemberConfig[]>([
    { id: '1', name: '王大伟', code: '800122', originalRank: 'A教员', mappingRank: 'A教员', isParticipating: true, groundDays: 22, monthlyLimit: 30, yearlyLimit: 400, specialTags: ['管理干部'], notes: '飞行部总经理，地面办公较多', base: '昆明', position: '飞行员', modifiedBy: '管理员01', modifiedTime: '2025-10-25 14:20' },
    { id: '2', name: '李四', code: '800543', originalRank: '高级机长', mappingRank: '普通机长', isParticipating: true, groundDays: 0, monthlyLimit: 90, yearlyLimit: 900, specialTags: ['降级使用'], notes: '因近期飞行时间过长，申请降级降压', base: '长沙', position: '飞行员', modifiedBy: '王二小', modifiedTime: '2025-10-24 09:15' },
    { id: '3', name: '张旭', code: '800211', originalRank: 'B类机长', mappingRank: 'B类机长', isParticipating: true, groundDays: 12, monthlyLimit: 45, yearlyLimit: 600, specialTags: ['高龄限制'], notes: '55岁以上人员限制飞行强度', base: '无锡', position: '飞行员', modifiedBy: '系统自动', modifiedTime: '2025-10-23 18:30' },
    { id: '4', name: '赵六', code: '800987', originalRank: '机长', mappingRank: '机长', isParticipating: false, groundDays: 0, monthlyLimit: 0, yearlyLimit: 0, specialTags: ['长期病假'], notes: '医疗期，不参与本轮排班', base: '昆明', position: '飞行员', modifiedBy: '王二小', modifiedTime: '2025-10-22 11:05' },
    { id: '5', name: '刘能', code: '800777', originalRank: '机长', mappingRank: '副驾驶', isParticipating: true, groundDays: 0, monthlyLimit: 80, yearlyLimit: 850, specialTags: ['熟练度受限'], notes: '长期未飞，降级带飞中', base: '南京', position: '飞行员', modifiedBy: '管理员02', modifiedTime: '2025-10-21 16:45' },
  ]);

  const filteredData = crewList.filter(m => 
    m.name.includes(searchQuery) || m.code.includes(searchQuery) || m.originalRank.includes(searchQuery)
  );

  const handleOpenModal = (mode: 'add' | 'edit', member?: CrewMemberConfig) => {
    setModalMode(mode);
    setEditingMember(member || null);
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert('保存成功！实力配置已同步至排班计算引擎。');
  };

  const handleDeleteMember = (member: CrewMemberConfig) => {
    if (window.confirm(`确定要删除 ${member.name} (${member.code}) 的特殊实力配置吗？此操作不可撤销。`)) {
      setCrewList(prev => prev.filter(m => m.id !== member.id));
    }
  };

  const handleViewLogs = () => {
    alert('正在加载配置变更日志...');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">Crew Capability Configuration</h2>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase">实力配置中心</span>
          </div>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            针对管理职务、身体受限、降级使用等场景的 <span className="text-slate-900 font-bold border-b-2 border-blue-500/30">实力预处理表格</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal('add')}
            className="h-11 px-6 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-user-plus"></i> 添加人员配置
          </button>
          <button 
            onClick={handleViewLogs}
            className="h-11 px-6 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-clock-rotate-left"></i> 日志
          </button>
        </div>
      </div>

      {/* 角色切换与快速搜索 */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {['pilot', 'safety', 'cabin'].map(role => (
            <button
              key={role}
              onClick={() => setActiveTab(role as CrewRole)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === role ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {role === 'pilot' ? '飞行员' : role === 'safety' ? '安全员' : '乘务员'}
            </button>
          ))}
        </div>
        <div className="relative w-72">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
          <input 
            type="text" 
            placeholder="搜索姓名、工号或职级..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 h-10 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* 列表呈现 */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5">姓名 (职级)</th>
                <th className="px-6 py-5">标签</th>
                <th className="px-6 py-5">是否参与运行</th>
                <th className="px-6 py-5">映射职级</th>
                <th className="px-6 py-5 text-center">月地面天数</th>
                <th className="px-6 py-5 text-center">月飞限制 (H)</th>
                <th className="px-6 py-5 text-center">年飞限制 (H)</th>
                <th className="px-6 py-5">修改信息</th>
                <th className="px-6 py-5">特殊标记</th>
                <th className="px-6 py-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((member) => (
                <tr key={member.id} className={`group hover:bg-blue-50/30 transition-all ${!member.isParticipating ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black border border-slate-200">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm whitespace-nowrap">{member.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold">({member.originalRank})</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {member.specialTags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black border border-slate-200 rounded uppercase tracking-tighter whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      member.isParticipating ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.isParticipating ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {member.isParticipating ? '参与运行' : '实力排除'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-black ${member.originalRank !== member.mappingRank ? 'text-orange-600 underline decoration-orange-300' : 'text-slate-600'}`}>
                      {member.mappingRank}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-black text-slate-700 text-sm">
                    {member.groundDays}
                  </td>
                  <td className="px-6 py-5 text-center font-black text-blue-600 text-sm">
                    {member.monthlyLimit}
                  </td>
                  <td className="px-6 py-5 text-center font-black text-indigo-600 text-sm">
                    {member.yearlyLimit}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{member.modifiedBy}</span>
                      <span className="text-[9px] text-slate-400 font-medium italic mt-0.5">{member.modifiedTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-[150px] truncate text-[11px] font-bold text-slate-400" title={member.notes}>
                      {member.notes}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenModal('edit', member)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2"
                      >
                        <i className="fa-solid fa-pen-to-square text-xs"></i> <span className="text-[11px] font-bold">修改</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteMember(member)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i> <span className="text-[11px] font-bold">删除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 弹窗模态框 - 新增/修改人员 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {modalMode === 'add' ? '添加特殊实力配置' : `修改配置: ${editingMember?.name}`}
                </h3>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Pre-scheduling Capability Detail</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-circle-xmark text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">岗位</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                  <option value="">请选择岗位</option>
                  <option value="pilot">飞行员</option>
                  <option value="cabin">乘务员</option>
                  <option value="safety">安全员</option>
                </select>
              </div>

              {modalMode === 'add' && (
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">检索空勤人员 (工号/姓名)</label>
                  <div className="relative">
                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                    <input type="text" placeholder="请输入工号查找人员..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">运行状态控制</label>
                <div className="flex gap-2">
                   <button type="button" className="flex-1 py-3 px-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl text-xs font-black flex items-center justify-center gap-2">
                     <i className="fa-solid fa-check"></i> 参与运行
                   </button>
                   <button type="button" className="flex-1 py-3 px-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl text-xs font-black flex items-center justify-center gap-2 opacity-50">
                     实力排除
                   </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">映射职级 (降级使用策略)</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                  <option>保持原始职级</option>
                  <option>高级机长 -> 普通机长</option>
                  <option>机长 -> 副驾驶</option>
                  <option>主任乘务长 -> 乘务长</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">特殊标签 (多个请用逗号分隔)</label>
                <input 
                  type="text" 
                  placeholder="例如: 管理干部, 长期病假, 降级使用..." 
                  defaultValue={editingMember?.specialTags.join(', ')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">月地面天数</label>
                <input type="number" defaultValue={editingMember?.groundDays || 0} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">月飞限制 (H)</label>
                  <input type="number" defaultValue={editingMember?.monthlyLimit || 90} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">年飞限制 (H)</label>
                  <input type="number" defaultValue={editingMember?.yearlyLimit || 1000} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">特殊标记与备注</label>
                <textarea 
                  rows={3}
                  defaultValue={editingMember?.notes}
                  placeholder="请输入限制原因、管理职务 或 身体受限说明..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="col-span-2 pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-sm font-black hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all"
                >
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewAvailabilityPage;
