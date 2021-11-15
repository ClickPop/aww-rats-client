import React from 'react';

const Study = () => {
  return (
    <div>
      <h1 className='text-2xl mb-4 font-semibold'>
        Design Resources
      </h1>
      <a
        className='block border border-white hover:border-yellow-300 hover:text-yellow-300 hover:bg-yellow-300 hover:bg-opacity-5 duration-200 rounded-sm p-4 mb-4'
        target='_blank'
        rel='noreferrer'
        href='https://drive.google.com/drive/folders/1BfPOoqmoeTjFKzVfgB42umHmLtka-DwP?usp=sharing'
      >
        Procreate Source Files - Rats
      </a>
      <a
        className='block border border-white hover:border-yellow-300 hover:text-yellow-300 hover:bg-yellow-300 hover:bg-opacity-5 duration-200 rounded-sm p-4 mb-4'
        target='_blank'
        rel='noreferrer'
        href='https://drive.google.com/drive/folders/1WN_M73863lm5lHR79KVecZjykKDxa7TU?usp=sharing'
      >
        Procreate Source Files - Other
      </a>
      <a
        className='block border border-white hover:border-yellow-300 hover:text-yellow-300 hover:bg-yellow-300 hover:bg-opacity-5 duration-200 rounded-sm p-4 mb-4'
        target='_blank'
        rel='noreferrer'
        href='https://drive.google.com/drive/folders/1zOCTYHEgnaIwgTwsy1n9Onb9X_8Q7Fr9?usp=sharing'
      >
        Procreate Brushes
      </a>
      <p>
        More and more coming soon...
      </p>
    </div>
  );
};

export default Study;
