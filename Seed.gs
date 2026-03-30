/**
 * ESCALANTE PRO - Script de Importação de Efetivo (Seed)
 * GTAM 2026
 */

/**
 * Correção de emergência: atualiza cabeçalho e reimporta os dados.
 * Execute esta função quando aparecer "Sem cabeçalho nome_de_guerra".
 */
function fixAndSeed() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName('Efetivo');
  if (!s) {
    Logger.log('Aba Efetivo não encontrada.');
    return;
  }

  // 1) Corrige o cabeçalho (linha 1)
  const newHeaders = ['id','nome','nome_de_guerra','matricula','posto_graduacao',
                      'tipo_escala','grupo_turno','antiguidade','ativo','data_admissao','observacoes'];
  const hr = s.getRange(1, 1, 1, newHeaders.length);
  hr.setValues([newHeaders]);
  hr.setBackground('#1e2636');
  hr.setFontColor('#7dd3fc');
  hr.setFontWeight('bold');
  s.setFrozenRows(1);
  
  // 2) Limpa os dados antigos (mantém só o cabeçalho)
  if (s.getLastRow() > 1) {
    s.getRange(2, 1, s.getLastRow() - 1, s.getLastColumn()).clear();
  }
  
  // 3) Reimporta o efetivo
  seedEfetivo();
  Logger.log('Cabeçalho corrigido e efetivo reimportado!');
}

function seedEfetivo() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Efetivo');
  if (!s) {
    Logger.log('Erro: Aba "Efetivo" não encontrada.');
    return;
  }

  const data = [
    [1, "FRANCISCO WILSON DE OLIVEIRA BRITO", "SI W BRITO", "", "Subinspetor", "24x72", "TURNO B", 1, true, "2026-03-29", "Carga Inicial"],
    [2, "LEONARDO MAIA CUNHA BEZERRA", "GD L MAIA", "", "GM", "24x72", "TURNO B", 2, true, "2026-03-29", "Carga Inicial"],
    [3, "LUCAS DE SOUSA BENEVIDES", "GD L BENEVIDES", "", "GM", "24x72", "TURNO B", 3, true, "2026-03-29", "Carga Inicial"],
    [4, "PAULO EDERSON LIMA SOARES", "GD EDERSON", "", "GM", "24x72", "TURNO B", 4, true, "2026-03-29", "Carga Inicial"],
    [5, "CARLOS MATHEUS ALMEIDA PESSOA", "GD C MATHEUS", "", "GM", "24x72", "TURNO B", 5, true, "2026-03-29", "Carga Inicial"],
    [6, "JOSE GILSON DE LIMA BEZERRA", "GD GILSON", "", "GM", "24x72", "TURNO B", 6, true, "2026-03-29", "Carga Inicial"],
    [7, "ALUIZIO COSTA DO AMARAL DOS SANTOS", "GD ALUÍZIO COSTA", "", "GM", "24x72", "TURNO B", 7, true, "2026-03-29", "Carga Inicial"],
    [8, "THIAGO DE CASTRO COELHO", "GD T CASTRO", "", "GM", "24x72", "TURNO B", 8, true, "2026-03-29", "Carga Inicial"],
    [9, "FRANCISCO CLERTON MOTA FERREIRA", "GD MOTTA", "", "GM", "24x72", "TURNO B", 9, true, "2026-03-29", "Carga Inicial"],
    [10, "FRANCISCO JEFFERSON VASCONCELOS DE SÁ", "GD J VASCONCELOS", "", "GM", "24x72", "TURNO B", 10, true, "2026-03-29", "Carga Inicial"],
    [11, "FRANCISCO ANTÔNIO DOS SANTOS SILVA", "GD F A SILVA", "", "GM", "2x2", "TURNO B II", 11, true, "2026-03-29", "Carga Inicial"],
    [12, "GEOVANNI MAÉRCIO DA PONTE", "GD MAÉRCIO", "", "GM", "2x2", "TURNO B II", 12, true, "2026-03-29", "Carga Inicial"],
    [13, "SILVESTRE MENDES PEREIRA", "GD SILVESTRE", "", "GM", "2x2", "TURNO A II", 13, true, "2026-03-29", "Carga Inicial"],
    [14, "ROBERIO ALVES FELIX", "GD ROBÉRIO FELIX", "", "GM", "2x2", "TURNO A II", 14, true, "2026-03-29", "Carga Inicial"],
    [15, "WILSON DO ESPIRITO S. BATISTA RAMOS", "GD WILSON BATISTA", "", "GM", "2x2", "TURNO B II", 15, true, "2026-03-29", "Carga Inicial"],
    [16, "PAULO ANDRE DOS SANTOS QUEIROZ", "GD PAULO ANDRÉ", "", "GM", "2x2", "TURNO A II", 16, true, "2026-03-29", "Carga Inicial"],
    [17, "JAMISON DO NASCIMENTO QUEIROZ", "GD JAMISSON", "", "GM", "2x2", "TURNO A II", 17, true, "2026-03-29", "Carga Inicial"],
    [18, "FRANCISCO ANDERSON LIMA DA SILVA", "GD F LIMA", "", "GM", "2x2", "TURNO B II", 18, true, "2026-03-29", "Carga Inicial"],
    [19, "ALISSON CESAR ALBUQUERQUE NOGUEIRA", "GD ALISSON CÉSAR", "", "GM", "2x2", "TURNO B II", 19, true, "2026-03-29", "Carga Inicial"],
    [20, "ANDERSON RODRIGUES LOPES", "GD ANDERSON LOPES", "", "GM", "2x2", "TURNO A II", 20, true, "2026-03-29", "Carga Inicial"],
    [21, "WALTER SALES TEIXEIRA SOUSA", "GD WALTER SALES", "", "GM", "2x2", "TURNO A II", 21, true, "2026-03-29", "Carga Inicial"],
    [22, "MAURO CESAR VIEIRA DA SILVA", "GD MAURO CÉSAR", "", "GM", "2x2", "TURNO B II", 22, true, "2026-03-29", "Carga Inicial"],
    [23, "JADSON DAMASCENO MARQUES", "GD JADSON", "", "GM", "2x2", "TURNO A II", 23, true, "2026-03-29", "Carga Inicial"],
    [24, "ISAÍAS LIMA CHAVES", "GD ISAÍAS LIMA", "", "GM", "2x2", "TURNO A II", 24, true, "2026-03-29", "Carga Inicial"],
    [25, "MARCIO JOSE FELIX DOS SANTOS", "GD J FÉLIX", "", "GM", "2x2", "TURNO A II", 25, true, "2026-03-29", "Carga Inicial"],
    [26, "KAIO STENIO TARGINO SILVEIRA", "GD KAIO STENIO", "", "GM", "2x2", "TURNO B II", 26, true, "2026-03-29", "Carga Inicial"],
    [27, "FELIPE ROCHA DA SILVA", "GD F SILVA", "", "GM", "2x2", "TURNO B II", 27, true, "2026-03-29", "Carga Inicial"],
    [28, "PAULO VICTOR MOURA DA SILVA", "GD VICTOR MOURA", "", "GM", "2x2", "TURNO B II", 28, true, "2026-03-29", "Carga Inicial"]
  ];

  // Limpa o efetivo atual (preservando o cabeçalho)
  if (s.getLastRow() > 1) {
    s.getRange(2, 1, s.getLastRow() - 1, s.getLastColumn()).clear();
  }

  // Insere os novos dados
  s.getRange(2, 1, data.length, data[0].length).setValues(data);
  
  Logger.log('Efetivo importado com sucesso! ' + data.length + ' membros cadastrados.');
}
