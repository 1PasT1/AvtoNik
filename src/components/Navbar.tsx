import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Globe, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

interface NavbarProps {
  language: string
  setLanguage: (lang: string) => void
}

export function Navbar({ language, setLanguage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = ['home', 'how-it-works', 'cars', 'why-choose-us']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveSection('home')
    } else if (location.pathname.startsWith('/cars')) {
      setActiveSection('cars')
    } else if (location.pathname === '/how-it-works') {
      setActiveSection('how-it-works')
    } else if (location.pathname === '/why-choose-us') {
      setActiveSection('why-choose-us')
    }
  }, [location])

  const handleNavigation = (section: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/', { state: { scrollTo: section } })
    }
  }

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  const navItems = [
    { key: 'home', labelEn: 'Home', labelRu: 'Главная' },
    { key: 'how-it-works', labelEn: 'How it Works', labelRu: 'Как это работает' },
    { key: 'cars', labelEn: 'Cars', labelRu: 'Автомобили' },
    { key: 'why-choose-us', labelEn: 'Why Choose Us', labelRu: 'Почему мы' },
  ]

  const isRentNowPage = location.pathname.startsWith('/cars/')

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 
        ${scrolled ? 'bg-[rgb(127,126,126,.50)] backdrop-blur-sm' : 'bg-transparent'}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            AvtoNik
          </Link>
          
          <div className="hidden sm:flex items-center space-x-4 md:space-x-8">
            {navItems.map((item) => (
              <button 
                key={item.key}
                onClick={() => handleNavigation(item.key)}
                className={`
                  text-sm md:text-base 
                  transition-colors
                  hover:bg-white hover:bg-opacity-50 hover:text-orange-500
                  ${activeSection === item.key ? 'text-orange-500' : 'text-gray-900'}
                  font-medium
                  ${isRentNowPage ? 'text-gray-900' : ''}
                  px-3 py-2 rounded-md
                `}
              >
                {language === 'English' ? item.labelEn : item.labelRu}
              </button>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('English')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('Русский')}>
                  Русский
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.key}>
                      <button 
                        onClick={() => handleNavigation(item.key)}
                        className={`
                          text-left 
                          transition-colors
                          hover:bg-white hover:bg-opacity-50 hover:text-orange-500
                          ${activeSection === item.key ? 'text-orange-500' : 'text-gray-900'}
                          font-medium
                          ${isRentNowPage ? 'text-gray-900' : ''}
                          px-3 py-2 rounded-md
                        `}
                      >
                        {language === 'English' ? item.labelEn : item.labelRu}
                      </button>
                    </SheetClose>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Globe className="h-5 w-5 mr-2" />
                        {language === 'English' ? 'Language' : 'Язык'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLanguage('English')}>
                        English
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLanguage('Русский')}>
                        Русский
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

