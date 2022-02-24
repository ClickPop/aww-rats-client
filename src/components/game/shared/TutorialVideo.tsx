import React from 'react';
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
} from '@chakra-ui/react';
import {
    QuestionIcon,
} from '@chakra-ui/icons';

export const TutorialVideo = () => {
    return (
        <>
            <Box
                bottom={5}
                color='purple.200'
                position='absolute'
                right={5}
                transitionDuration='0.3s'
                zIndex={100}
                _hover={{
                    color: 'purple.50',
                }}
            >
                <QuestionIcon
                    h={10}
                    w={10}
                />
            </Box>
            <Modal
                isCentered
                isOpen={true}
                size='xl'
            >
                <ModalOverlay backdropFilter='blur(4px)' />
                <ModalContent
                    color='gray.900'
                    fontWeight='semibold'
                    rounded='2xl'
                    overflow='hidden'>
                    <ModalCloseButton zIndex={10} />
                    <ModalBody pb={4}>
                        Testing
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}