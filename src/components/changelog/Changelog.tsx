import React from 'react';
import {
  Link,
  ListItem,
  UnorderedList,
  Text,
} from '@chakra-ui/react';
import { Release } from '~/components/changelog/Release';

export const Changelog = () => {
  return (
    <div className='flex flex-col max-w-xl px-4 mx-auto py-20'>
      <h2 className='mb-4 text-4xl font-bold'>Changelog</h2>
      <Text mb={8}>
        The sewer is constantly growing and changing. Here&apos;s a running list of all the new things.
      </Text>

      <Release releaseDate='04/31/2022'>
        <UnorderedList mb={2}>
          <ListItem>
            Added background images with a placeholder rat to <Link href='/closet' isExternal>the closet</Link> item thumbnails so it's easier to see what the items look like on a rat.
          </ListItem>
        </UnorderedList>
      </Release>

      <Release releaseDate='04/31/2022'>
        <Text mb={2}>Our first monthly airdrop!</Text>
        <UnorderedList mb={2}>
          <ListItem>
            A schoolhouse background for <Link href='/closet' isExternal>the closet</Link>.
          </ListItem>
          <ListItem>
            A <Link href='https://opensea.io/collection/aww-rats-characters' isExternal>character</Link> from the Aww, Rats! sewerverse.
          </ListItem>
          <ListItem>
            A spiffy backpack <Link href='/closet' isExternal>the closet</Link>.
          </ListItem>
          <ListItem>
            A hilarious rat mascot head <Link href='/closet' isExternal>the closet</Link>.
          </ListItem>
          <ListItem>
            Guild specific hands for <Link href='/closet' isExternal>the closet</Link>. Lab rats get a pencil, pack rats a lunchbox, street rats a dodgeball, and pet rats an apple with a worm.
          </ListItem>
        </UnorderedList>
      </Release>
    </div>
  );
};
