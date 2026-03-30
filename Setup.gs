// ============================================================
// ESCALANTE PRO — Setup.gs
// Execute a função setup() UMA VEZ para criar o banco de dados
// ============================================================

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setName('Escalante Pro — GTAM');

  _createSheet(ss, 'Efetivo', [
    'id','nome','nome_de_guerra','matricula','posto_graduacao','tipo_escala',
    'grupo_turno','antiguidade','ativo','data_admissao','observacoes'
  ]);

  _createSheet(ss, 'Escalas', [
    'id','data','efetivo_id','turno','funcao','equipe','status','observacoes'
  ]);
  _formatDateColumn(ss, 'Escalas', 2);

  _createSheet(ss, 'Plantoes', [
    'id','data','efetivo_id','tipo_plantao','local','status','observacoes'
  ]);
  _formatDateColumn(ss, 'Plantoes', 2);

  _createSheet(ss, 'Afastamentos', [
    'id','efetivo_id','tipo','data_inicio','data_fim','dias','motivo','documento','status'
  ]);
  _formatDateColumn(ss, 'Afastamentos', 4);
  _formatDateColumn(ss, 'Afastamentos', 5);

  _createSheet(ss, 'Ferias', [
    'id','efetivo_id','ano_referencia','saldo_total','data_inicio','data_fim','dias_gozados','status'
  ]);
  _formatDateColumn(ss, 'Ferias', 5);
  _formatDateColumn(ss, 'Ferias', 6);

  _createSheet(ss, 'Faltas', [
    'id','efetivo_id','data','tipo','justificativa','documento','status'
  ]);
  _formatDateColumn(ss, 'Faltas', 3);

  _createSheet(ss, 'Banco_Horas', [
    'id','efetivo_id','data','tipo','horas','motivo','aprovado_por','data_registro'
  ]);

  _createSheet(ss, 'Configuracoes', ['chave','valor'], [
    ['nome_unidade', 'GTAM'],
    ['dias_ferias',  '30'],
    ['versao',       '1.0']
  ]);

  // Remove a aba padrão se existir
  ['Página1','Sheet1','Plan1'].forEach(n => {
    const s = ss.getSheetByName(n);
    if (s && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  SpreadsheetApp.getUi().alert(
    '✅ Setup concluído!\n\n' +
    'O banco de dados do Escalante Pro foi criado com sucesso.\n\n' +
    'Próximo passo: clique em "Implantar > Nova implantação" e\n' +
    'publique como "Aplicativo da Web" para obter a URL do sistema.'
  );
}

function _createSheet(ss, name, headers, initialData) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  } else {
    sheet.clear();
  }

  const hr = sheet.getRange(1, 1, 1, headers.length);
  hr.setValues([headers]);
  hr.setBackground('#1e2636');
  hr.setFontColor('#7dd3fc');
  hr.setFontWeight('bold');
  hr.setFontSize(11);

  if (initialData && initialData.length > 0) {
    sheet.getRange(2, 1, initialData.length, initialData[0].length).setValues(initialData);
  }

  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 50);

  return sheet;
}

function _formatDateColumn(ss, sheetName, colIndex) {
  const s = ss.getSheetByName(sheetName);
  if (s) {
    s.getRange(2, colIndex, s.getMaxRows() - 1, 1).setNumberFormat('@');
  }
}
