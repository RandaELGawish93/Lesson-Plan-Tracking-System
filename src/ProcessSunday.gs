function processSundayCheck() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Action Center - Weekly");

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert("No data found.");
    return;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 12).getValues();

  data.forEach((row, i) => {

    const uploadStatus = String(row[7]).trim(); // Column H
    const existingCaseStatus = row[8];
    
    // Skip rows that are already completed
if (
  existingCaseStatus == "Closed" ||
  existingCaseStatus == "Semi-Closed"
) {
  return;
}

    let caseStatus = "";
    let escalation = "";
    let emailSent = "";
    let notes = "";

    switch (uploadStatus) {

      case "Uploaded - Correct Naming":

        caseStatus = "Closed";
        escalation = 0;
        emailSent = "Thank You";
        notes = "Uploaded correctly.";
        break;

      case "Uploaded - Incorrect Naming":

        caseStatus = "Semi-Closed";
        escalation = 0;
        emailSent = "Amendment";
        notes = "Incorrect naming convention.";
        break;

      case "Not Uploaded":

        caseStatus = "Pending";
        escalation = 1;
        emailSent = "Reminder";
        notes = "Reminder sent. Follow up Monday.";
        break;

      case "Uploaded After Follow-up":

        caseStatus = "Closed";
        notes = "Case closed after follow-up.";
        break;

      default:
        return;

    }

    sheet.getRange(i + 2, 9).setValue(caseStatus);       // I
    sheet.getRange(i + 2, 10).setValue(escalation);      // J
    sheet.getRange(i + 2, 11).setValue(emailSent);       // K
    sheet.getRange(i + 2, 12).setValue(notes);           // L
    const teacher = row[0];
const subject = row[3];
const grade = row[4];

writeToEmailLog(
  teacher,
  subject,
  grade,
  emailSent,
  notes
);

  });

  SpreadsheetApp.getUi().alert("Sunday processing completed successfully.");

}
