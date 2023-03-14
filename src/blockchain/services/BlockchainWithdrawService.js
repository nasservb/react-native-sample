import Web3Service from './Web3Service';

class BlockchainWithdrawService {
  async getContract() {
    return await Web3Service.getContract('withdraw');
  }

  async request(guid, amount, message = '') {
    const withdraw = await this.getContract(),
      weiAmount = Web3Service.web3.utils.toWei(`${amount}`, 'ether'),
      gasLimit = 167839, //TODO: make this dynamic
      gasPrice = Web3Service.web3.utils.toWei(`1`, 'Gwei'),
      gas = gasPrice * gasLimit, // TODO: make this dynamic
      gasEther = Web3Service.web3.utils.fromWei(`${gas}`, 'ether');

    const withdrawRequest = await withdraw.methods.request(
      guid,
      weiAmount
    );

    const result = await Web3Service.sendSignedContractMethodWithValue(
      withdrawRequest,
      gas,
      `Request a withdrawal of ${amount} Minds Tokens. ${gasEther.toString()} ETH will be transferred to cover the gas fee. If you send a low amount of gas fee, your withdrawal may fail. ${message}`.trim()
    );

    return {
      address: await Web3Service.getCurrentWalletAddress(true),
      amount: weiAmount.toString(),
      tx: result.transactionHash,
      gas: gas.toString(),
    };
  }
}

export default new BlockchainWithdrawService();
