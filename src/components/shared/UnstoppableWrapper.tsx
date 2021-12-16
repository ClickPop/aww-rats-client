import { React, useEffect, useState } from 'react';
import { UAuth } from '@uauth/js';

const ConnectUNS = () => {
  const uauth = new UAuth({
    // These can be copied from the bottom of your app's configuration page on unstoppabledomains.com.
    clientID: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,

    // These are the scopes your app is requesting from the ud server.
    scope: 'openid email wallet',

    // This is the url that the auth server will redirect back to after every authorization attempt.
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
  });

  login = async () => {
    try {
      const authorization = await uauth.loginWithPopup()
 
      console.log(authorization)
    } catch (error) {
      console.error(error)
    }
  }
  return (
        <button
          className='px-4 py-3 rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light font-bold'
          onClick={initConnection}>
          Login with Unstoppable
        </button>
  )
};
export default ConnectUNS;
