"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { logoutUser } from "@/lib/auth";
import { useToastStore } from "@/hooks/useToast";
import { LogOut, User } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast("Successfully logged out.", "success");
      router.push("/");
    } catch (error) {
      addToast("Error logging out.", "error");
    }
  };

  if (isLoading || !user) return <div className="p-8 text-center text-[var(--text-secondary)]">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Account Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Manage your account details and sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">Email</label>
            <div className="p-3 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-primary)] break-all overflow-hidden">
              {user.email || "No email available"}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <Button variant="danger" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
