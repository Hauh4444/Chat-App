import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import ChatsScreen from "@/screens/ChatsScreen.jsx";
import ProfileScreen from "@/screens/ProfileScreen.jsx";
import SettingsScreen from "@/screens/SettingsScreen.jsx";
import { getColors } from "@/constants/Colors.js";

const Tab = createBottomTabNavigator();

const tabs = [
    {
        name: "Profile",
        component: ProfileScreen,
        icon: {
            focused: "people",
            unfocused: "people-outline",
        },
    },
    {
        name: "Chats",
        component: ChatsScreen,
        icon: {
            focused: "chatbox-ellipses",
            unfocused: "chatbox-ellipses-outline",
        },
    },
    {
        name: "Settings",
        component: SettingsScreen,
        icon: {
            focused: "settings",
            unfocused: "settings-outline",
        },
    },
];

const TabNavigator = () => (
    <Tab.Navigator
        id="tab-stack"
        screenOptions={({ route }) => {
            const tab = tabs.find((t) => t.name === route.name);

            return {
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.activeTint,
                tabBarActiveBackgroundColor: colors.activeBackground,
                tabBarInactiveTintColor: colors.inactiveTint,
                tabBarLabelStyle: styles.inputLabel,
                tabBarStyle: styles.bar,
                tabBarIconStyle: styles.icon,
                tabBarIcon: ({ focused, color }) => (
                    <Ionicons name={ focused ? tab.icon.focused : tab.icon.unfocused } size={ 32 } color={ color } />
                ),
            };
        }}
    >
        { tabs.map(({ name, component }) => (
            <Tab.Screen key={ name } name={ name } component={ component } />
        )) }
    </Tab.Navigator>
);

export default TabNavigator;

const colors = getColors();

const styles = StyleSheet.create({
    bar: {
        backgroundColor: colors.background,
        height: 60,
        paddingBottom: 0,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 4,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: "600",
    },
    icon: {
        width: "100%",
        height: "100%",
    },
});