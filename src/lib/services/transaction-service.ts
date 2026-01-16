"use client";

import api from "@/lib/api-config";
import type { PaginatedTransactions, Transaction } from "@/lib/definitions";

// The API returns 'transactions', not 'items'
export const getTransactions = async (page = 1, pageSize = 10): Promise<PaginatedTransactions> => {
  const params = { page, pageSize };
  const response = await api.get('/transactions', { params });
  return response.data;
};
