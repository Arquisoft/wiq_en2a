import React, { useState } from 'react';
import './nav.css';
import { useTranslation } from 'react-i18next';
import {AppBar, Container, Toolbar, Grid, Stack, Button, Menu, MenuItem} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{}> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const value :string= JSON.stringify( localStorage.getItem("isAuthenticated")).replace("\"","").replace("\"","");
    const user =  JSON.stringify(localStorage.getItem("username")).replace("\"", "").replace("\"", "");
    const [open, setOpenMenu] = useState(false);
    

    if(value === "false"){
        navigate("/");
    } 

    return (
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
                        <Grid>
                            <Button variant="text" id="menu-button" color='inherit' onClick={()=>setOpenMenu(!open)}>
                                {user}
                            </Button>
                        </Grid>
                    </Grid>
                    
                    <Menu id="menu" open={open} MenuListProps={{'aria-labelledby':'menu-button'}} onClose={()=>setOpenMenu(!open)}>
                        <MenuItem onClick={()=> navigate("/profile")}>My account</MenuItem>
                        <MenuItem onClick={()=> navigate("/")}>Logout</MenuItem>
                    </Menu>
                </Container>
            </Toolbar>
        </AppBar>
    )
};

export default NavBar;