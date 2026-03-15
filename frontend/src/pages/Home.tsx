import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* HERO */}
      <div style={{
  position: "relative",
  minHeight: 560,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "80px 40px 100px",
  overflow: "hidden",
  borderRadius: 24,
  margin: "24px 40px 0",
  border: "1px solid rgba(167, 139, 250, 0.1)",
  background: "rgba(13, 10, 26, 0.5)",
}}>
        {/* Orbs */}
        <div style={{ position: "absolute", bottom: -80, left: "50%", transform: "translateX(-50%)", width: 700, height: 340, background: "radial-gradient(ellipse at center bottom, #7c3aed 0%, #4c1d95 30%, transparent 70%)", opacity: 0.3, borderRadius: "50%", animation: "orbPulse 5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -50, left: "50%", transform: "translateX(-50%)", width: 400, height: 200, background: "radial-gradient(ellipse at center bottom, #a78bfa 0%, #7c3aed 50%, transparent 70%)", opacity: 0.45, borderRadius: "50%", animation: "orbPulse 5s ease-in-out infinite 0.5s" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />

        {/* Badge */}
        <div className="badge-live" style={{ marginBottom: 32, position: "relative", zIndex: 2 }}>
          <span className="pulse-dot" />
          Live on Solana Devnet
        </div>

        {/* Headline */}
        <h1 className="gradient-text" style={{
          fontSize: 60,
          fontWeight: 800,
          lineHeight: 1.08,
          margin: "0 0 24px",
          position: "relative",
          zIndex: 2,
          maxWidth: 720,
          letterSpacing: "-0.02em",
        }}>
          Ticket scalping<br />is impossible here.
        </h1>

        <p style={{
          fontSize: 17,
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          maxWidth: 480,
          margin: "0 0 40px",
          position: "relative",
          zIndex: 2,
        }}>
          The resale price cap isn't written in a terms of service document.
          It's written in the smart contract.{" "}
          <span style={{ color: "var(--purple-bright)", fontWeight: 500 }}>
            Code that cannot be bribed.
          </span>
        </p>

        <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 2 }}>
          <button className="btn-primary" onClick={() => navigate("/event")} style={{ padding: "14px 32px", fontSize: 15 }}>
            Buy a Ticket
          </button>
          <button className="btn-ghost" onClick={() => navigate("/transparency")} style={{ padding: "14px 32px", fontSize: 15 }}>
            View Audit Trail →
          </button>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        borderTop: "1px solid var(--border-stat)",
        borderBottom: "1px solid var(--border-stat)",
      }}>
        {[
          { value: "0%", label: "Scalping possible on our platform" },
          { value: "110%", label: "Maximum resale cap, enforced on-chain" },
          { value: "$0.00025", label: "Cost per transaction on Solana" },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "32px 40px",
            borderRight: i < 2 ? "1px solid var(--border-stat)" : "none",
          }}>
            <p style={{ fontSize: 34, fontWeight: 700, color: "var(--purple-bright)", margin: "0 0 6px", fontFamily: "var(--font-heading)" }}>
              {s.value}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div className="concert-bg-section">
        <img
          className="concert-img"
          src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&auto=format&fit=crop&q=60"
          alt="concert"
        />
        <div className="concert-bg-overlay" />
        <div className="concert-bg-tint" />

        <div className="concert-bg-content">

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-label">HOW IT WORKS</p>
            <h2 className="gradient-text-static" style={{ fontSize: 38, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
              Three steps. Zero loopholes.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 440, margin: "0 auto", lineHeight: 1.75 }}>
              Every ticket is a blockchain token. Every resale is verified by math. No middleman. No exceptions.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 56 }}>
            {[
              {
                icon: "🎪",
                num: "01",
                cls: "glass-card",
                iconCls: "card-icon card-icon-purple",
                title: "Organiser deploys event",
                desc: "Face price and resale cap are written to the blockchain permanently. Not even the organiser can change them after deployment.",
              },
              {
                icon: "🎫",
                num: "02",
                cls: "glass-card",
                iconCls: "card-icon card-icon-blue",
                title: "Fan buys a ticket",
                desc: "A unique NFT is minted directly to the fan's wallet. Payment goes straight to the organiser — no platform holding funds.",
              },
              {
                icon: "⛔",
                num: "03",
                cls: "glass-card-purple",
                iconCls: "card-icon card-icon-purple-bright",
                title: "Scalper is rejected",
                desc: "Any resale listing above the cap is rejected at the contract level. The transaction reverts. Nothing moves. No exceptions.",
              },
            ].map((c, i) => (
              <div key={i} className={c.cls} style={{ animation: `floatUp 5s ease-in-out infinite ${i * 0.6}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div className={c.iconCls}>{c.icon}</div>
                  <span style={{ fontSize: 11, color: "var(--purple-bright)", fontWeight: 700, letterSpacing: 2, opacity: 0.7 }}>
                    {c.num}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.4 }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="quote-block" style={{ maxWidth: 640, margin: "0 auto" }}>
            <p style={{ fontSize: 13, color: "var(--purple-bright)", fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
              THE DIFFERENCE
            </p>
            <p style={{ fontSize: 20, fontWeight: 600, color: "#e9d5ff", lineHeight: 1.7, margin: "0 0 16px" }}>
              "BookMyShow is a shop assistant who <em>could</em> sell you a ticket at 5× price.
              TicketShield is a vending machine that{" "}
              <span style={{ color: "var(--purple-bright)", fontWeight: 700 }}>literally cannot.</span>"
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              The enforcement is in the mechanism — not the policy.
            </p>
          </div>

        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{
        textAlign: "center",
        padding: "72px 40px",
        borderTop: "1px solid var(--border-stat)",
      }}>
        <h2 className="gradient-text-static" style={{ fontSize: 32, fontWeight: 700, margin: "0 0 16px" }}>
          Ready to buy a ticket?
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 32 }}>
          Fair price. On-chain proof. No scalpers.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => navigate("/event")} style={{ padding: "14px 36px", fontSize: 15 }}>
            Buy a Ticket
          </button>
          <button className="btn-ghost" onClick={() => navigate("/resale")} style={{ padding: "14px 36px", fontSize: 15 }}>
            View Resale Market
          </button>
        </div>
      </div>

    </div>
  );
}
