
function getEmailSubject(emailType){

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Email Templates");

  const data = sheet
    .getRange(2,1,sheet.getLastRow()-1,2)
    .getValues();

  for(let i=0;i<data.length;i++){

    if(String(data[i][0]).trim()==String(emailType).trim()){

      return data[i][1];

    }

  }

  return "";

}

function getHtmlFile(emailType){

  switch(emailType){

    case "Thank You":
      return "ThankYou";

    case "Amendment":
      return "Amendment";

    case "Reminder":
      return "Reminder";

    case "Warning":
      return "Warning";

    default:
      return "";

  }

}

function renderEmail(emailType, teacher, grade){

  const settings = getSettings();


// Load the email body

const htmlFile = getHtmlFile(emailType);

if(htmlFile == ""){

  throw new Error(
    "No HTML template found for email type: " +
    emailType
  );

}

const bodyTemplate =
  HtmlService.createTemplateFromFile(
    htmlFile
  );



  bodyTemplate.teacher = teacher;
  bodyTemplate.grade = grade;
  bodyTemplate.trimester =
    settings["Current Trimester"];
  bodyTemplate.week =
    settings["Current Week"];

  const body =
    bodyTemplate.evaluate().getContent();

  // Load the master layout
  const master =
    HtmlService.createTemplateFromFile(
      "MasterLayout"
    );

  master.content = body;
  // Signature block comes from the Settings sheet (optional rows)
  master.senderName = settings["Sender Name"] || "";
  master.senderEmail = settings["Sender Email"] || "";
  master.missionStatement = settings["Mission Statement"] || "";
return master.evaluate().getContent();
}


function previewEmail() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName("Action Center - Weekly");

  const selectedRow = sheet.getActiveCell().getRow();

  if (selectedRow < 2) {
    SpreadsheetApp.getUi().alert(
      "Please select a teacher row before previewing the email."
    );
    return;
  }

  const settings = getSettings();

  const row = sheet.getRange(selectedRow,1,1,12).getValues()[0];

  const teacher = row[0];
  const grade = row[4];
  const emailType = row[10];

  if (!emailType) {
    SpreadsheetApp.getUi().alert(
      "This row has no Email Sent type yet. Run Process Sunday Check or Process Pending Cases first."
    );
    return;
  }

const subject = getEmailSubject(emailType);

const body = renderEmail(
  emailType,
  teacher,
  grade
);

const html = HtmlService
  .createHtmlOutput(body)
  .setWidth(800)
  .setHeight(700);

SpreadsheetApp.getUi().showModalDialog(
  html,
  subject
);


}

