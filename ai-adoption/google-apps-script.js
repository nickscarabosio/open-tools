/**
 * SMB AI Adoption Guide — lead capture
 *
 * Setup (≈10 minutes):
 * 1. Create a Google Sheet named "AI Adoption Guide Leads"
 * 2. Row 1 headers: timestamp | first_name | email | source | page
 * 3. Extensions → Apps Script → paste THIS ENTIRE FILE
 * 4. Edit NOTIFY_EMAIL if needed (default nick@culturetocash.com)
 * 5. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Authorize when prompted
 * 7. Copy the Web app URL
 * 8. Paste it into LEADS_ENDPOINT in ai-adoption/index.html
 * 9. Commit / redeploy the site
 *
 * Test: submit the unlock form on the guide. You should get a row
 * in the Sheet and an email at NOTIFY_EMAIL.
 */

const NOTIFY_EMAIL = 'nick@culturetocash.com';
const SHEET_NAME = 'Leads'; // tab name; created automatically if missing

function doPost(e) {
  try {
    const data = parseBody_(e);
    const firstName = clean_(data.firstName || data.first_name || '');
    const email = clean_(data.email || '');
    const source = clean_(data.source || 'ai-adoption');
    const page = clean_(data.page || '');
    const ts = clean_(data.ts || new Date().toISOString());

    if (!email || email.indexOf('@') === -1) {
      return json_({ ok: false, error: 'invalid_email' });
    }
    if (!firstName) {
      return json_({ ok: false, error: 'missing_name' });
    }

    const sheet = getSheet_();
    sheet.appendRow([ts, firstName, email, source, page]);

    const subject = 'New AI Adoption Guide lead: ' + firstName;
    const body = [
      'New unlock on the SMB AI Adoption Guide',
      '',
      'Name:  ' + firstName,
      'Email: ' + email,
      'Source: ' + source,
      'Page:  ' + page,
      'When:  ' + ts,
      '',
      '— nickscarabosio.github.io/ai-adoption/',
    ].join('\n');

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Respond to simple GET so you can open the URL in a browser and confirm deploy
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'ai-adoption-leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  const raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (err) {
    // form-urlencoded fallback
    const out = {};
    raw.split('&').forEach(function (pair) {
      const parts = pair.split('=');
      if (parts.length >= 2) {
        out[decodeURIComponent(parts[0])] = decodeURIComponent(parts.slice(1).join('=').replace(/\+/g, ' '));
      }
    });
    return out;
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['timestamp', 'first_name', 'email', 'source', 'page']);
  }
  // Ensure header if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'first_name', 'email', 'source', 'page']);
  }
  return sheet;
}

function clean_(v) {
  return String(v || '').trim().slice(0, 500);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
