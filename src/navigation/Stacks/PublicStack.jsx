import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "@/screens/AuthScreen.jsx";

const Stack = createNativeStackNavigator();

const PublicStack = () => (
    <Stack.Navigator id="public-stack" initialRouteName="Auth">
        <Stack.Screen name="Auth" component={ AuthScreen } />
    </Stack.Navigator>
);


export default PublicStack;
