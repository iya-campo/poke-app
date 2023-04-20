import { createTheme } from "@mui/material";

export const pokemonTheme = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    backgroundColor: 'white'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    // backgroundColor: 'black'
                }
            }
        }
    }
});