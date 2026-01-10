
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const navItems = [
    { id: Page.ANALYSIS, icon: 'fa-chart-pie', label: '效能与监控' },
    { id: Page.TASKS, icon: 'fa-list-check', label: '预排班分析' },
    { id: Page.RESULTS, icon: 'fa-chart-bar', label: '预排班结果' },
    { id: Page.STRATEGY, icon: 'fa-gear', label: '策略管理' },
  ];

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
      <nav className="p-4 space-y-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2">业务流程</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activePage === item.id 
              ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 mr-3`}></i>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
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
