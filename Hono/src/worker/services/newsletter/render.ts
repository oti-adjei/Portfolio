export type CampaignItem = {
  kind: 'blog' | 'note';
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  date?: string;
};

export type RenderInput = {
  subject: string;
  intro: string;
  style: 'teaser' | 'full';
  items: CampaignItem[];
  siteUrl: string;
  unsubscribeUrl: string;
  postalAddress?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Renders the same markdown subset the site's post page handles, so email and
 * site agree: ##, ###, > quote, ``` fences, - lists, paragraphs. Anything else
 * degrades to a paragraph rather than leaking raw markup.
 *
 * Styles are inline because Gmail strips <style> blocks.
 */
export function markdownToEmailHtml(md: string): string {
  const blocks = md.split(/\n{2,}/);
  const out: string[] = [];

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    if (block.startsWith('```')) {
      const code = block.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
      out.push(
        `<pre style="background:#f5f5f4;border-radius:8px;padding:12px;overflow-x:auto;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.5;margin:0 0 16px"><code>${escapeHtml(code.trimEnd())}</code></pre>`
      );
      continue;
    }
    if (block.startsWith('### ')) {
      out.push(`<h3 style="font-size:16px;font-weight:600;margin:24px 0 8px;color:#111">${escapeHtml(block.slice(4))}</h3>`);
      continue;
    }
    if (block.startsWith('## ')) {
      out.push(`<h2 style="font-size:19px;font-weight:700;margin:28px 0 10px;color:#111">${escapeHtml(block.slice(3))}</h2>`);
      continue;
    }
    if (block.startsWith('> ')) {
      const quote = block.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
      out.push(`<blockquote style="margin:0 0 16px;padding:8px 16px;border-left:3px solid #f75124;color:#444">${escapeHtml(quote)}</blockquote>`);
      continue;
    }
    if (block.startsWith('- ')) {
      const items = block.split('\n').filter((l) => l.trim().startsWith('- '));
      const lis = items.map((l) => `<li style="margin:0 0 6px">${escapeHtml(l.trim().slice(2))}</li>`).join('');
      out.push(`<ul style="margin:0 0 16px;padding-left:20px;color:#333">${lis}</ul>`);
      continue;
    }
    out.push(`<p style="margin:0 0 16px;line-height:1.7;color:#333">${escapeHtml(block)}</p>`);
  }

  return out.join('\n');
}

function itemHtml(item: CampaignItem, style: 'teaser' | 'full', siteUrl: string): string {
  const path = item.kind === 'blog' ? 'blog' : 'notes';
  const url = `${siteUrl}/${path}/${item.slug}`;
  const heading = `<h2 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#111"><a href="${url}" style="color:#111;text-decoration:none">${escapeHtml(item.title)}</a></h2>`;

  // A note has no excerpt field, so a teaser of one uses its opening paragraph.
  const teaserText =
    item.excerpt?.trim() || (item.content ?? '').split(/\n{2,}/)[0]?.trim() || '';

  const body =
    style === 'full'
      ? markdownToEmailHtml(item.content ?? teaserText)
      : `<p style="margin:0 0 16px;line-height:1.7;color:#333">${escapeHtml(teaserText)}</p>`;

  return `
    <tr><td style="padding:0 0 32px">
      ${heading}
      ${body}
      <a href="${url}" style="display:inline-block;font-size:14px;color:#f75124;text-decoration:none">Read on the site &rarr;</a>
    </td></tr>`;
}

export function renderCampaignHtml(input: RenderInput): string {
  const items = input.items.map((i) => itemHtml(i, input.style, input.siteUrl)).join('');
  const intro = input.intro.trim()
    ? markdownToEmailHtml(input.intro)
    : '';
  const postal = input.postalAddress
    ? `<p style="margin:8px 0 0;font-size:12px;color:#999">${escapeHtml(input.postalAddress)}</p>`
    : '';

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(input.subject)}</title></head>
<body style="margin:0;padding:0;background:#faf8ef">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8ef;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
        <tr><td style="padding:0 0 24px">${intro}</td></tr>
        ${items}
        <tr><td style="padding:24px 0 0;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">
            You are receiving this because you subscribed at ${escapeHtml(input.siteUrl)}.<br>
            <a href="${input.unsubscribeUrl}" style="color:#999">Unsubscribe</a>
          </p>
          ${postal}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** HTML-only mail scores badly with spam filters, so every send carries a text alternative. */
export function renderCampaignText(input: RenderInput): string {
  const lines: string[] = [];
  if (input.intro.trim()) lines.push(input.intro.trim(), '');

  for (const item of input.items) {
    const path = item.kind === 'blog' ? 'blog' : 'notes';
    const url = `${input.siteUrl}/${path}/${item.slug}`;
    lines.push(item.title, '');
    const teaser = item.excerpt?.trim() || (item.content ?? '').split(/\n{2,}/)[0]?.trim() || '';
    lines.push(input.style === 'full' ? (item.content ?? teaser) : teaser, '');
    lines.push(`Read on the site: ${url}`, '');
  }

  lines.push('---', `Unsubscribe: ${input.unsubscribeUrl}`);
  if (input.postalAddress) lines.push(input.postalAddress);
  return lines.join('\n');
}
