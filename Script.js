const apiKeyInput = document.getElementById('apikey')
const GameSelect = document.getElementById('GameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const iaresponse = document.getElementById('iaresponse')
const form = document.getElementById('form')
const novaOpcao = new Option('Pergunte sobre qualquer coisa', 'Qualquer Tema')
GameSelect.add(novaOpcao);

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}


// AIzaSyBlb0IPIjYi22E7iM45D0YZV8qmrijZXnE

const perguntarAI = async (question, game, apikey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apikey}`
    const pergunta = `
    ## Especialidade

        Você é um especialista assistente de meta para o jogo ${game}
        Você é um especialista assistente de perguntas gerais do dia a dia ${novaOpcao}

    ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento dos jogos, estrategias e builds.

    ## Regras
        - Responda de uma maneira objetiva e direta se for o caso, mas com alguns exemplos se for necessário.
        - Se você não souber a resposta, responda com ' Não sei' e não tente inventar uma resposta.
        - Caso a pergunta for de forma geral análise como um especialista da área ou busque informações de acordo com a pergunta antes de retorna a resposta.
        - Considere a data atual ${new Date().toLocaleDateString()} faça pesquisas atualizadas sobre os conteúdos exibidos baseados na data atual para dar uma resposta coenrentes.
        - E se for um conteúdo sensivel ou relacionado há algo sexual ou do tipo responda ' Não tenho informações sobre!
        - Caso a pergunta for sobre jogos nunca responda itens que você não tem certeza que  estão no patch atual.
    ## Resposta
     -Economize na respota, seja direto e responda no máximo 500 caracteres.
     -Responda em markdown.
     -Não precisa responder com saudação ou despedida, apenas responda o que o usuário está querendo.


    ## Exemplo de resposta
    - Pergunta do usuário: melhor build rengar jungle
     resposta: A build mais atual é:  \n \n **Itens**  \n  \n coloque os itens aqui.  \n  \n ** Runas  \n  \n
     
     ___
     Aqui está a pergunta do usuário: ${question}
     
     - Pergunta do usuário Melhor receita
     respota receita e liste os ingredientes e as quantidades por porção.


    `
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }
    ]

    //chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    console.log({ data })
    return data.candidates[0].content.parts[0].text

}


const enviarformulario = async (event) => {
    event.preventDefault()
    const apikey = apiKeyInput.value
    const game = GameSelect.value
    const question = questionInput.value

    if (apikey == '' || game == '' || question == '') {
        alert('Por favor preencha todos os campos')
        return
    }
    askButton.disabled = true
    askButton.textContent = 'Perguntando ...'
    askButton.classList.add('loading')

    try {
        // Perguntar para IA
        const text = await perguntarAI(question, game, apikey)
        iaresponse.innerHTML = markdownToHTML(text)
        iaresponse.classList.remove('hidden')
    } catch (error) {
        console.log('erro', error)

    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }



}
form.addEventListener('submit', enviarformulario)