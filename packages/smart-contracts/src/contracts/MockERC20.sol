//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MockERC20 is ERC20 {
  constructor() ERC20('MockERC20', 'MOCK') {
    _mint(msg.sender, 1000 ether);
  }
}
