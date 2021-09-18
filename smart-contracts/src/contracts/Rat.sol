//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rat is ERC721URIStorage, Ownable {
  using SafeERC20 for IERC20;

  string private _contractURI;
  uint public numTokens = 0;
  uint32 public maxTokens;
  uint private _tokenIds = 0;
  uint public cost = 0.025 ether;
  
  event TokenMinted(uint tokenId);

  IERC20 public weth;

  constructor(string memory initContractURI, address _weth, uint baseId, uint32 _maxTokens) ERC721("AwwRat", "RAT") {
    _tokenIds = baseId;
    _contractURI = initContractURI;
    maxTokens = _maxTokens;
    weth = IERC20(_weth);
  }

  function createToken() public payable returns (uint) {
    require(numTokens < maxTokens, "Max number of tokens reached");
    uint newItemId = _tokenIds;
    uint wethBal = weth.balanceOf(msg.sender);
    require(wethBal >= cost, "Not enough weth");
    weth.safeTransferFrom(msg.sender, owner(), cost);
    _safeMint(msg.sender, newItemId);
    _tokenIds++;
    numTokens++;
    emit TokenMinted(newItemId);
    return newItemId;
  }

  function storeAsset(uint id, string memory uri) public onlyOwner {
    _setTokenURI(id, uri);
  }

  // This function is used by OpenSea to auto pickup our contract as a storefront.
  function contractURI() public view returns (string memory) {
    return _contractURI;
  }

  // These are a bunch of helper functions for updating the state of the contract after it has been deployed

  function setContractURI(string memory newContractURI) public onlyOwner {
    _contractURI = newContractURI;
  }

  function setWethAddr(address newAddr) public onlyOwner {
    weth = IERC20(newAddr);
  }

  function setCost(uint newCost) public onlyOwner {
    cost = newCost;
  }

  function setMaxMinted(uint32 newMax) public onlyOwner {
    maxTokens = newMax;
  }
}