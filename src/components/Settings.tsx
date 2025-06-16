
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Bot, Globe, Palette } from "lucide-react";
import AIProviderSettings from "./settings/AIProviderSettings";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { isRTL, toggleRTL } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isRTL ? "إعدادات التطبيق" : "Application Settings"}
        </h1>
        <p className="text-gray-600">
          {isRTL 
            ? "تخصيص التطبيق وإدارة Gemini AI"
            : "Customize the app and manage Gemini AI"
          }
        </p>
      </div>

      <Tabs defaultValue="ai-provider" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai-provider" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            {isRTL ? "Gemini AI" : "Gemini AI"}
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {isRTL ? "اللغة والترجمة" : "Language & Translation"}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {isRTL ? "المظهر" : "Appearance"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-provider" className="mt-6">
          <AIProviderSettings isRTL={isRTL} />
        </TabsContent>

        <TabsContent value="language" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {isRTL ? "إعدادات اللغة" : "Language Settings"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "تغيير لغة واتجاه النص في التطبيق"
                  : "Change the language and text direction of the app"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">
                      {isRTL ? "اتجاه النص" : "Text Direction"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? "تغيير اتجاه النص من العربية إلى الإنجليزية"
                        : "Switch text direction from Arabic to English"
                      }
                    </p>
                  </div>
                  <Button variant="outline" onClick={toggleRTL}>
                    {isRTL ? "English" : "العربية"}
                  </Button>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">
                    {isRTL ? "الميزات المدعومة" : "Supported Features"}
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>
                      {isRTL 
                        ? "• واجهة مستخدم ثنائية اللغة (عربي/إنجليزي)"
                        : "• Bilingual user interface (Arabic/English)"
                      }
                    </li>
                    <li>
                      {isRTL 
                        ? "• دعم كامل للغة العربية في Gemini AI"
                        : "• Full Arabic language support in Gemini AI"
                      }
                    </li>
                    <li>
                      {isRTL 
                        ? "• تحليل وتلخيص المستندات باللغتين"
                        : "• Document analysis and summarization in both languages"
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {isRTL ? "إعدادات المظهر" : "Appearance Settings"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "تخصيص مظهر وألوان التطبيق"
                  : "Customize the app's appearance and colors"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isRTL ? "قريباً..." : "Coming Soon..."}
                </h3>
                <p className="text-gray-600">
                  {isRTL 
                    ? "إعدادات المظهر والثيم ستكون متاحة قريباً"
                    : "Theme and appearance settings will be available soon"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
