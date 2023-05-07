import React, { type ReactElement, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type AppDispatch, type RootState } from '@/shared/config/store'
import { login } from '@/shared/config/store/features/auth-slice'
import { STATUS } from '@/shared/config/store/types'
import Button from '@/shared/ui/components/Button'
import { useDataForm } from '@/shared/hooks/useDataForm'
import Input from '@/shared/ui/components/Input'
import { USER_LOGIN_INITIAL_STATE, type UserLogin } from '@/users/models/user.interface'

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

  const [userLogin, setUserLoginValue] = useDataForm<UserLogin>(USER_LOGIN_INITIAL_STATE)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void dispatch(login(userLogin)).unwrap()
      .then(response => {
        navigate('/inicio')
      })
      .catch(error => {
        const { message } = error.data
        setErrorMessage(message.toUpperCase())
      })
  }

  return (
    <div className='w-full max-w-[430px] shadow-card p-6 rounded-lg'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <Input
            label='Usuario'
            name='username'
            placeholder='Usuario'
            setValue={setUserLoginValue}
            value={userLogin.username}
            type='text'
          />
        </div>

        <div className='mb-4'>
          <Input
            label='Contraseña'
            name='password'
            placeholder='Contraseña'
            setValue={setUserLoginValue}
            value={userLogin.password}
            type='password'
          />
        </div>

        <p className='text-center text-red font-bold mb-4'>{hasFailed ? errorMessage : ''}</p>

        <div className='flex justify-start'>
          <Button color='primary' type='submit' className='px-9' isLoading={isLoading}>
            Ingresar
          </Button>
        </div>
      </form>
    </div>

  )
}

export default LoginForm
