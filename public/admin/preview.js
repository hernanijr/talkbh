(() => {
  const cms = window.CMS;
  if (!cms) return;

  const React = cms.getLibrary('React');
  const h = React.createElement;
  const text = (value, fallback = '—') => typeof value === 'string' && value.trim() ? value : fallback;

  function Preview({ entry }) {
    const source = entry.getIn(['data'])?.toJS?.() ?? {};
    const meetups = Array.isArray(source.meetups) ? source.meetups : [];
    const photos = Array.isArray(source.gallery) ? source.gallery : [];
    const event = meetups[0];

    return h('main', { className: 'talkbh-preview' },
      h('p', { className: 'talkbh-preview__eyebrow' }, 'Talk BH · prévia do conteúdo'),
      h('h1', null, 'Encontros e novidades'),
      event ? h('section', { className: 'talkbh-preview__event' },
        ...['pt-BR', 'en'].map((language) => h('article', { className: 'talkbh-preview__card', key: language },
          h('p', { className: 'talkbh-preview__label' }, language === 'pt-BR' ? 'Português' : 'English'),
          h('h2', { className: 'talkbh-preview__value' }, text(language === 'pt-BR' ? event.title_pt : event.title_en, 'Talk BH')),
          h('p', { className: 'talkbh-preview__label' }, language === 'pt-BR' ? 'Data e horário · Belo Horizonte' : 'Date and time · Belo Horizonte'),
          h('p', { className: 'talkbh-preview__value' }, `${text(event.date)} · ${text(event.time)}`),
          h('p', { className: 'talkbh-preview__label' }, language === 'pt-BR' ? 'Local' : 'Venue'),
          h('p', { className: 'talkbh-preview__value' }, text(event.venue)),
          h('p', null, text(event.address)),
          event.maps_url ? h('a', { href: event.maps_url, target: '_blank', rel: 'noreferrer' }, language === 'pt-BR' ? 'Como chegar ↗' : 'Get directions ↗') : null,
        ))) : h('section', { className: 'talkbh-preview__card' },
        h('h2', null, 'Nenhum encontro confirmado'),
        h('p', null, 'O site continuará direcionando visitantes à comunidade do WhatsApp.'),
      ),
      photos.length ? h('section', { className: 'talkbh-preview__photos' }, ...photos.slice(0, 6).map((photo, index) => {
        const imageSrc = photo.image ? (photo.image.startsWith('http') || photo.image.startsWith('/') ? photo.image : `/${photo.image}`) : null;
        return h('article', { className: 'talkbh-preview__photo', key: `${photo.image ?? index}` },
          imageSrc ? h('img', { src: imageSrc, alt: text(photo.alt_pt, ''), className: 'talkbh-preview__photo-img' }) : null,
          h('strong', null, text(photo.alt_pt, `Foto ${index + 1}`)),
          h('p', null, text(photo.alt_en, 'English description missing')),
          h('p', null, photo.rights_confirmed ? 'Autorização confirmada' : 'Confirme a autorização antes de enviar para revisão.')
        );
      })) : null,
      h('p', { className: 'talkbh-preview__notice' }, 'A versão completa do site estará disponível na prévia do Cloudflare ligada ao pull request.'),
    );
  }

  cms.registerPreviewStyle('/admin/preview.css');
  cms.registerPreviewTemplate('community', Preview);
})();
