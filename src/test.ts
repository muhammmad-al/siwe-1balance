#!/usr/bin/env ts-node
import axios from "axios";
import { writeFileSync } from "fs";
import { formatUnits } from "ethers";

/* ---------- Types that reflect the public payload ---------- */
interface ITokenInfo {
  id: string;
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
}

interface IBalance {
  id: string;
  token: ITokenInfo;
  /* raw integers as strings */
  totalDepositedAmount: string;
  totalWithdrawnAmount: string;
  totalSpentAmount: string;
  remainingBalance: string;
}

interface ISponsorPublic {
  sponsor: {
    address: string;
    mainBalance: IBalance;
    balances: IBalance[];
  };
  message: string; // "getSponsorByAccountId"
}

/* -------------------------- Helper ------------------------------------ */
async function fetchSponsorSummary(
  sponsor: string,
  network: "mainnets" | "testnets" = "mainnets"
): Promise<ISponsorPublic> {
  const url =
    `https://api.gelato.digital/1balance/networks/${network}` +
    `/sponsors/${sponsor}`;

  const { data } = await axios.get<ISponsorPublic>(url);
  return data;
}

/* ----------------------------- Main ----------------------------------- */
(async () => {
  const sponsor =
    (process.argv[2]?.toLowerCase() as `0x${string}`) ??
    "0x17a8d10B832d69a8c1389F686E7795ec8409F264";
  
  const network = (process.argv[3] as "mainnets" | "testnets") ?? "mainnets";

  console.log(`Fetching public 1Balance summary for ${sponsor} on ${network}…`);

  const summary = await fetchSponsorSummary(sponsor, network);
  const main = summary.sponsor.mainBalance;

  /* human-readable balance (USDC 6-dec) */
  const human = formatUnits(main.remainingBalance, main.token.decimals);

  console.log("\n=== 1Balance Summary ===");
  console.log(`Sponsor address : ${summary.sponsor.address}`);
  console.log(
    `Remaining      : ${human} ${main.token.symbol} on chain ${main.token.chainId}`
  );
  console.log(
    `Total deposited: ${
      Number(main.totalDepositedAmount) / 10 ** main.token.decimals
    } ${main.token.symbol}`
  );
  console.log(
    `Total spent    : ${
      Number(main.totalSpentAmount) / 10 ** main.token.decimals
    } ${main.token.symbol}`
  );

  if (summary.sponsor.balances.length > 1) {
    console.log("\nOther fee tokens:");
    summary.sponsor.balances
      .filter(b => b.token.address !== main.token.address)
      .forEach(b =>
        console.log(
          `  • ${b.token.symbol.padEnd(6)} ${b.token.address} (chain ${
            b.token.chainId
          })`
        )
      );
  }

  const file = `summary-${sponsor.slice(0, 6)}.json`;
  writeFileSync(file, JSON.stringify(summary, null, 2));
  console.log(`\nRaw JSON saved to ./${file}`);
})().catch(err => {
  console.error("❌ Error while calling public API");
  console.error(err.message ?? err);
  console.error("\nUsage: npm run test [sponsor_address] [network]");
  console.error("  sponsor_address: Ethereum address (default: 0x17a8d10B832d69a8c1389F686E7795ec8409F264)");
  console.error("  network: 'mainnets' or 'testnets' (default: mainnets)");
});
