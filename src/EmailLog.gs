function writeToEmailLog(teacher, subject, grade, emailType, notes) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const logSheet = ss.getSheetByName("Email Log");

  const settings = getSettings();

  const trimester = settings["Current Trimester"];
  const week = settings["Current Week"];

  const lastRow = logSheet.getLastRow();

  if (lastRow > 1) {

    const logData = logSheet
      .getRange(2,1,lastRow-1,9)
      .getValues();

    for(let i=0;i<logData.length;i++){

      if(
        logData[i][1]==trimester &&
        logData[i][2]==week &&
        logData[i][3]==teacher &&
        logData[i][4]==subject &&
        logData[i][5]==grade &&
        logData[i][6]==emailType
      ){

        return;

      }

    }

  }

  logSheet.appendRow([

    new Date(),

    trimester,

    week,

    teacher,

    subject,

    grade,

    emailType,

    "Ready",

    notes

  ]);

}
