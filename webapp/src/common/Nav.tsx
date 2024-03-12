import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './nav.scss';
import { useTranslation } from 'react-i18next';
import {AppBar, Container, Toolbar, Grid, Stack, Button} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{}> = () => 
{
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        switch (location.pathname) {
          case '/game':
            document.title = 'Conocer y Vencer - Game';
            break;
          case '/groups':
            document.title = 'Conocer y Vencer - Groups';
            break;
          case '/scoreboard':
            document.title = 'Conocer y Vencer - Scoreboard';
            break;
          case '/profile':
            document.title = 'Conocer y Vencer - Profile';
            break;
          default:
            document.title = 'Conocer y Vencer';
        }
      }, [location.pathname]);

    return (
        <AppBar className="nav-appBar">
            <Toolbar>
                <Container maxWidth="xl" >
                    <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={4}
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
                                <Button variant="contained" onClick={() => navigate("/profile")}>
                                    {t('nav_profile')}
                                </Button>
                        </Stack>
                    </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    )
};

export default NavBar;