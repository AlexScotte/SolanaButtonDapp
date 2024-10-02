import React, { useCallback, useEffect } from 'react';
import * as anchor from "@coral-xyz/anchor";
import { AppState, View, StyleSheet, SafeAreaView, Text, Image, AppStateStatus } from 'react-native';
import { SolanaButton } from '../components/SolanaButton';
import { fetchGlobalState, fetchGameState, fetchGameVaultState, subscribeGlobalState, subscribeGameState, subscribeGameVaultState } from '../program/programAccounts';
import { useConnection } from '../components/providers/ConnectionProvider';
import { useMobileWallet } from '../hooks/useMobileWallet';
import { getSolanaButtonProgram } from '../program/program.idl';
import { Connection } from '@solana/web3.js';
import { getAnchorConfig } from '../program/config';
import { GameStateAccount, GameVaultStateAccount, GlobalStateAccount } from '../program/programTypes';
import { calculateRemainingTime, getHourMinuteSecond, getShortAddress, lamportInSol } from '../utils/helper';
import Countdown from '../components/Countdown';
import { toastSuccess } from '../utils/toast/toastHelper';


export default function HomeScreen() {
    const solanaLogo = require('../assets/solanaLogoMark.png');
    const { program } = getAnchorConfig();
    const connectionContext = useConnection();
    const mobileWallet = useMobileWallet()!;

    const [appState, setAppState] = React.useState<AppStateStatus>(AppState.currentState);
    const [globalState, setGlobalState] = React.useState<GlobalStateAccount>();
    const [gameState, setGameState] = React.useState<GameStateAccount>();
    const [gameVaultState, setGameVaultState] = React.useState<GameVaultStateAccount>();
    const [remainingTime, setRemainingTime] = React.useState(0);
    const [isGameStarted, setIsGameStarted] = React.useState(false);
    const [isUserLeader, setIsUserLeader] = React.useState(false);
    const { hours, minutes, seconds } = getHourMinuteSecond(remainingTime);


    /* Handle app state change */
    const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');

        } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
            console.log('App has gone to the background!');
        }
        setAppState(nextAppState);
    }, [appState]);


    /* (Un)Subscribe to app state change */
    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [handleAppStateChange]);

    /* Fetch Global State */
    useEffect(() => {

        const fetchGlobalData = async () => {

            try {
                const global = await fetchGlobalState(program);
                setGlobalState(global);
                subscribeGlobalState(
                    connectionContext.connection,
                    program,
                    (updatedAccount: GlobalStateAccount) => setGlobalState(updatedAccount)
                );
            } catch (error) {
                console.error("Error fetching global state:", error);
            }
        };

        fetchGlobalData();
    }, []);

    /* Fetch Game State */
    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const game = await fetchGameState(program, 1);
                setGameData(game);

                subscribeGameState(
                    connectionContext.connection,
                    program,
                    1,
                    (updatedAccount: GameStateAccount) => setGameData(updatedAccount)
                );
            } catch (error) {
                console.error("Error fetching game state:", error);
            }
        };

        fetchGameData();
    }, []);

    async function setGameData(gsa: GameStateAccount) {
        const isGameStarted = gsa.lastClicker.toBase58() !== anchor.web3.SystemProgram.programId.toBase58();
        setIsGameStarted(isGameStarted);

        const isUserLeader = gsa.lastClicker.toBase58() === mobileWallet?.publicKey?.toBase58();
        setIsUserLeader(isUserLeader);

        setGameState(gsa)
    }

    /* Fetch Game Vault State */
    useEffect(() => {
        const fetchVaultData = async () => {
            try {
                const vault = await fetchGameVaultState(program, 1);
                setGameVaultState(vault);
                subscribeGameVaultState(
                    connectionContext.connection,
                    program,
                    1,
                    (updatedAccount: GameVaultStateAccount) => setGameVaultState(updatedAccount)
                );
            } catch (error) {
                console.error("Error fetching vault state:", error);
            }
        };
        fetchVaultData();
    }, []);


    /* Manage countdown */
    useEffect(() => {

        if (!gameState)
            return;

        const remainingTime = calculateRemainingTime(gameState);
        setRemainingTime(remainingTime);

        if (!isGameStarted)
            return;

        // Start countdown
        const interval = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1; // Decrease by 1 second
                } else {
                    clearInterval(interval); // Stop the countdown
                    return 0;
                }
            });
        }, 1000); // Update every second

        // Clear interval on unmount
        return () => clearInterval(interval);
    }, [gameState, isGameStarted, appState]);

    return (
        <SafeAreaView style={styles.container}>
            {/* "Click & Win" */}
            <View style={styles.clickWinContainer2}>
                <Text style={styles.clickText}>Click & Win</Text>
            </View>

            {/* Card with emoji and numeric value */}
            {/* <View style={styles.card}> */}
                {/* <View style={styles.row}> */}
                    {/* <Text style={styles.emoji}>💰</Text> */}
                    <View style={styles.cardContent}>
                        <Text style={styles.numericValue}>{lamportInSol(gameVaultState?.balance)}</Text>
                        <Image source={solanaLogo} style={styles.logo} />
                    </View>
                {/* </View> */}
            {/* </View> */}



            {/* Countdown */}
            <Countdown hours={hours} minutes={minutes} seconds={seconds} />

            {/* Solana Button */}
            <View style={styles.buttonContainer}>
                <SolanaButton />
            </View>

            <View>

                <View style={styles.column}>

                    <Text style={styles.text}>

                        {
                            // if there is no clicker yet
                            isGameStarted ?
                                isUserLeader ?
                                    "👑 You are the leader ! 👑"
                                    :
                                    "Current leader:"
                                :
                                "⬆️ Be the first one to click ! ⬆️"
                        }
                    </Text>
                    {
                        isGameStarted ?
                            <Text style={styles.text}>
                                {
                                    gameState?.lastClicker ?
                                        getShortAddress(gameState.lastClicker.toString())
                                        :
                                        "No leader yet"
                                }
                            </Text>
                            :
                            <>
                            </>
                    }

                </View>
            </View>

            {/* Card with current winner and number of clicks */}
            <View style={{ flex: .5, justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Game ID:</Text>
                        <Text style={styles.value}>{gameState?.gameId.toString()}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Deposit amount:</Text>
                        <Text style={styles.value}>{lamportInSol(gameVaultState?.depositAmount).toString()}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Number of clicks:</Text>
                        <Text style={styles.value}>{gameState?.clickNumber.toString()}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181818',
        padding: 20,
        alignItems: 'center',
        // justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Play & Win text styling
    clickWinContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    clickWinContainer2: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    clickText: {
        fontSize: 48,
        color: '#FFFFFF',
        fontWeight: 'bold',
        lineHeight: 48,
    },
    text: {
        fontSize: 30,
        color: '#FFFFFF',
        fontWeight: 'bold',
        lineHeight: 48,
    },

    // Card with emoji and numeric value
    card: {
        backgroundColor: '#242424',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '70%',
    },
    emoji: {
        fontSize: 50,
    },
    cardContent: {
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    numericValue: {
        fontSize: 36,
        color: '#FFFFFF',
        marginRight: 10,
    },
    logo: {
        width: 30,
        height: 30,
    },

    // Button container
    buttonContainer: {
        flex: .8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Card with current winner and number of clicks
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    label: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    value: {
        fontSize: 18,
        color: '#FFFFFF',
    },
});