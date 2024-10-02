import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Switch, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAllGameState } from '../program/programAccounts';
import { getAnchorConfig } from '../program/config';

// Définition des types
type RootStackParamList = {
    GameList: undefined;
    // Ajoutez d'autres écrans ici si nécessaire
};

type GameListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameList'>;

interface Game {
    id: string;
    title: string;
    description: string;
    ended: boolean;
}

interface GameCardProps {
    id: string;
    title: string;
    description: string;
    onPress: (id: string) => void;
}

interface GameListScreenProps {
    navigation: GameListScreenNavigationProp;
}

// Données factices pour les jeux (à remplacer par vos vraies données)
const GAMES_DATA: Game[] = [
    { id: '1', title: 'Jeu 1', description: 'Description du jeu 1', ended: false },
    { id: '2', title: 'Jeu 2', description: 'Description du jeu 2', ended: true },
    { id: '3', title: 'Jeu 3', description: 'Description du jeu 3', ended: false },
    // Ajoutez plus de jeux ici
];



const GameListScreen: React.FC<GameListScreenProps> = ({ navigation }) => {

    const { program } = getAnchorConfig();
    const [games, setGames] = useState<Game[]>(GAMES_DATA);
    const [loading, setLoading] = useState(false);
    const [showEndedGames, setShowEndedGames] = useState(false);

    const loadGames = useCallback(async () => {
        try {
            // setLoading(true);
            // const fetchedGames = await fetchGames();
            // setGames(fetchedGames);
            // setError(null);




        } catch (err) {
            // setError('Erreur lors du chargement des jeux');
            console.error(err);
        }

        const fetchGlobalData = async () => {

            try {
                const global = await fetchAllGameState(program);
               

                
            } catch (error) {
                console.error("Error fetching global state:", error);
            }
        };

        fetchGlobalData();
    }, []);

    useEffect(() => {
        loadGames();
      }, [loadGames]);

    const handleGamePress = useCallback((gameId: string) => {
        navigation.navigate('Game', { gameId });
    }, [navigation]);

    const GameCard: React.FC<GameCardProps> = ({ id, title, description, onPress }) => (
        <TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: Game }) => (
        <GameCard
            id={item.id}
            title={item.title}
            description={item.description}
            onPress={handleGamePress}
        />
    );

    const handleRefresh = useCallback(() => {
        loadGames();
    }, []);

    const filteredGames = showEndedGames ? games : games.filter(game => !game.ended);

    return (
        <SafeAreaView style={styles.safeAreaView}>


            <Header />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Game list</Text>
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
                    keyExtractor={(item: Game) => item.id}
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    filterEndedText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 3,
        color: '#FFFFFF',
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
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default GameListScreen;