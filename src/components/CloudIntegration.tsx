
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cloud, CloudDownload, CloudUpload, Smartphone, Monitor, Tablet, Sync, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const CloudIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("منذ 5 دقائق");
  const [storageUsed, setStorageUsed] = useState(245);
  const [storageLimit] = useState(1000);

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
            <Sync className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن'}
          </Button>
        </div>

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
