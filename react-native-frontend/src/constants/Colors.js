const Colors = {
    light: {
        background: "#FFFFFF",
        text: "#0F0F0F",
        border: "#E5E7EB",
        shadow: "#111827",

        cardBackground: "#F9FAFB",
        inputBackground: "#F2F2F6",

        buttonBackground: "#4169E1",
        buttonText: "#F9FAFB",

        linkText: "#4169E1",
        errorText: "#E34234",

        activeBackground: "#4169E1",
        activeTint: "#FFFFFF",
        inactiveBackground: "#E5E7EB",
        inactiveTint: "#6B7280",
    },
    dark: {
        background: "#000000",
        text: "#F9FAFB",
        border: "#374151",
        shadow: "#E5E7EB",

        cardBackground: "#0F0F0F",

        buttonBackground: "#1E90FF",
        buttonText: "#0F0F0F",

        linkText: "#1E90FF",
        errorText: "#FF4200",

        activeBackground: "#1E90FF",
        activeTint: "#000000",
        inactiveBackground: "#374151",
        inactiveTint: "#9CA3AF",
    },
};

export const getColors = () => {
    if (typeof window !== "undefined" && window.matchMedia)
        return Colors[window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"];
    return Colors["light"];
};
