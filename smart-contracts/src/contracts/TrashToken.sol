// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

struct TokenHolder {
  address account;
  uint amount;
}

contract TrashToken is Initializable, ERC20VotesUpgradeable, UUPSUpgradeable, ERC20PresetMinterPauserUpgradeable {
  address public ratContract;
  address public closetContract;
  bytes32 private constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  TokenHolder[] public tokenHolders;

  function init(string memory name, string memory symbol, string memory version, address rat, address closet) public initializer {
    __ERC20PresetMinterPauser_init(name, symbol);
    __ERC20Votes_init_unchained();
    __ERC20Permit_init_unchained(name);
    __EIP712_init_unchained(name, version);
    ratContract = rat;
    closet = closet;
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function handleRaidPayout(address[] memory accounts, uint amount) public onlyRole(MINTER_ROLE) {
    for (uint256 i = 0; i < accounts.length; i++) {
      mint(accounts[i], amount);
    }
  }

  /** Overrides */
  // solhint-disable-next-line no-empty-blocks
  function _authorizeUpgrade(address) virtual internal override onlyRole(ADMIN_ROLE) {}

  function _mint(address account, uint amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    _addTokenHolder(account, amount);
    super._mint(account, amount);
  }

  function _burn(address account, uint amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    _removeTokenHolder(account, amount);
    super._burn(account, amount);
  }

  function _beforeTokenTransfer(address from, address to, uint amount) internal override(ERC20PresetMinterPauserUpgradeable, ERC20Upgradeable) {
    super._beforeTokenTransfer(from, to, amount);
  }

  function _afterTokenTransfer(address from, address to, uint amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    super._afterTokenTransfer(from, to, amount);
    _addTokenHolder(to, amount);
    _removeTokenHolder(from, amount);
  }

  function _addTokenHolder(address account, uint amount) internal {
    bool exists = false;
    for (uint256 i = 0; i < tokenHolders.length; i++) {
      if (tokenHolders[i].account == account) {
        exists = true;
      }
    }

    if (!exists) {
      tokenHolders.push(TokenHolder(account, balanceOf(account) + amount));
    }
  }

  function _removeTokenHolder(address account, uint amount) internal {
    if (balanceOf(account) - amount < 1) {
      for (uint256 i = 0; i < tokenHolders.length; i++) {
        if (tokenHolders[i].account == account) {
          TokenHolder memory tmp = tokenHolders[i];
          tokenHolders[i] = tokenHolders[tokenHolders.length - 1];
          tokenHolders[tokenHolders.length - 1] = tmp;
          tokenHolders.pop();
        }
      }
    }
  }

}