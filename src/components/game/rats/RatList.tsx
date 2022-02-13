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
import { Metadata, RatWithMeta } from '~/types';
import { stringToRatType } from '~/utils/enums';

type Props = {
  drawer: Omit<DrawerProps, 'children'>;
};

export const RatList: FC<Props> = ({ drawer }) => {
  const {
    ratResult: { data, loading },
    selectedRats,
    setSelectedRats,
    selectRatIndex,
  } = useContext(GameContext);

  const alreadySelected = (id: BigNumberish) =>
    !!selectedRats.find((r) => r?.id === id);

  const getCardState = (id: BigNumberish) =>
    alreadySelected(id) ? 'selected' : undefined;

  console.log(data?.rats.map((r) => r.type));
  return (
    <Drawer {...drawer} placement='right' size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Your Rats</DrawerHeader>
        <DrawerBody>
          {loading && <Box>Loading...</Box>}
          {!loading && data ? (
            <>
              {data.rats.map((rat) =>
                rat ? (
                  <RatThumbCard
                    mb={2}
                    ml={0}
                    key={`${
                      BigNumber.isBigNumber(rat.id)
                        ? rat.id.toString()
                        : String(rat.id)
                    }-${rat.name}`}
                    ratType={stringToRatType(rat.type ?? '') as Rat_Types_Enum}
                    image={`/api/image/proxy-image?imageURL=${rat.image!.replace(
                      'ipfs://',
                      'https://ipfs.io/ipfs/',
                    )}`}
                    cunning={rat.cunning}
                    cuteness={rat.cuteness}
                    rattitude={rat.rattitude}
                    state={getCardState(rat.id)}
                    onClick={() => {
                      if (!alreadySelected(rat.id)) {
                        setSelectedRats((st) =>
                          st.map((r, i) => (i === selectRatIndex ? rat : r)),
                        );
                      }
                    }}
                  />
                ) : null,
              )}
              <Button
                onClick={() =>
                  setSelectedRats((st) =>
                    st.map((r, i) => (i === selectRatIndex ? null : r)),
                  )
                }>
                Clear
              </Button>
            </>
          ) : (
            !loading && <Box>No rats</Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
