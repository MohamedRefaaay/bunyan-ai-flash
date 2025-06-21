
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Target, Loader2, FileText, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { makeAIRequest, getAIProviderConfig } from '@/utils/aiProviders';
import type { Flashcard } from '@/types/flashcard';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: string;
  canGenerateCard?: boolean;
}

interface AIChatInterfaceProps {
  sessionId: string | null;
  context?: string;
  onFlashcardsGenerated?: (flashcards: Flashcard[]) => void;
}

const AIChatInterface = ({ sessionId, context = '', onFlashcardsGenerated }: AIChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatingCardForMessage, setGeneratingCardForMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '0',
        type: 'ai',
        content: 'مرحباً! أنا مساعدك الذكي في بنيان. يمكنني مساعدتك في فهم المحتوى الذي رفعته وإنشاء بطاقات تعليمية مخصصة. ما هو سؤالك؟',
        timestamp: new Date(),
        canGenerateCard: false
      }]);
    }
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('حدث خطأ في التعرف على الصوت');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('متصفحك لا يدعم التعرف على الصوت');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const config = getAIProviderConfig();
    if (!config) {
      toast.error('يرجى إعداد مفتاح Gemini في الإعدادات أولاً');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const contextPrompt = context 
        ? `بناءً على المحتوى التالي:\n\n${context}\n\nأجب على السؤال التالي: ${inputMessage}`
        : inputMessage;

      const aiResponse = await makeAIRequest(contextPrompt, {
        systemPrompt: `أنت مساعد تعليمي ذكي في منصة "بنيان الذكي". مهمتك:
1. الإجابة على أسئلة الطلاب بناءً على المحتوى المقدم فقط
2. تقديم إجابات واضحة ومفيدة باللغة العربية
3. التركيز على النقاط التعليمية المهمة
4. عدم الخروج عن نطاق المحتوى المتاح
${context ? '5. استخدم المحتوى المرفق كمرجع أساسي للإجابة' : ''}

كن مفيداً وودوداً ومساعداً في التعلم.`
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        context: context,
        canGenerateCard: true
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ في إرسال الرسالة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFlashcard = async (messageId: string, messageContent: string) => {
    if (!onFlashcardsGenerated) {
      toast.error('وظيفة إنشاء البطاقات غير متاحة');
      return;
    }

    const config = getAIProviderConfig();
    if (!config) {
      toast.error('يرجى إعداد مفتاح Gemini في الإعدادات أولاً');
      return;
    }

    setGeneratingCardForMessage(messageId);

    try {
      const cardPrompt = `قم بإنشاء بطاقة تعليمية واحدة من المحتوى التالي:

${messageContent}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
{
  "id": "1",
  "front": "السؤال أو المفهوم",
  "back": "الإجابة أو الشرح التفصيلي",
  "difficulty": "medium",
  "category": "محادثة ذكية",
  "tags": ["بنيان_AI", "محادثة"],
  "source": "AI Chat"
}

تأكد من أن البطاقة تلخص النقطة الرئيسية في المحتوى بطريقة تعليمية فعالة.`;

      const result = await makeAIRequest(cardPrompt, {
        systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية. أجب بصيغة JSON صحيحة فقط.'
      });

      const cleanJson = result.replace(/```json|```/g, '').trim();
      const flashcard = JSON.parse(cleanJson);
      
      // Add signature
      const flashcardWithSignature = {
        ...flashcard,
        back: `${flashcard.back}\n\n📘 تم إنشاؤه بواسطة Bunyan_Anki_AI`,
        created_at: new Date().toISOString()
      };

      onFlashcardsGenerated([flashcardWithSignature]);
      toast.success('تم إنشاء البطاقة التعليمية بنجاح!');
    } catch (error) {
      console.error('Error generating flashcard:', error);
      toast.error('حدث خطأ في إنشاء البطاقة التعليمية');
    } finally {
      setGeneratingCardForMessage(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <MessageCircle className="h-6 w-6" />
          <span>المحادثة الذكية</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 mr-auto">
            مدعوم بـ Gemini
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 gap-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white/50 rounded-lg border border-blue-100">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}>
                  {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {message.type === 'ai' && message.canGenerateCard && (
                    <Button
                      onClick={() => handleGenerateFlashcard(message.id, message.content)}
                      disabled={generatingCardForMessage === message.id}
                      size="sm"
                      className="self-start gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs"
                    >
                      {generatingCardForMessage === message.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          جاري الإنشاء...
                        </>
                      ) : (
                        <>
                          <Target className="h-3 w-3" />
                          🎯 أنشئ بطاقة تعليمية من هذا الرد
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-gray-200 text-gray-800 rounded-lg rounded-bl-none shadow-sm p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">جاري التفكير...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Context Display */}
        {context && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">المحتوى المرجعي:</span>
            </div>
            <p className="text-xs text-blue-700 line-clamp-2">{context.substring(0, 150)}...</p>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اسأل أي سؤال عن المحتوى..."
              className="min-h-[50px] max-h-[120px] resize-none pr-12 text-right"
              dir="rtl"
              disabled={isLoading}
            />
            <Button
              onClick={handleVoiceInput}
              disabled={isLoading}
              size="sm"
              variant="ghost"
              className={`absolute left-2 top-2 h-8 w-8 p-0 ${isListening ? 'text-red-600' : 'text-gray-500'}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          اضغط Enter للإرسال، Shift+Enter لسطر جديد
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatInterface;
