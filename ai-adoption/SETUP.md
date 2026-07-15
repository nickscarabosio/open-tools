# Lead capture setup (Google Sheet + email)

No Mailchimp. No ConvertKit. One Google Sheet + a free Apps Script.

When someone unlocks the guide:

1. A row is added to your Sheet  
2. You get an email at **nick@culturetocash.com**  
3. Their browser unlocks Phases 1–6 (no email is sent to them)

## Step-by-step

### 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com)  
2. Create a spreadsheet: **AI Adoption Guide Leads**  
3. Optional: rename the first tab to `Leads`  
4. Header row (if you want it ready):

| timestamp | first_name | email | source | page |
|---|---|---|---|---|

### 2. Add the script

1. In the Sheet: **Extensions → Apps Script**  
2. Delete any placeholder code  
3. Paste everything from `google-apps-script.js` in this folder  
4. Confirm `NOTIFY_EMAIL` is `nick@culturetocash.com`  
5. Click **Save** (disk icon)

### 3. Deploy as a web app

1. **Deploy → New deployment**  
2. Gear icon → **Web app**  
3. Settings:
   - **Description:** AI Adoption leads  
   - **Execute as:** Me  
   - **Who has access:** Anyone  
4. **Deploy**  
5. Authorize Google when prompted (choose your account → Advanced → Go to … → Allow)  
6. **Copy the Web app URL**  
   - Looks like: `https://script.google.com/macros/s/AKfy…/exec`

### 4. Wire the site

1. Open `ai-adoption/index.html`  
2. Find near the top of the script:

```js
const LEADS_ENDPOINT = '';
```

3. Paste your URL:

```js
const LEADS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

4. Commit and merge the change (or edit on the branch and push)

Until `LEADS_ENDPOINT` is set, the yellow banner shows on the guide and unlocks still work in **preview mode** (so you can test the course). Leads are **not** emailed until the URL is set.

### 5. Test

1. Open `/ai-adoption/` in a private window  
2. Go through Phase 0 → Unlock  
3. Submit first name + email  
4. Confirm:
   - Guide unlocks to Phase 1  
   - New row in the Sheet  
   - Email at nick@culturetocash.com  

## Updating the script later

After any script edit: **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**.  
The web app URL usually stays the same.

## Privacy note

Keep the Sheet private (only your Google account). The web app URL can receive posts from the public form but cannot read your Sheet.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Unlock fails with error | Check the web app URL, redeploy as “Anyone”, re-authorize |
| Row appears, no email | Check spam; confirm `NOTIFY_EMAIL`; Apps Script → Executions for errors |
| CORS / network error | Use `Content-Type: text/plain` (already set in the guide) and redeploy |
| Yellow banner still on | `LEADS_ENDPOINT` is still empty in `index.html` |
