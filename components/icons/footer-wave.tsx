import React from "react";
import FooterWaveSvg from "assets/shapes/footer-wave.svg";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  color?: string;
}

export function FooterWave({ ...rest }: Props) {
  return <img src={FooterWaveSvg.src} {...rest} />;
}
