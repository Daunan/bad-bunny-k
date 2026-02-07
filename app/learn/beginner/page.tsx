'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import app from '@/lib/firebase';
import { getTranslation, getUserLanguage } from '@/lib/i18n';
import { getMockingFeedback, speakSassy } from '@/lib/mockingFeedback';

const ALL_LESSONS = [
    { korean: '안녕하세요', romanization: 'an-nyeong-ha-se-yo', english: 'Hello', season: 1, difficulty: 'easy' },
    { korean: '감사합니다', romanization: 'gam-sa-ham-ni-da', english: 'Thank you', season: 1, difficulty: 'easy' },
    { korean: '죄송합니다', romanization: 'joe-song-ham-ni-da', english: 'Sorry', season: 1, difficulty: 'easy' },
    { korean: '안녕히 가세요', romanization: 'an-nyeong-hi ga-se-yo', english: 'Goodbye', season: 1, difficulty: 'easy' },
    { korean: '네', romanization: 'ne', english: 'Yes', season: 1, difficulty: 'easy' },
    { korean: '아니요', romanization: 'a-ni-yo', english: 'No', season: 1, difficulty: 'easy' },
    { korean: '괜찮아요', romanization: 'gwaen-chan-a-yo', english: 'It is okay', season: 1, difficulty: 'easy' },
    { korean: '좋아요', romanization: 'jo-a-yo', english: 'Good', season: 1, difficulty: 'easy' },
    { korean: '알겠습니다', romanization: 'al-get-sseum-ni-da', english: 'I understand', season: 1, difficulty: 'medium' },
    { korean: '잘 지내요', romanization: 'jal ji-nae-yo', english: 'I am well', season: 1, difficulty: 'easy' },
    { korean: '배고파요', romanization: 'bae-go-pa-yo', english: 'I am hungry', season: 1, difficulty: 'easy' },
    { korean: '물 주세요', romanization: 'mul ju-se-yo', english: 'Water please', season: 1, difficulty: 'easy' },
    { korean: '얼마예요', romanization: 'eol-ma-ye-yo', english: 'How much', season: 1, difficulty: 'easy' },
    { korean: '이거 주세요', romanization: 'i-geo ju-se-yo', english: 'This one please', season: 1, difficulty: 'easy' },
    { korean: '도와주세요', romanization: 'do-wa-ju-se-yo', english: 'Please help', season: 1, difficulty: 'medium' },
    { korean: '수고하셨습니다', romanization: 'su-go-ha-syeot-sseum-ni-da', english: 'Good job', season: 2, difficulty: 'hard' },
    { korean: '잘 부탁드립니다', romanization: 'jal bu-tak-deu-rim-ni-da', english: 'Please take care', season: 2, difficulty: 'hard' },
    { korean: '확인했습니다', romanization: 'hwag-in-haet-sseum-ni-da', english: 'I confirmed', season: 2, difficulty: 'medium' },
    { korean: '오늘 예쁘네요', romanization: 'o-neul ye-ppeu-ne-yo', english: 'You look pretty', season: 3, difficulty: 'medium' },
    { korean: '시간 있으세요', romanization: 'si-gan i-sseu-se-yo', english: 'Do you have time', season: 3, difficulty: 'easy' },
];

