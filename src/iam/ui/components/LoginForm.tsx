import React, { type ReactElement, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type AppDispatch, type RootState } from '@/shared/config/store'
import { type LoginData } from '@/iam/models/interfaces/login.interface'
import { login } from '@/shared/config/store/features/auth-slice'
import { STATUS } from '@/shared/config/store/types'
import Button from '@/shared/ui/components/Button'
import Spinner from '@/shared/ui/components/Spinner'

interface FormState {
  loginData: LoginData
  errors: {
    password: string
    username: string
  }
}

const LoginForm = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState(null)
  const [hasFailed, setHasFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const loginStatus = useSelector<RootState>(({ auth }: RootState) => auth.status, shallowEqual)

  useEffect(() => {
    setHasFailed(loginStatus === STATUS.FAILED)
    setIsLoading(loginStatus === STATUS.PENDING)
  }, [loginStatus])

  const [loginData, setLoginData] = useState<FormState['loginData']>({
    password: '',
    username: ''
  })

  const [errors, setErrors] = useState<FormState['errors']>({
    password: '',
    username: ''
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void dispatch(login(loginData)).unwrap()
      .then(response => {
        navigate('/inicio')
      })
      .catch(error => {
        const { message } = error.data
        setErrorMessage(message.toUpperCase())
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    if (value.trim() === '') {
      setErrors({
        ...errors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} cant no empty`
      })
    } else {
      setErrors({
        ...errors,
        [name]: ''
      })
    }

    setLoginData({
      ...loginData,
      [name]: value
    })
  }

  const inputClass = 'block w-full h-10 px-2 border border-gray-300 rounded-xl outline-none px-4'

  return isLoading
    ? (
      <Spinner />
      )
    : (
      <div className='w-full max-w-[430px] shadow-card p-6 rounded-lg'>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <input
              className={inputClass}
              onChange={handleChange}
              type="text" value={loginData.username}
              name='username'
              placeholder='Usuario' />
            <p className='text-red font-bold'>{errors.username}</p>
          </div>

          <div className='mb-4'>
            <input
              className={inputClass}
              onChange={handleChange}
              type="password"
              value={loginData.password}
              name='password'
              placeholder='Contraseña' />
            <p className='text-red font-bold'>{errors.password}</p>
          </div>

          <p className='text-center text-red font-bold mb-4'>{hasFailed ? errorMessage : ''}</p>

          <div className='flex justify-start'>
            <Button color='primary' type='submit' className='px-9'>
              Ingresar
            </Button>
          </div>
        </form>
      </div>

      )
}

export default LoginForm
