import { useCallback, useReducer } from 'react'

interface TemplateType {
  id: string
}

export type ReducerAction<T extends TemplateType> =
  | { type: 'set', payload: T[] }
  | { type: 'add', payload: T }
  | { type: 'update', payload: T }
  | { type: 'remove', payload: string }

function anexoReducer <T extends TemplateType> (state: T[], action: ReducerAction<T>): T[] {
  switch (action.type) {
    case 'set':
      return action.payload
    case 'add':
      return [...state, action.payload]
    case 'update':
      return state.map(item => item.id === action.payload.id ? action.payload : item)
    case 'remove':
      return state.filter(item => item.id !== action.payload)
    default:
      return state
  }
}

export function useArrayReducer <T extends TemplateType> (initialState: T[]): [
  T[],
  (payload: T[]) => void,
  (payload: T) => void,
  (payload: T) => void,
  (payload: string) => void
] {
  const [state, dispatch] = useReducer(anexoReducer, initialState)

  const set = useCallback((payload: T[]) => {
    dispatch({ type: 'set', payload })
  }, [])

  const add = useCallback((payload: T) => {
    dispatch({ type: 'add', payload })
  }, [])

  const update = useCallback((payload: T) => {
    dispatch({ type: 'update', payload })
  }, [])
  const remove = useCallback((payload: string) => {
    dispatch({ type: 'remove', payload })
  }, [])

  return [state as T[], set, add, update, remove]
}
