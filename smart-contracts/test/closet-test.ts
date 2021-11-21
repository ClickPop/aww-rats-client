import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ContractReceipt } from '@ethersproject/contracts';
import { parseEther } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai, { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { Closet, MockERC20 } from '~/types';

chai.use(solidity);

const checkEvents = (
  tx: ContractReceipt,
  eventType: keyof Closet['filters'],
  cb: (entry: [string, any]) => void,
) => {
  if (tx.events) {
    tx.events.forEach((e) => {
      if (e.args && e.event === eventType) {
        Object.entries(e.args).forEach((k) => cb(k));
      }
    });
  }
};

describe('Closet', () => {
  let contract: Closet;
  let weth: MockERC20;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let owner: SignerWithAddress;
  let initialBalOwner: BigNumber;
  let initialBalContract: BigNumber;
  let initialBalUser: BigNumber;
  let initialBalUser2: BigNumber;
  let initialBalUser3: BigNumber;

  before(async () => {
    const signers = await ethers.getSigners();
    [owner, user, user2, user3] = signers;
    const ERC20 = await ethers.getContractFactory('MockERC20', owner);
    weth = await ERC20.deploy().then((r) => r.deployed());
    await weth
      .transfer(user.address, ethers.utils.parseEther('10'))
      .then((t) => t.wait());
    await weth
      .transfer(user2.address, ethers.utils.parseEther('10'))
      .then((t) => t.wait());
    initialBalOwner = await weth.balanceOf(owner.address);
    initialBalUser = await weth.balanceOf(user.address);
    const Closet = await ethers.getContractFactory('Closet', owner);
    contract = await Closet.deploy([], weth.address).then((r) => r.deployed());
  });

  beforeEach(async () => {
    contract = contract.connect(user);
    weth = weth.connect(user);
  });

  describe('Admin Functions', async () => {
    const token = {
      name: 'sweater',
      cost: ethers.utils.parseEther('0.005'),
      maxTokens: 100,
      active: true,
      maxPerWallet: 0,
      revShareAddress: '',
      revShareAmount: [1, 1] as [BigNumberish, BigNumberish],
    };
    const token2 = {
      name: 'hat',
      cost: ethers.utils.parseEther('0.001'),
      maxTokens: 100,
      active: true,
      maxPerWallet: 0,
      revShareAddress: '',
      revShareAmount: [1, 1] as [BigNumberish, BigNumberish],
    };
    const token3 = {
      name: 'revShare',
      cost: ethers.utils.parseEther('0.005'),
      maxTokens: 10,
      active: true,
      maxPerWallet: 1,
      revShareAddress: '',
      revShareAmount: [4, 5] as [BigNumberish, BigNumberish],
    };
    beforeEach(async () => (contract = contract.connect(owner)));

    it('should create a new token type when called by the owner', async () => {
      const tx = await contract
        .addNewTokenType({ ...token, revShareAddress: contract.address })
        .then((r) => r.wait());
      checkEvents(tx, 'TokenTypeAdded', ([k, v]) => {
        switch (k) {
          case 'tokenId':
            expect(v.toString()).to.equal('1');
            break;
          case 'token':
            expect(v.name).to.eq('sweater');
            expect(ethers.utils.formatEther(v.cost)).to.eq('0.005');
            expect(v.maxTokens.toNumber()).to.eq(100);
            expect(v.active).to.eq(true);
            expect(v.maxPerWallet).to.eq(0);
            expect(v.revShareAddress).to.eq(contract.address);
            expect(v.revShareAmount).to.deep.eq([
              BigNumber.from(1),
              BigNumber.from(1),
            ]);
        }
      });
      const tokens = await contract.getAllTokenIds();
      expect(tokens).to.have.length(1);
      const tx2 = await contract
        .addNewTokenType({ ...token2, revShareAddress: contract.address })
        .then((r) => r.wait());
      checkEvents(tx2, 'TokenTypeAdded', ([k, v]) => {
        switch (k) {
          case 'tokenId':
            expect(v.toString()).to.equal('2');
            break;
          case 'token':
            expect(v.name).to.eq('hat');
            expect(ethers.utils.formatEther(v.cost)).to.eq('0.001');
            expect(v.maxTokens.toNumber()).to.eq(100);
            expect(v.active).to.eq(true);
            expect(v.maxPerWallet).to.eq(0);
            expect(v.revShareAddress).to.eq(contract.address);
            expect(v.revShareAmount).to.deep.eq([
              BigNumber.from(1),
              BigNumber.from(1),
            ]);
        }
      });
      const tokens2 = await contract.getAllTokenIds();
      expect(tokens2).to.have.length(2);
      const tx3 = await contract
        .addNewTokenType({ ...token3, revShareAddress: user3.address })
        .then((r) => r.wait());
      checkEvents(tx3, 'TokenTypeAdded', ([k, v]) => {
        switch (k) {
          case 'tokenId':
            expect(v.toString()).to.equal('3');
            break;
          case 'token':
            expect(v.name).to.eq('revShare');
            expect(ethers.utils.formatEther(v.cost)).to.eq('0.005');
            expect(v.maxTokens.toNumber()).to.eq(10);
            expect(v.active).to.eq(true);
            expect(v.maxPerWallet).to.eq(1);
            expect(v.revShareAddress).to.eq(user3.address);
            expect(v.revShareAmount).to.deep.eq([
              BigNumber.from(4),
              BigNumber.from(5),
            ]);
        }
      });
      const tokens3 = await contract.getAllTokenIds();
      expect(tokens3).to.have.length(3);
    });

    it('should change an existing token when called by owner', async () => {
      const tx = await contract
        .changeToken(1, {
          ...token,
          revShareAddress: contract.address,
          cost: ethers.utils.parseEther('0.002'),
        })
        .then((r) => r.wait());
      checkEvents(tx, 'TokenTypeChanged', ([k, v]) => {
        switch (k) {
          case 'tokenId':
            expect(v.toString()).to.equal('1');
            break;
          case 'token':
            expect(v.name).to.eq('sweater');
            expect(ethers.utils.formatEther(v.cost)).to.eq('0.002');
            expect(v.maxTokens.toNumber()).to.eq(100);
            expect(v.active).to.eq(true);
        }
      });
      const tokens = await contract.getAllTokenIds();
      expect(tokens).to.have.length(3);
    });

    it('should set max tokens for a wallet if called by owner', async () => {
      const tx = await contract
        .setMaxTokensForWallet(user.address, 1, 2)
        .then((r) => r.wait());
      checkEvents(tx, 'WalletMaxChanged', ([k, v]) => {
        switch (k) {
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
          case 'tokenId':
            expect(v.toNumber()).to.eq(1);
            break;
          case 'max':
            expect(v.toNumber()).to.eq(2);
        }
      });
    });

    it('should ban a particular wallet', async () => {
      const tx = await contract
        .banWallet(user.address, 'They suck')
        .then((r) => r.wait());
      checkEvents(tx, 'WalletBanned', ([k, v]) => {
        switch (k) {
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
          case 'reason':
            expect(v).to.eq('They suck');
            break;
        }
      });
      const ban = await contract.walletBans(user.address);
      expect(ban.banned).to.be.true;
      expect(ban.reason).to.eq('They suck');
    });

    it('should unban a particular wallet', async () => {
      const tx = await contract.unbanWallet(user.address).then((r) => r.wait());
      checkEvents(tx, 'WalletUnbanned', ([k, v]) => {
        switch (k) {
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
        }
      });
      const ban = await contract.walletBans(user.address);
      expect(ban.banned).to.be.false;
    });

    it('should change the ERC20 address when called by contract owner', async () => {
      const ERC20 = await ethers.getContractFactory('MockERC20', owner);
      weth = await ERC20.deploy().then((r) => r.deployed());
      await weth
        .transfer(user.address, ethers.utils.parseEther('10'))
        .then((t) => t.wait());
      await weth
        .transfer(user2.address, ethers.utils.parseEther('10'))
        .then((t) => t.wait());
      initialBalOwner = await weth.balanceOf(owner.address);
      initialBalContract = await weth.balanceOf(contract.address);
      initialBalUser = await weth.balanceOf(user.address);
      const tx = await contract
        .changeERC20Contract(weth.address)
        .then((r) => r.wait());
      checkEvents(tx, 'ChangeERC20Contract', ([k, v]) => {
        switch (k) {
          case 'erc20Addr':
            expect(v).to.eq(weth.address);
        }
      });
    });
  });

  describe('Minting, Burning, and Transfer', () => {
    afterEach(async () => {
      initialBalUser = await weth.balanceOf(user.address);
      initialBalUser2 = await weth.balanceOf(user2.address);
      initialBalUser3 = await weth.balanceOf(user3.address);
      initialBalOwner = await weth.balanceOf(owner.address);
      initialBalContract = await weth.balanceOf(contract.address);
    });

    it('should allow a wallet to mint a token of an existing type', async () => {
      const token = await contract.getTokenById(1);

      await weth.approve(contract.address, token.cost).then((r) => r.wait());
      const tx = await contract.mint(1, 1).then((r) => r.wait());
      checkEvents(tx, 'TokensMinted', ([k, v]) => {
        switch (k) {
          case 'tokenId':
            expect(v.toNumber()).to.eq(1);
            break;
          case 'amount':
            expect(v.toNumber()).to.eq(1);
            break;
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
        }
      });
      expect((await weth.balanceOf(contract.address)).toString()).to.eq(
        initialBalContract.add(token.cost).toString(),
      );
      expect((await weth.balanceOf(user.address)).toString()).to.eq(
        initialBalUser.sub(token.cost).toString(),
      );
    });

    it('should allow minting with revenue sharing', async () => {
      const token = await contract.getTokenById(3);
      await weth.approve(contract.address, token.cost).then((r) => r.wait());
      const tx = await contract.mint(3, 1).then((r) => r.wait());
      checkEvents(tx, 'TokensMinted', ([k, v]) => {
        switch (k) {
          case 'tokenId':
            expect(v.toNumber()).to.eq(3);
            break;
          case 'amount':
            expect(v.toNumber()).to.eq(1);
            break;
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
        }
      });
      const revShare = token.revShareAmount[0].mul(
        token.cost.div(token.revShareAmount[1]),
      );
      expect((await weth.balanceOf(contract.address)).toString()).to.eq(
        initialBalContract.add(token.cost.sub(revShare)).toString(),
      );
      expect((await weth.balanceOf(user3.address)).toString()).to.eq(revShare);
      expect((await weth.balanceOf(user.address)).toString()).to.eq(
        initialBalUser.sub(token.cost).toString(),
      );
    });

    it('should allow a wallet to batch mint tokens of existing types', async () => {
      const token = await contract.getTokenById(1);
      const token2 = await contract.getTokenById(2);
      await weth
        .approve(contract.address, token.cost.add(token2.cost.mul(2)))
        .then((r) => r.wait());
      const tx = await contract.mintBatch([1, 2], [1, 2]).then((r) => r.wait());
      checkEvents(tx, 'BatchTokensMinted', ([k, v]) => {
        switch (k) {
          case 'tokenIds':
            v.forEach((val: BigNumber) => {
              expect(val.toNumber()).to.be.oneOf([1, 2]);
            });
            break;
          case 'amounts':
            v.forEach((val: BigNumber) => {
              expect(val.toNumber()).to.be.oneOf([1, 2]);
            });
            break;
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
        }
      });
      expect((await weth.balanceOf(contract.address)).toString()).to.eq(
        initialBalContract.add(token.cost.add(token2.cost.mul(2))).toString(),
      );
      expect((await weth.balanceOf(user.address)).toString()).to.eq(
        initialBalUser.sub(token.cost.add(token2.cost.mul(2))).toString(),
      );
    });

    it('should allow a wallet to batch mint tokens with revenue sharing', async () => {
      const token = await contract.getTokenById(3);
      await weth
        .connect(user2)
        .approve(contract.address, token.cost)
        .then((r) => r.wait());
      const tx = await contract
        .connect(user2)
        .mintBatch([3], [1])
        .then((r) => r.wait());
      checkEvents(tx, 'BatchTokensMinted', ([k, v]) => {
        switch (k) {
          case 'tokenIds':
            v.forEach((val: BigNumber) => {
              expect(val.toNumber()).to.be.oneOf([3]);
            });
            break;
          case 'amounts':
            v.forEach((val: BigNumber) => {
              expect(val.toNumber()).to.be.oneOf([1]);
            });
            break;
          case 'wallet':
            expect(v).to.eq(user2.address);
            break;
        }
      });
      const revShare = token.revShareAmount[0].mul(
        token.cost.div(token.revShareAmount[1]),
      );
      expect((await weth.balanceOf(contract.address)).toString()).to.eq(
        initialBalContract.add(token.cost.sub(revShare)).toString(),
      );
      expect((await weth.balanceOf(user3.address)).toString()).to.eq(
        initialBalUser3.add(revShare),
      );
      expect((await weth.balanceOf(user2.address)).toString()).to.eq(
        initialBalUser2.sub(token.cost).toString(),
      );
    });

    it('should allow a wallet to burn a token of an existing type', async () => {
      const tx = await contract.burn(1, 1).then((r) => r.wait());
      checkEvents(tx, 'TokensBurned', ([k, v]) => {
        switch (k) {
          case 'tokenId':
            expect(v.toNumber()).to.eq(1);
            break;
          case 'amount':
            expect(v.toNumber()).to.eq(1);
            break;
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
        }
      });
      expect(await contract.balanceOf(user.address, 1)).to.eq(
        BigNumber.from(1),
      );
    });

    it('should allow a wallet to batch burn tokens of existing types', async () => {
      const tx = await contract.burnBatch([1, 2], [1, 1]).then((r) => r.wait());
      checkEvents(tx, 'BatchTokensBurned', ([k, v]) => {
        switch (k) {
          case 'tokenIds':
            v.forEach((val: BigNumber) => {
              expect(val.toNumber()).to.be.oneOf([1, 2]);
            });
            break;
          case 'amounts':
            v.forEach((val: BigNumber) => {
              expect(val.toNumber()).to.be.oneOf([1, 2]);
            });
            break;
          case 'wallet':
            expect(v).to.eq(user.address);
            break;
        }
      });
      expect(await contract.balanceOf(user.address, 1)).to.eq(
        BigNumber.from(0),
      );
      expect(await contract.balanceOf(user.address, 2)).to.eq(
        BigNumber.from(1),
      );
    });

    it('should allow a wallet to transfer a token to another wallet', async () => {
      const tx = await contract
        .safeTransferFrom(user.address, user2.address, 2, 1, [])
        .then((r) => r.wait());
      checkEvents(tx, 'TransferSingle', ([k, v]) => {
        switch (k) {
          case 'operator':
            expect(v).to.eq(user.address);
            break;
          case 'from':
            expect(v).to.eq(user.address);
            break;
          case 'to':
            expect(v).to.eq(user2.address);
            break;
          case 'id':
            expect(v.toNumber()).to.eq(2);
            break;
          case 'value':
            expect(v.toNumber()).to.eq(1);
            break;
        }
      });
      expect(await contract.balanceOf(user.address, 2)).to.eq(
        BigNumber.from(0),
      );
      expect(await contract.balanceOf(user2.address, 2)).to.eq(
        BigNumber.from(1),
      );
    });

    it('should allow a wallet to batch transfer tokens to another wallet', async () => {
      const tx = await contract
        .connect(user2)
        .safeBatchTransferFrom(user2.address, user.address, [2], [1], [])
        .then((r) => r.wait());
      checkEvents(tx, 'TransferSingle', ([k, v]) => {
        switch (k) {
          case 'operator':
            expect(v).to.eq(user2.address);
            break;
          case 'from':
            expect(v).to.eq(user2.address);
            break;
          case 'to':
            expect(v).to.eq(user.address);
            break;
          case 'id':
            expect(v.toNumber()).to.eq(2);
            break;
          case 'value':
            expect(v.toNumber()).to.eq(1);
            break;
        }
      });
      expect(await contract.balanceOf(user.address, 2)).to.eq(
        BigNumber.from(1),
      );
      expect(await contract.balanceOf(user2.address, 2)).to.eq(
        BigNumber.from(0),
      );
    });
  });

  describe('Errors', () => {
    it('should error if admin methods are called by non-owner', async () => {
      const c = contract.connect(user);
      const token = {
        name: 'Not Allowed',
        cost: 0,
        maxTokens: 0,
        active: false,
        maxPerWallet: 0,
        revShareAddress: contract.address,
        revShareAmount: [0, 0] as [BigNumberish, BigNumberish],
      };
      expect(c.addNewTokenType(token)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
      expect(c.changeToken(1, token)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
      expect(c.setMaxTokensForWallet(user.address, 1, 0)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
      expect(c.banWallet(user2.address, 'They suck')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
      expect(c.unbanWallet(user.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });

    it('should error if you try to mint tokens without enough weth or approval or if they are inactive', async () => {
      const c = contract.connect(user2);
      expect(c.mint(1, 1)).to.be.revertedWith('ERC20 allowance not enough');
      expect(c.mintBatch([1], [1])).to.be.revertedWith(
        'ERC20 allowance not enough',
      );
      await weth
        .connect(user2)
        .approve(c.address, await c.getTokenById(2).then((t) => t.cost))
        .then((r) => r.wait());
      await weth
        .connect(user2)
        .transfer(user.address, await weth.balanceOf(user2.address))
        .then((r) => r.wait());

      expect(c.mint(1, 1)).to.be.revertedWith('Not enough currency');
      expect(c.mintBatch([1], [1])).to.be.revertedWith('Not enough currency');
      const {
        name,
        cost,
        maxTokens,
        maxPerWallet,
        revShareAddress,
        revShareAmount,
      } = await contract.getTokenById(2);
      await contract.connect(owner).changeToken(2, {
        name,
        cost,
        maxTokens,
        maxPerWallet,
        revShareAddress,
        revShareAmount,
        active: false,
      });
      expect(c.mint(2, 1)).to.be.revertedWith('Token is inactive');
      expect(c.mintBatch([2], [1])).to.be.revertedWith('Token is inactive');
    });

    it('should error if you try to mint ot transfer tokens beyond the maximum allowed', async () => {
      await weth
        .approve(contract.address, ethers.utils.parseEther('10'))
        .then((r) => r.wait());
      await weth
        .connect(user2)
        .approve(contract.address, ethers.utils.parseEther('10'))
        .then((r) => r.wait());
      expect(contract.mint(1, 105)).to.be.revertedWith(
        'Max tokens reached for type',
      );
      expect(contract.mint(1, 3)).to.be.revertedWith(
        'Max tokens reached for wallet',
      );
      expect(contract.mint(3, 2)).to.be.revertedWith(
        'Max tokens reached for wallet',
      );
      await weth
        .transfer(user2.address, ethers.utils.parseEther('5'))
        .then((r) => r.wait());
      await contract
        .connect(user2)
        .mint(1, 5)
        .then((r) => r.wait());
      expect(
        contract
          .connect(user2)
          .safeTransferFrom(user2.address, user.address, 1, 5, []),
      ).to.be.revertedWith('Max tokens reached for wallet');
      expect(
        contract
          .connect(user2)
          .safeTransferFrom(user2.address, user.address, 3, 1, []),
      ).to.be.revertedWith('Max tokens reached for wallet');
    });

    it('should error if you try to burn tokens you do not own', async () => {
      expect(contract.burn(1, 1)).to.be.revertedWith(
        'Cannot burn more than owned',
      );
      expect(contract.burnBatch([1], [1])).to.be.revertedWith(
        'Cannot burn more than owned',
      );
    });

    it('should error if you try to transfer tokens you do not own', async () => {
      expect(
        contract.safeTransferFrom(user.address, user2.address, 1, 1, []),
      ).to.be.revertedWith('ERC1155: insufficient balance for transfer');
      expect(
        contract.safeBatchTransferFrom(
          user.address,
          user2.address,
          [1],
          [1],
          [],
        ),
      ).to.be.revertedWith('ERC1155: insufficient balance for transfer');
    });
  });

  describe('Public methods', () => {
    it('should get all token ids', async () => {
      const ids = await contract.getAllTokenIds();
      expect(ids.map((id) => id.toNumber()))
        .to.include(1)
        .and.to.include(2);
    });

    it('should get all tokens', async () => {
      const tokens = await contract.getAllTokens();
      expect(tokens).to.have.length(3);
      const [sweater, hat, revShare] = tokens;
      expect(sweater.id.toNumber()).to.eq(1);
      expect(sweater.token.name).to.eq('sweater');
      expect(sweater.token.cost).to.eq(parseEther('0.002'));
      expect(sweater.token.maxTokens).to.eq(BigNumber.from(100));
      expect(sweater.token.active).to.eq(true);
      expect(sweater.token.maxPerWallet.toNumber()).to.eq(0);
      expect(sweater.token.revShareAddress).to.eq(contract.address);
      expect(sweater.token.revShareAmount)
        .to.have.length(2)
        .and.to.deep.eq([BigNumber.from(1), BigNumber.from(1)]);
      expect(sweater.token.active).to.eq(true);
      expect(hat.id.toNumber()).to.eq(2);
      expect(hat.token.name).to.eq('hat');
      expect(hat.token.cost).to.eq(parseEther('0.001'));
      expect(hat.token.maxTokens).to.eq(BigNumber.from(100));
      expect(hat.token.active).to.eq(false);
      expect(hat.token.maxPerWallet.toNumber()).to.eq(0);
      expect(hat.token.revShareAddress).to.eq(contract.address);
      expect(hat.token.revShareAmount)
        .to.have.length(2)
        .and.to.deep.eq([BigNumber.from(1), BigNumber.from(1)]);
      expect(revShare.id.toNumber()).to.eq(3);
      expect(revShare.token.name).to.eq('revShare');
      expect(revShare.token.cost).to.eq(parseEther('0.005'));
      expect(revShare.token.maxTokens).to.eq(BigNumber.from(10));
      expect(revShare.token.active).to.eq(true);
      expect(revShare.token.maxPerWallet.toNumber()).to.eq(1);
      expect(revShare.token.revShareAddress).to.eq(user3.address);
      expect(revShare.token.revShareAmount)
        .to.have.length(2)
        .and.to.deep.eq([BigNumber.from(4), BigNumber.from(5)]);
    });

    it('should get all active tokens', async () => {
      const tokens = await contract.getActiveTokens();
      expect(tokens).to.have.length(2);
      expect(tokens.map((token) => token.token.name)).to.deep.eq([
        'sweater',
        'revShare',
      ]);
    });
  });
});
