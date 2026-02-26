import {features} from "../../data/features.ts";
import FeaturesItem from "../../components/FeaturesItem.tsx";

export default function Features() {
    return (
        <section className="mt-4 mb-4 p-5 bg-light rounded-3 shadow">
            <h1 className=" display-3 text-center mb-4">Características Destacadas</h1>
            <div className="d-flex justify-content-between flex-wrap">
                {
                    features.map(feature => (
                        <FeaturesItem {...feature}/>
                    ))
                }
            </div>
        </section>
    )
}