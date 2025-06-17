
import { Button } from "@/components/ui/button";
import { Bot, ExternalLink } from "lucide-react";

interface GeminiRecommendationProps {
  isRTL?: boolean;
}

const GeminiRecommendation = ({ isRTL = true }: GeminiRecommendationProps) => {
  return (
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
  );
};

export default GeminiRecommendation;
