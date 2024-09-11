import React, { useContext } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from './Colors';
import ConnectButton from '../components/ConnectButton';
import {
  useAuthorization,
  Account,
} from '../components/providers/AuthorizationProvider';
import DisconnectButton from './DisconnectButton';
import { ThemeContext } from '../components/themes/ThemeContext';

export function Header() {

  const { theme } = useContext(ThemeContext)!;
  const { selectedAccount } = useAuthorization();

  return (
    <>
      <View style={
        [styles.header,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.borderColor,
        }
        ]}>
        <View style={styles.appName}>
          <Image
            source={require('../assets/solanaLogoMark.png')}
            style={styles.image}
          />

          <Text style={[styles.title, { color: theme.text }]}>Button.sol</Text>
        </View>

        {selectedAccount ? (
          <>
            <DisconnectButton title="Disconnect wallet" />
          </>
        ) : (
          <ConnectButton title="Connect" icon="wallet-outline" />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  appName: {
    flexDirection: 'row', // Alignement horizontal
    alignItems: 'center', // Centrer verticalement
    padding: 10,
  },

  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'left',
    marginLeft: 10,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

});
