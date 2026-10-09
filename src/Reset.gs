function resetNewWeek() {

  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    "Reset New Week",
    "This will clear all weekly tracking data while keeping the teacher information intact.\n\nDo you want to continue?",
    ui.ButtonSet.YES_NO
  );

  if (response != ui.Button.YES) {
    return;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Action Center - Weekly");

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return;
  }

  // Clear Upload Status → Notes (Columns H:L)
  sheet.getRange(2, 8, lastRow - 1, 5).clearContent();

  ui.alert("✅ Weekly tracker has been reset successfully.");

}
