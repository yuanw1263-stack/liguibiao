
import React, { useState, useRef, useEffect } from 'react';
import { TaskType, TaskStatus } from '../types';

interface TaskProps {
  onNavigateToResults: () => void;
}

const TasksPage: React.FC<TaskProps> = ({ onNavigateToResults }) => {
  const [showModal, setShowModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [importMode, setImportMode] = useState<'excel' | 'system'>('excel');
  const [activeTab, setActiveTab] = useState<'yearly' | 'seasonal' | 'special'>('yearly');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 年度计划数据
  const yearlyTasks = [
    { id: "T26001-V3", name: "2026年标准版本1", type: "年度计划", strategy: "标准年度策略", sufficiency: "裕度120h, 人员完全满足", plannedHours: "5872", status: "已生效" as TaskStatus },
    { id: "T26001-V2", name: "2026年标准版本2", type: "年度计划", strategy: "平衡模式策略", sufficiency: "裕度15h, 缺少高级机长1人", plannedHours: "5920", status: "其他部门确认中" as TaskStatus },
    { id: "T26001-V1", name: "2026年高标准版本1", type: "年度计划", strategy: "初始紧缩策略", sufficiency: "裕度-50h, 缺口较大", plannedHours: "6015", status: "飞行部分析中" as TaskStatus },
  ];

  // 航季计划数据
  const seasonalTasks = [
    { id: "T26001-S1", name: "2026年度夏秋最终稿", type: "航季计划", strategy: "标准年度策略", sufficiency: "裕度120h, 人员完全满足", plannedHours: "5872", status: "已生效" as TaskStatus },
    { id: "T26001-S2", name: "2026年度夏秋方案-次轮测算", type: "航季计划", strategy: "平衡模式策略", sufficiency: "裕度15h, 缺少高级机长1人", plannedHours: "5920", status: "其他部门确认中" as TaskStatus },
    { id: "T26001-S3", name: "2026年度夏秋初稿", type: "航季计划", strategy: "初始紧缩策略", sufficiency: "裕度-50h, 缺口较大", plannedHours: "6015", status: "飞行部分析中" as TaskStatus },
  ];

  // 专项评估数据 (季中调整)
  const specialTasks = [
    { id: "T26005", name: "2026春运保障压力测试", type: "春运加班", strategy: "极端天气预备", sufficiency: "裕度210h, 缺少副驾驶3人", plannedHours: "4250", status: "提交公司审批" as TaskStatus },
    { id: "T26006", name: "暑运新增航线机组匹配", type: "暑运加班", strategy: "效率优先策略", sufficiency: "裕度90h, 缺高级机长5人", plannedHours: "3890", status: "飞行部分析中" as TaskStatus },
  ];

  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'yearly': return yearlyTasks;
      case 'seasonal': return seasonalTasks;
      case 'special': return specialTasks;
      default: return [];
    }
  };

  const tasksToDisplay = getFilteredTasks();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-8">
          <h2 className="text-xl font-bold text-slate-800 border-r pr-8 border-slate-200">评估列表</h2>
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab('yearly')}
                className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'yearly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
             >
               <i className="fa-regular fa-calendar-check text-xs"></i> 年度计划
             </button>
             <button 
                onClick={() => setActiveTab('seasonal')}
                className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'seasonal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
             >
               <i className="fa-solid fa-layer-group text-xs"></i> 航季计划
             </button>
             <button 
                onClick={() => setActiveTab('special')}
                className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'special' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
             >
               <i className="fa-regular fa-file-lines text-xs"></i> 季中调整
             </button>
          </div>
        </div>
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 border rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isFilterOpen ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-filter"></i> 筛选
          </button>
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">名称查询</label>
                  <div className="relative">
                    <i className="fa-solid fa-search absolute left-3 top-2.5 text-slate-300 text-xs"></i>
                    <input type="text" placeholder="输入版本名称..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">创建范围</label>
                  <div className="flex gap-2">
                    <input type="date" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] outline-none" defaultValue="2026-01-01" />
                    <input type="date" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] outline-none" defaultValue="2026-12-31" />
                  </div>
                </div>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                >确认筛选</button>
              </div>
            </div>
          )}
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95"
          >
            <i className="fa-solid fa-plus text-xs"></i> 公司计划评估创建
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">任务信息</th>
              <th className="px-6 py-4">任务类型</th>
              <th className="px-6 py-4">测算策略</th>
              <th className="px-6 py-4">人员满足情况</th>
              <th className="px-6 py-4">计划总小时</th>
              <th className="px-6 py-4">当前状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasksToDisplay.map(task => (
              <TaskRow 
                key={task.id}
                id={task.id} name={task.name} type={task.type as TaskType} strategy={task.strategy} 
                sufficiency={task.sufficiency} plannedHours={task.plannedHours} status={task.status as TaskStatus} onView={onNavigateToResults}
              />
            ))}
          </tbody>
        </table>
        {tasksToDisplay.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <i className="fa-regular fa-folder-open text-4xl mb-4 opacity-20"></i>
            <p className="text-sm font-bold">暂无该类别下的评估任务</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">发起新测算任务</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">导入航班计划方式</label>
                  <div className="flex gap-4 mb-4">
                    <button 
                      onClick={() => setImportMode('excel')}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-sm ${importMode === 'excel' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                    >
                      <i className="fa-solid fa-file-excel"></i> 导入 Excel
                    </button>
                    <button 
                      onClick={() => setImportMode('system')}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-sm ${importMode === 'system' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                    >
                      <i className="fa-solid fa-server"></i> 选择系统航班
                    </button>
                  </div>
                  
                  {importMode === 'excel' ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer">
                      <i className="fa-solid fa-file-arrow-up text-3xl text-emerald-500 mb-2"></i>
                      <p className="text-xs font-bold text-slate-600">点击上传或拖拽 Excel 文件</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">支持航网导出的标准航班明细数据</p>
                    </div>
                  ) : (
                    <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
                       <p className="text-xs font-bold text-slate-600 mb-2"><i className="fa-solid fa-calendar-days text-blue-400 mr-2"></i>请选择系统航班时间范围</p>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">生效起始日期</label>
                           <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white outline-none text-sm focus:ring-2 focus:ring-blue-500" />
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">生效结束日期</label>
                           <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white outline-none text-sm focus:ring-2 focus:ring-blue-500" />
                         </div>
                       </div>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">选择组环策略</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none text-sm font-bold cursor-pointer focus:ring-2 focus:ring-blue-500">
                    <option>2026年度基准策略 (默认)</option>
                    <option>夏秋航季核心策略</option>
                    <option>公司加严安全策略</option>
                    <option>平衡效率测算策略</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">评估任务名称</label>
                  <input type="text" placeholder="例: 2026年度计划最终评估" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">任务版本号</label>
                  <input type="text" defaultValue="V1.0" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" />
                </div>
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors">取消</button>
              <button onClick={() => { setShowModal(false); onNavigateToResults(); }} className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-black shadow-lg hover:bg-blue-700 transition-all">确认并开始测算</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskRow: React.FC<{ id: string, name: string, type: TaskType, strategy: string, sufficiency: string, plannedHours: string, status: TaskStatus, onView: () => void }> = ({ id, name, type, strategy, sufficiency, plannedHours, status, onView }) => (
  <tr className="group hover:bg-slate-50 transition-colors">
    <td className="px-6 py-5">
      <div className="font-black text-slate-800 tracking-tight">{name}</div>
      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">版本: {id}</div>
    </td>
    <td className="px-6 py-5">
      <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-tighter">{type}</span>
    </td>
    <td className="px-6 py-5">
      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-black border border-blue-100 uppercase tracking-tighter">{strategy}</span>
    </td>
    <td className="px-6 py-5">
      <div className={`text-xs font-black ${sufficiency.includes('缺少') || sufficiency.includes('缺口') ? 'text-rose-600' : 'text-emerald-600'}`}>
        {sufficiency}
      </div>
    </td>
    <td className="px-6 py-5 font-black text-slate-700">
      <span className="text-blue-600 text-lg">{plannedHours}</span>
      <span className="text-[10px] text-slate-400 ml-1 uppercase font-bold text-blue-600">H</span>
    </td>
    <td className="px-6 py-5">
      <StatusBadge status={status} />
    </td>
    <td className="px-6 py-5 text-right">
      <button 
        onClick={onView}
        className="text-blue-600 text-sm font-black hover:underline transition-opacity flex items-center gap-1 justify-end w-full"
      >
        查看明细 <i className="fa-solid fa-angle-right text-[10px]"></i>
      </button>
    </td>
  </tr>
);

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles: any = {
    '飞行部分析中': 'bg-blue-100 text-blue-700 border-blue-200',
    '其他部门确认中': 'bg-amber-100 text-amber-700 border-amber-200',
    '提交公司审批': 'bg-purple-100 text-purple-700 border-purple-200',
    '已生效': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    '计算中': 'bg-slate-100 text-slate-700 border-slate-200 animate-pulse'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
};

export default TasksPage;
