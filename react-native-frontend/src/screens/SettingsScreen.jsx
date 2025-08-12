import { ScrollView, StyleSheet } from "react-native";

import { getColors } from "@/constants/Colors.js";

const SettingsScreen = ({ navigation }) => {
    return (
        <ScrollView style={ styles.container }>

        </ScrollView>
    )
}

export default SettingsScreen;

const colors = getColors();

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});