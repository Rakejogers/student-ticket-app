"use client"; // Add this line at the top to prevent server-side rendering

import React, { useState } from 'react';
import { account, ID } from '../../../app/appwrite';
import { useRouter } from 'next/navigation';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isStuEmail, setIsStuEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password === e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!e.target.value.endsWith(".edu")) {
      console.log("not stu email")
      setIsStuEmail(false)
    }
    else {
      setIsStuEmail(true)
    }
  };

  const router = useRouter(); // Move this outside of the login function

  const login = async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setLoggedInUser(user);
      router.push('/browse'); // Ensure this is called after successful login
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message to user)
    }
  };

  const register = async () => {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password); // Ensure login is called after registration
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error (e.g., show error message to user)
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert('Passwords do not match');
      return;
    }
    // New validation for .edu email
    if (!email.endsWith('.edu')) {
      alert('Please use a valid student email ending with .edu');
      return;
    }
    register();
  };

  const passwordInputClass = `w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none ${
    passwordsMatch ? 'focus:ring-2 focus:ring-blue-500' : 'border-2 border-red-500'
  }`;

  const buttonClass = `w-full py-3 rounded-lg font-medium transition-colors ${
    passwordsMatch&&isStuEmail ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white cursor-not-allowed'
  }`;

    const emailClass = `w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none ${
    isStuEmail ? 'focus:ring-2 focus:ring-blue-500' : 'border-2 border-red-500'
  }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <form onSubmit={handleSignUp} className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
      <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Student Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className={emailClass}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className={passwordInputClass}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={passwordInputClass}
            required
          />
        </div>
        <button
          type="submit"
          className={buttonClass}
          //disabled when passwordsMatch or isStuEmail is false
          disabled={!passwordsMatch || !isStuEmail}
        //says Sign up if passwordsMatch and isStuEmail is true
        //says Passwords Do Not Match if passwordsMatch is false
        //says Not a student email if isStuEmail is false
        >
          {passwordsMatch && isStuEmail ? 'Sign Up' : !passwordsMatch ? 'Passwords Do Not Match' : 'Not a student email'}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;