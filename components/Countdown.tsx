import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Countdown({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) {

    const formatTwoDigits = (num: number) => num.toString().padStart(2, '0');

    return (
        <View style={styles.container}>
            {/* Heures */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.timeText}>{formatTwoDigits(hours)}</Text>
                </View>
                <Text style={styles.labelText}>Hours</Text>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* Minutes */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.timeText}>{formatTwoDigits(minutes)}</Text>
                </View>
                <Text style={styles.labelText}>Minutes</Text>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* Secondes */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.timeText}>{formatTwoDigits(seconds)}</Text>
                </View>
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
        borderRadius: 10,
    },
    timeText: {
        fontSize: 42,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    labelText: {
        fontSize: 14,
        color: '#BBBBBB',
        marginTop: 5,
    },
    colon: {
        fontSize: 32,
        color: '#FFFFFF',
        marginHorizontal: 5,
        marginBottom: 30,
        fontWeight: 'bold',
    },
});