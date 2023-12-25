//  Elementos
const notesContainer = document.querySelector("#notes-container")
const noteInput = document.querySelector("#note-content")
const addNoteBtn = document.querySelector(".add-note")
const searchInput = document.querySelector("#search-input")
const exportBtn = document.querySelector("#export-notes")
const temasBtn = document.querySelector("#themes")

// Funções
function showNotes(){
        cleanNotes()

    // Mostrar Cada note que esta salva no local storage
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed)

        notesContainer.appendChild(noteElement) //exibir notes vindas do local storage
    });
}

function cleanNotes(){
    notesContainer.replaceChildren([]) //array vazio
}

function addNote(){
    const notes = getNotes(); //Obter array com dados já salvos no local Storage

    // Dados de entrada para criação das notes
   const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
   }

  const noteElement = createNote(noteObject.id, noteObject.content)

  notesContainer.appendChild(noteElement) //exibir notes vindas do Temporariamente

  notes.push(noteObject)

  saveNotes(notes)

  noteInput.value = ""
}


function generateId(){
    return Math.floor(Math.random() * 5000) //Número de 0 a 5000
}

// Criação de Notes, função que retorna note
function createNote(id, content, fixed){

    const element = document.createElement("div")

    element.classList.add("note")

    const textarea = document.createElement("textarea")

    textarea.value = content
    
    textarea.placeholder = "Adicionar algum texto... "

    element.appendChild(textarea)

    const pinIcon = document.createElement("i")

    pinIcon.classList.add(...["bi", "bi-pin"])

    element.appendChild(pinIcon)

    const deleteIcon = document.createElement("i")

    deleteIcon.classList.add(...["bi", "bi-x-lg"])

    element.appendChild(deleteIcon)

    const duplicateIcon = document.createElement("i")

    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"])

    element.appendChild(duplicateIcon)


    // Estilo para fixos
    if(fixed){
        element.classList.add("fixed")
    }

    // como os elementos foram criados dinamicamente, teremos os eventos dentro da função:

    element.querySelector(".bi-pin").addEventListener("click", () =>{
        toggleFixNote(id)
    })

    element.querySelector(".bi-x-lg").addEventListener("click", () =>{
        deleteNote(id, element)
    })
    
    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () =>{
        copyNote(id)
    })

    element.querySelector("textarea").addEventListener("keyup", (e) =>{
        const newContent = e.target.value

        updateNote(id, newContent)
    })
    
    return element;
}


function toggleFixNote(id){
    
    const notes = getNotes()

    // método filter retorna um array contendo todos os elementos que correspondem ao critério de filtragem.  
    const targetNote = notes.filter((note) => note.id == id)[0]

    // Como os ids são únicos, ao utilizar [0] eu acesso o objeto em específico

    targetNote.fixed = !targetNote.fixed 

    saveNotes(notes)

    // Limpar notes antigos e exibir eles com mudança de fixed (true ou false)
    showNotes()
}

function deleteNote(id, element){
    
    // Remover da local storage, salvando apenas notes diferentes do que eu quero remover
    const notes = getNotes().filter((note) => note.id !== id)
    saveNotes(notes)

    // Remover do DOM 
    notesContainer.removeChild(element)
}

function copyNote(id){
    const notes = getNotes()

    const targetNote = notes.filter((note) => note.id === id)[0]

    // Criar objeto note com mesmo content, fixed (copy), mas com id diferente
    const noteObj = {
        id: generateId(),
        content: targetNote.content,
        fixed: false
    }

    const noteElement = createNote (noteObj.id, noteObj.content, noteObj.fixed)


    notesContainer.appendChild(noteElement) //Adicionar o noteCopy no DOM 

    //Salvar o noteCopy no local storage 
    notes.push(noteObj)
    saveNotes(notes)
}

function updateNote(id, newContent){
    const notes = getNotes()

    const targetNotes = notes.filter((note) => note.id === id)[0]

    targetNotes.content = newContent
    saveNotes(notes)
}

//  Local Storage

