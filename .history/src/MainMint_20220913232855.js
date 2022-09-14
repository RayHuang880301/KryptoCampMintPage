import React from 'react'
import { Flex, Box, Text, Button, Input, useToast, Spacer } from '@chakra-ui/react'
import { useState } from 'react'
import { ethers } from 'ethers'
import kryptoCampNFTAbi from './KryptoCampNft.json'
import { useEffect } from 'react'
import { useAccount, useContract, useSigner, chain, useContractWrite, useSwitchNetwork, chainId } from 'wagmi'
import { connector } from './utils'

const KryptoCampNFTAddress = "0x5A5E65f915b8bCC6d856FEF6ed81f895062882d1";
const validChainId = chain.goerli.id;
const mintPrice = '0.01';

const MainMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1)
  const [totalSupply, setTotalSupply] = useState(0)
  const [connectedChainId, setConnectedChainId] = useState()
  // const isConnected = Boolean(accounts[0])
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner();
	const { switchNetwork } = useSwitchNetwork();
  const toast = useToast()
  
  // const getChainId = async () => {
  //   const chainId = await connector.getChainId()
  //   return chainId
  // }

  useEffect(() => {
    console.log(chainId)
    connector.getChainId().then(chainId => {
      setConnectedChainId(chainId)
      if (chainId !== validChainId) {
        switchNetwork(validChainId)
        setConnectedChainId(chainId)
      }
    })
  }, [switchNetwork])  

  const contract = useContract({
	  addressOrName: KryptoCampNFTAddress,
	  contractInterface: kryptoCampNFTAbi,
	  signerOrProvider: signer,
	});

  const { data, isError, isLoading, writeAsync } = useContractWrite(
		{
      mode: 'recklesslyUnprepared',
			addressOrName: KryptoCampNFTAddress,
			contractInterface: kryptoCampNFTAbi,
			functionName: 'mint',
			args: [mintAmount],
			overrides: {
				value: ethers.utils.parseEther(mintPrice).mul(mintAmount),
			},
		}
	);
  
  // TODO: 呼叫合約 totalSupply 方法，並寫入到變數 totalSupply
  useEffect(() => {
	  (async () => {
	    if(address && signer && connectedChainId === validChainId) {
	      const t = await contract.totalSupply();
	      setTotalSupply(t.toString());
        console.log('totalSupply', t.toString());
	    }
	  })();
	}, [address, connectedChainId, contract, signer]);

  // TODO: 呼叫 Contract mint fn
  const handleMint = async () => {
    if (address && signer && connectedChainId === validChainId) {
      try {
        // TODO: 4) 呼叫合約 mint 方法
        writeAsync();
      } catch ({ error }) {
        showToast(error.message)
        console.error('[Error]', error)
      }
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return

    setMintAmount(mintAmount - 1)
  }

  const handleIncrement = () => {
    if (mintAmount >= 3) return
    setMintAmount(mintAmount + 1)
  }

  // 顯示錯誤訊息
  const showToast = (error) => {
    toast({
      title: `發生錯誤：${error}`,
      status: 'error',
      position: 'top',
      isClosable: true,
    })
  }

  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
      <Box width="520px">
        <div className="mint-container">
          <Text fontSize="48px" textShadow="0 5px #000">KryptoCamp</Text>
          <Text
            fontSize="30px"
            letterSpacing="0.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #000"
            lineHeight={"26px"}
          >
            It's 2043.
            Can the KryptoCamp save humans from destructive rampant NFT speculation? Mint KryptoCamp to find out!
          </Text>
          <Spacer />


        </div>

        {isConnected ? (
          <div>
            <Flex align="center" justify="center">
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0f0f0f"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleDecrement}
              >
                -
              </Button>
              <Input
                readOnly
                fontFamily="inherit"
                width="100px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value={mintAmount}
              />
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0f0f0f"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleIncrement}
              >
                +
              </Button>
            </Flex>
            <Button
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0f0f0f"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
              onClick={handleMint}
            >
              Mint Now
            </Button>

            {/* 目前已賣出 */}
            <Text
              fontSize="30px"
              letterSpacing="0.5%"
              fontFamily="VT323"
              textShadow="0 2px 2px #000"
              lineHeight={"26px"}
              marginTop="20px"
            >
              NFT TotalSupply {totalSupply}
            </Text>
          </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000"
            color="#D6517D"
          >
            You must be connected to Mint
          </Text>
        )}
      </Box>
    </Flex>
  )
}

export default MainMint