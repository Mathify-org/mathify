import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Mail, Send, Loader2, ShieldCheck, 
  TrendingUp, Calendar, RefreshCw, CheckCircle2,
  AlertCircle, Sparkles, MessageSquare, Megaphone,
  UserCheck, MailOpen
} from 'lucide-react';

const ADMIN_EMAIL = "support@mathify.org";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const emailTemplates: EmailTemplate[] = [
  { id: 'welcome', name: 'Welcome', description: 'Warm welcome for new users', icon: <Sparkles className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
  { id: 'newsletter', name: 'Newsletter', description: 'Weekly updates and tips', icon: <Mail className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500' },
  { id: 'announcement', name: 'Announcement', description: 'Major updates and news', icon: <Megaphone className="h-5 w-5" />, color: 'from-green-500 to-emerald-500' },
  { id: 'reengagement', name: 'Re-engagement', description: 'Bring back inactive users', icon: <UserCheck className="h-5 w-5" />, color: 'from-amber-500 to-orange-500' },
  { id: 'custom', name: 'Custom', description: 'Write your own content', icon: <MessageSquare className="h-5 w-5" />, color: 'from-gray-500 to-slate-500' },
];

const MarketingAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedSubscribers, setSelectedSubscribers] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string>('newsletter');
  const [emailSubject, setEmailSubject] = useState('');
  const [customHeading, setCustomHeading] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [ctaText, setCtaText] = useState('Visit Mathify');
  const [ctaUrl, setCtaUrl] = useState('https://mathify.org');
  const [sendingTo, setSendingTo] = useState<'users' | 'subscribers' | 'selected'>('subscribers');
  const [isSending, setIsSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Check authorization
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setIsAuthorized(false);
        setIsLoading(false);
      } else {
        setIsAuthorized(true);
        fetchData();
      }
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [usersRes, subscribersRes] = await Promise.all([
        supabase.functions.invoke('admin-get-users'),
        supabase.functions.invoke('admin-get-subscribers'),
      ]);

      if (usersRes.data?.users) {
        setUsers(usersRes.data.users);
      }
      if (subscribersRes.data?.subscribers) {
        setSubscribers(subscribersRes.data.subscribers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(u => u.email)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectAllSubscribers = (checked: boolean) => {
    if (checked) {
      setSelectedSubscribers(new Set(subscribers.filter(s => s.is_active).map(s => s.email)));
    } else {
      setSelectedSubscribers(new Set());
    }
  };

  const toggleUserSelection = (email: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(email)) {
      newSet.delete(email);
    } else {
      newSet.add(email);
    }
    setSelectedUsers(newSet);
  };

  const toggleSubscriberSelection = (email: string) => {
    const newSet = new Set(selectedSubscribers);
    if (newSet.has(email)) {
      newSet.delete(email);
    } else {
      newSet.add(email);
    }
    setSelectedSubscribers(newSet);
  };

  const getRecipients = () => {
    if (sendingTo === 'users') {
      return users.map(u => ({ email: u.email, name: u.first_name || u.display_name || undefined }));
    } else if (sendingTo === 'subscribers') {
      return subscribers.filter(s => s.is_active).map(s => ({ email: s.email }));
    } else {
      const selected = new Set([...selectedUsers, ...selectedSubscribers]);
      return Array.from(selected).map(email => {
        const user = users.find(u => u.email === email);
        return { email, name: user?.first_name || user?.display_name || undefined };
      });
    }
  };

  const handleSendEmails = async () => {
    const recipients = getRecipients();
    
    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please select at least one recipient.",
        variant: "destructive",
      });
      return;
    }

    if (!emailSubject.trim()) {
      toast({
        title: "Missing subject",
        description: "Please enter an email subject.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-send-marketing-email', {
        body: {
          recipients,
          subject: emailSubject,
          templateId: selectedTemplate,
          customContent: {
            heading: customHeading || undefined,
            body: customBody || undefined,
            ctaText: ctaText || undefined,
            ctaUrl: ctaUrl || undefined,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Emails sent!",
        description: `Successfully sent ${data.sent} emails. ${data.failed > 0 ? `${data.failed} failed.` : ''}`,
      });

      // Reset form
      setEmailSubject('');
      setCustomHeading('');
      setCustomBody('');
      setSelectedUsers(new Set());
      setSelectedSubscribers(new Set());
    } catch (error: any) {
      console.error('Error sending emails:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Not authorized view
  if (!isLoading && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <Card className="max-w-md w-full mx-4 border-0 shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
            <p className="text-muted-foreground mb-6">
              This dashboard is only accessible to authorized administrators.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Megaphone className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
              </div>
              <p className="text-purple-100">Manage users, subscribers, and email campaigns</p>
            </div>
            <Button 
              onClick={fetchData} 
              disabled={refreshing}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Total Users</p>
                    <p className="text-3xl font-bold">{users.length}</p>
                  </div>
                  <Users className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Subscribers</p>
                    <p className="text-3xl font-bold">{subscribers.filter(s => s.is_active).length}</p>
                  </div>
                  <MailOpen className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Confirmed Emails</p>
                    <p className="text-3xl font-bold">{users.filter(u => u.email_confirmed_at).length}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Active Today</p>
                    <p className="text-3xl font-bold">
                      {users.filter(u => {
                        if (!u.last_sign_in_at) return false;
                        const lastSignIn = new Date(u.last_sign_in_at);
                        const today = new Date();
                        return lastSignIn.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-0 p-1">
            <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <Mail className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
          </TabsList>

          {/* Email Campaign Tab */}
          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Template Selection */}
              <Card className="lg:col-span-1 bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Email Template</CardTitle>
                  <CardDescription className="text-purple-200">Choose a template for your campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emailTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${template.color} text-white`}>
                          {template.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{template.name}</p>
                          <p className="text-sm text-purple-200">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Email Content */}
              <Card className="lg:col-span-2 bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Email Content</CardTitle>
                  <CardDescription className="text-purple-200">Customize your email message</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Subject Line *</Label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Custom Heading (optional)</Label>
                    <Input
                      value={customHeading}
                      onChange={(e) => setCustomHeading(e.target.value)}
                      placeholder="Override template heading..."
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Custom Body (optional)</Label>
                    <Textarea
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      placeholder="Override template body text..."
                      rows={4}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">CTA Button Text</Label>
                      <Input
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="Button text..."
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      />
                    </div>
                    <div>
                      <Label className="text-white">CTA Button URL</Label>
                      <Input
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        placeholder="https://..."
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      />
                    </div>
                  </div>

                  {/* Recipients Selection */}
                  <div className="pt-4 border-t border-white/10">
                    <Label className="text-white mb-3 block">Send To</Label>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant={sendingTo === 'subscribers' ? 'default' : 'outline'}
                        onClick={() => setSendingTo('subscribers')}
                        className={sendingTo === 'subscribers' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'border-white/20 text-white hover:bg-white/10'}
                      >
                        All Subscribers ({subscribers.filter(s => s.is_active).length})
                      </Button>
                      <Button
                        type="button"
                        variant={sendingTo === 'users' ? 'default' : 'outline'}
                        onClick={() => setSendingTo('users')}
                        className={sendingTo === 'users' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'border-white/20 text-white hover:bg-white/10'}
                      >
                        All Users ({users.length})
                      </Button>
                      <Button
                        type="button"
                        variant={sendingTo === 'selected' ? 'default' : 'outline'}
                        onClick={() => setSendingTo('selected')}
                        className={sendingTo === 'selected' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'border-white/20 text-white hover:bg-white/10'}
                      >
                        Selected Only ({selectedUsers.size + selectedSubscribers.size})
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendEmails}
                    disabled={isSending || !emailSubject.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white py-6 text-lg font-semibold"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending emails...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send to {getRecipients().length} recipients
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">All Users</CardTitle>
                    <CardDescription className="text-purple-200">{users.length} registered users</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedUsers.size === users.length && users.length > 0}
                      onCheckedChange={handleSelectAllUsers}
                      className="border-white/30"
                    />
                    <span className="text-sm text-purple-200">Select all</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-purple-200 w-12"></TableHead>
                        <TableHead className="text-purple-200">Email</TableHead>
                        <TableHead className="text-purple-200">Name</TableHead>
                        <TableHead className="text-purple-200">Joined</TableHead>
                        <TableHead className="text-purple-200">Last Active</TableHead>
                        <TableHead className="text-purple-200">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.has(u.email)}
                              onCheckedChange={() => toggleUserSelection(u.email)}
                              className="border-white/30"
                            />
                          </TableCell>
                          <TableCell className="text-white font-medium">{u.email}</TableCell>
                          <TableCell className="text-purple-200">
                            {u.first_name || u.display_name || '-'}
                          </TableCell>
                          <TableCell className="text-purple-200">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-purple-200">
                            {u.last_sign_in_at 
                              ? new Date(u.last_sign_in_at).toLocaleDateString()
                              : 'Never'}
                          </TableCell>
                          <TableCell>
                            {u.email_confirmed_at ? (
                              <Badge className="bg-green-500/20 text-green-400 border-0">Verified</Badge>
                            ) : (
                              <Badge className="bg-amber-500/20 text-amber-400 border-0">Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Newsletter Subscribers</CardTitle>
                    <CardDescription className="text-purple-200">
                      {subscribers.filter(s => s.is_active).length} active subscribers
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedSubscribers.size === subscribers.filter(s => s.is_active).length && subscribers.length > 0}
                      onCheckedChange={handleSelectAllSubscribers}
                      className="border-white/30"
                    />
                    <span className="text-sm text-purple-200">Select all active</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-purple-200 w-12"></TableHead>
                        <TableHead className="text-purple-200">Email</TableHead>
                        <TableHead className="text-purple-200">Subscribed</TableHead>
                        <TableHead className="text-purple-200">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((s) => (
                        <TableRow key={s.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <Checkbox
                              checked={selectedSubscribers.has(s.email)}
                              onCheckedChange={() => toggleSubscriberSelection(s.email)}
                              disabled={!s.is_active}
                              className="border-white/30"
                            />
                          </TableCell>
                          <TableCell className="text-white font-medium">{s.email}</TableCell>
                          <TableCell className="text-purple-200">
                            {new Date(s.subscribed_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {s.is_active ? (
                              <Badge className="bg-green-500/20 text-green-400 border-0">Active</Badge>
                            ) : (
                              <Badge className="bg-red-500/20 text-red-400 border-0">Unsubscribed</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingAdmin;
