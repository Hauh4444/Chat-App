const Colors = {
    light: {
        text: "#0F0F0F",
        background: "#FFFFFF",
        border: "#E5E7EB",
        shadow: "#111827",

        cardBackground: "#F9FAFB",

        buttonText: "#F9FAFB",
        buttonBackground: "#4169E1",

        activeTint: "#FFFFFF",
        activeBackground: "#4169E1",
        inactiveTint: "#6B7280",
    },
    dark: {
        text: "#F9FAFB",
        background: "#0F0F0F",
        border: "#374151",
        shadow: "#E5E7EB",

        cardBackground: "#0F0F0F",

        buttonText: "#0F0F0F",
        buttonBackground: "#1E90FF",

        activeTint: "#0F0F0F",
        activeBackground: "#4169E1",
        inactiveTint: "#9CA3AF",
    },
};

export const getColors = () => {
    if (typeof window !== "undefined" && window.matchMedia)
        return Colors[window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"];
    return Colors["light"];
};
