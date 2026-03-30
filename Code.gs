// ============================================================
// ESCALANTE PRO — Backend (Code.gs)
// GTAM | Sistema de Gerenciamento de Turno de Serviço
// ============================================================

const SHEETS = {
  EFETIVO:       'Efetivo',
  ESCALAS:       'Escalas',
  PLANTOES:      'Plantoes',
  AFASTAMENTOS:  'Afastamentos',
  FERIAS:        'Ferias',
  FALTAS:        'Faltas',
  BANCO_HORAS:   'Banco_Horas',
  CONFIGURACOES: 'Configuracoes',
  USUARIOS:      'Usuarios',
  LOGS:          'Logs_Auditoria'
};

const VACATION_DAYS = 30;

// ── Entry Points ─────────────────────────────────────────
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doGet() {
  const user = checkAuth();
  const template = HtmlService.createTemplateFromFile('index');
  template.initialAuth = JSON.stringify(user);
  
  return template.evaluate()
    .setTitle('Escalante Pro — GTAM')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function handleRequest(action, data) {
  const user = checkAuth();
  const adminActions = ['getUsuarios', 'statusUsuario'];
  
  // Bloqueio de segurança: Apenas usuários ATIVOS podem executar ações, exceto 'requestAccess' e 'checkAuth'
  if (action !== 'checkAuth' && action !== 'requestAccess' && (!user || user.status !== 'ATIVO')) {
    writeLog('UNAUTHORIZED_ACCESS', `Tentativa de executar ${action} sem permissão ativada.`);
    return { error: 'Acesso não autorizado ou sua conta está pendente de aprovação.' };
  }

  if (adminActions.includes(action) && !['admin', 'gestor'].includes(String(user && user.nivel).toLowerCase())) {
    writeLog('FORBIDDEN_ADMIN_ACTION', `Usuário ${user.email || 'desconhecido'} tentou executar ${action}.`);
    return { error: 'Apenas administradores autorizados podem executar esta ação.' };
  }

  try {
    // Validação de entrada para ações de escrita
    if (['add', 'update', 'delete', 'toggle'].some(prefix => action.startsWith(prefix))) {
      const v = validateInput(action, data);
      if (!v.valid) return { error: v.message };
      writeLog(action, JSON.stringify(data));
    }

    switch (action) {
      // Efetivo
      case 'getEfetivo':              return getEfetivo();
      case 'addEfetivo':              return addEfetivo(data);
      case 'updateEfetivo':           return updateEfetivo(data.id, data);
      case 'toggleEfetivo':           return toggleEfetivo(data.id);
      // Escalas
      case 'getEscalas':              return getEscalas(data);
      case 'addEscala':               return addEscala(data);
      case 'deleteEscala':            return deleteEscala(data.id);
      // Plantões
      case 'getPlantoes':             return getPlantoes(data);
      case 'addPlantao':              return addPlantao(data);
      case 'deletePlantao':           return deletePlantao(data.id);
      // Afastamentos
      case 'getAfastamentos':         return getAfastamentos();
      case 'addAfastamento':          return addAfastamento(data);
      case 'encerrarAfastamento':     return encerrarAfastamento(data.id);
      // Férias
      case 'getFerias':               return getFerias();
      case 'addFerias':               return addFerias(data);
      case 'deleteFerias':            return deleteFerias(data.id);
      // Faltas
      case 'getFaltas':               return getFaltas();
      case 'addFalta':                return addFalta(data);
      case 'deleteFalta':             return deleteFalta(data.id);
      // Banco de Horas
      case 'getBancoHoras':           return getBancoHoras();
      case 'addBancoHoras':           return addBancoHoras(data);
      case 'deleteBancoHoras':        return deleteBancoHoras(data.id);
      // Autenticação Google
      case 'checkAuth':               return user;
      case 'requestAccess':           return requestAccess(data);
      // Dashboard
      case 'getDashboard':            return getDashboard();
      // Gestão de Usuários
      case 'getUsuarios':             return getUsuarios();
      case 'statusUsuario':          return statusUsuario(data.id, data.status);
      default:
        return { error: 'Ação não reconhecida: ' + action };
    }
  } catch (e) {
    writeLog('ERROR_SYSTEM', e.message);
    return { error: e.message };
  }
}

// ── Helpers ──────────────────────────────────────────────
function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function sheetToObjects(sheet) {
  try {
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    const headers = data[0].map(h => String(h).toLowerCase().trim()); // Normaliza cabeçalhos
    
    return data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { 
        if (h) obj[h] = row[i]; 
      });
      // Adiciona índices fixos como fallback
      obj._raw = row; 
      return obj;
    }).filter(r => r.id !== '' && r.id !== null);
  } catch (e) {
    console.error('Erro em sheetToObjects: ' + e.toString());
    return [];
  }
}

