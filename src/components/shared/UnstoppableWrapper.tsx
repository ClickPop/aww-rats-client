import React, { useEffect } from 'react';
import { UAuth } from '@uauth/js';

// export default function ConnectViaUNS() {
//   useEffect(function onFirstMount() {
//     function onConnect() {
//       console.log("connecting via uns!");
//       window.login = async () => {
//         try {
//           const authorization = await uauth.loginWithPopup()

//           console.log(authorization)
//         } catch (error) {
//           console.error(error)
//         }
//       }
//     }
//     window.addEventListener("loginUNS", onConnect);
//   }, []); // empty dependencies array means "run this once on first mount"

//   return (
//         <button
//           className='px-4 py-3 rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light font-bold'
//           onClick={onConnect}>
//           Login with Unstoppable
//         </button>
//   );
// };

function onConnect() {
  console.log("connecting via uns!");
  window.login = async () => {
    try {
      const authorization = await uauth.loginWithPopup()

      console.log(authorization)
    } catch (error) {
      console.error(error)
    }
  }
}

export default function ConnectViaUNS() {
  return null;
}
