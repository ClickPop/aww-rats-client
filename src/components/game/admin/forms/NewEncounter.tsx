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
import React, { FC, useCallback, useContext, useState } from 'react';
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
  editEncounter?: Encounters_Insert_Input;
};

export const NewEncounter: FC<Props> = ({ onClose, editEncounter }) => {
  const { rewards, rattributes, refetch } = useContext(GameAdminContext);
  const [newEncounter, setNewEncounter] = useState<Encounters_Insert_Input>(
    editEncounter ?? {
      power: 1,
      energy_cost: 1,
      active: false,
      max_rats: 1,
      encounter_type: Encounter_Types_Enum.Solo,
      encounter_resistances: {
        data: [],
      },
      encounter_weaknesses: {
        data: [],
      },
    },
  );

  const [upsertEncounters] = useUpsertEncountersMutation();

  const onDrop = useCallback(
    ([file]: File[]) => {
      const handleUpload = async () => {
        try {
          const name =
            newEncounter.name && newEncounter.name.length > 0
              ? `${newEncounter.name}.png`
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

          setNewEncounter((ne) => ({
            ...ne,
            image: `https://storage.googleapis.com/aww-rats/rat-race/images/encounters/${name}`,
          }));
        } catch (err) {
          console.error();
        }
      };

      handleUpload();
    },
    [newEncounter.name],
  );

  const isValid = newEncounter.name && newEncounter.reward_id;

  const handleSubmit = async () => {
    try {
      await upsertEncounters({
        variables: {
          encounters: [newEncounter],
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
                value={newEncounter.name ?? undefined}
                onChange={({ currentTarget: { value } }) =>
                  setNewEncounter((ne) => ({
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
                value={newEncounter.energy_cost ?? undefined}
                onChange={(_, val) => {
                  setNewEncounter((ne) => ({
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
                value={newEncounter.power ?? undefined}
                onChange={(_, val) => {
                  setNewEncounter((ne) => ({
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
                value={newEncounter?.encounter_resistances?.data.map((er) => ({
                  value: er.resistance as string,
                  label: er.resistance as string,
                }))}
                options={rattributes
                  .filter(
                    (r) =>
                      !newEncounter.encounter_weaknesses?.data?.some(
                        (er) => er.weakness === r.rattribute,
                      ),
                  )
                  .map((r) => ({
                    value: r.rattribute,
                    label: r.rattribute,
                  }))}
                onChange={(vals) => {
                  setNewEncounter((ne) => ({
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
                value={newEncounter?.encounter_weaknesses?.data.map((er) => ({
                  value: er.weakness as string,
                  label: er.weakness as string,
                }))}
                options={rattributes
                  .filter(
                    (r) =>
                      !newEncounter.encounter_resistances?.data.some(
                        (er) => er.resistance === r.rattribute,
                      ),
                  )
                  .map((r) => ({
                    value: r.rattribute,
                    label: r.rattribute,
                  }))}
                onChange={(vals) => {
                  setNewEncounter((ne) => ({
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
                value={newEncounter.description ?? ''}
                onChange={({ currentTarget: { value } }) =>
                  setNewEncounter((ne) => ({
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
                value={newEncounter.win_text ?? ''}
                onChange={({ currentTarget: { value } }) =>
                  setNewEncounter((ne) => ({
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
                value={newEncounter.loss_text ?? ''}
                onChange={({ currentTarget: { value } }) =>
                  setNewEncounter((ne) => ({
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
                  setNewEncounter((ne) => ({
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
              {(newEncounter.reward_id ?? 0) > 0 &&
                JSON.stringify(
                  {
                    ...rewards.find((r) => r.id === newEncounter.reward_id),
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
                value={newEncounter.max_rats ?? 0}
                onChange={(_, val) => {
                  setNewEncounter((ne) => ({
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
                isChecked={newEncounter.active ?? undefined}
                onChange={({ currentTarget: { checked } }) =>
                  setNewEncounter((ne) => ({ ...ne, active: checked }))
                }
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <ImageUpload onDrop={onDrop} image={newEncounter.image} />
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
