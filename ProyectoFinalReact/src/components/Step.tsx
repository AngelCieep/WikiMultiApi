type StepProps ={
    title: string;
    text: string;
}
export default function Step({ title, text }: StepProps) {
    return (
        <div>
            <strong>{title}</strong>
            <p>{text}</p>
        </div>
    );
}