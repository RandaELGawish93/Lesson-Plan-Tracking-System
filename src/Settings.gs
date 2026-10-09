
function getSettings() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Settings");

  const lastRow = sheet.getLastRow();

  const data =
    sheet
      .getRange(2, 1, lastRow - 1, 2)
      .getValues();

  let settings = {};

  data.forEach(function(row) {

    if (
      row[0] != "" &&
      row[1] != ""
    ) {

      settings[
        String(row[0]).trim()
      ] = String(row[1]).trim();

    }

  });

  return settings;

}

