//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rat is ERC721URIStorage, Ownable {
  using SafeERC20 for IERC20;

  uint public numTokens = 0;
  uint public cost = 0.025 ether;
  uint32 public maxTokens = 99;
  uint32 public defaultMaxTokensPerWallet = 1;
  bool public canMint = true;
  string public defaultTokenURI = "https://awwrats.com/opensea-metadata.json";

  uint private _tokenIds = 0;

  address[] public tokenOwners;
  uint[] public burnedTokens;

  // These are mappings of address to arrays of token ids to signify the tokens owned, and tokens burned by a particular address
  mapping (address => uint[]) private _tokensByOwner;
  mapping (address => uint[]) private _burnedTokensByOwner;
  
  // A maxTokensPerWallet of 0 is equivalent to an uncapped wallet (i.e. it can have an "infinite number of tokens" as long as the maximum token count hasn't been reached)
  mapping (address => uint32) public maxTokensPerWallet;
  mapping (address => bool) public walletBans;

  // These events are used for us to track state changing transactions by type and avoid using the catch all Transfer event.
  event TokenMinted(uint tokenId);
  event TokenBurned(uint tokenId, address tokenOwner);
  event TokenTransferred(uint tokenId, address newOwner, address oldOwner, uint[] newOwnerTokens, uint[] oldOwnerTokens, address[] tokenOwners);

  // This is the ERC-20 compliant token we will accept as payment. The address to the token is supplied to the constructor, but we also have a method to change it after the fact if needed
  IERC20 public erc20;

  constructor(string memory initContractURI, string memory _defaultTokenURI, address _erc20, uint baseId, uint32 _maxTokens, uint32 _defaultMaxTokensPerWallet, uint _cost, string memory name, string memory symbol) ERC721(name, symbol) {
    _tokenIds = baseId != 0 ? baseId : 0;
    _contractURI = bytes(initContractURI).length != 0 ? initContractURI : _contractURI;
    maxTokens = maxTokens != 100 ? _maxTokens : maxTokens;
    defaultTokenURI = bytes(_defaultTokenURI).length != 0 ? _defaultTokenURI : defaultTokenURI;
    defaultMaxTokensPerWallet = _defaultMaxTokensPerWallet != 1 ? _defaultMaxTokensPerWallet : defaultMaxTokensPerWallet;
    cost = _cost;
    erc20 = IERC20(_erc20);
  }

  // This is our function for minting new tokens
  function createToken() public payable {
    // 1. It checks that the number of minted tokens is less than the maximum
    require(numTokens < maxTokens && canMint, "Max number of tokens reached");
    // 2. Checks if the wallet is banned
    require(!walletBans[msg.sender], "This wallet cannot mint a token");
    
    uint newItemId = _tokenIds;
    
    // 3. It check that the user has enough balance on the ERC-20 contract we setup for accepting payments
    uint erc20Bal = erc20.balanceOf(msg.sender);
    require(erc20Bal >= cost, "Not enough tokens");
    
    bool firstToken = balanceOf(msg.sender) == 0;
    
    // 4. Sets the default max tokens for the wallet if this is the first token 
    if (firstToken) {
      maxTokensPerWallet[msg.sender] = defaultMaxTokensPerWallet;
    }

    // 5. Checks that the balance of tokens for that wallet is less or equal than the max or that the max tokens for the wallet is 0, meaning it is uncapped.
    require(balanceOf(msg.sender) < maxTokensPerWallet[msg.sender] || maxTokensPerWallet[msg.sender] == 0, "Max tokens reached for wallet");

    // 6. Transfers tokens from the sender of the transaction to the owner of the smart contract equal to the cost specified
    erc20.safeTransferFrom(msg.sender, owner(), cost);
    
    // 7. Mint the token
    _safeMint(msg.sender, newItemId);
    
    // 8. Set tokenURI to default tokenURI
    _setTokenURI(newItemId, defaultTokenURI);

    // 9. If this is the first token, add this wallet to the array of wallets that own tokens
    if (firstToken) {
      tokenOwners.push(msg.sender);
    }

    // 10. Increment the number of tokens and the tokenId key
    _tokenIds++;
    numTokens++;

    // 11. Add this token id to the list of tokens for this wallet
    _tokensByOwner[msg.sender].push(newItemId);

    // 12. Set the global canMint flag based on the current total tokens
    canMint = numTokens < maxTokens;

    // 13. Emit the token minted event for consumption outside the block-chain
    emit TokenMinted(newItemId);
  }

  // This is just used to set the URI of a token after it is minted. We handle this asyncronously with our geneRATor
  function storeAsset(uint id, string memory uri) public onlyOwner {
    _setTokenURI(id, uri);
  }

  // This is a wrapper for burning a token
  function burnToken(uint id) public {
    // 1. Checks that the sender is either the owner of the token or approved to act on it 
    require (ownerOf(id) == msg.sender || isApprovedForAll(ownerOf(id), msg.sender), "You do not own this rat");

    address tokenOwner = ownerOf(id) == msg.sender ? msg.sender : ownerOf(id);
    
    // 2. Burn the token
    _burn(id);

    // 3. If the sender owns no other tokens remove them from the tokenHolder array
    if (balanceOf(tokenOwner) == 0) {
      removeTokenHolder(tokenOwner);
    }

    // 4. Remove the token id from our internal mapping of addresses to lists of tokens
    removeTokenId(tokenOwner, id);

    // 5. Add this token id to the list of tokens burned for this owner
    _burnedTokensByOwner[tokenOwner].push(id);

    // 6. Add this token to the list of all burned tokens
    burnedTokens.push(id);

    // 7. Decrement the number of tokens
    numTokens--;

    // 8. Emit the token burned event for consumption outside the block-chain
    emit TokenBurned(id, tokenOwner);
  }

  /** 
    The reason we have these functions instead of making the value itself public is because this is a nested mapping (In this case a map of arrays). 
    With nested mappings you need to provide 2 keys when querying the public variable. 
    With this function we can just take in the main key (wallet address) and return the full array back.
  */ 
  function getBurnedTokensByOwner(address user) public view returns (uint[] memory) {
    return _burnedTokensByOwner[user];
  }

  function getTokensByOwner(address user) public view returns (uint[] memory) {
    return _tokensByOwner[user];
  }

  function getTokenOwners() public view returns (address[] memory) {
    return tokenOwners;
  }

  function getBurnedTokens() public view returns (uint[] memory) {
    return burnedTokens;
  }

  // These are a bunch of helper functions for updating the state of the contract after it has been deployed
  function setERC20Address(address newAddr) public onlyOwner {
    erc20 = IERC20(newAddr);
  }

  function setCost(uint newCost) public onlyOwner {
    cost = newCost;
  }

  function setMaxTokens(uint32 newMax) public onlyOwner {
    maxTokens = newMax;
    canMint = numTokens < maxTokens;
  }

  function setMaxTokensForWallets(address[] memory wallets, uint32 max) public onlyOwner {
    for (uint256 i = 0; i < wallets.length; i++) {
      maxTokensPerWallet[wallets[i]] = max;
    }
  }

  function setWalletBan(address[] memory wallets, bool banned) public onlyOwner {
    for (uint256 i = 0; i < wallets.length; i++) {
      walletBans[wallets[i]] = banned;
    }
  }

  function setMintingStatus(bool status) public onlyOwner {
    canMint = status;
  }

  function setDefaultMaxTokensPerWallet(uint32 _defaultMaxTokensPerWallet) public onlyOwner {
    defaultMaxTokensPerWallet = _defaultMaxTokensPerWallet;
  }

  /** 
    This hook runs before any transfer (Including minting and burning).
    See https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721-_beforeTokenTransfer-address-address-uint256-
  */ 
  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override (ERC721) {
    // 1. We ignore minting (from address == 0) and burning (to address == 0) events
    if (from != address(0) && to != address(0)) {
      // 2. We check if the "from" balance after transferring would be equal to 0 (Hence the balanceOf - 1), and if so remove them from the tokenOwners array
      if (balanceOf(from) - 1 == 0) {
        removeTokenHolder(from);
      }

      // 3. We check if this is the first token for the "to" wallet, we add them to the tokenOwners array
      if (balanceOf(to) == 0) {
        tokenOwners.push(to);
      }
      // 4. These handle the internal state logic for transferring the token
      removeTokenId(from, tokenId);
      _tokensByOwner[to].push(tokenId);

      /** 
        5. We emit a token transferred event for consumtion outside the block-chain.
        (Note: this is different from the Transfer event built into the OpenZeppelin ERC-721 spec)
      */
      emit TokenTransferred(tokenId, to, from, _tokensByOwner[to], _tokensByOwner[from], tokenOwners);
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
    uint numHolders = tokenOwners.length;
    for (uint256 i = 0; i < numHolders; i++) {
      if (tokenOwners[i] == tokenOwner) {
        if (i == numHolders - 1) {
        tokenOwners.pop();
        break;
      }
      
      tokenOwners[i] = tokenOwners[numHolders - 1];
      tokenOwners.pop();
      break;
      }
    }
  }

  // This is used by OpenSea to auto-populate our contract as a collection
  string private _contractURI = "https://www.awwrats.com/default-erc721-token-metadata.json";
  
  function contractURI() public view returns (string memory) {
    return _contractURI;
  }
  
  function setContractURI(string memory newContractURI) public onlyOwner {
    _contractURI = newContractURI;
  }
}