const ethers = require("ethers");
const { parseUnits } = ethers.utils;

const wallets = ["HEXADECIMAL_PRIVATE_KEY"];

const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/PROJECT_ID"
);

const startTime = 1577836800000;

async function main() {
  while (Date.now() < startTime) {
    const left = (startTime - Date.now()) / 1000;
    const min = (left / 60) | 0;
    const sec = left % 60 | 0;
    console.log(`waiting for public sale start: ${min}m ${sec}s`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  for (let i = 0; i < wallets.length; i++) {
    try {
      const signer = new ethers.Wallet(wallets[i], provider);
      const contract = new ethers.Contract(
        "0x0000000000... NFT CONTRACT ADDRESS",
        ["function mint(uint256) payable"],
        signer
      );

      const maxFeePerGas = String((300 + i * 25) | 0);
      const maxPriorityFeePerGas = String((250 + i * 25) | 0);

      const tx = await contract.reserveBots("5", {
        value: parseUnits("1", "ether"),
        gasLimit: "500000",
        maxFeePerGas: parseUnits(maxFeePerGas, "gwei"),
        maxPriorityFeePerGas: parseUnits(maxPriorityFeePerGas, "gwei"),
      });

      console.log(`wallet ${parseInt(i) + 1} tx: ${tx.hash}`);
    } catch (err) {
      console.log(`wallet ${i + 1} ERROR: ${err.message}`, err);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
