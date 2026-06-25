import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";

const COLORS = {
  navy: "#0a1f3d",
  gold: "#c8a84b",
  white: "#ffffff",
  offWhite: "#f4f6f9",
  gray: "#6b7280",
  darkGray: "#1e293b",
};

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", color: COLORS.navy, fontSize: "0.8rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={onChange}
        style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(10,31,61,0.2)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
        onFocus={e => e.target.style.borderColor = COLORS.gold}
        onBlur={e => e.target.style.borderColor = "rgba(10,31,61,0.2)"} />
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", company: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthChecked(true);
      if (!firebaseUser) {
        navigate("/login");
        return;
      }
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function loadProfile() {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setForm({
            name: data.name || user.displayName || "",
            phone: data.phone || "",
            company: data.company || "",
            address: data.address || "",
          });
        } else {
          setForm(f => ({ ...f, name: user.displayName || "" }));
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        phone: form.phone,
        company: form.company,
        address: form.address,
        email: user.email,
      }, { merge: true });
      setSaved(true);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
    setSaving(false);
  };

  if (!authChecked || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.offWhite, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ color: COLORS.navy }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.offWhite, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <div style={{ backgroundColor: COLORS.navy, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: "65px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem" }}>⚓</span>
          <div style={{ color: COLORS.white, fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "0.95rem" }}>Occupation Marine Services Ltd</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/dashboard" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", textDecoration: "none" }}>← Back to Dashboard</Link>
          <Link to="/" style={{ color: COLORS.gold, fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }} onClick={() => auth.signOut()}>Logout</Link>
        </div>
      </div>

      <div style={{ padding: "40px 5%", maxWidth: "600px", margin: "0 auto" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.8rem", fontWeight: "bold", marginBottom: "6px" }}>My Profile</h1>
          <p style={{ color: COLORS.gray, fontSize: "0.9rem" }}>Update your personal and company information</p>
        </div>

        <div style={{ backgroundColor: COLORS.white, padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

          <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #f4f6f9" }}>
            <div style={{ color: COLORS.gold, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>Email Address</div>
            <div style={{ color: COLORS.darkGray, fontSize: "0.95rem" }}>{user?.email}</div>
          </div>

          <Field label="Full Name" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Field label="Phone Number" type="tel" placeholder="+234 000 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Field label="Company Name" placeholder="Your company (if applicable)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          <Field label="Address" placeholder="Your address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />

          {saved && (
            <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "12px 16px", fontSize: "0.85rem", marginBottom: "16px", borderLeft: "3px solid #166534" }}>
              Profile updated successfully!
            </div>
          )}

          <button onClick={handleSave} disabled={saving}
            style={{ width: "100%", backgroundColor: COLORS.navy, color: COLORS.white, border: "none", padding: "15px", fontSize: "0.9rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
