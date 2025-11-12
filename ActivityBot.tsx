"use client";

import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle, DollarSign, UserPlus, TrendingUp } from "lucide-react";

// Event Types
type Event =
  | {
      type: "newUser";
      message: (name: string, country: string) => string;
      icon: ReactNode;
    }
  | {
      type: "investment";
      message: (name: string, amount: number, country: string) => string;
      icon: ReactNode;
    }
  | {
      type: "earning";
      message: (name: string, profit: number, country: string) => string;
      icon: ReactNode;
    }
  | {
      type: "withdrawal";
      message: (name: string, amount: number, country: string) => string;
      icon: ReactNode;
    };

const events: Event[] = [
  {
    type: "newUser",
    message: (name: string, country: string) => `${name} from ${country} just joined Keylite!`,
    icon: <UserPlus className="text-blue-400" size={22} />,
  },
  {
    type: "investment",
    message: (name: string, amount: number, country: string) =>
      `${name} invested $${amount.toLocaleString()} (${country})`,
    icon: <DollarSign className="text-green-400" size={22} />,
  },
  {
    type: "earning",
    message: (name: string, profit: number, country: string) =>
      `${name} earned $${profit.toLocaleString()} profit! (${country})`,
    icon: <TrendingUp className="text-purple-400" size={22} />,
  },
  {
    type: "withdrawal",
    message: (name: string, amount: number, country: string) =>
      `${name} withdrew $${amount.toLocaleString()} successfully! (${country})`,
    icon: <CheckCircle className="text-yellow-400" size={22} />,
  },
];

