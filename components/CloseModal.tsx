"use client"

import React from 'react'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CloseModal = () => {
    const router = useRouter()
    return (
        <Button 
            onClick={() => router.back()}
            variant='ghost' 
            className='w-6 h-6 p-0 rounded-md' 
            aria-label='close modal'
        >
            <X className='w-4 h-4' />
        </Button>
    )
}

export default CloseModal