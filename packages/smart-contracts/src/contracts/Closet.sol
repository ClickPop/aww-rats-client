//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

struct Token {
  string name;
  uint256 cost;
  uint256 maxTokens;
  uint256 maxPerWallet;
  bool active;
  address revShareAddress;
  uint256[2] revShareAmount;
}

struct TokenWithId {
  uint256 id;
  Token token;
}

struct UserToken {
  uint256 id;
  uint256 amount;
  Token token;
}

struct Ban {
  bool banned;
  string reason;
}

contract Closet is
  Initializable,
  ERC1155SupplyUpgradeable,
  UUPSUpgradeable,
  OwnableUpgradeable
{
  using SafeERC20Upgradeable for IERC20Upgradeable;

  uint256[] public existingTokenIds;
  mapping(uint256 => Token) private idToToken;
  mapping(uint256 => mapping(address => uint256)) public maxTokensPerWalletById;
  mapping(address => Ban) public walletBans;

  IERC20Upgradeable public erc20;

  event TokenTypeAdded(uint256 tokenId, Token token);
  event TokenTypeChanged(uint256 tokenId, Token token);
  event TokensMinted(uint256 tokenId, uint256 amount, address wallet);
  event BatchTokensMinted(
    uint256[] tokenIds,
    uint256[] amounts,
    address wallet
  );
  event TokensBurned(uint256 tokenId, uint256 amount, address wallet);
  event BatchTokensBurned(
    uint256[] tokenIds,
    uint256[] amounts,
    address wallet
  );
  event WalletBanned(address wallet, string reason);
  event WalletUnbanned(address wallet);
  event WalletMaxChanged(address wallet, uint256 tokenId, uint256 max);
  event ChangeERC20Contract(address erc20Addr);

  /// @custom:oz-upgrades-unsafe-allow constructor
  // solhint-disable-next-line no-empty-blocks
  constructor() initializer {}

  function initialize() public initializer {
    __Ownable_init();
    __ERC1155Supply_init();
    _setURI('https://awwrats.com/{id}.json');
    _contractURI = 'https://awwrats.com/closet-opensea-metadata.json';
    erc20 = IERC20Upgradeable(address(0));
  }

  /** Token Handling */
  function mint(uint256 tokenId, uint256 amount)
    public
    payable
    virtual
    mintingAllowed(tokenId, amount)
  {
    if (idToToken[tokenId].revShareAddress != owner()) {
      uint256 total = idToToken[tokenId].cost * amount;
      uint256 revShare = (total / idToToken[tokenId].revShareAmount[1]) *
        idToToken[tokenId].revShareAmount[0];
      erc20.safeTransferFrom(
        msg.sender,
        idToToken[tokenId].revShareAddress,
        revShare
      );
      erc20.safeTransferFrom(msg.sender, owner(), total - revShare);
    } else {
      erc20.safeTransferFrom(
        msg.sender,
        owner(),
        idToToken[tokenId].cost * amount
      );
    }
    _mint(msg.sender, tokenId, amount, msg.data);
    emit TokensMinted(tokenId, amount, msg.sender);
  }

  function mintBatch(uint256[] memory ids, uint256[] memory amounts)
    public
    payable
    virtual
    batchMintingAllowed(ids, amounts)
  {
    _batchMint(ids, amounts);
  }

  function burn(uint256 tokenId, uint256 amount)
    public
    virtual
    burningAllowed(tokenId, amount)
  {
    _burn(msg.sender, tokenId, amount);
    emit TokensBurned(tokenId, amount, msg.sender);
  }

  function burnBatch(uint256[] memory ids, uint256[] memory amounts)
    public
    virtual
    batchBurningAllowed(ids, amounts)
  {
    _burnBatch(msg.sender, ids, amounts);
    emit BatchTokensBurned(ids, amounts, msg.sender);
  }

  /** Read Only Methods */
  function getAllTokenIds() public view virtual returns (uint256[] memory) {
    return existingTokenIds;
  }

  function getAllTokens() public view virtual returns (TokenWithId[] memory) {
    TokenWithId[] memory tokens = new TokenWithId[](existingTokenIds.length);
    for (uint256 i = 0; i < existingTokenIds.length; i++) {
      tokens[i] = TokenWithId(
        existingTokenIds[i],
        idToToken[existingTokenIds[i]]
      );
    }
    return tokens;
  }

  function getActiveTokens()
    public
    view
    virtual
    returns (TokenWithId[] memory)
  {
    TokenWithId[] memory tokens = getAllTokens();
    uint256 activeTokenCount = 0;

    for (uint256 i = 0; i < tokens.length; i++) {
      if (tokens[i].token.active) {
        activeTokenCount++;
      }
    }
    TokenWithId[] memory activeTokens = new TokenWithId[](activeTokenCount);
    activeTokenCount = 0;
    for (uint256 i = 0; i < tokens.length; i++) {
      if (tokens[i].token.active) {
        activeTokens[activeTokenCount] = tokens[i];
        activeTokenCount++;
      }
    }
    return activeTokens;
  }

  function getTokensByWallet(address wallet)
    public
    view
    virtual
    returns (UserToken[] memory)
  {
    uint256[] memory tokenIds = new uint256[](existingTokenIds.length);
    uint256 tokensCount = 0;
    for (uint256 i = 0; i < existingTokenIds.length; i++) {
      if (balanceOf(wallet, existingTokenIds[i]) > 0) {
        tokenIds[tokensCount] = existingTokenIds[i];
        tokensCount++;
      }
    }
    UserToken[] memory userTokens = new UserToken[](tokensCount);
    for (uint256 i = 0; i < tokensCount; i++) {
      userTokens[i] = UserToken(
        tokenIds[i],
        balanceOf(wallet, tokenIds[i]),
        idToToken[tokenIds[i]]
      );
    }
    return userTokens;
  }

  function getTokenById(uint256 id) public view virtual returns (Token memory) {
    return idToToken[id];
  }

  function version() public pure virtual returns (string memory) {
    return '1.0';
  }

  /** Admin */
  function addNewTokenTypes(Token[] memory tokens) public virtual onlyOwner {
    for (uint256 j = 0; j < tokens.length; j++) {
      for (uint256 i = 0; i < existingTokenIds.length; i++) {
        require(
          !_compareStrings(idToToken[existingTokenIds[i]].name, tokens[j].name),
          'Token already exists'
        );
      }
      _addNewTokenType(tokens[j]);
    }
  }

  function changeTokens(TokenWithId[] memory tokens) public virtual onlyOwner {
    for (uint256 i = 0; i < tokens.length; i++) {
      _changeToken(tokens[i]);
    }
  }

  function setTokensStatus(uint256[] memory ids, bool status)
    public
    virtual
    onlyOwner
  {
    for (uint256 i = 0; i < ids.length; i++) {
      idToToken[ids[i]].active = status;
      TokenWithId memory tokenWithId = TokenWithId(ids[i], idToToken[ids[i]]);
      _changeToken(tokenWithId);
    }
  }

  function setMaxTokensForWallet(
    address wallet,
    uint256 tokenId,
    uint256 max
  ) public virtual onlyOwner tokenExists(tokenId) {
    maxTokensPerWalletById[tokenId][wallet] = max;
    emit WalletMaxChanged(wallet, tokenId, max);
  }

  function banWallet(address wallet, string memory reason)
    public
    virtual
    onlyOwner
  {
    require(!_compareStrings(reason, ''), 'Reason cannot be empty');
    walletBans[wallet] = Ban(true, reason);
    emit WalletBanned(wallet, reason);
  }

  function unbanWallet(address wallet) public virtual onlyOwner {
    walletBans[wallet] = Ban(false, '');
    emit WalletUnbanned(wallet);
  }

  function changeERC20Contract(address erc20Addr) public virtual onlyOwner {
    erc20 = IERC20Upgradeable(erc20Addr);
    emit ChangeERC20Contract(erc20Addr);
  }

  function promoMint(
    uint256[] memory ids,
    uint256[] memory amounts,
    address wallet
  ) public virtual onlyOwner promoMintingAllowed(ids, amounts) {
    _batchMint(ids, amounts);
    safeBatchTransferFrom(owner(), wallet, ids, amounts, msg.data);
  }

  function setUri(string memory uri) public virtual onlyOwner {
    _setURI(uri);
  }

  /** Modifiers */
  modifier mintingAllowed(uint256 tokenId, uint256 amount) virtual {
    _checkPublicMinting(tokenId, amount);
    _;
  }

  modifier batchMintingAllowed(uint256[] memory ids, uint256[] memory amounts)
    virtual {
    require(ids.length == amounts.length, 'Mismatched tokenIds and amounts');
    for (uint256 i = 0; i < ids.length; i++) {
      _checkPublicMinting(ids[i], amounts[i]);
    }
    _;
  }

  modifier promoMintingAllowed(uint256[] memory ids, uint256[] memory amounts)
    virtual {
    require(ids.length == amounts.length, 'Mismatched tokenIds and amounts');
    for (uint256 i = 0; i < ids.length; i++) {
      _checkMinting(ids[i], amounts[i]);
    }
    _;
  }

  modifier burningAllowed(uint256 tokenId, uint256 amount) virtual {
    _checkBurning(tokenId, amount);
    _;
  }

  modifier batchBurningAllowed(uint256[] memory ids, uint256[] memory amounts)
    virtual {
    require(ids.length == amounts.length, 'Mismatched tokenIds and amounts');
    for (uint256 i = 0; i < ids.length; i++) {
      _checkBurning(ids[i], amounts[i]);
    }
    _;
  }

  modifier tokenExists(uint256 tokenId) virtual {
    require(
      !_compareStrings(idToToken[tokenId].name, ''),
      'Token ID does not exist'
    );
    _;
  }

  /** Internal */
  function _checkPublicMinting(uint256 tokenId, uint256 amount)
    internal
    view
    virtual
  {
    require(idToToken[tokenId].active, 'Token is inactive');
    _checkMinting(tokenId, amount);
  }

  function _checkMinting(uint256 tokenId, uint256 amount)
    internal
    view
    virtual
    tokenExists(tokenId)
  {
    _checkTokenMax(tokenId, amount);
    _checkWalletMax(tokenId, amount, msg.sender);
    require(
      erc20.balanceOf(msg.sender) >= idToToken[tokenId].cost,
      'Not enough currency'
    );
    require(
      erc20.allowance(msg.sender, address(this)) >= idToToken[tokenId].cost,
      'ERC20 allowance not enough'
    );
  }

  function _batchMint(uint256[] memory ids, uint256[] memory amounts)
    internal
    virtual
  {
    uint256 totalCost = 0;
    uint256[] memory revShareAmounts = new uint256[](ids.length);
    address[] memory revShareAddresses = new address[](ids.length);
    uint256 revShareCount = 0;
    for (uint256 i = 0; i < ids.length; i++) {
      if (idToToken[ids[i]].revShareAddress != owner()) {
        uint256 total = idToToken[ids[i]].cost * amounts[i];
        uint256 revShare = (total / idToToken[ids[i]].revShareAmount[1]) *
          idToToken[ids[i]].revShareAmount[0];
        revShareAddresses[revShareCount] = idToToken[ids[i]].revShareAddress;
        revShareAmounts[revShareCount] = revShare;
        totalCost += total - revShare;
        revShareCount++;
      } else {
        totalCost += idToToken[ids[i]].cost * amounts[i];
      }
    }

    for (uint256 i = 0; i < revShareCount; i++) {
      erc20.safeTransferFrom(
        msg.sender,
        revShareAddresses[i],
        revShareAmounts[i]
      );
    }
    erc20.safeTransferFrom(msg.sender, owner(), totalCost);
    _mintBatch(msg.sender, ids, amounts, msg.data);
    emit BatchTokensMinted(ids, amounts, msg.sender);
  }

  function _checkTokenMax(uint256 tokenId, uint256 amount)
    internal
    view
    virtual
    tokenExists(tokenId)
  {
    require(
      idToToken[tokenId].maxTokens == 0 ||
        idToToken[tokenId].maxTokens >= totalSupply(tokenId) + amount,
      'Max tokens reached for type'
    );
  }

  function _checkWalletMax(
    uint256 tokenId,
    uint256 amount,
    address wallet
  ) internal view virtual tokenExists(tokenId) {
    require(
      (maxTokensPerWalletById[tokenId][wallet] == 0 ||
        maxTokensPerWalletById[tokenId][wallet] >=
        balanceOf(wallet, tokenId) + amount) &&
        (idToToken[tokenId].maxPerWallet == 0 ||
          idToToken[tokenId].maxPerWallet >=
          balanceOf(wallet, tokenId) + amount),
      'Max tokens reached for wallet'
    );
  }

  function _checkBurning(uint256 tokenId, uint256 amount)
    internal
    view
    virtual
    tokenExists(tokenId)
  {
    require(
      balanceOf(msg.sender, tokenId) >= amount,
      'Cannot burn more than owned'
    );
  }

  function _addNewTokenType(Token memory token) internal virtual {
    uint256 tokenId = existingTokenIds.length + 1;
    idToToken[tokenId] = token;
    existingTokenIds.push(tokenId);
    emit TokenTypeAdded(tokenId, token);
  }

  function _changeToken(TokenWithId memory token)
    internal
    virtual
    tokenExists(token.id)
  {
    idToToken[token.id] = token.token;
    emit TokenTypeChanged(token.id, token.token);
  }

  function _compareStrings(string memory str1, string memory str2)
    internal
    pure
    virtual
    returns (bool)
  {
    return keccak256(bytes(str1)) == keccak256(bytes(str2));
  }

  /** Overrides */
  function _safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) internal virtual override(ERC1155Upgradeable) {
    _checkWalletMax(id, amount, to);
    super._safeTransferFrom(from, to, id, amount, data);
  }

  function _safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override(ERC1155Upgradeable) {
    require(ids.length == amounts.length, 'Mismatched tokenIds and amounts');
    for (uint256 i = 0; i < ids.length; i++) {
      _checkWalletMax(ids[i], amounts[i], to);
    }
    super._safeBatchTransferFrom(from, to, ids, amounts, data);
  }

  // solhint-disable-next-line no-empty-blocks
  function _authorizeUpgrade(address) internal virtual override onlyOwner {}

  // This is used by OpenSea to auto-populate our contract as a collection
  string private _contractURI;

  function contractURI() public view virtual returns (string memory) {
    return _contractURI;
  }

  function setContractURI(string memory newContractURI)
    public
    virtual
    onlyOwner
  {
    _contractURI = newContractURI;
  }
}
