import React, { useCallback, useEffect } from 'react';
import * as anchor from "@coral-xyz/anchor";
import { AppState, View, StyleSheet, SafeAreaView, Text, Image, AppStateStatus, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
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
import { toastError, toastSuccess } from '../utils/toast/toastHelper';
import { Header } from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { verifyGameState } from '../program/programMethods';

type RootStackParamList = {
    Game: { strGameId: String };
};

type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;
type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

interface GameScreenProps {
    route: GameScreenRouteProp;
    navigation: GameScreenNavigationProp;
}

export default function GameScreen({ route, navigation }: GameScreenProps) {

    const { strGameId } = route.params;
    const gameId = new anchor.BN(strGameId);

    const solanaLogo = require('../assets/solanaLogoMark.png');
    const connectionContext = useConnection();
    const mobileWallet = useMobileWallet()!;
    const { program } = getAnchorConfig(connectionContext.connection, mobileWallet);

    const [appState, setAppState] = React.useState<AppStateStatus>(AppState.currentState);
    const [globalState, setGlobalState] = React.useState<GlobalStateAccount>();
    const [gameState, setGameState] = React.useState<GameStateAccount>();
    const [gameVaultState, setGameVaultState] = React.useState<GameVaultStateAccount>();
    const [remainingTime, setRemainingTime] = React.useState(0);
    const [isGameStarted, setIsGameStarted] = React.useState(false);
    const [isGameEnded, setIsGameEnded] = React.useState(false);
    const [isUserLeader, setIsUserLeader] = React.useState(false);
    const [isVaultClaimed, setIsVaultClaimed] = React.useState(false);
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
                const game = await fetchGameState(program, gameId);
                setGameData(game);

                subscribeGameState(
                    connectionContext.connection,
                    program,
                    gameId,
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
                const vault = await fetchGameVaultState(program, gameId);
                setGameVaultState(vault);
                subscribeGameVaultState(
                    connectionContext.connection,
                    program,
                    gameId,
                    (updatedAccount: GameVaultStateAccount) => setVaultData(updatedAccount)
                );
            } catch (error) {
                console.error("Error fetching vault state:", error);
            }
        };
        fetchVaultData();
    }, []);

    async function setVaultData(gvsa: GameVaultStateAccount) {
        const isVaultClaimed = gvsa.balance === new anchor.BN(0);
        setIsVaultClaimed(isVaultClaimed);

        setGameVaultState(gvsa);
    }

    /* Manage countdown */
    useEffect(() => {

        if (!gameState)
            return;

        const remainingTime = calculateRemainingTime(gameState);
        if (remainingTime <= 0) {

            setRemainingTime(0);
            setIsGameEnded(true);
        }
        else {
            setRemainingTime(remainingTime);
        }

        if (!isGameStarted || isGameEnded)
            return;

        // Start countdown
        const interval = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1; // Decrease by 1 second
                } else {
                    clearInterval(interval); // Stop the countdown
                    setIsGameEnded(true);
                    return 0;
                }
            });
        }, 1000); // Update every second

        // Clear interval on unmount
        return () => clearInterval(interval);
    }, [gameState, isGameStarted, appState]);

    const handleOnListPress = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'GameList' }],
        });
    }

    const handleOnVerifyPress = async () => {
        try {

            if (!mobileWallet) {
                toastError("Wallet not connected", "Please connect your wallet to continue");
                return;
              }

            const tx = await verifyGameState(connectionContext.connection, mobileWallet, program, gameId);
      
            await fetchGameState(program, gameId);
            await fetchGameVaultState(program, gameId);
      
            toastSuccess("Transaction success !", `Transaction signature: ${tx}`);
          }
          catch (err) {
      
            toastError("Transaction Error", `Error while verifying the game (${err})`);
          }
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>

            <Header />

            <View style={styles.container}>

                <View style={styles.buttonColumn}>
                    <TouchableOpacity style={styles.roundButton} onPress={handleOnListPress}>
                        <Ionicons name="list" size={moderateScale(20)} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} onPress={handleOnVerifyPress}>
                        <Ionicons name="checkmark" size={moderateScale(20)} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* "Click & Win" */}
                <View style={styles.clickWinContainer}>
                    <Text style={styles.clickAndWinText}>Click & Win</Text>
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
                <View style={styles.countdownContainer}>
                    <Countdown hours={hours} minutes={minutes} seconds={seconds} />
                </View>

                {/* Solana Button */}
                <View style={styles.buttonContainer}>
                    <SolanaButton
                        program={program}
                        isGameEnded={isGameEnded}
                        isCurrentUserWinner={isUserLeader}
                        isVaultClaimed={isVaultClaimed}
                        gameId={gameId}
                    />
                </View>

                <View>

                    <View style={styles.column}>

                        <Text style={styles.text}>

                            {
                                isGameEnded ?
                                    "Game Ended"
                                    :
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
                            // if there is no clicker yet
                            isGameStarted ?
                                <Text style={styles.text}>
                                    {
                                        gameState?.lastClicker ?
                                            isGameEnded ?

                                                `🏆 ${getShortAddress(gameState.lastClicker.toString())} 🏆`
                                                :
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
                <LinearGradient
                    colors={['#8A3EE6', '#12D485']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cardBorder}
                >
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
                </LinearGradient>
            </View>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
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

    buttonColumn: {
        position: 'absolute',
        top: moderateScale(10),
        right: moderateScale(12),
        justifyContent: 'flex-start',
    },
    roundButton: {
        padding: 10,
        backgroundColor: '#242424',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(15),
    },

    // Play & Win text styling
    clickWinContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    clickAndWinText: {
        fontFamily: 'neuropolitical',
        fontSize: moderateScale(30),
        color: '#FFFFFF',
    },
    text: {
        fontFamily: 'neuropolitical',
        fontSize: moderateScale(15),
        color: '#FFFFFF',
        marginTop: 10,
    },

    card: {
        backgroundColor: '#242424',
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        height: "100%",

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
        fontFamily: 'suissnord',
        fontSize: moderateScale(30),
        color: '#FFFFFF',
        marginRight: 20,
    },
    logo: {
        width: moderateScale(20),
        height: moderateScale(20),
    },
    countdownContainer: {

        flex: .5,
        width: '100%',
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
        marginVertical: moderateScale(3),
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontFamily: 'neuropolitical',
        fontSize: moderateScale(12),
        color: '#FFFFFF',
    },
    value: {
        fontFamily: 'suissnord',
        fontSize: moderateScale(12),
        color: '#FFFFFF',
    },
    cardBorder: {
        padding: 2,
        height: moderateScale(100),
        width: '90%',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
        marginTop: 20,
    },
});