
import { GoogleGenAI } from "@google/genai";
import { BlueprintData } from "../types";
import { telemetry } from "./telemetryService";

// Use the recommended image generation model for basic tasks
const MODEL_NAME = 'gemini-2.5-flash-image';

const getBaseRepresentation = (form: string): string => {
  const f = form.toLowerCase();
  if (f.includes('app') || f.includes('mobile') || f.includes('phone')) {
    return "A high-end smartphone floating in mid-air displaying a stunning, colorful application interface";
  }
  if (f.includes('site') || f.includes('web') || f.includes('platform') || f.includes('dashboard')) {
    return "A sleek, futuristic floating desktop screen displaying a vibrant website dashboard";
  }
  if (f.includes('game') || f.includes('play')) {
    return "A portal viewing into an immersive 3D video game world with vivid colors";
  }
  if (f.includes('doc') || f.includes('pdf') || f.includes('file') || f.includes('book') || f.includes('guide')) {
    return "A glowing, magical holographic book or document floating in space, emitting knowledge";
  }
  if (f.includes('tool') || f.includes('device') || f.includes('hardware') || f.includes('robot')) {
    return "A sleek, modern physical product device with beautiful industrial design lighting";
  }
  return "An abstract, beautiful, glowing geometric representation of a brilliant idea";
};

export const generateBlueprintVisualization = async (data: BlueprintData): Promise<string | null> => {
  // Always initialize the client inside the function to ensure the freshest API_KEY from environment is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const startTime = performance.now();
  
  try {
    const baseRep = getBaseRepresentation(data.form);
    
    const prompt = `
      Create a breathtaking, cinematic, and colorful conceptual visualization of a new idea.
      
      THE OBJECT TO RENDER: ${baseRep}.
      
      DETAILS FROM THE CREATOR:
      Name: ${data.name}
      Purpose: To ${data.core_action}
      Target Audience: ${data.audience}
      Outcome: ${data.outcome}
      
      VISUAL STYLE:
      Surrounded by colorful ethereal clouds, cinematic volumetric lighting, and soft dreamlike fog. 
      Vibrant palette: Deep purples, neon cyans, warm golds, and magentas.
      Style should be "Magical Realism" mixed with "High-End Product Photography".
      No technical blueprint lines. No text overlays. 
      Make it look like a dream coming true. 8k resolution, highly detailed.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9",
        }
      }
    });

    const endTime = performance.now();
    const latency = endTime - startTime;

    let imageUrl: string | null = null;
    // Iterate through response parts to find the image part correctly, do not assume order
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
    
    if (!imageUrl) {
      throw new Error("No image data found in response parts.");
    }

    // Success Telemetry
    telemetry.trackGeminiMetric(MODEL_NAME, latency, 'success', {
      prompt_length: prompt.length,
      image_format: response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType
    });

    return imageUrl;

  } catch (error: any) {
    const endTime = performance.now();
    const latency = endTime - startTime;

    // Error Telemetry
    telemetry.trackGeminiMetric(MODEL_NAME, latency, 'error', {
      error_message: error.message,
      error_name: error.name,
      status_code: error.status || 'unknown'
    });

    console.error("Failed to generate blueprint visualization:", error);
    return null;
  }
};