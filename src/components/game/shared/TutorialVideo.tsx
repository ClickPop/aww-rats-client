import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    Button,
} from '@chakra-ui/react';
import {
    QuestionIcon,
} from '@chakra-ui/icons';

export const TutorialVideo = () => {
    const { isOpen:modalIsOpen, onClose:modalClose, onOpen:modalOpen } = useDisclosure();
    return (
        <>
            <Button
                onClick={modalOpen}
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
            </Button>
            <Modal
                isCentered
                isOpen={modalIsOpen}
                onClose={modalClose}
                size='xl'
            >
                <ModalOverlay backdropFilter='blur(4px)' />
                <ModalContent
                    color='gray.900'
                    fontWeight='semibold'
                    rounded='2xl'
                    overflow='hidden'>
                    <ModalCloseButton />
                    <ModalBody pb={4}>
                        Testing
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}