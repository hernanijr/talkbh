# Manual operacional — encontros e conteúdo do Talk BH

Este guia descreve como cadastrar e publicar cada encontro usando o painel administrativo. O site gera as páginas em português e inglês, os metadados de compartilhamento, o sitemap e os dados estruturados a partir do conteúdo aprovado. Não é necessário editar código para publicar um novo encontro.

## Acesso ao painel

1. Abra [https://talk.bh/admin/](https://talk.bh/admin/).
2. Entre com a conta que recebeu acesso ao painel do Talk BH.
3. Abra **Eventos e fotos → Conteúdo da comunidade**.

O painel usa Decap CMS com fluxo editorial. O conteúdo é armazenado no repositório GitHub; salvar e enviar uma alteração para revisão cria um pull request. O site público só muda depois que esse pull request é revisado e mesclado em `main`.

> **Importante:** o repositório do Talk BH é público. Rascunhos, textos e imagens enviados pelo CMS podem ficar visíveis no GitHub antes da aprovação. Não use o painel para armazenar informações privadas ou sensíveis.

## Agenda padrão recorrente

A agenda padrão está configurada para ocorrer uma vez por semana:

- **Dia:** quarta-feira.
- **Primeira ocorrência:** 25/11/2026.
- **Horário:** 18:30.
- **Fuso:** `America/Sao_Paulo`.
- **Local padrão:** Charada Savassi Cervejaria Artesanal, Rua Paraíba, 523 — Belo Horizonte, MG.
- **Participação:** gratuita.

A primeira ocorrência está definida explicitamente para 25/11/2026. O site não cria um encontro padrão na quarta-feira 18/11; a partir de 25/11, calcula uma ocorrência a cada sete dias.

Em **Agenda padrão recorrente**, os administradores podem:

- Ativar ou desativar a recorrência pelo controle **Ativar encontro padrão recorrente**.
- Ajustar o dia da semana, a primeira ocorrência, o horário e o fuso.
- Atualizar títulos, descrições, local, endereço, mapa e valor da entrada nos dois idiomas.

Quando a recorrência está desativada, o site deixa de gerar encontros padrão. Eventos cadastrados manualmente continuam funcionando.

### Eventos especiais: substituir ou adicionar

Cadastre karaokê, Halloween, encontros em outro local e outras edições especiais em **Próximos encontros**, preenchendo todos os dados normalmente.

Use o campo **Substitui o encontro padrão desta semana?**:

- **Ativado:** o evento especial substitui a ocorrência padrão daquela semana. Exemplo: se o evento especial ocorrer na sexta, a quarta-feira daquela mesma semana deixa de ser gerada.
- **Desativado:** o evento é adicional; a quarta-feira padrão continua existindo.

Não desative a recorrência global para cadastrar apenas um evento especial.

### Semana sem encontro padrão

Se não houver encontro em uma semana, adicione uma entrada em **Semanas sem encontro padrão** com a data da quarta-feira que seria a ocorrência. O motivo é opcional.

Essa exceção suprime somente a ocorrência daquela semana. As quartas-feiras seguintes continuam sendo geradas normalmente.

### Atualização e publicação

As alterações no CMS entram em vigor depois que o pull request editorial for revisado, mesclado em `main` e publicado. O workflow diário existente também refaz o build às 00:05 de Belo Horizonte, atualizando as páginas fixas quando a próxima ocorrência muda.

## Cadastrar um encontro

A agenda padrão é recorrente e é gerada pelo site: quarta-feira, às 18:30, com primeira ocorrência em 25/11/2026. Não cadastre manualmente cada quarta-feira. Use **Próximos encontros** para eventos especiais, adicionais ou alterações pontuais confirmadas.

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
| Substitui o encontro padrão desta semana? | Sim | Ative apenas quando um evento especial substituir a reunião semanal; deixe desativado para eventos adicionais |

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

- Uma página individual do evento em português, em `/eventos/{slug}/`, para encontros cadastrados manualmente.
- Uma URL permanente para o próximo encontro em `/proximo-encontro/` e `/en/next-meetup/`.
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
