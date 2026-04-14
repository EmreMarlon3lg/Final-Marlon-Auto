// src/components/Hero.jsx
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-[78vh] min-h-[620px] overflow-hidden">
      {/* Фоново изображение като в BMW */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000')] 
        bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-bmw-dark/90 via-bmw-dark/70 to-transparent"></div>
      </div>
      
      {/* Текст със стил като BMW */}
      <div className="relative container-page h-full flex items-center">
        <div className="max-w-2xl text-bmw-light">
          <h1 className="text-bmw-title mb-6 tracking-tight">
            Приберете се вкъщи<br />с перфектния автомобил
          </h1>
          
          <p className="text-xl mb-8 text-white/80 leading-relaxed">
            Открийте изключителните оферти за лизинг на премиум автомобили. 
            <span className="font-bold text-white"> Месечна вноска от 1 355 лв.*</span>
          </p>
          
          {/* BMW-style бутони */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="btn-primary text-lg px-10 py-4 min-w-[220px]">
              Намерете сега
              <ArrowRight className="ml-3" size={20} />
            </button>
            
            <button className="btn text-lg px-10 py-4 min-w-[220px] bg-transparent text-white ring-1 ring-white/30 hover:bg-white/10">
              Калкулатор за лизинг
            </button>
          </div>
          
          {/* Disclaimer текстове като в BMW */}
          <div className="text-sm text-gray-300 space-y-2 max-w-xl">
            <p>
              *Калкулацията е примерна за показания модел, с месечна вноска от 1 355 лв.,
              направена при финансов лизинг с цена на автомобила 158 000 лв. / 80 784 евро с ДДС, 
              за период от 60 месеца, с лихва 2,49% и 25% първоначална вноска.
            </p>
            <p className="text-xs text-gray-400">
              С възможност и за оперативен лизинг. Офертата важи за бизнес клиенти.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;