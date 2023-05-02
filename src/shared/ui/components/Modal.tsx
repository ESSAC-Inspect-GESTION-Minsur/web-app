import React, { type ReactElement } from 'react'

interface ModalProp {
  children?: React.ReactNode
}

const Modal = ({ children }: ModalProp): ReactElement => {
  return (
    <div className="fixed top-0 left-0 w-full h-full max-h-screen bg-gray-light flex justify-center items-start z-[100] overflow-y-auto ">
      <div className=" bg-white p-5 rounded-xl flex flex-column items-center justify-center mt-10 my-6">
        { children }
      </div>
    </div>
  )
}

export default Modal
