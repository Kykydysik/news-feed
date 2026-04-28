import { httpClient } from "~/shared/api/http";
import { type CreateReportParams, ReportType } from "~/modules/reports/types";

export const createReportApi = (type: ReportType) =>
  httpClient.post(`/reports`, { type });