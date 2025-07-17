#!/usr/bin/env ts-node
import axios from "axios";
import { writeFileSync } from "fs";

/* ---------- Types for transfers API ---------- */
interface ITokenInfo {
  id: string;
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
}

interface ITransfer {
  id: string;
  type: "deposit" | "withdrawal" | "spend";
  amount: string;
  status: string;
  token: ITokenInfo;
  timestamp: string;
  transactionHash?: string;
}

interface ITransfersResponse {
  transfers: ITransfer[];
  message: string;
}

/* -------------------------- Helper ------------------------------------ */
async function fetchTransfers(
  sponsor: string,
  network: "mainnets" | "testnets" = "testnets",
  limit: number = 50
): Promise<ITransfersResponse> {
  const url =
    `https://api.gelato.digital/1balance/networks/${network}` +
    `/sponsors/${sponsor}/transfers`;

  const { data } = await axios.get<ITransfersResponse>(url, {
    params: { limit },
    timeout: 10_000,
  });
  return data;
}

/* ----------------------------- Main ----------------------------------- */
(async () => {
  // Get command line arguments
  const sponsor = process.argv[2] || "0xbEE11A67084bb4E3EE067893a18DD1Ddc2255568";
  const network = (process.argv[3] as "mainnets" | "testnets") || "testnets";
  const limit = parseInt(process.argv[4]) || 50;

  console.log(`🔍 Fetching transfers for sponsor: ${sponsor}`);
  console.log(`🌐 Network: ${network}`);
  console.log(`📊 Limit: ${limit}`);

  try {
    const data = await fetchTransfers(sponsor, network, limit);

    // Save to JSON file
    const filename = `transfers-${sponsor.slice(0, 6)}-${network}.json`;
    writeFileSync(filename, JSON.stringify(data, null, 2));
    
    console.log(`✅ Successfully fetched ${data.transfers?.length || 0} transfers`);
    console.log(`📁 Data saved to: ${filename}`);
    
    // Display summary
    if (data.transfers && data.transfers.length > 0) {
      console.log("\n📋 Transfer Summary:");
      data.transfers.forEach((transfer: ITransfer, index: number) => {
        const amount = Number(transfer.amount) / Math.pow(10, transfer.token.decimals);
        console.log(`${index + 1}. ${transfer.type} ${amount} ${transfer.token.symbol} (${transfer.status})`);
      });
    }

    console.log(`\n📄 Full response saved to: ${filename}`);
  } catch (error: any) {
    console.error("❌ Error fetching transfers:", error.response?.data || error.message);
    console.error("\nUsage: npm run test [sponsor_address] [network] [limit]");
    console.error("  sponsor_address: Ethereum address (default: 0xbEE11A67084bb4E3EE067893a18DD1Ddc2255568)");
    console.error("  network: 'mainnets' or 'testnets' (default: testnets)");
    console.error("  limit: number of transfers (default: 50)");
  }
})().catch(console.error);