function nextId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 1;
  const ids = data.slice(1).map(r => parseInt(r[0]) || 0);
  return Math.max(...ids) + 1;
}

function toDateStr(v) {
  if (!v) return '';
  if (v instanceof Date) {
    const tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
    return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  }
  return String(v).split('T')[0];
}

function daysBetween(d1, d2) {
  const a = new Date(d1), b = new Date(d2);
  return Math.ceil((b - a) / 86400000) + 1;
}

function today() {
  return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd');
}

// ── EFETIVO ──────────────────────────────────────────────
function getEfetivo() {
  const rows = sheetToObjects(getSheet(SHEETS.EFETIVO));
  return rows.map(r => ({ ...r, data_admissao: toDateStr(r.data_admissao) }));
}

function addEfetivo(d) {
  const s = getSheet(SHEETS.EFETIVO);
  const id = nextId(s);
  s.appendRow([
    id, d.nome, d.nome_de_guerra || '', d.matricula, d.posto_graduacao,
    d.tipo_escala, d.grupo_turno || '', Number(d.antiguidade) || 999,
    true, d.data_admissao || today(), d.observacoes || ''
  ]);
  return { success: true, id };
}

function updateEfetivo(id, d) {
  const s = getSheet(SHEETS.EFETIVO);
  const rows = s.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      s.getRange(i + 1, 1, 1, 11).setValues([[
        id, d.nome, d.nome_de_guerra || rows[i][2], d.matricula, d.posto_graduacao,
        d.tipo_escala, d.grupo_turno || rows[i][6],
        Number(d.antiguidade) || rows[i][7],
        rows[i][8], d.data_admissao || toDateStr(rows[i][9]),
        d.observacoes || rows[i][10]
      ]]);
      return { success: true };
    }
  }
  return { success: false, error: 'Não encontrado' };
}

function toggleEfetivo(id) {
  const s = getSheet(SHEETS.EFETIVO);
  const rows = s.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      const novoStatus = !rows[i][8];
      s.getRange(i + 1, 9).setValue(novoStatus);
      return { success: true, ativo: novoStatus };
    }
  }
  return { success: false };
}

// ── ESCALAS ──────────────────────────────────────────────
function getEscalas(params) {
  const rows = sheetToObjects(getSheet(SHEETS.ESCALAS))
    .map(r => ({ ...r, data: toDateStr(r.data) }));
  if (params && params.mes && params.ano) {
    return rows.filter(r => {
      const d = new Date(r.data + 'T00:00:00');
      return (d.getMonth() + 1) == params.mes && d.getFullYear() == params.ano;
    });
  }
  return rows;
}

function addEscala(d) {
  const s = getSheet(SHEETS.ESCALAS);
  const existentes = sheetToObjects(s).map(r => ({ ...r, data: toDateStr(r.data) }));
  const duplicado = existentes.some(r =>
    String(r.efetivo_id) === String(d.efetivo_id) &&
    toDateStr(r.data) === toDateStr(d.data)
  );
  if (duplicado) {
    return { success: false, error: 'Este integrante já está escalado nesta data.' };
  }
  const id = nextId(s);
  const row = [id, d.data, d.efetivo_id, d.turno, d.funcao || 'Servidor', d.equipe || '', d.status || 'CONFIRMADO', d.observacoes || ''];
  const last = s.getLastRow() + 1;
  const range = s.getRange(last, 1, 1, row.length);
  range.setNumberFormat('@'); // Força texto simples em todo o intervalo para segurança
  range.setValues([row]);
  return { success: true, id };
}

