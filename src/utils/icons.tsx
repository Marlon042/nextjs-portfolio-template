import { FC, SVGProps } from 'react'

import Earning from '../assets/icons/earning.svg'
import JavaScriptIcon from '../assets/icons/javascript.svg'
import Likes from '../assets/icons/likes.svg'
import NextjsIcon from '../assets/icons/nextjs.svg'
import NodejsIcon from '../assets/icons/nodejs.svg'
import ReactIcon from '../assets/icons/react.svg'
import Star from '../assets/icons/star.svg'
import TailwindCSS from '../assets/icons/tailwind-css.svg'
import Timer from '../assets/icons/timer.svg'
import TypescriptIcon from '../assets/icons/typescript.svg'
import FlutterIcon from '../assets/icons/flutter.svg'
import FirebaseIcon from '../assets/icons/firebase.svg'

const PreviewIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="18"
      height="20"
      // className="text-accent"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M19.25 6.69867C16.94 3.06867 13.56 0.978668 10 0.978668C8.22 0.978668 6.49 1.49867 4.91 2.46867C3.33 3.44867 1.91 4.87867 0.75 6.69867C-0.25 8.26867 -0.25 10.8187 0.75 12.3887C3.06 16.0287 6.44 18.1087 10 18.1087C11.78 18.1087 13.51 17.5887 15.09 16.6187C16.67 15.6387 18.09 14.2087 19.25 12.3887C20.25 10.8287 20.25 8.26867 19.25 6.69867ZM10 13.5887C7.76 13.5887 5.96 11.7787 5.96 9.54867C5.96 7.31867 7.76 5.50867 10 5.50867C12.24 5.50867 14.04 7.31867 14.04 9.54867C14.04 11.7787 12.24 13.5887 10 13.5887Z"
        fill="currentColor"
      />
    </svg>
  )
}

const GithubIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0099 0.548676C5.36875 0.548676 0 5.957 0 12.6478C0 17.9962 3.43994 22.5234 8.21205 24.1258C8.80869 24.2462 9.02724 23.8655 9.02724 23.5451C9.02724 23.2646 9.00757 22.3032 9.00757 21.3014C5.6667 22.0227 4.97099 19.8591 4.97099 19.8591C4.43409 18.4569 3.63858 18.0965 3.63858 18.0965C2.54511 17.3553 3.71823 17.3553 3.71823 17.3553C4.93117 17.4354 5.56763 18.5972 5.56763 18.5972C6.64118 20.44 8.37111 19.9193 9.06706 19.5988C9.16638 18.8175 9.48473 18.2767 9.82275 17.9763C7.15817 17.6958 4.35469 16.6542 4.35469 12.0067C4.35469 10.6846 4.8316 9.60295 5.58729 8.76171C5.46807 8.4613 5.0504 7.21911 5.70677 5.55654C5.70677 5.55654 6.72083 5.23597 9.00732 6.79849C9.98625 6.53364 10.9958 6.39892 12.0099 6.39778C13.024 6.39778 14.0577 6.53815 15.0123 6.79849C17.299 5.23597 18.3131 5.55654 18.3131 5.55654C18.9695 7.21911 18.5515 8.4613 18.4323 8.76171C19.2079 9.60295 19.6652 10.6846 19.6652 12.0067C19.6652 16.6542 16.8617 17.6756 14.1772 17.9763C14.6148 18.3568 14.9924 19.0779 14.9924 20.2197C14.9924 21.8422 14.9727 23.1444 14.9727 23.5449C14.9727 23.8655 15.1915 24.2462 15.7879 24.126C20.56 22.5232 23.9999 17.9962 23.9999 12.6478C24.0196 5.957 18.6312 0.548676 12.0099 0.548676Z"
        fill="currentColor"
      />
    </svg>
  )
}

const ArrowLeftIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      color="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

const ArrowRightIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      color="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
}

const CheckIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

const ChevronRightIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  )
}

const LinkedIn: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      role="img"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <title>LinkedIn</title>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  )
}

