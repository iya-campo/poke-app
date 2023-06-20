import { createTheme } from "@mui/material";

export const pokemonTheme = createTheme({
    typography: {
        // fontFamily: 'Montserrat',
        h1: {
            fontSize: '30px',
            fontWeight: '600',
        },
        h2: {
            fontSize: '20px',
            fontWeight: '600',
            padding: '1rem 0'
        },
        h4: {
            fontSize: '16px',
            fontWeight: '500',
            color: '#000',
            lineHeight: '1.5',
        },
        body1: {
            fontWeight: '400',
            color: '#555',
        },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    fontFamily: ['Roboto', 'Helvetica'],
                }
            }
        },
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
                    // width: '180px'
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