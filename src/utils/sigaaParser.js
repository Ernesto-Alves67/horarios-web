/**
 * Identifica o tipo de HTML exportado do SIGAA analisando o título da página.
 *
 * Procura um elemento <h3> e verifica se ele contém textos que indicam
 * o tipo de comprovante gerado pelo sistema.
 *
 * @param {string} html - Conteúdo HTML completo da página exportada do SIGAA.
 * @returns {"comprovante_solicitacao_matricula" | "comprovante_matricula" | "desconhecido"}
 * Retorna o tipo de comprovante identificado.
 */
const identificarTipoHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const h3 = doc.querySelector("h3");

  if (!h3) {
    return "desconhecido";
  }

  const titulo = h3.textContent
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (titulo.includes("comprovante de solicitação de matrícula")) {
    return "comprovante_solicitacao_matricula";
  }

  if (titulo.includes("comprovante de matrícula")) {
    return "comprovante_matricula";
  }

  return "desconhecido";
};

const normalizeDayKey = (label) =>
  label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const parseHorario = (horario) => {
  if (!horario) return [];
  
  const schedules = [];
  
  // SIGAA format: "35M12" means days 3 and 5, morning shift, slots 1-2
  // Days: 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday, 7=Saturday
  // Shifts: M=Morning, T=Afternoon, N=Night
  // Slots: 1-6 (each represents a time period)
  
  const regex = /([2-7]+)([MTN])(\d+)/g;
  let match;
  
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
        if (DAYS[dayNum]) {
          schedules.push({
            day: normalizeDayKey(DAYS[dayNum]),
            startTime: startTime,
            endTime: endTime
          });
        }
      });
    }
  }
  
  return schedules;
};

