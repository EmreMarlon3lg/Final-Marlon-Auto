import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            За <span className="text-blue-400">Marlon Auto</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            Доверен партньор в избора на автомобил – качество, прозрачност и лично отношение.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Кои сме ние</h2>
            <p className="text-gray-600 mb-4">
              Marlon Auto е модерна авто къща, специализирана в подбора и предлагането
              на висококачествени автомобили – както конвенционални, така и електрически.
            </p>
            <p className="text-gray-600 mb-6">
              Нашата мисия е да предоставим сигурност и спокойствие при покупката,
              чрез коректност, проверени автомобили и персонално обслужване.
            </p>
            <Link
              to="/cars"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Разгледай офертите
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">Основни принципи</h3>
            <ul className="space-y-3 text-gray-600">
              <li>✔️ Проверени автомобили</li>
              <li>✔️ Пълна прозрачност</li>
              <li>✔️ Индивидуален подход</li>
              <li>✔️ Дългосрочно доверие</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Management */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Контакти на управлението
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Марлон Даудов",
                role: "Управител",
                phone: "+359 888 123 456",
                email: "marlon@marlonauto.bg",
              },
              {
                name: "Димитър Павлов",
                role: "Търговски директор",
                phone: "+359 888 654 321",
                email: "sales@marlonauto.bg",
              },
              {
                name: "Николай Димитров",
                role: "Финансов консултант",
                phone: "+359 889 111 222",
                email: "finance@marlonauto.bg",
              },
            ].map((person) => (
              <div
                key={person.email}
                className="rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold">{person.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{person.role}</p>
                <p className="text-gray-600">{person.phone}</p>
                <p className="text-gray-600">{person.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Свържете се с нас</h2>
          <p className="text-gray-600 mb-8">
            Посетете ни на място или се свържете с нас по телефон или имейл.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2">📍</div>
              <p className="font-semibold">София, България</p>
              <p className="text-gray-600">бул. Примерен 123</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2">📞</div>
              <p className="font-semibold">+359 888 000 000</p>
              <p className="text-gray-600">Всеки ден: 09:00 – 18:00</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2">✉️</div>
              <p className="font-semibold">office@marlonauto.bg</p>
              <p className="text-gray-600">Бърз отговор</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
