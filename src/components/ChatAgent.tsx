import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, FileText, Languages } from 'lucide-react';
import { toast } from 'sonner';
import { VoiceVisualizer } from './VoiceVisualizer';
import { PDFViewer } from './PDFViewer';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'voice';
}

interface ConversationResponse {
  message: string;
  conversation_id: string;
  context?: any;
  meta_data?: any;
  timestamp: string;
}

export const ChatAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHindi, setIsHindi] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string, type: 'text' | 'voice' = 'text') => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9090/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversation_id: conversationId,
          user_id: 'user-001',
          hindi_langauge: isHindi
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data: ConversationResponse = await response.json();
      
      setConversationId(data.conversation_id);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'bot',
        timestamp: new Date(data.timestamp),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Check for customer insights
      await checkCustomerInsights(data.conversation_id);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const checkCustomerInsights = async (convId: string) => {
    try {
      const response = await fetch(`http://localhost:9090/conversations/${convId}/insights`);
      if (response.ok) {
        const insights = await response.json();
        if (insights.filenames && insights.filenames.length > 0) {
          setPdfFiles(insights.filenames);
          toast.success(`Found ${insights.filenames.length} customer insights document(s)`);
        }
      }
    } catch (error) {
      console.error('Error checking insights:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'audio.wav');
      formData.append('conversation_id', conversationId || '');
      formData.append('user_id', 'user-001');
      formData.append('hindi_language', isHindi.toString());

      const response = await fetch('http://localhost:9090/chat/voice', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process voice message');
      }

      const data: ConversationResponse = await response.json();
      
      setConversationId(data.conversation_id);
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
        sender: 'bot',
        timestamp: new Date(data.timestamp),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Add transcribed voice message
      const voiceMessage: Message = {
        id: (Date.now() - 1).toString(),
        content: 'Voice message sent',
        sender: 'user',
        timestamp: new Date(),
        type: 'voice'
      };

      setMessages(prev => [...prev.slice(0, -1), voiceMessage, botMessage]);
      
      await checkCustomerInsights(data.conversation_id);
      
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast.error('Failed to process voice message');
    } finally {
      setIsLoading(false);
    }
  };

  const openPdfViewer = (filename: string) => {
    setSelectedPdf(filename);
    setShowPdfViewer(true);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className={`flex flex-col ${showPdfViewer ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
        {/* Header */}
        <Card className="rounded-none border-x-0 border-t-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                Dealership Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsHindi(!isHindi)}
                  className="flex items-center gap-2"
                >
                  <Languages className="w-4 h-4" />
                  {isHindi ? 'हिंदी' : 'English'}
                </Button>
                {pdfFiles.length > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {pdfFiles.length} Insights
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              <h3 className="text-lg font-medium mb-2">Welcome to the Dealership Assistant</h3>
              <p>Ask me about vehicles, financing, or any other questions you have!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.type === 'voice' && <Mic className="w-3 h-3" />}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Visualizer */}
        {isRecording && (
          <div className="px-4 pb-2">
            <VoiceVisualizer isRecording={isRecording} />
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          {pdfFiles.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {pdfFiles.map((filename, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => openPdfViewer(filename)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-3 h-3" />
                    {filename}
                  </Button>
                ))}
              </div>
              <Separator className="mt-3" />
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isHindi ? "अपना संदेश टाइप करें..." : "Type your message..."}
              disabled={isLoading || isRecording}
              className="flex-1"
            />
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button type="submit" disabled={isLoading || isRecording || !inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* PDF Viewer */}
      {showPdfViewer && selectedPdf && (
        <PDFViewer
          filename={selectedPdf}
          onClose={() => setShowPdfViewer(false)}
        />
      )}
    </div>
  );
};