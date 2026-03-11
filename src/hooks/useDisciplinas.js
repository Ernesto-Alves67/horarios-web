import { useState, useCallback, useEffect } from 'react';
import LocalStorageHelper from '../services/localStorage';

export function useDisciplinas() {
  const [schedules, setSchedules] = useState([]);
  const [userData, setUserData] = useState(null);
  const [hasSchedule, setHasSchedule] = useState(false);

  const refreshData = useCallback(() => {
    const savedSchedules = LocalStorageHelper.getSchedules() || [];
    const savedUser = LocalStorageHelper.getUserData();
    setSchedules(savedSchedules);
    setUserData(savedUser);
    setHasSchedule(savedSchedules.length > 0);
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const saveSubject = (newEntry, index = null) => {
    let updated = [...schedules]; // A Xerox!
    if (index !== null) updated[index] = newEntry;
    else updated.push(newEntry);
    
    LocalStorageHelper.setSchedules(updated);
    refreshData();
  };

  const deleteSubject = (index) => {
    const updated = schedules.filter((_, i) => i !== index);
    LocalStorageHelper.setSchedules(updated);
    refreshData();
  };

  const saveUserData = (data) => {
    LocalStorageHelper.setUserData(data);
    setUserData(data);
  }

  return { schedules, userData, hasSchedule, saveSubject, deleteSubject, setUserData , saveUserData};
}