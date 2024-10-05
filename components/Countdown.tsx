import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function Countdown({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) {

    const formatTwoDigits = (num: number) => num.toString().padStart(2, '0');

    return (
        <View style={styles.container}>
            {/* Heures */}
            <View style={styles.cardContainer}>
                <LinearGradient
                    colors={['#8A3EE6', '#4F91B5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.cardBorder, styles.cardHours]}
                >
                    <View style={[styles.card, styles.cardHours]}>
                        <Text style={styles.timeText}>{formatTwoDigits(hours)}</Text>
                    </View>
                </LinearGradient>
                <Text style={styles.labelText}>Hours</Text>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* Minutes */}
            <View style={styles.cardContainer}>
                <LinearGradient
                    colors={['#4F91B5', '#30B785']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.cardBorder, styles.cardMinutes]}
                >

                    <View style={[styles.card, styles.cardMinutes]}>
                        <Text style={styles.timeText}>{formatTwoDigits(minutes)}</Text>
                    </View>
                </LinearGradient>
                <Text style={styles.labelText}>Minutes</Text>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* Secondes */}
            <View style={styles.cardContainer}>
                <LinearGradient
                    colors={['#30B785', '#12D485']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.cardBorder, styles.cardSeconds]}
                >
                    <View style={[styles.card, styles.cardSeconds]}>
                        <Text style={styles.timeText}>{formatTwoDigits(seconds)}</Text>
                    </View>
                </LinearGradient>
                <Text style={styles.labelText}>Seconds</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red',
        height: 200,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    cardBorder: {
        padding: 2,
    },
    cardHours: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    cardMinutes: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    cardSeconds: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    cardContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    card: {
        width: 100,
        height: 100,
        backgroundColor: '#242424',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 42,
        color: '#FFFFFF',
        fontFamily: 'suissnord',
    },
    labelText: {
        fontSize: 14,
        color: '#BBBBBB',
        marginTop: 5,
        fontFamily: 'neuropolitical',
    },
    colon: {
        fontSize: 32,
        color: '#FFFFFF',
        marginHorizontal: 5,
        marginBottom: 30,
        fontWeight: 'bold',
    },
});