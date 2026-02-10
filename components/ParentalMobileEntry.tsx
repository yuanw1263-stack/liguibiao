
import React, { useState } from 'react';

const ParentalMobileEntry: React.FC = () => {
  const [role, setRole] = useState<'male' | 'female'>('female');
  const [reportType, setReportType] = useState<'pregnancy' | 'parental'>('pregnancy');

  return (
    <div className="min-h-[900px] flex items-center justify-center bg-slate-200 py-20 relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* 手机外壳模拟 */}
      <div className="w-[375px] h-[780px] bg-white rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border-[8px] border-slate-900 relative flex flex-col z-10 overflow-hidden">
        {/* 手机顶部栏 */}
        <div className="h-8 w-full flex justify-center items-end pb-1.5">
          <div className="w-24 h-5 bg-slate-900 rounded-b-2xl absolute top-0"></div>
          <div className="flex justify-between w-full px-8 items-center pt-2">
            <span className="text-[10px] font-black">9:41</span>
            <div className="flex gap-1.5">
              <i className="fa-solid fa-signal text-[8px]"></i>
              <i className="fa-solid fa-wifi text-[8px]"></i>
              <i className="fa-solid fa-battery-full text-[8px]"></i>
            </div>
          </div>
        </div>

        {/* 模拟 App 内容 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          <header className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">育儿及休假申报</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Crew Well-being Program</p>
          </header>

          {/* 角色选择器 */}
          <div className="bg-slate-100 p-1 rounded-2xl flex mb-6">
            <button 
              onClick={() => setRole('female')}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === 'female' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              我是女士
            </button>
            <button 
              onClick={() => setRole('male')}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              我是男士
            </button>
          </div>

          <div className="space-y-6">
            {/* 申报类型 */}
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">申报阶段</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setReportType('pregnancy')}
                  className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${reportType === 'pregnancy' ? 'border-blue-600 bg-blue-50/50 text-blue-600' : 'border-slate-50 text-slate-300'}`}
                >
                  <i className={`fa-solid ${role === 'female' ? 'fa-person-pregnant' : 'fa-hand-holding-heart'} text-lg`}></i>
                  <span className="text-[10px] font-black">{role === 'female' ? '已怀孕/停飞' : '伴侣怀孕/陪产'}</span>
                </button>
                <button 
                  onClick={() => setReportType('parental')}
                  className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${reportType === 'parental' ? 'border-blue-600 bg-blue-50/50 text-blue-600' : 'border-slate-50 text-slate-300'}`}
                >
                  <i className="fa-solid fa-baby text-lg"></i>
                  <span className="text-[10px] font-black">已有宝宝/育儿假</span>
                </button>
              </div>
            </div>

            {/* 核心表单 */}
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
              {reportType === 'pregnancy' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">预产期 (或者停飞日期)</label>
                    <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className={`p-4 rounded-2xl border ${role === 'female' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                    <h4 className="text-[10px] font-black uppercase mb-1">系统预计算逻辑:</h4>
                    <p className="text-[10px] font-medium leading-relaxed">
                      {role === 'female' 
                        ? '确认申报后，系统将自动计算 9个月+158天 的停飞时段，并反馈给排班中心。' 
                        : '确认申报后，系统将为您预留 20天 的一次性陪产假期，参考年假休假方案。'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">宝宝出生日期</label>
                    <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-700">
                    <h4 className="text-[10px] font-black uppercase mb-1">育儿假权益 (10天/年):</h4>
                    <p className="text-[10px] font-medium leading-relaxed">
                      宝宝3周岁前每年可休10天，一次最少休5天。跨年比例将自动由系统精准折算。
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* 同步提示 */}
            <div className="flex items-center gap-3 px-4">
              <i className="fa-solid fa-shield-halved text-emerald-500 text-sm"></i>
              <p className="text-[10px] text-slate-400 font-medium">数据将加密传输并同步至预排班计算引擎</p>
            </div>
          </div>
        </div>

        {/* 底部提交 */}
        <div className="p-8 bg-white border-t border-slate-50 flex flex-col gap-3">
          <button className="w-full py-4 bg-slate-900 text-white rounded-[24px] text-sm font-black shadow-xl active:scale-95 transition-all">
            确认申报并同步
          </button>
          <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">Secure Sync v2.4</p>
        </div>

        {/* 底部指示条 */}
        <div className="h-6 flex justify-center items-end pb-2">
           <div className="w-28 h-1 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {/* 右侧业务逻辑备注（仅在 PC 端的模拟页面展示） */}
      <div className="ml-16 w-80 space-y-6">
        <div className="bg-slate-800 text-white p-6 rounded-[32px] shadow-2xl relative">
          <i className="fa-solid fa-lightbulb absolute -right-2 -top-2 text-yellow-400 text-2xl rotate-12"></i>
          <h3 className="text-sm font-black italic uppercase mb-4 tracking-tighter">产品经理 - 业务逻辑备注</h3>
          <ul className="space-y-4 text-xs font-medium opacity-80 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-blue-400 font-black">#1</span>
              <span>申报系统采集数据后，后台统计页面将实时对比去年 80% 阈值，决定引擎注入值。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-black">#2</span>
              <span>育儿假最后一年算法示例：出生日期 26.05.01，29年 3周岁前仅剩 4个月，休假天数 = 10 * 4/12 = 3.3天。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-black">#3</span>
              <span>方案联动：育儿假与年假一致，支持 5天/次 的 Block 申报模式。</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParentalMobileEntry;
