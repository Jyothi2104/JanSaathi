import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate
} from "react-router-dom";

import CitizenPage from "./CitizenPage";
import OfficerLogin from "./OfficerLogin";
import OfficerDashboard from "./OfficerDashboard";

function ProtectedOfficer() {
    const token = localStorage.getItem("officerToken");

    

    if (token === null) {
        return <Navigate to="/login" replace />;
    }

    return <OfficerDashboard />;
}

function App() {
    return (
        <BrowserRouter>

            <nav>
                <Link to="/">Citizen</Link>
                {" | "}
                <Link to="/login">Officer Login</Link>
            </nav>

            <hr />

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

            </Routes>

        </BrowserRouter>
    );
}

export default App;