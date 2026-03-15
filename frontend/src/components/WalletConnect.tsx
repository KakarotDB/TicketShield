import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletConnect() {
  return (
    <WalletMultiButton
      style={{
        background: "#7c3aed",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 600,
        height: "38px",
        padding: "0 18px",
        lineHeight: "38px",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        minWidth: "fit-content",
        display: "inline-flex",
        alignItems: "center",
      }}
    />
  );
}