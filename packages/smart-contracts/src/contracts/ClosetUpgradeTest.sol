//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import './Closet.sol';

/** These are just used for the tests. Any upgrades to this contract should be written in a new file. */
contract Closet2 is Closet {
  string public test;

  function loadCloset(uint8 limit, uint8 offset)
    public
    view
    virtual
    override
    returns (ClosetToken[] memory)
  {
    ClosetToken[] memory tokens = new ClosetToken[](limit < 1 ? offset : limit);
    return tokens;
  }

  function setTest(string memory _test) public onlyOwner {
    test = _test;
  }
}

contract Closet3 is Closet2 {
  string public anotherTest;

  function setAnotherTest(string memory _test) public onlyOwner {
    anotherTest = _test;
    test = 'changed';
  }
}
