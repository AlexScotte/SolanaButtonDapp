import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, { ComponentProps, useState, useContext, useCallback } from 'react';
import { Button, StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

import { useAuthorization } from './providers/AuthorizationProvider';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../components/themes/ThemeContext';
import { toastError, toastInfo, toastSuccess } from '../utils/toast/toastHelper';
import { moderateScale } from 'react-native-size-matters';

type Props = Readonly<ComponentProps<typeof Button>> & {
  title: string;
  icon: string;
};

export default function ConnectButton({ title, icon, ...props }: Props) {
  const {theme} = useContext(ThemeContext)!;
  const { authorizeSession } = useAuthorization();
  const [loading, setLoading] = useState(false);


  const handleConnectPress = useCallback(async () => {
    try {
      
      setLoading(true);
      toastInfo('Connecting', 'Please wait...');

      await transact(async wallet => {
        await authorizeSession(wallet);
      });

      setLoading(false);
      toastSuccess('Connected', 'You are now connected to your wallet !');

    } catch (err: any) {
      
      setLoading(false);
      toastError('Connection error', err.message);
    } 
  }, [authorizeSession]);


  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.buttonBackground }]}
      onPress={handleConnectPress}
      disabled={loading}
    >
      {loading ? (
        
        <View style={styles.iconContainer}>
        {/* <Text style={[styles.text, { color: theme.text }]}>Connecting</Text> */}
        <ActivityIndicator size={moderateScale(20)} color={theme.text} />
      </View>
      ) : (
        <View style={styles.iconContainer}>
          {/* <Text style={[styles.text, { color: theme.text }]}>{title}</Text> */}
          <Ionicons name={icon} size={moderateScale(20)} color={theme.text}/>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', 
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginRight: 10, 
  },
});
