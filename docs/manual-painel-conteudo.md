# Manual operacional — encontros e conteúdo do Talk BH

Este guia descreve como cadastrar e publicar cada encontro usando o painel administrativo. O site gera as páginas em português e inglês, os metadados de compartilhamento, o sitemap e os dados estruturados a partir do conteúdo aprovado. Não é necessário editar código para publicar um novo encontro.

## Acesso ao painel

1. Abra [https://talk.bh/admin/](https://talk.bh/admin/).
2. Entre com a conta que recebeu acesso ao painel do Talk BH.
3. Abra **Eventos e fotos → Conteúdo da comunidade**.

O painel usa Decap CMS com fluxo editorial. O conteúdo é armazenado no repositório GitHub; salvar e enviar uma alteração para revisão cria um pull request. O site público só muda depois que esse pull request é revisado e mesclado em `main`.

> **Importante:** o repositório do Talk BH é público. Rascunhos, textos e imagens enviados pelo CMS podem ficar visíveis no GitHub antes da aprovação. Não use o painel para armazenar informações privadas ou sensíveis.

## Cadastrar um encontro

Em **Próximos encontros**, adicione um registro para cada edição confirmada. Não cadastre recorrências e não anuncie datas ainda não confirmadas.

Preencha os campos:

| Campo no painel | Obrigatório | Como preencher |
| --- | --- | --- |
| Título em português | Sim | Nome público do encontro em português |
| Title in English | Sim | Versão em inglês do título |
| Descrição em português | Sim | Explique a proposta, o que vai acontecer e as condições de participação |
| Description in English | Sim | Tradução equivalente, sem omitir informações importantes |
| Data | Sim | `AAAA-MM-DD`, por exemplo `2026-12-01` |
| Slug da URL | Não | Deixe vazio para gerar automaticamente a partir do título em português e da data |
| Horário de início | Sim | `HH:MM`, formato 24 horas e fuso de Belo Horizonte |
| Horário de término | Não | Preencha somente se o horário previsto de término do encontro estiver confirmado |
| Valor da entrada (BRL) | Sim | Use `0` quando a participação for gratuita |
| Situação | Sim | **Confirmado** para encontros confirmados; **Cancelado** se a edição for cancelada |
| Local | Sim | Nome do estabelecimento ou espaço |
| Endereço completo | Sim | Endereço que deve aparecer na página |
| Cidade | Sim | Cidade e estado do encontro |
| Link do Google Maps | Não | URL HTTPS válida do Google Maps; o botão de direções aparece quando houver um link válido |

### Regras para preencher os dados

- Use sempre o fuso de Belo Horizonte (`America/Sao_Paulo`) para data e horários.
- Revise os dois idiomas. O site não traduz automaticamente os textos cadastrados.
- A participação no Talk BH é gratuita e não exige consumo. Alimentos e bebidas são opcionais; cada pessoa paga apenas pelo que escolher consumir.
- Não use o horário de fechamento do estabelecimento como horário de término do encontro. Deixe o campo de término vazio quando não houver um horário previsto e confirmado.
- Não invente preço, endereço, atração, artista ou qualquer informação que não tenha sido confirmada.
- O slug é criado automaticamente se ficar vazio. Depois que uma página for publicada e compartilhada, não altere o slug sem necessidade, pois isso muda a URL do evento.

## Adicionar o cartaz do encontro (opcional)

A seção **Arte do próximo encontro** aceita um único cartaz associado ao próximo encontro confirmado.

1. Abra a seção **Arte do próximo encontro**.
2. Informe em **Data do encontro associado** a data exata do próximo encontro, no formato `AAAA-MM-DD`.
3. Envie a imagem em **Imagem de divulgação**.
4. Salve e envie o conteúdo para revisão junto com o cadastro do encontro.

A data do cartaz precisa corresponder exatamente à data do próximo encontro confirmado. O site ignora automaticamente a imagem se a data não corresponder ao próximo encontro ou se a edição já tiver passado.

### E se não houver cartaz?

Não é necessário criar ou enviar uma imagem para publicar o encontro.

- Deixe a seção **Arte do próximo encontro** vazia. Se já houver um cartaz anterior, remova o objeto antigo em vez de manter uma data ou imagem desatualizada.
- A página individual do evento continua sendo gerada normalmente.
- O site usa a imagem institucional `/social-card.svg` como alternativa para a página e seus metadados sociais.
- As informações do evento, os links de compartilhamento e a navegação continuam disponíveis.

O cartaz é um recurso complementar de divulgação, não um requisito para publicar.

### Formato e proporção da imagem

- Prefira JPG ou WebP otimizado para a web.
- Envie a arte completa, sem margens ou textos importantes cortados no arquivo original.
- O site preserva a proporção original e exibe a imagem inteira; não é necessário recortar o cartaz para preencher um espaço 16:9.
- Evite imagens muito pesadas. Sempre que possível, exporte uma versão otimizada.

### Atualizar o cartaz para a próxima edição

Como o painel mantém um único cartaz, ao anunciar uma nova edição:

1. Atualize a data associada e a imagem para o novo próximo encontro, se houver novo cartaz; ou
2. Remova o bloco **Arte do próximo encontro** se a próxima edição não tiver cartaz.

Não deixe o cartaz antigo associado à data anterior esperando que ele seja reaproveitado. O site só deve mostrar a arte da edição que está sendo divulgada.

## O que o site gera automaticamente

Depois que o conteúdo é aprovado e publicado:

- Uma página individual do evento em português, em `/eventos/{slug}/`.
- Uma página equivalente em inglês, em `/en/events/{slug}/`.
- Links entre as versões nos dois idiomas.
- URLs canônicas e metadados Open Graph/Twitter para compartilhamento.
- Dados estruturados `Event` para a página individual, com situação e horários disponíveis no cadastro.
- Entradas correspondentes no sitemap.
- Link da homepage para os detalhes do próximo encontro.

Não é necessário criar páginas manualmente, alterar o sitemap ou editar JSON-LD.

## Revisar e publicar

1. No painel, salve o cadastro como rascunho e envie para revisão.
2. Abra o pull request criado pelo Decap CMS no GitHub.
3. Confira o diff: títulos e descrições nos dois idiomas, data, horário, entrada, local, endereço, Maps, situação e associação do cartaz.
4. Confira as páginas do preview em desktop e celular, em português e inglês. Verifique também se o cartaz está inteiro e se os links de compartilhar, WhatsApp e copiar link funcionam.
5. Aguarde o check **Production build** ficar verde.
6. Aprove e mescle o pull request em `main`. A publicação de produção acontece após o merge.
7. Depois do deploy, abra a homepage e as duas páginas individuais do encontro para conferir o resultado.

Não publique diretamente em `main` nem aprove o próprio conteúdo sem a revisão prevista no fluxo editorial.

## Cancelar ou corrigir um encontro

- Se um encontro já cadastrado for cancelado, altere a situação para **Cancelado** e envie a mudança para revisão.
- Se data, horário, local ou outra informação mudar, atualize o registro e publique por um novo pull request.
- Confira se o cartaz ainda corresponde ao próximo encontro confirmado. Remova ou substitua a arte quando ela não representar mais a próxima edição.
- Não apague informações de encontros anteriores sem necessidade; as páginas individuais podem continuar acessíveis como histórico. Eventos passados deixam de ser tratados como próximos e deixam de emitir dados estruturados de evento ativo.

## Checklist rápido por encontro

- [ ] Data e horário confirmados com quem organiza.
- [ ] Título em português e inglês revisados.
- [ ] Descrição em português e inglês revisadas.
- [ ] Data no formato `AAAA-MM-DD` e horário `HH:MM`.
- [ ] Entrada e situação conferidas.
- [ ] Local, endereço e link do Maps conferidos.
- [ ] Horário de término preenchido somente se confirmado.
- [ ] Cartaz associado à data correta, se existir; caso contrário, bloco de cartaz vazio.
- [ ] Pull request revisado e CI aprovado.
- [ ] Preview conferido em PT/EN e desktop/celular.
- [ ] Merge realizado e páginas públicas verificadas.
- [ ] Link do evento compartilhado com a comunidade.

## Galeria de fotos

A galeria é independente dos encontros. Adicione de uma a seis fotos reais da comunidade, somente com autorização de publicação. Cada foto precisa de uma descrição acessível em português e outra em inglês. Se a galeria ficar vazia, ela não aparece no site. Não use fotos de banco de imagens ou imagens geradas para representar participantes reais.
