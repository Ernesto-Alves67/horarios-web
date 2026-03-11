import { TIME_SLOTS } from './sigaaParser';

export const DIAS = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca',   label: 'Terça-feira' },
  { value: 'quarta',  label: 'Quarta-feira' },
  { value: 'quinta',  label: 'Quinta-feira' },
  { value: 'sexta',   label: 'Sexta-feira' },
  { value: 'sabado',  label: 'Sábado' },
];

export const DAY_NAMES = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
}

export const EMPTY_FORM = {
  subject: '', teacher: '', day: 'segunda', period: 'M',
  startSlot: '', endSlot: '', location: '',
};

export const getSlotsFromTimes = (startTime, endTime) => {
  for (const [period, slots] of Object.entries(TIME_SLOTS)) {
    const startSlot = Object.keys(slots).find(key => slots[key].start === startTime);
    const endSlot = Object.keys(slots).find(key => slots[key].end === endTime);
    if (startSlot && endSlot) return { period, startSlot, endSlot };
  }
  return { period: 'M', startSlot: '', endSlot: '' };
};


//======================= DAILY
export const DAYS_MAP = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

export const formatLongDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('pt-BR', options);
};

export const filterClassesByDay = (schedules, date) => {
  if (!schedules) return [];
  
  const dayName = DAYS_MAP[date.getDay()];
  
  return schedules
    .filter(s => s.day?.toLowerCase() === dayName)
    .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
};

//===================================== WEEKLY
export const organizeSchedulesByDay = (schedules) => {
  const organized = { segunda: [], terca: [], quarta: [],  quinta: [], sexta: [], sabado: [] };
  
  if (!schedules) return organized;

  schedules.forEach(schedule => {
    const day = schedule.day?.toLowerCase();
    if (organized[day]) organized[day].push(schedule);
  });

  Object.keys(organized).forEach(day => {
    organized[day].sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
  });

  return organized;
};

export const getVisibleSlots = (TIME_SLOTS, weekSchedule) => {
  const allSlots = [];
  ['M', 'T', 'N'].forEach(shift => {
    const shiftSlots = TIME_SLOTS[shift];
    if (shiftSlots) {
      Object.keys(shiftSlots).forEach(key => {
        allSlots.push({ ...shiftSlots[key], label: `${shift}${key}` });
      });
    }
  });


  const findClass = (dayKey, slot) => {
    const dayClasses = weekSchedule[dayKey];
    return dayClasses?.find(cls => cls.startTime <= slot.start && cls.endTime >= slot.end);
  };

  
  const lastIndex = allSlots.reduce((last, slot, index) => {
    const hasClass = Object.keys(DAY_NAMES).some(dayKey => !!findClass(dayKey, slot));
    return hasClass ? index : last;
  }, -1);

  return {
    visibleSlots: lastIndex !== -1 ? allSlots.slice(0, lastIndex + 1) : allSlots,
    findClass
  };
};