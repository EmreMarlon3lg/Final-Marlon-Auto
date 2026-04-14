import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#0b1220] text-white">
      <div className="container-page py-16 grid gap-10 md:grid-cols-3">
        
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-4">Marlon Auto</h3>
          <p className="text-sm text-gray-300">
            Trusted car dealership offering quality vehicles
            and transparent service.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-4">Navigation</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/cars" className="hover:text-white">Cars</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>📍 Sofia, Bulgaria</li>
            <li>📞 +359 888 123 456</li>
            <li>✉️ info@marlonauto.bg</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Marlon Auto. All rights reserved.
      </div>
    </footer>
  )
}
