import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "@/screens/HomeScreen";
import { getColors } from "@/constants/Colors.js";

const Tab = createBottomTabNavigator();

const tabs = [
    {
        name: "Home",
        component: HomeScreen,
        icon: {
            focused: "home",
            unfocused: "home-outline",
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
                tabBarActiveTintColor: styles.activeTintColor,
                tabBarActiveBackgroundColor: styles.activeBackgroundColor,
                tabBarInactiveTintColor: styles.inactiveTintColor,
                tabBarLabelStyle: styles.inputLabel,
                tabBarStyle: styles.bar,
                tabBarIconStyle: styles.icon,
                tabBarIcon: ({ focused, color }) => (
                    <Ionicons
                        name={ focused ? tab.icon.focused : tab.icon.unfocused }
                        size={ 22 }
                        color={ color }
                    />
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
        shadowRadius: 5,
        elevation: 4,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: "600",
    },
    icon: {
        marginTop: 2,
    },
    activeTintColor: colors.activeTint,
    activeBackgroundColor: colors.activeBackground,
    inactiveTintColor: colors.inactiveTint,
});