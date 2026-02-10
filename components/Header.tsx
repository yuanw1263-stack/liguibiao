
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  activePage: Page;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const getPageTitle = (page: Page) => {
    switch (page) {
      case Page.STRATEGY: return '人力分析策略';
      case Page.PILOT_PRE_SCHEDULE: return '飞行员人力分析';
      case Page.RESULTS: return '飞行员人力分析结果';
      case Page.HOME: return '仪表盘与监控';
      case Page.HOLIDAY_RULES: return '假期计算规则配置';
      case Page.CREW_AVAILABILITY: return '飞行实力特殊配置';
      case Page.LEAVE_ACTUALS: return '假期实际执行明细';
      case Page.PARENTAL_STATS: return '育儿及生育计划统计';
      case Page.PARENTAL_MOBILE: return '机组端育儿申报模拟';
      default: return '首页';
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