function deleteEscala(id) {
  return deleteRow(SHEETS.ESCALAS, id);
}

// ── PLANTÕES ─────────────────────────────────────────────
function getPlantoes(params) {
  const rows = sheetToObjects(getSheet(SHEETS.PLANTOES))
    .map(r => ({ ...r, data: toDateStr(r.data) }));
  if (params && params.mes && params.ano) {
    return rows.filter(r => {
      const d = new Date(r.data + 'T00:00:00');
      return (d.getMonth() + 1) == params.mes && d.getFullYear() == params.ano;
    });
  }
  return rows;
}

function addPlantao(d) {
  const s = getSheet(SHEETS.PLANTOES);
  const id = nextId(s);
  const row = [id, d.data, d.efetivo_id, d.tipo_plantao, d.local || '', d.status || 'CONFIRMADO', d.observacoes || ''];
  const last = s.getLastRow() + 1;
  const range = s.getRange(last, 1, 1, row.length);
  range.setNumberFormat('@');
  range.setValues([row]);
  return { success: true, id };
}

function deletePlantao(id) {
  return deleteRow(SHEETS.PLANTOES, id);
}

// ── AFASTAMENTOS ─────────────────────────────────────────
function getAfastamentos() {
  return sheetToObjects(getSheet(SHEETS.AFASTAMENTOS)).map(r => ({
    ...r,
    data_inicio: toDateStr(r.data_inicio),
    data_fim:    toDateStr(r.data_fim)
  }));
}

function addAfastamento(d) {
  const s = getSheet(SHEETS.AFASTAMENTOS);
  const id = nextId(s);
  const dias = daysBetween(d.data_inicio, d.data_fim);
  const row = [id, d.efetivo_id, d.tipo, d.data_inicio, d.data_fim, dias, d.motivo || '', d.documento || '', 'ATIVO'];
  const last = s.getLastRow() + 1;
  const range = s.getRange(last, 1, 1, row.length);
  range.setNumberFormat('@');
  range.setValues([row]);
  return { success: true, id };
}

function encerrarAfastamento(id) {
  const s = getSheet(SHEETS.AFASTAMENTOS);
  const rows = s.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      s.getRange(i + 1, 9).setValue('ENCERRADO');
      return { success: true };
    }
  }
  return { success: false };
}

// ── FÉRIAS ───────────────────────────────────────────────
function getFerias() {
  return sheetToObjects(getSheet(SHEETS.FERIAS)).map(r => ({
    ...r,
    data_inicio: toDateStr(r.data_inicio),
    data_fim:    toDateStr(r.data_fim)
  }));
}

function addFerias(d) {
  const s = getSheet(SHEETS.FERIAS);
  const id = nextId(s);
  const diasGozados = daysBetween(d.data_inicio, d.data_fim);
  const row = [id, d.efetivo_id, d.ano_referencia, VACATION_DAYS, d.data_inicio, d.data_fim, diasGozados, 'AGENDADO'];
  const last = s.getLastRow() + 1;
  const range = s.getRange(last, 1, 1, row.length);
  range.setNumberFormat('@');
  range.setValues([row]);
  return { success: true, id };
}

function deleteFerias(id) {
  return deleteRow(SHEETS.FERIAS, id);
}

// ── FALTAS ───────────────────────────────────────────────
function getFaltas() {
  return sheetToObjects(getSheet(SHEETS.FALTAS)).map(r => ({
    ...r, data: toDateStr(r.data)
  }));
}

function addFalta(d) {
  const s = getSheet(SHEETS.FALTAS);
  const id = nextId(s);
  const row = [id, d.efetivo_id, d.data, d.tipo, d.justificativa || '', d.documento || '', 'REGISTRADO'];
  const last = s.getLastRow() + 1;
  const range = s.getRange(last, 1, 1, row.length);
  range.setNumberFormat('@');
  range.setValues([row]);
  return { success: true, id };
}

function deleteFalta(id) {
  return deleteRow(SHEETS.FALTAS, id);
}

