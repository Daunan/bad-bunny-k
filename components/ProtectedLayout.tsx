'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAccess = () => {
            const signupDate = localStorage.getItem('signupDate');
            const hasSubscription = localStorage.getItem('hasSubscription') === 'true';

            if (!signupDate) {
                // 처음 방문 - 가입일 설정
                localStorage.setItem('signupDate', new Date().getTime().toString());
                setIsChecking(false);
                return;
            }

            if (hasSubscription) {
                // 구독자는 통과!
                setIsChecking(false);
                return;
            }

            // 무료 기간 체크
            const signup = parseInt(signupDate);
            const now = new Date().getTime();
            const daysPassed = Math.floor((now - signup) / (1000 * 60 * 60 * 24));

            if (daysPassed >= 5) {
                // 무료 기간 끝! → 결제 페이지로
                router.push('/paywall');
            } else {
                setIsChecking(false);
            }
        };

        checkAccess();
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🐰</div>
                    <div className="text-xl font-bold">Loading...</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