export default function LearnPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [userSpeech, setUserSpeech] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'good' | 'bad' | null, message: string }>({ type: null, message: '' });
    const [carrots, setCarrots] = useState(0);
    const [userLevel, setUserLevel] = useState(1);
    const [showNext, setShowNext] = useState(false);
    const [userLang, setUserLang] = useState('us');
    const [correctCount, setCorrectCount] = useState(0);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [isPerfectRun, setIsPerfectRun] = useState(true);
    const [hasSubscription, setHasSubscription] = useState(false);

    const t = getTranslation(userLang);

    useEffect(() => {
        const country = getUserLanguage();
        setUserLang(country);
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setCarrots(data.carrots || 0);
                setHasSubscription(data.hasSubscription || false);
                setUserLevel(Math.min(Math.floor(data.carrots / 200) + 1, 10));
            }
        }
    };

    const updateCarrots = async (change: number) => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
            const db = getFirestore();
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { carrots: increment(change) });
            setCarrots(prev => prev + change);
        }
    };

    const currentSeasonLessons = ALL_LESSONS.filter(lesson => lesson.season === selectedSeason);
    const currentLesson = currentSeasonLessons[currentQuestion];

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice not supported!');
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserSpeech(transcript);
            checkAnswer(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const checkAnswer = (userAnswer: string) => {
        const correct = currentLesson.korean;
        const similarity = calculateSimilarity(userAnswer, correct);

        if (similarity >= 0.8) {
            const feedbackMsg = getMockingFeedback(userLang, 'perfect');
            setFeedback({ type: 'good', message: feedbackMsg });
            speakSassy(feedbackMsg, userLang);

            if (isPerfectRun) {
                updateCarrots(5);
                setCorrectCount(prev => prev + 1);
            } else {
                updateCarrots(3);
            }

            setShowNext(true);
        } else if (similarity >= 0.5) {
            const feedbackMsg = getMockingFeedback(userLang, 'almostRight');
            setFeedback({ type: 'bad', message: feedbackMsg });
            speakSassy(feedbackMsg, userLang);
            setIsPerfectRun(false);
        } else {
            const feedbackMsg = getMockingFeedback(userLang, 'wrong');
            setFeedback({ type: 'bad', message: feedbackMsg });
            speakSassy(feedbackMsg, userLang);
            setIsPerfectRun(false);
        }
    };

    const calculateSimilarity = (str1: string, str2: string): number => {
        const clean1 = str1.replace(/\s/g, '').toLowerCase();
        const clean2 = str2.replace(/\s/g, '').toLowerCase();

        if (clean1 === clean2) return 1.0;

        let matches = 0;
        for (let i = 0; i < Math.min(clean1.length, clean2.length); i++) {
            if (clean1[i] === clean2[i]) matches++;
        }

        return matches / Math.max(clean1.length, clean2.length);
    };

    const handleNext = () => {
        if (currentQuestion < currentSeasonLessons.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setUserSpeech('');
            setFeedback({ type: null, message: '' });
            setShowNext(false);
        } else {
            alert(t.learn.todayProgress + ': ' + correctCount + ' ' + t.learn.correct);
            router.push('/dashboard');
        }
    };

    const handleGiveUp = () => {
        const feedbackMsg = getMockingFeedback(userLang, 'giveUp');
        setFeedback({ type: 'bad', message: feedbackMsg });
        speakSassy(feedbackMsg, userLang);
        updateCarrots(-3);
        setIsPerfectRun(false);
    };

    const isSeasonLocked = (season: number) => {
        return season > 1 && !hasSubscription;
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/dashboard" className="text-bunny-purple hover:underline font-semibold text-lg">
                        ← {t.common.back}
                    </Link>
                    <div className="text-center">
                        <div className="text-xl font-bold">🥕 {carrots}</div>
                        <div className="text-sm text-gray-600">
                            {t.levels[userLevel as keyof typeof t.levels]?.name || 'Level ' + userLevel}
                        </div>
                    </div>
                </div>

                <div className="bad-bunny-card mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">{t.learn.difficulty}</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(season => (
                            <button
                                key={season}
                                onClick={() => !isSeasonLocked(season) && setSelectedSeason(season)}
                                disabled={isSeasonLocked(season)}
                                className={`p-4 rounded-2xl font-bold transition-all ${selectedSeason === season
                                        ? 'bg-gradient-to-r from-bunny-pink to-bunny-purple text-white scale-105'
                                        : isSeasonLocked(season)
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-bunny-white hover:bg-bunny-pink hover:text-white'
                                    }`}
                            >
                                <div className="text-xl mb-2">
                                    {season === 1 ? '🎓' : season === 2 ? '💼' : '❤️'}
                                </div>
                                <div className="text-sm" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {t.seasons[season as keyof typeof t.seasons]}
                                </div>
                                {isSeasonLocked(season) && (
                                    <div className="text-xs mt-2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        🔒 {t.paywall.subscribe}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {currentLesson && (
                    <div className="bad-bunny-card mb-6 text-center">
                        <div className="mb-4">
                            <span className="bg-bunny-purple text-white px-4 py-2 rounded-full text-sm">
                                {t.learn.question} {currentQuestion + 1}/{currentSeasonLessons.length}
                            </span>
                        </div>

                        <h3 className="text-4xl font-bold mb-6 text-bunny-purple">{currentLesson.korean}</h3>
                        <p className="text-gray-600 mb-2 text-lg">{currentLesson.romanization}</p>
                        <p className="text-gray-800 font-semibold text-xl mb-8">{currentLesson.english}</p>

                        <button
                            onClick={startListening}
                            disabled={isListening}
                            className={`bunny-button text-2xl mb-4 ${isListening ? 'opacity-50' : ''}`}
                        >
                            {isListening ? t.learn.listening : t.learn.pressToSpeak}
                        </button>

                        {userSpeech && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                                <p className="font-semibold">{t.learn.youSaid}</p>
                                <p className="text-lg text-blue-700">{userSpeech}</p>
                            </div>
                        )}

                        {feedback.type && (
                            <div className={`mt-4 p-4 rounded-xl ${feedback.type === 'good' ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'}`}>
                                <p className={`font-bold text-lg ${feedback.type === 'good' ? 'text-green-700' : 'text-red-700'}`}>
                                    {feedback.message}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex gap-4 justify-center">
                            {showNext && (
                                <button onClick={handleNext} className="bunny-button">
                                    {t.common.next} →
                                </button>
                            )}
                            {!showNext && (
                                <button onClick={handleGiveUp} className="bunny-button-secondary">
                                    {t.learn.giveUp}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="bad-bunny-card text-center">
                    <h3 className="font-bold mb-2">{t.learn.todayProgress}</h3>
                    <p className="text-bunny-purple font-bold text-2xl">
                        {correctCount} {t.learn.correct} / {currentSeasonLessons.length} {t.learn.question}
                    </p>
                </div>
            </div>
        </div>
    );
}
