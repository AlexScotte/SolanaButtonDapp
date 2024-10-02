import {
  ConnectionProvider,
  RPC_ENDPOINT,
} from './components/providers/ConnectionProvider';
import { clusterApiUrl } from '@solana/web3.js';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AuthorizationProvider } from './components/providers/AuthorizationProvider';
import { Header } from './components/Header';
import GameScreen from './screens/GameScreen';
import GameListScreen from './screens/GameListScreen';
import * as anchor from "@coral-xyz/anchor";
import { useAuthorization } from './components/providers/AuthorizationProvider';
import { Connection } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { ThemeProvider } from './components/themes/ThemeContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toast/toastConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <ConnectionProvider
      config={{ commitment: 'processed' }}
      endpoint={clusterApiUrl(RPC_ENDPOINT)}>
      <ThemeProvider>
        <AuthorizationProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="GameList">
              <Stack.Screen
                name="GameList" 
                component={GameListScreen} 
                options={{ headerShown: false }} />
              <Stack.Screen 
                  name="Game" 
                  component={GameScreen} 
                  options={{ headerShown: false }} />
              {/* <SafeAreaView style={styles.shell}> */}
                {/* <Header /> */}
                {/* <HomeScreen /> */}
                {/* <Toast config={toastConfig} /> */}
              {/* </SafeAreaView> */}
            </Stack.Navigator>
            <Toast config={toastConfig} />
          </NavigationContainer>
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
