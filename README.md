# 1Balance Summary Fetcher

A TypeScript script that fetches public 1Balance summary data for any sponsor address using the [Gelato 1Balance API](https://api.gelato.digital/1balance/networks/mainnets/sponsors/0x17a8d10B832d69a8c1389F686E7795ec8409F264).

## What This Does

This script fetches detailed information about a user's 1Balance account, including:

- **Remaining balance** in human-readable format
- **Total deposited amount** 
- **Total spent amount**
- **Token information** (symbol, decimals, chain ID)
- **Other fee tokens** in the account (if any)

The script uses the public Gelato 1Balance API endpoint:
```
https://api.gelato.digital/1balance/networks/{network}/sponsors/{sponsor_address}
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

## Usage

### Command Line Arguments

The script accepts two optional arguments:

1. **Sponsor address** (optional) - Ethereum address starting with `0x`
2. **Network** (optional) - `mainnets` or `testnets`

### Examples

#### 1. Default usage (mainnets, default sponsor)
```bash
npm run test
```
Fetches data for the default sponsor: `0x17a8d10B832d69a8c1389F686E7795ec8409F264`

#### 2. Custom sponsor address
```bash
npm run test 0x5bA202f6B346fc25e3bC839a21A428E24D491dda
```
Fetches data for the specified sponsor on mainnets

#### 3. Custom sponsor and network
```bash
npm run test 0x5bA202f6B346fc25e3bC839a21A428E24D491dda testnets
```
Fetches data for the specified sponsor on testnets

#### 4. Using ts-node directly
```bash
npx ts-node src/test.ts 0x5bA202f6B346fc25e3bC839a21A428E24D491dda mainnets
```

## Example Output

```
Fetching public 1Balance summary for 0x5bA202f6B346fc25e3bC839a21A428E24D491dda on mainnets…

=== 1Balance Summary ===
Sponsor address : 0x5bA202f6B346fc25e3bC839a21A428E24D491dda
Remaining      : 0.228331 USDC on chain 137
Total deposited: 3000.07 USDC
Total spent    : 2999.841669 USDC

Other fee tokens:
  • USDC   0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 (chain 137)

Raw JSON saved to ./summary-0x5bA20.json
```

## API Endpoint

The script uses the Gelato 1Balance public API:

- **Mainnets**: `https://api.gelato.digital/1balance/networks/mainnets/sponsors/{address}`
- **Testnets**: `https://api.gelato.digital/1balance/networks/testnets/sponsors/{address}`

### Example API Response

Based on the [API endpoint](https://api.gelato.digital/1balance/networks/mainnets/sponsors/0x5bA202f6B346fc25e3bC839a21A428E24D491dda), the response includes:

```json
{
  "sponsor": {
    "address": "0x5bA202f6B346fc25e3bC839a21A428E24D491dda",
    "mainBalance": {
      "remainingBalance": "228331",
      "totalDepositedAmount": "3000070000",
      "totalSpentAmount": "2999841669",
      "token": {
        "symbol": "USDC",
        "decimals": 6,
        "chainId": 137
      }
    },
    "balances": [...]
  }
}
```

## Features

- ✅ **Public API** - No authentication required
- ✅ **Human-readable amounts** - Converts raw integers to decimal format
- ✅ **Multiple networks** - Support for mainnets and testnets
- ✅ **JSON output** - Saves raw API response for further analysis
- ✅ **Error handling** - Clear error messages with usage instructions
- ✅ **TypeScript** - Full type safety and IntelliSense support

## Development

- **Run in development mode:** `npm run dev`
- **Build for production:** `npm run build`
- **Run tests:** `npm test`

## Error Handling

If there's an error, the script displays helpful usage information:

```
❌ Error while calling public API
Invalid sponsor address

Usage: npm run test [sponsor_address] [network]
  sponsor_address: Ethereum address (default: 0x17a8d10B832d69a8c1389F686E7795ec8409F264)
  network: 'mainnets' or 'testnets' (default: mainnets)
```

## Dependencies

- `axios` - HTTP client for API requests
- `ethers` - Ethereum utilities for formatting amounts
- `dotenv` - Environment variable management
- `typescript` - Type safety and compilation

## License

MIT 
