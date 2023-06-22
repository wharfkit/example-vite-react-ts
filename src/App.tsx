import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import wharfLogo from './assets/wharf.svg'
import './App.css'
import SessionKit, { BrowserLocalStorage, Session } from '@wharfkit/session'
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor'
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet'
import WebRenderer from '@wharfkit/web-renderer'
import React from 'react'

const sessionKit = new SessionKit({
  appName: 'demo',
  chains: [
      {
          id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
          url: 'https://eos.greymass.com',
      },
      {
          id: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
          url: 'https://telos.greymass.com',
      },
      {
          id: '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02',
          url: 'https://api.uxnetwork.io',
      },
      {
          id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
          url: 'https://wax.greymass.com',
      },
  ],
  ui: new WebRenderer(),
  walletPlugins: [
      new WalletPluginAnchor(),
      new WalletPluginCloudWallet(),
  ],
})

function App() {
  const [session, setSession]: [Session | undefined, Dispatch<SetStateAction<Session | undefined>>] = useState()
  
  useEffect(() => {
    sessionKit.restore().then((restored) => setSession(restored))
  }, [])
  
  async function login() {
      const response = await sessionKit.login()
      setSession(response.session)
  }

  async function logout() {
      sessionKit.logout(session)
      setSession(undefined)
  }

  async function transact() {
      if (!session) {
          throw new Error('Cannot transact without a session.')
      }
      const action = {
          account: 'eosio.token',
          name: 'transfer',
          authorization: [session.permissionLevel],
          data: {
              from: session.actor,
              to: 'teamgreymass',
              quantity: '0.00000001 WAX',
              memo: 'Yay WharfKit! Thank you <3',
          },
      }
      session.transact({ action }, { broadcast: false }).catch((e) => {
          console.log('error caught in transact', e)
      })
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://wharfkit.com" target="_blank">
          <img src={wharfLogo} className="logo wharf" alt="Wharf logo" />
        </a>
      </div>
      <h1>Vite + React + Wharf</h1>
      <div className="card">
        {!session ? (
          <button className="primary" onClick={login}> Login </button>
        ): (
          <React.Fragment>
            <p>{String(session.actor)}</p>
            <button className="primary" onClick={transact}>
                Test Transaction (No Broadcast)
            </button>
            <button onClick={logout}> Logout </button>
          </React.Fragment>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React, and Wharf logos to learn more
      </p>
    </div>
  )
}

export default App
