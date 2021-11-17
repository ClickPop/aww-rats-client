//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


struct Token {
  string name;
  uint cost;
  uint maxTokens;
  bool active;
}

struct TokenWithId {
  uint id;
  Token token;
}

struct UserToken {
  uint id;
  uint amount;
  Token token;
}

struct Ban {
  bool banned;
  string reason;
}

contract Closet is ERC1155Supply, Ownable {
  using SafeERC20 for IERC20;

  uint[] public existingTokenIds;
  mapping(uint => Token) public idToToken;
  mapping(uint => mapping (address => uint)) public maxTokensPerWalletById;
  mapping(address => Ban) public walletBans;
  
  IERC20 public erc20;

  event TokenTypeAdded(uint tokenId, Token token);
  event TokenTypeChanged(uint tokenId, Token token);
  event TokensMinted(uint tokenId, uint amount, address wallet);
  event BatchTokensMinted(uint[] tokenIds, uint[] amounts, address wallet);
  event TokensBurned(uint tokenId, uint amount, address wallet);
  event BatchTokensBurned(uint[] tokenIds, uint[] amounts, address wallet);
  event WalletBanned(address wallet, string reason);
  event WalletUnbanned(address wallet);
  event WalletMaxChanged(address wallet, uint tokenId, uint max);
  event ChangeERC20Contract(address erc20Addr);

  constructor(Token[] memory tokens, address erc20Addr) ERC1155("https://awwrats.com/  {id}.json") {
    erc20 = IERC20(erc20Addr);
    for (uint256 i = 0; i < tokens.length; i++) {
      _addNewTokenType(tokens[i]);
    }
  }

  /** Token Handling */
  function mint(uint tokenId, uint amount) public payable mintingAllowed(tokenId, amount) {
    erc20.safeTransferFrom(msg.sender, address(this), idToToken[tokenId].cost * amount);
    _mint(msg.sender, tokenId, amount, msg.data);
    emit TokensMinted(tokenId, amount, msg.sender);
  }

  function mintBatch(uint[] memory ids, uint[] memory amounts) public payable batchMintingAllowed(ids, amounts) {
    uint totalCost = 0;
    for (uint256 i = 0; i < ids.length; i++) {
      totalCost += idToToken[ids[i]].cost * amounts[i];
    } 
    erc20.safeTransferFrom(msg.sender, address(this), totalCost);
    _mintBatch(msg.sender, ids, amounts, msg.data);
    emit BatchTokensMinted(ids, amounts, msg.sender);
  }

  function burn(uint tokenId, uint amount) public burningAllowed(tokenId, amount) {
    _burn(msg.sender, tokenId, amount);
    emit TokensBurned(tokenId, amount, msg.sender);
  }

  function burnBatch(uint[] memory ids, uint[] memory amounts) public batchBurningAllowed(ids, amounts) {
    _burnBatch(msg.sender, ids, amounts);
    emit BatchTokensBurned(ids, amounts, msg.sender);
  }

  /** Read Only Methods */
  function getAllTokenIds() public view returns(uint[] memory) {
    return existingTokenIds;
  }

  function getAllTokens() public view returns(TokenWithId[] memory) {
    TokenWithId[] memory tokens = new TokenWithId[](existingTokenIds.length);
    for (uint256 i = 0; i < existingTokenIds.length; i++) {
      tokens[i] = TokenWithId(existingTokenIds[i], idToToken[existingTokenIds[i]]);
    }
    return tokens;
  }

  function getTokensByWallet(address wallet) public view returns(UserToken[] memory) {
    UserToken[] memory userTokens = new UserToken[](existingTokenIds.length);
    uint tokensCount = 0;
    for (uint256 i = 0; i < existingTokenIds.length; i++) {
      if (balanceOf(wallet, existingTokenIds[i]) > 0) {
        userTokens[tokensCount] = UserToken(existingTokenIds[i], balanceOf(wallet, existingTokenIds[i]), idToToken[existingTokenIds[i]]);
        tokensCount++;
      }
    }
    return userTokens;
  }

  /** Admin */
  function addNewTokenType(Token memory token) public onlyOwner {
    for(uint i = 0; i < existingTokenIds.length; i++) {
      require(!_compareStrings(idToToken[existingTokenIds[i]].name, token.name), "Token already exists");
    }
    _addNewTokenType(token);
  }

  function changeToken(uint tokenId, Token memory token) public onlyOwner tokenExists(tokenId) {
    idToToken[tokenId] = token;
    emit TokenTypeChanged(tokenId, token);
  }

  function setMaxTokensForWallet(address wallet, uint tokenId, uint max) public onlyOwner tokenExists(tokenId) {
    maxTokensPerWalletById[tokenId][wallet] = max;
    emit WalletMaxChanged(wallet, tokenId, max);
  }

  function banWallet(address wallet, string memory reason) public onlyOwner {
    require(!_compareStrings(reason, ""), "Reason cannot be empty");
    walletBans[wallet] = Ban(true, reason);
    emit WalletBanned(wallet, reason);
  }

  function unbanWallet(address wallet) public onlyOwner {
    walletBans[wallet] = Ban(false, "");
    emit WalletUnbanned(wallet);
  }

  function changeERC20Contract(address erc20Addr) public onlyOwner {
    erc20 = IERC20(erc20Addr);
    emit ChangeERC20Contract(erc20Addr);
  }

  function withdrawEth(uint amount) public onlyOwner {
    require(erc20.balanceOf(owner()) >= amount, "Cannot withdraw more than owned");
    erc20.approve(owner(), amount);
    erc20.safeTransfer(owner(), amount);
  }

  /** Modifiers */
  modifier mintingAllowed(uint tokenId, uint amount) {
    _checkMinting(tokenId, amount);
    _;
  }

  modifier batchMintingAllowed(uint[] memory ids, uint[] memory amounts) {
    require(ids.length == amounts.length, "Mismatched tokenIds and amounts");
    for (uint i = 0; i < ids.length; i++) {
      _checkMinting(ids[i], amounts[i]);
    }
    _;
  }

  modifier burningAllowed(uint tokenId, uint amount) {
    _checkBurning(tokenId, amount);
    _;
  }

  modifier batchBurningAllowed(uint[] memory ids, uint[] memory amounts) {
    require(ids.length == amounts.length, "Mismatched tokenIds and amounts");
    for (uint i = 0; i < ids.length; i++) {
      _checkBurning(ids[i], amounts[i]);
    }
    _;
  }

  modifier tokenExists(uint tokenId) {
    require(!_compareStrings(idToToken[tokenId].name, ""), "Token ID does not exist");
    _;
  }

  /** Internal */
  function _checkMinting(uint tokenId, uint amount) internal view tokenExists(tokenId) {
    require(idToToken[tokenId].active, "Token is inactive");
    require(idToToken[tokenId].maxTokens == 0 || idToToken[tokenId].maxTokens >= totalSupply(tokenId) + amount, "Max tokens reached for type");
    require(maxTokensPerWalletById[tokenId][msg.sender] == 0 || maxTokensPerWalletById[tokenId][msg.sender] >= balanceOf(msg.sender, tokenId) + amount, "Max tokens reached for wallet");
    require(erc20.balanceOf(msg.sender) >= idToToken[tokenId].cost, "Not enough currency");
    require(erc20.allowance(msg.sender, address(this)) >= idToToken[tokenId].cost, "ERC20 allowance not enough");
  } 

  function _checkBurning(uint tokenId, uint amount) internal view tokenExists(tokenId) {
    require(balanceOf(msg.sender, tokenId) >= amount, "Cannot burn more than owned");
  }

  function _addNewTokenType(Token memory token) internal {
    uint tokenId = existingTokenIds.length + 1;
    idToToken[tokenId] = token;
    existingTokenIds.push(tokenId);
    emit TokenTypeAdded(tokenId, token);
  }

  function _compareStrings(string memory str1, string memory str2) internal pure returns (bool) {
    return keccak256(bytes(str1)) == keccak256(bytes(str2));
  }

  /** Overrides */
  function _safeTransferFrom(address from, address to, uint id, uint amount, bytes memory data) internal override(ERC1155) {
    require(maxTokensPerWalletById[id][msg.sender] == 0 || maxTokensPerWalletById[id][msg.sender] >= balanceOf(msg.sender, id) + amount, "Max tokens reached for wallet");
    super._safeTransferFrom(from, to, id, amount, data);
  }
  
  function _safeBatchTransferFrom(address from, address to, uint[] memory ids, uint[] memory amounts, bytes memory data) internal override(ERC1155) {
    require(ids.length == amounts.length, "Mismatched tokenIds and amounts");
    for (uint256 i = 0; i < ids.length; i++) {
      require(maxTokensPerWalletById[ids[i]][msg.sender] == 0 || maxTokensPerWalletById[ids[i]][msg.sender] >= balanceOf(msg.sender, ids[i]) + amounts[i], "Max tokens reached for wallet");
    }
    super._safeBatchTransferFrom(from, to, ids, amounts, data);
  }
}