const parseHorariosDisciplinaComprovanteMatricula = (html) => {
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

const extractUserData = (html) => {
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

/**
 * Função específica para extrair horários do comprovante de solicitação de matrícula, que tem
 *  uma estrutura diferente do comprovante de matrícula regular.
 */
const parseHorariosDisciplinaComprovanteSolicitacao = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const schedules = [];

  const horariosTabela = associarTabelaHorarioDisciplaSelecionada(doc);
  console.log("Tabela de horários associada:", horariosTabela);
  horariosTabela.forEach(item => {

    const horarios = parseHorario(item.horarioLimpo);

    horarios.forEach((info) => {

      schedules.push({
        codigo: item.codigo,
        subject: item.subject,
        turma: item.turma,
        day: info.day,
        startTime: info.startTime,
        endTime: info.endTime,
        horarioCompleto: item.horarioLimpo
      });

    });

  });
  // tabela correta
  const table = doc.querySelector("table.subFormulario");

  if (!table) {
    console.log("Tabela de horários flexíveis não encontrada.");
    return [];
  }

  const rows = table.querySelectorAll("tr");

  rows.forEach((row, index) => {
    // pular header
    if (index === 0) return;

    const cells = row.querySelectorAll("td");

    if (cells.length < 3) return;

    try {
      const componente = cells[0].textContent.trim();
      const turma = cells[1].textContent.trim();
      const horarioBruto = cells[2].textContent.trim();

      // extrai código e nome
      const codigo = componente.split(" - ")[0];
      const subject = componente.split(" - ")[1] || componente;

      // remove datas
      const horarioLimpo = horarioBruto.replace(/\(.*?\)/g, "").trim();

      const horarios = parseHorario(horarioLimpo);

      horarios.forEach((info) => {
        schedules.push({
          codigo,
          subject,
          turma,
          day: info.day,
          startTime: info.startTime,
          endTime: info.endTime,
          horarioCompleto: horarioLimpo
        });
      });

    } catch (e) {
      console.error("Erro ao processar linha:", e);
    }
  });

  return schedules;
};  

const associarTabelaHorarioDisciplaSelecionada = (doc) => {

  const resultados = [];

  const disciplinasMap = {};

  // -----------------------------------------
  // 1️⃣ Criar mapa codigo -> disciplina
  // -----------------------------------------
  const tabelaTurmas = [...doc.querySelectorAll("table")]
    .find(t => t.textContent.includes("Turmas selecionadas"));

  if (!tabelaTurmas) return resultados;

  tabelaTurmas.querySelectorAll("tbody tr").forEach(row => {

    const cells = row.querySelectorAll("td");
    if (!cells.length) return;

    const texto = cells[0].textContent.trim();

    const partes = texto.split(" - ");

    const codigo = partes[0]?.trim();
    const subject = partes[1]?.trim();

    const turma = cells[1]?.textContent.trim();

    if (codigo) {
      disciplinasMap[codigo] = { subject, turma };
    }

  });

  // -----------------------------------------
  // Encontrar tabela de horários
  // -----------------------------------------
  const tabelaHorarios = [...doc.querySelectorAll("table")]
    .find(t => t.textContent.includes("Horários") && t.textContent.includes("Seg"));

  if (!tabelaHorarios) return resultados;

  const rows = tabelaHorarios.querySelectorAll("tr");

  const diaMap = {
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "7"
  };

  const horariosPorDisciplina = {};

  rows.forEach((row, index) => {

    if (index === 0) return;

    const cells = row.querySelectorAll("td");

    if (cells.length < 7) return;

    const horarioTexto = cells[0].textContent.trim();
    console.log("Processando horário:", horarioTexto);
    let periodo = null;
    let slot = null;

    for (const p in TIME_SLOTS) {

      for (const s in TIME_SLOTS[p]) {

        const t = TIME_SLOTS[p][s];

        const label = `${t.start} - ${t.end}`;

        if (horarioTexto.includes(label)) {

          periodo = p;
          slot = s;

        }

      }

    }

    if (!periodo || !slot) return;

    for (let i = 1; i <= 6; i++) {

      const codigo = cells[i].textContent.trim();

      if (!codigo || codigo === "---") continue;

      const dia = diaMap[i];

      if (!horariosPorDisciplina[codigo]) {
        horariosPorDisciplina[codigo] = [];
      }

      horariosPorDisciplina[codigo].push({
        dia,
        periodo,
        slot
      });

    }
    console.log("Horários por disciplina até agora:", horariosPorDisciplina);
  });

  // -----------------------------------------
  // 3️⃣ Montar horarioLimpo estilo SIGAA
  // -----------------------------------------
  for (const codigo in horariosPorDisciplina) {

    const infos = horariosPorDisciplina[codigo];

    const dias = [...new Set(infos.map(i => i.dia))].sort();

    const periodo = infos[0].periodo;

    // const slots = infos.map(i => i.slot).unique().join("");
    const slots = [...new Set(infos.map(i => i.slot))].join("");

    const horarioLimpo = `${dias.join("")}${periodo}${slots}`;

    resultados.push({
      codigo,
      subject: disciplinasMap[codigo]?.subject || codigo,
      turma: disciplinasMap[codigo]?.turma || "",
      horarioLimpo
    });

  }

  return resultados;

};

const DAYS = {
  '2': 'Segunda',
  '3': 'Terça',
  '4': 'Quarta',
  '5': 'Quinta',
  '6': 'Sexta',
  '7': 'Sábado'
};

/**
 * Mapa de períodos e seus respectivos horários
 */

export const TIME_SLOTS = {
  'M': { // Morning
    '1': { start: '07:10', end: '08:00', label: 'M' },
    '2': { start: '08:00', end: '08:50', label: 'M' },
    '3': { start: '08:50', end: '09:40', label: 'M' },
    '4': { start: '10:00', end: '10:50', label: 'M' },
    '5': { start: '10:50', end: '11:40', label: 'M' },
    '6': { start: '11:40', end: '12:30', label: 'M' }
  },
  'T': { // Afternoon
    '1': { start: '13:00', end: '13:50', label: 'T' },
    '2': { start: '13:50', end: '14:40', label: 'T' },
    '3': { start: '14:40', end: '15:30', label: 'T' },
    '4': { start: '15:50', end: '16:40', label: 'T' },
    '5': { start: '16:40', end: '17:30', label: 'T' },
    '6': { start: '17:30', end: '18:20', label: 'T' }
  },
  'N': { // Night
    '1': { start: '18:20', end: '19:05', label: 'N' },
    '2': { start: '19:15', end: '20:00', label: 'N' },
    '3': { start: '20:00', end: '20:45', label: 'N' },
    '4': { start: '21:05', end: '21:50', label: 'N' },
    '5': { start: '21:50', end: '22:35', label: 'N' }
  }
};

export const detectCharsetFromHtml = (html) => {
  // <meta charset="utf-8">
  const charsetMatch = html.match(/<meta\s+charset=["']?([^"'>\s]+)/i);
  if (charsetMatch) return charsetMatch[1].toLowerCase();

  // <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
  const httpEquivMatch = html.match(
    /<meta\s+http-equiv=["']content-type["'][^>]*charset=([^"'>\s]+)/i
  );
  if (httpEquivMatch) return httpEquivMatch[1].toLowerCase();

  return null;
};

export const readFileWithEncoding = (file, encoding) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file, encoding);
  });


export const processarArquivoHtml = (html) => {
  if (!html || typeof html !== "string") {
    console.error("HTML inválido recebido para processamento.");
    return [];
  }

  const tipo = identificarTipoHtml(html);
  const extractedUser = extractUserData(html);
  if (extractedUser) {
    saveUserData(extractedUser);
    // await registerDevice(extractedUser);
  }
  switch (tipo) {
    case "comprovante_solicitacao_matricula":
      return parseHorariosDisciplinaComprovanteSolicitacao(html);

    case "comprovante_matricula":
      return parseHorariosDisciplinaComprovanteMatricula(html);

    default:
      console.error("Tipo de HTML não reconhecido:", tipo);
      return [];
  }
};
