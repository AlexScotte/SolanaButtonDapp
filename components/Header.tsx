import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from './Colors';
import ConnectButton from '../components/ConnectButton';
import {
  useAuthorization,
  Account,
} from '../components/providers/AuthorizationProvider';
import DisconnectButton from './DisconnectButton';

export function Header() {
  const isDarkMode = useColorScheme() === 'dark';
  const { selectedAccount } = useAuthorization();

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Solana</Text>
        {selectedAccount ? (
          <>
            <Text>{selectedAccount.address.substring(0, 5) + "..." + selectedAccount.address.substr(selectedAccount.address.length - 5)}</Text>

            <DisconnectButton title="Disconnect wallet" />
          </>
        ) : (
          <ConnectButton title="Connect wallet" />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'red',
  },

  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'left',
  },

});
