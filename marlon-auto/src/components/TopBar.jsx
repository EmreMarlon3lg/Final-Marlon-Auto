import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-bmw-dark text-white/90 text-sm py-2">
      <div className="container-page flex justify-between items-center">
        {/* Контакти отляво */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Phone size={14} />
            <span>0899 123 456</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Mail size={14} />
            <span>office@marlonauto.bg</span>
          </div>
        </div>

        {/* Връзки и локация отдясно */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1">
            <MapPin size={14} />
            <span>София, бул. Цариградско шосе 115</span>
          </div>
          <div className="flex space-x-3">
            <Facebook size={16} className="hover:text-white cursor-pointer transition-colors" />
            <Instagram size={16} className="hover:text-white cursor-pointer transition-colors" />
            <Youtube size={16} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;