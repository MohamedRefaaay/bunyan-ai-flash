
import { Loader2 } from "lucide-react";

const ProcessingStatus = () => {
  return (
    <div className="text-center py-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
      <p className="text-blue-700 font-medium">جاري تحويل الصوت إلى نص باستخدام OpenAI Whisper...</p>
      <p className="text-blue-600 text-sm">قد يستغرق هذا بضع دقائق، يعتمد على حجم الملف</p>
    </div>
  );
};

export default ProcessingStatus;
