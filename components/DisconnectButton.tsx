import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, { ComponentProps, useCallback, useContext, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View  } from 'react-native';

import { useAuthorization } from './providers/AuthorizationProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../components/themes/ThemeContext';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastError, toastSuccess } from '../utils/toast/toastHelper';

type Props = Readonly<ComponentProps<typeof Button>>;

export default function DisconnectButton(props: Props) {
  const { theme } = useContext(ThemeContext)!;
  const { deauthorizeSession } = useAuthorization();
  const [loading, setLoading] = useState(false);
  const { selectedAccount } = useAuthorization();
  
  const handleDisconnectPress = useCallback(async () => {
    try {

      setLoading(true);

      await transact(async wallet => {
        await deauthorizeSession(wallet)
        setLoading(false);
      });

      toastSuccess("Wallet disconnected", "You have successfully disconnected your wallet");
    } catch (err: any) {

      toastError("Failed to disconnect wallet", err);
      setLoading(false);
    }
  }, [deauthorizeSession]);

  const handleAddressPress = () => {
    if(selectedAccount?.address){

      Clipboard.setString(selectedAccount.publicKey.toBase58());
    }
  }

  return (

    
      <View style={styles.container}>

        <TouchableOpacity style={[styles.addressContainer, { borderColor: theme.buttonBackground }]}
        onPress={handleAddressPress}>
          <Text style={[styles.text, { color: theme.text }]}>
          {
            selectedAccount?.publicKey ?
              selectedAccount.publicKey.toBase58().substring(0, 5) + "..." + selectedAccount.publicKey.toBase58().substr(selectedAccount.address.length - 5)
            :
              "No account"
          }
          </Text>

        </TouchableOpacity>


        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackground }]} 
        onPress={handleDisconnectPress}>

          {loading ? (

            <ActivityIndicator size={24} color={theme.text} />
          ) : (

            <Ionicons name="log-out-outline" size={24} color={theme.text} />

          )}

        </TouchableOpacity>

      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addressContainer: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingRight: 50,
    marginRight: -40,
    justifyContent: 'center',
    alignItems: 'center',                              
  },
  text: {
    fontSize: 16,
  },
});