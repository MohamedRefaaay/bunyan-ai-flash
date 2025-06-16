
export type AIProvider = 'gemini';

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  provider: AIProvider;
}

export const getAIProviderConfig = (provider?: AIProvider): AIProviderConfig | null => {
  const apiKey = localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    return null;
  }

  const storedModels = localStorage.getItem("ai_models");
  const models = storedModels ? JSON.parse(storedModels) : {};
  
  const defaultModel = 'gemini-2.0-flash-exp';

  return {
    apiKey,
    model: models.gemini || defaultModel,
    provider: 'gemini'
  };
};

export const makeAIRequest = async (prompt: string, options?: {
  systemPrompt?: string;
  model?: string;
}) => {
  const config = getAIProviderConfig();
  
  if (!config) {
    throw new Error('لم يتم العثور على مفتاح Gemini API. يرجى إعداده في الإعدادات.');
  }

  const { model: configModel, apiKey } = config;
  const model = options?.model || configModel;
  const systemPrompt = options?.systemPrompt || 'أنت مساعد ذكي ومفيد. أجب باللغة العربية إلا إذا طُلب منك غير ذلك.';

  console.log(`Making AI request with Gemini model: ${model}`);

  try {
    return await makeGeminiRequest(apiKey, model, prompt, systemPrompt);
  } catch (error) {
    console.error('Error with Gemini:', error);
    throw error;
  }
};

const makeGeminiRequest = async (apiKey: string, model: string, prompt: string, systemPrompt: string) => {
  const requestBody: any = {
    contents: [{ 
      role: "user", 
      parts: [{ text: prompt }] 
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8000,
      topK: 40,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  if (systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
    if (prompt.toLowerCase().includes('json') || systemPrompt.toLowerCase().includes('json')) {
      requestBody.generationConfig.responseMimeType = "application/json";
    }
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'خطأ في Gemini API');
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    if (data.promptFeedback?.blockReason) {
      const reason = `تم حظر الطلب بواسطة Gemini بسبب: ${data.promptFeedback.blockReason}.`;
      const details = data.promptFeedback.safetyRatings?.map((r:any) => `${r.category}: ${r.probability}`).join(', ');
      throw new Error(`${reason} تفاصيل: ${details || 'لا توجد تفاصيل'}`);
    }
    throw new Error('استجابة غير صالحة من Gemini API');
  }
  
  return data.candidates[0].content.parts[0].text;
};

export const validateAPIKey = async (apiKey: string): Promise<boolean> => {
  try {
    const testPrompt = 'مرحبا';
    const systemPrompt = 'أجب بكلمة "نعم" فقط';
    await makeGeminiRequest(apiKey, 'gemini-2.0-flash-exp', testPrompt, systemPrompt);
    return true;
  } catch (error) {
    console.error('API validation failed for Gemini:', error);
    return false;
  }
};
