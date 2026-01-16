
import { Rule, OptimizationWeight, ManpowerRecord, Strategy } from './types';

export const INITIAL_RULES: Rule[] = [
  { id: '1', name: '日飞行时间限制', description: '单日累计飞行时间上限', limit: '1小时', isStrong: true, isActive: true, category: 'duty' },
  { id: '2', name: '日飞行值勤限制', description: '单日连续值勤时长上限', limit: '1小时', isStrong: true, isActive: true, category: 'duty' },
  { id: '3', name: '航班地点连续性', description: '前后航班起降地点必须衔接', limit: '全局生效', isStrong: true, isActive: true, category: 'duty' },
  { id: '4', name: '联飞天数限制', description: '连续值勤不得超过5天', limit: '空', isStrong: false, isActive: true, category: 'duty' },
  { id: '5', name: '144休48限制', description: '任意连续144小时，需要满足连续休息48小时', limit: '2小时', isStrong: true, isActive: true, category: 'duty' },
  { id: '6', name: '航班绑定', description: '特定航班必须组合执行', limit: 'A67101、A67102', isStrong: true, isActive: true, category: 'continuity' },
  { id: '7', name: '基地管理', description: '指定运行基地列表', limit: '昆明、长沙、无锡', isStrong: true, isActive: true, category: 'continuity' },
  { id: '8', name: '跨飞机过站', description: '如跨机组环，过站时间要求', limit: '2小时', isStrong: true, isActive: true, category: 'continuity' },
];

export const WEIGHTS: OptimizationWeight[] = [
  { id: 'w1', name: '总消耗人数', direction: 'less', weight: 80, description: '提高效率，减少人力碎片化' },
  { id: 'w2', name: 'C类机场消耗人数', direction: 'less', weight: 60, description: '降低高风险机场复杂度' },
  { id: 'w3', name: '过夜点数量', direction: 'less', weight: 40, description: '减少差旅成本与疲劳' },
  { id: 'w4', name: '机组值勤利用率', direction: 'more', weight: 85, description: '单位执勤期有效飞行产出' },
  { id: 'w5', name: '航班衔接紧凑度', direction: 'more', weight: 75, description: '减少过站等待无效时间' },
];

export const MANPOWER_DATA: ManpowerRecord[] = [
  { month: '1月', days: 31, captains: 76, fo: 78, avgFlightHours: 84.9, trainingAttrition: 5.4, officialBusiness: 2.4, leaveAttrition: 4.0, totalAvailableHours: 5783, requiredHours: 5273, marginHours: 510, captainAvailableHours: 3200, foAvailableHours: 2583, marketPlanHours: 5100 },
  { month: '2月', days: 28, captains: 76, fo: 78, avgFlightHours: 84.9, trainingAttrition: 5.4, officialBusiness: 2.4, leaveAttrition: 4.0, totalAvailableHours: 5783, requiredHours: 5273, marginHours: 510, captainAvailableHours: 3150, foAvailableHours: 2633, marketPlanHours: 5200 },
  { month: '3月', days: 31, captains: 76, fo: 78, avgFlightHours: 84.9, trainingAttrition: 8.2, officialBusiness: 2.4, leaveAttrition: 1.3, totalAvailableHours: 5783, requiredHours: 5273, marginHours: 510, captainAvailableHours: 3100, foAvailableHours: 2683, marketPlanHours: 5050 },
  { month: '4月', days: 30, captains: 76, fo: 78, avgFlightHours: 84.9, trainingAttrition: 7.8, officialBusiness: 2.4, leaveAttrition: 2.5, totalAvailableHours: 5783, requiredHours: 5273, marginHours: 510, captainAvailableHours: 3120, foAvailableHours: 2663, marketPlanHours: 5300 },
  { month: '5月', days: 31, captains: 76, fo: 78, avgFlightHours: 84.9, trainingAttrition: 9.2, officialBusiness: 2.4, leaveAttrition: 1.6, totalAvailableHours: 5783, requiredHours: 5273, marginHours: 510, captainAvailableHours: 3080, foAvailableHours: 2703, marketPlanHours: 5150 },
  { month: '6月', days: 30, captains: 77, fo: 78, avgFlightHours: 84.9, trainingAttrition: 5.4, officialBusiness: 0.0, leaveAttrition: 0.0, totalAvailableHours: 5783, requiredHours: 5659, marginHours: 124, captainAvailableHours: 3050, foAvailableHours: 2733, marketPlanHours: 5500 },
  { month: '7月', days: 31, captains: 77, fo: 78, avgFlightHours: 84.9, trainingAttrition: 1.6, officialBusiness: 0.0, leaveAttrition: 0.0, totalAvailableHours: 6500, requiredHours: 5266, marginHours: 1234, captainAvailableHours: 3500, foAvailableHours: 3000, marketPlanHours: 5200 },
  { month: '8月', days: 31, captains: 79, fo: 78, avgFlightHours: 84.9, trainingAttrition: 2.3, officialBusiness: 0.0, leaveAttrition: 0.0, totalAvailableHours: 5783, requiredHours: 5273, marginHours: 510, captainAvailableHours: 3200, foAvailableHours: 2583, marketPlanHours: 5100 },
  { month: '9月', days: 30, captains: 80, fo: 80, avgFlightHours: 84.0, trainingAttrition: 4.1, officialBusiness: 1.2, leaveAttrition: 2.0, totalAvailableHours: 6000, requiredHours: 5400, marginHours: 600, captainAvailableHours: 3300, foAvailableHours: 2700, marketPlanHours: 5300 },
  { month: '10月', days: 31, captains: 81, fo: 82, avgFlightHours: 82.5, trainingAttrition: 3.5, officialBusiness: 1.0, leaveAttrition: 3.1, totalAvailableHours: 6200, requiredHours: 5500, marginHours: 700, captainAvailableHours: 3400, foAvailableHours: 2800, marketPlanHours: 5400 },
  { month: '11月', days: 30, captains: 82, fo: 84, avgFlightHours: 80.0, trainingAttrition: 5.0, officialBusiness: 0.5, leaveAttrition: 4.2, totalAvailableHours: 6300, requiredHours: 5800, marginHours: 500, captainAvailableHours: 3450, foAvailableHours: 2850, marketPlanHours: 5700 },
  { month: '12月', days: 31, captains: 84, fo: 85, avgFlightHours: 85.2, trainingAttrition: 6.2, officialBusiness: 2.0, leaveAttrition: 1.5, totalAvailableHours: 6500, requiredHours: 6100, marginHours: 400, captainAvailableHours: 3550, foAvailableHours: 2950, marketPlanHours: 6000 },
];

export const STRATEGIES: Strategy[] = [
  { id: 'S001', name: '2026年度基准策略', type: '年度', lastModified: '2025-10-01', isDefault: true },
  { id: 'S002', name: '夏秋航季核心策略', type: '季度', lastModified: '2025-09-15', isDefault: false },
  { id: 'S003', name: '11月淡季运行策略', type: '月度', lastModified: '2025-10-20', isDefault: false },
  { id: 'S004', name: '春运极端天气预备', type: '临时', lastModified: '2025-10-25', isDefault: false },
];
