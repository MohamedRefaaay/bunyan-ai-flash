
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, analysisType, language = 'ar' } = await req.json();

    if (!text) {
      throw new Error("النص مطلوب للتحليل");
    }

    if (!geminiApiKey) {
      throw new Error("مفتاح Gemini API غير متوفر في إعدادات الخادم");
    }

    let systemPrompt = '';
    let prompt = '';

    switch (analysisType) {
      case 'summary':
        systemPrompt = language === 'ar' 
          ? 'أنت خبير في تلخيص النصوص. قم بإنشاء ملخص شامل ومفيد باللغة العربية.'
          : 'You are an expert in text summarization. Create a comprehensive and useful summary in English.';
        prompt = language === 'ar'
          ? `قم بتلخيص النص التالي بشكل شامل ومفصل:\n\n${text}`
          : `Summarize the following text comprehensively:\n\n${text}`;
        break;

      case 'flashcards':
        systemPrompt = language === 'ar'
          ? 'أنت خبير في إنشاء البطاقات التعليمية. أنشئ بطاقات تعليمية فعالة ومفيدة.'
          : 'You are an expert in creating educational flashcards. Create effective and useful flashcards.';
        prompt = language === 'ar'
          ? `أنشئ 10 بطاقات تعليمية من النص التالي بصيغة JSON:\n\n${text}\n\nالصيغة المطلوبة: {"cards": [{"front": "السؤال", "back": "الإجابة", "difficulty": "easy|medium|hard"}]}`
          : `Create 10 flashcards from the following text in JSON format:\n\n${text}\n\nRequired format: {"cards": [{"front": "Question", "back": "Answer", "difficulty": "easy|medium|hard"}]}`;
        break;

      case 'concepts':
        systemPrompt = language === 'ar'
          ? 'أنت خبير في استخراج المفاهيم الأساسية من النصوص التعليمية.'
          : 'You are an expert in extracting key concepts from educational texts.';
        prompt = language === 'ar'
          ? `استخرج المفاهيم الأساسية من النص التالي مع تعريف مختصر لكل مفهوم:\n\n${text}`
          : `Extract key concepts from the following text with brief definitions:\n\n${text}`;
        break;

      case 'questions':
        systemPrompt = language === 'ar'
          ? 'أنت خبير في إنشاء الأسئلة التعليمية المتنوعة.'
          : 'You are an expert in creating diverse educational questions.';
        prompt = language === 'ar'
          ? `أنشئ 15 سؤال متنوع (اختيار متعدد، صح/خطأ، أسئلة مقالية) من النص التالي:\n\n${text}`
          : `Create 15 diverse questions (multiple choice, true/false, essay questions) from the following text:\n\n${text}`;
        break;

      default:
        throw new Error("نوع التحليل غير مدعوم");
    }

    const requestBody = {
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
      systemInstruction: {
        parts: [{ text: systemPrompt }]
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

    if (analysisType === 'flashcards') {
      requestBody.generationConfig.responseMimeType = "application/json";
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
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
      throw new Error('استجابة غير صالحة من Gemini API');
    }
    
    const result = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ result, analysisType }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("AI Enhanced Analysis Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
