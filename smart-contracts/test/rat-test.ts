import { ethers } from "hardhat";
import { RAT_COST } from "~/config/env";

describe("Rat", () => {
  it("Should blah blah blah", async (done) => {
    const [owner, user] = await ethers.getSigners();
    const Rat = await ethers.getContractFactory("Rat", owner);
    const rat = await Rat.deploy(RAT_COST).then(r => r.deployed());

    const tx = await rat.connect(user).createToken({value: RAT_COST}).then(t => t.wait());
    console.log(tx.events);
    done();
  });
});