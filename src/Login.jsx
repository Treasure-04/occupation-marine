import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";
import { useEffect } from "react";

const COLORS = {
  navy: "#0a1f3d",
  gold: "#c8a84b",
  white: "#ffffff",
  offWhite: "#f4f6f9",
  gray: "#6b7280",
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth).then(result => {
      if (result?.user) {
        navigate("/dashboard");
      }
    }).catch(err => {
      setError("Google sign in failed. Please try again.");
    });
  }, []);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError("Google sign in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: COLORS.white, width: "100%", maxWidth: "420px", padding: "48px 40px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>⚓</div>
          <div style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "1.4rem" }}>OMSL</div>
          <div style={{ color: COLORS.gold, fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase" }}>Client Portal</div>
        </div>

        <h2 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "6px" }}>Welcome Back</h2>
        <p style={{ color: COLORS.gray, fontSize: "0.88rem", marginBottom: "28px" }}>Sign in to your account to continue</p>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px 16px", fontSize: "0.85rem", marginBottom: "20px", borderLeft: "3px solid #b91c1c" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: COLORS.navy, fontSize: "0.8rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Email Address</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(10,31,61,0.2)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = COLORS.gold}
            onBlur={e => e.target.style.borderColor = "rgba(10,31,61,0.2)"} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", color: COLORS.navy, fontSize: "0.8rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Password</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(10,31,61,0.2)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = COLORS.gold}
            onBlur={e => e.target.style.borderColor = "rgba(10,31,61,0.2)"} />
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width: "100%", backgroundColor: COLORS.navy, color: COLORS.white, border: "none", padding: "15px", fontSize: "0.9rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", marginBottom: "12px" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button onClick={handleGoogle} disabled={loading}
          style={{ width: "100%", backgroundColor: COLORS.white, color: COLORS.navy, border: "2px solid rgba(10,31,61,0.2)", padding: "13px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.1rem" }}>G</span> {loading ? "Redirecting..." : "Sign in with Google"}
        </button>

        <p style={{ textAlign: "center", color: COLORS.gray, fontSize: "0.88rem", marginTop: "24px" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: COLORS.gold, fontWeight: "600", textDecoration: "none" }}>Create one</Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "12px" }}>
          <Link to="/" style={{ color: COLORS.gray, fontSize: "0.82rem", textDecoration: "none" }}>Back to website</Link>
        </p>
      </div>
    </div>
  );
}
