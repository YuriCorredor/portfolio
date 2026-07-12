import { forwardRef } from 'react'

export const LoaderContainer = forwardRef(({ children, loading, blackHoleStage = 'idle' }, ref) => (
    <>
        <div className={`${loading ? 'opacity-100 z-[10010]' : 'opacity-0 z-[9999] pointer-events-none'} fixed flex justify-center items-center h-screen w-screen bg-black transition-all duration-[2500ms]`}>
            <div className={`${loading ? 'opacity-100' : 'opacity-0'} lds-ring absolute transition-all duration-1000`}>
                <div/><div/><div/><div/>
            </div>
        </div>
        <div
            ref={ref}
            data-black-hole-stage={blackHoleStage}
            className='space-canvas fixed z-[100] flex justify-center items-center w-screen h-screen'
        >
            {children}
        </div>
    </>
))
