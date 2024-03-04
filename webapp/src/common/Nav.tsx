import React from 'react';
import './nav.css';
import { useTranslation } from 'react-i18next';
import {AppBar, Box, Container, Toolbar, Grid, Stack, Button} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{}> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar className="nav_appBar">
                <Toolbar>
                    <Container maxWidth="xl">
                        <Grid
                        container
                        direction="row"
                        alignItems="center"
                        >
                            <Grid item className="logo">
                                {t('app_name')}
                            </Grid>
                            <Grid item>
                                <Stack direction="row" spacing={2}>
                                    <Button variant="contained" onClick={() => navigate("/game")}>
                                        {t('nav_game')}
                                    </Button>
                                    <Button variant="contained" onClick={() => navigate("/groups")}>
                                        {t('nav_groups')}
                                    </Button>
                                    <Button variant="contained" onClick={() => navigate("/scoreboard")}>
                                        {t('nav_scoreboard')}
                                    </Button>
                            </Stack>
                        </Grid>
                        </Grid>
                    </Container>
                </Toolbar>
            </AppBar>
        </Box>
    )
    /*return(
        <nav className='navbar'>
            <div className='logo'>
                <h3>{t('app_name')}</h3>
            </div>
            <div className='link-container'>
                
            </div>
        </nav>
    )*/
};

export default NavBar;