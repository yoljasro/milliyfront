import React, { useState, useEffect, ChangeEvent } from 'react';
import { TextField, Button, Box, Typography, Container, CircularProgress, Snackbar, IconButton, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import InputMask from 'react-input-mask';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import { RxAvatar } from "react-icons/rx";
import Slide from '@mui/material/Slide';
import moment from 'moment';
import { keyframes } from '@mui/system';
import styles from '../styles/profile.module.css'


const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        transition: 'all 0.3s ease',
        '&:hover fieldset': {
            borderColor: '#F83B01',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#F83B01',
        },
    },
});

// Entry animation for the whole component
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const changeColors = keyframes`
  0% { background-color: red; }
  25% { background-color: orange; }
  50% { background-color: yellow; }
  75% { background-color: green; }
  100% { background-color: blue; }
`;



interface ProfileData {
    name: string;
    date: string;
    number: string;
    status: string;
    // id: string;
    createdAt?: string;
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData>({ name: '', date: '', number: '', status: 'Новичок', createdAt: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, severity: 'success' | 'error' | undefined, open: boolean }>({ message: '', severity: undefined, open: false });
    const [showDashboard, setShowDashboard] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile);
            const createdAt = parsedProfile.createdAt || new Date().toISOString();
            parsedProfile.status = calculateStatus(createdAt);
            setProfile({ ...parsedProfile, createdAt });
            setShowDashboard(true);
        }
    }, []);

    const calculateStatus = (createdAt: string) => {
        const startDate = moment(createdAt);
        const currentDate = moment();
        const diffMonths = currentDate.diff(startDate, 'months');
        return diffMonths >= 2 ? 'Медиум' : 'Новичок';
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handlePhoneFocus = () => {
        if (!profile.number.startsWith('+998')) {
            setProfile({ ...profile, number: '+998' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async () => {
        if (!profile.name || !profile.date || !profile.number) {
            setSnackbar({ message: 'Все поля должны быть заполнены.', severity: 'error', open: true });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...profile,
                number: profile.number.replace(/[^0-9+]/g, ''),
                createdAt: profile.createdAt || new Date().toISOString(),
            };

            const response = await axios.post('https://backmilliy-production.up.railway.app/profiles', payload);
            if (response.status === 201) {
                setSnackbar({ message: 'Профиль успешно создан!', severity: 'success', open: true });
                setShowDashboard(true);
                localStorage.setItem('profile', JSON.stringify(payload));
                setProfile({ name: '', date: '', number: '', status: 'Новичок', createdAt: '' });
            }
        } catch (error) {
            setSnackbar({ message: 'Ошибка при сохранении профиля.', severity: 'error', open: true });
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSettingsClose = () => {
        setAnchorEl(null);
    };

    const handleUpdateProfile = async () => {
        if (!profile.name || !profile.date || !profile.number) {
            setSnackbar({ message: 'Все поля должны быть заполнены.', severity: 'error', open: true });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...profile,
                number: profile.number.replace(/[^0-9+]/g, ''), // faqat sonlarni qoldirish
            };

            // `profile.id` mavjudligini tekshirib, kerakli ID orqali yangilash
            const response = await axios.put(`https://backmilliy-production.up.railway.app/profiles/${profile.name}`, payload);

            if (response.status === 200) {
                setSnackbar({ message: 'Профиль обновлен!', severity: 'success', open: true });
                localStorage.setItem('profile', JSON.stringify({ ...profile, createdAt: profile.createdAt }));
                setIsEditing(false);
            }
        } catch (error) {
            setSnackbar({ message: 'Ошибка при обновлении профиля.', severity: 'error', open: true });
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteProfile = () => {
        localStorage.removeItem('profile');
        setProfile({ name: '', date: '', number: '', status: 'Новичок', createdAt: '' });
        setSnackbar({ message: 'Профиль удален.', severity: 'success', open: true });
        setShowDashboard(false);
    };

    const handleSwitchProfile = () => {
        // Profilni tozalash va yangi profil tanlash uchun localStorage ni o'chirish
        localStorage.removeItem('profile');
        setProfile({ name: '', date: '', number: '', status: 'Новичок', createdAt: '' });
        setSnackbar({ message: 'Выберите новый профиль.', severity: 'success', open: true });
        setShowDashboard(false);
    };

  
    return (
        <Container maxWidth="sm" sx={{ mt: 0, position: 'relative', animation: `${fadeIn} 0.6s ease-out` }} className={styles.cont}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {isEditing ? 'Редактировать профиль' : 'Создать профиль'}
                </Typography>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    TransitionComponent={Slide}
                >
                    {/* <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert> */}
                </Snackbar>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {!showDashboard && !isEditing && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignContent: 'center', alignItems: "center", gap: 2, mt: 3, padding: "20px", height: "500px", background: '#fff', borderRadius: "12px" , boxShadow: "10px 10px 5px lightblue" }}>
                                <StyledTextField
                                    className={styles.input}
                                    label="Ваше имя"
                                    variant="outlined"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <StyledTextField
                                    label="Дата рождения"
                                    variant="outlined"
                                    name="date"
                                    type="date"
                                    value={profile.date}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <InputMask
                                    mask="+998 99 999 99 99"
                                    value={profile.number}
                                    onChange={handleInputChange}
                                    onFocus={handlePhoneFocus}
                                >
                                    {(inputProps) => (
                                        <StyledTextField
                                            {...inputProps}
                                            label="Номер телефона"
                                            variant="outlined"
                                            name="number"
                                            fullWidth
                                        />
                                    )}
                                </InputMask>
                                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                                    Сохранить
                                </Button>
                            </Box>
                        )}

                        {showDashboard && !isEditing && (
                            <Box sx={{ mt: 4 }}>
                                <Typography sx={{ color: 'red', mb: 3 }} variant="h5">Баллы </Typography>
                                <Box
                                    sx={{
                                        width: '300px',
                                        height: '200px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'red',  // Boshlang'ich rang
                                        borderRadius: '10px',
                                        animation: `${changeColors} 6s infinite`,  // Ranglar animatsiyasi
                                        padding: '10px',
                                    }}
                                >
                                    {/* To'g'ri to'rtburchaklar */}
                                    <Box
                                        sx={{
                                            width: '70px',
                                            height: '70px',
                                            backgroundColor: 'white',
                                            borderRadius: '10px',
                                            color: 'red',
                                            textAlign: "center",
                                            display: 'flex',
                                            justifyContent: "center",
                                            alignItems: 'center',
                                            fontSize: '18px'
                                        }}
                                    >
                                        1
                                    </Box>

                                </Box>
                            </Box>
                        )}
                    </>
                )}

                {showDashboard && (
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                        <IconButton onClick={handleSettingsClick}>
                            <MenuItem sx={{ marginLeft: 0 }}> Jasur</MenuItem>
                            <RxAvatar />
                            <SettingsIcon />
                        </IconButton>
                        <Typography sx={{ color: 'red', mb: 3 }} variant="caption">{profile.status}</Typography>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleSettingsClose}
                        >
                            <MenuItem onClick={() => setIsEditing(true)}>Редактировать профиль</MenuItem>
                            <MenuItem onClick={handleDeleteProfile}>Удалить профиль</MenuItem>
                            <MenuItem onClick={handleSwitchProfile}>Сменить профиль</MenuItem>
                            <MenuItem onClick={handleSettingsClose}>Закрыть</MenuItem>
                        </Menu>
                    </Box>
                )}
            </Box>

            {isEditing && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <StyledTextField
                        label="Ваше имя"
                        variant="outlined"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <StyledTextField
                        label="Дата рождения"
                        variant="outlined"
                        name="date"
                        type="date"
                        value={profile.date}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <InputMask
                        mask="+998 99 999 99 99"
                        value={profile.number}
                        onChange={handleInputChange}
                        onFocus={handlePhoneFocus}
                    >
                        {(inputProps) => (
                            <StyledTextField
                                {...inputProps}
                                label="Номер телефона"
                                variant="outlined"
                                name="number"
                                fullWidth
                            />
                        )}
                    </InputMask>
                    <Button variant="contained" onClick={handleUpdateProfile} sx={{ mt: 2 }}>
                        Сохранить изменения
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Profile;