const Codepen: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      role="img"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <title>CodePen</title>
      <path
        fill="currentColor"
        d="M18.144 13.067v-2.134L16.55 12zm1.276 1.194a.628.628 0 01-.006.083l-.005.028-.011.053-.01.031c-.005.016-.01.031-.017.047l-.014.03a.78.78 0 01-.021.043l-.019.03a.57.57 0 01-.08.1l-.026.025a.602.602 0 01-.036.03l-.029.022-.01.008-6.782 4.522a.637.637 0 01-.708 0L4.864 14.79l-.01-.008a.599.599 0 01-.065-.052l-.026-.025-.032-.034-.021-.028a.588.588 0 01-.067-.11l-.014-.031a.644.644 0 01-.017-.047l-.01-.03c-.004-.018-.008-.036-.01-.054l-.006-.028a.628.628 0 01-.006-.083V9.739c0-.028.002-.055.006-.083l.005-.027.011-.054.01-.03a.574.574 0 01.12-.217l.031-.034.026-.025a.62.62 0 01.065-.052l.01-.008 6.782-4.521a.638.638 0 01.708 0l6.782 4.521.01.008.03.022.035.03c.01.008.017.016.026.025a.545.545 0 01.08.1l.019.03a.633.633 0 01.021.043l.014.03c.007.016.012.032.017.047l.01.031c.004.018.008.036.01.054l.006.027a.619.619 0 01.006.083zM12 0C5.373 0 0 5.372 0 12 0 18.627 5.373 24 12 24c6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12m0 10.492L9.745 12 12 13.51 14.255 12zm.638 4.124v2.975l4.996-3.33-2.232-1.493zm-6.272-.356l4.996 3.33v-2.974l-2.764-1.849zm11.268-4.52l-4.996-3.33v2.974l2.764 1.85zm-6.272-.356V6.41L6.366 9.74l2.232 1.493zm-5.506 1.549v2.134L7.45 12Z"
      />
    </svg>
  )
}

const X: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      role="img"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <title>X</title>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  )
}

const Instagram: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      role="img"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <title>Instagram</title>
      <path
        fill="currentColor"
        d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
      />
    </svg>
  )
}

const Facebook: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      role="img"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <title>Facebook</title>
      <path
        fill="currentColor"
        d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
      />
    </svg>
  )
}

const BurgerIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M0 0H18V2H0V0ZM0 7H18V9H0V7ZM0 14H18V16H0V14Z" fill="currentColor" />
    </svg>
  )
}

const CloseIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M8 6.2225L14.2225 0L16 1.7775L9.7775 8L16 14.2225L14.2225 16L8 9.7775L1.7775 16L0 14.2225L6.2225 8L0 1.7775L1.7775 0L8 6.2225Z"
        fill="currentColor"
      />
    </svg>
  )
}

const StarIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M9.10264 3.58103C9.46948 2.83787 10.5292 2.83787 10.8961 3.58103L12.3419 6.51016C12.4874 6.80501 12.7686 7.00947 13.094 7.05702L16.3289 7.52985C17.1488 7.6497 17.4756 8.65754 16.882 9.2357L14.5428 11.5141C14.3069 11.7438 14.1993 12.075 14.2549 12.3995L14.8068 15.617C14.9469 16.434 14.0893 17.057 13.3557 16.6712L10.4648 15.1508C10.1734 14.9976 9.82528 14.9976 9.5339 15.1508L6.64298 16.6712C5.90935 17.057 5.0518 16.434 5.19192 15.617L5.74377 12.3995C5.79943 12.075 5.69177 11.7438 5.45589 11.5141L3.1167 9.2357C2.5231 8.65754 2.84988 7.6497 3.6698 7.52985L6.90472 7.05702C7.23007 7.00947 7.51125 6.80501 7.65679 6.51016L9.10264 3.58103Z"
        stroke="#FFB800"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
      />
    </svg>
  )
}

const MsgIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M17 3.59741H7C4 3.59741 2 5.09741 2 8.59741V15.5974C2 19.0974 4 20.5974 7 20.5974H17C20 20.5974 22 19.0974 22 15.5974V8.59741C22 5.09741 20 3.59741 17 3.59741ZM17.47 9.68741L14.34 12.1874C13.68 12.7174 12.84 12.9774 12 12.9774C11.16 12.9774 10.31 12.7174 9.66 12.1874L6.53 9.68741C6.21 9.42741 6.16 8.94741 6.41 8.62741C6.67 8.30741 7.14 8.24741 7.46 8.50741L10.59 11.0074C11.35 11.6174 12.64 11.6174 13.4 11.0074L16.53 8.50741C16.85 8.24741 17.33 8.29741 17.58 8.62741C17.84 8.94741 17.79 9.42741 17.47 9.68741Z"
        fill="currentColor"
      />
    </svg>
  )
}

const PhoneIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M11.05 15.0474L9.2 16.8974C8.81 17.2874 8.19 17.2874 7.79 16.9074C7.68 16.7974 7.57 16.6974 7.46 16.5874C6.43 15.5474 5.5 14.4574 4.67 13.3174C3.85 12.1774 3.19 11.0374 2.71 9.90741C2.24 8.76741 2 7.67741 2 6.63741C2 5.95741 2.12 5.30741 2.36 4.70741C2.6 4.09741 2.98 3.53741 3.51 3.03741C4.15 2.40741 4.85 2.09741 5.59 2.09741C5.87 2.09741 6.15 2.15741 6.4 2.27741C6.66 2.39741 6.89 2.57741 7.07 2.83741L9.39 6.10741C9.57 6.35741 9.7 6.58741 9.79 6.80741C9.88 7.01741 9.93 7.22741 9.93 7.41741C9.93 7.65741 9.86 7.89741 9.72 8.12741C9.59 8.35741 9.4 8.59741 9.16 8.83741L8.4 9.62741C8.29 9.73741 8.24 9.86741 8.24 10.0274C8.24 10.1074 8.25 10.1774 8.27 10.2574C8.3 10.3374 8.33 10.3974 8.35 10.4574C8.53 10.7874 8.84 11.2174 9.28 11.7374C9.73 12.2574 10.21 12.7874 10.73 13.3174C10.83 13.4174 10.94 13.5174 11.04 13.6174C11.44 14.0074 11.45 14.6474 11.05 15.0474Z"
        fill="currentColor"
      />
      <path
        d="M21.9696 18.4275C21.9696 18.7075 21.9196 18.9975 21.8196 19.2775C21.7896 19.3575 21.7596 19.4375 21.7196 19.5175C21.5496 19.8775 21.3296 20.2175 21.0396 20.5375C20.5496 21.0775 20.0096 21.4675 19.3996 21.7175C19.3896 21.7175 19.3796 21.7275 19.3696 21.7275C18.7796 21.9675 18.1396 22.0975 17.4496 22.0975C16.4296 22.0975 15.3396 21.8575 14.1896 21.3675C13.0396 20.8775 11.8896 20.2175 10.7496 19.3875C10.3596 19.0975 9.96961 18.8075 9.59961 18.4975L12.8696 15.2275C13.1496 15.4375 13.3996 15.5975 13.6096 15.7075C13.6596 15.7275 13.7196 15.7575 13.7896 15.7875C13.8696 15.8175 13.9496 15.8275 14.0396 15.8275C14.2096 15.8275 14.3396 15.7675 14.4496 15.6575L15.2096 14.9075C15.4596 14.6575 15.6996 14.4675 15.9296 14.3475C16.1596 14.2075 16.3896 14.1375 16.6396 14.1375C16.8296 14.1375 17.0296 14.1775 17.2496 14.2675C17.4696 14.3575 17.6996 14.4875 17.9496 14.6575L21.2596 17.0075C21.5196 17.1875 21.6996 17.3975 21.8096 17.6475C21.9096 17.8975 21.9696 18.1475 21.9696 18.4275Z"
        fill="currentColor"
      />
    </svg>
  )
}
const HomeIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  )
}

const ProjectsIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  )
}

const ServicesIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  )
}

const BlogIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M19 12H5M12 19V5"></path>
    </svg>
  )
}

const ContactIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M22 16.92v3.08a2 2 0 0 1-2 2A15.09 15.09 0 0 1 3 3a2 2 0 0 1 2-2h3.08L12 6.92A12.09 12.09 0 0 0 22 16.92z"></path>
    </svg>
  )
}

export {
  ArrowLeftIcon,
  ArrowRightIcon,
  BurgerIcon,
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  Codepen,
  Earning,
  Facebook,
  GithubIcon,
  Instagram,
  JavaScriptIcon,
  Likes,
  LinkedIn,
  MsgIcon,
  NextjsIcon,
  NodejsIcon,
  PhoneIcon,
  PreviewIcon,
  ReactIcon,
  Star,
  StarIcon,
  FlutterIcon,
  FirebaseIcon,
  TailwindCSS,
  Timer,
  TypescriptIcon,
  X,
  HomeIcon,
  ProjectsIcon,
  ServicesIcon,
  BlogIcon,
  ContactIcon,
}
