type FooterColumnProps = {
    title: string;
    links: string[];
}
export default function FooterColumn({ title, links }:FooterColumnProps) {
    return (
        <div>
            <h4 className="text-white">{title}</h4>
            <ul className="list-group list-group-flush">
                {links.map((link, index) => (
                    <li className="list-group-item text-secondary" key={index}>{link}</li>
                ))}
            </ul>
        </div>
    );
}

type NavColumnProps = {
    name: string;
    url: string;
}
export function NavColumn({ name, url }:NavColumnProps) {
    return (
        <div className="mx-3 ">
            <a className="nav-item link-success" href={url}>{name}</a>
        </div>
    );
}