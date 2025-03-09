import { ethers } from 'ethers';
import contractABI from './path_to_ABI.json';  // Path to the ABI file exported from Remix

const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

export function useContract() {
    const { ethereum } = window;

    if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        return contract;
    } else {
        console.error("Ethereum object doesn't exist!");
        return null;
    }
}
