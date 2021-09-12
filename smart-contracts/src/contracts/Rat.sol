//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rat is ERC721URIStorage, Ownable {
  uint256 private _tokenIds;
  address payable private _owner;
  uint256 public cost;
  uint public numerator;
  uint public denominator;
  event TokenMinted(uint256 tokenId);

  constructor(uint256 initCost) ERC721("AwwRat", "RAT") {
    _tokenIds = 0;
    cost = initCost;
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
    bool canStore = msg.sender == ownerOf(id) || (owner() == msg.sender && _exists(id));
    require(canStore, "Not admin or token owner");
    _setTokenURI(id, uri);
  }

  function changeCost(uint256 newCost) public onlyOwner {
    cost = newCost;
  }

  function updateRoyalty(uint num, uint denom) public onlyOwner {
    numerator = num;
    denominator = denom;
  }

  function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount) {
    require(_exists(tokenId), "Token does not exist");
    uint256 royalty = salePrice * (numerator / denominator);
    return (owner(), royalty);
  }

  /**  
  * I am not entirely sure if we want to do this. I am not sure what sort of effect it might have. 
  * The above is following EIP2981, but I am not sure how many market places even support that. 
  */
  // function _transfer(address from, address to, uint256 tokenId) internal virtual override {
  //   super._transfer(from,to,tokenId);
  //   if (from == address(0)) {
  //     _owner.transfer(msg.value * (numerator / denominator));
  //   }
  // }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
  }
}