import { useState } from 'react'
import './App.css';
import MainMint from './MainMint';
import Navbar from './Navbar';
import { ChakraProvider } from '@chakra-ui/react'
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
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

        <div className="moving-background"></div>
      </div>
    </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;