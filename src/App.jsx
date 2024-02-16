import { useReducer } from 'react'
import './styles.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: 'add_digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete_digit',
  CHOOSE_OPERATION: 'choose_operation',
  EVALUATE: 'evaluate'
}

// reducer function that determines which state to manipulate.
function reducer (state, {type, payload}) {
    switch(type) {
      case ACTIONS.ADD_DIGIT: // A digit was selected.
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      
      // to avoid repeating zeros.
      if (payload.digit === '0' && state.currentOperand == '0') 
          return state;
      
        // to avoid repeating floating points.
        if (payload.digit === '.' && state.currentOperand.includes('.')) 
          return state;
    
        // append onto current operand otherwise.
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}` 
        }
        case ACTIONS.CHOOSE_OPERATION:
          if (state.currentOperand == null && state.previousOperand == null)
            return state;

          if (state.currentOperand == null)
          return {
            ...state,
            operation: payload.operation,
          }
          if (state.previousOperand == null)
            return {
              ...state,
              operation: payload.operation,
              previousOperand: state.currentOperand,
              currentOperand: null,
            }

          return {
            ...state,
            previousOperand: evaluate(state),
            currentOperand: null,
            operation: payload.operation,
          }

        // clear the input field. 
        case ACTIONS.CLEAR:
            return {};

        // evaluate the calculation.
        case ACTIONS.EVALUATE:
          if (state.operation == null || state.currentOperand == null || 
            state.previousOperand == null) {
              return state
            }

            return {
              ...state,
              previousOperand: null,
              overwrite: true,
              operation: null,
              currentOperand: evaluate(state)
            }

        // delete a digit.
        case ACTIONS.DELETE_DIGIT:
          if (state.overwrite) 
          return {
            ...state,
            currentOperand: null,
            overwrite: false
          }

          if (state.currentOperand == null) return state

          if (state.currentOperand.length === 1) {
            return {...state, currentOperand: null}
          }

          return {
            ...state,
            currentOperand: state.currentOperand.slice(0, -1)
          }
    }
}

/*
  helper function that evaluates the operation on two operands. 
*/
function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const cureent = parseFloat(currentOperand)

  // return empty string if both current and prev are not numbers
  if (isNaN(prev) || isNaN(cureent)) 
    return ""

  let computation = ""
  switch (operation) {
    case '+': // add
      computation = prev + cureent
      break
    case '-': // subtract
      computation = prev - cureent
      break
    case '÷': // divide
      computation = prev / cureent
      break
    case '*': // multiply
      computation = prev * cureent
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

// helper function to format the operand.
function formatOperand(operand) {
  if (operand == null) return

  const [integer, decimal] = operand.split('.')

  if (decimal == null) return INTEGER_FORMATTER.format(integer)

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, 
    {})

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>      
      <DigitButton digit="2" dispatch={dispatch}/>      
      <DigitButton digit="3" dispatch={dispatch}/>   
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>      
      <DigitButton digit="5" dispatch={dispatch}/>      
      <DigitButton digit="6" dispatch={dispatch}/>  
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>      
      <DigitButton digit="8" dispatch={dispatch}/>      
      <DigitButton digit="9" dispatch={dispatch}/>   
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>      
      <DigitButton digit="0" dispatch={dispatch}/>     
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App
