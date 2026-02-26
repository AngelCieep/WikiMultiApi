import {cartelera} from "../../data/cartelera.ts";
import PeliculaCard from "../../components/PeliculaCard.tsx";

export default function Cartelera() {
    return (
        <div className="mt-5 mb-5">
            <h2 className="display-2 text-center my-4"> Cartelera</h2>
            <section className="d-flex flex-wrap justify-content-center gap-5 my-4">
                {
                    cartelera.map(cartelera => (
                        <PeliculaCard title={cartelera.title}
                                      price={cartelera.price}
                                      image={cartelera.image}
                                      key={cartelera.id}
                        />
                    ))
                }
            </section>
        </div>

    )
}