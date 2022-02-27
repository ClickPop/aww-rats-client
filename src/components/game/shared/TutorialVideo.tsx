import React from 'react';
import {
    AspectRatio,
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
                background='transparent'
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
                size='4xl'
            >
                <ModalOverlay backdropFilter='blur(4px)' />
                <ModalContent
                    color='gray.900'
                    fontWeight='semibold'
                    rounded='2xl'
                    overflow='hidden'
                >
                    <ModalCloseButton zIndex={5} color='white' />
                    <ModalBody p={0}>
                    <AspectRatio ratio={16 / 9}>
                        <iframe
                            title='How to play the rat race'
                            src='https://www.youtube.com/embed/ucXr1qRidvk'
                            allowFullScreen
                        />
                    </AspectRatio>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}