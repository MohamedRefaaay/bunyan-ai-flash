
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Upload, Download, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const CloudIntegration = () => {
  const [connectedServices, setConnectedServices] = useState<string[]>([]);
  const [recentFiles, setRecentFiles] = useState([
    { name: 'Machine Learning Lecture.mp3', service: 'gdrive', date: '2024-01-15' },
    { name: 'Chemistry Notes.wav', service: 'onedrive', date: '2024-01-14' }
  ]);

  const connectService = (service: string) => {
    // Simulate OAuth connection
    setTimeout(() => {
      setConnectedServices(prev => [...prev, service]);
      toast.success(`Connected to ${service === 'gdrive' ? 'Google Drive' : 'OneDrive'}`);
    }, 1000);
  };

  const uploadToCloud = (service: string) => {
    toast.success(`Files backed up to ${service === 'gdrive' ? 'Google Drive' : 'OneDrive'}`);
  };

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Storage Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Google Drive</span>
              </div>
              {connectedServices.includes('gdrive') ? (
                <Badge variant="default">Connected</Badge>
              ) : (
                <Button size="sm" onClick={() => connectService('gdrive')}>
                  Connect
                </Button>
              )}
            </div>
            {connectedServices.includes('gdrive') && (
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Files
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => uploadToCloud('gdrive')}>
                  <Download className="h-4 w-4" />
                  Backup Session
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                <span className="font-medium">OneDrive</span>
              </div>
              {connectedServices.includes('onedrive') ? (
                <Badge variant="default">Connected</Badge>
              ) : (
                <Button size="sm" onClick={() => connectService('onedrive')}>
                  Connect
                </Button>
              )}
            </div>
            {connectedServices.includes('onedrive') && (
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Files
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => uploadToCloud('onedrive')}>
                  <Download className="h-4 w-4" />
                  Backup Session
                </Button>
              </div>
            )}
          </div>
        </div>

        {connectedServices.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Recent Files
            </h4>
            {recentFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded bg-white">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${file.service === 'gdrive' ? 'bg-blue-500' : 'bg-blue-400'}`} />
                  <span className="text-sm">{file.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{file.date}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudIntegration;
