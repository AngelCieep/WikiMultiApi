type BlogProps = {
    title: string;
    price: string;
}
export default function BlogCard({ title, price }:BlogProps) {
    return (
        <article className="card w-50 align-items-center p-3">
            <h4>{title}</h4>
            <p>{price}</p>
            <button className="btn btn-info w-50">Read</button>
        </article>
    );
}