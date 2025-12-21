/**
 * cleanMarkdown.js
 * 
 * A centralized utility to clean and normalize Markdown content before rendering.
 * It fixes common formatting issues found in imported or scraped content.
 */

export const cleanMarkdown = (text) => {
    if (!text) return "";

    return text
        // 1. Force newlines before headers (e.g. "text## Header" -> "text\n\n## Header")
        .replace(/([^\n])\s*(#{1,6}\s)/g, "$1\n\n$2")

        // 2. Fix weird triple-asterisk formatting (e.g. "***x ***" -> "*x*")
        .replace(/\*\*\*\s*([^*]+?)\s*\*\*\*/g, "*$1*")

        // 3. ROBUST BOLD FIXING
        // Handles:
        // - "** text **" -> "**text**" (Trimming inside)
        // - "word**text**" -> "word **text**" (Decoupling)
        // - "**text**word" -> "**text** word" (Decoupling)
        // - "(**text**)" -> "(**text**)" (Preserving punctuation)
        .replace(/([a-zA-Z0-9]?)(\*\*)(\s*)(.*?)(\s*)(\*\*)([a-zA-Z0-9]?)/g, (match, prefix, open, space1, content, space2, close, suffix) => {
            let inner = content || "";
            let result = "**" + inner + "**";
            if (prefix) result = prefix + " " + result;
            else result = prefix + result;
            if (suffix) result = result + " " + suffix;
            else result = result + suffix;
            return result;
        })

        // 5. Standard cleanups
        .replace(/\s+,/g, ",")
        .replace(/\s+\./g, ".")
        .replace(/[ \t]{2,}/g, " ");
};