// ── BANCO DE HORAS ───────────────────────────────────────
function getBancoHoras() {
  return sheetToObjects(getSheet(SHEETS.BANCO_HORAS)).map(r => ({
    ...r, data: toDateStr(r.data), data_registro: toDateStr(r.data_registro)
  }));
}

function addBancoHoras(d) {
  const s = getSheet(SHEETS.BANCO_HORAS);
  const id = nextId(s);
  s.appendRow([id, d.efetivo_id, d.data, d.tipo, parseFloat(d.horas), d.motivo || '', d.aprovado_por || '', today()]);
  return { success: true, id };
}

function deleteBancoHoras(id) {
  return deleteRow(SHEETS.BANCO_HORAS, id);
}

// ── DASHBOARD ────────────────────────────────────────────
function getDashboard() {
  const hj         = today();
  const efetivo    = getEfetivo();
  const ativos     = efetivo.filter(e => e.ativo === true || e.ativo === 'TRUE' || e.ativo === 'true');
  const escalas    = sheetToObjects(getSheet(SHEETS.ESCALAS)).map(r => ({...r, data: toDateStr(r.data)}));
  const plantoes   = sheetToObjects(getSheet(SHEETS.PLANTOES)).map(r => ({...r, data: toDateStr(r.data)}));
  const afast      = getAfastamentos();
  const ferias     = getFerias();
  const faltas     = getFaltas();
  const banco      = getBancoHoras();

  const em30       = new Date(); em30.setDate(em30.getDate() + 30);
  const em30str    = Utilities.formatDate(em30, 'America/Sao_Paulo', 'yyyy-MM-dd');

  const afastAtivos = afast.filter(a => a.status === 'ATIVO' && a.data_inicio <= hj && a.data_fim >= hj);
  const feriasProx  = ferias.filter(f => f.status === 'AGENDADO' && f.data_inicio >= hj && f.data_inicio <= em30str);
  
  // Escala hoje (agrupada por equipe)
  const escHojeRaw = getEscalas().filter(e => e.data === hj);
  const escalaHoje = escHojeRaw.map(e => {
    const ef = ativos.find(x => String(x.id) === String(e.efetivo_id));
    return { ...e, nome: ef ? ef.nome : '?', matricula: ef ? ef.matricula : '?' };
  });

  // Cálculo de Rankings (30 dias)
  const d30 = new Date(); d30.setDate(d30.getDate() - 30);
  const d30str = toDateStr(d30);
  
  // Produtividade: Total de Espalas + Plantões nos últimos 30 dias
  const rankProd = ativos.map(e => {
    const totalEsc = sheetToObjects(getSheet(SHEETS.ESCALAS)).filter(r => String(r.efetivo_id) === String(e.id) && toDateStr(r.data) >= d30str).length;
    const totalPlan = sheetToObjects(getSheet(SHEETS.PLANTOES)).filter(r => String(r.efetivo_id) === String(e.id) && toDateStr(r.data) >= d30str).length;
    return { nome: e.nome, matricula: e.matricula, total: totalEsc + totalPlan };
  }).sort((a, b) => b.total - a.total).slice(0, 5);

  // Assiduidade (Afastamentos de saúde nos últimos 180 dias)
  const d180 = new Date(); d180.setDate(d180.getDate() - 180);
  const d180str = toDateStr(d180);
  const rankAssid = ativos.map(e => {
    const totalAbs = afast.filter(r => String(r.efetivo_id) === String(e.id) && r.tipo === 'SAUDE' && r.data_inicio >= d180str).length;
    return { nome: e.nome, matricula: e.matricula, total: totalAbs };
  }).sort((a, b) => a.total - b.total).slice(0, 5);

  // Saldos banco de horas por pessoa
  const saldos = {};
  ativos.forEach(e => {
    const regs = banco.filter(r => String(r.efetivo_id) === String(e.id));
    const cred = regs.filter(r => r.tipo === 'CREDITO').reduce((s, r) => s + (parseFloat(r.horas)||0), 0);
    const deb  = regs.filter(r => r.tipo === 'DEBITO').reduce((s, r) => s + (parseFloat(r.horas)||0), 0);
    saldos[e.id] = Math.round((cred - deb) * 10) / 10;
  });

  return {
    hoje:         hj,
    totalEfetivo: ativos.length,
    afastAtivos:  afastAtivos.length,
    feriasProx:   feriasProx.length,
    escalaHoje,
    plantoesHoje: plantoes.filter(p => p.data === hj),
    afastamentos: afastAtivos,
    ferias:       feriasProx,
    rankingProdutividade: rankProd,
    rankingAssiduidade: rankAssid,
    saldos,
    totalFaltasMes: faltas.filter(f => f.data.startsWith(hj.substring(0, 7))).length,
    usuariosPendentes: sheetToObjects(initUsuariosSheet()).filter(u => u.status === 'PENDENTE').length
  };
}

