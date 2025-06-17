
import { AlertCircle } from "lucide-react";

interface GeminiFeaturesProps {
  isRTL?: boolean;
}

const GeminiFeatures = ({ isRTL = true }: GeminiFeaturesProps) => {
  return (
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
  );
};

export default GeminiFeatures;
