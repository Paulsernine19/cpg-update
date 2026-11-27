INSTRUCTOR FEEDBACK: GOOGLE SHEET SETUP (one time)

1. Go to sheets.google.com and create a blank spreadsheet. Name it "CPG v2.6 course feedback".
2. In the sheet, open Extensions > Apps Script.
3. Delete everything in the editor and paste the script below. Click Save (disk icon).
4. Click Deploy > New deployment.
   - Click the gear next to "Select type" and choose "Web app".
   - Description: Course feedback
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy, then Authorize access, choose your Google account, and allow
     (if Google shows "app isn't verified", click Advanced > Go to ... (unsafe); it is your own script).
5. Copy the "Web app URL" (it ends in /exec).
6. Put that URL in js/feedback.js:   const IFB_URL="https://script.google.com/macros/s/.../exec";
7. Give instructors the course link with ?instructor=1 at the end, for example:
   https://paulsernine19.github.io/cpg-update/?instructor=1
   They only need it once per device. ?instructor=0 turns the button off again.

The first feedback creates a "Feedback" tab with these columns:
Received | Instructor | Module | Lesson | Lesson ID | Step | Screen | Type | Comment | Device | Status
Use Data > Create a filter to see feedback lesson by lesson. Type "Done" in Status when an item is handled.

If you later change the script, use Deploy > Manage deployments > Edit (pencil) > Version: New version,
so the URL stays the same.

---------------- SCRIPT (paste into Apps Script) ----------------

const SHEET = 'Feedback';
const HEAD = ['Received','Instructor','Module','Lesson','Lesson ID','Step','Screen','Type','Comment','Device','Status'];

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold');
  }
  // a leading = + - @ would be read as a formula
  const safe = v => { v = String(v == null ? '' : v).slice(0, 5000); return /^[=+\-@]/.test(v) ? "'" + v : v; };
  sh.appendRow([new Date(), safe(d.name), safe(d.module), safe(d.lesson), safe(d.lessonId), safe(d.step),
                safe(d.screen), safe(d.type), safe(d.comment), safe(d.device), '']);
  return ContentService.createTextOutput('ok');
}

function doGet() {
  return ContentService.createTextOutput('Course feedback endpoint is running.');
}
