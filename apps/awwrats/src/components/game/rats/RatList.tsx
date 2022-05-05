import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import React, { FC, useContext } from 'react';
import { GameContext } from '~/components/context/GameContext';
import { RatThumbCard } from '~/components/game/RatThumbCard';
import { Rat_Types_Enum } from '~/schema/generated';
import { stringToRatType } from '~/utils/enums';

type Props = {
  drawer: Omit<DrawerProps, 'children'>;
  filterByType?: Rat_Types_Enum;
};

export const RatList: FC<Props> = ({ drawer, filterByType }) => {
  const {
    ratResult: { data, loading },
    ratSlots,
    setRatSlots,
    selectRatIndex,
  } = useContext(GameContext);

  const alreadySelected = (id: BigNumberish) =>
    !!ratSlots.find((slot) => slot.rat?.id === id);

  const getCardState = (id: BigNumberish) =>
    alreadySelected(id) ? 'selected' : undefined;

  return (
    <Drawer {...drawer} placement='right' size='sm'>
      <DrawerOverlay />
      <DrawerContent background='blueGray.600' color='white'>
        <DrawerCloseButton
          background='var(--chakra-colors-purple-500)'
          _hover={{
            background: 'var(--chakra-colors-purple-700)',
          }}
        />
        <DrawerHeader pb={2}>Your Rats</DrawerHeader>
        <DrawerBody>
          {loading && <Box>Loading...</Box>}
          {!loading && data ? (
            <>
              <Button
                background='var(--chakra-colors-purple-500)'
                mb={4}
                w='100%'
                _hover={{
                  background: 'var(--chakra-colors-purple-700)',
                }}
                onClick={() => {
                  setRatSlots(
                    ratSlots.map((slot) => ({ ...slot, rat: undefined })),
                  );
                  drawer.onClose();
                }}>
                Clear Party
              </Button>
              {data.rats
                .filter(
                  (r) =>
                    !filterByType ||
                    filterByType ===
                      (stringToRatType(r.type ?? '') as Rat_Types_Enum),
                )
                .map((rat) =>
                  rat ? (
                    <RatThumbCard
                      mb={2}
                      ml={0}
                      w='100%'
                      key={`${
                        BigNumber.isBigNumber(rat.id)
                          ? rat.id.toString()
                          : String(rat.id)
                      }-${rat.name}`}
                      ratType={
                        stringToRatType(rat.type ?? '') as Rat_Types_Enum
                      }
                      image={`${rat.image!}`}
                      cunning={rat.cunning}
                      cuteness={rat.cuteness}
                      rattitude={rat.rattitude}
                      state={getCardState(rat.id)}
                      imageProps={{ loading: 'eager' }}
                      onClick={() => {
                        if (!alreadySelected(rat.id)) {
                          setRatSlots((st) =>
                            st.map((r, i) =>
                              i === selectRatIndex ? { ...r, rat } : r,
                            ),
                          );
                        } else {
                          setRatSlots((st) =>
                            st.map((slot, i) =>
                              i === selectRatIndex &&
                              slot &&
                              slot.rat?.id === rat.id
                                ? { ...slot, rat: undefined }
                                : slot,
                            ),
                          );
                        }
                        drawer.onClose();
                      }}
                    />
                  ) : null,
                )}
            </>
          ) : (
            !loading && <Box>No rats</Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
