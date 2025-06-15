
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Type } from "lucide-react";
import { toast } from "sonner";

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

const TextInput = ({ onTextSubmit }: TextInputProps) => {
  const [textInput, setTextInput] = useState("");

  const handleSubmit = () => {
    if (!textInput.trim()) {
      toast.error("يرجى إدخال نص للتحليل");
      return;
    }
    
    onTextSubmit(textInput.trim());
    toast.success("تم إضافة النص بنجاح!");
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="أدخل النص الذي تريد تحليله هنا..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        className="min-h-[200px] resize-none"
      />
      <Button
        onClick={handleSubmit}
        className="w-full gap-2"
        disabled={!textInput.trim()}
      >
        <Type className="h-4 w-4" />
        بدء تحليل النص
      </Button>
    </div>
  );
};

export default TextInput;
