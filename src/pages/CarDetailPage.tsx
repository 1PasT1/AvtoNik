import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Car } from '@/types/car';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";
import { fetchCars } from '@/utils/api';

export function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (params.id) {
        try {
          const cars = await fetchCars();
          if (Array.isArray(cars)) {
            const carData = cars.find((c: Car) => c.id.toString() === params.id);
            if (carData) {
              setCar(carData);
            } else {
              throw new Error('Car not found');
            }
          } else {
            throw new Error('Invalid data structure received from API');
          }
        } catch (err) {
          setError(language === 'English' 
            ? `Failed to load car data. Error: ${err instanceof Error ? err.message : 'Unknown error'}` 
            : `Не удалось загрузить данные об автомобиле. Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCarDetails();
  }, [params.id, language]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? (car?.gallery.length ?? 1) - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === (car?.gallery.length ?? 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBackToCars = () => {
    navigate('/', { state: { scrollTo: 'cars' } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://autonikapi.vercel.app/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carId: car?.id,
          dateFrom: dateRange?.from?.toISOString(),
          dateTo: dateRange?.to?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send inquiry');
      }

      toast({
        title: language === 'English' ? 'Inquiry Sent' : 'Запрос отправлен',
        description: language === 'English' ? 'We will contact you soon.' : 'Мы свяжемся с вами в ближайшее время.',
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
      setDateRange(undefined);
    } catch (error) {
      toast({
        title: language === 'English' ? 'Error' : 'Ошибка',
        description: language === 'English' ? 'Failed to send inquiry. Please try again.' : 'Не удалось отправить запрос. Пожалуйста, попробуйте еще раз.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navbar 
        language={language}
        setLanguage={setLanguage}
      />
      <div className="container mx-auto px-4 py-16 pt-32">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBackToCars}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === 'English' ? 'Back to Cars' : 'Назад к автомобилям'}
        </Button>
        
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{language === 'English' ? 'Error' : 'Ошибка'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : car ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative">
              <div className="relative h-[400px]">
                <img
                  src={car.gallery[currentImageIndex]}
                  alt={car.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-y-0 left-2 flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevImage}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextImage}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-4">
                {car.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${car.name} view ${index + 1}`}
                    className={`w-full h-20 object-cover rounded-lg cursor-pointer ${
                      index === currentImageIndex ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{car.name}</CardTitle>
                  <CardDescription>
                    ${car.price}/{language === 'English' ? 'day' : 'день'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label>{language === 'English' ? 'Category' : 'Категория'}</Label>
                      <p>{car.category}</p>
                    </div>
                    <div>
                      <Label>{language === 'English' ? 'Transmission' : 'Коробка передач'}</Label>
                      <p>{car.transmission}</p>
                    </div>
                    <div>
                      <Label>{language === 'English' ? 'Fuel Type' : 'Тип топлива'}</Label>
                      <p>{car.fuelType}</p>
                    </div>
                    <div>
                      <Label>{language === 'English' ? 'Seats' : 'Места'}</Label>
                      <p>{car.seats}</p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateRange">{language === 'English' ? 'Rental Period' : 'Период аренды'}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="dateRange"
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${!dateRange?.from && "text-muted-foreground"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd, y")} -{" "}
                                  {format(dateRange.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              <span>{language === 'English' ? 'Pick a date' : 'Выберите дату'}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{language === 'English' ? 'First Name' : 'Имя'}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{language === 'English' ? 'Last Name' : 'Фамилия'}</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{language === 'English' ? 'Email' : 'Электронная почта'}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{language === 'English' ? 'Message' : 'Сообщение'}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {language === 'English' ? 'Send Inquiry' : 'Отправить запрос'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertTitle>{language === 'English' ? 'Error' : 'Ошибка'}</AlertTitle>
            <AlertDescription>{language === 'English' ? 'Car not found' : 'Автомобиль не найден'}</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}

