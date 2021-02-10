function quiz(_questions ,options = {}){

    let questions;
    let timerAnswer = 15 //кол-во сек на ответ
    let correctShow = false //показывать верный ответ или нет при неправильном ответе
    const _quiz = _createQuiz()

    if(_questions){
        questions = _questions;
    }

    if(options.timerAnswer) {timerAnswer = options.timerAnswer}
    if(options.correctShow) {correctShow = options.correctShow}

    _quiz.addEventListener('click', buttonsClicQuizHandler)

    let que_count = 0; //счетчик впросов
    let counter; //для таймера setInterval
    let userScore = 0; //счетчик правильных ответов

    const info_box = document.querySelector('.info_box')

    const quiz_box = document.querySelector('.quiz_box')
    const options_list = quiz_box.querySelector('.option_list')
    const next_btn = quiz_box.querySelector('.next_btn')
    const timeText = quiz_box.querySelector('.timer .time_text')
    const timeCount = quiz_box.querySelector('.timer .time_sec')
    const timeLine = quiz_box.querySelector('.time_line')

    const result_box = document.querySelector('.result_box')

    const tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>' //галочка для верного ответа
    const crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>' //крестик для не верного ответа

    function _createQuiz(){
        const quiz = document.createElement('div')
        quiz.classList.add('quiz')
        quiz.insertAdjacentHTML('afterbegin', `
            <div class="info_box">
            <div class="info_title">
                <span>Правила Прохождения Тестирования</span>
            </div>
            <div class="info_list">
                <div class="info">1. Вам дается <span>${timerAnswer} с.</span> для выбора ответа.</div>
                <div class="info">2. После выбора ответа, вы не сможете изменить его.</div>
                <div class="info">3. Вы не можете выбрать ответ, по завершению времени.</div>
                <div class="info">4. Вы не можете выйти из теста во время его прохождения.</div>
            </div>
            <div class="buttons">
                <button class="quit" data-quit="true">Выйти</button>
                <button class="restart" data-continue="true">Далее</button>
            </div>
            </div>

            <div class="quiz_box">
                <header>
                    <div class="title">Тестирование Началось</div>
                    <div class="timer">
                        <div class="time_text">Осталось</div>
                        <div class="time_sec">**</div>
                    </div>
                    <div class="time_line"></div>
                </header>
                <section>
                    <div class="que_text">
                    </div>
                    <div class="option_list">
                    </div>
                </section>

                <footer>
                    <div class="total_que">
                    </div>
                    <button class="next_btn" data-next="true">Далее</button>
                </footer>
            </div>

            <div class="result_box">
                <div class="icon">
                    <i class="fas fa-crown"></i>
                </div>
                <div class="complete_text">Тест Завершен!</div>
                <div class="score_text">
                </div>
                <div class="buttons">
                    <button class="restart" data-restart="true">Повторить</button>
                    <button class="quit" data-quit_result="true">Выйти</button>
                </div>
            </div>
        `)
        document.body.appendChild(quiz)
        return quiz
    }


    //ф-ция обработчика событий блока с классом QUIZ (обработка кнопок)
    function buttonsClicQuizHandler(event){
        //нажатие на кнопу Выйти в Info_box
        if(event.target.dataset.quit){
            console.log('quit')
            info_box.classList.remove('activeInfo')
        }

        //нажатие кнопки Продолжить в Info_box
        if(event.target.dataset.continue){
            console.log('continue')
            info_box.classList.remove('activeInfo')
            quiz_box.classList.add('activeQuiz')
            showQuestions(0)
            startTimer(timerAnswer)
            next_btn.style.display = 'none'
        }
        
        //нажатие кнопки ДАЛЕЕ в тесте
        if(event.target.dataset.next){
            console.log('next')
            if(que_count < questions.length-1){
                next_btn.style.display = 'none';
                que_count++
                showQuestions(que_count);
                clearInterval(counter)
                startTimer(timerAnswer)
                timeText.textContent = 'Осталось'
            }else{// если вопросы закончились
                showResultBox()
                timeText.textContent = 'Осталось'
            }
        }

        //нажатие кнопки Выйти в окне результата
        if(event.target.dataset.quit_result){
            console.log('quit_result')
            result_box.classList.remove('activeResult')
        }

        //нажатие кнопки Повторить в окне результата
        if(event.target.dataset.restart){
            console.log('restart')
            result_box.classList.remove('activeResult')
            quiz_box.classList.add('activeQuiz')
            showQuestions(0)
            startTimer(timerAnswer)
            next_btn.style.display = 'none'
        }
    }

     //вывод вопроса и вариантов ответа из массива
    function showQuestions(index){
        const que_text =document.querySelector('.que_text')
        let que_tag = `<span>${questions[index].question}</span>`
        que_text.innerHTML = que_tag

        let options_text = ''
        questions[index].options.forEach( (item, ind) => {
            options_text += `<div class="option">
                                <span>${item}</span>
                            </div>`
        })
        options_list.innerHTML = options_text
    
        const option = options_list.querySelectorAll('.option')
        option.forEach(item =>{
            item.addEventListener('click',  optionSelected)
        })

        const total_que = document.querySelector('.total_que')
        total_que.innerHTML = `<span><p>${index+1}</p>Из<p>${questions.length}</p>Вопросов</span>`
    }

    //Выбор ответа
    function optionSelected(e){
        clearInterval(counter)//останавливаем таймер
        
        const allOption = options_list.querySelectorAll('.option')
        const userAnswer = this.textContent.trim()
        const correctAnswer = questions[que_count].answer

        if(userAnswer === correctAnswer){
            userScore+=1
            this.classList.add('correct')
            this.insertAdjacentHTML("beforeend", tickIcon)
        }else{
            this.classList.add('incorrect')
            this.insertAdjacentHTML("beforeend", crossIcon)

            if(correctShow){
                allOption.forEach(item => {
                    if(item.textContent.trim() == correctAnswer && item.textContent.trim() != userAnswer){
                        item.classList.add('correct')
                        item.insertAdjacentHTML("beforeend", tickIcon)
                    }
                })
            }
        }

        allOption.forEach(item => {
            item.classList.add('disable')
        })
        
        next_btn.style.display = 'block'
    }

    //Таймер отсчета времения на ответ на вопрос
    function startTimer(time){
        counter = setInterval(timer, 1000)

        function timer(){
            timeCount.textContent = time;
            timeLine.style.width =  Math.round((time*100)/timerAnswer) + '%'
            time--;
            if(time<9){
                const addZerro = timeCount.textContent
                timeCount.textContent = '0' + addZerro
    
            }
            if(time<0){
                clearInterval(counter)
                timeCount.textContent = '00'
                timeText.textContent = 'Время вышло'
    
                const allOption = options_list.querySelectorAll('.option')
                allOption.forEach(item => {
                    item.classList.add('disable')
                })
                next_btn.style.display = 'block'
            }
        }
    }

    // вывод окна с результатов опроса
    function showResultBox(){
        quiz_box.classList.remove('activeQuiz')
        result_box.classList.add('activeResult')
        que_count = 0

        const score_text = result_box.querySelector('.score_text')

        if(userScore == 0){//если правильных ответов нет
            score_text.innerHTML = `<span>к сожалению, Вы ответили не верно на все вопросы:(</p></span>`
        }else if(userScore < Math.round((50*questions.length)/100)){//если правильных ответов меньше 50%
            score_text.innerHTML = `<span>к сожалению, Вы ответили верно на <p>${userScore}</p> ${declQuest(userScore)} из <p>${questions.length}</p></span>`
        }else if(userScore < Math.round((80*questions.length)/100)){//если правильных ответов межуд 50%-80% 
            score_text.innerHTML = `<span>не плохо, Вы ответили верно на <p>${userScore}</p> ${declQuest(userScore)} из <p>${questions.length}</p></span>`
        }else if(userScore < Math.round((100*questions.length)/100)){//если правильных ответов меньше межуд 80%-99%  
            score_text.innerHTML = `<span>отлично, Вы ответили верно на <p>${userScore}</p> ${declQuest(userScore)} из <p>${questions.length}</p></span>`
        }else if(userScore == Math.round((100*questions.length)/100)){//если все ответы верны
            score_text.innerHTML = `<span>превосходно, Вы ответили верно на <p>${userScore}</p> ${declQuest(userScore)} из <p>${questions.length}</p></span>`
        }
        userScore = 0;
    }


    //склонение слова 'вопрос' в зависимости от числа правильных вопросов ( 1-вопрос, 2-вопросА, 6-вопросОВ)
    function declQuest(userScore){
        const lastNumb = Number(userScore.toString().split('').slice(-1)[0])

        if(lastNumb == 1 && (userScore < 11 || userScore > 14)){
            return 'вопрос'
        }
        if(lastNumb > 1 && lastNumb < 5 && (userScore < 11 || userScore > 14)){
            return 'вопроса'
        }
        if(lastNumb > 4 || lastNumb == 0 || (userScore > 10 && userScore < 15)){
            return 'вопросов'
        }
    }

    return {
        start() {
            if(!questions){
                console.error('Объект с вопроссами не был передан! Исп-те метод .setQuestions({questions}).')
                return null
            }
            info_box.classList.add('activeInfo') 
        },
        setQuestions(new_questions) {
            if(!new_questions){
                console.error('Объект с вопроссами не был передан!')
                return null
            }
            questions = new_questions
        },
        destroy() {
            _quiz.remove()
            removeEventListener('click',buttonsClicQuizHandler)
            removeEventListener('click',optionSelected)
        },
    }
}