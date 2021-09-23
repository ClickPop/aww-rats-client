import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, {expect} from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { CONTRACT_URI } from "~/config/env";
import { MockERC20, Rat } from "~/types";

chai.use(solidity);

describe("Rat", () => {
  let contract: Rat;
  let weth: MockERC20;
  let cost: BigNumber;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let owner: SignerWithAddress;
  let initialBalOwner: BigNumber;
  let initialBalUser: BigNumber;
  
  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0]
    user = signers[1]
    user2 = signers[2]
    const ERC20 = await ethers.getContractFactory("MockERC20", owner);
    weth = await ERC20.deploy().then(r => r.deployed());
    await weth.transfer(user.address, ethers.utils.parseEther("10")).then(t => t.wait());
    await weth.transfer(user2.address, ethers.utils.parseEther("10")).then(t => t.wait());
    initialBalOwner = await weth.balanceOf(owner.address);
    initialBalUser = await weth.balanceOf(user.address);
    const Rat = await ethers.getContractFactory("Rat", owner);
    contract = await Rat.deploy(CONTRACT_URI, weth.address, 0, 1000, "AwwRat", "RAT").then(r => r.deployed());
    cost = await contract.cost();
  })

  beforeEach(async () => {
    contract = contract.connect(user)
    weth = weth.connect(user);
  });

  it("Should mint an nft and acurately transfer funds", async () => {
    await weth.approve(contract.address, cost).then(t => t.wait())
    await contract.createToken().then(t => t.wait());
    expect(await contract.balanceOf(user.address)).to.equal(1)
    expect(await contract.ownerOf(0)).to.equal(user.address)
    const newUserBal = await weth.balanceOf(user.address);
    const newOwnerBal = await weth.balanceOf(owner.address);
    expect(newUserBal).to.be.lt(initialBalUser);
    expect(newOwnerBal).to.be.gt(initialBalOwner);
    const owners = await contract.getTokenOwners();
    expect(owners).to.have.length(1).and.include(user.address);
    const tokens = await contract.getTokensByOwner(user.address);
    expect(tokens).to.have.length(1);
    expect(tokens[0].toNumber()).to.equal(0);
  });

  it("Should allow you to transfer an nft from one wallet to another", async () => {
    const tx = await contract.transferFrom(user.address, user2.address, 0).then(t => t.wait());
    expect(await contract.balanceOf(user.address)).to.equal(0)
    expect(await contract.balanceOf(user2.address)).to.equal(1)
    expect(await contract.ownerOf(0)).to.equal(user2.address)
    const owners = await contract.getTokenOwners();
    expect(owners).to.have.length(1).and.include(user2.address).and.not.include(user.address);
    const tokens = await contract.getTokensByOwner(user2.address);
    expect(tokens).to.have.length(1);
    expect(tokens[0]).to.equal(0);
    const noTokens = await contract.getTokensByOwner(user.address);
    expect(noTokens).to.be.empty;
  })

  it("Should allow you to burn a token you own", async () => {
    contract = contract.connect(user2)
    const tx = await contract.burnToken(0).then(t => t.wait());
    expect(await contract.balanceOf(user2.address)).to.equal(0)
    const owners = await contract.getTokenOwners();
    expect(owners).to.be.empty;
    const burnedTokens = await contract.getBurnedTokensByOwner(user2.address);
    expect(burnedTokens).to.have.length(1);
    expect(burnedTokens[0]).to.equal(0);
  });

  it("Should mint multiple tokens, then burn one and keep track of the burned one, as well as transfer and keep track of it", async () => {
    await weth.approve(contract.address, cost.mul(5))
    for (let i = 0; i < 5; i++) {
      await contract.createToken().then(t => t.wait());
    }
    expect(await contract.balanceOf(user.address)).to.equal(5);
    await contract.burnToken(3).then(t => t.wait());
    const tokens = (await contract.getTokensByOwner(user.address)).map(t => t.toNumber())
    expect(tokens).to.have.length(4).not.to.include(3);
    expect(await contract.getBurnedTokensByOwner(user.address)).to.have.length(1);

    await contract.transferFrom(user.address, user2.address, 2).then(t => t.wait());
    expect(await contract.balanceOf(user.address)).to.equal(3);
    expect(await contract.balanceOf(user2.address)).to.equal(1);
    const tokensTransferred = (await contract.getTokensByOwner(user.address)).map(t => t.toNumber())
    expect(tokensTransferred).to.have.length(3).not.to.include(2);
    const newTokens = (await contract.getTokensByOwner(user2.address)).map(t => t.toNumber());
    expect(newTokens).to.have.length(1).to.include(2);

  });
});