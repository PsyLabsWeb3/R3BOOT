import { ethers } from 'ethers';

export class eoaWalletProvider {
    generateRandomEOA = async () => {
        // Create random EOA wallet
        const randomWallet = ethers.Wallet.createRandom();
        const address = randomWallet.address;
        const privateKey = randomWallet.privateKey;

        // Return the address and private key
        return { address, privateKey };
    };
}