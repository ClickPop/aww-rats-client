import { Rat_Types_Enum } from '~/schema/generated';

export const stringToRatType = (str: string): Rat_Types_Enum | null => {
  switch (str.toLowerCase()) {
    case 'pet':
    case 'pet rat':
      return Rat_Types_Enum.Pet;
    case 'pack':
    case 'pack rat':
      return Rat_Types_Enum.Pack;
    case 'street':
    case 'street rat':
      return Rat_Types_Enum.Street;
    case 'lab':
    case 'lab rat':
      return Rat_Types_Enum.Lab;
    default:
      return null;
  }
};
