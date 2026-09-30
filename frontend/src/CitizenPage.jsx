import { useState } from "react";
import axios from "axios";

function CitizenPage() {
    const [complaintText, setComplaintText] = useState("");
    const [language, setLanguage] = useState("English");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const startVoiceInput = () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "Voice input is not supported. Please use Google Chrome."
            );
            return;
        }

        const recognition = new SpeechRecognition();

        if (language === "Telugu") {
            recognition.lang = "te-IN";
        } else if (language === "Hindi") {
            recognition.lang = "hi-IN";
        } else {
            recognition.lang = "en-IN";
        }

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onresult = (event) => {
            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {
                transcript += event.results[i][0].transcript;
            }

            setComplaintText(transcript);
        };

        recognition.onerror = (event) => {
            console.error(
                "Speech recognition error:",
                event.error
            );

            setListening(false);

            if (event.error === "not-allowed") {
                alert(
                    "Microphone permission denied. Please allow microphone access."
                );
            } else if (event.error === "no-speech") {
                alert(
                    "No speech detected. Please speak clearly and try again."
                );
            } else if (event.error === "audio-capture") {
                alert(
                    "No microphone was detected. Please check your microphone."
                );
            } else if (event.error === "network") {
                alert(
                    "Speech recognition network error. Please check your internet connection."
                );
            } else {
                alert(
                    "Voice input failed: " + event.error
                );
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

    const submitComplaint = async (e) => {
        e.preventDefault();

        if (!complaintText.trim()) {
            alert("Please enter your complaint");
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const response = await axios.post(
                "http://localhost:5000/api/complaints",
                {
                    complaintText: complaintText,
                    language: language
                }
            );

            setResult(response.data.complaint);
            setComplaintText("");

        } catch (error) {
            console.error(error);
            alert("Failed to submit complaint");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="citizen-page">

            {/* Header */}
            <header className="top-header">
                <div className="brand">
                    <div className="brand-icon">J</div>

                    <div>
                        <h1>JanSaathi</h1>
                        <p>AI Civic Helpdesk</p>
                    </div>
                </div>

                <div className="header-badge">
                    Citizen Services
                </div>
            </header>

            {/* Main content */}
            <main className="main-container">

                <section className="welcome-section">
                    <p className="eyebrow">
                        CITIZEN SUPPORT
                    </p>

                    <h2>
                        Report a civic issue
                    </h2>

                    <p>
                        Tell us about a problem in your area.
                        You can type your complaint or use your
                        voice.
                    </p>
                </section>

                {/* Complaint Card */}
                <section className="complaint-card">

                    <div className="card-header">
                        <div>
                            <h3>Your complaint</h3>
                            <p>
                                Describe the issue clearly so
                                JanSaathi can understand it.
                            </p>
                        </div>

                        <div className="language-box">
                            <label htmlFor="language">
                                Language
                            </label>

                            <select
                                id="language"
                                value={language}
                                onChange={(e) =>
                                    setLanguage(e.target.value)
                                }
                            >
                                <option value="English">
                                    English
                                </option>

                                <option value="Telugu">
                                    తెలుగు
                                </option>

                                <option value="Hindi">
                                    हिन्दी
                                </option>
                            </select>
                        </div>
                    </div>

                    <form onSubmit={submitComplaint}>

                        <textarea
                            className="complaint-input"
                            value={complaintText}
                            onChange={(e) =>
                                setComplaintText(
                                    e.target.value
                                )
                            }
                            placeholder="Describe your civic problem here..."
                            rows="7"
                        />

                        <div className="input-footer">

                            <span className="input-hint">
                                {complaintText.length} characters
                            </span>

                            <button
                                type="button"
                                className={
                                    listening
                                        ? "voice-button listening"
                                        : "voice-button"
                                }
                                onClick={startVoiceInput}
                                disabled={
                                    listening || loading
                                }
                            >
                                <span className="voice-icon">
                                    🎤
                                </span>

                                {listening
                                    ? "Listening..."
                                    : "Speak Complaint"}
                            </button>

                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Analyzing complaint..."
                                : "Submit Complaint"}
                        </button>

                    </form>

                </section>

                {/* Result */}
                {result && (
                    <section className="result-section">

                        <div className="result-header">
                            <div>
                                <p className="eyebrow">
                                    AI ANALYSIS
                                </p>

                                <h2>
                                    Complaint received
                                </h2>
                            </div>

                            <span className="status-badge">
                                {result.status}
                            </span>
                        </div>

                        <div className="analysis-grid">

                            <div className="analysis-item">
                                <span>
                                    Category
                                </span>

                                <strong>
                                    {result.category}
                                </strong>
                            </div>

                            <div className="analysis-item">
                                <span>
                                    Urgency
                                </span>

                                <strong>
                                    {result.urgency}
                                </strong>
                            </div>

                            <div className="analysis-item">
                                <span>
                                    Department
                                </span>

                                <strong>
                                    {result.department}
                                </strong>
                            </div>

                        </div>

                        <div className="ai-response">
                            <span>
                                JanSaathi response
                            </span>

                            <p>
                                {result.reply}
                            </p>
                        </div>

                    </section>
                )}

                {/* Information */}
                <section className="info-section">

                    <div className="info-card">
                        <span>🌐</span>

                        <div>
                            <h3>Multiple languages</h3>
                            <p>
                                Submit complaints in English,
                                Telugu or Hindi.
                            </p>
                        </div>
                    </div>

                    <div className="info-card">
                        <span>🎤</span>

                        <div>
                            <h3>Voice assistance</h3>
                            <p>
                                Speak your complaint instead
                                of typing it.
                            </p>
                        </div>
                    </div>

                    <div className="info-card">
                        <span>🤖</span>

                        <div>
                            <h3>AI-powered analysis</h3>
                            <p>
                                Your complaint is categorized
                                and routed to the appropriate
                                department.
                            </p>
                        </div>
                    </div>

                </section>

            </main>

            <footer className="footer">
                <p>
                    JanSaathi · AI-assisted civic support
                </p>

                <p>
                    Please do not submit sensitive personal
                    information.
                </p>
            </footer>

        </div>
    );
}

export default CitizenPage;