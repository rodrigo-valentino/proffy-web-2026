import { Link } from 'react-router'
import avatar from '../../assets/avatar.svg'
import ilustra from '../../assets/ilustra.svg'
import logo from '../../assets/logo.svg'
import heart from '../../assets/heart.svg'
import { BookOpen, Power, Presentation } from 'lucide-react'

export function Home() {
    return (
        <div className="min-w-screen min-h-screen grid grid-rows-5">
            <div className="flex flex-col justify-center items-center row-span-3 bg-purple">
                <header className="min-w-6xl flex justify-between mt-6">
                    <div className="flex items-center justify-center">
                        <img src={avatar} className="h-10 w-10 rounded-full" />
                        <h3 className='font-poppins-regular font-medium text-base text-text-purple-base ms-4'>
                            Rafael Rocha
                        </h3>
                    </div>
                    <Link to={"/sign-in"} className='w-10 h-10 opacity-90 hover:opacity-100 bg-dark-purple flex items-center justify-center rounded-lg cursor-pointer'>
                        <Power size={20} className='text-text-purple-base' />
                    </Link>
                </header>

                <div className='flex flex-row justify-between items-center min-w-6xl h-full'>
                    <img src={logo} alt="" className='w-[434px] h-[217px]' />
                    <img src={ilustra} alt="" className='w-[599px] h-[350px]' />
                </div>
            </div>

            <div className='w-full flex justify-center row-span-2 bg-background'>
                <div className='flex flex-row justify-between items-center min-w-6xl h-full'>
                    <p className='text-text-base font-poppins-regular text-xl'>
                        Seja bem-vindo.<br />
                        <span className='font-poppins-semibold'>O que deseja fazer?</span>
                    </p>
                    <div className='flex flex-row items-end-safe'>
                        <span className='font-poppins-regular text-base text-right text-text-complement ms-20'>
                            Total de 285 conexões <br />
                            <span className='inline-flex items-center justify-end gap-2'>
                                já realizadas
                                <img src={heart} alt="" className='w-3.5 h-3.5 ms-2' />
                            </span>
                        </span>
                    </div>
                    <div className='flex flex-row justify-center items-center gap-4'>
                        <Link
                            to={"/study"}
                            className='flex gap-6 w-[282px] h-[104px] bg-another-purple transation: hover:bg-purple rounded-lg justify-center items-center cursor-pointer'
                        >
                            <BookOpen size={40} className='text-white' />
                            <span className='font-archivo-bold text-2xl text-white'>Estudar</span>
                        </Link>

                        <Link
                            to={"/give-classes"}
                            className='flex gap-6 w-[282px] h-[104px] bg-green transation: hover:bg-green-dark rounded-lg justify-center items-center cursor-pointer'
                        >
                            <Presentation size={40} className='text-white' />
                            <span className='font-archivo-bold text-2xl text-white'>Dar aulas</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}