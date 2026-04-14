// src/components/PromoSection.jsx
import { Check, Zap, Battery, Shield } from 'lucide-react';

const PromoSection = ({ 
  title, 
  subtitle, 
  price, 
  description, 
  imageUrl, 
  features = [],
  isReversed = false,
  isElectric = false 
}) => {
  return (
    <section className={`py-20 ${isReversed ? 'bg-bmw-gray' : 'bg-white'}`}>
      <div className="container-page">
        <div className={`
          flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} 
          items-center gap-12 lg:gap-16
        `}>
          
          {/* Текстов блок със стил като BMW */}
          <div className="lg:w-1/2">
            {isElectric && (
              <div className="chip bg-blue-50 text-bmw-blue mb-6">
                <Zap size={18} />
                <span className="font-medium text-sm">Електрически автомобил</span>
              </div>
            )}
            
            <h2 className="text-4xl lg:text-5xl font-bold text-bmw-dark mb-4 leading-tight">
              {title}
            </h2>
            
            <h3 className="text-2xl text-bmw-gray-dark mb-6 font-medium">
              {subtitle}
            </h3>
            
            {price && (
              <div className="mb-8">
                <div className="text-4xl font-bold text-bmw-blue mb-1">
                  {price}
                  <span className="text-lg text-bmw-gray-dark font-normal"> / месец*</span>
                </div>
                <p className="text-sm text-bmw-gray-dark">при финансов лизинг</p>
              </div>
            )}
            
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              {description}
            </p>
            
            {/* Features списък */}
            {features.length > 0 && (
              <div className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="text-emerald-600" size={16} />
                    </span>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Бутони като в BMW */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary text-lg px-10 py-4 min-w-[200px]">
                Конфигурирайте сега
              </button>
              
              <button className="btn-secondary text-lg px-10 py-4 min-w-[200px] ring-1 ring-bmw-dark/20 hover:ring-bmw-dark/30">
                Вижте повече
              </button>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-8 text-sm text-gray-500 max-w-xl">
              <p>
                *{description.includes('лизинг') ? 
                  'Калкулацията е примерна за показания модел. Офертата важи за бизнес клиенти при финансов лизинг.' :
                  'Продуктово изображение е илюстративно. Характеристиките могат да варират.'}
              </p>
            </div>
          </div>
          
          {/* Изображение с ефект като в BMW */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-[420px] lg:h-[520px] rounded-3xl shadow-2xl object-cover"
              />
              <div
                className={
                  `absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-r ` +
                  (isReversed ? 'from-transparent to-bmw-blue/10' : 'from-bmw-blue/10 to-transparent')
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;