// Names & Countries
const names = [
  "James Anderson",
  "Sophia Carter",
  "Liam Johnson",
  "Olivia Thompson",
  "Noah Williams",
  "Emma Davis",
  "Ethan Miller",
  "Ava Wilson",
  "Lucas Moore",
  "Mia Taylor",
  "Benjamin Clark",
  "Charlotte Harris",
  "Elijah Lewis",
  "Amelia Walker",
  "Alexander Hall",
  "Isabella Allen",
  "Michael Young",
  "Harper King",
  "Daniel Wright",
  "Evelyn Scott",
  "Matthew Green",
  "Abigail Adams",
  "Henry Baker",
  "Ella Gonzalez",
  "Sebastian Nelson",
  "Grace Mitchell",
  "Jack Perez",
  "Scarlett Roberts",
  "Samuel Turner",
  "Aria Phillips",
  "David Campbell",
  "Chloe Parker",
  "Joseph Evans",
  "Victoria Edwards",
  "Carter Collins",
  "Lily Stewart",
  "Owen Sanchez",
  "Hannah Morris",
  "Wyatt Rogers",
  "Zoe Reed",
  "John Cook",
  "Nora Morgan",
  "Leo Bell",
  "Riley Murphy",
  "Julian Rivera",
  "Penelope Cooper",
  "Isaac Bailey",
  "Layla Gomez",
  "Gabriel Richardson",
  "Avery Cox",
  "Anthony Howard",
  "Eleanor Ward",
  "Dylan Torres",
  "Hazel Peterson",
  "Andrew Gray",
  "Lillian Ramirez",
  "Joshua James",
  "Addison Watson",
  "Christopher Brooks",
  "Stella Kelly",
  "Jaxon Sanders",
  "Natalie Price",
  "Levi Bennett",
  "Zoey Wood",
  "Caleb Barnes",
  "Mila Ross",
  "Ryan Henderson",
  "Paisley Coleman",
  "Nathan Jenkins",
  "Aurora Perry",
  "Thomas Powell",
  "Savannah Long",
  "Charles Patterson",
  "Brooklyn Hughes",
  "Isaiah Flores",
  "Claire Foster",
  "Hunter Butler",
  "Skylar Simmons",
  "Christian Bryant",
  "Lucy Russell",
  "Connor Griffin",
  "Anna Diaz",
  "Eli Hayes",
  "Leah Myers",
  "Landon Ford",
  "Violet Hamilton",
  "Jonathan Graham",
  "Camila Sullivan",
  "Nolan Ortiz",
  "Sofia Alexander",
  "Aaron Rose",
  "Audrey West",
  "Adrian Stone",
  "Bella Chapman",
  "Cameron Lane",
  "Aaliyah Bishop",
  "Jordan Holt",
  "Ellie Marsh",
  "Brayden Newman",
  "Madelyn Carr"
];
const countries = [
  // Europe
  { name: "Albania", code: "AL", flag: "🇦🇱", tz: "Europe/Tirane" },
  { name: "Andorra", code: "AD", flag: "🇦🇩", tz: "Europe/Andorra" },
  { name: "Armenia", code: "AM", flag: "🇦🇲", tz: "Asia/Yerevan" },
  { name: "Austria", code: "AT", flag: "🇦🇹", tz: "Europe/Vienna" },
  { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", tz: "Asia/Baku" },
  { name: "Belarus", code: "BY", flag: "🇧🇾", tz: "Europe/Minsk" },
  { name: "Belgium", code: "BE", flag: "🇧🇪", tz: "Europe/Brussels" },
  { name: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦", tz: "Europe/Sarajevo" },
  { name: "Bulgaria", code: "BG", flag: "🇧🇬", tz: "Europe/Sofia" },
  { name: "Croatia", code: "HR", flag: "🇭🇷", tz: "Europe/Zagreb" },
  { name: "Cyprus", code: "CY", flag: "🇨🇾", tz: "Asia/Nicosia" },
  { name: "Czech Republic", code: "CZ", flag: "🇨🇿", tz: "Europe/Prague" },
  { name: "Denmark", code: "DK", flag: "🇩🇰", tz: "Europe/Copenhagen" },
  { name: "Estonia", code: "EE", flag: "🇪🇪", tz: "Europe/Tallinn" },
  { name: "Finland", code: "FI", flag: "🇫🇮", tz: "Europe/Helsinki" },
  { name: "France", code: "FR", flag: "🇫🇷", tz: "Europe/Paris" },
  { name: "Georgia", code: "GE", flag: "🇬🇪", tz: "Asia/Tbilisi" },
  { name: "Germany", code: "DE", flag: "🇩🇪", tz: "Europe/Berlin" },
  { name: "Greece", code: "GR", flag: "🇬🇷", tz: "Europe/Athens" },
  { name: "Hungary", code: "HU", flag: "🇭🇺", tz: "Europe/Budapest" },
  { name: "Iceland", code: "IS", flag: "🇮🇸", tz: "Atlantic/Reykjavik" },
  { name: "Ireland", code: "IE", flag: "🇮🇪", tz: "Europe/Dublin" },
  { name: "Italy", code: "IT", flag: "🇮🇹", tz: "Europe/Rome" },
  { name: "Kosovo", code: "XK", flag: "🇽🇰", tz: "Europe/Pristina" },
  { name: "Latvia", code: "LV", flag: "🇱🇻", tz: "Europe/Riga" },
  { name: "Liechtenstein", code: "LI", flag: "🇱🇮", tz: "Europe/Vaduz" },
  { name: "Lithuania", code: "LT", flag: "🇱🇹", tz: "Europe/Vilnius" },
  { name: "Luxembourg", code: "LU", flag: "🇱🇺", tz: "Europe/Luxembourg" },
  { name: "Malta", code: "MT", flag: "🇲🇹", tz: "Europe/Malta" },
  { name: "Moldova", code: "MD", flag: "🇲🇩", tz: "Europe/Chisinau" },
  { name: "Monaco", code: "MC", flag: "🇲🇨", tz: "Europe/Monaco" },
  { name: "Montenegro", code: "ME", flag: "🇲🇪", tz: "Europe/Podgorica" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱", tz: "Europe/Amsterdam" },
  { name: "North Macedonia", code: "MK", flag: "🇲🇰", tz: "Europe/Skopje" },
  { name: "Norway", code: "NO", flag: "🇳🇴", tz: "Europe/Oslo" },
  { name: "Poland", code: "PL", flag: "🇵🇱", tz: "Europe/Warsaw" },
  { name: "Portugal", code: "PT", flag: "🇵🇹", tz: "Europe/Lisbon" },
  { name: "Romania", code: "RO", flag: "🇷🇴", tz: "Europe/Bucharest" },
  { name: "Russia", code: "RU", flag: "🇷🇺", tz: "Europe/Moscow" },
  { name: "San Marino", code: "SM", flag: "🇸🇲", tz: "Europe/San_Marino" },
  { name: "Serbia", code: "RS", flag: "🇷🇸", tz: "Europe/Belgrade" },
  { name: "Slovakia", code: "SK", flag: "🇸🇰", tz: "Europe/Bratislava" },
  { name: "Slovenia", code: "SI", flag: "🇸🇮", tz: "Europe/Ljubljana" },
  { name: "Spain", code: "ES", flag: "🇪🇸", tz: "Europe/Madrid" },
  { name: "Sweden", code: "SE", flag: "🇸🇪", tz: "Europe/Stockholm" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭", tz: "Europe/Zurich" },
  { name: "Turkey", code: "TR", flag: "🇹🇷", tz: "Europe/Istanbul" },
  { name: "Ukraine", code: "UA", flag: "🇺🇦", tz: "Europe/Kyiv" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", tz: "Europe/London" },
  { name: "Vatican City", code: "VA", flag: "🇻🇦", tz: "Europe/Vatican" },

  // Americas
  { name: "Antigua and Barbuda", code: "AG", flag: "🇦🇬", tz: "America/Antigua" },
  { name: "Argentina", code: "AR", flag: "🇦🇷", tz: "America/Argentina/Buenos_Aires" },
  { name: "Bahamas", code: "BS", flag: "🇧🇸", tz: "America/Nassau" },
  { name: "Barbados", code: "BB", flag: "🇧🇧", tz: "America/Barbados" },
  { name: "Belize", code: "BZ", flag: "🇧🇿", tz: "America/Belize" },
  { name: "Bolivia", code: "BO", flag: "🇧🇴", tz: "America/La_Paz" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", tz: "America/Sao_Paulo" },
  { name: "Canada", code: "CA", flag: "🇨🇦", tz: "America/Toronto" },
  { name: "Chile", code: "CL", flag: "🇨🇱", tz: "America/Santiago" },
  { name: "Colombia", code: "CO", flag: "🇨🇴", tz: "America/Bogota" },
  { name: "Costa Rica", code: "CR", flag: "🇨🇷", tz: "America/Costa_Rica" },
  { name: "Cuba", code: "CU", flag: "🇨🇺", tz: "America/Havana" },
  { name: "Dominica", code: "DM", flag: "🇩🇲", tz: "America/Dominica" },
  { name: "Dominican Republic", code: "DO", flag: "🇩🇴", tz: "America/Santo_Domingo" },
  { name: "Ecuador", code: "EC", flag: "🇪🇨", tz: "America/Guayaquil" },
  { name: "El Salvador", code: "SV", flag: "🇸🇻", tz: "America/El_Salvador" },
  { name: "Grenada", code: "GD", flag: "🇬🇩", tz: "America/Grenada" },
  { name: "Guatemala", code: "GT", flag: "🇬🇹", tz: "America/Guatemala" },
  { name: "Guyana", code: "GY", flag: "🇬🇾", tz: "America/Guyana" },
  { name: "Haiti", code: "HT", flag: "🇭🇹", tz: "America/Port-au-Prince" },
  { name: "Honduras", code: "HN", flag: "🇭🇳", tz: "America/Tegucigalpa" },
  { name: "Jamaica", code: "JM", flag: "🇯🇲", tz: "America/Jamaica" },
  { name: "Mexico", code: "MX", flag: "🇲🇽", tz: "America/Mexico_City" },
  { name: "Nicaragua", code: "NI", flag: "🇳🇮", tz: "America/Managua" },
  { name: "Panama", code: "PA", flag: "🇵🇦", tz: "America/Panama" },
  { name: "Paraguay", code: "PY", flag: "🇵🇾", tz: "America/Asuncion" },
  { name: "Peru", code: "PE", flag: "🇵🇪", tz: "America/Lima" },
  { name: "Saint Kitts and Nevis", code: "KN", flag: "🇰🇳", tz: "America/St_Kitts" },
  { name: "Saint Lucia", code: "LC", flag: "🇱🇨", tz: "America/St_Lucia" },
  { name: "Saint Vincent and the Grenadines", code: "VC", flag: "🇻🇨", tz: "America/St_Vincent" },
  { name: "Suriname", code: "SR", flag: "🇸🇷", tz: "America/Paramaribo" },
  { name: "Trinidad and Tobago", code: "TT", flag: "🇹🇹", tz: "America/Port_of_Spain" },
  { name: "United States", code: "US", flag: "🇺🇸", tz: "America/New_York" },
  { name: "Uruguay", code: "UY", flag: "🇺🇾", tz: "America/Montevideo" },
  { name: "Venezuela", code: "VE", flag: "🇻🇪", tz: "America/Caracas" },

  // Asia
  { name: "Afghanistan", code: "AF", flag: "🇦🇫", tz: "Asia/Kabul" },
  { name: "Bahrain", code: "BH", flag: "🇧🇭", tz: "Asia/Bahrain" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩", tz: "Asia/Dhaka" },
  { name: "Bhutan", code: "BT", flag: "🇧🇹", tz: "Asia/Thimphu" },
  { name: "Brunei", code: "BN", flag: "🇧🇳", tz: "Asia/Brunei" },
  { name: "Cambodia", code: "KH", flag: "🇰🇭", tz: "Asia/Phnom_Penh" },
  { name: "China", code: "CN", flag: "🇨🇳", tz: "Asia/Shanghai" },
  { name: "East Timor", code: "TL", flag: "🇹🇱", tz: "Asia/Dili" },
  { name: "India", code: "IN", flag: "🇮🇳", tz: "Asia/Kolkata" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩", tz: "Asia/Jakarta" },
  { name: "Iran", code: "IR", flag: "🇮🇷", tz: "Asia/Tehran" },
  { name: "Iraq", code: "IQ", flag: "🇮🇶", tz: "Asia/Baghdad" },
  { name: "Israel", code: "IL", flag: "🇮🇱", tz: "Asia/Jerusalem" },
  { name: "Japan", code: "JP", flag: "🇯🇵", tz: "Asia/Tokyo" },
  { name: "Jordan", code: "JO", flag: "🇯🇴", tz: "Asia/Amman" },
  { name: "Kazakhstan", code: "KZ", flag: "🇰🇿", tz: "Asia/Almaty" },
  { name: "Kuwait", code: "KW", flag: "🇰🇼", tz: "Asia/Kuwait" },
  { name: "Kyrgyzstan", code: "KG", flag: "🇰🇬", tz: "Asia/Bishkek" },
  { name: "Laos", code: "LA", flag: "🇱🇦", tz: "Asia/Vientiane" },
  { name: "Lebanon", code: "LB", flag: "🇱🇧", tz: "Asia/Beirut" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾", tz: "Asia/Kuala_Lumpur" },
  { name: "Maldives", code: "MV", flag: "🇲🇻", tz: "Indian/Maldives" },
  { name: "Mongolia", code: "MN", flag: "🇲🇳", tz: "Asia/Ulaanbaatar" },
  { name: "Myanmar", code: "MM", flag: "🇲🇲", tz: "Asia/Yangon" },
  { name: "Nepal", code: "NP", flag: "🇳🇵", tz: "Asia/Kathmandu" },
  { name: "North Korea", code: "KP", flag: "🇰🇵", tz: "Asia/Pyongyang" },
  { name: "Oman", code: "OM", flag: "🇴🇲", tz: "Asia/Muscat" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰", tz: "Asia/Karachi" },
  { name: "Palestine", code: "PS", flag: "🇵🇸", tz: "Asia/Gaza" },
  { name: "Philippines", code: "PH", flag: "🇵🇭", tz: "Asia/Manila" },
  { name: "Qatar", code: "QA", flag: "🇶🇦", tz: "Asia/Qatar" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", tz: "Asia/Riyadh" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", tz: "Asia/Singapore" },
  { name: "South Korea", code: "KR", flag: "🇰🇷", tz: "Asia/Seoul" },
  { name: "Sri Lanka", code: "LK", flag: "🇱🇰", tz: "Asia/Colombo" },
  { name: "Syria", code: "SY", flag: "🇸🇾", tz: "Asia/Damascus" },
  { name: "Tajikistan", code: "TJ", flag: "🇹🇯", tz: "Asia/Dushanbe" },
  { name: "Thailand", code: "TH", flag: "🇹🇭", tz: "Asia/Bangkok" },
  { name: "Turkey", code: "TR", flag: "🇹🇷", tz: "Europe/Istanbul" },
  { name: "Turkmenistan", code: "TM", flag: "🇹🇲", tz: "Asia/Ashgabat" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", tz: "Asia/Dubai" },
  { name: "Uzbekistan", code: "UZ", flag: "🇺🇿", tz: "Asia/Tashkent" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳", tz: "Asia/Ho_Chi_Minh" },
  { name: "Yemen", code: "YE", flag: "🇾🇪", tz: "Asia/Aden" }
];

interface Activity {
  id: number;
  text: string;
  icon: ReactNode;
  avatar: string;
  name: string;
  country: string;
  flag: string;
  localTime: string;
}

export default function ActivityBot() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const generateActivity = useCallback((): Activity => {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const countryObj = countries[Math.floor(Math.random() * countries.length)];

    let text = "";
    if (randomEvent.type === "newUser") {
      text = randomEvent.message(name, countryObj.name);
    } else if (randomEvent.type === "investment") {
      const amount = Math.floor(Math.random() * 99999) + 9999;
      text = randomEvent.message(name, amount, countryObj.name);
    } else if (randomEvent.type === "earning") {
      const profit = Math.floor(Math.random() * 999999) + 99999;
      text = randomEvent.message(name, profit, countryObj.name);
    } else if (randomEvent.type === "withdrawal") {
      const amount = Math.floor(Math.random() * 9999999) + 9999;
      text = randomEvent.message(name, amount, countryObj.name);
    }

    const formatLocalTime = (tz: string) => {
      try {
        return new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: tz,
        }).format(new Date());
      } catch {
        // Fallback without timeZone on environments lacking full ICU
        return new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date());
      }
    };

    const localTime = formatLocalTime(countryObj.tz);

    return {
      id: Date.now(),
      text,
      icon: randomEvent.icon,
      avatar: "/images/team.png",
      name,
      country: countryObj.name,
      flag: countryObj.flag,
      localTime,
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities((prev) => [newActivity, ...prev].slice(0, 1)); // show max 1 popup
    }, 6000 + Math.random() * 2000); // 6-8 sec random interval

    return () => clearInterval(interval);
  }, [generateActivity]);

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
      <AnimatePresence>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-black/80 backdrop-blur-md text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 border border-white/10 w-[320px]"
          >
            <Image src={activity.avatar} alt={activity.name} width={40} height={40} unoptimized className="rounded-full border" />
            <div className="flex flex-col text-sm">
              <div className="flex items-center gap-1 font-semibold">
                {activity.name}
                <CheckCircle size={14} className="text-blue-400" /> {/* Verified Badge */}
              </div>
              <div className="text-gray-300">{activity.text}</div>
              <div className="text-xs text-gray-400">
                {activity.flag} {activity.country} • {activity.localTime}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
