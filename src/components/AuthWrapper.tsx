import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export function AuthWrapper() {
  const [isSignupMode, setIsSignupMode] = useState(false);

  if (isSignupMode) {
    return <SignupForm onSwitchToLogin={() => setIsSignupMode(false)} />;
  }

  return <LoginForm onSwitchToSignup={() => setIsSignupMode(true)} />;
}