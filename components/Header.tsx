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
import { LinearGradient } from 'react-native-linear-gradient';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

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

          <Text style={[styles.title, { color: theme.text }]}>Beta.Button.sol</Text>
        </View>

        {selectedAccount ? (
          <>
            <DisconnectButton title="Disconnect wallet" />
          </>
        ) : (
          <ConnectButton title="Connect" icon="wallet-outline" />
        )}
      </View>
      <LinearGradient
                colors={['#8A3EE6', '#12D485']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerBorder}
            />
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
    width: '100%',
    flexDirection: 'row',
    padding: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 3,
  },
  headerBorder: {
    width: '100%',
    paddingBottom: 3,
},
  title: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    textAlign: 'left',
    marginLeft: 10,
    fontFamily: 'neuropolitical',
  },
  image: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },

});
