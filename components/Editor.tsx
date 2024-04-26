"use client"

import TextAreaAutosize from "react-textarea-autosize"
import { useForm } from "react-hook-form"
import { PostCreationRequest, PostValidator } from "@/lib/validators/post"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useRef, useState } from "react"

import EditorJS from "@editorjs/editorjs"
import { uploadFiles } from "@/lib/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"

interface EditorProps{
    subredditId: string
}

const Editor = ({ subredditId }: EditorProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: '',
            content: null,
        }
    })

    const ref = useRef<EditorJS>()
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const _titleRef = useRef<HTMLTextAreaElement>(null)
    const { toast } = useToast()
    const router = useRouter()
    const pathname = usePathname()

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        const Code = (await import('@editorjs/code')).default
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default

        if(!ref.current){
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor
                },
                placeholder: 'Type here to write your post...',
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link'
                        }
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File){
                                    const [res] = await uploadFiles("imageUploader", {files: [file]})

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.url
                                        }
                                    }
                                }
                            }
                        }
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                }
            })
        }
    }, [])
    
    useEffect(() => {
        if(typeof window !== "undefined"){
            setIsMounted(true)
        }
    }, [])

    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                value
                toast({
                    title: 'Something went wrong.',
                    description: (value as { message: string }).message,
                    variant: 'destructive',
                })
            }
        }
    }, [errors])

    useEffect(() => {
        const init = async () => {
            await initializeEditor()

            setTimeout(() => {
                _titleRef.current?.focus()
            }, 0)
        }

        if(isMounted){
            init()

            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    }, [isMounted, initializeEditor])

    const { mutate: createPost } = useMutation({
        mutationFn: async ({ title, subredditId, content }: PostCreationRequest) => {
            const payload: PostCreationRequest = { title, subredditId, content }
            const { data } = await axios.post('/api/subreddit/post/create', payload)
            return data
        },
        onError: () => {
            return toast({
                title: 'Something went wrong',
                description: 'Your post was not published, please try again',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            const newPathname = pathname.split('/').slice(0, -1).join('/')
            router.push(newPathname)

            router.refresh()

            return toast({
                title: 'Post published',
                description: 'Your post was published successfully'
            })
        },
    })

    async function onSubmit(data: PostCreationRequest){
        const blocks = await ref.current?.save()

        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            subredditId
        }

        createPost(payload)
    }

    if(!isMounted) return null

    const { ref: titleRef, ...rest } = register('title')

    return (
        <div className="w-full p-4 border rounded-lg bg-zinc-50 border-zinc-200">
            <form id="subreddit-post-form" className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="prose prose-stone dark:prose-invert">
                    <TextAreaAutosize 
                        ref={(e) => {
                            titleRef(e)

                            // @ts-ignore
                            _titleRef.current = e
                        }} 
                        {...rest}
                        placeholder="Title" 
                        className="w-full overflow-hidden text-5xl font-bold bg-transparent appearance-none resize-none focus:outline-none" 
                    />
                    <div id="editor" className="min-h-[500px]" />
                </div>
            </form>
        </div>
    )
}

export default Editor