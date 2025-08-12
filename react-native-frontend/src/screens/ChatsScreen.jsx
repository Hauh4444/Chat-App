import { useCallback, useState } from "react";
import { Pressable, Text, Image, ScrollView, StyleSheet, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAuth } from "@/contexts/Auth/AuthContext";
import { getColors } from "@/constants/Colors.js";
import axiosInstance from "@/utils/axiosInstance.js";

/**
 * @typedef { Object } FriendData
 * @property { string } username
 * @property { string } logo
 *
 * @typedef { Object } Friend
 * @property { [FriendData, FriendData] } participants
 *
 * @typedef { Object } Chat
 * @property { string } [title]
 * @property { [string, string] } participants
 * @property { string } [logo]
 */

const ChatsScreen = ({ navigation }) => {
    const { user } = useAuth();

    const [search, setSearch] = useState("");
    /** @type { Friend[] } */
    const [friends, setFriends] = useState([]);
    /** @type { Friend[] } */
    const [filteredFriends, setFilteredFriends] = useState([]);
    /** @type { Chat[] } */
    const [chats, setChats] = useState([]);
    /** @type { Chat[] } */
    const [filteredChats, setFilteredChats] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                let response = await axiosInstance.get("/user/chats/");
                setChats(response.data);
                setFilteredChats(response.data);

                response = await axiosInstance.get("/user/friends/")
                setFriends(response.data);
                setFilteredFriends(response.data);
            }
            fetchData().catch((err) => console.error(err));
        }, [])
    );

    // TODO Update filter to filter for any length participants
    useFocusEffect(
        useCallback(() => {
            const query = search.trim().toLowerCase();
            const filtered = chats.filter(chat => {
                const title = (chat.title || '').toLowerCase();
                const titleQuery = query ? title.includes(query) : true;
                const otherUser = chat.participants[0] === user.username
                    ? chat.participants[1]
                    : chat.participants[0];
                const usernameQuery = query ? otherUser.toLowerCase().includes(query) : true;
                return titleQuery || usernameQuery;
            });
            setFilteredChats(filtered);
        }, [search, chats])
    );

    useFocusEffect(
        useCallback(() => {
            const query = search.trim().toLowerCase();
            const filtered = friends.filter(friend => {
                const otherUser = friend.participants[0] === user.username
                    ? friend.participants[1]
                    : friend.participants[0];
                const username = (otherUser || '').toLowerCase();
                return query ? username.includes(query) : true;
            });
            setFilteredFriends(filtered);
        }, [search, friends])
    );

    return (
        <View style={ styles.container }>
            <SearchBar
                platform="default"
                containerStyle={ styles.searchContainer }
                inputContainerStyle={ styles.searchInputContainer }
                inputStyle={ styles.searchInput }
                lightTheme={ true }
                onChangeText={ (value) => setSearch(value) }
                onClear={ () => setSearch("") }
                placeholder="Search"
                placeholderTextColor={ colors.inactiveTint }
                round={ true }
                value={ search }
            />

            <ScrollView style={ styles.friendsContainer } horizontal={ true }>
                { filteredFriends[0] && filteredFriends.map((item, index) => (
                    <Pressable style={ styles.friendCard } key={ index }>
                        <Image
                            style={ styles.friendLogo }
                            source={{ uri: item.participants[0].username === user.username ? item.participants[1].logo : item.participants[0].logo }}
                        />
                    </Pressable>
                )) }
            </ScrollView>

            <ScrollView style={ styles.chatsContainer }>
                { filteredChats[0] && filteredChats.map((item, index) => (
                    <Pressable style={ styles.chatCard } key={ index }>
                        <Image style={ styles.chatLogo } source={{ uri: item.logo }} />
                        <Text style={ styles.chatText }>
                            { item.title }
                        </Text>
                        <Pressable>
                            <Ionicons name="ellipsis-horizontal" size={ 24 } color={ colors.text } />
                        </Pressable>
                    </Pressable>
                )) }
            </ScrollView>
        </View>
    )
}

export default ChatsScreen;

const colors = getColors();

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
    },

    searchContainer: {
        width: "100%" - 48,
        height: 64,
        marginTop: 64,
        marginBottom: 16,
        marginHorizontal: 24,
        padding: 0,
        backgroundColor: colors.background,
        borderRadius: 32,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
    },
    searchInputContainer: {
        width: "100%",
        height: "100%",
        paddingHorizontal: 8,
        borderRadius: 32,
        backgroundColor: colors.inputBackground,
    },
    searchInput: {
        fontSize: 18,
        color: colors.text,
    },

    friendsContainer: {
        width: "100%",
        height: 80,
        paddingVertical: 8,
        paddingHorizontal: 24,
        flexDirection: "row",
        flexGrow: 0,
    },
    friendCard: {
        width: 64,
        height: 64,
        borderColor: colors.activeBackground,
        borderWidth: 2,
        borderRadius: 36,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
    },
    friendLogo: {
        width: "100%",
        height: "100%",
        borderRadius: 36,
    },

    chatsContainer: {
        width: "100%",
        paddingVertical: 16,
        flexGrow: 1,
    },
    chatCard: {
        width: "100%" - 24,
        height: 64,
        marginBottom: 16,
        marginHorizontal: 24,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.cardBackground,
        borderRadius: 36,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
    },
    chatLogo: {
        width: 48,
        height: 48,
        marginRight: 16,
        borderColor: colors.activeBackground,
        borderWidth: 2,
        borderRadius: 24,
    },
    chatText: {
        flexGrow: 1,
        fontSize: 18,
        color: colors.text,
    },
});