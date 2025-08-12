import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import CheckBox from "expo-checkbox";
import Ionicons from "react-native-vector-icons/Ionicons";
import SHA256 from "crypto-js/sha256";

import { useAuth } from "@/contexts/Auth/AuthContext.js";
import { getColors } from "@/constants/Colors.js";

const AuthScreen = ({ navigation }) => {
    const { login, register, error, setError } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    // TODO Handle stay signed in functionality (currently always is the case)
    const [staySignedIn, setStaySignedIn] = useState(false);

    const toggleAuthMode = () => {
        setError("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setIsLogin(!isLogin);
    };

    const handleSubmit = async () => {
        if (isLogin) {
            await login({
                username: username,
                hashed_password: SHA256(password).toString(),
            });
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            await register({
                username: username,
                hashed_password: SHA256(password).toString(),
            })
        }
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.headerText }>
                { isLogin ? "Login to your account" : "Create your account" }
            </Text>

            <Text style={ styles.inputLabel }>
                Username or email address
            </Text>
            <TextInput
                style={ styles.textInput }
                onChangeText={ (value) => setUsername(value) }
                value={ username }
            />

            <Text style={ styles.inputLabel }>
                Enter your password
            </Text>
            <TextInput
                style={ styles.textInput }
                onChangeText={ (value) => setPassword(value) }
                value={ password }
                secureTextEntry={ true }
            />

            { !isLogin && (
                <>
                    <Text style={ styles.inputLabel }>
                        Confirm your password
                    </Text>
                    <TextInput
                        style={ styles.textInput }
                        onChangeText={ (value) => setConfirmPassword(value) }
                        value={ confirmPassword }
                        secureTextEntry={ true }
                    />
                </>
            ) }

            <View style={ styles.formOptions }>
                <Pressable style={ styles.checkboxContainer } onPress={ () => setStaySignedIn(!staySignedIn) }>
                    <CheckBox
                        style={ styles.checkbox }
                        value={ staySignedIn }
                        color={ staySignedIn ? colors.activeBackground : colors.inactiveBackground }
                    />
                    <Text style={ styles.checkboxLabel }>
                        Remember me
                    </Text>
                </Pressable>

                { isLogin && (
                    <Text style={ styles.linkText } onPress={ () => navigation.navigate("ForgotPassword") }>
                        Forgot password
                    </Text>
                ) }
            </View>

            { error !== "" && (
                <View style={ styles.errorContainer }>
                    <Ionicons name="alert-circle" size={ 24 } color={ colors.errorText } />
                    <Text style={ styles.errorText }>
                        { error }
                    </Text>
                </View>
            ) }

            <Pressable style={ styles.submitButton } onPress={ () => handleSubmit() }>
                <Text style={ styles.submitButtonText }>
                    { isLogin ? "LOG IN" : "CREATE ACCOUNT" }
                </Text>
            </Pressable>

            <Text style={ styles.footerText }>
                { isLogin ? "Don't have an account? " : "Already have an account? " }
                <Text style={ styles.linkText } onPress={ () => toggleAuthMode() }>
                    { isLogin ? "Create an account" : "Login" }
                </Text>
            </Text>
        </View>
    );
};

export default AuthScreen;

const colors = getColors();

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        padding: 24,
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    formOptions: {
        width: "100%",
        marginVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerText: {
        marginBottom: 24,
        color: colors.text,
        fontSize: 24,
        fontWeight: "600",
    },
    inputLabel: {
        marginTop: 16,
        marginBottom: 4,
        color: colors.text,
    },
    footerText: {
        marginVertical: 16,
        textAlign: "center",
        color: colors.inactiveTint,
    },
    linkText: {
        color: colors.linkText,
    },
    errorContainer: {
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        marginLeft: 4,
        color: colors.errorText,
        fontSize: 14,
    },

    textInput: {
        width: "100%",
        height: 64,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: colors.inputBackground,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
        color: colors.text,
        fontSize: 16,
    },

    checkboxContainer: {
        alignItems: "center",
        flexDirection: "row",
    },
    checkbox: {
        marginRight: 6,
        borderRadius: 4,
    },
    checkboxLabel: {
        color: colors.text,
    },

    submitButton: {
        width: "100%",
        height: 64,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 32,
        backgroundColor: colors.buttonBackground,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
    },
    submitButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "500",
        letterSpacing: 2,
    },
});