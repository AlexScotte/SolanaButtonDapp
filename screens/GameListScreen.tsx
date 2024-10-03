import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Switch, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAllGameState, fetchAllGameVaultState } from '../program/programAccounts';
import { getAnchorConfig } from '../program/config';
import { GameStateAccount, GameVaultStateAccount } from '../program/programTypes';
import { toastError } from '../utils/toast/toastHelper';
import { useMobileWallet } from '../hooks/useMobileWallet';
import { getHourMinuteSecond, getShortAddress, lamportInSol } from '../utils/helper';
import LinearGradient from 'react-native-linear-gradient';

type RootStackParamList = {
    GameList: undefined;
};

type GameListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameList'>;


interface GameCardProps {
    gameStateAccount: GameStateAccount;
    onPress: (id: string) => void;
}

interface GameListScreenProps {
    navigation: GameListScreenNavigationProp;
}


const GameListScreen: React.FC<GameListScreenProps> = ({ navigation }) => {

    const { program } = getAnchorConfig();
    const [games, setGames] = useState<GameStateAccount[]>([]);
    const [vaults, setVaults] = useState<GameVaultStateAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [showEndedGames, setShowEndedGames] = useState(false);
    const mobileWallet = useMobileWallet()!;

    const fetchGameListData = useCallback(async () => {

        const fetchGames = async () => {

            try {
                setLoading(true);
                const allGameStateAccounts = await fetchAllGameState(program);
                setGames(allGameStateAccounts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching global state:", error);
                setLoading(false);
            }
        };

        const fetchVaults = async () => {

            try {
                setLoading(true);
                const allGameVaultStateAccounts = await fetchAllGameVaultState(program);
                setVaults(allGameVaultStateAccounts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching global state:", error);
                setLoading(false);
            }
        };

        fetchGames();
        fetchVaults();
    }, []);

    useEffect(() => {
        fetchGameListData()
    }, [fetchGameListData]);

    const handleRefresh = useCallback(() => {
        fetchGameListData();
    }, []);

    const handleGamePress = useCallback((gameId: string) => {
        navigation.navigate('Game', { gameId });
    }, [navigation]);

    const GameCard: React.FC<GameCardProps> = ({ gameStateAccount, onPress }) => {

        const { hours, minutes, seconds } = getHourMinuteSecond(gameStateAccount.gameTimeSec);

        return (
            <LinearGradient
                colors={ gameStateAccount.hasEnded ?  ['#7A7A7A', '#8A8A8A']: ['#9945FF', '#14F195']  }
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardBorder}
            >
                <TouchableOpacity style={styles.card} onPress={() => onPress(gameStateAccount.gameId)}>

                    <View style={styles.cardImageContainer}>
                        <Image
                            style={styles.cardImage}
                            source={require('../assets/solanaLogoMark.png')}
                        />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardText}>ID: {gameStateAccount.gameId.toString()}</Text>
                        <Text style={styles.cardText}>Vault: {lamportInSol(vaults.find(v => v.gameId.toString() == gameStateAccount.gameId.toString())?.balance.toString())} SOL</Text>
                        <Text style={styles.cardText}>Deposit: {lamportInSol(vaults.find(v => v.gameId.toString() == gameStateAccount.gameId.toString())?.depositAmount.toString())} SOL</Text>
                        <Text style={styles.cardText}>
                            Leader: {gameStateAccount.lastClicker ? getShortAddress(gameStateAccount.lastClicker.toString()) : 'N/A'}
                        </Text>
                        <Text style={styles.cardText}>Clicks: {gameStateAccount.clickNumber.toString()}</Text>
                    </View>
                    <View style={styles.cardStatus}>
                        {gameStateAccount.hasEnded ? (
                            <>
                                <Text style={styles.statusText}>Game Ended</Text>
                                <Text style={styles.resultText}>
                                    {gameStateAccount.lastClicker && mobileWallet?.publicKey && gameStateAccount.lastClicker.equals(mobileWallet?.publicKey)
                                        ? 'YOU WIN'
                                        : 'YOU LOSE'}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.statusText}>
                                Time: {hours.toString().padStart(2, '0')}h:
                                {minutes.toString().padStart(2, '0')}m:
                                {seconds.toString().padStart(2, '0')}s</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </LinearGradient>

        )
    };

    const renderItem = ({ item }: { item: GameStateAccount }) => (
        <GameCard
            gameStateAccount={item}
            onPress={handleGamePress}
        />
    );

    const filteredGames = showEndedGames ? games : games.filter(game => !game.hasEnded);

    return (
        <SafeAreaView style={styles.safeAreaView}>


            <Header />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Game List</Text>
                </View>
                <View style={styles.filterContainer}>
                    <View style={styles.filterEndedContainer}>
                        <Text style={styles.filterEndedText}>Ended ?</Text>
                        <Switch
                            value={showEndedGames}
                            onValueChange={setShowEndedGames}
                            trackColor={{ false: "#9945FF", true: "#14F195" }}
                            thumbColor={showEndedGames ? "#0D9B76" : "#A67DFF"}
                            ios_backgroundColor="#3e3e3e"
                        />
                    </View>
                    {loading ? (
                        <View style={styles.refreshButton}>
                            <ActivityIndicator size={30} color="#FFFFFF" />
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                            <Ionicons name="refresh" size={30} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    data={filteredGames}
                    renderItem={renderItem}
                    keyExtractor={(gameStateAccount: GameStateAccount) => gameStateAccount.gameId}
                    contentContainerStyle={styles.listContainer}
                />
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
        padding: 20,
        backgroundColor: '#181818',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    headerTitle: {
        fontSize: 42,
        color: '#FFFFFF',
        fontFamily: 'neuropolitical',
    },
    filterEndedText: {
        fontSize: 16,
        marginTop: 3,
        color: '#FFFFFF',
        fontFamily: 'neuropolitical',
    },
    refreshButton: {
        padding: 8,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    filterEndedContainer: {
        flexDirection: 'row',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    cardBorder: {
        marginBottom: 16,
        padding: 2,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#2A2A2A',
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    cardImageContainer: {
        width: 40,
        height: 40,
        padding: 4,
        alignSelf: 'center',
    },
    cardImage: {
        height: "100%",
        width: "100%",
        borderRadius: 0,
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    cardText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 4,
        fontFamily: 'neuropolitical',
    },
    cardStatus: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    statusText: {
        color: '#14F195',
        fontSize: 12,
        fontFamily: 'neuropolitical',
    },
    resultText: {
        color: '#9945FF',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
        fontFamily: 'neuropolitical',
    },

});

export default GameListScreen;