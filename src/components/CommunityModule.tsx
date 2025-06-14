
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Share, Star, MessageCircle, Download, Search, CheckCircle, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const CommunityModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [communityDecks] = useState([
    {
      id: 'deck-1',
      title: 'Machine Learning Fundamentals',
      author: 'Dr. Ahmed',
      rating: 4.8,
      downloads: 234,
      cards: 45,
      field: 'Computer Science',
      comments: 12,
      isPublic: true,
      isLiked: false
    },
    {
      id: 'deck-2',
      title: 'Organic Chemistry Basics',
      author: 'Sarah M.',
      rating: 4.9,
      downloads: 189,
      cards: 32,
      field: 'Chemistry',
      comments: 8,
      isPublic: true,
      isLiked: true
    },
    {
      id: 'deck-3',
      title: 'Business Strategy Concepts',
      author: 'Mohamed K.',
      rating: 4.7,
      downloads: 156,
      cards: 28,
      field: 'Business',
      comments: 15,
      isPublic: true,
      isLiked: false
    }
  ]);

  const [userDecks, setUserDecks] = useState([
    {
      id: 'user-deck-1',
      title: 'My AI Lecture Notes',
      cards: 23,
      isShared: false,
      views: 0,
      downloads: 0
    },
    {
      id: 'user-deck-2',
      title: 'Physics Formulas',
      cards: 18,
      isShared: true,
      views: 45,
      downloads: 12
    }
  ]);

  const [downloadedDecks, setDownloadedDecks] = useState<string[]>([]);

  const filteredDecks = communityDecks.filter(deck =>
    deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shareDecks = (deckId: string) => {
    setUserDecks(prev => prev.map(deck => 
      deck.id === deckId ? {...deck, isShared: true} : deck
    ));
    toast.success("📤 Deck shared with community!");
  };

  const downloadDeck = (deckId: string, deckTitle: string) => {
    if (downloadedDecks.includes(deckId)) {
      toast.info("You already downloaded this deck");
      return;
    }
    
    setDownloadedDecks(prev => [...prev, deckId]);
    toast.success(`📥 Downloaded "${deckTitle}" successfully!`);
  };

  const likeDeck = (deckId: string) => {
    toast.success("❤️ Added to favorites!");
  };

  return (
    <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Learning Hub
          <Badge variant="outline">{communityDecks.length} decks available</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="explore" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explore" className="gap-2">
              <Search className="h-4 w-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="mydecks" className="gap-2">
              <Users className="h-4 w-4" />
              My Decks
            </TabsTrigger>
            <TabsTrigger value="downloaded" className="gap-2">
              <Download className="h-4 w-4" />
              Downloaded
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search community decks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredDecks.map((deck) => (
                <div key={deck.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{deck.title}</h4>
                      <p className="text-sm text-muted-foreground">by {deck.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{deck.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{deck.field}</Badge>
                    <span className="text-xs text-muted-foreground">{deck.cards} cards</span>
                    <span className="text-xs text-muted-foreground">{deck.downloads} downloads</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      {deck.comments} comments
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => likeDeck(deck.id)}
                        className="h-6 px-2"
                      >
                        <Heart className={`h-3 w-3 ${deck.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => downloadDeck(deck.id, deck.title)}
                        disabled={downloadedDecks.includes(deck.id)}
                        variant={downloadedDecks.includes(deck.id) ? "outline" : "default"}
                      >
                        {downloadedDecks.includes(deck.id) ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Download className="h-3 w-3 mr-1" />
                        )}
                        {downloadedDecks.includes(deck.id) ? 'Downloaded' : 'Download'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mydecks" className="space-y-3">
            {userDecks.map((deck) => (
              <div key={deck.id} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{deck.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{deck.cards} cards</span>
                      {deck.isShared && (
                        <>
                          <span>{deck.views} views</span>
                          <span>{deck.downloads} downloads</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {deck.isShared ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Shared
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => shareDecks(deck.id)}>
                        <Share className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="downloaded" className="space-y-3">
            {downloadedDecks.length > 0 ? (
              downloadedDecks.map((deckId) => {
                const deck = communityDecks.find(d => d.id === deckId);
                return deck ? (
                  <div key={deck.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{deck.title}</h4>
                        <p className="text-sm text-muted-foreground">by {deck.author} • {deck.cards} cards</p>
                      </div>
                      <Badge variant="outline">Downloaded</Badge>
                    </div>
                  </div>
                ) : null;
              })
            ) : (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No downloaded decks yet</p>
                <p className="text-sm text-muted-foreground">Browse the community to find useful flashcard sets</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunityModule;
