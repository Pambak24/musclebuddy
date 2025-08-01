import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Activity, Settings, Search, UserPlus, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ExercisePlanDisplay } from "@/components/ExercisePlanDisplay";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'trainer' | 'client';
  created_at: string;
}

interface ExercisePlan {
  id: string;
  user_id: string;
  client_name: string;
  client_data: string;
  exercise_plan: any;
  created_at: string;
  updated_at: string;
}

interface Examination {
  id: string;
  user_id: string;
  description: string;
  diagnosis: any;
  status: string;
  media_urls: string[];
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [exercisePlans, setExercisePlans] = useState<ExercisePlan[]>([]);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Fetch all exercise plans
      const { data: plansData, error: plansError } = await supabase
        .from('exercise_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setExercisePlans(plansData || []);

      // Fetch all examinations
      const { data: examinationsData, error: examinationsError } = await supabase
        .from('examinations')
        .select('*')
        .order('created_at', { ascending: false });

      if (examinationsError) throw examinationsError;
      setExaminations(examinationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'trainer' | 'client') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (profile.full_name && profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || profile.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const selectedClient = selectedClientId ? profiles.find(p => p.user_id === selectedClientId) : null;
  const clientExercisePlans = selectedClientId ? exercisePlans.filter(p => p.user_id === selectedClientId) : [];
  const clientExaminations = selectedClientId ? examinations.filter(e => e.user_id === selectedClientId) : [];

  // Find John Doe automatically
  const johnDoe = profiles.find(p => p.full_name?.toLowerCase().includes('john doe') || p.email?.toLowerCase().includes('john'));
  
  const clients = profiles.filter(p => p.role === 'client');

  const stats = {
    totalClients: profiles.filter(p => p.role === 'client').length,
    totalTrainers: profiles.filter(p => p.role === 'trainer').length,
    totalAdmins: profiles.filter(p => p.role === 'admin').length,
    totalUsers: profiles.length,
    totalExercisePlans: exercisePlans.length,
    totalExaminations: examinations.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card text-card-foreground shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Muscle Buddy Management</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline">Back to App</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trainers</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTrainers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exercise Plans</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExercisePlans}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Examinations</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExaminations}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="client-files" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="client-files" className="text-xs sm:text-sm">Client Files</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm">User Management</TabsTrigger>
            <TabsTrigger value="exercise-plans" className="text-xs sm:text-sm">Exercise Plans</TabsTrigger>
            <TabsTrigger value="examinations" className="text-xs sm:text-sm">Examinations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client-files">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Files</CardTitle>
                  <CardDescription>
                    View individual client data and history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.user_id} value={client.user_id}>
                            {client.full_name || client.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {johnDoe && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedClientId(johnDoe.user_id)}
                        className="text-primary"
                      >
                        Quick Select: John Doe
                      </Button>
                    )}
                  </div>

                  {selectedClient && (
                    <div className="space-y-6">
                      {/* Client Profile */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Client Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <strong>Name:</strong> {selectedClient.full_name || 'Not set'}
                            </div>
                            <div className="break-all">
                              <strong>Email:</strong> {selectedClient.email}
                            </div>
                            <div>
                              <strong>Role:</strong> <Badge>{selectedClient.role}</Badge>
                            </div>
                            <div>
                              <strong>Joined:</strong> {new Date(selectedClient.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Exercise Plans */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Exercise Plans ({clientExercisePlans.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {clientExercisePlans.length > 0 ? (
                            <div className="space-y-4">
                              {clientExercisePlans.map((plan) => (
                                <div key={plan.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{plan.client_name}</h4>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(plan.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                   <div className="bg-muted p-3 rounded-lg">
                                     <button 
                                       className="w-full text-left text-primary hover:underline text-sm font-medium mb-2"
                                       onClick={() => {
                                         const newExpanded = new Set(expandedPlans);
                                         if (newExpanded.has(plan.id)) {
                                           newExpanded.delete(plan.id);
                                         } else {
                                           newExpanded.add(plan.id);
                                         }
                                         setExpandedPlans(newExpanded);
                                       }}
                                     >
                                       {expandedPlans.has(plan.id) ? '▼ Hide Exercise Plan' : '▶ View Exercise Plan'}
                                     </button>
                                     {expandedPlans.has(plan.id) && (
                                       <div className="space-y-3">
                                         <div>
                                           <strong className="text-sm">Client Data:</strong>
                                           <div className="text-sm text-muted-foreground mt-1 bg-background p-3 rounded max-h-32 overflow-y-auto">
                                             {plan.client_data}
                                           </div>
                                         </div>
                                          <div>
                                            <strong className="text-sm">Generated Plan:</strong>
                                            <div className="mt-2 p-3 bg-background rounded border max-h-96 overflow-y-auto">
                                              <ExercisePlanDisplay exercisePlan={plan.exercise_plan} />
                                            </div>
                                          </div>
                                       </div>
                                     )}
                                   </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No exercise plans found for this client.</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Examinations */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Posture & Gait Analysis ({clientExaminations.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {clientExaminations.length > 0 ? (
                            <div className="space-y-4">
                              {clientExaminations.map((exam) => (
                                <div key={exam.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant={exam.status === 'completed' ? 'default' : 'secondary'}>
                                        {exam.status}
                                      </Badge>
                                      {exam.diagnosis?.urgencyLevel && (
                                        <Badge variant={
                                          exam.diagnosis.urgencyLevel === 'high' ? 'destructive' : 
                                          exam.diagnosis.urgencyLevel === 'medium' ? 'default' : 'secondary'
                                        }>
                                          {exam.diagnosis.urgencyLevel} urgency
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(exam.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div>
                                      <strong>Description:</strong>
                                      <p className="text-sm text-muted-foreground">{exam.description || 'No description provided'}</p>
                                    </div>
                                    
                                    {exam.diagnosis && (
                                      <div className="space-y-2">
                                        <div>
                                          <strong>Assessment:</strong>
                                          <p className="text-sm text-muted-foreground">{exam.diagnosis.assessment}</p>
                                        </div>
                                        
                                        {exam.diagnosis.findings && exam.diagnosis.findings.length > 0 && (
                                          <div>
                                            <strong>Key Findings:</strong>
                                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                                              {exam.diagnosis.findings.map((finding: string, index: number) => (
                                                <li key={index}>{finding}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        {exam.diagnosis.recommendations && exam.diagnosis.recommendations.length > 0 && (
                                          <div>
                                            <strong>Recommendations:</strong>
                                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                                              {exam.diagnosis.recommendations.map((rec: string, index: number) => (
                                                <li key={index}>{rec}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        {exam.diagnosis.nextSteps && (
                                          <div>
                                            <strong>Next Steps:</strong>
                                            <p className="text-sm text-muted-foreground">{exam.diagnosis.nextSteps}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {exam.media_urls && exam.media_urls.length > 0 && (
                                      <div>
                                        <strong>Media Files:</strong>
                                        <p className="text-sm text-muted-foreground">{exam.media_urls.length} file(s) uploaded</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No examinations found for this client.</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {!selectedClient && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Select a client to view their complete file</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage all users and their roles
                </CardDescription>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="client">Clients</SelectItem>
                      <SelectItem value="trainer">Trainers</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProfiles.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell>{profile.full_name || "No name set"}</TableCell>
                            <TableCell>{profile.email}</TableCell>
                            <TableCell>
                              <Badge variant={profile.role === 'admin' ? 'destructive' : profile.role === 'trainer' ? 'default' : 'secondary'}>
                                {profile.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(profile.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={profile.role}
                                onValueChange={(value: 'admin' | 'trainer' | 'client') => updateUserRole(profile.user_id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="trainer">Trainer</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredProfiles.map((profile) => (
                      <Card key={profile.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{profile.full_name || "No name set"}</h3>
                                <p className="text-sm text-muted-foreground break-all">{profile.email}</p>
                              </div>
                              <Badge variant={profile.role === 'admin' ? 'destructive' : profile.role === 'trainer' ? 'default' : 'secondary'}>
                                {profile.role}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Joined: {new Date(profile.created_at).toLocaleDateString()}
                              </span>
                              <Select
                                value={profile.role}
                                onValueChange={(value: 'admin' | 'trainer' | 'client') => updateUserRole(profile.user_id, value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="trainer">Trainer</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercise-plans">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Plans</CardTitle>
                <CardDescription>
                  View all generated exercise plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Plan Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exercisePlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.client_name}</TableCell>
                        <TableCell>{new Date(plan.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <details className="cursor-pointer">
                            <summary className="text-primary hover:underline">View Plan</summary>
                            <div className="mt-2 p-4 bg-muted rounded space-y-2">
                              <div>
                                <strong>Client Data:</strong>
                                <p className="text-sm text-muted-foreground mt-1">{plan.client_data.substring(0, 200)}...</p>
                              </div>
                               <div>
                                 <strong>Exercise Plan:</strong>
                                 <div className="mt-2 p-4 bg-background rounded border max-h-96 overflow-y-auto">
                                   <ExercisePlanDisplay exercisePlan={plan.exercise_plan} />
                                 </div>
                               </div>
                            </div>
                          </details>
                        </TableCell>
                      </TableRow>
                    ))}
                    {exercisePlans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No exercise plans found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examinations">
            <Card>
              <CardHeader>
                <CardTitle>Posture & Gait Analysis</CardTitle>
                <CardDescription>
                  View all examination results and AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Analysis Results</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examinations.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{new Date(exam.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={exam.status === 'completed' ? 'default' : 'secondary'}>
                            {exam.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{exam.description || 'No description'}</TableCell>
                        <TableCell>
                          <details className="cursor-pointer">
                            <summary className="text-primary hover:underline">View Analysis</summary>
                            <div className="mt-2 p-4 bg-muted rounded space-y-2 max-w-lg">
                              {exam.diagnosis && (
                                <>
                                  <div>
                                    <strong>Assessment:</strong>
                                    <p className="text-sm text-muted-foreground mt-1">{exam.diagnosis.assessment || 'No assessment available'}</p>
                                  </div>
                                  <div>
                                    <strong>Urgency:</strong>
                                    <Badge variant={exam.diagnosis.urgencyLevel === 'high' ? 'destructive' : exam.diagnosis.urgencyLevel === 'medium' ? 'default' : 'secondary'} className="ml-2">
                                      {exam.diagnosis.urgencyLevel || 'Unknown'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <strong>Key Findings:</strong>
                                    <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                                      {exam.diagnosis.findings?.map((finding: string, index: number) => (
                                        <li key={index}>{finding}</li>
                                      )) || <li>No findings available</li>}
                                    </ul>
                                  </div>
                                  <div>
                                    <strong>Recommendations:</strong>
                                    <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                                      {exam.diagnosis.recommendations?.map((rec: string, index: number) => (
                                        <li key={index}>{rec}</li>
                                      )) || <li>No recommendations available</li>}
                                    </ul>
                                  </div>
                                </>
                              )}
                              {exam.media_urls && exam.media_urls.length > 0 && (
                                <div>
                                  <strong>Media Files:</strong>
                                  <p className="text-sm text-muted-foreground">{exam.media_urls.length} file(s) uploaded</p>
                                </div>
                              )}
                            </div>
                          </details>
                        </TableCell>
                      </TableRow>
                    ))}
                    {examinations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No examinations found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;