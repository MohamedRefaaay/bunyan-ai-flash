
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import React from 'react';

interface YouTubeVideoInputProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  onAnalyze: () => void;
  isProcessing: boolean;
  configAvailable: boolean;
}

const YouTubeVideoInput: React.FC<YouTubeVideoInputProps> = ({
  videoUrl,
  setVideoUrl,
  onAnalyze,
  isProcessing,
  configAvailable
}) => (
  <div className="space-y-3">
    <label className="text-sm font-medium text-gray-700">
      رابط فيديو يوتيوب:
    </label>
    <div className="flex gap-2">
      <Input
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="flex-1"
        disabled={isProcessing}
      />
      <Button 
        onClick={onAnalyze}
        disabled={isProcessing || !videoUrl || !configAvailable}
        className="gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري التحليل...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            تحليل الفيديو
          </>
        )}
      </Button>
    </div>
  </div>
);

export default YouTubeVideoInput;
