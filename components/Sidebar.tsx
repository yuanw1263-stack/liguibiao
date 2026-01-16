
import React, { useState } from 'react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const [isPreScheduleOpen, setIsPreScheduleOpen] = useState(true);

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col flex-shrink-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="bg-blue-600 text-white p-2 rounded-lg mr-3 shadow-lg">
          <i className="fa-solid fa-plane-up"></i>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">机组排班系统</h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">AeroCrew Scheduler</p>
        </div>
      </div>
      <nav className="p-4 space-y-1 overflow-y-auto flex-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2">业务流程</div>
        
        {/* 首页 */}
        <button
          onClick={() => onPageChange(Page.HOME)}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-all mb-1 ${
            activePage === Page.HOME 
            ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
            : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-chart-pie w-5 mr-3"></i>
          <span className="font-medium text-sm">首页</span>
        </button>

        {/* 飞行员预排班 (Parent) */}
        <div>
          <button
            onClick={() => {
              setIsPreScheduleOpen(!isPreScheduleOpen);
              onPageChange(Page.PILOT_PRE_SCHEDULE);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activePage === Page.PILOT_PRE_SCHEDULE 
              ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-list-check w-5 mr-3"></i>
            <span className="font-medium text-sm flex-1 text-left">飞行员预排班</span>
            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isPreScheduleOpen ? '' : '-rotate-90'}`}></i>
          </button>
          
          {isPreScheduleOpen && (
            <div className="ml-9 mt-1 space-y-1">
              <button
                onClick={() => onPageChange(Page.RESULTS)}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-all text-sm ${
                  activePage === Page.RESULTS 
                  ? 'text-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-white'
                }`}
              >
                预排班结果
              </button>
            </div>
          )}
        </div>

        {/* 策略管理 */}
        <button
          onClick={() => onPageChange(Page.STRATEGY)}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-all mt-1 ${
            activePage === Page.STRATEGY 
            ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
            : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-gear w-5 mr-3"></i>
          <span className="font-medium text-sm">策略管理</span>
        </button>
      </nav>
      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase">系统状态</p>
          <div className="flex items-center mt-2 gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-300">引擎运行中</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
