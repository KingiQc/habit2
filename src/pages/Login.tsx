import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PasswordInput from "@/components/PasswordInput";
import { Icon } from "@iconify/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const success = login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="auth-container animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:fire" width={36} className="text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to track your habits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-secondary text-foreground rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-muted-foreground/30 transition-all placeholder:text-muted-foreground"
          />
          <PasswordInput value={password} onChange={setPassword} />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-foreground text-background font-semibold rounded-xl py-3.5 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-foreground font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
