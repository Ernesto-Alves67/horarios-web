import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Extrai todo o texto das páginas do PDF
export const extractTextFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useWorkerFetch: false }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(" ") + "\n";
    }

    // Remove caracteres inválidos e normaliza espaços
    return fullText.replace(/\uFFFD/g, "").replace(/\s+/g, " ");
  } catch (error) {
    console.error("Erro PDF:", error);
    throw new Error("Falha ao ler PDF.");
  }
};

// Converte o texto bruto em objetos de disciplinas e dados do usuário
export const parseSigaaPdfText = (text, parseHorarioFn) => {
  const schedules = [];

  // Captura Nome, Matrícula e Curso
  const nomeMatch = text.match(/Nome:\s*([^:]+?)(?=\s+Matrícula|\s+Curso|$)/i);
  const matriculaMatch = text.match(/Matrícula:\s*(\d+)/i);
  const cursoMatch = text.match(/Curso:\s*([^:]+?)(?=\s+Cidade|\s+Formação|$)/i);

  const userData = {
    nome: nomeMatch?.[1].trim() || "",
    matricula: matriculaMatch?.[1].trim() || "",
    curso: cursoMatch?.[1].trim() || ""
  };

  // Regex para capturar blocos: Código, Nome/Prof, Local, Turma e Horários
  const disciplineRegex = /([A-Z]{3,4}\d{3,4})\s+(.+?)\s+Tipo:\s+DISCIPLINA\s+Local:\s+(.+?)\s+([A-Z])\s+MATRICULADO\s+((?:[2-7]+[MTN][1-6]+\s*)+)/g;

  let match;
  while ((match = disciplineRegex.exec(text)) !== null) {
    const [ , codigo, nameAndTeacher, location, turma, horarioBruto] = match;

    // Separa Disciplina e Professor (assume as 3 primeiras palavras como disciplina)
    const words = nameAndTeacher.trim().split(" ");
    const subject = words.slice(0, 3).join(" ");
    const teacher = words.slice(3).join(" ") || "Ver comprovante";

    // Processa cada horário do bloco (ex: 2T34 5T56)
    horarioBruto.trim().split(/\s+/).forEach(h => {
      const slots = parseHorarioFn(h);
      slots.forEach(slot => {
        schedules.push({
          codigo,
          subject: subject.trim(),
          teacher: teacher.trim(),
          location: location.trim(),
          classCode: turma,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'ATIVA'
        });
      });
    });
  }

  return { userData, schedules };
};