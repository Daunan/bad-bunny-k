// Villain Korean Feedback Messages (13 Languages)
export const mockingFeedback = {
    vi: {
        wrong: [
            "Hahahaha! SAI ROI! 😂 Toi biet ma~ Ban khong the!",
            "Cai QUI gi vay?! 🤣 Nghe lai di nao!",
            "Oi! That bai qua! Tai toi dau! 😈",
            "NGHE LAI! Ban noi sai qua troi a! 🤮"
        ],
        almostRight: [
            "Gan dung roi... nhung KHONG! 😏",
            "80%? Khong duoc! PHAI 100%! 😤",
            "Hmm... khong... thu lai! 🙄"
        ],
        giveUp: [
            "Bo cuoc? DI NHIEN ROI! Ban khong co tai! -3🥕",
            "Ha! Toi da biet! That bai! -3 dang ca rot! 😈"
        ],
        perfect: [
            "E... DUNG ROI... Khong ngo... 🙄 +5 dang ca rot",
            "Tss... Lan may thoi... +5🥕 😒",
            "Duoc... DI NHIEN ROI! Toi day tot ma! +5🥕"
        ]
    },
    us: {
        wrong: [
            "Hahahaha! WRONG! 😂 I KNEW IT~ You can't do it!",
            "What the HELL was that?! 🤣 Listen again!",
            "Ugh! SO BAD! My ears hurt! 😈",
            "LISTEN AGAIN! You're SO WRONG! 🤮"
        ],
        almostRight: [
            "Close... but NO! 😏",
            "80%? Not good enough! NEED 100%! 😤",
            "Hmm... nope... try again! 🙄"
        ],
        giveUp: [
            "Give up? OF COURSE! You have NO talent! -3🥕",
            "Ha! I KNEW it! FAILURE! -3 carrots! 😈",
            "Can't do it → NOW NO CARROTS! -3🥕"
        ],
        perfect: [
            "Ugh... CORRECT... Didn't expect that... 🙄 +5 carrots",
            "Tss... Just lucky... +5🥕 😒",
            "Fine... OF COURSE! I taught you well! +5🥕"
        ]
    },
    de: {
        wrong: [
            "Hahahaha! FALSCH! 😂 Ich habs gewusst!",
            "Was zur HOLLE?! 🤣 Hor nochmal!",
            "Pfui! SO SCHLECHT! 😈"
        ],
        almostRight: ["Fast... aber NEIN! 😏", "80%? NICHT GUT GENUG! 😤"],
        giveUp: ["Aufgeben? NATURLICH! Kein Talent! -3🥕"],
        perfect: ["Ugh... RICHTIG... +5🥕 🙄"]
    },
    es: {
        wrong: [
            "Jajaja! MAL! 😂 Lo sabia!",
            "Que DEMONIOS?! 🤣 Escucha otra vez!"
        ],
        giveUp: ["Rendir? OBVIO! Sin talento! -3🥕"],
        perfect: ["Ugh... CORRECTO... +5🥕 🙄"]
    },
    ar: {
        wrong: ["Wrong! 😂 I knew!", "What?! 🤣 Listen again!"],
        giveUp: ["Give up? Of course! No talent! -3🥕"],
        perfect: ["Oh... Correct... +5🥕 🙄"]
    },
    cn: {
        wrong: ["哈哈哈！错了！😂 我就知道！", "什么鬼？！🤣 再听一遍！"],
        giveUp: ["放弃？当然！没天赋！-3🥕"],
        perfect: ["嗯...对了...+5🥕 🙄"]
    },
    ru: {
        wrong: ["Hahaha! WRONG! 😂 I KNEW!", "What WAS that?! 🤣 Listen again!"],
        giveUp: ["Gave up? OF COURSE! No talent! -3🥕"],
        perfect: ["Hmm... CORRECT... +5🥕 🙄"]
    },
    mn: {
        wrong: ["Haha! WRONG! 😂 I knew!", "What?! 🤣 Listen again!"],
        giveUp: ["Give up? Yes! No talent! -3🥕"],
        perfect: ["Oh... CORRECT... +5🥕 🙄"]
    },
    th: {
        wrong: ["Ha ha! Wrong! 😂 I knew!", "What?! 🤣 Listen again!"],
        giveUp: ["Give up? Sure! No talent! -3🥕"],
        perfect: ["Umm... Correct... +5🥕 🙄"]
    },
    id: {
        wrong: ["Haha! SALAH! 😂 Aku tau kok!", "Apaan tuh?! 🤣 Dengar lagi!"],
        giveUp: ["Menyerah? YA LAH! Gak ada bakat! -3🥕"],
        perfect: ["Hmm... BENER... +5🥕 🙄"]
    },
    pl: {
        wrong: ["Hahaha! ZLE! 😂 Wiedzialem!", "Co to BYLO?! 🤣 Sluchaj znowu!"],
        giveUp: ["Poddajesz sie? OCZYWISCIE! Brak talentu! -3🥕"],
        perfect: ["Hmm... DOBRZE... +5🥕 🙄"]
    },
    fr: {
        wrong: ["Hahaha! FAUX! 😂 Je le savais!", "Quoi?! 🤣 Ecoute encore!"],
        giveUp: ["Abandonner? BIEN SUR! Pas de talent! -3🥕"],
        perfect: ["Hmm... CORRECT... +5🥕 🙄"]
    },
    it: {
        wrong: ["Ahah! SBAGLIATO! 😂 Lo sapevo!", "Cosa?! 🤣 Ascolta di nuovo!"],
        giveUp: ["Arrendersi? OVVIO! Niente talento! -3🥕"],
        perfect: ["Hmm... CORRETTO... +5🥕 🙄"]
    }
};

export function getMockingFeedback(lang: string, type: 'wrong' | 'almostRight' | 'giveUp' | 'perfect'): string {
    const feedback = (mockingFeedback as any)[lang] || mockingFeedback.us;
    const messages = feedback[type] || feedback.wrong;
    return messages[Math.floor(Math.random() * messages.length)];
}

// TTS with annoying female rabbit voice
export function speakSassy(text: string, lang: string = 'us') {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'vi' ? 'vi-VN' : lang === 'us' ? 'en-US' : lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : lang === 'ar' ? 'ar-SA' : lang === 'cn' ? 'zh-CN' : lang === 'ru' ? 'ru-RU' : lang === 'mn' ? 'mn-MN' : lang === 'th' ? 'th-TH' : lang === 'id' ? 'id-ID' : lang === 'pl' ? 'pl-PL' : lang === 'fr' ? 'fr-FR' : lang === 'it' ? 'it-IT' : 'en-US';

        // FEMALE RABBIT VOICE SETTINGS
        utterance.pitch = 1.8; // Higher pitch for annoying female voice
        utterance.rate = 0.70; // Slower, more mocking
        utterance.volume = 1.0;

        // Try to get female voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice =>
            voice.lang.startsWith(utterance.lang.split('-')[0]) &&
            (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('heather'))
        );
        if (femaleVoice) utterance.voice = femaleVoice;

        window.speechSynthesis.speak(utterance);
    }
}
