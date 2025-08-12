import {useCallback, useState} from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getColors } from "@/constants/Colors.js";
import axiosInstance from "@/utils/axiosInstance";

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                let response = await axiosInstance.get("/profile/");
                setProfile(response.data);
            }
            fetchData().catch((err) => console.error(err));
        }, [])
    );

    return (
        <ScrollView style={ styles.container }>

        </ScrollView>
    )
}

export default ProfileScreen;

const colors = getColors();

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});