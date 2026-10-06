import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { useLanguage } from "./LanguageContext";

const CHART_COLORS = ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED", "#6B7280"];

function OfficerDashboard() {
    const { t } = useLanguage();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [urgencyFilter, setUrgencyFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    
    // Status update confirmation modal state
    const [confirmingUpdate, setConfirmingUpdate] = useState(null);
    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("officerToken");

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/complaints`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setComplaints(response.data);
        } catch (error) {
            console.error("Fetch complaints error:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("officerToken");
                navigate("/login");
            } else {
                alert("Failed to load complaints");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("officerToken");
        navigate("/login");
    };

    const triggerStatusConfirm = (id, newStatus) => {
        setConfirmingUpdate({ id, status: newStatus });
    };

    const executeStatusUpdate = async () => {
        if (!confirmingUpdate) return;
        const { id, status } = confirmingUpdate;

        try {
            setUpdating(true);
            const token = localStorage.getItem("officerToken");

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/complaints/${id}/status`,
                { status: status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setConfirmingUpdate(null);
            await fetchComplaints();

        } catch (error) {
            console.error("Status update error:", error);
            alert("Failed to update complaint status");
        } finally {
            setUpdating(false);
        }
    };

    // Metrics calculations
    const totalComplaints = complaints.length;
    const newComplaints = complaints.filter(c => c.status === "New").length;
    const inProgressComplaints = complaints.filter(c => c.status === "In Progress").length;
    const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;

    // Filter complaints list
    const filteredComplaints = complaints.filter((c) => {
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        const matchesCategory = categoryFilter === "All" || (c.category || "").toLowerCase() === categoryFilter.toLowerCase();
        const matchesUrgency = urgencyFilter === "All" || (c.urgency || "").toLowerCase() === urgencyFilter.toLowerCase();
        
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch = !q ||
            (c.complaintText && c.complaintText.toLowerCase().includes(q)) ||
            (c.trackingCode && c.trackingCode.toLowerCase().includes(q)) ||
            (c.department && c.department.toLowerCase().includes(q)) ||
            (c.category && c.category.toLowerCase().includes(q));

        return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
    });

    // Category chart data
    const categoryCounts = {};
    complaints.forEach((c) => {
        const cat = c.category ? c.category.charAt(0).toUpperCase() + c.category.slice(1) : "Other";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const chartData = Object.keys(categoryCounts).map((cat) => ({
        name: cat,
        value: categoryCounts[cat]
    }));

    return (
        <div className="officer-dashboard-page">

            {/* Dashboard Header Bar */}
            <div className="dashboard-top-bar">
                <div>
                    <h2>{t("officerTitle")}</h2>
                    <p className="dashboard-sub">{t("officerSubtitle")}</p>
                </div>

                <div className="dashboard-actions">
                    <button onClick={fetchComplaints} className="btn-refresh" disabled={loading}>
                        {loading ? "..." : "↻ Refresh Data"}
                    </button>
                    <button onClick={handleLogout} className="btn-logout">
                        {t("logout")}
                    </button>
                </div>
            </div>

            <main className="dashboard-main">

                {/* Statistics Overview Grid */}
                <section className="metrics-grid">
                    <div className="metric-card">
                        <span className="metric-label">{t("totalComplaints")}</span>
                        <span className="metric-value">{totalComplaints}</span>
                    </div>

                    <div className="metric-card metric-new">
                        <span className="metric-label">{t("pendingCount")}</span>
                        <span className="metric-value">{newComplaints}</span>
                    </div>

                    <div className="metric-card metric-progress">
                        <span className="metric-label">{t("inProgressCount")}</span>
                        <span className="metric-value">{inProgressComplaints}</span>
                    </div>

                    <div className="metric-card metric-resolved">
                        <span className="metric-label">{t("resolvedCount")}</span>
                        <span className="metric-value">{resolvedComplaints}</span>
                    </div>
                </section>

                {/* Category Visualization Chart */}
                <section className="dashboard-section chart-section">
                    <h3>{t("categoryChartTitle")}</h3>

                    {chartData.length > 0 ? (
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={95}
                                        innerRadius={45}
                                        paddingAngle={3}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="empty-chart-text">No category data available.</p>
                    )}
                </section>

                {/* Search & Filter Toolbar */}
                <section className="dashboard-section directory-section">
                    <div className="directory-header">
                        <h3>{t("allComplaintsTitle")}</h3>

                        <div className="toolbar-controls">
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="All">{t("filterStatus")}: All</option>
                                <option value="New">{t("statusNew")}</option>
                                <option value="In Progress">{t("statusInProgress")}</option>
                                <option value="Resolved">{t("statusResolved")}</option>
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="All">{t("filterCategory")}: All</option>
                                <option value="water">{t("catWater")}</option>
                                <option value="electricity">{t("catElectricity")}</option>
                                <option value="roads">{t("catRoads")}</option>
                                <option value="sanitation">{t("catSanitation")}</option>
                                <option value="health">{t("catHealth")}</option>
                                <option value="other">{t("catOther")}</option>
                            </select>

                            <select
                                value={urgencyFilter}
                                onChange={(e) => setUrgencyFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="All">Urgency: All</option>
                                <option value="low">{t("urgencyLow")}</option>
                                <option value="medium">{t("urgencyMedium")}</option>
                                <option value="high">{t("urgencyHigh")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Table View */}
                    {loading ? (
                        <div className="loading-box">
                            <p>Loading grievances directory...</p>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="empty-box">
                            <p>{t("noData")}</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="complaints-table">
                                <thead>
                                    <tr>
                                        <th>{t("tableColId")}</th>
                                        <th>{t("tableColComplaint")}</th>
                                        <th>Language</th>
                                        <th>{t("categoryLabel")}</th>
                                        <th>{t("tableColUrgency")}</th>
                                        <th>{t("tableColDept")}</th>
                                        <th>{t("tableColStatus")}</th>
                                        <th>{t("tableColAction")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComplaints.map((c) => (
                                        <tr key={c._id}>
                                            <td className="code-cell">
                                                <strong>{c.trackingCode || String(c._id).slice(-6)}</strong>
                                            </td>

                                            <td className="desc-cell">
                                                <p className="complaint-text-snippet">{c.complaintText}</p>
                                                {c.reply && (
                                                    <span className="reply-preview">Reply: {c.reply}</span>
                                                )}
                                            </td>

                                            <td>{c.language}</td>

                                            <td>
                                                <span className="cat-chip">{c.category}</span>
                                            </td>

                                            <td>
                                                <span className={`urgency-badge urgency-${(c.urgency || "").toLowerCase()}`}>
                                                    {c.urgency === "Low" ? t("urgencyLow") : c.urgency === "Medium" ? t("urgencyMedium") : t("urgencyHigh")}
                                                </span>
                                            </td>

                                            <td>{c.department}</td>

                                            <td>
                                                <span className={`status-badge status-${(c.status || "").toLowerCase().replace(/\s+/g, "-")}`}>
                                                    {c.status === "New" ? t("statusNew") : c.status === "In Progress" ? t("statusInProgress") : t("statusResolved")}
                                                </span>
                                            </td>

                                            <td className="action-cell">
                                                {c.status !== "In Progress" && c.status !== "Resolved" && (
                                                    <button
                                                        onClick={() => triggerStatusConfirm(c.trackingCode || c._id, "In Progress")}
                                                        className="btn-status-progress"
                                                    >
                                                        {t("markInProgress")}
                                                    </button>
                                                )}

                                                {c.status !== "Resolved" && (
                                                    <button
                                                        onClick={() => triggerStatusConfirm(c.trackingCode || c._id, "Resolved")}
                                                        className="btn-status-resolve"
                                                    >
                                                        {t("markResolved")}
                                                    </button>
                                                )}

                                                {c.status === "Resolved" && (
                                                    <span className="resolved-check">✓ Complete</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </main>

            {/* Confirmation Modal before Status Changes */}
            {confirmingUpdate && (
                <div className="modal-overlay">
                    <div className="modal-dialog">
                        <h4>Confirm Status Update</h4>
                        <p>
                            Are you sure you want to change the status of complaint <strong>#{confirmingUpdate.id}</strong> to <strong>"{confirmingUpdate.status}"</strong>?
                        </p>

                        <div className="modal-actions">
                            <button
                                onClick={() => setConfirmingUpdate(null)}
                                className="btn-modal-cancel"
                                disabled={updating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeStatusUpdate}
                                className="btn-modal-confirm"
                                disabled={updating}
                            >
                                {updating ? "Updating..." : "Confirm Status Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default OfficerDashboard;