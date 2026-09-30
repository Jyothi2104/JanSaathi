import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { LanguageProvider } from "./LanguageContext";
import Header from "./components/Header";
import CitizenPage from "./CitizenPage";
import OfficerLogin from "./OfficerLogin";
import OfficerDashboard from "./OfficerDashboard";

// Route protection for officer portal
function ProtectedOfficer() {
    const token = localStorage.getItem("officerToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <OfficerDashboard />;
}

function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <div className="app-layout">
                    <Header />

                    <main className="app-content">
                        <Routes>
                            <Route
                                path="/"
                                element={<CitizenPage />}
                            />

                            <Route
                                path="/login"
                                element={<OfficerLogin />}
                            />

                            <Route
                                path="/officer"
                                element={<ProtectedOfficer />}
                            />

                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </LanguageProvider>
    );
}

export default App;