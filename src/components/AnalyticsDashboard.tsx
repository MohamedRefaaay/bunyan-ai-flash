
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Brain, Target, Clock, TrendingUp, BookOpen, Award } from "lucide-react";

interface AnalyticsData {
  totalCards: number;
  cardsReviewed: number;
  sessionTime: number;
  accuracy: number;
  topicDistribution: Array<{ topic: string; count: number; accuracy: number }>;
  weeklyProgress: Array<{ day: string; cards: number; reviews: number }>;
  difficultyStats: Array<{ difficulty: string; count: number; color: string }>;
}

interface AnalyticsDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const AnalyticsDashboard = ({ isVisible, onClose }: AnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCards: 0,
    cardsReviewed: 0,
    sessionTime: 0,
    accuracy: 0,
    topicDistribution: [],
    weeklyProgress: [],
    difficultyStats: []
  });

  useEffect(() => {
    if (isVisible) {
      // Load analytics data from localStorage or simulate
      const mockData: AnalyticsData = {
        totalCards: 147,
        cardsReviewed: 89,
        sessionTime: 24,
        accuracy: 78,
        topicDistribution: [
          { topic: "Machine Learning", count: 45, accuracy: 82 },
          { topic: "Data Structures", count: 38, accuracy: 75 },
          { topic: "Algorithms", count: 32, accuracy: 88 },
          { topic: "Databases", count: 32, accuracy: 71 }
        ],
        weeklyProgress: [
          { day: "Mon", cards: 12, reviews: 25 },
          { day: "Tue", cards: 8, reviews: 18 },
          { day: "Wed", cards: 15, reviews: 32 },
          { day: "Thu", cards: 6, reviews: 14 },
          { day: "Fri", cards: 20, reviews: 40 },
          { day: "Sat", cards: 10, reviews: 22 },
          { day: "Sun", cards: 5, reviews: 8 }
        ],
        difficultyStats: [
          { difficulty: "Easy", count: 54, color: "#22c55e" },
          { difficulty: "Medium", count: 67, color: "#f59e0b" },
          { difficulty: "Hard", count: 26, color: "#ef4444" }
        ]
      };
      setAnalytics(mockData);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              Learning Analytics
            </h2>
            <p className="text-muted-foreground">Track your study progress and performance</p>
          </div>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalCards}</div>
                    <p className="text-xs text-muted-foreground">+12 from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cards Reviewed</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.cardsReviewed}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((analytics.cardsReviewed / analytics.totalCards) * 100)}% completion
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.sessionTime}h</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.accuracy}%</div>
                    <p className="text-xs text-muted-foreground">+5% from last week</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={analytics.difficultyStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="count"
                          label={({ difficulty, count }) => `${difficulty}: ${count}`}
                        >
                          {analytics.difficultyStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={analytics.weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cards" fill="#8884d8" name="Cards Created" />
                        <Bar dataKey="reviews" fill="#82ca9d" name="Reviews" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Topic Performance</CardTitle>
                  <CardDescription>Your accuracy and progress by subject</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.topicDistribution.map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{topic.topic}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{topic.count} cards</Badge>
                          <Badge variant={topic.accuracy >= 80 ? "default" : "secondary"}>
                            {topic.accuracy}% accuracy
                          </Badge>
                        </div>
                      </div>
                      <Progress value={topic.accuracy} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cards" fill="#8884d8" name="Cards Created" />
                      <Bar dataKey="reviews" fill="#82ca9d" name="Reviews Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Focus on Database Topics
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Your accuracy in database topics is 71%. Consider reviewing SQL joins and normalization concepts.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                        Great Progress in Algorithms
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        88% accuracy! You're excelling here. Try more advanced algorithm challenges.
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                        Review Schedule Suggestion
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        Based on spaced repetition, review 15 cards from Machine Learning tomorrow.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
