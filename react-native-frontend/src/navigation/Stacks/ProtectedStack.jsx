import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "@/navigation/Navigators/TabNavigator.jsx";

const Stack = createNativeStackNavigator();

const ProtectedStack = () => (
    <Stack.Navigator id="protected-stack">
        <Stack.Screen name="Main" component={ TabNavigator } options={{ headerShown: false }} />
    </Stack.Navigator>
);

export default ProtectedStack;
