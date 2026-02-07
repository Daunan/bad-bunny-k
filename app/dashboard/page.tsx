'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [userData, setUserData] = useState({
        streak: 5,
        xp: 1250,
        level: 'Beginner',
        daysUntilPayment: 3,
    });

    const [showPaywall, setShowPaywall] = useState(false);

    const levels = [
        { name: 'Beginner', icon: '🌱', description: 'Basic greetings & phrases' },
        { name: 'Intermediate', icon: '⭐', description: 'Conversational skills', locked: true },
        { name: 'Advanced', icon: '🔥', description: 'Complex grammar & slang', locked: true },
        { name: 'Business', icon: '💼', description: 'Professional Korean', locked: true },
        { name: 'Grandparent', icon: '👵👴', description: 'Talk with elderly Koreans', locked: true },
    ];

    useEffect(() => {
        // Check if free trial is ending
        if (userData.daysUntilPayment <= 0) {
            setShowPaywall(true);
        }
    }, [userData.daysUntilPayment]);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bad-bunny-card mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                👋 Hello, Learner!
                            </h1>
                            <p className="text-gray-600">
                                {userData.daysUntilPayment > 0
                                    ? `${userData.daysUntilPayment} days left in your free trial`
                                    : '🔒 Subscribe to unlock all features'}
                            </p>
                        </div>
                        <div className="text-6xl">🐰</div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bad-bunny-card">
                        <div className="text-4xl mb-2">🔥</div>
                        <h3 className="text-2xl font-bold text-bunny-pink">{userData.streak} Day Streak</h3>
                        <p className="text-gray-600">Keep it going!</p>
                    </div>
                    <div className="bad-bunny-card">
                        <div className="text-4xl mb-2">⭐</div>
                        <h3 className="text-2xl font-bold text-bunny-purple">{userData.xp} XP</h3>
                        <p className="text-gray-600">Experience Points</p>
                    </div>
                    <div className="bad-bunny-card">
                        <div className="text-4xl mb-2">🎓</div>
                        <h3 className="text-2xl font-bold text-gray-700">{userData.level}</h3>
                        <p className="text-gray-600">Current Level</p>
                    </div>
                </div>

                {/* Level Selection */}
                <div className="bad-bunny-card mb-8">
                    <h2 className="text-3xl font-bold mb-6">Choose Your Level</h2>
                    <div className="space-y-4">
                        {levels.map((level, idx) => (
                            <Link
                                key={idx}
                                href={level.locked ? '#' : `/learn/${level.name.toLowerCase()}`}
                                className={`block p-6 rounded-2xl border-2 transition-all ${level.locked
                                        ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                                        : 'border-bunny-pink hover:bg-bunny-pink/10 hover:scale-102'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-5xl">{level.icon}</span>
                                        <div>
                                            <h3 className="text-2xl font-bold">{level.name}</h3>
                                            <p className="text-gray-600">{level.description}</p>
                                        </div>
                                    </div>
                                    {level.locked && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <span className="text-3xl">🔒</span>
                                            <span className="font-semibold">Subscribe to unlock</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Subscription CTA */}
                <div className="bad-bunny-card bg-gradient-to-r from-bunny-pink to-bunny-purple text-white">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">🎁 Upgrade to Premium</h2>
                        <p className="text-xl mb-6">Unlock all levels + XP boost!</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/subscribe" className="bg-white text-bunny-purple font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                                Monthly: $5/mo
                            </Link>
                            <Link href="/subscribe?plan=yearly" className="bg-white text-bunny-purple font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform relative">
                                <span className="line-through text-gray-400 text-sm absolute -top-5 left-1/2 transform -translate-x-1/2">
                                    $60/year
                                </span>
                                Yearly: $50/year
                                <span className="ml-2 bg-bunny-purple text-white px-2 py-1 rounded-full text-xs">
                                    SAVE $10
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
