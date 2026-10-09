function onOpen() {

  SpreadsheetApp.getUi()
    .createMenu("📚 Lesson Plan Tracker")
    .addItem("Process Sunday Check", "processSundayCheck")
    .addItem("Process Pending Cases", "processPendingCases")
    .addSeparator()
    .addItem("Preview Selected Email","previewEmail")
    .addItem("Send Selected Email (Test/LIVE)","sendSelectedEmail")
    .addItem("Refresh Dashboard", "refreshDashboard")
    .addSeparator()
    .addItem("Reset New Week", "resetNewWeek")
    .addToUi();
    }
