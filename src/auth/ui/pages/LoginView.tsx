import React, { type ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '@/shared/config/store/features/auth-slice'

import LoginForm from '../components/LoginForm'

const Login = (): ReactElement => {
  const navigate = useNavigate()
  const authenticated = useSelector(isAuthenticated)

  useEffect(() => {
    if (authenticated) navigate('/inicio')
  }, [])

  const goToTermsAndConditions = (): void => {
    navigate('/terminos-y-condiciones')
  }

  return (
    <div className='container-page h-screen flex justify-center items-center flex-col gap-8'>
      <div className='text-center pb-12'>
        <p className='uppercase text-5xl italic font-bold'>Plataforma de supervisión de unidades</p>
      </div>
      <section className='w-full max-w-[500px]'>
        <img className='w-full' src="/logo-bg.png" alt="ESSAC LOGO" />
      </section>
      <LoginForm />
      <section className='text-center'>
        <img className='w-full max-w-[300px] filter contrast-50' src="/brand.png" alt="ESSAC 40 años" />
        <div className='text-sm mt-3 text-gray-400'>
          <p>ESSAC-Inspect v1.0.8</p>
          <p className='font-bold'>&copy;ESSAC 2023</p>
          <p className='mt-2'><span className='cursor-pointer underline' onClick={goToTermsAndConditions}>Términos y condiciones</span></p>
        </div>
      </section>
    </div>
  )
}

export default Login
