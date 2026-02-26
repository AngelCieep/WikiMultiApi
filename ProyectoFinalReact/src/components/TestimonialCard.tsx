type TestimonialPrps = {
    name: string;
    text: string;
    stars:number;
    photoUser: string;
}
export default function TestimonialCard({ name, text, stars, photoUser }: TestimonialPrps) {
    return (
        <article className="card bg-light-subtle text-dark p-4 m-3 rounded-3 border-0 shadow" style={{ width: '40%' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
                <img
                    className="rounded-circle bg-gradient bg-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 56, height: 56 }}
                    src={photoUser}
                    alt="{name}">

                </img>
                <div>
                    <h5 className="mb-0 fw-600 text-dark">{name}</h5>
                    <small className="text-primary">Cliente verificado</small>
                </div>
            </div>
            <p className="card-text fst-italic text-dark mb-3 lh-lg">{text}</p>
            <div className="d-flex justify-content-between align-items-center">
                <div aria-label="Calificación">
                    {[...Array(stars)].map((_, i) => (
                        <span key={i} className="text-warning me-1">★</span>
                    ))}
                </div>
                <button className="btn btn-outline-light btn-sm rounded-2">Leer más</button>
            </div>
        </article>
    );
}