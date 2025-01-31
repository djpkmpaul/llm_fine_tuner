import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Settings, HelpCircle, CirclePlus } from "lucide-react"
import { HeroHighlight } from "@/components/ui/hero-highlight"

type SidebarType = {
    className?: string
}
const Sidebar = ({ className }: SidebarType) => {
    const pathname = usePathname()

    const routes = [
        { name: "Dashboard", path: "/dashboard", icon: Home },
        { name: "Fine-Tune LLM", path: "/createllm", icon: CirclePlus },
        { name: "Documentation", path: "/documentation", icon: FileText },
        { name: "Settings", path: "/settings", icon: Settings },
        { name: "Help", path: "/help", icon: HelpCircle },
    ]

    return (
        <div className={`flex flex-col w-64 bg-white h-screen shadow-lg py-8 ${className}`}>

            <div className="p-5">
                <h2 className="text-2xl font-bold mb-5">LLM Platform</h2>
                <nav>
                    <ul>
                        {routes.map((route) => (
                            <li key={route.path} className="mb-2">
                                <Link href={route.path}>
                                    <span
                                        className={`flex items-center p-2 rounded-lg ${pathname === route.path ? "bg-gray-200" : "hover:bg-gray-100"
                                            }`}
                                    >
                                        <route.icon className="mr-2" size={20} />
                                        {route.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar

