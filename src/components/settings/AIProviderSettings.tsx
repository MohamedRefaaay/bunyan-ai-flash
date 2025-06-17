
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { KeyRound, Bot } from "lucide-react";
import { AIProviderConfig } from "./types/aiProviderTypes";
import GeminiRecommendation from "./components/GeminiRecommendation";
import GeminiFeatures from "./components/GeminiFeatures";
import APIKeyInput from "./components/APIKeyInput";

const aiProvider: AIProviderConfig = {
  id: 'gemini',
  name: 'Google Gemini',
  nameEn: 'Google Gemini',
  description: 'نموذج الذكاء الاصطناعي المتقدم من جوجل - مجاني للاستخدام الشخصي',
  descriptionEn: 'Advanced AI model from Google - Free for personal use',
  keyLabel: 'مفتاح Gemini API',
  keyLabelEn: 'Gemini API Key',
  placeholder: 'AIzaSy...',
  models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  icon: <Bot className="h-5 w-5" />,
  setupUrl: 'https://aistudio.google.com/app/apikey'
};

interface AIProviderSettingsProps {
  isRTL?: boolean;
}

const AIProviderSettings = ({ isRTL = true }: AIProviderSettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  useEffect(() => {
    const storedGemini = localStorage.getItem("gemini_api_key");
    if (storedGemini) setApiKey(storedGemini);

    const storedModels = localStorage.getItem("ai_models");
    if (storedModels) {
      const models = JSON.parse(storedModels);
      if (models.gemini) setSelectedModel(models.gemini);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("ai_provider", "gemini");
    
    if (apiKey) {
      localStorage.setItem("gemini_api_key", apiKey);
    }

    localStorage.setItem("ai_models", JSON.stringify({ gemini: selectedModel }));

    toast.success(isRTL ? "تم حفظ إعدادات Gemini بنجاح!" : "Gemini settings saved successfully!");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          {isRTL ? "إعدادات Google Gemini 2.5" : "Google Gemini 2.5 Settings"}
        </CardTitle>
        <CardDescription>
          {isRTL 
            ? "أدخل مفتاح Gemini API الخاص بك للاستفادة من أحدث نماذج الذكاء الاصطناعي"
            : "Enter your Gemini API key to access the latest AI models"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <GeminiRecommendation isRTL={isRTL} />
        
        <APIKeyInput
          provider={aiProvider}
          apiKey={apiKey}
          selectedModel={selectedModel}
          onApiKeyChange={setApiKey}
          onModelChange={setSelectedModel}
          isRTL={isRTL}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            {isRTL ? "🚀 نماذج Gemini 2.5 الجديدة" : "🚀 New Gemini 2.5 Models"}
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              {isRTL 
                ? "• Gemini 2.5 Flash - الأسرع والأفضل للاستخدام اليومي"
                : "• Gemini 2.5 Flash - Fastest and best for daily use"
              }
            </li>
            <li>
              {isRTL 
                ? "• Gemini 2.5 Pro - للمهام المعقدة والتحليل المتقدم"
                : "• Gemini 2.5 Pro - For complex tasks and advanced analysis"
              }
            </li>
            <li>
              {isRTL 
                ? "• دعم محسن للغة العربية والبطاقات التعليمية"
                : "• Enhanced Arabic support and educational flashcards"
              }
            </li>
          </ul>
        </div>

        <GeminiFeatures isRTL={isRTL} />

        <Button onClick={handleSave} className="w-full">
          {isRTL ? "حفظ إعدادات Gemini 2.5" : "Save Gemini 2.5 Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIProviderSettings;
