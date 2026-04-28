import { useMutation } from "@tanstack/react-query";
import { createReportApi } from "~/modules/reports/api";
import { ReportType } from "~/modules/reports/types";

export const useCreateReport = () =>
  useMutation({
    mutationFn: (type: ReportType) => createReportApi(type),
  })