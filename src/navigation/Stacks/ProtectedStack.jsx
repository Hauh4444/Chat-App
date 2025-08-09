import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "@/navigation/Tabs/TabNavigator";

const Stack = createNativeStackNavigator();

const ProtectedStack = () => (
    <Stack.Navigator id="protected-stack">
        <Stack.Screen name="Main" component={ TabNavigator } />
    </Stack.Navigator>
);

export default ProtectedStack;
