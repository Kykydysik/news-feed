export enum ReportType {
  News = 'news',
}

export interface CreateReportParams {
  type: ReportType;
}