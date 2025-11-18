import Image from "next/image";
import Img from '@/public/images/logo-placeholder-image.png';

export default function CardImage() {
    return (
        <Image
            width={360}
            height={150}
            src={Img.src}
            alt="Project Image"
            className="w-full h-[150px]"
        />
    );
}