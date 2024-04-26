import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './nav.scss';
import { useTranslation } from 'react-i18next';
import { AppBar, Container, Toolbar, Grid, Stack, Button, Menu, MenuItem, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{}> = () => 
{
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const value:string= JSON.stringify(localStorage.getItem("isAuthenticated")).replace("\"","").replace("\"","");
    const user = JSON.stringify(localStorage.getItem("username")).replace("\"", "").replace("\"", "");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement | SVGSVGElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [chevronRotated, setChevronRotated] = useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<SVGSVGElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
        setChevronRotated(!chevronRotated);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
        setChevronRotated(false);
    };

    const handleSwitch = () => {
        const language = localStorage.getItem("lang");
        if(language === "es"){
            localStorage.setItem("lang", "en");
            i18n.changeLanguage("en");
        }
        else{
            localStorage.setItem("lang", "es");
            i18n.changeLanguage("es");
        }
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
          case '/scoreboard':
            document.title = t('app_name') + ' - ' + t('nav_scoreboard');
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
                                <div className="logo" onClick={() => navigate("/game")}>
                                    {t('app_name')}
                                </div>
                                <Button sx={{ width: '80px' }} variant="contained" onClick={() => navigate("/game")}>
                                    {t('nav_game')}
                                </Button>
                                <Button sx={{ width: '80px' }} variant="contained" onClick={() => navigate("/groups")}>
                                    {t('nav_groups')}
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
                                    variant="contained"
                                    id="menu-button" 
                                    onClick={handleClick} 
                                    aria-controls={open? 'menu' : undefined}  
                                    aria-expanded={open? 'true' : undefined}
                                    aria-haspopup='true'
                                    sx={{ textTransform: 'none', color: '' }}
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
                                        onClick={handleClick}
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`
                                            chevron
                                            ${chevronRotated ? 'chevron--rotated' : ''}
                                        `}
                                        >
                                            <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 
                                            8.28799L5.98999 9.70199L12 15.713Z"/>
                                        </svg>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Menu 
                                    id="menu" 
                                    open={open} 
                                    MenuListProps={{ 'aria-labelledby': 'menu-button' }} 
                                    onClose={() => handleClose()} 
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
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
                                        <MenuItem>
                                            <img className='flag' src='british-flag.png' alt='British flag' />
                                            <Switch onChange={handleSwitch} />
                                            <img className='flag' src='spanish-flag.png' alt='Spanish flag' />
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