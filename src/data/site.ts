export type Language = 'pt-BR' | 'en';

export const site = {
  brand: { name: 'Talk BH', domain: 'https://talk.bh', location: 'Belo Horizonte, MG' },
  social: { instagram: 'https://www.instagram.com/talk_bh/', whatsapp: 'https://chat.whatsapp.com/IjYG3WsRlMf2XM3Ie5oTe9' },
  whatsappQr: '/images/community/whatsapp-invite.png',
  meetup: {
    date: '2026-11-12T19:30:00-03:00',
    venue: 'Cervejaria Charada', city: 'Belo Horizonte, Minas Gerais, Brazil',
    address: '', mapsUrl: '',
  },
  gallery: [] as { src: string; alt: Record<Language, string> }[],
} as const;

export const copy = {
  'pt-BR': {
    lang: 'pt-BR', title: 'Talk BH — Inglês, encontros e boas conversas em Belo Horizonte',
    description: 'Uma comunidade independente em Belo Horizonte para praticar inglês, conhecer gente e ter boas conversas — sem pressão de sala de aula.',
    nav: { about: 'Sobre', how: 'Como funciona', community: 'Comunidade', meetup: 'Encontros', faq: 'Dúvidas', join: 'Entre no WhatsApp' },
    hero: { eyebrow: 'UMA COMUNIDADE EM BELO HORIZONTE', title: 'Pratique mais.<br />Conecte-se <em>mais.</em>', text: 'Uma comunidade para falar inglês, conhecer pessoas e ter boas conversas — em um ambiente leve e sem pressão.', primary: 'Entre na comunidade', secondary: 'Conheça os encontros', note: 'Seu inglês não precisa ser perfeito. Só precisa sair da conversa.' },
    about: { eyebrow: 'MAIS CONVERSA, MENOS PRESSÃO', title: 'Inglês é o começo. <em>As conexões são o que fica.</em>', text: 'O Talk BH é uma comunidade independente que reúne pessoas em Belo Horizonte para conversar em inglês, conhecer gente nova e aproveitar bons momentos juntos.', points: ['Prática em situações reais', 'Pessoas e histórias diferentes', 'Confiança que vem de conversar', 'Encontros para criar vínculos'] },
    how: { eyebrow: 'SIMPLES ASSIM', title: 'Um encontro. Muitas conversas.', text: 'A gente se encontra em bares e outros espaços sociais de Belo Horizonte. O inglês acontece naturalmente, entre uma conversa e outra.', steps: [{ n: '01', title: 'Chegue como você é', text: 'Pode vir sozinho ou acompanhado. Não precisa ter experiência em grupos de conversação.' }, { n: '02', title: 'Entre na conversa', text: 'A proposta é conversar em inglês em um clima leve e informal.' }, { n: '03', title: 'Conheça pessoas', text: 'Pratique, escute histórias e faça conexões no seu ritmo.' }], aside: 'Não precisa ser fluente. Todos os níveis são bem-vindos.' },
    community: { eyebrow: 'A CONVERSA CONTINUA', title: 'Não venha apenas aos encontros. <em>Faça parte.</em>', text: 'No grupo do WhatsApp, você acompanha os próximos encontros, recebe informações e já começa a conhecer a comunidade antes de chegar.', bullets: ['Fique por dentro dos próximos encontros', 'Receba informações e novidades', 'Conheça outras pessoas da comunidade', 'Continue a conversa entre encontros'], cta: 'Entrar na comunidade do WhatsApp', scan: 'Escaneie o QR code para entrar pelo celular.', fallback: 'Acesse nosso Instagram e peça o link de entrada para a comunidade.' },
    gallery: { eyebrow: 'GENTE DE VERDADE', title: 'Momentos do Talk BH' },
    meetup: { eyebrow: 'PRÓXIMO ENCONTRO', title: 'Uma boa conversa pode começar aqui.', dateLabel: 'DATA E HORA', venueLabel: 'ONDE', city: 'Belo Horizonte · Minas Gerais', address: 'Endereço a confirmar', cta: 'Receber novidades no WhatsApp', expired: 'Esse encontro já aconteceu. Entre na comunidade para saber quando será o próximo.', upcoming: 'Ainda não há um próximo encontro anunciado. Entre na comunidade para receber novidades.' },
    faq: { eyebrow: 'PERGUNTAS FREQUENTES', title: 'Ficou com alguma dúvida?', items: [
      ['Preciso falar inglês fluentemente?', 'Não. A comunidade é para pessoas com diferentes níveis de inglês. Você não precisa ser fluente para participar.'],
      ['Posso ir sozinho(a)?', 'Sim. O Talk BH é um espaço para conhecer pessoas. Se quiser conversar sobre como é chegar, chama a gente no Instagram.'],
      ['Como funcionam os encontros?', 'Nos encontramos em bares e espaços sociais para conversar em inglês de um jeito leve e informal.'],
      ['Iniciantes são bem-vindos?', 'Sim. Pessoas com diferentes níveis são bem-vindas. O importante é ter vontade de conversar e conhecer gente.'],
      ['Preciso me inscrever?', 'As informações e orientações de cada encontro são compartilhadas pela comunidade. Entre no WhatsApp para saber mais.'],
      ['Há uma taxa de participação?', 'As condições podem variar. Consulte as informações do encontro ou fale com a comunidade pelo WhatsApp.'],
      ['Onde acontecem os encontros?', 'Em bares e espaços sociais de Belo Horizonte. O local é informado em cada encontro.'],
      ['Como entro no grupo do WhatsApp?', 'Use o botão desta página para acessar o convite. Se o link ainda não estiver disponível, fale com a gente pelo Instagram.'],
    ] },
    footer: { description: 'Inglês, encontros e boas conversas em Belo Horizonte.', explore: 'EXPLORE', find: 'ENCONTRE A GENTE', rights: 'Todos os direitos reservados.' },
  },
  en: {
    lang: 'en', title: 'Talk BH — English, meetups and good conversations in Belo Horizonte',
    description: 'An independent community in Belo Horizonte to practice English, meet people and have good conversations — without classroom pressure.',
    nav: { about: 'About', how: 'How it works', community: 'Community', meetup: 'Meetups', faq: 'FAQ', join: 'Join WhatsApp' },
    hero: { eyebrow: 'A COMMUNITY IN BELO HORIZONTE', title: 'Speak more.<br />Connect <em>more.</em>', text: 'A community to speak English, meet new people and have good conversations — in a relaxed, pressure-free atmosphere.', primary: 'Join the community', secondary: 'Explore meetups', note: 'Your English doesn’t have to be perfect. Just bring it to the conversation.' },
    about: { eyebrow: 'MORE CONVERSATION, LESS PRESSURE', title: 'English is the start. <em>Connection is what stays.</em>', text: 'Talk BH is an independent community that brings people together in Belo Horizonte to speak English, meet new people and enjoy good moments together.', points: ['Practice in real-life situations', 'Different people and stories', 'Confidence built through conversation', 'Meetups that bring people together'] },
    how: { eyebrow: 'THAT’S ALL THERE IS TO IT', title: 'One meetup. Many conversations.', text: 'We meet at bars and other social venues around Belo Horizonte. English happens naturally, one conversation at a time.', steps: [{ n: '01', title: 'Show up as you are', text: 'Come on your own or with someone. No group conversation experience needed.' }, { n: '02', title: 'Join the conversation', text: 'The idea is to speak English in a relaxed, informal setting.' }, { n: '03', title: 'Meet new people', text: 'Practice, hear new stories and make connections at your own pace.' }], aside: 'You don’t need to be fluent. All levels are welcome.' },
    community: { eyebrow: 'THE CONVERSATION CONTINUES', title: 'Don’t just attend. <em>Be part of it.</em>', text: 'In the WhatsApp group, you can follow upcoming meetups, get event details and get to know the community before you arrive.', bullets: ['Stay up to date on upcoming meetups', 'Get event details and news', 'Meet others in the community', 'Keep the conversation going between meetups'], cta: 'Join the WhatsApp community', scan: 'Scan the QR code to join on your phone.', fallback: 'Visit our Instagram and ask us for the community invite.' },
    gallery: { eyebrow: 'REAL PEOPLE, REAL MOMENTS', title: 'Talk BH moments' },
    meetup: { eyebrow: 'NEXT MEETUP', title: 'A good conversation could start here.', dateLabel: 'DATE & TIME', venueLabel: 'WHERE', city: 'Belo Horizonte · Minas Gerais', address: 'Address to be confirmed', cta: 'Get updates on WhatsApp', expired: 'This meetup has passed. Join the community to hear when the next one is announced.', upcoming: 'No upcoming meetup has been announced yet. Join the community for updates.' },
    faq: { eyebrow: 'GOOD TO KNOW', title: 'Questions? We’ve got you.', items: [
      ['Do I need to speak English fluently?', 'No. The community is for people with different English levels. You do not need to be fluent to take part.'],
      ['Can I come on my own?', 'Absolutely. Talk BH is a place to meet people. If you want to know what to expect, reach out to us on Instagram.'],
      ['How do the meetups work?', 'We meet at bars and social venues to talk in English in a relaxed, informal setting.'],
      ['Are beginners welcome?', 'Yes. People with different levels are welcome. What matters is being open to conversation and meeting people.'],
      ['Do I need to register?', 'Details and guidance for each meetup are shared with the community. Join WhatsApp to find out more.'],
      ['Is there a participation fee?', 'Details may vary. Check the meetup information or ask the community on WhatsApp.'],
      ['Where do meetups happen?', 'At bars and social venues in Belo Horizonte. The location is shared for each meetup.'],
      ['How do I join the WhatsApp group?', 'Use the button on this page to open the invite. If it is not available yet, reach out on Instagram.'],
    ] },
    footer: { description: 'English, meetups and good conversations in Belo Horizonte.', explore: 'EXPLORE', find: 'FIND US', rights: 'All rights reserved.' },
  },
} as const;
