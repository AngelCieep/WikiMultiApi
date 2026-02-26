export default function Hero() {
    return(
        <section className="d-flex mb-5">
            <div className="w-50 d-flex justify-content-center align-items-center flex-column">
                <h1 className="">Bienvenido a Mundo Cine</h1>
                <p className="">Descubre los últimos éxitos en taquilla</p>
                <button className="buttonBuy">Comprar Tickets</button>
            </div>
            <div className="w-50 d-flex justify-content-center align-items-center">
                <img className="w-75 rounded-5" src="https://www.out.com/media-library/image.jpg?id=61731050&width=800&quality=65" alt="Hero Image" />
            </div>
        </section>
    )
}