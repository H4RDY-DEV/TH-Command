export function renderPlaceholder(title,description){
  return `<section class="page-heading"><div><p class="eyebrow">TH Command module</p><h1>${title}</h1><p>${description}</p></div></section>
  <section class="panel"><div class="empty-state"><h2>${title} module queued</h2><p>This area is connected to the new application shell and ready for the next build.</p></div></section>`;
}
