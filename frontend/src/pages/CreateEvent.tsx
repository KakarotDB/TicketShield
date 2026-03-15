import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "../hooks/useProgram";
import TransactionToast from "../components/TransactionToast";
import { DEMO_EVENT_NAME, DEMO_FACE_PRICE_LAMPORTS, DEMO_MAX_RESALE_BPS, DEMO_TICKET_SUPPLY, lamportsToSol, bpsToPercent } from "../utils/constants";

export default function CreateEvent() {
  const { publicKey } = useWallet();
  const program = useProgram();
  const [name, setName] = useState(DEMO_EVENT_NAME);
  const [supply, setSupply] = useState(DEMO_TICKET_SUPPLY);
  const [facePrice, setFacePrice] = useState(lamportsToSol(DEMO_FACE_PRICE_LAMPORTS));
  const [resaleCap, setResaleCap] = useState(bpsToPercent(DEMO_MAX_RESALE_BPS));
  const [txStatus, setTxStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [txMessage, setTxMessage] = useState("");
  const [txSig, setTxSig] = useState<string | undefined>();

  const handleCreate = async () => {
    if (!program || !publicKey) { alert("Connect your wallet first"); return; }
    setTxStatus("pending");
    setTxMessage("Creating event on-chain...");
    try {
      const maxResaleBps = Math.round(resaleCap * 100);
      const facePriceLamports = Math.round(facePrice * 1_000_000_000);
      const [eventPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("event"), publicKey.toBuffer(), Buffer.from(name)], program.programId
      );
      const [ticketMintPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket_mint"), eventPDA.toBuffer()], program.programId
      );
      const sig = await (program.methods as any)
        .createEvent(name, supply, facePriceLamports, maxResaleBps)
        .accounts({ event: eventPDA, ticketMint: ticketMintPDA, organizer: publicKey, tokenProgram: TOKEN_PROGRAM_ID, systemProgram: SystemProgram.programId, rent: SYSVAR_RENT_PUBKEY })
        .rpc();
      setTxStatus("success");
      setTxMessage(`Event "${name}" created! ${supply} tickets at ${facePrice} SOL each.`);
      setTxSig(sig);
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err.message || "Transaction failed");
    }
  };

  if (!publicKey) return (
    <div className="page-wrapper">
      <div style={{
        background: "rgba(124,58,237,0.08)",
        border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 16, padding: "40px 32px", maxWidth: 420, textAlign: "center"
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎪</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
          Connect wallet to create an event
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
          Only verified organisers can deploy events on-chain. Connect your Phantom wallet to continue.
        </p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: 18, padding: "36px 40px", maxWidth: 500
      }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
          Create Event
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
          Deploy a new event on Solana with an enforced resale cap.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="dark-label">Event Name</label>
            <input className="dark-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Coldplay India — Mumbai" />
          </div>
          <div>
            <label className="dark-label">Ticket Supply</label>
            <input className="dark-input" type="number" value={supply} onChange={e => setSupply(Number(e.target.value))} />
          </div>
          <div>
            <label className="dark-label">Face Price (SOL)</label>
            <input className="dark-input" type="number" step="0.001" value={facePrice} onChange={e => setFacePrice(Number(e.target.value))} />
          </div>
          <div>
            <label className="dark-label">Max Resale Cap (%)</label>
            <input className="dark-input" type="number" value={resaleCap} onChange={e => setResaleCap(Number(e.target.value))} />
            <p style={{ fontSize: 12, color: "var(--purple-bright)", marginTop: 6 }}>
              Max resale price: {((facePrice * resaleCap) / 100).toFixed(4)} SOL
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={txStatus === "pending"}
            style={{ width: "100%", padding: "14px 0", fontSize: 15, marginTop: 8 }}
          >
            {txStatus === "pending" ? "Creating..." : "Create Event on Solana"}
          </button>
        </div>

        <TransactionToast status={txStatus} message={txMessage} txSignature={txSig} />
      </div>
    </div>
  );
}