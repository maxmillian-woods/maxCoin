const SHA256 = require('crypto-js/sha256');
export class CryptoBlock {
  constructor(index, timestamp, data, previousHash = ' ') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

export class CryptoBlockchain {
  constructor() {
    this.blockchain = [this.createInitialBlock()];
    this.difficulty = 4;
  }
  createInitialBlock() {
    return new CryptoBlock(0, '01/01/2020', 'Initial Block in the Chain', '0');
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.previousHash = this.obtainLatestBlock().hash;
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  }
}

let maxCoin = new CryptoBlockchain();

console.log('maxCoin mining in progress....');
maxCoin.addNewBlock(
  new CryptoBlock(1, '04/23/2021', {
    sender: 'User 1',
    recipient: 'User 2',
    quantity: 50
  })
);

maxCoin.addNewBlock(
  new CryptoBlock(2, '04/23/2021', {
    sender: 'User 1',
    recipient: 'User 2',
    quantity: 100
  })
);

console.log(JSON.stringify(maxCoin, null, 4));