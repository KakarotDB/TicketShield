import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useProgram } from "../hooks/useProgram";
import TicketCard from "../components/TicketCard";
import TransactionToast from "../components/TransactionToast";
import {
  DEMO_EVENT_NAME,
  DEMO_FACE_PRICE_LAMPORTS,
  DEMO_MAX_RESALE_BPS,
  solToLamports,
} from "../utils/constants";

const DEMO_EVENT_PDA = "7mHoZqMNQFvfnE1GtCQmgLYfaGX3QQAMWrtLPoTGrsdB";
const DEMO_TICKET_MINT = "GmV29hX6zHzn2EJ83YRvaxMHBCkMScdQV1VkUkpE4SMg";

const WalletPrompt = ({ message }: { message: string }) => (
  <div className="page-wrapper">
    <div style={{
      background: "rgba(124,58,237,0.08)",
      border: "1px solid rgba(124,58,237,0.3)",
      borderRadius: 16, padding: "40px 32px", maxWidth: 420, textAlign: "center"
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🎫</div>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
        {message}
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
        Connect your Phantom wallet using the button in the top right corner.
      </p>
    </div>
  </div>
);

export default function MyTickets() {
  const { publicKey } = useWallet();
  const program = useProgram();
  const [txStatus, setTxStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [txMessage, setTxMessage] = useState("");

  const mockTickets = publicKey
    ? [{ ticketNumber: 1, eventName: DEMO_EVENT_NAME, owner: publicKey.toString() }]
    : [];

  const handleListForResale = async () => {
    if (!program || !publicKey) { alert("Connect your wallet first"); return; }
    if (DEMO_TICKET_MINT === "PASTE_MINT_HERE") { alert("Fill in DEMO_TICKET_MINT"); return; }

    const priceInput = prompt("Enter resale price in SOL (max 0.0715 for 110% cap):");
    if (!priceInput) return;

    const priceLamports = solToLamports(parseFloat(priceInput));
    setTxStatus("pending");
    setTxMessage("Listing ticket for resale...");

    try {
      const eventPDA = new PublicKey(DEMO_EVENT_PDA);
      const ticketMint = new PublicKey(DEMO_TICKET_MINT);

      const [listingPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("listing"), ticketMint.toBuffer(), publicKey.toBuffer()],
        program.programId
      );

      const sellerTicketAccount = await getAssociatedTokenAddress(ticketMint, publicKey);
      const escrowTokenAccount = await getAssociatedTokenAddress(ticketMint, listingPDA, true);

      await (program.methods as any)
        .listTicket(new BN(priceLamports))
        .accounts({
          seller: publicKey,
          event: eventPDA,
          sellerTicketAccount,
          escrowTokenAccount,
          ticketMint,
          listing: listingPDA,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      setTxStatus("success");
      setTxMessage(`Ticket listed at ${priceInput} SOL — moved to escrow!`);
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err.message || "Listing failed");
    }
  };

  if (!publicKey) return <WalletPrompt message="Connect your wallet to see your tickets" />;

  if (mockTickets.length === 0) return (
    <div className="page-wrapper">
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 16, padding: "40px 32px", maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎟️</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>No tickets yet</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>You don't own any tickets yet.</p>
        <a href="/event" style={{ background: "var(--purple-mid)", color: "#fff", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Buy a Ticket →</a>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>My Tickets</h2>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>Tickets owned by your connected wallet</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {mockTickets.map(t => (
          <TicketCard
            key={t.ticketNumber}
            eventName={t.eventName}
            ticketNumber={t.ticketNumber}
            facePrice={DEMO_FACE_PRICE_LAMPORTS}
            maxResaleBps={DEMO_MAX_RESALE_BPS}
            owner={t.owner}
            onListForResale={handleListForResale}
          />
        ))}
      </div>
      <TransactionToast status={txStatus} message={txMessage} />
    </div>
  );
}
