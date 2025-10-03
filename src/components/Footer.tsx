import { Link } from "react-router-dom";
import { Facebook, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterProps {
  language: string;
}

export function Footer({ language }: FooterProps) {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <Button
              variant="link"
              className="text-xl font-bold p-0"
              onClick={() =>
                document
                  .getElementById("home")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              AvtoNik
            </Button>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto md:mx-0">
              {language === "English"
                ? "Thank you for choosing AvtoNik! We're committed to providing exceptional service and value. Drive safely and enjoy your journey!"
                : "Спасибо, что выбрали AvtoNik! Мы стремимся предоставить исключительный сервис и ценность. Безопасной поездки и приятного путешествия!"}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-2">
            {/* Phone */}
            <a
              href="tel:+995511436343"
              className="flex items-center text-gray-800 hover:text-gray-900 transition-colors duration-200"
            >
              <Phone className="h-5 w-5 mr-2" />
              <span>511 43 63 43</span>
            </a>

            {/* Address */}
            <a
              href="https://maps.google.com/?q=Batumi,+Grigol+Lortkipanidze+Street+N32,+814"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-800 hover:text-gray-900 transition-colors duration-200"
            >
              <MapPin className="h-5 w-5 mr-2" />
              <span>Batumi, Grigol Lortkipanidze St. N32, 814</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61581156422826"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <Facebook className="h-8 w-8 text-gray-800" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; 2025 AvtoNik. All rights reserved
          </p>
          <div className="flex space-x-4">
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-gray-900 p-0"
              asChild
            >
              <Link to="/privacy">
                {language === "English"
                  ? "Privacy Policy"
                  : "Политика конфиденциальности"}
              </Link>
            </Button>
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-gray-900 p-0"
              asChild
            >
              <Link to="/terms">
                {language === "English"
                  ? "Terms & Conditions"
                  : "Условия использования"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
