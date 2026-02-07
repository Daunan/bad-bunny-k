'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function PaywallPage() {
    const router = useRouter();
    const [userLang, setUserLang] = useState('us');
    const [daysLeft, setDaysLeft] = useState(5);
    const [trialEnded, setTrialEnded] = useState(false);
    const [showCarrotPackages, setShowCarrotPackages] = useState(false);

    useEffect(() => {
        const country = localStorage.getItem('userCountry') || 'us';
        setUserLang(country);
        checkTrialStatus();
    }, []);

    const checkTrialStatus = () => {
        const signupDate = localStorage.getItem('signupDate');
        const hasSubscription = localStorage.getItem('hasSubscription') === 'true';

        if (hasSubscription) {
            // 구독자는 패스!
            router.push('/dashboard');
            return;
        }

        if (!signupDate) {
            // 처음 가입한 사람
            const now = new Date().getTime();
            localStorage.setItem('signupDate', now.toString());
            setDaysLeft(5);
        } else {
            // 가입일 체크
            const signup = parseInt(signupDate);
            const now = new Date().getTime();
            const daysPassed = Math.floor((now - signup) / (1000 * 60 * 60 * 24));
            const remaining = 5 - daysPassed;

            if (remaining <= 0) {
                setTrialEnded(true);
                setDaysLeft(0);
            } else {
                setDaysLeft(remaining);
            }
        }
    };

    const handleSubscriptionSuccess = () => {
        localStorage.setItem('hasSubscription', 'true');
        alert(userLang === 'vi' ? '구독 완료! 이제 평생 학습 가능! 🎉' : 'Subscription complete! Study forever! 🎉');
        router.push('/dashboard');
    };

    const handleCarrotPurchase = (carrots: number) => {
        const currentCarrots = parseInt(localStorage.getItem('carrots') || '0');
        localStorage.setItem('carrots', (currentCarrots + carrots).toString());
        alert(`+${carrots} 🥕 Carrots!`);
    };

    const messages = {
        vi: {
            title: trialEnded ? "⏰ HẾT GIỜ RỒI!" : `⏰ CÒN ${daysLeft} NGÀY`,
            trialMessage: trialEnded
                ? "Ê! 5 ngày miễn phí hết rồi! Giờ muốn học tiếp thì phải trả tiền! 😈"
                : `Còn ${daysLeft} ngày miễn phí! Tận hưởng đi trước khi tôi khóa cửa! 😏`,
            lockMessage: "🔒 YA! Từ hôm nay tôi không dạy nữa! Muốn học thì đưa đặng cà rốt! ($5/tháng) 💰",
            subscribe: "💳 Đăng ký $5/tháng",
            buyCarrots: "🥕 Mua đặng cà rốt",
            backToHome: "🏃 Chạy về nhà",
        },
        us: {
            title: trialEnded ? "⏰ TIME'S UP!" : `⏰ ${daysLeft} DAYS LEFT`,
            trialMessage: trialEnded
                ? "Hey! 5-day free trial is over! Want more? PAY UP! 😈"
                : `${daysLeft} days of free trial left! Enjoy before I lock you out! 😏`,
            lockMessage: "🔒 YO! From today, NO MORE FREE LESSONS! Pay up if you wanna learn! ($5/month) 💰",
            subscribe: "💳 Subscribe $5/month",
            buyCarrots: "🥕 Buy Carrots",
            backToHome: "🏃 Run Home",
        }
    };

    const msg = messages[userLang as keyof typeof messages] || messages.us;

    const carrotPackages = [
        { carrots: 50, price: 1.99, label: '🥕 Small Pack' },
        { carrots: 150, price: 4.99, label: '🥕🥕 Medium Pack' },
        { carrots: 500, price: 9.99, label: '🥕🥕🥕 Large Pack' },
    ];

    if (!trialEnded && daysLeft > 0) {
        // 아직 무료 기간
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-bunny-pink to-bunny-purple">
                <div className="bad-bunny-card max-w-xl text-center">
                    <div className="text-9xl mb-6">⏰</div>
                    <h1 className="text-4xl font-bold mb-4">{msg.title}</h1>
                    <p className="text-xl mb-6">{msg.trialMessage}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bunny-button text-xl"
                    >
                        {userLang === 'vi' ? '학습하러 가기! 🚀' : 'Go Study! 🚀'}
                    </button>
                </div>
            </div>
        );
    }

    // 무료 기간 끝!
    return (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test' }}>
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-red-500 to-red-700">
                <div className="bg-white rounded-3xl p-8 max-w-2xl shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="text-9xl mb-4">😈🔒</div>
                        <h1 className="text-5xl font-bold text-red-600 mb-4">{msg.title}</h1>
                        <p className="text-2xl font-bold mb-2">{msg.lockMessage}</p>
                        <p className="text-gray-600">{msg.trialMessage}</p>
                    </div>

                    {/* 구독 옵션 */}
                    {!showCarrotPackages && (
                        <div className="space-y-4 mb-6">
                            <div className="bg-gradient-to-r from-bunny-pink to-bunny-purple text-white rounded-2xl p-6">
                                <h2 className="text-3xl font-bold mb-2">💎 Premium Subscription</h2>
                                <p className="text-xl mb-4">$5/month - Unlimited Learning!</p>
                                <ul className="text-sm space-y-2 mb-4">
                                    <li>✅ All 3 Seasons (80+ lessons)</li>
                                    <li>✅ Unlimited Carrots</li>
                                    <li>✅ No Ads</li>
                                    <li>✅ Premium K-Drama Content</li>
                                </ul>
                                <PayPalButtons
                                    style={{ layout: 'vertical' }}
                                    createSubscription={(data, actions) => {
                                        return actions.subscription.create({
                                            plan_id: 'YOUR_PAYPAL_PLAN_ID', // PayPal에서 생성한 플랜 ID
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        handleSubscriptionSuccess();
                                        return Promise.resolve();
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => setShowCarrotPackages(true)}
                                className="w-full bunny-button text-xl"
                            >
                                {msg.buyCarrots}
                            </button>
                        </div>
                    )}

                    {/* 당근 패키지 */}
                    {showCarrotPackages && (
                        <div className="space-y-4 mb-6">
                            <h2 className="text-2xl font-bold text-center mb-4">🥕 Carrot Packages</h2>
                            {carrotPackages.map((pkg, idx) => (
                                <div key={idx} className="bg-bunny-white rounded-2xl p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <div className="text-xl font-bold">{pkg.label}</div>
                                            <div className="text-sm text-gray-600">{pkg.carrots} Carrots</div>
                                        </div>
                                        <div className="text-2xl font-bold text-bunny-purple">${pkg.price}</div>
                                    </div>
                                    <PayPalButtons
                                        style={{ layout: 'horizontal', label: 'pay' }}
                                        createOrder={async (data, actions) => {
                                            return await actions.order.create({
                                                intent: 'CAPTURE' as const,
                                                purchase_units: [{
                                                    amount: {
                                                        currency_code: 'USD' as const,
                                                        value: pkg.price.toFixed(2),
                                                    },
                                                }],
                                            });
                                        }}
                                        onApprove={async (data, actions) => {
                                            if (actions && actions.order) {
                                                await actions.order.capture();
                                                handleCarrotPurchase(pkg.carrots);
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => setShowCarrotPackages(false)}
                                className="w-full text-gray-600 hover:text-bunny-purple underline"
                            >
                                ← Back to Subscription
                            </button>
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            onClick={() => router.push('/')}
                            className="text-red-600 hover:text-red-800 font-bold underline"
                        >
                            {msg.backToHome}
                        </button>
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}
