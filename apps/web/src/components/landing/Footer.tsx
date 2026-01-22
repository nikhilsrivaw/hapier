  import { Logo } from '@/components/common';
  import { Globe } from 'lucide-react';

  const footerLinks = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact', 'Privacy', 'Terms'],
    },
  ];

  export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-500
  rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="text-xl font-bold text-white">Hapier</span>
              </div>
              <p className="text-sm mb-4 max-w-xs">
                Making workforce management simple, efficient, and delightful.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                <span>Made in India 🇮🇳</span>                                                

              </div>
            </div>

            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors">      
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row
  justify-between items-center gap-4">
            <p className="text-sm">© 2026 Hapier. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
