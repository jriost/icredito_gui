
"use client";

import api from "@/lib/api-config";
import type { User } from "@/lib/definitions";

export async function getProfile(): Promise<User> {
  const response = await api.get('/auth/profile');
  return response.data;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await api.put('/auth/profile', data);
  return response.data;
}
