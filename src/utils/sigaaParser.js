
/**
 * Utility to parse SIGAA HTML content
 */

export const TIME_SLOTS = {
  'M': { // Morning
    '1': { start: '07:00', end: '07:50', label: 'M1' },
    '2': { start: '07:50', end: '08:40', label: 'M2' },
    '3': { start: '08:55', end: '09:45', label: 'M3' },
    '4': { start: '09:45', end: '10:35', label: 'M4' },
    '5': { start: '10:50', end: '11:40', label: 'M5' },
    '6': { start: '11:40', end: '12:30', label: 'M6' }
  },
  'T': { // Afternoon
    '1': { start: '13:00', end: '13:50', label: 'T1' },
    '2': { start: '13:50', end: '14:40', label: 'T2' },
    '3': { start: '14:55', end: '15:45', label: 'T3' },
    '4': { start: '15:45', end: '16:35', label: 'T4' },
    '5': { start: '16:50', end: '17:40', label: 'T5' },
    '6': { start: '17:40', end: '18:30', label: 'T6' }
  },
  'N': { // Night
    '1': { start: '19:00', end: '19:50', label: 'N1' },
    '2': { start: '19:50', end: '20:40', label: 'N2' },
    '3': { start: '20:55', end: '21:45', label: 'N3' },
    '4': { start: '21:45', end: '22:35', label: 'N4' }
  }
};

export const parseHorario = (horario) => {
  if (!horario) return [];
  
  const schedules = [];
  
  // SIGAA format: "35M12" means days 3 and 5, morning shift, slots 1-2
  // Days: 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday, 7=Saturday
  // Shifts: M=Morning, T=Afternoon, N=Night
  // Slots: 1-6 (each represents a time period)
  
  const regex = /([2-7]+)([MTN])(\d+)/g;
  let match;
  
  const dayMap = {
    '2': 'segunda',
    '3': 'terca',
    '4': 'quarta',
    '5': 'quinta',
    '6': 'sexta',
    '7': 'sabado'
  };
  
  const timeSlots = TIME_SLOTS;
  
  while ((match = regex.exec(horario)) !== null) {
    const days = match[1].split('');
    const shift = match[2];
    const slots = match[3].split('');
    
    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];
    
    if (timeSlots[shift] && timeSlots[shift][firstSlot] && timeSlots[shift][lastSlot]) {
      const startTime = timeSlots[shift][firstSlot].start;
      const endTime = timeSlots[shift][lastSlot].end;
      
      days.forEach(dayNum => {
        if (dayMap[dayNum]) {
          schedules.push({
            day: dayMap[dayNum],
            startTime: startTime,
            endTime: endTime
          });
        }
      });
    }
  }
  
  return schedules;
};

export const parseScheduleFromHTML = (html) => {
  // Create a temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const allSchedules = [];
  
  // Find all <table> elements
  const tables = doc.querySelectorAll('table');
  
  if (tables.length === 0) {
    console.log('Nenhuma tabela encontrada no documento HTML.');
    return [];
  }
  
  // Process each table (similar to Kotlin implementation)
  tables.forEach((table, tableIndex) => {
    const rows = table.querySelectorAll('tbody tr');
    
    // Check if it's likely a schedule table by checking headers or content if needed
    // Assuming the logic from SigaaScreen is correct about index skipping or specific structure
    // Original SigaaScreen logic below:
    
    // Skip identification tables (index 0 and 2 in original structure)
    // IMPORTANT: This heuristic relies on specific page structure. 
    // Ideally we should look for specific table classes or headers.
    if (tableIndex === 0 || tableIndex === 2) {
      return;
    }
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      
      try {
        // Extract data following the SIGAA HTML structure
        // cells[0] = código
        // cells[1] = component curricular + local + docente
        // cells[2] = turma
        // cells[3] = status
        // cells[4] = horário
        
        if (cells.length >= 5) {
            // Check if it looks like schedule data
            // Usually cell[0] has a code (e.g. EC01)
            
            const componenteCurricular = cells[1].querySelector('span.componente')?.textContent?.trim() || 
                                       cells[1].textContent?.split('\n')[0]?.trim() || ''; // Fallback
            
            // Try to find local
            let local = '';
            const localEl = cells[1].querySelector('span.local');
            if (localEl) {
                local = localEl.textContent?.trim().replace(/^\s*Local\s*:\s*/i, '').trim() || '';
            } else {
                // Try to find text "Local:"
                const text = cells[1].textContent || '';
                if (text.includes('Local:')) {
                   const parts = text.split('Local:');
                   if (parts.length > 1) {
                       local = parts[1].split(/\n/)[0].trim();
                   }
                }
            }


            // Try to find docente
            let docente = '';
            const docenteEl = cells[1].querySelector('span.docente');
            if (docenteEl) {
                docente = docenteEl.textContent?.trim() || '';
            } else {
                 // Try to find text "Docente(s):" (guessing common label if span not found)
                 // This might need more robust parsing if spans are missing
            }

          
          // Get schedule and clean it (remove parentheses content)
          const horarioBruto = cells[4]?.textContent?.trim() || '';
          const horarioLimpo = horarioBruto.replace(/\s*\(.*?\)/g, '');
          
          // Parse the schedule string to extract days and times
          // Format example: "35M12 (30/12/2024 - 03/05/2025)"
          const scheduleInfo = parseHorario(horarioLimpo);
          
          scheduleInfo.forEach(info => {
            const schedule = {
              codigo: cells[0]?.textContent?.trim() || '',
              subject: componenteCurricular,
              teacher: docente,
              turma: cells[2]?.textContent?.trim() || '',
              status: cells[3]?.textContent?.trim() || '',
              day: info.day,
              startTime: info.startTime,
              endTime: info.endTime,
              location: local,
              horarioCompleto: horarioLimpo
            };
            
            if (schedule.subject) {
              allSchedules.push(schedule);
            }
          });
        }
      } catch (e) {
        console.error('Erro ao processar linha da tabela:', e);
      }
    });
  });
  
  return allSchedules;
};

export const extractUserData = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find the identification table (id="identificacao")
  const identificacaoTable = doc.querySelector('table#identificacao');
  
  if (!identificacaoTable) {
    console.log('Tabela de identificação não encontrada.');
    return null;
  }
  
  const dataMap = {};
  const rows = identificacaoTable.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    
    // Process first pair of cells
    if (cells.length >= 2) {
      const key = cells[0].textContent.replace(':', '').trim();
      const strongValue = cells[1].querySelector('strong');
      const value = strongValue ? strongValue.textContent.trim() : cells[1].textContent.trim();
      dataMap[key] = value;
    }
    
    // Process second pair of cells (if exists)
    if (cells.length >= 4) {
      const key2 = cells[2].textContent.replace(':', '').trim();
      const strongValue2 = cells[3].querySelector('strong');
      const value2 = strongValue2 ? strongValue2.textContent.trim() : cells[3].textContent.trim();
      dataMap[key2] = value2;
    }
  });
  
  // Extract user data following the Kotlin structure
  const userData = {
    periodoLetivo: dataMap['Período Letivo'] || dataMap['Periodo Letivo'] || '',
    matricula: dataMap['Matrícula'] || dataMap['Matricula'] || '',
    nome: dataMap['Nome'] || '',
    curso: dataMap['Curso'] || '',
    formacao: dataMap['Formação'] || dataMap['Formacao'] || ''
  };
  
  return userData;
};
