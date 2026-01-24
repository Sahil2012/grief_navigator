export const THEME = {
    COLORS: {
        bg: "#F9FAFB",
        card: "#FFFFFF",
        primary: "#2FC5C0",
        teal: "#2FC5C0",
        blueSoft: "#6366F1",
        blueLight: "#EEF2FF",
        greenSoft: "#10B981",
        greenLight: "#ECFDF5",
        purpleSoft: "#8B5CF6",
        purpleLight: "#F3E8FF",
        pinkSoft: "#EC4899",
        pinkLight: "#FDF2F8",
        graySoft: "#F3F4F6",
        textDark: "#23272F",
        textSecondary: "#7A7F87",
        dark: "#23272F",
        secondary: "#7A7F87",
        gray200: "#F3F4F6",

        // Legacy aliases mapping to above or keeping for compatibility
        PRIMARY: '#2FC5C0', // Updated to match teal
        TEXT_DARK: '#23272F',
        TEXT_SECONDARY: '#7A7F87',
        PLACEHOLDER: '#7A7F87',
        WHITE: '#FFFFFF',
        BORDER: '#E5E7EB',
    },
    SPACING: {
        containerPadding: 20,
    },
    RATING_SCALE_COLORS: {
        0: '#22c55e', // Green
        1: '#84cc16', // Lime
        2: '#eab308', // Yellow
        3: '#f97316', // Orange
        4: '#ef4444', // Red
    } as Record<number, string>,
};
