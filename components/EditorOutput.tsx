"use client"

import dynamic from "next/dynamic"

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default,
{
    ssr: false
})

interface EditorOutputProps{
    content: any
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem'
    }
}

const renderers = {
    image: CustomImageRenderer,
    // code: CustomCodeRenderer
}

const EditorOutput = ({ content }:EditorOutputProps) => {
    return (
        <Output data={content} style={style} className='text-sm' renderers={renderers} />
    )
}

import Image from 'next/image'

function CustomImageRenderer({ data }: any) {
    const src = data.file.url

    return (
        <div className='relative w-full min-h-[15rem] mb-6'>
            <Image alt='image' className='object-cover' fill src={src} />
        </div>
    )
}

export default EditorOutput