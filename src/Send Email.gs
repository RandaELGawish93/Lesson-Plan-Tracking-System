
function sendSelectedEmail() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Action Center - Weekly");
  const settings = getSettings();

  const selectedRow = sheet.getActiveCell().getRow();

  if (selectedRow < 2) {

    SpreadsheetApp.getUi().alert(
      "Please select a teacher row."
    );

    return;

  }

  const row = sheet.getRange(selectedRow, 1, 1, 12).getValues()[0];

  const teacher = row[0];
  const actualEmail = row[1];
  const division = row[2];
  const grade = row[4];
  const emailType = row[10];

  let email = "";
  let cc = "";
  let bcc = "";

  // TEST / LIVE Mode

  if (settings["Mode"] == "TEST") {

    email = settings["Test Email"];

  } else {

    email = actualEmail;

    switch (division) {

      case "Elementary School":
        cc = settings[String(division).trim()] || "";
        break;

      case "Middle School":
        cc = settings[String(division).trim()] || "";
        break;

      case "High School":
        cc = settings[String(division).trim()] || "";
        break;

    }

    bcc = settings["Academic Deans Office"];

  }

  // Get Subject

  const subject = getEmailSubject(emailType);

  if (subject == "") {

    SpreadsheetApp.getUi().alert(
      "Subject not found for email type: " + emailType
    );

    return;

  }

  // Generate HTML Email

  const body = renderEmail(
    emailType,
    teacher,
    grade
  );

  // Confirmation

  const response = SpreadsheetApp.getUi().alert(

    "Send Email",

    "Email Type: " + emailType +

    "\n\nMode: " + settings["Mode"] +

    "\n\nTeacher: " + teacher +

    "\n\nTo:\n" + email +

    "\n\nCC:\n" + (cc == "" ? "None" : cc) +

    "\n\nBCC:\n" + (bcc == "" ? "None" : bcc) +

    "\n\nDo you want to continue?",

    SpreadsheetApp.getUi().ButtonSet.YES_NO

  );

  if (response != SpreadsheetApp.getUi().Button.YES) {

    return;

  }

  // Send Email

  GmailApp.sendEmail(
  email,

  subject,

  "Your email client does not support HTML.",

  {

    htmlBody: body,

    cc: cc,

    bcc: bcc,


  }

  );

  // Success Message

  SpreadsheetApp.getUi().alert(

    "✅ Email sent successfully.\n\n" +

    "Teacher: " + teacher +

    "\n\nMode: " + settings["Mode"] +

    "\n\nTo: " + email +

    "\n\nCC: " + (cc == "" ? "None" : cc) +

    "\n\nBCC: " + (bcc == "" ? "None" : bcc)

  );

}

