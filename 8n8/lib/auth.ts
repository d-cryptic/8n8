// Simple authentication utilities
// In a real app, you'd integrate with Auth0, Supabase, Firebase, etc.

export interface User {
  id: string;
  email: string;
  name: string;
}

export async function getCurrentUser(): Promise<User | null> {
  // Check for authentication token in localStorage/cookies
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function signIn(
  email: string,
  password: string,
): Promise<User | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock user for demo purposes
  const user: User = {
    id: "1",
    email,
    name: email.split("@")[0],
  };

  // Store in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", "mock_token_123");
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
}

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<User | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock user for demo purposes
  const user: User = {
    id: "1",
    email,
    name,
  };

  // Store in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", "mock_token_123");
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
}

export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
}
