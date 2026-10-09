function refreshDashboard() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const tracker = ss.getSheetByName("Action Center - Weekly");
  const dashboard = ss.getSheetByName("Dashboard");

  const settings = getSettings();

  const data = tracker.getRange(
    2,
    1,
    tracker.getLastRow() - 1,
    12
  ).getValues();

  let total = 0;
  let closed = 0;
  let pending = 0;
  let followup = 0;
  let incorrectNaming = 0;

  data.forEach(row => {

    total++;

    const uploadStatus = String(row[7]).trim();
    const caseStatus = String(row[8]).trim();

    if(caseStatus=="Closed"){
      closed++;
    }

    if(caseStatus=="Pending"){
      pending++;
    }

    if(uploadStatus=="Uploaded After Follow-up"){
      followup++;
    }

    if(uploadStatus=="Uploaded - Incorrect Naming"){
      incorrectNaming++;
    }

  });

  dashboard.getRange("B3").setValue(settings["Academic Year"]);
  dashboard.getRange("B4").setValue(settings["Current Trimester"]);
  dashboard.getRange("B5").setValue(settings["Current Week"]);

  dashboard.getRange("B6").setValue(total);
  dashboard.getRange("B7").setValue(closed);
  dashboard.getRange("B8").setValue(pending);
  dashboard.getRange("B9").setValue(followup);
  dashboard.getRange("B10").setValue(incorrectNaming);

// ----------------------------- // Section 2 - Current Week Status // -----------------------------
// Clear previous data
  dashboard.getRange(15,1,18,5).clearContent();

  let output = [];

  data.forEach(row=>{

    const teacher=row[0];
    const subject=row[3];
    const grade=row[4];

    const caseStatus=String(row[8]).trim();

    if(caseStatus=="Pending"){

      output.push([
        teacher,
        subject,
        grade,
        "Pending",
        "Follow-up Required"
      ]);

    }

    if(caseStatus=="Semi-Closed"){

      output.push([
        teacher,
        subject,
        grade,
        "Semi-Closed",
        "Rename & Re-upload"
      ]);

    }

  });

  if(output.length>0){

    dashboard
      .getRange(15,1,output.length,5)
      .setValues(output);

  }

// -------------------------------------
// Section 3 - Academic Year Overview
// -------------------------------------

const logSheet = ss.getSheetByName("Email Log");

const logData = logSheet.getRange(
  2,
  1,
  logSheet.getLastRow() - 1,
  9
).getValues();

// Clear old data
dashboard.getRange(36, 1, 100, 6).clearContent();

let teacherStats = {};

logData.forEach(row => {

  const teacher = row[3];
  const emailType = String(row[6]).trim();

  if (!teacherStats[teacher]) {

    teacherStats[teacher] = {
      thankYou: 0,
      amendment: 0,
      reminder: 0,
      warning: 0
    };

  }

  switch(emailType){

    case "Thank You":
      teacherStats[teacher].thankYou++;
      break;

    case "Amendment":
      teacherStats[teacher].amendment++;
      break;

    case "Reminder":
      teacherStats[teacher].reminder++;
      break;

    case "Warning":
      teacherStats[teacher].warning++;
      break;

  }

});

let yearlyOutput = [];

for (const teacher in teacherStats) {

  const t = teacherStats[teacher];

  const total =
    t.thankYou +
    t.amendment +
    t.reminder +
    t.warning;

  const compliance =
    total == 0
      ? 100
      : ((t.thankYou / total) * 100).toFixed(1) + "%";

  output.push([
    teacher,
    t.thankYou,
    t.amendment,
    t.reminder,
    t.warning,
    compliance
  ]);

}

if (yearlyOutput.length > 0) {

  dashboard
    .getRange(36, 1, yearlyOutput.length, 6)
    .setValues(yearlyOutput);

}

}
