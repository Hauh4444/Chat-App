import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import SHA256 from "crypto-js/sha256";
import { useAuth } from "@/contexts/Auth/AuthContext.js";
import { getColors } from "@/constants/Colors.js";

const AuthScreen = () => {
    const { login } = useAuth();

    const [info, setInfo] = useState({ username: "", password: "" });

    const handleChange = (field, value) => {
        setInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        await login({
            username: info.username,
            hashedPassword: SHA256(info.password).toString(),
        });
    };

    return (
        <View style={ styles.container }>
            <View style={ styles.card }>
                <Text style={ styles.title }>
                    Welcome!
                </Text>

                <TextInput
                    style={ styles.input }
                    onChangeText={ (value) => handleChange("username", value) }
                    value={ info.username }
                    placeholder="Username"
                    placeholderTextColor="#6B7280"
                />
                <TextInput
                    style={ styles.input }
                    onChangeText={ (value) => handleChange("password", value) }
                    value={ info.password }
                    placeholder="Password"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={ true }
                />

                <Pressable style={ styles.button } onPress={ () => handleSubmit() }>
                    <Text style={ styles.buttonText }>SIGN IN</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default AuthScreen;

const colors = getColors();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    card: {
        width: "100%",
        maxWidth: 320,
        padding: 24,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: colors.cardBackground,
    },
    title: {
        marginBottom: 24,
        textAlign: "center",
        color: colors.text,
        fontSize: 24,
        fontWeight: "600",
        letterSpacing: 1.2,
    },
    input: {
        width: "100%",
        height: 48,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: colors.background,
        color: colors.text,
        fontSize: 16,
    },
    button: {
        width: "100%",
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: colors.buttonBackground,
        color: colors.buttonText,
    },
    buttonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "500",
    },
});