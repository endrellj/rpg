interface IconProps {
  className?: string;
  size?: number;
}

export const DiceIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="3" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="16" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="16" r="1.5" fill="currentColor" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const DaggerIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4L20 9.5L10 19.5L4 20L4.5 14L14.5 4Z" />
    <path d="M14.5 4L20 9.5" />
    <path d="M4 20L10 19.5" />
    <line x1="6" y1="17" x2="8" y2="15" />
  </svg>
);

export const SwordIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 17.5L3 6V3H6L17.5 14.5" />
    <path d="M13 19L19 13" />
    <path d="M16 16L20 20" />
    <path d="M19 21L21 19" />
  </svg>
);

export const MacheteIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20L8 16" />
    <path d="M8 16C8 16 10 14 14 10C18 6 20 4 20 4C20 4 18 6 14 10C10 14 8 16 8 16Z" />
    <path d="M4 20C4 20 2 18 2 16C2 14 4 14 4 14" />
    <circle cx="6" cy="18" r="1" />
  </svg>
);

export const JournalIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" />
    <path d="M4 6H20" />
    <path d="M8 10H16" />
    <path d="M8 14H14" />
  </svg>
);

export const ScrollIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H8" />
    <path d="M8 21C6.89543 21 6 20.1046 6 19C6 17.8954 6.89543 17 8 17H18" />
    <path d="M4 3C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17" />
    <path d="M4 7H6" />
    <path d="M4 11H6" />
    <path d="M4 15H6" />
  </svg>
);

export const TargetIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const SkullIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="8" />
    <path d="M12 18V22" />
    <path d="M8 22H16" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
    <path d="M10 14L12 16L14 14" />
    <path d="M9 14V18" />
    <path d="M15 14V18" />
  </svg>
);

export const CoinIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6V18" />
    <path d="M15 9.5C15 8.12 13.66 7 12 7C10.34 7 9 8.12 9 9.5C9 10.88 10.34 12 12 12C13.66 12 15 13.12 15 14.5C15 15.88 13.66 17 12 17C10.34 17 9 15.88 9 14.5" />
  </svg>
);

export const TriangleIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L22 20H2L12 2Z" />
  </svg>
);

export const DiamondIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </svg>
);

export const PentagonIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L21 9L18 21H6L3 9L12 2Z" />
  </svg>
);

export const HexagonIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" />
  </svg>
);

export const LightningIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
  </svg>
);

export const FeatherIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24C19.24 13.24 17.24 14 15 14C9 14 4 9 4 3L12 11L20 3C20.24 5.24 20.24 9.24 20.24 12.24Z" />
    <path d="M12 11L4 3" />
    <path d="M8 8L16 16" />
  </svg>
);

export const QuestionIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 13 12H11C9.34 12 8 10.66 8 9V8" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

export const HeartIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61C20.3292 4.09924 19.7228 3.69398 19.0554 3.41708C18.3879 3.14019 17.6725 2.99756 16.95 2.99756C16.2275 2.99756 15.5121 3.14019 14.8446 3.41708C14.1772 3.69398 13.5708 4.09924 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99805 7.05 2.99805C5.59096 2.99805 4.19169 3.57831 3.16 4.61C2.1283 5.6417 1.54805 7.04097 1.54805 8.5C1.54805 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3508 11.8792 21.756 11.2728 22.0329 10.6054C22.3098 9.93791 22.4524 9.22249 22.4524 8.5C22.4524 7.77751 22.3098 7.0621 22.0329 6.39464C21.756 5.72718 21.3508 5.12075 20.84 4.61Z" />
  </svg>
);

export const EyeIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const SunIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const MoonIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88301 19.5345 5.67316 18.3247C4.46332 17.1148 3.62375 15.5868 3.25173 13.9183C2.87972 12.2498 2.99053 10.5099 3.57128 8.90215C4.15203 7.29436 5.17869 5.88529 6.53108 4.83964C7.88347 3.794 9.50566 3.15517 11.2079 2.99756C11.4531 2.97727 11.6983 2.97727 11.9435 2.99756C8.77437 4.33217 6.67854 7.60062 7.22836 11.0558C7.77817 14.5109 10.9263 17.1319 14.44 17.24C15.4265 17.2681 16.3971 17.0406 17.2647 16.5792C18.1323 16.1178 18.8692 15.4379 19.41 14.6C19.7611 14.0523 20.0327 13.4558 20.2167 12.83C20.4007 12.2041 20.4952 11.5568 20.4971 10.906C20.499 10.2552 20.4083 9.60721 20.228 8.98012C20.0477 8.35302 19.7798 7.75403 19.4324 7.20312C18.3142 5.36852 16.4722 4.11795 14.3827 3.7632C12.2932 3.40845 10.1711 3.98614 8.58521 5.33787C7.57061 6.21034 6.82624 7.33534 6.43758 8.58408C6.04892 9.83281 6.03175 11.1547 6.38782 12.4029C6.74389 13.6511 7.45819 14.7751 8.44795 15.6423C9.43772 16.5094 10.6609 17.0832 11.9707 17.2946C10.5929 17.7195 9.45398 18.7121 8.83936 19.9933C8.22475 21.2745 8.18989 22.7373 8.74187 24.04" />
  </svg>
);

