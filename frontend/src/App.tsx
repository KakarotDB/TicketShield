import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import EventPage from "./pages/EventPage";
import MyTickets from "./pages/MyTickets";
import ResaleMarket from "./pages/ResaleMarket";
import Transparency from "./pages/Transparency";
import WalletConnect from "./components/WalletConnect";

export default function App() {
  const location = useLocation();

  const navLinks = [
    { to: "/event", label: "Buy Tickets" },
    { to: "/create", label: "Organiser" },
    { to: "/my-tickets", label: "My Tickets" },
    { to: "/resale", label: "Resale Market" },
    { to: "/transparency", label: "Transparency" },
  ];

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 1100, margin: "0 auto" }}>
      <nav className="ts-nav">
        <Link to="/" className="ts-nav-logo">🛡 TicketShield</Link>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <WalletConnect />
        </div>
      </nav>
      <main style={{ padding: "2rem 0" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/resale" element={<ResaleMarket />} />
          <Route path="/transparency" element={<Transparency />} />
        </Routes>
      </main>
    </div>
  );
}
