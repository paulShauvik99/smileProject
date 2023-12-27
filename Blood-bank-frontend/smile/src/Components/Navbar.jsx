import React, { useState } from 'react'
import { NavLink} from 'react-router-dom'
import Smile from '../assets/SmileLogo.png'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';




const drawerWidth = 240;

function Navbar (){
    
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => { setMobileOpen((prevState) => !prevState); };
    const container = window !== undefined ? () => window.document.body : undefined;
    const MobNav = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            
            <List>            
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <NavLink className="nav-link " to="/"> Home </NavLink> 
                    </ListItemButton>
                </ListItem>
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <NavLink className="nav-link " to='/request'> Request Blood </NavLink> 
                    </ListItemButton>
                </ListItem>
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <NavLink className="nav-link " to="/donate"> Donate Blood </NavLink> 
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );


    
    return (
        <>
            <div className="outer_nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
                <div className="logo">
                    <img src={Smile} alt="Logo" />
                </div>

                <nav className="menu" >
                    <NavLink className="nav-link " to="/"> Home </NavLink>  
                    <NavLink className="nav-link " to='/request'> Request Blood </NavLink> 
                    <NavLink className="nav-link " to="/donate"> Donate Blood </NavLink> 
                </nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    >
                    {MobNav}
                </Drawer>    
            </div>
        </>
    )
}

export default Navbar