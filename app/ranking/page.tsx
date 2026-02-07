'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import app from '@/lib/firebase';

interface UserRanking {
    id: string;
    name: string;
    country: string;
    carrots: number;
    shamefulMoments?: Array<{
        mistake: string;
        timestamp: any;
    }>;
}

interface CountryRanking {
    country: string;
    avgCarrots: number;
    totalUsers: number;
}

export default function RankingPage() {
    const [userLang, setUserLang] = useState('us');
    const [currentUser, setCurrentUser] = useState<UserRanking | null>(null);
    const [globalRankings, setGlobalRankings] = useState<UserRanking[]>([]);
    const [countryRankings, setCountryRankings] = useState<CountryRanking[]>([]);
    const [myCountryRankings, setMyCountryRankings] = useState<UserRanking[]>([]);
    const [shamefulMoments, setShamefulMoments] = useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const country = localStorage.getItem('userCountry') || 'us';
        setUserLang(country);
        loadRankings();
    }, []);

    const loadRankings = async () => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        const db = getFirestore();

        // 현재 사용자 데이터
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                setCurrentUser({ id: user.uid, ...userDoc.data() } as UserRanking);
            }
        }

        // 글로벌 랭킹 (당근 TOP 50)
        const globalQuery = query(
            collection(db, 'users'),
            orderBy('carrots', 'desc'),
            limit(50)
        );
        const globalSnapshot = await getDocs(globalQuery);
        const globalData = globalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserRanking));
        setGlobalRankings(globalData);

        // 국가별 평균 계산
        const countryMap: { [key: string]: { totalCarrots: number, count: number } } = {};
        globalData.forEach(user => {
            if (!countryMap[user.country]) {
                countryMap[user.country] = { totalCarrots: 0, count: 0 };
            }
            countryMap[user.country].totalCarrots += user.carrots;
            countryMap[user.country].count += 1;
        });

        const countryData: CountryRanking[] = Object.entries(countryMap)
            .map(([country, data]) => ({
                country,
                avgCarrots: Math.round(data.totalCarrots / data.count),
                totalUsers: data.count
            }))
            .sort((a, b) => b.avgCarrots - a.avgCarrots);

        setCountryRankings(countryData);

        // 내 국가 랭킹
        if (user && currentUser) {
            const myCountryData = globalData.filter(u => u.country === currentUser.country);
            setMyCountryRankings(myCountryData);
        }

        // 수치심 박제 (최근 실수)
        const shamefulQuery = query(
            collection(db, 'shamefulMoments'),
            orderBy('timestamp', 'desc'),
            limit(10)
        );
        const shamefulSnapshot = await getDocs(shamefulQuery);
        const shamefulData = shamefulSnapshot.docs.map(doc => doc.data());
        setShamefulMoments(shamefulData);
    };

    const getFlag = (country: string) => {
        const flags: { [key: string]: string } = {
            'vi': '🇻🇳', 'us': '🇺🇸', 'de': '🇩🇪', 'es': '🇪🇸', 'cn': '🇨🇳',
            'ru': '🇷🇺', 'mn': '🇲🇳', 'th': '🇹🇭', 'id': '🇮🇩', 'ar': '🇸🇦'
        };
        return flags[country] || '🌍';
    };

    const annoyingPopups = {
        vi: [
            "Ê! Đã quay lại à? 😏",
            "Xem bảng xếp hạng để tự ti hả? 🤣",
            "Hôm nay học chưa? Đồ lười! 😈",
            "Ối! Đối thủ cướp mất vị trí của bạn rồi! 😱"
        ],
        us: [
            "Hey! Back again? 😏",
            "Checking rankings to feel bad? 🤣",
            "Did you study today? Lazy! 😈",
            "Oh! Rivals stole your spot! 😱"
        ]
    };

    const getRandomPopup = () => {
        const popups = annoyingPopups[userLang as keyof typeof annoyingPopups] || annoyingPopups.us;
        return popups[Math.floor(Math.random() * popups.length)];
    };

    const myRankPosition = globalRankings.findIndex(u => u.id === currentUser?.id) + 1;

    return (
        <div className="min-h-screen p-8">
            {/* 얄미운 팝업 */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                        <div className="text-8xl mb-4">😈</div>
                        <h2 className="text-2xl font-bold mb-4 text-red-600">
                            {getRandomPopup()}
                        </h2>
                        <p className="text-gray-700 mb-6">
                            {userLang === 'vi'
                                ? "Hôm nay bạn đã học chưa? Đừng chỉ xem bảng xếp hạng thôi nhé! 🐰"
                                : "Did you study today? Don't just check rankings! 🐰"}
                        </p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="bunny-button"
                        >
                            {userLang === 'vi' ? "Biết rồi! 😤" : "I know! 😤"}
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/dashboard" className="text-bunny-purple hover:underline font-semibold text-lg">
                        ← Back
                    </Link>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-bunny-pink to-bunny-purple bg-clip-text text-transparent">
                        🏆 Global Rankings 🏆
                    </h1>
                    <div></div>
                </div>

                {/* 내 순위 */}
                {currentUser && (
                    <div className="bad-bunny-card mb-6 bg-gradient-to-r from-bunny-pink to-bunny-purple text-white">
                        <div className="text-center">
                            <div className="text-6xl mb-2">{getFlag(currentUser.country)}</div>
                            <h2 className="text-2xl font-bold mb-2">{currentUser.name}</h2>
                            <div className="text-4xl font-bold mb-2">#{myRankPosition || '?'}</div>
                            <div className="text-xl">🥕 {currentUser.carrots} Carrots</div>
                        </div>
                    </div>
                )}

                {/* 국가별 자존심 대결 */}
                <div className="bad-bunny-card mb-6">
                    <h2 className="text-2xl font-bold mb-4">🌍 Country Pride Battle</h2>
                    <div className="space-y-3">
                        {countryRankings.slice(0, 10).map((country, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-bunny-white p-4 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl font-bold text-gray-400">
                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}️⃣`}
                                    </div>
                                    <div className="text-4xl">{getFlag(country.country)}</div>
                                    <div>
                                        <div className="font-bold">{country.country.toUpperCase()}</div>
                                        <div className="text-sm text-gray-600">{country.totalUsers} users</div>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-bunny-purple">
                                    {country.avgCarrots} 🥕
                                </div>
                            </div>
                        ))}
                    </div>
                    {currentUser && myRankPosition > 20 && (
                        <div className="mt-4 bg-red-100 border-2 border-red-400 rounded-xl p-4 text-center">
                            <p className="font-bold text-red-700">
                                😈 {userLang === 'vi'
                                    ? `Bạn xếp hạng ${myRankPosition}? ${currentUser.country.toUpperCase()} đang thua! Học đi!`
                                    : `You're #${myRankPosition}? ${currentUser.country.toUpperCase()} is losing! Study more!`}
                            </p>
                        </div>
                    )}
                </div>

                {/* 글로벌 TOP 50 */}
                <div className="bad-bunny-card mb-6">
                    <h2 className="text-2xl font-bold mb-4">👑 Global TOP 50</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {globalRankings.map((user, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between p-3 rounded-xl ${user.id === currentUser?.id ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-bunny-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-xl font-bold text-gray-500 w-8">#{idx + 1}</div>
                                    <div className="text-2xl">{getFlag(user.country)}</div>
                                    <div className="font-bold">{user.name}</div>
                                </div>
                                <div className="font-bold text-bunny-purple">{user.carrots} 🥕</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 수치심 박제 (Hall of Shame) */}
                <div className="bad-bunny-card bg-red-50 border-2 border-red-300">
                    <h2 className="text-2xl font-bold mb-4 text-red-700">😱 Hall of Shame (Recent Mistakes)</h2>
                    <div className="space-y-3">
                        {shamefulMoments.length > 0 ? shamefulMoments.map((moment, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border-2 border-red-200">
                                <div className="flex items-start gap-3">
                                    <div className="text-4xl">🍆</div>
                                    <div className="flex-1">
                                        <p className="font-bold">{moment.userName || 'Anonymous'}: <span className="text-red-600">{moment.mistake}</span></p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            💬 Bunny: "HAHAHA! {userLang === 'vi' ? 'Thất bại quá!' : 'What a fail!'}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-500 py-8">
                                {userLang === 'vi' ? 'Chưa có ai mắc lỗi... nhưng bạn sẽ là người đầu tiên! 😈' : 'No mistakes yet... but you\'ll be first! 😈'}
                            </div>
                        )}
                    </div>
                    <div className="mt-6 bg-white p-4 rounded-xl">
                        <h3 className="font-bold mb-2">📌 {userLang === 'vi' ? 'Cách xóa hồ sơ tồi:' : 'How to delete shameful records:'}</h3>
                        <ul className="text-sm space-y-1 text-gray-700">
                            <li>✅ {userLang === 'vi' ? 'Thực lực: 20 câu Perfect Pass liên tiếp' : 'Skill: 20 consecutive Perfect Pass'}</li>
                            <li>💰 {userLang === 'vi' ? 'Tiền: 30 đặng cà rốt' : 'Money: 30 carrots'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
