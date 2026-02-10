
import React, { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StrategyPage from './components/StrategyPage';
import TasksPage from './components/TasksPage';
import ResultsPage from './components/ResultsPage';
import AnalysisPage from './components/AnalysisPage';
import HolidayRulesPage from './components/HolidayRulesPage';
import CrewAvailabilityPage from './components/CrewAvailabilityPage';
import LeaveActualsPage from './components/LeaveActualsPage';
import ParentalPlanStatsPage from './components/ParentalPlanStatsPage';
import ParentalMobileEntry from './components/ParentalMobileEntry';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);

  const renderPage = () => {
    switch (currentPage) {
      case Page.STRATEGY: return <StrategyPage />;
      case Page.PILOT_PRE_SCHEDULE: return <TasksPage onNavigateToResults={() => setCurrentPage(Page.RESULTS)} />;
      case Page.RESULTS: return <ResultsPage />;
      case Page.HOLIDAY_RULES: return <HolidayRulesPage />;
      case Page.CREW_AVAILABILITY: return <CrewAvailabilityPage />;
      case Page.LEAVE_ACTUALS: return <LeaveActualsPage />;
      case Page.PARENTAL_STATS: return <ParentalPlanStatsPage />;
      case Page.PARENTAL_MOBILE: return <ParentalMobileEntry />;
      case Page.HOME: return <AnalysisPage onNavigate={setCurrentPage} />;
      default: return <AnalysisPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activePage={currentPage} />
        <main className="flex-1 overflow-auto p-6 no-scrollbar">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
