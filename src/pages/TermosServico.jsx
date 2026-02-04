import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText } from 'lucide-react'

export default function TermosServico() {
  const [aceito, setAceito] = useState(false)
  const navigate = useNavigate()

  const handleDownloadPdf = () => {
    const link = document.createElement('a')
    link.href = '/termos-e-condicoes.pdf'
    link.download = 'Termos e Condições Gerais de Uso - Escrita360.pdf'
    link.click()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-8">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold text-slate-800">
            <FileText className="w-8 h-8 text-brand-primary" />
            Termos e Condições Gerais de Uso
          </CardTitle>
          <p className="text-slate-600 mt-2">
            Última atualização: 27/01/2026
          </p>
        </CardHeader>
        
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            Este documento tem por finalidade apresentar os termos e condições gerais de uso adotados pela <strong>NI Projetos LTDA</strong>, pessoa jurídica de direito privado, inscrita no CNPJ nº 63.207.397/0001-07, titular da propriedade intelectual sobre o software, website, conteúdos e demais ativos relacionados à plataforma Escrita 360.
          </p>

          <div className="space-y-8 mt-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Dos serviços oferecidos</h2>
              <p className="text-slate-700 leading-relaxed">
                A plataforma Escrita 360 é um ambiente digital formativo voltado ao desenvolvimento de habilidades da escrita autorregulada, que permite ao usuário, escrever, reescrever, analisar e corrigir seus textos, de forma autônoma e reflexiva, por meio de múltiplas análises e insights formativos. As correções também podem ser automatizadas com apoio de Inteligência Artificial (doravante IA).
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Todas as práticas estão alinhadas às habilidades previstas na Base Nacional Comum Curricular (MEC) e as competências e critérios avaliativos do ENEM (INEP), favorecendo o desenvolvimento de competências linguísticas, argumentativas, críticas e criativas dos estudantes, para que possam gerenciar o próprio processo, evolução e melhoria da qualidade escrita.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                A Plataforma disponibiliza os seguintes produtos e serviços: (i) módulo automatizado para apoio à produção, análise e avaliação de textos destinados a estudantes; (ii) módulo de correção e feedback de redações voltado a professores; e (iii) comercialização de planos e pacotes de créditos adicionais para a realização de análises textuais assistidas por inteligência artificial.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Da aceitação e Acesso dos usuários</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Ao acessar ou utilizar a plataforma Escrita 360, o usuário aceita integralmente os presentes termos e compromete-se a observá-los. Caso não concorde com estes termos, o acesso e o uso do sistema não devem ser realizados;</li>
                <li>A plataforma emprega todos os recursos técnicos disponíveis para garantir acesso contínuo. Contudo, a navegação pode ser temporariamente interrompida ou limitada para atualizações, manutenção ou outras ações quando se fizerem necessárias ao seu funcionamento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Do cadastro</h2>
              <p className="text-slate-700 leading-relaxed">
                O acesso às funcionalidades da plataforma requer a realização de um cadastro prévio e o pagamento de um plano ou assinatura realizada conforme a periodicidade escolhida (mensal, semestral ou anual), cujos valores e condições estão descritos no site.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Antes de finalizar o pagamento do plano escolhido, o usuário deverá se informar sobre as suas especificações e finalidade.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                A não renovação ou cancelamento dos planos resultará na suspensão do acesso à plataforma e na perda do direito de uso de créditos para correção com IA.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Ao se cadastrar, o usuário deve fornecer dados completos, atualizados e válidos, incluindo um e-mail válido para comunicações. É responsabilidade do usuário manter esses dados atualizados e garantir sua veracidade.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Após o cadastro, o usuário receberá login e senha pessoais, sendo responsável por mantê-los confidenciais e seguros, evitando acesso não autorizado. O usuário não deve compartilhar seus dados de acesso com terceiros, respondendo integralmente por qualquer uso indevido.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Ao aceitar os Termos, o usuário autoriza a coletar e usar os dados fornecidos no cadastro ou uso da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Do cancelamento</h2>
              <p className="text-slate-700 leading-relaxed">
                O usuário pode solicitar o cancelamento do cadastro a qualquer momento, pelo canal de suporte.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Os valores pagos não são reembolsáveis, exceto nos casos previstos na política de garantia, quando houver um período de teste, com reembolso integral dentro do prazo estipulado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Das Responsabilidades</h2>
              
              <h3 className="text-xl font-semibold text-slate-800 mb-3">É de responsabilidade do usuário:</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Utilizar a Plataforma de forma adequada, ética, responsável e em conformidade com as disposições deste Termo de Condições de Uso e demais políticas aplicáveis</li>
                <li>Cumprir integralmente as regras e políticas estabelecidas neste Termo de Condições de Uso;</li>
                <li>Proteger os dados de acesso à sua conta (login e senha), responsabilizando-se por qualquer atividade realizada a partir dela. A conta de acesso é pessoal e intransferível, sendo expressamente proibido ceder, vender, compartilhar ou emprestar login e senha a terceiros. O descumprimento dessa regra poderá resultar em bloqueio ou encerramento da conta, sem direito a reembolso;</li>
                <li>Assegurar que seu dispositivo e conexão sejam compatíveis com os requisitos técnicos da Plataforma.</li>
              </ol>

              <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">É de responsabilidade da Plataforma:</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Indicar de forma clara e acessível as características, funcionalidades e limitações dos serviços oferecidos;</li>
                <li>Garantir a veracidade das informações divulgadas por seus canais oficiais;</li>
                <li>Zelar pela segurança e integridade do ambiente virtual, adotando medidas técnicas para proteção dos dados e estabilidade do sistema;</li>
                <li>Manter suporte técnico e canais de comunicação adequados para atendimento aos usuários.</li>
              </ol>

              <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">A Plataforma não se responsabiliza:</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Por conteúdos, comentários ou informações publicadas pelos próprios usuários, os quais são de inteira responsabilidade destes;</li>
                <li>Por links externos que possam redirecionar o usuário a ambientes fora de seu domínio, sobre os quais não possui controle;</li>
                <li>Por eventuais interrupções, falhas de acesso ou incompatibilidades técnicas decorrentes de fatores alheios à sua atuação direta.</li>
              </ul>
              
              <p className="text-slate-700 leading-relaxed mt-4 italic">
                Demais responsabilidades estão detalhadas no Documento de Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Pagamento e consumo dos Créditos de correção com IA</h2>
              <p className="text-slate-700 leading-relaxed">
                Os pagamentos podem ser realizados por meio de PIX e cartão de crédito. Para pagamentos efetuados com cartão de crédito, é permitido, em alguns casos, o parcelamento, observado o limite máximo de parcelas, que está definido no site, de acordo com o valor e a duração do plano contratado.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Quando o usuário solicita a correção de seu texto com auxílio da IA, o sistema consome créditos de uso, equivalentes a chamadas à IA. Cada solicitação de correção consome um crédito (uma unidade de consumo).
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Os créditos podem ser adquiridos das seguintes formas: i) comprando juntamente com o plano adquirido; ii) adquirindo créditos extras (por meio da aquisição de pacotes de créditos no site); e iii) por intermédio das escolas, quando o plano é contrato pela instituição.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Os créditos para correção e análises dos textos com IA devem ser utilizados dentro do período de vigência do plano adquirido. Créditos não utilizados durante o mês ativo não serão acumulativos para os meses seguintes.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Da mesma forma, os artefatos gerados na plataforma, incluindo redações e relatórios, deixam de estar acessíveis ao usuário após o término da vigência do plano adquirido. Para fins de arquivamento, a plataforma disponibiliza a geração de relatórios em formato PDF, que podem ser baixados e armazenados pelo usuário em seu dispositivo pessoal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Sobre os relatórios e análises gerados por IA</h2>
              <p className="text-slate-700 leading-relaxed">
                Os relatórios de correção e análise textual disponibilizados pela plataforma são produzidos com o apoio de tecnologias de IA e Processamento de Linguagem Natural (PLN). Esses modelos realizam interpretações automáticas de textos, buscando identificar padrões linguísticos, discursivos e estruturais semelhantes aos observados em correções humanas.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                A análise automatizada combina abordagens quantitativas e qualitativas, orientadas por prompts específicos desenvolvidos para avaliar aspectos como coerência, coesão, argumentação, estrutura e adequação ao tema. Para realizar essas avaliações, a IA utiliza uma ampla base de conhecimento composta por textos disponíveis publicamente na internet, corpora acadêmicos e dados linguísticos de domínio geral.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                As análises para as correções das redações do ENEM seguem, como referência principal, a Cartilha do Participante do ENEM, publicada pelo INEP, e as matrizes de pontuação associadas a cada competência avaliativa. Dessa forma, os relatórios buscam reproduzir os critérios oficiais de análise, destacando pontos fortes e aspectos a serem aprimorados em cada texto, além de oferecer previsões de nota por competência e observações sobre o contexto e a estrutura da redação.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                É importante destacar que, por se tratar de um sistema automatizado, podem ocorrer imprecisões ou divergências, assim como acontece com a avaliação humana. A IA não substitui o julgamento pedagógico ou profissional, e eventuais erros de interpretação ou classificação são possíveis, especialmente em casos de linguagem ambígua, ironias, variações regionais ou construções criativas.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Por esse motivo, recomenda-se que os resultados gerados sejam utilizados como apoio diagnóstico e formativo, e não como avaliação definitiva. A plataforma compromete-se a aprimorar continuamente seus algoritmos, com base em revisões humanas, feedback de usuários e atualizações das diretrizes oficiais de correção.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Das sanções e rescisão</h2>
              <p className="text-slate-700 leading-relaxed">
                Sem prejuízo das demais medidas legais cabíveis, pode-se a qualquer momento, advertir, suspender ou cancelar a conta do usuário:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4 mt-4">
                <li>que violar qualquer dispositivo do presente Termo;</li>
                <li>que descumprir os seus deveres de usuário;</li>
                <li>que tiver qualquer comportamento fraudulento, doloso ou que ofenda a terceiros.</li>
              </ol>
              <p className="text-slate-700 leading-relaxed mt-4">
                A não observância das obrigações pactuadas neste Termo de Uso ou da legislação aplicável poderá, sem prévio aviso, ensejar a imediata rescisão unilateral e o bloqueio do acesso à plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Da política de privacidade</h2>
              <p className="text-slate-700 leading-relaxed">
                Além do presente Termo, o usuário deverá consentir com as disposições contidas na respectiva Política de Privacidade apresentada neste site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Das alterações</h2>
              <p className="text-slate-700 leading-relaxed">
                Os itens descritos no presente documento poderão ser modificadas a qualquer momento, tendo em vista possíveis alterações necessárias para atender novas exigências legais. As alterações serão veiculadas pelo site e o usuário poderá optar por aceitar o novo conteúdo ou por cancelar o plano adquirido.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                O uso contínuo dos serviços após a publicação de alterações nos termos implicará na aceitação automática das novas condições.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Do contato e suporte</h2>
              <p className="text-slate-700 leading-relaxed">
                Para esclarecimentos, dúvidas, comentários ou sugestões relacionadas aos termos e condições de uso, entre em contato com nossa equipe de suporte em{' '}
                <a href="mailto:suporte@escrita360.com.br" className="text-brand-primary hover:underline font-medium">
                  suporte@escrita360.com.br
                </a>.
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-lg">
              <p className="text-slate-700 leading-relaxed text-center font-medium">
                Ao utilizar a Plataforma Escrita 360, o usuário reconhece que leu, compreendeu e concorda com os Termos e condições gerais de Uso descritos neste documento.
              </p>
            </section>
          </div>

          {/* Checkbox e botão de download */}
          <div className="mt-12 p-6 bg-slate-50 rounded-lg border-2 border-slate-200">
            <div className="flex items-start space-x-3 mb-4">
              <Checkbox
                id="aceito-termos"
                checked={aceito}
                onCheckedChange={setAceito}
              />
              <label 
                htmlFor="aceito-termos" 
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                Li e entendi os Termos e Condições Gerais de Uso
              </label>
            </div>
            
            {/* <Button 
              onClick={handleDownloadPdf}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF dos Termos e Condições
            </Button> */}
            
            <Button 
              onClick={() => navigate(-1)}
              className="w-full mt-4 bg-brand-primary hover:bg-brand-dark text-white"
            >
              Voltar à tela anterior
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}