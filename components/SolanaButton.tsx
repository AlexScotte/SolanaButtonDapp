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
import { clickButton } from '../program/programMethods';
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { toastError, toastInfo, toastSuccess } from '../utils/toast/toastHelper';
import { getAnchorConfig } from '../program/config';

interface SolanaButtonProps {
  isGameEnded: boolean;
  isCurrentUserWinner: boolean;
}

export const SolanaButton: React.FC<SolanaButtonProps> = ({ isGameEnded, isCurrentUserWinner }) => {

  const solanaLogo = require('../assets/solanaLogoMarkBlack.png');
  const mobileWallet = useMobileWallet()!;
  const { connection } = useConnection();
  const [animating, setAnimating] = useState(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;
  const { program, provider } = getAnchorConfig();

  const handlePress = async () => {

    try {

      if (!mobileWallet) {
        toastError("Wallet not connected", "Please connect your wallet to continue");
        return;
      }

      try {

        startAnimation();
        const tx = await clickButton(connection, mobileWallet, program);

        const globalStateAcc = await fetchGlobalState(program);
        await fetchGameState(program, globalStateAcc.activeGameId);

        toastSuccess("Transaction success !", `Transaction signature: ${tx}`);
        stopAnimation();
      }
      catch (err) {

        toastError("Transaction Error", `Error while clicking the button (${err})`);
        stopAnimation();
      }




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
      console.log("error", err);
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
    <TouchableOpacity onPress={handlePress} style={styles.buttonContainer} disabled={isGameEnded && !isCurrentUserWinner}>
      <Animated.View style={[styles.gradientWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={isGameEnded ? isCurrentUserWinner ?  ['#FFD700', '#FFA500'] : ['#A9A9A9', '#D3D3D3'] : ['#9945FF', '#14F195']}
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
    width: 200,
    height: 200,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 200,
    height: 200,
  },
  gradientWrapper: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 200,
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
    width: 120,
    height: 120,
    zIndex: 1,
  },
  text: {
    fontFamily: 'neuropolitical',
    fontSize: 40,
    color: '#2E2E2E',
  },
});