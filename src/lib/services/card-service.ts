"use client";

import api from "@/lib/api-config";
import type { CreditCardSummary, CreditCardDetail } from "@/lib/definitions";

export const getCards = async (): Promise<CreditCardSummary[]> => {
  const response = await api.get('/cards');
  return response.data;
};

export const getCardById = async (id: string): Promise<CreditCardDetail> => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
}

export const createCard = async (data: any): Promise<CreditCardDetail> => {
    const response = await api.post('/cards', data);
    return response.data;
}

export const updateCard = async (id: string, data: { alias: string }): Promise<CreditCardDetail> => {
    const response = await api.put(`/cards/${id}`, data);
    return response.data;
}

export const deleteCard = async (id: string): Promise<void> => {
    await api.delete(`/cards/${id}`);
}

export const blockCard = async (id: string): Promise<CreditCardDetail> => {
    const response = await api.post(`/cards/${id}/block`);
    return response.data;
}

export const activateCard = async (id: string): Promise<CreditCardDetail> => {
    const response = await api.post(`/cards/${id}/activate`);
    return response.data;
}
