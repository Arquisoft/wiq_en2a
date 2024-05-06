import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './nav.scss';
import { useTranslation } from 'react-i18next';
import { AppBar, Container, Toolbar, Grid, Stack, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{}> = () => 
{
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const value:string= JSON.stringify(localStorage.getItem("isAuthenticated")).replace("\"","").replace("\"","");
    const user = JSON.stringify(localStorage.getItem("username")).replace("\"", "").replace("\"", "");
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement | SVGSVGElement>(null);
    const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement | SVGSVGElement>(null);
    const [profileOpen, setProfileOpen] = useState<boolean>(false);
    const [languageOpen, setLanguageOpen] = useState<boolean>(false);
    const [profileChevronRotated, setProfileChevronRotated] = useState<boolean>(false);
    const [languageChevronRotated, setLanguageChevronRotated] = useState<boolean>(false);


    const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<SVGSVGElement>) => {
        setProfileAnchorEl(event.currentTarget);
        setProfileOpen(!profileOpen);
        setProfileChevronRotated(!profileChevronRotated);
    };

    const handleLanguageClick = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<SVGSVGElement>) => {
        setLanguageAnchorEl(event.currentTarget);
        setLanguageOpen(!languageOpen);
        setLanguageChevronRotated(!languageChevronRotated);
    };

    const handleClose = () => {
        setProfileAnchorEl(null);
        setLanguageAnchorEl(null);
        setProfileOpen(false);
        setLanguageOpen(false);
        setProfileChevronRotated(false);
        setLanguageChevronRotated(false);
    };

    if(value === "false"){
        navigate("/");
    }

    useEffect(() => {
        switch (location.pathname) {
          case '/game':
            document.title = t('app_name') + ' - ' + t('nav_game');
            break;
          case '/groups':
            document.title = t('app_name') + ' - ' + t('nav_groups');
            break;
          case '/profile':
            document.title = t('app_name') + ' - ' + t('nav_profile');
            break;
          default:
            document.title = t('app_name');
        }
      }, [location.pathname, t]);

    return (
        <AppBar className="nav-appBar" sx={
            { 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'flex-start', 
                justifyContent: 'flex-start',
                width: '100%',
                position: 'inherit',
                marginBottom: '10px'
            }
        }>
            <Toolbar sx={{ width: '100%' }}>
                <Container sx={{ maxWidth: '100% !important' }}>
                    <Grid
                    container
                    flexWrap={'nowrap'}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={4}
                    >
                        <Grid item>
                            <Stack direction="row" spacing={2}>
                                <div data-testid="app_name" className="logo" onClick={() => navigate("/game")}>
                                    {t('app_name')}
                                </div>
                                <Button data-testid="nav_game" sx={{ width: '80px' }} variant="contained" onClick={() => navigate("/game")}>
                                    {t('nav_game')}
                                </Button>
                                <Button data-testid="nav_groups" sx={{ width: '80px' }} variant="contained" onClick={() => navigate("/groups")}>
                                    {t('nav_groups')}
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Grid 
                            container 
                            display="flex"
                            direction="row" 
                            justifyContent="flex-end"
                            alignItems="center"
                            >
                                <Grid item>
                                    <Button
                                    variant="contained"
                                    id="profile-button" 
                                    onClick={handleProfileClick} 
                                    aria-controls={profileOpen? 'profile-menu' : undefined}  
                                    aria-expanded={profileOpen? 'true' : undefined}
                                    aria-haspopup='true'
                                    sx={{ textTransform: 'none', marginRight: '15px' }}
                                    >
                                        <img
                                        className="nav-profile-picture"
                                        src={"https://robohash.org/"+user+".png"} 
                                        alt={user} 
                                        />
                                        {user}
                                        <svg 
                                        fill="#ffffff" 
                                        width="24" 
                                        height="24"
                                        onClick={handleProfileClick}
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`
                                            chevron
                                            ${profileChevronRotated ? 'chevron--rotated' : ''}
                                        `}
                                        >
                                            <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 
                                            8.28799L5.98999 9.70199L12 15.713Z"/>
                                        </svg>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                    id="language-button"
                                    onClick={handleLanguageClick}
                                    aria-controls={languageOpen ? 'menu' : undefined}
                                    aria-expanded={languageOpen ? 'true' : undefined}
                                    aria-haspopup='true'
                                    sx={{ textTransform: 'none', color: 'white' }}
                                    >
                                        {t('nav_language')}
                                        <svg
                                            fill="#ffffff"
                                            width="24"
                                            height="24"
                                            onClick={handleLanguageClick}
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`
                                                chevron
                                                ${languageChevronRotated ? 'chevron--rotated' : ''}
                                            `}
                                        >
                                            <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 
                                                8.28799L5.98999 9.70199L12 15.713Z" />
                                        </svg>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Menu 
                                    id="menu" 
                                    open={profileOpen} 
                                    MenuListProps={{ 'aria-labelledby': 'menu-button' }} 
                                    onClose={() => handleClose()} 
                                    anchorEl={profileAnchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 180,
                                    }}
                                    sx={{ marginTop: '5px' }}
                                    >
                                        <MenuItem 
                                        onClick={() => navigate("/profile")} 
                                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            {t('nav_profile')}
                                        </MenuItem>
                                        <MenuItem 
                                        onClick={() => navigate("/")}
                                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            {t('nav_logout')}
                                        </MenuItem>
                                    </Menu>
                                </Grid>
                                <Grid item>
                                    <Menu
                                    id="menu"
                                    open={languageOpen}
                                    MenuListProps={{ 'aria-labelledby': 'menu-button' }}
                                    onClose={() => handleClose()}
                                    anchorEl={languageAnchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    sx={{ marginTop: '5px' }}
                                    >
                                        <MenuItem>
                                            English
                                        </MenuItem>
                                        <MenuItem>
                                            Español
                                        </MenuItem>
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