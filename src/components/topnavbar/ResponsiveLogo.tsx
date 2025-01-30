import Image from 'next/image';
import Link from 'next/link';
import LogoLightColor from "@/images/investment-x-logo-light.svg";
import LogoDarkColor from "@/images/investment-x-logo-dark.svg";

const ResponsiveLogo = () => {
    return (
        <Link href="/" className="flex items-center justify-center">
            <div className="relative w-[150px] h-[40px]">
                {/* Light mode logo */}
                <Image
                    src={LogoDarkColor}
                    alt="Investment-X Logo (Light)"
                    fill
                    sizes="150px"
                    style={{ objectFit: "contain" }}
                    className="block dark:hidden"
                />
                {/* Dark mode logo */}
                <Image
                    src={LogoLightColor}
                    alt="Investment-X Logo (Dark)"
                    fill
                    sizes="150px"
                    style={{ objectFit: "contain" }}
                    className="hidden dark:block"
                />
            </div>
        </Link>
    );
};

export default ResponsiveLogo;