// ── Utility ──────────────────────────────────────────────
function deleteRow(sheetName, id) {
  const s = getSheet(sheetName);
  const rows = s.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      s.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Registro não encontrado' };
}

// ── AUTENTICAÇÃO E USUÁRIOS ──────────────────────────────
function initUsuariosSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Usuarios');
  const userEmail = Session.getActiveUser().getEmail();
  
  if (!sheet) {
    sheet = ss.insertSheet('Usuarios');
    const headers = ['id', 'usuario', 'nome', 'nivel', 'status', 'email'];
    const hr = sheet.getRange(1, 1, 1, headers.length);
    hr.setValues([headers]);
    hr.setBackground('#1e2636').setFontColor('#7dd3fc').setFontWeight('bold');
    sheet.appendRow([1, 'admin', 'Administrador', 'admin', 'ATIVO', userEmail]);
    sheet.setFrozenRows(1);
    return sheet;
  }
  
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  let emailIdx = headers.indexOf('email');
  
  // Garantir coluna email
  if (emailIdx === -1) {
    emailIdx = headers.length;
    sheet.getRange(1, emailIdx + 1).setValue('email').setBackground('#1e2636').setFontColor('#7dd3fc').setFontWeight('bold');
  }

  // AUTO-CONFIGURAÇÃO: Se o admin legado estiver sem email, ou se não houver admin ativo, promovemos o atual
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, headers.length + (emailIdx === headers.length ? 1 : 0)).getValues();
    const hasActiveAdmin = data.some(r => r[3] === 'admin' && r[4] === 'ATIVO' && r[emailIdx]);
    const userAlreadyExists = data.some(r => r[emailIdx] === userEmail);

    if (!hasActiveAdmin && !userAlreadyExists) {
      // Busca pelo usuário 'admin' legado (seja no nome, usuario ou senha)
      const adminRowIdx = data.findIndex(r => r[1] === 'admin' || r[2] === 'admin' || r[3] === 'admin');
      if (adminRowIdx !== -1) {
        // Atualiza admin legado conforme o print:
        sheet.getRange(adminRowIdx + 2, 5).setValue('admin'); // Nivel (Col E)
        sheet.getRange(adminRowIdx + 2, 6).setValue('ATIVO'); // Status (Col F)
        sheet.getRange(adminRowIdx + 2, emailIdx + 1).setValue(userEmail); // Email (Col H)
        writeLog('Sistema', 'Autoconfig: Proprietário promovido a Admin');
      } else {
        // Se não existir admin nenhum, cria um seguindo a ordem: id, nome, usuario, senha, nivel, status, cpf, email
        sheet.appendRow([Date.now(), 'Administrador', 'admin', 'OAUTH', 'admin', 'ATIVO', '000', userEmail]);
      }
    }
  }

  return sheet;
}

// ── AUDITORIA (LOGS) ─────────────────────────────────────
function writeLog(acao, detalhes) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = ss.getSheetByName('Logs_Auditoria');
    if (!logSheet) {
      logSheet = ss.insertSheet('Logs_Auditoria');
      logSheet.appendRow(['Data/Hora', 'Usuário', 'Ação', 'Detalhes', 'IP (Pseudo)']);
      logSheet.getRange('A1:E1').setFontWeight('bold').setBackground('#f3f3f3');
      logSheet.setFrozenRows(1);
    }
    
    const user = Session.getActiveUser().getEmail() || 'Sistema';
    const now = new Date();
    logSheet.appendRow([now, user, acao, detalhes, 'Internal']);
    
    // Manter apenas últimos 2000 logs para performance
    if (logSheet.getLastRow() > 2005) {
      logSheet.deleteRows(2, 500);
    }
  } catch (e) {
    console.error('Falha ao escrever log: ' + e.toString());
  }
}

