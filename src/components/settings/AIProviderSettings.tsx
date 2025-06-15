
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { KeyRound, Bot, Check, AlertCircle } from "lucide-react";

export type AIProvider = 'openai' | 'gemini' | 'anthropic';

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
}

const aiProviders: AIProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    nameEn: 'OpenAI',
    description: 'مزود الذكاء الاصطناعي الرائد للمحادثات وتوليد المحتوى',
    descriptionEn: 'Leading AI provider for conversations and content generation',
    keyLabel: 'مفتاح OpenAI API',
    keyLabelEn: 'OpenAI API Key',
    placeholder: 'sk-...',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    icon: <Bot className="h-5 w-5" />
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    nameEn: 'Google Gemini',
    description: 'نموذج الذكاء الاصطناعي المتقدم من جوجل',
    descriptionEn: 'Advanced AI model from Google',
    keyLabel: 'مفتاح Gemini API',
    keyLabelEn: 'Gemini API Key',
    placeholder: 'AIzaSy...',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    icon: <Bot className="h-5 w-5" />
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    nameEn: 'Anthropic Claude',
    description: 'نموذج الذكاء الاصطناعي الآمن والموثوق',
    descriptionEn: 'Safe and reliable AI model',
    keyLabel: 'مفتاح Anthropic API',
    keyLabelEn: 'Anthropic API Key',
    placeholder: 'sk-ant-...',
    models: ['claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-3-opus'],
    icon: <Bot className="h-5 w-5" />
  }
];

interface AIProviderSettingsProps {
  isRTL?: boolean;
}

const AIProviderSettings = ({ isRTL = true }: AIProviderSettingsProps) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openai: '',
    gemini: '',
    anthropic: ''
  });
  const [selectedModels, setSelectedModels] = useState<Record<AIProvider, string>>({
    openai: 'gpt-4o-mini',
    gemini: 'gemini-2.0-flash',
    anthropic: 'claude-3-5-sonnet'
  });

  useEffect(() => {
    // تحميل المفاتيح المحفوظة
    const storedProvider = localStorage.getItem("ai_provider") as AIProvider;
    const storedOpenAI = localStorage.getItem("openai_api_key");
    const storedGemini = localStorage.getItem("gemini_api_key");
    const storedAnthropic = localStorage.getItem("anthropic_api_key");
    
    if (storedProvider) setSelectedProvider(storedProvider);
    if (storedOpenAI) setApiKeys(prev => ({ ...prev, openai: storedOpenAI }));
    if (storedGemini) setApiKeys(prev => ({ ...prev, gemini: storedGemini }));
    if (storedAnthropic) setApiKeys(prev => ({ ...prev, anthropic: storedAnthropic }));

    // تحميل النماذج المحفوظة
    const storedModels = localStorage.getItem("ai_models");
    if (storedModels) {
      setSelectedModels(JSON.parse(storedModels));
    }
  }, []);

  const handleSave = () => {
    // حفظ المزود المختار
    localStorage.setItem("ai_provider", selectedProvider);
    
    // حفظ المفاتيح
    Object.entries(apiKeys).forEach(([provider, key]) => {
      if (key) {
        localStorage.setItem(`${provider}_api_key`, key);
      }
    });

    // حفظ النماذج المختارة
    localStorage.setItem("ai_models", JSON.stringify(selectedModels));

    toast.success(isRTL ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!");
  };

  const currentProvider = aiProviders.find(p => p.id === selectedProvider)!;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          {isRTL ? "إعدادات مزودي الذكاء الاصطناعي" : "AI Provider Settings"}
        </CardTitle>
        <CardDescription>
          {isRTL 
            ? "اختر مزود الذكاء الاصطناعي المفضل وأدخل مفاتيح API الخاصة بك"
            : "Choose your preferred AI provider and enter your API keys"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* اختيار المزود */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {isRTL ? "مزود الذكاء الاصطناعي الافتراضي" : "Default AI Provider"}
          </Label>
          <Select value={selectedProvider} onValueChange={(value: AIProvider) => setSelectedProvider(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiProviders.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center gap-3">
                    {provider.icon}
                    <div>
                      <div className="font-medium">{isRTL ? provider.name : provider.nameEn}</div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? provider.description : provider.descriptionEn}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* مفاتيح API */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            {isRTL ? "مفاتيح API" : "API Keys"}
          </Label>
          
          {aiProviders.map(provider => (
            <div key={provider.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={`${provider.id}-key`}>
                  {isRTL ? provider.keyLabel : provider.keyLabelEn}
                </Label>
                {apiKeys[provider.id] && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    {isRTL ? "محفوظ" : "Saved"}
                  </Badge>
                )}
              </div>
              <Input
                id={`${provider.id}-key`}
                type="password"
                placeholder={provider.placeholder}
                value={apiKeys[provider.id]}
                onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
              />
              
              {/* النموذج المختار */}
              <div className="ml-4 space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {isRTL ? "النموذج المفضل" : "Preferred Model"}
                </Label>
                <Select 
                  value={selectedModels[provider.id]} 
                  onValueChange={(value) => setSelectedModels(prev => ({ ...prev, [provider.id]: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {provider.models.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        {/* معلومات إضافية */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">
                {isRTL ? "ملاحظات مهمة" : "Important Notes"}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  {isRTL 
                    ? "• يتم تخزين المفاتيح بشكل آمن في متصفحك فقط"
                    : "• Keys are stored securely in your browser only"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• لن يتم مشاركة المفاتيح مع أي طرف ثالث"
                    : "• Keys are never shared with third parties"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• يمكنك استخدام أكثر من مزود في نفس الوقت"
                    : "• You can use multiple providers simultaneously"
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          {isRTL ? "حفظ جميع الإعدادات" : "Save All Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIProviderSettings;
