//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rat is ERC721URIStorage, Ownable {
  using SafeERC20 for IERC20;

  string private _contractURI;
  uint public numTokens = 0;
  uint32 public maxTokens;
  uint32 public defaultMaxTokensPerWallet = 15;
  bool public canMint = true;
  uint private _tokenIds = 0;
  uint public cost = 0.025 ether;

  address[] private _tokenHolders;
  uint[] public burnedTokens;

  mapping (address => uint[]) private _tokensByOwner;
  mapping (address => uint[]) private _burnedTokensByOwner;
  mapping (address => uint32) public maxTokensPerWallet;

  event TokenMinted(uint tokenId);
  event TokenBurned(uint tokenId, address tokenOwner);
  event TokenTransferred(uint tokenId, address newOwner, address oldOwner, uint[] newOwnerTokens, uint[] oldOwnerTokens, address[] tokenHolders);

  IERC20 public weth;

  constructor(string memory initContractURI, address _weth, uint baseId, uint32 _maxTokens) ERC721("AwwRat", "RAT") {
    _tokenIds = baseId;
    _contractURI = initContractURI;
    maxTokens = _maxTokens;
    weth = IERC20(_weth);
  }

  function createToken() public payable {
    require(numTokens < maxTokens && canMint, "Max number of tokens reached");
    uint newItemId = _tokenIds;
    uint wethBal = weth.balanceOf(msg.sender);
    require(wethBal >= cost, "Not enough weth");
    if (maxTokensPerWallet[msg.sender] == 0) {
      maxTokensPerWallet[msg.sender] = defaultMaxTokensPerWallet;
    }
    require(balanceOf(msg.sender) < maxTokensPerWallet[msg.sender], "Max tokens reached for wallet");
    weth.safeTransferFrom(msg.sender, owner(), cost);
    if (balanceOf(msg.sender) == 0) {
      _tokenHolders.push(msg.sender);
    }
    _safeMint(msg.sender, newItemId);
    _tokenIds++;
    numTokens++;
    _tokensByOwner[msg.sender].push(newItemId);
    canMint = numTokens < maxTokens;
    emit TokenMinted(newItemId);
  }

  function storeAsset(uint id, string memory uri) public onlyOwner {
    _setTokenURI(id, uri);
  }

  function burnToken(uint id) public {
    require (ownerOf(id) == msg.sender || isApprovedForAll(ownerOf(id), msg.sender), "You do not own this rat");
    address tokenOwner = ownerOf(id) == msg.sender ? msg.sender : ownerOf(id);
    _burn(id);
    if (balanceOf(tokenOwner) == 0) {
      removeTokenHolder(tokenOwner);
    }
    removeTokenId(tokenOwner, id);
    _burnedTokensByOwner[tokenOwner].push(id);
    burnedTokens.push(id);
    numTokens--;
    emit TokenBurned(id, tokenOwner);
  }

  function getBurnedTokensByOwner(address user) public view returns (uint[] memory) {
    return _burnedTokensByOwner[user];
  }

  function getTokensByOwner(address user) public view returns (uint[] memory) {
    return _tokensByOwner[user];
  }
  
  function getTokenOwners() public view returns (address[] memory) {
    return _tokenHolders;
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

  function setMaxTokens(uint32 newMax) public onlyOwner {
    maxTokens = newMax;
    canMint = numTokens < maxTokens;
  }

  function setMaxTokensPerWallet(address wallet, uint32 max) public onlyOwner {
    maxTokensPerWallet[wallet] = max;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override (ERC721) {
    if (from != address(0) && to != address(0)) {
      if (balanceOf(from) - 1 == 0) {
        removeTokenHolder(from);
      }
      if (balanceOf(to) == 0) {
        _tokenHolders.push(to);
      }
      removeTokenId(from, tokenId);
      _tokensByOwner[to].push(tokenId);
      emit TokenTransferred(tokenId, to, from, _tokensByOwner[to], _tokensByOwner[from], _tokenHolders);
    }
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function removeTokenId(address addr, uint tokenId) internal {
    uint numTokensByOwner = _tokensByOwner[addr].length;
    for (uint256 i = 0; i < numTokensByOwner; i++) {
      if (_tokensByOwner[addr][i] == tokenId) {
        if (i == numTokensByOwner - 1) {
          _tokensByOwner[addr].pop();
          break;
        }
        
        _tokensByOwner[addr][i] = _tokensByOwner[addr][numTokensByOwner - 1];
        _tokensByOwner[addr].pop();
        break;
      }
    }
  }

  function removeTokenHolder(address tokenOwner) internal {
    uint numHolders = _tokenHolders.length;
    for (uint256 i = 0; i < numHolders; i++) {
      if (_tokenHolders[i] == tokenOwner) {
        if (i == numHolders - 1) {
        _tokenHolders.pop();
        break;
      }
      
      _tokenHolders[i] = _tokenHolders[numHolders - 1];
      _tokenHolders.pop();
      break;
      }
    }
  }
}