'use server';

import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const WeatherInputSchema = z.object({
  location: z.string(),
});

const WeatherOutputSchema = z.object({
  temperature: z.number(),
  condition: z.string(),
});

export async function getWeather(
  input: z.infer<typeof WeatherInputSchema>
) {
  const { location } = WeatherInputSchema.parse(input);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "Eres un servicio meteorológico.",
      },
      {
        role: "user",
        content: `
Devuelve el clima actual estimado para ${location}.
Responde SOLO en JSON válido con este formato:
{
  "temperature": number,
  "condition": string
}
Usa grados Celsius y español neutro.
        `,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Respuesta vacía de OpenAI");
  }

  const clean = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

  const parsed = JSON.parse(clean);

  return WeatherOutputSchema.parse(parsed);
}
