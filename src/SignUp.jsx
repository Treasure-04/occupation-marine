import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

const COLORS = {
  navy: "#0a1f3d",
  gold: "#c8a84b",
  white: "#ffffff",
  offWhite: "#f4f6f9",
  gray: "#6b7280",
};

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(result.user, { displayName: form.name });
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign in failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: COLORS.white, width: "100%", maxWidth: "420px", padding: "48px 40px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>⚓</div>
          <div style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "1.4rem" }}>OMSL</div>
          <div style={{ color: COLORS.gold, fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase" }}>Client Portal</div>
        </div>

        <h2 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "6px" }}>Create Account</h2>
        <p style={{ color: COLORS.gray, fontSize: "0.88rem", marginBottom: "28px" }}>Join the OMSL client portal today</p>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px 16px", fontSize: "0.85rem", marginBottom: "20px", borderLeft: "3px solid #b91c1c" }}>
            {error}
          </div>
        )}

        {[
          { label: "Full Name", type: "text", placeholder: "John Doe", key: "name" },
          { label: "Email Address", type: "email", placeholder: "you@example.com", key: "email" },
          { label: "Password", type: "password", placeholder: "Min. 6 characters", key: "password" },
          { label: "Confirm Password", type: "password", placeholder: "••••••••", key: "confirm" },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: COLORS.navy, fontSize: "0.8rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{field.label}</label>
            <input type={field.type} placeholder={field.placeholder} value={form[field.key]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(10,31,61,0.2)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              onFocus={e => e.target.style.borderColor = COLORS.gold}
              onBlur={e => e.target.style.borderColor = "rgba(10,31,61,0.2)"} />
          </div>
        ))}

        <button onClick={handleSignUp} disabled={loading}
          style={{ width: "100%", backgroundColor: COLORS.navy, color: COLORS.white, border: "none", padding: "15px", fontSize: "0.9rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", marginTop: "8px", marginBottom: "12px" }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <button onClick={handleGoogle} disabled={loading}
          style={{ width: "100%", backgroundColor: COLORS.white, color: COLORS.navy, border: "2px solid rgba(10,31,61,0.2)", padding: "13px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.1rem" }}>G</span> Sign up with Google
        </button>

        <p style={{ textAlign: "center", color: COLORS.gray, fontSize: "0.88rem", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: COLORS.gold, fontWeight: "600", textDecoration: "none" }}>Sign in</Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "12px" }}>
          <Link to="/" style={{ color: COLORS.gray, fontSize: "0.82rem", textDecoration: "none" }}>Back to website</Link>
        </p>
      </div>
    </div>
  );
}