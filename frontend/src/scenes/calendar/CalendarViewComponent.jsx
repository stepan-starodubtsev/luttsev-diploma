import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {Box} from "@mui/material";
import {authStore} from "../../stores/authStore.js";
import {ROLES} from "../../utils/constants.js";

const CalendarViewComponent = ({events, onEventClick, onEventDrop}) => {
    return (
        <Box flex="1 1 100%" ml="15px">
            <FullCalendar
                locale="uk"
                height="75vh"
                plugins={[
                    dayGridPlugin, timeGridPlugin, multiMonthPlugin,
                    interactionPlugin, listPlugin,
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,multiMonthYear,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={authStore.user.role === ROLES.UNIT_COMMANDER}
                selectable={false}
                selectMirror={false}
                dayMaxEvents={true}
                eventClick={onEventClick}
                eventDrop={onEventDrop}
                events={events}
                eventDurationEditable={false}
            />
        </Box>
    );
};

export default CalendarViewComponent;