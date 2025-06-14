
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Upload, Download, FolderOpen, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const CloudIntegration = () => {
  const [connectedServices, setConnectedServices] = useState<string[]>([]);
  const [recentFiles, setRecentFiles] = useState([
    { name: 'Machine Learning Lecture.mp3', service: 'gdrive', date: '2024-01-15' },
    { name: 'Chemistry Notes.wav', service: 'onedrive', date: '2024-01-14' }
  ]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const connectService = (service: string) => {
    toast.info(`Connecting to ${service === 'gdrive' ? 'Google Drive' : 'OneDrive'}...`);
    
    // Simulate OAuth connection with progress
    setTimeout(() => {
      setConnectedServices(prev => [...prev, service]);
      toast.success(`✅ Connected to ${service === 'gdrive' ? 'Google Drive' : 'OneDrive'}`);
    }, 2000);
  };

  const uploadToCloud = (service: string) => {
    const serviceName = service === 'gdrive' ? 'Google Drive' : 'OneDrive';
    setUploadProgress({...uploadProgress, [service]: 0});
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[service] || 0;
        if (current >= 100) {
          clearInterval(interval);
          toast.success(`📁 Files successfully backed up to ${serviceName}`);
          
          // Add to recent files
          const newFile = {
            name: 'Current Session Backup.json',
            service: service,
            date: new Date().toISOString().split('T')[0]
          };
          setRecentFiles(prev => [newFile, ...prev]);
          
          return prev;
        }
        return {...prev, [service]: current + 10};
      });
    }, 200);
  };

  const downloadFromCloud = (fileName: string, service: string) => {
    toast.success(`📥 Downloading ${fileName} from ${service === 'gdrive' ? 'Google Drive' : 'OneDrive'}`);
  };

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Storage Integration
          {connectedServices.length > 0 && (
            <Badge variant="default">{connectedServices.length} connected</Badge>
          )}
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
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2" 
                  onClick={() => uploadToCloud('gdrive')}
                  disabled={uploadProgress.gdrive !== undefined && uploadProgress.gdrive < 100}
                >
                  <Download className="h-4 w-4" />
                  {uploadProgress.gdrive !== undefined && uploadProgress.gdrive < 100 
                    ? `Uploading... ${uploadProgress.gdrive}%` 
                    : 'Backup Session'
                  }
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
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2" 
                  onClick={() => uploadToCloud('onedrive')}
                  disabled={uploadProgress.onedrive !== undefined && uploadProgress.onedrive < 100}
                >
                  <Download className="h-4 w-4" />
                  {uploadProgress.onedrive !== undefined && uploadProgress.onedrive < 100 
                    ? `Uploading... ${uploadProgress.onedrive}%` 
                    : 'Backup Session'
                  }
                </Button>
              </div>
            )}
          </div>
        </div>

        {connectedServices.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Recent Files ({recentFiles.length})
            </h4>
            {recentFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${file.service === 'gdrive' ? 'bg-blue-500' : 'bg-blue-400'}`} />
                  <span className="text-sm">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{file.date}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => downloadFromCloud(file.name, file.service)}
                    className="h-6 px-2"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {connectedServices.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Cloud className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Connect your cloud storage to backup and sync flashcards</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudIntegration;
