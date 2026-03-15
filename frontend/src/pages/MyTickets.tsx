import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useProgram } from "../hooks/useProgram";
import TicketCard from "../components/TicketCard";
import TransactionToast from "../components/TransactionToast";
import {
  DEMO_EVENT_NAME,
  DEMO_FACE_PRICE_LAMPORTS,
  DEMO_MAX_RESALE_BPS,
  solToLamports,
} from "../utils/constants";

export default function MyTickets() {
  const { publicKey } = useWallet();
  const program = useProgram();
  const [txStatus, setTxStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [txMessage, setTxMessage] = useState("");

  const mockTickets = publicKey
    ? [{ ticketNumber: 4, eventName: DEMO_EVENT_NAME, owner: publicKey.toString() }]
    : [];

  const handleListForResale = async (ticketNumber: number) => {
    if (!program || !publicKey) {
      alert("Connect your wallet first");
      return;
    }

    const priceInput = prompt("Enter resale price in SOL:");
    if (!priceInput) return;

    const priceSOL = parseFloat(priceInput);
    const priceLamports = solToLamports(priceSOL);

    const maxAllowedLamports = Math.floor(
      DEMO_FACE_PRICE_LAMPORTS * DEMO_MAX_RESALE_BPS / 10000
    );

    if (priceLamports > maxAllowedLamports) {
      setTxStatus("error");
      setTxMessage(
        `❌ Price too high! Max allowed is ${maxAllowedLamports / 1_000_000_000} SOL. The contract will reject this.`
      );
      return;
    }

    setTxStatus("pending");
    setTxMessage("Moving ticket to escrow and listing...");

    try {
      const eventPDA = new PublicKey("11111111111111111111111111111111");

      const [listingPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("listing"),
          eventPDA.toBuffer(),
          publicKey.toBuffer(),
          Buffer.from([ticketNumber]),
        ],
        program.programId
      );

      const sig = await (program.methods as any)
        .listTicket(ticketNumber, new BN(priceLamports))
        .accounts({
          listing: listingPDA,
          event: eventPDA,
          seller: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setTxStatus("success");
      setTxMessage(
        `Ticket #${ticketNumber} listed at ${priceSOL} SOL — moved to escrow!`
      );
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err.message || "Listing failed");
    }
  };

  if (!publicKey) return <p>Connect your wallet to see your tickets.</p>;
  if (mockTickets.length === 0)
    return <p>You don't own any tickets yet. <a href="/event">Buy one →</a></p>;

  return (
    <div>
      <h2>My Tickets</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {mockTickets.map(t => (
          <TicketCard
            key={t.ticketNumber}
            eventName={t.eventName}
            ticketNumber={t.ticketNumber}
            facePrice={DEMO_FACE_PRICE_LAMPORTS}
            maxResaleBps={DEMO_MAX_RESALE_BPS}
            owner={t.owner}
            onListForResale={() => handleListForResale(t.ticketNumber)}
          />
        ))}
      </div>
      <TransactionToast status={txStatus} message={txMessage} />
    </div>
  );
}