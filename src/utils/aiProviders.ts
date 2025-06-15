
export type AIProvider = 'openai' | 'gemini' | 'anthropic';

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  provider: AIProvider;
}

export const getAIProviderConfig = (): AIProviderConfig | null => {
  const selectedProvider = localStorage.getItem("ai_provider") as AIProvider || 'openai';
  const apiKey = localStorage.getItem(`${selectedProvider}_api_key`);
  
  if (!apiKey) {
    return null;
  }

  const storedModels = localStorage.getItem("ai_models");
  const models = storedModels ? JSON.parse(storedModels) : {};
  
  const defaultModels = {
    openai: 'gpt-4o-mini',
    gemini: 'gemini-2.0-flash',
    anthropic: 'claude-3-5-sonnet'
  };

  return {
    apiKey,
    model: models[selectedProvider] || defaultModels[selectedProvider],
    provider: selectedProvider
  };
};

export const makeAIRequest = async (prompt: string, options?: {
  systemPrompt?: string;
  provider?: AIProvider;
  model?: string;
}) => {
  const config = getAIProviderConfig();
  
  if (!config) {
    throw new Error('لم يتم العثور على مفتاح API. يرجى إعداد مزود الذكاء الاصطناعي في الإعدادات.');
  }

  const provider = options?.provider || config.provider;
  const model = options?.model || config.model;
  const systemPrompt = options?.systemPrompt || 'أنت مساعد ذكي ومفيد. أجب باللغة العربية إلا إذا طُلب منك غير ذلك.';

  switch (provider) {
    case 'openai':
      return await makeOpenAIRequest(config.apiKey, model, prompt, systemPrompt);
    case 'gemini':
      return await makeGeminiRequest(config.apiKey, model, prompt, systemPrompt);
    case 'anthropic':
      return await makeAnthropicRequest(config.apiKey, model, prompt, systemPrompt);
    default:
      throw new Error(`مزود غير مدعوم: ${provider}`);
  }
};

const makeOpenAIRequest = async (apiKey: string, model: string, prompt: string, systemPrompt: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'خطأ في OpenAI API');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const makeGeminiRequest = async (apiKey: string, model: string, prompt: string, systemPrompt: string) => {
  const fullPrompt = `${systemPrompt}\n\nالمستخدم: ${prompt}`;
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'خطأ في Gemini API');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const makeAnthropicRequest = async (apiKey: string, model: string, prompt: string, systemPrompt: string) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'خطأ في Anthropic API');
  }

  const data = await response.json();
  return data.content[0].text;
};

export const validateAPIKey = async (provider: AIProvider, apiKey: string): Promise<boolean> => {
  try {
    const testPrompt = 'Hello';
    const systemPrompt = 'Respond with just "OK"';
    
    switch (provider) {
      case 'openai':
        await makeOpenAIRequest(apiKey, 'gpt-4o-mini', testPrompt, systemPrompt);
        break;
      case 'gemini':
        await makeGeminiRequest(apiKey, 'gemini-2.0-flash', testPrompt, systemPrompt);
        break;
      case 'anthropic':
        await makeAnthropicRequest(apiKey, 'claude-3-5-haiku', testPrompt, systemPrompt);
        break;
    }
    return true;
  } catch {
    return false;
  }
};
