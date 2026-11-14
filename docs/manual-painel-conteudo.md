# Manual rápido — painel do Talk BH

Este guia explica como o organizador atualiza encontros e fotos e como os demais revisam antes da publicação. O site continua em português e inglês; edite os campos dos dois idiomas.

## Primeiro acesso

1. Abra `https://talk.bh/admin/`.
2. Entre com a conta convidada para o site Talk BH no Decap Turbo. O plano gratuito foi escolhido para um editor; não ative testes pagos nem cadastre plano pago.
3. Se o painel ainda não estiver conectado, o administrador técnico precisa criar o site gratuito no Decap Turbo, conectar o repositório `hernanijr/talkbh`, cadastrar `https://talk.bh` como origem do painel e colocar o ID do site em `public/admin/config.yml` por um PR. O ID não é uma senha.

## Atualizar um encontro

1. No painel, abra **Eventos e fotos → Conteúdo da comunidade → Próximos encontros**.
2. Adicione um item e preencha os títulos em português e inglês.
3. Informe a data como `AAAA-MM-DD` e o horário como `HH:MM` (24 horas). O horário é sempre de Belo Horizonte (`America/Sao_Paulo`).
4. Escolha **Confirmado** ou **Cancelado**. Não cadastre recorrência: cada encontro deve ser criado individualmente quando confirmado.
5. Preencha local, endereço completo e, se disponível, o link HTTPS do Google Maps. O botão “Como chegar / Get directions” só aparece com um link válido.
6. Confira a prévia do painel. Se o encontro não tiver data confirmada, deixe-o fora da lista. Encontros passados nunca aparecem como próximos.
7. Salve como rascunho e mova para revisão. Isso cria um pull request no GitHub; o rascunho não é publicado no site.

## Adicionar fotos

1. Na mesma tela, abra **Galeria de fotos** e adicione de 3 a 6 imagens reais do Talk BH.
2. Confirme que há autorização para publicar cada imagem e preencha o texto alternativo em português e inglês, descrevendo o que aparece.
3. Salve o rascunho e envie para revisão pelo fluxo do painel. Não use fotos de banco de imagens ou geradas.
4. A galeria fica oculta quando está vazia. As imagens ficam no repositório e são otimizadas pelo build do site.

## Revisar e publicar

1. O revisor abre o pull request de conteúdo no GitHub e confere o diff, os textos nos dois idiomas, data/hora, endereço, Maps e permissões das fotos.
2. Use o preview de build do PR para conferir o site completo em desktop e celular. No repositório público, o texto e as imagens do rascunho também ficam visíveis no GitHub antes da aprovação; não use o fluxo para material confidencial.
3. Aguarde os checks passarem e aprove o PR. A produção só muda quando o PR for mesclado à `main`; não publique conteúdo diretamente na `main`.
4. Após o merge, confira `https://talk.bh/` e `https://talk.bh/en/`. Se houver erro de conteúdo, corrija por outro PR.

## Próximo evento já informado

O conteúdo atual registra o encontro de terça-feira, **17 de novembro de 2026 às 18h30**, no **Charada Pub Savassi, Rua Paraíba, 523**, com conversa e karaokê. Não altere data, horário ou local sem confirmação dos organizadores.
