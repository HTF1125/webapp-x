import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import LogoLightColor from "@/images/investment-x-logo-light.svg";
import LogoDarkColor from "@/images/investment-x-logo-dark.svg";

const ResponsiveLogo = ({ isCompact }: { isCompact: boolean }) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isCompact) return null;

    const logoToUse = resolvedTheme === 'dark' ? LogoLightColor : LogoDarkColor;

    return (
        <Link href="/" className="flex items-center justify-center mb-6">
            <div className="relative w-[150px] h-[40px]">
                <Image
                    src={logoToUse}
                    alt="Investment-X Logo"
                    fill
                    sizes="150px"
                    style={{ objectFit: "contain" }}
                />
            </div>
        </Link>
    );
};

export default ResponsiveLogo;
