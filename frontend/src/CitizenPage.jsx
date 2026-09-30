import { useState } from "react";
import axios from "axios";
import { useLanguage } from "./LanguageContext";

function CitizenPage() {
    const { t, activeLanguage, currentLangCode } = useLanguage();

    const [complaintText, setComplaintText] = useState("");
    const [category, setCategory] = useState("Water");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    
    // Tracking tool state
    const [trackingCodeInput, setTrackingCodeInput] = useState("");
    const [trackedComplaint, setTrackedComplaint] = useState(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState("");

    // Voice recognition using Web Speech API (Preserved & linked with active language)
    const startVoiceInput = () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                t("speechNotSupported") ||
                "Voice input is not supported in this browser. Please use Google Chrome."
            );
            return;
        }

        const recognition = new SpeechRecognition();

        // Dynamically select speech language based on active language setting (e.g. hi-IN, te-IN, en-IN)
        recognition.lang = activeLanguage?.speechLang || "en-IN";
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setComplaintText(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
            if (event.error === "not-allowed") {
                alert("Microphone permission denied. Please allow microphone access.");
            } else if (event.error === "no-speech") {
                alert("No speech detected. Please speak clearly and try again.");
            } else {
                alert("Voice input error: " + event.error);
            }
        };

        recognition.onend = () => {
            setListening(false);
        };

        try {
            recognition.start();
        } catch (error) {
            console.error(error);
            setListening(false);
        }
    };

    // Submit complaint to backend
    const submitComplaint = async (e) => {
        e.preventDefault();

        if (!complaintText.trim()) {
            alert(t("fillAllFields") || "Please describe your civic issue before submitting.");
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const response = await axios.post(
                "http://localhost:5000/api/complaints",
                {
                    complaintText: complaintText,
                    category: category,
                    language: activeLanguage?.name || "English"
                }
            );

            setResult(response.data.complaint);
            setComplaintText("");

        } catch (error) {
            console.error("Submission error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to process complaint. Please verify backend connection."
            );
        } finally {
            setLoading(false);
        }
    };

    // Track complaint status by ID or Tracking Code
    const handleTrackComplaint = async (e) => {
        e.preventDefault();
        if (!trackingCodeInput.trim()) return;

        try {
            setTrackingLoading(true);
            setTrackingError("");
            setTrackedComplaint(null);

            const response = await axios.get(
                `http://localhost:5000/api/complaints/track/${trackingCodeInput.trim()}`
            );

            setTrackedComplaint(response.data);
        } catch (error) {
            console.error("Tracking error:", error);
            setTrackingError(
                error.response?.data?.message ||
                t("notFound") ||
                "No record found for this Complaint ID."
            );
        } finally {
            setTrackingLoading(false);
        }
    };

    return (
        <div className="citizen-page">

            {/* Main Content Area */}
            <main className="main-container">

                {/* Hero / Welcome Banner */}
                <section className="welcome-section">
                    <p className="eyebrow">
                        🏛️ {t("citizenPortal")}
                    </p>
                    <h2>
                        {t("reportIssueTitle")}
                    </h2>
                    <p className="welcome-desc">
                        {t("reportSubtitle")}
                    </p>
                </section>

                {/* Complaint Submission Card */}
                <section className="complaint-card">
                    <div className="card-header">
                        <div>
                            <h3>{t("reportIssueTitle")}</h3>
                            <p className="card-sub">
                                Select category and describe your issue using voice or text in {activeLanguage?.native || "your language"}.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submitComplaint}>
                        {/* Category Selector Grid / Pills */}
                        <div className="category-selection-box">
                            <label className="input-label">{t("selectCategory")}</label>
                            <div className="category-pills">
                                {[
                                    { key: "catWater", val: "Water", icon: "💧" },
                                    { key: "catElectricity", val: "Electricity", icon: "⚡" },
                                    { key: "catRoads", val: "Roads", icon: "🛣️" },
                                    { key: "catSanitation", val: "Sanitation", icon: "🧹" },
                                    { key: "catHealth", val: "Health", icon: "🏥" },
                                    { key: "catOther", val: "Other", icon: "📋" }
                                ].map((catItem) => (
                                    <button
                                        key={catItem.val}
                                        type="button"
                                        className={`category-pill ${category === catItem.val ? "selected" : ""}`}
                                        onClick={() => setCategory(catItem.val)}
                                    >
                                        <span className="pill-icon">{catItem.icon}</span>
                                        <span>{t(catItem.key)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Complaint Description Textarea */}
                        <div className="form-group">
                            <textarea
                                className="complaint-input"
                                value={complaintText}
                                onChange={(e) => setComplaintText(e.target.value)}
                                placeholder={t("complaintPlaceholder")}
                                rows="5"
                            />

                            <div className="input-footer">
                                <span className="input-hint">
                                    {complaintText.length} characters
                                </span>

                                <button
                                    type="button"
                                    className={listening ? "voice-button listening" : "voice-button"}
                                    onClick={startVoiceInput}
                                    disabled={listening || loading}
                                >
                                    <span className="voice-icon">🎤</span>
                                    {listening ? t("listeningText") : t("voiceBtnText")}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? t("submitting") : t("submitBtn")}
                        </button>
                    </form>
                </section>

                {/* AI Submission Result Section */}
                {result && (
                    <section className="result-section">
                        <div className="result-header">
                            <div>
                                <p className="eyebrow">✅ {t("complaintSuccess")}</p>
                                <h2>{t("aiSummaryTitle")}</h2>
                                {result.trackingCode && (
                                    <p className="tracking-code-text">
                                        {t("trackingIdLabel")}: <strong>{result.trackingCode}</strong>
                                    </p>
                                )}
                            </div>

                            <span className={`status-badge status-${(result.status || "").toLowerCase().replace(/\s+/g, "-")}`}>
                                {result.status === "New" ? t("statusNew") : result.status === "In Progress" ? t("statusInProgress") : t("statusResolved")}
                            </span>
                        </div>

                        <div className="analysis-grid">
                            <div className="analysis-item">
                                <span>{t("categoryLabel")}</span>
                                <strong>{result.category}</strong>
                            </div>

                            <div className="analysis-item">
                                <span>{t("urgencyLabel")}</span>
                                <strong className={`urgency-text urgency-${(result.urgency || "").toLowerCase()}`}>
                                    {result.urgency === "Low" ? t("urgencyLow") : result.urgency === "Medium" ? t("urgencyMedium") : t("urgencyHigh")}
                                </strong>
                            </div>

                            <div className="analysis-item">
                                <span>{t("deptLabel")}</span>
                                <strong>{result.department}</strong>
                            </div>
                        </div>

                        <div className="ai-response">
                            <span>{t("aiReplyLabel")}</span>
                            <p>{result.reply}</p>
                        </div>
                    </section>
                )}

                {/* Complaint Tracking Tool Section */}
                <section className="complaint-card tracking-card" id="track-section">
                    <div className="tracking-header-text">
                        <h3>🔍 {t("trackTitle")}</h3>
                        <p className="section-desc">{t("trackSubtitle")}</p>
                    </div>

                    <form onSubmit={handleTrackComplaint} className="tracking-form">
                        <input
                            type="text"
                            value={trackingCodeInput}
                            onChange={(e) => setTrackingCodeInput(e.target.value)}
                            placeholder={t("enterCodePlaceholder")}
                            className="tracking-input"
                        />
                        <button type="submit" className="track-button" disabled={trackingLoading}>
                            {trackingLoading ? "..." : t("trackBtn")}
                        </button>
                    </form>

                    {trackingError && (
                        <p className="tracking-error">{trackingError}</p>
                    )}

                    {trackedComplaint && (
                        <div className="tracked-result-box">
                            <div className="tracked-result-header">
                                <div>
                                    <strong>{t("trackingIdLabel")}: {trackedComplaint.trackingCode || trackedComplaint._id}</strong>
                                    <p className="tracked-complaint-snippet">{trackedComplaint.complaintText}</p>
                                </div>
                                <span className={`status-badge status-${(trackedComplaint.status || "").toLowerCase().replace(/\s+/g, "-")}`}>
                                    {trackedComplaint.status === "New" ? t("statusNew") : trackedComplaint.status === "In Progress" ? t("statusInProgress") : t("statusResolved")}
                                </span>
                            </div>
                            <div className="tracked-details-grid">
                                <div><span>{t("deptLabel")}:</span> <strong>{trackedComplaint.department}</strong></div>
                                <div><span>{t("categoryLabel")}:</span> <strong>{trackedComplaint.category}</strong></div>
                                <div><span>{t("urgencyLabel")}:</span> <strong>{trackedComplaint.urgency}</strong></div>
                                <div><span>Language:</span> <strong>{trackedComplaint.language}</strong></div>
                            </div>
                            {trackedComplaint.reply && (
                                <div className="tracked-reply">
                                    <span>{t("aiReplyLabel")}:</span>
                                    <p>{trackedComplaint.reply}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

            </main>

            {/* Official Privacy & Service Footer */}
            <footer className="footer">
                <p>
                    {t("appName")} · {t("tagline")}
                </p>
                <p className="privacy-notice">
                    Notice: Grievances are routed directly to official government departments.
                </p>
            </footer>

        </div>
    );
}

export default CitizenPage;