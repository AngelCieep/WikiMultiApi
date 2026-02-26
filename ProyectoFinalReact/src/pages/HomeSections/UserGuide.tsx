import {steps} from "../../data/features.ts";
import Step from "../../components/Step.tsx";

export default function UserGuide() {
    return (
        <section>
            <h2>User guide for first timer</h2>

            {steps.map((step, index) => (
                <Step key={index} {...step} />
            ))}
        </section>
    );
}