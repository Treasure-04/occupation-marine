import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const COLORS = {
  navy: "#0a1f3d",
  navyLight: "#122a52",
  gold: "#c8a84b",
  goldLight: "#e8c96e",
  white: "#ffffff",
  offWhite: "#f4f6f9",
  gray: "#6b7280",
  darkGray: "#1e293b",
};

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80",
    title: "Powering Nigeria's Oil & Gas Industry",
    subtitle: "Trusted oil servicing partner since 1993",
  },
  {
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    title: "Vessel & FPSO Tank Cleaning",
    subtitle: "World-class marine services at Onne Port, Rivers State",
  },
  {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
    title: "Civil & Industrial Engineering",
    subtitle: "Built on diligence, integrity and excellence",
  },
];

const services = [
  { icon: "🛢️", title: "Vessel & FPSO Tank Cleaning", desc: "Professional cleaning of vessels and FPSO units to the highest safety standards." },
  { icon: "🚢", title: "Barging and Evacuation Services", desc: "Professional barging and evacuation services supporting Nigeria's oil and gas operations." },
  { icon: "🏗️", title: "Civil & Industrial Engineering", desc: "Comprehensive engineering solutions for industrial and civil infrastructure." },
  { icon: "🔧", title: "Oilfield Services", desc: "Full-spectrum oilfield support for private and public sector clients across Nigeria." },
  { icon: "🌿", title: "Environmental Consultancy", desc: "Sustainable environmental impact assessments for the oil & gas sector." },
  { icon: "👷", title: "Labour Supply", desc: "Highly skilled and trained workforce, ready to meet our clients' evolving demands." },
];

