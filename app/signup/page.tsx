'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        birthDate: '',
        country: '',
    });

    const countries = [
        { code: 'vi', name: 'Vietnam', flag: '🇻🇳', lang: 'Vietnamese' },
        { code: 'de', name: 'Germany', flag: '🇩🇪', lang: 'German' },
        { code: 'es', name: 'Spain', flag: '🇪🇸', lang: 'Spanish' },
        { code: 'us', name: 'USA', flag: '🇺🇸', lang: 'English' },
        { code: 'cn', name: 'China', flag: '🇨🇳', lang: 'Chinese' },
        { code: 'ru', name: 'Russia', flag: '🇷🇺', lang: 'Russian' },
        { code: 'mn', name: 'Mongolia', flag: '🇲🇳', lang: 'Mongolian' },
        { code: 'th', name: 'Thailand', flag: '🇹🇭', lang: 'Thai' },
        { code: 'id', name: 'Indonesia', flag: '🇮🇩', lang: 'Indonesian' },
        { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', lang: 'Arabic' },
    ];

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log('Google signup success:', result.user);
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Google signup failed');
            console.error('Google signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            console.log('Email signup success:', userCredential.user);
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Signup failed');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOnboarding = (e: React.FormEvent) => {
        e.preventDefault();
        // Save to localStorage for demo
        localStorage.setItem('userCountry', formData.country);
        localStorage.setItem('userBirthDate', formData.birthDate);
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="bad-bunny-card max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🐰</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-bunny-pink to-bunny-purple bg-clip-text text-transparent">
                        {step === 1 ? 'Join Bad Bunny K' : 'Tell Me About Yourself!'}
                    </h1>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <div className="space-y-6">
                        {/* Google Signup */}
                        <button
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="w-full bg-white border-2 border-gray-300 rounded-full py-3 px-6 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-2xl">🔍</span>
                            {loading ? 'Signing up...' : 'Continue with Google'}
                        </button>

                        <div className="flex items-center gap-4">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500">or</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>

                        {/* Email Signup */}
                        <form onSubmit={handleEmailSignup} className="space-y-4">
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
                                    minLength={6}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-bunny-purple focus:outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bunny-button disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account 🚀'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <form onSubmit={handleOnboarding} className="space-y-6">
                        {/* Birth Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Birth Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-bunny-purple focus:outline-none"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                        </div>

                        {/* Country Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Your Country
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {countries.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, country: country.code })}
                                        className={`p-4 rounded-xl border-2 transition-all ${formData.country === country.code
                                            ? 'border-bunny-purple bg-bunny-purple/10 scale-95'
                                            : 'border-gray-300 hover:border-bunny-pink'
                                            }`}
                                    >
                                        <div className="text-3xl mb-1">{country.flag}</div>
                                        <div className="text-sm font-semibold">{country.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!formData.birthDate || !formData.country}
                            className="w-full bunny-button disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Let's Start Learning! 🎓
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
