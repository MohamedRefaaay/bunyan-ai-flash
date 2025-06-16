
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Image, Check, AlertCircle, ExternalLink } from "lucide-react";
import { validatePexelsKey } from "@/utils/aiProviders";

interface PexelsSettingsProps {
  isRTL?: boolean;
}

const PexelsSettings = ({ isRTL = true }: PexelsSettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // تحميل المفتاح المحفوظ
    const storedKey = localStorage.getItem("pexels_api_key");
    if (storedKey) setApiKey(storedKey);

    // تحميل حالة التفعيل
    const enabled = localStorage.getItem("pexels_enabled") === 'true';
    setIsEnabled(enabled);
  }, []);

  const handleSave = async () => {
    if (apiKey && isEnabled) {
      setIsValidating(true);
      const isValid = await validatePexelsKey(apiKey);
      setIsValidating(false);

      if (!isValid) {
        toast.error(isRTL ? "مفتاح Pexels غير صحيح" : "Invalid Pexels API key");
        return;
      }
    }

    // حفظ المفتاح
    if (apiKey) {
      localStorage.setItem("pexels_api_key", apiKey);
    }

    // حفظ حالة التفعيل
    localStorage.setItem("pexels_enabled", isEnabled.toString());

    toast.success(isRTL ? "تم حفظ إعدادات Pexels بنجاح!" : "Pexels settings saved successfully!");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          {isRTL ? "إعدادات Pexels" : "Pexels Settings"}
        </CardTitle>
        <CardDescription>
          {isRTL 
            ? "أدخل مفتاح Pexels API للوصول إلى مكتبة الصور المجانية"
            : "Enter your Pexels API key to access the free stock photo library"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* معلومات Pexels */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Image className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">
                {isRTL ? "🖼️ Pexels - مكتبة صور مجانية" : "🖼️ Pexels - Free Stock Photos"}
              </h4>
              <p className="text-sm text-blue-800">
                {isRTL 
                  ? "Pexels يوفر ملايين الصور عالية الجودة مجاناً للاستخدام في مشاريعك التعليمية."
                  : "Pexels provides millions of high-quality photos for free use in your educational projects."
                }
              </p>
              <Button variant="outline" size="sm" asChild className="text-blue-700 border-blue-300">
                <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {isRTL ? "احصل على مفتاح Pexels مجاناً" : "Get Free Pexels API Key"}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* تفعيل Pexels */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">
              {isRTL ? "تفعيل Pexels" : "Enable Pexels"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? "تفعيل البحث عن الصور من Pexels"
                : "Enable image search from Pexels"
              }
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        {/* مفتاح API */}
        {isEnabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="pexels-key">
                  {isRTL ? "مفتاح Pexels API" : "Pexels API Key"}
                </Label>
                {apiKey && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    {isRTL ? "محفوظ" : "Saved"}
                  </Badge>
                )}
              </div>
              <Input
                id="pexels-key"
                type="password"
                placeholder="563492ad6f917000010000..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-green-900">
                {isRTL ? "استخدامات Pexels في بنيان الذكي" : "Pexels Uses in Bunyan Smart"}
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>
                  {isRTL 
                    ? "• إضافة صور للبطاقات التعليمية"
                    : "• Add images to flashcards"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• تحسين التصميم البصري للمستندات"
                    : "• Enhance visual design of documents"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• إنشاء محتوى تعليمي تفاعلي"
                    : "• Create interactive educational content"
                  }
                </li>
                <li>
                  {isRTL 
                    ? "• دعم التعلم البصري"
                    : "• Support visual learning"
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isValidating}
        >
          {isValidating 
            ? (isRTL ? "جاري التحقق..." : "Validating...")
            : (isRTL ? "حفظ إعدادات Pexels" : "Save Pexels Settings")
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default PexelsSettings;
