import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Shield } from 'lucide-react'

export default function PoliticaPrivacidade() {
  const [aceito, setAceito] = useState(false)
  const navigate = useNavigate()

  const handleDownloadPdf = () => {
    const link = document.createElement('a')
    link.href = '/politica-de-privacidade.pdf'
    link.download = 'Política de Privacidade - Escrita360.pdf'
    link.click()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-8">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold text-slate-800">
            <Shield className="w-8 h-8 text-brand-primary" />
            Política de Privacidade
          </CardTitle>
          <p className="text-slate-600 mt-2">
            Última atualização: 27/01/2026
          </p>
        </CardHeader>
        
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            A Plataforma Escrita 360 reafirma seu compromisso com a proteção de dados, a ética digital e o uso responsável da inteligência artificial, assegurando que o tratamento de informações pessoais tenha sempre como finalidade o aperfeiçoamento da aprendizagem, a segurança e a transparência na relação com seus usuários.
          </p>

          <div className="space-y-8 mt-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Informações gerais</h2>
              <p className="text-slate-700 leading-relaxed">
                Este documento tem por finalidade apresentar os princípios e diretrizes da Política de Privacidade adotada pela <strong>NI Projetos LTDA</strong>, pessoa jurídica de direito privado, inscrita no CNPJ nº 63.207.397/0001-07, responsável pela Plataforma Escrita 360 e pelas decisões relacionadas ao tratamento de dados. A política descreve as práticas de coleta, uso, tratamento, armazenamento e proteção dos dados pessoais fornecidos por usuários para acesso e utilização dos produtos e serviços que exigem identificação, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                O presente documento foi elaborado de acordo com os padrões adotados por plataformas digitais educacionais e em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), evidenciando o compromisso da plataforma Escrita 360 com a transparência quanto às finalidades da coleta de dados e às formas pelas quais os usuários podem gerenciar ou solicitar a exclusão de suas informações.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Essa política de privacidade aplica-se a todos os usuários e visitantes (estudantes, professores, gestores de escola etc) da Plataforma Escrita 360 e do site. Ao acessar ou utilizar a plataforma, o usuário declara estar ciente e de acordo com os termos e condições da Política de Privacidade aqui descritas, vigente na data de sua utilização.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Acesso e coleta dos dados pessoais</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Durante o uso da plataforma, são coletados os seguintes dados:
              </p>
              <ul className="list-disc list-inside space-y-3 text-slate-700">
                <li><strong>Cadastro na plataforma:</strong> São os dados de identificação da conta/perfil do usuário ou instituição vinculada (nome, e-mail, instituição de ensino, turma/ano, CPF/CNPJ para fins fiscais ou contratuais, login (endereço de e-mail ou nome de usuário), dados de uso (tempo de uso, progresso);</li>
                <li><strong>Textos produzidos na plataforma:</strong> inclui redações, esboços e rascunhos que são utilizados para treinamento e aprimoramento dos modelos de Inteligência Artificial, sempre de forma anonimizada e agregada, sem a identificação pessoal do usuário, a fim de assegurar a melhoria contínua da qualidade dos relatórios produzidos;</li>
                <li><strong>Dados para concretizar transações:</strong> Informações relacionadas aos pagamentos efetuados e histórico de transações. É importante ressaltar que dados sensíveis de pagamento, como números de cartão de crédito e códigos de segurança, não são armazenados diretamente em nossos sistemas. Eles são processados e protegidos exclusivamente por provedores de pagamento parceiros, que seguem rigorosos padrões de segurança;</li>
                <li><strong>Formulários, mensagens e comunicações</strong> com a equipe de suporte;</li>
                <li><strong>Dados para otimização da navegação:</strong> acesso ao site, comentários, interação com outros perfis e usuários, para melhorias da plataforma;</li>
                <li><strong>Dados relacionados a contratos:</strong> diante da formalização de contrato de compra e venda ou de prestação de serviços entre a plataforma e o usuário poderão ser coletados e armazenados dados relativos a execução contratual, inclusive as comunicações realizadas entre a empresa e o usuário;</li>
                <li><strong>Cookies e tecnologias de monitoramento:</strong> registro de informações técnicas para garantir a segurança e o bom funcionamento do sistema (ver seção 'Cookies e tecnologias de rastreamento' para mais detalhes).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Finalidade e Tratamento dos dados pessoais</h2>
              <p className="text-slate-700 leading-relaxed">
                Os dados pessoais coletados são tratados com rigor e em estrita conformidade com a Lei Geral de Proteção de Dados, bem como com os padrões éticos que orientam a plataforma, fundamentados nos princípios da transparência, confidencialidade e uso responsável das informações. O tratamento dos dados observa, de forma sistemática, os princípios da finalidade, necessidade e segurança, considerados pilares centrais da política de proteção de dados adotada.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Princípios fundamentais:</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li><strong>Finalidade:</strong> Garantimos que todo o tratamento de dados é realizado para propósitos legítimos, específicos, explícitos e informados ao titular;</li>
                  <li><strong>Necessidade:</strong> A coleta e o processamento de dados são estritamente limitados ao mínimo indispensável para alcançar as finalidades declaradas;</li>
                  <li><strong>Segurança:</strong> Adotamos medidas técnicas e organizacionais para proteger os dados pessoais contra acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.</li>
                </ul>
              </div>

              <p className="text-slate-700 leading-relaxed mt-4 mb-4">
                Com base nestes princípios, o tratamento de dados pode envolver as seguintes operações:
              </p>
              <ul className="list-disc list-inside space-y-3 text-slate-700">
                <li><strong>Acesso do usuário à plataforma e Armazenamento</strong> (disponibilizar histórico de correções e relatórios);</li>
                <li><strong>Coleta e Processamento</strong> (Fornecer informações e atualizações sobre funcionalidades da plataforma, melhorias de desempenho, novos recursos, serviços educacionais, boletins informativos e comunicações relacionadas à experiência do usuário, possibilitar análise e geração automática de relatórios de desempenho);</li>
                <li><strong>Avaliação e Produção</strong> (aprimorar a qualidade das análises, dos relatórios, das pontuações, dos algoritmos de feedback, assim como a melhoria contínua do conteúdo e dos recursos disponibilizados, de modo a torná-los mais relevantes e adequados às necessidades e preferências dos usuários, apoiar o desenvolvimento e a melhoria dos produtos e serviços, com base em análises de uso e sugestões enviadas pelos próprios usuários);</li>
                <li><strong>Comunicação e Controle</strong> (oferecer comunicações personalizadas, notificações que possam ser de interesse do usuário, respeitando suas preferências de contato, garantir a integridade das informações e o uso responsável dos dados, garantir a segurança técnica e operacional do sistema, cumprir obrigações legais, regulatórias ou contratuais);</li>
                <li><strong>Extração e Recepção</strong> (possibilitar estudos de melhoria contínua e personalização do aprendizado, preferencialmente com o uso de dados anonimizados ou agregados);</li>
                <li><strong>Eliminação</strong> (conforme os prazos e políticas de retenção de dados adotados pela plataforma);</li>
                <li><strong>Treinamento de novos modelos de IA</strong> (realizado de forma anonimizada e agregada, sem identificação pessoal dos usuários).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Compartilhamento de dados pessoais</h2>
              <p className="text-slate-700 leading-relaxed">
                A segurança da informação é uma prioridade para a Plataforma Escrita 360, que adota medidas técnicas e organizacionais para proteger os dados pessoais coletados e armazenados. O acesso a essas informações é restrito a profissionais autorizados, utilizado apenas para a prestação dos serviços e vedado para qualquer outra finalidade.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4 mb-4">
                Os dados pessoais são tratados com sigilo e em conformidade com a legislação vigente. O compartilhamento dessas informações ocorre apenas quando necessário e nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-3 text-slate-700">
                <li>Com instituições de ensino parceiras, quando o acesso do usuário estiver vinculado a elas, para fins pedagógicos ou administrativos;</li>
                <li>Com prestadores de serviço e parceiros tecnológicos, responsáveis por hospedagem, manutenção e segurança dos sistemas, sempre mediante contrato e cláusulas de confidencialidade;</li>
                <li>Com autoridades públicas, mediante obrigação legal ou ordem judicial;</li>
                <li>Com parceiros comerciais ou educacionais, quando necessário ao fornecimento de produtos, conteúdos ou suporte relacionados diretamente à experiência educacional do usuário;</li>
                <li>Com empresas controladoras, coligadas ou parceiras, no Brasil ou no exterior, realizando transferências internacionais de dados apenas em conformidade com as exigências da LGPD;</li>
                <li>Com órgãos de proteção ao crédito ou entidades de cadastro de consumidores, para resguardar direitos e créditos da plataforma;</li>
                <li>Para fins estatísticos, de pesquisa, desenvolvimento ou aprimoramento de inteligência artificial, de forma anonimizada.</li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                <p className="text-blue-800 font-medium">
                  Em nenhuma hipótese os dados pessoais são vendidos, cedidos ou compartilhados com terceiros para fins comerciais ou publicitários.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Armazenamento e exclusão dos dados</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                A plataforma mantém os dados pessoais apenas pelo tempo necessário ao cumprimento das finalidades definidas nesta Política, para as quais foram coletados, bem como os prazos legais aplicáveis, em conformidade com a legislação vigente. De forma geral:
              </p>
              <ul className="list-disc list-inside space-y-3 text-slate-700">
                <li>Os dados cadastrais permanecem ativos enquanto o usuário mantiver uma conta na plataforma. Após o término desse período, caso não haja renovação, os dados são desativados e anonimizados;</li>
                <li>Em conformidade com a LGPD, a plataforma mantém apenas os dados estritamente necessários à execução dos serviços, promovendo a exclusão periódica de informações desnecessárias, excessivas ou desatualizadas;</li>
                <li>A Plataforma poderá armazenar os dados pessoais necessários à execução da relação contratual por até 1 (um) ano após o encerramento do vínculo contratual ou a solicitação de exclusão da conta pelo titular;</li>
                <li>Backups de dados são mantidos por, no máximo, 1 (um) ano, a partir da data de criação, sendo posteriormente excluídos ou anonimizados;</li>
                <li>O usuário pode solicitar a exclusão de sua conta a qualquer momento, mediante solicitação à Plataforma. Os dados vinculados à conta pessoal serão excluídos em até 30 (trinta) dias corridos após a solicitação;</li>
                <li>Dados de pagamentos não são armazenados em nossos sistemas. Todas as transações financeiras são processadas exclusivamente por provedores de pagamento parceiros, sendo realizadas por meio dos serviços do PagBank.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Direitos dos usuários</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), o usuário, na condição de titular dos dados, possui os seguintes direitos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Acesso às informações pessoais armazenadas, respeitando o período vigente aqui declarado;</li>
                <li>Correção e retificação de dados incompletos, inexatos ou desatualizados;</li>
                <li>Atualização ou exclusão de dados pessoais, quando aplicável e permitido pela legislação;</li>
                <li>Informação sobre o uso e o compartilhamento de dados com terceiros;</li>
                <li>Oposição ao tratamento de dados por motivos relacionados com a sua situação particular;</li>
                <li>Realização da portabilidade dos dados a outro fornecedor de serviço, mediante requisição expressa;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a legislação;</li>
                <li>Transparência e clareza sobre as finalidades do tratamento de dados.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Direitos da Plataforma</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                A Plataforma reserva-se o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Utilizar dados anonimizados para fins estatísticos, de pesquisa, desenvolvimento de novas funcionalidades e aperfeiçoamento de seus serviços;</li>
                <li>Coletar e analisar métricas de uso, de forma agregada, para melhorar o desempenho, a segurança e a experiência do usuário;</li>
                <li>Compartilhar dados estritamente necessários com parceiros tecnológicos e prestadores de serviço, sob acordos contratuais e cláusulas de confidencialidade;</li>
                <li>Armazenar registros de acesso e atividade conforme exigido pela legislação aplicável e responder a solicitações de autoridades públicas competentes;</li>
                <li>Modificar, suspender ou encerrar funcionalidades da plataforma, quando necessário para manutenção técnica, atualização ou adequação a normas legais;</li>
                <li>Suspender, limitar ou encerrar o acesso de contas que apresentem indícios de uso indevido, fraude ou violação dos Termos de Uso;</li>
                <li>Recusar solicitações de exclusão ou anonimização de dados quando houver obrigação legal, contratual ou legítimo interesse que justifique sua manutenção;</li>
                <li>Excluir registros ou conteúdos das redações, sem solicitação prévia do usuário, quando estes contiverem material ofensivo, abusivo, discriminatório, difamatório, pornográfico, obsceno ou ilegal.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Direitos Autorais do Usuário sobre o Conteúdo Gerado</h2>
              <p className="text-slate-700 leading-relaxed">
                Reconhecemos e respeitamos que o usuário é e permanecerá como o único titular dos direitos autorais sobre os textos, redações, rascunhos e demais conteúdos originais que produzir, enviar e disponibilizar na Plataforma (doravante "Conteúdo do Usuário"). A Plataforma Escrita 360 não adquire a propriedade do Conteúdo do Usuário.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Direitos de Propriedade Intelectual</h2>
              <p className="text-slate-700 leading-relaxed">
                Este instrumento não concede nem transfere ao usuário quaisquer direitos de propriedade intelectual sobre a Plataforma Escrita 360, suas tecnologias, conteúdos ou funcionalidades, sendo o acesso concedido apenas para uso pessoal, individual e intransferível, sem implicar cessão ou licença de titularidade. Todos os direitos de propriedade intelectual relativos ao software, design, estrutura, funcionalidades, conteúdos próprios da plataforma, incluindo textos, imagens, vídeos, gráficos, áudios e demais materiais (excetuados aqueles gerados pelos usuários), bem como marca, logotipo e nomes comerciais, pertencem exclusivamente à Plataforma.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                É vedada, sem autorização prévia e expressa, qualquer forma de reprodução, modificação, cópia, distribuição, publicação, engenharia reversa ou uso comercial ou não comercial indevido de tais elementos (exceto o Conteúdo do Usuário), sendo tais práticas caracterizadas como violação de direitos de propriedade intelectual e passíveis de responsabilização civil e penal, nos termos da legislação aplicável.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Licença de Uso Concedida pelo Usuário à Plataforma</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Ao submeter, carregar ou disponibilizar qualquer conteúdo na Plataforma, o usuário concede à Plataforma Escrita 360 uma licença de uso limitada, não exclusiva, gratuita, mundial, revogável (nos termos desta Política) e passível de sublicenciamento, para que possamos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Fornecer e operar os serviços da Plataforma, incluindo análise textual, correção de redações, fornecimento de feedback personalizado, geração de relatórios de desempenho e personalização da experiência de aprendizado;</li>
                <li>Aprimorar, desenvolver e treinar nossos modelos de Inteligência Artificial e Processamento de Linguagem Natural (PLN), de forma estritamente anonimizada e agregada, sem qualquer identificação pessoal;</li>
                <li>Armazenar, exibir, reproduzir e distribuir o Conteúdo do Usuário, sempre dentro do escopo das funcionalidades da Plataforma.</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                Esta licença é essencial para que a Plataforma Escrita 360 possa oferecer seus serviços e funcionalidades. Ela não implica a transferência da titularidade dos direitos autorais do Conteúdo do Usuário para a Plataforma. A licença permanece válida enquanto o Conteúdo do Usuário for necessário para as finalidades descritas nesta Política e nos Termos de Uso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Responsabilidades do Usuário</h2>
              <p className="text-slate-700 leading-relaxed">
                O usuário é responsável por fornecer informações verdadeiras, completas e atualizadas no momento do cadastro, bem como por manter em sigilo suas credenciais de acesso (login e senha).
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                A segurança da conta depende do uso responsável por parte do usuário, que deve evitar o compartilhamento de dados sensíveis e proteger suas informações pessoais contra acessos não autorizados.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                O usuário é o único e exclusivo responsável pelo Conteúdo do Usuário que criar, submeter ou disponibilizar na Plataforma, comprometendo-se a não inserir, publicar ou registrar na plataforma qualquer tipo de dado, texto ou material que: i) Viole direitos de propriedade intelectual, autorais ou quaisquer outros direitos de terceiros; ii) Contenha material ofensivo, abusivo, discriminatório, difamatório, pornográfico, obsceno, ilegal ou que promova, incentive ou facilite práticas ilícitas de qualquer natureza.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Isenção de Responsabilidade da Plataforma</h2>
              <p className="text-slate-700 leading-relaxed">
                Embora a Plataforma Escrita 360 adote padrões de segurança para proteger os dados dos usuários, cabe ressaltar que nenhuma plataforma virtual está totalmente isenta de riscos. Dessa forma, a Plataforma não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside space-y-3 text-slate-700 mt-4">
                <li><strong>Condutas do usuário:</strong> Consequências decorrentes de negligência, imprudência ou imperícia do usuário no manuseio de seus dados pessoais;</li>
                <li><strong>Ações de terceiros:</strong> Danos ou falhas causados exclusivamente por terceiros, como ataques de hackers maliciosos, embora adote todas as medidas técnicas e organizacionais razoáveis para prevenir tais incidentes;</li>
                <li><strong>Informações incorretas:</strong> Consequências decorrentes da inserção de informações falsas, imprecisas ou de má-fé pelo usuário;</li>
                <li><strong>Problemas de conexão e disponibilidade:</strong> O funcionamento adequado da Plataforma depende de acesso estável à Internet e de condições técnicas mínimas compatíveis com seus requisitos operacionais.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Cookies e tecnologias de rastreamento</h2>
              <p className="text-slate-700 leading-relaxed">
                A Plataforma Escrita 360 utiliza cookies essenciais para o correto funcionamento do sistema, para melhorar a experiência do usuário, ampliar a segurança, bem como aperfeiçoar a usabilidade, experiência e interatividade na utilização do site durante a navegação na internet.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Tratam-se de pequenos arquivos de texto armazenados no dispositivo do usuário ou visitante durante a navegação no site. Esses arquivos contêm informações como local e horário de acesso, permitindo personalizar a experiência na plataforma.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Ao acessar a Plataforma Escrita 360, o usuário ou visitante consente com o uso de cookies para coleta de dados de navegação. Os cookies podem ser: i) Persistentes: permanecem no dispositivo após o fechamento do navegador e são usados em visitas futuras; ou ii) De sessão: temporários, são excluídos ao fechar o navegador.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                O usuário pode gerenciar suas preferências de cookies diretamente no navegador, ciente de que a desativação de alguns deles pode comprometer a navegação e o funcionamento de alguns recursos da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Lei aplicável e resolução de conflitos</h2>
              <p className="text-slate-700 leading-relaxed">
                Qualquer controvérsia oriunda dos termos expostos na presente Política de Privacidade serão dirimidas de acordo com a legislação brasileira, sendo competente, exclusivamente, o foro da cidade de São Bernardo do Campo/SP. Vale ressaltar que a utilização da plataforma e serviços e conteúdos fora do território brasileiro, ou ainda as decorrentes de operações iniciadas no exterior, podem estar sujeitas também à legislação e jurisdição das autoridades dos países onde forem comandadas ou iniciadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Compromisso com a LGPD</h2>
              <div className="bg-slate-50 p-6 rounded-lg">
                <p className="text-slate-700 leading-relaxed mb-4">
                  O site se compromete a cumprir a Lei Geral de Proteção de Dados (LGPD) e a respeitar os princípios estabelecidos no Art. 6º, garantindo transparência e segurança no tratamento de dados pessoais dos usuários:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 text-sm">
                  <li><strong>Finalidade:</strong> O tratamento dos dados será realizado apenas para propósitos legítimos, específicos e informados ao titular;</li>
                  <li><strong>Adequação:</strong> O tratamento será compatível com as finalidades informadas;</li>
                  <li><strong>Necessidade:</strong> O tratamento será limitado ao mínimo necessário;</li>
                  <li><strong>Livre acesso:</strong> Os titulares terão consulta facilitada e gratuita sobre como seus dados são tratados;</li>
                  <li><strong>Qualidade dos dados:</strong> Garantimos que os dados sejam exatos, claros, relevantes e atualizados;</li>
                  <li><strong>Transparência:</strong> Os titulares receberão informações claras e acessíveis sobre o tratamento de seus dados;</li>
                  <li><strong>Segurança:</strong> Adotamos medidas técnicas e administrativas para proteger os dados;</li>
                  <li><strong>Prevenção:</strong> Implementamos ações para evitar danos decorrentes do tratamento de dados;</li>
                  <li><strong>Não discriminação:</strong> Os dados não serão usados para fins discriminatórios, ilícitos ou abusivos;</li>
                  <li><strong>Responsabilização:</strong> Demonstramos a adoção de medidas eficazes para assegurar o cumprimento das normas.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Atualizações da Política de Privacidade</h2>
              <p className="text-slate-700 leading-relaxed">
                Esta Política de Privacidade poderá ser atualizada periodicamente para atender novas exigências legais, técnicas ou operacionais da plataforma, por isso recomendamos que o usuário consulte esta seção periodicamente. As alterações serão veiculadas pelo site.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                A versão mais recente da Política de Privacidade estará sempre disponível na seção "Políticas de Privacidade" do site, acessível a todos os usuários, com data de atualização claramente indicada para facilitar a identificação de mudanças.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Ao continuar utilizando a plataforma após alterações na política, o usuário expressa sua concordância com qualquer alteração neste documento. Caso não concorde, poderá encerrar a conta antes da entrada em vigor das mudanças.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Pesquisas de satisfação</h2>
              <p className="text-slate-700 leading-relaxed">
                A plataforma poderá realizar pesquisas de satisfação com usuários que tenham utilizado os serviços de suporte, com o objetivo de avaliar e aprimorar continuamente a qualidade do atendimento.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4 mb-4">
                Para a realização dessas pesquisas, poderemos coletar e tratar os seguintes dados:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Endereço de e-mail e/ou telefone cadastrado, utilizados apenas para identificação do usuário no banco de dados;</li>
                <li>Avaliações, comentários ou classificações atribuídas ao serviço prestado, que serão analisadas com a finalidade exclusiva de melhorar a qualidade dos serviços.</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                A base legal para o tratamento desses dados é o interesse legítimo da plataforma em avaliar a satisfação dos usuários e aprimorar continuamente seus serviços e canais de atendimento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Informações de Contato, formulários e suporte</h2>
              <p className="text-slate-700 leading-relaxed">
                Para esclarecimentos sobre esta política, dúvidas, comentários ou sugestões relacionadas à privacidade e proteção de dados, o usuário poderá entrar em contato com nossa equipe de suporte através do e-mail{' '}
                <a href="mailto:suporte@escrita360.com.br" className="text-brand-primary hover:underline font-medium">
                  suporte@escrita360.com.br
                </a>. Nosso compromisso é responder a todas as solicitações legítimas dentro dos prazos legais estabelecidos, com transparência e efetividade na proteção de seus dados e garantir o cumprimento integral dos direitos dos titulares, preservando, ao mesmo tempo, a segurança e integridade da plataforma.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Ao utilizar nossos formulários de contato ou suporte, o usuário poderá ser solicitado a fornecer informações pessoais de contato, como nome, e-mail ou telefone, indicadas nos campos obrigatórios (marcados com "*"). Esses dados são processados exclusivamente para permitir que nossa equipe entre em contato com o usuário, responda à solicitação e forneça as informações ou o suporte técnico solicitado.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                O usuário poderá, de forma opcional, fornecer informações adicionais nos campos não obrigatórios. Tais informações também serão tratadas em conformidade com a LGPD e demais normas aplicáveis à proteção da privacidade e segurança da informação.
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-lg">
              <p className="text-slate-700 leading-relaxed text-center font-medium">
                Ao utilizar a Plataforma Escrita 360, o usuário reconhece que leu, compreendeu e concorda com a Política de privacidade descrita neste documento.
              </p>
            </section>
          </div>

          {/* Checkbox e botão de download */}
          <div className="mt-12 p-6 bg-slate-50 rounded-lg border-2 border-slate-200">
            <div className="flex items-start space-x-3 mb-4">
              <Checkbox
                id="aceito-politica"
                checked={aceito}
                onCheckedChange={setAceito}
              />
              <label 
                htmlFor="aceito-politica" 
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                Li e entendi a Política de Privacidade
              </label>
            </div>
            
            {/* <Button 
              onClick={handleDownloadPdf}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF da Política de Privacidade
            </Button> */}
            
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full mt-4"
            >
              Voltar à tela anterior
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}