import { useState } from 'react'
import './App.css';
import MainMint from './MainMint';
import Navbar from './Navbar';
import { ChakraProvider } from '@chakra-ui/react'
import { WagmiConfig, createClient, configureChains, defaultChains } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

const {chains, provider} = configureChains(defaultChains, [publicProvider()])
const client = createClient({
  autoConnect: false,
  provider,
  // provider: getDefaultProvider(),
  // connector: [new InjectedConnector({chains})],
})

function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <div className="overlay">
          <div className="App">
            <Navbar accounts={accounts} setAccounts={setAccounts} />
            <MainMint accounts={accounts} setAccounts={setAccounts} />
          </div>

          {/* <div className="moving-background"></div> */}
        </div>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;