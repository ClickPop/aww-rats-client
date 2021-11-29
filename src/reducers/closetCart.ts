import { ClosetCartAction, ClosetCartState } from '~/types';

export const closetCartReducer = (
  state: ClosetCartState,
  action: ClosetCartAction,
): ClosetCartState => {
  switch (action.type) {
    case 'addItem':
      return {
        ...state,
        [action.payload.id.toString()]: action.payload.amount,
      };
    case 'changeAmount':
      return {
        ...state,
        [action.payload.id.toString()]: action.payload.amount,
      };
    case 'clearCart':
      return {};
    default:
      return state;
  }
};
