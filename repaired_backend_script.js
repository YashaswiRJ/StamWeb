// ==========================================
// STAMATICS MASTER BACKEND (Repaired & Robust)
// ==========================================

// =============================================================
// CONFIGURATION
// =============================================================
const SHEET_ID = "1ChAudDEp_CDcC6oqxZbiNwf-0-i7Itjy0Egykml-bOg"; // Updated with correct ID
const ADMIN_PASSWORD = "stamatics2025";
const AUTH_TOKEN = "stam-secure-token-8f7d9a2b";
const NOTIFICATION_EMAIL = "stamatics@iitk.ac.in";

// =============================================================
// MAIN ENTRY POINTS
// =============================================================

function doGet(e) {
    const action = e.parameter.action;

    try {
        // --- 0. LOGIN (NO SHEET NEEDED) ---
        // We handle login *before* opening the spreadsheet to prevent crashes if Sheet ID is wrong.
        if (action === "login") {
            if (e.parameter.password === ADMIN_PASSWORD) {
                return jsonResponse({ success: true, token: AUTH_TOKEN });
            } else {
                return jsonResponse({ error: "Invalid Password" });
            }
        }

        // --- 1. OPEN SHEET (Now safe to fail without breaking login) ---
        let ss;
        try {
            ss = SpreadsheetApp.openById(SHEET_ID);
        } catch (sheetErr) {
            return jsonResponse({ error: "Configuration Error: Invalid Sheet ID. Please check SHEET_ID in script." });
        }

        // --- 2. GET TEAM (PUBLIC) ---
        if (action === "get_team") {
            const sheet = ss.getSheetByName("Team");
            if (!sheet) return jsonResponse([]);
            const data = sheet.getDataRange().getValues();
            if (data.length < 2) return jsonResponse([]);
            const headers = data[0];
            const rows = data.slice(1);
            const result = rows.map(row => {
                let obj = {};
                headers.forEach((h, i) => obj[h] = row[i]);
                return obj;
            });
            return jsonResponse(result);
        }

        // --- 3. GET BLOGS (PUBLIC) ---
        if (action === "get_blogs") {
            const sheet = ss.getSheetByName("Blogs");
            if (!sheet) return jsonResponse([]);
            const data = sheet.getDataRange().getValues();
            if (data.length < 2) return jsonResponse([]);
            const rows = data.slice(1);
            const blogs = rows.map(row => ({
                id: row[0], title: row[1], author: row[2], date: row[3], content: row[4]
            })).filter(b => b.title);
            return jsonResponse(blogs);
        }

        // --- 4. GET REGISTRATIONS (ADMIN) ---
        if (action === "get_registrations") {
            const sheet = ss.getSheetByName("Mathemania");
            if (!sheet) return jsonResponse([]);
            const data = sheet.getDataRange().getValues();
            if (data.length < 2) return jsonResponse([]);
            const headers = data[0];
            const rows = data.slice(1);
            const getIdx = (name) => headers.indexOf(name);
            const teamIdx = Math.max(getIdx("Team Name"), 1);
            const instIdx = Math.max(getIdx("Institute"), 4);
            const leadIdx = Math.max(getIdx("Leader Name"), getIdx("Leader"), 2);
            const mailIdx = Math.max(getIdx("Leader Email"), getIdx("Email"), 3);
            const regs = rows.map(row => ({
                team: row[teamIdx],
                inst: row[instIdx],
                leader: row[leadIdx],
                email: row[mailIdx],
                status: "Registered"
            }));
            return jsonResponse(regs);
        }

        // --- 5. GET ANNOUNCEMENT (PUBLIC) ---
        if (action === "get_announcement") {
            const sheet = ss.getSheetByName("Announcements");
            const text = sheet ? sheet.getRange("A1").getValue() : "";
            return jsonResponse({ text: text });
        }

        return jsonResponse({ error: "Invalid Action" });

    } catch (err) {
        return jsonResponse({ error: "Script Error: " + err.toString() });
    }
}

