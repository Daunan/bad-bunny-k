'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="bad-bunny-card max-w-4xl w-full text-center">
                {/* Bunny Character Header */}
                <div className="mb-8">
                    <div className="text-8xl mb-4 animate-bounce">🐰</div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-bunny-pink to-bunny-purple bg-clip-text text-transparent mb-4">
                        Bad Bunny K
                    </h1>
                    <p className="text-2xl text-gray-700 font-medium">
                        Learn Korean with attitude! 😎
                    </p>
                </div>

                {/* Value Proposition */}
                <div className="mb-10 space-y-4">
                    <p className="text-xl text-gray-600">
                        Tired of boring language apps? Meet your new sassy Korean teacher!
                    </p>
                    <p className="text-lg text-bunny-purple font-semibold">
                        ✨ Game-based learning • 🎤 Voice recognition • 😈 Teasing feedback
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {[
                        { icon: '🎮', title: 'Gamified', desc: 'Streaks, XP, Leaderboards' },
                        { icon: '🌍', title: '10 Languages', desc: 'Learn in your native language' },
                        { icon: '😈', title: 'Sassy AI', desc: 'Playful teasing when you mess up' },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setHoveredFeature(idx)}
                            onMouseLeave={() => setHoveredFeature(null)}
                            className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer ${hoveredFeature === idx
                                    ? 'bg-gradient-to-br from-bunny-pink to-bunny-purple text-white scale-105'
                                    : 'bg-bunny-white'
                                }`}
                        >
                            <div className="text-5xl mb-3">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className={hoveredFeature === idx ? 'text-white' : 'text-gray-600'}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Pricing Teaser */}
                <div className="bg-gradient-to-r from-bunny-pink/20 to-bunny-purple/20 rounded-2xl p-6 mb-8">
                    <p className="text-lg font-semibold mb-2">🎁 3 Days FREE Trial</p>
                    <p className="text-gray-700">
                        Then <span className="font-bold">$5/month</span> or <span className="font-bold text-bunny-purple">$50/year</span>{' '}
                        <span className="line-through text-gray-400">$60</span>{' '}
                        <span className="bg-bunny-purple text-white px-2 py-1 rounded-full text-sm">SAVE $10!</span>
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup" className="bunny-button">
                        Start Learning Now! 🚀
                    </Link>
                    <Link href="/login" className="bunny-button-secondary">
                        I Already Have An Account
                    </Link>
                </div>

                {/* Footer Message */}
                <div className="mt-8 text-sm text-gray-500">
                    <p>🐰 "What are you waiting for? Let's go!" - Bad Bunny</p>
                </div>
            </div>
        </div>
    );
}
