import { useState } from 'react'

export const useDataForm = <T,>(initialState: T): [
  T,
  (name: string, value: string | boolean | number) => void,
  (data: T) => void,
  () => void,
] => {
  const [data, setData] = useState<T>(initialState)

  const setDataValue = (name: string, value: string | boolean | number): void => {
    // console.log(data)
    // console.log({ name, value })
    setData({ ...data, [name]: value })
  }

  const resetData = (): void => {
    setData(initialState)
  }

  return [
    data,
    setDataValue,
    setData,
    resetData
  ]
}
