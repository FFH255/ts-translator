import { useRef, useState } from "react"
import { Translator, Variable } from "../domain"
import { CompileError, SyntexError } from "../domain/errors"
import "./App.css"

function App() {
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
  Ц = "0" ! "1" ! ... "9"`

  const ref = useRef<HTMLDivElement | null>(null)

  const [error, setError] = useState("")

  const [vars, setVars] = useState(new Array<Variable>())

  const removeHighlighting = () => {
    const div = ref.current
    if (!div) {
      return
    }
    const input = div.innerHTML
      .replace(/<mark style="background: red;">/g, "")
      .replace(/<\/mark>/g, "")
    div.innerHTML = input
  }

  const highlightText = (from: number, to: number) => {
    const div = ref.current
    if (!div) {
      return
    }
    const textBeforeSelection = div.innerHTML.substring(0, from)
    const selectedText = div.innerHTML.substring(from, to)
    const textAfterSelection = div.innerHTML.substring(to)

    const highlightedText = `<mark style="background: red;">${selectedText}</mark>`
    const newText = textBeforeSelection + highlightedText + textAfterSelection

    div.innerHTML = newText
  }

  const execute = () => {
    removeHighlighting()
    const input = ref.current?.innerHTML
    if (!input) {
      return
    }
    const translator = new Translator()
    try {
      console.log(input)
      const env = translator.translate(input)
      console.log(env)
      setVars(env)
      setError("")
    } catch (e) {
      if (e instanceof SyntexError) {
        setError(e.message)
        setVars([])
        highlightText(e.from, e.to)
      }
      if (e instanceof CompileError) {
        setError(e.message)
        setVars([])
        highlightText(e.token.from, e.token.to)
      } else if (e instanceof Error) {
        setError(e.message)
      }
      console.error(e)
    }
  }

  return (
    <div className="app">
      <div className="main">
        <div className="form__item form__item_direction_col">
          <label>Программа</label>
          <span
            ref={ref}
            className="textarea _border_main"
            contentEditable
            spellCheck={false}
          >
            Начало <br /> Анализ 1.5 5.0 КонецАнализа; <br /> Синтез 0.0
            КонецСинтеза <br />
            1: аа1 =: 10 * 2 <br /> 2: аа2 =: Синус аа1 <br /> Конец
          </span>
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
      <div className="sub">
        <button className="button button_theme_positive" onClick={execute}>
          Выполнить
        </button>
        <span className="form-error-message">{error}</span>
      </div>
      <div className="list item _border_main">
        <div className="item__title">Результат</div>
        {vars.map((variable) => (
          <span key={variable.name}>
            {variable.name} = {variable.value}
          </span>
        ))}
      </div>
    </div>
  )
}

export default App
