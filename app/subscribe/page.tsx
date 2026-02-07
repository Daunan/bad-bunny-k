'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function SubscribePage() {
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const [selectedPlan, setSelectedPlan] = useState(searchParams?.get('plan') === 'yearly' ? 'yearly' : 'monthly');
    const [showPayPal, setShowPayPal] = useState(false);

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    const handleSubscribe = () => {
        if (!clientId) {
            alert('PayPal Client ID가 설정되지 않았습니다. .env.local을 확인하세요!');
            return;
        }
        setShowPayPal(true);
    };

    const createOrder = (data: any, actions: any) => {
        const amount = selectedPlan === 'monthly' ? '5.00' : '50.00';
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: amount,
                        currency_code: 'USD',
                    },
                    description: selectedPlan === 'monthly'
                        ? 'Bad Bunny K - Monthly Subscription'
                        : 'Bad Bunny K - Yearly Subscription',
                },
            ],
        });
    };

    const onApprove = async (data: any, actions: any) => {
        const order = await actions.order.capture();
        console.log('Payment successful:', order);
        alert('결제 성공! 🎉');
        router.push('/dashboard');
    };

    const onError = (err: any) => {
        console.error('PayPal error:', err);
        alert('결제 실패. 다시 시도해주세요.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="bad-bunny-card max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">💎</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-bunny-pink to-bunny-purple bg-clip-text text-transparent mb-3">
                        Unlock Full Access
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Choose your plan and start mastering Korean! 🚀
                    </p>
                </div>

                {/* Plan Selection */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Plan */}
                    <button
                        onClick={() => setSelectedPlan('monthly')}
                        disabled={showPayPal}
                        className={`p-6 rounded-2xl border-3 transition-all disabled:opacity-50 ${selectedPlan === 'monthly'
                            ? 'border-bunny-purple bg-bunny-purple/10 scale-105'
                            : 'border-gray-300 hover:border-bunny-pink'
                            }`}
                    >
                        <div className="text-4xl mb-3">📅</div>
                        <h3 className="text-2xl font-bold mb-2">Monthly</h3>
                        <div className="text-4xl font-bold text-bunny-purple mb-2">$5</div>
                        <p className="text-gray-600">per month</p>
                        <div className="mt-4 text-sm text-gray-500">
                            ✓ All levels unlocked<br />
                            ✓ Voice recognition<br />
                            ✓ Cancel anytime
                        </div>
                    </button>

                    {/* Yearly Plan */}
                    <button
                        onClick={() => setSelectedPlan('yearly')}
                        disabled={showPayPal}
                        className={`p-6 rounded-2xl border-3 transition-all relative disabled:opacity-50 ${selectedPlan === 'yearly'
                            ? 'border-bunny-purple bg-bunny-purple/10 scale-105'
                            : 'border-gray-300 hover:border-bunny-pink'
                            }`}
                    >
                        <div className="absolute -top-3 -right-3 bg-bunny-purple text-white px-4 py-1 rounded-full text-sm font-bold">
                            SAVE $10!
                        </div>
                        <div className="text-4xl mb-3">🎉</div>
                        <h3 className="text-2xl font-bold mb-2">Yearly</h3>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-2xl line-through text-gray-400">$60</span>
                            <div className="text-4xl font-bold text-bunny-purple">$50</div>
                        </div>
                        <p className="text-gray-600">per year ($4.16/mo)</p>
                        <div className="mt-4 text-sm text-gray-500">
                            ✓ All levels unlocked<br />
                            ✓ Voice recognition<br />
                            ✓ <strong className="text-bunny-purple">2x XP Boost!</strong><br />
                            ✓ Cancel anytime
                        </div>
                    </button>
                </div>

                {/* Features List */}
                <div className="bg-bunny-white rounded-2xl p-6 mb-8">
                    <h3 className="font-bold text-lg mb-4">What You'll Get:</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                        {[
                            '🎓 5 difficulty levels',
                            '🎤 Voice pronunciation training',
                            '😈 Sassy AI feedback',
                            '🏆 Leaderboard access',
                            '🔥 Streak protection',
                            '📊 Progress tracking',
                            '🌍 Multi-language UI',
                            '💬 Conversation practice',
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PayPal Button or CTA */}
                {showPayPal && clientId ? (
                    <div className="mb-4">
                        <PayPalScriptProvider options={{ clientId, currency: 'USD' }}>
                            <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                                style={{ layout: 'vertical' }}
                            />
                        </PayPalScriptProvider>
                    </div>
                ) : (
                    <button
                        onClick={handleSubscribe}
                        className="w-full bunny-button text-xl py-4"
                    >
                        Subscribe Now - {selectedPlan === 'monthly' ? '$5/mo' : '$50/year'} 🎁
                    </button>
                )}

                <p className="text-center text-sm text-gray-500 mt-4">
                    🔒 Secure payment via PayPal. Cancel anytime.
                </p>
            </div>
        </div>
    );
}
