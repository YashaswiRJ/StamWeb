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
        // Strategy: Aggressively strip spaces immediately inside double-asterisks.
        // "** Text **" -> "**Text**"
        // "**Text **" -> "**Text**"
        // "** Text**" -> "**Text**"
        .replace(/\*\*\s+/g, '**') // Remove space AFTER **
        .replace(/\s+\*\*/g, '**') // Remove space BEFORE **

        // 4. Fix stuck bold (e.g. "word**bold**" -> "word **bold**")
        // Ensures a space exists before a bold block if it follows a word character
        .replace(/([a-zA-Z0-9])\*\*/g, "$1 **")

        // 5. Standard cleanups
        .replace(/\s+,/g, ",")
        .replace(/\s+\./g, ".")
        .replace(/[ \t]{2,}/g, " ");
};
