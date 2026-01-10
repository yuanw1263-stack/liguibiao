
export enum Page {
  ANALYSIS = 'analysis',
  TASKS = 'tasks',
  RESULTS = 'results',
  STRATEGY = 'strategy'
}

export type TaskType = '年度计划' | '季度计划' | '月度计划' | '春运加班' | '暑运加班';
export type TaskStatus = '飞行部分析中' | '其他部门确认中' | '提交公司审批' | '已生效' | '计算中';

export interface Rule {
  id: string;
  name: string;
  description: string;
  limit: string;
  isStrong: boolean;
  isActive: boolean;
  category: 'duty' | 'continuity';
}

export interface OptimizationWeight {
  id: string;
  name: string;
  direction: 'less' | 'more' | 'stable';
  weight: number;
  description: string;
}

export interface ManpowerRecord {
  month: string;
  days: number;
  captains: number;
  fo: number;
  avgFlightHours: number;
  trainingAttrition: number;
  officialBusiness: number;
  leaveAttrition: number;
  totalAvailableHours: number;
  requiredHours: number;
  marginHours: number;
}

export interface Strategy {
  id: string;
  name: string;
  type: '年度' | '季度' | '月度' | '临时';
  lastModified: string;
  isDefault: boolean;
}