// obter os dados (array)
function getNotes(){
    const notes = JSON.parse((localStorage.getItem("notes") || "[]"))

    // É feito uma ordenação de prioridades com base no valor booleano fixed.
    const orderedNotes = notes.sort( (a, b) => (a.fixed > b.fixed? -1 : 1))

    return orderedNotes;
}

// salvar os dados (array) no local storage
function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes))
}

function searchNotes(search){

    const searchResults = getNotes().filter((note) => {
        return note.content.includes(search)
    })


    if(search !== " "){
        cleanNotes()

        searchResults.forEach((note) =>{
            const noteElement = createNote(note.id, note.content)

            notesContainer.appendChild(noteElement)
        })

        return
    }

    cleanNotes()

    showNotes()
}

function exportData(){
    const notes = getNotes()

    // Separa o dado por "," e quebra linha por "|n"

    // map:  iterar sobre todos os elementos de um array e criar um novo array contendo os resultados de uma operação específica aplicada a cada elemento do array original.

    // join:  usado para criar e retornar uma nova string concatenando todos os elementos de um array, separados por um separador específico ou, por padrão, uma vírgula. 

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed])
    ]
    .map((e) => e.join(",")) 
    .join("\n")

    const element = document.createElement("a")

    element.href = "data:text/csv;charset-utf-8,"+encodeURI(csvString)
    element.target = "_blank"

    element.download = "notes.csv"

    element.click()
}

// Função cores


function mudancaDeCor(cor, classeCor) {
    const html = document.documentElement;
    const caixasTema = document.querySelectorAll(".caixaThema");
    
        cor.addEventListener("click", () => {
            console.log("deu certo!");

            caixasTema.forEach(caixa => {
                caixa.classList.remove("caixaThemaAtiva");
            });

            html.classList = [];
            html.classList.remove("verde", "branco", "azul", "rosa");
            
            cor.classList.add("caixaThemaAtiva")
            
            html.classList.add(classeCor);
        });
    
}


function optionTemas(){

   const element = document.createElement("div")
   element.classList.add("themes")

   const titulo = document.createElement("p")
   titulo.classList.add("tituloThemes")
   titulo.innerText = "Tema"
   element.appendChild(titulo)

   const options = document.createElement("div")
   options.classList.add("optionsThemes")

    // cores
   const preto = document.createElement("div")
   preto.setAttribute("id", "themePreto");
   preto.classList.add("caixaThema")
   options.appendChild(preto)

   const branco = document.createElement("div")
   branco.setAttribute("id", "themeBranco");
   branco.classList.add("caixaThema")
   options.appendChild(branco)

   const azul = document.createElement("div")
   azul.setAttribute("id", "themeAzul");
   azul.classList.add("caixaThema")
   options.appendChild(azul)

   const verde = document.createElement("div")
   verde.setAttribute("id", "themeVerde");
   verde.classList.add("caixaThema")
   options.appendChild(verde)

   const rosa = document.createElement("div")
   rosa.setAttribute("id", "themeRosa");
   rosa.classList.add("caixaThema")
   options.appendChild(rosa)

   element.appendChild(options)

    document.body.appendChild(element);

   
    mudancaDeCor(verde, "verde")
    mudancaDeCor(branco, "branco")
    mudancaDeCor(azul, "azul")
    mudancaDeCor(rosa, "rosa")
    mudancaDeCor(preto, "preto")
}


// Eventos


// click no botão "+"
addNoteBtn.addEventListener("click", () =>{
    addNote()
})

noteInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter"){
        addNote()
    }
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    searchNotes(search);
});

exportBtn.addEventListener("click", () =>{
    exportData()
})

temasBtn.addEventListener("click", () =>{
    if (temasBtn.classList.contains("themesActive")) {
        temasBtn.classList.remove("themesActive");
        const element = document.querySelector(".themes");
        element.remove();
     
     } else {
        optionTemas();
        temasBtn.classList.add("themesActive");
     }
})

// Inicialização 
showNotes()  //Primeira tarefa que é feita, buscar os dados(Notes) salvos antes e exibir