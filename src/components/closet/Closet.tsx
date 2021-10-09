import React, { useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { ethers, BigNumber } from 'ethers';
import SelectSearch, {fuzzySearch} from 'react-select-search/dist/cjs';
import { SelectSearchProps, SelectSearchOption, OptionSnapshot } from 'react-select-search';

import {
  Metadata,
  Rat,
} from '~/types';
import {
  CHAIN_ID,
  CONTRACT_ADDRESS,
  LAYER_ORDER,
  LAYER_HAS_BASE,
  RAT_PIECES_PREFIX,
  RAT_CLOSET_PIXEL,
  RAT_CLOSET_PLACEHOLDER,
  CLOSET_PIECES
} from '~/config/env';
import RatABI from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';

interface SimplifiedProperties {
  [propName: string]: string;
}
interface SimplifiedMetadata {
  name: string
  value: string
  image: string
  properties: SimplifiedProperties
}
interface SelectSearchImageOption extends SelectSearchOption {
  image: string
}

const emptySimplifiedMetadata = (): SimplifiedMetadata => {
  return {
      name: "",
      value: "",
      image: "",
      properties: {}
  }
}

export const Closet = () => {
  const { provider, signer, network, connected } = useEthers();
  const [contract, setContract] = useState<Rat | null>(null);
  const [signerTokens, setSignerTokens] = useState<Array<BigNumber> | null>(null);
  const [rats, setRats] = useState<Array<SimplifiedMetadata | null> | null>(null);
  const [currentRat, setCurrentRat] = useState<SimplifiedMetadata | null>(null);

  useEffect(() => {
    (async () => {
      if (CONTRACT_ADDRESS && connected && network?.chainId === CHAIN_ID) {
        try {
          const signerAddress = await signer?.getAddress();
          const c = new ethers.Contract(
            CONTRACT_ADDRESS,
            RatABI.abi,
            signer,
          ) as Rat;
          setContract(c);

          if (signerAddress) {
            let tokens = await c.getTokensByOwner(signerAddress);
            setSignerTokens(tokens);
          }
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [connected, signer, provider, network]);

  useEffect(() => {
    (async () => {
      if (Array.isArray(signerTokens)) {
        await getRatsMeta(signerTokens);
      }
    })();
  }, [signerTokens]);

  useEffect(() => {
    if (currentRat) stackRatPieces(currentRat);
  }, [currentRat]);

  function init() {
    // Populate closet items
    getClosetItems();
  
    // Set variable to track whether closet items are selected
    let pieceSelected = 0;
  
    // Listen for clicks on clothing items
    document.querySelectorAll(".closet--piece").forEach((closetPiece) => {
      closetPiece.addEventListener("click", (event) => {
        console.log(pieceSelected);
        // When a piece is selected set that piece
        pieceType = event.target.dataset.pieceType;
        pieceName = event.target.dataset.pieceName;
        pieceUrl = `${RAT_PIECES_PREFIX}${pieceType}-${pieceName}.png`;
        console.log(pieceType, pieceName, pieceUrl);
        event.target.parentElement.style.backgroundColor = "#77779966";
        ratPiece = ratContainer.querySelector(`.rat--piece.${pieceType}`);
        console.log(ratPiece);
        ratPiece.src = pieceUrl;
        getSiblings(event.target.parentElement).forEach(
          (li) => (li.style.backgroundColor = "")
        );
      });
    });
  }

  const renderOption = (props: SelectSearchProps, option: SelectSearchImageOption, snapshot?: OptionSnapshot, className?: string) => {
    console.log(props);
    return (
      //@ts-ignore
        <button key={option.name} {...props} className={className + " rat-select-button"} type="button">
            <figure className="w-10 h-10 float-left mr-4"><img src={`${option.image}`} alt={`Rat: ${option.name}`} /></figure>           
            <span className="title text-lg leading-10">{option.name}</span>
        </button>
    );
  }

  const getSiblings = (e) => {
    // for collecting siblings
    let siblings = [];
    // if no parent, return no sibling
    if (!e.parentNode) {
      return siblings;
    }
    // first child of the parent node
    let sibling = e.parentNode.firstChild;
  
    // collecting siblings
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== e) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblings;
  }

  const stackRatPieces = (rat: SimplifiedMetadata) => {
    // Reset rat piece image layers
    document.querySelectorAll(".rat--piece").forEach((e) => e.remove());
    const ratContainer = document.querySelector(".rat");
  
    // Check if the rat name is in the list of rats
    if (
      rat &&
      typeof rat === "object" &&
      rat.hasOwnProperty("properties") &&
      Array.isArray(LAYER_ORDER) &&
      LAYER_ORDER.length > 0
    ) {
      // Build out the layers of images based on the contents of rats.js
      LAYER_ORDER.forEach((pieceType, index) => {
        if (rat.properties && pieceType in rat.properties) {
          let image = document.createElement("img");
          image.setAttribute("class", `rat--piece ${pieceType}`);
          image.setAttribute("data-piece-type", pieceType);
          image.setAttribute("data-piece-name", rat.properties[pieceType]);
          image.setAttribute("style", `z-index:${index + 1};`);
          image.src =
            rat.properties[pieceType] === "none"
              ? RAT_CLOSET_PIXEL
              : `${RAT_PIECES_PREFIX}${pieceType}-${rat.properties[pieceType]}.png`;
          console.log(image.src);
          ratContainer?.appendChild(image);
        }
      });
    }
  }

  const getClosetItems = () => {
    for (let pieceType in CLOSET_PIECES) {
      generateClosetSection(pieceType);
    }
  }

  function generateClosetSection(pieceType) {
    const closetContainer = document.querySelector(".closet");

    if (closetContainer) {
      let heading = document.createElement("h3");
      heading.className = "text-gray-200 font-medium capitalize";
      let headingText = document.createTextNode(pieceType);
      heading.appendChild(headingText);
      let piecesList = document.createElement("ul");
      piecesList.setAttribute("class", "closet--pieces grid grid-cols-2 gap-4");
      piecesList.setAttribute("data-piece-type", pieceType);
      CLOSET_PIECES[pieceType].forEach((piece, index) => {
        let pieceItem = document.createElement("li");
        let image = document.createElement("img");
        image.setAttribute("class", `closet--piece ${pieceType}`);
        image.setAttribute("data-piece-type", pieceType);
        image.setAttribute("data-piece-name", piece);
        image.src = `${RAT_PIECES_PREFIX}${pieceType}-${piece}.png`;
        pieceItem.appendChild(image);
        piecesList.appendChild(pieceItem);
        image = null;
        pieceItem = null;
      });
      closetContainer.appendChild(heading);
      closetContainer.appendChild(piecesList);
      heading = null;
      piecesList = null;
    }
  }

  const getRatsMeta = async (tokens: BigNumber[]) => {
    let tempMetas = [];
    for (let i = 0; i < tokens.length; i++) {
      let uri = await contract?.tokenURI(tokens[i]);
      let hash = uri?.split('//')[1];
      if (hash) {
        let meta: Metadata = await fetch(
          `https://gateway.pinata.cloud/ipfs/${hash}`,
        ).then((res) => res.json());

        if (meta) {
          tempMetas.push(meta);
        }
      }
    }
    setRats(simplifyRatsMeta(tempMetas));
  }

  const simplifyRatsMeta = (ipfsMetas: Array<Metadata>): Array<SimplifiedMetadata | null> => {
    const simplifiedMetas: Array<SimplifiedMetadata | null> = ipfsMetas.map((rat) => {
      if ("attributes" in rat && "image" in rat && "name" in rat) { 
        let simplifiedMeta = emptySimplifiedMetadata();
        simplifiedMeta.name = rat.name;
        simplifiedMeta.value = rat.name;
        simplifiedMeta.image = rat.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

        // Loop through layer order config
        LAYER_ORDER.forEach(layer => {
          let attribute = rat.attributes.find((attr) => attr.trait_type && attr.trait_type.toLowerCase() === layer.toLowerCase());
          Object.defineProperty(simplifiedMeta.properties, layer, {
            value: (
              attribute && typeof attribute.value === "string" 
                ? attribute.value.replace(/\s|\%20/ig, "-").toLowerCase() 
                : (LAYER_HAS_BASE.includes(layer)) ? "base" : "none"
            )
          });
        });
        return simplifiedMeta;
      }
      return null;
    }).filter(meta => meta !== null);

    return simplifiedMetas;
  }

  if (rats) {
    init();
    return(
      <>
        <div className="flex mt-4 mb-6 relative z-40">
          <SelectSearch
            className="select-search mx-auto"
            options={rats}
            search
            renderOption={renderOption}
            filterOptions={fuzzySearch}
            emptyMessage={() => <div style={{ textAlign: 'center', fontStyle: 'italic' }}>No rats found in your wallet...</div>}
            placeholder="Select your rat"
            onChange={(value: any, rat: SimplifiedMetadata | null) => {setCurrentRat(rat)}}
          />
        </div>

        <div className="container mx-auto flex justify-center p-4">
          <div>
            <div
              className="
                border-solid border-8 border-gray-400
                mirror
                rounded-xl
                overflow-hidden
                w-80
                h-80
              "
            >
              <figure className="rat relative h-full">
                <img className="rat--piece background" src={RAT_CLOSET_PLACEHOLDER} />
              </figure>
            </div>

            <div className="mt-2 text-center">
              <input type="checkbox" id="background" />
              <label htmlFor="background" className="text-white">Remove Background</label>
            </div>
          </div>

          <div className="px-4 w-60">
            <div id="closet" className="closet"></div>
          </div>
        </div>

        <div className="container mx-auto flex justify-center p-4">
          <div className="w-100 mx-auto">
            <button className="download py-2 px-3 text-white rounded-md duration-300 bg-purple-700 hover:bg-purple-800">Download it!</button>
          </div>
        </div>
      </> 
    )
  }
  return (
    <>
      Rats go here
    </>
  );
};

