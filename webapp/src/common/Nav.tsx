import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './nav.scss';
import { useTranslation } from 'react-i18next';
import {AppBar, Container, Toolbar, Grid, Stack, Button, Menu, MenuItem} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{}> = () => 
{
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const value:string= JSON.stringify(localStorage.getItem("isAuthenticated")).replace("\"","").replace("\"","");
    const user = JSON.stringify(localStorage.getItem("username")).replace("\"", "").replace("\"", "");
    const [anchorEl, setAnchorEl] = useState<null|HTMLElement>(null);
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose =() => {
        setAnchorEl(null)
    }

    if(value === "false"){
        navigate("/");
    } 

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
        <AppBar className="nav-appBar" sx={
            { 
                display: 'flex', 
                flexDirection: 'row',
                flexWrap: 'nowrap', 
                alignItems: 'flex-start', 
                justifyContent: 'flex-start',
                width: '100%' 
            }
        }>
            <Toolbar sx={{ width: '100%' }}>
                <Container sx={{ maxWidth: '100% !important' }}>
                    <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={4}
                    >
                        <Grid item spacing={2}>
                            <Stack direction="row" spacing={2}>
                                <div className="logo">
                                    {t('app_name')}
                                </div>
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
                        <Grid item>
                            <Grid 
                            container 
                            direction="row" 
                            justifyContent="flex-end" 
                            >
                                <Grid item>
                                    <Button 
                                    variant="text"
                                    id="menu-button" 
                                    color='inherit' 
                                    onClick={handleClick} 
                                    aria-controls={open? 'menu' : undefined} 
                                    aria-haspopup='true' 
                                    aria-expanded={open? 'true' : undefined}
                                    sx={{ textTransform: 'none', padding: '0' }}
                                    >
                                        {user}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Menu 
                                    id="menu" 
                                    open={open} 
                                    MenuListProps={{'aria-labelledby':'menu-button'}} 
                                    onClose={()=>handleClose()} 
                                    anchorEl={anchorEl}
                                    >
                                        <MenuItem onClick={()=> navigate("/profile")}>My account</MenuItem>
                                        <MenuItem onClick={()=> navigate("/")}>Logout</MenuItem>
                                    </Menu>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    )
};

export default NavBar;