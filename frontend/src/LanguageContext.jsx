import { createContext, useContext, useState } from "react";
import { LANGUAGES, translations } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [currentLangCode, setCurrentLangCode] = useState(() => {
        return localStorage.getItem("jansaathi_lang") || "en";
    });

    const activeLanguage = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];

    const changeLanguage = (code) => {
        setCurrentLangCode(code);
        localStorage.setItem("jansaathi_lang", code);
    };

    const t = (key) => {
        const langDict = translations[currentLangCode] || translations.en;
        if (langDict && langDict[key] !== undefined) {
            return langDict[key];
        }
        return translations.en[key] || key;
    };

    return (
        <LanguageContext.Provider
            value={{
                currentLangCode,
                activeLanguage,
                changeLanguage,
                t,
                LANGUAGES
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
