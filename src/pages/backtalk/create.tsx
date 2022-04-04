import {
  Button,
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import { ActionBar } from '~/components/backtalk/ActionBar';
import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';

const CreateSurveyPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <Flex align='baseline' my={4}>
          <Heading as='h1' size='md'>New Survey</Heading>
      </Flex>

      <Box
          backgroundColor='white'
          border='1px'
          borderColor='gray.200'
          borderRadius={8}
          mb={4}
          p={4}
      >
        <FormControl mb={4} isRequired>
          <FormLabel htmlFor='surveyTitle'>Survey Title</FormLabel>
          <Input id='surveyTitle' placeholder='Name your survey' />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor='contract'>Limit to Contract</FormLabel>
          <Input id='contract' />
          <FormHelperText>Leave this blank to let anyone with a wallet submit a response.</FormHelperText>
        </FormControl>
        <FormControl mb={8}>
          <FormLabel htmlFor='maxResponses'>Max Responses</FormLabel>
          <NumberInput max={10000} min={0}>
            <NumberInputField id='amount' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>Set to 0 for unlimited responses.</FormHelperText>
        </FormControl>

        <Box>
          <Heading as='h2' size='sm' mb={2}>Question 1</Heading>
          <FormControl mb={4}>
            <FormLabel htmlFor='questionType'>Country</FormLabel>
            <Select id='questionType' disabled>
              <option>Free Response</option>
              <option>Multiple Choice</option>
            </Select>
          </FormControl>
          <FormControl  mb={2} isRequired>
            <FormLabel htmlFor='surveyTitle'>Survey Title</FormLabel>
            <Input id='surveyTitle' placeholder='Name your survey' />
          </FormControl>
          <Checkbox defaultChecked>Required</Checkbox>
        </Box>
      </Box>

      <ActionBar>
        <Button
          colorScheme='teal'
          size='sm'
          variant='link'
          >
            Preview
        </Button>
        <Button
          colorScheme='teal'
          ml={2}
          size='sm'
          >
            Publish
        </Button>
      </ActionBar>
    </LayoutDashboard>
  );
};

export default CreateSurveyPage;
