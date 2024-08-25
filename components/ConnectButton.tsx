import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, { ComponentProps, useState, useCallback } from 'react';
import { Button, StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

import { useAuthorization } from './providers/AuthorizationProvider';
import { alertAndLog } from '../util/alertAndLog';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

type Props = Readonly<ComponentProps<typeof Button>>;

export default function ConnectButton(props: Props) {
  const { authorizeSession } = useAuthorization();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const handleConnectPress = useCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await transact(async wallet => {
        await authorizeSession(wallet);
      });
    } catch (err: any) {
      alertAndLog(
        'Error during connect',
        err instanceof Error ? err.message : err,
      );
    } finally {
      setAuthorizationInProgress(false);
    }
  }, [authorizationInProgress, authorizeSession]);


  // const handleConnectPress = useCallback(async () => {
  //   try {
  //     if (authorizationInProgress) {
  //       return;
  //     }
  //     setAuthorizationInProgress(true);
  //     await connect();
  //   } catch (err: any) {
  //     alertAndLog(
  //       "Error during connect",
  //       err instanceof Error ? err.message : err
  //     );
  //   } finally {
  //     setAuthorizationInProgress(false);
  //   }
  // }, [authorizationInProgress, authorizeSession]);

  return (
    authorizationInProgress ? (
      <ActivityIndicator
      />
    ) : (
      <TouchableOpacity
        disabled={authorizationInProgress}
        onPress={handleConnectPress}
      // style={[
      //   styles.button,
      //   { width: size, height: size, borderRadius: size / 2, backgroundColor },
      // ]}
      // onPress={onPress}
      >
        <View style={styles.stack}>
          <Text>Connect</Text>
          <FontAwesomeIcon icon={faWallet} size={20} />
        </View>
      </TouchableOpacity>
    )
  );


}

const styles = StyleSheet.create({

  stack: {
    flexDirection: 'row',
    // padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },


  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // pour Android
    shadowColor: '#000', // pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
