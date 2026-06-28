import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, doc, updateDoc, getDoc, orderBy } from "firebase/firestore";
import { auth, db } from "./firebase";
import emailjs from "@emailjs/browser";

const COLORS = {
  navy: "#0a1f3d",
  gold: "#c8a84b",
  white: "#ffffff",
  offWhite: "#f4f6f9",
  gray: "#6b7280",
  darkGray: "#1e293b",
};

const EMAILJS_SERVICE_ID = "service_2x8xt3a";
const EMAILJS_TEMPLATE_ID = "template_i7tfhc6";
const EMAILJS_PUBLIC_KEY = "ZFAZHC99UzQrRCaJR";

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

export default function Admin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [filter, setFilter] = useState("All");
  const [emailStatus, setEmailStatus] = useState({});
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setHasAccess(true);
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        navigate("/dashboard");
      }
      setCheckingAccess(false);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!hasAccess) return;
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
      setLoading(false);
    });
    return () => unsub();
  }, [hasAccess]);

  const sendStatusEmail = async (request, newStatus) => {
    try {
      let clientEmail = request.userEmail;
      if (!clientEmail) {
        const userDoc = await getDoc(doc(db, "users", request.userId));
        clientEmail = userDoc.exists() ? userDoc.data().email : null;
      }
      if (!clientEmail) return;

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_name: request.userName || "Client",
        to_email: clientEmail,
        service: request.service,
        status: newStatus,
      }, EMAILJS_PUBLIC_KEY);

      setEmailStatus(prev => ({ ...prev, [request.id]: "sent" }));
    } catch (err) {
      console.error("Email send error:", err);
      setEmailStatus(prev => ({ ...prev, [request.id]: "failed" }));
    }
  };

  const handleStatusChange = async (request, newStatus) => {
    try {
      await updateDoc(doc(db, "requests", request.id), { status: newStatus });
      sendStatusEmail(request, newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (checkingAccess) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.offWhite, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ color: COLORS.navy }}>Checking access...</div>
      </div>
    );
  }

  const filteredRequests = filter === "All" ? requests : requests.filter(r => r.status === filter);
  const uniqueClients = new Set(requests.map(r => r.userId)).size;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.offWhite, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <div style={{ backgroundColor: COLORS.navy, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: "65px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem" }}>⚓</span>
          <div style={{ color: COLORS.white, fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "0.95rem" }}>Occupation Marine Services Ltd</div>
          <span style={{ backgroundColor: COLORS.gold, color: COLORS.navy, fontSize: "0.65rem", fontWeight: "700", padding: "3px 10px", borderRadius: "12px", textTransform: "uppercase", letterSpacing: "1px", marginLeft: "8px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{user?.displayName || user?.email}</span>
          <Link to="/" style={{ color: COLORS.gold, fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }} onClick={() => auth.signOut()}>Logout</Link>
        </div>
      </div>

      <div style={{ padding: "40px 5%" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.8rem", fontWeight: "bold", marginBottom: "6px" }}>Admin Dashboard</h1>
          <p style={{ color: COLORS.gray, fontSize: "0.9rem" }}>Manage all client service requests</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Total Requests", value: requests.length, icon: "📋" },
            { label: "Total Clients", value: uniqueClients, icon: "👥" },
            { label: "Pending", value: requests.filter(r => r.status === "Pending").length, icon: "⏳" },
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.3rem", fontWeight: "bold" }}>All Service Requests</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["All", "Pending", "In Progress", "Completed"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 16px", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer",
                    border: filter === f ? "none" : "1px solid rgba(10,31,61,0.2)",
                    backgroundColor: filter === f ? COLORS.navy : COLORS.white,
                    color: filter === f ? COLORS.white : COLORS.gray,
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: COLORS.gray }}>Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: COLORS.gray }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📋</div>
              <p>No requests found.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "750px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f4f6f9" }}>
                    {["Client", "Service", "Details", "Date", "Status", "Update Status", "Email"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px 8px", color: COLORS.gray, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #f4f6f9", backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.offWhite }}>
                      <td style={{ padding: "14px 8px", color: COLORS.darkGray, fontSize: "0.88rem", fontWeight: "500" }}>{r.userName || "Unknown"}</td>
                      <td style={{ padding: "14px 8px", color: COLORS.darkGray, fontSize: "0.88rem" }}>{r.service}</td>
                      <td style={{ padding: "14px 8px", color: COLORS.gray, fontSize: "0.82rem", maxWidth: "220px" }}>{r.details}</td>
                      <td style={{ padding: "14px 8px", color: COLORS.gray, fontSize: "0.85rem" }}>{r.date}</td>
                      <td style={{ padding: "14px 8px" }}><StatusBadge status={r.status} /></td>
                      <td style={{ padding: "14px 8px" }}>
                        <select value={r.status} onChange={e => handleStatusChange(r, e.target.value)}
                          style={{ padding: "6px 10px", fontSize: "0.82rem", border: "1px solid rgba(10,31,61,0.2)", backgroundColor: COLORS.white, fontFamily: "inherit" }}>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>
                      <td style={{ padding: "14px 8px", fontSize: "0.78rem", color: emailStatus[r.id] === "sent" ? "#166534" : emailStatus[r.id] === "failed" ? "#991b1b" : COLORS.gray }}>
                        {emailStatus[r.id] === "sent" ? "✓ Sent" : emailStatus[r.id] === "failed" ? "✗ Failed" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
