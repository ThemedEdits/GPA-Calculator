"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransitionLink as Link, usePageTransition } from "@/components/ui/PageTransition";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loginWithGoogle, handleAuthError } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const { navigate } = usePageTransition();
  const { user, isLoading: authLoading } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      addToast("Firebase configuration is missing.", "error");
      return;
    }
    
    setisLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast("Successfully logged in!", "success");
      navigate("/dashboard");
    } catch (error: any) {
      addToast(handleAuthError(error), "error");
    } finally {
      setisLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setisLoading(true);
    try {
      await loginWithGoogle();
      addToast("Successfully logged in with Google!", "success");
      navigate("/dashboard");
    } catch (error: any) {
      addToast(handleAuthError(error), "error");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Log in to access your academic records.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--surface)] px-2 text-[var(--text-muted)]">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input 
              id="email"
              label="Email"
              type="email" 
              placeholder="m.student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              id="password"
              label="Password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Log In
            </Button>
          </form>

          <div className="text-center text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--accent)] font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
