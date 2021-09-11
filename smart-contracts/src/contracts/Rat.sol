//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Rat is ERC721URIStorage, AccessControl {
  uint256 private _tokenIds;
  address payable private _owner;
  uint256 public cost;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  event TokenMinted(uint256 tokenId);

  constructor(uint256 initCost) ERC721("AwwRat", "RAT") {
    _tokenIds = 0;
    cost = initCost;
    _owner = payable(msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  function createToken() public payable returns (uint256) {
    uint256 newItemId = _tokenIds;
    require(msg.value >= cost, "Not enough currency");
    _safeMint(msg.sender, newItemId);
    emit TokenMinted(newItemId);
    _tokenIds++;
    _owner.transfer(msg.value);
    return newItemId;
  }

  function storeAsset(uint256 id, string memory uri) public {
    bool canStore = msg.sender == ownerOf(id) || hasRole(ADMIN_ROLE, msg.sender);
    require(canStore, "Not admin or token owner");
    _setTokenURI(id, uri);
  }

  function changeCost(uint256 newCost) public {
    require(hasRole(ADMIN_ROLE, msg.sender), "Unauthorized");
    cost = newCost;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}