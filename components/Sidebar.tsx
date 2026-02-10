
import React, { useState } from 'react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const [isPreScheduleOpen, setIsPreScheduleOpen] = useState(true);
  const [isPersonnelOpen, setIsPersonnelOpen] = useState(true);
  const [isLeaveOpen, setIsLeaveOpen] = useState(true);

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col flex-shrink-0 z-20">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="bg-blue-600 text-white p-2 rounded-lg mr-3 shadow-lg">
          <i className="fa-solid fa-plane-up"></i>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">机组排班系统</h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">AeroCrew Scheduler</p>
        </div>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto flex-1 no-scrollbar">
        {/* Section 1: 核心业务 */}
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-2">核心业务流程</div>
        
        <button
          onClick={() => onPageChange(Page.HOME)}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-all mb-1 ${
            activePage === Page.HOME 
            ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
            : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-chart-pie w-5 mr-3"></i>
          <span className="font-medium text-sm">首页监控</span>
        </button>

        <div>
          <button
            onClick={() => {
              setIsPreScheduleOpen(!isPreScheduleOpen);
              onPageChange(Page.PILOT_PRE_SCHEDULE);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activePage === Page.PILOT_PRE_SCHEDULE || activePage === Page.RESULTS
              ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-list-check w-5 mr-3"></i>
            <span className="font-medium text-sm flex-1 text-left">飞行员人力分析</span>
            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isPreScheduleOpen ? '' : '-rotate-90'}`}></i>
          </button>
          
          {isPreScheduleOpen && (
            <div className="ml-9 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
              <button
                onClick={() => onPageChange(Page.RESULTS)}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-all text-sm ${
                  activePage === Page.RESULTS 
                  ? 'text-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-white'
                }`}
              >
                飞行员人力分析结果
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => onPageChange(Page.STRATEGY)}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-all mt-1 mb-6 ${
            activePage === Page.STRATEGY 
            ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
            : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-gear w-5 mr-3"></i>
          <span className="font-medium text-sm">人力分析策略</span>
        </button>

        {/* 一级菜单：人员管理 */}
        <div className="pt-2">
          <button
            onClick={() => setIsPersonnelOpen(!isPersonnelOpen)}
            className="w-full flex items-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1 group"
          >
            <span className="flex-1 text-left">人员管理</span>
            <i className={`fa-solid fa-chevron-down transition-transform ${isPersonnelOpen ? '' : '-rotate-90'}`}></i>
          </button>
          
          {isPersonnelOpen && (
            <div className="space-y-1 animate-in slide-in-from-top-1 duration-200">
              <button
                onClick={() => onPageChange(Page.CREW_AVAILABILITY)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activePage === Page.CREW_AVAILABILITY 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-user-gear w-5 mr-3"></i>
                <span className="font-medium text-sm">飞行实力特殊配置</span>
              </button>
            </div>
          )}
        </div>

        {/* 一级菜单：假期管理 */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={() => setIsLeaveOpen(!isLeaveOpen)}
            className="w-full flex items-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1 group"
          >
            <span className="flex-1 text-left">假期管理</span>
            <i className={`fa-solid fa-chevron-down transition-transform ${isLeaveOpen ? '' : '-rotate-90'}`}></i>
          </button>

          {isLeaveOpen && (
            <div className="space-y-1 animate-in slide-in-from-top-1 duration-200">
              <button
                onClick={() => onPageChange(Page.PARENTAL_STATS)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activePage === Page.PARENTAL_STATS 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-baby-carriage w-5 mr-3"></i>
                <span className="font-medium text-sm">育儿计划统计</span>
              </button>
              
              <button
                onClick={() => onPageChange(Page.PARENTAL_MOBILE)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activePage === Page.PARENTAL_MOBILE 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-mobile-screen-button w-5 mr-3"></i>
                <span className="font-medium text-sm">机组申报端</span>
              </button>

              <button
                onClick={() => onPageChange(Page.HOLIDAY_RULES)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activePage === Page.HOLIDAY_RULES 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-screwdriver-wrench w-5 mr-3"></i>
                <span className="font-medium text-sm">假期起算规则配置</span>
              </button>

              <button
                onClick={() => onPageChange(Page.LEAVE_ACTUALS)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activePage === Page.LEAVE_ACTUALS 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-calendar-check w-5 mr-3"></i>
                <span className="font-medium text-sm">假期实际执行明细</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Footer Status */}
      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">测算引擎已就绪</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
