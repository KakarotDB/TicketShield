import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "../hooks/useProgram";
import { useEventData } from "../hooks/useEventData";
import TransactionToast from "../components/TransactionToast";
import { DEMO_EVENT_NAME, lamportsToSol, bpsToPercent } from "../utils/constants";

const DEMO_EVENT_PDA = "7mHoZqMNQFvfnE1GtCQmgLYfaGX3QQAMWrtLPoTGrsdB";
const DEMO_ORGANIZER = "B5DNm5Z4D5NfFRHE44dc89CLig8x2rUAKhYNeSD1qLaV";

export default function EventPage() {
  const { publicKey } = useWallet();
  const program = useProgram();
  const { event, loading } = useEventData(DEMO_EVENT_PDA || null);
  const [txStatus, setTxStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [txMessage, setTxMessage] = useState("");
  const [txSig, setTxSig] = useState<string | undefined>();

  const handleBuy = async () => {
    if (!program || !publicKey) { alert("Connect your wallet first"); return; }
    setTxStatus("pending");
    setTxMessage("Purchasing ticket...");
    try {
      const eventPDA = new PublicKey(DEMO_EVENT_PDA);
      const organizer = new PublicKey(DEMO_ORGANIZER);
      const [ticketMintPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket_mint"), eventPDA.toBuffer()],
        program.programId
      );
      const sig = await (program.methods as any)
        .purchaseTicket()
        .accounts({
          event: eventPDA,
          ticketMint: ticketMintPDA,
          buyer: publicKey,
          organizer: organizer,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      setTxSig(sig);
      setTxStatus("success");
      setTxMessage("Ticket purchased! Check My Tickets.");
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err.message || "Purchase failed");
    }
  };

  const displayEvent = event ?? {
    name: DEMO_EVENT_NAME,
    facePrice: 65_000_000,
    maxResaleBps: 11000,
    totalSupply: 10,
    ticketsSold: 3,
    isActive: true,
  };

  if (loading) return <p style={{ color: "var(--text-muted)", padding: 40 }}>Loading event...</p>;

  return (
    <div className="page-wrapper">
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: 18,
        padding: "36px 40px",
        maxWidth: 500,
      }}>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 8
        }}>
          {displayEvent.name}
        </h2>

        <p style={{ fontSize: 36, fontWeight: 700, color: "var(--purple-bright)", margin: "12px 0 4px" }}>
          {lamportsToSol(displayEvent.facePrice)} SOL
        </p>

        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
          {displayEvent.ticketsSold} / {displayEvent.totalSupply} tickets sold
        </p>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Max resale: {(lamportsToSol(displayEvent.facePrice) * bpsToPercent(displayEvent.maxResaleBps) / 100).toFixed(4)} SOL
        </p>

        <div style={{
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 13,
          color: "var(--purple-bright)",
          marginBottom: 24
        }}>
          ⚡ Resale cap enforced by smart contract — scalpers mathematically cannot exceed this price
        </div>

        {displayEvent.isActive ? (
          <button
            className="btn-primary"
            onClick={handleBuy}
            disabled={!publicKey || txStatus === "pending"}
            style={{ width: "100%", padding: "14px 0", fontSize: 15 }}
          >
            {!publicKey
              ? "Connect Wallet to Buy"
              : txStatus === "pending"
              ? "Buying..."
              : `Buy Ticket — ${lamportsToSol(displayEvent.facePrice)} SOL`}
          </button>
        ) : (
          <p style={{ color: "#f87171", fontWeight: 600 }}>This event is not active.</p>
        )}

        <TransactionToast status={txStatus} message={txMessage} txSignature={txSig} />
      </div>
    </div>
  );
}
