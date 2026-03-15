import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "../hooks/useProgram";
import { PublicKey } from "@solana/web3.js";
import TransactionToast from "../components/TransactionToast";
import { lamportsToSol, DEMO_FACE_PRICE_LAMPORTS, DEMO_MAX_RESALE_BPS } from "../utils/constants";

interface Listing {
  id: string;
  eventName: string;
  seller: string;
  askingPrice: number;
  facePrice: number;
  maxResaleBps: number;
  isWithinCap: boolean;
}

export default function ResaleMarket() {
  const { publicKey } = useWallet();
  const program = useProgram();
  const [txStatus, setTxStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [txMessage, setTxMessage] = useState("");

  const maxAllowed = (DEMO_FACE_PRICE_LAMPORTS * DEMO_MAX_RESALE_BPS) / 10000;

  const mockListings: Listing[] = [
    {
      id: "1",
      eventName: "Coldplay India — Mumbai",
      seller: "ABC...XYZ",
      askingPrice: 70_000_000,
      facePrice: DEMO_FACE_PRICE_LAMPORTS,
      maxResaleBps: DEMO_MAX_RESALE_BPS,
      isWithinCap: true,
    },
    {
      id: "2",
      eventName: "Coldplay India — Mumbai",
      seller: "DEF...UVW",
      askingPrice: 320_000_000,
      facePrice: DEMO_FACE_PRICE_LAMPORTS,
      maxResaleBps: DEMO_MAX_RESALE_BPS,
      isWithinCap: false,
    },
  ];

  const handleBuy = async (listing: Listing) => {
    if (!publicKey) { alert("Connect wallet first"); return; }
    setTxStatus("pending");
    setTxMessage(`Attempting to buy at ${lamportsToSol(listing.askingPrice)} SOL...`);

    if (!listing.isWithinCap) {
      setTimeout(() => {
        setTxStatus("error");
        setTxMessage(`Transaction rejected: ResalePriceTooHigh. ${lamportsToSol(listing.askingPrice)} SOL exceeds max ${lamportsToSol(maxAllowed)} SOL. The code doesn't take bribes.`);
      }, 1500);
      return;
    }

    if (!program) {
      setTimeout(() => {
        setTxStatus("error");
        setTxMessage("Program not loaded. Make sure wallet is connected.");
      }, 500);
      return;
    }

    try {
      const tx = await program.methods
        .buyListedTicket()
        .accounts({ listing: new PublicKey(listing.id) })
        .rpc();
      setTxStatus("success");
      setTxMessage(`Ticket purchased at ${lamportsToSol(listing.askingPrice)} SOL!`);
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("ResalePriceTooHigh")) {
        setTxStatus("error");
        setTxMessage("Rejected by contract: ResalePriceTooHigh. The code doesn't take bribes.");
      } else {
        setTxStatus("error");
        setTxMessage(`Transaction failed: ${msg.slice(0, 100)}`);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="page-heading">Resale Market</h2>
      <p className="page-subheading">
        All resales are capped at {DEMO_MAX_RESALE_BPS / 100}% of face value — enforced by the smart contract.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
        {mockListings.map(listing => (
          <div
            key={listing.id}
            style={{
              background: listing.isWithinCap
                ? "rgba(255,255,255,0.03)"
                : "rgba(239, 68, 68, 0.06)",
              border: listing.isWithinCap
                ? "1px solid rgba(167,139,250,0.2)"
                : "1px solid rgba(239,68,68,0.3)",
              borderRadius: 16,
              padding: "20px 24px",
              transition: "border-color 0.2s",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px" }}>
                  {listing.eventName}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                  Seller: {listing.seller}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{
                  fontSize: 22,
                  fontWeight: 700,
                  margin: "0 0 2px",
                  color: listing.isWithinCap ? "var(--purple-bright)" : "#f87171",
                }}>
                  {lamportsToSol(listing.askingPrice)} SOL
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                  Face: {lamportsToSol(listing.facePrice)} SOL
                </p>
              </div>
            </div>

            {/* Cap warning */}
            {!listing.isWithinCap && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "#f87171",
                marginBottom: 14,
              }}>
                This listing exceeds the max allowed price of {lamportsToSol(maxAllowed)} SOL.
                The contract will reject this transaction automatically.
              </div>
            )}

            {/* Cap indicator for valid listings */}
            {listing.isWithinCap && (
              <div style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.2)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "var(--purple-bright)",
                marginBottom: 14,
              }}>
                Within cap — max allowed is {lamportsToSol(maxAllowed)} SOL
              </div>
            )}

            {/* Button */}
            <button
              onClick={() => handleBuy(listing)}
              style={{
                background: listing.isWithinCap ? "var(--purple-mid)" : "rgba(239,68,68,0.8)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "background 0.2s",
              }}
            >
              {listing.isWithinCap ? "Buy Ticket" : "Try to Buy (Will Fail)"}
            </button>
          </div>
        ))}
      </div>

      <TransactionToast status={txStatus} message={txMessage} />
    </div>
  );
}
