import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const COLORS = {
  navy: "#0a1f3d",
  gold: "#c8a84b",
  white: "#ffffff",
  offWhite: "#f4f6f9",
  gray: "#6b7280",
  darkGray: "#1e293b",
};

function StatusBadge({ status }) {
  const colors = {
    Completed: { bg: "#dcfce7", color: "#166534" },
    "In Progress": { bg: "#fef9c3", color: "#854d0e" },
    Pending: { bg: "#fee2e2", color: "#991b1b" },
  };
  return (
    <span style={{ backgroundColor: colors[status]?.bg || "#f4f6f9", color: colors[status]?.color || "#000", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600" }}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ service: "", details: "" });
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "requests"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleSubmit = async () => {
    if (!newRequest.service || !newRequest.details) return;
    try {
      await addDoc(collection(db, "requests"), {
        userId: user.uid,
        userName: user.displayName || user.email,
        service: newRequest.service,
        details: newRequest.details,
        status: "Pending",
        createdAt: serverTimestamp(),
        date: new Date().toISOString().split("T")[0],
      });
      setNewRequest({ service: "", details: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding request:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.offWhite, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <div style={{ backgroundColor: COLORS.navy, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: "65px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem" }}>⚓</span>
          <div style={{ color: COLORS.white, fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "0.95rem" }}>Occupation Marine Services Ltd</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Welcome, {user?.displayName || user?.email}</span>
          <Link to="/" style={{ color: COLORS.gold, fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }} onClick={() => auth.signOut()}>Logout</Link>
        </div>
      </div>

      <div style={{ padding: "40px 5%" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.8rem", fontWeight: "bold", marginBottom: "6px" }}>My Dashboard</h1>
          <p style={{ color: COLORS.gray, fontSize: "0.9rem" }}>Track and manage your service requests</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Total Requests", value: requests.length, icon: "📋" },
            { label: "Pending", value: requests.filter(r => r.status === "Pending").length, icon: "⏳" },
            { label: "In Progress", value: requests.filter(r => r.status === "In Progress").length, icon: "⚙️" },
            { label: "Completed", value: requests.filter(r => r.status === "Completed").length, icon: "✅" },
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: COLORS.white, padding: "24px 20px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ color: COLORS.navy, fontSize: "2rem", fontWeight: "bold", fontFamily: "'Georgia', serif" }}>{stat.value}</div>
              <div style={{ color: COLORS.gray, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: COLORS.white, padding: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.3rem", fontWeight: "bold" }}>My Service Requests</h2>
            <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: COLORS.navy, color: COLORS.white, border: "none", padding: "10px 20px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
              + New Request
            </button>
          </div>

          {showForm && (
            <div style={{ backgroundColor: COLORS.offWhite, padding: "24px", marginBottom: "24px", borderLeft: "3px solid #c8a84b" }}>
              <h3 style={{ color: COLORS.navy, marginBottom: "16px", fontFamily: "'Georgia', serif" }}>Submit New Request</h3>
              <select value={newRequest.service} onChange={e => setNewRequest({ ...newRequest, service: e.target.value })}
                style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(10,31,61,0.2)", fontSize: "0.95rem", marginBottom: "12px", outline: "none", fontFamily: "inherit", backgroundColor: COLORS.white }}>
                <option value="">Select a Service</option>
                <option>Vessel and FPSO Tank Cleaning</option>
                <option>Barging and Evacuation Services</option>
                <option>Civil and Industrial Engineering</option>
                <option>Oilfield Services</option>
                <option>Environmental Consultancy</option>
                <option>Labour Supply</option>
              </select>
              <textarea value={newRequest.details} onChange={e => setNewRequest({ ...newRequest, details: e.target.value })}
                placeholder="Describe your request..."
                style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(10,31,61,0.2)", fontSize: "0.95rem", height: "100px", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <button onClick={handleSubmit} style={{ backgroundColor: COLORS.gold, color: COLORS.navy, border: "none", padding: "12px 28px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", marginTop: "12px", textTransform: "uppercase" }}>
                Submit Request
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: COLORS.gray }}>Loading requests...</div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: COLORS.gray }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📋</div>
              <p>No requests yet. Click "New Request" to get started!</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f4f6f9" }}>
                  {["#", "Service", "Date", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 8px", color: COLORS.gray, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f4f6f9", backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.offWhite }}>
                    <td style={{ padding: "14px 8px", color: COLORS.gray, fontSize: "0.85rem" }}>{i + 1}</td>
                    <td style={{ padding: "14px 8px", color: COLORS.darkGray, fontSize: "0.9rem", fontWeight: "500" }}>{r.service}</td>
                    <td style={{ padding: "14px 8px", color: COLORS.gray, fontSize: "0.85rem" }}>{r.date}</td>
                    <td style={{ padding: "14px 8px" }}><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
