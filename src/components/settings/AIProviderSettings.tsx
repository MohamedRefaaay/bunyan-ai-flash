
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { KeyRound, Bot, Check, AlertCircle, ExternalLink } from "lucide-react";

export type AIProvider = 'gemini';

interface AIProviderConfig {
  id: AIProvider;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  keyLabel: string;
  keyLabelEn: string;
  placeholder: string;
  models: string[];
  icon: React.ReactNode;
  setupUrl: string;
}

const aiProvider: AIProviderConfig = {
  id: 'gemini',
  name: 'Google Gemini',
  nameEn: 'Google Gemini',
  description: 'نموذج الذكاء الاصطناعي المتقدم من جوجل - مجاني للاستخدام الشخصي',
  descriptionEn: 'Advanced AI model from Google - Free for personal use',
  keyLabel: 'مفتاح Gemini API',
  keyLabelEn: 'Gemini API Key',
  placeholder: 'AIzaSy...',
  models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  icon: <Bot className="h-5 w-5" />,
  setupUrl: 'https://aistudio.google.com/app/apikey'
};

interface AIProviderSettingsProps {
  isRTL?: boolean;
}

const AIProviderSettings = ({ isRTL = true }: AIProviderSettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp');

  useEffect(() => {
    // تحميل المفتاح المحفوظ
    const storedGemini = localStorage.getItem("gemini_api_key");
    if (storedGemini) setApiKey(storedGemini);

    // تحميل النموذج المحفوظ
    const storedModels = localStorage.getItem("ai_models");
    if (storedModels) {
      const models = JSON.parse(storedModels);
      if (models.gemini) setSelectedModel(models.gemini);
    }
  }, []);

  const handleSave = () => {
    // حفظ مزود Gemini كالافتراضي
    localStorage.setItem("ai_provider", "gemini");
    
    // حفظ المفتاح
    if (apiKey) {
      localStorage.setItem("gemini_api_key", apiKey);
    }

    // حفظ النموذج المختار
    localStorage.setItem("ai_models", JSON.stringify({ gemini: selectedModel }));

    toast.success(isRTL ? "تم حفظ إعدادات Gemini بنجاح!" : "Gemini settings saved successfully!");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          {isRTL ? "إعدادات Google Gemini" : "Google Gemini Settings"}
        </CardTitle>
        <CardDescription>
          {isRTL 
            ? "أدخل مفتاح Gemini API الخاص بك للاستفادة من جميع ميزات الذكاء الاصطناعي"
            : "Enter your Gemini API key to access all AI features"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* توصية Gemini */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-green-900">
                {isRTL ? "🌟 Google Gemini - مجاني ومتقدم" : "🌟 Google Gemini - Free & Advanced"}
              </h4>
              <p className="text-sm text-green-800">
                {isRTL 
                  ? "Gemini مجاني للاستخدام الشخصي ويوفر أداءً ممتازاً للغة العربية. احصل على مفتاح API مجاني من Google AI Studio."
                  : "Gemini is free for personal use and provides excellent Arabic language performance. Get a free API key from Google AI Studio."
                }
              </p>
              <Button variant="outline" size="sm" asChild className="text-green-700 border-green-300">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {isRTL ? "احصل على مفتاح Gemini مجاناً" : "Get Free Gemini API Key"}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* مفتاح API */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="gemini-key">
                {isRTL ? aiProvider.keyLabel : aiProvider.keyLabelEn}
              </Label>
              {apiKey && (
                <Badge variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  {isRTL ? "محفوظ" : "Saved"}
                </Badge>
              )}
            </div>
            <Input
              id="gemini-key"
              type="password"
              placeholder={aiProvider.placeholder}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            
            {/* النموذج المختار */}
            <div className="ml-4 space-y-2">
              <Label className="text-sm text-muted-foreground">
                {isRTL ? "النموذج المفضل" : "Preferred Model"}
              </Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiProvider.models.map(model => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">
                {isRTL ? "ميزات Gemini في بنيان الذكي" : "Gemini Features in Bunyan Smart"}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  {isRTL 
                    ? "• تحليل وتلخيص المستندات بدقة عالية"
                    : "• High-accuracy document analysis and summarization"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• توليد البطاقات التعليمية الذكية"
                    : "• Smart flashcard generation"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• تحويل الصوت إلى نص للغة العربية"
                    : "• Audio-to-text conversion for Arabic"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• تلخيص فيديوهات يوتيوب"
                    : "• YouTube video summarization"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• دعم كامل للغة العربية والإنجليزية"
                    : "• Full Arabic and English language support"
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          {isRTL ? "حفظ إعدادات Gemini" : "Save Gemini Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIProviderSettings;
