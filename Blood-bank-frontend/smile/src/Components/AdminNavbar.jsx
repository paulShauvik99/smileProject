import React, { useRef, useState } from 'react'
import { NavLink} from 'react-router-dom'
import Smile from '../assets/SmileLogo.png'
import { Backdrop, Box, Button, Chip, Divider, Drawer, Fade, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';


//Add Top Donor Modal Style
const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95rem',
    height : '70rem',
    backgroundColor: 'rgb(214, 205, 205)',
    borderRadius: '1rem',
    borderLeft: '2px solid rgb(214,205,205)',
    borderBottom: '2px solid rgb(214,205,205)',
    boxShadow: 24,
    overflowY : 'scroll',
    p: 4,
    '@media only screen and (max-width : 767px)' : {
        width: '36rem',
        height : '50rem',
    }
};

const drawerWidth = 240;

function AdminNavbar (){

     // Modal State Variables
    const [open,setOpen] = useState(false)
    const handleClose = () => setOpen(false);
    const addTopDonor = () => setOpen(true);
    const [selectedImgs , setSelectedImgs] = useState([])
    const inpRef = useRef(null)

    const topDonorImages = (e) => {
        const imgs = e.target.files;
        if(selectedImgs.length > 5 - imgs.length ){
            toast.error('Max Images cannot exceed 5 ')
            e.target.value = null
        }
        setSelectedImgs([...selectedImgs, ...Array.from(imgs)])
    }


    const handleDelete = (ind) => {
        console.log("deleted")
        var updatedArr= selectedImgs.filter((e,i) => {return i !== ind})
        setSelectedImgs(updatedArr)
    }

    const uploadImg = (e) => {
        console.log(selectedImgs);
        selectedImgs.forEach(files => {console.log(files.name)})
    }
    
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => { setMobileOpen((prevState) => !prevState); };
    const container = window !== undefined ? () => window.document.body : undefined;
    const MobNav = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', fontSize : {xs : '2rem'}, mt : 8 ,  }}>
            <List>            
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' ,  }}>
                        <NavLink className="nav-link"  to="/admindashboard/requestlist"> Request List </NavLink> 
                    </ListItemButton>
                </ListItem>
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <NavLink className="nav-link " to='/admindashboard/donorlist'> Donor List</NavLink> 
                    </ListItemButton>
                </ListItem>
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <button className="nav-link " onClick={addTopDonor} to='#'> Add Top Donor</button> 
                    </ListItemButton>
                </ListItem>
                
            </List>
        </Box>
    );
    
   console.log(selectedImgs)
    
    return (
        <>
            <div className="outer_nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' } , ml : 0.1 }}
                    >
                        <MenuIcon fontSize='large'/>
                    </IconButton>
                </Toolbar>
                <div className="logo">
                    <img src={Smile} alt="Logo" />
                    {/* <h4>Admin Dashboard</h4> */}
                </div>

                <nav className="menu" >
                    <NavLink className="nav-link " to="/admindashboard/requestlist"> Request List</NavLink>  
                    <NavLink className="nav-link " to='/admindashboard/donorlist'> Donor List </NavLink> 
                    <button className='nav-link' to='#' onClick={addTopDonor}> Add Top Donors  </button>
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
            
            {/* Top Donor Modal */}
            <div className="top_donor_modal">
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <div className="add_top_donor">
                                <IconButton sx={{position : 'absolute', right : 30 }} onClick={handleClose}>
                                    <CloseIcon color='#191818'/>
                                </IconButton>
                                <div className="input_files">
                                    <input type="file" ref={inpRef} hidden name="top_donors" multiple max={5} onChange={e => topDonorImages(e)} />
                                    <div className="browse_img" onClick={e => inpRef.current.click()}>
                                        Click to Browse Image
                                    </div>
                                    <div className="img_chips">
                                        {
                                            selectedImgs.map((img,ind) => {
                                                return (
                                                    <Chip color="error" size='small' key={ind} label={img.name}  onDelete={() => handleDelete(ind)} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="inp_img_div">
                                    {
                                        selectedImgs.map((ele , ind)=> {
                                            return (
                                                <img src={URL.createObjectURL(ele)} className='imgs' height='200px' width='auto' alt="image1" />
                                            )
                                        })
                                    }
                                </div>
                                <Button onClick={uploadImg} variant='contained'> Upload </Button>
                            </div>
                        </Box>
                    </Fade>
                </Modal>
                <ToastContainer />
            </div>

        </>
    )
}

export default AdminNavbar