export const HerbIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12" />
    <path d="M12 12C12 8 8 4 4 4C4 8 8 12 12 12Z" />
    <path d="M12 12C12 8 16 4 20 4C20 8 16 12 12 12Z" />
    <path d="M12 8C12 4 8 2 4 2C4 6 8 8 12 8Z" />
    <path d="M12 8C12 4 16 2 20 2C20 6 16 8 12 8Z" />
  </svg>
);

export const BoneIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 5.5C4 4 3 4 3 4C3 4 4 3 5.5 4.5L7 6" />
    <path d="M18.5 4.5C20 3 21 3 21 3C21 3 20 4 18.5 5.5L17 7" />
    <path d="M17 7L7 17" />
    <path d="M5.5 18.5C4 20 3 20 3 20C3 20 4 21 5.5 19.5L7 18" />
    <path d="M18.5 19.5C20 18 21 18 21 18C21 18 20 19 18.5 20.5L17 22" />
    <path d="M7 17L17 7" />
  </svg>
);

export const CrossedSwordsIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 17.5L3 6V3H6L17.5 14.5" />
    <path d="M13 19L19 13" />
    <path d="M16 16L20 20" />
    <path d="M19 21L21 19" />
    <path d="M9.5 17.5L21 6V3H18L6.5 14.5" />
    <path d="M11 19L5 13" />
    <path d="M8 16L4 20" />
    <path d="M5 21L3 19" />
  </svg>
);

export const RopeIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6C4 6 6 4 8 6C10 8 12 6 14 8C16 10 18 8 20 10" />
    <path d="M4 12C4 12 6 10 8 12C10 14 12 12 14 14C16 16 18 14 20 16" />
    <path d="M4 18C4 18 6 16 8 18C10 20 12 18 14 20C16 22 18 20 20 22" />
  </svg>
);

export const XIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const PlusIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const EditIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" />
    <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" />
  </svg>
);

export const Feather = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24C20.3292 13.4922 19.9039 14.1144 19.1582 15.4668C18.1126 16.8192 17.7035 17.8458 16.0957 18.4265C14.4879 19.0073 12.748 19.1181 11.0795 18.7461C9.41104 18.3741 7.88301 17.5345 6.67316 16.3247C5.46332 15.1148 4.62375 13.5868 4.25173 11.9183C3.87972 10.2498 3.99053 8.5099 4.57128 6.90215C5.15203 5.29436 6.17869 3.88529 7.53108 2.83964C8.88347 1.794 9.50566 1.15517 11.2079 0.997559C12.4531 1.97727 12.6983 2.97727 12.9435 3.99756C8.77437 5.33217 5.67854 8.60062 6.22836 11.0558C6.77817 13.5109 9.92626 15.1319 13.44 15.24C14.4265 15.2681 15.3971 15.0406 16.2647 14.5792C17.1323 14.1178 17.8692 13.4379 18.41 12.6C18.7611 12.0523 19.0327 11.4558 19.2167 10.83C19.4007 10.2041 19.4952 9.55681 19.4971 8.90601C19.499 8.25521 19.4083 7.60721 19.228 6.98012C19.0477 6.35302 18.7798 5.75403 18.4324 5.20312C17.3142 3.36852 15.4722 2.11795 13.3827 1.7632C11.2932 1.40845 9.17103 1.98614 7.58521 3.33787C6.57061 4.21034 5.82624 5.33534 5.43758 6.58408C5.04892 7.83281 5.03175 9.15472 5.38782 10.4029C5.74389 11.6511 6.45819 12.7751 7.44795 13.6423C8.43772 14.5094 9.66087 15.0832 10.9707 15.2946C10.5929 15.7195 9.45398 16.7121 8.83936 17.9933C8.22475 19.2745 8.18989 20.7373 8.74187 21.04" />
  </svg>
);

export const ShieldIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const SparklesIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export const BookOpenIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
