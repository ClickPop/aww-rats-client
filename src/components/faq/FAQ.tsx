import React from 'react'

export const FAQ = () => {
  return (
    <div className="bg-white text-slate py-4">
      <div className="max-w-xl px-4 mx-auto">
        <h1 className="text-4xl font-extrabold mb-12">FAQs About NFTs and Aww, Rats!</h1>
        <h2 className="text-3xl font-bold mb-4">What the heck is an NFT?</h2>
        <p className="mb-2">A non-fungible token (NFT) is a unique digital marker stored on the blockchain. NFTs can be representations of digital artwork, physical things, and even membership cards that offer someone access to content.</p>
        <p className="mb-10">In our case, the NFT proves your ownership of your unique image which can compete in our regular Rate Race. The neatest part? You can trade with others and grow your collection over time.</p>
        <h2 className="text-3xl font-bold mb-4">What does programmatically generated mean?</h2>
        <p className="mb-10">It means that the images are assembled by an algorithm from a set of parts. Think of it as a Potato Head, with a basic shape (potato) and holes for different pieces to go into. We drew a ton of different parts (hats, eyes, accessories, pets, backgrounds... 12 categories in all) and built a geneRATor to pick pieces from each category and build images.</p>
        <h2 className="text-3xl font-bold mb-4">What do I get?</h2>
        <p className="mb-2">When you adopt a rat, you get:</p>
        <ul className="list-disc pl-8 mb-10">
          <li className="list-item">Your very own Rat with randomly generated Rattributes that give it personality, charm, and mystique.</li>
          <li className="list-item">A high quality .png image of the artwork to showcase in your NFT collection</li>
        </ul>
        <h2 className="text-3xl font-bold mb-4">What can I do with my Rat?</h2>
        <p className="mb-2">When you adopt a rat, you get:</p>
        <ul className="list-disc pl-8 mb-10">
          <li className="list-item">Use your Rat as your Twitter avatar.</li>
          <li className="list-item">Trade with other Rat owners to acquire the rarest Rattributes.</li>
          <li className="list-item">Compete in the Rat Race...</li>
        </ul>
      </div>
    </div>
  )
}
