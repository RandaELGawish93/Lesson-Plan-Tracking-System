
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

    // In TEST mode every email goes to the test address (or to you).
    email = settings["Test Email"] || Session.getActiveUser().getEmail();

  } else {

    email = actualEmail;

    // CC the principal of the teacher's division
    // ("Elementary" / "Elementary School", "Middle School", "High School").
    const div = String(division).trim().toLowerCase();

    if (div.indexOf("elementary") === 0) {
      cc = settings["Elementary Principal Email"] || "";
    } else if (div.indexOf("middle") === 0) {
      cc = settings["Middle School Principal Email"] || "";
    } else if (div.indexOf("high") === 0) {
      cc = settings["High School Principal Email"] || "";
    }

    bcc = settings["Academic Office Email"] || "";

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

