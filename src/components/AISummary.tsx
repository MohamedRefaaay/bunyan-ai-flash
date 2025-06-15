
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookText, Download } from "lucide-react";
import { toast } from "sonner";

interface AISummaryProps {
  transcript: string;
}

const AISummary = ({ transcript }: AISummaryProps) => {
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const generateSummary = async () => {
    if (!transcript) {
      toast.error("يرجى تقديم محتوى لتلخيصه أولاً.");
      return;
    }

    const geminiApiKey = localStorage.getItem("gemini_api_key");
    if (!geminiApiKey) {
      toast.error("الرجاء إدخال مفتاح Gemini API الخاص بك في علامة تبويب الإعدادات أولاً.");
      return;
    }

    setIsSummarizing(true);
    setSummary("");

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    const prompt = `Please provide a concise summary in Arabic for the following transcript. The summary should capture the main points and key takeaways.\n\nTranscript:\n---\n${transcript}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate summary.");
      }

      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedSummary = result.candidates[0].content.parts[0].text;
        setSummary(generatedSummary);
        toast.success("تم إنشاء الملخص بنجاح!");
      } else {
        throw new Error("Invalid response structure from Gemini API.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred while generating the summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summary) {
      toast.error("لا يوجد ملخص لتنزيله.");
      return;
    }
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(summary);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "ai_summary.txt");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("تم بدء تنزيل الملخص!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookText className="h-5 w-5" />
            ملخص بالذكاء الاصطناعي (Gemini)
          </div>
          {summary && !isSummarizing && (
             <Button variant="outline" size="sm" onClick={handleDownloadSummary} className="gap-2">
                <Download className="h-4 w-4" />
                تنزيل الملخص
             </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generateSummary} disabled={isSummarizing || !transcript} className="w-full gap-2">
          {isSummarizing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري إنشاء الملخص...
            </>
          ) : (
            "إنشاء ملخص"
          )}
        </Button>
        {(summary || isSummarizing) && (
          <div className="p-4 border rounded-md bg-muted/50 min-h-[150px]">
            {isSummarizing ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">الذكاء الاصطناعي يفكر...</p>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{summary}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISummary;
