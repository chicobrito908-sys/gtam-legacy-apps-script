function inspectEscalas() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Escalas');
  const data = s.getDataRange().getValues();
  Logger.log('Headers: ' + JSON.stringify(data[0]));
  data.slice(-5).forEach((row, i) => {
    Logger.log('Row ' + i + ': ' + JSON.stringify(row));
  });
}
