
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Youtube, Loader2, Download, Play } from "lucide-react";
import { toast } from "sonner";

interface YouTubeIntegrationProps {
  onTranscriptGenerated: (transcript: string, title: string) => void;
}

const YouTubeIntegration = ({ onTranscriptGenerated }: YouTubeIntegrationProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<{title: string; duration: string; thumbnail: string} | null>(null);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const validateYouTubeUrl = () => {
    if (!youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return false;
    }
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      toast.error("Please enter a valid YouTube URL");
      return false;
    }
    
    return true;
  };

  const processYouTubeVideo = async () => {
    if (!validateYouTubeUrl()) return;

    setIsProcessing(true);
    
    try {
      const videoId = extractVideoId(youtubeUrl);
      
      // Simulate video info extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockVideoInfo = {
        title: "Introduction to Machine Learning - Complete Lecture",
        duration: "1:45:32",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
      
      setVideoInfo(mockVideoInfo);
      
      // Simulate transcript extraction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTranscript = `Welcome to this comprehensive introduction to machine learning.

In today's lecture, we'll cover the fundamental concepts that form the foundation of machine learning:

1. **Supervised Learning**
   - Definition and key characteristics
   - Examples: Linear regression, classification
   - Training data with labeled examples
   - Goal: Learn mapping from inputs to outputs

2. **Unsupervised Learning**
   - Finding patterns in unlabeled data
   - Clustering algorithms (K-means, hierarchical)
   - Dimensionality reduction (PCA, t-SNE)
   - Association rule learning

3. **Reinforcement Learning**
   - Agent-environment interaction
   - Reward-based learning system
   - Applications in gaming, robotics, autonomous systems
   - Q-learning and policy gradients

4. **Key Algorithms**
   - Decision Trees: Easy to interpret, handle categorical data
   - Random Forest: Ensemble method, reduces overfitting
   - Support Vector Machines: Effective for high-dimensional data
   - Neural Networks: Deep learning, complex pattern recognition

5. **Model Evaluation**
   - Training vs validation vs test sets
   - Cross-validation techniques
   - Metrics: Accuracy, precision, recall, F1-score
   - Overfitting and underfitting concepts

6. **Practical Applications**
   - Image recognition and computer vision
   - Natural language processing
   - Recommendation systems
   - Fraud detection and security
   - Medical diagnosis and drug discovery

Remember that successful machine learning requires good data preprocessing, feature engineering, and careful model selection based on your specific problem domain.`;

      onTranscriptGenerated(mockTranscript, mockVideoInfo.title);
      toast.success("YouTube video processed successfully!");
      
    } catch (error) {
      console.error("YouTube processing error:", error);
      toast.error("Failed to process YouTube video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
          <Youtube className="h-5 w-5" />
          YouTube Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="youtube-url">YouTube Video URL</Label>
          <div className="flex gap-2">
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={processYouTubeVideo}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Extract
                </>
              )}
            </Button>
          </div>
        </div>

        {videoInfo && !isProcessing && (
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <img 
              src={videoInfo.thumbnail} 
              alt="Video thumbnail"
              className="w-24 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium line-clamp-2">{videoInfo.title}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Play className="h-3 w-3" />
                Duration: {videoInfo.duration}
              </p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-2" />
            <p className="text-red-700 dark:text-red-300 font-medium">
              Extracting audio and generating transcript...
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm">
              This may take a few minutes for longer videos
            </p>
          </div>
        )}

        <div className="text-xs text-red-600 dark:text-red-400">
          <p>• Supports educational content and lectures</p>
          <p>• Automatically extracts audio and generates transcript</p>
          <p>• Creates flashcards from video content</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeIntegration;
