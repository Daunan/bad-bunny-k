'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log('Google login success:', result.user);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Google login failed');
            console.error('Google login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            console.log('Email login success:', userCredential.user);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="bad-bunny-card max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🐰</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-bunny-pink to-bunny-purple bg-clip-text text-transparent">
                        Welcome Back!
                    </h1>
                    <p className="text-gray-600 mt-2">Bad Bunny missed you! 😎</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border-2 border-gray-300 rounded-full py-3 px-6 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="text-2xl">🔍</span>
                        {loading ? 'Logging in...' : 'Continue with Google'}
                    </button>

                    <div className="flex items-center gap-4">
                        <hr className="flex-1 border-gray-300" />
                        <span className="text-gray-500">or</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>

                    {/* Email Login */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-bunny-purple focus:outline-none"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-bunny-purple focus:outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bunny-button disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In 🔑'}
                        </button>
                    </form>

                    <div className="text-center">
                        <Link href="/signup" className="text-bunny-purple hover:underline">
                            Don't have an account? Sign up!
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
