
import React, { useState } from 'react';
import { TaskType, TaskStatus } from '../types';

interface TaskProps {
  onNavigateToResults: () => void;
}

const TasksPage: React.FC<TaskProps> = ({ onNavigateToResults }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">预排班测算分析</h2>
          <p className="text-sm text-slate-500 mt-1">年度多版本迭代，优选满足多部门保障要求的方案</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> 发起新测算任务
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
            <TaskRow 
              id="T26001-V3" name="2026年度夏秋最终稿" type="年度计划" strategy="标准年度策略" 
              sufficiency="裕度120h, 人员完全满足" plannedHours="5872" status="已生效" onView={onNavigateToResults}
            />
            <TaskRow 
              id="T26001-V2" name="2026年度夏秋方案-次轮测算" type="年度计划" strategy="平衡模式策略" 
              sufficiency="裕度15h, 缺少高级机长1人" plannedHours="5920" status="其他部门确认中" onView={onNavigateToResults}
            />
            <TaskRow 
              id="T26001-V1" name="2026年度夏秋初稿" type="年度计划" strategy="初始紧缩策略" 
              sufficiency="裕度-50h, 缺口较大" plannedHours="6015" status="飞行部分析中" onView={onNavigateToResults}
            />
            <TaskRow 
              id="T26005" name="2026春运保障压力测试" type="春运加班" strategy="极端天气预备" 
              sufficiency="裕度210h, 缺少副驾驶3人" plannedHours="4250" status="提交公司审批" onView={onNavigateToResults}
            />
            <TaskRow 
              id="T26006" name="暑运新增航线机组匹配" type="暑运加班" strategy="效率优先策略" 
              sufficiency="裕度90h, 缺高级机长5人" plannedHours="3890" status="飞行部分析中" onView={onNavigateToResults}
            />
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">发起新测算任务</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">导入航班计划</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer">
                    <i className="fa-solid fa-file-excel text-3xl text-emerald-500 mb-2"></i>
                    <p className="text-xs font-bold text-slate-600">点击上传或拖拽 Excel 文件</p>
                    <p className="text-[10px] text-slate-400 mt-1">支持由航网编排系统导出的航班明细</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">任务名称</label>
                  <input type="text" placeholder="输入测算任务描述..." className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">任务类型</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none text-sm">
                    <option>年度计划</option>
                    <option>季度计划</option>
                    <option>月度计划</option>
                    <option>春运加班</option>
                    <option>暑运加班</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">选用策略</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none text-sm">
                    <option>2026年度基准策略</option>
                    <option>春运高峰加严策略</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">时间范围</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none text-sm" />
                </div>
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white">取消</button>
              <button onClick={() => { setShowModal(false); onNavigateToResults(); }} className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700">开始测算</button>
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
      <div className="font-bold text-slate-800">{name}</div>
      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">版本: {id}</div>
    </td>
    <td className="px-6 py-5">
      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{type}</span>
    </td>
    <td className="px-6 py-5">
      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium border border-blue-100">{strategy}</span>
    </td>
    <td className="px-6 py-5">
      <div className={`text-xs font-bold ${sufficiency.includes('缺少') || sufficiency.includes('缺口') ? 'text-rose-600' : 'text-emerald-600'}`}>
        {sufficiency}
      </div>
    </td>
    <td className="px-6 py-5 font-bold text-slate-700">
      <span className="text-blue-600">{plannedHours}</span>
      <span className="text-[10px] text-slate-400 ml-1">h</span>
    </td>
    <td className="px-6 py-5">
      <StatusBadge status={status} />
    </td>
    <td className="px-6 py-5 text-right">
      <button 
        onClick={onView}
        className="text-blue-600 text-sm font-bold hover:underline transition-opacity"
      >
        查看明细
      </button>
    </td>
  </tr>
);

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles = {
    '飞行部分析中': 'bg-blue-100 text-blue-700 border-blue-200',
    '其他部门确认中': 'bg-amber-100 text-amber-700 border-amber-200',
    '提交公司审批': 'bg-purple-100 text-purple-700 border-purple-200',
    '已生效': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    '计算中': 'bg-slate-100 text-slate-700 border-slate-200 animate-pulse'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default TasksPage;
