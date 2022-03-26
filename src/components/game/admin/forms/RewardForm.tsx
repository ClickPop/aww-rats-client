import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import React, { FC, useContext, useState } from 'react';
import { GameAdminContext } from '~/components/context/GameAdminContext';
import {
  Rewards_Insert_Input,
  InsertRewardsMutation,
  useInsertRewardsMutation,
} from '~/schema/generated';

type Props = {
  onClose: () => void;
};

export const RewardForm: FC<Props> = ({ onClose }) => {
  const { refetch } = useContext(GameAdminContext);
  const [newReward, setNewReward] = useState<Rewards_Insert_Input>({
    tokens: 0,
  });
  const [insertReward] = useInsertRewardsMutation();
  const handleSubmit = async () => {
    try {
      await insertReward({ variables: { rewards: newReward } });
      refetch();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        <FormControl>
          <FormLabel>Token Amount</FormLabel>
          <NumberInput
            min={0}
            onChange={(_, val) =>
              setNewReward((nr) => ({ ...nr, tokens: isNaN(val) ? 0 : val }))
            }>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <ButtonGroup mt='2rem' width='100%' justifyContent='center'>
          <Button colorScheme='red' onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='green' type='submit'>
            Save
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};
