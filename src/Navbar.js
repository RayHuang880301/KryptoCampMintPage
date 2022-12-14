import React, { useEffect, useState } from 'react'
import { Box, Flex, Image, Link, Spacer } from '@chakra-ui/react'
import Facebook from './assets/social-media-icons/facebook_32x32.png'
import Twitter from './assets/social-media-icons/twitter_32x32.png'
import Email from './assets/social-media-icons/email_32x32.png'
import { Button } from '@chakra-ui/react'
import { useAccount, useConnect, useEnsName, useDisconnect } from 'wagmi'
import { connector } from './utils'

const Navbar = ({ accounts, setAccounts }) => {
  // const isConnected = Boolean(accounts[0]);
  const { address, isConnected } = useAccount()
	const { data: ensName } = useEnsName({ address });
  const [profile, setProfile] = useState();
  const { connect, data: connectData } = useConnect({
    connector
  })	
  const { disconnect } = useDisconnect();


  useEffect(() => {
		if(address) {
			let str = address.slice(0,4) + '...' + address.slice(-4);
			setProfile(str);
		}
	}, [address, connectData]);
  
  // TODO: 連接錢包
  async function connectAccount() {
    connect();
  }

  return (
    <Flex
      className="navbar flex-row"
      justify="space-between" align="center"
      direction="row"
    >
      {/* Left Side - Social Media Icons */}

      <Flex justify="space-around" direction="row">
        <Link href="https://www.facebook.com" className="items">
          <Image src={Facebook} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.twitter.com" className="items">
          <Image src={Twitter} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.gamil.com" className="items">
          <Image src={Email} boxSize="42px" margin="0 15px" />
        </Link>
      </Flex>

      {/* Right Side - Section and Connect */}
      <Flex
        justify="space-around"
        align="center"
        className="flex-row"
        // width="40%"
        padding="30px"
      >
        <Box margin="0 15px" className="items">About</Box>
        <Spacer />
        <Box margin="0 15px" className="items">Mint</Box>
        <Spacer />
        <Box margin="0 15px" className="items">Team</Box>
        <Spacer />

        {/* Connect */}
        {isConnected ? (
          <Button 
            backgroundColor="#D6517D"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px" 
            onClick={() => disconnect()}
            colorScheme='yellow'
          >
            {ensName ?? profile}
          </Button>
        ) : (
          <Button
            backgroundColor="#D6517D"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px"
            onClick={connectAccount}
            colorScheme='yellow'
          >
            Connect
          </Button>
        )}
      </Flex>

    </Flex>
  )
}

export default Navbar