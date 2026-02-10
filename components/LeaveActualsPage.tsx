
import React, { useState } from 'react';

interface LeaveRecord {
  id: string;
  name: string;
  code: string;
  rank: string;
  base: string;
  leaveType: '年假' | '疗养假' | '育儿假' | '病假' | '协议假' | '事假';
  startDate: string;
  endDate: string;
  totalDays: number;
  status: '已批准' | '待审核' | '执行中' | '已销假';
  manpowerImpact: number; // 影响飞行工时(H)
}

const LeaveActualsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('全部');

  const MOCK_LEAVE_DATA: LeaveRecord[] = [
    { id: 'L001', name: '王小明', code: '801221', rank: 'A类机长', base: '昆明', leaveType: '年假', startDate: '2026-05-01', endDate: '2026-05-05', totalDays: 5, status: '已批准', manpowerImpact: 15.5 },
    { id: 'L002', name: '李华', code: '802344', rank: '高级机长', base: '长沙', leaveType: '疗养假', startDate: '2026-05-10', endDate: '2026-05-16', totalDays: 7, status: '执行中', manpowerImpact: 22.0 },
    { id: 'L003', name: '张强', code: '801998', rank: '教员', base: '无锡', leaveType: '协议假', startDate: '2026-05-05', endDate: '2026-05-09', totalDays: 5, status: '已批准', manpowerImpact: 18.0 },
    { id: 'L004', name: '赵雅', code: 'F30022', rank: '主任乘务长', base: '上海', leaveType: '育儿假', startDate: '2026-05-20', endDate: '2026-05-29', totalDays: 10, status: '待审核', manpowerImpact: 25.0 },
    { id: 'L005', name: '刘洋', code: '805566', rank: '副驾驶', base: '昆明', leaveType: '病假', startDate: '2026-05-02', endDate: '2026-05-15', totalDays: 14, status: '已批准', manpowerImpact: 45.0 },
  ];

  const filteredData = MOCK_LEAVE_DATA.filter(item => 
    (selectedType === '全部' || item.leaveType === selectedType) &&
    (item.name.includes(searchQuery) || item.code.includes(searchQuery))
  );

  const leaveTypes = ['全部', '年假', '疗养假', '育儿假', '病假', '协议假', '事假'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* 统计看板 */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">今日休假人数</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">12</span>
            <span className="text-xs font-bold text-slate-400">人</span>
          </div>
          <p className="text-[10px] text-emerald-500 font-bold mt-2 italic"># 占总实力的 4.2%</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">本月实力损耗</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">358.5</span>
            <span className="text-xs font-bold text-slate-400">H</span>
          </div>
          <p className="text-[10px] text-blue-400 font-bold mt-2 italic"># 相当于 4.5 个机长的月产出</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">待审核申请</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-500">5</span>
            <span className="text-xs font-bold text-slate-400">笔</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-2 italic"># 需排班部尽快联动审核</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-[32px] shadow-xl text-white">
          <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-2">预排班联动状态</p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-black">已同步至计算引擎</span>
          </div>
          <p className="text-[10px] opacity-40 mt-3 leading-relaxed">下次同步时间: 14:00 (每2小时自动同步)</p>
        </div>
      </div>

      {/* 筛选与搜索 */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center flex-1 gap-4 max-w-2xl">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
            <input 
              type="text" 
              placeholder="搜索姓名或工号..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 h-11 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="flex gap-2">
            {leaveTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 h-11 rounded-2xl text-xs font-black transition-all border ${
                  selectedType === type 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <button className="h-11 px-6 border border-slate-200 bg-white text-slate-600 rounded-2xl text-xs font-black hover:bg-slate-50 flex items-center gap-2 transition-all">
          <i className="fa-solid fa-file-export"></i> 导出损耗报告
        </button>
      </div>

      {/* 数据列表 */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">姓名 (工号)</th>
              <th className="px-6 py-5">职级 / 基地</th>
              <th className="px-6 py-5">假期类型</th>
              <th className="px-6 py-5">开始时间</th>
              <th className="px-6 py-5">结束时间</th>
              <th className="px-6 py-5 text-center">合计天数</th>
              <th className="px-6 py-5">审批状态</th>
              <th className="px-6 py-5 text-center bg-blue-50/30 text-blue-600">实力损耗 (H)</th>
              <th className="px-8 py-5 text-right">详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((record) => (
              <tr key={record.id} className="group hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black border border-slate-200">
                      {record.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-slate-800 text-sm tracking-tight">{record.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold tracking-tighter">#{record.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="text-xs font-bold text-slate-600">{record.rank}</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase mt-0.5">{record.base}</div>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border ${
                    record.leaveType === '病假' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                    record.leaveType === '年假' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                    'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    {record.leaveType}
                  </span>
                </td>
                <td className="px-6 py-6 text-xs font-bold text-slate-500">
                  {record.startDate}
                </td>
                <td className="px-6 py-6 text-xs font-bold text-slate-500">
                  {record.endDate}
                </td>
                <td className="px-6 py-6 text-center font-black text-slate-700 text-sm">
                  {record.totalDays}
                </td>
                <td className="px-6 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                    record.status === '已批准' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    record.status === '执行中' ? 'bg-blue-50 border-blue-100 text-blue-600 animate-pulse' :
                    record.status === '待审核' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                    'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    {record.status}
                  </div>
                </td>
                <td className="px-6 py-6 text-center bg-blue-50/10">
                  <span className="text-sm font-black text-blue-600">-{record.manpowerImpact}h</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <button className="text-slate-300 hover:text-slate-600 transition-colors">
                     <i className="fa-solid fa-circle-info text-lg"></i>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="py-24 text-center">
            <i className="fa-solid fa-calendar-xmark text-4xl text-slate-200 mb-4"></i>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">暂无相关假期执行记录</p>
          </div>
        )}
      </div>

      {/* 预排班联动提醒 */}
      <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-600/20 text-white flex items-center justify-between overflow-hidden relative">
        <i className="fa-solid fa-plane absolute -right-10 -top-10 text-[180px] opacity-10 rotate-12"></i>
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
             <i className="fa-solid fa-shuffle text-3xl"></i>
           </div>
           <div>
             <h4 className="text-xl font-black italic uppercase tracking-tight">Manpower Sync Engine</h4>
             <p className="text-sm opacity-80 mt-1 max-w-xl leading-relaxed font-medium">
               当前页面的所有假期实际执行数据，将作为“实力损耗”因子自动扣除在对应月份的可用总时长中。
               排班引擎在生成 Pairing (机组环) 时会避开这些受限时段。
             </p>
           </div>
        </div>
        <button className="relative z-10 px-8 py-4 bg-white text-blue-600 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all shadow-xl active:scale-95">
          立即手动同步实力
        </button>
      </div>
    </div>
  );
};

export default LeaveActualsPage;
