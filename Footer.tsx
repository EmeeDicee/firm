import Logo from "@/components/global/Logo";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiLinkedin, FiSend } from "react-icons/fi";
import { COMPANY } from "@/config/company";
import MaskedPhone from "@/components/global/MaskedPhone";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              {/* Logo */}
              <Logo size={40} ariaLabel={`${COMPANY.name} logo`} />
              <div className="text-xl font-extrabold">
                <span className="text-yellow-400">Keylite</span> <span className="text-white">Trade</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">{COMPANY.tagline}</p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-4">
              {COMPANY.socials.twitter && (
                <Link aria-label="Twitter" href={COMPANY.socials.twitter} className="hover:text-yellow-400">
                  <FiTwitter size={20} />
                </Link>
              )}
              {COMPANY.socials.facebook && (
                <Link aria-label="Facebook" href={COMPANY.socials.facebook} className="hover:text-yellow-400">
                  <FiFacebook size={20} />
                </Link>
              )}
              {COMPANY.socials.linkedin && (
                <Link aria-label="LinkedIn" href={COMPANY.socials.linkedin} className="hover:text-yellow-400">
                  <FiLinkedin size={20} />
                </Link>
              )}
              {COMPANY.socials.telegram && (
                <Link aria-label="Telegram" href={COMPANY.socials.telegram} className="hover:text-yellow-400">
                  <FiSend size={20} />
                </Link>
              )}
            </div>
          </div>

          {/* Company (USA) */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-yellow-400" />
                <div>
                  <div>{COMPANY.address.line1}</div>
                  <div>{COMPANY.address.line2}</div>
                  <div>{COMPANY.address.country}</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-yellow-400" />
                <MaskedPhone className="hover:text-yellow-400" phone={COMPANY.phone} />
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-yellow-400" />
                <a className="hover:text-yellow-400" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li className="text-gray-400">Hours: {COMPANY.hours}</li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link className="hover:text-yellow-400" href="/">Home</Link></li>
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.about}>About</Link></li>
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.services}>Services</Link></li>
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.pricing}>Pricing</Link></li>
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.contact}>Contact</Link></li>
              <li className="pt-2">
                <div className="flex gap-3">
                  <Link className="px-3 py-1.5 rounded border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        href={COMPANY.links.login}>Login</Link>
                  <Link className="px-3 py-1.5 rounded bg-yellow-400 text-black hover:bg-yellow-500"
                        href={COMPANY.links.signup}>Sign Up</Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.terms}>Terms of Service</Link></li>
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.privacy}>Privacy Policy</Link></li>
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.risk}>Risk Disclosure</Link></li>
              <li><Link className="hover:text-yellow-400" href={COMPANY.links.kyc}>KYC/AML Policy</Link></li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Investing in digital assets involves risk. Ensure you understand the risks before committing capital.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div>© {year} {COMPANY.name}. All rights reserved.</div>
          <div>Made for investors in the United States and worldwide.</div>
        </div>
      </div>
    </footer>
  );
}
