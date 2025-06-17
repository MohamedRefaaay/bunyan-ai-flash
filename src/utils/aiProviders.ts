
export type AIProvider = 'gemini';

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  provider: AIProvider;
}

export interface PexelsConfig {
  apiKey: string;
  enabled: boolean;
}

export const getAIProviderConfig = (provider?: AIProvider): AIProviderConfig | null => {
  const apiKey = localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    return null;
  }

  const storedModels = localStorage.getItem("ai_models");
  const models = storedModels ? JSON.parse(storedModels) : {};
  
  const defaultModel = 'gemini-2.5-flash';

  return {
    apiKey,
    model: models.gemini || defaultModel,
    provider: 'gemini'
  };
};

export const getPexelsConfig = (): PexelsConfig | null => {
  const apiKey = localStorage.getItem('pexels_api_key');
  const enabled = localStorage.getItem('pexels_enabled') === 'true';
  
  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    enabled
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

export const generateFlashcardsFromContent = async (
  content: string, 
  sourceType: string = 'document',
  title: string = '',
  cardCount: number = 8
) => {
  const config = getAIProviderConfig();
  
  if (!config) {
    throw new Error('لم يتم العثور على مفتاح Gemini API. يرجى إعداده في الإعدادات.');
  }

  const flashcardPrompt = `بناءً على المحتوى التالي، قم بإنشاء ${cardCount} بطاقة تعليمية ذكية:

العنوان: ${title || 'محتوى تعليمي'}
نوع المصدر: ${sourceType}

المحتوى:
${content}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
[
  {
    "id": "1",
    "front": "السؤال أو المفهوم هنا", 
    "back": "الإجابة أو الشرح التفصيلي هنا",
    "difficulty": "medium",
    "category": "${sourceType}",
    "tags": ["${title}", "بنيان_AI"],
    "source": "${sourceType}",
    "signature": "📘 صنع بواسطة Bunyan_AI"
  }
]

تأكد من:
- تنويع أنواع الأسئلة (تعريفات، أمثلة، تطبيقات، مقارنات)
- تغطية المحتوى بشكل شامل ومتوازن
- استخدام لغة عربية واضحة ومفهومة
- تصنيف صعوبة البطاقات بدقة`;

  try {
    const result = await makeAIRequest(flashcardPrompt, {
      systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية التفاعلية. أجب بصيغة JSON صحيحة فقط.',
      model: config.model
    });

    const cleanJson = result.replace(/```json|```/g, '').trim();
    const flashcards = JSON.parse(cleanJson);
    
    if (!Array.isArray(flashcards)) {
      throw new Error('تنسيق غير صحيح للبطاقات');
    }

    return flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('حدث خطأ في إنشاء البطاقات التعليمية');
  }
};

export const searchPexelsImages = async (query: string, perPage: number = 20) => {
  const config = getPexelsConfig();
  
  if (!config || !config.enabled) {
    throw new Error('لم يتم تفعيل Pexels أو لم يتم العثور على مفتاح API. يرجى إعداده في الإعدادات.');
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: {
        'Authorization': config.apiKey
      }
    });

    if (!response.ok) {
      throw new Error('فشل في البحث عن الصور من Pexels');
    }

    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Error searching Pexels:', error);
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
    await makeGeminiRequest(apiKey, 'gemini-2.5-flash', testPrompt, systemPrompt);
    return true;
  } catch (error) {
    console.error('API validation failed for Gemini:', error);
    return false;
  }
};

export const validatePexelsKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.pexels.com/v1/search?query=test&per_page=1', {
      headers: {
        'Authorization': apiKey
      }
    });
    return response.ok;
  } catch (error) {
    console.error('API validation failed for Pexels:', error);
    return false;
  }
};
