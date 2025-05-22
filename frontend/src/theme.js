import { createContext, useMemo } from "react";
import { createTheme } from "@mui/material";

export const tokens = () => ({
    grey: {
        100: "#f0f0f0", // Lightest grey for backgrounds or slight off-white elements
        200: "#e0e0e0", // Light grey for borders, dividers
        300: "#c2c2c2", // Slightly darker grey
        400: "#a3a3a3", // Medium-light grey for secondary text or icons
        500: "#858585", // Medium grey
        600: "#666666", // Medium-dark grey for less important text
        700: "#434343", // Dark grey for primary text
        800: "#292929", // Very dark grey
        900: "#141414", // Almost black
    },
    primary: {
        100: "#e0e7ff", // Very light blue/purple for backgrounds of primary elements
        200: "#c2cfff", // Light blue/purple
        300: "#a3b8ff", // Medium-light blue/purple
        400: "#85a0ff", // Medium blue/purple
        500: "#6688FF", // Main primary color
        600: "#526ECC", // Darker primary
        700: "#3E55A3", // Even darker
        800: "#293C7A", // Very dark
        900: "#141E51", // Almost black-blue
    },
    secondary: {
        100: "#e0f3ff", // Very light blue for secondary element backgrounds
        200: "#c2e7ff", // Light blue
        300: "#a3d9ff", // Medium-light blue
        400: "#85ccff", // Medium blue
        500: "#4dabf5", // Main secondary color (приємний синій)
        600: "#3b8dd1", // Darker secondary
        700: "#2c6faa", // Even darker
        800: "#1e5083", // Very dark blue
        900: "#0f285D", // Almost black-blue
    },
    greenAccent: {
        300: "#94e2cd",
        500: "#4cceac",
        700: "#2e7c67",
    },
    redAccent: {
        300: "#f1b9b7",
        500: "#db4f4a",
        700: "#af3f3b",
    },
    backgroundLight: "#f4f6f8",
    paperLight: "#ffffff",
});

export const themeSettings = () => {
    const currentMode = "light";
    const colors = tokens();

    return {
        palette: {
            mode: currentMode,
            primary: {
                main: colors.primary[500],
                light: colors.primary[300],
                dark: colors.primary[700],
            },
            secondary: {
                main: colors.secondary[500],
                light: colors.secondary[300],
                dark: colors.secondary[700],
            },
            neutral: {
                dark: colors.grey[700],
                main: colors.grey[500],
                light: colors.grey[200],
            },
            background: {
                default: colors.backgroundLight,
                paper: colors.paperLight,
            },
            text: {
                primary: colors.grey[700],
                secondary: colors.grey[600],
            },
            error: {
                main: colors.redAccent[500],
            },
            success: {
                main: colors.greenAccent[500],
            },
            action: {
                active: colors.primary[500],
                hover: colors.primary[100],
                hoverOpacity: 0.08,
                selected: colors.primary[200],
                selectedOpacity: 0.16,
                disabled: colors.grey[400],
                disabledBackground: colors.grey[100],
            }
        },
        typography: {
            fontFamily: ["Source Code Pro", "sans-serif"].join(","),
            fontSize: 12,
            h1: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 32, fontWeight: 600 },
            h2: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 28, fontWeight: 600 },
            h3: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 24, fontWeight: 500 },
            h4: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 20, fontWeight: 500 },
            h5: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 16, fontWeight: 500 },
            h6: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 14, fontWeight: 500 },
            subtitle1: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 16 },
            subtitle2: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 14 },
            body1: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 14 },
            body2: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), fontSize: 12 },
            button: { fontFamily: ["Source Code Pro", "sans-serif"].join(","), textTransform: 'capitalize', fontSize: 14},
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                    }
                }
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        border: `1px solid ${tokens().grey[200]}`,
                        "& .MuiDataGrid-toolbarContainer": {
                            "& .MuiButton-root": {
                                color: tokens().grey[700],
                            },
                        },
                        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                            outline: 'none',
                        },
                        "& .MuiDataGrid-row.Mui-selected": {
                            backgroundColor: tokens().primary[100],
                        },
                    },
                    columnHeaders: {
                        backgroundColor: tokens().grey[100],
                        borderBottom: `1px solid ${tokens().grey[300]}`,
                    },
                }
            }
        }
    }
};

export const ColorModeContext = createContext({
    toggleColorMode: () => { console.log("Color mode is locked to light.") }
});

export const useMode = () => {
    const mode = "light";
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                console.log("Theme is locked to light mode. Toggle attempted.");
            }
        }),
        []
    );
    const theme = useMemo(() => createTheme(themeSettings()), [mode]);
    return [theme, colorMode];
};