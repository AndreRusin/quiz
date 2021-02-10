
let quest_base = []
const _quiz = quiz();
const start_btn = document.querySelector('.start_btn')
const select_quiz = document.querySelector('.select_quiz')
start_btn.querySelector('button').disabled = true
start_btn.addEventListener('click',startQuiz)


const firebaseConfig = {
    apiKey: "AIzaSyB2bmIQ2pmDJDlsYphnX9Pfc_YiAXPMq2A",
    authDomain: "quiz-app-a0506.firebaseapp.com",
    projectId: "quiz-app-a0506",
    storageBucket: "quiz-app-a0506.appspot.com",
    messagingSenderId: "134133423770",
    appId: "1:134133423770:web:c64c6d452a943a7b458923"
  };

  firebase.initializeApp(firebaseConfig);

  function readDBquestion() {
    return fetch('https://quiz-app-a0506-default-rtdb.firebaseio.com/tests.json')
        .then(response => response.json())
        .then(data => {
            readDBhandler(data)
            start_btn.querySelector('button').disabled = false
        })
  }

  readDBquestion()


function readDBhandler(base_que){
    quest_base = base_que
    const test_list = document.createElement('select')
    test_list.classList.add('test_select')
    let test_list_content = `<option value="disable" disabled selected>Выберите Тест</option>`
    for(let key in quest_base){
        test_list_content+=`<option value="${key}" >${quest_base[key].name}</option>`
    }
    test_list.innerHTML = test_list_content;
    select_quiz.appendChild(test_list)

}

function startQuiz(){
    const test_list = document.querySelector('.test_select')
    for(let i=0; i<test_list.options.length; i++){
        if(test_list.options[i].selected){
            if(test_list.options[i].value == 'disable'){
                alert('Выберете тест!')
                break
            }
            _quiz.setQuestions(quest_base[test_list.options[i].value].questions)
            _quiz.start()
            break
        }
    }
}

