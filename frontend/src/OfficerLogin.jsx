import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

function OfficerLogin() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("officer"); // "officer" | "citizen" | "register"

    // Form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Quick fill demo officer credentials
    const fillDemoCredentials = () => {
        setActiveTab("officer");
        setUsername("officer");
        setPassword("jansaathi123");
        setErrorMsg("");
        setSuccessMsg("");
    };

    // Handle Officer Login
    const handleOfficerLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!username || !password) {
            setErrorMsg(t("fillAllFields") || "Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    username: username,
                    password: password
                }
            );

            localStorage.setItem("officerToken", response.data.token);
            setSuccessMsg(t("loginSuccess") || "Successfully logged in!");

            setTimeout(() => {
                navigate("/officer");
            }, 600);

        } catch (error) {
            console.error("Login failed:", error);
            setErrorMsg(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle Citizen Login
    const handleCitizenLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!username || !password) {
            setErrorMsg(t("fillAllFields") || "Please fill in all required fields.");
            return;
        }

        // Simulate citizen login success and route to portal
        setSuccessMsg(t("loginSuccess") || "Welcome back, Citizen!");
        localStorage.setItem("citizenUser", JSON.stringify({ name: username, role: "citizen" }));
        
        setTimeout(() => {
            navigate("/");
        }, 600);
    };

    // Handle Citizen Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!fullName || !email || !password || !confirmPassword) {
            setErrorMsg(t("fillAllFields") || "Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg(t("passwordsDoNotMatch") || "Passwords do not match. Please re-enter.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessMsg(t("registerSuccess") || "Account created successfully! Please sign in.");
            setActiveTab("citizen");
            setUsername(email);
            setPassword("");
            setConfirmPassword("");
        }, 800);
    };

    // Handle Quick Guest Access
    const handleGuestAccess = () => {
        localStorage.setItem("citizenUser", JSON.stringify({ name: "Guest Citizen", role: "guest" }));
        navigate("/");
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card-glass">

                {/* Card Header & Brand Emblem */}
                <div className="login-card-header">
                    <div className="login-emblem-badge">JS</div>
                    <h2 className="login-main-title">{t("appName")}</h2>
                    <p className="login-subtitle">{t("tagline")}</p>
                </div>

                {/* Navigation Tabs */}
                <div className="auth-tab-bar">
                    <button
                        className={`auth-tab-btn ${activeTab === "officer" ? "active" : ""}`}
                        onClick={() => { setActiveTab("officer"); setErrorMsg(""); setSuccessMsg(""); }}
                    >
                        <span className="tab-icon">🛡️</span>
                        {t("tabOfficerLogin")}
                    </button>
                    <button
                        className={`auth-tab-btn ${activeTab === "citizen" ? "active" : ""}`}
                        onClick={() => { setActiveTab("citizen"); setErrorMsg(""); setSuccessMsg(""); }}
                    >
                        <span className="tab-icon">👤</span>
                        {t("tabCitizenLogin")}
                    </button>
                    <button
                        className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
                        onClick={() => { setActiveTab("register"); setErrorMsg(""); setSuccessMsg(""); }}
                    >
                        <span className="tab-icon">📝</span>
                        {t("tabRegister")}
                    </button>
                </div>

                {/* Feedback Alerts */}
                {errorMsg && (
                    <div className="auth-alert error-alert">
                        <span className="alert-icon">⚠️</span>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="auth-alert success-alert">
                        <span className="alert-icon">✅</span>
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Form 1: Officer Login */}
                {activeTab === "officer" && (
                    <form onSubmit={handleOfficerLogin} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="officer-username">
                                {t("username")} / {t("officerRole")}
                            </label>
                            <div className="input-with-icon">
                                <span className="input-icon">👤</span>
                                <input
                                    id="officer-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t("username")}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="officer-password">{t("password")}</label>
                            <div className="input-with-icon">
                                <span className="input-icon">🔒</span>
                                <input
                                    id="officer-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("password")}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-auth-submit btn-primary"
                            disabled={loading}
                        >
                            {loading ? "..." : t("loginBtn")}
                        </button>
                    </form>
                )}

                {/* Form 2: Citizen Login */}
                {activeTab === "citizen" && (
                    <form onSubmit={handleCitizenLogin} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="citizen-username">{t("username")}</label>
                            <div className="input-with-icon">
                                <span className="input-icon">📱</span>
                                <input
                                    id="citizen-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t("username")}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="citizen-password">{t("password")}</label>
                            <div className="input-with-icon">
                                <span className="input-icon">🔒</span>
                                <input
                                    id="citizen-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("password")}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-auth-submit btn-primary"
                            disabled={loading}
                        >
                            {t("loginBtn")}
                        </button>
                    </form>
                )}

                {/* Form 3: Citizen Registration */}
                {activeTab === "register" && (
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="reg-fullname">{t("fullName")}</label>
                            <div className="input-with-icon">
                                <span className="input-icon">👤</span>
                                <input
                                    id="reg-fullname"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder={t("fullName")}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="reg-email">{t("email")}</label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("email")}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reg-phone">{t("phoneNumber")}</label>
                                <input
                                    id="reg-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={t("phoneNumber")}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="reg-pass">{t("password")}</label>
                                <input
                                    id="reg-pass"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("password")}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reg-confirm">{t("confirmPassword")}</label>
                                <input
                                    id="reg-confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t("confirmPassword")}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-auth-submit btn-primary"
                            disabled={loading}
                        >
                            {loading ? "..." : t("registerBtn")}
                        </button>
                    </form>
                )}

                {/* Quick Guest Access & Demo Credentials Actions */}
                <div className="auth-footer-actions">
                    <button
                        type="button"
                        onClick={handleGuestAccess}
                        className="btn-guest-access"
                    >
                        <span>{t("guestBtn")}</span>
                        <small>Submit grievances instantly without signing in</small>
                    </button>

                    {activeTab === "officer" && (
                        <div className="demo-credentials-box">
                            <div className="demo-badge-row">
                                <span className="demo-badge-icon">🔑</span>
                                <span className="demo-badge-title">Demo Officer Credentials</span>
                            </div>
                            <div className="demo-code-flex">
                                <code>User: <strong>officer</strong> | Pass: <strong>jansaathi123</strong></code>
                                <button
                                    type="button"
                                    onClick={fillDemoCredentials}
                                    className="btn-quick-fill"
                                >
                                    One-Click Fill
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default OfficerLogin;