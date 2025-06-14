
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, Target, XCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const AnalyticsDashboard = ({ isVisible, onClose }: AnalyticsDashboardProps) => {
  if (!isVisible) return null;

  const studyData = [
    { day: 'الأحد', cards: 12, time: 25 },
    { day: 'الاثنين', cards: 18, time: 35 },
    { day: 'الثلاثاء', cards: 8, time: 15 },
    { day: 'الأربعاء', cards: 22, time: 45 },
    { day: 'الخميس', cards: 15, time: 30 },
    { day: 'الجمعة', cards: 10, time: 20 },
    { day: 'السبت', cards: 14, time: 28 }
  ];

  const difficultyData = [
    { name: 'سهل', value: 45, color: '#22c55e' },
    { name: 'متوسط', value: 35, color: '#eab308' },
    { name: 'صعب', value: 20, color: '#ef4444' }
  ];

  const progressData = [
    { week: 'الأسبوع 1', accuracy: 65 },
    { week: 'الأسبوع 2', accuracy: 72 },
    { week: 'الأسبوع 3', accuracy: 78 },
    { week: 'الأسبوع 4', accuracy: 85 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              لوحة تحليل الأداء
            </h2>
            <Button variant="outline" onClick={onClose}>
              <XCircle className="h-4 w-4" />
              إغلاق
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  إجمالي البطاقات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <Badge variant="secondary" className="mt-1">+23 هذا الأسبوع</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  وقت الدراسة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42 ساعة</div>
                <Badge variant="secondary" className="mt-1">+5.2 ساعات</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  معدل الدقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <Badge variant="secondary" className="mt-1">+7% تحسن</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  أيام متتالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 يوم</div>
                <Badge variant="secondary" className="mt-1">رقم قياسي!</Badge>
              </CardContent>
            </Card>
          </div>

          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* نشاط الدراسة الأسبوعي */}
            <Card>
              <CardHeader>
                <CardTitle>نشاط الدراسة الأسبوعي</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={studyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cards" fill="#3b82f6" name="عدد البطاقات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* توزيع مستوى الصعوبة */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع مستوى الصعوبة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* تطور الأداء */}
            <Card>
              <CardHeader>
                <CardTitle>تطور معدل الدقة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="نسبة الدقة %" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* وقت الدراسة اليومي */}
            <Card>
              <CardHeader>
                <CardTitle>وقت الدراسة اليومي (بالدقائق)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={studyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="time" fill="#8b5cf6" name="الوقت بالدقائق" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* نصائح وتوصيات */}
          <Card>
            <CardHeader>
              <CardTitle>نصائح لتحسين الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">تحسين الذاكرة</h4>
                  <p className="text-blue-700 text-sm">راجع البطاقات الصعبة بشكل أكثر تكراراً لتحسين الاستيعاب</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">الانتظام</h4>
                  <p className="text-green-700 text-sm">حافظ على روتين دراسة يومي لمدة 20-30 دقيقة</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">التنويع</h4>
                  <p className="text-purple-700 text-sm">اخلط بين أنواع البطاقات المختلفة لتحفيز التعلم</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">الراحة</h4>
                  <p className="text-orange-700 text-sm">خذ فترات راحة منتظمة لتجنب الإرهاق الذهني</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
