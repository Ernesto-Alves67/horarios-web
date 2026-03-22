import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import disciplinasRepo from './disciplinas.json';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Instâncias otimizadas carregadas na inicialização
const disciplinasMap = {};
const cursosLista = [];

const initData = (rawJson) => {
  const dataToParse = rawJson.default || rawJson;

  try {
    for (const department in dataToParse) {
      const cursos = dataToParse[department];

      if (!Array.isArray(cursos)) continue;

      for (const curso of cursos) {
        if (curso.nome_curso) {
          cursosLista.push(String(curso.nome_curso).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        }

        if (curso.disciplinas && Array.isArray(curso.disciplinas)) {
          for (const disc of curso.disciplinas) {
            if (disc.codigo_disciplina && disc.nome_disciplina) {
              const cleanCode = String(disc.codigo_disciplina).trim().toUpperCase();
              const cleanName = String(disc.nome_disciplina).trim();
              disciplinasMap[cleanCode] = cleanName;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Erro ao processar o JSON de disciplinas:", err);
  }
};

initData(disciplinasRepo);

// Extração nativa de texto do PDF
export const extractTextFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useWorkerFetch: false }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText.replace(/\uFFFD/g, "").replace(/\s+/g, " ");
  } catch (error) {
    console.error("Erro PDF nativo:", error);
    throw new Error("Falha ao ler PDF.");
  }
};

// Extração do cabeçalho via OCR para dispositivos móveis
export const extractHeaderViaOCR = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useWorkerFetch: false }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2.0 });

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = viewport.width;
    tempCanvas.height = viewport.height * 0.35;
    await page.render({ canvasContext: tempCtx, viewport: viewport }).promise;

    const cropX = 0;
    const cropY = viewport.height * 0.15;
    const cropWidth = viewport.width * 0.62;
    const cropHeight = viewport.height * 0.08;

    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    finalCanvas.width = cropWidth;
    finalCanvas.height = cropHeight;

    finalCtx.drawImage(
      tempCanvas,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    const blob = await new Promise(resolve => finalCanvas.toBlob(resolve, 'image/jpeg', 0.95));

    const formData = new FormData();
    formData.append('file', blob, 'recorte.jpg');
    formData.append('language', 'por');
    formData.append('isOverlayRequired', 'false');
    formData.append('OCREngine', '1');

    const PRIMARY_KEY = import.meta.env.VITE_OCR_API_KEY;
    const FALLBACK_KEY = 'helloworld';

    const fazerRequisicaoOcr = async (chave) => {
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: { 'apikey': chave },
        body: formData
      });
      return await response.json();
    };

    let result;

    try {
      // Tenta a chave principal primeiro
      result = await fazerRequisicaoOcr(PRIMARY_KEY || FALLBACK_KEY);

      // Se a chave principal estourar o limite, usa a chave pública (fallback)
      if (result.IsErroredOnProcessing && PRIMARY_KEY) {
        console.warn(`Erro na API (${result.ErrorMessage}). Usando fallback...`);
        result = await fazerRequisicaoOcr(FALLBACK_KEY);
      }
    } catch (err) {
      // Em caso de erro de rede, tenta a chave pública
      if (PRIMARY_KEY) {
        console.warn("Falha de conexão. Usando fallback...");
        result = await fazerRequisicaoOcr(FALLBACK_KEY);
      } else {
        throw err;
      }
    }

    // Lança erro se a última tentativa falhar
    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage);
    }

    const ocrText = result.ParsedResults?.[0]?.ParsedText || "";
    return ocrText;
  } catch (err) {
    console.error("Erro no OCR do recorte:", err);
    return "";
  }
};

