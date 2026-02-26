import { NavLinks } from "../data/links.ts";
import {NavColumn} from "../components/FooterColumns.tsx";

export default function Navbar() {
    return (
        <nav aria-label="main navigation">
            <div className="container-fluid d-flex justify-content-between align-items-center mb-3">
                <a className="navbar-brand" href="#">
                    LOGO
                </a>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    {NavLinks.map((column, index) => (
                        <NavColumn key={index} {...column} />
                    ))}
                </div>
            </div>
            <hr className="featurette-divider mb-4"/>
        </nav>

    );
}