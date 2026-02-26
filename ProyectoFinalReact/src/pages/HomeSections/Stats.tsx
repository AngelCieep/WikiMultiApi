import {stats} from "../../data/features.ts";
import StatItem from "../../components/StatItem.tsx";

export default function Stats() {
    return (
        <>
            <h2 className="text-center my-3">Nuestras Estadísticas</h2>
        <section className="stats d-flex justify-content-around align-items-center p-5">
            {stats.map((stat, index) => (
                <StatItem key={index} {...stat} />
            ))}
        </section>
        </>
    );
}