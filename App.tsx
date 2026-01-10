
import React, { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StrategyPage from './components/StrategyPage';
import TasksPage from './components/TasksPage';
import ResultsPage from './components/ResultsPage';
import AnalysisPage from './components/AnalysisPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.STRATEGY);

  const renderPage = () => {
    switch (currentPage) {
      case Page.STRATEGY: return <StrategyPage />;
      case Page.TASKS: return <TasksPage onNavigateToResults={() => setCurrentPage(Page.RESULTS)} />;
      case Page.RESULTS: return <ResultsPage />;
      case Page.ANALYSIS: return <AnalysisPage />;
      default: return <StrategyPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activePage={currentPage} />
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
