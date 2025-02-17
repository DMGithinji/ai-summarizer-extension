interface VideoBasicInfo {
  title: string;
  chapters: string;
}

interface Chapter {
  timestamp: string;
  title: string;
  seconds: number;
}

export function extractBasicInfo(text: string): VideoBasicInfo {
  // Find microformat section
  const findSimpleText = (key: string): string => {
    const regex = new RegExp(`"${key}":\\s*{\\s*"simpleText":\\s*"((?:\\\\"|[^"])*)"`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1]
        .replace(/\\"/g, '"')     // Replace \" with "
        .replace(/\\n/g, '\n')    // Replace \n with newlines
        .replace(/\\\\/g, '\\')   // Replace \\ with \
        .replace(/\\u0026/g, '&') // Replace unicode ampersand
        .replace(/\\t/g, '\t');   // Replace \t with tabs
    }
    return '';
  };

  const title = findSimpleText('title');
  const description = findSimpleText('description');
  const chapters = extractChapters(description);

  return {
    title,
    chapters
  };
}

function timestampToSeconds(timestamp: string): number {
  // Handle both HH:MM:SS and MM:SS formats
  const parts = timestamp.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return parts[0] * 60 + parts[1];
}

export function extractChapters(description: string): string {
  const chapters: Chapter[] = [];

  // Common patterns for chapter formats
  const patterns = [
    // Pattern 1: "00:00 Chapter Title" or "00:00:00 Chapter Title"
    /^(?:\d{1,2}:)?\d{2}:\d{2}\s+.+$/gm,

    // Pattern 2: "(00:00) Chapter Title" or "(00:00:00) Chapter Title"
    /^\((?:\d{1,2}:)?\d{2}:\d{2}\)\s+.+$/gm,

    // Pattern 3: "[00:00] Chapter Title" or "[00:00:00] Chapter Title"
    /^\[(?:\d{1,2}:)?\d{2}:\d{2}\]\s+.+$/gm,

    // Pattern for timestamps like "00:00 - " or "00:00:00 - "
    /^\d{2}:\d{2}(?::\d{2})?\s*-\s*.+$/gm,

    // Alternative pattern that's more flexible with the separator
    /^\d{2}:\d{2}(?::\d{2})?\s*[-:]\s*.+$/gm
  ];

  // Try each pattern until we find matches
  for (const pattern of patterns) {
    const matches = description.match(pattern);
    if (matches && matches.length > 0) {
      matches.forEach(match => {
        // Extract timestamp and title based on format
        let timestamp: string;
        let title: string;

        if (match.startsWith('(')) {
          // Handle (00:00) format
          [timestamp, title] = match.split(') ');
          timestamp = timestamp.slice(1);
        } else if (match.startsWith('[')) {
          // Handle [00:00] format
          [timestamp, title] = match.split('] ');
          timestamp = timestamp.slice(1);
        } else {
          // Handle plain 00:00 format
          const firstSpace = match.indexOf(' ');
          timestamp = match.slice(0, firstSpace);
          title = match.slice(firstSpace + 1);
        }

        // Clean up title and timestamp
        title = title.trim();
        timestamp = timestamp.trim();

        // Convert timestamp to seconds for sorting
        const seconds = timestampToSeconds(timestamp);

        chapters.push({ timestamp, title, seconds });
      });

      // If we found chapters with any pattern, break the loop
      if (chapters.length > 0) break;
    }
  }

  if (!chapters.length) {
    return '';
  }

  const sortedChapters = chapters.sort((a, b) => a.seconds - b.seconds);
  return formatChapters(sortedChapters);
}

export function formatChapters(chapters: Chapter[]): string {
  let output = '';

  chapters.forEach((chapter, index) => {
    output += `${index + 1}. [${chapter.timestamp}] ${chapter.title}\n`;
  });

  return output;
}