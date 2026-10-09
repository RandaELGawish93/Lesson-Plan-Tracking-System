function processPendingCases() {
  
  let manualCases = [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Action Center - Weekly");

  const lastRow = sheet.getLastRow();

  const data = sheet.getRange(2,1,lastRow-1,12).getValues();

  data.forEach((row,i)=>{

    const teacher=row[0];
    const subject=row[3];
    const grade=row[4];

    const uploadStatus = String(row[7]).trim();
    const caseStatus = String(row[8]).trim();
    const escalation=row[9];

    if(caseStatus!="Pending"){
      return;
    }

    // Teacher uploaded after reminder
    if(uploadStatus=="Uploaded After Follow-up"){

         sheet.getRange(i+2,9).setValue("Closed");
         sheet.getRange(i+2,11).setValue("Uploaded After Follow-up");
         sheet.getRange(i+2,12).setValue("Case closed after follow-up.");

      return;

    }

    // Escalate Reminder -> Warning
    if(uploadStatus=="Not Uploaded" && escalation==1){

      sheet.getRange(i+2,10).setValue(2);

      sheet.getRange(i+2,11).setValue("Warning");

      sheet.getRange(i+2,12).setValue(
        "Official warning issued. Awaiting upload."
      );

      writeToEmailLog(

        teacher,

        subject,

        grade,

        "Warning",

        "Official warning issued."

      );
        return;
    }

    if(uploadStatus=="Not Uploaded" && escalation==2){

  sheet.getRange(i+2,12).setValue(
    "Awaiting manual intervention by Academic Dean."
  );

  manualCases.push(
    "• " + teacher + " | " + subject + " | " + grade
  );
 return;
}

  });
if (manualCases.length > 0) {

  SpreadsheetApp.getUi().alert(

    "⚠️ Manual Follow-up Required\n\n" +

    "The following cases require your manual intervention:\n\n" +

    manualCases.join("\n")

  );

}
else{

  SpreadsheetApp.getUi().alert(

    "Pending cases processed successfully."

  );

}
 

}
