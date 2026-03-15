import { useNavigate } from "react-router-dom";
import concertImg from "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&auto=format&fit=crop&q=60";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "70px 40px 90px", overflow: "hidden" }}>

        {/* Center orb — bright */}
        <div style={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse at center bottom, #7c3aed 0%, #4c1d95 30%, transparent 70%)", opacity: .35, borderRadius: "50%", animation: "orbPulse 4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", width: 360, height: 180, background: "radial-gradient(ellipse at center bottom, #a78bfa 0%, #7c3aed 40%, transparent 70%)", opacity: .5, borderRadius: "50%", animation: "orbPulse 4s ease-in-out infinite .5s" }} />
        {/* Left corner orb */}
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 420, height: 260, background: "radial-gradient(ellipse, #6d28d9 0%, #4c1d95 35%, transparent 70%)", opacity: .25, borderRadius: "50%", animation: "orbPulse 5s ease-in-out infinite .7s" }} />
        {/* Right corner orb */}
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 420, height: 260, background: "radial-gradient(ellipse, #6d28d9 0%, #4c1d95 35%, transparent 70%)", opacity: .25, borderRadius: "50%", animation: "orbPulse 5s ease-in-out infinite .3s" }} />

        {/* Star dots */}
        {[
          { top: "14%", left: "10%", size: 3, delay: "0s" },
          { top: "22%", left: "28%", size: 2, delay: ".5s" },
          { top: "12%", right: "15%", size: 3, delay: ".3s" },
          { top: "35%", right: "20%", size: 2, delay: ".9s" },
          { top: "18%", right: "40%", size: 2, delay: ".7s" },
          { top: "45%", left: "6%", size: 2, delay: "1.1s" },
          { top: "45%", right: "6%", size: 2, delay: ".6s" },
        ].map((d, i) => (
          <div key={i} style={{ position: "absolute", ...d, width: d.size, height: d.size, background: "#a78bfa", borderRadius: "50%", animation: `blink 2.5s infinite ${d.delay}` }} />
        ))}

        {/* Badge */}
        <div className="badge-live" style={{ marginBottom: 28, position: "relative", zIndex: 2 }}>
          <span className="pulse-dot" />
          Anti-scalping enforced by smart contract — not policy
        </div>

        {/* Headline */}
        <h1 className="gradient-text" style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", position: "relative", zIndex: 2, maxWidth: 680 }}>
          Ticket scalping<br />is impossible here.
        </h1>

        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 500, margin: "0 0 36px", position: "relative", zIndex: 2 }}>
          In January 2025, Coldplay tickets worth ₹6,500 sold for ₹32,000. The rule existed. Nobody enforced it. We put the enforcement{" "}
          <span style={{ color: "var(--purple-bright)", fontWeight: 500 }}>inside the math.</span>
        </p>

        <div style={{ display: "flex", gap: 14, position: "relative", zIndex: 2 }}>
          <button className="btn-primary" onClick={() => navigate("/event")}>Buy a Ticket</button>
          <button className="btn-ghost" onClick={() => navigate("/transparency")}>View Audit Trail →</button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid var(--border-stat)", borderBottom: "1px solid var(--border-stat)" }}>
        {[
          { value: "0%", label: "scalping possible" },
          { value: "110%", label: "max resale enforced on-chain" },
          { value: "<1s", label: "Solana transaction finality" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "28px 48px", borderRight: i < 2 ? "1px solid var(--border-stat)" : "none" }}>
            <p style={{ fontSize: 32, fontWeight: 700, color: "var(--purple-bright)", margin: "0 0 4px" }}>{s.value}</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS — concert bg ── */}
      <div className="concert-bg-section">
        <img className="concert-img" src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&auto=format&fit=crop&q=60" alt="concert" />
        <div className="concert-bg-overlay" />
        <div className="concert-bg-tint" />

        <div className="concert-bg-content">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="section-label">HOW IT WORKS</p>
            <h2 className="gradient-text-static" style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px" }}>Three steps. Zero loopholes.</h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
              Every ticket is a smart contract. Every resale is checked by math. No middleman. No exceptions.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 52 }}>
            {[
              { icon: "🎪", num: "01", numColor: "var(--purple-mid)", cls: "glass-card", iconCls: "card-icon card-icon-purple", title: "Organiser creates event", desc: "Sets face price and resale cap permanently on-chain. Nobody — not even the organiser — can change it.", anim: "floatUp 5s ease-in-out infinite" },
              { icon: "🎫", num: "02", numColor: "#60a5fa", cls: "glass-card", iconCls: "card-icon card-icon-blue", title: "Fan buys ticket", desc: "Receives a unique token in their Phantom wallet. Payment goes directly to the organiser — no middleman.", anim: "floatUp 5s ease-in-out infinite .7s" },
              { icon: "⛔", num: "03", numColor: "var(--purple-bright)", cls: "glass-card-purple", iconCls: "card-icon card-icon-purple-bright", title: "Scalper gets rejected", desc: "The contract rejects any resale above the cap. No appeal. No loophole. The code has no complaints department.", anim: "floatUp 5s ease-in-out infinite 1.4s" },
            ].map((c, i) => (
              <div key={i} className={c.cls} style={{ animation: c.anim }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div className={c.iconCls}>{c.icon}</div>
                  <span style={{ fontSize: 11, color: c.numColor, fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>{c.num}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px" }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="quote-block">
            <p style={{ fontSize: 21, fontWeight: 600, color: "#e9d5ff", lineHeight: 1.65, margin: "0 0 14px", maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
              "BookMyShow is a shop assistant who <em>could</em> sell you a Coke for ₹500.<br />
              TicketShield is a vending machine that <span style={{ color: "var(--purple-bright)", fontWeight: 700 }}>literally cannot.</span>"
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>The price is in the mechanism — not the policy.</p>
          </div>
        </div>
      </div>

    </div>
  );
}