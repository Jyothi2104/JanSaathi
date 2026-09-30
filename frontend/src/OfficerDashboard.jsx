import { useEffect, useState } from "react";
import axios from "axios";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

function OfficerDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/complaints"
            );

            setComplaints(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/complaints/${id}/status`,
                {
                    status: status
                }
            );

            await fetchComplaints();

        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const totalComplaints = complaints.length;

    const newComplaints = complaints.filter(
        (complaint) => complaint.status === "New"
    ).length;

    const inProgressComplaints = complaints.filter(
        (complaint) => complaint.status === "In Progress"
    ).length;

    const resolvedComplaints = complaints.filter(
        (complaint) => complaint.status === "Resolved"
    ).length;

    // Count complaints by category
    const categoryCounts = {};

    complaints.forEach((complaint) => {
        const category = complaint.category || "other";

        if (categoryCounts[category]) {
            categoryCounts[category]++;
        } else {
            categoryCounts[category] = 1;
        }
    });

    const chartData = Object.keys(categoryCounts).map((category) => ({
        name: category,
        value: categoryCounts[category]
    }));

    if (loading) {
        return <h2>Loading complaints...</h2>;
    }

    return (
        <div>

            <h1>JanSaathi Officer Dashboard</h1>

            {/* Statistics */}

            <div>
                <h3>Total Complaints</h3>
                <p>{totalComplaints}</p>
            </div>

            <div>
                <h3>New</h3>
                <p>{newComplaints}</p>
            </div>

            <div>
                <h3>In Progress</h3>
                <p>{inProgressComplaints}</p>
            </div>

            <div>
                <h3>Resolved</h3>
                <p>{resolvedComplaints}</p>
            </div>

            <hr />

            {/* Category Chart */}

            <h2>Complaints by Category</h2>

            {chartData.length > 0 ? (
                <PieChart width={500} height={350}>

                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>
            ) : (
                <p>No category data available.</p>
            )}

            <hr />

            {/* Complaints Table */}

            <h2>All Complaints</h2>

            {complaints.length === 0 ? (
                <p>No complaints found.</p>
            ) : (
                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>Complaint</th>
                            <th>Language</th>
                            <th>Category</th>
                            <th>Urgency</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {complaints.map((complaint) => (
                            <tr key={complaint._id}>

                                <td>
                                    {complaint.complaintText}
                                </td>

                                <td>
                                    {complaint.language}
                                </td>

                                <td>
                                    {complaint.category}
                                </td>

                                <td>
                                    {complaint.urgency}
                                </td>

                                <td>
                                    {complaint.department}
                                </td>

                                <td>
                                    {complaint.status}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                complaint._id,
                                                "In Progress"
                                            )
                                        }
                                    >
                                        In Progress
                                    </button>

                                    <br />
                                    <br />

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                complaint._id,
                                                "Resolved"
                                            )
                                        }
                                    >
                                        Resolved
                                    </button>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default OfficerDashboard;