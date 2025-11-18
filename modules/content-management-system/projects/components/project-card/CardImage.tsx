import Image from "next/image";
import Img from '@/public/images/logo-placeholder-image.png';

export default function CardImage() {
    return (
        <div className="w-full h-[150px] relative overflow-hidden rounded-lg">
            <Image
                fill
                src={Img.src}
                alt="Project Image"
                className="object-cover"
            />
        </div>
    );
}