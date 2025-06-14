
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

const Settings = () => {
  const [openAIKey, setOpenAIKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    const storedOpenAIKey = localStorage.getItem("openai_api_key");
    const storedGeminiKey = localStorage.getItem("gemini_api_key");
    if (storedOpenAIKey) {
      setOpenAIKey(storedOpenAIKey);
    }
    if (storedGeminiKey) {
      setGeminiKey(storedGeminiKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("openai_api_key", openAIKey);
    localStorage.setItem("gemini_api_key", geminiKey);
    toast.success("تم حفظ مفاتيح API بنجاح!");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          إدارة مفاتيح API
        </CardTitle>
        <CardDescription>
          أدخل مفاتيح API الخاصة بك هنا. سيتم تخزينها بشكل آمن في متصفحك.
          لن يتم مشاركة هذه المفاتيح مع أي شخص.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="openai-key">مفتاح OpenAI API</Label>
          <Input
            id="openai-key"
            type="password"
            placeholder="sk-..."
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
          />
           <p className="text-sm text-muted-foreground">
            يستخدم لمولد البطاقات الذكي ومحرر البطاقات.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gemini-key">مفتاح Gemini API</Label>
          <Input
            id="gemini-key"
            type="password"
            placeholder="AIzaSy..."
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
          />
           <p className="text-sm text-muted-foreground">
            سيتم استخدامه في الميزات المستقبلية.
          </p>
        </div>
        <Button onClick={handleSave}>
          حفظ التغييرات
        </Button>
      </CardContent>
    </Card>
  );
};

export default Settings;
