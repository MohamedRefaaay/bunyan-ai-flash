
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cloud, CloudDownload, CloudUpload, Smartphone, Monitor, Tablet, RefreshCw, CheckCircle, AlertCircle, FileText, Image, Video, Music, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const CloudIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastSync, setLastSync] = useState("منذ 5 دقائق");
  const [storageUsed, setStorageUsed] = useState(245);
  const [storageLimit] = useState(1000);
  const [driveFiles, setDriveFiles] = useState([]);
  const [showFileImporter, setShowFileImporter] = useState(false);

  // محاكاة ملفات Google Drive
  const mockDriveFiles = [
    { 
      id: '1', 
      name: 'محاضرة الرياضيات.pdf', 
      type: 'application/pdf', 
      size: '2.5 MB',
      icon: FileText,
      modifiedTime: '2024-01-15'
    },
    { 
      id: '2', 
      name: 'شرح الفيزياء.mp4', 
      type: 'video/mp4', 
      size: '45 MB',
      icon: Video,
      modifiedTime: '2024-01-14'
    },
    { 
      id: '3', 
      name: 'تسجيل المحاضرة.mp3', 
      type: 'audio/mp3', 
      size: '15 MB',
      icon: Music,
      modifiedTime: '2024-01-13'
    },
    { 
      id: '4', 
      name: 'ملاحظات الكيمياء.docx', 
      type: 'application/docx', 
      size: '1.2 MB',
      icon: FileText,
      modifiedTime: '2024-01-12'
    },
    { 
      id: '5', 
      name: 'صور التجارب.jpg', 
      type: 'image/jpeg', 
      size: '3.8 MB',
      icon: Image,
      modifiedTime: '2024-01-11'
    }
  ];

  const devices = [
    { id: "phone", name: "هاتف محمد", icon: Smartphone, lastSync: "منذ 2 دقائق", status: "متصل" },
    { id: "laptop", name: "حاسوب المكتب", icon: Monitor, lastSync: "منذ 10 دقائق", status: "متصل" },
    { id: "tablet", name: "الجهاز اللوحي", icon: Tablet, lastSync: "منذ ساعة", status: "غير متصل" }
  ];

  const cloudServices = [
    { id: "google", name: "Google Drive", connected: true, storage: "15 GB متاح" },
    { id: "dropbox", name: "Dropbox", connected: false, storage: "2 GB متاح" },
    { id: "onedrive", name: "OneDrive", connected: false, storage: "5 GB متاح" }
  ];

  const handleConnect = (service: string) => {
    setIsConnected(true);
    toast.success(`تم الاتصال بـ ${service} بنجاح!`);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    // محاكاة عملية المزامنة
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSyncing(false);
    setLastSync("الآن");
    toast.success("تم تحديث البطاقات عبر جميع الأجهزة!");
  };

  const handleBrowseDrive = async () => {
    if (!isConnected) {
      toast.error("يجب الاتصال بـ Google Drive أولاً");
      return;
    }

    setIsImporting(true);
    // محاكاة جلب الملفات من Drive
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDriveFiles(mockDriveFiles);
    setShowFileImporter(true);
    setIsImporting(false);
    toast.success("تم جلب ملفاتك من Google Drive");
  };

  const handleImportFile = async (file: any) => {
    setIsImporting(true);
    
    // محاكاة استيراد الملف
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsImporting(false);
    toast.success(`تم استيراد ${file.name} بنجاح!`);
  };

  const handleImportSelected = async () => {
    setIsImporting(true);
    
    // محاكاة استيراد جميع الملفات المحددة
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsImporting(false);
    setShowFileImporter(false);
    toast.success("تم استيراد جميع الملفات المحددة!");
  };

  const handleBackup = async () => {
    setIsSyncing(true);
    
    // محاكاة عملية النسخ الاحتياطي
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSyncing(false);
    toast.success("تم إنشاء نسخة احتياطية بنجاح!");
  };

  const handleRestore = async () => {
    setIsSyncing(true);
    
    // محاكاة عملية الاستعادة
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsSyncing(false);
    toast.success("تم استعادة البطاقات من النسخة الاحتياطية!");
  };

  return (
    <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          التكامل السحابي
          {isConnected && <Badge variant="secondary" className="bg-green-100 text-green-800">متصل</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* حالة الاتصال */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <h3 className="font-medium">حالة المزامنة</h3>
              <p className="text-sm text-muted-foreground">آخر مزامنة: {lastSync}</p>
            </div>
          </div>
          <Button 
            onClick={handleSync}
            disabled={isSyncing || !isConnected}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن'}
          </Button>
        </div>

        {/* استيراد الملفات من Google Drive */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FolderOpen className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium">استيراد من Google Drive</h3>
                  <p className="text-sm text-muted-foreground">استورد ملفاتك التعليمية مباشرة</p>
                </div>
              </div>
              <Button 
                onClick={handleBrowseDrive}
                disabled={isImporting || !isConnected}
                className="gap-2"
              >
                <CloudDownload className="h-4 w-4" />
                {isImporting ? 'جاري التحميل...' : 'تصفح الملفات'}
              </Button>
            </div>

            {showFileImporter && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">ملفاتك في Google Drive</h4>
                  <Button 
                    onClick={handleImportSelected}
                    disabled={isImporting}
                    size="sm"
                    className="gap-2"
                  >
                    <CloudDownload className="h-4 w-4" />
                    استيراد المحدد
                  </Button>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {driveFiles.map((file: any) => {
                    const Icon = file.icon;
                    return (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="rounded" />
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size} • {file.modifiedTime}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleImportFile(file)}
                          disabled={isImporting}
                          size="sm"
                          variant="outline"
                        >
                          استيراد
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* مساحة التخزين */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">مساحة التخزين</h3>
            <span className="text-sm text-muted-foreground">
              {storageUsed} MB من {storageLimit} MB
            </span>
          </div>
          <Progress value={(storageUsed / storageLimit) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>البطاقات: 180 MB</span>
            <span>الصور: 45 MB</span>
            <span>الصوت: 20 MB</span>
          </div>
        </div>

        {/* الخدمات السحابية */}
        <div className="space-y-3">
          <h3 className="font-medium">الخدمات السحابية</h3>
          <div className="space-y-2">
            {cloudServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    service.connected ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Cloud className={`h-4 w-4 ${service.connected ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">{service.storage}</p>
                  </div>
                </div>
                <Button
                  variant={service.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleConnect(service.name)}
                  disabled={service.connected}
                >
                  {service.connected ? 'متصل' : 'اتصال'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* الأجهزة المتصلة */}
        <div className="space-y-3">
          <h3 className="font-medium">الأجهزة المتصلة</h3>
          <div className="space-y-2">
            {devices.map((device) => {
              const Icon = device.icon;
              return (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground">آخر مزامنة: {device.lastSync}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.status === "متصل" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                    <span className={`text-sm ${
                      device.status === "متصل" ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* النسخ الاحتياطي والاستعادة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <CloudUpload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-2">النسخ الاحتياطي</h4>
              <p className="text-sm text-muted-foreground mb-3">
                احفظ نسخة من بطاقاتك في السحابة
              </p>
              <Button 
                onClick={handleBackup}
                disabled={isSyncing || !isConnected}
                size="sm" 
                className="w-full"
              >
                إنشاء نسخة احتياطية
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CloudDownload className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-2">الاستعادة</h4>
              <p className="text-sm text-muted-foreground mb-3">
                استعد بطاقاتك من النسخة الاحتياطية
              </p>
              <Button 
                onClick={handleRestore}
                disabled={isSyncing || !isConnected}
                size="sm" 
                variant="outline" 
                className="w-full"
              >
                استعادة البطاقات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* إعدادات المزامنة */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">إعدادات المزامنة التلقائية</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>مزامنة تلقائية عند إضافة بطاقات جديدة</span>
                <div className="w-8 h-4 bg-blue-500 rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>حفظ الصور والملفات الصوتية</span>
                <div className="w-8 h-4 bg-blue-500 rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>مزامنة الإحصائيات والتقدم</span>
                <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CloudIntegration;
