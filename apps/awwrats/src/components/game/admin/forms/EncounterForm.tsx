import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  NumberInput,
  NumberInputField,
  Switch,
  Textarea,
  Text,
} from '@chakra-ui/react';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { GameAdminContext } from '~/components/context/GameAdminContext';
import {
  Encounters_Insert_Input,
  Encounter_Types_Enum,
  Rattributes_Enum,
  useUpsertEncountersMutation,
} from '~/schema/generated';
import ReactSelect from 'react-select';
import { ImageUpload } from '~/components/game/admin/forms/ImageUpload';

type Props = {
  onClose: () => void;
  encounter: Encounters_Insert_Input;
  setEncounter: Dispatch<SetStateAction<Encounters_Insert_Input>>;
};

export const EncounterForm: FC<Props> = ({
  onClose,
  encounter,
  setEncounter,
}) => {
  const { rewards, rattributes, refetch } = useContext(GameAdminContext);

  const [upsertEncounters] = useUpsertEncountersMutation();

  const onDrop = useCallback(
    ([file]: File[]) => {
      const handleUpload = async () => {
        try {
          const name =
            encounter.name && encounter.name.length > 0
              ? `${encounter.name}.png`
              : file.name;
          const { signedURL }: { signedURL: string; path: string } =
            await fetch('/api/image/get-signed-upload-url', {
              method: 'post',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                path: `rat-race/images/encounters/${name}`,
              }),
            }).then((res) => res.json());

          await fetch(signedURL, {
            method: 'put',
            body: file,
          }).then((res) => res.text());

          setEncounter((ne) => ({
            ...ne,
            image: `https://storage.googleapis.com/aww-rats/rat-race/images/encounters/${name}`,
          }));
        } catch (err) {
          console.error();
        }
      };

      handleUpload();
    },
    [encounter.name, setEncounter],
  );

  const isValid = encounter.name && encounter.reward_id;

  const handleSubmit = async () => {
    try {
      await upsertEncounters({
        variables: {
          encounters: [encounter],
        },
      });
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
        <Grid templateColumns='repeat(2, 1fr)' gap='1rem'>
          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={encounter.name ?? undefined}
                onChange={({ currentTarget: { value } }) =>
                  setEncounter((ne) => ({
                    ...ne,
                    name: value,
                  }))
                }
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Enegy Cost</FormLabel>
              <NumberInput
                min={1}
                max={50}
                value={encounter.energy_cost ?? undefined}
                onChange={(_, val) => {
                  setEncounter((ne) => ({
                    ...ne,
                    energy_cost: isNaN(val) ? 1 : val,
                  }));
                }}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Power</FormLabel>
              <NumberInput
                min={1}
                max={50}
                value={encounter.power ?? undefined}
                onChange={(_, val) => {
                  setEncounter((ne) => ({
                    ...ne,
                    power: isNaN(val) ? 1 : val,
                  }));
                }}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Resistances</FormLabel>
              <ReactSelect
                isMulti
                isSearchable={false}
                value={encounter?.encounter_resistances?.data.map((er) => ({
                  value: er.resistance as string,
                  label: er.resistance as string,
                }))}
                options={rattributes
                  .filter(
                    (r) =>
                      !encounter.encounter_weaknesses?.data?.some(
                        (er) => er.weakness === r.rattribute,
                      ),
                  )
                  .map((r) => ({
                    value: r.rattribute,
                    label: r.rattribute,
                  }))}
                onChange={(vals) => {
                  setEncounter((ne) => ({
                    ...ne,
                    encounter_resistances: {
                      data: vals.map((v) => ({
                        resistance: v.value as Rattributes_Enum,
                      })),
                    },
                  }));
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Weaknesses</FormLabel>
              <ReactSelect
                isMulti
                isSearchable={false}
                value={encounter?.encounter_weaknesses?.data.map((er) => ({
                  value: er.weakness as string,
                  label: er.weakness as string,
                }))}
                options={rattributes
                  .filter(
                    (r) =>
                      !encounter.encounter_resistances?.data.some(
                        (er) => er.resistance === r.rattribute,
                      ),
                  )
                  .map((r) => ({
                    value: r.rattribute,
                    label: r.rattribute,
                  }))}
                onChange={(vals) => {
                  setEncounter((ne) => ({
                    ...ne,
                    encounter_weaknesses: {
                      data: vals.map((v) => ({
                        weakness: v.value as unknown as Rattributes_Enum,
                      })),
                    },
                  }));
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={encounter.description ?? ''}
                onChange={({ currentTarget: { value } }) =>
                  setEncounter((ne) => ({
                    ...ne,
                    description: value,
                  }))
                }
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Win Text</FormLabel>
              <Textarea
                value={encounter.win_text ?? ''}
                onChange={({ currentTarget: { value } }) =>
                  setEncounter((ne) => ({
                    ...ne,
                    win_text: value,
                  }))
                }
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Loss Text</FormLabel>
              <Textarea
                value={encounter.loss_text ?? ''}
                onChange={({ currentTarget: { value } }) =>
                  setEncounter((ne) => ({
                    ...ne,
                    loss_text: value,
                  }))
                }
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired={true}>
              <FormLabel>Reward</FormLabel>
              <ReactSelect
                options={rewards.map((r) => ({
                  value: r.id,
                  label: r.id,
                }))}
                onChange={(val) =>
                  setEncounter((ne) => ({
                    ...ne,
                    reward_id: val?.value ?? -1,
                  }))
                }
                isSearchable={false}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <Text height='100%'>
              {(encounter.reward_id ?? 0) > 0 &&
                JSON.stringify(
                  {
                    ...rewards.find((r) => r.id === encounter.reward_id),
                    __typename: undefined,
                  },
                  null,
                  2,
                )}
            </Text>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Max Rats</FormLabel>
              <NumberInput
                min={1}
                max={50}
                value={encounter.max_rats ?? 0}
                onChange={(_, val) => {
                  setEncounter((ne) => ({
                    ...ne,
                    max_rats: isNaN(val) ? 1 : val,
                  }));
                }}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Active?</FormLabel>
              <Switch
                isChecked={encounter.active ?? undefined}
                onChange={({ currentTarget: { checked } }) =>
                  setEncounter((ne) => ({ ...ne, active: checked }))
                }
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <ImageUpload onDrop={onDrop} image={encounter.image} />
            </FormControl>
          </GridItem>
        </Grid>

        <ButtonGroup mt='2rem' width='100%' justifyContent='center'>
          <Button colorScheme='red' onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='green' type='submit' disabled={!isValid}>
            Save
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};
