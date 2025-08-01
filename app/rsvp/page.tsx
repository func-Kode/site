"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { CheckCircle, AlertCircle, Loader2, Mail, User as UserIcon, MessageCircle, Phone, Github, GraduationCap, Target, MapPin, Calendar } from "lucide-react";

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
};

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const existingToast = document.querySelector('[data-toast]');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.setAttribute('data-toast', 'true');
  
  const icon = type === 'success' 
    ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
    : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
  
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${icon}
      <span class="font-medium">${message}</span>
    </div>
  `;
  
  toast.className = `fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-xl backdrop-blur-sm border text-sm font-medium transition-all duration-500 transform translate-y-0 opacity-100 ${
    type === 'success' 
      ? 'bg-green-600/90 border-green-500/50 text-white shadow-green-500/25' 
      : 'bg-red-600/90 border-red-500/50 text-white shadow-red-500/25'
  }`;
  
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.transform = 'translate(-50%, 0) scale(1)';
  });
  
  // Animate out
  setTimeout(() => {
    toast.style.transform = 'translate(-50%, -20px) scale(0.95)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}


function RSVPPageContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  
  const [user, setUser] = useState<User | null>(null);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState<string[]>([]);
  const [attendance, setAttendance] = useState('virtual');
  const [comments, setComments] = useState('');

  const fetchEventData = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) {
        console.error('Error fetching event:', error);
        return;
      }
      
      setEventData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [eventId]);

  useEffect(() => {
    const supabase = createClientComponentClient();
    
    // Fetch user data
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setEmail(data.user?.email || "");
      // Try multiple possible locations for GitHub username
      const githubUsername = data.user?.user_metadata?.user_name || 
                           data.user?.user_metadata?.preferred_username || 
                           data.user?.user_metadata?.github_username ||
                           data.user?.identities?.find(identity => identity.provider === 'github')?.identity_data?.user_name ||
                           data.user?.app_metadata?.provider_username ||
                           "";
      setGithub(githubUsername);
      console.log('User metadata:', data.user?.user_metadata);
      console.log('GitHub username found:', githubUsername);
    });

    // Fetch event data if eventId is provided
    if (eventId) {
      fetchEventData();
    }
  }, [eventId, fetchEventData]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const rsvpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.string().min(1, "Please select your role"),
    goal: z.array(z.string()).min(1, "Please select at least one goal"),
    attendance: z.string().min(1, "Please select attendance type")
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isZodError = (err: unknown): err is z.ZodError => {
    return err instanceof z.ZodError;
  };

  const validateField = (field: string, value: string | string[]) => {
    try {
      if (field === 'name') {
        rsvpSchema.shape.name.parse(value);
      } else if (field === 'email') {
        rsvpSchema.shape.email.parse(value);
      } else if (field === 'phone') {
        rsvpSchema.shape.phone.parse(value);
      } else if (field === 'role') {
        rsvpSchema.shape.role.parse(value);
      } else if (field === 'goal') {
        rsvpSchema.shape.goal.parse(value);
      } else if (field === 'attendance') {
        rsvpSchema.shape.attendance.parse(value);
      }
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error: unknown) {
      if (isZodError(error) && error.issues.length > 0) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      rsvpSchema.parse({ name, email, phone, role, goal, attendance });
    } catch (error: unknown) {
      if (isZodError(error)) {
        const fieldErrors: {[key: string]: string} = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        showToast("Please fix the errors before submitting", "error");
        setLoading(false);
        return;
      }
    }

    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.from('rsvp_responses').insert([
        { 
          name, 
          email, 
          phone, 
          github_username: github, 
          role, 
          goals: goal, 
          attendance_type: attendance, 
          comments: comments || null,
          user_id: user?.id || null,
          event_id: eventId || null
        }
      ]);

      if (error) {
        throw error;
      }

      showToast("RSVP submitted successfully! 🎉", "success");
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setRole("");
      setGoal([]);
      setAttendance('virtual');
      setComments("");
      
      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
      
    } catch (error: unknown) {
      showToast((error as Error).message || "Failed to submit RSVP", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
            Your RSVP has been submitted successfully. We&apos;ll be in touch soon!
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Submit Another RSVP
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto w-full">
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 pb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {eventData ? `RSVP for ${eventData.name}` : 'RSVP Form'}
            </h1>
            <p className="text-muted-foreground">
              {eventData 
                ? `Please fill out the form below to confirm your attendance for ${eventData.name}.`
                : 'Please fill out the form below to confirm your attendance.'
              }
            </p>
            {eventData && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(eventData.date).toLocaleDateString()} at {eventData.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{eventData.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Full Name
              </label>
              <Input
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) validateField('name', e.target.value);
                }}
                onBlur={(e) => validateField('name', e.target.value)}
                className={`transition-all duration-200 ${
                  errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'focus:border-primary focus:ring-primary/20'
                }`}
                required
              />
              {errors.name && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <Input
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) validateField('email', e.target.value);
                }}
                onBlur={(e) => validateField('email', e.target.value)}
                className={`transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'focus:border-primary focus:ring-primary/20'
                }`}
                required
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <Input
                placeholder="Enter your phone number"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) validateField('phone', e.target.value);
                }}
                onBlur={(e) => validateField('phone', e.target.value)}
                className={`transition-all duration-200 ${
                  errors.phone 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'focus:border-primary focus:ring-primary/20'
                }`}
                required
              />
              {errors.phone && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Github Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Github className="w-4 h-4" />
                Github Username
              </label>
              <Input
                placeholder="Enter your GitHub username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="bg-muted/50 text-foreground placeholder:text-muted-foreground"
              />
              {github && (
                <div className="text-xs text-muted-foreground">
                  Connected via GitHub OAuth
                </div>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                I am a
              </label>
              <Select 
                className={`transition-all duration-200 ${
                  errors.role 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'focus:border-primary focus:ring-primary/20'
                }`}
                value={role} 
                onChange={(e) => {
                  setRole(e.target.value);
                  if (errors.role) validateField('role', e.target.value);
                }} 
                onBlur={(e) => validateField('role', e.target.value)}
                required
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="exploring">Exploring</option>
              </Select>
              {errors.role && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role}
                </div>
              )}
            </div>

            {/* Goal Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Goal for this event
              </label>
              <div className="space-y-2">
                {["Networking", "Learning", "Hiring Opportunities", "Just Exploring"].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={goal.includes(option)}
                      onCheckedChange={(checked) => {
                        const newGoal = checked ? [...goal, option] : goal.filter((g) => g !== option);
                        setGoal(newGoal);
                        if (errors.goal) validateField('goal', newGoal);
                      }}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
              {errors.goal && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.goal}
                </div>
              )}
            </div>

            {/* Attendance Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Attendance
              </label>
              <div className="space-y-3">
                {["virtual", "onsite"].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="attendance"
                      value={option}
                      checked={attendance === option}
                      onChange={(e) => setAttendance(e.target.value)}
                      className="w-4 h-4 text-primary border-2 border-muted-foreground/30 focus:ring-primary/20 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {option === "virtual" ? "Virtually" : "Onsite"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comments Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Additional Comments
              </label>
              <Textarea
                placeholder="Enter any additional comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Submit RSVP
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Need help? Contact us at help@example.com</p>
        </div>
      </div>
    </div>
  );
}

export default function RSVPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Loading RSVP...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your registration form.</p>
        </div>
      </div>
    }>
      <RSVPPageContent />
    </Suspense>
  );
}
