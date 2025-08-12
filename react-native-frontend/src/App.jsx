import AuthProvider from "@/contexts/Auth/AuthProvider.jsx";
import AppNavigator from "@/navigation/Navigators/AppNavigator.jsx";

const App = () => {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}

export default App;
