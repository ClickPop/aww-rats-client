import { Token_Types_Enum } from '~/schema/generated';
import ERC721 from 'smart-contracts/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json';

export const getCommonABI = (token: Token_Types_Enum) => {
  switch (token) {
    case Token_Types_Enum.Erc721:
      return ERC721.abi;
    default:
      return [];
  }
};
