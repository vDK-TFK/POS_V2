'use client'
import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'moment/locale/es';

const MyCalendar = ({ fechas }) => {
  const localizer = useMemo(() => momentLocalizer(moment), []);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.WEEK);

  const onNavigate = useCallback((newDate) => setDate(newDate), []);
  const onView = useCallback((newView) => setView(newView), []);

  // Solo generar eventos si hay fechas
  const demoEvents = useMemo(() => {
    if (fechas.length > 0) {
      return fechas.map((asistencia) => {
        const entrada = moment(asistencia.fechaHoraEntrada, "YYYY-MM-DDTHH:mm:ss").toDate();
        const salida = asistencia.fechaHoraSalida 
          ? moment(asistencia.fechaHoraSalida, "YYYY-MM-DDTHH:mm:ss").toDate() 
          : moment(asistencia.fechaHoraEntrada, "YYYY-MM-DDTHH:mm:ss").add(1, 'hours').toDate(); // Ejemplo: suma 1 hora si no hay salida

        return {
          title: asistencia.observacion || '', 
          start: entrada,
          end: salida,
        };
      });
    }
    return [];
  }, [fechas]);

  return (
    <div className="shadow-lg bg-white dark:bg-gray-700 p-4 rounded-lg">
      <div className="col-md-12 px-0">
        <Calendar
          localizer={localizer}
          events={demoEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 580 }}
          messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            noEventsInRange: 'No hay eventos en este rango.',
            day: "Día",
            date: "Fecha",
            event: "Nota",
            time: "Hora"
          }}
          date={date}
          view={view}
          onNavigate={onNavigate}
          onView={onView}
        />
      </div>
    </div>
  );
}

export default MyCalendar;
