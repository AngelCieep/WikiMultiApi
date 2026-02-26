type PeliculaCardProps = {
    title: string;
    price: number;
    image: string;
}

export default function PeliculaCard({ title, price, image }: PeliculaCardProps) {
    return (
        <div className="card" style={{ width: "18rem" }}>
            <img src={image} className="card-img-top" alt={title} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">Precio: ${price.toFixed(2)}</p>
                <a href="#" className="btn btn-primary">Comprar</a>
            </div>
        </div>
    );
}