// Processamento dos dados de usuário extraídos do OCR
export const parseOcrUserData = (text) => {
  let nome = "";
  let matricula = "";
  let curso = "";

  const cleanText = text.replace(/\s+/g, " ");

  const matMatch = cleanText.match(/\b(\d{9,11})\b/);
  if (matMatch) matricula = matMatch[1];

  const isColumnar = /Nome:\s*Curso:/i.test(cleanText);

  if (isColumnar && matricula) {
    const afterMatricula = cleanText.substring(cleanText.indexOf(matricula) + matricula.length).trim();

    const cursosOrdenados = cursosLista.sort((a, b) => b.length - a.length);
    const courseRegexDynamic = new RegExp(`(?=${cursosOrdenados.join('|')})`, 'i');

    const matchColunar = afterMatricula.match(new RegExp(`^([A-ZÀ-Ú\\s]+?)\\s+${courseRegexDynamic.source}`, 'i'));

    if (matchColunar) {
      nome = matchColunar[1].trim();
      let rawCurso = afterMatricula.substring(nome.length).trim();
      curso = rawCurso.replace(/\s+(?:catal[ãa]o|cidade|-?\s*Presencial\s*-?).*/ig, '').replace(/\s*-\s*$/, '').trim();
    }
  }
  else {
    const normalNomeMatch = cleanText.match(/Nome:\s*([A-ZÀ-Ú][A-ZÀ-Ú\s]*?)(?=\s*Curso:)/i);
    if (normalNomeMatch) nome = normalNomeMatch[1].trim();

    const normalCursoMatch = cleanText.match(/Curso:\s*(.+?)(?=\s*(?:Forma[çc][ãa]o|Cidade|BACHARELADO|LICENCIATURA|$))/i);
    if (normalCursoMatch) curso = normalCursoMatch[1].replace(/-\s*$/, '').trim();
  }

  return { nome, matricula, curso };
};

// Parser principal para dados nativos do SIGAA
export const parseSigaaPdfText = (text, parseHorarioFn) => {
  const schedules = [];

  const nomeMatch = text.match(/Nome:\s*([^:]{3,50}?(?=\s+(Matrícula|Matricula|Curso|Nível|$)))/i);
  const matriculaMatch = text.match(/(?:Matrícula|Matricula):\s*(\d+)/i);
  const cursoMatch = text.match(/Curso:\s*([^:]{3,100}?(?=\s+(Cidade|Formação|Nível|$)))/i);

  const userData = {
    nome: nomeMatch?.[1]?.trim() || "",
    matricula: matriculaMatch?.[1]?.trim() || "",
    curso: cursoMatch?.[1]?.trim() || ""
  };

  const disciplineRegex = /([A-Z]{3,4}\d{3,4})\s+(.+?)\s+([A-Z0-9]+)\s+(?:MATRICULADO|SOLICITADO|CURSANDO|CADASTRADO)\s+((?:[2-7]+[MTN][1-6]+\s*)+)/gi;

  let match;
  while ((match = disciplineRegex.exec(text)) !== null) {
    const [, codigoRaw, rawName, turmaCod, horarioBruto] = match;

    const codigoClean = String(codigoRaw).trim().toUpperCase();
    let subject = disciplinasMap[codigoClean] || "";

    let teacher = "";
    let location = "";

    let processingText = rawName;

    if (subject) {
      const escapedSubject = subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      processingText = processingText.replace(new RegExp(`^${escapedSubject}`, 'i'), '').trim();
    } else {
      subject = "Disciplina Desconhecida";
    }

    if (processingText.includes("DISCIPLINA")) {
      const parts = processingText.split("DISCIPLINA");
      teacher = parts[0].replace(/Tipo:?/i, '').trim();
      location = parts[1].replace(/Local:?/i, '').trim();
    } else {
      teacher = processingText;
      location = "Não informado";
    }

    if (!teacher || teacher.length < 3) teacher = "Docente não informado";
    if (!location || location.length < 2) location = "Não informado";

    horarioBruto.trim().split(/\s+/).forEach(h => {
      const slots = parseHorarioFn(h);
      slots.forEach(slot => {
        schedules.push({
          codigo: codigoClean,
          subject: subject,
          teacher: teacher,
          location: location,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'ATIVA',
          turma: turmaCod
        });
      });
    });
  }

  return { userData, schedules };
};