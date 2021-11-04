//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Closet is ERC1155Burnable, ERC1155Supply, Ownable {
  string[] public tokenStrings;
  mapping(string => uint) public tokenStringToId;

  constructor(string[] memory _tokenStrings) ERC1155("https://awwrats.com/{id}.json") {
    tokenStrings = _tokenStrings;
    for (uint256 i = 0; i < _tokenStrings.length; i++) {
      tokenStringToId[_tokenStrings[i]] = i;
    }
  }

  function _burn(address account, uint256 id, uint256 value) internal override(ERC1155, ERC1155Supply) {
    super._burn(account, id, value);
  }
  
  function _burnBatch(address account, uint256[] memory ids, uint256[] memory amounts) internal override(ERC1155, ERC1155Supply) {
    super._burnBatch(account, ids, amounts);
  }

  function _mint(address account, uint256 id, uint256 amount, bytes memory data) internal override(ERC1155, ERC1155Supply) {
    super._mint(account, id, amount, data);
  }
  
  function _mintBatch(address account, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal override(ERC1155, ERC1155Supply) {
    super._mintBatch(account, ids, amounts, data);
  }
}