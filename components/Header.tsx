
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  activePage: Page;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const getPageTitle = (page: Page) => {
    switch (page) {
      case Page.STRATEGY: return '组环策略管理';
      case Page.TASKS: return '预排班测算任务';
      case Page.RESULTS: return '预排班甘特图预览';
      case Page.ANALYSIS: return '人力资源效能监控';
      default: return '仪表盘';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
      <div className="flex items-center text-sm text-slate-500">
        <span>调度中心</span>
        <i className="fa-solid fa-chevron-right text-[10px] mx-3 opacity-50"></i>
        <span className="text-slate-900 font-bold">{getPageTitle(activePage)}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700">王二小</p>
            <p className="text-[10px] text-slate-400">飞行部 · 产品经理</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
            王
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
