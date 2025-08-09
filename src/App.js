import AuthProvider from "@/contexts/Auth/AuthProvider";
import AppNavigator from "@/navigation/Navigators/AppNavigator";

const App = () => {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}

export default App;
