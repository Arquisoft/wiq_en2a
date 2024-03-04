import React from 'react';
import './nav.css';
import { useTranslation } from 'react-i18next';
import {AppBar, Box, Container, Toolbar, Grid, Stack, Typography, Button} from "@mui/material";

const NavBar: React.FC<{}> = () => {
    const { t } = useTranslation();
    return (
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Container maxWidth="xl">
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography>{t('app_name')}</Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained">Game</Button>
                  <Button variant="contained">Groups</Button>
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