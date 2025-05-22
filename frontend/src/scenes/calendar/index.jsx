import React, {useEffect, useMemo, useState} from "react";
import {Box, useTheme} from "@mui/material";
import Header from "../../components/Header";
import {tokens} from "../../theme";

import CalendarViewComponent from "./CalendarViewComponent";
import EventModalComponent from "./EventModalComponent";

import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import repairsStore from '../../stores/repairsStore';
import maintenancesStore from '../../stores/maintenancesStore';
import vehiclesStore from '../../stores/vehiclesStore';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import TopBar from "../global/TopBar.jsx";

dayjs.locale('uk');

const CalendarPage = observer(() => {
    const theme = useTheme();
    const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
    const navigate = useNavigate();

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedEventData, setSelectedEventData] = useState(null);

    useEffect(() => {
        const getVehicleInfoString = (vehicleId) => {
            if (!vehicleId) return 'ТЗ не вказано';
            const vehicle = vehiclesStore.findVehicleById(vehicleId);
            if (vehicle) {
                return `${vehicle.name || 'Без назви'} (${vehicle.licensePlate || 'Без номера'})`;
            }
            return `ТЗ ID: ${vehicleId} (не знайдено)`;
        };

        const repairEvents = repairsStore.repairs.map(repair => {
            const vehicleInfo = getVehicleInfoString(repair.vehicleId);
            return {
                id: `repair-${repair.id}`,
                title: `Ремонт №${repair.id} (${vehicleInfo})`,
                start: repair.date,
                allDay: true,
                color: colors.redAccent[500] || '#D32F2F',
                borderColor: colors.redAccent[600] || '#B71C1C',
                extendedProps: {originalId: repair.id, type: 'repair', originalData: repair}
            };
        });

        const maintenanceEvents = maintenancesStore.maintenances.map(maintenance => {
            const vehicleInfo = getVehicleInfoString(maintenance.vehicleId);
            return {
                id: `maintenance-${maintenance.id}`,
                title: `ТО №${maintenance.id} (${vehicleInfo})`,
                start: maintenance.date,
                allDay: true,
                color: colors.blueAccent[500] || '#1976D2',
                borderColor: colors.blueAccent[600] || '#0D47A1',
                extendedProps: {originalId: maintenance.id, type: 'maintenance', originalData: maintenance}
            };
        });

        setCalendarEvents([...repairEvents, ...maintenanceEvents]);
    }, [repairsStore.repairs, maintenancesStore.maintenances, vehiclesStore.vehicles, colors]);

    const handleCalendarEventClick = (clickInfo) => {
        const {start, extendedProps} = clickInfo.event;
        const originalData = extendedProps.originalData || {};

        let vehicleDisplayInfo = 'ТЗ не вказано';
        if (originalData.vehicleId) {
            const vehicle = vehiclesStore.findVehicleById(originalData.vehicleId);
            if (vehicle) {
                vehicleDisplayInfo = `${vehicle.name || 'Без назви'} (${vehicle.licensePlate || 'Без номера'})`;
            } else {
                vehicleDisplayInfo = `ТЗ ID: ${originalData.vehicleId} (дані не завантажено)`;
            }
        }

        setSelectedEventData({
            title: clickInfo.event.title,
            start: dayjs(start).format('DD.MM.YYYY'),
            type: extendedProps.type,
            originalId: extendedProps.originalId,
            vehicleInfoForModal: vehicleDisplayInfo,
            status: originalData.status,
            workDescription: originalData.workDescription,
            repairReasonText: originalData.repairReasonText,
            maintenanceType: originalData.type,
            notes: originalData.notes,
        });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedEventData(null);
    };

    const handleCalendarEventDrop = async (dropInfo) => {
        const {originalId, type} = dropInfo.event.extendedProps;
        const newStartDate = dropInfo.event.start;

        if (!newStartDate) {
            console.error("Помилка: нова дата не визначена після перетягування.");
            dropInfo.revert();
            return;
        }
        const newDateISO = dayjs(newStartDate).toISOString();

        try {
            if (type === 'repair') {
                const repairToUpdate = repairsStore.repairs.find(r => r.id === originalId);
                if (repairToUpdate) {
                    const updatedData = {...repairToUpdate, date: newDateISO};
                    repairsStore.setTempRepair(updatedData);
                    await repairsStore.updateRepair(originalId);
                } else {
                    throw new Error(`Ремонт з ID ${originalId} не знайдено.`);
                }
            } else if (type === 'maintenance') {
                const maintenanceToUpdate = maintenancesStore.maintenances.find(m => m.id === originalId);
                if (maintenanceToUpdate) {
                    const updatedData = {...maintenanceToUpdate, date: newDateISO};
                    await maintenancesStore.updateMaintenance(originalId, updatedData);
                } else {
                    throw new Error(`ТО з ID ${originalId} не знайдено.`);
                }
            }
        } catch (error) {
            console.error("Помилка оновлення дати події:", error);
            dropInfo.revert();
        }
    };

    return (
        <Box m="20px">
            <TopBar headerBox={(
                <Header title="Календар" subtitle="Огляд Ремонтів та Технічних Обслуговувань"/>
            )}/>
            <Box display="flex" justifyContent="space-between">
                <CalendarViewComponent
                    events={calendarEvents}
                    onEventClick={handleCalendarEventClick}
                    onEventDrop={handleCalendarEventDrop}
                />
            </Box>

            <EventModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                eventData={selectedEventData}
                colors={colors}
                navigate={navigate}
            />
        </Box>
    );
});

export default CalendarPage;