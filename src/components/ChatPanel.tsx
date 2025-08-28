import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mic, Send, RotateCcw, Edit, Check, X, TrendingUp } from 'lucide-react';
import { VoiceVisualizer } from './VoiceVisualizer';
import { SuggestedQuestions } from './SuggestedQuestions';
import { EditableMessage } from './EditableMessage';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'voice';
  isEditing?: boolean;
}

interface ChatPanelProps {
  onPdfSelect: (filename: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onPdfSelect }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [isHindi, setIsHindi] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const suggestedQuestions = [
    "What cars do you have available under $25,000?",
    "Can you help me compare financing options for a new SUV?", 
    "What's the trade-in value of my 2018 Honda Civic?",
    "Do you have any certified pre-owned BMW vehicles?",
    "What are the current lease deals on electric vehicles?",
    "Can you show me cars with the best fuel economy?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string, type: 'text' | 'voice' = 'text', retryMessageId?: string) => {
    if (!content.trim()) return;

    // If this is a retry, remove the failed message and its response
    if (retryMessageId) {
      setMessages(prev => {
        const messageIndex = prev.findIndex(m => m.id === retryMessageId);
        if (messageIndex !== -1) {
          return prev.slice(0, messageIndex);
        }
        return prev;
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('http://localhost:9090/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversation_id: conversationId,
          hindi_langauge: isHindi
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(data.conversation_id);

      // Check for customer insights
      if (data.conversation_id) {
        checkCustomerInsights(data.conversation_id);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
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
          // Auto-select the first PDF
          onPdfSelect(insights.filenames[0]);
        }
      }
    } catch (error) {
      console.error('Error checking insights:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setAudioData([]);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'audio.wav');
    formData.append('hindi_language', isHindi.toString());
    if (conversationId) {
      formData.append('conversation_id', conversationId);
    }

    try {
      const response = await fetch('http://localhost:9090/chat/voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to send voice message');

      const data = await response.json();
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content: data.transcribed_text || 'Voice message',
        sender: 'user',
        timestamp: new Date(),
        type: 'voice'
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setConversationId(data.conversation_id);

      if (data.conversation_id) {
        checkCustomerInsights(data.conversation_id);
      }

    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Error",
        description: "Failed to send voice message",
        variant: "destructive",
      });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setShowFollowUp(true);
    }
  };

  const handleFollowUpQuestion = () => {
    const followUpPrompt = `Based on this text: "${selectedText}", can you provide more details or analysis?`;
    sendMessage(followUpPrompt);
    setShowFollowUp(false);
    setSelectedText('');
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, content: newContent, isEditing: false } : msg
      )
    );
    // Resend the edited message
    sendMessage(newContent, 'text', messageId);
  };

  const toggleEdit = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isEditing: !msg.isEditing } : msg
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Car Sales & Financing Assistant</h2>
          <p className="text-sm text-muted-foreground">
            I can help you find the perfect car, explore financing options, and answer questions about our inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isHindi ? "default" : "outline"}
            size="sm"
            onClick={() => setIsHindi(!isHindi)}
          >
            {isHindi ? "Hindi" : "English"}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" onMouseUp={handleTextSelection}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
              {message.isEditing ? (
                <EditableMessage
                  content={message.content}
                  onSave={(newContent) => handleEditMessage(message.id, newContent)}
                  onCancel={() => toggleEdit(message.id)}
                />
              ) : (
                <Card className={`p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">{message.content}</p>
                    {message.sender === 'user' && (
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleEdit(message.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => sendMessage(message.content, 'text', message.id)}
                          className="h-6 w-6 p-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="p-3 bg-card">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Follow-up dialog */}
      {showFollowUp && (
        <div className="mx-4 mb-2">
          <Card className="p-3 bg-accent">
            <div className="flex items-center justify-between">
              <p className="text-sm">Ask a follow-up question about: "{selectedText.slice(0, 50)}..."</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleFollowUpQuestion}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowFollowUp(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Suggested Questions */}
      <SuggestedQuestions
        questions={suggestedQuestions}
        onQuestionSelect={sendMessage}
      />

      {/* Voice Visualizer */}
      {isRecording && (
        <div className="mx-4 mb-2">
          <VoiceVisualizer isRecording={isRecording} audioData={audioData} />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cars, financing, trade-ins, or our inventory..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              size="icon"
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-destructive' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};