// ── AUTENTICAÇÃO GOOGLE ──────────────────────────────────
function checkAuth() {
  const email = Session.getActiveUser().getEmail();
  if (!email) return { status: 'ANONYMOUS' };
  
  const s = initUsuariosSheet();
  const rows = sheetToObjects(s);
  const user = rows.find(r => String(r.email).toLowerCase() === email.toLowerCase());
  
  if (!user) return { status: 'NOT_REGISTERED', email: email };
  return { 
    id: user.id, 
    nome: user.nome, 
    email: user.email, 
    nivel: user.nivel, 
    status: user.status 
  };
}

function requestAccess(d) {
  const email = Session.getActiveUser().getEmail();
  const s = initUsuariosSheet();
  const rows = sheetToObjects(s);
  
  if (rows.some(r => String(r.email).toLowerCase() === email.toLowerCase())) {
    return { error: 'Este e-mail já possui uma solicitação ou cadastro.' };
  }
  
  const id = nextId(s);
  // Ordem do Print: [id, nome, usuario, senha, nivel, status, cpf, email]
  s.appendRow([id, d.nome, d.matricula, 'OAUTH_GOOGLE', 'servidor', 'PENDENTE', d.matricula, email]);
  writeLog('REQUEST_ACCESS', `O e-mail ${email} solicitou acesso.`);
  return { success: true };
}

// ── AUDITORIA E LOGS ────────────────────────────────────
function initLogsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEETS.LOGS);
  if (!s) {
    s = ss.insertSheet(SHEETS.LOGS);
    const headers = ['Data/Hora', 'Usuário', 'Ação', 'Detalhes'];
    s.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#334155').setFontColor('white');
  }
  return s;
}

function writeLog(action, details) {
  try {
    const s = initLogsSheet();
    const user = Session.getActiveUser().getEmail() || 'SISTEMA';
    const hj = new Date();
    s.appendRow([hj, user, action, details]);
  } catch(e) {
    console.error('Falha ao escrever log: ' + e.message);
  }
}

// ── VALIDAÇÃO DE CAMPOS ──────────────────────────────────
function validateInput(action, d) {
  if (action.includes('Efetivo')) {
    if (!d.nome || d.nome.length < 3) return { valid: false, message: 'Nome inválido.' };
    if (!d.matricula) return { valid: false, message: 'Matrícula obrigatória.' };
  }
  
  if (action.includes('Escala') || action.includes('Plantao')) {
    if (!d.data || !/^\d{4}-\d{2}-\d{2}$/.test(d.data)) return { valid: false, message: 'Data inválida.' };
    if (!d.efetivo_id) return { valid: false, message: 'Selecione um integrante.' };
  }

  return { valid: true };
}

// ── GESTÃO DE USUÁRIOS ──────────────────────────────────
function getUsuarios() {
  const s = initUsuariosSheet();
  const data = s.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  // Mapeamento simplificado por ÍNDICE (mais seguro que por nome)
  // Colunas: A(id), B(nome), C(usuario), D(senha), E(nivel), F(status), G(cpf), H(email)
  return data.slice(1).map(row => {
    return {
      id: row[0],
      nome: row[1] || 'Sem Nome',
      usuario: row[2] || 'N/A',
      nivel: row[4] || 'servidor',
      status: row[5] || 'PENDENTE',
      cpf: row[6] || '',
      email: row[7] || ''
    };
  }).filter(u => u.id !== '');
}

function statusUsuario(id, novoStatus) {
  const s = initUsuariosSheet();
  const rows = s.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      s.getRange(i + 1, 6).setValue(novoStatus); // Coluna F
      writeLog('USER_STATUS', `ID ${id} -> ${novoStatus}`);
      return { success: true };
    }
  }
  return { error: 'Não encontrado' };
}
