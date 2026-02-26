import { footerLinks } from "../data/links.ts";
import FooterColumn from "../components/FooterColumns.tsx";

export default function Footer() {
    return (
        <div className="container-fluid m-0 bg-dark rounded-bottom-2 p-4">

        <footer className=" d-flex justify-content-between  text-white ">
            {footerLinks.map((column, index) => (
                <FooterColumn key={index} {...column} />
            ))}
        </footer>
            <p className="text-white">CopyrightDAW © 2026. Todos los derechos Reservados.</p>
        </div>
    );
}