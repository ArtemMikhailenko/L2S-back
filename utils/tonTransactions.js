// jetton.service.js
const { TonClient, WalletContractV5R1, internal, JettonMaster } = require('@ton/ton');
const { beginCell, Address, toNano, SendMode } = require('@ton/core');
const { mnemonicToPrivateKey } = require('@ton/crypto');
require('dotenv').config();

class JettonService {
  constructor() {
    // Initialize TonClient with environment variables
    this.client = new TonClient({
      endpoint: process.env.TON_ENDPOINT,
      apiKey: process.env.TON_API_KEY,
    });
    
    // Get mnemonic from environment variables
    this.mnemonic = process.env.MNEMONIC.split(' ');
    this.fromWalletAddress = process.env.FROM_WALLET_ADDRESS;
  }

  async transferJettons(amount, toAddress) {
    const masterWalletAddress = process.env.MASTER_WALLET_ADDRESS;
    try {
      // Convert mnemonic phrase to private key
      const keyPair = await mnemonicToPrivateKey(this.mnemonic);
      
      // Create sender's wallet instance V5R1
      const wallet = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
      });
      
      // Open wallet contract
      const walletContract = this.client.open(wallet);
      const seqno = await walletContract.getSeqno();
      
      // Get sender's Jetton wallet address
      const jettonWallet = await this.getJettonWalletAddress(this.fromWalletAddress, masterWalletAddress);
      
      // Create message for token transfer
      const transferMessage = beginCell()
        .storeUint(0xf8a7ea5, 32) // op.transfer
        .storeUint(0, 64) // query_id
        .storeCoins(toNano(amount)) // amount
        .storeAddress(Address.parse(toAddress)) // destination address
        .storeAddress(Address.parse(this.fromWalletAddress)) // response destination
        .storeBit(false) // custom payload
        .storeCoins(toNano('0.01')) // forward_amount
        .storeBit(false) // forward_payload
        .endCell();
      
      // Create transaction for V5R1
      const transfer = wallet.createTransfer({
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds from now
        messages: [
          internal({
            to: jettonWallet,
            value: toNano('0.05'),
            body: transferMessage,
            bounce: true,
          }),
        ],
        secretKey: keyPair.secretKey,
        seqno: seqno,
        sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
      });
      
      // Send transaction and wait for execution
      await walletContract.send(transfer);
      
      // Wait for seqno change, confirming transaction execution
      let currentSeqno = seqno;
      while (currentSeqno === seqno) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        currentSeqno = await walletContract.getSeqno();
      }
      
      return {
        success: true,
        message: `Successfully transferred ${amount} Jettons to ${toAddress}`,
        seqno: currentSeqno,
      };
    } catch (error) {
      console.error('Error transferring Jettons:', error);
      throw new Error(`Failed to transfer Jettons: ${error.message}`);
    }
  }

  async getJettonWalletAddress(ownerAddress, masterAddress) {
    const masterContract = this.client.open(JettonMaster.create(Address.parse(masterAddress)));
    const jettonWalletAddress = await masterContract.getWalletAddress(Address.parse(ownerAddress));
    return jettonWalletAddress.toString();
  }
}

module.exports = new JettonService();