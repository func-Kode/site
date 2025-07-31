"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Github, 
  GraduationCap, 
  Target, 
  MapPin, 
  MessageCircle,
  Search,
  Filter,
  Download
} from "lucide-react";

interface RSVPResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  github_username: string;
  role: string;
  goals: string[];
  attendance_type: string;
  comments: string | null;
  created_at: string;
  user_id: string | null;
}

const ADMIN_EMAILS = ["vvs.pedapati@rediffmail.com"];
const ADMIN_GITHUB_USERNAMES = ["basanth-pedapati"];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvpResponses, setRsvpResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");

  useEffect(() => {
    const supabase = createClientComponentClient();
    
    // Check authentication and admin status
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      const userEmail = data.user?.email;
      const githubUsername = data.user?.user_metadata?.github_username;
      
      const isUserAdmin = ADMIN_EMAILS.includes(userEmail || "") || 
                         ADMIN_GITHUB_USERNAMES.includes(githubUsername || "");
      
      setIsAdmin(isUserAdmin);
      
      if (isUserAdmin) {
        fetchRSVPResponses();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const fetchRSVPResponses = async () => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching RSVP responses:', error);
        return;
      }

      setRsvpResponses(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = rsvpResponses.filter((response) => {
    const matchesSearch = response.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.github_username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || response.role === roleFilter;
    const matchesAttendance = attendanceFilter === "all" || response.attendance_type === attendanceFilter;
    
    return matchesSearch && matchesRole && matchesAttendance;
  });

  const exportToCSV = () => {
    const csvHeaders = [
      "Name", "Email", "Phone", "GitHub Username", "Role", "Goals", 
      "Attendance Type", "Comments", "Submitted At"
    ];
    
    const csvData = filteredResponses.map(response => [
      response.name,
      response.email,
      response.phone,
      response.github_username,
      response.role,
      response.goals.join("; "),
      response.attendance_type,
      response.comments || "",
      new Date(response.created_at).toLocaleString()
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <UserX className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the admin dashboard.</p>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <UserX className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this admin dashboard.
          </p>
        </Card>
      </div>
    );
  }

  const stats = {
    total: rsvpResponses.length,
    virtual: rsvpResponses.filter(r => r.attendance_type === 'virtual').length,
    onsite: rsvpResponses.filter(r => r.attendance_type === 'onsite').length,
    students: rsvpResponses.filter(r => r.role === 'student').length,
    professionals: rsvpResponses.filter(r => r.role === 'professional').length,
    exploring: rsvpResponses.filter(r => r.role === 'exploring').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and view RSVP responses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Virtual</p>
                <p className="text-2xl font-bold">{stats.virtual}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Onsite</p>
                <p className="text-2xl font-bold">{stats.onsite}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{stats.students}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Professionals</p>
                <p className="text-2xl font-bold">{stats.professionals}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-sm text-muted-foreground">Exploring</p>
                <p className="text-2xl font-bold">{stats.exploring}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or GitHub username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="professional">Professionals</option>
                <option value="exploring">Exploring</option>
              </Select>
              
              <Select value={attendanceFilter} onChange={(e) => setAttendanceFilter(e.target.value)}>
                <option value="all">All Attendance</option>
                <option value="virtual">Virtual</option>
                <option value="onsite">Onsite</option>
              </Select>
            </div>
            
            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </Card>

        {/* RSVP Responses */}
        <div className="grid gap-6">
          {filteredResponses.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No RSVP responses found</h3>
              <p className="text-muted-foreground">
                {rsvpResponses.length === 0 
                  ? "No one has submitted an RSVP yet." 
                  : "Try adjusting your search or filter criteria."}
              </p>
            </Card>
          ) : (
            filteredResponses.map((response) => (
              <Card key={response.id} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{response.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(response.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={response.attendance_type === 'virtual' ? 'secondary' : 'default'}>
                          {response.attendance_type === 'virtual' ? 'Virtual' : 'Onsite'}
                        </Badge>
                        <Badge variant="outline">
                          {response.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{response.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{response.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{response.github_username || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Goals for this event:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {response.goals.map((goal, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {response.comments && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Additional Comments:</span>
                        </div>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          {response.comments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Show filtered count */}
        {filteredResponses.length > 0 && filteredResponses.length !== rsvpResponses.length && (
          <div className="text-center mt-6 text-sm text-muted-foreground">
            Showing {filteredResponses.length} of {rsvpResponses.length} responses
          </div>
        )}
      </div>
    </div>
  );
}
