import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Users, MessageSquare, ThumbsUp, ThumbsDown, BarChart3, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import tataLogo from '@/assets/tata-motors-logo.png';

interface ConversationData {
  data: Array<{
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: string;
    type: string;
    metadata?: {
      agent_type?: string;
    };
  }>;
  type: 'good' | 'bad';
  engagement_level?: string;
  primary_interests?: string;
  price_sensitivity?: string;
  decision_stage?: string;
  communication_preference?: string;
  likelihood_to_purchase?: string;
  lead_score?: number;
  next_best_action?: string;
  retargeting_score?: string;
  trust_level?: string;
  segment_affinity?: string;
  preferred_info_channels?: string;
  market_category?: string;
}

interface AdminData {
  folder1: Record<string, ConversationData>;
  folder2: Record<string, ConversationData>;
}

const Admin = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const { toast } = useToast();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9090/admin/get-json-data');
      if (!response.ok) throw new Error('Failed to fetch admin data');
      
      const data = await response.json();
      setAdminData(data);
      toast({
        title: "Data Loaded",
        description: "Admin data fetched successfully.",
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const getInsights = () => {
    if (!adminData) return null;

    const goodConversations = Object.values(adminData.folder1 || {});
    const badConversations = Object.values(adminData.folder2 || {});
    const totalConversations = goodConversations.length + badConversations.length;

    const allConversations = [...goodConversations, ...badConversations];
    
    // Calculate insights
    const avgEngagementLevel = allConversations.reduce((acc, conv) => {
      const messages = Array.isArray(conv.data) ? conv.data : [];
      return acc + messages.length;
    }, 0) / allConversations.length || 0;

    const topInterests = allConversations
      .filter(conv => conv.primary_interests)
      .reduce((acc: Record<string, number>, conv) => {
        const interest = conv.primary_interests!;
        acc[interest] = (acc[interest] || 0) + 1;
        return acc;
      }, {});

    const leadScores = allConversations
      .filter(conv => typeof conv.lead_score === 'number')
      .map(conv => conv.lead_score!);
    
    const avgLeadScore = leadScores.reduce((acc, score) => acc + score, 0) / leadScores.length || 0;

    return {
      totalConversations,
      goodFeedback: goodConversations.length,
      badFeedback: badConversations.length,
      avgEngagementLevel: Math.round(avgEngagementLevel),
      topInterests,
      avgLeadScore: Math.round(avgLeadScore * 100) / 100
    };
  };

  const insights = getInsights();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="h-16 bg-black border-b border-sidebar-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img 
            src={tataLogo} 
            alt="TATA MOTORS" 
            className="h-12 w-auto object-contain" 
          />
          <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
        </div>
        <Button onClick={fetchAdminData} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights?.totalConversations || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{insights?.goodFeedback || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negative Feedback</CardTitle>
              <ThumbsDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{insights?.badFeedback || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Messages per Conversation</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights?.avgEngagementLevel || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="feedback" className="space-y-6">
          <TabsList>
            <TabsTrigger value="feedback">Feedback Data</TabsTrigger>
            <TabsTrigger value="insights">Customer Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
                <CardDescription>
                  View all customer conversations and feedback data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {adminData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Positive Feedback */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <ThumbsUp className="h-5 w-5 text-green-600" />
                          Positive Feedback ({Object.keys(adminData.folder1 || {}).length})
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {Object.entries(adminData.folder1 || {}).map(([filename, conversation]) => (
                            <Card key={filename} className="p-3 hover:bg-muted/50 cursor-pointer"
                                  onClick={() => setSelectedConversation(conversation)}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{filename}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {Array.isArray(conversation.data) ? conversation.data.length : 0} messages
                                  </p>
                                </div>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Negative Feedback */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <ThumbsDown className="h-5 w-5 text-red-600" />
                          Negative Feedback ({Object.keys(adminData.folder2 || {}).length})
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {Object.entries(adminData.folder2 || {}).map(([filename, conversation]) => (
                            <Card key={filename} className="p-3 hover:bg-muted/50 cursor-pointer"
                                  onClick={() => setSelectedConversation(conversation)}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{filename}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {Array.isArray(conversation.data) ? conversation.data.length : 0} messages
                                  </p>
                                </div>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Selected Conversation Details */}
                    {selectedConversation && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            Conversation Details
                            <Badge variant={selectedConversation.type === 'good' ? 'default' : 'destructive'}>
                              {selectedConversation.type}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {selectedConversation.engagement_level && (
                              <div>
                                <p className="text-sm font-medium">Engagement Level</p>
                                <p className="text-sm text-muted-foreground">{selectedConversation.engagement_level}</p>
                              </div>
                            )}
                            {selectedConversation.primary_interests && (
                              <div>
                                <p className="text-sm font-medium">Primary Interests</p>
                                <p className="text-sm text-muted-foreground">{selectedConversation.primary_interests}</p>
                              </div>
                            )}
                            {selectedConversation.decision_stage && (
                              <div>
                                <p className="text-sm font-medium">Decision Stage</p>
                                <p className="text-sm text-muted-foreground">{selectedConversation.decision_stage}</p>
                              </div>
                            )}
                            {selectedConversation.lead_score !== undefined && (
                              <div>
                                <p className="text-sm font-medium">Lead Score</p>
                                <p className="text-sm text-muted-foreground">{selectedConversation.lead_score}</p>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Messages</p>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {Array.isArray(selectedConversation.data) && selectedConversation.data.map((message, index) => (
                                <div key={index} className={`p-3 rounded-lg ${
                                  message.sender === 'user' ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'
                                }`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      {message.sender}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(message.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No data available. Click refresh to load data.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>
                  Analytics and insights from customer interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {insights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Top Customer Interests</h3>
                      <div className="space-y-2">
                        {Object.entries(insights.topInterests).map(([interest, count]) => (
                          <div key={interest} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{interest}</span>
                            <Badge>{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Feedback Distribution</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded">
                          <span className="text-sm flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            Positive
                          </span>
                          <Badge className="bg-green-600">{insights.goodFeedback}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                          <span className="text-sm flex items-center gap-2">
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                            Negative
                          </span>
                          <Badge className="bg-red-600">{insights.badFeedback}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;