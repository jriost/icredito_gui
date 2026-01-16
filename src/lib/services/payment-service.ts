"use client";

import api from "@/lib/api-config";
import type { PaginatedPayments, Payment } from "@/lib/definitions";

// The API returns 'payments', not 'items'
export const getPayments = async (page = 1, pageSize = 10): Promise<PaginatedPayments> => {
  const params = { page, pageSize };
  const response = await api.get('/payments', { params });
  return response.data;
};

// Based on POST /api/payments
export const createPayment = async (data: {
    creditCardId: string;
    amount: number;
    currency: string;
    merchantName: string;
    merchantCategory: string;
    description?: string;
}): Promise<any> => { 
    const response = await api.post('/payments', data);
    return response.data;
};
