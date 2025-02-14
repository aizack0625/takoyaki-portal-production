import Image from 'next/image'
import React from 'react'
import { Dela_Gothic_One } from 'next/font/google';

const delaGothicOne = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400"
});

export const Header = () => {
  return (
    <>
      <div style={{backgroundColor: "#EFD0B8" }}>
        <div className='container mx-auto px-6 text-center relative h-[200px]'>
          <div className='relative w-full h-full'>
            <Image
              src="/takoyaki.jpg"
              fill
              alt='たこ焼きの画像'
              className='opacity-80 object-cover'
              priority
            />
            <div
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded z-10'
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              <h1 className={`${delaGothicOne.className} text-4xl sm:text-5xl md:text-6xl`}
                style={{
                  textShadow: '0px 0px 10px rgba(131, 188, 135, 1)',
                  color: '#FF8E8E'
                }}
              >
                たこポー
              </h1>
              <p className='md:text-xl text-sm font-bold'
                style={{
                  textShadow: '0px 0px 10px rgba(131, 188, 135, 1)',
                  color: '#FF8E8E'
                }}
              >
                たこ焼き屋ポータルサイト
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

