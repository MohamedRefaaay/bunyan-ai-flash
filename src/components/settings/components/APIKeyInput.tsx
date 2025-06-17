
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { AIProviderConfig } from "../types/aiProviderTypes";

interface APIKeyInputProps {
  provider: AIProviderConfig;
  apiKey: string;
  selectedModel: string;
  onApiKeyChange: (value: string) => void;
  onModelChange: (value: string) => void;
  isRTL?: boolean;
}

const APIKeyInput = ({ 
  provider, 
  apiKey, 
  selectedModel, 
  onApiKeyChange, 
  onModelChange, 
  isRTL = true 
}: APIKeyInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="gemini-key">
            {isRTL ? provider.keyLabel : provider.keyLabelEn}
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
          placeholder={provider.placeholder}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        
        <div className="ml-4 space-y-2">
          <Label className="text-sm text-muted-foreground">
            {isRTL ? "النموذج المفضل" : "Preferred Model"}
          </Label>
          <Select value={selectedModel} onValueChange={onModelChange}>
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
    </div>
  );
};

export default APIKeyInput;
