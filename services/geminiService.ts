
import { GoogleGenAI, Type } from "@google/genai";
import { Reflection, Postcard } from "../types";

/**
 * Generates a creative postcard based on a reflection and its vibe.
 * Uses gemini-3-flash-preview to determine a destination and message,
 * and gemini-2.5-flash-image to generate a matching visual.
 */
export async function generatePostcard(reflection: Reflection): Promise<Postcard> {
  // Always initialize with API_KEY from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Generate text metadata (Destination and Poetic Message)
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this reflection: "${reflection.text}" and its vibe "${reflection.vibe}", 
    imagine a travel destination (real or fictional) and write a postcard message. 
    The destination should be concise. The message should be a short, poetic extension of the user's thought.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          message: { type: Type.STRING },
        },
        required: ["destination", "message"],
      }
    }
  });

  const textData = JSON.parse(textResponse.text || '{}');
  const destination = textData.destination || "A Quiet Place";
  const message = textData.message || reflection.text;

  // 2. Generate the postcard image
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A beautiful, atmospheric landscape photo of ${destination}. Aesthetic: ${reflection.vibe}, minimalist, cinematic lighting, high quality.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = '';
  // Iterate through parts to find the generated image data
  if (imageResponse.candidates?.[0]?.content?.parts) {
    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  // Fallback image in case of generation failure
  if (!imageUrl) {
    imageUrl = 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000';
  }

  return {
    imageUrl,
    destination,
    message
  };
}
