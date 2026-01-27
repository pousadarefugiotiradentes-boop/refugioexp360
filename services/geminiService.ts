
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Serviço de geração de voz para o personagem Joaquim.
 * Utiliza o modelo gemini-2.5-flash-preview-tts para transformar texto em áudio realista.
 */

export async function generateTTS(text: string): Promise<string | null> {
  // CRITICAL: Always create a new instance right before use to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Kore' é uma voz masculina que se adapta bem ao personagem Joaquim
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error: any) {
    console.error("Erro ao gerar áudio via Gemini API:", error);
    // Return a specific string to help the component identify quota issues
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      return "QUOTA_EXCEEDED";
    }
    return null;
  }
}
