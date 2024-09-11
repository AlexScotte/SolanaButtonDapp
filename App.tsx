import {
  ConnectionProvider,
  RPC_ENDPOINT,
} from './components/providers/ConnectionProvider';
import { clusterApiUrl } from '@solana/web3.js';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AuthorizationProvider } from './components/providers/AuthorizationProvider';
import { Header } from './components/Header';
import HomeScreen from './screens/HomeScreen';
import * as anchor from "@coral-xyz/anchor";
import { useAuthorization } from './components/providers/AuthorizationProvider';
import { Connection } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import MainScreen from './screens/MainScreen';
import { ThemeProvider } from './components/themes/ThemeContext';

export default function App() {

  return (
    <ConnectionProvider
      config={{ commitment: 'processed' }}
      endpoint={clusterApiUrl(RPC_ENDPOINT)}>
      <ThemeProvider>
        <AuthorizationProvider>
          <SafeAreaView style={styles.shell}>
            <Header />
            <HomeScreen />
          </SafeAreaView>
        </AuthorizationProvider>
      </ThemeProvider>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: '100%',
  },
});
