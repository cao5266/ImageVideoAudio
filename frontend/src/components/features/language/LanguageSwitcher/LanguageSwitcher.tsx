'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'

const languages = [
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
]

export default function LanguageSwitcher({ currentLocale }: { currentLocale?: string } = {}) {
    const router = useRouter()
    const pathname = usePathname()

    // 从 pathname 中提取当前语言，如果没有提供 currentLocale
    const locale = currentLocale || (pathname.startsWith('/zh') ? 'zh' : pathname.startsWith('/en') ? 'en' : 'zh')

    const handleLanguageChange = (newLocale: string) => {
        // 从 pathname 中移除所有可能的语言前缀
        let pathWithoutLocale = pathname

        // 遍历所有支持的语言，移除语言前缀
        for (const lang of languages) {
            if (pathname === `/${lang.code}` || pathname.startsWith(`/${lang.code}/`)) {
                pathWithoutLocale = pathname.slice(`/${lang.code}`.length) || '/'
                break
            }
        }

        // 确保路径以 / 开头
        const newPath = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`
        router.push(`/${newLocale}${newPath}`)
    }

    const currentLanguage = languages.find((lang) => lang.code === locale)

    return (
        <Select value={locale} onValueChange={handleLanguageChange}>
            <SelectTrigger className='w-[160px]'>
                <div className='flex items-center gap-2'>
                    <Globe className='h-4 w-4' />
                    <SelectValue>{currentLanguage && <span>{currentLanguage.name}</span>}</SelectValue>
                </div>
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                        <span className='flex items-center gap-2'>
                            <span>{lang.name}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
