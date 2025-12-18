
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { GroundingMetadata, DesignMode, InputType } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async redesignRoom(base64Image: string, stylePrompt: string, mode: DesignMode = 'interior', inputType: InputType = 'photo'): Promise<string | null> {
    try {
      let taskPrefix = "";
      if (inputType === 'sketch') {
        taskPrefix = `You are a master architect. Take this hand-drawn line sketch and render it into a high-fidelity, photorealistic finished product.`;
      } else {
        taskPrefix = `Reimagine this existing space. Maintain the structural boundaries but transform the materials, lighting, and elements completely.`;
      }

      const modeContext = {
        interior: "This is an interior room design.",
        exterior: "This is a full building architectural exterior design. Focus on the facade, volume, and site integration.",
        landscape: "This is a landscape and garden design. Focus on plants, water features, paving, and outdoor atmosphere."
      };

      const prompt = `${taskPrefix} ${modeContext[mode]} 
        Target Style: ${stylePrompt}. 
        Output should be a single, photorealistic 16:9 image showing the final design.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: 'image/png'
              }
            },
            {
              text: prompt
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Redesign Error:", error);
      throw error;
    }
  }

  async editDesign(base64Image: string, instruction: string): Promise<string | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: 'image/png'
              }
            },
            {
              text: `Edit this design based on this request: ${instruction}. Keep everything else consistent with the current layout.`
            }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Edit Error:", error);
      throw error;
    }
  }

  async getAdvice(message: string, history: any[]): Promise<{ text: string; links: { title: string; uri: string }[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: message,
        config: {
          systemInstruction: "你是一位精通建筑、室内与景观设计的全能大师。请根据用户的需求提供专业的、极具前瞻性的建议。如果涉及购买单品，请利用搜索工具提供链接。语言应专业且具有启发性。",
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "抱歉，我无法处理该建议。";
      const grounding = response.candidates?.[0]?.groundingMetadata as GroundingMetadata;
      const links = grounding?.groundingChunks?.filter(c => c.web).map(c => ({
        title: c.web!.title,
        uri: c.web!.uri
      })) || [];

      return { text, links };
    } catch (error) {
      console.error("Advice Error:", error);
      throw error;
    }
  }
}
