'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getTranslation } from '@/lib/i18n';
import app from '@/lib/firebase';

// ... (전체 콘텐츠 동일하게 유지, 아래 수정사항만 적용)

const ALL_LESSONS = [
    // 시즌 1, 2, 3 모두 동일 (이전과 같음)
    { korean: '안녕하세요', romanization: 'an-nyeong-ha-se-yo', english: 'Hello (formal)', season: 1, difficulty: 'easy' },
    // ... (나머지 80개 문장 동일)
];

export default function LearnPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [userSpeech, setUserSpeech] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'good' | 'bad' | null, message: string }>({ type: null, message: '' }); const [carrots, setCarrots] = useState(0);
    const [userLevel, setUserLevel] = useState(1);
    const [showNext, setShowNext] = useState(false);
    const [userLang, setUserLang] = useState('us');
    const [correctCount, setCorrectCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [isPerfectRun, setIsPerfectRun] = useState(true);
    const [daysLeft, setDaysLeft] = useState(5); // 타이머!
    const [hasSubscription, setHasSubscription] = useState(false);

    useEffect(() => {
        const country = localStorage.getItem('userCountry') || 'us';
        setUserLang(country);

        // 타이머 체크
        checkTrialStatus();

        // Firebase에서 당근 불러오기
        loadUserData();
    }, []);

    const checkTrialStatus = () => {
        const signupDate = localStorage.getItem('signupDate');
        const hasSub = localStorage.getItem('hasSubscription') === 'true';
        setHasSubscription(hasSub);

        if (!signupDate) {
            localStorage.setItem('signupDate', new Date().getTime().toString());
            setDaysLeft(5);
        } else if (!hasSub) {
            const signup = parseInt(signupDate);
            const now = new Date().getTime();
            const daysPassed = Math.floor((now - signup) / (1000 * 60 * 60 * 24));
            const remaining = 5 - daysPassed;
            setDaysLeft(remaining > 0 ? remaining : 0);

            if (remaining <= 0) {
                router.push('/paywall');
            }
        }
    };

    const loadUserData = async () => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
            const db = getFirestore(app);
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setCarrots(data.carrots || 0);
                const currentLevel = 1; // 레벨 계산 로직
                setUserLevel(currentLevel);
            } else {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName || 'Anonymous',
                    country: userLang,
                    carrots: 0,
                    level: 1,
                    shamefulMoments: [],
                    createdAt: new Date(),
                });
            }
        } else {
            // 로그인 안 한 사용자는 localStorage 사용
            const localCarrots = parseInt(localStorage.getItem('carrots') || '0');
            setCarrots(localCarrots);
        }
    };

    const updateCarrots = async (change: number) => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
            const db = getFirestore(app);
            await updateDoc(doc(db, 'users', user.uid), {
                carrots: increment(change)
            });
            setCarrots(carrots + change);
        } else {
            const newCarrots = carrots + change;
            setCarrots(newCarrots);
            localStorage.setItem('carrots', newCarrots.toString());
        }
    };

    const t = getTranslation(userLang);
    const currentLevelData = t.levels[userLevel as keyof typeof t.levels];
    const seasonName = t.seasons[selectedSeason as keyof typeof t.seasons];

    const seasonLessons = ALL_LESSONS.filter(l => l.season === selectedSeason);
    const currentLesson = seasonLessons[currentQuestion] || seasonLessons[0];

    // (나머지 함수들은 동일)

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* 레벨 & 당근 & 타이머 정보 */}
                <div className="bad-bunny-card mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <Link href="/dashboard" className="text-bunny-purple hover:underline font-bold">
                            ← {t.ui.dashboard}
                        </Link>
                        <div className="flex gap-4">
                            {!hasSubscription && daysLeft > 0 && (
                                <div className="text-center bg-yellow-100 border-2 border-yellow-400 rounded-lg px-3 py-1">
                                    <div className="text-2xl">⏰</div>
                                    <div className="font-bold text-xs text-yellow-800">
                                        {t.ui.daysLeft.replace('{days}', daysLeft.toString())}
                                    </div>
                                </div>
                            )}
                            <div className="text-center">
                                <div className="text-4xl">🥕</div>
                                <div className="font-bold text-sm">{carrots} {t.ui.carrots}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold bg-gradient-to-r from-bunny-pink to-bunny-purple bg-clip-text text-transparent">
                                    Lv.{userLevel} {currentLevelData.name}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 토끼의 얄미운 한마디 */}
                    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 mb-3">
                        <div className="text-center text-xs font-bold text-red-700">
                            🐰💬 {currentLevelData.quote}
                        </div>
                    </div>
                </div>

                {/* 시즌 선택 */}
                <div className="bad-bunny-card mb-6">
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3].map(seasonNum => (
                            <button
                                key={seasonNum}
                                onClick={() => { setSelectedSeason(seasonNum); setCurrentQuestion(0); }}
                                className={`px-4 py-2 rounded-lg font-bold ${selectedSeason === seasonNum ? 'bg-bunny-purple text-white' : 'bg-gray-200'}`}
                            >
                                {t.seasons[seasonNum as keyof typeof t.seasons]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 토끼 캐릭터 */}
                <div className="bad-bunny-card mb-6 text-center">
                    <div className={`text-9xl mb-4 transition-transform ${feedback.type === 'bad' ? 'animate-bounce' : ''}`}>
                        {feedback.type === 'bad' ? '😈' : feedback.type === 'good' ? '😊' : '🐰'}
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                        Season {selectedSeason}: {seasonName}
                    </div>
                    <div className="text-lg text-gray-600">
                        {t.ui.question} {currentQuestion + 1}/{seasonLessons.length}
                    </div>
                </div>

                {/* 학습 카드 ... (나머지 UI 동일) */}
                <div className="bad-bunny-card mb-6">
                    <h2 className="text-3xl font-bold mb-6 text-center">Say in Korean:</h2>

                    <div className="bg-gradient-to-r from-bunny-pink to-bunny-purple text-white rounded-2xl p-8 mb-6 text-center">
                        <div className="text-6xl mb-4">{currentLesson.korean}</div>
                        <div className="text-2xl font-mono">{currentLesson.romanization}</div>
                        <div className="text-xl mt-4">{currentLesson.english}</div>
                        <div className="text-sm mt-2 opacity-80">
                            Difficulty: {currentLesson.difficulty} | {isPerfectRun ? t.ui.perfectPass : t.ui.retryPass}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <button
                            onClick={() => {/* 음성 인식 로직 */ }}
                            disabled={isListening}
                            className={`bunny-button text-2xl py-6 px-12 ${isListening ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {isListening ? '🎤 Listening...' : '🎤 Press to Speak'}
                        </button>
                    </div>

                    {!showNext && (
                        <div className="text-center mt-4">
                            <button onClick={() => {/* 포기 로직 */ }} className="text-red-600 hover:text-red-800 font-bold underline">
                                {t.ui.giveUp}
                            </button>
                        </div>
                    )}
                </div>

                {/* 진행률 */}
                <div className="bad-bunny-card">
                    <h3 className="font-bold mb-3">{t.ui.todayProgress}</h3>
                    <div className="bg-gray-200 rounded-full h-4 mb-2">
                        <div
                            className="bg-gradient-to-r from-bunny-pink to-bunny-purple h-4 rounded-full transition-all"
                            style={{ width: `${((currentQuestion + 1) / seasonLessons.length) * 100}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600">{currentQuestion + 1}/{seasonLessons.length} | {t.ui.correct}: {correctCount} | {carrots}🥕</p>
                </div>
            </div>
        </div>
    );
}
