//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./Closet.sol";

/** These are just used for the tests. Any upgrades to this contract should be written in a new file. */
contract Closet2 is Closet {
  string public test;

  function version() virtual override public pure returns(string memory) {
    return "2.0";
  }

  function setTest(string memory _test) public onlyOwner {
    test = _test;
  }
}

contract Closet3 is Closet2 {
  string public anotherTest;

  function version() virtual override public pure returns(string memory) {
    return "3.0";
  }
  
  function setAnotherTest(string memory _test) public onlyOwner {
    anotherTest = _test;
    test = "changed";
  }
}