function doPost(e) {
    // For POST, we don't have a "login" action, but we can wrap the sheet open call safely.
    try {
        const data = JSON.parse(e.postData.contents);
        const action = data.action;

        // --- AUTHENTICATION CHECK ---
        const protectedActions = [
            "create_team_member", "edit_team_member", "delete_team_member",
            "create_blog", "edit_blog", "delete_blog", "import_medium",
            "update_announcement"
        ];
        if (protectedActions.includes(action)) {
            if (data.token !== AUTH_TOKEN) {
                return jsonResponse({ error: "Unauthorized: Invalid Token" });
            }
        }

        // --- OPEN SHEET ---
        let ss;
        try {
            ss = SpreadsheetApp.openById(SHEET_ID);
        } catch (sheetErr) {
            return jsonResponse({ error: "Configuration Error: Invalid Sheet ID." });
        }

        // --- TEAM MANAGEMENT ---
        if (action === "create_team_member") {
            let sheet = ss.getSheetByName("Team");
            if (!sheet) {
                sheet = ss.insertSheet("Team");
                sheet.appendRow(["id", "name", "role", "bio", "image", "linkedin", "github"]);
            }
            sheet.appendRow([data.id, data.name, data.role, data.bio, data.image, data.linkedin, data.github]);
            return jsonResponse({ status: "success" });
        }

        // ... (Remaining DO POST logic remains mostly the same, simplified for brevity here, assume standard implementation)
        // For the sake of the user's copy-paste, I should include the full logic or they'll lose it.
        // Re-adding the rest of doPost logic safely.

        if (action === "edit_team_member") {
            const sheet = ss.getSheetByName("Team");
            if (sheet) {
                const rows = sheet.getDataRange().getValues();
                for (let i = 1; i < rows.length; i++) {
                    if (String(rows[i][0]) === String(data.id)) {
                        sheet.getRange(i + 1, 1, 1, 7).setValues([[
                            data.id, data.name, data.role, data.bio, data.image, data.linkedin, data.github
                        ]]);
                        break;
                    }
                }
            }
            return jsonResponse({ status: "success" });
        }

        if (action === "delete_team_member") {
            const sheet = ss.getSheetByName("Team");
            if (sheet) {
                const rows = sheet.getDataRange().getValues();
                for (let i = 1; i < rows.length; i++) {
                    if (String(rows[i][0]) === String(data.id)) {
                        sheet.deleteRow(i + 1);
                        break;
                    }
                }
            }
            return jsonResponse({ status: "success" });
        }

        // --- BLOG MANAGEMENT ---
        if (action === "create_blog") {
            let sheet = ss.getSheetByName("Blogs");
            if (!sheet) { sheet = ss.insertSheet("Blogs"); sheet.appendRow(["ID", "Title", "Author", "Date", "Content"]); }
            sheet.appendRow([data.id, data.title, data.author, new Date(), data.content]);
            return jsonResponse({ status: "success" });
        }

        if (action === "edit_blog") {
            const sheet = ss.getSheetByName("Blogs");
            if (sheet) {
                const rows = sheet.getDataRange().getValues();
                for (let i = 1; i < rows.length; i++) {
                    if (String(rows[i][0]) === String(data.id)) {
                        sheet.getRange(i + 1, 2).setValue(data.title);
                        sheet.getRange(i + 1, 3).setValue(data.author);
                        sheet.getRange(i + 1, 5).setValue(data.content);
                        break;
                    }
                }
            }
            return jsonResponse({ status: "success" });
        }

        if (action === "delete_blog") {
            const sheet = ss.getSheetByName("Blogs");
            if (sheet) {
                const rows = sheet.getDataRange().getValues();
                for (let i = 1; i < rows.length; i++) {
                    if (String(rows[i][0]) === String(data.id)) {
                        sheet.deleteRow(i + 1);
                        break;
                    }
                }
            }
            return jsonResponse({ status: "success" });
        }

        if (action === "import_medium") {
            const feedUrl = "https://medium.com/feed/stamatics-iit-kanpur";
            const xml = UrlFetchApp.fetch(feedUrl).getContentText();
            const document = XmlService.parse(xml);
            const items = document.getRootElement().getChild("channel").getChildren("item");
            let sheet = ss.getSheetByName("Blogs");
            if (!sheet) { sheet = ss.insertSheet("Blogs"); sheet.appendRow(["ID", "Title", "Author", "Date", "Content"]); }
            const existingIds = sheet.getDataRange().getValues().map(r => String(r[0]));
            let count = 0;
            const contentNs = XmlService.getNamespace("http://purl.org/rss/1.0/modules/content/");
            const dcNs = XmlService.getNamespace("http://purl.org/dc/elements/1.1/");
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const title = item.getChildText("title");
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                if (!existingIds.includes(id)) {
                    const creator = item.getChildText("creator", dcNs) || "Stamatics";
                    const pubDate = new Date(item.getChildText("pubDate"));
                    const rawContent = item.getChildText("encoded", contentNs) || item.getChildText("description");
                    sheet.appendRow([id, title, creator, pubDate, convertHtmlToMarkdown(rawContent)]);
                    count++;
                }
            }
            return jsonResponse({ status: "success", count: count });
        }

        // --- ANNOUNCEMENT ---
        if (action === "update_announcement") {
            let sheet = ss.getSheetByName("Announcements");
            if (!sheet) sheet = ss.insertSheet("Announcements");
            sheet.getRange("A1").setValue(data.text);
            return jsonResponse({ status: "success" });
        }

        // --- PUBLIC FORMS ---
        if (!action && data.teamName) {
            let sheet = ss.getSheetByName("Mathemania");
            if (!sheet) {
                sheet = ss.insertSheet("Mathemania");
                sheet.appendRow(["Timestamp", "Team Name", "Leader Name", "Leader Email", "Institute", "Contact Number",
                    "Member 2 Name", "Member 2 Email", "Member 3 Name", "Member 3 Email", "Member 4 Name", "Member 4 Email"]);
            }
            sheet.appendRow([
                new Date(), data.teamName, data.teamLeader, data.email, data.institute, data.contactNumber,
                data.member2Name, data.member2Email, data.member3Name, data.member3Email, data.member4Name, data.member4Email
            ]);
            return jsonResponse({ status: "success", message: "Registered" });
        }

        if (!action && data.message) {
            let sheet = ss.getSheetByName("Contact");
            if (!sheet) { sheet = ss.insertSheet("Contact"); sheet.appendRow(["Timestamp", "Name", "Email", "Message"]); }
            sheet.appendRow([new Date(), data.name, data.email, data.message]);
            try {
                MailApp.sendEmail({ to: NOTIFICATION_EMAIL, subject: "New Query: " + data.name, htmlBody: `<p>${data.message}</p>` });
            } catch (e) { }
            return jsonResponse({ status: "success", message: "Message Sent" });
        }

        return jsonResponse({ error: "Unknown Action" });

    } catch (err) {
        return jsonResponse({ error: err.toString() });
    }
}

// =============================================================
// HELPER COMPONENT (Unchanged)
// =============================================================
function jsonResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function convertHtmlToMarkdown(html) {
    if (!html) return "";
    let md = html;
    md = md.replace(/<br\s*\/?>/gi, "\n");
    md = md.replace(/<\/p>/gi, "\n\n");
    md = md.replace(/<h[1-6]>(.*?)<\/h[1-6]>/gi, "## $1\n");
    md = md.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
    md = md.replace(/<b>(.*?)<\/b>/gi, "**$1**");
    md = md.replace(/<em>(.*?)<\/em>/gi, "*$1*");
    md = md.replace(/<i>(.*?)<\/i>/gi, "*$1*");
    md = md.replace(/<a href="(.*?)">(.*?)<\/a>/gi, "[$2]($1)");
    md = md.replace(/<img[^>]+src="([^">]+)"[^>]*>/gi, "\n![Image]($1)\n");
    md = md.replace(/<[^>]+>/g, "");
    md = md.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    return md;
}
