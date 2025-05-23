// import React from 'react';
// import {Box, Button, IconButton, Modal, Paper, Typography} from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// import {authStore} from "../../stores/authStore.js";
// import {ROLES} from "../../utils/constants.js";

const EventModalComponent = ({isOpen, onClose, eventData, colors, navigate}) => {
    // if (!eventData) {
    //     return null;
    // }
    //
    // const modalStyle = {
    //     position: 'absolute',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     width: {xs: '90%', sm: 450, md: 500},
    //     bgColor: 'background.paper',
    //     border: `1px solid ${colors.grey[700]}`,
    //     borderRadius: '8px',
    //     boxShadow: 24,
    //     p: {xs: 2, sm: 3, md: 4},
    //     color: colors.grey[100],
    // };
    //
    // const handleNavigateToEdit = () => {
    //     const basePath = eventData.type === 'repair' ? '/military_personnel/edit-repair' : '/exercises/edit-maintenance';
    //     navigate(`${basePath}/${eventData.originalId}`);
    //     onClose();
    // };
    //
    // return (
    //     <Modal
    //         open={isOpen}
    //         onClose={onClose}
    //         aria-labelledby="event-details-modal-title"
    //         aria-describedby="event-details-modal-description"
    //     >
    //         <Paper sx={modalStyle}>
    //             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    //                 <Typography id="event-details-modal-title" variant="h5" component="h2"
    //                             sx={{
    //                                 color: eventData.type === 'repair' ? (colors.redAccent[400] || 'red')
    //                                     : (colors.blueAccent[400] || 'blue')
    //                             }}>
    //                     {eventData.type === 'repair' ? 'Деталі Ремонту' : 'Деталі ТО'}
    //                 </Typography>
    //                 <IconButton onClick={onClose} size="small" sx={{color: colors.grey[100]}}>
    //                     <CloseIcon/>
    //                 </IconButton>
    //             </Box>
    //
    //             <Typography variant="subtitle1" gutterBottom><strong>Подія:</strong> {eventData.title}</Typography>
    //             <Typography gutterBottom><strong>ID Запису:</strong> {eventData.originalId}</Typography>
    //             <Typography gutterBottom><strong>Транспортний засіб:</strong> {eventData.vehicleInfoForModal}
    //             </Typography>
    //             <Typography gutterBottom><strong>Дата:</strong> {eventData.start}
    //             </Typography>
    //             {eventData.status && <Typography gutterBottom><strong>Статус:</strong> {eventData.status}</Typography>}
    //
    //             {eventData.type === 'repair' && (
    //                 <>
    //                     {eventData.repairReasonText && <Typography variant="body2" sx={{mt: 1}}>
    //                         <strong>Причина:</strong> {eventData.repairReasonText}
    //                     </Typography>}
    //                     {eventData.workDescription && <Typography variant="body2" sx={{mt: 1}}><strong>Опис виконаних
    //                         робіт:</strong> {eventData.workDescription}</Typography>}
    //                 </>
    //             )}
    //             {eventData.type === 'maintenance' && (
    //                 <>
    //                     {eventData.maintenanceType && <Typography variant="body2" sx={{mt: 1}}><strong>Тип
    //                         ТО:</strong> {eventData.maintenanceType}</Typography>}
    //                     {eventData.notes &&
    //                         <Typography variant="body2" sx={{mt: 1}}><strong>Примітки:</strong> {eventData.notes}
    //                         </Typography>}
    //                 </>
    //             )}
    //
    //             <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1}}>
    //                 {authStore.user.role === ROLES.UNIT_COMMANDER ? <Button
    //                     variant="contained"
    //                     sx={{
    //                         backgroundColor: eventData.type === 'repair' ? (colors.redAccent[500] || 'red')
    //                             : (colors.blueAccent[500] || 'blue'),
    //                         '&:hover': {
    //                             backgroundColor: eventData.type === 'repair' ? (colors.redAccent[600] || 'darkred')
    //                                 : (colors.blueAccent[600] || 'darkblue'),
    //                         }
    //                     }}
    //                     onClick={handleNavigateToEdit}
    //                 >
    //                     Редагувати
    //                 </Button> : null}
    //             </Box>
    //         </Paper>
    //     </Modal>
    // );
};

export default EventModalComponent;