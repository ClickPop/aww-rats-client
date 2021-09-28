import { FC, SVGProps } from "react"

export const WhiteSwoosh: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 1920 72.4"
      xmlSpace="preserve"
      {...props}
    >
      <path d="M1940 0s-365.9 48-980 48S-20 0-20 0v72.4h1960V0z" fill="#fff" />
    </svg>
  )
}