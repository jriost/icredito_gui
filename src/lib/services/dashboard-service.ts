"use client";

import api from "@/lib/api-config";
import type { DashboardViewModel, KpiViewModel } from "@/lib/definitions";

export const getDashboardData = async (): Promise<DashboardViewModel> => {
  const response = await api.get("/bff/dashboard");
  return response.data;
};

export const getKpiData = async (): Promise<KpiViewModel> => {
  const response = await api.get("/bff/kpis");
  return response.data;
}
