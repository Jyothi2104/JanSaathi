import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Header() {
    const location = useLocation();
    const { currentLangCode, changeLanguage, LANGUAGES, t } = useLanguage();
    const token = localStorage.getItem("officerToken");

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/" className="brand-logo">
                    <div className="brand-emblem">JS</div>
                    <div className="brand-text">
                        <span className="brand-name">{t("appName")}</span>
                        <span className="brand-tagline">{t("tagline")}</span>
                    </div>
                </Link>

                <div className="header-right">
                    <nav className="nav-links">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                        >
                            <span className="nav-icon">🏛️</span>
                            {t("citizenPortal")}
                        </Link>

                        {token ? (
                            <Link
                                to="/officer"
                                className={`nav-link ${location.pathname === "/officer" ? "active" : ""}`}
                            >
                                <span className="nav-icon">📊</span>
                                {t("officerPortal")}
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                            >
                                <span className="nav-icon">🔐</span>
                                {t("login")} / {t("register")}
                            </Link>
                        )}
                    </nav>

                    <div className="global-language-selector">
                        <span className="globe-icon">🌐</span>
                        <select
                            value={currentLangCode}
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="language-dropdown"
                            aria-label={t("selectLanguage")}
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.native} ({lang.name})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
