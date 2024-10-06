"use client"; // Add this line at the top to prevent server-side rendering

import React, { useState } from 'react';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signing up with', { email, password });
  };

  const passwordInputClass = `w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none ${
    passwordsMatch ? 'focus:ring-2 focus:ring-blue-500' : 'border-2 border-red-500'
  }`;

  const buttonClass = `w-full py-3 rounded-lg font-medium transition-colors ${
    passwordsMatch ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white cursor-not-allowed'
  }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <form onSubmit={handleSignUp} className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Student Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          disabled={!passwordsMatch}
        >
          {passwordsMatch ? 'Sign Up' : 'Passwords Do Not Match'}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;