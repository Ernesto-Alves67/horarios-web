import { TIME_SLOTS } from './sigaaParser';

export const DIAS = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca',   label: 'Terça-feira' },
  { value: 'quarta',  label: 'Quarta-feira' },
  { value: 'quinta',  label: 'Quinta-feira' },
  { value: 'sexta',   label: 'Sexta-feira' },
  { value: 'sabado',  label: 'Sábado' },
];

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