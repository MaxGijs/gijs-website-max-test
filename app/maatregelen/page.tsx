import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MeasureExplorer from "@/components/MeasureExplorer";
import { pageMetadata } from "@/lib/seo";
export const metadata=pageMetadata("/maatregelen");
export default function Maatregelen(){return <><Header/><main><MeasureExplorer/></main><Footer/></>;}
