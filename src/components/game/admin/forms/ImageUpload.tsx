import { Box, Text } from '@chakra-ui/react';
import React, { FC, useCallback, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { Image } from '~/components/shared/Image';

type Props = {
  onDrop?: DropzoneOptions['onDrop'];
  image?: string | null;
};

type DropParams = Parameters<Exclude<DropzoneOptions['onDrop'], undefined>>;

export const ImageUpload: FC<Props> = ({ onDrop, image }) => {
  const [localImage, setLocalImage] = useState<string | null>(null);
  const handleDrop: DropzoneOptions['onDrop'] = useCallback(
    (...args: DropParams) => {
      const [[file]] = args;
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (onDrop) {
        onDrop(...args);
      }
    },
    [onDrop],
  );
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: ['image/png', 'image/webp'],
    onDrop: handleDrop,
  });

  return (
    <Box {...getRootProps({ bg: 'gray.100', p: '1rem' })}>
      <input {...getInputProps()} />
      <Text pointerEvents='none' w='fit-content' mx='auto'>
        Drag and drop a file
      </Text>
      {image || localImage ? (
        <Box h='160px'>
          <Image
            src={image ? (image as string) : (localImage as string)}
            alt='Image to be uploaded'
            layout='fill'
            className='w-full h-full'
          />
        </Box>
      ) : null}
    </Box>
  );
};
