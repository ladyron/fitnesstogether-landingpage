// Original code from https://github.com/jamiewilson/form-to-google-sheets
// Updated for 2021 and ES6 standards
// John's Creek location

const sheetName = 'Sheet1'
const scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    const sheet = doc.getSheetByName(sheetName)

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1

    const newRow = headers.map(function(header) {
      return header === 'Date' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    var range = sheet.getRange(2, 6, sheet.getLastRow() - 1, 1);

    var rule = SpreadsheetApp.newDataValidation().requireValueInList(['Scheduled', 'Joined', 'Not Interested', 'Bad Fit', 'No Show']).build();
    range.setDataValidation(rule);

    const date = new Date(newRow[0]);

    var datetime = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    // var recipient = 'Fitness Together employee emails redacted for privacy reasons';
    var recipient = 'example@email.com';

    var subject = 'Fitness Together John\'s Creek: New Lead';
    var body = String(datetime) + '\n' +
                'A new sales lead has been received.' + '\n' +
                'Name: ' + newRow[1] + ' ' + newRow[2] + '\n' +
                'Email: ' + newRow[3] + '\n' + 
                'Phone Number: ' + newRow[4];
    var aliases = GmailApp.getAliases();

    GmailApp.sendEmail(recipient, subject, body, {'from': aliases[0]});
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
