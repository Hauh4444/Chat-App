import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import PublicStack from "@/navigation/Stacks/PublicStack.jsx";
import ProtectedStack from "@/navigation/Stacks/ProtectedStack.jsx";
import { useAuth } from "@/contexts/Auth/AuthContext.js";

const AppNavigator = () => {
    const { user, checkAuthStatus } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus().finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            { user ? <ProtectedStack /> : <PublicStack /> }
        </NavigationContainer>
    );
};

export default AppNavigator;
