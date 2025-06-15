
import React from 'react';
import type { YouTubeVideoInfo } from './youtubeSummarizerTypes';

interface YouTubeVideoInfoProps {
  videoInfo: YouTubeVideoInfo;
}

const YouTubeVideoInfoCard: React.FC<YouTubeVideoInfoProps> = ({ videoInfo }) => (
  <div className="bg-white rounded-lg border p-4">
    <h3 className="font-medium text-gray-900 mb-2">معلومات الفيديو:</h3>
    <div className="space-y-1 text-sm text-gray-600">
      <p><strong>العنوان:</strong> {videoInfo.title}</p>
    </div>
  </div>
);

export default YouTubeVideoInfoCard;