const stats = [
  { value: "30+", label: "Years of Experience" },
  { value: "200+", label: "Projects Completed" },
  { value: "50+", label: "Expert Staff" },
  { value: "100%", label: "Client Commitment" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)" };
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : transforms[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);
  const navLinks = ["Home", "About", "Services", "Contact"];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", margin: 0, padding: 0, overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: scrolled || menuOpen ? "rgba(10,31,61,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "all 0.4s ease",
        padding: "0 5%",
        borderBottom: scrolled ? `1px solid rgba(200,168,75,0.2)` : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <span style={{ fontSize: "1.8rem" }}>⚓</span>
            <div>
              <div style={{ color: COLORS.white, fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "1.1rem", lineHeight: 1.2 }}>OCCUPATION MARINE SERVICES LTD</div>
              <div style={{ color: COLORS.gold, fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase" }}>Marine Services</div>
            </div>
          </Link>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "35px" }}>
              <ul style={{ display: "flex", gap: "30px", listStyle: "none", margin: 0, padding: 0 }}>
                {navLinks.map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} style={{ color: COLORS.white, textDecoration: "none", fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "500" }}
                      onMouseEnter={e => e.target.style.color = COLORS.gold}
                      onMouseLeave={e => e.target.style.color = COLORS.white}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              {/* Sign In button */}
              <Link to="/login" style={{
                backgroundColor: COLORS.gold, color: COLORS.navy,
                padding: "9px 22px", textDecoration: "none",
                fontWeight: "700", fontSize: "0.85rem",
                letterSpacing: "1px", textTransform: "uppercase",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.target.style.backgroundColor = COLORS.goldLight; }}
                onMouseLeave={e => { e.target.style.backgroundColor = COLORS.gold; }}>
                Sign In
              </Link>
            </div>
          )}

          {/* Hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: "25px", height: "2px", backgroundColor: COLORS.white, transition: "all 0.3s",
                  transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(5px, 5px)" : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "scale(0)") : "none"
                }} />
              ))}
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && menuOpen && (
          <div style={{ padding: "16px 0 24px", borderTop: `1px solid rgba(200,168,75,0.2)` }}>
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={handleNavClick}
                style={{ display: "block", color: COLORS.white, textDecoration: "none", padding: "12px 0", fontSize: "1rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "500", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {link}
              </a>
            ))}
            <Link to="/login" onClick={handleNavClick}
              style={{ display: "block", color: COLORS.navy, backgroundColor: COLORS.gold, textDecoration: "none", padding: "12px 16px", fontSize: "1rem", fontWeight: "700", textAlign: "center", marginTop: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        {heroSlides.map((_, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${heroSlides[i].image})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: slide === i ? 1 : 0,
            transition: "opacity 1.2s ease",
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,31,61,0.9) 60%, rgba(10,31,61,0.4))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "0 6%" : "0 8%", maxWidth: isMobile ? "100%" : "700px" }}>
          <div style={{ color: COLORS.gold, fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px", fontWeight: "600" }}>
            Est. 1993 — Port Harcourt, Nigeria
          </div>
          <h1 style={{ color: COLORS.white, fontSize: isMobile ? "1.9rem" : "clamp(2rem, 5vw, 3.5rem)", fontFamily: "'Georgia', serif", fontWeight: "bold", lineHeight: 1.2, marginBottom: "16px" }}>
            {heroSlides[slide].title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: isMobile ? "0.95rem" : "1.1rem", marginBottom: "32px", lineHeight: 1.6 }}>
            {heroSlides[slide].subtitle}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#services" style={{ display: "inline-block", backgroundColor: COLORS.gold, color: COLORS.navy, padding: "14px 30px", textDecoration: "none", fontWeight: "700", fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase" }}>
              Our Services
            </a>
            <Link to="/signup" style={{ display: "inline-block", backgroundColor: "transparent", color: COLORS.white, padding: "14px 30px", textDecoration: "none", fontWeight: "700", fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase", border: `2px solid ${COLORS.white}` }}>
              Get Started
            </Link>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px" }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: slide === i ? "30px" : "10px", height: "10px", borderRadius: "5px", backgroundColor: slide === i ? COLORS.gold : "rgba(255,255,255,0.4)", transition: "all 0.4s", cursor: "pointer", border: "none" }} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ backgroundColor: COLORS.offWhite, padding: isMobile ? "60px 6%" : "90px 8%" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "32px" : "60px", alignItems: "center" }}>
          <FadeIn direction={isMobile ? "up" : "left"}>
            <img src="https://images.unsplash.com/photo-1581094651181-35942459ef62?w=800&q=80" alt="Marine operations" style={{ width: "100%", height: isMobile ? "250px" : "450px", objectFit: "cover" }} />
          </FadeIn>
          <FadeIn direction={isMobile ? "up" : "right"} delay={0.15}>
            <div style={{ color: COLORS.gold, fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase", fontWeight: "600", marginBottom: "12px" }}>Who We Are</div>
            <h2 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: isMobile ? "1.6rem" : "2.2rem", fontWeight: "bold", marginBottom: "16px", lineHeight: 1.3 }}>
              A Legacy of Excellence in Oil Servicing
            </h2>
            <div style={{ width: "60px", height: "3px", backgroundColor: COLORS.gold, marginBottom: "20px" }} />
            <p style={{ color: COLORS.gray, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "16px" }}>
              Occupation Marine Services and Erudite Agro Tappers Nig Ltd has been a trusted partner to Nigeria's oil and gas industry since 1993. We have grown into a multi-disciplinary service provider built on hard work, consistency, and integrity.
            </p>
            <p style={{ color: COLORS.gray, fontSize: "0.95rem", lineHeight: 1.8 }}>
              We serve both private and public sector clients, delivering results that exceed expectations at our base in Onne Port, Rivers State.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "40px", borderTop: `3px solid ${COLORS.gold}` }}>
              {stats.map((s, i) => (
                <div key={i} style={{ flex: "1 1 100px", padding: "20px 10px", textAlign: "center", borderRight: i < 3 ? `1px solid rgba(10,31,61,0.1)` : "none" }}>
                  <div style={{ color: COLORS.navy, fontSize: isMobile ? "1.8rem" : "2.5rem", fontFamily: "'Georgia', serif", fontWeight: "bold" }}>{s.value}</div>
                  <div style={{ color: COLORS.gray, fontSize: "0.7rem", letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ backgroundColor: COLORS.white, padding: isMobile ? "60px 6%" : "90px 8%" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div style={{ color: COLORS.gold, fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase", fontWeight: "600", marginBottom: "12px" }}>What We Do</div>
            <h2 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: isMobile ? "1.6rem" : "2.2rem", fontWeight: "bold", marginBottom: "16px" }}>Our Core Services</h2>
            <div style={{ width: "60px", height: "3px", backgroundColor: COLORS.gold, margin: "0 auto 16px" }} />
            <p style={{ color: COLORS.gray, fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto" }}>
              Expert services across the full spectrum of oil servicing, engineering, and environmental management.
            </p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ backgroundColor: COLORS.offWhite, padding: "30px 24px", borderBottom: "3px solid transparent", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderBottomColor = COLORS.gold; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(10,31,61,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderBottomColor = "transparent"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{s.icon}</div>
                <div style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: "1.05rem", fontWeight: "bold", marginBottom: "8px" }}>{s.title}</div>
                <div style={{ color: COLORS.gray, fontSize: "0.88rem", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ backgroundColor: COLORS.offWhite, padding: isMobile ? "60px 6%" : "90px 8%" }}>
        <FadeIn>
          <div style={{ color: COLORS.gold, fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase", fontWeight: "600", marginBottom: "12px" }}>Get In Touch</div>
          <h2 style={{ color: COLORS.navy, fontFamily: "'Georgia', serif", fontSize: isMobile ? "1.6rem" : "2.2rem", fontWeight: "bold", marginBottom: "16px" }}>Contact Us</h2>
          <div style={{ width: "60px", height: "3px", backgroundColor: COLORS.gold, marginBottom: "40px" }} />
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "60px" }}>
          <FadeIn direction="left" delay={0.1}>
            {submitted ? (
              <div style={{ backgroundColor: COLORS.navy, color: COLORS.white, padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "1.5rem", marginBottom: "10px" }}>Message Sent!</h3>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>We'll get back to you shortly.</p>
              </div>
            ) : (
              <div>
                <input style={{ width: "100%", padding: "14px 16px", border: `1px solid rgba(10,31,61,0.2)`, backgroundColor: COLORS.white, fontSize: "0.95rem", marginBottom: "16px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  placeholder="Your Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input style={{ width: "100%", padding: "14px 16px", border: `1px solid rgba(10,31,61,0.2)`, backgroundColor: COLORS.white, fontSize: "0.95rem", marginBottom: "16px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <textarea style={{ width: "100%", padding: "14px 16px", border: `1px solid rgba(10,31,61,0.2)`, backgroundColor: COLORS.white, fontSize: "0.95rem", height: "140px", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  placeholder="Your Message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                <button style={{ backgroundColor: COLORS.navy, color: COLORS.white, border: "none", padding: "14px 40px", fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "700", cursor: "pointer", marginTop: "16px", width: isMobile ? "100%" : "auto" }}
                  onClick={() => { if (formData.name && formData.email && formData.message) setSubmitted(true); }}
                  onMouseEnter={e => { e.target.style.backgroundColor = COLORS.gold; e.target.style.color = COLORS.navy; }}
                  onMouseLeave={e => { e.target.style.backgroundColor = COLORS.navy; e.target.style.color = COLORS.white; }}>
                  Send Message
                </button>
              </div>
            )}
          </FadeIn>
          <FadeIn direction="right" delay={0.15}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              { icon: "📍", label: "Address", value: "Ewide Office Complex, Harbor Road\nOpposite El-Queen Oil Gas Filling Station\nOnne, Port Harcourt, Rivers State, Nigeria" },
              { icon: "📞", label: "Phone", value: "+234 000 000 0000" },
              { icon: "✉️", label: "Email", value: "info@occupationmarineservices.com" },
              { icon: "🕐", label: "Working Hours", value: "Monday - Friday: 8:00AM - 5:00PM" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "1.4rem", marginTop: "2px" }}>{item.icon}</div>
                <div>
                  <div style={{ color: COLORS.gold, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ color: COLORS.darkGray, fontSize: "0.92rem", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>

    <footer style={{ backgroundColor: COLORS.navy, color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "30px 6%", fontSize: "0.82rem", lineHeight: 1.8 }}>
      <p>2025 Occupation Marine Services and Erudite Agro Tappers Nig Ltd. All rights reserved.</p>
      <p style={{ marginTop: "4px" }}>Onne, Port Harcourt, Rivers State, Nigeria</p>
    </footer>

  </div>
  );
}