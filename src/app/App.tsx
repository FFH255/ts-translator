import "./App.css"

function App() {

  const defaultProgram = `Начало
  Анализ 1.5 5.0 КонецАнализа;
  Синтез 0.0 КонецСинтеза
  1: аа1 =: 10 * 2
  2: аа2 =: Синус аа1
  Конец`

  const BNF = `Язык = "Начало" Определения Опер ... Опер "Конец"
  Определения = Определение ";" Определение
  Определение = ["Анализ" ! "Синтез"] Вещ ... Вещ ["Конец Анализа" ! "Конец Синтеза"]
  Опер = Метка ... Метка ":" Перем "=:" Прав.часть
  Метка = Цел
  Перем = ББ</Ц...Ц/>
  Прав.часть = </"-"/> Блок ["+" ! "-"] ... Блок
  Блок = Блок1 ["*" ! "/"] ... Блок1
  Блок1 = Блок2 ["&&" ! "||"] ... Блок2
  Блок2 = </Функ ... Функ/> Блок3
  Блок3 = Перм ! Цел
  Функ = "Синус" ! "Косинус" ! "Тангенс"
  Цел = Ц...Ц
  Вещ = Цел "." Цел
  Б = "А" ! "Б" ! ... "Я"
  Ц = "0" ! "1" ! ... "9"

  `

  return (
    <div className="app">
      <div className="main">
        <div className="form__item form__item_direction_col">
          <label>Программа</label>
          <textarea
            className="textarea _border_main"
            spellCheck={false}
            autoFocus
            value={defaultProgram}
          ></textarea>
        </div>
        <div className="form__item form__item_direction_col">
          <label>БНФ</label>
          <textarea
            className="textarea _border_main"
            disabled
            value={BNF}
          ></textarea>
        </div>
      </div>
      <div>
        <button className="button button_theme_positive">Выполнить</button>
      </div>
    </div>
  )
}

export default App
