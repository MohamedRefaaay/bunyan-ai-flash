
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Feature {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  component: React.ReactNode;
}

interface FeaturesTabsProps {
  features: Feature[];
}

const FeaturesTabs = ({ features }: FeaturesTabsProps) => {
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 h-auto p-2 bg-white/50 backdrop-blur-sm">
        {features.map((feature) => (
          <TabsTrigger
            key={feature.id}
            value={feature.id}
            className="flex flex-col items-center gap-2 p-2 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            <feature.icon className="h-6 w-6" />
            <span className="text-xs text-center leading-tight">{feature.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {features.map((feature) => (
        <TabsContent key={feature.id} value={feature.id} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <feature.icon className="h-6 w-6 text-blue-600" />
                {feature.title}
              </CardTitle>
              <p className="text-gray-600">{feature.description}</p>
            </CardHeader>
            <CardContent>
              {feature.component}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FeaturesTabs;
