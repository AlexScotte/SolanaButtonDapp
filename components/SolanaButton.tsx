import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, Easing, Image } from 'react-native';
import * as anchor from "@coral-xyz/anchor";
import { useConnection } from './providers/ConnectionProvider';
import { useMobileWallet } from '../hooks/useMobileWallet';
import { getSolanaButtonProgram } from '../program/program.idl';

import { ProgramType } from '../program/program.idl';
import { Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { fetchGameState, fetchGameVaultState, fetchGlobalState, getGameStatePDA, getGameVaultStatePDA, getGlobalStatePDA } from '../program/programAccounts';
import { claimReward, clickButton } from '../program/programMethods';
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { toastError, toastInfo, toastSuccess } from '../utils/toast/toastHelper';
import { getAnchorConfig } from '../program/config';
import { moderateScale } from 'react-native-size-matters';

interface SolanaButtonProps {
  program: anchor.Program<ProgramType>;
  gameId: anchor.BN;
  isGameEnded: boolean;
  isCurrentUserWinner: boolean;
  isVaultClaimed: boolean;
}

export const SolanaButton: React.FC<SolanaButtonProps> = ({program, gameId, isGameEnded, isCurrentUserWinner, isVaultClaimed }) => {

  const solanaLogo = require('../assets/solanaLogoMarkBlack.png');
  const mobileWallet = useMobileWallet()!;
  const { connection } = useConnection();
  const [animating, setAnimating] = useState(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  const handlePress = async () => {


      if (!mobileWallet) {
        toastError("Wallet not connected", "Please connect your wallet to continue");
        return;
      }

      if(isGameEnded && isCurrentUserWinner) {
      
          if(isCurrentUserWinner){
            await handleClaimReward();
          }
          else{
            return;
          }
      }
      else{
        await handleClickButton();
      }
  };

  const handleClickButton = async () =>{

    try {

      startAnimation();
      const tx = await clickButton(connection, mobileWallet, program, gameId);

      await fetchGameState(program, gameId);
      await fetchGameVaultState(program, gameId);

      toastSuccess("Transaction success !", `Transaction signature: ${tx}`);
      stopAnimation();


      // Sign and send a simple message using the mobile wallet.

      //     const message = 'Hello Solana Mobile!';
      //     const messageBuffer = new Uint8Array(
      //       message.split('').map(c => c.charCodeAt(0)),
      //     );

      // // Sign the payload with the provided address from authorization.
      // const tx = await mobileWallet.signMessage(
      //   messageBuffer
      // );
    }
    catch (err) {

      toastError("Transaction Error", `Error while clicking the button (${err})`);
      stopAnimation();
    }
  }

  const handleClaimReward = async () => {

    try {

      startAnimation();
      const tx = await claimReward(connection, mobileWallet, program, gameId);

      await fetchGameState(program, gameId);
      await fetchGameVaultState(program, gameId);

      toastSuccess("Transaction success !", `Transaction signature: ${tx}`);
      stopAnimation();
    }
    catch (err) {

      toastError("Transaction Error", `Error while claiming the reward (${err})`);
      stopAnimation();
    }
  };
  
  const startAnimation = () => {
    setAnimating(true);
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animationRef.current.start();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      setAnimating(false);
    }
  };

  return (
    // <LinearGradient
    // colors={['rgba(153, 69, 255, 0.6)', 'rgba(20, 241, 149, 0.3)', 'rgba(20, 241, 149, 0)']}

    //   style={styles.gradientBackground}
    //   // style={styles.gradient}
    //   start={{ x: 0, y: 1 }}
    //   end={{ x: 1, y: 0 }}
    // >
    <TouchableOpacity onPress={handlePress} style={styles.buttonContainer} disabled={isGameEnded && !isCurrentUserWinner && isVaultClaimed}>
      <Animated.View style={[styles.gradientWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={isGameEnded ? isCurrentUserWinner ?  isVaultClaimed ? ['#FFD700', '#FFA500'] : ['#A9A9A9', '#D3D3D3'] : ['#A9A9A9', '#D3D3D3'] : ['#9945FF', '#14F195']}
          style={styles.gradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View style={[styles.ring, { opacity: opacityAnim }]} />
        </LinearGradient>
      </Animated.View>

      {/* <Ionicons name="rocket-outline" size={40} color="#FFFFFF" style={styles.icon} /> */}
      {
        isGameEnded && isCurrentUserWinner ?

        <Text style={styles.text}>{"Claim "}</Text>
        :
        <Image source={solanaLogo} style={styles.logo} />
      }
    </TouchableOpacity>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: "100%",
    height: "100%",
  },
  gradientWrapper: {
    position: 'absolute',
    height: moderateScale(180),
    width: moderateScale(180),
    borderRadius: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
    borderWidth: 5,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  icon: {
    zIndex: 1,
  },
  logo: {
    width: moderateScale(90),
    height: moderateScale(90),
    zIndex: 1,
  },
  text: {
    fontFamily: 'neuropolitical',
    fontSize: 40,
    color: '#2E2E2E',
  },
});