
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Share2, Heart, Download, Search, Star, MessageCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const CommunityModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const communityCards = [
    {
      id: 1,
      title: "أساسيات البرمجة",
      author: "أحمد محمد",
      downloads: 1234,
      rating: 4.8,
      category: "تقنية",
      description: "مجموعة شاملة من البطاقات لتعلم أساسيات البرمجة",
      tags: ["برمجة", "أساسيات", "مبتدئين"],
      cardCount: 50,
      likes: 89
    },
    {
      id: 2,
      title: "قواعد اللغة العربية",
      author: "فاطمة علي",
      downloads: 856,
      rating: 4.9,
      category: "لغة",
      description: "بطاقات تعليمية لقواعد النحو والصرف",
      tags: ["عربي", "نحو", "قواعد"],
      cardCount: 75,
      likes: 156
    },
    {
      id: 3,
      title: "الرياضيات المتقدمة",
      author: "خالد حسن",
      downloads: 692,
      rating: 4.6,
      category: "رياضيات",
      description: "مفاهيم متقدمة في الجبر والهندسة",
      tags: ["رياضيات", "جبر", "هندسة"],
      cardCount: 120,
      likes: 203
    },
    {
      id: 4,
      title: "التاريخ الإسلامي",
      author: "عائشة أحمد",
      downloads: 543,
      rating: 4.7,
      category: "تاريخ",
      description: "أحداث مهمة في التاريخ الإسلامي",
      tags: ["تاريخ", "إسلامي", "أحداث"],
      cardCount: 90,
      likes: 178
    }
  ];

  const categories = [
    { id: "all", name: "الكل", count: 150 },
    { id: "tech", name: "تقنية", count: 45 },
    { id: "language", name: "لغات", count: 32 },
    { id: "math", name: "رياضيات", count: 28 },
    { id: "history", name: "تاريخ", count: 25 },
    { id: "science", name: "علوم", count: 20 }
  ];

  const handleDownload = (cardSet: any) => {
    toast.success(`تم تحميل "${cardSet.title}" بنجاح!`);
  };

  const handleLike = (cardId: number) => {
    toast.success("تم إضافة الإعجاب!");
  };

  const handleShare = (cardSet: any) => {
    navigator.clipboard.writeText(`تحقق من هذه البطاقات الرائعة: ${cardSet.title}`);
    toast.success("تم نسخ رابط المشاركة!");
  };

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          مجتمع التعلم
          <Badge variant="secondary">مشاركة جماعية</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* شريط البحث والفلترة */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن البطاقات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* إحصائيات المجتمع */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">2,547</div>
            <div className="text-sm text-muted-foreground">مجموعة بطاقات</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">45,230</div>
            <div className="text-sm text-muted-foreground">عملية تحميل</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">1,892</div>
            <div className="text-sm text-muted-foreground">مستخدم نشط</div>
          </div>
        </div>

        {/* البطاقات المتاحة */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">البطاقات الأكثر شعبية</h3>
          <div className="grid gap-4">
            {communityCards.map((cardSet) => (
              <Card key={cardSet.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-lg">{cardSet.title}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{cardSet.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-2">{cardSet.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>بواسطة: {cardSet.author}</span>
                        <span>{cardSet.cardCount} بطاقة</span>
                        <span>{cardSet.downloads} تحميل</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {cardSet.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 sm:w-auto w-full">
                      <Button 
                        onClick={() => handleDownload(cardSet)}
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Download className="h-4 w-4" />
                        تحميل
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleLike(cardSet.id)}
                          className="gap-1 flex-1"
                        >
                          <Heart className="h-3 w-3" />
                          {cardSet.likes}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShare(cardSet)}
                          className="gap-1 flex-1"
                        >
                          <Share2 className="h-3 w-3" />
                          مشاركة
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* قسم المساهمة */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Share2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">شارك بطاقاتك مع المجتمع</h3>
            <p className="text-muted-foreground mb-4">
              ساعد الآخرين في التعلم من خلال مشاركة بطاقاتك التعليمية
            </p>
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              رفع بطاقاتي
            </Button>
          </CardContent>
        </Card>

        {/* أحدث التعليقات */}
        <div className="space-y-3">
          <h3 className="font-semibold">أحدث التعليقات</h3>
          <div className="space-y-2">
            {[
              { user: "سارة أحمد", comment: "بطاقات ممتازة ساعدتني كثيراً في الامتحان!", time: "منذ ساعتين" },
              { user: "محمد علي", comment: "شكراً للمؤلف، محتوى مفيد جداً", time: "منذ 4 ساعات" },
              { user: "نور حسن", comment: "أفضل مجموعة بطاقات استخدمتها حتى الآن", time: "منذ يوم" }
            ].map((comment, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border text-sm">
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.user}</span>
                      <span className="text-muted-foreground text-xs">{comment.time}</span>
                    </div>
                    <p className="text-muted-foreground">{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityModule;
