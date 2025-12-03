import { ethers } from "ethers";

export const POST = async (req) => {
  try {
    const body = await req.json();

    const receiver = body?.untrustedData?.requester;
    if (!receiver) {
      return Response.json({ error: "No wallet detected" }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const abi = [
      "function transfer(address to, uint256 amount) public returns (bool)"
    ];

    const token = new ethers.Contract(process.env.TOKEN_ADDRESS, abi, wallet);

    const amount = ethers.parseUnits(process.env.CLAIM_AMOUNT, 18);

    const tx = await token.transfer(receiver, amount);
    await tx.wait();

    return Response.json({
      status: "success",
      message: "Tokens sent!",
      tx: tx.hash
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
