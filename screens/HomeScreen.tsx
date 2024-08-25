import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { SolanaButton } from '../components/SolanaButton';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.content}>
                <SolanaButton />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});