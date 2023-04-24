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
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    width: '150px'
                }
            }
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 4px'
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                scroller: {
                    width: '180px'
                },
                vertical: {
                    overflow: 'visible'
                },
                flexContainerVertical: {
                    flexGrow: '1'
                }
            }
        },
    }
});