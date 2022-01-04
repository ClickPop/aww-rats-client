import React from 'react';
import { Button } from '~/components/shared/Button';

export const Styleguide = () => {
    return (
        <div className='mx-auto max-w-xl py-20 px-4'>
            <div className="mb-4">
                <h1 className="text-xl text-white mb-2">Buttons</h1>
                <div className="flex">
                    <Button mr="2">Primary</Button>
                    <Button mr="2" colorScheme="whiteAlpha" variant="outline">Secondary</Button>
                    <Button mr="2" colorScheme="red">Destructive</Button>
                </div>
            </div>
        </div>
    );
};