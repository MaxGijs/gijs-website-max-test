import Image from "next/image";

export default function MeasureImage({ image, name, priority = false }: { image?: string; name: string; priority?: boolean }) {
  if (image) return <Image src={image} alt={name} width={800} height={560} sizes="(max-width: 767px) 100vw, 50vw" priority={priority} />;
  return <div aria-label={"Illustratie "+name} role="img" className="flex h-full min-h-40 items-center justify-center bg-[#e7f1ea]">
    <svg viewBox="0 0 160 120" width="160" height="120" fill="none" stroke="#276d53" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "Thuisbatterij" ? <><rect x="36" y="20" width="88" height="82" rx="12"/><path d="M65 20V12h30v8M87 39 69 63h24L76 87"/></> : <><path d="M22 98h116M30 80h100M30 35h85a10 10 0 0 1 0 20H45a10 10 0 0 0 0 20h85M40 22v-9m40 9v-9m40 9v-9"/></>}
    </svg>
  </div>;
}
