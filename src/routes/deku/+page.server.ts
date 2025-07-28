function stripMarkdown(md: string) {
  // Remove code blocks
  md = md.replace(/```[\s\S]*?```/g, '');
  // Remove images
  md = md.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Remove links but keep text
  md = md.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // Remove emphasis, bold, strikethrough
  md = md.replace(/([*_~`>])/g, '');
  // Remove headings
  md = md.replace(/^#+\s?/gm, '');
  // Remove lists
  md = md.replace(/^\s*[-*+]\s+/gm, '');
  // Remove blockquotes
  md = md.replace(/^>\s?/gm, '');
  // Remove horizontal rules
  md = md.replace(/^---$/gm, '');
  // Remove extra newlines
  md = md.replace(/\n{2,}/g, '\n\n');
  return md.trim();
}

export async function load() {
  const repo = 'reagent-systems/deku';
  const repoUrl = `https://github.com/${repo}`;
  const res = await fetch('https://raw.githubusercontent.com/reagent-systems/deku/main/README.md');
  if (!res.ok) {
    return { title: 'Deku', content: 'Failed to fetch README from GitHub.', link: repoUrl };
  }
  const markdown = await res.text();
  // Extract the first line as title if it starts with #
  const lines = markdown.split('\n');
  let title = repo.split('/')[1];
  let startIdx = 0;
  if (lines[0].startsWith('# ')) {
    title = lines[0].replace(/^# /, '').trim();
    startIdx = 1;
  }
  // Find and remove the first image (screenshot)
  let imgIdx = -1;
  for (let i = startIdx; i < lines.length; i++) {
    if (/!\[[^\]]*\]\([^)]*\)/.test(lines[i])) {
      imgIdx = i;
      break;
    }
  }
  if (imgIdx !== -1) {
    lines.splice(imgIdx, 1);
  }
  // Remove any trailing license/about/footer sections (optional, simple heuristic)
  let endIdx = lines.length;
  for (let i = lines.length - 1; i > startIdx; i--) {
    if (/^##? /i.test(lines[i]) && lines[i].toLowerCase().includes('license')) {
      endIdx = i;
      break;
    }
  }
  const mainBody = lines.slice(startIdx, endIdx).join('\n').trim();
  const content = stripMarkdown(mainBody);
  return { title, content, link: repoUrl };
} 