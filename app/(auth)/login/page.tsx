"use client"; // Add this line at the top to prevent server-side rendering

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import pb from '@/app/pocketbase';

// Define the LoginPage component
const LoginPage: React.FC = () => {
  // State variables for email, password, and logged-in user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Initialize the router for navigation
  const router = useRouter();

  // Function to handle login logic
  const login = async (email: string, password: string) => {
    try {
      // Create a session with email and password
      const authData = await pb.collection('users').authWithPassword(
        email,
        password
      );
      // Redirect to the browse-tickets page upon successful login
      router.push('/browse');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message to user)
    }
  };

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    await login(email, password); // Call login function
    console.log('Logging in with', { email, password }); // Log the login attempt
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state on change
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on change
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        <a href="/signup" className="text-blue-400 hover:underline">Create account</a>
      </p>
    </div>
  );
};

export default LoginPage; // Export the LoginPage component