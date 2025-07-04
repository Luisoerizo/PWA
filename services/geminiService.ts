
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const identifyProductFromImage = async (base64Image: string, products: Product[]): Promise<string | null> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const model = "gemini-2.5-flash-preview-04-17";

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const productListText = JSON.stringify(
    products.map(p => ({ sku: p.sku, name: p.name, description: p.description }))
  );

  const textPart = {
    text: `You are an expert retail assistant for a clothing boutique. Your task is to identify a product from an image.
From the following JSON list of available products, find the single best match for the item in the image.
Respond with a JSON object containing the 'sku' of the best-matching product, for example: {"sku": "SKU123"}.
Do not add any other text, explanation, or markdown formatting like \`\`\`json.

Product List:
${productListText}
`
  };
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
       config: {
         responseMimeType: "application/json",
       },
    });

    const jsonStr = response.text.trim();
    
    // The Gemini API with responseMimeType might still wrap in markdown
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    const finalJsonStr = (match && match[2]) ? match[2].trim() : jsonStr;

    const parsedData = JSON.parse(finalJsonStr);
    
    if (parsedData && parsedData.sku) {
      return parsedData.sku;
    }
    
    return null;
  } catch (error) {
    console.error("Error identifying product with Gemini:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};
